import React, { useState } from 'react';
import { AudioTranscriptViewer } from './components/AudioTranscriptViewer';
import { PRDViewer } from './components/PRDViewer';
import { IssueManager } from './components/IssueManager';
import { LinearSyncModal } from './components/LinearSyncModal';
import { UploadModal } from './components/UploadModal';
import { initialTurns, initialInsights, initialPrd, initialIssues } from './data/mockDiscovery';
import { Zap, Github, Sparkles, BookOpen, Layers, CheckSquare, Upload, ArrowRight, Mic, Columns, Maximize2 } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation tabs: 'evidence' (Stage 1), 'prd' (Stage 2), 'issues' (Stage 3)
  const [activeStage, setActiveStage] = useState<'evidence' | 'prd' | 'issues'>('evidence');
  const [viewMode, setViewMode] = useState<'stepper' | 'split'>('stepper');
  const [activeTimestamp, setActiveTimestamp] = useState<string | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-slate-200/80 px-6 sticky top-0 z-30 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base">SpecForge</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-[10px] font-bold">
                  v0.1.0 Open Source
                </span>
              </div>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Call:</span>
            <span>ScalePay Interview #04 — Stripe Reconciliation Bottlenecks</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Analyze New Call</span>
          </button>

          <a
            href="https://github.com/1997agarwal/SpecForge"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Export to Linear</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto p-6 md:p-8 flex-1 space-y-6">
        {/* Value Proposition Hero Banner */}
        <div className="bg-gradient-to-r from-indigo-500/5 via-indigo-500/10 to-transparent border border-indigo-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Autonomous Discovery-to-Spec Engine</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              From 45-Minute User Calls to Executable Specs in 60 Seconds.
            </h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Eliminate manual synthesis. SpecForge runs a 3-stage agentic pipeline that anchors every technical requirement and Linear issue to verbatim customer audio citations.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setViewMode('stepper')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                viewMode === 'stepper'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Step-by-Step Flow</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                viewMode === 'split'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
          </div>
        </div>

        {/* 3-Stage Pipeline Stepper Tabs (When in Stepper Mode) */}
        {viewMode === 'stepper' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Step 1 Tab */}
            <button
              onClick={() => setActiveStage('evidence')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeStage === 'evidence'
                  ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/10 shadow-sm'
                  : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                  activeStage === 'evidence' ? 'text-indigo-600' : 'text-slate-400'
                }`}>
                  Stage 1: Ingestion & Audio
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Mic className="w-4 h-4 text-indigo-600" />
                <span>Customer Voice & Evidence</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                3 Key pain signals extracted with exact timestamps.
              </p>
            </button>

            {/* Step 2 Tab */}
            <button
              onClick={() => setActiveStage('prd')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeStage === 'prd'
                  ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/10 shadow-sm'
                  : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                  activeStage === 'prd' ? 'text-indigo-600' : 'text-slate-400'
                }`}>
                  Stage 2: Systems Architect
                </span>
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Master Technical PRD</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Executive spec, schema diagrams, and SLAs.
              </p>
            </button>

            {/* Step 3 Tab */}
            <button
              onClick={() => setActiveStage('issues')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeStage === 'issues'
                  ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/10 shadow-sm'
                  : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                  activeStage === 'issues' ? 'text-indigo-600' : 'text-slate-400'
                }`}>
                  Stage 3: Agile Ticket Generator
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                <span>Linear Engineering Stories</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                3 Gherkin BDD tickets with citation backlinks.
              </p>
            </button>
          </div>
        )}

        {/* View Layouts */}
        {viewMode === 'stepper' ? (
          <div>
            {activeStage === 'evidence' && (
              <AudioTranscriptViewer
                turns={initialTurns}
                insights={initialInsights}
                activeTimestamp={activeTimestamp}
                onSelectTimestamp={(ts) => setActiveTimestamp(ts)}
                onProceedToPRD={() => setActiveStage('prd')}
              />
            )}

            {activeStage === 'prd' && (
              <PRDViewer
                content={initialPrd}
                onProceedToIssues={() => setActiveStage('issues')}
              />
            )}

            {activeStage === 'issues' && (
              <IssueManager
                issues={initialIssues}
                onOpenSyncModal={() => setIsSyncModalOpen(true)}
              />
            )}
          </div>
        ) : (
          /* Split View Mode (Side-by-side) */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <AudioTranscriptViewer
              turns={initialTurns}
              insights={initialInsights}
              activeTimestamp={activeTimestamp}
              onSelectTimestamp={(ts) => setActiveTimestamp(ts)}
            />

            <div className="space-y-6">
              <IssueManager
                issues={initialIssues}
                onOpenSyncModal={() => setIsSyncModalOpen(true)}
              />
              <PRDViewer content={initialPrd} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-6 text-center text-xs text-slate-500">
        <p>
          <strong>SpecForge</strong> — Open Source Autonomous Discovery-to-Spec Engine • Built by{' '}
          <a
            href="https://www.linkedin.com/in/1997agarwal"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Harshit Agarwal (@1997agarwal)
          </a>
        </p>
      </footer>

      {/* Modals */}
      <LinearSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        issues={initialIssues}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onProcessSuccess={() => {
          setActiveStage('issues');
        }}
      />
    </div>
  );
};
