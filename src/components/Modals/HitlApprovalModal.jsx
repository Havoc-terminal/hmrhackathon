import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Edit3, Mail, AlertTriangle } from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';

export default function HitlApprovalModal() {
  const { isHitlModalOpen, hitlPayload, resumeAfterHitl } = useKaarya();

  const [isEditing, setIsEditing] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (hitlPayload) {
      setRecipient(hitlPayload.recipient || 'engineering-team@dailyecho.ai');
      setSubject(hitlPayload.subject || 'Scheduled: Quarterly Strategy Review & Prep Tasks');
      setBody(hitlPayload.previewBody || '');
    }
  }, [hitlPayload]);

  if (!isHitlModalOpen || !hitlPayload) return null;

  const handleApprove = () => {
    resumeAfterHitl(true, { recipient, subject, body });
  };

  const handleReject = () => {
    resumeAfterHitl(false);
  };

  return (
    <div className="modal-backdrop hitl-backdrop">
      <div 
        className="modal-container hitl-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px' }}
      >
        {/* Sensitive Action Banner */}
        <div className="hitl-banner">
          <div className="hitl-icon-wrap">
            <ShieldAlert size={24} className="text-amber-600" />
          </div>
          <div>
            <h3 className="hitl-title">Human-in-the-Loop Approval Required</h3>
            <p className="hitl-desc">
              DailyEcho detected an external communication action. As part of our zero-trust safety protocol, your explicit approval is required before execution.
            </p>
          </div>
        </div>

        <div className="hitl-content-body">
          {/* Target Tool Action */}
          <div className="hitl-meta-row">
            <span className="hitl-label">Target Tool:</span>
            <span className="code-pill">gmail.createDraft & sendNotification</span>
          </div>
          <div className="hitl-meta-row">
            <span className="hitl-label">Autonomous Safety Level:</span>
            <span className="status-pill status-warning">Tier-2 Guarded Action</span>
          </div>

          {/* Details Box */}
          <div className="hitl-payload-box">
            <div className="payload-box-header">
              <div className="flex items-center gap-2">
                <Mail size={15} />
                <span>Action Payload Preview</span>
              </div>
              <button 
                type="button" 
                className="edit-toggle-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 size={13} />
                <span>{isEditing ? 'Done Editing' : 'Edit Parameters'}</span>
              </button>
            </div>

            <div className="payload-fields">
              <div className="payload-field">
                <label>Recipient:</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                ) : (
                  <span className="field-value font-mono">{recipient}</span>
                )}
              </div>

              <div className="payload-field">
                <label>Subject:</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                ) : (
                  <span className="field-value font-semibold">{subject}</span>
                )}
              </div>

              <div className="payload-field col">
                <label>Message Content:</label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    className="form-input font-mono text-xs"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                ) : (
                  <div className="message-preview-text">{body}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-footer hitl-actions">
          <button
            type="button"
            className="btn btn-secondary reject-btn"
            onClick={handleReject}
          >
            <XCircle size={15} />
            <span>Reject & Cancel Workflow</span>
          </button>

          <button
            type="button"
            className="btn btn-primary approve-btn"
            onClick={handleApprove}
          >
            <CheckCircle2 size={15} />
            <span>Approve & Continue Execution</span>
          </button>
        </div>
      </div>
    </div>
  );
}
