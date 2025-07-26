-- Critical Security Fixes Migration

-- 1. Enable RLS on student_game_log table (CRITICAL)
ALTER TABLE public.student_game_log ENABLE ROW LEVEL SECURITY;

-- 2. Create proper RLS policy for student_game_log - only teachers and admins can access
CREATE POLICY "Teachers and admins can access student game logs" 
ON public.student_game_log 
FOR ALL 
USING (
  get_current_user_role() = 'admin' OR 
  get_current_user_role() = 'teacher'
);

-- 3. Fix overly permissive policy on game_attempts
DROP POLICY IF EXISTS "Students can view their own attempts" ON public.game_attempts;
DROP POLICY IF EXISTS "System can manage attempts" ON public.game_attempts;

CREATE POLICY "Students can view their own attempts" 
ON public.game_attempts 
FOR SELECT 
USING (
  student_id IN (
    SELECT s.id FROM students s 
    JOIN classes c ON c.id = s.class_id 
    WHERE s.student_code = auth.jwt() ->> 'student_code'
  )
);

CREATE POLICY "Teachers can manage attempts for their students" 
ON public.game_attempts 
FOR ALL 
USING (
  get_current_user_role() = 'teacher' AND
  student_id IN (
    SELECT s.id FROM students s 
    JOIN classes c ON c.id = s.class_id 
    WHERE c.teacher_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all attempts" 
ON public.game_attempts 
FOR ALL 
USING (get_current_user_role() = 'admin');

-- 4. Fix overly permissive policy on game_sessions
DROP POLICY IF EXISTS "Teachers can manage game sessions in their classes" ON public.game_sessions;

CREATE POLICY "Teachers can manage sessions for their students" 
ON public.game_sessions 
FOR ALL 
USING (
  get_current_user_role() = 'teacher' AND
  student_id IN (
    SELECT s.id FROM students s 
    JOIN classes c ON c.id = s.class_id 
    WHERE c.teacher_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all game sessions" 
ON public.game_sessions 
FOR ALL 
USING (get_current_user_role() = 'admin');

-- 5. Fix overly permissive policy on parent_student_relations
DROP POLICY IF EXISTS "Parents can view their student relations" ON public.parent_student_relations;

CREATE POLICY "Parents can view their own student relations" 
ON public.parent_student_relations 
FOR SELECT 
USING (parent_id = auth.uid() AND get_current_user_role() = 'parent');

CREATE POLICY "Admins can manage all parent-student relations" 
ON public.parent_student_relations 
FOR ALL 
USING (get_current_user_role() = 'admin');

-- 6. Fix overly permissive policy on student_performances
DROP POLICY IF EXISTS "Users can view their own student performances" ON public.student_performances;

CREATE POLICY "Teachers can view performances for their students" 
ON public.student_performances 
FOR SELECT 
USING (
  get_current_user_role() = 'teacher' AND
  student_id IN (
    SELECT s.id FROM students s 
    JOIN classes c ON c.id = s.class_id 
    WHERE c.teacher_id = auth.uid()
  )
);

CREATE POLICY "Parents can view their children's performances" 
ON public.student_performances 
FOR SELECT 
USING (
  get_current_user_role() = 'parent' AND
  student_id IN (
    SELECT psr.student_id FROM parent_student_relations psr 
    WHERE psr.parent_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all student performances" 
ON public.student_performances 
FOR ALL 
USING (get_current_user_role() = 'admin');

-- 7. Harden database functions with proper search path protection
CREATE OR REPLACE FUNCTION public.authenticate_student(student_code text)
 RETURNS TABLE(student_id uuid, class_id uuid, student_name text, class_name text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT s.id, s.class_id, s.full_name, c.name
  FROM students s
  JOIN classes c ON c.id = s.class_id
  WHERE s.student_code = authenticate_student.student_code;
END;
$function$;

CREATE OR REPLACE FUNCTION public.save_complete_game(game_name text, game_description text, max_moves_count integer, grid_rows integer, grid_cols integer, grid_cells jsonb, info_cells jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    new_game_id UUID;
    cell_data JSONB;
    info_data JSONB;
BEGIN
    -- Validate input parameters
    IF game_name IS NULL OR length(trim(game_name)) = 0 THEN
        RAISE EXCEPTION 'Game name cannot be empty';
    END IF;
    
    IF max_moves_count <= 0 THEN
        RAISE EXCEPTION 'Max moves must be greater than 0';
    END IF;
    
    IF grid_rows <= 0 OR grid_cols <= 0 THEN
        RAISE EXCEPTION 'Grid dimensions must be greater than 0';
    END IF;
    
    -- Créer le jeu
    INSERT INTO public.saved_games (name, description, max_moves, grid_rows, grid_columns, creator_id, is_published)
    VALUES (game_name, game_description, max_moves_count, grid_rows, grid_cols, auth.uid(), false)
    RETURNING id INTO new_game_id;
    
    -- Insérer les cellules de la grille
    IF grid_cells IS NOT NULL THEN
        FOR cell_data IN SELECT * FROM jsonb_array_elements(grid_cells)
        LOOP
            INSERT INTO public.saved_game_cells (
                game_id, x, y, cell_type, content, image_url, audio_url, path_order
            ) VALUES (
                new_game_id,
                (cell_data->>'x')::INTEGER,
                (cell_data->>'y')::INTEGER,
                cell_data->>'cellType',
                cell_data->>'content',
                cell_data->>'imageUrl',
                cell_data->>'audioUrl',
                COALESCE((cell_data->>'pathOrder')::INTEGER, -1)
            );
        END LOOP;
    END IF;
    
    -- Insérer les cellules informatives
    IF info_cells IS NOT NULL THEN
        FOR info_data IN SELECT * FROM jsonb_array_elements(info_cells)
        LOOP
            INSERT INTO public.saved_informative_cells (
                game_id, cell_id, content, image_url, audio_url
            ) VALUES (
                new_game_id,
                info_data->>'id',
                info_data->>'content',
                info_data->>'imageUrl',
                info_data->>'audioUrl'
            );
        END LOOP;
    END IF;
    
    RETURN new_game_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_new_game(game_name text, max_moves integer, circuit_cells integer, info_cells integer, rows integer, cols integer)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_game_id UUID;
BEGIN
  -- Validate input parameters
  IF game_name IS NULL OR length(trim(game_name)) = 0 THEN
      RAISE EXCEPTION 'Game name cannot be empty';
  END IF;
  
  IF max_moves <= 0 THEN
      RAISE EXCEPTION 'Max moves must be greater than 0';
  END IF;
  
  INSERT INTO games (creator_id, name, max_moves, rows, columns)
  VALUES (auth.uid(), game_name, max_moves, rows, cols)
  RETURNING id INTO new_game_id;
  
  RETURN new_game_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.record_game_session(game_id uuid, is_success boolean, move_count integer, session_duration interval)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Validate input parameters
  IF game_id IS NULL THEN
      RAISE EXCEPTION 'Game ID cannot be null';
  END IF;
  
  IF move_count < 0 THEN
      RAISE EXCEPTION 'Move count cannot be negative';
  END IF;
  
  INSERT INTO game_sessions (game_id, student_id, moves_used, is_successful, completion_time, started_at, completed_at)
  VALUES (game_id, auth.uid(), move_count, is_success, session_duration, NOW() - session_duration, NOW());
END;
$function$;

-- 8. Add role validation function to prevent escalation
CREATE OR REPLACE FUNCTION public.validate_role_assignment(target_user_id uuid, new_role app_role)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    current_user_role app_role;
BEGIN
    -- Get current user's role
    SELECT role INTO current_user_role FROM profiles WHERE id = auth.uid();
    
    -- Only admins can assign roles
    IF current_user_role != 'admin' THEN
        RETURN false;
    END IF;
    
    -- Admins cannot change their own role (prevent lockout)
    IF target_user_id = auth.uid() THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$function$;