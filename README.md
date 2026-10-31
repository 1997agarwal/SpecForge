# SpecForge ⚡

<p align="center">
  <b>From 45-Minute Customer Discovery Calls to Executable Engineering Issues in 60 Seconds.</b>
</p>

<p align="center">
  <a href="https://1997agarwal.github.io/SpecForge"><img src="https://img.shields.io/badge/Live_Demo-Interactive_Studio-4F46E5.svg?logo=googlechrome&logoColor=white" alt="Live Demo"></a>
  <a href="#license"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License MIT"></a>
  <a href="#architecture"><img src="https://img.shields.io/badge/Architecture-3--Stage_Pipeline-orange.svg" alt="3-Stage Pipeline"></a>
  <a href="#linear-sync"><img src="https://img.shields.io/badge/Linear-Sync_Ready-5E6AD2.svg?logo=linear&logoColor=white" alt="Linear Sync"></a>
  <a href="#github-issues"><img src="https://img.shields.io/badge/GitHub_Issues-Supported-181717.svg?logo=github&logoColor=white" alt="GitHub Issues"></a>
  <a href="#typescript"><img src="https://img.shields.io/badge/TypeScript-Ready-3178C6.svg?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="SPECIFICATION.md"><img src="https://img.shields.io/badge/PRD_Spec-Complete_v0.1-purple.svg" alt="PRD Spec"></a>
</p>

---

## ⚡ What is SpecForge?

Product Managers and technical founders spend **8–12 hours a week** transcribing user interviews, manually extracting pain points, cross-referencing timestamps, and writing PRDs and Linear tickets.

