import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import type { ComparisonResult } from '../types/experiment';

interface BradleyTerryGaugeProps {
  result: ComparisonResult;
  nameA?: string;
  nameB?: string;
}

export const BradleyTerryGauge: React.FC<BradleyTerryGaugeProps> = ({ result, nameA = 'Subject Alpha', nameB = 'Subject Bravo' }) => {
  const { pairwiseProbabilities, bradleyTerryMetrics } = result;
  const probA = pairwiseProbabilities.preferenceA;
  const probB = pairwiseProbabilities.preferenceB;

  const percentA = Math.round(probA * 100);
  const percentB = Math.round(probB * 100);

  const [intervalLow, intervalHigh] = bradleyTerryMetrics.uncertaintyInterval;
  const intervalLowPercent = Math.round(intervalLow * 100);
  const intervalHighPercent = Math.round(intervalHigh * 100);

  const isAFavored = probA >= probB;
  const deltaPoints = Math.abs(bradleyTerryMetrics.scoreDelta);

  const confidenceBadgeColor = {
    High: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Moderate: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Low: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'High Uncertainty': 'bg-rose-500/10 text-red-400 border-rose-500/30',
  }[bradleyTerryMetrics.confidenceLevel] || 'bg-slate-800 text-slate-400 border-slate-700';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 backdrop-blur-md">
      {/* Top Heading */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
              Predicted Pairwise Preference Probability
            </h3>
            <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
              P(A &gt; B) BRADLEY–TERRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Latent psychometric distribution across generalized adult observer cohort
          </p>
        </div>

        {/* Confidence level badge */}
        <div className="flex items-center gap-2 font-mono">
          <span className="text-xs text-slate-400">CERTAINTY:</span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${confidenceBadgeColor}`}>
            {bradleyTerryMetrics.confidenceLevel}
          </span>
        </div>
      </div>

      {/* Main Dual Bar Visualizer */}
      <div className="space-y-3.5">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
            <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">{nameA}</span>
            <span className="text-3xl font-mono font-bold text-blue-400">{percentA}%</span>
          </div>

          <div className="text-sm font-black font-mono text-slate-600 italic tracking-widest">
            VS
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-mono font-bold text-emerald-400">{percentB}%</span>
            <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">{nameB}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          </div>
        </div>

        {/* Dual Progress Bar */}
        <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden flex border border-slate-700/60 shadow-inner">
          <div
            style={{ width: `${percentA}%` }}
            className="bg-gradient-to-r from-blue-600 to-blue-500 h-full transition-all duration-700 ease-out flex items-center justify-start pl-3 text-[10px] font-mono font-bold text-white shadow-md shadow-blue-500/30"
          >
            {percentA > 15 && `${percentA}%`}
          </div>
          <div
            style={{ width: `${percentB}%` }}
            className="bg-gradient-to-l from-emerald-600 to-emerald-500 h-full transition-all duration-700 ease-out flex items-center justify-end pr-3 text-[10px] font-mono font-bold text-white shadow-md shadow-emerald-500/30"
          >
            {percentB > 15 && `${percentB}%`}
          </div>
        </div>

        {/* Confidence Interval Error Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>90% Confidence Interval ({nameA}):</span>
            </span>
            <span className="font-semibold text-blue-400">
              [{intervalLowPercent}% — {intervalHighPercent}%]
            </span>
          </div>
          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/40">
            <div
              className="absolute top-0 bottom-0 bg-blue-500/40 rounded-full"
              style={{
                left: `${intervalLowPercent}%`,
                width: `${Math.max(4, intervalHighPercent - intervalLowPercent)}%`,
              }}
            />
            {/* Center tick */}
            <div
              className="absolute top-0 bottom-0 w-1.5 bg-blue-400 shadow-xs shadow-blue-400"
              style={{ left: `${percentA}%` }}
            />
          </div>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 block mb-1">
            Odds Ratio
          </span>
          <p className="text-2xl font-mono font-bold text-blue-400">
            {pairwiseProbabilities.oddsRatio.toFixed(2)}x
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            {isAFavored ? 'Favoring Alpha' : 'Favoring Bravo'}
          </span>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 block mb-1">
            Latent Delta (Δs)
          </span>
          <p className="text-2xl font-mono font-bold text-blue-400">
            {deltaPoints.toFixed(1)} <span className="text-xs font-normal text-slate-400">Logit</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            Bradley–Terry Scale
          </span>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 block mb-1">
            Model Tendency
          </span>
          <p className="text-sm font-semibold text-white mt-1">
            {Math.abs(percentA - 50) < 6 ? 'Equally Contested' : isAFavored ? `${nameA} Favored` : `${nameB} Favored`}
          </p>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            {Math.abs(percentA - 50) < 6 ? 'Within normal variation' : 'Empirical tendency'}
          </span>
        </div>
      </div>

      {/* Uncertainty Factors */}
      {bradleyTerryMetrics.uncertaintyFactors.length > 0 && (
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center gap-2 font-mono font-semibold text-slate-200">
            <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
            <span className="uppercase text-[11px] tracking-wider">Uncertainty & Variability Factors:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-xs pl-1">
            {bradleyTerryMetrics.uncertaintyFactors.map((uf, idx) => (
              <li key={idx}>{uf}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
