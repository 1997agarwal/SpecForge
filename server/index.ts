import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './db/database.ts';
import { parseTranscript } from './services/transcription.ts';
import { syncToLinear } from './services/linearSync.ts';
import { INSIGHT_EXTRACTOR_SYSTEM_PROMPT } from './agents/insightExtractor.ts';
import { ARCHITECT_AGENT_SYSTEM_PROMPT } from './agents/architectAgent.ts';
import { STORY_GENERATOR_SYSTEM_PROMPT } from './agents/storyGenerator.ts';

const app = express();
const PORT = process.env.PORT || 4100;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Seed initial sample project & call if database is fresh
function seedInitialData() {
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
  if (projectCount.count === 0) {
    const projectId = 'proj-seed-01';
    db.prepare(`
      INSERT INTO projects (id, name, description, linear_team_id, github_repo)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      projectId,
      'Automated Billing & AR Reconciliation',
      'Customer discovery for B2B payment reconciliation engine and webhook syncing.',
      'ENG',
      '1997agarwal/SpecForge'
    );

    const callId = 'call-seed-01';
    const sampleTranscript = `
[00:15] Sarah (Interviewer): Thanks for jumping on, Marcus. Can you walk me through what happens when your end-of-month reconciliation fails?
[00:32] Marcus (Head of Finance): Honestly, it is a nightmare. Every single Monday, we waste 2 hours manually downloading CSVs from Stripe and matching them against NetSuite because the webhooks time out silently.
[01:10] Sarah (Interviewer): What do you do when a discrepancy pops up?
[01:25] Marcus (Head of Finance): We have to ping three different engineers on Slack. Our customers get duplicate overdue notices, which ruins our relationship. If a system could auto-detect failed syncs and alert us before invoices go out, I would pay $500 a month tomorrow without blinking.
[02:40] Marcus (Head of Finance): Also, our compliance team requires every manual adjustment to have an audit trail with user email and timestamp. Currently people just edit Google Sheets.
    `.trim();

    db.prepare(`
      INSERT INTO discovery_calls (id, project_id, title, interviewee_name, interviewee_role, raw_transcript, duration_seconds)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      callId,
      projectId,
      'Customer Interview #04 — Stripe Reconciliation Bottlenecks',
      'Marcus Vance',
      'Head of Finance @ ScalePay',
      sampleTranscript,
      240
    );

    // Seed insights
    const insertInsight = db.prepare(`
      INSERT INTO insights (id, call_id, category, title, quote, timestamp_start, timestamp_end, urgency_score, jtbd)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertInsight.run(
      'ins-01',
      callId,
      'pain_point',
      'Silent Stripe Webhook Timeouts',
      'Every single Monday, we waste 2 hours manually downloading CSVs from Stripe and matching them against NetSuite because the webhooks time out silently.',
      '00:32',
      '00:54',
      5,
      'When Stripe webhooks fail, I want automatic anomaly alerts and retry queues, so I can stop spending 2 hours manually cross-checking CSVs.'
    );

    insertInsight.run(
      'ins-02',
      callId,
      'pain_point',
      'Duplicate Overdue Notices to Customers',
      'Our customers get duplicate overdue notices, which ruins our relationship.',
      '01:25',
      '01:45',
      5,
      'When invoices are in reconciliation dispute, I want automated dunning pauses, so I can protect customer goodwill.'
    );

    insertInsight.run(
      'ins-03',
      callId,
      'feature_request',
      'Immutable Audit Trail for Adjustments',
      'Our compliance team requires every manual adjustment to have an audit trail with user email and timestamp.',
      '02:40',
      '03:05',
      4,
      'When finance staff modify an invoice status, I want an immutable audit log recorded, so I can pass compliance audits.'
    );

    // Seed PRD
    const prdId = 'prd-seed-01';
    const prdMarkdown = `
# PRD: Automated Billing Reconciliation & Resilient Webhook Ingestion

## 1. Executive Summary
Eliminate manual CSV reconciliations and prevent embarrassing duplicate dunning notices by establishing an idempotent webhook buffer and automated reconciliation queue.

## 2. Technical Architecture & Data Flow
\`\`\`mermaid
sequenceDiagram
    participant Stripe as Stripe Webhook
    participant Ingest as SpecForge Event Buffer
    participant Queue as Redis / SQLite Queue
    participant Recon as Reconciliation Worker
    participant Ledger as NetSuite Ledger

    Stripe->>Ingest: POST /v1/webhooks/stripe
    Ingest-->>Stripe: 200 OK (Signed & Stored)
    Ingest->>Queue: Enqueue Event ID
    Queue->>Recon: Consume Event
    Recon->>Ledger: Idempotent Ledger Entry
\`\`\`

## 3. Relational Schema & Entity Contracts
- \`webhook_events\`: id, source, payload, signature, status, retry_count, created_at
- \`reconciliation_logs\`: id, event_id, invoice_id, matched_amount, discrepancy, audit_trail_json

## 4. Operational SLAs & Edge Cases
- **Webhook Ingestion p95 Latency:** < 150ms
- **Duplicate Prevention:** Enforce unique constraint on \`stripe_event_id\`
- **Dunning Freeze:** Invoices with reconciliation discrepancy auto-halt automated dunning emails for 48h.
    `.trim();

    db.prepare(`
      INSERT INTO prd_documents (id, project_id, title, version, markdown_content, schema_mermaid, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      prdId,
      projectId,
      'Billing Reconciliation & Resilient Webhook Ingestion Engine',
      1,
      prdMarkdown,
      'erDiagram WEBHOOK_EVENT ||--o{ RECONCILIATION_LOG : processes',
      'approved'
    );

    // Seed Issues
    const insertIssue = db.prepare(`
      INSERT INTO issues (id, prd_id, title, description, type, priority, story_points, gherkin_criteria, citation_quote, citation_timestamp, linear_issue_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertIssue.run(
      'iss-01',
      prdId,
      'Implement Idempotent Webhook Buffer & Retry Queue',
      'Store raw Stripe payloads immediately to disk before processing to prevent silent loss.',
      'infra',
      'urgent',
      5,
      'Given a Stripe charge.succeeded webhook\nWhen payload is delivered\nThen record in webhook_events table with unique constraint and return HTTP 200 within 200ms',
      'Every single Monday, we waste 2 hours manually downloading CSVs because the webhooks time out silently.',
      '00:32',
      'https://linear.app/eng/issue/SPEC-101'
    );

    insertIssue.run(
      'iss-02',
      prdId,
      'Automated Dunning Freeze on Unreconciled Invoices',
      'Pause collection sequences whenever an incoming payment is under dispute or pending sync.',
      'feature',
      'high',
      3,
      'Given an invoice with pending reconciliation\nWhen automated dunning sequence triggers\nThen suppress email and flag account as "Reconciliation Pending"',
      'Our customers get duplicate overdue notices, which ruins our relationship.',
      '01:25',
      'https://linear.app/eng/issue/SPEC-102'
    );

    insertIssue.run(
      'iss-03',
      prdId,
      'Immutable Audit Log for Ledger Adjustments',
      'Record user ID, timestamp, prior state, and justification for every manual override.',
      'feature',
      'medium',
      2,
      'Given a finance admin overriding an invoice status\nWhen changes are saved\nThen append record to audit_logs table and require change reason comment',
      'Our compliance team requires every manual adjustment to have an audit trail.',
      '02:40',
      'https://linear.app/eng/issue/SPEC-103'
    );
  }
}

seedInitialData();

// REST Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'SpecForge Multi-Agent Engine',
    version: '0.1.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/projects', (req: Request, res: Response) => {
  const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  res.json({ projects });
});

app.get('/api/calls/:id', (req: Request, res: Response) => {
  const call = db.prepare('SELECT * FROM discovery_calls WHERE id = ?').get(req.params.id);
  if (!call) {
    return res.status(404).json({ error: 'Call not found' });
  }

  const insights = db.prepare('SELECT * FROM insights WHERE call_id = ? ORDER BY urgency_score DESC').all(req.params.id);
  const turns = parseTranscript((call as any).raw_transcript);

  res.json({ call, turns, insights });
});

app.get('/api/prd/:projectId', (req: Request, res: Response) => {
  const prd = db.prepare('SELECT * FROM prd_documents WHERE project_id = ? ORDER BY version DESC LIMIT 1').get(req.params.projectId);
  if (!prd) {
    return res.status(404).json({ error: 'PRD not found' });
  }

  const issues = db.prepare('SELECT * FROM issues WHERE prd_id = ? ORDER BY created_at ASC').all((prd as any).id);
  res.json({ prd, issues });
});

app.post('/api/sync/linear', async (req: Request, res: Response) => {
  try {
    const { apiKey, teamId, epicTitle, issues } = req.body;
    const result = await syncToLinear({ apiKey, teamId, epicTitle, issues });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ SpecForge Engine active on http://localhost:${PORT}`);
});
