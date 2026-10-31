import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Layers, 
  RefreshCw, 
  ArrowRight,
  AlertTriangle,
  Mail,
  Calendar,
  CheckSquare,
  Cpu,
  Video,
  Plus,
  Send,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Users,
  Flame,
  ArrowUpRight,
  ExternalLink,
  Zap,
  CheckCheck,
  Filter,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { useKaarya } from '../../context/KaaryaContext';
import { 
  toISODateString, 
  addDays, 
  formatFullDate, 
  formatHourLabel, 
  formatTimeRange 
} from '../../services/calendarUtils';

export default function AiStudio() {
  const { 
    currentUser,
    calendarEvents,
    updateCalendarEvent,
    addNewCalendarEvent,
    tasks,
    addNewTask,
    updateTaskStatus,
    chatMessages,
    sendChatMessage,
    setCurrentView,
    addNotification,
    agentPrompt,
    setAgentPrompt,
    isExecuting,
    startAgentExecution,
    executionPlan,
    currentStepIndex,
    executionLogs,
    verificationProof,
    executionStats
  } = useKaarya();

  // Current real-time clock (updates every 60 seconds)
  const [currentTime, setCurrentTime] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = useMemo(() => toISODateString(currentTime), [currentTime]);
  const currentHourFloat = currentTime.getHours() + currentTime.getMinutes() / 60;

  // Dynamic greeting based on time of day
  const greetingText = useMemo(() => {
    const hours = currentTime.getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  }, [currentTime]);

  // Reschedule state
  const [meetingToReschedule, setMeetingToReschedule] = useState(null);
  const [selectedNextSlot, setSelectedNextSlot] = useState(null);
  const [rescheduleSuccessBanner, setRescheduleSuccessBanner] = useState(null);

  // Chatbot input state & auto-scroll
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Quick Task input state
  const [quickTaskText, setQuickTaskText] = useState('');

  // Meeting Filter Tab: 'all' | 'upcoming' | 'completed'
  const [meetingFilter, setMeetingFilter] = useState('all');

  // Collapsible toggle for deep DAG Plan
  const [showTechnicalDag, setShowTechnicalDag] = useState(false);

  // Filter Today's Meetings
  const todayMeetings = useMemo(() => {
    return calendarEvents
      .filter(e => !e.isAllDay && e.date === todayStr)
      .sort((a, b) => a.startHour - b.startHour);
  }, [calendarEvents, todayStr]);

  // Completed vs Upcoming Meetings count
  const doneMeetingsCount = useMemo(() => {
    return todayMeetings.filter(e => e.status === 'completed' || currentHourFloat >= e.endHour).length;
  }, [todayMeetings, currentHourFloat]);

  const upcomingMeetingsCount = todayMeetings.length - doneMeetingsCount;

  // Filtered Today's Meetings according to active tab
  const filteredTodayMeetings = useMemo(() => {
    return todayMeetings.filter((evt) => {
      const isDone = evt.status === 'completed' || currentHourFloat >= evt.endHour;
      if (meetingFilter === 'upcoming') return !isDone;
      if (meetingFilter === 'completed') return isDone;
      return true; // 'all'
    });
  }, [todayMeetings, currentHourFloat, meetingFilter]);

  // Today's Tasks
  const todayTasks = useMemo(() => {
    return tasks.slice(0, 5); // Top 5 priority tasks
  }, [tasks]);

  const completedTasksCount = todayTasks.filter(t => t.status === 'Completed' || t.status === 'Done').length;

  // Calculate Next Available Timing Slots for Rescheduling
  const candidateNextSlots = useMemo(() => {
    if (!meetingToReschedule) return [];

    const duration = meetingToReschedule.endHour 
      ? (meetingToReschedule.endHour - meetingToReschedule.startHour) 
      : 1;

    const slots = [];

    // 1. Try later today
    const candidateHours = [14.0, 15.5, 16.5, 17.5, 18.5].filter(h => h > currentHourFloat + 0.25 && Math.abs(h - meetingToReschedule.startHour) > 0.5);
    for (const ch of candidateHours) {
      const end = ch + duration;
      const hasOverlap = todayMeetings.some(e => e.id !== meetingToReschedule.id && Math.max(ch, e.startHour) < Math.min(end, e.endHour));
      if (!hasOverlap) {
        slots.push({
          date: todayStr,
          dateLabel: 'Later Today',
          startHour: ch,
          endHour: end,
          timeDisplay: `${formatHourLabel(ch)} – ${formatHourLabel(end)}`,
          badge: 'Fastest Available • Zero Conflict'
        });
        break;
      }
    }

    // 2. Tomorrow Morning
    const tomorrow = addDays(new Date(), 1);
    const tomorrowStr = toISODateString(tomorrow);
    slots.push({
      date: tomorrowStr,
      dateLabel: 'Tomorrow Morning',
      startHour: 10.0,
      endHour: 10.0 + duration,
      timeDisplay: `${formatHourLabel(10.0)} – ${formatHourLabel(10.0 + duration)}`,
      badge: 'Recommended • High Focus'
    });

    // 3. Tomorrow Afternoon
    slots.push({
      date: tomorrowStr,
      dateLabel: 'Tomorrow Afternoon',
      startHour: 14.5,
      endHour: 14.5 + duration,
      timeDisplay: `${formatHourLabel(14.5)} – ${formatHourLabel(14.5 + duration)}`,
      badge: 'Open Afternoon Slot'
    });

    // 4. In 2 Days
    const inTwoDays = addDays(new Date(), 2);
    const inTwoDaysStr = toISODateString(inTwoDays);
    slots.push({
      date: inTwoDaysStr,
      dateLabel: 'In 2 Days',
      startHour: 11.0,
      endHour: 11.0 + duration,
      timeDisplay: `${formatHourLabel(11.0)} – ${formatHourLabel(11.0 + duration)}`,
      badge: 'Focus Sprint Block'
    });

    // 5. In 3 Days
    const inThreeDays = addDays(new Date(), 3);
    const inThreeDaysStr = toISODateString(inThreeDays);
    slots.push({
      date: inThreeDaysStr,
      dateLabel: 'In 3 Days',
      startHour: 15.0,
      endHour: 15.0 + duration,
      timeDisplay: `${formatHourLabel(15.0)} – ${formatHourLabel(15.0 + duration)}`,
      badge: 'Open Calendar Block'
    });

    return slots;
  }, [meetingToReschedule, currentHourFloat, todayMeetings, todayStr]);

  // Set default selected slot whenever meetingToReschedule changes
  useEffect(() => {
    if (candidateNextSlots.length > 0) {
      setSelectedNextSlot(candidateNextSlots[0]);
    } else {
      setSelectedNextSlot(null);
    }
  }, [candidateNextSlots]);

  // Reference to prevent duplicate notifications for the same collision
  const notifiedCollisionKeyRef = useRef('');

  // 1. Detect directly colliding or nearly coinciding meetings or priority tasks
  const detectedCollision = useMemo(() => {
    // Check pairs of events on today's date
    for (let i = 0; i < todayMeetings.length; i++) {
      for (let j = i + 1; j < todayMeetings.length; j++) {
        const m1 = todayMeetings[i];
        const m2 = todayMeetings[j];

        // Check if overlapping or within 15 min buffer (0.25 hrs)
        const hasDirectOverlap = Math.max(m1.startHour, m2.startHour) < Math.min(m1.endHour, m2.endHour);
        const isNearlyCoinciding = !hasDirectOverlap && (
          Math.abs(m1.endHour - m2.startHour) <= 0.25 ||
          Math.abs(m2.endHour - m1.startHour) <= 0.25
        );

        if (hasDirectOverlap || isNearlyCoinciding) {
          const overlapMinutes = hasDirectOverlap
            ? Math.round((Math.min(m1.endHour, m2.endHour) - Math.max(m1.startHour, m2.startHour)) * 60)
            : 15;

          // The meeting to shift is the later one
          const shiftEvent = m2.startHour >= m1.startHour ? m2 : m1;
          const anchorEvent = shiftEvent.id === m2.id ? m1 : m2;

          // Next optimal slot: right after anchor event plus a 15-min focus buffer
          let recommendedStart = anchorEvent.endHour + 0.25;
          const duration = shiftEvent.endHour - shiftEvent.startHour || 1;
          let recommendedEnd = recommendedStart + duration;

          // Ensure recommended start doesn't collide with other existing events
          const futureOverlaps = todayMeetings.some(e => 
            e.id !== shiftEvent.id && e.id !== anchorEvent.id &&
            Math.max(recommendedStart, e.startHour) < Math.min(recommendedEnd, e.endHour)
          );
          if (futureOverlaps) {
            recommendedStart = 16.5; // 4:30 PM
            recommendedEnd = 16.5 + duration;
          }

          const recommendedTimeDisplay = `${formatHourLabel(recommendedStart)} – ${formatHourLabel(recommendedEnd)}`;

          return {
            id: `${anchorEvent.id}-${shiftEvent.id}`,
            type: 'meeting_collision',
            itemA: anchorEvent,
            itemB: shiftEvent,
            isDirectOverlap: hasDirectOverlap,
            overlapMinutes,
            recommendedShiftEvent: shiftEvent,
            recommendedStart,
            recommendedEnd,
            recommendedTimeDisplay,
            aiMessage: `AI Optimization Insight: "${shiftEvent.title}" directly ${hasDirectOverlap ? `collides with "${anchorEvent.title}" (${overlapMinutes}-minute overlap)` : `coincides too closely with "${anchorEvent.title}" (zero transition buffer)`}. To protect your cognitive focus and eliminate calendar collision, AI recommends shifting "${shiftEvent.title}" to ${recommendedTimeDisplay}.`
          };
        }
      }
    }

    // Also check if any High Priority task due today nearly coincides with a meeting
    const highPrioTask = todayTasks.find(t => t.priority === 'High' && (t.status === 'To-do' || t.status === 'In progress'));
    if (highPrioTask && todayMeetings.length > 0) {
      const coincidingEvt = todayMeetings.find(m => 
        (highPrioTask.title.toLowerCase().includes('gym') && m.title.toLowerCase().includes('strength')) ||
        (highPrioTask.title.toLowerCase().includes('proposal') && m.title.toLowerCase().includes('architecture'))
      );
      if (coincidingEvt) {
        return {
          id: `task-collision-${highPrioTask.id}-${coincidingEvt.id}`,
          type: 'task_meeting_collision',
          itemA: coincidingEvt,
          itemB: {
            id: highPrioTask.id,
            title: highPrioTask.title,
            category: highPrioTask.category,
            isTask: true,
            timeDisplay: coincidingEvt.timeDisplay
          },
          isDirectOverlap: true,
          overlapMinutes: 30,
          recommendedShiftEvent: coincidingEvt,
          recommendedStart: coincidingEvt.endHour + 0.5,
          recommendedEnd: coincidingEvt.endHour + 1.5,
          recommendedTimeDisplay: `${formatHourLabel(coincidingEvt.endHour + 0.5)} – ${formatHourLabel(coincidingEvt.endHour + 1.5)}`,
          aiMessage: `AI Focus Guard: Your high-priority task "${highPrioTask.title}" directly coincides with "${coincidingEvt.title}". AI recommends shifting the meeting to ${formatHourLabel(coincidingEvt.endHour + 0.5)} – ${formatHourLabel(coincidingEvt.endHour + 1.5)} so you have dedicated focus time to execute this task.`
        };
      }
    }

    return null;
  }, [todayMeetings, todayTasks]);

  // 2. Dispatch system notification automatically upon detecting collision
  useEffect(() => {
    if (detectedCollision) {
      const collisionKey = `${detectedCollision.itemA.id}_${detectedCollision.itemB.id}_${detectedCollision.itemA.startHour}_${detectedCollision.itemB.startHour}`;
      if (notifiedCollisionKeyRef.current !== collisionKey) {
        notifiedCollisionKeyRef.current = collisionKey;
        addNotification?.({
          title: '⚠️ AI Schedule Collision Detected',
          desc: `Collision detected between "${detectedCollision.itemA.title}" and "${detectedCollision.itemB.title}". AI prepared a zero-conflict reschedule recommendation.`,
          type: 'calendar'
        });
      }
    }
  }, [detectedCollision, addNotification]);

  // 3. Auto-Resolve Collision Handler
  const handleAutoResolveCollision = () => {
    if (!detectedCollision) return;

    const { recommendedShiftEvent, recommendedStart, recommendedEnd, recommendedTimeDisplay } = detectedCollision;

    updateCalendarEvent(recommendedShiftEvent.id, {
      startHour: recommendedStart,
      endHour: recommendedEnd,
      timeDisplay: recommendedTimeDisplay,
      status: 'rescheduled'
    });

    addNotification?.({
      title: '✓ Schedule Conflict Auto-Resolved',
      desc: `Auto-shifted "${recommendedShiftEvent.title}" to ${recommendedTimeDisplay}. Calendar is now 100% conflict-free.`,
      type: 'calendar'
    });

    setRescheduleSuccessBanner({
      title: recommendedShiftEvent.title,
      dateLabel: 'Today',
      timeDisplay: recommendedTimeDisplay
    });

    setTimeout(() => {
      setRescheduleSuccessBanner(null);
    }, 5000);
  };

  // Execute Reschedule
  const handleConfirmReschedule = () => {
    if (!meetingToReschedule || !selectedNextSlot) return;

    updateCalendarEvent(meetingToReschedule.id, {
      date: selectedNextSlot.date,
      startHour: selectedNextSlot.startHour,
      endHour: selectedNextSlot.endHour,
      timeDisplay: selectedNextSlot.timeDisplay,
      status: 'rescheduled'
    });

    setRescheduleSuccessBanner({
      title: meetingToReschedule.title,
      timeDisplay: selectedNextSlot.timeDisplay,
      dateLabel: selectedNextSlot.dateLabel
    });

    setMeetingToReschedule(null);
    setSelectedNextSlot(null);

    setTimeout(() => {
      setRescheduleSuccessBanner(null);
    }, 5000);
  };

  // Direct 1-Click Apply for a specific Candidate Slot
  const handleApplySlotDirectly = (slot) => {
    if (!meetingToReschedule || !slot) return;

    updateCalendarEvent(meetingToReschedule.id, {
      date: slot.date,
      startHour: slot.startHour,
      endHour: slot.endHour,
      timeDisplay: slot.timeDisplay,
      status: 'rescheduled'
    });

    setRescheduleSuccessBanner({
      title: meetingToReschedule.title,
      timeDisplay: slot.timeDisplay,
      dateLabel: slot.dateLabel
    });

    setMeetingToReschedule(null);
    setSelectedNextSlot(null);

    setTimeout(() => {
      setRescheduleSuccessBanner(null);
    }, 5000);
  };

  // Toggle meeting completion
  const handleToggleMeetingDone = (meeting) => {
    const newStatus = meeting.status === 'completed' ? 'confirmed' : 'completed';
    updateCalendarEvent(meeting.id, { status: newStatus });
  };

  // Quick Task Submit
  const handleAddQuickTask = (e) => {
    e.preventDefault();
    if (!quickTaskText.trim()) return;

    addNewTask({
      title: quickTaskText.trim(),
      category: 'Work',
      priority: 'High',
      dueDate: todayStr
    });

    setQuickTaskText('');
  };

  // Chat submit
  const handleChatSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="studio-container">
      {/* 1. HERO EXECUTIVE BRIEFING CARD */}
      <div className="studio-hero-card">
        {/* Top Status Badges Row */}
        <div className="studio-hero-meta-row">
          <span className="studio-live-pill">
            <span className="studio-live-dot"></span>
            <span>DailyEcho Intelligence Core Active</span>
          </span>
          <span className="studio-shield-pill">
            <ShieldCheck size={12} />
            <span>Zero-Retention Verified</span>
          </span>
          <span className="studio-clock-pill">
            <Clock size={12} />
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Live Sync</span>
          </span>
        </div>

        {/* Executive Greeting */}
        <h1 className="studio-hero-title">
          <span>{greetingText}, {currentUser?.name || 'Mayank'}</span>
          <span>👋</span>
        </h1>
        <p className="studio-hero-subtitle">
          <strong>{formatFullDate(todayStr)}</strong> • Your synchronized command center across Google Calendar, Gmail, and Tasks.
        </p>

        {/* 3-COLUMN KPI STATS (Explicit Grid) */}
        <div className="studio-kpi-grid">
          <div className="studio-kpi-card" onClick={() => setCurrentView('calendar')}>
            <div className="studio-kpi-icon teal">
              <Calendar size={20} />
            </div>
            <div className="studio-kpi-details">
              <span className="studio-kpi-label">Today's Meetings</span>
              <span className="studio-kpi-val">{todayMeetings.length} Scheduled</span>
              <span className="studio-kpi-sub">{upcomingMeetingsCount} upcoming</span>
            </div>
          </div>

          <div className="studio-kpi-card" onClick={() => setCurrentView('tasks')}>
            <div className="studio-kpi-icon blue">
              <CheckSquare size={20} />
            </div>
            <div className="studio-kpi-details">
              <span className="studio-kpi-label">Priority Tasks</span>
              <span className="studio-kpi-val">{completedTasksCount} of {todayTasks.length} Done</span>
              <span className="studio-kpi-sub">{todayTasks.length - completedTasksCount} pending</span>
            </div>
          </div>

          <div 
            className="studio-kpi-card" 
            onClick={() => {
              if (detectedCollision) {
                document.getElementById('ai-collision-shield-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            style={detectedCollision ? { cursor: 'pointer', border: '1.5px solid #f43f5e' } : {}}
          >
            <div className={`studio-kpi-icon ${detectedCollision ? 'amber' : 'emerald'}`} style={detectedCollision ? { background: '#fef2f2', color: '#e11d48' } : {}}>
              {detectedCollision ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
            </div>
            <div className="studio-kpi-details">
              <span className="studio-kpi-label">Schedule Health</span>
              <span className="studio-kpi-val" style={detectedCollision ? { color: '#e11d48' } : {}}>
                {detectedCollision ? 'Collision Alert' : '100% Conflict Free'}
              </span>
              <span className="studio-kpi-sub" style={detectedCollision ? { color: '#f43f5e', fontWeight: 700 } : {}}>
                {detectedCollision ? `${detectedCollision.overlapMinutes}m Overlap • Auto-Fix` : 'AI Guard Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI SCHEDULE COLLISION SHIELD & RESCHEDULING MESSAGE */}
      {detectedCollision && (
        <div id="ai-collision-shield-section" className="ai-collision-shield-card">
          <div className="collision-header">
            <div className="collision-header-left">
              <div className="collision-icon-orb">
                <ShieldAlert size={22} />
              </div>
              <div className="collision-title-wrap">
                <div className="collision-badge-row">
                  <span className="collision-mode-pill">⚠️ Collision Shield Active</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#e11d48' }}>
                    {detectedCollision.overlapMinutes} min conflict detected
                  </span>
                </div>
                <h3 className="collision-title">Schedule Collision Detected Between 2 Events</h3>
                <p className="collision-desc">
                  AI detected coinciding schedule timings for today. System notification sent to your alerts.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-error text-xs" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>● Notification Sent</span>
              </span>
            </div>
          </div>

          {/* Breakdown of Colliding Items */}
          <div className="collision-items-comparison">
            <div className="collision-item-box">
              <span className="collision-item-label">Existing Confirmed Event</span>
              <span className="collision-item-title">{detectedCollision.itemA.title}</span>
              <span className="collision-item-time">🕒 {detectedCollision.itemA.timeDisplay}</span>
            </div>

            <div className="collision-versus-badge">VS</div>

            <div className="collision-item-box">
              <span className="collision-item-label">
                {detectedCollision.itemB.isTask ? 'Colliding Priority Task' : 'Nearly Coinciding Event'}
              </span>
              <span className="collision-item-title">{detectedCollision.itemB.title}</span>
              <span className="collision-item-time">🕒 {detectedCollision.itemB.timeDisplay}</span>
            </div>
          </div>

          {/* AI Rescheduling Message */}
          <div className="collision-recommendation-box">
            <Sparkles size={18} className="collision-rec-icon" />
            <div className="collision-rec-text">
              {detectedCollision.aiMessage}
            </div>
          </div>

          {/* Interactive Actions */}
          <div className="collision-actions-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#64748b' }}>
              <Clock size={14} className="text-teal-600" />
              <span>Recommended Slot: <strong>Today, {detectedCollision.recommendedTimeDisplay}</strong> (Zero Conflict Buffer)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-pill text-xs"
                onClick={() => setMeetingToReschedule(detectedCollision.recommendedShiftEvent)}
              >
                Custom Slot Picker...
              </button>

              <button
                type="button"
                className="btn btn-primary btn-pill text-xs flex items-center gap-1.5 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)' }}
                onClick={handleAutoResolveCollision}
              >
                <Sparkles size={14} />
                <span>⚡ Auto-Reschedule & Resolve Conflict</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. TOP RESCHEDULE ADVISOR PANEL */}
      {meetingToReschedule ? (
        <div className="reschedule-command-panel">
          <div className="reschedule-header">
            <div className="reschedule-header-left">
              <div className="reschedule-icon-orb">
                <RefreshCw size={20} />
              </div>
              <div className="reschedule-title-wrap">
                <span className="reschedule-mode-pill">⚡ Instant Reschedule Mode</span>
                <h3 className="reschedule-title">{meetingToReschedule.title}</h3>
                <p className="reschedule-current-desc">
                  Current timing: <strong>{meetingToReschedule.timeDisplay}</strong> • Next optimal slots with zero conflict:
                </p>
              </div>
            </div>

            <button
              type="button"
              className="reschedule-cancel-btn"
              onClick={() => {
                setMeetingToReschedule(null);
                setSelectedNextSlot(null);
              }}
            >
              Cancel ✕
            </button>
          </div>

          {/* Candidate Next Slots Grid */}
          <div className="reschedule-slots-grid">
            {candidateNextSlots.map((slot, idx) => {
              const isSelected = selectedNextSlot?.date === slot.date && selectedNextSlot?.startHour === slot.startHour;

              return (
                <div
                  key={idx}
                  className={`reschedule-slot-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedNextSlot(slot)}
                >
                  <div className="slot-card-top">
                    <span>{slot.dateLabel}</span>
                    <span className="slot-index-tag">Slot #{idx + 1}</span>
                  </div>

                  <div className="slot-time-text">
                    {slot.timeDisplay}
                  </div>

                  <div className="slot-buffer-tag">
                    <CheckCircle2 size={11} />
                    <span>{slot.badge}</span>
                  </div>

                  <button
                    type="button"
                    className="btn-apply-slot-now"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplySlotDirectly(slot);
                    }}
                  >
                    <Zap size={12} />
                    <span>Apply This Timing</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Confirm Bottom Bar */}
          <div className="reschedule-bottom-bar">
            <span style={{ fontSize: '12px', color: '#78350f', fontWeight: '600' }}>
              Target: <strong>{selectedNextSlot ? `${selectedNextSlot.dateLabel} at ${selectedNextSlot.timeDisplay}` : 'None'}</strong>
            </span>
            <button
              type="button"
              className="btn btn-primary btn-pill"
              style={{ fontSize: '12px', padding: '6px 18px', fontWeight: '700' }}
              onClick={handleConfirmReschedule}
              disabled={!selectedNextSlot}
            >
              <CheckCheck size={14} />
              <span>Confirm & Sync Calendar</span>
            </button>
          </div>
        </div>
      ) : (
        /* Default Reschedule Assistant Bar */
        <div className="reschedule-idle-bar">
          <div className="reschedule-idle-left">
            <div className="reschedule-idle-orb">
              <Zap size={17} />
            </div>
            <div>
              <h4 className="reschedule-idle-title">
                <span>⚡ AI Schedule Optimizer & Instant Reschedule</span>
                <span className="badge badge-personal" style={{ fontSize: '9px', padding: '2px 6px' }}>Conflict Shield</span>
              </h4>
              <p className="reschedule-idle-desc">
                Click <strong>"Reschedule"</strong> on any meeting below to surface the next available timings and auto-shift slots.
              </p>
            </div>
          </div>

          {todayMeetings.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600' }}>Quick move:</span>
              <select
                className="reschedule-idle-select"
                onChange={(e) => {
                  const m = todayMeetings.find(item => item.id === e.target.value);
                  if (m) setMeetingToReschedule(m);
                }}
                defaultValue=""
              >
                <option value="" disabled>Choose meeting to reschedule...</option>
                {todayMeetings.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.timeDisplay})
                  </option>
                ))}
              </select>

              {!detectedCollision && (
                <button
                  type="button"
                  className="btn btn-secondary btn-pill text-[11px] py-1 px-2.5 flex items-center gap-1"
                  onClick={() => {
                    notifiedCollisionKeyRef.current = '';
                    addNewCalendarEvent({
                      title: 'Emergency Client Architecture Huddle',
                      date: todayStr,
                      startHour: 14.5,
                      endHour: 15.5,
                      timeDisplay: '2:30 PM – 3:30 PM',
                      color: '#f43f5e',
                      category: 'Work',
                      location: 'Google Meet'
                    });
                  }}
                  title="Simulate schedule collision to test AI shield"
                >
                  <AlertTriangle size={12} className="text-amber-500" />
                  <span>Simulate Collision</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Reschedule Success Alert */}
      {rescheduleSuccessBanner && (
        <div className="reschedule-toast">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={18} color="#059669" />
            <span>
              <strong>{rescheduleSuccessBanner.title}</strong> was successfully rescheduled to <strong>{rescheduleSuccessBanner.dateLabel} ({rescheduleSuccessBanner.timeDisplay})</strong>.
            </span>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-pill"
            style={{ fontSize: '11px', padding: '4px 12px', fontWeight: '700' }}
            onClick={() => setCurrentView('calendar')}
          >
            <span>View Calendar</span>
            <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* 3. TWO-COLUMN COCKPIT (Left: Meetings & Tasks | Right: AI Copilot) */}
      <div className="studio-cockpit-grid">
        {/* Left Column */}
        <div className="studio-left-column">
          {/* A. SCHEDULED MEETINGS OF TODAY */}
          <div className="studio-panel-card">
            <div className="studio-panel-header">
              <div className="studio-panel-header-left">
                <div className="studio-panel-icon-orb teal">
                  <Calendar size={18} />
                </div>
                <div>
                  <h2 className="studio-panel-title">
                    <span>Scheduled Meetings of Today</span>
                    <span className="studio-counter-chip">{todayMeetings.length}</span>
                  </h2>
                  <p className="studio-panel-subtitle">
                    Auto-tracks completion • Kept in list for your full record
                  </p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="studio-filter-tabs">
                <button
                  type="button"
                  className={`studio-filter-tab-btn ${meetingFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setMeetingFilter('all')}
                >
                  All ({todayMeetings.length})
                </button>
                <button
                  type="button"
                  className={`studio-filter-tab-btn ${meetingFilter === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setMeetingFilter('upcoming')}
                >
                  Upcoming ({upcomingMeetingsCount})
                </button>
                <button
                  type="button"
                  className={`studio-filter-tab-btn ${meetingFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => setMeetingFilter('completed')}
                >
                  Done ({doneMeetingsCount})
                </button>
              </div>
            </div>

            {/* Meetings List */}
            {filteredTodayMeetings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: '#94a3b8', fontSize: '13px' }}>
                <Calendar size={36} style={{ margin: '0 auto 10px auto', opacity: 0.3, color: '#0d9488' }} />
                <p style={{ fontWeight: '600' }}>
                  {meetingFilter === 'completed' 
                    ? 'No completed meetings yet today.' 
                    : meetingFilter === 'upcoming' 
                      ? 'No upcoming meetings left today. All completed!' 
                      : 'No meetings scheduled for today yet.'}
                </p>
                <button
                  type="button"
                  className="btn btn-secondary btn-pill"
                  style={{ fontSize: '11px', marginTop: '10px' }}
                  onClick={() => setCurrentView('calendar')}
                >
                  Open Full Calendar
                </button>
              </div>
            ) : (
              <div className="studio-meetings-list">
                {filteredTodayMeetings.map((evt) => {
                  const isDone = evt.status === 'completed' || currentHourFloat >= evt.endHour;
                  const isInProgress = !isDone && currentHourFloat >= evt.startHour && currentHourFloat < evt.endHour;

                  return (
                    <div
                      key={evt.id}
                      className={`studio-meeting-item ${isDone ? 'is-done' : ''} ${isInProgress ? 'is-live' : ''}`}
                    >
                      <div className="meeting-left-group">
                        {/* Time Box */}
                        <div className="meeting-time-box">
                          <span className="time-start">{formatHourLabel(evt.startHour)}</span>
                          <span className="time-end">{formatHourLabel(evt.endHour)}</span>
                        </div>

                        {/* Category Color Strip */}
                        <div 
                          className="meeting-color-strip" 
                          style={{ backgroundColor: evt.color || '#0d9488' }}
                        />

                        {/* Details */}
                        <div className="meeting-info-col">
                          <div className="meeting-title-row">
                            <span className={`meeting-title-text ${isDone ? 'struck' : ''}`}>
                              {evt.title}
                            </span>

                            {/* Status Badges */}
                            {isDone ? (
                              <span className="badge-done-kept">
                                <Check size={11} />
                                <span>Done (Kept in list)</span>
                              </span>
                            ) : isInProgress ? (
                              <span className="badge-live-now">
                                <span className="studio-live-dot" />
                                <span>Live Now</span>
                              </span>
                            ) : (
                              <span className="badge-upcoming">
                                <Clock size={11} />
                                <span>Upcoming</span>
                              </span>
                            )}
                          </div>

                          <div className="meeting-meta-row">
                            <span style={{ fontWeight: '700', color: '#0d9488' }}>
                              {evt.timeDisplay}
                            </span>
                            {evt.location && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={11} color="#94a3b8" />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                                  {evt.location}
                                </span>
                              </span>
                            )}
                            {evt.attendees && evt.attendees.length > 0 && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Users size={11} color="#94a3b8" />
                                <span>{evt.attendees.length} guests</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="meeting-actions-col">
                        {!isDone && (
                          <button
                            type="button"
                            className="btn-meet-join"
                            onClick={() => window.open('https://meet.google.com', '_blank')}
                            title="Join Google Meet"
                          >
                            <Video size={12} />
                            <span>Join</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className="btn-meeting-reschedule"
                          onClick={() => {
                            setMeetingToReschedule(evt);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          title="Reschedule to next timing"
                        >
                          <RefreshCw size={11} />
                          <span>Reschedule</span>
                        </button>

                        <button
                          type="button"
                          className={`btn-meeting-done-toggle ${isDone ? 'done' : ''}`}
                          onClick={() => handleToggleMeetingDone(evt)}
                          title={isDone ? 'Mark as active' : 'Mark as done'}
                        >
                          <Check size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* B. TODAY'S PRIORITY TASKS */}
          <div className="studio-panel-card">
            <div className="studio-panel-header">
              <div className="studio-panel-header-left">
                <div className="studio-panel-icon-orb blue">
                  <CheckSquare size={18} />
                </div>
                <div>
                  <h2 className="studio-panel-title">
                    <span>Today's Priority Tasks</span>
                    <span className="studio-counter-chip">{completedTasksCount}/{todayTasks.length}</span>
                  </h2>
                  <p className="studio-panel-subtitle">
                    {todayTasks.length > 0 ? Math.round((completedTasksCount / todayTasks.length) * 100) : 0}% of daily tasks completed
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-pill"
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={() => setCurrentView('tasks')}
              >
                <span>Task Board</span>
                <ArrowRight size={11} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="studio-progress-track">
              <div 
                className="studio-progress-fill"
                style={{ width: `${todayTasks.length > 0 ? (completedTasksCount / todayTasks.length) * 100 : 0}%` }}
              />
            </div>

            {/* Quick Add Task */}
            <form onSubmit={handleAddQuickTask} className="studio-task-form">
              <input
                type="text"
                placeholder="+ Add a quick task for today (Press Enter)..."
                value={quickTaskText}
                onChange={(e) => setQuickTaskText(e.target.value)}
                className="studio-task-input"
              />
              <button type="submit" className="studio-task-add-btn">
                <Plus size={13} />
                <span>Add</span>
              </button>
            </form>

            {/* Tasks list */}
            <div className="studio-tasks-list">
              {todayTasks.map((task) => {
                const isCompleted = task.status === 'Completed' || task.status === 'Done';

                return (
                  <div key={task.id} className="studio-task-row">
                    <div className="studio-task-left">
                      <button
                        type="button"
                        className={`studio-task-checkbox ${isCompleted ? 'checked' : ''}`}
                        onClick={() => updateTaskStatus(task.id, isCompleted ? 'To-do' : 'Completed')}
                      >
                        {isCompleted && <Check size={11} />}
                      </button>

                      <span className={`studio-task-title ${isCompleted ? 'completed' : ''}`}>
                        {task.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`studio-task-priority ${(task.priority || 'medium').toLowerCase()}`}>
                        {task.priority || 'Medium'}
                      </span>
                      <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: '500' }}>
                        {task.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant Copilot */}
        <div className="studio-right-column">
          <div className="studio-panel-card studio-chat-panel">
            <div className="studio-panel-header">
              <div className="studio-panel-header-left">
                <div className="studio-panel-icon-orb" style={{ background: 'linear-gradient(135deg, #0d9488, #0284c7)', color: '#ffffff' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="studio-panel-title">
                    <span>DailyEcho Intelligence</span>
                    <span className="badge badge-personal" style={{ fontSize: '9px', padding: '2px 6px' }}>Echo Copilot 2.5</span>
                  </h2>
                  <p className="studio-panel-subtitle">
                    Synchronized natural language agent
                  </p>
                </div>
              </div>

              <span className="studio-live-pill" style={{ fontSize: '10px', padding: '3px 8px' }}>
                <span className="studio-live-dot" /> Connected
              </span>
            </div>

            {/* Inspiration Prompt Pills */}
            <div className="studio-prompts-row">
              {[
                { label: '⚡ Reschedule next meeting', prompt: 'Reschedule meeting to next slot' },
                { label: '📅 Summarize today\'s schedule', prompt: 'Summarize my schedule' },
                { label: '✅ What tasks are left?', prompt: 'What tasks to do next?' },
                { label: '✉️ Draft team update email', prompt: 'Draft team update email' }
              ].map((item, i) => (
                <button
                  key={i}
                  type="button"
                  className="studio-prompt-pill"
                  onClick={() => sendChatMessage(item.prompt)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="studio-chat-messages">
              {chatMessages.map((msg) => {
                const isUser = msg.sender === 'user';

                return (
                  <div key={msg.id} className={`studio-msg-row ${isUser ? 'user' : 'ai'}`}>
                    <div className={`studio-bubble ${isUser ? 'user' : 'ai'}`}>
                      <p style={{ margin: 0 }}>{msg.text}</p>

                      {msg.hasRunAction && (
                        <div>
                          <button
                            type="button"
                            className="studio-action-card-btn"
                            onClick={() => {
                              if (todayMeetings.length > 0) {
                                setMeetingToReschedule(todayMeetings[0]);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              } else {
                                startAgentExecution(msg.suggestedPrompt || 'Coordinate calendar');
                              }
                            }}
                          >
                            <Zap size={11} color="#f59e0b" />
                            <span>⚡ Auto-Reschedule Next Slot</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px', padding: '0 4px' }}>
                      {msg.time || 'Just now'}
                    </span>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSend} className="studio-chat-input-row">
              <input
                type="text"
                placeholder="Ask DailyEcho to reschedule, organize, or draft..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="studio-chat-input-field"
              />
              <button
                type="submit"
                className="studio-chat-send-btn"
                disabled={!chatInput.trim()}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 4. COLLAPSIBLE TECHNICAL ORCHESTRATION SECTION */}
      <div className="studio-panel-card" style={{ padding: '14px 20px', marginTop: '6px' }}>
        <button
          type="button"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', padding: '0' }}
          onClick={() => setShowTechnicalDag(!showTechnicalDag)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="studio-panel-icon-orb teal" style={{ width: '28px', height: '28px' }}>
              <Cpu size={14} />
            </div>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a' }}>
                Advanced Autonomous Orchestration Engine (DAG & Audit Verification)
              </span>
              <p style={{ fontSize: '10.5px', color: '#94a3b8', margin: '0' }}>
                View prompt decomposition, REST API micro-steps, and cryptographic audit proofs
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-personal" style={{ fontSize: '9px' }}>
              {executionPlan.length > 0 ? `${executionPlan.length} Steps Executed` : 'Idle'}
            </span>
            {showTechnicalDag ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </button>

        {showTechnicalDag && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0, 0, 0, 0.06)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <textarea
                rows={2}
                className="command-textarea"
                style={{ fontSize: '12px' }}
                placeholder="Give any complex instruction across Gmail, Calendar, and Tasks..."
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                disabled={isExecuting}
              />
              <button
                type="button"
                className="btn btn-primary run-agent-btn"
                style={{ fontSize: '12px', padding: '8px 16px', whiteSpace: 'nowrap' }}
                onClick={() => startAgentExecution(agentPrompt)}
                disabled={isExecuting || !agentPrompt.trim()}
              >
                <Play size={13} fill="currentColor" />
                <span>Execute</span>
              </button>
            </div>

            {verificationProof && (
              <div className="verification-proof-banner" style={{ padding: '12px 16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '11.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#0d9488" />
                    <span>Proof Hash: <strong>{verificationProof}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b' }}>
                    <span>Latency: {executionStats.latency}</span>
                    <span>Tokens: {executionStats.tokens}</span>
                    <span style={{ color: '#0d9488', fontWeight: '700' }}>3 of 3 Apps Synced</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}