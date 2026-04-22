-- =============================================
--  KEYREER — Database Schema
--  Run this in Supabase Dashboard → SQL Editor
-- =============================================

-- ── 1. USERS ──
-- Stores user profiles from Step 1 (Homepage assessment intro)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT,                -- 'Học sinh' | 'Sinh viên' | 'Người đi làm'
  subjects TEXT,            -- (Học sinh only)
  major TEXT,               -- (Sinh viên only)
  position TEXT,            -- (Người đi làm only)
  education TEXT,           -- (Người đi làm only)
  skills TEXT,
  experience TEXT,
  tasks TEXT,
  interests TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 2. ASSESSMENTS ──
-- Stores quiz answers + computed scores from Step 2
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,           -- Array of 35 integers (1-5)
  scores JSONB,                     -- {creative, leader, social, order, analyst, technical} percentages
  riasec JSONB,                     -- {realistic, investigative, artistic, social, enterprising, conventional}
  big_five JSONB,                   -- {openness, conscientiousness, extraversion, agreeableness, neuroticism}
  schwartz JSONB,                   -- {selfDirection, stimulation, hedonism, achievement, power, security, conformity, tradition, benevolence, universalism}
  top_group TEXT,                   -- e.g. 'creative'
  second_group TEXT,                -- e.g. 'social'
  group_details JSONB,              -- Full sorted group analysis with jobs, narratives, etc.
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);

-- ── 3. CAREER SELECTIONS ──
-- Stores career choices from Step 3 (Matrix explorer)
CREATE TABLE IF NOT EXISTS career_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  career_name TEXT NOT NULL,        -- e.g. 'Kỹ sư phần mềm'
  fit_level TEXT,                   -- 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low'
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_career_sel_user ON career_selections(user_id);
CREATE INDEX IF NOT EXISTS idx_career_sel_assessment ON career_selections(assessment_id);

-- ── 4. ROW LEVEL SECURITY (RLS) ──
-- Enable RLS but allow all operations via anon key (public app)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_selections ENABLE ROW LEVEL SECURITY;

-- Allow insert/select for all (public app, no auth required)
CREATE POLICY "Allow public insert on users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Allow public update on users" ON users
  FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on assessments" ON assessments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on assessments" ON assessments
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on career_selections" ON career_selections
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on career_selections" ON career_selections
  FOR SELECT USING (true);
