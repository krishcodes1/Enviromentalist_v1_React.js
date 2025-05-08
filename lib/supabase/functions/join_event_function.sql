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
  result JSONB;
  event_exists BOOLEAN;
  already_participating BOOLEAN;
BEGIN
  -- Check if event exists
  SELECT EXISTS(SELECT 1 FROM events WHERE id = event_id_param) INTO event_exists;
  
  IF NOT event_exists THEN
    RETURN jsonb_build_object('success', false, 'message', 'Event not found');
  END IF;
  
  -- Check if already participating
  SELECT EXISTS(
    SELECT 1 FROM event_participants 
    WHERE event_id = event_id_param AND user_id = user_id_param
  ) INTO already_participating;
  
  IF already_participating THEN
    RETURN jsonb_build_object('success', true, 'message', 'Already participating in this event');
  END IF;
  
  -- Insert the participant record
  INSERT INTO event_participants (event_id, user_id, status)
  VALUES (event_id_param, user_id_param, 'confirmed');
  
  -- Add impact history
  INSERT INTO impact_history (
    user_id, 
    event_id, 
    activity_type, 
    points_earned, 
    description, 
    verified
  )
  VALUES (
    user_id_param,
    event_id_param,
    'Event Participation',
    50,
    'Joined an environmental event',
    true
  );
  
  -- Update reputation points
  PERFORM increment_reputation(user_id_param, 50);
  
  RETURN jsonb_build_object('success', true, 'message', 'Successfully joined event');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false, 
    'message', 'Error joining event', 
    'error', SQLERRM
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION join_event(UUID, UUID) TO authenticated;

-- Test the function
SELECT join_event('00000000-0000-0000-0000-000000000000'::UUID, '00000000-0000-0000-0000-000000000000'::UUID);
