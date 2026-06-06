import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
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

// Initial high-fidelity customer data
const mockCustomers = [
  {
    id: "enterprise-corp",
    name: "Enterprise Corp",
    industry: "Logistics & Supply Chain",
    status: "HEALTHY",
    seats: 1200,
    clv: 428500,
    tenureMonths: 14,
    plan: "PREMIUM",
    planPeriod: "ANNUAL",
    churnProbability: 28,
    lastMonthChurnProbability: 32,
    description: "Global logistics leader specializing in last-mile delivery automation. Currently in the expansion phase of their lifecycle.",
    riskFactors: [
      { name: "Support Ticket Volume", impact: 65, type: "RISK", detail: "Support ticket volume in the last 30 days is elevated. Resolution times exceed SLA by 4.2 hours." },
      { name: "Feature Adoption (Core)", impact: 50, type: "RETENTION", detail: "Active use of the Automation Engine is a strong retention signal. 85% of power users log in daily." }
    ],
    engagementTrends: {
      usage: [60, 45, 80, 70, 90, 55, 40, 75, 65, 85],
      adoption: [30, 25, 40, 35, 50, 42, 38, 48, 52, 60]
    },
    recommendedPlaybooks: [
      { id: "playbook-1", name: "CSM Executive Review", description: "Schedule an urgent alignment with VP of Operations to address ticket SLA slip.", urgency: "HIGH", actionLabel: "INITIATE ACTION", status: "PENDING" },
      { id: "playbook-2", name: "User Feature Workshop", description: "Target key managers with a custom deep-dive on new predictive modules.", urgency: "MEDIUM", actionLabel: "ENROLL USERS", status: "PENDING" }
    ]
  },
  {
    id: "acme-software",
    name: "Acme Tech",
    industry: "Enterprise Software",
    status: "AT_RISK",
    seats: 500,
    clv: 180000,
    tenureMonths: 8,
    plan: "STANDARD",
    planPeriod: "MONTHLY",
    churnProbability: 64,
    lastMonthChurnProbability: 52,
    description: "Cloud-native infrastructure player scaling rapid developer tools. Facing high employee churn in engineering department.",
    riskFactors: [
      { name: "Executive Sponsor Churn", impact: 85, type: "RISK", detail: "Primary champion left the company 2 weeks ago. No new pilot assigned yet." },
      { name: "SLA Resolution Delay", impact: 40, type: "RISK", detail: "API outage tickets took over 18 hours to solve, breaching contracts." }
    ],
    engagementTrends: {
      usage: [85, 80, 75, 60, 50, 48, 42, 35, 28, 22],
      adoption: [60, 55, 52, 45, 38, 30, 24, 20, 15, 12]
    },
    recommendedPlaybooks: [
      { id: "playbook-acme-1", name: "Executive Re-contracting", description: "Broker an executive sponsor meeting with the newly appointed VP of Engineering.", urgency: "HIGH", actionLabel: "SCHEDULE CALL", status: "PENDING" },
      { id: "playbook-acme-2", name: "Value Realization Audit", description: "Generate a custom engagement report demonstrating dollar value saved.", urgency: "HIGH", actionLabel: "GENERATE REPORT", status: "PENDING" }
    ]
  },
  {
    id: "global-retail",
    name: "Global Retail",
    industry: "E-Commerce & Retail",
    status: "CRITICAL",
    seats: 2400,
    clv: 860000,
    tenureMonths: 36,
    plan: "ENTERPRISE",
    planPeriod: "ANNUAL",
    churnProbability: 82,
    lastMonthChurnProbability: 70,
    description: "Multinational retail giant undergoing digital migration. Experiencing dramatic drop-off in active seat usage.",
    riskFactors: [
      { name: "License Idle Rate", impact: 90, type: "RISK", detail: "Over 70% of purchased workspace licenses have been inactive for more than 45 days." },
      { name: "Platform Outages", impact: 70, type: "RISK", detail: "Severe holiday database outages cost the customer critical sales volume." }
    ],
    engagementTrends: {
      usage: [95, 90, 85, 75, 55, 40, 30, 20, 15, 8],
      adoption: [80, 75, 65, 55, 35, 25, 18, 12, 10, 5]
    },
    recommendedPlaybooks: [
      { id: "playbook-retail-1", name: "Seat Activation Program", description: "Initiate emergency automated user onboarding to push idle employees into the platform.", urgency: "HIGH", actionLabel: "TRIGGER DRIP", status: "PENDING" },
      { id: "playbook-retail-2", name: "SLA Outage Rebate Offer", description: "Propose a formal SLA discount contract credit to restore goodwill with accounts team.", urgency: "HIGH", actionLabel: "DRAFT REBATE", status: "PENDING" }
    ]
  },
  {
    id: "fintech-hub",
    name: "FinTech Hub",
    industry: "Financial Services",
    status: "HEALTHY",
    seats: 350,
    clv: 150000,
    tenureMonths: 5,
    plan: "STANDARD",
    planPeriod: "MONTHLY",
    churnProbability: 15,
    lastMonthChurnProbability: 14,
    description: "High-compliance banking ledger system. Exceptionally high day-1 user retention and zero technical support incidents.",
    riskFactors: [
      { name: "Core Ledger Sync", impact: 95, type: "RETENTION", detail: "Integration into local banking core databases is fully complete and operational." },
      { name: "CSAT Score", impact: 90, type: "RETENTION", detail: "Last weeks automated Net Promoter poll scored a flawless 10/10." }
    ],
    engagementTrends: {
      usage: [40, 55, 65, 75, 80, 85, 88, 92, 95, 96],
      adoption: [20, 35, 45, 55, 65, 70, 78, 82, 85, 87]
    },
    recommendedPlaybooks: [
      { id: "playbook-fintech-1", name: "Expansion Upsell pitch", description: "Deliver Premium plan features slide deck to key decision makers.", urgency: "LOW", actionLabel: "SHARE SLIDES", status: "PENDING" },
      { id: "playbook-fintech-2", name: "Advocate Program Invite", description: "Invite core stakeholders into the exclusive annual advisory roundtable.", urgency: "LOW", actionLabel: "INVITE", status: "PENDING" }
    ]
  },
  {
    id: "healthcare-ltd",
    name: "HealthCare Ltd",
    industry: "Healthcare & Biotech",
    status: "AT_RISK",
    seats: 800,
    clv: 320,
    tenureMonths: 22,
    plan: "PREMIUM",
    planPeriod: "ANNUAL",
    churnProbability: 58,
    lastMonthChurnProbability: 46,
    description: "State hospital database client. Strictly bound by HIPAA regulations but suffering slow load-times prompting compliance friction.",
    riskFactors: [
      { name: "Platform Load Latency", impact: 75, type: "RISK", detail: "HIPAA audit logs require over 9 seconds to generate, provoking medical staff complaints." },
      { name: "Product Utilization", impact: 50, type: "RETENTION", detail: "Daily charting module shows stable utilization despite logging speeds." }
    ],
    engagementTrends: {
      usage: [75, 76, 78, 74, 70, 65, 62, 58, 55, 54],
      adoption: [60, 58, 57, 55, 50, 48, 45, 42, 40, 38]
    },
    recommendedPlaybooks: [
      { id: "playbook-health-1", name: "Infrastructure Audit Engagement", description: "Deploy database architect to migrate patient audit streams onto flash hosts.", urgency: "HIGH", actionLabel: "DEPLOY DEV", status: "PENDING" },
      { id: "playbook-health-2", name: "Regulatory Safe Training", description: "Host a training seminar on high-speed compliance filing rules.", urgency: "MEDIUM", actionLabel: "SCHEDULE WORKSHOP", status: "PENDING" }
    ]
  }
];

