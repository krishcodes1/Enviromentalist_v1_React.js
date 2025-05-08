-- Temporarily disable RLS for event_participants table
ALTER TABLE event_participants DISABLE ROW LEVEL SECURITY;

-- Verify the change
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'event_participants';
