# SpecForge Roadmap

Living status of SpecForge. A box is checked only when the code in this repo does the thing.

## Phase 1: Core Foundation & Ingestion Engine (Completed)
- [x] Standalone repository initialization with MIT license
- [x] 4-File Parity governance standard (`AGENTS.md`, `CLAUDE.md`, `ROADMAP.md`, `CONTRIBUTING.md`)
- [x] Zero-config SQLite database schema (`better-sqlite3`)
- [x] Zod validation contracts for pipeline payloads
- [x] Dual-pane Discovery Studio UI layout (React 18 + Tailwind CSS)

## Phase 2: Synthesis Pipeline (In Progress)
- [x] Template-based insight, PRD and story output in the studio (no AI model is called)
- [x] Agent prompt text kept in `server/agents/` (not yet sent to any model)
- [x] Headless `scan` command: turn count, speakers, time span and keyword-matched candidate signals from a WebVTT/SRT/plain-text transcript (`bin/cli.mjs`; no model)
- [ ] Model-backed Agent 1 (insight extraction) with verified verbatim citations
- [ ] Model-backed Agent 2 (architecture PRD) and Agent 3 (Gherkin stories)
- [ ] Local Whisper transcription via WASM (`@xenova/transformers`)
- [ ] Deepgram Nova-2 cloud transcription provider
- [ ] Speaker diarization for audio/video input

## Phase 3: Studio UX & Integrations (Upcoming)
- [x] Download PRD `.md` and copy Jira/Notion-style user stories from PRD Studio
- [x] Copy GitHub Issues-formatted Markdown (clipboard only; no API)
- [x] 3-Scenario Discovery Switcher in Navbar (B2B Billing, AI Search Latency & Rate Limits, Mobile Checkout Drop-off), backed by bundled sample data
- [x] GitHub Pages Automated CI/CD Workflow (`.github/workflows/deploy.yml`)
- [x] One-way Linear push: creates a Linear project and one issue per story via the Linear GraphQL API, using a key you supply (or `LINEAR_API_KEY`). Returns the URLs Linear reports. Not exercised against a live workspace in CI.
- [ ] Bi-directional Linear sync (read status back from Linear)
- [ ] GitHub Issues API exporter with label taxonomy
- [ ] Interactive waveform player with clickable citation markers
- [ ] Live Mermaid.js diagram viewer in PRD Studio (diagrams are shown as source text)
- [ ] Published npm binary (`npx specforge`); run the CLI from the repo with `node bin/cli.mjs`
