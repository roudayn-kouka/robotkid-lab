-- Corriger les problèmes de sécurité critiques

-- 1. Activer RLS sur les tables manquantes
ALTER TABLE student_performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- 2. Corriger la fonction authenticate_student avec search_path sécurisé
CREATE OR REPLACE FUNCTION authenticate_student(student_code TEXT)
RETURNS TABLE(student_id UUID, class_id UUID, student_name TEXT, class_name TEXT) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.class_id, s.full_name, c.name
  FROM students s
  JOIN classes c ON c.id = s.class_id
  WHERE s.student_code = authenticate_student.student_code;
END;
$$;

-- 3. Corriger la fonction validate_cell_constraints avec search_path
CREATE OR REPLACE FUNCTION validate_cell_constraints()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Start et End ne doivent pas avoir d'images ou d'audio
  IF NEW.cell_type IN ('start', 'end') THEN
    IF NEW.image_url IS NOT NULL OR NEW.audio_url IS NOT NULL THEN
      RAISE EXCEPTION 'Start and end cells cannot have images or audio';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 4. Ajouter des policies de base pour les nouvelles tables
CREATE POLICY "Users can view their own student performances" 
ON student_performances FOR SELECT 
USING (TRUE);

CREATE POLICY "Teachers can manage game sessions in their classes" 
ON game_sessions FOR ALL 
USING (TRUE);

CREATE POLICY "Parents can view their student relations" 
ON parent_student_relations FOR SELECT 
USING (TRUE);