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

export interface CustomerProfile {
  name: string;
  initials: string;
  role: string;
  company: string;
  urgency: string;
  duration: string;
  summary: string;
}

export interface PrdMetadata {
  title: string;
  targetEpic: string;
  filename: string;
  content: string;
  executiveSummary: string;
  functionalRequirements: Array<{ id: string; title: string; desc: string }>;
  sequenceDiagramSteps: Array<{ label: string; text: string; color: string }>;
  slas: Array<{ title: string; desc: string }>;
}

export interface DiscoveryScenario {
  id: 'billing' | 'ai-search' | 'checkout';
  name: string;
  shortLabel: string;
  badge: string;
  icon: string;
  callTitle: string;
  customer: CustomerProfile;
  prd: PrdMetadata;
  sprintTitle: string;
  turns: Turn[];
  insights: Insight[];
  issues: Issue[];
}

export const scenarios: DiscoveryScenario[] = [
  {
    id: 'billing',
    name: 'B2B Billing Reconciliation',
    shortLabel: 'Billing Recon',
    badge: 'Fintech / B2B',
    icon: 'Zap',
    callTitle: 'ScalePay Interview #04 — Stripe Reconciliation Bottlenecks',
    customer: {
      name: 'Marcus Vance',
      initials: 'MV',
      role: 'Head of Finance',
      company: 'ScalePay',
      urgency: 'High Pain Urgency',
      duration: '04:12 mins',
      summary: 'Interview #04 • Recorded duration: 04:12 mins • Primary challenge: End-of-month Stripe reconciliation timeouts'
    },
    prd: {
      title: 'Automated Billing Reconciliation & Resilient Webhook Ingestion',
      targetEpic: 'ENG-BILLING-RECON',
      filename: 'specforge-prd-billing-reconciliation.md',
      executiveSummary: 'Eliminate manual CSV reconciliations and prevent duplicate dunning notices by establishing an idempotent webhook buffer and automated reconciliation queue. Cuts finance reconciliation time from 2 hours every Monday to 0 manual touchpoints.',
      functionalRequirements: [
        {
          id: 'FR-1: Resilient Webhook Ingestion',
          title: 'Resilient Webhook Ingestion',
          desc: 'Catch all incoming Stripe payment payloads, verify HMAC signatures, and queue them into durable SQLite/Redis storage before heavy processing.'
        },
        {
          id: 'FR-2: Automated Anomaly Detection',
          title: 'Automated Anomaly Detection',
          desc: 'Flag unmatched payment transfers within 60 seconds of invoice creation and alert on-call finance managers via Slack/email.'
        },
        {
          id: 'FR-3: Dunning Freeze Workflow',
          title: 'Dunning Freeze Workflow',
          desc: 'Automatically halt customer-facing overdue email reminders when an invoice is flagged for reconciliation review.'
        },
        {
          id: 'FR-4: Immutable Audit Trail',
          title: 'Immutable Audit Trail',
          desc: 'Record operator email, exact timestamp, prior state, and justification for any manual ledger status override.'
        }
      ],
      sequenceDiagramSteps: [
        { label: '// Ingestion Sequence Flow', text: '', color: 'text-indigo-400' },
        { label: '[Stripe Webhook] ──► POST /v1/webhooks/stripe (HMAC Verification)', text: '', color: 'text-slate-200' },
        { label: '└─► 200 OK Accepted (Saved into webhook_events table)', text: '', color: 'pl-4 text-emerald-400' },
        { label: '└─► Enqueue into Redis / SQLite Worker Queue', text: '', color: 'pl-8 text-amber-300' },
        { label: '└─► Reconciliation Engine evaluates NetSuite Ledger match', text: '', color: 'pl-12 text-slate-300' },
        { label: '└─► Discrepancy detected? Auto-freeze dunning sequence for 48h.', text: '', color: 'pl-16 text-rose-300' }
      ],
      slas: [
        { title: 'Latency Threshold', desc: 'Webhook response p95 < 150ms to prevent Stripe automatic retries.' },
        { title: 'Idempotency Guarantee', desc: 'Unique constraint on stripe_event_id prevents duplicate balance credits.' },
        { title: 'Dunning Safeguard', desc: 'Customer communications paused immediately when reconciliation discrepancy is open.' }
      ],
      content: `
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
`
    },
    sprintTitle: 'Sprint Backlog: Billing Reconciliation & Anomaly Engine',
    turns: [
      {
        speaker: 'Sarah (Interviewer)',
        text: 'Thanks for jumping on, Marcus. Can you walk me through what happens when your end-of-month reconciliation fails?',
        timestamp: '00:15'
      },
      {
        speaker: 'Marcus (Head of Finance)',
        text: 'Honestly, it is a nightmare. Every single Monday, we waste 2 hours manually downloading CSVs from Stripe and matching them against NetSuite because the webhooks time out silently.',
        timestamp: '00:32'
      },
      {
        speaker: 'Sarah (Interviewer)',
        text: 'What do you do when a discrepancy pops up?',
        timestamp: '01:10'
      },
      {
        speaker: 'Marcus (Head of Finance)',
        text: 'We have to ping three different engineers on Slack. Our customers get duplicate overdue notices, which ruins our relationship. If a system could auto-detect failed syncs and alert us before invoices go out, I would pay $500 a month tomorrow without blinking.',
        timestamp: '01:25'
      },
      {
        speaker: 'Marcus (Head of Finance)',
        text: 'Also, our compliance team requires every manual adjustment to have an audit trail with user email and timestamp. Currently people just edit Google Sheets.',
        timestamp: '02:40'
      }
    ],
    insights: [
      {
        id: 'ins-01',
        category: 'pain_point',
        title: 'Silent Stripe Webhook Timeouts',
        quote: 'Every single Monday, we waste 2 hours manually downloading CSVs from Stripe and matching them against NetSuite because the webhooks time out silently.',
        timestamp_start: '00:32',
        timestamp_end: '00:54',
        urgency_score: 5,
        jtbd: 'When Stripe webhooks fail, I want automatic anomaly alerts and retry queues, so I can stop spending 2 hours manually cross-checking CSVs.'
      },
      {
        id: 'ins-02',
        category: 'pain_point',
        title: 'Duplicate Overdue Notices to Customers',
        quote: 'Our customers get duplicate overdue notices, which ruins our relationship.',
        timestamp_start: '01:25',
        timestamp_end: '01:45',
        urgency_score: 5,
        jtbd: 'When invoices are in reconciliation dispute, I want automated dunning pauses, so I can protect customer goodwill.'
      },
      {
        id: 'ins-03',
        category: 'feature_request',
        title: 'Immutable Audit Trail for Adjustments',
        quote: 'Our compliance team requires every manual adjustment to have an audit trail with user email and timestamp.',
        timestamp_start: '02:40',
        timestamp_end: '03:05',
        urgency_score: 4,
        jtbd: 'When finance staff modify an invoice status, I want an immutable audit log recorded, so I can pass compliance audits.'
      }
    ],
    issues: [
      {
        id: 'iss-01',
        title: 'Implement Idempotent Webhook Buffer & Retry Queue',
        description: 'Store raw Stripe payloads immediately to disk before processing to prevent silent loss during spikes.',
        type: 'infra',
        priority: 'urgent',
        story_points: 5,
        gherkin_criteria: 'Given a Stripe charge.succeeded webhook\nWhen payload is delivered\nThen record in webhook_events table with unique constraint and return HTTP 200 within 200ms',
        citation_quote: 'Every single Monday, we waste 2 hours manually downloading CSVs because the webhooks time out silently.',
        citation_timestamp: '00:32',
        linear_issue_url: 'https://linear.app/eng/issue/SPEC-101'
      },
      {
        id: 'iss-02',
        title: 'Automated Dunning Freeze on Unreconciled Invoices',
        description: 'Pause collection sequences whenever an incoming payment is under dispute or pending sync.',
        type: 'feature',
        priority: 'high',
        story_points: 3,
        gherkin_criteria: 'Given an invoice with pending reconciliation\nWhen automated dunning sequence triggers\nThen suppress email and flag account as \'Reconciliation Pending\'',
        citation_quote: 'Our customers get duplicate overdue notices, which ruins our relationship.',
        citation_timestamp: '01:25',
        linear_issue_url: 'https://linear.app/eng/issue/SPEC-102'
      },
      {
        id: 'iss-03',
        title: 'Immutable Audit Log for Ledger Adjustments',
        description: 'Record user ID, timestamp, prior state, and justification for every manual override.',
        type: 'feature',
        priority: 'medium',
        story_points: 2,
        gherkin_criteria: 'Given a finance admin overriding an invoice status\nWhen changes are saved\nThen append record to audit_logs table and require change reason comment',
        citation_quote: 'Our compliance team requires every manual adjustment to have an audit trail.',
        citation_timestamp: '02:40',
        linear_issue_url: 'https://linear.app/eng/issue/SPEC-103'
      }
    ]
  },
  {
    id: 'ai-search',
    name: 'AI Search Latency & Rate Limits',
    shortLabel: 'AI Search Latency',
    badge: 'AI Infrastructure',
    icon: 'Sparkles',
    callTitle: 'QueryCraft Interview #12 — RAG Latency Spikes & 429 Provider Throttling',
    customer: {
      name: 'Elena Rostova',
      initials: 'ER',
      role: 'VP of Engineering',
      company: 'QueryCraft',
      urgency: 'Critical Latency Spike',
      duration: '05:18 mins',
      summary: 'Interview #12 • Recorded duration: 05:18 mins • Primary challenge: RAG latency spikes to 4.8s & 429 LLM provider throttling'
    },
    prd: {
      title: 'Resilient Low-Latency AI Search Architecture with Multi-Tier Semantic Cache',
      targetEpic: 'ENG-AI-SEARCH-PERF',
      filename: 'specforge-prd-ai-search-resilience.md',
      executiveSummary: 'Mitigate 4.8s enterprise search latency spikes and upstream provider 429 rate limits by deploying an L1 Redis semantic vector cache, multi-model adaptive circuit breakers, and sub-100ms BM25 hybrid fallback.',
      functionalRequirements: [
        {
          id: 'FR-1: Semantic Embedding Cache',
          title: 'Semantic Embedding Cache',
          desc: 'Index incoming queries against Redis vector store; queries with cosine similarity > 0.94 return instantly from cache in < 50ms.'
        },
        {
          id: 'FR-2: Provider Circuit Breaker',
          title: 'Provider Circuit Breaker',
          desc: 'Monitor 429 and 5xx rates across Anthropic, OpenAI, and Gemini; automatically failover to hot standby models when error rates exceed 5%.'
        },
        {
          id: 'FR-3: Graceful BM25 Fallback',
          title: 'Graceful BM25 Fallback',
          desc: 'If external LLM inference queues exceed 1500ms, immediately serve ranked lexical BM25 results with a fast-path badge to prevent frozen UI states.'
        },
        {
          id: 'FR-4: Token Budget Throttling',
          title: 'Token Budget Throttling',
          desc: 'Enforce per-tenant token bucket rate limiters to insulate critical enterprise workloads from abusive batch crawl queries.'
        }
      ],
      sequenceDiagramSteps: [
        { label: '// AI Query Routing Sequence Flow', text: '', color: 'text-indigo-400' },
        { label: '[User App] ──► POST /v1/search/semantic (Query: "enterprise churn")', text: '', color: 'text-slate-200' },
        { label: '└─► Check Redis Vector Cache (Similarity > 0.94?)', text: '', color: 'pl-4 text-emerald-400' },
        { label: '└─► Cache Hit? Return Synthetic Answer in 42ms', text: '', color: 'pl-8 text-emerald-300' },
        { label: '└─► Cache Miss? Route to Primary LLM (OpenAI / Anthropic)', text: '', color: 'pl-8 text-amber-300' },
        { label: '└─► 429 Provider Throttled? Circuit Trips ──► Fallback to Hot Standby + BM25', text: '', color: 'pl-12 text-rose-300' }
      ],
      slas: [
        { title: 'Search Latency p95', desc: 'End-to-end response time under 350ms (reduced from 4800ms) across all query classes.' },
        { title: 'Cache Hit Rate Target', desc: 'Achieve > 55% cache hit ratio on repeated enterprise support and documentation queries.' },
        { title: 'Zero Empty Fallbacks', desc: 'Never present blank error screens; BM25 lexical fallback guaranteed within 120ms.' }
      ],
      content: `
# PRD: Resilient Low-Latency AI Search Architecture with Multi-Tier Semantic Cache

## 1. Executive Summary & Objective
Mitigate 4.8s enterprise search latency spikes and upstream provider 429 rate limits by deploying an L1 Redis semantic vector cache, multi-model adaptive circuit breakers, and sub-100ms BM25 hybrid fallback.

## 2. Core Functional Requirements
- **FR-1: Semantic Embedding Cache:** Index incoming queries against Redis vector store; queries with cosine similarity > 0.94 return instantly from cache in < 50ms.
- **FR-2: Provider Circuit Breaker:** Monitor 429 and 5xx rates across Anthropic, OpenAI, and Gemini; automatically failover to hot standby models when error rates exceed 5%.
- **FR-3: Graceful BM25 Fallback:** If external LLM inference queues exceed 1500ms, immediately serve ranked lexical BM25 results with a fast-path badge.
- **FR-4: Token Budget Throttling:** Enforce per-tenant token bucket rate limiters to insulate critical enterprise workloads from abusive batch crawl queries.

## 3. Technical Architecture & Data Flow
\`\`\`mermaid
sequenceDiagram
    participant User as Enterprise Search Client
    participant Router as Intelligent Query Router
    participant Cache as Redis Vector Cache (L1)
    participant Circuit as Rate Limit Circuit Breaker
    participant LLM as Multi-Model Pool (OpenAI / Claude)
    participant Lexical as BM25 Full-Text Engine

    User->>Router: POST /v1/search (query)
    Router->>Cache: Check Vector Cosine Match
    alt Cache Hit (score >= 0.94)
        Cache-->>User: Return 200 OK (Latency: 45ms)
    else Cache Miss
        Router->>Circuit: Verify Upstream Health
        alt Circuit Closed (Healthy)
            Circuit->>LLM: Generate Synthetic Response
            LLM-->>Cache: Asynchronously Seed Cache
            LLM-->>User: Return 200 OK (Latency: 380ms)
        else 429 Rate Limited (Circuit Open)
            Circuit->>Lexical: Trigger Immediate Fallback
            Lexical-->>User: Return BM25 Fast Results (Latency: 95ms)
        end
    end
\`\`\`

## 4. Operational SLAs & Edge Cases
- **Search Latency p95:** < 350ms across all enterprise query classes
- **Cache Hit Target:** > 55% hit ratio on repeated domain queries
- **Zero Empty Fallbacks:** Guaranteed BM25 fallback within 120ms on upstream provider outages.
`
    },
    sprintTitle: 'Sprint Backlog: Resilient AI Search & Semantic Caching Engine',
    turns: [
      {
        speaker: 'David (Interviewer)',
        text: 'Elena, thanks for taking the time. How has the surge in enterprise queries affected your AI search pipeline?',
        timestamp: '00:18'
      },
      {
        speaker: 'Elena (VP of Engineering)',
        text: 'Our p95 search latency has degraded from 400 milliseconds to 4.8 seconds. Whenever OpenAI or Anthropic hits rate limits during peak US hours, queries just hang and fail silently.',
        timestamp: '00:42'
      },
      {
        speaker: 'David (Interviewer)',
        text: 'What is the user impact when these rate limit timeouts occur?',
        timestamp: '01:15'
      },
      {
        speaker: 'Elena (VP of Engineering)',
        text: "Enterprise users stare at a blank loading skeleton for 10 seconds, then get an empty error banner. We've had two Fortune 500 pilots pause renewal talks because search feels completely broken.",
        timestamp: '01:34'
      },
      {
        speaker: 'Elena (VP of Engineering)',
        text: 'At least 60% of enterprise queries are semantic duplicates. If we had a tiered vector cache in Redis with an instant BM25 keyword fallback during 429 surges, our p95 would drop back under 250ms.',
        timestamp: '02:22'
      }
    ],
    insights: [
      {
        id: 'ins-ai-01',
        category: 'pain_point',
        title: 'Search Latency Spikes to 4.8s Under Load',
        quote: 'Our p95 search latency has degraded from 400 milliseconds to 4.8 seconds. Whenever OpenAI or Anthropic hits rate limits during peak US hours, queries just hang and fail silently.',
        timestamp_start: '00:42',
        timestamp_end: '01:05',
        urgency_score: 5,
        jtbd: 'When external LLM providers hit rate limits, I want resilient multi-model routing and semantic caching, so enterprise search queries never exceed 500ms.'
      },
      {
        id: 'ins-ai-02',
        category: 'pain_point',
        title: 'Empty Timeout Banners on 429 Errors',
        quote: "Enterprise users stare at a blank loading skeleton for 10 seconds, then get an empty error banner. We've had two Fortune 500 pilots pause renewal talks because search feels completely broken.",
        timestamp_start: '01:34',
        timestamp_end: '01:58',
        urgency_score: 5,
        jtbd: 'When LLM rate limits or API outages occur, I want automatic fallback to BM25 keyword search with cached summaries, so enterprise users never receive an empty error.'
      },
      {
        id: 'ins-ai-03',
        category: 'feature_request',
        title: 'High Semantic Redundancy & Tiered Caching',
        quote: 'At least 60% of enterprise queries are semantic duplicates. If we had a tiered vector cache in Redis with an instant BM25 keyword fallback during 429 surges, our p95 would drop back under 250ms.',
        timestamp_start: '02:22',
        timestamp_end: '02:48',
        urgency_score: 4,
        jtbd: 'When repeated or similar queries are submitted, I want a high-speed L1 vector embedding cache in Redis, so 60% of search traffic bypasses external LLM calls.'
      }
    ],
    issues: [
      {
        id: 'iss-ai-01',
        title: 'Multi-Tier Vector Embedding Cache in Redis',
        description: 'Implement cosine-similarity lookups over dense vector embeddings in Redis to serve repeated enterprise queries in under 50ms.',
        type: 'infra',
        priority: 'urgent',
        story_points: 5,
        gherkin_criteria: 'Given an incoming enterprise search query\nWhen cosine similarity against Redis vector cache exceeds 0.94\nThen return cached synthetic response within 50ms without invoking external LLM APIs',
        citation_quote: 'At least 60% of enterprise queries are semantic duplicates... our p95 would drop back under 250ms.',
        citation_timestamp: '02:22',
        linear_issue_url: 'https://linear.app/eng/issue/SPEC-201'
      },
      {
        id: 'iss-ai-02',
        title: 'Adaptive Provider Rate-Limit Circuit Breaker',
        description: 'Track rolling error windows and automatically trip circuit to hot standby LLMs upon detecting HTTP 429 or 5xx rate limits.',
        type: 'infra',
        priority: 'urgent',
        story_points: 5,
        gherkin_criteria: 'Given an active LLM provider returning HTTP 429 Too Many Requests\nWhen error count exceeds 3 in a 10s rolling window\nThen trip circuit breaker and route subsequent queries to secondary provider within 50ms',
        citation_quote: 'Whenever OpenAI or Anthropic hits rate limits during peak US hours, queries just hang and fail silently.',
        citation_timestamp: '00:42',
        linear_issue_url: 'https://linear.app/eng/issue/SPEC-202'
      },
      {
        id: 'iss-ai-03',
        title: 'Hybrid BM25 Full-Text Fallback on API Exhaustion',
        description: 'Guarantee high-availability search answers by immediately falling back to indexed BM25 results when LLM providers time out.',
        type: 'feature',
        priority: 'high',
        story_points: 3,
        gherkin_criteria: 'Given all external LLM provider circuits are open or timed out (>1500ms)\nWhen a user executes an enterprise search\nThen return BM25 indexed lexical results with a \'Fast Keyword Mode\' indicator',
        citation_quote: "Enterprise users stare at a blank loading skeleton for 10 seconds, then get an empty error banner. We've had two Fortune 500 pilots pause renewal talks.",
        citation_timestamp: '01:34',
        linear_issue_url: 'https://linear.app/eng/issue/SPEC-203'
      }
    ]
  },
  {
    id: 'checkout',
    name: 'Mobile Checkout Drop-off',
    shortLabel: 'Mobile Checkout',
    badge: 'Mobile E-Commerce',
    icon: 'Smartphone',
    callTitle: 'CartSwift Interview #09 — 42% iOS Mobile Drop-off & Apple Pay Latency',
    customer: {
      name: 'Priya Sharma',
      initials: 'PS',
      role: 'Head of Product',
      company: 'CartSwift',
      urgency: 'High GMV Leakage',
      duration: '03:45 mins',
      summary: 'Interview #09 • Recorded duration: 03:45 mins • Primary challenge: 42% iOS mobile checkout abandonment & tax API latency'
    },
    prd: {
      title: 'High-Conversion Mobile Checkout with Express 1-Tap Wallet Integration',
      targetEpic: 'ENG-MOBILE-CHECKOUT',
      filename: 'specforge-prd-mobile-checkout.md',
      executiveSummary: 'Recover $180k/month in abandoned mobile cart GMV by replacing a 7-step manual form with a 1-tap Apple/Google Pay express sheet and sub-200ms asynchronous tax and shipping calculation.',
      functionalRequirements: [
        {
          id: 'FR-1: Native Wallet Express Sheet',
          title: 'Native Wallet Express Sheet',
          desc: 'Detect iOS Safari and Android Chrome; present 1-tap Apple Pay and Google Pay sheets directly on product and cart review screens.'
        },
        {
          id: 'FR-2: Asynchronous Tax Resolution',
          title: 'Asynchronous Tax Resolution',
          desc: 'Decouple tax calculation from checkout render; execute background Avalara/TaxJar queries in < 180ms to prevent payment session timeouts.'
        },
        {
          id: 'FR-3: Predictive Address Autocomplete',
          title: 'Predictive Address Autocomplete',
          desc: 'Provide Google Places address autocomplete on character 3, auto-filling street, city, state, and postal code in a single tap.'
        },
        {
          id: 'FR-4: Ephemeral Guest Checkout',
          title: 'Ephemeral Guest Checkout',
          desc: 'Allow instantaneous purchase completion without mandatory password creation; lazily create authenticated account via magic link post-order.'
        }
      ],
      sequenceDiagramSteps: [
        { label: '// Mobile Express Checkout Flow', text: '', color: 'text-indigo-400' },
        { label: '[Mobile Safari] ──► Tap "Buy with Apple Pay" Button', text: '', color: 'text-slate-200' },
        { label: '└─► Present Native Apple Pay Sheet (Contact & Address preloaded)', text: '', color: 'pl-4 text-emerald-400' },
        { label: '└─► Event: onshippingcontactselected (Postal Code: 94107)', text: '', color: 'pl-8 text-indigo-300' },
        { label: '└─► Asynchronous Tax Engine recalculates total in 140ms', text: '', color: 'pl-12 text-amber-300' },
        { label: '└─► Biometric FaceID Confirmed ──► Instant Order Created ($180k GMV saved)', text: '', color: 'pl-16 text-emerald-300' }
      ],
      slas: [
        { title: 'Tax Calculation SLA', desc: 'Asynchronous tax and shipping calculation response p95 < 200ms to avoid Apple Pay token timeouts.' },
        { title: 'Payment Sheet Load', desc: 'Native wallet sheet rendered in under 150ms from user tap.' },
        { title: 'Funnel Recovery', desc: 'Target mobile cart conversion uplift from 58% to > 76% across iOS and Android devices.' }
      ],
      content: `
# PRD: High-Conversion Mobile Checkout with Express 1-Tap Wallet Integration

## 1. Executive Summary & Objective
Recover $180k/month in abandoned mobile cart GMV by replacing a 7-step manual form with a 1-tap Apple/Google Pay express sheet and sub-200ms asynchronous tax and shipping calculation.

## 2. Core Functional Requirements
- **FR-1: Native Wallet Express Sheet:** Detect iOS Safari and Android Chrome; present 1-tap Apple Pay and Google Pay sheets directly on product and cart review screens.
- **FR-2: Asynchronous Tax Resolution:** Decouple tax calculation from checkout render; execute background Avalara/TaxJar queries in < 180ms to prevent payment session timeouts.
- **FR-3: Predictive Address Autocomplete:** Provide Google Places address autocomplete on character 3, auto-filling street, city, state, and postal code in a single tap.
- **FR-4: Ephemeral Guest Checkout:** Allow instantaneous purchase completion without mandatory password creation; lazily create authenticated account via magic link post-order.

## 3. Technical Architecture & Data Flow
\`\`\`mermaid
sequenceDiagram
    participant Shopper as iOS Safari Shopper
    participant Sheet as Apple Pay Native Sheet
    participant TaxEngine as Async Tax Service (TaxJar)
    participant Core as Order Processing Service
    participant Gateway as Stripe Payment Gateway

    Shopper->>Sheet: Tap "Apple Pay" (Biometric Ready)
    Sheet->>TaxEngine: onshippingcontactselected(Postal Code)
    TaxEngine-->>Sheet: Async Updated Totals (<180ms)
    Shopper->>Sheet: Double-click & FaceID Authorized
    Sheet->>Gateway: Cryptographic Payment Token
    Gateway-->>Core: Charge Captured (200 OK)
    Core-->>Shopper: Order Confirmation & Magic Link
\`\`\`

## 4. Operational SLAs & Edge Cases
- **Tax API p95 Latency:** < 200ms to comply with Apple Pay session timeout limits
- **Sheet Render Latency:** < 150ms on mobile viewports
- **Postal Code Edge Cases:** Auto-fallback to regional tax estimations if third-party tax provider times out.
`
    },
    sprintTitle: 'Sprint Backlog: High-Conversion 1-Tap Mobile Checkout',
    turns: [
      {
        speaker: 'Alex (Interviewer)',
        text: 'Priya, can you walk me through the funnel data on mobile checkout?',
        timestamp: '00:12'
      },
      {
        speaker: 'Priya (Head of Product)',
        text: 'We are losing 42% of iOS customers between cart review and the final payment tap. Our multi-step shipping address form is 7 fields long, and typing on mobile keyboards is killing conversion.',
        timestamp: '00:30'
      },
      {
        speaker: 'Alex (Interviewer)',
        text: 'What happens when shoppers attempt to use Apple Pay?',
        timestamp: '01:05'
      },
      {
        speaker: 'Priya (Head of Product)',
        text: "It's brutal. Apple Pay sessions expire after 30 seconds, and our synchronous tax calculation service takes 4.2 seconds to resolve postal codes, causing the payment sheet to error out.",
        timestamp: '01:22'
      },
      {
        speaker: 'Priya (Head of Product)',
        text: 'If we implement a 1-tap express Apple/Google Pay sheet that resolves shipping and calculates tax asynchronously under 200ms, our mobile GMV would jump by at least $180,000 every single month.',
        timestamp: '02:15'
      }
    ],
    insights: [
      {
        id: 'ins-chk-01',
        category: 'pain_point',
        title: '42% Drop-off at Mobile Shipping Form',
        quote: 'We are losing 42% of iOS customers between cart review and the final payment tap. Our multi-step shipping address form is 7 fields long, and typing on mobile keyboards is killing conversion.',
        timestamp_start: '00:30',
        timestamp_end: '00:52',
        urgency_score: 5,
        jtbd: 'When purchasing on mobile devices, I want 1-tap Apple Pay/Google Pay address ingestion, so I don\'t have to fill 7 tedious form fields.'
      },
      {
        id: 'ins-chk-02',
        category: 'pain_point',
        title: 'Apple Pay Expiry from Synchronous Tax API',
        quote: "Apple Pay sessions expire after 30 seconds, and our synchronous tax calculation service takes 4.2 seconds to resolve postal codes, causing the payment sheet to error out.",
        timestamp_start: '01:22',
        timestamp_end: '01:48',
        urgency_score: 5,
        jtbd: 'When Apple Pay sheet is presented, I want tax recalculations to complete asynchronously under 200ms, so customer payment tokens do not time out.'
      },
      {
        id: 'ins-chk-03',
        category: 'feature_request',
        title: '$180k Monthly GMV Leakage from Friction',
        quote: 'If we implement a 1-tap express Apple/Google Pay sheet that resolves shipping and calculates tax asynchronously under 200ms, our mobile GMV would jump by at least $180,000 every single month.',
        timestamp_start: '02:15',
        timestamp_end: '02:40',
        urgency_score: 4,
        jtbd: 'When customers arrive with mobile wallets, I want zero-friction express checkout, so CartSwift captures recovered mobile sales.'
      }
    ],
    issues: [
      {
        id: 'iss-chk-01',
        title: 'Native Apple Pay & Google Pay Express Sheet Integration',
        description: 'Enable instant 1-tap wallet checkout directly from the cart drawer, bypassing manual shipping and billing address forms.',
        type: 'feature',
        priority: 'urgent',
        story_points: 5,
        gherkin_criteria: 'Given a customer browsing on Safari iOS or Chrome Android\nWhen clicking \'1-Tap Express Checkout\'\nThen present native Apple/Google Pay sheet pre-populated with saved addresses within 150ms',
        citation_quote: 'Our multi-step shipping address form is 7 fields long, and typing on mobile keyboards is killing conversion.',
        citation_timestamp: '00:30',
        linear_issue_url: 'https://linear.app/eng/issue/SPEC-301'
      },
      {
        id: 'iss-chk-02',
        title: 'Asynchronous Sub-200ms Tax & Shipping Calculator',
        description: 'Decouple tax calculation onto an async worker queue to ensure payment sheet callbacks resolve in < 200ms.',
        type: 'infra',
        priority: 'urgent',
        story_points: 5,
        gherkin_criteria: 'Given an Apple Pay onshippingcontactselected event\nWhen postal code is transmitted\nThen return updated order total and tax breakdown within 200ms before payment session timeout',
        citation_quote: 'Apple Pay sessions expire after 30 seconds, and our synchronous tax calculation service takes 4.2 seconds.',
        citation_timestamp: '01:22',
        linear_issue_url: 'https://linear.app/eng/issue/SPEC-302'
      },
      {
        id: 'iss-chk-03',
        title: 'Mobile Address Autocomplete & Predictive Validation',
        description: 'Integrate Google Places predictive search for manual checkout fallbacks with real-time postal code verification.',
        type: 'feature',
        priority: 'high',
        story_points: 3,
        gherkin_criteria: 'Given a customer manually typing a delivery address on mobile\nWhen 3 characters are entered in address line 1\nThen display Google Places predictive autocomplete options and auto-fill city, state, and zip',
        citation_quote: 'If we implement a 1-tap express Apple/Google Pay sheet... our mobile GMV would jump by at least $180,000 every single month.',
        citation_timestamp: '02:15',
        linear_issue_url: 'https://linear.app/eng/issue/SPEC-303'
      }
    ]
  }
];

// Backwards compatibility exports
export const initialTurns: Turn[] = scenarios[0].turns;
export const initialInsights: Insight[] = scenarios[0].insights;
export const initialPrd: string = scenarios[0].prd.content;
export const initialIssues: Issue[] = scenarios[0].issues;
