-- 1. Créer le nouvel enum cell_type avec les nouveaux types
DROP TYPE IF EXISTS cell_type CASCADE;
CREATE TYPE cell_type AS ENUM ('start', 'end', 'audio_interaction', 'interaction', 'obstacle');

-- 2. Recreer la colonne cell_type dans game_cells avec le nouvel enum
ALTER TABLE game_cells DROP COLUMN IF EXISTS cell_type;
ALTER TABLE game_cells ADD COLUMN cell_type cell_type NOT NULL DEFAULT 'interaction';

-- 3. Ajouter la colonne health aux jeux
ALTER TABLE games ADD COLUMN IF NOT EXISTS health INTEGER NOT NULL DEFAULT 3;
ALTER TABLE saved_games ADD COLUMN IF NOT EXISTS health INTEGER NOT NULL DEFAULT 3;

-- 4. Ajouter contrainte d'unicité pour les noms d'élèves dans une classe
DO $$ 
BEGIN
    ALTER TABLE students ADD CONSTRAINT unique_student_name_per_class UNIQUE (class_id, full_name);
EXCEPTION
    WHEN duplicate_table THEN 
        -- La contrainte existe déjà, on l'ignore
        NULL;
END $$;

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
  
  -- Interaction et obstacle doivent avoir une image (sauf s'ils sont vides au moment de la création)
  IF NEW.cell_type IN ('interaction', 'obstacle') AND NEW.image_url IS NOT NULL THEN
    -- Validation OK si image présente
    NULL;
  END IF;
  
  -- Audio_interaction doit avoir de l'audio si défini
  IF NEW.cell_type = 'audio_interaction' AND NEW.audio_url IS NOT NULL THEN
    -- Validation OK si audio présent
    NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Créer les triggers pour validation
DROP TRIGGER IF EXISTS validate_game_cells_trigger ON game_cells;
CREATE TRIGGER validate_game_cells_trigger
  BEFORE INSERT OR UPDATE ON game_cells
  FOR EACH ROW EXECUTE FUNCTION validate_cell_constraints();

-- 7. Ajouter table pour tracking des tentatives avec health
CREATE TABLE IF NOT EXISTS game_attempts (
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
USING (TRUE);

CREATE POLICY "System can manage attempts" 
ON game_attempts FOR ALL 
USING (TRUE);

-- 10. Fonction pour authentification sécurisée des étudiants
CREATE OR REPLACE FUNCTION authenticate_student(student_code TEXT)
RETURNS TABLE(student_id UUID, class_id UUID, student_name TEXT, class_name TEXT) 
SECURITY DEFINER
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