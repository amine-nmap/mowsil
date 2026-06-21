-- ============================================
-- MOWSIL — Création du compte administrateur
-- ============================================
-- À exécuter UNE SEULE FOIS dans le SQL Editor Supabase.
-- Remplacez 'motdepasse123' par un mot de passe sécurisé avant exécution.
-- ============================================

-- 1. Créer l'utilisateur dans auth.users
-- Le mot de passe est haché avec bcrypt (facteur de coût 10)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'amine@mowsil.ma',
  crypt('motdepasse123', gen_salt('bf', 10)),
  now(),
  jsonb_build_object(
    'role', 'admin',
    'full_name', 'JABLI Mohammed Amine'
  ),
  now(),
  now(),
  '',
  '',
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'amine@mowsil.ma'
);

-- 2. Récupérer l'UUID de l'utilisateur créé
DO $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'amine@mowsil.ma';

  -- Insérer le profil admin
  INSERT INTO public.profiles (id, role, full_name, phone)
  VALUES (user_id, 'admin', 'JABLI Mohammed Amine', '+212600000000')
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    full_name = 'JABLI Mohammed Amine',
    phone = '+212600000000';
END;
$$;

-- 3. Vérification
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'amine@mowsil.ma') THEN
    RAISE NOTICE '✅ Compte admin créé : amine@mowsil.ma';
    RAISE NOTICE '🔑 Mot de passe : motdepasse123 (à changer dès la première connexion)';
  ELSE
    RAISE WARNING '❌ Échec de la création du compte admin';
  END IF;
END;
$$;
