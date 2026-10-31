import React from 'react';
import { 
  History, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  ExternalLink, 
  ShieldCheck, 
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';

export default function HistoryView() {
  const { workflowHistory, startAgentExecution, setCurrentView } = useKaarya();

  return (
    <div className="history-view-container">
      {/* Header */}
      <div className="board-top-row">
        <div>
          <h1 className="board-main-title">Workflow Execution History & Audit Logs</h1>
          <p className="board-sub-title">Immutable trail of autonomous actions, tool calls, and cryptographic verification assertions</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge badge-health">
            <ShieldCheck size={12} /> Compliance Validated
          </span>
          <span className="badge badge-personal">
            {workflowHistory.length} Total Runs
          </span>
        </div>
      </div>

      {/* History Cards List */}
      <div className="history-cards-list">
        {workflowHistory.map((wf) => (
          <div key={wf.id} className="history-item-card card-glass">
            <div className="history-card-header">
              <div className="flex items-center gap-3">
                <div className="history-status-icon">
                  <CheckCircle2 size={20} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="history-prompt-title">"{wf.prompt}"</h3>
                  <div className="history-meta-row">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} /> {wf.timestamp}
                    </span>
                    <span className="meta-separator">•</span>
                    <span className="font-mono text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {wf.verificationProof}
                    </span>
                  </div>
                </div>
              </div>

              <div className="history-stats-pill">
                <div className="stat-col">
                  <span className="stat-label">Latency</span>
                  <span className="stat-num">{wf.latency}</span>
                </div>
                <div className="stat-col">
                  <span className="stat-label">Tokens</span>
                  <span className="stat-num">{wf.tokens}</span>
                </div>
                <div className="stat-col">
                  <span className="stat-label">Steps</span>
                  <span className="stat-num">{wf.stepsCount}</span>
                </div>
              </div>
            </div>

            <div className="history-tools-row">
              <span className="tools-label">Tools Executed:</span>
              <div className="tools-chips-wrap">
                {wf.toolsUsed.map((tool, idx) => (
                  <span key={idx} className="tool-chip font-mono text-[11px]">
                    {tool}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-pill text-xs ml-auto"
                onClick={() => {
                  setCurrentView('dashboard');
                  startAgentExecution(wf.prompt);
                }}
              >
                <span>Re-run Workflow</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
