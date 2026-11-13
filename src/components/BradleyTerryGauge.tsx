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
    High: 'text-[#4A6B53] dark:text-[#6B9071] border-[#4A6B53]/30',
    Moderate: 'text-[#8C5E3C] dark:text-[#C99765] border-[#8C5E3C]/30',
    Low: 'text-amber-700 dark:text-amber-400 border-amber-500/30',
    'High Uncertainty': 'text-rose-700 dark:text-rose-400 border-rose-500/30',
  }[bradleyTerryMetrics.confidenceLevel] || 'text-[#8C7D70] dark:text-[#A69688] border-[#E8E2D8]';

  const simpleConfidenceLabel =
    bradleyTerryMetrics.confidenceLevel === 'High'
      ? 'High confidence'
      : bradleyTerryMetrics.confidenceLevel === 'Moderate'
      ? 'Moderate confidence'
      : 'Lower confidence';

  return (
    <div className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-6 shadow-xs dark:shadow-xl space-y-6 transition-colors">
      {/* Top Heading */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8E2D8] dark:border-[#3D332C]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight">
              Comparison Probability & Confidence Gauge
            </h3>
            <span className="text-xs font-sans text-[#8C7D70] dark:text-[#A69688]">
              · Bradley–Terry Model
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] mt-1 font-sans">
            This chart shows how strongly the model favours each image overall and how wide the uncertainty range is.
          </p>
        </div>

        {/* Certainty Indicator */}
        <div className="flex items-center gap-2 font-sans text-xs">
          <span className="text-[#8C7D70] dark:text-[#A69688]">Model Certainty:</span>
          <span className={`px-2.5 py-1 rounded-md border font-semibold ${confidenceBadgeColor}`}>
            {simpleConfidenceLabel}
          </span>
        </div>
      </div>

      {/* Main Dual Bar Visualizer */}
      <div className="space-y-3.5">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8C5E3C] dark:bg-[#C99765]" />
            <span className="text-xs font-mono font-medium text-[#5C4E43] dark:text-[#D4C7BC] uppercase tracking-wider">{nameA}</span>
            <span className="text-3xl font-editorial font-medium tabular-nums text-[#8C5E3C] dark:text-[#C99765]">{percentA}%</span>
          </div>

          <div className="text-xs font-mono font-bold text-[#8C7D70] dark:text-[#A69688] italic tracking-widest">
            VS
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-editorial font-medium tabular-nums text-[#4A6B53] dark:text-[#6B9071]">{percentB}%</span>
            <span className="text-xs font-mono font-medium text-[#5C4E43] dark:text-[#D4C7BC] uppercase tracking-wider">{nameB}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A6B53] dark:bg-[#6B9071]" />
          </div>
        </div>

        {/* Dual Progress Bar */}
        <div className="relative h-3 bg-[#FAF7F2] dark:bg-[#171311] rounded-full overflow-hidden flex border border-[#E8E2D8] dark:border-[#3D332C]">
          <div
            style={{ width: `${percentA}%` }}
            className="bg-[#8C5E3C] dark:bg-[#C99765] h-full transition-all duration-700 ease-out flex items-center justify-start pl-3 text-[10px] font-mono font-bold text-white dark:text-[#171311]"
          >
            {percentA > 15 && `${percentA}%`}
          </div>
          <div
            style={{ width: `${percentB}%` }}
            className="bg-[#4A6B53] dark:bg-[#6B9071] h-full transition-all duration-700 ease-out flex items-center justify-end pr-3 text-[10px] font-mono font-bold text-white dark:text-[#171311]"
          >
            {percentB > 15 && `${percentB}%`}
          </div>
        </div>

        {/* Confidence Interval Error Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-[#8C7D70] dark:text-[#A69688] mb-1.5 font-mono">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#8C5E3C] dark:text-[#C99765]" />
              <span>90% Confidence Interval ({nameA}):</span>
            </span>
            <span className="font-semibold text-[#8C5E3C] dark:text-[#C99765]">
              [{intervalLowPercent}% — {intervalHighPercent}%]
            </span>
          </div>
          <div className="relative h-2 bg-[#FAF7F2] dark:bg-[#171311] rounded-full overflow-hidden border border-[#E8E2D8] dark:border-[#3D332C]/60">
            <div
              className="absolute top-0 bottom-0 bg-[#8C5E3C]/25 dark:bg-[#C99765]/30 rounded-full"
              style={{
                left: `${intervalLowPercent}%`,
                width: `${Math.max(4, intervalHighPercent - intervalLowPercent)}%`,
              }}
            />
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#8C5E3C] dark:bg-[#C99765]"
              style={{ left: `${percentA}%` }}
            />
          </div>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-[#FAF7F2]/60 dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg p-4 shadow-2xs">
          <span className="text-[10px] uppercase tracking-wider font-mono text-[#8C7D70] dark:text-[#A69688] block mb-1">
            Odds Ratio
          </span>
          <p className="text-2xl font-editorial font-medium tabular-nums text-[#8C5E3C] dark:text-[#C99765]">
            {pairwiseProbabilities.oddsRatio.toFixed(2)}x
          </p>
          <span className="text-[11px] text-[#5C4E43] dark:text-[#D4C7BC] mt-1 block font-sans">
            How many times more likely {isAFavored ? nameA : nameB} is favoured in a head-to-head comparison.
          </span>
        </div>

        <div className="bg-[#FAF7F2]/60 dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg p-4 shadow-2xs">
          <span className="text-[10px] uppercase tracking-wider font-mono text-[#8C7D70] dark:text-[#A69688] block mb-1">
            Score Gap (Δs)
          </span>
          <p className="text-2xl font-editorial font-medium tabular-nums text-[#8C5E3C] dark:text-[#C99765]">
            {deltaPoints.toFixed(1)} <span className="text-xs font-normal text-[#8C7D70] dark:text-[#A69688] font-mono">Logit</span>
          </p>
          <span className="text-[11px] text-[#5C4E43] dark:text-[#D4C7BC] mt-1 block font-sans">
            The overall score difference used to calculate the final probabilities.
          </span>
        </div>

        <div className="bg-[#FAF7F2]/60 dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg p-4 col-span-2 sm:col-span-1 shadow-2xs">
          <span className="text-[10px] uppercase tracking-wider font-mono text-[#8C7D70] dark:text-[#A69688] block mb-1">
            Comparison Margin
          </span>
          <p className="text-sm font-semibold text-[#211813] dark:text-[#F5EFEB] mt-1 font-sans">
            {Math.abs(percentA - 50) < 6 ? 'Close Match' : isAFavored ? `${nameA} Favoured` : `${nameB} Favoured`}
          </p>
          <span className="text-[11px] text-[#5C4E43] dark:text-[#D4C7BC] font-sans mt-1 block">
            {Math.abs(percentA - 50) < 6 ? 'Scores are within a narrow margin' : 'Based on the measured visual differences'}
          </span>
        </div>
      </div>

      {/* Uncertainty Factors */}
      {bradleyTerryMetrics.uncertaintyFactors.length > 0 && (
        <div className="bg-[#FAF7F2]/60 dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg p-4 text-xs text-[#5C4E43] dark:text-[#D4C7BC] space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 font-mono font-semibold text-[#211813] dark:text-[#F5EFEB]">
            <AlertCircle className="w-3.5 h-3.5 text-[#8C5E3C] dark:text-[#C99765]" />
            <span className="uppercase text-[11px] tracking-wider">Uncertainty & Variability Factors:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[#8C7D70] dark:text-[#A69688] text-xs pl-1 font-sans">
            {bradleyTerryMetrics.uncertaintyFactors.map((uf, idx) => (
              <li key={idx}>{uf}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
