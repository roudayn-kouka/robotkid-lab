-- 1. Modifier l'enum cell_type pour les nouveaux types
DROP TYPE IF EXISTS cell_type CASCADE;
CREATE TYPE cell_type AS ENUM ('start', 'end', 'audio_interaction', 'interaction', 'obstacle');

-- 2. Ajouter la colonne health aux jeux
ALTER TABLE games ADD COLUMN IF NOT EXISTS health INTEGER NOT NULL DEFAULT 3;
ALTER TABLE saved_games ADD COLUMN IF NOT EXISTS health INTEGER NOT NULL DEFAULT 3;

-- 3. Ajouter contrainte d'unicité pour les noms d'élèves dans une classe
ALTER TABLE students 
ADD CONSTRAINT unique_student_name_per_class 
UNIQUE (class_id, full_name);

-- 4. Modifier les cellules pour rendre image_url obligatoire sauf pour start/end
ALTER TABLE game_cells ALTER COLUMN cell_type TYPE cell_type USING cell_type::text::cell_type;
ALTER TABLE saved_game_cells ALTER COLUMN cell_type TYPE text;

-- 5. Ajouter des contraintes de validation
CREATE OR REPLACE FUNCTION validate_cell_constraints()
RETURNS TRIGGER AS $$
BEGIN
  -- Start et End ne doivent pas avoir d'images ou d'audio
  IF NEW.cell_type IN ('start', 'end') THEN
    IF NEW.image_url IS NOT NULL OR NEW.audio_url IS NOT NULL THEN
      RAISE EXCEPTION 'Start and end cells cannot have images or audio';
    END IF;
  END IF;
  
  -- Interaction et obstacle doivent avoir une image
  IF NEW.cell_type IN ('interaction', 'obstacle') THEN
    IF NEW.image_url IS NULL THEN
      RAISE EXCEPTION 'Interaction and obstacle cells must have an image';
    END IF;
  END IF;
  
  -- Audio_interaction ne peut pas être un obstacle et doit avoir de l'audio
  IF NEW.cell_type = 'audio_interaction' THEN
    IF NEW.audio_url IS NULL THEN
      RAISE EXCEPTION 'Audio interaction cells must have audio';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Créer les triggers pour validation
CREATE TRIGGER validate_game_cells_trigger
  BEFORE INSERT OR UPDATE ON game_cells
  FOR EACH ROW EXECUTE FUNCTION validate_cell_constraints();

CREATE TRIGGER validate_saved_game_cells_trigger
  BEFORE INSERT OR UPDATE ON saved_game_cells
  FOR EACH ROW EXECUTE FUNCTION validate_cell_constraints();

-- 7. Ajouter table pour tracking des tentatives avec health
CREATE TABLE game_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  attempts_remaining INTEGER NOT NULL,
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Enable RLS sur game_attempts
ALTER TABLE game_attempts ENABLE ROW LEVEL SECURITY;

-- 9. Policies pour game_attempts
CREATE POLICY "Students can view their own attempts" 
ON game_attempts FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM students 
  WHERE students.id = game_attempts.student_id 
  AND students.student_code = current_setting('app.student_code', true)
));

CREATE POLICY "System can insert attempts" 
ON game_attempts FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update attempts" 
ON game_attempts FOR UPDATE 
USING (true);

-- 10. Fonction pour authentification sécurisée
CREATE OR REPLACE FUNCTION authenticate_student(student_code TEXT)
RETURNS TABLE(student_id UUID, class_id UUID, student_name TEXT) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.class_id, s.full_name
  FROM students s
  WHERE s.student_code = authenticate_student.student_code;
END;
$$;