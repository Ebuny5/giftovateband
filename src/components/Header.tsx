import React from 'react';
import { Activity, ShieldCheck, Radio, Sparkles, Download } from 'lucide-react';
import { SimulationPhase } from '../types/biometrics';

interface HeaderProps {
  phase: SimulationPhase;
  isAlertActive: boolean;
  onOpenInvestorKit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ phase, isAlertActive, onOpenInvestorKit }) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#090D16]/95 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-[1px] flex items-center justify-center shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Giftovate Band
              </h1>
              <span className="text-xs font-mono text-teal-400 font-semibold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/25">
                v1.0 Production
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span>Giftovate Therapeutics Ltd</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">Clinical EDA & HRV Wearable</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Live Status */}
        <div className="flex items-center gap-2.5 text-xs font-mono">
          {/* Investor & Website Asset Kit Button */}
          <button
            onClick={onOpenInvestorKit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 text-teal-300 border border-teal-500/40 rounded-xl font-medium transition-all shadow-sm cursor-pointer hover:scale-102"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Investor & Website Kit</span>
            <span className="sm:hidden">Assets</span>
          </button>

          {/* Live Status Ribbon */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <Radio className={`w-3.5 h-3.5 ${
              isAlertActive ? 'text-rose-400 animate-ping' : 'text-teal-400 animate-pulse'
            }`} />
            <span className="text-slate-300">
              {isAlertActive ? 'SURGE PRE-WARNING' : 'BLE 5.3 STREAM'}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">32 Hz</span>
          </div>
        </div>
      </div>
    </header>
  );
};