Generic LLMs produce vague summaries (*"The customer wants speed"*). **SpecForge** is an open-source discovery-to-spec tool. Its 3-stage pipeline is currently **template-based analysis**: no AI model is called yet (see [Status](#-status)). It produces:
1. **Timestamped Customer Insights & JTBD Matrix** (template-based; the bundled scenarios are sample data)
2. **Master Technical PRD** (Markdown with a Mermaid sequence diagram; template output, not model-written)
3. **User Stories** in Gherkin `Given-When-Then` format with story points
4. **One-way Linear push**: creates a Linear project and one issue per story using your Linear API key. GitHub Issues: Markdown copied to the clipboard, no API sync.
5. **Export actions in PRD Studio**: download the PRD `.md`, copy Jira/Notion-style stories and GitHub Issues Markdown
6. **3-Scenario Discovery Switcher** (B2B Billing, AI Search Latency & Rate Limits, and Mobile Checkout Drop-off), backed by bundled sample data
7. **CLI `scan`**: reads a WebVTT/SRT/plain-text transcript and prints statistics and keyword-matched candidate signals derived from that file. No model is called.

---

## 🏗️ System Architecture

```
  [ Audio / Video / VTT ] ──► [ Ingestion & Diarization Layer ]
                                            │
                                            ▼
                     ┌──────────────────────────────────────────┐
                     │    SpecForge 3-Stage Pipeline (template-based)  │
                     └──────────────────────────────────────────┘
                                            │
     ┌──────────────────────────────────────┼──────────────────────────────────────┐
     │                                      │                                      │
     ▼                                      ▼                                      ▼
[ Stage 1: Insight Template ]     [ Stage 2: PRD Template ]         [ Stage 3: Story Template ]
 - Turn parsing                    - Data models & ERDs              - Gherkin scenarios
 - JTBD & urgency fields           - Edge cases & SLAs               - Story point fields
 - Timestamp citations             - API contracts & endpoints       - Linear / GitHub payload
     │                                      │                                      │
     └──────────────────────────────────────┼──────────────────────────────────────┘
                                            │
                                            ▼
                         [ SpecForge Dual-Pane Studio ]
              (Transcript with Citation Pins ◄──► PRD Viewer)
                                            │
                                            ▼
                     [ Linear push (API key required) / Markdown copy ]
```

The diagram shows the intended design. Today the stages fill templates; the model-backed agents described in `server/agents/` are not called.

---

## 🎯 Pre-Loaded Discovery Scenarios

SpecForge comes pre-loaded with **3 realistic, production-grade discovery interviews** accessible via the 1-click **Scenario Switcher** in the top navigation bar:

| Scenario | Domain & Badge | Customer Profile | Pain Point & Architecture Solution |
|---|---|---|---|
| **B2B Billing Reconciliation** | `Fintech / B2B` | **Marcus Vance**<br>*Head of Finance @ ScalePay* | Webhook timeouts silently failing during billing runs, causing 2h manual CSV cross-checks and duplicate dunning notices. Solved via idempotent webhook buffer, Redis worker queue, and automated dunning pause. |
| **AI Search Latency & Rate Limits** | `AI Infrastructure` | **Elena Rostova**<br>*VP of Engineering @ QueryCraft* | RAG query latency spiking to 4.8s p95 during peak hours due to upstream LLM 429 rate limit spikes. Solved via L1 Redis semantic vector cache, multi-model circuit breaker, and instant BM25 lexical fallback. |
| **Mobile Checkout Drop-off** | `Mobile E-Commerce` | **Priya Sharma**<br>*Head of Product @ CartSwift* | 42% iOS mobile cart drop-off from 7-field address forms and Apple Pay token expiry during synchronous tax recalculation. Solved via 1-tap express Apple/Google Pay sheet and sub-200ms async tax engine. |

Switching scenarios immediately updates customer voice evidence, verbatim interview turns, JTBD matrices, technical architecture PRDs, and Gherkin engineering stories.

---

## 📤 1-Click Export Actions in PRD Studio

SpecForge makes it effortless to transition from discovery synthesis to engineering execution with 1-click export actions in the PRD Studio:

1. **Download PRD (.md)**:
   - Exports the complete Master Technical PRD with all functional requirements, data schemas, operational SLAs, and embedded **Mermaid.js sequence diagrams**.
   - Generates a clean markdown file (e.g. `specforge-prd-billing-reconciliation.md`, `specforge-prd-ai-search-resilience.md`, `specforge-prd-mobile-checkout.md`) for version-controlled documentation in GitHub/GitLab.
2. **Copy Jira User Stories**:
   - Formats all engineering issues into clean, universal Markdown tailored for direct copy-pasting into **Jira Cloud / Jira Server** and **Notion**.
   - Preserves issue keys (`[SPEC-101]`), Fibonacci story points, priorities, formatted **Gherkin BDD acceptance criteria** (`Scenario`, `Given`, `When`, `Then`), and customer evidence quotes with timestamp backlinks.

---

## 🚀 Quick Start
 
### 🌐 Try the Live Studio (Zero-Install)
Open the deployed static studio directly in your browser: **[https://1997agarwal.github.io/SpecForge](https://1997agarwal.github.io/SpecForge)**

### 1. Run the Web Studio Locally
```bash
# Clone the repository
git clone https://github.com/1997agarwal/SpecForge.git
cd SpecForge

# Install dependencies
npm install

# Start both frontend & backend concurrently
npm run dev
```
Open **`http://localhost:5173`** to access the Discovery Studio.

### 2. Run the Headless CLI
```bash
# Scan a transcript and print statistics derived from that file
node bin/cli.mjs scan ./tests/fixtures/sample-interview.vtt --output ./scan.md
```

Example output (from `tests/fixtures/sample-interview.vtt`):
```
Transcript: sample-interview.vtt
Turns: 5 | Span: 02:40 | Speakers: Marcus (3), Sarah (2)

Candidate signals (keyword match on this file; no model involved): 4
  [00:15] Sarah (matched "fails"): "Thanks for jumping on, Marcus. Can you walk me through what happens when your reconciliation fails?"
  [00:32] Marcus (matched "waste"): "Every single Monday we waste 2 hours manually downloading CSVs from Stripe because the webhooks time out silently."
  ...
```

The CLI does not call a model, and its signals are keyword matches to review by hand. `npx specforge` is not published yet, and the `--sync`/`--team` flags do not exist. Audio and video input is rejected; transcribe first.

---

## 📋 Status

| Area | What the code does today |
|---|---|
| Studio UI, scenarios, PRD and story export | Works. Content comes from bundled sample data or template fill-in. |
| Insights, PRD, and stories | Template-based. No AI model is called. |
| Linear export | One-way push. Needs a Linear API key (form field or `LINEAR_API_KEY`). Shows an error if the key is missing or Linear rejects a request. Shows success only with the URLs Linear returns. Not tested against a live workspace in CI. |
| GitHub Issues | Markdown copied to the clipboard. No API sync. |
| CLI `scan` | Works on WebVTT/SRT/plain-text transcripts. Deterministic. |
| Not implemented | Model-backed agents, audio/video transcription (Whisper, Deepgram), speaker diarization, Linear pull or bi-directional sync, waveform player, live Mermaid viewer, npm-published `npx specforge`. |

---

## 🧠 The 3-Stage Pipeline (design)

The table below describes the intended agent roles. The prompts are in `server/agents/` and are not connected to a model yet.

| Agent | Mission | Output Format |
|---|---|---|
| **Agent 1: Insight Extractor** (planned) | Parses raw conversation turns, identifies speaker intent, extracts JTBD, and anchors every pain point to an exact `[mm:ss]` timestamp. | Structured JSON with urgency scores (1–5) and verbatim quotes. |
| **Agent 2: Systems Architect** (planned) | Translates customer problems into technical system requirements, relational database schemas (SQLite/Postgres), and API contracts. | Master Technical PRD in Markdown with Mermaid.js ER diagrams. |
| **Agent 3: Story Generator** (planned) | Converts specifications into atomic engineering tickets formatted in Gherkin BDD (`Given-When-Then`) syntax. | Linear and GitHub-ready issue payloads with citation backlinks. |

---

## 📂 Repository Structure

```
SpecForge/
├── AGENTS.md                 # Agent constitution & execution protocol
├── CLAUDE.md                 # CLI commands and code-style guide
├── ROADMAP.md                # Living status of all phases
├── CONTRIBUTING.md           # Contribution guidelines
├── LICENSE                   # MIT License
├── README.md                 # Master documentation
├── bin/
│   └── cli.mjs               # `scan` command (run with node; npx not published)
├── server/
│   ├── index.ts              # Node.js API server (Port 4100)
│   ├── agents/
│   │   ├── insightExtractor.ts  # Agent 1: JTBD & Timestamps
│   │   ├── architectAgent.ts    # Agent 2: Technical Specs
│   │   └── storyGenerator.ts    # Agent 3: Gherkin Stories
│   ├── db/
│   │   ├── database.ts       # better-sqlite3 database instance
│   │   └── schema.ts         # Relational database schema
│   └── services/
│       ├── linearSync.ts     # Linear GraphQL API sync
│       └── transcription.ts  # VTT / Audio parser
└── src/                      # React 18 Dual-Pane Studio
    ├── App.tsx               # Studio orchestrator
    ├── components/
    │   ├── AudioTranscriptViewer.tsx # Transcript with citation pins
    │   ├── PRDViewer.tsx             # Markdown PRD preview
    │   ├── IssueManager.tsx          # Gherkin story inspector
    │   └── LinearSyncModal.tsx       # Export modal
    └── data/
        └── mockDiscovery.ts          # Sample interview data
```

---

## 🔗 Citation Backlink Example

Each exported Linear issue keeps the customer's exact words and timestamp:

> **Customer Voice:** *"We waste 2 hours every Monday manually exporting CSVs to Zapier because the webhooks time out."*  
> — *Interview 04, John Doe @ 14:22*

The Linear issue description carries the quote and timestamp in this form. The example is illustrative; the export does not link to an external host.

---

## 👤 Author

**Harshit Agarwal**  
*AI Product Manager & 0-to-1 Systems Builder*  

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-181717?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/1997agarwal)
[![X](https://img.shields.io/badge/X-Follow_%401997agarwal-181717?style=flat-square&logo=x&logoColor=white)](https://x.com/1997agarwal)
[![GitHub](https://img.shields.io/badge/GitHub-Explore_Repos-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/1997agarwal)
[![Email](https://img.shields.io/badge/Email-Get_in_Touch-181717?style=flat-square&logo=gmail&logoColor=white)](mailto:agarwal.harshit97@gmail.com)

- **GitHub:** [@1997agarwal](https://github.com/1997agarwal)  
- **LinkedIn:** [1997agarwal](https://www.linkedin.com/in/1997agarwal)  
- **X (Twitter):** [@1997agarwal](https://x.com/1997agarwal)  

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
