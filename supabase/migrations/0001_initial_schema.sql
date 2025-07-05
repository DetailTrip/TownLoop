-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  town TEXT REFERENCES towns(slug),
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Towns table
CREATE TABLE public.towns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  region TEXT,
  coordinates POINT,
  population INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table (optimized for your features)
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  location TEXT,
  coordinates POINT,
  town TEXT REFERENCES towns(slug),
  category TEXT,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active', -- e.g., 'active', 'cancelled', 'postponed'
  creator_id UUID REFERENCES public.profiles(id),
  view_count INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activities
CREATE TABLE public.user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  activity_type TEXT NOT NULL, -- 'event_submit', 'flyer_spot', 'event_attend'
  points_earned INTEGER DEFAULT 0,
  event_id UUID REFERENCES events(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event interactions
CREATE TABLE public.event_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  event_id UUID REFERENCES events(id),
  interaction_type TEXT NOT NULL, -- 'view', 'like', 'save', 'share'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id, interaction_type)
);

-- Essential indexes for your app
CREATE INDEX idx_events_town_date ON events(town, date_time);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_featured ON events(is_featured) WHERE is_featured = true;
CREATE INDEX idx_events_status_date ON events(status, date_time) WHERE status = 'active';
CREATE INDEX idx_events_coordinates ON events USING GIST(coordinates);
CREATE INDEX idx_user_activities_user_date ON user_activities(user_id, created_at DESC);
CREATE INDEX idx_event_interactions_event ON event_interactions(event_id, interaction_type);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create events" ON events FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (auth.uid() = creator_id);

-- Function to update user XP
CREATE OR REPLACE FUNCTION update_user_xp(user_id UUID, points INTEGER)
RETURNS void AS $$
BEGIN
  INSERT INTO user_activities (user_id, activity_type, points_earned)
  VALUES (user_id, 'manual', points);
  
  UPDATE profiles 
  SET xp = xp + points,
      level = FLOOR((xp + points) / 100) + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get trending events
CREATE OR REPLACE FUNCTION get_trending_events(town_filter TEXT DEFAULT NULL)
RETURNS TABLE(event_id UUID, score DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    (COUNT(ei.id) * 0.7 + e.view_count * 0.3)::DECIMAL as score
  FROM events e
  LEFT JOIN event_interactions ei ON e.id = ei.event_id 
    AND ei.created_at > NOW() - INTERVAL '7 days'
  WHERE e.status = 'active' 
    AND e.date_time > NOW()
    AND (town_filter IS NULL OR e.town = town_filter)
  GROUP BY e.id, e.view_count
  ORDER BY score DESC;
END;
$$ LANGUAGE plpgsql;
