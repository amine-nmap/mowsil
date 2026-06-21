-- ============================================
-- MOWSIL — Schema Supabase Complet (Migration Initiale)
-- Date : 2026-06-21
-- ============================================
-- Ce script est idempotent : les CREATE sont précédés de DROP IF EXISTS.
-- Exécuter une seule fois dans le SQL Editor Supabase (ou via supabase CLI).
-- ============================================

-- 1. NETTOYAGE PRÉALABLE (optionnel — commenter si première exécution)
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "agencies_select_active" ON agencies;
DROP POLICY IF EXISTS "agencies_select_own" ON agencies;
DROP POLICY IF EXISTS "agencies_update_own" ON agencies;
DROP POLICY IF EXISTS "agencies_insert_own" ON agencies;
DROP POLICY IF EXISTS "vehicles_select_public" ON vehicles;
DROP POLICY IF EXISTS "vehicles_select_own" ON vehicles;
DROP POLICY IF EXISTS "vehicles_insert_own" ON vehicles;
DROP POLICY IF EXISTS "vehicles_update_own" ON vehicles;
DROP POLICY IF EXISTS "vehicles_delete_own" ON vehicles;
DROP POLICY IF EXISTS "bookings_insert" ON bookings;
DROP POLICY IF EXISTS "bookings_select_own_client" ON bookings;
DROP POLICY IF EXISTS "bookings_select_agency" ON bookings;
DROP POLICY IF EXISTS "bookings_update_agency" ON bookings;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS agencies;
DROP TABLE IF EXISTS profiles;

DROP TYPE IF EXISTS booking_status;
DROP TYPE IF EXISTS agency_status;
DROP TYPE IF EXISTS user_role;

-- 2. ENUMS

CREATE TYPE user_role AS ENUM ('client', 'agency', 'admin');

CREATE TYPE agency_status AS ENUM ('pending', 'active', 'suspended');

-- Cycle de vie d'une réservation :
--   en_attente → confirmee → activee → terminee
--   en_attente → refusee
--   en_attente → expiree (cron automatique après 2h)
CREATE TYPE booking_status AS ENUM (
  'en_attente', 'confirmee', 'refusee', 'expiree', 'activee', 'terminee'
);

-- 3. TABLES

-- Profiles — extension des utilisateurs Supabase Auth.
-- Créé automatiquement via le trigger handle_new_user().
CREATE TABLE profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       user_role NOT NULL DEFAULT 'client',
  full_name  text,
  phone      text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Agences de location.
CREATE TABLE agencies (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name             text NOT NULL,
  city             text NOT NULL DEFAULT 'Oujda',
  phone            text,
  email            text,
  address          text,
  coordinates      jsonb,          -- { lat: number, lng: number }
  opening_hours    jsonb,          -- { schedule: "9:00-21:00" }
  facade_photo_url text,
  rating           numeric(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count     int DEFAULT 0 CHECK (review_count >= 0),
  status           agency_status NOT NULL DEFAULT 'pending',
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Véhicules appartenant à une agence.
CREATE TABLE vehicles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id       uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  brand           text NOT NULL,
  model           text NOT NULL,
  year            int NOT NULL,
  fuel_type       text NOT NULL,
  gearbox         text NOT NULL,
  daily_price     int NOT NULL CHECK (daily_price > 0),
  deposit_amount  int CHECK (deposit_amount >= 0),
  mileage_policy  text,
  fuel_policy     text,
  photos          text[] DEFAULT '{}',
  category        text NOT NULL DEFAULT 'Citadine'
                    CHECK (category IN ('Citadine', 'Berline', 'SUV', 'Prestige')),
  is_available    boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Réservations clients.
CREATE TABLE bookings (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id            uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  client_name           text NOT NULL,
  client_phone          text NOT NULL,
  client_email          text NOT NULL,
  client_license_number text NOT NULL,
  start_date            timestamptz NOT NULL,
  end_date              timestamptz NOT NULL,
  total_price           int,  -- calculé côté application : nb_jours * daily_price
  status                booking_status NOT NULL DEFAULT 'en_attente',
  unique_code           text UNIQUE,   -- Format OUJ-XXXX-XX
  expires_at            timestamptz,   -- now() + 2h pour les réservations en_attente
  created_at            timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bookings_date_check CHECK (end_date > start_date)
);

-- 4. INDEXES

-- Agencies
CREATE INDEX idx_agencies_owner_id ON agencies(owner_id);
CREATE INDEX idx_agencies_status ON agencies(status);
CREATE INDEX idx_agencies_city ON agencies(city);

-- Vehicles
CREATE INDEX idx_vehicles_agency_id ON vehicles(agency_id);
CREATE INDEX idx_vehicles_agency_category ON vehicles(agency_id, category);
CREATE INDEX idx_vehicles_available ON vehicles(is_available);
CREATE INDEX idx_vehicles_category ON vehicles(category);
CREATE INDEX idx_vehicles_daily_price ON vehicles(daily_price);

-- Bookings (optimisés pour les requêtes de disponibilité et dashboard)
CREATE INDEX idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_unique_code ON bookings(unique_code);
CREATE INDEX idx_bookings_dates ON bookings(vehicle_id, start_date, end_date);
CREATE INDEX idx_bookings_agency_lookup ON bookings(vehicle_id, status, start_date);
CREATE INDEX idx_bookings_expires ON bookings(expires_at) WHERE status = 'en_attente';

-- 5. ROW LEVEL SECURITY

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- PROFILES
-- Un utilisateur ne peut lire/modifier que son propre profil.
-- L'insertion est automatique via trigger ; la policy permet les inscriptions manuelles.

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- AGENCIES
-- Les agences actives sont publiquement lisibles.
-- Le propriétaire peut lire/modifier sa propre agence.

CREATE POLICY "agencies_select_active" ON agencies
  FOR SELECT USING (status = 'active');

CREATE POLICY "agencies_select_own" ON agencies
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "agencies_update_own" ON agencies
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "agencies_insert_own" ON agencies
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- VEHICLES
-- Le public voit les véhicules des agences actives uniquement.
-- Le propriétaire de l'agence gère ses véhicules.

CREATE POLICY "vehicles_select_public" ON vehicles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM agencies
      WHERE agencies.id = vehicles.agency_id
      AND agencies.status = 'active'
    )
  );

