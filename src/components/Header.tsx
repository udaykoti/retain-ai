import React, { KeyboardEvent, useState, useEffect } from 'react';
import { Activity, Bell, Search, Cpu, Check, Trash2, X, Shield, Wifi, User, LogOut, CheckCircle, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onEnterSearch: () => void;
}

export default function Header({ searchQuery, setSearchQuery, onEnterSearch }: HeaderProps) {
  const [theme, setTheme] = useState<'deep-space' | 'light-analytical'>(() => {
    const saved = localStorage.getItem('retainai-theme');
    return (saved === 'light-analytical') ? 'light-analytical' : 'deep-space';
  });

  useEffect(() => {
    const body = document.body;
    if (theme === 'light-analytical') {
      body.classList.add('light-mode');
      localStorage.setItem('retainai-theme', 'light-analytical');
    } else {
      body.classList.remove('light-mode');
      localStorage.setItem('retainai-theme', 'deep-space');
    }
  }, [theme]);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Live notification state
  const [notifications, setNotifications] = useState([
    { id: 1, text: "ENSEMBLE MODEL V2.4 RUNNING ACTIVE AT PEAK AUC 0.823", time: "4 MINS AGO", read: false },
    { id: 2, text: "DRIFT TRIGGER STANDBY: KL-DIV CALIBRATED WITHIN 0.15 LIMIT", time: "45 MINS AGO", read: false },
    { id: 3, text: "AUTOMATED REGIONAL SYNCHRONY STABLE ON SYMMETRIC SHIELD", time: "2 HOURS AGO", read: true }
  ]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnterSearch();
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-3xl border-b border-white/10 flex justify-between items-center px-4 md:px-10 h-20">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-transform hover:scale-105 duration-300">
          <Activity className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="font-sans text-sm md:text-base font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent uppercase leading-none">
            RetainAI System
          </h1>
          <p className="text-[8px] text-cyan-450 font-mono tracking-widest uppercase animate-pulse mt-1">
            STATUS: ACTIVE INTEL [200 OK]
          </p>
        </div>
      </div>

      {/* Global Search Bar - Responsive, available across screen sizes */}
      <div className="flex items-center bg-[#0d0d0f] border border-white/10 rounded-lg px-2.5 py-1.5 w-40 sm:w-64 md:w-96 gap-2 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/15 transition-all">
        <Search className="w-3.5 h-3.5 text-cyan-400/70 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="SEARCH PROFILES..."
          className="bg-transparent border-none text-[10px] sm:text-xs focus:outline-none w-full text-white placeholder:text-neutral-600 font-mono uppercase tracking-wide"
        />
        <button 
          onClick={onEnterSearch}
          type="button"
          className="cursor-pointer text-[8px] bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 px-2 py-0.5 rounded text-neutral-400 font-mono font-bold transition-all active:scale-95 shrink-0"
        >
          ENTER
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 relative">
        {/* Region stats */}
        <div className="hidden lg:flex items-center px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-neutral-445 uppercase">
          REGION: <span className="text-cyan-405 ml-1 font-bold">US-EAST-1</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(prev => prev === 'deep-space' ? 'light-analytical' : 'deep-space')}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/35 rounded text-[9px] font-mono text-neutral-400 hover:text-cyan-400 uppercase tracking-widest transition-all cursor-pointer font-extrabold active:scale-95"
          title="Toggle Analytical Theme"
        >
          {theme === 'deep-space' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">Light Analytical</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-cyan-400 font-bold" />
              <span className="hidden sm:inline">Deep Space</span>
            </>
          )}
        </button>

        {/* Live system indicators - Interactive Status Popover */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsStatusOpen(!isStatusOpen);
              setIsNotificationsOpen(false);
              setIsProfileOpen(false);
            }}
            className="flex space-x-1.5 items-center bg-black/40 px-2 py-2 rounded border border-white/5 cursor-pointer hover:border-cyan-500/30 active:scale-95 transition-all"
            title="System Connection Diagnostics"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
          </button>

          {isStatusOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-[#0a0a0d]/95 backdrop-blur-2xl border border-white/10 rounded-xl p-4 shadow-[0_15px_50px_rgba(0,0,0,0.9)] z-50 animate-fade-in font-mono text-[10px] uppercase">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className="text-cyan-404 font-bold tracking-wider flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> GATEWAY INTEL</span>
                <button onClick={() => setIsStatusOpen(false)} className="text-neutral-500 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between"><span className="text-neutral-500">INTERFACE GATEWAY:</span> <span className="text-white font-bold font-mono">PORT 3000 [OK]</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">DB PERSISTENCE:</span> <span className="text-white font-bold font-mono">POSTGRESQL SYNC</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">MLOPS AGENT COMPASS:</span> <span className="text-emerald-400 font-bold font-mono">STANDBY ACTIVE</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">INFERENCE SLAS:</span> <span className="text-cyan-404 font-bold font-mono">&lt;100MS P99</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsStatusOpen(false);
              setIsProfileOpen(false);
            }}
            className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all active:scale-95 relative cursor-pointer"
          >
            <Bell className="w-4 h-4 text-cyan-400" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)] flex items-center justify-center text-[6px] font-bold text-white leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-[#0a0a0d]/95 backdrop-blur-2xl border border-white/10 rounded-xl p-4 shadow-[0_15px_50px_rgba(0,0,0,0.9)] z-50 animate-fade-in text-[10px] font-mono">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 bg-black/10">
                <span className="text-cyan-404 font-bold tracking-widest uppercase">SYSTEM WARNING ENTROPY</span>
                {notifications.length > 0 && (
                  <button onClick={markAllRead} className="text-neutral-500 hover:text-white cursor-pointer hover:underline uppercase text-[8px] tracking-wide">
                    MARK ALL READ
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="py-6 text-center text-neutral-500 uppercase italic">
                  No pending alert signals.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-2.5 rounded border transition-all ${n.read ? 'bg-black/20 border-white/5 opacity-60' : 'bg-cyan-950/10 border-cyan-500/10 shadow-[0_0_8px_rgba(6,182,212,0.04)]'}`}>
                      <div className="flex justify-between items-start gap-1">
                        <p className={`text-[9.5px] leading-normal uppercase ${n.read ? 'text-[#909097]' : 'text-white font-semibold'}`}>{n.text}</p>
                        <button 
                          onClick={() => clearNotification(n.id)} 
                          className="text-neutral-600 hover:text-rose-400 shrink-0 cursor-pointer p-0.5 hover:bg-neutral-900 rounded"
                          title="Purge indicator"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[7px] text-neutral-500 font-bold block mt-1 tracking-wider uppercase">{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <div 
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
              setIsStatusOpen(false);
            }}
            className="w-8 h-8 rounded-full overflow-hidden border border-white/20 hover:border-cyan-450 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all cursor-pointer bg-gradient-to-tr from-cyan-950 to-indigo-950 active:scale-95"
          >
            <img
              alt="Profile Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjsAns9s9zHKg1i0bPr4pKxdP4pkmvp0RjKzl039zmOezidkPgL_0nKHJcE7bWvcpVSzjrY9eeFJo9zADfPSaAsPUMxw0n2q272dmR5PPIuwASqG5WhLlN4fHzuq4EUShWTqG5AwC3vYvWfYBVvf3TddsjSXkgtH9aiYpNZ5scceAJWohDukEhqE0ZX4xAs5aK9spRsV9QfnCL3BCwE90o3BhsGF_D95X5B-eluR7GpcQheKF8bYZI7FEoLbDuo0h96ElfqYFkgNsX"
              className="w-full h-full object-cover grayscale brightness-110 contrast-125 select-none"
            />
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-[#0a0a0d]/95 backdrop-blur-2xl border border-white/10 rounded-xl p-4 shadow-[0_15px_50px_rgba(0,0,0,0.9)] z-50 animate-fade-in font-mono text-[10px]">
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-3 mb-3">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-white/15 bg-neutral-900 shrink-0">
                  <img
                    alt="Small avatar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjsAns9s9zHKg1i0bPr4pKxdP4pkmvp0RjKzl039zmOezidkPgL_0nKHJcE7bWvcpVSzjrY9eeFJo9zADfPSaAsPUMxw0n2q272dmR5PPIuwASqG5WhLlN4fHzuq4EUShWTqG5AwC3vYvWfYBVvf3TddsjSXkgtH9aiYpNZ5scceAJWohDukEhqE0ZX4xAs5aK9spRsV9QfnCL3BCwE90o3BhsGF_D95X5B-eluR7GpcQheKF8bYZI7FEoLbDuo0h96ElfqYFkgNsX"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <div className="overflow-hidden">
                  <p className="text-white font-bold truncate text-[9px] lowercase">udaygoli19@gmail.com</p>
                  <p className="text-cyan-404 text-[8px] font-bold tracking-widest uppercase">INTEL_OPERATOR_LEAD</p>
                </div>
              </div>
              <div className="space-y-1.5 text-[9px] text-[#909097] uppercase">
                <p className="flex justify-between">REGION CODE: <span className="text-white font-bold">US-EAST-1</span></p>
                <p className="flex justify-between">CREDENTIAL MATRIX: <span className="text-emerald-400 font-bold">JWT SYSTEM SIGN</span></p>
                <p className="flex justify-between">SECURE ENCRYPT: <span className="text-white font-bold">AES-256</span></p>
              </div>
              <div className="border-t border-white/10 pt-2.5 mt-3">
                <button 
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full py-1.5 rounded bg-white/5 border border-white/5 hover:border-cyan-500/10 text-center hover:text-cyan-400 hover:bg-cyan-950/10 transition-colors cursor-pointer text-[9px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5 text-cyan-400" /> Close Panel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

