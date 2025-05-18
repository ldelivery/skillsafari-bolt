/*
  # Initial Schema Setup

  1. Tables
    - settings: User preferences and settings
    - active_challenges: Currently active user challenges
    - saved_challenges: User's saved challenges
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id text PRIMARY KEY,
    language text NOT NULL,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create active_challenges table
CREATE TABLE IF NOT EXISTS active_challenges (
    id text PRIMARY KEY,
    challenge jsonb NOT NULL,
    start_time bigint NOT NULL,
    completed_steps boolean[] DEFAULT '{}',
    completed_materials boolean[] DEFAULT '{}',
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_active_challenges_updated_at
    BEFORE UPDATE ON active_challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create saved_challenges table
CREATE TABLE IF NOT EXISTS saved_challenges (
    id text PRIMARY KEY,
    saved_at bigint NOT NULL,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_saved_challenges_updated_at
    BEFORE UPDATE ON saved_challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_challenges ENABLE ROW LEVEL SECURITY;

-- Create policies with proper type casting
CREATE POLICY "Users can manage their own settings"
    ON settings
    FOR ALL
    TO authenticated
    USING (auth.uid()::text = id)
    WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can manage their own active challenges"
    ON active_challenges
    FOR ALL
    TO authenticated
    USING (auth.uid()::text = id)
    WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can manage their own saved challenges"
    ON saved_challenges
    FOR ALL
    TO authenticated
    USING (auth.uid()::text = id)
    WITH CHECK (auth.uid()::text = id);