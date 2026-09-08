import React from 'react';
import { Turn, Insight } from '../data/mockDiscovery';
import { Clock, Play, AlertCircle, Sparkles, Quote } from 'lucide-react';

interface Props {
  turns: Turn[];
  insights: Insight[];
  activeTimestamp: string | null;
  onSelectTimestamp: (ts: string) => void;
}

export const AudioTranscriptViewer: React.FC<Props> = ({
  turns,
  insights,
  activeTimestamp,
  onSelectTimestamp
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="font-semibold text-slate-100 text-sm">Customer Evidence & Citations</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Marcus Vance — Head of Finance @ ScalePay (04:12 mins)</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 text-xs font-medium transition">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Audio</span>
          </button>
        </div>
      </div>

      {/* Extracted Key Insights Drawer */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/30">
        <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Extracted Pain Signals ({insights.length})</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {insights.map((ins) => (
            <div
              key={ins.id}
              onClick={() => onSelectTimestamp(ins.timestamp_start)}
              className={`p-2.5 rounded-xl border cursor-pointer transition text-xs ${
                activeTimestamp === ins.timestamp_start
                  ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-950/50'
                  : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-200">{ins.title}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  ins.urgency_score >= 5
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  Urgency {ins.urgency_score}/5
                </span>
              </div>
              <p className="text-slate-400 italic flex items-start gap-1">
                <Quote className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                <span>"{ins.quote.slice(0, 90)}..."</span>
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{ins.timestamp_start} - {ins.timestamp_end}</span>
                </span>
                <span className="text-indigo-400 hover:underline">Jump to Citation →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transcript Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {turns.map((turn, i) => {
          const isActive = activeTimestamp === turn.timestamp;
          const isCustomer = !turn.speaker.includes('Interviewer');

          return (
            <div
              key={i}
              className={`p-3 rounded-xl border transition ${
                isActive
                  ? 'bg-indigo-950/50 border-indigo-500/70 ring-1 ring-indigo-500/50'
                  : isCustomer
                  ? 'bg-slate-900/80 border-slate-800/80'
                  : 'bg-slate-950/40 border-slate-900'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className={`font-semibold ${isCustomer ? 'text-amber-300' : 'text-slate-400'}`}>
                  {turn.speaker}
                </span>
                <button
                  onClick={() => onSelectTimestamp(turn.timestamp)}
                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-400 transition"
                >
                  <Clock className="w-3 h-3" />
                  <span>[{turn.timestamp}]</span>
                </button>
              </div>
              <p className="text-xs leading-relaxed text-slate-200">{turn.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
