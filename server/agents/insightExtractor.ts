import { z } from 'zod';

export const InsightItemSchema = z.object({
  category: z.enum(['pain_point', 'feature_request', 'workaround']),
  title: z.string(),
  quote: z.string().describe('Exact verbatim quote from the speaker'),
  timestamp_start: z.string().regex(/^\d{2}:\d{2}$/, 'Format must be MM:SS'),
  timestamp_end: z.string().regex(/^\d{2}:\d{2}$/, 'Format must be MM:SS'),
  urgency_score: z.number().int().min(1).max(5),
  jtbd: z.string().describe('When [situation], I want to [motivation], so I can [expected outcome]')
});

export const InsightExtractionResponseSchema = z.object({
  call_summary: z.string(),
  interviewee_profile: z.object({
    role: z.string(),
    company_stage: z.string().optional(),
    primary_frustration: z.string()
  }),
  insights: z.array(InsightItemSchema)
});

export type InsightExtractionResponse = z.infer<typeof InsightExtractionResponseSchema>;

export const INSIGHT_EXTRACTOR_SYSTEM_PROMPT = `
You are the Discovery Insight Extractor for SpecForge.
Your mission: Analyze raw customer discovery transcripts and extract atomic, undeniable evidence.

CORE RULES:
1. ZERO HALLUCINATED CITATIONS: Every quote MUST be an exact verbatim substring from the transcript.
2. PRECISE TIME-ANCHORING: Extract the exact MM:SS start and end timestamps.
3. JOBS-TO-BE-DONE (JTBD): Translate each pain point or request into the standard JTBD format:
   "When [situation/trigger], I want to [motivation/action], so I can [desired outcome]."
4. URGENCY SCORING:
   - 5: Deal-breaker / high churn risk / explicit financial loss
   - 3-4: Major workflow slowdown / hacky workaround
   - 1-2: Minor cosmetic friction / nice-to-have suggestion
`;
