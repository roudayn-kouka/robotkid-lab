
-- Créer une fonction pour générer des codes uniques
CREATE OR REPLACE FUNCTION generate_unique_code(prefix TEXT, length INTEGER DEFAULT 6)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
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
$$;

-- Mettre à jour la table establishments pour supporter les utilisateurs
ALTER TABLE public.establishments ADD COLUMN IF NOT EXISTS user_count INTEGER DEFAULT 0;

-- Créer une fonction pour auto-générer les codes de classe
CREATE OR REPLACE FUNCTION generate_class_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    new_code TEXT;
BEGIN
    LOOP
        new_code := generate_unique_code('CLS-', 6);
        EXIT WHEN NOT EXISTS (SELECT 1 FROM classes WHERE class_code = new_code);
    END LOOP;
    RETURN new_code;
END;
$$;

-- Modifier la table classes pour auto-générer les codes
ALTER TABLE public.classes ALTER COLUMN class_code SET DEFAULT generate_class_code();

-- Créer une fonction pour auto-générer les codes d'élèves
CREATE OR REPLACE FUNCTION generate_student_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    new_code TEXT;
BEGIN
    LOOP
        new_code := generate_unique_code('STU-', 8);
        EXIT WHEN NOT EXISTS (SELECT 1 FROM students WHERE student_code = new_code);
    END LOOP;
    RETURN new_code;
END;
$$;

-- Modifier la table students pour auto-générer les codes
ALTER TABLE public.students ALTER COLUMN student_code SET DEFAULT generate_student_code();

-- Créer une table pour les données des jeux sauvegardés
CREATE TABLE IF NOT EXISTS public.saved_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    max_moves INTEGER NOT NULL DEFAULT 10,
    grid_rows INTEGER NOT NULL DEFAULT 5,
    grid_columns INTEGER NOT NULL DEFAULT 5,
    creator_id UUID REFERENCES public.profiles(id),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer une table pour les cellules des jeux sauvegardés
CREATE TABLE IF NOT EXISTS public.saved_game_cells (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES public.saved_games(id) ON DELETE CASCADE,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    cell_type TEXT NOT NULL, -- 'path', 'informative', 'start', 'end', 'obstacle'
    content TEXT,
    image_url TEXT,
    audio_url TEXT,
    path_order INTEGER DEFAULT -1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer une table pour les cellules informatives
CREATE TABLE IF NOT EXISTS public.saved_informative_cells (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES public.saved_games(id) ON DELETE CASCADE,
    cell_id TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ajouter RLS pour les jeux sauvegardés
ALTER TABLE public.saved_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_game_cells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_informative_cells ENABLE ROW LEVEL SECURITY;

-- Politiques pour saved_games
CREATE POLICY "Admins can manage saved_games" ON public.saved_games
    FOR ALL USING (get_current_user_role() = 'admin');

CREATE POLICY "Users can view published saved_games" ON public.saved_games
    FOR SELECT USING (is_published = true);

-- Politiques pour saved_game_cells
CREATE POLICY "Admins can manage saved_game_cells" ON public.saved_game_cells
    FOR ALL USING (get_current_user_role() = 'admin');

CREATE POLICY "Users can view cells of published games" ON public.saved_game_cells
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.saved_games 
            WHERE id = saved_game_cells.game_id 
            AND (is_published = true OR get_current_user_role() = 'admin')
        )
    );

-- Politiques pour saved_informative_cells
CREATE POLICY "Admins can manage saved_informative_cells" ON public.saved_informative_cells
    FOR ALL USING (get_current_user_role() = 'admin');

CREATE POLICY "Users can view informative cells of published games" ON public.saved_informative_cells
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.saved_games 
            WHERE id = saved_informative_cells.game_id 
            AND (is_published = true OR get_current_user_role() = 'admin')
        )
    );

-- Fonction pour créer un trigger de mise à jour
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour saved_games
CREATE TRIGGER update_saved_games_updated_at BEFORE UPDATE ON public.saved_games
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour enregistrer un jeu complet
CREATE OR REPLACE FUNCTION save_complete_game(
    game_name TEXT,
    game_description TEXT,
    max_moves_count INTEGER,
    grid_rows INTEGER,
    grid_cols INTEGER,
    grid_cells JSONB,
    info_cells JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_game_id UUID;
    cell_data JSONB;
    info_data JSONB;
BEGIN
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
$$;
