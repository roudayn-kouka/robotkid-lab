
-- Vérifier et insérer les codes admin s'ils n'existent pas
INSERT INTO public.admin_codes (code, is_active) 
VALUES 
  ('ADMIN2024', true),
  ('ROBOKIDZ2024', true),
  ('EDUCATOR123', true)
ON CONFLICT (code) DO NOTHING;

-- Créer une politique RLS pour permettre la validation des codes admin
-- même pour les utilisateurs non authentifiés
DROP POLICY IF EXISTS "Allow admin code validation" ON public.admin_codes;

CREATE POLICY "Allow admin code validation" ON public.admin_codes
  FOR SELECT 
  USING (true);

-- Supprimer l'ancienne politique restrictive
DROP POLICY IF EXISTS "Admins can view admin codes" ON public.admin_codes;
