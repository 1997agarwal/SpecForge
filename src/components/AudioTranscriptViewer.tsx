import React, { useState } from 'react';
import { Turn, Insight } from '../data/mockDiscovery';
import { Clock, Play, Pause, Sparkles, Quote, User, AlertCircle, ArrowRight } from 'lucide-react';

interface Props {
  turns: Turn[];
  insights: Insight[];
  activeTimestamp: string | null;
  onSelectTimestamp: (ts: string) => void;
  onProceedToPRD?: () => void;
}

export const AudioTranscriptViewer: React.FC<Props> = ({
  turns,
  insights,
  activeTimestamp,
  onSelectTimestamp,
  onProceedToPRD
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-6">
      {/* Customer Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
            MV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Marcus Vance</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                Head of Finance @ ScalePay
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
                High Pain Urgency
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Interview #04 • Recorded duration: 04:12 mins • Primary challenge: End-of-month Stripe reconciliation timeouts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current text-indigo-600" /> : <Play className="w-4 h-4 fill-current text-indigo-600" />}
            <span>{isPlaying ? 'Playing Demo Audio...' : 'Listen to Audio'}</span>
          </button>

          {onProceedToPRD && (
            <button
              onClick={onProceedToPRD}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <span>View Generated PRD</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Extracted Key Pain Signals (3 Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">AI-Extracted Customer Evidence ({insights.length})</h3>
          </div>
          <span className="text-xs text-slate-400">Agent 1: Verbatim Quotes with Timestamp Anchors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((ins) => {
            const isSelected = activeTimestamp === ins.timestamp_start;

            return (
              <div
                key={ins.id}
                onClick={() => onSelectTimestamp(ins.timestamp_start)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/20 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-900 leading-snug">{ins.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ins.urgency_score >= 5
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      Urgency {ins.urgency_score}/5
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 italic bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 mb-3">
                    <Quote className="w-3 h-3 text-slate-400 inline mr-1 -mt-0.5" />
                    "{ins.quote}"
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    At {ins.timestamp_start}
                  </span>
                  <span className="font-semibold text-indigo-600 hover:text-indigo-800">
                    Jump to dialogue ↓
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Transcript Conversation Stream */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Transcript Timeline</h3>
          <span className="text-xs text-slate-400">Click any quote above to scroll and inspect</span>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {turns.map((turn, i) => {
            const isHighlighted = activeTimestamp === turn.timestamp;
            const isCustomer = !turn.speaker.includes('Interviewer');

            return (
              <div
                key={i}
                className={`p-4 rounded-2xl transition-all duration-150 ${
                  isHighlighted
                    ? 'bg-indigo-50 border border-indigo-300 ring-2 ring-indigo-500/20'
                    : isCustomer
                    ? 'bg-slate-50/90 border border-slate-100'
                    : 'bg-white border border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCustomer ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isCustomer ? 'C' : 'I'}
                    </div>
                    <span className={`font-bold ${isCustomer ? 'text-slate-900' : 'text-slate-500'}`}>
                      {turn.speaker}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectTimestamp(turn.timestamp)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-600 font-medium"
                  >
                    <Clock className="w-3 h-3" />
                    <span>{turn.timestamp}</span>
                  </button>
                </div>

                <p className="text-xs leading-relaxed text-slate-700 ml-7">
                  {turn.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
