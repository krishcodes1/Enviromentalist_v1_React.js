CREATE OR REPLACE FUNCTION check_event_participants_constraints()
RETURNS TABLE (
  column_name text,
  data_type text,
  character_maximum_length integer,
  is_nullable text,
  column_default text,
  constraint_name text,
  constraint_type text,
  check_clause text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name,
    c.data_type,
    c.character_maximum_length,
    c.is_nullable,
    c.column_default,
    con.constraint_name,
    con.constraint_type,
    chk.check_clause
  FROM 
    information_schema.columns c
  LEFT JOIN 
    information_schema.constraint_column_usage ccu ON c.column_name = ccu.column_name AND c.table_name = ccu.table_name
  LEFT JOIN 
    information_schema.table_constraints con ON ccu.constraint_name = con.constraint_name
  LEFT JOIN 
    information_schema.check_constraints chk ON con.constraint_name = chk.constraint_name
  WHERE 
    c.table_name = 'event_participants'
  ORDER BY 
    c.ordinal_position;
END;
$$ LANGUAGE plpgsql;
