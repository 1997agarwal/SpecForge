# SpecForge ⚡

<p align="center">
  <b>From 45-Minute Customer Discovery Calls to Executable Engineering Issues in 60 Seconds.</b>
</p>

<p align="center">
  <a href="#license"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License MIT"></a>
  <a href="#architecture"><img src="https://img.shields.io/badge/Architecture-3--Stage_Agentic-orange.svg" alt="3-Stage Agentic"></a>
  <a href="#linear-sync"><img src="https://img.shields.io/badge/Linear-Sync_Ready-5E6AD2.svg?logo=linear&logoColor=white" alt="Linear Sync"></a>
  <a href="#github-issues"><img src="https://img.shields.io/badge/GitHub_Issues-Supported-181717.svg?logo=github&logoColor=white" alt="GitHub Issues"></a>
  <a href="#typescript"><img src="https://img.shields.io/badge/TypeScript-Ready-3178C6.svg?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="SPECIFICATION.md"><img src="https://img.shields.io/badge/PRD_Spec-Complete_v0.1-purple.svg" alt="PRD Spec"></a>
</p>

---

## ⚡ What is SpecForge?

Product Managers and technical founders spend **8–12 hours a week** transcribing user interviews, manually extracting pain points, cross-referencing timestamps, and writing PRDs and Linear tickets.

Generic LLMs produce vague summaries (*"The customer wants speed"*). **SpecForge** is an open-source autonomous discovery-to-spec engine that runs a **3-stage agentic pipeline** to produce:
1. **Verbatim Timestamped Customer Insights & JTBD Matrix**
2. **Master Technical PRD** (Data Models, API Contracts, Edge Cases, SLAs)
3. **Executable User Stories** (Gherkin `Given-When-Then` format with story points)
4. **1-Click Sync to Linear & GitHub Issues** with citation backlinks directly to the user's voice

---

## 🏗️ System Architecture

```
  [ Audio / Video / VTT ] ──► [ Ingestion & Diarization Layer ]
                                            │
                                            ▼
                     ┌──────────────────────────────────────────┐
                     │    SpecForge Multi-Agent Pipeline        │
                     └──────────────────────────────────────────┘
                                            │
     ┌──────────────────────────────────────┼──────────────────────────────────────┐
     │                                      │                                      │
     ▼                                      ▼                                      ▼
[ Agent 1: Insight Extractor ]    [ Agent 2: Systems Architect ]    [ Agent 3: Story & QA Agent ]
 - Speaker diarization             - Data models & ERDs              - Gherkin test cases
 - JTBD & pain urgency             - Edge cases & latency budgets    - Story point estimation
 - Verbatim timestamp citations    - API contracts & endpoints       - Linear / GitHub payload
     │                                      │                                      │
     └──────────────────────────────────────┼──────────────────────────────────────┘
                                            │
                                            ▼
                         [ SpecForge Dual-Pane Studio ]
              (Transcript with Citation Pins ◄──► Live PRD Editor)
                                            │
                                            ▼
                     [ 1-Click Sync: Linear API / GitHub Issues ]
```

---

## 🚀 Quick Start

### 1. Run the Web Studio
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

### 2. Run via Headless CLI
```bash
# Run discovery analysis directly from your terminal
npx specforge scan ./interviews/customer_call_01.vtt \
  --output ./docs/PRD.md \
  --sync linear \
  --team ENG
```

---

## 🧠 The 3-Stage Agentic Pipeline

| Agent | Mission | Output Format |
|---|---|---|
| **Agent 1: Insight Extractor** | Parses raw conversation turns, identifies speaker intent, extracts JTBD, and anchors every pain point to an exact `[mm:ss]` timestamp. | Structured JSON with urgency scores (1–5) and verbatim quotes. |
| **Agent 2: Systems Architect** | Translates customer problems into technical system requirements, relational database schemas (SQLite/Postgres), and API contracts. | Master Technical PRD in Markdown with Mermaid.js ER diagrams. |
| **Agent 3: Story Generator** | Converts specifications into atomic engineering tickets formatted in Gherkin BDD (`Given-When-Then`) syntax. | Linear and GitHub-ready issue payloads with citation backlinks. |

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
│   └── cli.mjs               # Executable binary for npx specforge
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

Every Linear issue generated by SpecForge preserves the link back to the customer's exact voice:

> **Customer Voice:** *"We waste 2 hours every Monday manually exporting CSVs to Zapier because the webhooks time out."*  
> — *[Interview 04, John Doe @ 14:22](https://specforge.app/project/csv-sync#t=862)*

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
