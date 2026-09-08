import React, { useState } from 'react';
import { FileText, Copy, Check, Sparkles, Layers, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

interface Props {
  content: string;
  onProceedToIssues?: () => void;
}

export const PRDViewer: React.FC<Props> = ({ content, onProceedToIssues }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* PRD Document Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm">
        {/* Document Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
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
              Automated Billing Reconciliation & Resilient Webhook Ingestion
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Generated from Customer Interview #04 • Target Linear Epic: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600">ENG-BILLING-RECON</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'Copied Markdown' : 'Copy PRD'}</span>
            </button>

            {onProceedToIssues && (
              <button
                onClick={onProceedToIssues}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
              >
                <span>View Linear Tickets</span>
                <ArrowRight className="w-4 h-4" />
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
            Eliminate manual CSV reconciliations and prevent duplicate dunning notices by establishing an idempotent webhook buffer and automated reconciliation queue. Cuts finance reconciliation time from 2 hours every Monday to 0 manual touchpoints.
          </div>
        </div>

        {/* Section 2: Core Functional Requirements */}
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>2. Core Functional Requirements</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-slate-900 block mb-1">FR-1: Resilient Webhook Ingestion</span>
              <p className="text-slate-600">Catch all incoming Stripe payment payloads, verify HMAC signatures, and queue them into durable SQLite/Redis storage before heavy processing.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-slate-900 block mb-1">FR-2: Automated Anomaly Detection</span>
              <p className="text-slate-600">Flag unmatched payment transfers within 60 seconds of invoice creation and alert on-call finance managers via Slack/email.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-slate-900 block mb-1">FR-3: Dunning Freeze Workflow</span>
              <p className="text-slate-600">Automatically halt customer-facing overdue email reminders when an invoice is flagged for reconciliation review.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-slate-900 block mb-1">FR-4: Immutable Audit Trail</span>
              <p className="text-slate-600">Record operator email, exact timestamp, prior state, and justification for any manual ledger status override.</p>
            </div>
          </div>
        </div>

        {/* Section 3: Technical Architecture & Data Flow */}
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>3. Technical Architecture & Sequence Flow</span>
          </h2>

          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
            <div className="text-indigo-400 mb-2">// Ingestion Sequence Flow</div>
            <div>[Stripe Webhook] ──► POST /v1/webhooks/stripe (HMAC Verification)</div>
            <div className="pl-4 text-emerald-400">└─► 200 OK Accepted (Saved into webhook_events table)</div>
            <div className="pl-8 text-amber-300">└─► Enqueue into Redis / SQLite Worker Queue</div>
            <div className="pl-12 text-slate-300">└─► Reconciliation Engine evaluates NetSuite Ledger match</div>
            <div className="pl-16 text-rose-300">└─► Discrepancy detected? Auto-freeze dunning sequence for 48h.</div>
          </div>
        </div>

        {/* Section 4: SLAs & Edge Cases */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>4. Operational SLAs & Edge-Case Safeguards</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <span className="font-bold text-slate-900 block mb-0.5">Latency Threshold</span>
              <span className="text-slate-600">Webhook response p95 &lt; 150ms to prevent Stripe automatic retries.</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <span className="font-bold text-slate-900 block mb-0.5">Idempotency Guarantee</span>
              <span className="text-slate-600">Unique constraint on <code className="bg-slate-200 px-1 rounded">stripe_event_id</code> prevents duplicate balance credits.</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <span className="font-bold text-slate-900 block mb-0.5">Dunning Safeguard</span>
              <span className="text-slate-600">Customer communications paused immediately when reconciliation discrepancy is open.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
