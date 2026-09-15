import React, { useState } from 'react';
import { FileText, Copy, Check, Sparkles, Layers, ShieldCheck, Cpu, ArrowRight, Download, ClipboardList } from 'lucide-react';
import { Issue, initialIssues, PrdMetadata, scenarios } from '../data/mockDiscovery';

interface Props {
  content?: string;
  prd?: PrdMetadata;
  issues?: Issue[];
  onProceedToIssues?: () => void;
}

export const formatJiraUserStories = (
  stories: Issue[],
  epicTitle: string = 'Automated Billing Reconciliation & Resilient Webhook Ingestion'
): string => {
  const header = `# User Stories & Acceptance Criteria: ${epicTitle}\n\n`;
  const formattedStories = stories.map((story, idx) => {
    const key = `SPEC-${101 + idx}`;
    return [
      `### [${key}] ${story.title}`,
      `- **Type:** ${story.type.toUpperCase()} | **Priority:** ${story.priority.toUpperCase()} | **Story Points:** ${story.story_points}`,
      `- **Description:** ${story.description}`,
      ``,
      `#### Acceptance Criteria (Gherkin BDD)`,
      `\`\`\`gherkin`,
      story.gherkin_criteria.trim(),
      `\`\`\``,
      ``,
      `> **Customer Evidence [${story.citation_timestamp}]:** "${story.citation_quote}"`,
      ``,
      `---`
    ].join('\n');
  }).join('\n\n');

  return header + formattedStories;
};

export const PRDViewer: React.FC<Props> = ({
  content,
  prd = scenarios[0].prd,
  issues = initialIssues,
  onProceedToIssues
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedJira, setCopiedJira] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const markdownContent = content || prd.content;
  const downloadFileName = prd.filename || 'specforge-prd.md';

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPRD = () => {
    const blob = new Blob([markdownContent.trim() + '\n'], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleCopyJiraStories = () => {
    const formatted = formatJiraUserStories(issues, prd.title);
    navigator.clipboard.writeText(formatted);
    setCopiedJira(true);
    setTimeout(() => setCopiedJira(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* PRD Document Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm">
        {/* Document Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                Status: Approved for Sprint
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                Version 1.0 (Agent 2 Output)
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {prd.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Generated from Customer Interview • Target Linear Epic: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono">{prd.targetEpic}</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadPRD}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
              title="Download complete PRD Markdown document with Mermaid diagrams"
            >
              {downloaded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5 text-slate-500" />}
              <span>{downloaded ? 'PRD Downloaded' : 'Download PRD (.md)'}</span>
            </button>

            <button
              onClick={handleCopyJiraStories}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
              title="Copy Gherkin acceptance criteria formatted for Jira/Notion"
            >
              {copiedJira ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ClipboardList className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedJira ? 'Copied Jira Stories' : 'Copy Jira User Stories'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied Markdown' : 'Copy PRD'}</span>
            </button>

            {onProceedToIssues && (
              <button
                onClick={onProceedToIssues}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
              >
                <span>View Linear Tickets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>1. Executive Summary & Objective</span>
          </h2>
          <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl text-xs leading-relaxed text-slate-700">
            {prd.executiveSummary}
          </div>
        </div>

        {/* Section 2: Core Functional Requirements */}
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>2. Core Functional Requirements</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {prd.functionalRequirements.map((fr) => (
              <div key={fr.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="font-bold text-slate-900 block mb-1">{fr.title}</span>
                <p className="text-slate-600">{fr.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Technical Architecture & Data Flow */}
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>3. Technical Architecture & Sequence Flow</span>
          </h2>

          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed space-y-1">
            {prd.sequenceDiagramSteps.map((step, idx) => (
              <div key={idx} className={step.color}>
                {step.label}
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: SLAs & Edge Cases */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>4. Operational SLAs & Edge-Case Safeguards</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {prd.slas.map((sla, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                <span className="font-bold text-slate-900 block mb-0.5">{sla.title}</span>
                <span className="text-slate-600">{sla.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
