-- This function increments a user's reputation points
CREATE OR REPLACE FUNCTION increment_reputation(user_id_param UUID, points_param INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET reputation_points = reputation_points + points_param
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;
