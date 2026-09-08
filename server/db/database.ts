import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbFilePath = path.resolve(dataDir, 'specforge-db.json');

interface SchemaData {
  projects: any[];
  discovery_calls: any[];
  insights: any[];
  prd_documents: any[];
  issues: any[];
}

function loadData(): SchemaData {
  if (fs.existsSync(dbFilePath)) {
    try {
      return JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    } catch {
      // Fallback if file corrupted
    }
  }
  return {
    projects: [],
    discovery_calls: [],
    insights: [],
    prd_documents: [],
    issues: []
  };
}

let store: SchemaData = loadData();

function persistData() {
  fs.writeFileSync(dbFilePath, JSON.stringify(store, null, 2), 'utf8');
}

/**
 * Universal Zero-Config Database Adapter.
 * Compatible with SQLite-style prepare().all() / get() / run() interfaces.
 */
export const db = {
  exec(_sql: string) {
    // No-op for compatibility
  },
  prepare(sql: string) {
    const trimmed = sql.trim().toLowerCase();

    return {
      all(...params: any[]) {
        if (trimmed.includes('from projects')) {
          return store.projects;
        }
        if (trimmed.includes('from insights')) {
          const callId = params[0];
          return callId
            ? store.insights.filter(i => i.call_id === callId)
            : store.insights;
        }
        if (trimmed.includes('from issues')) {
          const prdId = params[0];
          return prdId
            ? store.issues.filter(i => i.prd_id === prdId)
            : store.issues;
        }
        if (trimmed.includes('from discovery_calls')) {
          return store.discovery_calls;
        }
        if (trimmed.includes('from prd_documents')) {
          return store.prd_documents;
        }
        return [];
      },

      get(...params: any[]) {
        if (trimmed.includes('count(*)')) {
          return { count: store.projects.length };
        }
        if (trimmed.includes('from discovery_calls where id = ?')) {
          return store.discovery_calls.find(c => c.id === params[0]) || null;
        }
        if (trimmed.includes('from prd_documents where project_id = ?')) {
          return store.prd_documents.find(p => p.project_id === params[0]) || null;
        }
        if (trimmed.includes('from projects where id = ?')) {
          return store.projects.find(p => p.id === params[0]) || null;
        }
        return null;
      },

      run(...params: any[]) {
        if (trimmed.includes('insert into projects')) {
          store.projects.push({
            id: params[0],
            name: params[1],
            description: params[2],
            linear_team_id: params[3],
            github_repo: params[4],
            created_at: new Date().toISOString()
          });
        } else if (trimmed.includes('insert into discovery_calls')) {
          store.discovery_calls.push({
            id: params[0],
            project_id: params[1],
            title: params[2],
            interviewee_name: params[3],
            interviewee_role: params[4],
            raw_transcript: params[5],
            duration_seconds: params[6] || 0,
            created_at: new Date().toISOString()
          });
        } else if (trimmed.includes('insert into insights')) {
          store.insights.push({
            id: params[0],
            call_id: params[1],
            category: params[2],
            title: params[3],
            quote: params[4],
            timestamp_start: params[5],
            timestamp_end: params[6],
            urgency_score: params[7],
            jtbd: params[8],
            created_at: new Date().toISOString()
          });
        } else if (trimmed.includes('insert into prd_documents')) {
          store.prd_documents.push({
            id: params[0],
            project_id: params[1],
            title: params[2],
            version: params[3],
            markdown_content: params[4],
            schema_mermaid: params[5],
            status: params[6],
            created_at: new Date().toISOString()
          });
        } else if (trimmed.includes('insert into issues')) {
          store.issues.push({
            id: params[0],
            prd_id: params[1],
            title: params[2],
            description: params[3],
            type: params[4],
            priority: params[5],
            story_points: params[6],
            gherkin_criteria: params[7],
            citation_quote: params[8],
            citation_timestamp: params[9],
            linear_issue_url: params[10],
            created_at: new Date().toISOString()
          });
        }
        persistData();
        return { changes: 1 };
      }
    };
  }
};
