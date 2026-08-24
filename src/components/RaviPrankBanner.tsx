import React, { useState } from 'react';
import { Sparkles, RefreshCw, AlertTriangle, Flame, ShieldAlert } from 'lucide-react';

interface RaviPrankBannerProps {
  raviName: string;
  isSpokenPlaying?: boolean;
}

const RAVI_ROAST_POOL = [
  "Ravi has somehow achieved a score so low that the algorithm is requesting a software update.",
  "10/100. The committee reviewed the evidence, held an emergency meeting, and still couldn’t find the missing points.",
  "Ravi didn’t lose the matchup. Ravi lost the concept of scoring.",
  "The scoring system has officially filed a complaint against Ravi.",
  "Ravi has demonstrated a remarkable ability to turn a perfectly functional scoring model into a crisis.",
  "Ravi's score is currently undergoing a forensic audit after breaching all known lower bounds.",
  "The server CPU usage dropped to 0% out of sheer shock when calculating Ravi's score.",
  "Scientists are studying Ravi's 10/100 score as a new fundamental constant of physics.",
  "Ravi asked the model for a fair rating, and the model asked Ravi for an apology.",
  "10/100. Even the confidence interval refused to be associated with this result.",
  "Ravi's picture set off the error monitoring alert reserved for catastrophic system failures.",
  "The neural network tried to round 10 up to 50, but the math simply gave up."
];

export const RaviPrankBanner: React.FC<RaviPrankBannerProps> = ({ raviName }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  const handleNextRoast = () => {
    setCurrentIdx((prev) => (prev + 1) % RAVI_ROAST_POOL.length);
  };

  const currentRoast = RAVI_ROAST_POOL[currentIdx];

  return (
    <div
      id="ravi-prank-banner"
      className="bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-pink-950/80 border-2 border-purple-500/50 rounded-2xl p-6 shadow-2xl space-y-4 backdrop-blur-md relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
    >
      {/* Background ambient glowing accent */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Tag: REQUIRED DISCLAIMER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/30 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-mono font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            PRANK RESULT — FOR ENTERTAINMENT ONLY
          </span>
        </div>
        <span className="text-[10px] font-mono text-purple-300/70 uppercase tracking-wider bg-purple-900/40 px-2 py-0.5 rounded border border-purple-700/40">
          FICTIONAL COMEDIC OVERLAY
        </span>
      </div>

      {/* Headline & Score Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 tracking-tight flex items-center gap-2">
              RAVI PRANK MODE 😈
            </h3>
          </div>
          <p className="text-xs text-purple-200/80 mt-1">
            Special comedic simulation active for subject <span className="font-bold text-white">{raviName}</span>
          </p>
        </div>

        {/* Score Badge */}
        <div className="bg-purple-950/90 border border-purple-500/60 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-lg shadow-purple-950/50">
          <Flame className="w-6 h-6 text-pink-400 animate-pulse shrink-0" />
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold">
              FICTIONAL PRANK SCORE
            </div>
            <div className="text-lg font-black font-mono text-pink-300 tracking-tight">
              10/100 — ABSOLUTELY DISASTROUS
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Exaggerated Roast Box */}
      <div className="bg-slate-950/70 border border-purple-500/30 rounded-xl p-4 shadow-inner space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-pink-400" /> Dynamic Comedic Roast (#{currentIdx + 1})
          </span>
          <button
            id="spin-prank-roast-btn"
            onClick={handleNextRoast}
            className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/40 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            title="Generate a fresh joke"
          >
            <RefreshCw className="w-3 h-3 text-pink-300" />
            <span>Spin Fresh Roast 🎲</span>
          </button>
        </div>
        <p className="text-sm font-medium text-purple-100 italic leading-relaxed pt-1">
          "{currentRoast}"
        </p>
      </div>

      {/* Strict Compliance Footnote */}
      <div className="text-[11px] text-purple-300/70 bg-purple-950/30 border border-purple-800/40 rounded-lg p-2.5 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p className="leading-normal">
          <strong className="text-purple-200 font-semibold">Disclaimer:</strong> This 10/100 score is a fictional entertainment prank generated strictly because Prank Mode is ON for '{raviName}'. The genuine AI vision model and Bradley–Terry calculation remain completely unaltered and are displayed below.
        </p>
      </div>
    </div>
  );
};
