import React from 'react';
import { BookOpen, History, RotateCcw, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenMethodology: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMethodology,
  onOpenHistory,
  historyCount,
  onReset,
}) => {
  return (
    <header className="bg-slate-900/75 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-md shadow-blue-500/20">
            Ψ
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                Pairwise Perception Lab
                <span className="text-[10px] font-mono text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
                  v2.4.1-beta
                </span>
              </h1>
              <span className="hidden sm:inline-flex text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Bradley–Terry Engine
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Model Active</span>
              </div>
              <span className="text-slate-700">•</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded">
                18+ Research Only
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            id="open-methodology-btn"
            onClick={onOpenMethodology}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/70 transition flex items-center gap-1.5 cursor-pointer"
            title="View psychometric framework and mathematical model"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Methodology</span>
            <span className="md:hidden">Theory</span>
          </button>

          <button
            id="open-history-btn"
            onClick={onOpenHistory}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/70 transition flex items-center gap-1.5 relative cursor-pointer"
            title="View session comparison history"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-blue-600 text-white rounded-full text-[10px] font-mono font-bold">
                {historyCount}
              </span>
            )}
          </button>

          <button
            id="reset-experiment-btn"
            onClick={onReset}
            className="p-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-700/70 transition cursor-pointer"
            title="Reset active comparison"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
