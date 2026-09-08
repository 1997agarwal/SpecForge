export interface ArchitectSpec {
  title: string;
  executive_summary: string;
  system_architecture: string;
  mermaid_erd: string;
  api_endpoints: Array<{
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    description: string;
    request_body?: string;
    response_sample: string;
  }>;
  edge_cases: Array<{
    scenario: string;
    risk: string;
    mitigation_strategy: string;
  }>;
  sla_requirements: {
    latency_p95_ms: number;
    availability_target: string;
  };
}

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
