export interface TranscriptTurn {
  speaker: string;
  text: string;
  timestamp: string; // MM:SS
}

/**
 * Parses raw text or WebVTT transcript formats into structured speaker turns.
 */
export function parseTranscript(rawText: string): TranscriptTurn[] {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const turns: TranscriptTurn[] = [];

  let currentSpeaker = 'Speaker';
  let currentTimestamp = '00:00';

  for (const line of lines) {
    // Match WebVTT or SRT timestamp patterns: 00:01:23.456 --> 00:01:28.000 or [01:23]
    const timestampMatch = line.match(/(\d{2}):(\d{2}):(\d{2})/) || line.match(/\[?(\d{2}):(\d{2})\]?/);
    if (timestampMatch) {
      currentTimestamp = timestampMatch[0].replace(/[\[\]]/g, '').slice(-5);
      continue;
    }

    // Match Speaker: Text
    const speakerMatch = line.match(/^([A-Za-z0-9\s]+):\s*(.+)$/);
    if (speakerMatch) {
      currentSpeaker = speakerMatch[1].trim();
      turns.push({
        speaker: currentSpeaker,
        text: speakerMatch[2].trim(),
        timestamp: currentTimestamp
      });
    } else if (line.length > 5 && !line.startsWith('WEBVTT') && !line.match(/^\d+$/)) {
      turns.push({
        speaker: currentSpeaker,
        text: line,
        timestamp: currentTimestamp
      });
    }
  }

  return turns.length > 0 ? turns : [
    { speaker: 'User', text: rawText, timestamp: '00:00' }
  ];
}
