# CLAUDE.md — SpecForge Developer Guide

## Commands
- **Install dependencies:** `npm install`
- **Run dev (Frontend + Backend):** `npm run dev`
- **Run Backend only:** `npm run dev:server` (Port 4100)
- **Run Frontend only:** `npm run dev:client` (Port 5173)
- **Build full stack:** `npm run build`
- **CLI scan test:** `node bin/cli.mjs scan <transcript.vtt> --output PRD.md`
- **Lint / Typecheck:** `npm run typecheck`

## Code Style Guidelines
- **Language:** TypeScript across server and client.
- **Backend:** Node.js, Express, better-sqlite3, Zod for JSON schema validation.
- **Frontend:** React 18, Tailwind CSS, Lucide icons, Vite.
- **Formatting:** Clean functional components, explicit TypeScript interfaces for all agent inputs and outputs.
