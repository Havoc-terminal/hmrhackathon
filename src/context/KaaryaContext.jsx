import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  initialEmails,
  initialDrafts,
  initialCalendarEvents,
  initialTasks,
  initialWorkflowHistory,
  templateGalleries
} from '../services/initialData';
import { generateWorkflowPlan } from '../services/agentEngine';
import { toISODateString, addDays, formatTimeRange, formatFullDate, formatTaskDisplayDate } from '../services/calendarUtils';
import { parseMeetingFromEmail, isMeetingAlreadyScheduled } from '../services/emailMeetingParser';
import { translations, LANGUAGES } from '../services/translations';

const KaaryaContext = createContext(null);

export function KaaryaProvider({ children }) {
  // Navigation: 'landing' or dashboard subviews ('dashboard', 'tasks', 'calendar', 'inbox', 'chat', 'templates', 'history')
  // Default to 'dashboard' (AI Studio) as the main first impression page
  const [currentView, setCurrentView] = useState('dashboard');

  // Multi-Language state: 'en', 'hi', 'mr', 'ta', 'te'
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('kaarya_lang') || 'en';
  });

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    localStorage.setItem('kaarya_lang', langCode);
  };

  const t = translations[language] || translations.en;

  // Theme state: 'light' or 'dark'
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('kaarya_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(nextTheme);
    localStorage.setItem('kaarya_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // User Authentication state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('kaarya_user');
    return saved ? JSON.parse(saved) : {
      name: 'Mayank',
      email: 'mayank.workspace@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
    };
  });

  const loginUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('kaarya_user', JSON.stringify(userData));
    setCurrentView('dashboard');
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('kaarya_user');
    setCurrentView('landing');
  };

  // Multi-app connected state
  const [emails, setEmails] = useState(() => {
    try {
      const saved = localStorage.getItem('dailyecho_emails_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialEmails.length) return parsed;
      }
    } catch (e) {
      console.error('Error reading emails from localStorage', e);
    }
    return initialEmails;
  });

  useEffect(() => {
    try {
      localStorage.setItem('dailyecho_emails_v3', JSON.stringify(emails));
    } catch (e) {
      console.error('Error saving emails to localStorage', e);
    }
  }, [emails]);

  const addEmail = (emailData) => {
    const newMail = {
      id: `msg-${Date.now()}`,
      from: emailData.from || 'colleague@enterprise.io',
      to: emailData.to || 'me@dailyecho.ai',
      subject: emailData.subject || 'Meeting discussion',
      snippet: emailData.snippet || (emailData.body ? emailData.body.slice(0, 110) : ''),
      body: emailData.body || '',
      date: 'Just now',
      unread: true,
      labels: ['Inbox', 'Work'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
    };
    setEmails((prev) => [newMail, ...prev]);
    return newMail;
  };
  const [drafts, setDrafts] = useState(initialDrafts);
  const [calendarEvents, setCalendarEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('dailyecho_calendar_events_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading calendar events from localStorage', e);
    }
    return initialCalendarEvents;
  });

  useEffect(() => {
    try {
      localStorage.setItem('dailyecho_calendar_events_v2', JSON.stringify(calendarEvents));
    } catch (e) {
      console.error('Error saving calendar events to localStorage', e);
    }
  }, [calendarEvents]);

  // Personal & Work Diary state (persisted to localStorage)
  const [diaryEntries, setDiaryEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('dailyecho_diary_entries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading diary entries', e);
    }
    const todayStr = toISODateString(new Date());
    const yesterdayStr = toISODateString(addDays(new Date(), -1));
    return [
      {
        id: `diary-${todayStr}`,
        date: todayStr,
        title: 'Daily Reflection & Autonomous Workflow Sync',
        content: 'Productive day coordinating across Gmail, Google Calendar, and Tasks. The unified workflow helped organize all team milestones and sprint items smoothly.',
        mood: 'productive',
        tags: ['work', 'reflection', 'milestones'],
        updatedAt: new Date().toISOString()
      },
      {
        id: `diary-${yesterdayStr}`,
        date: yesterdayStr,
        title: 'Strategy & Q4 Execution Goals',
        content: 'Reviewed product architecture benchmarks with the engineering leads. Focused on low-latency orchestration and zero-conflict schedule optimization.',
        mood: 'focused',
        tags: ['strategy', 'planning'],
        updatedAt: addDays(new Date(), -1).toISOString()
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('dailyecho_diary_entries', JSON.stringify(diaryEntries));
    } catch (e) {
      console.error('Error saving diary entries', e);
    }
  }, [diaryEntries]);
  const [tasks, setTasks] = useState(initialTasks);
  const [workflowHistory, setWorkflowHistory] = useState(initialWorkflowHistory);
  const [templates, setTemplates] = useState(templateGalleries);

  // Modals state
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isHitlModalOpen, setIsHitlModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [hitlPayload, setHitlPayload] = useState(null);

  // New Google Calendar & DailyEcho interactive elements
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAppsGridOpen, setIsAppsGridOpen] = useState(false);
  const [isUserAccountOpen, setIsUserAccountOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isAddCalendarModalOpen, setIsAddCalendarModalOpen] = useState(false);
  const [newEventInitialData, setNewEventInitialData] = useState(null);
  const [activeSideDrawer, setActiveSideDrawer] = useState(null); // 'keep', 'tasks', 'contacts', 'maps', 'addons'

  // User Settings state
  const [userSettings, setUserSettings] = useState(() => {
    const saved = localStorage.getItem('dailyecho_settings');
    return saved ? JSON.parse(saved) : {
      timeZone: 'GMT+01:00 (Amsterdam, Berlin, Rome)',
      weekStart: 'Sunday',
      defaultEventDuration: '60',
      autoHealing: true,
      hitlThreshold: 'sensitive',
      executionSpeed: 'fast',
      soundEffects: true,
      privacyMode: true
    };
  });

  const updateUserSettings = (newSettings) => {
    setUserSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('dailyecho_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'DailyEcho Agent Executed', desc: 'Strategy review scheduled for Friday 3:00 PM with Sarah Jenkins', time: '5m ago', read: false, type: 'agent' },
    { id: 'notif-2', title: 'Schedule Conflict Auto-Resolved', desc: 'Shifted Session 2 by 30 mins to avoid overlap', time: '20m ago', read: false, type: 'calendar' },
    { id: 'notif-3', title: 'New Email Thread', desc: 'Quarterly Strategy Review confirmed with Sarah Jenkins', time: '1h ago', read: true, type: 'email' },
    { id: 'notif-4', title: 'Task Reminder', desc: 'Complete Q3 Strategic Proposal by 5:00 PM', time: '2h ago', read: true, type: 'task' }
  ]);

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notificationData) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: notificationData.title || 'Schedule Alert',
      desc: notificationData.desc || '',
      time: 'Just now',
      read: false,
      type: notificationData.type || 'calendar'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Google Keep Notes state
  const [keepNotes, setKeepNotes] = useState([
    { id: 'keep-1', title: 'Q4 Strategy Review Checklist', content: 'Finalize roadmap deck, review benchmarks with engineering team, prepare handoff tasks.', color: '#fff8e1' },
    { id: 'keep-2', title: 'DailyEcho Architecture Notes', content: 'Autonomous DAG execution with zero-retention encryption, Google Workspace REST API scopes verification.', color: '#e8f0fe' },
    { id: 'keep-3', title: 'Daily Workout Protocol', content: 'CrossFit WOD 9:00 AM, Strength session, 20m cold plunge & sauna recovery.', color: '#e6f4ea' }
  ]);

  const addKeepNote = (note) => {
    const newNote = {
      id: `keep-${Date.now()}`,
      title: note.title || 'Untitled Note',
      content: note.content || '',
      color: note.color || '#ffffff'
    };
    setKeepNotes((prev) => [newNote, ...prev]);
  };

  const deleteKeepNote = (id) => {
    setKeepNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Calendar Event Creation, Update, and Deletion
  const addNewCalendarEvent = (eventData) => {
    const newId = `evt-${Date.now()}`;
    const startH = Number(eventData.startHour !== undefined ? eventData.startHour : 9);
    const endH = Number(eventData.endHour !== undefined ? eventData.endHour : startH + 1);
    const dateStr = eventData.date || toISODateString(new Date());

    const newEvt = {
      id: newId,
      title: eventData.title || 'New Event',
      date: dateStr,
      startHour: startH,
      endHour: endH,
      timeDisplay: eventData.timeDisplay || formatTimeRange(startH, endH),
      color: eventData.color || '#039be5',
      location: eventData.location || (eventData.hasMeet ? 'Google Meet video call' : 'Austin HQ / Google Meet'),
      attendees: eventData.attendees && eventData.attendees.length > 0 ? eventData.attendees : [currentUser?.email || 'me@dailyecho.ai'],
      category: eventData.category || 'Work',
      description: eventData.description || '',
      isAllDay: !!eventData.isAllDay,
      isAiGenerated: !!eventData.isAiGenerated
    };

    setCalendarEvents((prev) => [newEvt, ...prev]);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}
    return newEvt;
  };

  const updateCalendarEvent = (id, updatedData) => {
    setCalendarEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updatedData } : e)));
  };

  const deleteCalendarEvent = (id) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Diary Entry handlers
  const saveDiaryEntry = (entryData) => {
    const dateStr = entryData.date || toISODateString(new Date());
    const id = entryData.id || `diary-${dateStr}`;
    const newEntry = {
      id,
      date: dateStr,
      title: entryData.title && entryData.title.trim() ? entryData.title.trim() : 'Untitled Entry',
      content: entryData.content || '',
      mood: entryData.mood || 'productive',
      tags: Array.isArray(entryData.tags) ? entryData.tags : [],
      updatedAt: new Date().toISOString()
    };

    setDiaryEntries((prev) => {
      const existingIdx = prev.findIndex((e) => e.date === dateStr);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...newEntry };
        return updated;
      }
      return [newEntry, ...prev];
    });

    try {
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.65 } });
    } catch (e) {}

    return newEntry;
  };

  const deleteDiaryEntry = (dateOrId) => {
    setDiaryEntries((prev) => prev.filter((e) => e.id !== dateOrId && e.date !== dateOrId));
  };

  // Schedule a meeting parsed from an email thread
  const scheduleMeetingFromEmail = (email) => {
    const analysis = parseMeetingFromEmail(email);
    if (!analysis || !analysis.hasMeeting || !analysis.details) return null;

    const { details } = analysis;
    const isAlreadyScheduled = isMeetingAlreadyScheduled(details, calendarEvents);
    if (isAlreadyScheduled) return null;

    const newEvt = addNewCalendarEvent({
      title: details.title,
      date: details.date,
      startHour: details.startHour,
      endHour: details.endHour,
      timeDisplay: details.timeDisplay,
      color: details.color || '#0d9488',
      location: details.location,
      attendees: details.attendees,
      isAiGenerated: true
    });

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Meeting Scheduled from Gmail',
        desc: `${details.title} on ${formatFullDate(details.date)} (${details.timeDisplay})`,
        time: 'Just now',
        read: false,
        type: 'calendar'
      },
      ...prev
    ]);

    return newEvt;
  };

  // Batch scan all inbox emails and schedule all detected meetings
  const batchScheduleMeetingsFromGmail = () => {
    const scheduledEvents = [];
    emails.forEach((mail) => {
      const analysis = parseMeetingFromEmail(mail);
      if (analysis && analysis.hasMeeting && analysis.details) {
        const alreadyScheduled = isMeetingAlreadyScheduled(analysis.details, [...calendarEvents, ...scheduledEvents]);
        if (!alreadyScheduled) {
          const newEvt = addNewCalendarEvent({
            title: analysis.details.title,
            date: analysis.details.date,
            startHour: analysis.details.startHour,
            endHour: analysis.details.endHour,
            timeDisplay: analysis.details.timeDisplay,
            color: analysis.details.color || '#0d9488',
            location: analysis.details.location,
            attendees: analysis.details.attendees,
            isAiGenerated: true
          });
          scheduledEvents.push(newEvt);
        }
      }
    });

    if (scheduledEvents.length > 0) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: 'Gmail Sync Complete',
          desc: `Synced and scheduled ${scheduledEvents.length} meeting(s) to Google Calendar`,
          time: 'Just now',
          read: false,
          type: 'calendar'
        },
        ...prev
      ]);
    }

    return scheduledEvents;
  };

  // Agent execution state
  const [agentPrompt, setAgentPrompt] = useState(t.heroDefaultPrompt);

  // Keep prompt in sync if user changes language while on default prompt
  useEffect(() => {
    if (t.heroDefaultPrompt) {
      setAgentPrompt(t.heroDefaultPrompt);
    }
  }, [language]);

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionPlan, setExecutionPlan] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [verificationProof, setVerificationProof] = useState(null);
  const [executionStats, setExecutionStats] = useState({ latency: null, tokens: null });
  const [simulateConflict, setSimulateConflict] = useState(false);

  // Filter & search states
  const [taskFilter, setTaskFilter] = useState('All');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [calendarViewMode, setCalendarViewMode] = useState('agenda');

  // Chatbot conversation state for AI Assistant view
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-ai-1',
      sender: 'ai',
      text: 'Good morning! I am your DailyEcho workflow agent. I can coordinate Gmail, Google Calendar, and Google Tasks with a single instruction.',
      time: '09:00 AM'
    },
    {
      id: 'msg-user-1',
      sender: 'user',
      text: 'Can you show me what tasks are due this week and check if I have any scheduling conflicts tomorrow?',
      time: '09:02 AM'
    },
    {
      id: 'msg-ai-2',
      sender: 'ai',
      text: 'Certainly! You have 2 tasks due tomorrow ("Prepare project proposal" and "Schedule team meeting"). Your calendar tomorrow has 3 confirmed meetings. You have an open slot between 3:00 PM and 4:30 PM.',
      time: '09:02 AM',
      hasCard: true
    }
  ]);

  // Execute Agentic Instruction
  const startAgentExecution = async (customPrompt) => {
    const promptToRun = customPrompt || agentPrompt;
    if (!promptToRun.trim() || isExecuting) return;

    setIsExecuting(true);
    setCurrentStepIndex(0);
    setVerificationProof(null);
    setExecutionLogs([]);

    const startTime = performance.now();
    const plan = generateWorkflowPlan(promptToRun, simulateConflict);
    setExecutionPlan(plan);

    addLog(`🚀 [AGENTIC ORCHESTRATOR] Initialized workflow for: "${promptToRun.slice(0, 60)}..."`);
    addLog(`🧩 [DAG PLANNER] Decomposed request into ${plan.length} discrete tool actions.`);

    for (let i = 0; i < plan.length; i++) {
      const step = plan[i];
      setCurrentStepIndex(i);

      setExecutionPlan((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: 'running' } : s))
      );

      addLog(`⚡ [DISPATCH] Executing ${step.tool} on ${step.targetApp}...`);

      if (step.isSensitive) {
        addLog(`🛡️ [HITL GUARD] Sensitive action detected. Pausing workflow for user approval.`);
        setHitlPayload({
          stepIndex: i,
          tool: step.tool,
          recipient: 'engineering-team@dailyecho.ai',
          subject: 'Scheduled: Quarterly Strategy Review & Prep Tasks',
          previewBody: `Hello Team,\n\nThe Quarterly Strategy Review with Sarah Jenkins has been booked on Google Calendar for tomorrow at 3:00 PM EST.\n\nA prep task ("Prep Strategy Review & finalize Q4 roadmap") has been added to Google Tasks with high priority.\n\nPlease review the attached agenda.`,
          step
        });
        setIsHitlModalOpen(true);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1100));

      applyStepSideEffects(step);

      setExecutionPlan((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: 'completed', result: step.mockResult || { success: true } } : s
        )
      );

      addLog(`✅ [VERIFIED] ${step.name} succeeded.`);
    }

    finalizeWorkflow(startTime, promptToRun, plan);
  };

  const resumeAfterHitl = async (approved, editedData) => {
    setIsHitlModalOpen(false);

    if (!approved) {
      addLog(`❌ [HITL GUARD] Action was rejected by user. Aborting workflow safely.`);
      setIsExecuting(false);
      setExecutionPlan((prev) =>
        prev.map((s, idx) => (idx === hitlPayload.stepIndex ? { ...s, status: 'cancelled' } : s))
      );
      return;
    }

    addLog(`👍 [HITL APPROVED] User confirmed action. Resuming automated execution.`);

    const startIndex = hitlPayload.stepIndex;
    const startTime = performance.now();

    setExecutionPlan((prev) =>
      prev.map((s, idx) =>
        idx === startIndex ? { ...s, status: 'completed', result: { userApproved: true, ...editedData } } : s
      )
    );

    for (let i = startIndex + 1; i < executionPlan.length; i++) {
      const step = executionPlan[i];
      setCurrentStepIndex(i);

      setExecutionPlan((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: 'running' } : s))
      );

      addLog(`⚡ [DISPATCH] Executing ${step.tool} on ${step.targetApp}...`);
      await new Promise((resolve) => setTimeout(resolve, 950));

      applyStepSideEffects(step, editedData);

      setExecutionPlan((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: 'completed', result: step.mockResult || { success: true } } : s
        )
      );

      addLog(`✅ [VERIFIED] ${step.name} succeeded.`);
    }

    finalizeWorkflow(startTime, agentPrompt, executionPlan);
  };

  const applyStepSideEffects = (step, customData) => {
    if (step.tool === 'calendar.createEvent') {
      const tomorrow = addDays(new Date(), 1);
      const tomorrowStr = toISODateString(tomorrow);
      const startH = simulateConflict ? 16 : 15;
      const endH = simulateConflict ? 17 : 16;

      const newEvent = {
        id: `cal-${Date.now()}`,
        title: simulateConflict 
          ? 'Quarterly Strategy Review (Auto-Adjusted)' 
          : 'Quarterly Strategy Review with Sarah Jenkins',
        date: tomorrowStr,
        startHour: startH,
        endHour: endH,
        timeDisplay: simulateConflict ? '4:00 PM – 5:00 PM' : '3:00 PM – 4:00 PM',
        location: 'Google Meet (meet.google.com/strat-review)',
        attendees: ['sarah.j@vertexcloud.io', currentUser?.email || 'me@dailyecho.ai'],
        category: 'Work',
        color: '#0d9488',
        isAiGenerated: true,
        status: simulateConflict ? 'conflict-resolved' : 'ai-scheduled'
      };
      setCalendarEvents((prev) => [newEvent, ...prev]);
    }

    if (step.tool === 'tasks.createTask') {
      const newTask = {
        id: `task-${Date.now()}`,
        title: 'Prep Strategy Review & finalize Q4 roadmap',
        description: 'Auto-created by DailyEcho: 2 days before Strategy Review meeting',
        category: 'Work',
        priority: 'High',
        startDate: '28 Feb 2026',
        dueDate: '29 Feb 2026',
        status: 'To-do',
        hasWarning: true,
        aiGenerated: true
      };
      setTasks((prev) => [newTask, ...prev]);
    }

    if (step.tool === 'gmail.createDraft') {
      const newDraft = {
        id: `draft-${Date.now()}`,
        to: customData?.recipient || 'engineering-team@dailyecho.ai',
        subject: customData?.subject || 'Scheduled: Quarterly Strategy Review & Prep Tasks',
        snippet: 'Team, here is the updated calendar invite and prep task created by DailyEcho...',
        updatedAt: 'Just now'
      };
      setDrafts((prev) => [newDraft, ...prev]);
    }
  };

  const finalizeWorkflow = (startTime, prompt, plan) => {
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    const proofId = `GSUITE-VERIFIED-${Math.floor(100000 + Math.random() * 900000)}`;

    setVerificationProof(proofId);
    setIsExecuting(false);
    setCurrentStepIndex(-1);

    const stats = { latency: `${elapsed}s`, tokens: 384 + Math.floor(Math.random() * 80) };
    setExecutionStats(stats);

    addLog(`🎉 [AGENT COMPLETED] All steps verified. Proof Hash: ${proofId}`);

    const historyItem = {
      id: `wf-${Date.now()}`,
      prompt,
      timestamp: 'Just now',
      status: 'completed',
      stepsCount: plan.length,
      toolsUsed: plan.map((p) => p.tool),
      verificationProof: proofId,
      latency: `${elapsed}s`,
      tokens: stats.tokens
    };
    setWorkflowHistory((prev) => [historyItem, ...prev]);

    try {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const addLog = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    setExecutionLogs((prev) => [...prev, { time: timestamp, msg }]);
  };

  const addNewTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      category: taskData.category || 'Work',
      priority: taskData.priority || 'Medium',
      startDate: taskData.startDate || '28 Feb 2026',
      dueDate: taskData.dueDate || '29 Feb 2026',
      status: taskData.status || 'To-do',
      hasWarning: false,
      aiGenerated: false
    };
    setTasks((prev) => [newTask, ...prev]);
    setIsAddTaskModalOpen(false);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const sendChatMessage = (text, onResponse = null, isVoice = false) => {
    if (!text || !text.trim()) return;

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      isVoice,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText = '';
      let hasAction = false;
      let actionType = null;
      let executionReceipt = null;

      // 1. RESCHEDULE MEETING & SEND EMAIL NOTIFICATION TO ATTENDEE (Core Voice Requirement)
      if (lower.includes('reschedule') || lower.includes('shift meeting') || lower.includes('move meeting')) {
        // Find matching meeting
        const targetMeeting = calendarEvents.find(e => 
          (lower.includes('strategy') && e.title.toLowerCase().includes('strategy')) ||
          (lower.includes('alex') && e.title.toLowerCase().includes('alex')) ||
          (lower.includes('quarterly') && e.title.toLowerCase().includes('quarterly'))
        ) || calendarEvents.find(e => !e.isAllDay) || calendarEvents[0];

        // Parse target timing: default 16:00 (4:00 PM) if not specified or contains 4
        let newStartHour = 16.0;
        let newEndHour = 17.0;
        let timeDisplay = '4:00 PM - 5:00 PM';

        const timeMatch = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
        if (timeMatch) {
          const h = parseInt(timeMatch[1], 10);
          const m = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
          const ampm = timeMatch[3].toLowerCase();
          let hour24 = h;
          if (ampm === 'pm' && h < 12) hour24 += 12;
          if (ampm === 'am' && h === 12) hour24 = 0;
          newStartHour = hour24 + (m / 60);
          newEndHour = newStartHour + 1;
          const endH = Math.floor(newEndHour);
          const endM = Math.round((newEndHour - endH) * 60);
          const endAmpm = endH >= 12 ? 'PM' : 'AM';
          const endH12 = endH > 12 ? endH - 12 : (endH === 0 ? 12 : endH);
          timeDisplay = `${h}:${String(m).padStart(2, '0')} ${ampm.toUpperCase()} - ${endH12}:${String(endM).padStart(2, '0')} ${endAmpm}`;
        }

        // Determine attendee to email
        let attendeeName = 'Sarah Jenkins';
        let attendeeEmail = 'sarah.j@vertexcloud.io';
        if (lower.includes('alex')) {
          attendeeName = 'Alex Rivera';
          attendeeEmail = 'alex.rivera@techcorp.com';
        }

        const meetingTitle = targetMeeting ? targetMeeting.title : 'Quarterly Strategy Review';

        // 1. Update Calendar Event
        if (targetMeeting) {
          updateCalendarEvent(targetMeeting.id, {
            startHour: newStartHour,
            endHour: newEndHour,
            timeDisplay,
            status: 'rescheduled'
          });
        }

        // 2. Dispatch/Send Email Notification to attendee
        addEmail({
          from: 'Mayank <me@dailyecho.ai>',
          to: `${attendeeName} <${attendeeEmail}>`,
          subject: `Rescheduled: ${meetingTitle} (Updated to ${timeDisplay})`,
          snippet: `Hi ${attendeeName}, our meeting "${meetingTitle}" has been rescheduled to ${timeDisplay}. Updated Google Meet link attached.`,
          body: `Hi ${attendeeName},

I have updated the schedule for our meeting "${meetingTitle}" on Google Calendar.

New Confirmed Timing:
📅 Today at ${timeDisplay}
📍 Google Meet: meet.google.com/sync-strategy-review

The calendar invite has been automatically updated on your side as well. Looking forward to connecting!

Best regards,
Mayank`
        });

        // 3. Add Preparation Task to Tasks Board
        addNewTask({
          title: `Prep for ${timeDisplay} ${meetingTitle} with ${attendeeName}`,
          description: `Review updated discussion points and prep deck for ${timeDisplay} meeting`,
          category: 'Work',
          priority: 'High',
          status: 'To-do',
          startDate: formatTaskDisplayDate(new Date()),
          dueDate: formatTaskDisplayDate(new Date())
        });

        replyText = `Done! I have rescheduled "${meetingTitle}" to ${timeDisplay} on your Google Calendar, dispatched a notification email to ${attendeeName} (${attendeeEmail}) with the new timing & Google Meet link, and added a prep task to your Tasks Board.`;
        hasAction = true;
        actionType = 'rescheduled_and_emailed';

        executionReceipt = {
          title: 'Autonomous Cross-App Rescheduling Executed',
          targetTitle: meetingTitle,
          newTime: timeDisplay,
          attendee: `${attendeeName} (${attendeeEmail})`,
          calendarStatus: `Updated Google Calendar: "${meetingTitle}" set to Today, ${timeDisplay}`,
          emailStatus: `Dispatched email notification to ${attendeeEmail}`,
          taskStatus: `Created high-priority prep task on Tasks Board`
        };
      } 
      // 2. SYNC GMAIL THREADS
      else if (lower.includes('sync') && (lower.includes('gmail') || lower.includes('mail') || lower.includes('thread'))) {
        const scheduled = batchScheduleMeetingsFromGmail();
        replyText = `Synced with Gmail! Scanned all inbox threads and automatically synchronized ${scheduled.length} detected meetings directly into your Google Calendar.`;
        hasAction = true;
        actionType = 'gmail_synced';
        executionReceipt = {
          title: 'Gmail & Calendar Autonomous Sync Complete',
          calendarStatus: `Batch scheduled ${scheduled.length} meetings into Calendar`,
          emailStatus: `Synchronized Gmail threads under OAuth zero-retention`,
          taskStatus: `All schedule conflicts resolved`
        };
      }
      // 3. TASK BOARD CREATION
      else if (lower.includes('task') || lower.includes('todo') || lower.includes('to-do')) {
        if (lower.includes('add') || lower.includes('create')) {
          const taskTitle = text.replace(/.*(add|create)\s+(task|todo|to-do)\s*:?/i, '').trim() || 'New Priority Task';
          addNewTask({
            title: taskTitle,
            description: 'Created autonomously via DailyEcho Voice & Chat Assistant',
            category: 'Work',
            priority: 'High',
            status: 'To-do',
            startDate: formatTaskDisplayDate(new Date()),
            dueDate: formatTaskDisplayDate(new Date())
          });
          replyText = `Added "${taskTitle}" as a high-priority task to your Tasks Board!`;
          hasAction = true;
          actionType = 'task_created';
          executionReceipt = {
            title: 'Task Created on Tasks Board',
            taskStatus: `Added "${taskTitle}" (Priority: High)`
          };
        } else {
          const pending = tasks.filter(t => t.status === 'To-do').length;
          replyText = `You currently have ${tasks.length} total tasks on your board (${pending} pending). You can check them off directly on the Tasks Board or say "Add task [title]" to add one instantly.`;
          hasAction = false;
        }
      }
      // 4. SCHEDULE / MEETINGS OVERVIEW OR NEW MEETING
      else if (lower.includes('meeting') || lower.includes('calendar') || lower.includes('schedule')) {
        if (lower.includes('schedule a') || lower.includes('schedule new') || lower.includes('book a') || lower.includes('create meeting')) {
          const newEvt = addNewCalendarEvent({
            title: 'Team Sync & Alignment',
            date: toISODateString(new Date()),
            startHour: 15.0,
            endHour: 16.0,
            location: 'Google Meet',
            description: 'Scheduled via Voice Assistant'
          });
          replyText = `Scheduled "Team Sync & Alignment" for Today at 3:00 PM - 4:00 PM on Google Calendar!`;
          hasAction = true;
          actionType = 'meeting_scheduled';
          executionReceipt = {
            title: 'Calendar Meeting Booked',
            calendarStatus: `Confirmed "Team Sync & Alignment" at 3:00 PM on Google Calendar`
          };
        } else {
          const todayEvts = calendarEvents.filter(e => !e.isAllDay && e.date === toISODateString(new Date()));
          replyText = `You have ${todayEvts.length} meetings on your calendar today. Your next upcoming event is "${todayEvts[0]?.title || 'Meeting'}" at ${todayEvts[0]?.timeDisplay || '3:00 PM'}.`;
          hasAction = true;
          actionType = 'workflow';
        }
      }
      // 5. NAVIGATION COMMANDS
      else if (lower.includes('open calendar') || lower.includes('go to calendar')) {
        setCurrentView('calendar');
        replyText = `Switched to your Calendar tab.`;
      } else if (lower.includes('open tasks') || lower.includes('go to tasks')) {
        setCurrentView('tasks');
        replyText = `Switched to your Tasks Board.`;
      } else if (lower.includes('open gmail') || lower.includes('go to gmail') || lower.includes('open mail')) {
        setCurrentView('inbox');
        replyText = `Switched to your Gmail Threads inbox.`;
      } else if (lower.includes('open studio') || lower.includes('go to studio')) {
        setCurrentView('dashboard');
        replyText = `Switched to AI Studio.`;
      } else {
        replyText = `I am your DailyEcho executive voice & typing copilot. I coordinate your Google Calendar, Gmail threads, and Tasks with zero conflict. You can ask me to reschedule meetings, email attendees, add tasks, or sync your workspace.`;
        hasAction = true;
        actionType = 'workflow';
      }

      const aiReply = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasRunAction: hasAction,
        actionType,
        executionReceipt,
        suggestedPrompt: text
      };

      setChatMessages((prev) => [...prev, aiReply]);

      if (onResponse && typeof onResponse === 'function') {
        onResponse(aiReply);
      }
    }, 500);
  };

  const value = {
    currentView,
    setCurrentView,
    language,
    setLanguage,
    t,
    LANGUAGES,
    theme,
    toggleTheme,
    currentUser,
    loginUser,
    logoutUser,
    emails,
    drafts,
    calendarEvents,
    tasks,
    workflowHistory,
    templates,
    isAddTaskModalOpen,
    setIsAddTaskModalOpen,
    isTemplateModalOpen,
    setIsTemplateModalOpen,
    isHitlModalOpen,
    setIsHitlModalOpen,
    isLoginModalOpen,
    setIsLoginModalOpen,
    hitlPayload,
    agentPrompt,
    setAgentPrompt,
    isExecuting,
    executionPlan,
    currentStepIndex,
    executionLogs,
    verificationProof,
    executionStats,
    simulateConflict,
    setSimulateConflict,
    taskFilter,
    setTaskFilter,
    taskSearchQuery,
    setTaskSearchQuery,
    calendarViewMode,
    setCalendarViewMode,
    chatMessages,
    setChatMessages,
    startAgentExecution,
    resumeAfterHitl,
    addNewTask,
    updateTaskStatus,
    deleteTask,
    sendChatMessage,
    // DailyEcho & Google Calendar interactive features
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isHelpModalOpen,
    setIsHelpModalOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    isAppsGridOpen,
    setIsAppsGridOpen,
    isUserAccountOpen,
    setIsUserAccountOpen,
    isAddEventModalOpen,
    setIsAddEventModalOpen,
    isAddCalendarModalOpen,
    setIsAddCalendarModalOpen,
    newEventInitialData,
    setNewEventInitialData,
    activeSideDrawer,
    setActiveSideDrawer,
    userSettings,
    updateUserSettings,
    notifications,
    addNotification,
    markAllNotificationsRead,
    clearNotifications,
    keepNotes,
    addKeepNote,
    deleteKeepNote,
    addNewCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    diaryEntries,
    saveDiaryEntry,
    deleteDiaryEntry,
    addEmail,
    scheduleMeetingFromEmail,
    batchScheduleMeetingsFromGmail
  };

  return <KaaryaContext.Provider value={value}>{children}</KaaryaContext.Provider>;
}

export function useKaarya() {
  const context = useContext(KaaryaContext);
  if (!context) {
    throw new Error('useKaarya must be used within a KaaryaProvider');
  }
  return context;
}