// Helper formula to compute simulation scores
function calculateSimulation(inputs: any) {
  const ticketsWeight = 1.3;
  const declineWeight = 0.95;
  const hoursWeight = 2.8;
  const adoptionWeight = -0.55;
  const seatsWeight = -0.012;

  // Base random/constant risk
  let calculatedRisk = 30;

  calculatedRisk += (inputs.supportTickets * ticketsWeight);
  calculatedRisk += (inputs.platformDeclineRate * declineWeight);
  calculatedRisk += (inputs.slaResponseHours * hoursWeight);
  calculatedRisk += (inputs.engagementAdoption * adoptionWeight);
  calculatedRisk += (inputs.seatsActive * seatsWeight);

  // Constraints
  calculatedRisk = Math.max(5, Math.min(99, Math.round(calculatedRisk)));

  const healthScore = Math.max(1, Math.min(100, Math.round(100 - calculatedRisk * 0.9)));
  
  // Calculate average seat count cost $150/mo to estimate revenue risk
  const revenueAtRisk = Math.round(inputs.seatsActive * 12 * 150 * (calculatedRisk / 100));

  return {
    churnProbability: calculatedRisk,
    healthScore,
    revenueAtRisk
  };
}

// REST API Endpoints
app.get("/api/customers", (req, res) => {
  res.json(mockCustomers);
});

