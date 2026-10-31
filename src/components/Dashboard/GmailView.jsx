import React, { useState, useMemo } from 'react';
import { 
  Mail, 
  Send, 
  FileText, 
  Sparkles, 
  Search, 
  Star, 
  Trash2, 
  ArrowLeft,
  Clock, 
  ShieldCheck, 
  Check, 
  RefreshCw, 
  Calendar as CalIcon, 
  ArrowRight, 
  ExternalLink, 
  Users, 
  MapPin, 
  Plus, 
  X, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';
import { parseMeetingFromEmail, isMeetingAlreadyScheduled } from '../../services/emailMeetingParser';
import { formatFullDate, toISODateString, addDays } from '../../services/calendarUtils';

export default function GmailView() {
  const { 
    emails, 
    drafts, 
    calendarEvents, 
    addNewCalendarEvent, 
    scheduleMeetingFromEmail, 
    batchScheduleMeetingsFromGmail, 
    addEmail,
    setCurrentView,
    startAgentExecution 
  } = useKaarya();

  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox', 'meetings', 'drafts'
  const [selectedEmailId, setSelectedEmailId] = useState(() => emails[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

  // New simulated email composer state
  const [newSender, setNewSender] = useState('Sarah Jenkins <sarah.j@vertexcloud.io>');
  const [newSubject, setNewSubject] = useState('Product Design Sync tomorrow at 4:00 PM');
  const [newBody, setNewBody] = useState(`Hi Mayank,

Can we schedule a quick follow-up meeting for tomorrow at 4:00 PM? We want to review the latest interface designs and make sure calendar sync is working flawlessly.

Google Meet link: meet.google.com/design-sync

Best,
Sarah`);

  // Avatar gradient generator based on sender name
  const getAvatarColor = (name) => {
    const colors = [
      'linear-gradient(135deg, #0d9488, #14b8a6)',
      'linear-gradient(135deg, #6366f1, #8b5cf6)',
      'linear-gradient(135deg, #f59e0b, #d97706)',
      'linear-gradient(135deg, #ec4899, #f43f5e)',
      'linear-gradient(135deg, #0ea5e9, #0284c7)',
      'linear-gradient(135deg, #10b981, #059669)',
      'linear-gradient(135deg, #8b5cf6, #a855f7)',
    ];
    let hash = 0;
    const str = name || '';
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const clean = name.split('<')[0].replace(/[^\w\s]/g, '').trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase() || 'U';
  };

  // Selected email object
  const selectedEmail = useMemo(() => {
    if (activeTab === 'drafts') {
      return drafts.find(d => d.id === selectedEmailId) || drafts[0] || null;
    }
    return emails.find(e => e.id === selectedEmailId) || emails[0] || null;
  }, [emails, drafts, selectedEmailId, activeTab]);

  // Analyze selected email for meeting intent and timing
  const selectedEmailAnalysis = useMemo(() => {
    if (!selectedEmail || activeTab === 'drafts') return null;
    return parseMeetingFromEmail(selectedEmail);
  }, [selectedEmail, activeTab]);

  // Check if selected email's meeting is already on the calendar
  const isSelectedMeetingScheduled = useMemo(() => {
    if (!selectedEmailAnalysis?.details) return false;
    return isMeetingAlreadyScheduled(selectedEmailAnalysis.details, calendarEvents);
  }, [selectedEmailAnalysis, calendarEvents]);

  // Filtered emails based on search and active tab
  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      // Tab filter
      if (activeTab === 'meetings') {
        const analysis = parseMeetingFromEmail(email);
        if (!analysis || !analysis.hasMeeting || !analysis.hasTiming) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSubject = email.subject && email.subject.toLowerCase().includes(q);
        const matchFrom = email.from && email.from.toLowerCase().includes(q);
        const matchSnippet = email.snippet && email.snippet.toLowerCase().includes(q);
        const matchBody = email.body && email.body.toLowerCase().includes(q);
        return matchSubject || matchFrom || matchSnippet || matchBody;
      }

      return true;
    });
  }, [emails, activeTab, searchQuery]);

  // Count how many emails have meeting & timing detected
  const meetingEmailsCount = useMemo(() => {
    return emails.filter(e => {
      const a = parseMeetingFromEmail(e);
      return a && a.hasMeeting && a.hasTiming;
    }).length;
  }, [emails]);

  // Sync action: simulates syncing with Gmail and automatically scanning threads
  const handleSyncFromGmail = () => {
    setIsSyncing(true);
    setSyncFeedback(null);

    setTimeout(() => {
      setIsSyncing(false);
      // Auto-schedule any newly detected meetings from emails
      const scheduled = batchScheduleMeetingsFromGmail();

      if (scheduled.length > 0) {
        setSyncFeedback({
          type: 'success',
          message: `Synced with Gmail! Automatically scheduled ${scheduled.length} new meeting(s) to your Calendar.`
        });
      } else {
        setSyncFeedback({
          type: 'info',
          message: `Gmail sync complete. All detected meetings (${meetingEmailsCount}) are already up to date in your Calendar.`
        });
      }

      setTimeout(() => {
        setSyncFeedback(null);
      }, 5000);
    }, 1000);
  };

  // Schedule meeting from the current selected email
  const handleScheduleCurrentMeeting = () => {
    if (!selectedEmail) return;
    const result = scheduleMeetingFromEmail(selectedEmail);
    if (result) {
      setSyncFeedback({
        type: 'success',
        message: `Meeting "${result.title}" scheduled for ${formatFullDate(result.date)} (${result.timeDisplay})!`
      });
      setTimeout(() => setSyncFeedback(null), 4000);
    }
  };

  // Schedule and jump directly to calendar
  const handleScheduleAndGoToCalendar = () => {
    if (!selectedEmail) return;
    scheduleMeetingFromEmail(selectedEmail);
    setCurrentView('calendar');
  };

  // Handle submitting a simulated new email to test meeting sync
  const handleCreateTestEmail = (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newBody.trim()) return;

    const created = addEmail({
      from: newSender,
      subject: newSubject,
      body: newBody,
      snippet: newBody.slice(0, 100)
    });

    setSelectedEmailId(created.id);
    setIsComposeModalOpen(false);

    // Auto-schedule meeting if timing is in the email
    const analysis = parseMeetingFromEmail(created);
    if (analysis && analysis.hasMeeting && analysis.hasTiming) {
      scheduleMeetingFromEmail(created);
      setSyncFeedback({
        type: 'success',
        message: `New email received and meeting "${analysis.details.title}" was automatically scheduled to your Calendar!`
      });
      setTimeout(() => setSyncFeedback(null), 5000);
    }
  };

  return (
    <div className="gmail-view-container">
      {/* 1. TOP HEADER & SYNC CONTROLS */}
      <div className="gmail-top-header">
        <div className="gmail-header-title-wrap">
          <div className="gmail-header-title-row">
            <h1 className="gmail-header-title">Gmail Workspace Connection</h1>
            <span className="gmail-oauth-badge">
              <ShieldCheck size={13} />
              <span>OAuth Synced</span>
            </span>
          </div>
          <p className="gmail-header-subtitle">
            Intelligent email monitoring, thread analysis, and autonomous calendar meeting scheduling
          </p>
        </div>

        <div className="gmail-header-controls">
          {/* Tab filter pills */}
          <div className="gmail-filter-tabs">
            <button
              type="button"
              className={`gmail-tab-pill ${activeTab === 'inbox' ? 'active' : ''}`}
              onClick={() => { setActiveTab('inbox'); setSelectedEmailId(emails[0]?.id || null); }}
            >
              <Mail size={13} />
              <span>Inbox ({emails.length})</span>
            </button>
            <button
              type="button"
              className={`gmail-tab-pill ${activeTab === 'meetings' ? 'active' : ''}`}
              onClick={() => { setActiveTab('meetings'); setSelectedEmailId(emails[0]?.id || null); }}
            >
              <Sparkles size={13} />
              <span>Meetings Detected ({meetingEmailsCount})</span>
            </button>
            <button
              type="button"
              className={`gmail-tab-pill ${activeTab === 'drafts' ? 'active' : ''}`}
              onClick={() => { setActiveTab('drafts'); setSelectedEmailId(drafts[0]?.id || null); }}
            >
              <FileText size={13} />
              <span>Drafts ({drafts.length})</span>
            </button>
          </div>

          {/* Simulate New Incoming Email Button */}
          <button
            type="button"
            className="btn btn-secondary btn-pill text-xs flex items-center gap-1.5"
            onClick={() => setIsComposeModalOpen(true)}
            title="Simulate receiving an email with a meeting request"
          >
            <Plus size={14} />
            <span>Receive Test Email</span>
          </button>

          {/* Sync from Gmail Button */}
          <button
            type="button"
            className="btn btn-primary btn-pill text-xs flex items-center gap-2 shadow-sm"
            onClick={handleSyncFromGmail}
            disabled={isSyncing}
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing Mails...' : 'Sync from Gmail & Schedule'}</span>
          </button>
        </div>
      </div>

      {/* Sync Feedback Alert Banner */}
      {syncFeedback && (
        <div className={`gmail-feedback-banner ${syncFeedback.type}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} />
            <span>{syncFeedback.message}</span>
          </div>
          <button 
            type="button"
            className="btn btn-secondary btn-pill text-[11px] py-1 px-3"
            onClick={() => setCurrentView('calendar')}
          >
            <span>View in Calendar</span>
            <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* 2. GMAIL TWO-PANE LAYOUT */}
      <div className="gmail-two-pane">
        {/* Left Pane: Email List */}
        <div className="gmail-list-pane">
          <div className="gmail-search-strip">
            <Search size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <input 
              type="text" 
              placeholder="Search sender, subject, or content..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="gmail-search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="gmail-threads-scroll">
            {activeTab !== 'drafts' ? (
              filteredEmails.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                  No matching email threads found.
                </div>
              ) : (
                filteredEmails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  const analysis = parseMeetingFromEmail(email);
                  const isScheduled = analysis?.details && isMeetingAlreadyScheduled(analysis.details, calendarEvents);
                  const senderName = email.from ? email.from.split('<')[0].trim() : 'Unknown';

                  return (
                    <div
                      key={email.id}
                      className={`gmail-thread-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedEmailId(email.id)}
                    >
                      <div 
                        className="gmail-sender-avatar"
                        style={{ background: getAvatarColor(senderName) }}
                      >
                        {getInitials(senderName)}
                      </div>

                      <div className="gmail-thread-body-col">
                        <div className="gmail-thread-header-row">
                          <span className="gmail-thread-sender">{senderName}</span>
                          <span className="gmail-thread-date">{email.date}</span>
                        </div>
                        <div className="gmail-thread-subject">{email.subject}</div>
                        <div className="gmail-thread-snippet">{email.snippet}</div>

                        {/* Meeting Indicator Pill */}
                        {analysis && analysis.hasMeeting && analysis.hasTiming && (
                          isScheduled ? (
                            <span className="gmail-detected-badge scheduled">
                              <Check size={11} /> Scheduled in Calendar
                            </span>
                          ) : (
                            <span className="gmail-detected-badge pending">
                              <Sparkles size={11} /> Meeting detected: {analysis.details.timeDisplay}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              drafts.map((draft) => (
                <div
                  key={draft.id}
                  className={`gmail-thread-card ${selectedEmailId === draft.id ? 'selected' : ''}`}
                  onClick={() => setSelectedEmailId(draft.id)}
                >
                  <div 
                    className="gmail-sender-avatar"
                    style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}
                  >
                    ED
                  </div>
                  <div className="gmail-thread-body-col">
                    <div className="gmail-thread-header-row">
                      <span className="gmail-thread-sender" style={{ color: '#0d9488' }}>Draft to: {draft.to}</span>
                      <span className="gmail-thread-date">{draft.updatedAt}</span>
                    </div>
                    <div className="gmail-thread-subject">{draft.subject}</div>
                    <div className="gmail-thread-snippet">{draft.snippet}</div>
                    <span className="gmail-detected-badge scheduled">
                      <Sparkles size={11} /> Generated by DailyEcho
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Reading Email Preview */}
        <div className="gmail-reading-pane">
          {selectedEmail ? (
            <div className="email-reading-body">
              {/* Header */}
              <h2 className="reading-subject">{selectedEmail.subject}</h2>

              <div className="reading-sender-card">
                <div className="reading-sender-left">
                  <div 
                    className="gmail-sender-avatar"
                    style={{ background: getAvatarColor(selectedEmail.from || selectedEmail.to) }}
                  >
                    {getInitials(selectedEmail.from || selectedEmail.to)}
                  </div>
                  <div className="reading-sender-details">
                    <div className="reading-sender-name">
                      {selectedEmail.from || `Draft to: ${selectedEmail.to}`}
                    </div>
                    <div className="reading-sender-to">
                      To: {selectedEmail.to || 'me@dailyecho.ai'}
                    </div>
                  </div>
                </div>

                <div className="reading-date-pill">
                  {selectedEmail.date || selectedEmail.updatedAt}
                </div>
              </div>

              {/* Email Body Content */}
              <div className="email-body-content-wrap">
                {selectedEmail.body}
              </div>

              {/* 3. DEDICATED MEETING DETECTION & CALENDAR SCHEDULING CARD */}
              {selectedEmailAnalysis && selectedEmailAnalysis.hasMeeting && selectedEmailAnalysis.details && (
                <div className="gmail-meeting-detection-card">
                  <div className="gmail-meeting-card-header">
                    <div className="gmail-meeting-header-left">
                      <div className="gmail-meeting-icon-orb">
                        <CalIcon size={20} />
                      </div>
                      <div className="gmail-meeting-title-col">
                        <span className="gmail-meeting-title-text">
                          Google Calendar Meeting Detected in Thread
                        </span>
                        <span className="gmail-meeting-desc-text">
                          Autonomous intelligence extracted scheduling details from this conversation
                        </span>
                      </div>
                    </div>

                    {isSelectedMeetingScheduled ? (
                      <span className="gmail-detected-badge scheduled" style={{ fontSize: '12px', padding: '5px 12px' }}>
                        <Check size={13} /> Scheduled on Calendar
                      </span>
                    ) : (
                      <span className="gmail-detected-badge pending" style={{ fontSize: '12px', padding: '5px 12px' }}>
                        <Sparkles size={13} /> Ready to Schedule
                      </span>
                    )}
                  </div>

                  {/* Meeting Details Summary Grid */}
                  <div className="gmail-meeting-details-grid">
                    <div className="gmail-detail-box">
                      <div className="gmail-detail-icon-circle">
                        <FileText size={16} />
                      </div>
                      <div className="gmail-detail-content">
                        <span className="gmail-detail-label">Meeting Title</span>
                        <span className="gmail-detail-val">
                          {selectedEmailAnalysis.details.title}
                        </span>
                      </div>
                    </div>

                    <div className="gmail-detail-box">
                      <div className="gmail-detail-icon-circle">
                        <Clock size={16} />
                      </div>
                      <div className="gmail-detail-content">
                        <span className="gmail-detail-label">Date & Timing</span>
                        <span className="gmail-detail-val" style={{ color: '#0d9488' }}>
                          {formatFullDate(selectedEmailAnalysis.details.date)} • {selectedEmailAnalysis.details.timeDisplay}
                        </span>
                      </div>
                    </div>

                    <div className="gmail-detail-box">
                      <div className="gmail-detail-icon-circle">
                        <MapPin size={16} />
                      </div>
                      <div className="gmail-detail-content">
                        <span className="gmail-detail-label">Location / Conference</span>
                        <span className="gmail-detail-val">
                          {selectedEmailAnalysis.details.location}
                        </span>
                      </div>
                    </div>

                    <div className="gmail-detail-box">
                      <div className="gmail-detail-icon-circle">
                        <Users size={16} />
                      </div>
                      <div className="gmail-detail-content">
                        <span className="gmail-detail-label">Guests & Attendees</span>
                        <span className="gmail-detail-val">
                          {selectedEmailAnalysis.details.attendees.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="gmail-meeting-actions-bar">
                    {isSelectedMeetingScheduled ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#059669', fontWeight: 600 }}>
                          <CheckCircle2 size={16} />
                          <span>This meeting timing is locked into your Calendar.</span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary btn-pill text-xs flex items-center gap-1.5"
                          onClick={() => setCurrentView('calendar')}
                        >
                          <span>Open in Calendar Tab</span>
                          <ArrowRight size={13} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-primary btn-pill text-xs flex items-center gap-1.5"
                          onClick={handleScheduleCurrentMeeting}
                        >
                          <CalIcon size={14} />
                          <span>⚡ Schedule Meeting in Calendar</span>
                        </button>

                        <button
                          type="button"
                          className="btn btn-secondary btn-pill text-xs flex items-center gap-1.5"
                          onClick={handleScheduleAndGoToCalendar}
                        >
                          <span>Schedule & Open Calendar</span>
                          <ArrowRight size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Action Banner for Full Agentic Multi-App Automation */}
              <div className="gmail-agent-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0d9488', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                      DailyEcho Autonomous Coordinator
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                      One-click cross-app execution: locks calendar, organizes action items in Tasks Board, and prepares responses.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-pill text-xs flex items-center gap-1.5 shadow-sm"
                  onClick={() => {
                    setCurrentView('dashboard');
                    startAgentExecution(`Coordinate meeting and prepare tasks based on thread: "${selectedEmail.subject}"`);
                  }}
                >
                  <Sparkles size={13} />
                  <span>Execute Full Multi-App Workflow</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', gap: '12px' }}>
              <Mail size={40} />
              <p style={{ fontSize: '14px', fontWeight: 600 }}>Select an email thread from the inbox to read</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. MODAL: SIMULATE NEW EMAIL COMPOSER */}
      {isComposeModalOpen && (
        <div className="modal-backdrop-custom" onClick={() => setIsComposeModalOpen(false)}>
          <div className="modal-card-custom add-event-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="add-event-topbar" style={{ backgroundColor: '#0d9488' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
                <Mail size={18} />
                <span style={{ fontWeight: 700, fontSize: '14px' }}>Receive / Simulate Test Email</span>
              </div>
              <button 
                type="button" 
                className="popover-close-btn"
                onClick={() => setIsComposeModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTestEmail} className="add-event-form-body">
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                Simulate receiving an email with meeting words and timing (e.g. "tomorrow at 4:00 PM" or "next Tuesday at 11:00 AM"). DailyEcho will detect it and schedule it directly into your Calendar!
              </p>

              <div className="form-group-custom">
                <label className="form-label-custom">Sender</label>
                <input
                  type="text"
                  value={newSender}
                  onChange={(e) => setNewSender(e.target.value)}
                  className="form-input-custom"
                  required
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Subject</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="form-input-custom"
                  required
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Email Body (Include meeting and timing)</label>
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={6}
                  className="form-textarea-custom font-sans"
                  required
                />
              </div>

              <div className="modal-footer-custom">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsComposeModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Send size={14} />
                  <span>Receive Email & Auto-Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
