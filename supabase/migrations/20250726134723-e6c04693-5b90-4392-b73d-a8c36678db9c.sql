-- Fix remaining database function security warnings

-- Fix search path for remaining functions
CREATE OR REPLACE FUNCTION public.generate_student_code()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    new_code TEXT;
BEGIN
    LOOP
        new_code := generate_unique_code('STU-', 8);
        EXIT WHEN NOT EXISTS (SELECT 1 FROM students WHERE student_code = new_code);
    END LOOP;
    RETURN new_code;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_class_code()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    new_code TEXT;
BEGIN
    LOOP
        new_code := generate_unique_code('CLS-', 6);
        EXIT WHEN NOT EXISTS (SELECT 1 FROM classes WHERE class_code = new_code);
    END LOOP;
    RETURN new_code;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_unique_code(prefix text, length integer DEFAULT 6)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := prefix;
    i INTEGER := 0;
BEGIN
    FOR i IN 1..length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'parent')
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_game_performance(days_param integer)
 RETURNS TABLE(game_id uuid, game_name text, total_plays bigint, success_rate numeric, avg_moves numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    g.id as game_id,
    g.name as game_name,
    COUNT(gs.id)::bigint as total_plays,
    ROUND(AVG(CASE WHEN gs.is_successful THEN 1.0 ELSE 0.0 END) * 100, 1) as success_rate,
    ROUND(AVG(gs.moves_used), 1) as avg_moves
  FROM 
    games g
    LEFT JOIN game_sessions gs ON g.id = gs.game_id
  WHERE 
    gs.started_at >= (CURRENT_DATE - days_param * INTERVAL '1 day')
  GROUP BY 
    g.id, g.name;
END;
$function$;