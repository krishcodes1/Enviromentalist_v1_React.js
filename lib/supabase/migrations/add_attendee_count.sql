-- Add attendee_count column to events table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'events' 
    AND column_name = 'attendee_count'
  ) THEN
    ALTER TABLE events ADD COLUMN attendee_count INT DEFAULT 0;
  END IF;
END $$;

-- Update existing event attendee counts based on participant data
UPDATE events
SET attendee_count = (
  SELECT COUNT(*)
  FROM event_participants
  WHERE event_participants.event_id = events.id
);

-- Create or replace trigger to auto-increment attendee_count
CREATE OR REPLACE FUNCTION update_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events
    SET attendee_count = attendee_count + 1
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events
    SET attendee_count = GREATEST(attendee_count - 1, 0)
    WHERE id = OLD.event_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_attendee_count ON event_participants;

-- Create the trigger
CREATE TRIGGER trigger_update_attendee_count
AFTER INSERT OR DELETE ON event_participants
FOR EACH ROW
EXECUTE FUNCTION update_event_attendee_count();
