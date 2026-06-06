import type { Customer } from '../src/types';

export const mockCustomers: Customer[] = [
  {
    id: 'enterprise-corp',
    name: 'Enterprise Corp',
    industry: 'Logistics & Supply Chain',
    status: 'HEALTHY',
    seats: 1200,
    clv: 428500,
    tenureMonths: 14,
    plan: 'PREMIUM',
    planPeriod: 'ANNUAL',
    churnProbability: 28,
    lastMonthChurnProbability: 32,
    description: 'Global logistics leader specializing in last-mile delivery automation. Currently in the expansion phase of their lifecycle.',
    riskFactors: [
      { name: 'Support Ticket Volume', impact: 65, type: 'RISK', detail: 'Support ticket volume in the last 30 days is elevated. Resolution times exceed SLA by 4.2 hours.' },
      { name: 'Feature Adoption (Core)', impact: 50, type: 'RETENTION', detail: 'Active use of the Automation Engine is a strong retention signal. 85% of power users log in daily.' }
    ],
    engagementTrends: {
      usage: [60, 45, 80, 70, 90, 55, 40, 75, 65, 85],
      adoption: [30, 25, 40, 35, 50, 42, 38, 48, 52, 60]
    },
    recommendedPlaybooks: [
      { id: 'playbook-1', name: 'CSM Executive Review', description: 'Schedule an urgent alignment with VP of Operations to address ticket SLA slip.', urgency: 'HIGH', actionLabel: 'INITIATE ACTION', status: 'PENDING' },
      { id: 'playbook-2', name: 'User Feature Workshop', description: 'Target key managers with a custom deep-dive on new predictive modules.', urgency: 'MEDIUM', actionLabel: 'ENROLL USERS', status: 'PENDING' }
    ]
  },
  {
    id: 'acme-software',
    name: 'Acme Tech',
    industry: 'Enterprise Software',
    status: 'AT_RISK',
    seats: 500,
    clv: 180000,
    tenureMonths: 8,
    plan: 'STANDARD',
    planPeriod: 'MONTHLY',
    churnProbability: 64,
    lastMonthChurnProbability: 52,
    description: 'Cloud-native infrastructure player scaling rapid developer tools. Facing high employee churn in engineering department.',
    riskFactors: [
      { name: 'Executive Sponsor Churn', impact: 85, type: 'RISK', detail: 'Primary champion left the company 2 weeks ago. No new pilot assigned yet.' },
      { name: 'SLA Resolution Delay', impact: 40, type: 'RISK', detail: 'API outage tickets took over 18 hours to solve, breaching contracts.' }
    ],
    engagementTrends: {
      usage: [85, 80, 75, 60, 50, 48, 42, 35, 28, 22],
      adoption: [60, 55, 52, 45, 38, 30, 24, 20, 15, 12]
    },
    recommendedPlaybooks: [
      { id: 'playbook-acme-1', name: 'Executive Re-contracting', description: 'Broker an executive sponsor meeting with the newly appointed VP of Engineering.', urgency: 'HIGH', actionLabel: 'SCHEDULE CALL', status: 'PENDING' },
      { id: 'playbook-acme-2', name: 'Value Realization Audit', description: 'Generate a custom engagement report demonstrating dollar value saved.', urgency: 'HIGH', actionLabel: 'GENERATE REPORT', status: 'PENDING' }
    ]
  },
  {
    id: 'global-retail',
    name: 'Global Retail',
    industry: 'E-Commerce & Retail',
    status: 'CRITICAL',
    seats: 2400,
    clv: 860000,
    tenureMonths: 36,
    plan: 'ENTERPRISE',
    planPeriod: 'ANNUAL',
    churnProbability: 82,
    lastMonthChurnProbability: 70,
    description: 'Multinational retail giant undergoing digital migration. Experiencing dramatic drop-off in active seat usage.',
    riskFactors: [
      { name: 'License Idle Rate', impact: 90, type: 'RISK', detail: 'Over 70% of purchased workspace licenses have been inactive for more than 45 days.' },
      { name: 'Platform Outages', impact: 70, type: 'RISK', detail: 'Severe holiday database outages cost the customer critical sales volume.' }
    ],
    engagementTrends: {
      usage: [95, 90, 85, 75, 55, 40, 30, 20, 15, 8],
      adoption: [80, 75, 65, 55, 35, 25, 18, 12, 10, 5]
    },
    recommendedPlaybooks: [
      { id: 'playbook-retail-1', name: 'Seat Activation Program', description: 'Initiate emergency automated user onboarding to push idle employees into the platform.', urgency: 'HIGH', actionLabel: 'TRIGGER DRIP', status: 'PENDING' },
      { id: 'playbook-retail-2', name: 'SLA Outage Rebate Offer', description: 'Propose a formal SLA discount contract credit to restore goodwill with accounts team.', urgency: 'HIGH', actionLabel: 'DRAFT REBATE', status: 'PENDING' }
    ]
  },
  {
    id: 'fintech-hub',
    name: 'FinTech Hub',
    industry: 'Financial Services',
    status: 'HEALTHY',
    seats: 350,
    clv: 150000,
    tenureMonths: 5,
    plan: 'STANDARD',
    planPeriod: 'MONTHLY',
    churnProbability: 15,
    lastMonthChurnProbability: 14,
    description: 'High-compliance banking ledger system. Exceptionally high day-1 user retention and zero technical support incidents.',
    riskFactors: [
      { name: 'Core Ledger Sync', impact: 95, type: 'RETENTION', detail: 'Integration into local banking core databases is fully complete and operational.' },
      { name: 'CSAT Score', impact: 90, type: 'RETENTION', detail: 'Last weeks automated Net Promoter poll scored a flawless 10/10.' }
    ],
    engagementTrends: {
      usage: [40, 55, 65, 75, 80, 85, 88, 92, 95, 96],
      adoption: [20, 35, 45, 55, 65, 70, 78, 82, 85, 87]
    },
    recommendedPlaybooks: [
      { id: 'playbook-fintech-1', name: 'Expansion Upsell pitch', description: 'Deliver Premium plan features slide deck to key decision makers.', urgency: 'LOW', actionLabel: 'SHARE SLIDES', status: 'PENDING' },
      { id: 'playbook-fintech-2', name: 'Advocate Program Invite', description: 'Invite core stakeholders into the exclusive annual advisory roundtable.', urgency: 'LOW', actionLabel: 'INVITE', status: 'PENDING' }
    ]
  },
  {
    id: 'healthcare-ltd',
    name: 'HealthCare Ltd',
    industry: 'Healthcare & Biotech',
    status: 'AT_RISK',
    seats: 800,
    clv: 320,
    tenureMonths: 22,
    plan: 'PREMIUM',
    planPeriod: 'ANNUAL',
    churnProbability: 58,
    lastMonthChurnProbability: 46,
    description: 'State hospital database client. Strictly bound by HIPAA regulations but suffering slow load-times prompting compliance friction.',
    riskFactors: [
      { name: 'Platform Load Latency', impact: 75, type: 'RISK', detail: 'HIPAA audit logs require over 9 seconds to generate, provoking medical staff complaints.' },
      { name: 'Product Utilization', impact: 50, type: 'RETENTION', detail: 'Daily charting module shows stable utilization despite logging speeds.' }
    ],
    engagementTrends: {
      usage: [75, 76, 78, 74, 70, 65, 62, 58, 55, 54],
      adoption: [60, 58, 57, 55, 50, 48, 45, 42, 40, 38]
    },
    recommendedPlaybooks: [
      { id: 'playbook-health-1', name: 'Infrastructure Audit Engagement', description: 'Deploy database architect to migrate patient audit streams onto flash hosts.', urgency: 'HIGH', actionLabel: 'DEPLOY DEV', status: 'PENDING' },
      { id: 'playbook-health-2', name: 'Regulatory Safe Training', description: 'Host a training seminar on high-speed compliance filing rules.', urgency: 'MEDIUM', actionLabel: 'SCHEDULE WORKSHOP', status: 'PENDING' }
    ]
  }
];
