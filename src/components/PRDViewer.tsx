import React, { useState } from 'react';
import { FileText, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  content: string;
  onUpdateContent?: (updated: string) => void;
}

export const PRDViewer: React.FC<Props> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <h2 className="font-semibold text-slate-100 text-sm">Master Technical PRD (Agent 2 Output)</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
          </button>
        </div>
      </div>

      {/* PRD Content */}
      <div className="flex-1 overflow-y-auto p-6 text-xs leading-relaxed space-y-4 text-slate-300 font-mono">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
};
