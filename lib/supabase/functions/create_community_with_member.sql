-- Create a function to insert a community and add the creator as an admin
CREATE OR REPLACE FUNCTION create_community_with_member(
  p_name VARCHAR,
  p_description TEXT,
  p_creator_id UUID,
  p_category VARCHAR,
  p_image_url TEXT,
  p_is_private BOOLEAN
) RETURNS JSONB AS $$
DECLARE
  v_community_id UUID;
  v_result JSONB;
  v_column_exists BOOLEAN;
BEGIN
  -- Check if is_private column exists
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'communities' 
    AND column_name = 'is_private'
  ) INTO v_column_exists;

  -- Insert community with dynamic SQL based on column existence
  IF v_column_exists THEN
    -- Use is_private column
    INSERT INTO communities (
      name, 
      description, 
      creator_id, 
      category, 
      image_url, 
      is_private
    ) VALUES (
      p_name, 
      p_description, 
      p_creator_id, 
      p_category, 
      p_image_url, 
      p_is_private
    ) RETURNING id INTO v_community_id;
  ELSE
    -- Try with "private" column
    BEGIN
      INSERT INTO communities (
        name, 
        description, 
        creator_id, 
        category, 
        image_url, 
        private
      ) VALUES (
        p_name, 
        p_description, 
        p_creator_id, 
        p_category, 
        p_image_url, 
        p_is_private
      ) RETURNING id INTO v_community_id;
    EXCEPTION WHEN OTHERS THEN
      -- If "private" also doesn't exist, insert without privacy setting
      INSERT INTO communities (
        name, 
        description, 
        creator_id, 
        category, 
        image_url
      ) VALUES (
        p_name, 
        p_description, 
        p_creator_id, 
        p_category, 
        p_image_url
      ) RETURNING id INTO v_community_id;
    END;
  END IF;

  -- Add creator as admin
  INSERT INTO community_members (
    community_id,
    user_id,
    role
  ) VALUES (
    v_community_id,
    p_creator_id,
    'admin'
  );

  -- Return the community ID
  SELECT jsonb_build_object(
    'id', v_community_id
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a helper function to get table columns
CREATE OR REPLACE FUNCTION get_table_columns(table_name TEXT)
RETURNS TABLE (
  column_name TEXT,
  data_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.column_name::TEXT, c.data_type::TEXT
  FROM information_schema.columns c
  WHERE c.table_name = table_name
  AND c.table_schema = 'public';
END;
$$ LANGUAGE plpgsql;
