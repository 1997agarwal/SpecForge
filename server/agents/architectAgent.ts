import { z } from 'zod';

export const ArchitectSpecSchema = z.object({
  title: z.string(),
  executive_summary: z.string(),
  system_architecture: z.string().describe('High level design and data flow'),
  mermaid_erd: z.string().describe('Mermaid.js diagram string representing data entities'),
  api_endpoints: z.array(z.object({
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
    path: z.string(),
    description: z.string(),
    request_body: z.string().optional(),
    response_sample: z.string()
  })),
  edge_cases: z.array(z.object({
    scenario: z.string(),
    risk: z.string(),
    mitigation_strategy: z.string()
  })),
  sla_requirements: z.object({
    latency_p95_ms: z.number(),
    availability_target: z.string()
  })
});

export type ArchitectSpec = z.infer<typeof ArchitectSpecSchema>;

export const ARCHITECT_AGENT_SYSTEM_PROMPT = `
You are the Lead Systems Architect Agent for SpecForge.
Your mission: Transform customer pain points and JTBD statements into an authoritative Master Technical PRD.

REQUIREMENTS:
1. Design concrete relational data schemas with foreign key relationships.
2. Provide valid Mermaid.js ER diagrams (e.g. 'erDiagram ...').
3. Define production-grade REST/GraphQL API contracts with status codes and payloads.
4. Detail critical edge cases (network timeouts, concurrent modifications, large data exports).
5. Specify p95 latency thresholds and operational SLAs.
`;
