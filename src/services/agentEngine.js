// DailyEcho - Agentic Workflow Automation Engine
// Multi-step DAG Planner, Tool Dispatcher, HITL Guard & Self-Verification System

export const PLAN_TEMPLATES = {
  DEFAULT_COMPLEX: {
    steps: [
      {
        id: 'step-1',
        name: 'Analyze Natural Language Instruction',
        tool: 'agent.nlpParser',
        action: 'Extract entities: event type, target date (tomorrow), attendees, task offsets (2 days before), draft intent',
        targetApp: 'Agentic Core',
        icon: 'brain',
        status: 'pending',
        result: null
      },
      {
        id: 'step-2',
        name: 'Search Gmail Inbox for Meeting Request',
        tool: 'gmail.searchMessages',
        action: 'Query: "subject:meeting OR subject:review newer_than:2d"',
        targetApp: 'Gmail',
        icon: 'mail',
        status: 'pending',
        result: null
      },
      {
        id: 'step-3',
        name: 'Check Google Calendar for Availability',
        tool: 'calendar.findFreeSlots',
        action: 'Inspect slots for 2026-10-31 around 3:00 PM - 3:45 PM',
        targetApp: 'Google Calendar',
        icon: 'calendar',
        status: 'pending',
        result: null
      },
      {
        id: 'step-4',
        name: 'Schedule Calendar Event',
        tool: 'calendar.createEvent',
        action: 'Insert: "Quarterly Strategy Review with Sarah Jenkins" at 3:00 PM EST',
        targetApp: 'Google Calendar',
        icon: 'calendar-plus',
        status: 'pending',
        result: null
      },
      {
        id: 'step-5',
        name: 'Create Preparation Task in Google Tasks',
        tool: 'tasks.createTask',
        action: 'Insert task: "Prep Strategy Review & finalize Q4 roadmap" due 2 days prior (2026-10-29)',
        targetApp: 'Google Tasks',
        icon: 'check-square',
        status: 'pending',
        result: null
      },
      {
        id: 'step-6',
        name: 'Human-in-the-Loop Approval Guard',
        tool: 'hitl.requireConfirmation',
        action: 'Sensitive action: User approval required before dispatching email to team',
        targetApp: 'HITL Guard',
        isSensitive: true,
        icon: 'shield-alert',
        status: 'pending',
        result: null
      },
      {
        id: 'step-7',
        name: 'Draft Team Briefing in Gmail',
        tool: 'gmail.createDraft',
        action: 'Generate draft to engineering@dailyecho.ai with agenda, calendar invite link & task assignment',
        targetApp: 'Gmail',
        icon: 'mail-plus',
        status: 'pending',
        result: null
      },
      {
        id: 'step-8',
        name: 'Multi-App Verification & Audit Assertion',
        tool: 'agent.verifyExecutionState',
        action: 'Assert Event ID on Calendar, Task ID in Google Tasks, Draft ID in Gmail',
        targetApp: 'Verification Engine',
        icon: 'check-check',
        status: 'pending',
        result: null
      }
    ]
  }
};

/**
 * Intelligent Plan Generator: parses arbitrary prompts into executable DAG steps
 */
