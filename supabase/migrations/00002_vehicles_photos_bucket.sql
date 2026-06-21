-- ============================================
-- MOWSIL — Migration 00002 : Storage bucket vehicles-photos
-- ============================================

INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('vehicles-photos', 'vehicles-photos', true, false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "vehicles_photos_select_public" ON storage.objects;
DROP POLICY IF EXISTS "vehicles_photos_insert_own" ON storage.objects;

CREATE POLICY "vehicles_photos_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'vehicles-photos');

CREATE POLICY "vehicles_photos_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'vehicles-photos'
    AND auth.role() = 'authenticated'
  );
