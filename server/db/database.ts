import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../specforge.sqlite');
export const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    linear_team_id TEXT,
    github_repo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS discovery_calls (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    title TEXT NOT NULL,
    interviewee_name TEXT,
    interviewee_role TEXT,
    raw_transcript TEXT NOT NULL,
    duration_seconds INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS insights (
    id TEXT PRIMARY KEY,
    call_id TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    quote TEXT NOT NULL,
    timestamp_start TEXT NOT NULL,
    timestamp_end TEXT NOT NULL,
    urgency_score INTEGER DEFAULT 3,
    jtbd TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS prd_documents (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    markdown_content TEXT NOT NULL,
    schema_mermaid TEXT,
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS issues (
    id TEXT PRIMARY KEY,
    prd_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    priority TEXT NOT NULL,
    story_points INTEGER DEFAULT 3,
    gherkin_criteria TEXT,
    citation_quote TEXT,
    citation_timestamp TEXT,
    linear_issue_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
