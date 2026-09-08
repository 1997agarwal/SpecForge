export interface Project {
  id: string;
  name: string;
  description?: string;
  linear_team_id?: string;
  github_repo?: string;
  created_at: string;
}

export interface DiscoveryCall {
  id: string;
  project_id: string;
  title: string;
  interviewee_name: string;
  interviewee_role: string;
  raw_transcript: string;
  duration_seconds: number;
  created_at: string;
}

export interface Insight {
  id: string;
  call_id: string;
  category: 'pain_point' | 'feature_request' | 'workaround';
  title: string;
  quote: string;
  timestamp_start: string;
  timestamp_end: string;
  urgency_score: number;
  jtbd: string;
  created_at: string;
}

export interface PRDDocument {
  id: string;
  project_id: string;
  title: string;
  version: number;
  markdown_content: string;
  schema_mermaid?: string;
  status: 'draft' | 'approved' | 'synced';
  created_at: string;
}

export interface SpecIssue {
  id: string;
  prd_id: string;
  title: string;
  description: string;
  type: 'feature' | 'infra' | 'bug';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  story_points: number;
  gherkin_criteria: string;
  citation_quote?: string;
  citation_timestamp?: string;
  linear_issue_url?: string;
  created_at: string;
}
