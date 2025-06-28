-- Insert a test company with sample data
INSERT INTO companies (name, slug, total_questions, category, is_active) 
VALUES ('Google', 'google', 5, 'Technology', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  total_questions = EXCLUDED.total_questions,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active;

-- Get the company ID for Google
DO $$
DECLARE
    google_company_id UUID;
BEGIN
    SELECT id INTO google_company_id FROM companies WHERE slug = 'google';
    
    -- Insert sample difficulties
    INSERT INTO company_difficulties (company_id, difficulty, count) VALUES
    (google_company_id, 'Easy', 2),
    (google_company_id, 'Medium', 2),
    (google_company_id, 'Hard', 1)
    ON CONFLICT (company_id, difficulty) DO UPDATE SET
      count = EXCLUDED.count;
    
    -- Insert sample topics
    INSERT INTO company_topics (company_id, topic, count, rank) VALUES
    (google_company_id, 'Array', 3, 1),
    (google_company_id, 'String', 2, 2),
    (google_company_id, 'Dynamic Programming', 1, 3)
    ON CONFLICT (company_id, topic) DO UPDATE SET
      count = EXCLUDED.count,
      rank = EXCLUDED.rank;
    
    -- Insert sample questions
    INSERT INTO questions (company_id, question_id, title, url, difficulty, topics) VALUES
    (google_company_id, '1', 'Two Sum', '/problems/two-sum/', 'Easy', ARRAY['Array', 'Hash Table']),
    (google_company_id, '2', 'Add Two Numbers', '/problems/add-two-numbers/', 'Medium', ARRAY['Linked List', 'Math']),
    (google_company_id, '3', 'Longest Substring Without Repeating Characters', '/problems/longest-substring-without-repeating-characters/', 'Medium', ARRAY['Hash Table', 'String']),
    (google_company_id, '4', 'Median of Two Sorted Arrays', '/problems/median-of-two-sorted-arrays/', 'Hard', ARRAY['Array', 'Binary Search']),
    (google_company_id, '5', 'Longest Palindromic Substring', '/problems/longest-palindromic-substring/', 'Medium', ARRAY['String', 'Dynamic Programming'])
    ON CONFLICT (company_id, question_id) DO UPDATE SET
      title = EXCLUDED.title,
      url = EXCLUDED.url,
      difficulty = EXCLUDED.difficulty,
      topics = EXCLUDED.topics;
END $$;
