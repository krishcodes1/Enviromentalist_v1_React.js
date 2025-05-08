CREATE OR REPLACE FUNCTION increment_member_count(community_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE communities
  SET member_count = member_count + 1
  WHERE id = community_id;
END;
$$ LANGUAGE plpgsql;
