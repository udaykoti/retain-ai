export interface Customer {
  id: string;
  name: string;
  industry: string;
  status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL';
  seats: number;
  clv: number;
  tenureMonths: number;
  plan: string;
  planPeriod: 'ANNUAL' | 'MONTHLY';
  churnProbability: number; // percentage (0 - 100)
  lastMonthChurnProbability?: number; // percentage (0 - 100)
  description: string;
  riskFactors: {
    name: string;
    impact: number; // relative impact percentage
    type: 'RISK' | 'RETENTION';
    detail: string;
  }[];
  engagementTrends: {
    usage: number[]; // usage bars for last 10 periods
    adoption: number[]; // adoption bars for last 10 periods
  };
  recommendedPlaybooks: Playbook[];
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  actionLabel: string;
  status: 'PENDING' | 'INITIATED' | 'COMPLETED';
}

export interface SimulationInput {
  customerId?: string;
  supportTickets: number; // monthly
  seatsActive: number;
  engagementAdoption: number; // 0 - 100
  slaResponseHours: number;
  platformDeclineRate: number; // 0 - 100
}

export interface SimulationResult {
  churnProbability: number;
  revenueAtRisk: number;
  healthScore: number;
  insights: string;
  playbooks: {
    name: string;
    description: string;
    urgency: 'HIGH' | 'MEDIUM' | 'LOW';
    actionLabel: string;
  }[];
}
