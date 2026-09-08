# SpecForge Roadmap

Living execution status of SpecForge development milestones.

## Phase 1: Core Foundation & Ingestion Engine (Completed)
- [x] Standalone repository initialization with MIT license
- [x] 4-File Parity governance standard (`AGENTS.md`, `CLAUDE.md`, `ROADMAP.md`, `CONTRIBUTING.md`)
- [x] Zero-config SQLite database schema (`better-sqlite3`)
- [x] Multi-agent pipeline interfaces & Zod validation contracts
- [x] Dual-pane Discovery Studio UI layout (React 18 + Tailwind CSS)

## Phase 2: Multi-Agent Synthesis Pipeline (In Progress)
- [x] Agent 1: Insight & JTBD Extractor with timestamp citations
- [x] Agent 2: Technical Systems Architect (Schema, API contracts, edge cases)
- [x] Agent 3: Story & Linear Ticket Generator (Gherkin format)
- [ ] Local Whisper transcription via WASM (`@xenova/transformers`)
- [ ] Deepgram Nova-2 cloud transcription provider

## Phase 3: Studio UX & Integrations (Upcoming)
- [ ] Interactive waveform player with clickable citation markers
- [ ] Live Mermaid.js diagram viewer in PRD Studio
- [ ] Bi-directional Linear GraphQL API push
- [ ] GitHub Issues exporter with label taxonomy
- [ ] One-command CLI binary (`npx specforge`)
