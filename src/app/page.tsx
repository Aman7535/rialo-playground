'use client';

import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Zap, 
  Cpu, 
  Terminal, 
  Wifi,
  Info,
  PlayCircle,
  Rocket,
  Hash,
  ExternalLink,
  Lightbulb,
  X,
  ToggleLeft,
  ToggleRight,
  Clock
} from 'lucide-react';

interface Event {
  id: string;
  type: string;
  price: number;
  outcome: string;
  timestamp: string;
  isSimulated?: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLegacyMode, setIsLegacyMode] = useState(false); 
  const [showIntro, setShowIntro] = useState(true); 
  const [showInfo, setShowInfo] = useState(false); 
  const [txLogs, setTxLogs] = useState<string[]>([]);
  const [logicToast, setLogicToast] = useState<{title: string, desc: string, type: 'success' | 'danger'} | null>(null);

  const { data, isLoading } = useSWR('/api/events', fetcher, {
    refreshInterval: 2000,
    revalidateOnFocus: false,
  });

  const events: Event[] = data?.events || [];
  const latestEvent = events[0];
  const currentPrice = latestEvent?.price || 0;
  const isUp = latestEvent?.type === 'PRICE_UP';
  const isDown = latestEvent?.type === 'PRICE_DOWN';

  const addLog = (msg: string) => {
    setTxLogs(prev => [`> ${msg}`, ...prev].slice(0, 8)); 
  };

  const executeRialoLogic = async (action: 'CRASH' | 'PUMP') => {
    if (action === 'CRASH') {
        setLogicToast({
          title: '⚡ RIALO EVENT DETECTED',
          desc: 'Market Crash signal processed instantly. "Protective Logic" executed in same block.',
          type: 'danger'
        });
      } else {
        setLogicToast({
          title: '⚡ RIALO EVENT DETECTED',
          desc: 'Price Surge signal processed instantly. "Opportunity Logic" executed in same block.',
          type: 'success'
        });
      }
      setTimeout(() => setLogicToast(null), 5000);
  
      addLog(`[RIALO] SIGNAL RECEIVED: ${action}`);
      addLog(`[RIALO] 0x${Math.random().toString(16).substr(2, 6)}... EXECUTED`);
      
      try {
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        });
        
        setTimeout(() => addLog(`[RIALO] FINALITY REACHED (12ms)`), 200);
        mutate('/api/events'); 
      } catch (e) {
        console.error(e);
      } finally {
        setTimeout(() => setIsSimulating(false), 500);
      }
  };

  const executeLegacyLogic = async (action: 'CRASH' | 'PUMP') => {
    addLog(`[LEGACY] Transaction submitted...`);
    setTimeout(() => addLog(`[ORACLE] Polling external API... (Waiting)`), 800);
    setTimeout(() => addLog(`[CHAIN] Waiting for block confirmation...`), 2000);
    
    setTimeout(async () => {
        try {
            await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });
            mutate('/api/events');
            
            addLog(`[LEGACY] State updated after 3200ms delay.`);
            
            if (action === 'CRASH') {
                setLogicToast({
                  title: '🐢 LEGACY UPDATE COMPLETE',
                  desc: 'Oracle finally updated state after polling delay. Protective logic triggered late.',
                  type: 'danger'
                });
            } else {
                setLogicToast({
                  title: '🐢 LEGACY UPDATE COMPLETE',
                  desc: 'Oracle finally updated state after polling delay. Opportunity logic triggered late.',
                  type: 'success'
                });
            }
            setTimeout(() => setLogicToast(null), 5000);

        } catch(e) {
            console.error(e);
        } finally {
            setIsSimulating(false);
        }
    }, 3200);
  };

  const simulateEvent = async (action: 'CRASH' | 'PUMP') => {
    setIsSimulating(true);
    if (isLegacyMode) {
        await executeLegacyLogic(action);
    } else {
        await executeRialoLogic(action);
    }
  };

  return (
    <main className="h-[100dvh] lg:min-h-screen p-2 md:p-8 max-w-7xl mx-auto flex flex-col gap-2 lg:gap-6 overflow-hidden lg:overflow-visible relative">
      
      {/* === LOGIC TOAST (Position Fixed for Mobile/PC) === */}
      {logicToast && (
        <div className="absolute left-4 right-4 z-50 bottom-4 md:bottom-auto md:top-4 md:left-1/2 md:-translate-x-1/2 md:w-[500px] animate-in slide-in-from-bottom-4 md:slide-in-from-top-4 duration-300">
          <div className={`p-4 rounded-xl border backdrop-blur-xl shadow-2xl flex gap-4 relative ${
            logicToast.type === 'danger' 
              ? 'bg-rose-950/90 border-rose-500/50' 
              : 'bg-emerald-950/90 border-emerald-500/50'
          }`}>
            <button 
              onClick={() => setLogicToast(null)}
              className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-white/50" />
            </button>
            <div className={`p-2 rounded-lg h-fit ${
              logicToast.type === 'danger' ? 'bg-rose-500/20' : 'bg-emerald-500/20'
            }`}>
              {isLegacyMode ? <Clock className={`w-5 h-5 ${logicToast.type === 'danger' ? 'text-rose-400' : 'text-emerald-400'}`} /> : <Zap className={`w-5 h-5 ${logicToast.type === 'danger' ? 'text-rose-400' : 'text-emerald-400'}`} />}
            </div>
            <div className="flex-1">
              <h4 className={`text-sm font-bold mb-1 ${
                logicToast.type === 'danger' ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {logicToast.title}
              </h4>
              <p className="text-xs text-white/90 leading-relaxed">
                {logicToast.desc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* === 1. INTRO POPUP === */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-2xl max-h-[85dvh] overflow-y-auto bg-[#0B0F19] border border-violet-500/30 rounded-2xl shadow-2xl p-5 md:p-10 flex flex-col gap-4 md:gap-6 relative custom-scrollbar">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="relative z-10 text-center space-y-2 flex-shrink-0">
              <div className="inline-flex items-center justify-center mb-2 md:mb-4 rounded-xl overflow-hidden border border-violet-500/20 w-12 h-12 md:w-16 md:h-16">
                <img src="/logo.jpg" alt="Rialo Logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Welcome to Rialo Playground
              </h1>
              <p className="text-gray-400 text-xs md:text-base font-mono">
                EVENT-NATIVE BLOCKCHAIN SIMULATION
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-3 md:gap-6 relative z-10 my-2 md:my-4">
              <div className="space-y-2 md:space-y-3 p-3 md:p-4 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-colors">
                <h3 className="text-violet-400 font-bold flex items-center gap-2 text-xs md:text-sm">
                  <Terminal className="w-3 h-3 md:w-4 md:h-4" /> PROJECT OBJECTIVE
                </h3>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                  Traditional blockchains wait for data. Rialo reacts to it. This project visualizes how an event-driven model eliminates latency by turning price updates into instant on-chain actions.
                </p>
              </div>
              <div className="space-y-2 md:space-y-3 p-3 md:p-4 rounded-xl bg-white/5 border border-white/5 hover:border-fuchsia-500/30 transition-colors">
                <h3 className="text-fuchsia-400 font-bold flex items-center gap-2 text-xs md:text-sm">
                  <Zap className="w-3 h-3 md:w-4 md:h-4" /> HOW IT WORKS
                </h3>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                  The system listens to a live BTC data stream. The <strong>Rule Engine</strong> instantly processes data and emits semantic outcomes (e.g., VOLATILITY_SPIKE) in real-time.
                </p>
              </div>
            </div>

            <div className="relative z-10 text-center -mt-2">
              <a 
                href="https://rialo.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition-colors border-b border-violet-500/30 pb-0.5 hover:border-violet-400"
              >
                For more info visit official site rialo.io <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <button 
              onClick={() => setShowIntro(false)}
              className="relative z-10 w-full py-3 md:py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group flex-shrink-0"
            >
              <Rocket className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              INITIALIZE SYSTEM
            </button>
            <p className="text-center text-[9px] md:text-[10px] text-gray-600 font-mono flex-shrink-0 uppercase">
              MADE BY AMAN FOR RIALO❤️
            </p>
          </div>
        </div>
      )}

      {/* === 2. MAIN DASHBOARD === */}
      <header className="flex-shrink-0 flex justify-between items-center border-b border-white/10 pb-2 md:pb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden border border-violet-500/20">
            <img src="/logo.jpg" alt="Rialo Logo" className="w-full h-full object-cover" />
          </div>

          <div>
            <h1 className="text-lg md:text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              RIALO <span className="text-white/40 font-mono text-sm md:text-lg">PLAYGROUND</span>
            </h1>
            <p className="text-gray-500 text-[10px] md:text-sm font-mono hidden md:block uppercase">
              EVENT-NATIVE EXECUTION ENGINE 
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          
          <button 
            onClick={() => setShowIntro(true)}
            className="flex md:hidden items-center gap-2 px-3 py-1.5 text-[10px] font-mono border border-white/10 rounded-full hover:bg-white/5 transition-colors"
          >
            <Info className="w-3 h-3 text-violet-400" />
            INFO
          </button>

          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-mono border border-white/10 rounded-full hover:bg-white/5 transition-colors"
          >
            <Info className="w-4 h-4 text-violet-400" />
            {showInfo ? 'HIDE CONTEXT' : 'INFO'}
          </button>

          <div className="flex items-center gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] md:text-xs font-bold text-emerald-400 tracking-wider">ONLINE</span>
          </div>
        </div>
      </header>

      {/* --- CONTEXT PANEL (Desktop) --- */}
      {showInfo && (
        <section className="hidden md:grid animate-slide-in grid-cols-2 gap-6 p-6 rounded-2xl bg-violet-950/10 border border-violet-500/20 flex-shrink-0">
          <div>
            <h3 className="text-violet-400 font-bold mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> PROJECT OBJECTIVE
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
               Traditional blockchains wait for data. Rialo reacts to it. This project visualizes how an event-driven model eliminates latency by turning price updates into instant on-chain actions.
            </p>
          </div>
          <div className="flex flex-col h-full">
            <h3 className="text-fuchsia-400 font-bold mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" /> HOW IT WORKS
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              The <strong>Rule Engine</strong> listens to the BTC data stream. When you inject events (Pump/Crash), the system instantly emits semantic outcomes.
            </p>
            
            <div className="mt-auto pt-2 border-t border-white/10">
               <a 
                href="https://rialo.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                For more info visit official site rialo.io <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* --- CONTENT AREA --- */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-6 flex-1 overflow-hidden lg:overflow-visible">
        
        <div className="lg:col-span-4 flex flex-col gap-2 lg:gap-4 flex-shrink-0">
          <div className="flex flex-row lg:flex-col gap-2 lg:gap-3 lg:h-auto">
            
            {/* Price Card */}
            <div className="flex-1 lg:flex-none relative overflow-hidden p-3 lg:p-6 rounded-xl lg:rounded-2xl border border-white/10 bg-[#0B0F19] backdrop-blur-xl shadow-2xl flex flex-col justify-center">
              
              <div className="absolute top-0 right-0 p-2 lg:p-4 opacity-10 block">
                <Cpu className="w-12 h-12 lg:w-24 lg:h-24" />
              </div>

              <h2 className="text-[10px] lg:text-sm text-gray-400 font-mono mb-0 lg:mb-2 flex items-center gap-2">
                <Activity className="w-3 h-3 lg:w-4 lg:h-4" /> BTC/USD
              </h2>
              <div className="flex items-baseline gap-2 mb-0 lg:mb-4">
                <span className={`text-xl md:text-5xl font-bold tracking-tighter ${isUp ? 'text-emerald-400 text-glow-green' : isDown ? 'text-rose-400 text-glow-red' : 'text-white'}`}>
                  {currentPrice > 0 ? `$${currentPrice.toLocaleString()}` : '---'}
                </span>
              </div>
              
              <div className={`flex items-center gap-1 lg:gap-2 text-[10px] lg:text-sm font-mono ${isUp ? 'text-emerald-400' : isDown ? 'text-rose-400' : 'text-gray-500'}`}>
                {isUp ? <ArrowUpRight className="w-3 h-3 lg:w-5 lg:h-5" /> : isDown ? <ArrowDownRight className="w-3 h-3 lg:w-5 lg:h-5" /> : <Minus className="w-3 h-3 lg:w-5 lg:h-5" />}
                <span>{isUp ? 'BULLISH' : isDown ? 'BEARISH' : 'WAITING...'}</span>
              </div>
            </div>

            {/* Simulation Buttons */}
            <div className="flex-1 lg:flex-none p-2 lg:p-6 rounded-xl lg:rounded-2xl border border-white/10 bg-[#0B0F19] flex flex-col justify-center gap-1 lg:gap-4">
               <h3 className="hidden lg:flex text-xs text-gray-500 font-bold uppercase tracking-widest items-center gap-2">
                <PlayCircle className="w-3 h-3" /> Simulation
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-full lg:h-auto">
                <button 
                  onClick={() => simulateEvent('PUMP')}
                  disabled={isSimulating}
                  className="p-2 lg:p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg active:bg-emerald-500/30 active:scale-95 transition-all flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-2 group"
                >
                  <ArrowUpRight className="w-4 h-4 lg:w-6 lg:h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] lg:text-xs font-bold text-emerald-400">PUMP</span>
                </button>
                <button 
                  onClick={() => simulateEvent('CRASH')}
                  disabled={isSimulating}
                  className="p-2 lg:p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg active:bg-rose-500/30 active:scale-95 transition-all flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-2 group"
                >
                  <ArrowDownRight className="w-4 h-4 lg:w-6 lg:h-6 text-rose-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] lg:text-xs font-bold text-rose-400">CRASH</span>
                </button>
              </div>
            </div>
          </div>

          {/* === ENGINE METRICS & LEGACY TOGGLE === */}
          <div className="flex lg:flex p-2 lg:p-6 rounded-xl lg:rounded-2xl border border-white/10 bg-[#0B0F19]/50 flex-col gap-2 lg:gap-4 h-32 lg:h-auto lg:flex-1">
            <div className="flex items-center justify-between w-full">
                <h3 className="flex text-[10px] lg:text-xs text-gray-500 font-bold uppercase tracking-widest items-center gap-2">
                <Zap className="w-3 h-3" /> Engine Metrics
                </h3>
                
                <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider">
                        CHOOSE MODE:
                    </span>
                    <button 
                        onClick={() => setIsLegacyMode(!isLegacyMode)}
                        className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity active:scale-95"
                    >
                        <span className={`text-[10px] lg:text-xs font-bold ${isLegacyMode ? 'text-gray-500' : 'text-violet-400'}`}>
                            {isLegacyMode ? 'LEGACY' : 'RIALO'}
                        </span>
                        {isLegacyMode ? (
                            <ToggleLeft className="w-8 h-8 text-gray-500" />
                        ) : (
                            <ToggleRight className="w-8 h-8 text-violet-500" />
                        )}
                    </button>
                </div>
            </div>
            
            <div className="hidden lg:flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
              <span className="text-xs text-gray-400">Mode</span>
              <span className={`text-xs font-mono ${isLegacyMode ? 'text-yellow-500' : 'text-fuchsia-400'}`}>
                {isLegacyMode ? 'ORACLE_POLLING' : 'EVENT_NATIVE'}
              </span>
            </div>

            <div className="flex-1 bg-black/40 rounded-lg border border-white/5 p-2 lg:p-3 font-mono text-[9px] lg:text-[10px] relative overflow-hidden flex flex-col">
              <div className="absolute top-2 right-2 text-gray-600">
                <Hash className="w-3 h-3" />
              </div>
              <div className="text-gray-500 mb-1 lg:mb-2 border-b border-white/5 pb-1">
                // EXEC_LOG
              </div>
              <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                {txLogs.length === 0 && (
                  <span className="text-gray-700 italic">Idle...</span>
                )}
                {txLogs.map((log, i) => (
                  <div key={i} className={`animate-slide-in break-all leading-tight ${log.includes('LEGACY') || log.includes('ORACLE') || log.includes('CHAIN') ? 'text-yellow-500/80' : 'text-emerald-500/90'}`}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN (EVENT LIST) === */}
        <div className="lg:col-span-8 flex flex-col rounded-xl lg:rounded-2xl border border-white/10 bg-[#0B0F19] overflow-hidden flex-1 lg:h-auto">
          <div className="p-2 lg:p-4 border-b border-white/10 bg-white/5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-xs lg:text-sm font-mono text-gray-300">
              <Terminal className="w-3 h-3 lg:w-4 lg:h-4 text-violet-400" />
              <span>LIVE_LOG</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-red-500/20"></div>
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-yellow-500/20"></div>
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-green-500/20"></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 lg:p-4 space-y-2 bg-black/20">
            {isLoading && (
               <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-600 animate-pulse">
                 <Wifi className="w-6 h-6" />
                 <span className="text-xs font-mono">SYNCING...</span>
               </div>
            )}
            
            {events.map((evt, i) => (
              <div 
                key={evt.id}
                className={`
                  animate-slide-in
                  relative overflow-hidden group
                  flex items-center justify-between p-3 lg:p-4 rounded-lg
                  border 
                  ${evt.isSimulated ? 'border-orange-500/30 bg-orange-950/10' : 'border-white/5 bg-gradient-to-r from-[#111] to-[#0d0d0d]'}
                  transition-all duration-300
                `}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {evt.isSimulated && (
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500/50"></div>
                )}
                
                <div className="flex items-center gap-3 lg:gap-4 relative z-10">
                  <div className={`
                    w-8 h-8 lg:w-10 lg:h-10 rounded-md flex items-center justify-center border
                    ${evt.type === 'PRICE_UP' ? 'bg-emerald-500/10 border-emerald-500/20' : 
                      evt.type === 'PRICE_DOWN' ? 'bg-rose-500/10 border-rose-500/20' : 
                      'bg-gray-800/50 border-gray-700'}
                  `}>
                    {evt.type === 'PRICE_UP' ? <ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-400" /> :
                     evt.type === 'PRICE_DOWN' ? <ArrowDownRight className="w-4 h-4 lg:w-5 lg:h-5 text-rose-400" /> :
                     <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] lg:text-xs font-mono text-gray-500">{evt.type}</span>
                    </div>
                    <span className="text-white font-mono text-sm lg:text-base font-medium">${evt.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 relative z-10">
                  <div className={`
                    px-2 py-0.5 lg:px-3 lg:py-1 rounded text-[9px] lg:text-[10px] font-bold font-mono tracking-wider border
                    ${evt.outcome.includes('SPIKE') ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                      evt.outcome.includes('UP') ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                      evt.outcome.includes('DOWN') ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' :
                      'text-gray-400 border-gray-700 bg-gray-800/50'}
                  `}>
                    {evt.outcome}
                  </div>
                  <span className="text-[10px] text-gray-600 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour12: false })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-1 lg:p-2 bg-black/40 border-t border-white/5 text-[9px] lg:text-[10px] text-gray-600 font-mono text-center flex-shrink-0 uppercase">
             /// MADE BY AMAN FOR RIALO❤️
          </div>
        </div>
      </div>
    </main>
  );
}

function Minus({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
