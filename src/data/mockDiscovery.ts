export interface Turn {
  speaker: string;
  text: string;
  timestamp: string;
}

export interface Insight {
  id: string;
  category: 'pain_point' | 'feature_request' | 'workaround';
  title: string;
  quote: string;
  timestamp_start: string;
  timestamp_end: string;
  urgency_score: number;
  jtbd: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  type: 'feature' | 'infra' | 'bug';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  story_points: number;
  gherkin_criteria: string;
  citation_quote: string;
  citation_timestamp: string;
  linear_issue_url?: string;
}

export const initialTurns: Turn[] = [
  {
    speaker: "Sarah (Interviewer)",
    text: "Thanks for jumping on, Marcus. Can you walk me through what happens when your end-of-month reconciliation fails?",
    timestamp: "00:15"
  },
  {
    speaker: "Marcus (Head of Finance)",
    text: "Honestly, it is a nightmare. Every single Monday, we waste 2 hours manually downloading CSVs from Stripe and matching them against NetSuite because the webhooks time out silently.",
    timestamp: "00:32"
  },
  {
    speaker: "Sarah (Interviewer)",
    text: "What do you do when a discrepancy pops up?",
    timestamp: "01:10"
  },
  {
    speaker: "Marcus (Head of Finance)",
    text: "We have to ping three different engineers on Slack. Our customers get duplicate overdue notices, which ruins our relationship. If a system could auto-detect failed syncs and alert us before invoices go out, I would pay $500 a month tomorrow without blinking.",
    timestamp: "01:25"
  },
  {
    speaker: "Marcus (Head of Finance)",
    text: "Also, our compliance team requires every manual adjustment to have an audit trail with user email and timestamp. Currently people just edit Google Sheets.",
    timestamp: "02:40"
  }
];

export const initialInsights: Insight[] = [
  {
    id: "ins-01",
    category: "pain_point",
    title: "Silent Stripe Webhook Timeouts",
    quote: "Every single Monday, we waste 2 hours manually downloading CSVs from Stripe and matching them against NetSuite because the webhooks time out silently.",
    timestamp_start: "00:32",
    timestamp_end: "00:54",
    urgency_score: 5,
    jtbd: "When Stripe webhooks fail, I want automatic anomaly alerts and retry queues, so I can stop spending 2 hours manually cross-checking CSVs."
  },
  {
    id: "ins-02",
    category: "pain_point",
    title: "Duplicate Overdue Notices to Customers",
    quote: "Our customers get duplicate overdue notices, which ruins our relationship.",
    timestamp_start: "01:25",
    timestamp_end: "01:45",
    urgency_score: 5,
    jtbd: "When invoices are in reconciliation dispute, I want automated dunning pauses, so I can protect customer goodwill."
  },
  {
    id: "ins-03",
    category: "feature_request",
    title: "Immutable Audit Trail for Adjustments",
    quote: "Our compliance team requires every manual adjustment to have an audit trail with user email and timestamp.",
    timestamp_start: "02:40",
    timestamp_end: "03:05",
    urgency_score: 4,
    jtbd: "When finance staff modify an invoice status, I want an immutable audit log recorded, so I can pass compliance audits."
  }
];

export const initialPrd = `
# PRD: Automated Billing Reconciliation & Resilient Webhook Ingestion

## 1. Executive Summary & Objective
Eliminate manual CSV reconciliations and prevent embarrassing duplicate dunning notices by establishing an idempotent webhook buffer and automated reconciliation queue.

## 2. Core Functional Requirements
- **FR-1: Resilient Webhook Ingest:** Catch all incoming Stripe payloads, verify HMAC signatures, and queue them into durable SQLite/Redis storage.
- **FR-2: Automated Anomaly Detection:** Flag unmatched payment transfers within 60 seconds of invoice creation.
- **FR-3: Dunning Freeze Workflow:** Automatically halt automated email follow-ups when an invoice is flagged for review.
- **FR-4: Immutable Audit Trail:** Record operator email, timestamp, and delta for any status override.

## 3. Technical Architecture & Data Flow
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

## 4. Operational SLAs & Edge Cases
- **Webhook Ingestion p95 Latency:** < 150ms
- **Duplicate Prevention:** Enforce unique constraint on \`stripe_event_id\`
- **Dunning Freeze:** Invoices with reconciliation discrepancy auto-halt automated dunning emails for 48h.
`;

export const initialIssues: Issue[] = [
  {
    id: "iss-01",
    title: "Implement Idempotent Webhook Buffer & Retry Queue",
    description: "Store raw Stripe payloads immediately to disk before processing to prevent silent loss during spikes.",
    type: "infra",
    priority: "urgent",
    story_points: 5,
    gherkin_criteria: "Given a Stripe charge.succeeded webhook\nWhen payload is delivered\nThen record in webhook_events table with unique constraint and return HTTP 200 within 200ms",
    citation_quote: "Every single Monday, we waste 2 hours manually downloading CSVs because the webhooks time out silently.",
    citation_timestamp: "00:32",
    linear_issue_url: "https://linear.app/eng/issue/SPEC-101"
  },
  {
    id: "iss-02",
    title: "Automated Dunning Freeze on Unreconciled Invoices",
    description: "Pause collection sequences whenever an incoming payment is under dispute or pending sync.",
    type: "feature",
    priority: "high",
    story_points: 3,
    gherkin_criteria: "Given an invoice with pending reconciliation\nWhen automated dunning sequence triggers\nThen suppress email and flag account as 'Reconciliation Pending'",
    citation_quote: "Our customers get duplicate overdue notices, which ruins our relationship.",
    citation_timestamp: "01:25",
    linear_issue_url: "https://linear.app/eng/issue/SPEC-102"
  },
  {
    id: "iss-03",
    title: "Immutable Audit Log for Ledger Adjustments",
    description: "Record user ID, timestamp, prior state, and justification for every manual override.",
    type: "feature",
    priority: "medium",
    story_points: 2,
    gherkin_criteria: "Given a finance admin overriding an invoice status\nWhen changes are saved\nThen append record to audit_logs table and require change reason comment",
    citation_quote: "Our compliance team requires every manual adjustment to have an audit trail.",
    citation_timestamp: "02:40",
    linear_issue_url: "https://linear.app/eng/issue/SPEC-103"
  }
];
