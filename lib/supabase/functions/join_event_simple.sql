-- Create a simple function to join an event that bypasses RLS
CREATE OR REPLACE FUNCTION join_event_simple(
  event_id_param UUID,
  user_id_param UUID
) 
RETURNS VOID AS $$
BEGIN
  -- Insert the participant
  INSERT INTO event_participants (event_id, user_id, status)
  VALUES (event_id_param, user_id_param, 'confirmed');
  
  -- Try to update attendee count if the column exists
  BEGIN
    UPDATE events 
    SET attendee_count = COALESCE(attendee_count, 0) + 1
    WHERE id = event_id_param;
  EXCEPTION WHEN undefined_column THEN
    -- Column doesn't exist, ignore
    NULL;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION join_event_simple(UUID, UUID) TO authenticated;
