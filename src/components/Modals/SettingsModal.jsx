import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Globe, 
  Moon, 
  Sun, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  Bell, 
  Check, 
  ExternalLink,
  Sparkles,
  Mail,
  Calendar,
  CheckSquare
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';

export default function SettingsModal() {
  const { 
    isSettingsModalOpen, 
    setIsSettingsModalOpen,
    language,
    setLanguage,
    LANGUAGES,
    theme,
    toggleTheme,
    userSettings,
    updateUserSettings,
    currentUser
  } = useKaarya();

  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    timeZone: userSettings.timeZone || 'GMT+01:00 (Amsterdam, Berlin, Rome)',
    weekStart: userSettings.weekStart || 'Sunday',
    defaultEventDuration: userSettings.defaultEventDuration || '60',
    autoHealing: userSettings.autoHealing ?? true,
    hitlThreshold: userSettings.hitlThreshold || 'sensitive',
    executionSpeed: userSettings.executionSpeed || 'fast',
    soundEffects: userSettings.soundEffects ?? true,
    privacyMode: userSettings.privacyMode ?? true
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isSettingsModalOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateUserSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsSettingsModalOpen(false);
    }, 700);
  };

  return (
    <div className="modal-backdrop-custom" onClick={() => setIsSettingsModalOpen(false)}>
      <div className="modal-card-custom settings-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-custom">
          <div className="flex items-center gap-2">
            <div className="settings-header-icon-wrap">
              <Settings size={20} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="modal-title-custom">DailyEcho & Google Calendar Settings</h2>
              <p className="modal-subtitle-custom">Customize your workspace preferences, agentic automation and integrations</p>
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn"
            onClick={() => setIsSettingsModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="settings-tabs-row">
          <button 
            type="button"
            className={`settings-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Globe size={16} />
            <span>General</span>
          </button>
          <button 
            type="button"
            className={`settings-tab-btn ${activeTab === 'accounts' ? 'active' : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            <ShieldCheck size={16} />
            <span>Connected Accounts</span>
          </button>
          <button 
            type="button"
            className={`settings-tab-btn ${activeTab === 'agent' ? 'active' : ''}`}
            onClick={() => setActiveTab('agent')}
          >
            <Cpu size={16} />
            <span>DailyEcho AI Agent</span>
          </button>
          <button 
            type="button"
            className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={16} />
            <span>Notifications</span>
          </button>
        </div>

        {/* Body Content */}
        <form onSubmit={handleSave} className="settings-body-content">
          {/* 1. GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="settings-section">
              <div className="form-group-custom">
                <label className="form-label-custom">Interface Language</label>
                <div className="settings-lang-grid">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      className={`settings-lang-chip ${language === l.code ? 'selected' : ''}`}
                      onClick={() => setLanguage(l.code)}
                    >
                      <span>{l.flag}</span>
                      <span className="font-semibold">{l.native}</span>
                      <span className="text-xs text-gray-400">({l.name})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Theme & Appearance</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className={`settings-theme-option ${theme === 'light' ? 'selected' : ''}`}
                    onClick={() => theme === 'dark' && toggleTheme()}
                  >
                    <Sun size={18} className="text-amber-500" />
                    <span>Light Mode</span>
                  </button>
                  <button
                    type="button"
                    className={`settings-theme-option ${theme === 'dark' ? 'selected' : ''}`}
                    onClick={() => theme === 'light' && toggleTheme()}
                  >
                    <Moon size={18} className="text-indigo-400" />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Primary Time Zone</label>
                <select
                  value={formData.timeZone}
                  onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                  className="form-select-custom"
                >
                  <option value="GMT+01:00 (Amsterdam, Berlin, Rome)">GMT+01:00 (Amsterdam, Berlin, Rome)</option>
                  <option value="GMT+05:30 (India Standard Time - IST)">GMT+05:30 (India Standard Time - IST)</option>
                  <option value="GMT-05:00 (Eastern Time - New York)">GMT-05:00 (Eastern Time - New York)</option>
                  <option value="GMT-06:00 (Central Time - Chicago, Austin)">GMT-06:00 (Central Time - Chicago, Austin)</option>
                  <option value="GMT-08:00 (Pacific Time - Los Angeles)">GMT-08:00 (Pacific Time - Los Angeles)</option>
                  <option value="GMT+00:00 (UTC - London)">GMT+00:00 (UTC - London)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group-custom">
                  <label className="form-label-custom">Start of Week</label>
                  <select
                    value={formData.weekStart}
                    onChange={(e) => setFormData({ ...formData, weekStart: e.target.value })}
                    className="form-select-custom"
                  >
                    <option value="Sunday">Sunday (Google Default)</option>
                    <option value="Monday">Monday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>

                <div className="form-group-custom">
                  <label className="form-label-custom">Default Event Duration</label>
                  <select
                    value={formData.defaultEventDuration}
                    onChange={(e) => setFormData({ ...formData, defaultEventDuration: e.target.value })}
                    className="form-select-custom"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes (1 hour)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. CONNECTED ACCOUNTS TAB */}
          {activeTab === 'accounts' && (
            <div className="settings-section">
              <div className="settings-connected-account-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center font-bold">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">Gmail (Google Workspace)</h4>
                      <span className="badge badge-success text-[10px]">Connected</span>
                    </div>
                    <p className="text-xs text-gray-500">Account: {currentUser?.email || 'mayank.workspace@gmail.com'}</p>
                    <p className="text-[11px] text-gray-400">Scopes: gmail.readonly, gmail.compose, gmail.drafts</p>
                  </div>
                </div>
                <button type="button" className="btn btn-secondary text-xs">Manage</button>
              </div>

              <div className="settings-connected-account-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center font-bold">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">Google Calendar</h4>
                      <span className="badge badge-success text-[10px]">Connected</span>
                    </div>
                    <p className="text-xs text-gray-500">Active calendar: {currentUser?.name ? `${currentUser.name}'s Primary Calendar` : 'Primary Calendar'} (Auto-synced)</p>
                    <p className="text-[11px] text-gray-400">Scopes: calendar.events, calendar.readonly, freebusy.query</p>
                  </div>
                </div>
                <button type="button" className="btn btn-secondary text-xs">Manage</button>
              </div>

              <div className="settings-connected-account-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-950/40 text-teal-600 flex items-center justify-center font-bold">
                    <CheckSquare size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">Google Tasks</h4>
                      <span className="badge badge-success text-[10px]">Connected</span>
                    </div>
                    <p className="text-xs text-gray-500">Synced lists: Work, Personal, Strategy Review</p>
                    <p className="text-[11px] text-gray-400">Scopes: tasks.readonly, tasks</p>
                  </div>
                </div>
                <button type="button" className="btn btn-secondary text-xs">Manage</button>
              </div>
            </div>
          )}

          {/* 3. DAILYECHO AI AGENT TAB */}
          {activeTab === 'agent' && (
            <div className="settings-section">
              <div className="settings-toggle-card">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Sparkles size={16} className="text-teal-600" />
                    Auto-Healing Dynamic Rescheduling
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    When meeting conflicts or overlapping slots occur, DailyEcho automatically searches alternate free slots and re-plans the timeline.
                  </p>
                </div>
                <label className="custom-switch">
                  <input
                    type="checkbox"
                    checked={formData.autoHealing}
                    onChange={(e) => setFormData({ ...formData, autoHealing: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="form-group-custom mt-4">
                <label className="form-label-custom">Human-in-the-Loop (HITL) Safety Threshold</label>
                <p className="text-xs text-gray-500 mb-2">Configure when the agent must pause and ask for your explicit approval:</p>
                <div className="space-y-2">
                  <label className={`radio-card-option ${formData.hitlThreshold === 'strict' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="hitl"
                      value="strict"
                      checked={formData.hitlThreshold === 'strict'}
                      onChange={() => setFormData({ ...formData, hitlThreshold: 'strict' })}
                    />
                    <div>
                      <div className="font-semibold text-xs">Strict Safety (Recommended)</div>
                      <div className="text-[11px] text-gray-500">Pause for confirmation before drafting emails and creating any calendar events.</div>
                    </div>
                  </label>
                  <label className={`radio-card-option ${formData.hitlThreshold === 'sensitive' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="hitl"
                      value="sensitive"
                      checked={formData.hitlThreshold === 'sensitive'}
                      onChange={() => setFormData({ ...formData, hitlThreshold: 'sensitive' })}
                    />
                    <div>
                      <div className="font-semibold text-xs">Sensitive Actions Only</div>
                      <div className="text-[11px] text-gray-500">Only ask before sending external emails or modifying meetings with 3+ attendees.</div>
                    </div>
                  </label>
                  <label className={`radio-card-option ${formData.hitlThreshold === 'autonomous' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="hitl"
                      value="autonomous"
                      checked={formData.hitlThreshold === 'autonomous'}
                      onChange={() => setFormData({ ...formData, hitlThreshold: 'autonomous' })}
                    />
                    <div>
                      <div className="font-semibold text-xs">Fully Autonomous</div>
                      <div className="text-[11px] text-gray-500">Execute all atomic tool operations without manual interruption and generate cryptographic hash assertion.</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="settings-toggle-card mt-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">Zero-Data Retention Privacy Mode</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Emails, event titles, and task bodies are processed in RAM session tokens and never stored on third-party servers.
                  </p>
                </div>
                <label className="custom-switch">
                  <input
                    type="checkbox"
                    checked={formData.privacyMode}
                    onChange={(e) => setFormData({ ...formData, privacyMode: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          )}

          {/* 4. NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <div className="settings-toggle-card">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">Audio Chimes & Confetti Celebrations</h4>
                  <p className="text-xs text-gray-500 mt-1">Play subtle completion chimes and launch confetti when an AI workflow completes.</p>
                </div>
                <label className="custom-switch">
                  <input
                    type="checkbox"
                    checked={formData.soundEffects}
                    onChange={(e) => setFormData({ ...formData, soundEffects: e.target.checked })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="settings-toggle-card mt-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">Calendar Event Reminders</h4>
                  <p className="text-xs text-gray-500 mt-1">Send Google notification 10 minutes prior to scheduled events.</p>
                </div>
                <label className="custom-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="settings-toggle-card mt-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">Agent Execution Audit Digest</h4>
                  <p className="text-xs text-gray-500 mt-1">Email daily digest of automated tasks, DAG step proofs, and rescheduled conflicts.</p>
                </div>
                <label className="custom-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="modal-footer-custom">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsSettingsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
            >
              {saveSuccess ? (
                <>
                  <Check size={16} />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
