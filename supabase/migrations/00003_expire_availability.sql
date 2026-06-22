-- expire_stale_bookings() v2: also reset is_available on expired bookings
CREATE OR REPLACE FUNCTION expire_stale_bookings()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  affected int;
BEGIN
  WITH expired AS (
    UPDATE public.bookings
    SET status = 'expiree'
    WHERE status = 'en_attente'
      AND expires_at IS NOT NULL
      AND expires_at < now()
    RETURNING vehicle_id
  )
  UPDATE public.vehicles
  SET is_available = true
  WHERE id IN (SELECT vehicle_id FROM expired);

  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;
