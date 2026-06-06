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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { name, industry, churnProbability, description, riskiestFactor } = req.body;
  if (!name || !industry) {
    res.status(400).json({ error: 'Missing required request body fields.' });
    return;
  }

  const fallbackPlan = `### Executive Action Plan for ${name}\n\n` +
    `**Goal:** Subside the ${churnProbability}% Churn Probability.  \n` +
    `**Key Threat:** Elevated Risk due to **${riskiestFactor || 'Platform Engagement Slip'}**.  \n\n` +
    `#### Phase 1: Immediate Outreach (0-7 Days)\n` +
    `- **Executive Sponsorship Bridge:** Deploy the CSM Lead to broker a diagnostic conference with ${name}'s VP of Engineering.\n` +
    `- **SLA Restoration Credit:** Deliver a 15% discount waiver for the next billing cycle as a mitigation of current service slip.\n\n` +
    `#### Phase 2: Engagement Recovery (8-30 Days)\n` +
    `- **Dedicated Remediation Workshop:** Sponsor a hands-on technical workshop for administrators. Focus on high-throughput ledger features to raise core integration value.\n` +
    `- **Weekly Metric Tracking:** Establish automated telemetry logging to send a health snapshot summary directly to key decision makers.`;

  if (!ai) {
    res.status(200).json({ plan: fallbackPlan });
    return;
  }

  try {
    const prompt = `
      You are the RetainAI Predictive Intelligence engine. Generate a highly professional, enterprise-grade, bulleted Action Plan/Playbook to mitigate a high churn risk for a B2B SaaS customer.
      
      CUSTOMER METRICS:
      - Company Name: ${name}
      - Industry: ${industry}
      - Churn Probability: ${churnProbability}%
      - Description: ${description}
      - Most Critical Risk Factor: ${riskiestFactor || 'Urgent SLA slip or adoption drop'}

      Format the response in elegant, readable Markdown with clear sections:
      - **Diagnostic Summary** (Brief analysis of the risk)
      - **Immediate Action Plan (Days 1-7)** (Direct, concrete steps with job owners)
      - **Medium Term Remediation (Days 8-30)** (Product adoption and integration stabilization steps)
      
      Keep the tone formal, highly authoritative, predictive, and action-oriented. Use strong, objective words without conversational fluff.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are the leading AI risk-arbitrage and revenue intelligence officer inside a high-end enterprise command center.',
        temperature: 0.2,
      },
    });

    res.status(200).json({ plan: response.text });
  } catch (error: any) {
    console.error('Gemini API Error in generate-action-plan:', error);
    res.status(500).json({ error: 'Failed to query Gemini model.', detail: error.message });
  }
}
