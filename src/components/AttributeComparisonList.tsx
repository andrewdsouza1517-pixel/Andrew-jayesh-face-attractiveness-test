import React from 'react';
import { Sliders, CheckCircle2, Minus, Info, Sparkles } from 'lucide-react';
import type { ComparisonAttribute } from '../types/experiment';

interface AttributeComparisonListProps {
  attributes: ComparisonAttribute[];
  nameA?: string;
  nameB?: string;
}

export const AttributeComparisonList: React.FC<AttributeComparisonListProps> = ({
  attributes = [],
  nameA = 'Person A',
  nameB = 'Person B',
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 backdrop-blur-md">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
              Model Visual Analysis Categories
            </h3>
            <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
              8 AXES
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comparative evaluation across standardized visual presentation and photographic dimensions
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-300 font-medium">{nameA}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300 font-medium">{nameB}</span>
          </div>
        </div>
      </div>

      {/* Attributes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attributes.map((attr, idx) => {
          const isWinnerA = attr.winner === 'A';
          const isWinnerB = attr.winner === 'B';
          const isTie = attr.winner === 'TIE';

          return (
            <div
              key={idx}
              className="bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 transition space-y-3"
            >
              {/* Category Name & Winner Tag */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-200">
                  {attr.name}
                </span>

                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${
                    isWinnerA
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : isWinnerB
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {isWinnerA ? `Favors ${nameA}` : isWinnerB ? `Favors ${nameB}` : 'Even Balance'}
                </span>
              </div>

              {/* Progress Bars for A and B */}
              <div className="space-y-2 text-xs font-mono">
                {/* Person A Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span className="text-blue-400 font-semibold">{nameA}</span>
                    <span>{attr.A} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/40">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.max(5, Math.min(100, attr.A))}%` }}
                    />
                  </div>
                </div>

                {/* Person B Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span className="text-emerald-400 font-semibold">{nameB}</span>
                    <span>{attr.B} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/40">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.max(5, Math.min(100, attr.B))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Explanation Note */}
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-700/30">
                {attr.explanation}
              </p>
            </div>
          );
        })}
      </div>

      {/* Category Disclaimer Callout */}
      <div className="pt-2 text-center text-[11px] text-slate-500 italic border-t border-slate-800 flex items-center justify-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>
          These are AI predictions of perceived attractiveness based on the model’s reference data, not objective measurements.
        </span>
      </div>
    </div>
  );
};