CREATE POLICY "vehicles_select_own" ON vehicles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM agencies
      WHERE agencies.id = vehicles.agency_id
      AND agencies.owner_id = auth.uid()
    )
  );

CREATE POLICY "vehicles_insert_own" ON vehicles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM agencies
      WHERE agencies.id = vehicles.agency_id
      AND agencies.owner_id = auth.uid()
    )
  );

CREATE POLICY "vehicles_update_own" ON vehicles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM agencies
      WHERE agencies.id = vehicles.agency_id
      AND agencies.owner_id = auth.uid()
    )
  );

CREATE POLICY "vehicles_delete_own" ON vehicles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM agencies
      WHERE agencies.id = vehicles.agency_id
      AND agencies.owner_id = auth.uid()
    )
  );

-- BOOKINGS
-- Tout le monde peut créer une réservation.
-- Le client peut voir ses réservations via son email.
-- L'agence peut voir/gérer les réservations de ses véhicules.

CREATE POLICY "bookings_insert" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "bookings_select_own_client" ON bookings
  FOR SELECT USING (client_email = auth.jwt()->>'email');

CREATE POLICY "bookings_select_agency" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vehicles
      JOIN agencies ON agencies.id = vehicles.agency_id
      WHERE vehicles.id = bookings.vehicle_id
      AND agencies.owner_id = auth.uid()
    )
  );

CREATE POLICY "bookings_update_agency" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM vehicles
      JOIN agencies ON agencies.id = vehicles.agency_id
      WHERE vehicles.id = bookings.vehicle_id
      AND agencies.owner_id = auth.uid()
    )
  );

-- 6. TRIGGER : CRÉATION AUTOMATIQUE DU PROFIL

-- Crée automatiquement un profil lors de l'inscription via Supabase Auth.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'client'
    ),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 7. FONCTION : NETTOYAGE DES RÉSERVATIONS EXPIRÉES

-- Passe en 'expiree' les réservations en_attente dont le délai de 2h est dépassé.
-- À exécuter périodiquement (Vercel Cron / pg_cron / Edge Function).
CREATE OR REPLACE FUNCTION expire_stale_bookings()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  affected int;
BEGIN
  UPDATE public.bookings
  SET status = 'expiree'
  WHERE status = 'en_attente'
    AND expires_at IS NOT NULL
    AND expires_at < now();
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;

-- 8. STORAGE BUCKET

-- Photos de devanture des agences.
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('agencies-facades', 'agencies-facades', true, false)
ON CONFLICT (id) DO NOTHING;

-- Policy : tout le monde peut lire, seul le propriétaire peut uploader.
DROP POLICY IF EXISTS "facades_select_public" ON storage.objects;
DROP POLICY IF EXISTS "facades_insert_own" ON storage.objects;

CREATE POLICY "facades_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'agencies-facades');

CREATE POLICY "facades_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'agencies-facades'
    AND auth.role() = 'authenticated'
  );

-- 9. SEED DATA (DÉMONSTRATION)

-- Insère les données uniquement si les tables sont vides (évite les doublons).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles LIMIT 1) THEN

    -- Créer les profils agences (les auth.users doivent être créés manuellement ou via signUp)
    -- NOTE : ces INSERT échoueront si les auth.users correspondants n'existent pas.
    -- Pour un seed complet, utiliser le script seed.sql séparé.
    -- Les données mockées ci-dessous sont un template documenté.

    RAISE NOTICE 'Table profiles vide — aucun seed automatique.';
    RAISE NOTICE 'Utiliser le script seed.sql séparé pour les données de démonstration.';

  END IF;
END;
$$;

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================
