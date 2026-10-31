// Initial data for DailyEcho connected services
import { toISODateString, addDays, getStartOfWeek, formatTaskDisplayDate } from './calendarUtils';

export const initialEmails = [
  {
    id: 'msg-101',
    from: 'Sarah Jenkins <sarah.j@vertexcloud.io>',
    to: 'me@dailyecho.ai',
    subject: 'Quarterly Strategy Review sync tomorrow at 3:00 PM',
    snippet: 'Hi Mayank, can we lock in our Quarterly Strategy Review for tomorrow at 3:00 PM? Let me know if that works or if we need to adjust.',
    body: `Hi Mayank,

I hope your week is going great!

Can we lock in our Quarterly Strategy Review for tomorrow afternoon at 3:00 PM EST (45 mins)? We need to finalize the Q4 roadmap, go over the cross-app automation benchmarks, and discuss the team resource allocation.

Please send an invite and share the prep deck beforehand if possible.

Best regards,
Sarah Jenkins
VP of Product, VertexCloud`,
    date: 'Yesterday, 4:15 PM',
    unread: false,
    labels: ['Inbox', 'Important'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'msg-102',
    from: 'Elena Rostova <elena.r@novastudio.design>',
    to: 'me@dailyecho.ai',
    subject: 'Design System 3.0 & UX Walkthrough tomorrow at 11:30 AM',
    snippet: 'Hi Mayank, the design team completed the high-fidelity UI specs. Can we hop on a quick 30-min design walkthrough tomorrow at 11:30 AM?',
    body: `Hi Mayank,

The design team just wrapped up the high-fidelity interactive specs for the new workspace view and cockpit layout.

Can we hop on a quick 30-min design walkthrough tomorrow at 11:30 AM?

We will review:
1. Updated typography scales and crisp contrast ratios
2. Dynamic sender avatar badges and interactive hover states
3. Mobile viewport responsiveness for Gmail & Calendar panes

Google Meet link: meet.google.com/design-review-30

Looking forward to your thoughts!

Best,
Elena Rostova
Lead Product Designer, Studio Nova`,
    date: 'Today, 10:45 AM',
    unread: true,
    labels: ['Inbox', 'Design'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'msg-103',
    from: 'Marcus Chen <marcus.chen@apexdistributed.io>',
    to: 'me@dailyecho.ai',
    subject: 'API Architecture & Latency Review today at 4:30 PM',
    snippet: 'Hey Mayank, we noticed a 40ms latency reduction across the agent orchestration pipeline. Let’s do an emergency sync today at 4:30 PM.',
    body: `Hey Mayank,

Great news from the infra side: we verified a 40ms latency drop across the DailyEcho agent execution pipeline after rolling out the edge caching layer.

Let’s do a quick sync today at 4:30 PM to review the performance benchmarks before releasing the update to production users.

Zoom Room: https://zoom.us/j/9482910482

See you shortly,
Marcus Chen
VP of Engineering, Apex Distributed`,
    date: 'Today, 11:15 AM',
    unread: true,
    labels: ['Inbox', 'Engineering'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'msg-104',
    from: 'Alex Rivera <alex.rivera@techcorp.com>',
    to: 'me@dailyecho.ai',
    subject: 'Client Onboarding presentation feedback & deliverables',
    snippet: 'Reviewed the deck. Let’s make sure we schedule the kickoff with the client stakeholders and prepare the handoff checklist.',
    body: `Hey Mayank,

I reviewed the deck. Looks solid overall! Let’s make sure we schedule the kickoff with the client stakeholders for next Tuesday at 11:00 AM and prepare the handoff checklist in Google Tasks.

Let me know once the calendar invite is sent out.

Alex Rivera
Client Solutions Director, TechCorp`,
    date: 'Today, 9:30 AM',
    unread: false,
    labels: ['Inbox', 'Work'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'msg-105',
    from: 'Priya Sharma <priya.s@dailyecho.ai>',
    to: 'me@dailyecho.ai',
    subject: 'Sprint 42 Retrospective & Roadmap Alignment next Monday at 10:00 AM',
    snippet: 'Sprint 42 was a huge success with all 14 core agent tasks delivered on time. Let’s meet for our bi-weekly Sprint Retrospective next Monday at 10:00 AM.',
    body: `Hi Team,

Sprint 42 was a massive success—all 14 core agent tasks were delivered ahead of time with zero regressions!

Let's meet for our bi-weekly Sprint Retrospective next Monday at 10:00 AM.

Agenda:
1. Velocity breakdown & cross-app automation milestones
2. Calendar conflict detection and reschedule optimizer feedback
3. Key deliverables for Sprint 43

Meeting Room: Conference Room B (or Google Meet: meet.google.com/sprint-42-retro)

Please make sure your sprint cards are up to date in Tasks Board before the call.

Cheers,
Priya Sharma
Product Operations Lead`,
    date: 'Yesterday, 2:20 PM',
    unread: false,
    labels: ['Inbox', 'Sprint'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'msg-106',
    from: 'David Vance <david.vance@cloudscale.vc>',
    to: 'me@dailyecho.ai',
    subject: 'Strategic Integration & Partnership discussion next Friday at 2:00 PM',
    snippet: 'Hi Mayank, loved our discussion at the enterprise summit. Are you open for a partnership catchup next Friday at 2:00 PM to explore cross-platform sync?',
    body: `Hi Mayank,

It was wonderful connecting at the enterprise AI summit last week. We were thoroughly impressed by DailyEcho's autonomous cross-app execution capabilities.

We would love to explore connecting our multi-cloud deployment automation with your agent workspace.

Are you available for a 45-minute partnership discussion next Friday at 2:00 PM?

Location: Conference Room Alpha (or via Google Meet: meet.google.com/cloudscale-dailyecho)

Best regards,
David Vance
Partner, Cloudscale Ventures`,
    date: 'Oct 30, 2026',
    unread: false,
    labels: ['Inbox', 'Partnership'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'msg-107',
    from: 'Emily Watson <emily.w@talentsearch.io>',
    to: 'me@dailyecho.ai',
    subject: 'Candidate Interview: Staff AI Systems Engineer on Friday at 3:30 PM',
    snippet: 'Hi Mayank, we have a top candidate for the agent infrastructure role. Interview is scheduled for Friday at 3:30 PM.',
    body: `Hi Mayank,

We have shortlisted an outstanding candidate, Dr. Sophia Lin (ex-DeepMind, Staff AI Infrastructure Engineer), for our core autonomous systems team.

Her technical interview is scheduled for Friday at 3:30 PM.

Google Meet link: meet.google.com/interview-sophia

I have added her resume and system architecture portfolio to the interview folder in Google Drive. Let me know if you would like me to adjust the interview panel.

Warm regards,
Emily Watson
Head of Talent Acquisition`,
    date: 'Oct 29, 2026',
    unread: false,
    labels: ['Inbox', 'Recruiting'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'msg-108',
    from: 'Liam O’Connor <liam@dailyecho.ai>',
    to: 'me@dailyecho.ai',
    subject: 'Enterprise Pilot Metrics: 98.4% satisfaction on Schedule Optimizer',
    snippet: 'Weekly telemetry report: enterprise users highlighted the schedule optimizer and autonomous meeting extraction as the #1 capability.',
    body: `Hey Mayank,

Here is the weekly executive summary from our 24 enterprise pilot accounts:

• 98.4% user satisfaction on autonomous Google Calendar rescheduling
• Average time saved per executive: 4.8 hours / week
• Zero conflict incidents reported across 1,200+ coordinated meetings
• Cross-app task conversion rate reached an all-time high of 92%

Full telemetry graphs and cohort analysis are linked in the audit history report.

Keep up the incredible momentum!

Liam O’Connor
Head of Customer Success`,
    date: 'Oct 29, 2026',
    unread: false,
    labels: ['Inbox', 'Metrics'],
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'msg-109',
    from: 'Google Workspace Alert <no-reply@accounts.google.com>',
    to: 'me@dailyecho.ai',
    subject: 'Security Notice: DailyEcho granted OAuth access',
    snippet: 'DailyEcho agent was granted permissions to manage Gmail, Google Calendar, and Google Tasks.',
    body: `Your Google Account connected to DailyEcho has successfully authorized read/write access to Gmail, Calendar, and Tasks under zero-retention encryption.

Details:
• Application: DailyEcho Intelligence Suite
• Scopes: Gmail API, Google Calendar API, Google Tasks API
• Security Protocol: End-to-end encrypted session tokens with zero data persistence on external LLM servers.

No action is needed if you authorized this connection.`,
    date: 'Oct 28, 2026',
    unread: false,
    labels: ['Security'],
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg'
  },
  {
    id: 'msg-110',
    from: 'Stripe Billing <invoices@stripe.com>',
    to: 'me@dailyecho.ai',
    subject: 'Receipt for Invoice #DE-9821 paid successfully – DailyEcho Pro',
    snippet: 'Your monthly subscription for DailyEcho Workspace Pro ($49.00 USD) has processed successfully.',
    body: `Hello Mayank,

Thank you for your business. Your monthly subscription for DailyEcho Workspace Pro (Agentic Automation Tier) has been successfully renewed.

Summary:
• Plan: DailyEcho Pro Unlimited (Enterprise Agents + Multi-App Sync)
• Amount: $49.00 USD
• Payment Method: Mastercard ending in 4242
• Invoice ID: #DE-9821
• Next Billing Date: November 28, 2026

You can download your PDF invoice and tax receipt anytime from your account settings.

Sincerely,
The Stripe Billing Team`,
    date: 'Oct 27, 2026',
    unread: false,
    labels: ['Finance', 'Receipts'],
    avatar: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=100&h=100&fit=crop&crop=faces'
  }
];

export const initialDrafts = [
  {
    id: 'draft-201',
    to: 'team-leads@dailyecho.ai',
    subject: 'Draft: Updates on Autonomous Agentic Workflows & Google Workspace',
    snippet: 'Team, here is the weekly recap on the Gmail + Calendar agent orchestration...',
    updatedAt: '2 hours ago'
  }
];

export const getWorkingCalendarEvents = () => {
  const today = new Date();
  const startOfWeek = getStartOfWeek(today, 0); // Sunday

  const todayStr = toISODateString(today);
  const tomorrowStr = toISODateString(addDays(today, 1));
  const yesterdayStr = toISODateString(addDays(today, -1));
  const dayBeforeYesterdayStr = toISODateString(addDays(today, -2));
  const inTwoDaysStr = toISODateString(addDays(today, 2));
  const inThreeDaysStr = toISODateString(addDays(today, 3));
  const weekStartStr = toISODateString(startOfWeek);
  const weekEndStr = toISODateString(addDays(startOfWeek, 6));

  return [
    // Multi-day all day event for the current week
    {
      id: 'cal-allday-1',
      title: 'Q4 Strategic Roadmap & Execution Week',
      isAllDay: true,
      startDate: weekStartStr,
      endDate: weekEndStr,
      date: weekStartStr,
      color: '#e5ad06',
      textColor: '#ffffff',
      category: 'Work'
    },
    // Today Events
    {
      id: 'cal-today-0',
      title: 'Executive Briefing & Email Triage',
      date: todayStr,
      startHour: 8.0,
      endHour: 8.75,
      timeDisplay: '8:00 AM – 8:45 AM',
      color: '#0d9488',
      category: 'Work',
      status: 'completed',
      location: 'Google Meet (meet.google.com/exec-triage)',
      attendees: ['exec-team@dailyecho.ai', 'me@dailyecho.ai']
    },
    {
      id: 'cal-today-1',
      title: 'Daily Standup & Sprint Sync',
      date: todayStr,
      startHour: 9.5,
      endHour: 10.5,
      timeDisplay: '9:30 AM – 10:30 AM',
      color: '#039be5',
      category: 'Work',
      location: 'Google Meet (meet.google.com/sync-standup)',
      attendees: ['engineering@dailyecho.ai', 'me@dailyecho.ai']
    },
    {
      id: 'cal-today-2',
      title: 'Product Architecture Review',
      date: todayStr,
      startHour: 13.5,
      endHour: 15.0,
      timeDisplay: '1:30 PM – 3:00 PM',
      color: '#7b1fa2',
      category: 'Work',
      location: 'Austin HQ / Conference Room B',
      attendees: ['sarah.j@vertexcloud.io', 'alex.rivera@techcorp.com', 'me@dailyecho.ai']
    },
    {
      id: 'cal-today-collision',
      title: 'Emergency Client Architecture Huddle',
      date: todayStr,
      startHour: 14.5,
      endHour: 15.5,
      timeDisplay: '2:30 PM – 3:30 PM',
      color: '#f43f5e',
      category: 'Work',
      location: 'Google Meet (meet.google.com/emergency-sync)',
      attendees: ['alex.rivera@techcorp.com', 'client-solutions@enterprise.io']
    },
    {
      id: 'cal-today-3',
      title: 'Strength Training / Fitness',
      date: todayStr,
      startHour: 17,
      endHour: 18,
      timeDisplay: '5:00 PM – 6:00 PM',
      color: '#0f9d58',
      category: 'Health',
      location: 'Downtown Athletic Club',
      attendees: ['Coach Marcus', 'me@dailyecho.ai']
    },
    // Tomorrow Events (matches Sarah Jenkins email & client onboarding)
    {
      id: 'cal-tomorrow-1',
      title: 'Client Onboarding Kickoff',
      date: tomorrowStr,
      startHour: 11,
      endHour: 12,
      timeDisplay: '11:00 AM – 12:00 PM',
      color: '#f4511e',
      category: 'Work',
      location: 'Google Meet (meet.google.com/client-kickoff)',
      attendees: ['alex.rivera@techcorp.com', 'client-team@enterprise.io']
    },
    {
      id: 'cal-tomorrow-2',
      title: 'Quarterly Strategy Review',
      date: tomorrowStr,
      startHour: 15,
      endHour: 16,
      timeDisplay: '3:00 PM – 4:00 PM',
      color: '#0d9488',
      category: 'Work',
      location: 'Google Meet (meet.google.com/strat-review)',
      attendees: ['sarah.j@vertexcloud.io', 'me@dailyecho.ai']
    },
    // Earlier this week
    {
      id: 'cal-past-1',
      title: 'CrossFit WOD & Mobility',
      date: yesterdayStr,
      startHour: 8,
      endHour: 9,
      timeDisplay: '8:00 AM – 9:00 AM',
      color: '#039be5',
      category: 'Health',
      location: 'CrossFit Box',
      attendees: ['CrossFit Box', 'me@dailyecho.ai']
    },
    {
      id: 'cal-past-2',
      title: 'Team Retrospective & Backlog Refinement',
      date: dayBeforeYesterdayStr,
      startHour: 14,
      endHour: 15.5,
      timeDisplay: '2:00 PM – 3:30 PM',
      color: '#0f9d58',
      category: 'Work',
      location: 'Google Meet / Room 204',
      attendees: ['team-leads@dailyecho.ai', 'me@dailyecho.ai']
    },
    // Later this week
    {
      id: 'cal-future-1',
      title: 'Deep Work: Autonomous Agent Orchestration',
      date: inTwoDaysStr,
      startHour: 9,
      endHour: 11,
      timeDisplay: '9:00 AM – 11:00 AM',
      color: '#d50000',
      category: 'Personal',
      location: 'Focus Mode / Do Not Disturb',
      attendees: ['me@dailyecho.ai']
    },
    {
      id: 'cal-future-2',
      title: 'Venture & Strategy Sync with Sebastian Bates',
      date: inThreeDaysStr,
      startHour: 10,
      endHour: 11.5,
      timeDisplay: '10:00 AM – 11:30 AM',
      color: '#8d6e63',
      category: 'Work',
      location: 'Google Meet (meet.google.com/seb-sync)',
      attendees: ['sebastian.bates@warrior.io', 'me@dailyecho.ai']
    }
  ];
};

export const initialCalendarEvents = getWorkingCalendarEvents();

const todayRef = new Date();

export const initialTasks = [
  {
    id: 'task-1',
    title: 'Prepare project proposal',
    description: 'Submit the proposal by Friday with budget and staffing',
    category: 'Work',
    priority: 'High',
    startDate: formatTaskDisplayDate(addDays(todayRef, -1)),
    dueDate: formatTaskDisplayDate(addDays(todayRef, 1)),
    status: 'To-do',
    hasWarning: true,
    aiGenerated: false
  },
  {
    id: 'task-2',
    title: 'Schedule team meeting',
    description: 'Set up a Zoom / Meet call for Monday roadmap sync',
    category: 'Work',
    priority: 'Medium',
    startDate: formatTaskDisplayDate(todayRef),
    dueDate: formatTaskDisplayDate(addDays(todayRef, 1)),
    status: 'To-do',
    hasWarning: true,
    aiGenerated: false
  },
  {
    id: 'task-3',
    title: 'Go to the gym',
    description: 'Workout session at 6:00 PM - leg day & cardio',
    category: 'Health',
    priority: 'High',
    startDate: formatTaskDisplayDate(todayRef),
    dueDate: formatTaskDisplayDate(todayRef),
    status: 'To-do',
    hasWarning: false,
    aiGenerated: false
  },
  {
    id: 'task-4',
    title: 'Buy groceries',
    description: 'Almond milk, organic fruits, greens & protein bars',
    category: 'Personal',
    priority: 'Medium',
    startDate: formatTaskDisplayDate(todayRef),
    dueDate: formatTaskDisplayDate(addDays(todayRef, 2)),
    status: 'To-do',
    hasWarning: false,
    aiGenerated: false
  },
  {
    id: 'task-5',
    title: 'Dentist Appointment',
    description: 'Call the clinic to confirm the check-up and cleaning',
    category: 'Health',
    priority: 'High',
    startDate: formatTaskDisplayDate(addDays(todayRef, -2)),
    dueDate: formatTaskDisplayDate(todayRef),
    status: 'In progress',
    hasWarning: false,
    aiGenerated: false
  },
  {
    id: 'task-6',
    title: 'Complete Tuition Payment',
    description: 'Pay the semester tuition fee online. Save the receipt.',
    category: 'Finance',
    priority: 'High',
    startDate: formatTaskDisplayDate(addDays(todayRef, -4)),
    dueDate: formatTaskDisplayDate(todayRef),
    status: 'In progress',
    hasWarning: true,
    aiGenerated: false
  },
  {
    id: 'task-7',
    title: 'Review Quarterly OKRs',
    description: 'Audit Key Performance Indicators across AI agent accuracy',
    category: 'Work',
    priority: 'Medium',
    startDate: formatTaskDisplayDate(addDays(todayRef, -7)),
    dueDate: formatTaskDisplayDate(addDays(todayRef, -2)),
    status: 'Completed',
    hasWarning: false,
    aiGenerated: false
  },
  {
    id: 'task-8',
    title: 'Car Maintenance Service',
    description: 'Oil change and tire rotation scheduled with dealer',
    category: 'Personal',
    priority: 'Low',
    startDate: formatTaskDisplayDate(addDays(todayRef, -10)),
    dueDate: formatTaskDisplayDate(addDays(todayRef, -5)),
    status: 'Overdue',
    hasWarning: true,
    aiGenerated: false
  }
];

export const initialWorkflowHistory = [
  {
    id: 'wf-901',
    prompt: 'Find my meeting email from tomorrow, check my calendar, schedule the meeting, create a preparation task two days before, and draft an email to my team.',
    timestamp: 'Today at 10:14 AM',
    status: 'completed',
    stepsCount: 5,
    toolsUsed: ['gmail.searchMessages', 'calendar.findFreeSlots', 'calendar.createEvent', 'tasks.createTask', 'gmail.createDraft'],
    verificationProof: 'GSUITE-VERIFIED-98442',
    latency: '1.42s',
    tokens: 412
  },
  {
    id: 'wf-900',
    prompt: 'Review unread emails from client Alex and generate a follow-up action list in Google Tasks with high priority',
    timestamp: 'Yesterday at 4:32 PM',
    status: 'completed',
    stepsCount: 3,
    toolsUsed: ['gmail.searchMessages', 'agent.summarize', 'tasks.createTask'],
    verificationProof: 'GSUITE-VERIFIED-98120',
    latency: '0.88s',
    tokens: 280
  }
];

export const templateGalleries = [
  {
    id: 'tmpl-1',
    title: 'Executive Calendar & Email Sync',
    category: 'Workflow',
    badge: 'Popular',
    description: 'Scan inbox for meeting requests, check calendar for conflicts, draft acceptance, and book preparation blocks.',
    tags: ['Gmail', 'Calendar', 'Zero-Conflict'],
    image: '/assets/ai-globe.jpg',
    prompt: 'Find any meeting email received in the last 24h, verify availability in Google Calendar, schedule the meeting and add a 30-min prep task in Tasks.'
  },
  {
    id: 'tmpl-2',
    title: 'Smart Goal & Productivity Hub',
    category: 'Tasks & Planning',
    badge: 'Featured',
    description: 'Decompose high-level project goals into actionable Google Tasks with priorities, due dates, and calendar check-ins.',
    tags: ['Tasks', 'Calendar', 'Productivity'],
    image: '/assets/productivity-hub.jpg',
    prompt: 'Create a 2-week Sprint Plan with 4 milestone tasks in Google Tasks and schedule review check-ins on Google Calendar.'
  },
  {
    id: 'tmpl-3',
    title: 'Emergency Reschedule & Team Broadcast',
    category: 'Conflict Resolver',
    badge: 'HITL Protected',
    description: 'Detect calendar overlap, reschedule the conflicting meeting to next open slot, and draft an update email with HITL approval.',
    tags: ['Calendar', 'Gmail', 'HITL Approval'],
    image: '/assets/ai-globe.jpg',
    prompt: 'Check for schedule conflicts tomorrow at 3:00 PM. If conflict exists, move meeting to 4:30 PM, update tasks, and draft confirmation to attendees.'
  }
];