export function generateWorkflowPlan(instruction, hasConflictScenario = false) {
  const lower = instruction.toLowerCase();

  // If user is running the hero sample or mentions calendar & email & task
  const steps = [
    {
      id: 'step-1',
      name: 'Agentic NLP Decomposition',
      tool: 'agent.nlpParser',
      action: `Decomposing instruction into executable parameters & dependencies`,
      targetApp: 'Agent Core',
      icon: 'sparkles',
      status: 'pending',
      details: {
        entitiesExtracted: {
          intent: 'Multi-App Synchronization',
          scope: ['Gmail', 'Google Calendar', 'Google Tasks'],
          urgency: 'High',
          hitlRequired: true
        }
      }
    }
  ];

  if (lower.includes('email') || lower.includes('mail') || lower.includes('find')) {
    steps.push({
      id: `step-${steps.length + 1}`,
      name: 'Query Gmail for Meeting Details',
      tool: 'gmail.searchMessages',
      action: 'Searching recent threads for meeting confirmation and agenda details',
      targetApp: 'Gmail',
      icon: 'mail',
      status: 'pending',
      mockResult: {
        threadId: 'msg-101',
        subject: 'Quarterly Strategy Review sync tomorrow at 3:00 PM',
        sender: 'Sarah Jenkins <sarah.j@vertexcloud.io>',
        proposedTime: 'Tomorrow at 3:00 PM'
      }
    });
  }

  if (lower.includes('calendar') || lower.includes('schedule') || lower.includes('meeting')) {
    steps.push({
      id: `step-${steps.length + 1}`,
      name: hasConflictScenario ? 'Conflict Detected → Autonomous Slot Recalculation' : 'Inspect Google Calendar Availability',
      tool: 'calendar.findFreeSlots',
      action: hasConflictScenario 
        ? 'Slot 3:00 PM occupied. Autonomous re-planning: finding nearest open buffer (4:00 PM)'
        : 'Querying Google Calendar free/busy slots for tomorrow',
      targetApp: 'Google Calendar',
      icon: 'calendar',
      status: 'pending',
      isRecovered: hasConflictScenario,
      mockResult: {
        selectedSlot: hasConflictScenario ? 'Tomorrow at 4:00 PM - 4:45 PM' : 'Tomorrow at 3:00 PM - 3:45 PM',
        conflictResolved: hasConflictScenario
      }
    });

    steps.push({
      id: `step-${steps.length + 1}`,
      name: 'Create Google Calendar Event',
      tool: 'calendar.createEvent',
      action: hasConflictScenario 
        ? 'Booking rescheduled meeting at 4:00 PM with Sarah Jenkins' 
        : 'Booking: "Quarterly Strategy Review with Sarah Jenkins" at 3:00 PM',
      targetApp: 'Google Calendar',
      icon: 'calendar-plus',
      status: 'pending',
      mockResult: {
        eventId: 'cal-event-9842',
        htmlLink: 'https://calendar.google.com/event?eid=9842',
        status: 'confirmed'
      }
    });
  }

  if (lower.includes('task') || lower.includes('preparation') || lower.includes('two days before')) {
    steps.push({
      id: `step-${steps.length + 1}`,
      name: 'Calculate Due Date & Create Google Task',
      tool: 'tasks.createTask',
      action: 'Generating preparation task: "Prep Strategy Review & finalize Q4 roadmap" (due 2 days before)',
      targetApp: 'Google Tasks',
      icon: 'check-square',
      status: 'pending',
      mockResult: {
        taskId: 'gtask-7712',
        title: 'Prep Strategy Review & finalize Q4 roadmap',
        category: 'Work',
        priority: 'High',
        dueDate: '29 Feb 2026'
      }
    });
  }

  // Human-in-the-loop step before external communication
  if (lower.includes('draft') || lower.includes('team') || lower.includes('email') || lower.includes('send')) {
    steps.push({
      id: `step-${steps.length + 1}`,
      name: 'Human-in-the-Loop Safety Check',
      tool: 'hitl.requireConfirmation',
      action: 'Sensitive action: User verification required before creating team draft',
      targetApp: 'HITL Guard',
      icon: 'shield-alert',
      isSensitive: true,
      status: 'pending',
      mockResult: {
        recipient: 'engineering-team@dailyecho.ai',
        subject: 'Scheduled: Quarterly Strategy Review & Prep Tasks'
      }
    });

    steps.push({
      id: `step-${steps.length + 1}`,
      name: 'Create Draft in Gmail',
      tool: 'gmail.createDraft',
      action: 'Inserting structured draft with agenda and linked Google Calendar invite',
      targetApp: 'Gmail',
      icon: 'mail-plus',
      status: 'pending',
      mockResult: {
        draftId: 'draft-9033',
        status: 'draft_created'
      }
    });
  }

  // Final verification assertion
  steps.push({
    id: `step-${steps.length + 1}`,
    name: 'Multi-App Verification & Proof Generation',
    tool: 'agent.verifyExecutionState',
    action: 'Verifying atomic state across Gmail, Calendar & Tasks. Generating cryptographically signed audit proof.',
    targetApp: 'Verification Engine',
    icon: 'check-check',
    status: 'pending',
    mockResult: {
      verified: true,
      auditHash: `GSUITE-AUDIT-${Math.floor(100000 + Math.random() * 900000)}`,
      consistencyCheck: 'PASSED'
    }
  });

  return steps;
}
