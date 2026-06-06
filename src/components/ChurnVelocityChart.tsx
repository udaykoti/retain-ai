import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, ArrowDownRight, Sparkles } from 'lucide-react';

const trendData = [
  { month: 'JAN', velocity: 4.8, raw: 201 },
  { month: 'FEB', velocity: 4.2, raw: 176 },
  { month: 'MAR', velocity: 4.9, raw: 205 },
  { month: 'APR', velocity: 3.5, raw: 147 },
  { month: 'MAY', velocity: 2.8, raw: 118 },
  { month: 'JUN', velocity: 2.4, raw: 101 }, // Current Month
];

export default function ChurnVelocityChart() {
  return (
    <section className="glass-card reflective-edge p-6 rounded-2xl relative overflow-hidden group hover:bg-white/[0.01] transition-all duration-300">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Activity className="w-16 h-16 text-cyan-400" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
            <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest font-bold">ATMOSPHERIC TELEMETRY VELOCITY</p>
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mt-1">CHURN_VELOCITY_TREND_6MO</h3>
          <p className="text-[10px] text-neutral-550 font-mono uppercase">Monthly customer churn velocity over the last 6 months</p>
        </div>

        <div className="flex items-end gap-3 font-mono">
          <div className="text-right">
            <p className="text-[9px] text-neutral-500 uppercase tracking-wider font-bold">CURRENT VELOCITY</p>
            <p className="text-base font-bold text-white tracking-tight flex items-center justify-end gap-1 font-mono">
              2.4%
              <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
            </p>
          </div>
          <div className="border-l border-white/10 pl-3">
            <p className="text-[9px] text-neutral-500 uppercase tracking-wider font-bold">6MO DELTA</p>
            <p className="text-base font-bold text-emerald-400 tracking-tight font-mono">-50.0%</p>
          </div>
        </div>
      </div>

      {/* Recharts Slick Sparkline Area Chart */}
      <div className="h-32 w-full mt-4 font-mono text-[10px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="churnNeonGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              stroke="#525252" 
              fontSize={9}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
              dy={10}
            />
            <YAxis 
              stroke="#525252" 
              fontSize={9}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
              domain={[0, 6]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#0c0c0e]/95 border border-white/10 backdrop-blur-md rounded-xl p-3 shadow-2xl font-mono text-[9px] uppercase tracking-wider text-neutral-300">
                      <p className="text-white font-extrabold pb-1 border-b border-white/10 mb-1.5">{data.month} 2026</p>
                      <p className="flex justify-between gap-6">CHURN VELOCITY: <span className="text-cyan-400 font-extrabold">{data.velocity}%</span></p>
                      <p className="flex justify-between gap-6">RAW NODES LOSS: <span className="text-neutral-400 font-bold">{data.raw}</span></p>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: 'rgba(34, 211, 238, 0.2)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="velocity"
              stroke="#22d3ee"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#churnNeonGlow)"
              activeDot={{ r: 4, stroke: '#050505', strokeWidth: 1, fill: '#22d3ee' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[9px] text-neutral-500 uppercase">
        <span>RETENTION ACCELERATION BASELINE: &lt; 3.0%</span>
        <span className="text-emerald-400 flex items-center gap-1 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse animate-duration-1000" /> SECURED WITHIN BOUNDS
        </span>
      </div>
    </section>
  );
}
