-- Create a function to join an event that bypasses RLS
CREATE OR REPLACE FUNCTION join_event(
  event_id_param UUID,
  user_id_param UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- This makes the function run with the privileges of the creator
SET search_path = public
AS $$
DECLARE
  event_exists BOOLEAN;
  already_joined BOOLEAN;
  result JSONB;
BEGIN
  -- Check if event exists
  SELECT EXISTS(SELECT 1 FROM events WHERE id = event_id_param) INTO event_exists;
  
  IF NOT event_exists THEN
    RETURN jsonb_build_object('success', false, 'message', 'Event not found');
  END IF;
  
  -- Check if user is already participating
  SELECT EXISTS(
    SELECT 1 FROM event_participants 
    WHERE event_id = event_id_param AND user_id = user_id_param
  ) INTO already_joined;
  
  IF already_joined THEN
    RETURN jsonb_build_object('success', true, 'message', 'Already participating in this event');
  END IF;
  
  -- Add user as participant
  INSERT INTO event_participants (event_id, user_id, status)
  VALUES (event_id_param, user_id_param, 'confirmed');
  
  -- Add impact history
  BEGIN
    INSERT INTO impact_history (user_id, event_id, activity_type, points_earned, description, verified)
    VALUES (user_id_param, event_id_param, 'Event Participation', 50, 'Joined an environmental event', true);
  EXCEPTION WHEN OTHERS THEN
    -- Continue even if impact history fails
    NULL;
  END;
  
  -- Update user's reputation points
  BEGIN
    PERFORM increment_reputation(user_id_param, 50);
  EXCEPTION WHEN OTHERS THEN
    -- Continue even if reputation update fails
    NULL;
  END;
  
  RETURN jsonb_build_object('success', true, 'message', 'Successfully joined event');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'message', 'Error joining event: ' || SQLERRM);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION join_event(UUID, UUID) TO authenticated;
