import { LayoutDashboard, Users, SlidersHorizontal, Cpu } from 'lucide-react';

interface NavigationProps {
  activeTab: 'overview' | 'profile' | 'simulate' | 'architecture';
  setActiveTab: (tab: 'overview' | 'profile' | 'simulate' | 'architecture') => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md rounded-full bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 flex justify-around items-center px-4 py-2.5">
      {/* Overview Button */}
      <button
        onClick={() => setActiveTab('overview')}
        className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 cursor-pointer ${
          activeTab === 'overview'
            ? 'text-cyan-400 bg-cyan-500/10 px-3 md:px-4 shadow-[0_0_15px_rgba(34,211,238,0.25)] scale-105 border border-cyan-500/20'
            : 'text-neutral-500 hover:text-white'
        }`}
      >
        <LayoutDashboard className="w-4 h-4" />
        <span className="text-[8px] font-bold uppercase mt-1 tracking-widest font-mono">Overview</span>
      </button>

      {/* Profile Button */}
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 cursor-pointer ${
          activeTab === 'profile'
            ? 'text-cyan-400 bg-cyan-500/10 px-3 md:px-4 shadow-[0_0_15px_rgba(34,211,238,0.25)] scale-105 border border-cyan-500/20'
            : 'text-neutral-500 hover:text-white'
        }`}
      >
        <Users className="w-4 h-4" />
        <span className="text-[8px] font-bold uppercase mt-1 tracking-widest font-mono">Profile</span>
      </button>

      {/* Simulate Button */}
      <button
        onClick={() => setActiveTab('simulate')}
        className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 cursor-pointer ${
          activeTab === 'simulate'
            ? 'text-cyan-400 bg-cyan-500/10 px-3 md:px-4 shadow-[0_0_15px_rgba(34,211,238,0.25)] scale-105 border border-cyan-500/20'
            : 'text-neutral-500 hover:text-white'
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-[8px] font-bold uppercase mt-1 tracking-widest font-mono">Simulate</span>
      </button>

      {/* Architecture Button */}
      <button
        onClick={() => setActiveTab('architecture')}
        className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 cursor-pointer ${
          activeTab === 'architecture'
            ? 'text-cyan-400 bg-cyan-500/10 px-3 md:px-4 shadow-[0_0_15px_rgba(34,211,238,0.25)] scale-105 border border-cyan-500/20'
            : 'text-neutral-500 hover:text-white'
        }`}
      >
        <Cpu className="w-4 h-4" />
        <span className="text-[8px] font-bold uppercase mt-1 tracking-widest font-mono">Architecture</span>
      </button>
    </nav>
  );
}
