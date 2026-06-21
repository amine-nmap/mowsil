-- ============================================
-- MOWSIL — Seed Data Exécutable
-- À exécuter DANS Supabase SQL Editor (service_role requis)
-- ============================================
-- ATTENTION : exécuter UNE SEULE FOIS, ou TRUNCATE les tables avant re-exécution
-- Pour réinitialiser : décommenter le bloc --NETTOYAGE-- ci-dessous
-- ============================================

-- NETTOYAGE (décommenter pour réinitialiser)
-- TRUNCATE TABLE public.bookings CASCADE;
-- TRUNCATE TABLE public.vehicles CASCADE;
-- TRUNCATE TABLE public.agencies CASCADE;
-- DELETE FROM public.profiles WHERE id IN ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002');
-- DELETE FROM auth.users WHERE email IN ('admin@mowsil.ma','agence@alatlas.ma');

-- ============================================
-- 1. UTILISATEUR ADMIN
-- Le trigger on_auth_user_created crée automatiquement le profil
-- avec le rôle depuis raw_user_meta_data.
-- ============================================
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'admin@mowsil.ma', crypt('Admin123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"admin","full_name":"Admin MOWSIL"}', now(), now(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- Mise à jour du profil admin au cas où le trigger n'a pas pu définir le rôle
UPDATE public.profiles SET role = 'admin', full_name = 'Admin MOWSIL', phone = '+212600000000'
WHERE id = '00000000-0000-0000-0000-000000000001' AND role != 'admin';

-- ============================================
-- 2. UTILISATEUR AGENCE
-- ============================================
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'agence@alatlas.ma', crypt('Agence123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"role":"agency","full_name":"Agence Al Atlas","phone":"+212600000001"}', now(), now(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

UPDATE public.profiles SET role = 'agency', full_name = 'Agence Al Atlas', phone = '+212600000001'
WHERE id = '00000000-0000-0000-0000-000000000002' AND role IS NULL;

-- ============================================
-- 3. AGENCE
-- ============================================
INSERT INTO public.agencies (id, owner_id, name, city, phone, email, address, coordinates, opening_hours, status)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000002', 'Agence Al Atlas', 'Oujda', '+212600000001', 'contact@alatlas.ma', '123 Boulevard Mohammed V, Oujda', '{"lat":34.6814,"lng":-1.9086}', '{"schedule":"9:00-21:00"}', 'active')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. VÉHICULES (5)
-- ============================================
INSERT INTO public.vehicles (id, agency_id, brand, model, year, fuel_type, gearbox, daily_price, deposit_amount, mileage_policy, fuel_policy, photos, category, is_available)
VALUES
  ('b0000001-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dacia',    'Sandero', 2023, 'Essence',  'Manuelle',    200, 3000, '200 km/jour inclus', 'Plein à plein', ARRAY['https://placehold.co/1200x800/0A2540/00C896?text=Dacia+Sandero'],  'Citadine', true),
  ('b0000002-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dacia',    'Logan',   2022, 'Diesel',   'Manuelle',    300, 4000, 'Illimité',           'Plein à plein', ARRAY['https://placehold.co/1200x800/0A2540/00C896?text=Dacia+Logan'],    'Berline',  true),
  ('b0000003-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dacia',    'Duster',  2023, 'Diesel',   'Manuelle',    500, 5000, 'Illimité',           'Plein à plein', ARRAY['https://placehold.co/1200x800/0A2540/00C896?text=Dacia+Duster'],   'SUV',      true),
  ('b0000004-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Renault',  'Clio',    2023, 'Essence',  'Manuelle',    220, 3000, 'Illimité',           'Plein à plein', ARRAY['https://placehold.co/1200x800/0A2540/00C896?text=Renault+Clio'],   'Citadine', true),
  ('b0000005-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Peugeot',  '301',     2023, 'Essence',  'Manuelle',    350, 4000, 'Illimité',           'Plein à plein', ARRAY['https://placehold.co/1200x800/0A2540/00C896?text=Peugeot+301'],    'Berline',  true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. RÉSERVATIONS (2)
-- ============================================
INSERT INTO public.bookings (id, vehicle_id, client_name, client_phone, client_email, client_license_number, start_date, end_date, total_price, status, unique_code, expires_at)
VALUES
  -- Réservation en attente (expire dans 90 min)
  ('c0000001-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000001-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Ahmed Alami',  '+212600000010', 'ahmed@email.com',  'B123456', now() + interval '7 days', now() + interval '10 days', 600, 'en_attente', NULL,              now() + interval '90 minutes'),
  -- Réservation confirmée avec code OUJ
  ('c0000002-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000004-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sara Benz',    '+212600000011', 'sara@email.com',   'B789012', now() + interval '14 days', now() + interval '17 days', 660, 'confirmee',  'OUJ-8F3A-9B', NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FIN DU SEED
-- ============================================
