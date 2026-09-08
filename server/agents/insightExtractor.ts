export interface InsightItem {
  category: 'pain_point' | 'feature_request' | 'workaround';
  title: string;
  quote: string; // Exact verbatim quote from speaker
  timestamp_start: string; // MM:SS
  timestamp_end: string;   // MM:SS
  urgency_score: number;   // 1 to 5
  jtbd: string;
}

export interface InsightExtractionResponse {
  call_summary: string;
  interviewee_profile: {
    role: string;
    company_stage?: string;
    primary_frustration: string;
  };
  insights: InsightItem[];
}

export const INSIGHT_EXTRACTOR_SYSTEM_PROMPT = `
You are the Discovery Insight Extractor for SpecForge.
Your mission: Analyze raw customer discovery transcripts and extract atomic, undeniable evidence.

CORE RULES:
1. ZERO HALLUCINATED CITATIONS: Every quote MUST be an exact verbatim substring from the transcript.
2. PRECISE TIME-ANCHORING: Extract the exact MM:SS start and end timestamps.
3. JOBS-TO-BE-DONE (JTBD): Translate each pain point or request into standard JTBD format:
   "When [situation], I want to [motivation], so I can [desired outcome]."
4. URGENCY SCORING:
   - 5: Deal-breaker / high churn risk / explicit financial loss
   - 3-4: Major workflow slowdown / hacky workaround
   - 1-2: Minor cosmetic friction / nice-to-have suggestion
`;
