import { useState, useEffect } from 'react';
import { Customer } from './types';
import { mockCustomers } from './mockCustomers';
import ParticleBackground from './components/ParticleBackground';
import Header from './components/Header';
import Navigation from './components/Navigation';
import OverviewTab from './components/OverviewTab';
import ProfileTab from './components/ProfileTab';
import SimulateTab from './components/SimulateTab';
import ArchitectureTab from './components/ArchitectureTab';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'simulate' | 'architecture'>('overview');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('enterprise-corp');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Load customer configurations of highest fidelity on load
  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch('/api/customers');
        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }
        const data = await res.json();
        setCustomers(data);
        if (data.length > 0) {
          setSelectedCustomerId(data[0].id);
        }
      } catch (err) {
        console.error('Error loading account index profiles:', err);
        setCustomers(mockCustomers);
        setSelectedCustomerId(mockCustomers[0]?.id ?? 'enterprise-corp');
      } finally {
        setIsLoading(false);
      }
    }
    loadCustomers();
  }, []);

  // Automatically dismiss the search error when the user starts entering characters or modifying the search profiles input
  useEffect(() => {
    setSearchError(null);
  }, [searchQuery]);

  // Search routing coordinate - handles search term redirects with deep object matching
  const handleEnterSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const match = customers.find((c) => {
      const nameMatch = c.name.toLowerCase().includes(query);
      const industryMatch = c.industry.toLowerCase().includes(query);
      const descMatch = c.description.toLowerCase().includes(query);
      const riskMatch = c.riskFactors?.some((r) => 
        r.name.toLowerCase().includes(query) || 
        r.detail.toLowerCase().includes(query)
      );
      const playbookMatch = c.recommendedPlaybooks?.some((pb) => 
        pb.name.toLowerCase().includes(query) || 
        pb.description.toLowerCase().includes(query)
      );

      return nameMatch || industryMatch || descMatch || riskMatch || playbookMatch;
    });

    if (match) {
      setSelectedCustomerId(match.id);
      setActiveTab('profile');
      setSearchQuery('');
      setSearchError(null);
    } else {
      setSearchError(`NOT_FOUND: NO METRIC PROFILE KEYWORD FOR "${searchQuery.toUpperCase()}"`);
      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setSearchError(null);
      }, 5000);
    }
  };

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setActiveTab('profile');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex flex-col items-center justify-center font-sans space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-secondary/25 blur-md rounded-full scale-150 animate-ping" />
          <Loader2 className="w-8 h-8 text-brand-secondary animate-spin" />
        </div>
        <p className="text-xs font-mono tracking-widest text-[#909097] uppercase animate-pulse">Establishing Secure Database Sync...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] relative text-white pb-32 font-sans md:subpixel-antialiased">
      {/* Background Particle Drift Canvas */}
      <ParticleBackground />

      {/* Shared Application Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onEnterSearch={handleEnterSearch}
      />

      {/* Main Container Core Stack */}
      <main className="mt-24 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        {searchError && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between text-rose-450 font-mono text-xs uppercase shadow-[0_0_15px_rgba(244,63,94,0.15)] animate-fade-in relative z-50">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>ERR_OUT_OF_BOUNDS: {searchError}</span>
            </div>
            <button onClick={() => setSearchError(null)} className="cursor-pointer hover:text-white font-bold ml-2 underline uppercase tracking-widest text-[9px]">Dismiss [X]</button>
          </div>
        )}

        {activeTab === 'overview' && (
          <OverviewTab
            customers={customers}
            onSelectCustomer={handleSelectCustomer}
          />
        )}
        
        {activeTab === 'profile' && (
          <ProfileTab
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            onSelectCustomer={setSelectedCustomerId}
          />
        )}

        {activeTab === 'simulate' && (
          <SimulateTab />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureTab />
        )}
      </main>

      {/* Standardized Bottom Fixed Floating navigation panel */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
