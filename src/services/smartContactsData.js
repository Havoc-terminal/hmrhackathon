// Smart Contacts Database & Intelligent Task Matching Engine for DailyEcho
// Connects tasks from "Add new Task" to the most qualified person with 1-click collaboration

export const initialSmartContacts = [
  {
    id: 'contact-sarah',
    name: 'Sarah Jenkins',
    role: 'Head of Product & Enterprise Bids',
    company: 'VertexCloud',
    email: 'sarah.j@vertexcloud.io',
    phone: '+1 (512) 890-4421',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
    primaryCategory: 'Work',
    expertise: ['Proposal Writing', 'Roadmaps', 'Budgeting & Staffing', 'Product Strategy'],
    keywords: ['proposal', 'budget', 'staffing', 'roadmap', 'product', 'strategy', 'q4', 'review', 'pitch', 'okrs', 'bids', 'deck', 'executive', 'presentation', 'report'],
    bio: 'Leads executive product strategy and cross-functional enterprise bids. Specializes in budgeting, staffing plans, and client deliverables.'
  },
  {
    id: 'contact-alex',
    name: 'Alex Rivera',
    role: 'Client Solutions & Onboarding Director',
    company: 'TechCorp Enterprise',
    email: 'alex.rivera@techcorp.com',
    phone: '+1 (512) 431-8902',
    status: 'In Meeting',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    primaryCategory: 'Work',
    expertise: ['Client Onboarding', 'Stakeholder Syncs', 'Deliverables Checklist', 'Enterprise SLA'],
    keywords: ['client', 'onboarding', 'kickoff', 'deliverable', 'presentation', 'deck', 'stakeholder', 'demo', 'checklist', 'sync', 'meeting', 'customer'],
    bio: 'Coordinates client kickoffs, onboarding pipelines, and enterprise stakeholder presentations across Google Workspace.'
  },
  {
    id: 'contact-elena',
    name: 'Elena Rostova',
    role: 'Lead Product Designer & UX Architect',
    company: 'Studio Nova',
    email: 'elena.r@novastudio.design',
    phone: '+1 (415) 892-1140',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
    primaryCategory: 'Work',
    expertise: ['UI/UX Design', 'Design Systems 3.0', 'Figma Prototyping', 'Accessibility'],
    keywords: ['design', 'ux', 'ui', 'figma', 'walkthrough', 'typography', 'contrast', 'mockup', 'frontend', 'prototype', 'website', 'layout', 'visual', 'styles', 'redesign'],
    bio: 'Designs high-fidelity design systems, interactive prototypes, and modern split-screen cockpit layouts.'
  },
  {
    id: 'contact-marcus-chen',
    name: 'Marcus Chen',
    role: 'VP of Distributed Systems & Infra',
    company: 'Apex Distributed',
    email: 'marcus.chen@apexdistributed.io',
    phone: '+1 (650) 412-9981',
    status: 'Focus Mode',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
    primaryCategory: 'Work',
    expertise: ['API Latency Optimization', 'Edge Caching', 'Agent Orchestration', 'Security'],
    keywords: ['api', 'latency', 'caching', 'server', 'database', 'cloud', 'architecture', 'engineering', 'backend', 'performance', 'infra', 'devops', 'scale', 'security', 'code', 'bug', 'deploy'],
    bio: 'Architects low-latency edge deployment pipelines and multi-app API synchronization for autonomous AI agents.'
  },
  {
    id: 'contact-maya',
    name: 'Dr. Maya Lin',
    role: 'Staff AI Scientist & LLM Architect',
    company: 'Cognitive Labs',
    email: 'maya.lin@cognitivelabs.ai',
    phone: '+1 (415) 309-8874',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces',
    primaryCategory: 'Work',
    expertise: ['Prompt Pipelines', 'PyTorch & Fine-Tuning', 'Agent Reasoning', 'RAG Architecture'],
    keywords: ['ai', 'ml', 'model', 'prompt', 'llm', 'agent', 'gpt', 'nlp', 'machine learning', 'dataset', 'algorithm', 'vision', 'vector', 'neural'],
    bio: 'Researches state-of-the-art transformer architectures, prompt orchestration, and autonomous multi-agent task execution.'
  },
  {
    id: 'contact-jonas',
    name: 'Jonas Coach',
    role: 'High Performance Athletic Trainer',
    company: 'Coach Athletics',
    email: 'jonas@coachathletics.dk',
    phone: '+45 28 91 00 23',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces',
    primaryCategory: 'Health',
    expertise: ['Strength Training', 'Leg Day & Cardio', 'Recovery Protocols', 'Nutrition Plans'],
    keywords: ['gym', 'workout', 'cardio', 'fitness', 'leg day', 'training', 'health', 'athletics', 'cold plunge', 'sauna', 'exercise', 'run', 'lifting', 'muscle', 'diet'],
    bio: 'Coordinates customized physical conditioning, daily gym workouts, cardio endurance, and recovery protocols.'
  },
  {
    id: 'contact-vance',
    name: 'Marcus Vance',
    role: 'Director of Corporate Finance & Bursary',
    company: 'Vance Advisory Group',
    email: 'vance@vanceadvisory.com',
    phone: '+1 (415) 672-1190',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
    primaryCategory: 'Finance',
    expertise: ['Tuition & Fee Processing', 'Budget Audits', 'Corporate Billing', 'Tax Invoices'],
    keywords: ['tuition', 'payment', 'fee', 'receipt', 'invoice', 'finance', 'accounting', 'taxes', 'bank', 'semester', 'audit', 'billing', 'expenses', 'bursar', 'money', 'transfer'],
    bio: 'Oversees semester tuition settlements, corporate billing reconciliations, and tax compliance audits.'
  },
  {
    id: 'contact-sophia',
    name: 'Dr. Sophia Reed',
    role: 'Lead Dental & Wellness Consultant',
    company: 'Metro Wellness Health',
    email: 'dr.reed@metrowellness.org',
    phone: '+1 (512) 330-8812',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=faces',
    primaryCategory: 'Health',
    expertise: ['Dental Appointments', 'Preventative Care', 'Clinical Schedules', 'Annual Checkups'],
    keywords: ['dentist', 'dental', 'clinic', 'appointment', 'cleaning', 'checkup', 'doctor', 'teeth', 'medical', 'health', 'physician', 'hospital', 'check-up', 'oral'],
    bio: 'Manages clinical preventative care, routine dental checkups, and priority health consultations.'
  },
  {
    id: 'contact-david',
    name: 'David Miller',
    role: 'Fleet Logistics & Service Manager',
    company: 'Apex Auto Services',
    email: 'david.m@apexautoservice.com',
    phone: '+1 (512) 991-3401',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces',
    primaryCategory: 'Personal',
    expertise: ['Vehicle Maintenance', 'Oil & Tire Rotation', 'Dealer Coordination', 'Diagnostics'],
    keywords: ['car', 'maintenance', 'service', 'oil change', 'tire', 'vehicle', 'dealer', 'repair', 'auto', 'inspection', 'brake', 'mechanic', 'transmission', 'automotive'],
    bio: 'Coordinates regular automotive maintenance schedules, dealer warranty servicing, and vehicle inspections.'
  },
  {
    id: 'contact-rachel',
    name: 'Rachel Zhang',
    role: 'Chief Legal Counsel & Compliance Officer',
    company: 'Horizon Legal Advisory',
    email: 'rachel.z@horizonlegal.com',
    phone: '+1 (415) 980-5512',
    status: 'In Meeting',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces',
    primaryCategory: 'Work',
    expertise: ['SaaS Contracts', 'GDPR & Privacy Audits', 'Vendor NDAs', 'Intellectual Property'],
    keywords: ['legal', 'contract', 'compliance', 'gdpr', 'privacy', 'nda', 'terms', 'policy', 'license', 'law', 'attorney', 'agreement', 'regulation'],
    bio: 'Advises on enterprise software agreements, privacy framework compliance, and third-party vendor contracts.'
  }
];

