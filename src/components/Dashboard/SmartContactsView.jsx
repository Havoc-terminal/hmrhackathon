import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  X, 
  Plus, 
  Brain, 
  CheckSquare, 
  Briefcase, 
  Zap, 
  Calendar as CalIcon, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ArrowRight,
  Users
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';
import { toISODateString } from '../../services/calendarUtils';
import {
  initialSmartContacts,
  scoreContactForTask
} from '../../services/smartContactsData';

export default function SmartContactsView() {
  const { 
    tasks, 
    setCurrentView, 
    addEmail, 
    addNewCalendarEvent, 
    addNotification, 
    setIsAddTaskModalOpen 
  } = useKaarya();

  // Smart Contacts State
  const [selectedTaskId, setSelectedTaskId] = useState(() => (tasks && tasks[0]?.id) || 'all');
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [contactCategoryFilter, setContactCategoryFilter] = useState('All');
  const [actionToast, setActionToast] = useState(null);

  // Auto-dismiss action toast after 4.5s
  useEffect(() => {
    if (actionToast) {
      const timer = setTimeout(() => {
        setActionToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [actionToast]);

  // Selected task object
  const selectedTask = useMemo(() => {
    if (selectedTaskId === 'all') return null;
    return (tasks || []).find(t => t.id === selectedTaskId) || null;
  }, [selectedTaskId, tasks]);

  // Dynamic ML ranking for all contacts based on selected task or global tasks
  const rankedContacts = useMemo(() => {
    let list = initialSmartContacts.map(contact => {
      if (selectedTask) {
        const match = scoreContactForTask(contact, selectedTask);
        return {
          ...contact,
          matchScore: match.score,
          isRelevant: match.isRelevant,
          matchedReason: match.matchedReason,
          relevantTask: selectedTask
        };
      } else {
        // Global mode: compute top task match from all available tasks
        let bestMatch = { score: 65, task: (tasks && tasks[0]) || null, reason: `Specializes in ${contact.expertise.slice(0, 2).join(' & ')}` };
        if (tasks && tasks.length > 0) {
          tasks.forEach(t => {
            const m = scoreContactForTask(contact, t);
            if (m.score > bestMatch.score) {
              bestMatch = { score: m.score, task: t, reason: m.matchedReason };
            }
          });
        }
        return {
          ...contact,
          matchScore: bestMatch.score,
          isRelevant: bestMatch.score >= 75,
          matchedReason: bestMatch.reason,
          relevantTask: bestMatch.task
        };
      }
    });

    // Category filter
    if (contactCategoryFilter !== 'All') {
      list = list.filter(c => c.primaryCategory === contactCategoryFilter);
    }

    // Search query
    if (contactSearchQuery.trim()) {
      const q = contactSearchQuery.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.bio.toLowerCase().includes(q) ||
        c.expertise.some(e => e.toLowerCase().includes(q))
      );
    }

    // Sort descending by match score
    list.sort((a, b) => b.matchScore - a.matchScore);
    return list;
  }, [selectedTask, tasks, contactCategoryFilter, contactSearchQuery]);

  // Top AI spotlight recommendation for the selected task
  const topSpotlightContact = useMemo(() => {
    if (selectedTask && rankedContacts.length > 0) {
      return rankedContacts[0];
    }
    return null;
  }, [selectedTask, rankedContacts]);

  // 1-Click Action Handlers:
  const handleOneClickAssignAndEmail = (contact, task) => {
    const targetTask = task || selectedTask || (tasks && tasks[0]) || {
      title: 'Priority Project Execution',
      category: 'Work',
      priority: 'High',
      description: 'Review workflow deliverables and coordinate implementation.'
    };

    // 1. Dispatch email to Gmail threads
    addEmail({
      from: 'Mayank <me@dailyecho.ai>',
      to: `${contact.name} <${contact.email}>`,
      subject: `Task Assignment: ${targetTask.title} [Priority: ${targetTask.priority || 'High'}]`,
      snippet: `Hi ${contact.name}, you have been recommended and assigned to collaborate on "${targetTask.title}". Requirements and brief enclosed.`,
      body: `Hi ${contact.name},

You have been recommended by DailyEcho AI and assigned to collaborate on the following task:

📌 Task: ${targetTask.title}
📂 Category: ${targetTask.category || 'General'}
⚡ Priority: ${targetTask.priority || 'High'}
📅 Due Date: ${targetTask.dueDate || 'Flexible'}
📝 Brief & Instructions: ${targetTask.description || 'Please review requirements and coordinate with the workspace.'}

💡 AI Match Insight:
Recommended based on your role as ${contact.role} at ${contact.company} and proven expertise in ${contact.expertise.slice(0, 3).join(', ')}.

Please confirm receipt or book a quick sync directly on my Google Calendar.

Best regards,
Mayank
DailyEcho Intelligent Workspace`,
      date: 'Just now',
      labels: ['Inbox', 'Work', 'Sent']
    });

    // 2. Dispatch system notification
    addNotification({
      title: `Task Brief Dispatched to ${contact.name}`,
      desc: `Assigned "${targetTask.title}" and sent detailed brief to ${contact.email}.`,
      type: 'email'
    });

    // 3. Show confirmation toast
    setActionToast({
      type: 'email',
      title: `Assigned & Emailed ${contact.name}!`,
      subtitle: `Brief for "${targetTask.title}" dispatched to ${contact.email}.`,
      actionText: 'Open Gmail Threads',
      onAction: () => setCurrentView('inbox')
    });
  };

  const handleOneClickScheduleSync = (contact, task) => {
    const targetTask = task || selectedTask || (tasks && tasks[0]) || {
      title: 'Alignment Sync',
      priority: 'High'
    };
    const todayDateStr = toISODateString(new Date());

    // 1. Book on Google Calendar
    addNewCalendarEvent({
      title: `Sync: ${targetTask.title} w/ ${contact.name}`,
      date: todayDateStr,
      startHour: 16.0,
      endHour: 16.5,
      location: `Google Meet (meet.google.com/eco-${contact.id.replace('contact-', '')})`,
      attendees: [
        { name: 'Mayank', email: 'me@dailyecho.ai' },
        { name: contact.name, email: contact.email, avatar: contact.avatar }
      ],
      description: `30-minute collaboration sync regarding "${targetTask.title}". Specialist in ${contact.expertise.slice(0, 2).join(', ')}.`,
      color: '#0d9488',
      isAiGenerated: true
    });

    // 2. Dispatch calendar invitation email
    addEmail({
      from: 'Google Calendar <calendar-notification@google.com>',
      to: `${contact.name} <${contact.email}>`,
      subject: `Invitation: Sync: ${targetTask.title} w/ ${contact.name} @ Today 4:00 PM - 4:30 PM`,
      snippet: `Google Meet video call invitation for "${targetTask.title}". Click link to join meeting.`,
      body: `Hi ${contact.name},

You have been scheduled for a 30-minute synchronization call on Google Calendar:

📅 Event: Sync: ${targetTask.title} w/ ${contact.name}
🕒 Time: Today, 4:00 PM - 4:30 PM
💻 Video: https://meet.google.com/eco-${contact.id.replace('contact-', '')}
📋 Context: Alignment for "${targetTask.title}".

Status: Confirmed & synced on DailyEcho Calendar.`,
      date: 'Just now',
      labels: ['Inbox', 'Work', 'Calendar']
    });

    // 3. Dispatch system notification
    addNotification({
      title: `Sync Scheduled w/ ${contact.name}`,
      desc: `Booked 30-min Google Meet session for "${targetTask.title}" at 4:00 PM today.`,
      type: 'calendar'
    });

    // 4. Show confirmation toast
    setActionToast({
      type: 'calendar',
      title: `Meeting Booked with ${contact.name}!`,
      subtitle: `Added to Google Calendar for 4:00 PM today & calendar invitation emailed.`,
      actionText: 'View on Calendar',
      onAction: () => setCurrentView('calendar')
    });
  };

  return (
    <div className="smart-contacts-page-wrapper">
      {/* =========================================================
          SMART CONTACTS & ML TASK RECOMMENDATION ENGINE
          ========================================================= */}
      <section className="smart-contacts-section" id="smart-contacts-engine">
        {/* Header Bar */}
        <div className="smart-contacts-header-bar">
          <div className="smart-contacts-header-info">
            <div className="smart-contacts-tag">
              <Sparkles size={14} className="smart-tag-icon" />
              <span>ML TASK & TALENT MATCHER</span>
            </div>
            <h2 className="smart-contacts-title">Smart Contacts & Task Recommendations</h2>
            <p className="smart-contacts-subtitle">
              Intelligent semantic engine analyzes all tasks created in the <strong>Add Task</strong> modal and matches each item with the most qualified person. Collaborate with one-click dispatch.
            </p>
          </div>

          <div className="smart-contacts-header-actions">
            <div className="smart-contacts-search-box">
              <Search size={16} className="smart-search-icon" />
              <input 
                type="text" 
                placeholder="Search by name, role, skill, bio..." 
                value={contactSearchQuery}
                onChange={(e) => setContactSearchQuery(e.target.value)}
                className="smart-contacts-search-input"
              />
              {contactSearchQuery && (
                <button 
                  type="button" 
                  className="smart-search-clear-btn"
                  onClick={() => setContactSearchQuery('')}
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button 
              type="button" 
              className="smart-add-task-trigger-btn"
              onClick={() => setIsAddTaskModalOpen(true)}
              title="Add a new task to test ML matching"
            >
              <Plus size={16} />
              <span>Add New Task</span>
            </button>
          </div>
        </div>

        {/* Task Selection Filter Bar */}
        <div className="smart-tasks-filter-container">
          <div className="smart-filter-title-row">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-teal-600 dark:text-teal-400" />
              <span className="smart-filter-label">Select Task to Match with Qualified Team:</span>
            </div>
            <div className="smart-category-tabs">
              {['All', 'Work', 'Health', 'Finance', 'Personal'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`smart-cat-btn ${contactCategoryFilter === cat ? 'active' : ''}`}
                  onClick={() => setContactCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Task Pills Carousel / Grid */}
          <div className="smart-tasks-pill-list">
            <button
              type="button"
              className={`smart-task-pill ${selectedTaskId === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTaskId('all')}
            >
              <Sparkles size={14} />
              <span>All Tasks / Auto-Score ({(tasks || []).length})</span>
            </button>

            {(tasks || []).map(task => {
              const isSelected = selectedTaskId === task.id;
              return (
                <button
                  key={task.id}
                  type="button"
                  className={`smart-task-pill ${isSelected ? 'active' : ''} priority-${(task.priority || 'medium').toLowerCase()}`}
                  onClick={() => setSelectedTaskId(task.id)}
                  title={task.description || task.title}
                >
                  <CheckSquare size={13} className="pill-check-icon" />
                  <span className="task-pill-title">{task.title}</span>
                  <span className={`task-pill-badge badge-${(task.category || 'work').toLowerCase()}`}>
                    {task.category || 'Task'}
                  </span>
                  {task.priority === 'High' && (
                    <span className="task-pill-priority">High</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Recommendation Spotlight Card (When a specific task is selected) */}
        {topSpotlightContact && selectedTask && (
          <div className="smart-spotlight-card">
            <div className="spotlight-top-badge">
              <Sparkles size={14} />
              <span>AI HIGHEST CONFIDENCE MATCH ({topSpotlightContact.matchScore}% ML ACCURACY)</span>
            </div>

            <div className="spotlight-content-row">
              {/* Contact Profile */}
              <div className="spotlight-profile-section">
                <div className="spotlight-avatar-wrapper">
                  <img src={topSpotlightContact.avatar} alt={topSpotlightContact.name} className="spotlight-avatar" />
                  <span className={`status-indicator status-${topSpotlightContact.status.toLowerCase().replace(/\s+/g, '-')}`} />
                </div>

                <div className="spotlight-meta">
                  <div className="spotlight-name-row">
                    <h3 className="spotlight-name">{topSpotlightContact.name}</h3>
                    <span className="spotlight-role-pill">{topSpotlightContact.role}</span>
                  </div>
                  <div className="spotlight-company-row">
                    <Briefcase size={13} className="text-gray-400" />
                    <span className="spotlight-company">{topSpotlightContact.company}</span>
                    <span className="spotlight-dot">•</span>
                    <span className="spotlight-status">{topSpotlightContact.status}</span>
                  </div>
                </div>
              </div>

              {/* Task & ML Match Reasoning */}
              <div className="spotlight-reasoning-section">
                <div className="spotlight-task-box">
                  <div className="spotlight-task-label">RECOMMENDED FOR THIS TASK:</div>
                  <div className="spotlight-task-title-row">
                    <span className="spotlight-task-title">"{selectedTask.title}"</span>
                    <span className={`task-pill-badge badge-${(selectedTask.category || 'work').toLowerCase()}`}>
                      {selectedTask.category}
                    </span>
                  </div>
                  <div className="spotlight-reason-text">
                    💡 <strong>Why this person:</strong> {topSpotlightContact.matchedReason}
                  </div>
                </div>

                <div className="spotlight-skills-row">
                  {topSpotlightContact.expertise.map((exp, idx) => (
                    <span key={idx} className="spotlight-skill-tag">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* 1-Click Action Buttons */}
              <div className="spotlight-actions-section">
                <button
                  type="button"
                  className="smart-action-btn primary-assign-btn"
                  onClick={() => handleOneClickAssignAndEmail(topSpotlightContact, selectedTask)}
                  title={`Send task assignment & email brief to ${topSpotlightContact.name}`}
                >
                  <Zap size={16} />
                  <span>1-Click Assign & Email Brief</span>
                </button>

                <button
                  type="button"
                  className="smart-action-btn secondary-sync-btn"
                  onClick={() => handleOneClickScheduleSync(topSpotlightContact, selectedTask)}
                  title={`Book 30-min Google Meet sync with ${topSpotlightContact.name}`}
                >
                  <CalIcon size={16} />
                  <span>1-Click Schedule Sync</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contacts Grid */}
        <div className="smart-contacts-grid-container">
          <div className="grid-header-row">
            <div className="grid-count-text">
              Showing <strong>{rankedContacts.length}</strong> Qualified Team Contacts
              {selectedTask ? ` ranked by relevance for "${selectedTask.title}"` : ' ranked across all tasks'}
            </div>
          </div>

          <div className="smart-contacts-grid">
            {rankedContacts.map((contact) => {
              const targetTask = contact.relevantTask || selectedTask || (tasks && tasks[0]);
              const isHighScore = contact.matchScore >= 85;

              return (
                <div 
                  key={contact.id} 
                  className={`smart-contact-card ${isHighScore ? 'high-relevance-card' : ''}`}
                >
                  {/* Card Top: Avatar, Name, Score Badge */}
                  <div className="contact-card-top">
                    <div className="contact-avatar-box">
                      <img src={contact.avatar} alt={contact.name} className="contact-card-avatar" />
                      <span className={`status-dot status-${contact.status.toLowerCase().replace(/\s+/g, '-')}`} />
                    </div>

                    <div className="contact-card-title-box">
                      <h4 className="contact-card-name">{contact.name}</h4>
                      <div className="contact-card-role">{contact.role}</div>
                      <div className="contact-card-company">{contact.company}</div>
                    </div>

                    <div className={`contact-match-badge ${isHighScore ? 'badge-high' : 'badge-normal'}`}>
                      <span className="score-num">{contact.matchScore}%</span>
                      <span className="score-label">{isHighScore ? 'Match' : 'Relevance'}</span>
                    </div>
                  </div>

                  {/* "What He / She Does" & Bio */}
                  <div className="contact-what-he-does-section">
                    <div className="section-label">WHAT THEY DO:</div>
                    <p className="contact-bio-text">{contact.bio}</p>

                    <div className="contact-expertise-pills">
                      {contact.expertise.map((exp, idx) => (
                        <span key={idx} className="expertise-pill">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Task Callout */}
                  {targetTask && (
                    <div className="contact-task-callout">
                      <div className="callout-header">
                        <Sparkles size={12} className="text-teal-600 dark:text-teal-400" />
                        <span>Recommended for: <strong>{targetTask.title}</strong></span>
                      </div>
                      <div className="callout-reason">
                        {contact.matchedReason}
                      </div>
                    </div>
                  )}

                  {/* Contact Quick Details */}
                  <div className="contact-comms-row">
                    <a href={`mailto:${contact.email}`} className="comm-link" title={`Email ${contact.email}`}>
                      <Mail size={13} />
                      <span>{contact.email}</span>
                    </a>
                    <a href={`tel:${contact.phone}`} className="comm-link" title={`Call ${contact.phone}`}>
                      <Phone size={13} />
                      <span>{contact.phone}</span>
                    </a>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="contact-card-actions">
                    <button
                      type="button"
                      className="btn-card-action btn-assign"
                      title={`1-Click Assign & Email Brief to ${contact.name}`}
                      onClick={() => handleOneClickAssignAndEmail(contact, targetTask)}
                    >
                      <Zap size={14} />
                      <span>1-Click Assign & Email</span>
                    </button>

                    <button
                      type="button"
                      className="btn-card-action btn-sync"
                      title={`1-Click Schedule Google Meet Sync with ${contact.name}`}
                      onClick={() => handleOneClickScheduleSync(contact, targetTask)}
                    >
                      <CalIcon size={14} />
                      <span>1-Click Schedule</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Floating Action Confirmation Toast */}
      {actionToast && (
        <div className="smart-contacts-toast-banner">
          <div className="toast-icon-circle">
            <CheckCircle2 size={20} className="text-white" />
          </div>
          <div className="toast-body">
            <div className="toast-title">{actionToast.title}</div>
            <div className="toast-desc">{actionToast.subtitle}</div>
          </div>
          {actionToast.actionText && (
            <button
              type="button"
              className="toast-action-btn"
              onClick={actionToast.onAction}
            >
              <span>{actionToast.actionText}</span>
              <ArrowRight size={13} />
            </button>
          )}
          <button
            type="button"
            className="toast-dismiss-btn"
            onClick={() => setActionToast(null)}
            title="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

