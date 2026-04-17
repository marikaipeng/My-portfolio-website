CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  techstack TEXT[]
);

INSERT INTO projects (title, description, techstack)
VALUES
('Portfolio Website', 'My personal portfolio', ARRAY['HTML','CSS','JS']),
('Contact API', 'Backend API project', ARRAY['Node.js','PostgreSQL']);
