import React, { useState } from 'react';
import { X, Sparkles, Wand2, ArrowRight } from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';

export default function GenerateTemplateModal() {
  const { isTemplateModalOpen, setIsTemplateModalOpen, templates, startAgentExecution, setCurrentView } = useKaarya();

  const [templateType, setTemplateType] = useState('Workflow');
  const [promptInput, setPromptInput] = useState('');

  if (!isTemplateModalOpen) return null;

  const ideaChips = [
    'Workshop & Seminar Posters',
    'Minimalist & Elegant Posters',
    'Subjects & Learning Concepts',
    'Study Tips & Productivity Posters',
    'Motivational Posters'
  ];

  const handleRunWorkflow = (prompt) => {
    setIsTemplateModalOpen(false);
    setCurrentView('dashboard');
    startAgentExecution(prompt);
  };

  const handleGenerateCustom = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    handleRunWorkflow(promptInput);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsTemplateModalOpen(false)}>
      <div 
        className="modal-container template-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Generate template</h2>
            <p className="modal-subtitle">
              Your feedback helps me refine and enhance this experience — let's make it even better together!
            </p>
          </div>
          <button 
            className="modal-close-btn"
            onClick={() => setIsTemplateModalOpen(false)}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleGenerateCustom} className="template-generator-bar">
          <div className="template-select-dropdown">
            <span className="dropdown-icon">📑</span>
            <select 
              value={templateType} 
              onChange={(e) => setTemplateType(e.target.value)}
              className="custom-select"
            >
              <option value="Workflow">Workflow</option>
              <option value="Poster">Poster</option>
              <option value="Email Sequence">Email Sequence</option>
              <option value="Schedule Plan">Schedule Plan</option>
            </select>
          </div>

          <input
            type="text"
            className="template-prompt-input"
            placeholder="Type your automation idea or prompt..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />

          <button type="submit" className="btn btn-primary template-generate-btn">
            <Wand2 size={15} />
            <span>Generate</span>
          </button>
        </form>

        {/* Looking for ideas chips */}
        <div className="ideas-section">
          <div className="ideas-label">Looking for ideas? Begin with a prompt!</div>
          <div className="ideas-chips-wrap">
            {ideaChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                className="idea-chip"
                onClick={() => setPromptInput(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Get inspired cards */}
        <div className="inspiration-section">
          <div className="inspiration-title">Get inspired from these AI generated templates</div>
          <div className="inspiration-grid">
            {templates.map((tmpl) => (
              <div key={tmpl.id} className="inspiration-card">
                <div className="card-media-wrap">
                  <img src={tmpl.image} alt={tmpl.title} className="inspiration-img" />
                  <span className="inspiration-badge">{tmpl.badge}</span>
                </div>
                <div className="inspiration-content">
                  <h4 className="card-item-title">{tmpl.title}</h4>
                  <p className="card-item-desc">{tmpl.description}</p>
                  <div className="tags-row">
                    {tmpl.tags.map((t) => (
                      <span key={t} className="mini-tag">#{t}</span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-pill use-template-btn"
                    onClick={() => handleRunWorkflow(tmpl.prompt)}
                  >
                    <span>Use this workflow</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
