CREATE OR REPLACE FUNCTION get_event_participants_schema()
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable text,
  column_default text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
  FROM 
    information_schema.columns
  WHERE 
    table_name = 'event_participants'
  ORDER BY 
    ordinal_position;
END;
$$ LANGUAGE plpgsql;
