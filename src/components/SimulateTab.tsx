import { useState } from 'react';
import { SlidersHorizontal, Settings, Info, Cpu, HelpCircle, Loader2, PlaySquare, TrendingUp, AlertTriangle, CheckSquare, FileText } from 'lucide-react';
import ExecutiveReportModal from './ExecutiveReportModal';

export interface Playbook {
  name: string;
  description: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  actionLabel: string;
}

export default function SimulateTab() {
  const [supportTickets, setSupportTickets] = useState(15);
  const [seatsActive, setSeatsActive] = useState(800);
  const [engagementAdoption, setEngagementAdoption] = useState(65);
  const [slaResponseHours, setSlaResponseHours] = useState(5);
  const [platformDeclineRate, setPlatformDeclineRate] = useState(5);

  const [isLoading, setIsLoading] = useState(false);
  const [churnProb, setChurnProb] = useState<number | null>(null);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [revenueAtRisk, setRevenueAtRisk] = useState<number | null>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  
  // Track triggered webhooks locally for reactive user feedback without window.alert
  const [triggeredPlaybooks, setTriggeredPlaybooks] = useState<Record<string, boolean>>({});
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Simulation Presets / Scenarios
  const loadScenario = (type: 'backlog' | 'healthy' | 'migration') => {
    switch (type) {
      case 'backlog':
        setSupportTickets(45);
        setSeatsActive(1400);
        setEngagementAdoption(30);
        setSlaResponseHours(28);
        setPlatformDeclineRate(18);
        break;
      case 'healthy':
        setSupportTickets(3);
        setSeatsActive(750);
        setEngagementAdoption(92);
        setSlaResponseHours(2);
        setPlatformDeclineRate(1);
        break;
      case 'migration':
        setSupportTickets(18);
        setSeatsActive(2200);
        setEngagementAdoption(55);
        setSlaResponseHours(8);
        setPlatformDeclineRate(35);
        break;
    }
    // clear previous run values
    setChurnProb(null);
    setHealthScore(null);
    setRevenueAtRisk(null);
    setInsights(null);
    setPlaybooks([]);
    setTriggeredPlaybooks({});
  };

  const runSimulation = async () => {
    setIsLoading(true);
    setTriggeredPlaybooks({});
    try {
      const response = await fetch('/api/simulate-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: "Simulation Sandbox Corp",
          supportTickets,
          seatsActive,
          engagementAdoption,
          slaResponseHours,
          platformDeclineRate
        })
      });
      const data = await response.json();
      setChurnProb(data.churnProbability);
      setHealthScore(data.healthScore);
      setRevenueAtRisk(data.revenueAtRisk);
      setInsights(data.insights);
      setPlaybooks(data.playbooks || []);
    } catch (err) {
      console.error(err);
      setInsights("Simulation API experienced an operational block.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerWebhook = (title: string) => {
    setTriggeredPlaybooks(prev => ({ ...prev, [title]: true }));
  };

  // Circular gauge drawing helper values
  const circumference = 251.2;
  const strokeDashoffset = churnProb !== null 
    ? circumference - (circumference * churnProb) / 100 
    : circumference;

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-sans">
      {/* Title & Scenarios Row */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">Risk Sandbox Simulator</h1>
          <p className="text-xs text-neutral-400 leading-relaxed font-mono mt-1">Adjust telemetry triggers to evaluate portfolio outcome projections.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto font-mono text-[9px] uppercase tracking-widest font-extrabold">
          <button
            onClick={() => loadScenario('healthy')}
            className="px-3 py-1.5 rounded bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-pointer flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.12)]"
          >
            <PlaySquare className="w-3.5 h-3.5 text-emerald-400" /> High Adoption
          </button>
          <button
            onClick={() => loadScenario('backlog')}
            className="px-3 py-1.5 rounded bg-orange-500/5 hover:bg-orange-500/10 text-orange-400 border border-orange-500/20 cursor-pointer flex items-center gap-1.5 shadow-[0_0_8px_rgba(249,115,22,0.12)]"
          >
            <PlaySquare className="w-3.5 h-3.5 text-orange-400" /> SLA Response Slip
          </button>
          <button
            onClick={() => loadScenario('migration')}
            className="px-3 py-1.5 rounded bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 border border-rose-500/20 cursor-pointer flex items-center gap-1.5 shadow-[0_0_8px_rgba(244,63,94,0.12)]"
          >
            <PlaySquare className="w-3.5 h-3.5 text-rose-450" /> Migration Fatigue
          </button>
        </div>
      </section>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Adjustable sliders */}
        <section className="lg:col-span-7 bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-2 text-cyan-400 border-b border-white/10 pb-3 mb-2">
            <SlidersHorizontal className="w-4.5 h-4.5 text-cyan-400" />
            <span className="font-mono text-xs uppercase tracking-widest font-bold">Simulator Controls</span>
          </div>

          {/* Slider 1: Support Ticket Volume */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline font-mono text-[10px] tracking-widest text-neutral-400 font-bold">
              <span>SUPPORT TICKETS / MO</span>
              <span className="text-cyan-400 text-xs font-mono">{supportTickets}</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={supportTickets}
              onChange={(e) => setSupportTickets(Number(e.target.value))}
              className="w-full h-1 bg-black rounded border border-white/10 appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[9px] text-neutral-500 font-mono uppercase">
              <span>0 tickets (Optimal)</span>
              <span>60 tickets (Overload)</span>
            </div>
          </div>

          {/* Slider 2: Active Seats */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline font-mono text-[10px] tracking-widest text-neutral-400 font-bold">
              <span>ACTIVE LICENSE SEATS</span>
              <span className="text-cyan-400 text-xs font-mono">{seatsActive.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="100"
              max="3000"
              step="50"
              value={seatsActive}
              onChange={(e) => setSeatsActive(Number(e.target.value))}
              className="w-full h-1 bg-black rounded border border-white/10 appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[9px] text-neutral-500 font-mono uppercase">
              <span>100 seats</span>
              <span>3,000 seats (Scale)</span>
            </div>
          </div>

          {/* Slider 3: Feature Adoption % */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline font-mono text-[10px] tracking-widest text-neutral-400 font-bold">
              <span>PRODUCT ADOPTION LIMIT %</span>
              <span className="text-cyan-400 text-xs font-mono">{engagementAdoption}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={engagementAdoption}
              onChange={(e) => setEngagementAdoption(Number(e.target.value))}
              className="w-full h-1 bg-black rounded border border-white/10 appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[9px] text-neutral-500 font-mono uppercase">
              <span>10% (Detached)</span>
              <span>100% (Fully embedded)</span>
            </div>
          </div>

          {/* Slider 4: SLA latency hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline font-mono text-[10px] tracking-widest text-neutral-400 font-bold">
              <span>SLA RESPONSE INTERVAL</span>
              <span className="text-cyan-400 text-xs font-mono">{slaResponseHours} hr</span>
            </div>
            <input
              type="range"
              min="1"
              max="48"
              value={slaResponseHours}
              onChange={(e) => setSlaResponseHours(Number(e.target.value))}
              className="w-full h-1 bg-black rounded border border-white/10 appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[9px] text-neutral-500 font-mono uppercase">
              <span>1 hr latency</span>
              <span>48 hr latency (Breach)</span>
            </div>
          </div>

          {/* Slider 5: Decline rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline font-mono text-[10px] tracking-widest text-neutral-400 font-bold">
              <span>DAILY DRIFT DECLINE RATE %</span>
              <span className="text-cyan-400 text-xs font-mono">{platformDeclineRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={platformDeclineRate}
              onChange={(e) => setPlatformDeclineRate(Number(e.target.value))}
              className="w-full h-1 bg-black rounded border border-white/10 appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[9px] text-neutral-500 font-mono uppercase">
              <span>0% (Stable telemetry)</span>
              <span>50% (Sudden collapse)</span>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={runSimulation}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-cyan-500 text-black font-mono text-[11px] font-extrabold uppercase tracking-widest hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin text-black" />
                  Regressing portfolio vectors...
                </>
              ) : (
                <>
                  <Cpu className="w-4.5 h-4.5 text-black" /> Evaluate Prediction Model
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right column: Dynamic calculations & Gemini playbooks */}
        <div className="lg:col-span-5 space-y-6">
          {churnProb === null && !isLoading ? (
            <div className="glass-card reflective-edge rounded-2xl p-8 text-center flex flex-col items-center justify-center py-16 text-neutral-400 italic">
              <Info className="w-8 h-8 text-neutral-600 mb-3" />
              <p className="text-xs max-w-xs font-mono uppercase leading-normal">
                Adjust sandbox sliders or select a scenario telemetry configuration, then click **Evaluate Prediction Model** to project calculated indicators.
              </p>
            </div>
          ) : isLoading ? (
            <div className="glass-card reflective-edge rounded-2xl p-8 text-center flex flex-col items-center justify-center py-20">
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-cyan-500/25 blur-md rounded-full scale-150 animate-ping" />
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
              <p className="text-[10px] uppercase tracking-widest font-mono text-cyan-400 font-bold animate-pulse">Running predictive matrix evaluation via Gemini SDK...</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Executive Sharing Action Block */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0d0d11]/80 border border-white/10 p-3 px-4 rounded-xl gap-3">
                <div className="space-y-0.5 font-mono">
                  <span className="font-mono text-[8px] text-zinc-500 font-bold uppercase tracking-widest block">EXECUTIVE SHARE FLOW</span>
                  <span className="text-[10px] text-neutral-300 uppercase tracking-tight block font-bold">PDF-Ready Executive Brief</span>
                </div>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-3.5 py-1.5 bg-cyan-500 hover:brightness-110 active:scale-97 text-black font-mono text-[9px] font-black uppercase tracking-widest rounded cursor-pointer transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)] flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" /> Share Executive PDF Report
                </button>
              </div>

              {/* Computed KPI Badges Layout */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black border border-white/10 text-center flex flex-col justify-center shadow-[0_0_10px_rgba(16,185,129,0.08)]">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#909097] font-bold mb-1">HEALTH SCORE</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">{healthScore}/100</span>
                </div>
                <div className="p-4 rounded-xl bg-black border border-white/10 text-center flex flex-col justify-center shadow-[0_0_10px_rgba(244,63,94,0.08)]">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#909097] font-bold mb-1">REVENUE AT RISK</span>
                  <span className="text-2xl font-bold font-mono text-rose-400">${revenueAtRisk?.toLocaleString()}</span>
                </div>
              </div>

              {/* Score Gauge Circle */}
              <div className="glass-card reflective-edge p-5 rounded-2xl relative text-center overflow-hidden">
                <h3 className="font-mono text-[9px] text-[#909097] uppercase tracking-widest font-bold mb-3">Projected Churn</h3>
                
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                    <circle
                      className="gauge-ring"
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke={churnProb !== null && churnProb < 35 ? '#10b981' : churnProb !== null && churnProb < 65 ? '#f97316' : '#f43f5e'}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      strokeWidth="6"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-white tracking-tight font-mono">{churnProb}%</span>
                    <span className="text-[8px] font-extrabold tracking-widest uppercase mt-0.5 animate-pulse" style={{
                      color: churnProb !== null && churnProb < 35 ? '#10b981' : churnProb !== null && churnProb < 65 ? '#f97316' : '#f43f5e'
                    }}>
                      {churnProb !== null && churnProb < 35 ? 'Low risk' : churnProb !== null && churnProb < 65 ? 'Moderate' : 'Severe Risk'}
                    </span>
                  </div>
                </div>
                
                {/* AI generated Narrative Insights info */}
                <div className="mt-4 p-4 bg-cyan-950/10 border border-cyan-500/10 rounded-lg text-left text-xs leading-relaxed text-neutral-400">
                  <span className="font-bold text-cyan-400 uppercase tracking-widest font-mono text-[9px] block mb-1">AI Risk Assessment Summary:</span>
                  <p className="font-mono italic text-[11px] uppercase">"{insights}"</p>
                </div>
              </div>

              {/* Dynamic Action Playbooks suggested by model */}
              <div className="glass-card reflective-edge p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-widest">Constructed Corrective Playbooks</h4>
                <div className="space-y-3">
                  {playbooks.map((pb, index) => {
                    const isTriggered = triggeredPlaybooks[pb.name];
                    return (
                      <div key={index} className="p-4 rounded bg-black border border-white/15 hover:border-cyan-500/30 transition-all">
                        <div className="flex justify-between items-baseline mb-2">
                          <h5 className="text-[11px] font-bold text-white uppercase font-mono tracking-wide leading-snug">{pb.name}</h5>
                          <span className={`px-1.5 py-0.5 font-mono text-[7px] font-extrabold tracking-widest rounded border ${
                            pb.urgency === 'HIGH' 
                              ? 'bg-rose-500/10 text-rose-450 border-rose-500/20' 
                              : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                          }`}>
                            {pb.urgency}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#909097] leading-normal font-mono uppercase mb-3">{pb.description}</p>
                        
                        {isTriggered ? (
                          <div className="py-1.5 px-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono tracking-widest rounded uppercase flex items-center justify-center gap-1.5 font-bold">
                            <CheckSquare className="w-3.5 h-3.5" /> Webhook Fired Safely
                          </div>
                        ) : (
                          <button
                            onClick={() => triggerWebhook(pb.name)}
                            className="w-full py-1.5 px-3 border border-white/10 hover:border-cyan-500 text-[9px] font-mono tracking-widest hover:bg-cyan-500/5 hover:text-cyan-400 rounded uppercase transition-colors"
                          >
                            {pb.actionLabel}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Printable Executive Report Modal Overlay */}
      <ExecutiveReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        supportTickets={supportTickets}
        seatsActive={seatsActive}
        engagementAdoption={engagementAdoption}
        slaResponseHours={slaResponseHours}
        platformDeclineRate={platformDeclineRate}
        churnProb={churnProb || 0}
        healthScore={healthScore || 0}
        revenueAtRisk={revenueAtRisk || 0}
        insights={insights || ''}
        playbooks={playbooks}
      />
    </div>
  );
}
