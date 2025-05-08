-- Function to increment a column value in a table
CREATE OR REPLACE FUNCTION increment(row_id UUID, table_name TEXT, column_name TEXT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_value INT;
  query TEXT;
BEGIN
  -- Build dynamic query to get current value
  query := format('SELECT %I FROM %I WHERE id = $1', column_name, table_name);
  
  -- Execute the query
  EXECUTE query INTO current_value USING row_id;
  
  -- Return incremented value
  RETURN COALESCE(current_value, 0) + 1;
END;
$$;

-- Update join_event function to increment attendance counter
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
  
  -- Increment attendance counter in events table
  -- Using the generic increment function
  UPDATE events
  SET attendee_count = increment(id, 'events', 'attendee_count')
  WHERE id = event_id_param;
  
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
GRANT EXECUTE ON FUNCTION increment(UUID, TEXT, TEXT) TO authenticated;
