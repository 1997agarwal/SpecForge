# Contributing to SpecForge

Thank you for your interest in contributing to SpecForge!

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/1997agarwal/SpecForge.git
   cd SpecForge
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
4. **Start local development server:**
   ```bash
   npm run dev
   ```

## Pull Request Guidelines
- Branch names should follow: `feat/feature-name` or `fix/issue-name`.
- Ensure all TypeScript checks pass: `npm run typecheck`.
- Preserve the 4-File Parity standard when adding major features.
