import React from 'react';
import {
  UploadCloud,
  ScanEye,
  Calculator,
  BarChart3,
  ArrowRight,
  Compass,
} from 'lucide-react';

interface StepItem {
  number: string;
  title: string;
  description: string;
  visitorTip: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepItem[] = [
  {
    number: '01',
    title: 'UPLOAD',
    description: 'Choose two images to compare.',
    visitorTip: 'Pick a ready-made sample pair or upload two portraits side-by-side.',
    icon: UploadCloud,
  },
  {
    number: '02',
    title: 'ANALYSE',
    description: 'ANDESHA uses AI to examine the selected visual characteristics of each image.',
    visitorTip: 'Examines lighting, expression warmth, framing, sharpness, and styling.',
    icon: ScanEye,
  },
  {
    number: '03',
    title: 'CALCULATE',
    description: 'Mathematical models turn the observations into a structured comparison.',
    visitorTip: 'Converts visual observations into calibrated comparative percentages.',
    icon: Calculator,
  },
  {
    number: '04',
    title: 'UNDERSTAND',
    description: 'Charts and explanations make the result easy to interpret.',
    visitorTip: 'Explore visual charts, plain-English summaries, and voice narration.',
    icon: BarChart3,
  },
];

interface HowItWorksSectionProps {
  onTryExperiment?: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onTryExperiment }) => {
  return (
    <section
      id="how-andesha-works"
      aria-labelledby="how-andesha-works-heading"
      className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-6 sm:p-8 shadow-xs dark:shadow-xl space-y-6 scroll-mt-24 transition-colors"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#E8E2D8] dark:border-[#3D332C]">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-[#8C7D70] dark:text-[#A69688] font-sans">
            <span className="font-mono font-semibold text-[#8C5E3C] dark:text-[#C99765] uppercase tracking-wider">
              Visitor Walkthrough
            </span>
            <span aria-hidden="true">·</span>
            <span>No Technical Background Needed</span>
          </div>
          <h2
            id="how-andesha-works-heading"
            className="text-2xl sm:text-3xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight"
          >
            How ANDESHA Works
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans">
            Follow four simple steps to see how artificial intelligence and mathematics work together to compare two photographs transparently.
          </p>
        </div>

        {onTryExperiment && (
          <button
            type="button"
            onClick={onTryExperiment}
            className="self-start md:self-auto px-4 py-2 rounded-lg text-xs font-medium text-[#8C5E3C] dark:text-[#C99765] bg-[#FAF7F2] hover:bg-[#F4EFEA] dark:bg-[#221C18] dark:hover:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 font-sans shadow-2xs"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Try a Live Comparison</span>
          </button>
        )}
      </div>

      {/* 4 Visual Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {STEPS.map((step, index) => {
          const IconComponent = step.icon;
          const isLast = index === STEPS.length - 1;
          return (
            <div
              key={step.number}
              className="group relative bg-[#FAF7F2]/70 dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] hover:border-[#8C5E3C]/50 dark:hover:border-[#C99765]/50 rounded-xl p-5 flex flex-col justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5 shadow-2xs"
            >
              {/* Top Row: Step Number & Icon */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] flex items-center justify-center text-[#8C5E3C] dark:text-[#C99765] shadow-2xs group-hover:scale-105 transition-transform duration-200">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-semibold tabular-nums text-[#8C7D70] dark:text-[#A69688] tracking-widest">
                    STEP {step.number}
                  </span>
                </div>

                {/* Title & Plain Description */}
                <div className="space-y-2">
                  <h3 className="text-base font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-wide">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#211813] dark:text-[#F5EFEB] font-medium leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Quiet Helpful Exhibition Hint */}
              <div className="pt-3 border-t border-[#E8E2D8] dark:border-[#3D332C]">
                <p className="text-[11px] text-[#8C7D70] dark:text-[#A69688] leading-relaxed font-sans">
                  {step.visitorTip}
                </p>
              </div>

              {/* Subtle Desktop Flow Connector */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className="hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C5E3C] dark:text-[#C99765] absolute -right-3 top-1/2 -translate-y-1/2 z-10 shadow-2xs"
                >
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
