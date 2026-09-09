# Master Product Requirements Document (PRD) & Technical Specification

## **SpecForge: Autonomous Discovery-to-Spec Engine**
> **Tagline:** *"From 45-minute customer discovery calls to executable engineering issues in 60 seconds."*  
> **Repository:** `SpecForge`  
> **Package / Binary:** `npx specforge`  
> **Author:** Harshit Agarwal ([@1997agarwal](https://github.com/1997agarwal))  
> **Status:** Production v0.1.0 Ready  
> **License:** MIT Open Source  

---

## 1. Executive Summary & Value Proposition

### 1.1 The Problem
Product Managers and founders spend **8–12 hours per week** listening to user discovery recordings, manually extracting pain points, cross-referencing timestamps, and writing PRDs and Linear tickets.
- **Generic LLM Summaries Fail:** Pasting a transcript into ChatGPT yields superficial bullet points rather than engineering-ready specifications (data schemas, edge cases, acceptance criteria, or Gherkin test scenarios).
- **Broken Attribution:** When engineers review tickets, they lose context on *why* a feature exists because there are no direct citation backlinks to the customer's exact words.

### 1.2 The Solution
**SpecForge** is an open-source, autonomous discovery-to-spec engine that takes raw customer discovery calls (audio, video, VTT/SRT transcripts) and uses a **3-stage multi-agent pipeline** to produce:
1. **Verbatim Timestamped Customer Insights & JTBD Matrix**
2. **Master Technical PRD** (Architecture, Data Schema, Edge Cases, Security)
3. **Executable User Stories** (Gherkin `Given-When-Then` format with story points)
4. **1-Click Sync to Linear & GitHub Issues** with citation backlinks directly to the user's voice

---

## 2. Multi-Agent Pipeline Architecture

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
                         [ SpecForge 2026 Light Studio ]
              (Transcript with Citation Pins ◄──► Live PRD Editor)
                                            │
                                            ▼
                     [ 1-Click Sync: Linear API / GitHub Issues ]
```

---

## 3. Agent Pipeline Specifications

| Agent | Responsibility | Key Output Artifact | Prompt Strategy |
|---|---|---|---|
| **Agent 1: Insight Extractor** | Parses conversation turns, attributes speakers, extracts core user pains, frequency, and emotional intensity. | `insights.json` (Array of JTBD, verbatim quotes, start/end timestamps, urgency score 1–5). | Strict JSON schema enforcing start/end time anchors. Zero fake citations allowed. |
| **Agent 2: Systems Architect** | Takes customer pain points and maps them to technical systems, data schemas, API contracts, and edge cases. | `prd_spec.md` (System overview, SQLite/Postgres schemas, API payloads, SLA constraints). | System-architect role prompt utilizing 2026 production-grade web & cloud patterns. |
| **Agent 3: Story & Linear Ticket Generator** | Converts architectural components into atomic user stories with acceptance criteria. | `issues.json` (Title, description, priority, Gherkin criteria, Linear team ID, citation backlinks). | BDD (Behavior-Driven Development) formatting with markdown checklists. |

---

## 4. REST API Endpoint Specifications

Base URL: `http://localhost:4100`

- `GET /api/health` — System status and active agent pipeline version.
- `GET /api/projects` — Lists all projects in zero-config database.
- `GET /api/calls/:id` — Returns transcript turns, diarization, and extracted insights.
- `GET /api/prd/:projectId` — Returns latest Master Technical PRD and linked engineering issues.
- `POST /api/sync/linear` — Pushes Epics and BDD user stories with citation backlinks to Linear GraphQL API.

---

## 5. UI Standard: Clean, Intuitive & Modern 2026 Light Theme

Per `AGENTS.md`:
- Pure white `#ffffff` elevated cards on soft zinc/slate-50 `#f8fafc` canvas.
- Strict 3-Stage Step-by-Step workflow (Customer Voice $\to$ Master PRD $\to$ Linear Stories).
- High-contrast typography `#0f172a`, subtle `#e2e8f0` borders, and purposeful accent badges.
