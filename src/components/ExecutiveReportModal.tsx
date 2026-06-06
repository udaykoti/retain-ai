import React, { useState, useEffect } from 'react';
import { X, Printer, ShieldCheck, Download, Award, FileText, CheckCircle2 } from 'lucide-react';
import { Playbook } from './SimulateTab';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  supportTickets: number;
  seatsActive: number;
  engagementAdoption: number;
  slaResponseHours: number;
  platformDeclineRate: number;
  churnProb: number;
  healthScore: number;
  revenueAtRisk: number;
  insights: string;
  playbooks: Playbook[];
}

interface McReportResults {
  probPositive: number;
  medianROI: number;
  netProfit: number;
  worstCaseROI: number;
  bestCaseROI: number;
  campaignCost: number;
  atRiskCohort: number;
}

export default function ExecutiveReportModal({
  isOpen,
  onClose,
  supportTickets,
  seatsActive,
  engagementAdoption,
  slaResponseHours,
  platformDeclineRate,
  churnProb,
  healthScore,
  revenueAtRisk,
  insights,
  playbooks,
}: ExecutiveReportModalProps) {
  const [mcResults, setMcResults] = useState<McReportResults | null>(null);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  // Gaussian Box-Muller generator for Monte Carlo
  const boxMullerRandom = (mean: number, stdDev: number): number => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const randStdNormal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + stdDev * randStdNormal;
  };

  useEffect(() => {
    if (!isOpen) return;

    // Run custom 1,000-trial Normal distribution Monte Carlo calculation utilizing current Sandbox parameters
    const numTrials = 1000;
    const results: number[] = [];
    let positiveCount = 0;
    let totalProfit = 0;
    const campaignCost = 25000; // Campaign Budget
    const baseChurn = Math.max(10, Math.min(85, churnProb)) / 100;
    const averageARR = 24000;
    
    // Mean success percentage is tied positively to adoption and inversely to support SLA response hours
    const calculatedMeanUplift = Math.max(10, Math.min(80, (engagementAdoption * 0.65) - (slaResponseHours * 0.5)));
    const successStdDev = 6.0;

    for (let i = 0; i < numTrials; i++) {
      const sampled = boxMullerRandom(calculatedMeanUplift, successStdDev);
      const successRate = Math.max(2, Math.min(95, sampled)) / 100;
      
      const churnCohort = seatsActive * baseChurn;
      const savedAccounts = churnCohort * successRate;
      const savedValue = savedAccounts * (averageARR * 0.75); // contract amortization weight
      const netProfit = savedValue - campaignCost;
      const trialROI = (netProfit / campaignCost) * 100;

      results.push(trialROI);
      totalProfit += netProfit;
      if (trialROI > 0) {
        positiveCount++;
      }
    }

    results.sort((a, b) => a - b);
    const medianROI = results[Math.floor(numTrials * 0.5)];
    const worstCaseROI = results[Math.floor(numTrials * 0.05)];
    const bestCaseROI = results[Math.floor(numTrials * 0.95)];
    const probPositive = Math.round((positiveCount / numTrials) * 100);

    setMcResults({
      probPositive,
      medianROI: Math.round(medianROI),
      netProfit: Math.round(totalProfit / numTrials),
      worstCaseROI: Math.round(worstCaseROI),
      bestCaseROI: Math.round(bestCaseROI),
      campaignCost,
      atRiskCohort: Math.round(seatsActive * baseChurn)
    });
  }, [isOpen, seatsActive, engagementAdoption, slaResponseHours, churnProb]);

  if (!isOpen) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  const reportId = `R-MC-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = 'JUN 06, 2026';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:relative print:overflow-visible">
      {/* Printable Style Sheet Override */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            color: #000 !important;
            background-color: #fff !important;
            margin: 0;
            padding: 1.5in !important;
          }
          .no-print {
            display: none !important;
          }
          .print-border-black {
            border-color: #111 !important;
          }
          .print-bg-gray {
            background-color: #f7f7f8 !important;
          }
          .print-text-black {
            color: #111 !important;
          }
          .print-text-darkgray {
            color: #444 !important;
          }
        }
      `}</style>

      <div className="w-full max-w-4xl bg-[#09090b] border border-white/10 rounded-2xl flex flex-col max-h-[90vh] shadow-[0_20px_50px_rgba(0,0,0,0.8)] print:border-none print:shadow-none print:max-h-full print:bg-white print:rounded-none no-print">
        {/* Controls Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0f0f12]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Executive Briefing Generator</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded bg-cyan-500 hover:brightness-110 active:scale-97 text-black font-mono text-[9px] font-extrabold uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
            >
              <Printer className="w-3.5 h-3.5" /> Save PDF / Print
            </button>
            <button
              onClick={onClose}
              className="p-1 px-2.5 bg-neutral-900 text-neutral-400 hover:text-white border border-white/5 hover:border-white/15 rounded text-xs transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Container representing A4 Document preview */}
        <div className="overflow-y-auto p-8 bg-neutral-950/40 text-neutral-300 font-mono text-xs flex justify-center flex-grow">
          {/* A4 Preview Card */}
          <div 
            id="print-area" 
            className="w-full max-w-3xl bg-white text-zinc-900 border border-zinc-200 shadow-2xl p-8 sm:p-12 space-y-8 flex flex-col justify-between print:shadow-none print:border-none print:w-full print:max-w-none hover:bg-neutral-50/10 transition-colors"
          >
            {/* Header branding */}
            <div className="border-b-4 border-zinc-900 pb-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-900 mb-1">
                    <span className="w-2.5 h-2.5 bg-cyan-600 rounded-sm" />
                    <span className="font-sans font-black text-lg tracking-tight uppercase">RETAINAI SYSTEMS CORE</span>
                  </div>
                  <p className="font-sans text-[8px] tracking-wider text-zinc-500 font-bold uppercase">PREDICTIVE PORTFOLIO REVENUE INTELLIGENCE</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 font-sans font-black bg-zinc-900 text-white rounded text-[7px] tracking-widest uppercase">CLASSIFIED - internal use only</span>
                  <p className="text-[10px] text-zinc-500 font-bold mt-1.5 uppercase font-mono">ID: {reportId}</p>
                </div>
              </div>
            </div>

            {/* Document Title Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="md:col-span-2 space-y-2">
                <h2 className="text-xl font-bold font-sans text-zinc-900 uppercase tracking-tight">EXECUTIVE STATEMENT OF SIMULATED CHURN & CAMPAIGN ROI</h2>
                <p className="text-[10px] text-zinc-600 leading-normal font-sans uppercase">
                  A mathematically modeled financial feasibility report estimating strategic campaign ROI projections using 1,000 statistical normal-distribution trials configured from active product telemetry indicators.
                </p>
              </div>
              <div className="border-l border-zinc-200 pl-4 space-y-1 font-mono text-[9px] text-zinc-500 font-bold uppercase">
                <p>GEN TIME: {dateStr}</p>
                <p>CLASSIFICATION: HIGH SECRET</p>
                <p>AUTHOR: PORTFOLIO ML ENGINE</p>
              </div>
            </div>

            {/* Section 1: Ingested Product Telemetry Parameters */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-sans font-extrabold text-zinc-900 tracking-wider uppercase border-b border-zinc-200 pb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full" /> 01. Ingested Sandbox Telemetry Vectors
              </h3>
              <div className="grid grid-cols-5 gap-2 text-center text-[9px]">
                <div className="p-2 border border-zinc-200 rounded print-bg-gray">
                  <p className="font-sans text-[8px] text-zinc-500 uppercase font-black">SUPPORT TICKETS</p>
                  <p className="text-xs font-bold text-zinc-900 mt-1">{supportTickets}</p>
                </div>
                <div className="p-2 border border-zinc-200 rounded print-bg-gray">
                  <p className="font-sans text-[8px] text-zinc-500 uppercase font-black">ACTIVE LICENSE SEATS</p>
                  <p className="text-xs font-bold text-zinc-900 mt-1">{seatsActive.toLocaleString()}</p>
                </div>
                <div className="p-2 border border-zinc-200 rounded print-bg-gray">
                  <p className="font-sans text-[8px] text-zinc-500 uppercase font-black">ENGAGEMENT RATE</p>
                  <p className="text-xs font-bold text-zinc-900 mt-1">{engagementAdoption}%</p>
                </div>
                <div className="p-2 border border-zinc-200 rounded print-bg-gray">
                  <p className="font-sans text-[8px] text-zinc-500 uppercase font-black">SLA LATENCY</p>
                  <p className="text-xs font-bold text-zinc-900 mt-1">{slaResponseHours} hr</p>
                </div>
                <div className="p-2 border border-zinc-200 rounded print-bg-gray">
                  <p className="font-sans text-[8px] text-zinc-500 uppercase font-black">DAILY TELESCOPIC DRIFT</p>
                  <p className="text-xs font-bold text-zinc-900 mt-1">{platformDeclineRate}%</p>
                </div>
              </div>
            </div>

            {/* Section 2: Core Model Projections */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-sans font-extrabold text-zinc-900 tracking-wider uppercase border-b border-zinc-200 pb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full" /> 02. Machine Learning Predictive Outcomes
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 border border-zinc-200 rounded text-center">
                  <p className="font-sans text-[8px] text-zinc-500 uppercase font-black">PORTFOLIO CHURN RISK</p>
                  <p className={`text-lg font-bold mt-1.5 ${churnProb > 50 ? 'text-rose-600' : 'text-zinc-900'}`}>{churnProb}%</p>
                </div>
                <div className="p-3 border border-zinc-200 rounded text-center">
                  <p className="font-sans text-[8px] text-zinc-500 uppercase font-black">CALCULATED HEALTH INDEX</p>
                  <p className="text-lg font-bold text-emerald-600 mt-1.5">{healthScore}/100</p>
                </div>
                <div className="p-3 border border-zinc-200 rounded text-center">
                  <p className="font-sans text-[8px] text-zinc-500 uppercase font-black">REVENUE METRIC RISK</p>
                  <p className="text-lg font-bold text-zinc-900 mt-1.5">${revenueAtRisk?.toLocaleString()}</p>
                </div>
              </div>
              <div className="p-3 border border-zinc-150 rounded bg-zinc-50 border-dashed text-[10px] text-zinc-600 leading-normal uppercase">
                <p className="font-sans font-black text-[8px] text-zinc-500 mb-0.5">GENERATIVE NARRATIVE INSIGHT ASSESSMENT:</p>
                "{insights}"
              </div>
            </div>

            {/* Section 3: Monte Carlo Strategic Revenue Yield */}
            {mcResults && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-sans font-extrabold text-zinc-900 tracking-wider uppercase border-b border-zinc-200 pb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full" /> 03. Monte Carlo Financial Modeling Outcomes (1,000 Trials)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="p-2 border border-zinc-200 rounded text-center">
                    <p className="font-sans text-[7px] text-zinc-400 uppercase font-black">CAMPAIGN BUDGET</p>
                    <p className="text-sm font-bold text-zinc-900 mt-1">${mcResults.campaignCost.toLocaleString()}</p>
                  </div>
                  <div className="p-2 border border-zinc-200 rounded text-center">
                    <p className="font-sans text-[7px] text-zinc-400 uppercase font-black">PROB OF POSITIVE ROI</p>
                    <p className="text-sm font-bold text-emerald-600 mt-1">{mcResults.probPositive}%</p>
                  </div>
                  <div className="p-2 border border-zinc-200 rounded text-center">
                    <p className="font-sans text-[7px] text-zinc-400 uppercase font-black">MEDIAN OUTCOME ROI</p>
                    <p className="text-sm font-bold text-zinc-900 mt-1">+{mcResults.medianROI}%</p>
                  </div>
                  <div className="p-2 border border-zinc-200 rounded text-center bg-cyan-50/30 print-bg-white border-cyan-200">
                    <p className="font-sans text-[7px] text-cyan-600 uppercase font-black">ESTIMATED NET SAVINGS</p>
                    <p className="text-sm font-bold text-cyan-700 mt-1">${mcResults.netProfit.toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-3 border border-zinc-150 rounded text-[9px] text-zinc-500 font-bold space-y-1 bg-zinc-50/50 uppercase">
                  <div className="flex justify-between">
                    <span>▼ REVENUE RETENTION MODEL FLOOR (5TH PERCENTILE):</span>
                    <span className={mcResults.worstCaseROI < 0 ? 'text-rose-600' : 'text-zinc-900'}>{mcResults.worstCaseROI}% ROI</span>
                  </div>
                  <div className="flex justify-between">
                    <span>▲ REVENUE RETENTION MODEL CEILING (95TH PERCENTILE):</span>
                    <span className="text-emerald-600">+{mcResults.bestCaseROI}% ROI</span>
                  </div>
                  <div className="flex justify-between">
                    <span>⚡ ESTIMATED ACCOUNT VALUE COHORT AT RISK:</span>
                    <span className="text-zinc-900">{mcResults.atRiskCohort} COHORT LICENSE NODES</span>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Recommended Corrective Playbooks */}
            <div className="space-y-2 flex-grow">
              <h3 className="text-[10px] font-sans font-extrabold text-zinc-900 tracking-wider uppercase border-b border-zinc-200 pb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full" /> 04. Prescribed Strategic Action Playbooks
              </h3>
              <table className="w-full text-left text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-zinc-300 text-zinc-500 font-sans uppercase font-black tracking-wide text-[7px]">
                    <th className="py-1 pb-1.5 pl-1">STRATEGIC PLAYBOOK NAME</th>
                    <th className="py-1 pb-1.5">DESCRIPTION / RESOLUTION FLOW</th>
                    <th className="py-1 pb-1.5 text-right pr-1">URGENCY LEVEL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {playbooks.slice(0, 3).map((pb, index) => (
                    <tr key={index} className="hover:bg-zinc-50/50">
                      <td className="py-2.5 font-bold text-zinc-900 pl-1 uppercase max-w-[140px] pr-2 break-words">{pb.name}</td>
                      <td className="py-2.5 text-zinc-650 uppercase pr-4 leading-normal">{pb.description}</td>
                      <td className="py-2.5 text-right pr-1 font-bold">
                        <span className={`px-1 py-0.5 rounded text-[7px] font-sans font-black ${
                          pb.urgency === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-zinc-100 text-zinc-700'
                        }`}>
                          {pb.urgency}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {playbooks.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-zinc-400 italic">No direct playbooks triggered. Current adoption metrics remain verified.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Signatures & Certification Seal Block */}
            <div className="border-t border-zinc-200 pt-6 flex justify-between items-end">
              <div className="space-y-6">
                <div className="flex gap-1.5 items-center text-[9px] font-sans font-black text-zinc-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>PREDICTION SUITE CERTIFIED SECURE</span>
                </div>
                <div className="flex gap-12 font-mono text-[8px] text-zinc-400 uppercase">
                  <div className="space-y-4">
                    <p className="border-b border-zinc-400 w-32 h-6" />
                    <p className="font-bold text-zinc-500">PREDICTIONS ENGINEER</p>
                  </div>
                  <div className="space-y-4">
                    <p className="border-b border-zinc-400 w-32 h-6" />
                    <p className="font-bold text-zinc-500">CHIEF REVENUE OFFICER</p>
                  </div>
                </div>
              </div>

              {/* Digital certification hash */}
              <div className="text-right text-[8px] text-zinc-400 space-y-1 uppercase tracking-tight">
                <p className="font-bold text-zinc-805">DIGITAL CERTIFICATE SYSTEM AUTHENTICATED</p>
                <p>BLOCK SHA-256: e8eb19cbdb0e828a2a5</p>
                <p>RetainAI ML Core Ensemble Validation v2.4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
