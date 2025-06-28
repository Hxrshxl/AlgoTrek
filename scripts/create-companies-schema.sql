-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  total_questions INTEGER DEFAULT 0,
  blob_url TEXT,
  file_name VARCHAR(255),
  category VARCHAR(100) DEFAULT 'Technology',
  is_active BOOLEAN DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company_difficulties table
CREATE TABLE IF NOT EXISTS company_difficulties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, difficulty)
);

-- Create company_topics table
CREATE TABLE IF NOT EXISTS company_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  topic VARCHAR(255) NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  rank INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table (optional - for caching parsed questions)
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  question_id VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  url VARCHAR(500),
  is_premium BOOLEAN DEFAULT false,
  acceptance VARCHAR(20),
  difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  frequency VARCHAR(20),
  topics TEXT[], -- Array of topics
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, question_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_active ON companies(is_active);
CREATE INDEX IF NOT EXISTS idx_company_difficulties_company_id ON company_difficulties(company_id);
CREATE INDEX IF NOT EXISTS idx_company_topics_company_id ON company_topics(company_id);
CREATE INDEX IF NOT EXISTS idx_questions_company_id ON questions(company_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);

-- Create RLS policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_difficulties ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users
CREATE POLICY "Allow read access to companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Allow read access to company_difficulties" ON company_difficulties FOR SELECT USING (true);
CREATE POLICY "Allow read access to company_topics" ON company_topics FOR SELECT USING (true);
CREATE POLICY "Allow read access to questions" ON questions FOR SELECT USING (true);
