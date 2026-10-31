#!/usr/bin/env node

/**
 * SpecForge CLI — deterministic transcript scanner.
 *
 * `scan` reads a WebVTT / SRT / plain "Speaker: text" transcript and prints
 * statistics and keyword-matched candidate signals derived from that file.
 * No model is called. Audio/video transcription is not implemented.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const command = args[0] || 'help';

const SIGNAL_KEYWORDS = /\b(hours?|manual(?:ly)?|waste[sd]?|fails?|failed|failing|timeouts?|silent(?:ly)?|duplicate[s]?|workaround|slow|wish|need|pay)\b|\$\d+/i;
const MAX_SIGNALS = 10;
const AUDIO_EXTENSIONS = new Set(['.mp3', '.m4a', '.wav', '.mp4', '.mov', '.webm', '.ogg']);

function toSeconds(stamp) {
  const parts = stamp.split(':').map(Number);
  return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
}

function formatMmSs(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Parses WebVTT/SRT cues and "[mm:ss] Speaker: text" / "Speaker: text" lines. */
export function parseTranscriptText(raw) {
  const turns = [];
  let speaker = 'Unknown';
  let namedTurns = 0;
  let stamp = null;
  let lastSeconds = 0;

  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line === 'WEBVTT' || /^\d+$/.test(line)) continue;

    const cue = line.match(/^((?:\d{1,2}:)?\d{2}:\d{2})(?:[.,]\d+)?\s*-->/);
    if (cue) {
      stamp = cue[1];
      lastSeconds = Math.max(lastSeconds, toSeconds(stamp));
      continue;
    }

    let text = line;
    const bracketed = line.match(/^\[?((?:\d{1,2}:)?\d{2}:\d{2})\]?\s+(.*)$/);
    if (bracketed) {
      stamp = bracketed[1];
      lastSeconds = Math.max(lastSeconds, toSeconds(stamp));
      text = bracketed[2];
    }

    const named = text.match(/^([A-Za-z][A-Za-z .'()-]{0,40}?):\s*(.+)$/);
    if (named) {
      speaker = named[1].replace(/\s*\(.*?\)\s*$/, '').trim();
      text = named[2].trim();
      namedTurns += 1;
    }

    if (text) {
      turns.push({ speaker, text, timestamp: stamp ? formatMmSs(toSeconds(stamp)) : '00:00' });
    }
  }

  return { turns, durationSeconds: lastSeconds, namedTurns };
}

export function summarizeTranscript(raw) {
  const { turns, durationSeconds, namedTurns } = parseTranscriptText(raw);
  const speakerCounts = new Map();
  for (const t of turns) speakerCounts.set(t.speaker, (speakerCounts.get(t.speaker) ?? 0) + 1);

  const signals = [];
  for (const t of turns) {
    const hit = t.text.match(SIGNAL_KEYWORDS);
    if (hit) signals.push({ ...t, keyword: hit[0].toLowerCase() });
  }

  return {
    turnCount: turns.length,
    speakers: [...speakerCounts.entries()].sort((a, b) => b[1] - a[1]),
    span: formatMmSs(durationSeconds),
    signals,
    namedTurns,
  };
}

function quote(text) {
  return text.length > 140 ? `${text.slice(0, 137)}...` : text;
}

function renderSummary(fileName, summary) {
  const lines = [];
  lines.push(`Transcript: ${fileName}`);
  lines.push(`Turns: ${summary.turnCount} | Span: ${summary.span} | Speakers: ${summary.speakers.map(([n, c]) => `${n} (${c})`).join(', ')}`);
  lines.push('');
  lines.push(`Candidate signals (keyword match on this file; no model involved): ${summary.signals.length}`);
  for (const s of summary.signals.slice(0, MAX_SIGNALS)) {
    lines.push(`  [${s.timestamp}] ${s.speaker} (matched "${s.keyword}"): "${quote(s.text)}"`);
  }
  if (summary.signals.length > MAX_SIGNALS) {
    lines.push(`  ...and ${summary.signals.length - MAX_SIGNALS} more (see --output for full list)`);
  }
  return lines.join('\n');
}

function renderMarkdown(fileName, summary) {
  const out = [];
  out.push(`# Transcript scan: ${fileName}`, '');
  out.push(`- **Turns:** ${summary.turnCount}`);
  out.push(`- **Span:** ${summary.span}`);
  out.push(`- **Speakers:** ${summary.speakers.map(([n, c]) => `${n} (${c})`).join(', ')}`);
  out.push('', '## Candidate signals', '');
  out.push('Keyword matches only. These are not model-generated insights; review each against the transcript.', '');
  if (summary.signals.length === 0) out.push('_No keyword matches._');
  for (const s of summary.signals) {
    out.push(`- **[${s.timestamp}] ${s.speaker}** (matched \`${s.keyword}\`): "${s.text}"`);
  }
  return out.join('\n') + '\n';
}

function runScan() {
  const filePath = args[1];
  if (!filePath) {
    console.error('Error: provide a transcript file path.');
    console.error('Usage: specforge scan <transcript.vtt|.srt|.txt> [--output <file.md>]');
    process.exit(1);
  }

  const ext = path.extname(filePath).toLowerCase();
  if (AUDIO_EXTENSIONS.has(ext)) {
    console.error(`Error: ${ext} audio/video input is not supported. Transcribe it first and pass the .vtt/.srt/.txt file.`);
    process.exit(2);
  }

  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`Error: cannot read ${filePath}: ${err.message}`);
    process.exit(1);
  }

  const fileName = path.basename(filePath);
  const summary = summarizeTranscript(raw);
  if (summary.namedTurns === 0) {
    console.error('Error: no speaker turns found. Expected WebVTT/SRT cues or "Speaker: text" lines.');
    process.exit(2);
  }

  console.log(renderSummary(fileName, summary));

  const outIdx = args.indexOf('--output');
  if (outIdx !== -1) {
    const outPath = args[outIdx + 1];
    if (!outPath) {
      console.error('Error: --output requires a file path.');
      process.exit(1);
    }
    fs.writeFileSync(outPath, renderMarkdown(fileName, summary), 'utf8');
    console.log(`\nWrote ${outPath}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (command === 'scan') {
    runScan();
  } else if (command === 'demo') {
    console.log('Launch the web studio with `npm run dev`, then open http://localhost:5173.');
  } else {
    console.log(`
SpecForge CLI

Usage:
  specforge scan <transcript.vtt|.srt|.txt> [--output <file.md>]
      Print turn count, speakers, time span and keyword-matched candidate
      signals derived from the file. No model is called.
  specforge demo
      Show how to start the web studio.
  specforge help
`);
  }
}
