import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

function calculateSimulation(inputs: any) {
  const ticketsWeight = 1.3;
  const declineWeight = 0.95;
  const hoursWeight = 2.8;
  const adoptionWeight = -0.55;
  const seatsWeight = -0.012;

  let calculatedRisk = 30;
  calculatedRisk += (inputs.supportTickets * ticketsWeight);
  calculatedRisk += (inputs.platformDeclineRate * declineWeight);
  calculatedRisk += (inputs.slaResponseHours * hoursWeight);
  calculatedRisk += (inputs.engagementAdoption * adoptionWeight);
  calculatedRisk += (inputs.seatsActive * seatsWeight);

  calculatedRisk = Math.max(5, Math.min(99, Math.round(calculatedRisk)));
  const healthScore = Math.max(1, Math.min(100, Math.round(100 - calculatedRisk * 0.9)));
  const revenueAtRisk = Math.round(inputs.seatsActive * 12 * 150 * (calculatedRisk / 100));

  return {
    churnProbability: calculatedRisk,
    healthScore,
    revenueAtRisk,
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const {
    customerName,
    supportTickets,
    seatsActive,
    engagementAdoption,
    slaResponseHours,
    platformDeclineRate,
  } = req.body;

  const metrics = calculateSimulation({
    supportTickets,
    seatsActive,
    engagementAdoption,
    slaResponseHours,
    platformDeclineRate,
  });

  if (!ai) {
    let alertDescription = 'Stable overall operations.';
    if (metrics.churnProbability > 70) {
      alertDescription = `Urgent alert: We've identified a severe threat spike in this profile. Highly elevated support issues (${supportTickets}/mo) combined with long SLA responses (${slaResponseHours}h) pose an immediate exit hazard. Action advised.`;
    } else if (metrics.churnProbability > 40) {
      alertDescription = `Moderate alert: Gradual indicators of platform fatigue are appearing. The decline rate is currently at ${platformDeclineRate}%. Active efforts should align to secure key product channels.`;
    } else {
      alertDescription = `Healthy account profile. High engagement adoption (${engagementAdoption}%) paired with crisp service SLAs maintains an optimal retention anchor. Revenue of $${metrics.revenueAtRisk.toLocaleString()} remains secure.`;
    }

    res.status(200).json({
      ...metrics,
      insights: alertDescription,
      playbooks: [
        {
          name: metrics.churnProbability > 50 ? 'Urgent Executive Alignment' : 'Adoption Health Check',
          description: metrics.churnProbability > 50
            ? 'Initiate an emergency VP alignment meeting to solve the escalated SLA friction.'
            : 'Deliver feature expansion release files to administrators to raise platform value.',
          urgency: metrics.churnProbability > 65 ? 'HIGH' : 'MEDIUM',
          actionLabel: 'TRIGGER PLAYBOOK',
        },
        {
          name: 'SLA Optimization Schedule',
          description: 'Optimize local queue rules to safely decrease SLA response times below 4 hours.',
          urgency: 'MEDIUM',
          actionLabel: 'OPTIMIZE',
        },
      ],
    });
    return;
  }

  try {
    const prompt = `
      You are the RetainAI risk evaluation engine. Evaluate this customer simulation and provide:
      1. A short, high-fidelity Executive Insight statement (2-3 sentences) detailing the risk.
      2. Exactly two action playbooks customized to this scenario.

      SIMULATION INPUTS:
      - Customer Profile: ${customerName || 'Standard Segment'}
      - Projected Churn Probability: ${metrics.churnProbability}%
      - Current Health Score: ${metrics.healthScore}/100
      - Projected Revenue At Risk: $${metrics.revenueAtRisk.toLocaleString()}
      - Parameters adjusted: Support Tickets (${supportTickets}/mo), Seats active (${seatsActive}), Feature Adoption (${engagementAdoption}%), SLA Response Time (${slaResponseHours} hours), Platform Decline Rate (${platformDeclineRate}%).

      Your output must be structured exactly in this JSON format:
      {
        "insights": "Your narrative statement here",
        "playbooks": [
          {
            "name": "Playbook 1 Title",
            "description": "Playbook 1 details focused on resolving the critical pain points",
            "urgency": "HIGH" | "MEDIUM" | "LOW",
            "actionLabel": "Playbook Button CTA (e.g., SCHEDULE AUDIT, INITIATE outreach)"
          },
          {
            "name": "Playbook 2 Title",
            "description": "Playbook 2 details focusing on proactive adoption or SLA repair",
            "urgency": "HIGH" | "MEDIUM" | "LOW",
            "actionLabel": "Playbook Button CTA"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an automated risk modeling agent that outputs responses strictly mirroring requested JSON formats. Do not include markdown tags like ```json or any other leading or trailing characters.',
        responseMimeType: 'application/json',
      },
    });

    let aiOutput;
    try {
      aiOutput = JSON.parse(response.text.trim());
    } catch (parseError) {
      console.warn('JSON parsing failed, fallback used. Text was:', response.text);
      aiOutput = {
        insights: `Severe parameters detected. Dynamic analysis registers ${metrics.churnProbability}% risk due to platform friction.`,
        playbooks: [
          { name: 'SLA Response Optimization', description: 'Expedite queue processing rules to improve support ticket response times.', urgency: 'HIGH', actionLabel: 'OPTIMIZE QUEUE' },
          { name: 'CSM Proactive Engagement', description: 'Commit resources to resolve operational bottlenecks directly.', urgency: 'MEDIUM', actionLabel: 'ENGAGE ACCOUNT' },
        ],
      };
    }

    res.status(200).json({
      ...metrics,
      insights: aiOutput.insights,
      playbooks: aiOutput.playbooks,
    });
  } catch (error: any) {
    console.error('Gemini API Error in simulate-analysis:', error);
    res.status(500).json({
      ...metrics,
      insights: `Risk calculation completed: Churn is locked at ${metrics.churnProbability}%. Support Volume: ${supportTickets}. SLA latency is ${slaResponseHours}h.`,
      playbooks: [
        { name: 'Manual Account Audit', description: 'Review tickets manually to resolve SLA response complaints.', urgency: 'HIGH', actionLabel: 'AUDIT TICKETS' },
        { name: 'Proactive CSM outreach', description: 'Connect with system administrators to target friction points.', urgency: 'MEDIUM', actionLabel: 'ENGAGE USER' },
      ],
    });
  }
}
