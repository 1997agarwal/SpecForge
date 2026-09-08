import React from 'react';
import { Issue } from '../data/mockDiscovery';
import { CheckSquare, ExternalLink, Zap, Layers, AlertTriangle, Quote } from 'lucide-react';

interface Props {
  issues: Issue[];
  onOpenSyncModal: () => void;
}

export const IssueManager: React.FC<Props> = ({ issues, onOpenSyncModal }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-indigo-400" />
          <div>
            <h2 className="font-semibold text-slate-100 text-sm">Linear-Ready Engineering Issues (Agent 3)</h2>
            <p className="text-[11px] text-slate-400">Atomic user stories with Gherkin acceptance criteria</p>
          </div>
        </div>

        <button
          onClick={onOpenSyncModal}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Sync to Linear</span>
        </button>
      </div>

      {/* Issues List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/50 hover:border-slate-700/80 transition flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                  issue.priority === 'urgent'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : issue.priority === 'high'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-700/40 text-slate-300'
                }`}>
                  {issue.priority}
                </span>

                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium">
                  {issue.type}
                </span>

                <span className="px-2 py-0.5 rounded bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-[10px] font-medium">
                  {issue.story_points} pts
                </span>
              </div>

              {issue.linear_issue_url && (
                <a
                  href={issue.linear_issue_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
                >
                  <span>Linear Ticket</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-100">{issue.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{issue.description}</p>
            </div>

            {/* Gherkin Criteria */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap">
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Acceptance Criteria (Gherkin BDD)
              </div>
              {issue.gherkin_criteria}
            </div>

            {/* Verbatim Citation Backlink */}
            <div className="flex items-start gap-1.5 p-2 rounded-lg bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-200/90">
              <Quote className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">Customer Evidence [{issue.citation_timestamp}]: </span>
                <span className="italic">"{issue.citation_quote}"</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
