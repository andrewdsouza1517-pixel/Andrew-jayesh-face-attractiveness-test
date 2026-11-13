import React from 'react';
import { Sparkles, Sun, Smile, Focus } from 'lucide-react';
import type { ContributingFactor, VisualFeatures } from '../types/experiment';

interface ContributingFactorsListProps {
  factors: ContributingFactor[];
  featuresA?: VisualFeatures;
  featuresB?: VisualFeatures;
  nameA?: string;
  nameB?: string;
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
  nameA = 'Image A',
  nameB = 'Image B',
}) => {
  const getIcon = (factorName: string) => {
    const lower = factorName.toLowerCase();
    if (lower.includes('light') || lower.includes('exposure')) {
      return <Sun className="w-4 h-4 text-[#8C5E3C] dark:text-[#C99765]" />;
    }
    if (lower.includes('affect') || lower.includes('smile') || lower.includes('expression')) {
      return <Smile className="w-4 h-4 text-[#4A6B53] dark:text-[#6B9071]" />;
    }
    if (lower.includes('framing') || lower.includes('composition') || lower.includes('focus')) {
      return <Focus className="w-4 h-4 text-[#8C5E3C] dark:text-[#C99765]" />;
    }
    return <Sparkles className="w-4 h-4 text-[#8C5E3C] dark:text-[#C99765]" />;
  };

  return (
    <div className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-6 shadow-xs dark:shadow-xl space-y-5 transition-colors">
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E8E2D8] dark:border-[#3D332C]">
        <div>
          <h4 className="text-sm font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight">
            Detailed Explanation: Key Visual Differences
          </h4>
          <p className="text-xs text-[#5C4E43] dark:text-[#D4C7BC] mt-1 font-sans">
            This list explains the specific visual differences that had the biggest influence on the model’s final comparison.
          </p>
        </div>
        <span className="text-[11px] font-sans text-[#8C7D70] dark:text-[#A69688] shrink-0">
          Key Drivers
        </span>
      </div>

      <div className="space-y-3">
        {factors.map((factor, index) => {
          const isA = factor.favored === 'A';
          const isB = factor.favored === 'B';
          return (
            <div
              key={index}
              className="bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] dark:bg-[#221C18] dark:hover:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg p-3.5 transition flex items-start gap-3.5 shadow-2xs"
            >
              <div className="p-2 bg-white dark:bg-[#171311] rounded-md border border-[#E8E2D8] dark:border-[#3D332C] shrink-0 mt-0.5 shadow-2xs">
                {getIcon(factor.factor)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#211813] dark:text-[#F5EFEB] font-sans">
                    {factor.factor}
                  </span>

                  <span
                    className={`text-[11px] font-mono font-medium shrink-0 ${
                      isA
                        ? 'text-[#8C5E3C] dark:text-[#C99765]'
                        : isB
                        ? 'text-[#4A6B53] dark:text-[#6B9071]'
                        : 'text-[#8C7D70] dark:text-[#A69688]'
                    }`}
                  >
                    {isA ? `Favours ${nameA}` : isB ? `Favours ${nameB}` : 'Even Balance'}
                  </span>
                </div>

                <p className="text-xs text-[#5C4E43] dark:text-[#D4C7BC] mt-1 leading-relaxed font-sans">
                  {factor.impactDescription}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trait Comparison Table */}
      <div className="mt-4 pt-4 border-t border-[#E8E2D8] dark:border-[#3D332C]">
        <div className="text-[11px] font-mono font-semibold text-[#8C7D70] dark:text-[#A69688] uppercase tracking-wider mb-2.5">
          Detailed Axis Matrix (0–100)
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-[#FAF7F2]/60 dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] p-2.5 rounded-lg flex justify-between shadow-2xs">
            <span className="text-[#8C7D70] dark:text-[#A69688]">Lighting</span>
            <span className="text-[#211813] dark:text-[#F5EFEB]">
              <span className="text-[#8C5E3C] dark:text-[#C99765] font-bold tabular-nums">{featuresA.lightingQuality}</span> / <span className="text-[#4A6B53] dark:text-[#6B9071] font-bold tabular-nums">{featuresB.lightingQuality}</span>
            </span>
          </div>
          <div className="bg-[#FAF7F2]/60 dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] p-2.5 rounded-lg flex justify-between shadow-2xs">
            <span className="text-[#8C7D70] dark:text-[#A69688]">Framing</span>
            <span className="text-[#211813] dark:text-[#F5EFEB]">
              <span className="text-[#8C5E3C] dark:text-[#C99765] font-bold tabular-nums">{featuresA.compositionAndFraming}</span> / <span className="text-[#4A6B53] dark:text-[#6B9071] font-bold tabular-nums">{featuresB.compositionAndFraming}</span>
            </span>
          </div>
          <div className="bg-[#FAF7F2]/60 dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] p-2.5 rounded-lg flex justify-between shadow-2xs">
            <span className="text-[#8C7D70] dark:text-[#A69688]">Warmth</span>
            <span className="text-[#211813] dark:text-[#F5EFEB]">
              <span className="text-[#8C5E3C] dark:text-[#C99765] font-bold tabular-nums">{featuresA.expressionWarmth}</span> / <span className="text-[#4A6B53] dark:text-[#6B9071] font-bold tabular-nums">{featuresB.expressionWarmth}</span>
            </span>
          </div>
          <div className="bg-[#FAF7F2]/60 dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] p-2.5 rounded-lg flex justify-between shadow-2xs">
            <span className="text-[#8C7D70] dark:text-[#A69688]">Sharpness</span>
            <span className="text-[#211813] dark:text-[#F5EFEB]">
              <span className="text-[#8C5E3C] dark:text-[#C99765] font-bold tabular-nums">{featuresA.photoSharpness}</span> / <span className="text-[#4A6B53] dark:text-[#6B9071] font-bold tabular-nums">{featuresB.photoSharpness}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
