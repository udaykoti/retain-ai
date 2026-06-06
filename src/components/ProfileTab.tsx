import { useState, useEffect } from 'react';
import { DollarSign, Calendar, ShieldCheck, ArrowUp, ArrowDown, Activity, Sparkles, AlertOctagon, HelpCircle, Play, CheckCircle } from 'lucide-react';
import { Customer } from '../types';

interface ProfileTabProps {
  customers: Customer[];
  selectedCustomerId: string;
  onSelectCustomer: (id: string) => void;
}

export default function ProfileTab({ customers, selectedCustomerId, onSelectCustomer }: ProfileTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'explanations' | 'actions'>('overview');
  const [playbookStates, setPlaybookStates] = useState<Record<string, 'PENDING' | 'LOADING' | 'COMPLETED'>>({});

  const customer = customers.find((c) => c.id === selectedCustomerId);

  useEffect(() => {
    // Reset playbook trigger states when customer changes
    setPlaybookStates({});
  }, [selectedCustomerId]);

  if (!customer) {
    return (
      <div className="min-h-[300px] flex items-center justify-center rounded-2xl bg-[#0a0a0a] border border-white/10 p-8 text-center">
        <div>
          <p className="text-sm font-bold text-white">No customer data is available yet.</p>
          <p className="text-xs text-neutral-400 mt-2">Please wait while the account profile loads or try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const triggerPlaybook = (playbookId: string) => {
    setPlaybookStates((prev) => ({ ...prev, [playbookId]: 'LOADING' }));
    setTimeout(() => {
      setPlaybookStates((prev) => ({ ...prev, [playbookId]: 'COMPLETED' }));
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.12)]';
      case 'AT_RISK':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.12)]';
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.12)]';
      default:
        return 'text-white bg-white/10';
    }
  };

  const currentRiskColor = customer.churnProbability < 35 
    ? '#10b981' 
    : customer.churnProbability < 65 
    ? '#f97316' 
    : '#f43f5e';

  // Circle gauge offset path. Radius 40. Circumference is 2 * Math.PI * 40 = 251.2
  const circumference = 251.2;
  const strokeDashoffset = circumference - (circumference * customer.churnProbability) / 100;

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Account Selector Search Row */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#0a0a0a] border border-white/10 rounded-xl gap-4">
        <div>
          <label className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-bold block mb-1">DRILL_DOWN_TARGET</label>
          <h3 className="text-xs font-bold text-white uppercase tracking-wide font-mono">Active Account Focus</h3>
        </div>
        <div className="relative w-full sm:w-64">
          <select
            value={customer.id}
            onChange={(e) => onSelectCustomer(e.target.value)}
            className="w-full bg-black border border-white/10 text-xs text-white rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 font-mono"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.status})
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Hero Header Area */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Profile Info Columns */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase font-sans">{customer.name}</h1>
            <span className={`px-3 py-1 border rounded font-mono text-[9px] font-bold tracking-widest uppercase ${getStatusColor(customer.status)}`}>
              {customer.status}
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-xl font-sans mt-2">{customer.description}</p>
          
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-neutral-400 font-mono text-[10px] tracking-wide">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>INDUSTRY: <strong className="text-white font-sans text-xs">{customer.industry}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400 font-mono text-[10px] tracking-wide">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>ACTIVE SEATS: <strong className="text-white font-sans text-xs">{customer.seats.toLocaleString()}</strong></span>
            </div>
          </div>
        </div>

        {/* Churn Probability Radial Gauge */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div className="gauge-container w-full max-w-[280px]">
            <div className="glass-card reflective-edge p-5 rounded-2xl relative text-center overflow-hidden gauge-3d backdrop-blur-3xl">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full" />
              <h3 className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest font-bold mb-3">PREDICTED_CHURN_PROBABILITY</h3>
              
              <div className="relative w-36 h-36 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                  <circle
                    className="gauge-ring"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke={currentRiskColor}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    strokeWidth="6"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white tracking-tight font-mono">{customer.churnProbability}%</span>
                  <span
                    className="text-[8px] font-extrabold tracking-widest uppercase mt-0.5"
                    style={{ color: currentRiskColor }}
                  >
                    {customer.churnProbability < 35 
                      ? 'Low Risk' 
                      : customer.churnProbability < 65 
                      ? 'Moderate Risk' 
                      : 'Severe hazard'}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-neutral-400 mt-3 font-mono leading-relaxed uppercase">
                Model confidence: <strong className="text-white font-bold">95.8%</strong> calibrated trails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <nav className="flex border-b border-white/10 gap-8 overflow-x-auto no-scrollbar pt-2 font-mono text-[10px] uppercase tracking-widest">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`pb-3 font-bold cursor-pointer relative tracking-widest uppercase ${
            activeSubTab === 'overview' ? 'text-cyan-400' : 'text-neutral-500 hover:text-white'
          }`}
        >
          Overview Statistics
          {activeSubTab === 'overview' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 animate-scale-x" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('explanations')}
          className={`pb-3 font-bold cursor-pointer relative tracking-widest uppercase ${
            activeSubTab === 'explanations' ? 'text-cyan-400' : 'text-neutral-500 hover:text-white'
          }`}
        >
          AI Explanations
          {activeSubTab === 'explanations' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 animate-scale-x" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('actions')}
          className={`pb-3 font-bold cursor-pointer relative tracking-widest uppercase ${
            activeSubTab === 'actions' ? 'text-cyan-400' : 'text-neutral-500 hover:text-white'
          }`}
        >
          Recommended Actions ({customer.recommendedPlaybooks.length})
          {activeSubTab === 'actions' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 animate-scale-x" />
          )}
        </button>
      </nav>

      {/* Sub Tab Contents */}
      <div className="min-h-[300px]">
        {/* OVERVIEW TAB */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CLV */}
              <div className="glass-card reflective-edge p-5 rounded-2xl flex flex-col gap-2 hover:scale-[1.01] transition-transform">
                <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20 w-fit shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-bold">CLV (Lifetime Value)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-white">${customer.clv.toLocaleString()}</span>
                  <span className="text-emerald-400 text-xs flex items-center font-bold font-mono gap-0.5">
                    <ArrowUp className="w-3 h-3" /> 12%
                  </span>
                </div>
              </div>

              {/* Tenure */}
              <div className="glass-card reflective-edge p-5 rounded-2xl flex flex-col gap-2 hover:scale-[1.01] transition-transform">
                <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20 w-fit shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Contract Tenure</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono text-white">{customer.tenureMonths}</span>
                  <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest font-bold">Months</span>
                </div>
              </div>

              {/* Current Plan */}
              <div className="glass-card reflective-edge p-5 rounded-2xl flex flex-col gap-2 hover:scale-[1.01] transition-transform">
                <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20 w-fit shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Subscribed Plan</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-white">{customer.plan}</span>
                  <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    {customer.planPeriod}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Engagement Trends */}
            <div className="glass-card reflective-edge p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xs font-mono font-bold uppercase text-neutral-500 tracking-widest">PRODUCT_ENGAGEMENT_FLOW</h4>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-500 font-bold">
                    <span className="w-2.5 h-2.5 rounded bg-cyan-400" /> WORKSPACE USAGE
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-500 font-bold">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-450" /> SEAT ADOPTION
                  </div>
                </div>
              </div>

              {/* Columns Bar Grid */}
              <div className="h-44 w-full flex items-end gap-3 px-2 md:px-6">
                {customer.engagementTrends.usage.map((u, idx) => {
                  const adoptionVal = customer.engagementTrends.adoption[idx] || 0;
                  return (
                    <div key={idx} className="flex-grow flex items-end h-full gap-1">
                      {/* Usage column */}
                      <div
                        className="w-full bg-gradient-to-t from-cyan-950 to-cyan-500 hover:brightness-125 rounded-t-sm transition-all"
                        style={{ height: `${u}%` }}
                        title={`Usage Period ${idx + 1}: ${u}%`}
                      />
                      {/* Adoption column */}
                      <div
                        className="w-full bg-gradient-to-t from-emerald-950 to-emerald-450 hover:brightness-125 rounded-t-sm transition-all animate-pulse"
                        style={{ height: `${adoptionVal}%` }}
                        title={`Adoption Period ${idx + 1}: ${adoptionVal}%`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* AI EXPLANATIONS TAB */}
        {activeSubTab === 'explanations' && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6 text-cyan-400">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                <h4 className="text-xs font-bold uppercase font-mono tracking-widest">AI Assessment: Multi-factor Attribution</h4>
              </div>

              <div className="space-y-6">
                {customer.riskFactors.map((rf, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-white font-sans uppercase font-mono">{rf.name}</span>
                      <span className={`font-mono text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded border ${
                        rf.type === 'RISK' 
                          ? 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.15)]' 
                          : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                      }`}>
                        {rf.type === 'RISK' ? '+' : '-'}{rf.impact}% RISK IMPACT
                      </span>
                    </div>

                    {/* Styled progress level bar */}
                    <div className="w-full bg-black/40 h-2.5 rounded border border-white/10 overflow-hidden">
                      <div
                        className={`h-full ${rf.type === 'RISK' ? 'bg-gradient-to-r from-rose-950 to-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-gradient-to-r from-emerald-950 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`}
                        style={{ width: `${rf.impact}%` }}
                      />
                    </div>
                    
                    <p className="text-neutral-400 font-mono text-[11px] uppercase mt-1 italic leading-relaxed">
                      "{rf.detail}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ACTIONS TAB */}
        {activeSubTab === 'actions' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-neutral-500 uppercase font-mono tracking-widest">RECOMMENDED Playbooks</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customer.recommendedPlaybooks.map((pb) => {
                const currentStatus = playbookStates[pb.id] || 'PENDING';
                
                return (
                  <div key={pb.id} className="glass-card reflective-edge p-5 rounded-2xl flex flex-col hover:border-cyan-500/40 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2 py-0.5 font-mono text-[8px] font-extrabold tracking-widest rounded border ${
                        pb.urgency === 'HIGH' 
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.15)]' 
                          : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                      }`}>
                        {pb.urgency} URGENCY
                      </span>

                      {currentStatus === 'COMPLETED' ? (
                        <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5" /> INITIATED
                        </span>
                      ) : currentStatus === 'LOADING' ? (
                        <span className="text-[9px] font-mono text-cyan-400 animate-pulse font-bold uppercase tracking-widest">
                          Deploying...
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
                          Idle Queued
                        </span>
                      )}
                    </div>

                    <h5 className="text-sm font-bold text-white mb-1.5 uppercase font-mono tracking-wide">{pb.name}</h5>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-6 flex-grow">{pb.description}</p>
                    
                    {currentStatus === 'COMPLETED' ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-widest"
                      >
                        Playbook Running Successfully
                      </button>
                    ) : currentStatus === 'LOADING' ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded bg-white/5 border border-white/5 text-neutral-500 font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <span className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        Triggering Node Webhooks...
                      </button>
                    ) : (
                      <button
                        onClick={() => triggerPlaybook(pb.id)}
                        className="w-full py-2.5 border border-white/10 hover:border-cyan-500 rounded font-mono text-[10px] text-white uppercase tracking-widest hover:bg-cyan-500/5 hover:text-cyan-400 active:scale-[0.98] transition-all cursor-pointer font-bold"
                      >
                        {pb.actionLabel}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
