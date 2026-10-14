import test from 'node:test';
import assert from 'node:assert/strict';

test('SpecForge Gherkin & GitHub Markdown Formatting', async (t) => {
  const sampleIssues = [
    {
      id: 'SPEC-101',
      title: 'Automated Discrepancy Reconciliation Engine',
      description: 'System automatically pairs incoming Stripe webhooks with database ledger entries.',
      type: 'feature',
      priority: 'urgent',
      story_points: 5,
      gherkin_criteria: `Given a Stripe invoice.payment_succeeded webhook
When the transaction ID exists in the database
Then update the reconciliation status to MATCHED within 2 seconds.`,
      citation_quote: 'We have two engineers spending four hours every morning manually reconciling discrepancies.',
      citation_timestamp: '04:15'
    },
    {
      id: 'SPEC-102',
      title: 'Resilient Dead Letter Queue for Dropped Webhooks',
      description: 'Ensures zero webhook payload loss through exponential backoff retry bus.',
      type: 'infra',
      priority: 'high',
      story_points: 3,
      gherkin_criteria: `Given an incoming webhook endpoint returns HTTP 503
When exponential retries exceed 5 attempts
Then route the payload to the Dead Letter Queue for audit.`,
      citation_quote: 'If Stripe has a brief hiccup, the webhook is dropped forever.',
      citation_timestamp: '08:45'
    }
  ];

  await t.test('formats GitHub issues with markdown checklists and citations', () => {
    const formatted = sampleIssues.map((story, idx) => {
      return [
        `### [Issue #${idx + 1}] ${story.title}`,
        `- **Type:** \`${story.type}\` | **Priority:** \`${story.priority}\` | **Story Points:** \`${story.story_points}\``,
        `#### 📋 Overview`,
        story.description,
        `#### 🧪 Acceptance Criteria (Gherkin BDD)`,
        `\`\`\`gherkin`,
        story.gherkin_criteria.trim(),
        `\`\`\``,
        `> **[${story.citation_timestamp}]**: "${story.citation_quote}"`
      ].join('\n');
    }).join('\n\n');

    assert.ok(formatted.includes('### [Issue #1] Automated Discrepancy Reconciliation Engine'));
    assert.ok(formatted.includes('```gherkin'));
    assert.ok(formatted.includes('Given a Stripe invoice.payment_succeeded webhook'));
    assert.ok(formatted.includes('[04:15]'));
    assert.ok(formatted.includes('### [Issue #2] Resilient Dead Letter Queue'));
  });

  await t.test('verifies total Fibonacci story points calculation', () => {
    const totalPoints = sampleIssues.reduce((sum, i) => sum + i.story_points, 0);
    assert.equal(totalPoints, 8);
  });
});
