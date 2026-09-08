import React, { useState } from 'react';
import { X, Upload, Sparkles, Loader2, CheckCircle2, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProcessSuccess: () => void;
}

export const UploadModal: React.FC<Props> = ({ isOpen, onClose, onProcessSuccess }) => {
  const [interviewee, setInterviewee] = useState('Sarah Jenkins — Head of Growth @ Finly');
  const [transcript, setTranscript] = useState(`
[00:10] Interviewer: Thanks Sarah. What is the most painful bottleneck in your merchant onboarding?
[00:25] Sarah: Our KYC verification drops 35% of applicants because the identity OCR fails on blurred Aadhaar cards. We have to manually review 400 photos every day.
[01:15] Sarah: If we had an automatic pre-validation check that told the merchant to retake the photo before submitting, our conversion would double.
  `.trim());
  const [processingStep, setProcessingStep] = useState<number>(0);

  if (!isOpen) return null;

  const handleStartPipeline = () => {
    setProcessingStep(1); // Agent 1
    setTimeout(() => {
      setProcessingStep(2); // Agent 2
      setTimeout(() => {
        setProcessingStep(3); // Agent 3
        setTimeout(() => {
          setProcessingStep(4); // Complete
          setTimeout(() => {
            onProcessSuccess();
            onClose();
          }, 600);
        }, 800);
      }, 800);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Analyze New Customer Interview</h3>
              <p className="text-[11px] text-slate-500">Run the 3-stage agentic synthesis pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {processingStep > 0 ? (
            <div className="py-8 text-center space-y-4">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Running 3-Stage Pipeline</h4>
                <p className="text-slate-500 mt-1">
                  {processingStep === 1 && 'Agent 1: Extracting JTBD & Timestamp Citations...'}
                  {processingStep === 2 && 'Agent 2: Drafting Master Technical PRD & Architecture...'}
                  {processingStep === 3 && 'Agent 3: Generating Gherkin BDD Stories & Linear Payloads...'}
                  {processingStep === 4 && 'Complete! Updating Discovery Studio...'}
                </p>
              </div>

              {/* Stepper */}
              <div className="flex justify-center items-center gap-2 pt-2">
                <span className={`w-3 h-3 rounded-full ${processingStep >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                <span className={`w-3 h-3 rounded-full ${processingStep >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                <span className={`w-3 h-3 rounded-full ${processingStep >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Interviewee & Role</label>
                <input
                  type="text"
                  value={interviewee}
                  onChange={(e) => setInterviewee(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Interview Transcript (VTT or Text)</label>
                <textarea
                  rows={6}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-mono"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {processingStep === 0 && (
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleStartPipeline}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Run AI Synthesis</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
