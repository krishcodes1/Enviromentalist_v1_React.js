-- Function to decrement the member count of a community
CREATE OR REPLACE FUNCTION decrement_member_count(p_community_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE communities
  SET member_count = GREATEST(member_count - 1, 0)
  WHERE id = p_community_id;
END;
$$ LANGUAGE plpgsql;
