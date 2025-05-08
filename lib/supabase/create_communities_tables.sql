-- Check if communities table exists, if not create it
CREATE TABLE IF NOT EXISTS communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  creator_id UUID NOT NULL REFERENCES auth.users(id),
  image_url TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  member_count INTEGER DEFAULT 1
);

-- Check if community_members table exists, if not create it
CREATE TABLE IF NOT EXISTS community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- Grant appropriate permissions
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

-- Create policies for communities
CREATE POLICY "Public communities are viewable by everyone"
  ON communities FOR SELECT
  USING (is_private = false);

CREATE POLICY "Private communities are viewable by members only"
  ON communities FOR SELECT
  USING (
    is_private = true AND
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = communities.id
      AND community_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Communities can be created by authenticated users"
  ON communities FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Communities can be updated by admins"
  ON communities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = communities.id
      AND community_members.user_id = auth.uid()
      AND community_members.role = 'admin'
    )
  );

-- Create policies for community_members
CREATE POLICY "Community members are viewable by everyone"
  ON community_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join public communities"
  ON community_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_id
      AND communities.is_private = false
    )
  );

CREATE POLICY "Admins can add members to private communities"
  ON community_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = community_id
      AND community_members.user_id = auth.uid()
      AND community_members.role = 'admin'
    )
  );

CREATE POLICY "Members can leave communities"
  ON community_members FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can remove members"
  ON community_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = community_id
      AND community_members.user_id = auth.uid()
      AND community_members.role = 'admin'
    )
  );
