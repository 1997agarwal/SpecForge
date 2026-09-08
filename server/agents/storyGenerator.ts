import { z } from 'zod';

export const StoryItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.enum(['feature', 'infra', 'bug']),
  priority: z.enum(['urgent', 'high', 'medium', 'low']),
  story_points: z.number().int().min(1).max(13),
  gherkin_criteria: z.string().describe('Given [context] When [event] Then [outcome]'),
  citation_quote: z.string(),
  citation_timestamp: z.string()
});

export const StoryGeneratorResponseSchema = z.object({
  epic_title: z.string(),
  epic_description: z.string(),
  stories: z.array(StoryItemSchema)
});

export type StoryGeneratorResponse = z.infer<typeof StoryGeneratorResponseSchema>;

export const STORY_GENERATOR_SYSTEM_PROMPT = `
You are the Agile Engineering Story & Linear Ticket Generator for SpecForge.
Your mission: Break down the Technical Architecture into atomic, executable engineering issues.

RULES:
1. Every ticket must have clear acceptance criteria written in Gherkin BDD format:
   Scenario: [Description]
   Given [precondition]
   When [action executed]
   Then [expected assertion]
2. Link every ticket to the original customer voice with an exact citation quote and timestamp.
3. Assign realistic Fibonacci story points (1, 2, 3, 5, 8, 13).
4. Tag tickets with appropriate types ('feature', 'infra', 'bug') and priorities.
`;
