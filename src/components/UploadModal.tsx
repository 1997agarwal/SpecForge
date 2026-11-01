import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, Loader2, CheckCircle2, FileText, Paperclip } from 'lucide-react';
import { DiscoveryScenario, Issue, Insight, Turn } from '../data/mockDiscovery';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProcessSuccess: (scenario: DiscoveryScenario) => void;
}

export const UploadModal: React.FC<Props> = ({ isOpen, onClose, onProcessSuccess }) => {
  const [interviewee, setInterviewee] = useState('Sarah Jenkins — Head of Growth @ Finly');
  const [transcript, setTranscript] = useState(`
[00:10] Interviewer: Thanks Sarah. What is the most painful bottleneck in your merchant onboarding?
[00:25] Sarah: Our KYC verification drops 35% of applicants because the identity OCR fails on blurred Aadhaar cards. We have to manually review 400 photos every day.
[01:15] Sarah: If we had an automatic pre-validation check that told the merchant to retake the photo before submitting, our conversion would double.
[02:00] Sarah: Also, when the verification fails, the webhook notification takes 15 minutes, leaving the user staring at a frozen spinner.
  `.trim());
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setTranscript(text);
      }
    };
    reader.readAsText(file);
  };

  const synthesizeScenario = (): DiscoveryScenario => {
    // Parse transcript lines into turns
    const lines = transcript.split('\n').filter((l) => l.trim().length > 0);
    const turns: Turn[] = lines.map((line, idx) => {
      const match = line.match(/\[(\d{2}:\d{2})\]\s*([^:]+):\s*(.*)/);
      if (match) {
        return {
          timestamp: match[1],
          speaker: match[2].trim(),
          text: match[3].trim()
        };
      }
      return {
        timestamp: `00:${String(idx * 15).padStart(2, '0')}`,
        speaker: idx % 2 === 0 ? 'Interviewer' : (interviewee.split('—')[0].trim() || 'Customer'),
        text: line
      };
    });

    const parsedName = interviewee.split('—')[0]?.trim() || 'Custom Interview';
    const parsedCompany = interviewee.split('@')[1]?.trim() || 'User Feedback';
    const parsedRole = interviewee.split('—')[1]?.split('@')[0]?.trim() || 'Product Lead';

    const scenarioId = `custom-${Date.now()}`;

    // Synthesize JTBD Insights
    const insights: Insight[] = [
      {
        id: `ins-${Date.now()}-1`,
        category: 'pain_point',
        title: 'High Drop-off Rate during Critical Verification Flow',
        quote: turns[1]?.text || 'Verification failure rates cause severe customer attrition.',
        timestamp_start: turns[1]?.timestamp || '00:25',
        timestamp_end: turns[2]?.timestamp || '01:15',
        urgency_score: 9.4,
        jtbd: 'When onboarding new merchants, I want immediate OCR validation so that users do not drop off due to photo blur.'
      },
      {
        id: `ins-${Date.now()}-2`,
        category: 'feature_request',
        title: 'Instant Pre-validation Feedback & Immediate Retry Prompts',
        quote: turns[2]?.text || 'If we had an automatic pre-validation check, conversion would double.',
        timestamp_start: turns[2]?.timestamp || '01:15',
        timestamp_end: turns[3]?.timestamp || '02:00',
        urgency_score: 8.8,
        jtbd: 'When an upload is ambiguous, I want client-side quality scoring so that merchants get instant corrective feedback.'
      }
    ];

    // Synthesize Issues
    const issues: Issue[] = [
      {
        id: `ISSUE-${Date.now()}-1`,
        title: 'Client-Side Real-Time Image Quality & Glare Verification Engine',
        description: 'Implement a WebAssembly/client-side edge validation model to inspect uploaded identification documents for blur and glare prior to submission.',
        type: 'feature',
        priority: 'urgent',
        story_points: 5,
        gherkin_criteria: `Given an applicant captures an identity document photo
When the blur or lighting threshold is below 85% confidence
Then display an instant on-device retake directive before the file is uploaded.`,
        citation_quote: turns[1]?.text || 'Our KYC verification drops 35% of applicants because identity OCR fails on blurred cards.',
        citation_timestamp: turns[1]?.timestamp || '00:25'
      },
      {
        id: `ISSUE-${Date.now()}-2`,
        title: 'Sub-Second Webhook Event Notification & Push Gateway',
        description: 'Replace polling latency with an event-driven WebSocket and webhook notification bus delivering instant status updates.',
        type: 'infra',
        priority: 'high',
        story_points: 3,
        gherkin_criteria: `Given a document verification pipeline processes a payload
When the status resolves to accepted or rejected
Then broadcast the result over WebSocket in under 500ms.`,
        citation_quote: turns[3]?.text || 'When verification fails, the webhook notification takes 15 minutes, leaving the user staring at a frozen spinner.',
        citation_timestamp: turns[3]?.timestamp || '02:00'
      }
    ];

    const prdContent = `# PRD: Instant Document Verification & Resilient Webhook Bus

> **Target Epic:** Merchant Onboarding Acceleration & Drop-off Mitigation  
> **Source Call:** Customer Discovery with ${interviewee}  
> **Synthesized By:** SpecForge 3-Agent Pipeline  

---

## 1. Executive Summary & Problem Framing
During customer discovery with **${interviewee}**, user drop-off was identified as a critical revenue blocker. The existing manual verification loop creates a 35% abandonment rate due to delayed OCR rejections.

## 2. Core Functional Requirements
- **FR-1 [Edge Quality Assessment]:** Validate image clarity, blur metrics, and boundary detection in-browser.
- **FR-2 [Immediate Retake Directive]:** Provide guided guidance overlays prompting optimal camera angle and ambient lighting.
- **FR-3 [Low-Latency Notification Bus]:** Deliver asynchronous verification results via WebSocket in under 500ms.

## 3. Architecture & Data Flow
\`\`\`mermaid
sequenceDiagram
    participant User as Applicant Device
    participant Edge as Client-Side Validator
    participant API as SpecForge Core API
    participant Engine as OCR Verification Cluster
    
    User->>Edge: Snap Identification Document
    Edge->>Edge: Analyze Blur & Glare Score (>85%)
    alt Below Quality Threshold
        Edge-->>User: Instant Retake Prompt
    else Valid Frame
        Edge->>API: Stream Document
        API->>Engine: Queue Async Verification
        Engine-->>User: WebSocket Push (Status: Approved)
    end
\`\`\`

## 4. Key Performance Indicators & SLAs
- **Onboarding Completion:** Increase conversion by +25% within 30 days.
- **Latency SLA:** <500ms end-to-end webhook event delivery.
`;

    return {
      id: scenarioId,
      name: `${parsedCompany} Discovery`,
      shortLabel: parsedCompany.slice(0, 10),
      badge: 'Custom Call / Ingested',
      icon: 'Upload',
      callTitle: `Discovery Call: ${parsedCompany} (${parsedName})`,
      customer: {
        name: parsedName,
        initials: parsedName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'CU',
        role: parsedRole,
        company: parsedCompany,
        urgency: 'Immediate Active Blocker',
        duration: '18m 45s Call',
        summary: `Custom uploaded customer discovery session highlighting onboarding frictions and infrastructure requirements.`
      },
      prd: {
        title: `PRD: ${parsedCompany} Onboarding Optimization`,
        targetEpic: `${parsedCompany} Platform Infrastructure`,
        filename: `${parsedCompany.toLowerCase().replace(/\s+/g, '-')}-prd.md`,
        content: prdContent,
        executiveSummary: `Automates image pre-validation and asynchronous notification infrastructure to resolve onboarding friction identified in discovery.`,
        functionalRequirements: [
          { id: 'FR-1', title: 'Edge Image Pre-validation', desc: 'Real-time client-side blur and illumination scoring before upload.' },
          { id: 'FR-2', title: 'Sub-second Webhook Bus', desc: 'Asynchronous event bus delivering verification outcomes in <500ms.' }
        ],
        sequenceDiagramSteps: [
          { label: 'Capture', text: 'Applicant captures identity card photo on mobile.', color: 'indigo' },
          { label: 'Validate', text: 'Client validates clarity and bounds locally.', color: 'emerald' },
          { label: 'Broadcast', text: 'WebSocket emits real-time acceptance notification.', color: 'purple' }
        ],
        slas: [
          { title: 'Processing Latency', desc: 'Sub-500ms verification notification delivery.' },
          { title: 'Drop-off Reduction', desc: 'Reduce onboarding abandonment rate by >20%.' }
        ]
      },
      turns,
      insights,
      issues
    };
  };

  const handleStartPipeline = () => {
    setProcessingStep(1); // Agent 1
    setTimeout(() => {
      setProcessingStep(2); // Agent 2
      setTimeout(() => {
        setProcessingStep(3); // Agent 3
        setTimeout(() => {
          setProcessingStep(4); // Complete
          setTimeout(() => {
            const newScenario = synthesizeScenario();
            onProcessSuccess(newScenario);
            onClose();
          }, 600);
        }, 700);
      }, 700);
    }, 700);
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
                  {processingStep === 4 && 'Complete! Loading your new Discovery Studio...'}
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
                  placeholder="e.g. Sarah Jenkins — Head of Growth @ Finly"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Interview Transcript or Notes</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <Paperclip className="w-3 h-3" />
                    <span>{fileName ? `File: ${fileName}` : 'Upload .txt / .vtt'}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.vtt,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <textarea
                  rows={6}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste interview notes or transcript lines with [mm:ss] timestamps..."
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
