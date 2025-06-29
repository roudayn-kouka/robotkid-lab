
-- Créer le type cell_type s'il n'existe pas
DO $$ BEGIN
  CREATE TYPE public.cell_type AS ENUM ('start', 'end', 'obstacle', 'circuit', 'informative');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Table des profils utilisateurs (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'parent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des codes administrateur
CREATE TABLE IF NOT EXISTS public.admin_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des établissements
CREATE TABLE IF NOT EXISTS public.establishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des classes
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID REFERENCES public.establishments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  class_code TEXT NOT NULL UNIQUE,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des élèves
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table de liaison parents-enfants
CREATE TABLE IF NOT EXISTS public.parent_student_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

-- Table des jeux (mettre à jour la table existante)
DO $$
BEGIN
  -- Vérifier si la table games existe déjà
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'games' AND table_schema = 'public') THEN
    -- Ajouter les colonnes manquantes si elles n'existent pas
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'games' AND column_name = 'creator_id' AND table_schema = 'public') THEN
      ALTER TABLE public.games ADD COLUMN creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'games' AND column_name = 'description' AND table_schema = 'public') THEN
      ALTER TABLE public.games ADD COLUMN description TEXT;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'games' AND column_name = 'is_published' AND table_schema = 'public') THEN
      ALTER TABLE public.games ADD COLUMN is_published BOOLEAN DEFAULT false;
    END IF;
  ELSE
    -- Créer la table si elle n'existe pas
    CREATE TABLE public.games (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      rows INTEGER NOT NULL DEFAULT 5,
      columns INTEGER NOT NULL DEFAULT 5,
      max_moves INTEGER NOT NULL DEFAULT 10,
      is_published BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  END IF;
END $$;

-- Table des cellules de jeu
CREATE TABLE IF NOT EXISTS public.game_cells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
  row_index INTEGER NOT NULL,
  column_index INTEGER NOT NULL,
  cell_type cell_type NOT NULL,
  image_url TEXT,
  audio_url TEXT,
  content TEXT,
  is_obstacle BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(game_id, row_index, column_index)
);

-- Table des sessions de jeu (mettre à jour la table existante)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'game_sessions' AND table_schema = 'public') THEN
    -- Ajouter les colonnes manquantes
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'game_sessions' AND column_name = 'student_id' AND table_schema = 'public') THEN
      ALTER TABLE public.game_sessions ADD COLUMN student_id UUID REFERENCES public.students(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'game_sessions' AND column_name = 'moves_used' AND table_schema = 'public') THEN
      ALTER TABLE public.game_sessions ADD COLUMN moves_used INTEGER NOT NULL DEFAULT 0;
    END IF;
  ELSE
    CREATE TABLE public.game_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
      student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
      moves_used INTEGER NOT NULL,
      is_completed BOOLEAN DEFAULT false,
      is_successful BOOLEAN DEFAULT false,
      completion_time INTERVAL,
      started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      completed_at TIMESTAMP WITH TIME ZONE
    );
  END IF;
END $$;

-- Table des performances des élèves
CREATE TABLE IF NOT EXISTS public.student_performances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
  best_score INTEGER,
  total_attempts INTEGER DEFAULT 0,
  successful_attempts INTEGER DEFAULT 0,
  average_completion_time INTERVAL,
  last_played_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, game_id)
);

-- Insertion de codes admin par défaut (si ils n'existent pas)
INSERT INTO public.admin_codes (code) 
SELECT * FROM (VALUES ('ADMIN2024'), ('ROBOKIDZ2024'), ('EDUCATOR123')) AS v(code)
WHERE NOT EXISTS (SELECT 1 FROM public.admin_codes WHERE admin_codes.code = v.code);

-- Activation de RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_cells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_performances ENABLE ROW LEVEL SECURITY;

-- Fonction pour obtenir le rôle de l'utilisateur actuel
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Fonction pour gérer la création automatique du profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Supprimer le trigger existant s'il existe et le recréer
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Supprimer les politiques existantes et les recréer
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view admin codes" ON public.admin_codes;
DROP POLICY IF EXISTS "Admins can manage establishments" ON public.establishments;
DROP POLICY IF EXISTS "Teachers and parents can view establishments" ON public.establishments;
DROP POLICY IF EXISTS "Admins can manage all classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can view their classes" ON public.classes;
DROP POLICY IF EXISTS "Admins can manage games" ON public.games;
DROP POLICY IF EXISTS "Everyone can view published games" ON public.games;
DROP POLICY IF EXISTS "Users can view cells of accessible games" ON public.game_cells;
DROP POLICY IF EXISTS "Admins can manage game cells" ON public.game_cells;

-- Politiques RLS
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view admin codes" ON public.admin_codes
  FOR SELECT USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage establishments" ON public.establishments
  FOR ALL USING (get_current_user_role() = 'admin');

CREATE POLICY "Teachers and parents can view establishments" ON public.establishments
  FOR SELECT USING (get_current_user_role() IN ('teacher', 'parent'));

CREATE POLICY "Admins can manage all classes" ON public.classes
  FOR ALL USING (get_current_user_role() = 'admin');

CREATE POLICY "Teachers can view their classes" ON public.classes
  FOR SELECT USING (get_current_user_role() = 'teacher' AND teacher_id = auth.uid());

CREATE POLICY "Admins can manage games" ON public.games
  FOR ALL USING (get_current_user_role() = 'admin');

CREATE POLICY "Everyone can view published games" ON public.games
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view cells of accessible games" ON public.game_cells
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.games 
      WHERE id = game_id AND (is_published = true OR get_current_user_role() = 'admin')
    )
  );

CREATE POLICY "Admins can manage game cells" ON public.game_cells
  FOR ALL USING (get_current_user_role() = 'admin');