// Endpoint: Generate Custom Action Plan using Gemini
app.post("/api/generate-action-plan", async (req, res) => {
  const { name, industry, churnProbability, description, riskiestFactor } = req.body;

  if (!ai) {
    // Elegant fallback if no key is present (returns valid JSON conforming to design)
    return res.json({
      plan: `### Executive Action Plan for ${name}\n\n` +
            `**Goal:** Subside the ${churnProbability}% Churn Probability.  \n` +
            `**Key Threat:** Elevated Risk due to **${riskiestFactor || "Platform Engagement Slip"}**.  \n\n` +
            `#### Phase 1: Immediate Outreach (0-7 Days)\n` +
            `- **Executive Sponsorship Bridge:** Deploy the CSM Lead to broker a diagnostic conference with ${name}'s VP of Engineering.\n` +
            `- **SLA Restoration Credit:** Deliver a 15% discount waiver for the next billing cycle as a mitigation of current service slip.\n\n` +
            `#### Phase 2: Engagement Recovery (8-30 Days)\n` +
            `- **Dedicated Remediation Workshop:** Sponsor a hands-on technical workshop for administrators. Focus on high-throughput ledger features to raise core integration value.\n` +
            `- **Weekly Metric Tracking:** Establish automated telemetry logging to send a health snapshot summary directly to key decision makers.`
    });
  }

  try {
    const prompt = `
      You are the RetainAI Predictive Intelligence engine. Generate a highly professional, enterprise-grade, bulleted Action Plan/Playbook to mitigate a high churn risk for a B2B SaaS customer.
      
      CUSTOMER METRICS:
      - Company Name: ${name}
      - Industry: ${industry}
      - Churn Probability: ${churnProbability}%
      - Description: ${description}
      - Most Critical Risk Factor: ${riskiestFactor || "Urgent SLA slip or adoption drop"}

      Format the response in elegant, readable Markdown with clear sections:
      - **Diagnostic Summary** (Brief analysis of the risk)
      - **Immediate Action Plan (Days 1-7)** (Direct, concrete steps with job owners)
      - **Medium Term Remediation (Days 8-30)** (Product adoption and integration stabilization steps)
      
      Keep the tone formal, highly authoritative, predictive, and action-oriented. Use strong, objective words without conversational fluff.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the leading AI risk-arbitrage and revenue intelligence officer inside a high-end enterprise command center.",
        temperature: 0.2
      }
    });

    res.json({ plan: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in generate-action-plan:", error);
    res.status(500).json({ error: "Failed to query Gemini model.", detail: error.message });
  }
});

// Endpoint: Simulate Risk Analysis using dynamic algorithms + Gemini narrative
app.post("/api/simulate-analysis", async (req, res) => {
  const { customerName, supportTickets, seatsActive, engagementAdoption, slaResponseHours, platformDeclineRate } = req.body;

  // 1. Math computation
  const metrics = calculateSimulation({
    supportTickets,
    seatsActive,
    engagementAdoption,
    slaResponseHours,
    platformDeclineRate
  });

  if (!ai) {
    // Handcrafted logical fallback narrative matching the simulation inputs
    let alertDescription = "Stable overall operations.";
    if (metrics.churnProbability > 70) {
      alertDescription = `Urgent alert: We've identified a severe threat spike in this profile. Highly elevated support issues (${supportTickets}/mo) combined with long SLA responses (${slaResponseHours}h) pose an immediate exit hazard. Action advised.`;
    } else if (metrics.churnProbability > 40) {
      alertDescription = `Moderate alert: Gradual indicators of platform fatigue are appearing. The decline rate is currently at ${platformDeclineRate}%. Active efforts should align to secure key product channels.`;
    } else {
      alertDescription = `Healthy account profile. High engagement adoption (${engagementAdoption}%) paired with crisp service SLAs maintains an optimal retention anchor. Revenue of $${metrics.revenueAtRisk.toLocaleString()} remains secure.`;
    }

    return res.json({
      ...metrics,
      insights: alertDescription,
      playbooks: [
        {
          name: metrics.churnProbability > 50 ? "Urgent Executive Alignment" : "Adoption Health Check",
          description: metrics.churnProbability > 50 
            ? "Initiate an emergency VP alignment meeting to solve the escalated SLA friction."
            : "Deliver feature expansion release files to administrators to raise platform value.",
          urgency: metrics.churnProbability > 65 ? "HIGH" : "MEDIUM",
          actionLabel: "TRIGGER PLAYBOOK"
        },
        {
          name: "SLA Optimization Schedule",
          description: `Optimize local queue rules to safely decrease SLA response times below 4 hours.`,
          urgency: "MEDIUM",
          actionLabel: "OPTIMIZE"
        }
      ]
    });
  }

  try {
    const prompt = `
      You are the RetainAI risk evaluation engine. Evaluate this customer simulation and provide:
      1. A short, high-fidelity Executive Insight statement (2-3 sentences) detailing the risk.
      2. Exactly two action playbooks customized to this scenario.

      SIMULATION INPUTS:
      - Customer Profile: ${customerName || "Standard Segment"}
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
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an automated risk modeling agent that outputs responses strictly mirroring requested JSON formats. Do not include markdown tags like ```json or any other leading or trailing characters.",
        responseMimeType: "application/json"
      }
    });

    let aiOutput;
    try {
      const sanitizedText = response.text.trim();
      aiOutput = JSON.parse(sanitizedText);
    } catch (parseError) {
      console.warn("JSON parsing failed, fallback used. Text was:", response.text);
      aiOutput = {
        insights: `Severe parameters detected. Dynamic analysis registers ${metrics.churnProbability}% risk due to platform friction.`,
        playbooks: [
          { name: "SLA Response Optimization", description: "Expedite queue processing rules to improve support ticket response times.", urgency: "HIGH", actionLabel: "OPTIMIZE QUEUE" },
          { name: "CSM Proactive Engagement", description: "Commit resources to resolve operational bottlenecks directly.", urgency: "MEDIUM", actionLabel: "ENGAGE ACCOUNT" }
        ]
      };
    }

    res.json({
      ...metrics,
      insights: aiOutput.insights,
      playbooks: aiOutput.playbooks
    });
  } catch (error: any) {
    console.error("Gemini API Error in simulate-analysis:", error);
    // Gracefully fallback to structured calculations
    res.json({
      ...metrics,
      insights: `Risk calculation completed: Churn is locked at ${metrics.churnProbability}%. Support Volume: ${supportTickets}. SLA latency is ${slaResponseHours}h.`,
      playbooks: [
        { name: "Manual Account Audit", description: "Review tickets manually to resolve SLA response complaints.", urgency: "HIGH", actionLabel: "AUDIT TICKETS" },
        { name: "Proactive CSM outreach", description: "Connect with system administrators to target friction points.", urgency: "MEDIUM", actionLabel: "ENGAGE USER" }
      ]
    });
  }
});

// Serve frontend in production or setup Vite dev server in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
