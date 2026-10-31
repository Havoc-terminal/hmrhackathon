import React from 'react';
import { 
  X, 
  HelpCircle, 
  Keyboard, 
  Sparkles, 
  BookOpen, 
  ExternalLink,
  Calendar,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';

export default function HelpModal() {
  const { 
    isHelpModalOpen, 
    setIsHelpModalOpen,
    startAgentExecution,
    setCurrentView
  } = useKaarya();

  if (!isHelpModalOpen) return null;

  const shortcuts = [
    { key: 'T', action: 'Jump to Today (March 17)' },
    { key: 'W', action: 'Switch to Week View' },
    { key: 'M', action: 'Switch to Month View' },
    { key: 'D', action: 'Switch to Day View' },
    { key: 'C', action: 'Create a New Event' },
    { key: '/', action: 'Open Universal Search' },
    { key: 'Esc', action: 'Close any Modal or Drawer' }
  ];

  const examplePrompts = [
    'Find my meeting email from tomorrow, check my calendar, schedule the meeting, create a preparation task two days before, and draft an email to my team.',
    'Schedule a 30-minute sync with Jonas Coach on Monday morning and create a workout preparation task.',
    'Clear my calendar Friday afternoon between 2pm and 5pm and reschedule any conflicts to Monday.',
    'Scan inbox for SXSW Austin logistics and create a Google Tasks checklist for all items mentioned.'
  ];

  return (
    <div className="modal-backdrop-custom" onClick={() => setIsHelpModalOpen(false)}>
      <div className="modal-card-custom help-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-custom">
          <div className="flex items-center gap-2">
            <div className="help-header-icon-wrap">
              <HelpCircle size={20} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="modal-title-custom">Help & Keyboard Shortcuts</h2>
              <p className="modal-subtitle-custom">Master DailyEcho AI automation and Google Calendar shortcuts</p>
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn"
            onClick={() => setIsHelpModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="help-modal-body">
          {/* Shortcuts Section */}
          <div className="help-card-block">
            <h3 className="help-block-title">
              <Keyboard size={16} className="text-teal-600" />
              <span>Keyboard Shortcuts</span>
            </h3>
            <div className="shortcuts-grid">
              {shortcuts.map((sc, i) => (
                <div key={i} className="shortcut-row">
                  <span className="shortcut-desc">{sc.action}</span>
                  <kbd className="shortcut-key">{sc.key}</kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Prompts */}
          <div className="help-card-block">
            <h3 className="help-block-title">
              <Sparkles size={16} className="text-amber-500" />
              <span>Try Instant Agent Instructions (Click to Run)</span>
            </h3>
            <div className="space-y-2">
              {examplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="quick-prompt-item"
                  onClick={() => {
                    setIsHelpModalOpen(false);
                    setCurrentView('dashboard');
                    startAgentExecution(p);
                  }}
                >
                  <Zap size={14} className="text-teal-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-left">{p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Tips */}
          <div className="help-card-block">
            <h3 className="help-block-title">
              <Calendar size={16} className="text-blue-500" />
              <span>Google Calendar Tips</span>
            </h3>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5 list-disc pl-4">
              <li>Click any empty hour slot in the calendar grid to quickly create a new event.</li>
              <li>Click any existing event (like <em>Strategy Review</em> or <em>Daily Standup</em>) to view attendees and join Google Meet.</li>
              <li>Use the right sidebar icons for Google Keep notes, Google Tasks, Contacts, and Maps.</li>
              <li>Toggle checkboxes under <strong>My calendars</strong> to filter specific calendar layers.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer-custom">
          <button
            type="button"
            className="btn btn-primary ml-auto"
            onClick={() => setIsHelpModalOpen(false)}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
