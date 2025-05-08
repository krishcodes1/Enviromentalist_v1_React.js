-- Enable RLS on the table
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting records
CREATE POLICY select_event_participants ON event_participants
  FOR SELECT USING (true);

-- Create policy for inserting records
CREATE POLICY insert_event_participants ON event_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for updating own records
CREATE POLICY update_own_event_participants ON event_participants
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for deleting own records
CREATE POLICY delete_own_event_participants ON event_participants
  FOR DELETE USING (auth.uid() = user_id);
