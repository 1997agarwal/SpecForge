import React, { useState } from 'react';
import { AudioTranscriptViewer } from './components/AudioTranscriptViewer';
import { PRDViewer } from './components/PRDViewer';
import { IssueManager } from './components/IssueManager';
import { LinearSyncModal } from './components/LinearSyncModal';
import { initialTurns, initialInsights, initialPrd, initialIssues } from './data/mockDiscovery';
import { Zap, Github, Sparkles, BookOpen, Layers, CheckSquare } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prd' | 'issues'>('issues');
  const [activeTimestamp, setActiveTimestamp] = useState<string | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Navbar */}
      <header className="h-14 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-950/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-md shadow-indigo-600/30">
            <Zap className="w-4 h-4 text-white fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm tracking-tight text-white">SpecForge</h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-semibold">
                Autonomous Discovery Engine
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/1997agarwal/SpecForge"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-300 text-xs font-medium transition"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Sync to Linear</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body (Dual-Pane) */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Pane: Audio Evidence & Transcript */}
        <div className="w-1/2 h-full">
          <AudioTranscriptViewer
            turns={initialTurns}
            insights={initialInsights}
            activeTimestamp={activeTimestamp}
            onSelectTimestamp={(ts) => setActiveTimestamp(ts)}
          />
        </div>

        {/* Right Pane: Master PRD & Engineering Issues */}
        <div className="w-1/2 h-full flex flex-col">
          {/* Sub-tab Switcher */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setActiveTab('issues')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                  activeTab === 'issues'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Linear Stories ({initialIssues.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('prd')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition ${
                  activeTab === 'prd'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Master Technical PRD</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>3-Agent Pipeline Output</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'issues' ? (
              <IssueManager
                issues={initialIssues}
                onOpenSyncModal={() => setIsSyncModalOpen(true)}
              />
            ) : (
              <PRDViewer content={initialPrd} />
            )}
          </div>
        </div>
      </main>

      {/* Linear Sync Modal */}
      <LinearSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        issues={initialIssues}
      />
    </div>
  );
};