/**
 * Intelligent ML Relevance Matcher:
 * Computes semantic relevance between a task and a contact based on expertise,
 * title, category, and historical domain keywords.
 */
export function scoreContactForTask(contact, task) {
  if (!task || !contact) return { score: 50, isRelevant: false, matchedReason: 'General Contact' };

  const taskTitle = (task.title || '').toLowerCase();
  const taskDesc = (task.description || '').toLowerCase();
  const taskCat = (task.category || '').toLowerCase();
  const taskText = `${taskTitle} ${taskDesc} ${taskCat}`;

  let score = 0;
  const matchedKeywords = [];

  // 1. Direct expertise tag matching (Highest weight)
  contact.expertise.forEach(exp => {
    const expLower = exp.toLowerCase();
    const words = expLower.split(/\s+/);
    let matchedTag = false;
    words.forEach(w => {
      const cleanW = w.replace(/[^\w]/g, '');
      if (cleanW.length >= 4 && taskText.includes(cleanW)) {
        score += 35;
        matchedTag = true;
      }
    });
    if (matchedTag) {
      matchedKeywords.push(exp);
    }
  });

  // 2. Domain keywords matching
  contact.keywords.forEach(kw => {
    const kwLower = kw.toLowerCase();
    if (taskText.includes(kwLower)) {
      score += 25;
      matchedKeywords.push(kw);
    }
  });

  // 3. Category match
  if (contact.primaryCategory && taskCat && contact.primaryCategory.toLowerCase() === taskCat) {
    score += 15;
  }

  // 4. Role title words matching
  const roleWords = contact.role.toLowerCase().split(/\s+/);
  roleWords.forEach(w => {
    const cleanW = w.replace(/[^\w]/g, '');
    if (cleanW.length >= 4 && taskText.includes(cleanW)) {
      score += 20;
    }
  });

  if (score > 0) {
    // Calibrate confidence score between 75% and 99%
    const normalizedScore = Math.min(99, Math.max(76, Math.round(55 + score * 0.45)));
    const uniqueKeywords = [...new Set(matchedKeywords)];
    return {
      score: normalizedScore,
      isRelevant: true,
      matchedReason: uniqueKeywords.length > 0 
        ? `Direct expertise in ${uniqueKeywords.slice(0, 2).join(' & ')}` 
        : `Role alignment: ${contact.role}`
    };
  }

  // Fallback baseline score
  return {
    score: 42,
    isRelevant: false,
    matchedReason: `Available for general ${contact.primaryCategory} collaboration`
  };
}

/**
 * Find the top recommended contact for a given task
 */
export function getTopContactForTask(task, contacts = initialSmartContacts) {
  if (!task) return null;

  const scored = contacts.map(c => ({
    contact: c,
    ...scoreContactForTask(c, task)
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}
