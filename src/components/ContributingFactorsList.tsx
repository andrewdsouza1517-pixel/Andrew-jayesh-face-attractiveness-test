import React from 'react';
import { Sparkles, Sun, Smile, Focus, CheckCircle, ShieldCheck } from 'lucide-react';
import type { ContributingFactor, VisualFeatures } from '../types/experiment';

interface ContributingFactorsListProps {
  factors: ContributingFactor[];
  featuresA?: VisualFeatures;
  featuresB?: VisualFeatures;
}

export const ContributingFactorsList: React.FC<ContributingFactorsListProps> = ({
  factors = [],
  featuresA = {
    lightingQuality: 70,
    compositionAndFraming: 70,
    expressionWarmth: 70,
    symmetryAndHarmony: 70,
    photoSharpness: 70,
    presentationContext: '',
  },
  featuresB = {
    lightingQuality: 70,
    compositionAndFraming: 70,
    expressionWarmth: 70,
    symmetryAndHarmony: 70,
    photoSharpness: 70,
    presentationContext: '',
  },
}) => {
  const getIcon = (factorName: string) => {
    const lower = factorName.toLowerCase();
    if (lower.includes('light') || lower.includes('exposure')) {
      return <Sun className="w-4 h-4 text-amber-400" />;
    }
    if (lower.includes('affect') || lower.includes('smile') || lower.includes('expression')) {
      return <Smile className="w-4 h-4 text-emerald-400" />;
    }
    if (lower.includes('framing') || lower.includes('composition') || lower.includes('focus')) {
      return <Focus className="w-4 h-4 text-blue-400" />;
    }
    return <Sparkles className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
            Primary Visual Drivers
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Key photographic and aesthetic distinctions identified in this pair
          </p>
        </div>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
          EXPLAINABLE AI
        </span>
      </div>

      <div className="space-y-3">
        {factors.map((factor, index) => {
          const isA = factor.favored === 'A';
          const isB = factor.favored === 'B';
          return (
            <div
              key={index}
              className="bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 transition flex items-start gap-3.5"
            >
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-700/60 shrink-0 mt-0.5">
                {getIcon(factor.factor)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-200">
                    {factor.factor}
                  </span>

                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${
                      isA
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : isB
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {isA ? 'Favors Alpha' : isB ? 'Favors Bravo' : 'Neutral Balance'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {factor.impactDescription}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trait Comparison Table */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Detailed Axis Matrix (0–100)
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-800/30 border border-slate-700/40 p-2.5 rounded-lg flex justify-between">
            <span className="text-slate-400">Lighting</span>
            <span className="text-slate-200">
              <span className="text-blue-400 font-bold">{featuresA.lightingQuality}</span> / <span className="text-emerald-400 font-bold">{featuresB.lightingQuality}</span>
            </span>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/40 p-2.5 rounded-lg flex justify-between">
            <span className="text-slate-400">Framing</span>
            <span className="text-slate-200">
              <span className="text-blue-400 font-bold">{featuresA.compositionAndFraming}</span> / <span className="text-emerald-400 font-bold">{featuresB.compositionAndFraming}</span>
            </span>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/40 p-2.5 rounded-lg flex justify-between">
            <span className="text-slate-400">Warmth</span>
            <span className="text-slate-200">
              <span className="text-blue-400 font-bold">{featuresA.expressionWarmth}</span> / <span className="text-emerald-400 font-bold">{featuresB.expressionWarmth}</span>
            </span>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/40 p-2.5 rounded-lg flex justify-between">
            <span className="text-slate-400">Sharpness</span>
            <span className="text-slate-200">
              <span className="text-blue-400 font-bold">{featuresA.photoSharpness}</span> / <span className="text-emerald-400 font-bold">{featuresB.photoSharpness}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
