# AGENTS.md — Constitution of SpecForge

> **Read this first.** This file is the constitution of the SpecForge repository. It applies to every engineer and AI agent (AntiGravity, Claude Code, Cursor, Windsurf, Codex, Copilot).

---

## 1. What SpecForge Is
SpecForge is an open-source, autonomous discovery-to-spec engine that converts raw customer discovery calls (audio, video, VTT/SRT transcripts) into master technical PRDs and Linear/GitHub issues using a 3-stage multi-agent pipeline.

**Core Mission:** Eliminate the 10+ hours PMs and founders spend manually synthesizing user calls into engineering tickets, while preserving 100% citation traceability back to verbatim customer quotes.

---

## 2. Multi-Agent Pipeline Architecture

1. **Agent 1: Insight & JTBD Extractor (`server/agents/insightExtractor.ts`)**
   - Extracts pain points, feature requests, and manual workarounds.
   - Enforces exact verbatim quotes and `[mm:ss]` timestamp bounds.
   - Assigns urgency scores (1 to 5).
2. **Agent 2: Technical Systems Architect (`server/agents/architectAgent.ts`)**
   - Converts customer needs into architectural components.
   - Designs relational schemas (SQLite / PostgreSQL), API contracts, edge-case tables, and SLAs.
3. **Agent 3: Story & Linear Ticket Generator (`server/agents/storyGenerator.ts`)**
   - Breaks architecture into atomic user stories formatted in Gherkin (`Given-When-Then`).
   - Enforces citation backlinks to the original transcript timestamp.
   - Syncs directly to Linear and GitHub Issues.

---

## 3. The 4-File Parity Standard

All updates to this repository must maintain the 4-file parity:
- `AGENTS.md`: Agent constitution, execution protocols, and safety bounds.
- `CLAUDE.md`: CLI commands, shortcuts, and code-style guidelines.
- `ROADMAP.md`: Living status of all phases and features.
- `CONTRIBUTING.md`: Contribution guide and pull request rules.

---

## 4. Engineering Principles & Boundaries

1. **Zero Fake Citations:** Never synthesize or hallucinate a quote. Every insight must point to an existing timestamp range in the source transcript.
2. **Zero-Config Database:** Always keep SQLite (`better-sqlite3`) as the default local data store so anyone cloning the repo can run it without spinning up external infrastructure.
3. **Dual Surface Support:** Every core capability must be accessible via both the **Web Studio** (`npm run dev`) and the **Headless CLI** (`npx specforge`).
4. **Non-Destructive Migrations:** Never drop or wipe user discovery call data during updates.
5. **Clean, Intuitive & Modern 2026 Light Theme:** All user interfaces must use a clean, modern light theme (`#f8fafc` canvas, `#ffffff` elevated cards, `#e2e8f0` subtle borders, high-contrast `#0f172a` typography, and focused accent badges). Never dump crowded, dark, multi-column technical data onto one screen; prioritize intuitive step-by-step flows that anyone can understand in 3 seconds.
