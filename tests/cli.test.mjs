import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'bin', 'cli.mjs');
const fixture = path.join(root, 'tests', 'fixtures', 'sample-interview.vtt');

test('scan prints output derived from the transcript file', () => {
  const out = execFileSync(process.execPath, [cli, 'scan', fixture], { encoding: 'utf8' });
  assert.match(out, /Turns: 5 \| Span: 02:40 \| Speakers: Marcus \(3\), Sarah \(2\)/);
  assert.match(out, /\[00:32\] Marcus \(matched "waste"\)/);
  assert.match(out, /\[01:25\] Marcus \(matched "duplicate"\)/);
  assert.doesNotMatch(out, /Agent \d Complete/);
});

test('scan --output writes a markdown summary of the same file', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'specforge-cli-'));
  const outPath = path.join(dir, 'scan.md');
  execFileSync(process.execPath, [cli, 'scan', fixture, '--output', outPath], { encoding: 'utf8' });
  const md = fs.readFileSync(outPath, 'utf8');
  assert.match(md, /^# Transcript scan: sample-interview\.vtt/);
  assert.match(md, /\*\*\[00:32\] Marcus\*\*/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('scan fails clearly on missing path, audio input, and files with no turns', () => {
  const noArg = spawnSync(process.execPath, [cli, 'scan'], { encoding: 'utf8' });
  assert.equal(noArg.status, 1);

  const audio = spawnSync(process.execPath, [cli, 'scan', 'call.mp3'], { encoding: 'utf8' });
  assert.equal(audio.status, 2);
  assert.match(audio.stderr, /audio\/video input is not supported/);

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'specforge-cli-'));
  const empty = path.join(dir, 'empty.txt');
  fs.writeFileSync(empty, 'just a line with no speaker marker\n');
  const none = spawnSync(process.execPath, [cli, 'scan', empty], { encoding: 'utf8' });
  assert.equal(none.status, 2);
  assert.match(none.stderr, /no speaker turns found/);
  fs.rmSync(dir, { recursive: true, force: true });
});
