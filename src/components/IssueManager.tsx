import React, { useState } from 'react';
import { Issue } from '../data/mockDiscovery';
import { CheckSquare, ExternalLink, Zap, Quote, ChevronDown, ChevronUp, Clock, Tag } from 'lucide-react';

interface Props {
  issues: Issue[];
  onOpenSyncModal: () => void;
}

export const IssueManager: React.FC<Props> = ({ issues, onOpenSyncModal }) => {
  const [expandedId, setExpandedId] = useState<string | null>('iss-01');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const totalPoints = issues.reduce((acc, curr) => acc + curr.story_points, 0);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
              Linear Ready
            </span>
            <span className="text-xs text-slate-500 font-medium">
              3 Atomic User Stories • {totalPoints} Fibonacci Points
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Sprint Backlog: Billing Reconciliation & Anomaly Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Formatted in Gherkin BDD with acceptance criteria and verbatim customer quote backlinks.
          </p>
        </div>

        <button
          onClick={onOpenSyncModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition shrink-0"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Export All to Linear</span>
        </button>
      </div>

      {/* Issues Deck */}
      <div className="space-y-4">
        {issues.map((issue, idx) => {
          const isExpanded = expandedId === issue.id;

          return (
            <div
              key={issue.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition"
            >
              {/* Card Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    SPEC-{101 + idx}
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    issue.priority === 'urgent'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : issue.priority === 'high'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {issue.priority} Priority
                  </span>

                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                    {issue.type}
                  </span>

                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold">
                    {issue.story_points} Points
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {issue.linear_issue_url && (
                    <a
                      href={issue.linear_issue_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <span>Linear Issue</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    onClick={() => toggleExpand(issue.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">{issue.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{issue.description}</p>
              </div>

              {/* Gherkin Criteria (Expandable) */}
              {isExpanded && (
                <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Acceptance Criteria (Gherkin BDD)</span>
                  </div>
                  <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {issue.gherkin_criteria}
                  </pre>
                </div>
              )}

              {/* Customer Voice Citation */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs">
                <Quote className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-slate-700">
                  <span className="font-bold text-slate-900">Customer Evidence [{issue.citation_timestamp}]: </span>
                  <span className="italic">"{issue.citation_quote}"</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
