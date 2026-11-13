import React from 'react';
import { Info } from 'lucide-react';
import type { ComparisonAttribute } from '../types/experiment';

interface AttributeComparisonListProps {
  attributes: ComparisonAttribute[];
  nameA?: string;
  nameB?: string;
}

const getFriendlyCategoryInfo = (rawName: string): { title: string; hint?: string } => {
  const normalized = rawName.trim().toLowerCase();
  if (normalized.includes('symmetry') || normalized.includes('proportionality')) {
    return {
      title: 'Visual Balance & Symmetry',
      hint: 'How balanced and proportional the features appear in the portrait',
    };
  }
  if (normalized.includes('grooming')) {
    return {
      title: 'Grooming & Neatness',
      hint: 'Overall neatness and portrait preparation',
    };
  }
  if (normalized.includes('facial presentation')) {
    return {
      title: 'Facial Presentation',
      hint: 'Clarity and natural visibility of facial features',
    };
  }
  if (normalized.includes('hairstyle') || normalized === 'hair') {
    return {
      title: 'Hair Styling',
      hint: 'How hair framing complements the overall portrait',
    };
  }
  if (normalized.includes('expression')) {
    return {
      title: 'Facial Expression & Warmth',
      hint: 'Openness, smile, and approachable demeanor',
    };
  }
  if (normalized.includes('harmony')) {
    return {
      title: 'Overall Visual Harmony',
      hint: 'How cohesively all visual elements work together',
    };
  }
  if (normalized === 'styling') {
    return {
      title: 'Wardrobe & Styling',
      hint: 'Clothing and overall visual styling',
    };
  }
  if (normalized.includes('image conditions') || normalized.includes('lighting')) {
    return {
      title: 'Lighting, Framing & Sharpness',
      hint: 'Camera focus, brightness, and framing quality',
    };
  }
  return { title: rawName };
};

export const AttributeComparisonList: React.FC<AttributeComparisonListProps> = ({
  attributes = [],
  nameA = 'Image A',
  nameB = 'Image B',
}) => {
  return (
    <div className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-6 shadow-xs dark:shadow-xl space-y-6 transition-colors">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8E2D8] dark:border-[#3D332C]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight">
              Category Breakdown: 8 Visual Characteristics
            </h3>
            <span className="text-xs font-sans text-[#8C7D70] dark:text-[#A69688]">
              · 0–100 Scale
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] mt-1 font-sans">
            This chart compares both images category by category so you can see where each image scored higher.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-sans">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8C5E3C] dark:bg-[#C99765]" />
            <span className="text-[#5C4E43] dark:text-[#D4C7BC] font-medium">{nameA}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A6B53] dark:bg-[#6B9071]" />
            <span className="text-[#5C4E43] dark:text-[#D4C7BC] font-medium">{nameB}</span>
          </div>
        </div>
      </div>

      {/* Attributes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attributes.map((attr, idx) => {
          const isWinnerA = attr.winner === 'A';
          const isWinnerB = attr.winner === 'B';
          const friendly = getFriendlyCategoryInfo(attr.name);

          return (
            <div
              key={idx}
              className="bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] dark:bg-[#221C18] dark:hover:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg p-4 transition space-y-3 shadow-2xs"
            >
              {/* Category Name & Winner Label */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-sm font-semibold text-[#211813] dark:text-[#F5EFEB] font-sans block">
                    {friendly.title}
                  </span>
                  {friendly.hint && (
                    <span className="text-[11px] text-[#8C7D70] dark:text-[#A69688] font-sans block">
                      {friendly.hint}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[11px] font-mono font-medium shrink-0 ${
                    isWinnerA
                      ? 'text-[#8C5E3C] dark:text-[#C99765]'
                      : isWinnerB
                      ? 'text-[#4A6B53] dark:text-[#6B9071]'
                      : 'text-[#8C7D70] dark:text-[#A69688]'
                  }`}
                >
                  {isWinnerA ? `Higher: ${nameA}` : isWinnerB ? `Higher: ${nameB}` : 'Even Match'}
                </span>
              </div>

              {/* Progress Bars for A and B */}
              <div className="space-y-2 text-xs font-mono">
                {/* Image A Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#8C7D70] dark:text-[#A69688]">
                    <span className="text-[#8C5E3C] dark:text-[#C99765] font-semibold font-sans">{nameA}</span>
                    <span className="tabular-nums">{attr.A} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-[#FAF7F2] dark:bg-[#171311] rounded-full overflow-hidden border border-[#E8E2D8] dark:border-[#3D332C]">
                    <div
                      className="h-full bg-[#8C5E3C] dark:bg-[#C99765] rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.max(5, Math.min(100, attr.A))}%` }}
                    />
                  </div>
                </div>

                {/* Image B Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#8C7D70] dark:text-[#A69688]">
                    <span className="text-[#4A6B53] dark:text-[#6B9071] font-semibold font-sans">{nameB}</span>
                    <span className="tabular-nums">{attr.B} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-[#FAF7F2] dark:bg-[#171311] rounded-full overflow-hidden border border-[#E8E2D8] dark:border-[#3D332C]">
                    <div
                      className="h-full bg-[#4A6B53] dark:bg-[#6B9071] rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.max(5, Math.min(100, attr.B))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Explanation Note */}
              <p className="text-xs text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed pt-2 border-t border-[#E8E2D8] dark:border-[#3D332C]/60 font-sans">
                {attr.explanation}
              </p>
            </div>
          );
        })}
      </div>

      {/* Category Disclaimer Callout */}
      <div className="pt-3 text-center text-xs text-[#5C4E43] dark:text-[#D4C7BC] border-t border-[#E8E2D8] dark:border-[#3D332C] flex items-center justify-center gap-2 font-sans">
        <Info className="w-4 h-4 text-[#8C5E3C] dark:text-[#C99765] shrink-0" />
        <span>
          These scores show how the model evaluated the selected visual characteristics. They are model-generated estimates, not objective measurements.
        </span>
      </div>
    </div>
  );
};
