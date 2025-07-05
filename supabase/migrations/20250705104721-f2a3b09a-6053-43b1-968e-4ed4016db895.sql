
-- Créer une table pour les établissements si elle n'existe pas déjà
-- (La table establishments existe déjà selon le schéma)

-- Vérifier que les relations sont correctes entre les tables
-- classes -> establishments (déjà fait)
-- students -> classes (déjà fait)

-- Ajouter une politique RLS pour permettre aux enseignants de créer des classes
CREATE POLICY "Teachers can create classes" ON public.classes
  FOR INSERT 
  WITH CHECK (auth.uid() = teacher_id AND get_current_user_role() = 'teacher');

-- Ajouter une politique RLS pour permettre aux enseignants de modifier leurs classes
CREATE POLICY "Teachers can update their classes" ON public.classes
  FOR UPDATE 
  USING (auth.uid() = teacher_id AND get_current_user_role() = 'teacher');

-- Ajouter des politiques pour la gestion des élèves
CREATE POLICY "Teachers can view students in their classes" ON public.students
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM classes 
    WHERE classes.id = students.class_id 
    AND classes.teacher_id = auth.uid()
    AND get_current_user_role() = 'teacher'
  ));

CREATE POLICY "Teachers can create students in their classes" ON public.students
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM classes 
    WHERE classes.id = students.class_id 
    AND classes.teacher_id = auth.uid()
    AND get_current_user_role() = 'teacher'
  ));

CREATE POLICY "Teachers can update students in their classes" ON public.students
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM classes 
    WHERE classes.id = students.class_id 
    AND classes.teacher_id = auth.uid()
    AND get_current_user_role() = 'teacher'
  ));

CREATE POLICY "Teachers can delete students in their classes" ON public.students
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM classes 
    WHERE classes.id = students.class_id 
    AND classes.teacher_id = auth.uid()
    AND get_current_user_role() = 'teacher'
  ));

-- Ajouter des politiques pour que les admins puissent voir les élèves
CREATE POLICY "Admins can manage students" ON public.students
  FOR ALL 
  USING (get_current_user_role() = 'admin');

-- Activer RLS sur la table students si ce n'est pas déjà fait
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
