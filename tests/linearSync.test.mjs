import test from 'node:test';
import assert from 'node:assert/strict';
import { syncToLinear, LinearSyncError } from '../server/services/linearSync.ts';

const payload = {
  teamId: 'ENG',
  epicTitle: 'Billing Reconciliation',
  issues: [
    {
      title: 'Idempotent webhook buffer',
      description: 'Store payloads before processing.',
      priority: 'urgent',
      story_points: 5,
      gherkin_criteria: 'Given a webhook\nWhen it arrives\nThen store it',
      citation_quote: 'We waste 2 hours every Monday.',
      citation_timestamp: '00:32',
    },
  ],
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

function fakeLinear(overrides = {}) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    const body = JSON.parse(init.body);
    calls.push({ url, auth: init.headers.Authorization, body });
    if (body.query.includes('TeamByKey')) {
      return overrides.team ?? jsonResponse({ data: { teams: { nodes: [{ id: 'team-uuid', key: 'ENG' }] } } });
    }
    if (body.query.includes('CreateEpic')) {
      return overrides.project ?? jsonResponse({ data: { projectCreate: { success: true, project: { id: 'proj-1', url: 'https://linear.app/acme/project/billing-abc' } } } });
    }
    return overrides.issue ?? jsonResponse({ data: { issueCreate: { success: true, issue: { id: 'iss-1', identifier: 'ENG-7', url: 'https://linear.app/acme/issue/ENG-7' } } } });
  };
  return { fetchImpl, calls };
}

test('refuses to call Linear without a key', async () => {
  const saved = process.env.LINEAR_API_KEY;
  delete process.env.LINEAR_API_KEY;
  try {
    const { fetchImpl, calls } = fakeLinear();
    await assert.rejects(syncToLinear({ ...payload, apiKey: '' }, fetchImpl), (err) => {
      assert.ok(err instanceof LinearSyncError);
      assert.equal(err.status, 400);
      assert.match(err.message, /needs an API key/);
      return true;
    });
    assert.equal(calls.length, 0);
  } finally {
    if (saved !== undefined) process.env.LINEAR_API_KEY = saved;
  }
});

test('uses LINEAR_API_KEY from the environment when no key is sent', async () => {
  const saved = process.env.LINEAR_API_KEY;
  process.env.LINEAR_API_KEY = 'lin_api_test_env';
  try {
    const { fetchImpl, calls } = fakeLinear();
    const result = await syncToLinear({ ...payload, apiKey: undefined }, fetchImpl);
    assert.equal(calls[0].auth, 'lin_api_test_env');
    assert.equal(result.success, true);
  } finally {
    if (saved === undefined) delete process.env.LINEAR_API_KEY;
    else process.env.LINEAR_API_KEY = saved;
  }
});

test('returns the epic and issue URLs reported by Linear', async () => {
  const { fetchImpl, calls } = fakeLinear();
  const result = await syncToLinear({ ...payload, apiKey: 'lin_api_test' }, fetchImpl);
  assert.deepEqual(result, {
    success: true,
    syncedCount: 1,
    epicUrl: 'https://linear.app/acme/project/billing-abc',
    issueUrls: ['https://linear.app/acme/issue/ENG-7'],
  });
  const issueCall = calls.find((c) => c.body.query.includes('CreateStory'));
  assert.equal(issueCall.body.variables.input.projectId, 'proj-1');
  assert.equal(issueCall.body.variables.input.priority, 1);
  assert.match(issueCall.body.variables.input.description, /Customer voice \[00:32\]/);
});

test('reports HTTP failures instead of returning success', async () => {
  const { fetchImpl } = fakeLinear({ team: new Response('nope', { status: 401 }) });
  await assert.rejects(syncToLinear({ ...payload, apiKey: 'bad' }, fetchImpl), (err) => {
    assert.equal(err.status, 401);
    assert.match(err.message, /HTTP 401/);
    return true;
  });
});

test('reports GraphQL errors and unconfirmed mutations', async () => {
  const graphqlError = fakeLinear({ project: jsonResponse({ errors: [{ message: 'Forbidden' }] }) });
  await assert.rejects(syncToLinear({ ...payload, apiKey: 'k' }, graphqlError.fetchImpl), /Forbidden/);

  const unconfirmed = fakeLinear({ issue: jsonResponse({ data: { issueCreate: { success: false, issue: null } } }) });
  await assert.rejects(syncToLinear({ ...payload, apiKey: 'k' }, unconfirmed.fetchImpl), /did not confirm issue/);
});
