import { useState, useEffect } from 'react';
import { TrendingDown, Zap, AlertTriangle, Lightbulb, ArrowRight, Sparkles, Loader2, Play, TrendingUp, ShieldAlert, Download } from 'lucide-react';
import { Customer } from '../types';
import ChurnVelocityChart from './ChurnVelocityChart';

interface OverviewTabProps {
  customers: Customer[];
  onSelectCustomer: (id: string) => void;
}

export default function OverviewTab({ customers, onSelectCustomer }: OverviewTabProps) {
  const getPrevProbability = (c: Customer) => {
    if (c.lastMonthChurnProbability !== undefined) {
      return c.lastMonthChurnProbability;
    }
    // Safe robust fallbacks if undefined
    if (c.id === 'acme-software') return 52;
    if (c.id === 'global-retail') return 70;
    if (c.id === 'healthcare-ltd') return 46;
    if (c.id === 'enterprise-corp') return 32;
    if (c.id === 'fintech-hub') return 14;
    return c.churnProbability - 5;
  };

  const alertedCustomers = customers.filter(c => {
    const prev = getPrevProbability(c);
    return (c.churnProbability - prev) >= 10;
  });

  const downloadCSV = () => {
    const headers = ['ID', 'Name', 'Industry', 'Status', 'Current Churn Prob (%)', 'Last Month Churn Prob (%)', 'Description'];
    const rows = customers.map(c => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.industry.replace(/"/g, '""')}"`,
      c.status,
      c.churnProbability,
      c.lastMonthChurnProbability ?? getPrevProbability(c),
      `"${c.description.replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `retainai_churn_risk_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const [activeSegment, setActiveSegment] = useState<'distribution' | 'industry'>('distribution');
  const [isGenerating, setIsGenerating] = useState(false);
  const [actionPlan, setActionPlan] = useState<string | null>(null);
  const [radialOffset, setRadialOffset] = useState(283); // starts full and animate to score on load

  const portfolioScore = 72;

  useEffect(() => {
    // Gauge stroke-dasharray is 283.
    // Score of 72 means offset is: 283 - (283 * 0.72) = 79.2
    const timer = setTimeout(() => {
      setRadialOffset(283 - (283 * (portfolioScore / 100)));
    }, 250);
    return () => clearTimeout(timer);
  }, [portfolioScore]);

  // Generate executive action plan
  const generateGlobalPlan = async () => {
    setIsGenerating(true);
    setActionPlan(null);
    try {
      const response = await fetch('/api/generate-action-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Global Portfolio",
          industry: "Combined Segments",
          churnProbability: 45,
          description: "Our overall portfolio has structural risk concentrated in Mid-Market Enterprise accounts due to resolution SLA slips.",
          riskiestFactor: "Service SLA latency breaching core business contracts"
        })
      });
      const data = await response.json();
      setActionPlan(data.plan || data.error);
    } catch (err) {
      setActionPlan("Failed to establish secure endpoint connection to generative intelligence cluster.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      {/* Hero: 3D Health Score Gauge */}
      <section className="flex flex-col items-center justify-center py-6">
        <div className="relative group cursor-default">
          {/* Outer Glow Aura */}
          <div className="absolute inset-0 bg-cyan-500/10 blur-[90px] rounded-full scale-125 opacity-30 transition-all duration-300 group-hover:scale-135" />
          
          <div className="relative glass-card reflective-edge w-60 h-60 md:w-72 md:h-72 rounded-full flex items-center justify-center backdrop-blur-3xl transition-transform duration-500 hover:scale-[1.02]">
            {/* SVG Gauge */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 p-4 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="45" stroke="rgba(255,255,255,0.03)" strokeWidth="5" />
              <circle
                className="gauge-ring"
                cx="50"
                cy="50"
                fill="none"
                r="45"
                stroke="url(#cyanNeonGradient)"
                strokeDasharray="283"
                strokeDashoffset={radialOffset}
                strokeLinecap="round"
                strokeWidth="5"
              />
              <defs>
                <linearGradient id="cyanNeonGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Score Center */}
            <div className="text-center z-10">
              <div className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-1 font-mono">
                {portfolioScore}
                <span className="text-neutral-500 font-medium text-lg">/100</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
                <span className="font-mono text-[9px] text-cyan-400 uppercase tracking-widest font-bold">OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center max-w-sm px-4">
          <h2 className="text-2xl font-black text-white mb-2 leading-tight uppercase tracking-tight">Portfolio Health Status</h2>
          <p className="text-xs text-neutral-400 font-medium leading-relaxed font-mono uppercase tracking-wide">
            AI confidence is <span className="text-cyan-400 font-bold">95.4%</span> based on active signals from <span className="text-white font-bold">4,200</span> telemetry indicators.
          </p>
        </div>
      </section>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Revenue at Risk */}
        <div className="glass-card reflective-edge p-6 rounded-2xl relative overflow-hidden group hover:bg-white/[0.02] transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Revenue at Risk</p>
              <h3 className="text-3xl font-bold font-mono tracking-tighter text-white font-black">$1.2M</h3>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-450 border border-rose-500/20">
              <TrendingDown className="w-5 h-5 text-rose-450" />
            </div>
          </div>
          
          {/* Sparkline Micro-Bars with High-Tech Crimson Gradients */}
          <div className="h-16 w-full flex items-end gap-1.5 px-1">
            <div className="flex-1 bg-gradient-to-t from-rose-950/40 to-rose-500/40 hover:to-rose-500 rounded-t-sm h-[60%] transition-colors duration-300" />
            <div className="flex-1 bg-gradient-to-t from-rose-950/40 to-rose-500/40 hover:to-rose-500 rounded-t-sm h-[80%] transition-colors duration-300" />
            <div className="flex-1 bg-gradient-to-t from-rose-950/40 to-rose-500/40 hover:to-rose-500 rounded-t-sm h-[70%] transition-colors duration-300" />
            <div className="flex-1 bg-gradient-to-t from-rose-950/40 to-rose-500/40 hover:to-rose-500 rounded-t-sm h-[90%] transition-colors duration-300 shadow-[0_0_12px_rgba(244,63,94,0.15)]" />
            <div className="flex-1 bg-gradient-to-t from-rose-950/40 to-rose-500/40 hover:to-rose-500 rounded-t-sm h-[65%] transition-colors duration-300" />
            <div className="flex-1 bg-gradient-to-t from-rose-950/40 to-rose-500/40 hover:to-rose-500 rounded-t-sm h-[40%] transition-colors duration-300" />
            <div className="flex-1 bg-gradient-to-t from-rose-950/40 to-rose-500/40 hover:to-rose-500 rounded-t-sm h-[55%] transition-colors duration-300" />
            <div className="flex-1 bg-gradient-to-t from-rose-950/80 to-rose-500 hover:to-rose-500 rounded-t-sm h-[30%] border-t border-rose-500/20 transition-colors duration-300 shadow-[0_0_15px_rgba(244,63,94,0.25)]" />
          </div>
          
          <div className="mt-5 flex items-center gap-2 text-rose-450 font-mono text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>+12% INCREASE FROM LAST REGRESSION</span>
          </div>
        </div>

        {/* Card 2: Customers at Risk */}
        <div className="glass-card reflective-edge p-6 rounded-2xl relative overflow-hidden group hover:bg-white/[0.02] transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Customers at Risk</p>
              <h3 className="text-3xl font-bold font-mono tracking-tighter text-white font-black">142</h3>
            </div>
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Zap className="w-5 h-5 text-orange-400 animate-pulse" />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.15)]">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="overflow-hidden">
              <p className="font-sans text-xs text-white truncate font-bold">Critical concentration inside Enterprise sector</p>
              <p className="font-mono text-[8px] text-cyan-400 uppercase tracking-widest font-bold">CRITICAL RETENTION HAZARD</p>
            </div>
          </div>

          <div className="mt-5 flex justify-between items-center">
            <div className="flex -space-x-2">
              <img
                alt="User portrait"
                className="w-7 h-7 rounded-full border-2 border-[#050505] hover:scale-110 transition-transform cursor-pointer grayscale brightness-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUIJXC97du9mV0prqpX7Ha4fLmZs7c_mqrkDW9Sl9PojPQtKKzIUXSBZmktyI9tM_p4TX0S7cmUcIIWId6SHFDnA2jzeTpRf1gLva3XJhpjJe7N4Y7R0gbXfsSXTU6S4YLDDELYkXlIu56vobipmwTbXs6ehmM5EvI8gMCgqsTqIsW4vuGTzPiXoYcPNQKqeYj4D9-g7uJNCAkltKCjjSr7fSleruu49GRWySCMsFaJypeQ7YZYAqkTTknNHc_8Oytj1idpztmucx"
              />
              <img
                alt="User portrait 2"
                className="w-7 h-7 rounded-full border-2 border-[#050505] hover:scale-110 transition-transform cursor-pointer grayscale brightness-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuABI1R4h2LtUWUkkwREga8gCnfFszbN4DWVLjjg2DiYkG_bE78akqKQya9JGC9ijEHnD6p34SifY9BO6LmONnC7FBjf_y0KPgul2x6lDL592taHxHHfnIFlnInZnOemdwLPlon_mbdkjkAUhRy9p8YZf5syB3bTSYiFDXcdS-czcDGmr_UA_LJdsbng2E7QtwXDp9qGI5elgkJlMGhZT6lTERRRzhRjDkJvkxkxcd326ADAFJBvP5K3SVyOSmjG0ae7I4syGZjln8qT"
              />
              <div className="w-7 h-7 rounded-full border-2 border-[#050505] bg-neutral-900 border border-white/5 flex items-center justify-center text-[8px] font-bold text-neutral-400 font-mono">
                +139
              </div>
            </div>
            <p className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer">
              Outreach logs: 4 pending
            </p>
          </div>
        </div>
      </section>

      {/* Predictive Alerts Panel */}
      <section className="glass-card reflective-edge p-6 rounded-2xl relative overflow-hidden group hover:bg-white/[0.01] transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <ShieldAlert className="w-16 h-16 text-rose-500 animate-pulse" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/5 pb-4 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-ping" />
              <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-bold">PREDICTIVE_RISK_ACCELERATION_ALERTS</p>
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mt-1">Churn Anomaly Detections (&gt;10% MoM Increase)</h3>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded bg-rose-500/10 text-rose-450 border border-rose-500/20 font-bold self-start sm:self-center">
            {alertedCustomers.length} anomalies flagged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alertedCustomers.map((c) => {
            const prev = getPrevProbability(c);
            const delta = c.churnProbability - prev;
            return (
              <div 
                key={c.id} 
                onClick={() => onSelectCustomer(c.id)}
                className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:border-rose-500/30 hover:shadow-[0_0_15px_rgba(244,63,94,0.1)] transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors uppercase font-mono tracking-wide truncate">
                        {c.name}
                      </h4>
                      <p className="text-[10px] text-neutral-500 font-mono uppercase truncate">{c.industry}</p>
                    </div>
                    <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded shrink-0">
                      <TrendingUp className="w-3 h-3 text-rose-450" />+{delta}%
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2 leading-relaxed mb-4 font-mono uppercase">
                    {c.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex justify-between text-[9px] font-mono font-bold uppercase text-neutral-500">
                    <span>MoM Risk Gradient</span>
                    <span className="text-neutral-300 font-mono">{prev}% <span className="text-rose-400">➔</span> {c.churnProbability}%</span>
                  </div>
                  
                  {/* Progress tracks comparing Mom progression */}
                  <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-neutral-700 h-full transition-all duration-500" 
                      style={{ width: `${prev}%` }} 
                    />
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-rose-500 h-full transition-all duration-500 animate-pulse" 
                      style={{ width: `${delta}%` }} 
                    />
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 pt-1">
                    <span className="text-rose-450 flex items-center gap-1 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> URGENT PLAYBOOK DESIGNATED
                    </span>
                    <span className="group-hover:text-white transition-colors flex items-center gap-1">
                      INVESTIGATE <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Historical Trend Sparkline */}
      <ChurnVelocityChart />

      {/* Chart Section: Churn Probability Distribution */}
      <section className="glass-card reflective-edge p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">CHURN_PROBABILITY_DISTRIBUTION</h3>
            <p className="text-[10px] text-neutral-400 font-mono uppercase">Probability density mapped across active client base</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSegment('distribution')}
              className={`px-3 py-1.5 rounded-lg border font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                activeSegment === 'distribution'
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'border-white/5 text-neutral-500 hover:bg-white/5'
              }`}
            >
              Full Report
            </button>
            <button
              onClick={() => setActiveSegment('industry')}
              className={`px-3 py-1.5 rounded-lg border font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                activeSegment === 'industry'
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'border-white/5 text-neutral-500 hover:bg-white/5'
              }`}
            >
              By Segment
            </button>
          </div>
        </div>

        {activeSegment === 'distribution' ? (
          <div className="h-48 w-full flex items-end justify-between gap-3 px-2 md:px-8 mt-4 font-mono">
            {/* Tower 1 */}
            <div className="group relative flex-1 flex flex-col items-center gap-2">
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0a0a] px-2 py-1 rounded text-[10px] font-mono border border-white/10 z-20 whitespace-nowrap text-white">
                15% Active
              </div>
              <div className="w-full bg-gradient-to-t from-cyan-950/20 to-cyan-400/20 group-hover:to-cyan-400/40 transition-all duration-300 rounded-t-lg h-[40%] border-t border-x border-cyan-400/20" />
              <span className="font-mono text-[9px] text-neutral-500 font-bold">0-20%</span>
            </div>
            {/* Tower 2 */}
            <div className="group relative flex-1 flex flex-col items-center gap-2">
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0a0a] px-2 py-1 rounded text-[10px] font-mono border border-white/10 z-20 whitespace-nowrap text-white">
                22% Active
              </div>
              <div className="w-full bg-gradient-to-t from-cyan-950/20 to-cyan-400/30 group-hover:to-cyan-400/50 transition-all duration-300 rounded-t-lg h-[65%] border-t border-x border-cyan-400/30" />
              <span className="font-mono text-[9px] text-neutral-500 font-bold">20-40%</span>
            </div>
            {/* Tower 3 */}
            <div className="group relative flex-1 flex flex-col items-center gap-2">
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0a0a] px-2 py-1 rounded text-[10px] font-mono border border-white/10 z-20 whitespace-nowrap text-white">
                38% Active
              </div>
              <div className="w-full bg-gradient-to-t from-cyan-950/30 to-cyan-500/40 group-hover:to-cyan-500/60 transition-all duration-300 rounded-t-lg h-[85%] border-t border-x border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.12)]" />
              <span className="font-mono text-[9px] text-neutral-500 font-bold">40-60%</span>
            </div>
            {/* Tower 4 */}
            <div className="group relative flex-1 flex flex-col items-center gap-2">
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0a0a] px-2 py-1 rounded text-[10px] font-mono border border-white/10 z-20 whitespace-nowrap text-white">
                18% Active
              </div>
              <div className="w-full bg-gradient-to-t from-rose-950/20 to-rose-450/30 group-hover:to-rose-450/50 transition-all duration-300 rounded-t-lg h-[50%] border-t border-x border-rose-500/20" />
              <span className="font-mono text-[9px] text-neutral-500 font-bold">60-80%</span>
            </div>
            {/* Tower 5 */}
            <div className="group relative flex-1 flex flex-col items-center gap-2">
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0a0a] px-2 py-1 rounded text-[10px] font-mono border border-white/10 z-20 whitespace-nowrap text-white">
                7% Active
              </div>
              <div className="w-full bg-gradient-to-t from-rose-950/40 to-rose-500/60 group-hover:to-rose-500/80 transition-all duration-300 rounded-t-lg h-[25%] border-t border-x border-rose-500/35 shadow-[0_0_15px_rgba(244,63,94,0.15)]" />
              <span className="font-mono text-[9px] text-neutral-500 font-bold">80-100%</span>
            </div>
          </div>
        ) : (
          <div className="h-48 w-full flex items-end justify-between gap-3 px-2 md:px-8 mt-4 font-mono">
            {/* Retail */}
            <div className="group relative flex-1 flex flex-col items-center gap-2">
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0a0a] px-2 py-1 rounded text-[10px] font-mono border border-white/10 z-20 whitespace-nowrap text-white" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                $860K at Risk
              </div>
              <div className="w-full bg-gradient-to-t from-rose-950 to-rose-500 group-hover:brightness-110 transition-all duration-300 rounded-t-lg h-[82%] shadow-[0_0_15px_rgba(244,63,94,0.15)]" />
              <span className="font-sans text-[9px] text-neutral-400 font-bold text-center truncate w-full">Retail</span>
            </div>
            {/* Software */}
            <div className="group relative flex-1 flex flex-col items-center gap-2">
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0a0a] px-2 py-1 rounded text-[10px] font-mono border border-white/10 z-20 whitespace-nowrap text-white" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                $180K at Risk
              </div>
              <div className="w-full bg-gradient-to-t from-rose-950/60 to-rose-400 group-hover:brightness-110 transition-all duration-300 rounded-t-lg h-[64%]" />
              <span className="font-sans text-[9px] text-neutral-400 font-bold text-center truncate w-full">SaaS</span>
            </div>
            {/* Health */}
            <div className="group relative flex-1 flex flex-col items-center gap-2">
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0a0a] px-2 py-1 rounded text-[10px] font-mono border border-white/10 z-20 whitespace-nowrap text-white" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                $32K at Risk
              </div>
              <div className="w-full bg-gradient-to-t from-orange-950/60 to-orange-400 group-hover:brightness-110 transition-all duration-300 rounded-t-lg h-[58%]" />
              <span className="font-sans text-[9px] text-neutral-400 font-bold text-center truncate w-full">Health</span>
            </div>
            {/* Logistics */}
            <div className="group relative flex-1 flex flex-col items-center gap-2">
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0a0a] px-2 py-1 rounded text-[10px] font-mono border border-white/10 z-20 whitespace-nowrap text-white" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                $428K (Low Risk)
              </div>
              <div className="w-full bg-gradient-to-t from-cyan-950 to-cyan-400 group-hover:brightness-110 transition-all duration-300 rounded-t-lg h-[28%]" />
              <span className="font-sans text-[9px] text-neutral-400 font-bold text-center truncate w-full">Logistics</span>
            </div>
            {/* FinTech */}
            <div className="group relative flex-1 flex flex-col items-center gap-2">
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#0a0a0a] px-2 py-1 rounded text-[10px] font-mono border border-white/10 z-20 whitespace-nowrap text-white" style={{ left: '50%', transform: 'translateX(-50%)' }}>
                $150K (Low Risk)
              </div>
              <div className="w-full bg-gradient-to-t from-cyan-950/70 to-cyan-400/70 group-hover:brightness-110 transition-all duration-300 rounded-t-lg h-[15%]" />
              <span className="font-sans text-[9px] text-neutral-400 font-bold text-center truncate w-full">FinTech</span>
            </div>
          </div>
        )}
      </section>

      {/* AI Recommendation Panel */}
      <section className="p-5 md:p-6 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 shadow-[0_0_25px_rgba(6,182,212,0.15)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 group-hover:rotate-6 select-none pointer-events-none">
          <Sparkles className="w-32 h-32 text-cyan-400" />
        </div>
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-405 shrink-0 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Lightbulb className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="w-full">
            <h4 className="text-xs uppercase font-mono tracking-widest font-bold text-cyan-455 mb-2">NEURAL_RECOMMENDATION_ENGINE</h4>
            <p className="text-xs text-neutral-300 leading-relaxed sm:max-w-2xl font-sans">
              System detected a <span className="text-white font-semibold underline decoration-cyan-400 decoration-2 decoration-solid">pattern of segment decline</span> in team activity within Mid-Market SaaS accounts. Deploying proactive engagement webinars offers substantial risk correction.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 items-center">
              <button
                onClick={generateGlobalPlan}
                className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider px-4 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-98 transition-all cursor-pointer"
              >
                Assemble AI Action Plan <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Quick Links */}
      <section className="glass-card reflective-edge p-5 rounded-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <h4 className="text-xs font-mono font-bold uppercase text-neutral-500 tracking-widest">ACTIVE_ENTERPRISE_NODES</h4>
          <button
            onClick={downloadCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500 hover:brightness-110 active:scale-97 text-black font-mono text-[9px] font-black uppercase tracking-widest cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all"
            title="Download Churn Risk Report CSV"
          >
            <Download className="w-3.5 h-3.5" /> Download CSV
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCustomer(c.id)}
              className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-305 cursor-pointer group flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate max-w-[140px] uppercase font-mono tracking-wide">{c.name}</p>
                <p className="text-[10px] text-neutral-500 italic truncate font-mono">{c.industry}</p>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                  c.status === 'HEALTHY'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : c.status === 'AT_RISK'
                    ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {c.status}
                </span>
                <Play className="w-3 h-3 text-white/10 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Plan Modal / Overlay */}
      {(isGenerating || actionPlan) && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z- horror-overlay flex items-center justify-center p-4" style={{ zIndex: 100 }}>
          <div className="glass-card reflective-edge w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] bg-[#0f0f0f] border border-cyan-500/20">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/40">
              <div className="flex items-center gap-2 text-cyan-400">
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                <span className="font-mono text-xs uppercase tracking-widest font-bold">RetainAI Playbook Assembler</span>
              </div>
              <button
                onClick={() => { setActionPlan(null); setIsGenerating(false); }}
                className="text-neutral-500 hover:text-white transition-colors text-xs font-mono cursor-pointer"
              >
                [ CLOSE ]
              </button>
            </div>

            {/* Content bar */}
            <div className="p-6 overflow-y-auto no-scrollbar flex-1 space-y-4">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-full scale-150 animate-ping" />
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                  </div>
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest animate-pulse">Running total segment regression model matches via Gemini cluster...</p>
                </div>
              ) : (
                <div className="text-xs leading-relaxed text-neutral-400 font-sans space-y-2 markdown-body select-text">
                  <div className="prose prose-invert max-w-none font-mono text-[11px] leading-relaxed uppercase tracking-wider text-neutral-300">
                    {/* Convert raw markdown double stars into styled text in a lightweight custom renderer */}
                    {actionPlan?.split('\n').map((line, idx) => {
                      if (line.trim().startsWith('###')) {
                        return <h3 key={idx} className="text-white font-extrabold text-sm mt-4 mb-2 border-b border-white/10 pb-1">{line.replace('###', '').trim()}</h3>;
                      }
                      if (line.trim().startsWith('####')) {
                        return <h4 key={idx} className="text-cyan-400 font-extrabold text-xs mt-3 mb-1 uppercase tracking-wider">{line.replace('####', '').trim()}</h4>;
                      }
                      if (line.trim().startsWith('-')) {
                        // Bold highlights
                        const text = line.replace('-', '').trim();
                        return (
                          <li key={idx} className="ml-4 list-disc text-neutral-300 mb-1">
                            {text.split('**').map((item, i) => i % 2 === 1 ? <strong key={i} className="text-cyan-400 font-extrabold">{item}</strong> : item)}
                          </li>
                        );
                      }
                      return <p key={idx} className="mb-2">{line.split('**').map((item, i) => i % 2 === 1 ? <strong key={i} className="text-cyan-400 font-bold">{item}</strong> : item)}</p>;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex justify-end">
              <button
                onClick={() => { setActionPlan(null); setIsGenerating(false); }}
                className="px-4 py-2 rounded bg-white/5 border border-white/10 hover:border-cyan-500/35 hover:text-cyan-400 text-xs text-white uppercase tracking-wider font-mono cursor-pointer transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
