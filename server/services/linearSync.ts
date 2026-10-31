export interface LinearSyncIssue {
  title: string;
  description: string;
  priority: string;
  story_points: number;
  gherkin_criteria: string;
  citation_quote?: string;
  citation_timestamp?: string;
}

export interface LinearSyncPayload {
  /** Linear personal API key. Falls back to the LINEAR_API_KEY env var. There is no default token. */
  apiKey?: string;
  /** Linear team key, e.g. "ENG". */
  teamId: string;
  epicTitle: string;
  issues: LinearSyncIssue[];
}

export interface LinearSyncResult {
  success: true;
  syncedCount: number;
  epicUrl: string;
  issueUrls: string[];
}

export class LinearSyncError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'LinearSyncError';
    this.status = status;
  }
}

export type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

const LINEAR_GRAPHQL_URL = 'https://api.linear.app/graphql';

const PRIORITY_MAP: Record<string, number> = { urgent: 1, high: 2, medium: 3, low: 4 };

export function resolveLinearApiKey(key?: string): string | undefined {
  const fromRequest = key?.trim();
  if (fromRequest) return fromRequest;
  const fromEnv = process.env.LINEAR_API_KEY?.trim();
  return fromEnv || undefined;
}

export function formatIssueDescription(issue: LinearSyncIssue): string {
  const parts = [issue.description.trim()];
  parts.push(`**Story points:** ${issue.story_points}`);
  parts.push('```gherkin\n' + issue.gherkin_criteria.trim() + '\n```');
  if (issue.citation_quote) {
    const stamp = issue.citation_timestamp ? ` [${issue.citation_timestamp}]` : '';
    parts.push(`> Customer voice${stamp}: "${issue.citation_quote}"`);
  }
  return parts.join('\n\n');
}

async function gql<T>(
  apiKey: string,
  query: string,
  variables: Record<string, unknown>,
  fetchImpl: FetchLike,
): Promise<T> {
  let response: Response;
  try {
    response = await fetchImpl(LINEAR_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: apiKey },
      body: JSON.stringify({ query, variables }),
    });
  } catch (err) {
    throw new LinearSyncError(`Could not reach Linear: ${(err as Error).message}`, 502);
  }

  if (!response.ok) {
    const status = response.status === 401 || response.status === 403 ? 401 : 502;
    const hint = status === 401 ? ' Check that the API key is valid.' : '';
    throw new LinearSyncError(`Linear API returned HTTP ${response.status}.${hint}`, status);
  }

  const body = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (body.errors?.length) {
    throw new LinearSyncError(`Linear API error: ${body.errors.map((e) => e.message).join('; ')}`, 502);
  }
  if (!body.data) {
    throw new LinearSyncError('Linear API returned no data.', 502);
  }
  return body.data;
}

/**
 * Creates a Linear project (the epic) and one issue per story, then returns the
 * URLs that Linear itself reports. Throws LinearSyncError on any failure; it never
 * returns a success value built from guessed URLs.
 */
export async function syncToLinear(
  payload: LinearSyncPayload,
  fetchImpl: FetchLike = fetch,
): Promise<LinearSyncResult> {
  const apiKey = resolveLinearApiKey(payload.apiKey);
  if (!apiKey) {
    throw new LinearSyncError(
      'Linear sync needs an API key. Paste a Linear personal API key, or set LINEAR_API_KEY on the server.',
      400,
    );
  }
  if (!payload.teamId?.trim()) {
    throw new LinearSyncError('Linear team key is required (for example "ENG").', 400);
  }
  if (!Array.isArray(payload.issues) || payload.issues.length === 0) {
    throw new LinearSyncError('No stories to sync. Generate stories first.', 400);
  }

  const teamData = await gql<{ teams: { nodes: Array<{ id: string; key: string }> } }>(
    apiKey,
    `query TeamByKey($key: String!) { teams(filter: { key: { eq: $key } }) { nodes { id key } } }`,
    { key: payload.teamId.trim() },
    fetchImpl,
  );
  const team = teamData.teams.nodes[0];
  if (!team) {
    throw new LinearSyncError(`No Linear team found with key "${payload.teamId.trim()}".`, 404);
  }

  const projectData = await gql<{ projectCreate: { success: boolean; project: { id: string; url: string } | null } }>(
    apiKey,
    `mutation CreateEpic($input: ProjectCreateInput!) {
       projectCreate(input: $input) { success project { id url } }
     }`,
    { input: { name: payload.epicTitle, teamIds: [team.id] } },
    fetchImpl,
  );
  const project = projectData.projectCreate;
  if (!project.success || !project.project?.url) {
    throw new LinearSyncError('Linear did not confirm the epic was created.', 502);
  }

  const issueUrls: string[] = [];
  for (const issue of payload.issues) {
    const issueData = await gql<{ issueCreate: { success: boolean; issue: { url: string } | null } }>(
      apiKey,
      `mutation CreateStory($input: IssueCreateInput!) {
         issueCreate(input: $input) { success issue { id identifier url } }
       }`,
      {
        input: {
          teamId: team.id,
          projectId: project.project.id,
          title: issue.title,
          description: formatIssueDescription(issue),
          priority: PRIORITY_MAP[issue.priority.toLowerCase()] ?? 0,
        },
      },
      fetchImpl,
    );
    if (!issueData.issueCreate.success || !issueData.issueCreate.issue?.url) {
      throw new LinearSyncError(`Linear did not confirm issue "${issue.title}" was created.`, 502);
    }
    issueUrls.push(issueData.issueCreate.issue.url);
  }

  return {
    success: true,
    syncedCount: issueUrls.length,
    epicUrl: project.project.url,
    issueUrls,
  };
}
