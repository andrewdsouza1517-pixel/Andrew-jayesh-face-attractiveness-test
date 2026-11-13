import React, { useState } from 'react';
import {
  Play,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  X,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface ExhibitionModeGuideProps {
  currentStep: number; // 1 to 4
  onStepChange: (step: number) => void;
  onExit: () => void;
  hasResult: boolean;
  onRunComparison: () => void;
  onOpenMethodology: () => void;
}

export const ExhibitionModeGuide: React.FC<ExhibitionModeGuideProps> = ({
  currentStep,
  onStepChange,
  onExit,
  hasResult,
  onRunComparison,
  onOpenMethodology,
}) => {
  const [isPresenterNotesOpen, setIsPresenterNotesOpen] = useState<boolean>(true);

  const steps = [
    {
      number: 1,
      title: '01 — CHOOSE',
      subtitle: 'Select two images',
      hint: 'Explain: AI first examines the selected visual characteristics.',
      targetId: 'comparison-lab-section',
    },
    {
      number: 2,
      title: '02 — ANALYSE',
      subtitle: 'Let ANDESHA examine visual characteristics',
      hint: 'Explain: The two images are then compared mathematically.',
      targetId: 'run-compare-btn',
    },
    {
      number: 3,
      title: '03 — COMPARE',
      subtitle: 'See how the mathematical model processes the analysis',
      hint: 'Explain: Probability represents the model\'s relative preference.',
      targetId: 'in-simple-words-card',
    },
    {
      number: 4,
      title: '04 — UNDERSTAND',
      subtitle: 'Explore the result, charts and explanation',
      hint: 'Explain: Confidence describes how consistent the model is with its prediction.',
      targetId: 'explore-the-data',
    },
  ];

  const activeStepInfo = steps[currentStep - 1] || steps[0];

  const handleNext = () => {
    if (currentStep < 4) {
      const next = currentStep + 1;
      onStepChange(next);
      scrollToTarget(steps[next - 1].targetId);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      onStepChange(prev);
      scrollToTarget(steps[prev - 1].targetId);
    }
  };

  const scrollToTarget = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="bg-[#211813] dark:bg-[#1E1815] text-[#FAF7F2] dark:text-[#F5EFEB] border border-[#8C5E3C]/40 dark:border-[#C99765]/40 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 sticky top-4 z-50 transition-all">
      {/* Top Header & Exit */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#3D332C]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C99765]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>ANDESHA — Live Demonstration Mode</span>
          </div>
          <h2 className="text-lg sm:text-xl font-editorial font-medium tracking-tight">
            Follow the steps to see how AI, mathematics and data come together.
          </h2>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#3D2C21] hover:bg-[#5C4E43] text-[#FAF7F2] transition flex items-center gap-1.5 cursor-pointer font-sans"
        >
          <X className="w-4 h-4" />
          <span>Exit Exhibition Mode</span>
        </button>
      </div>

      {/* 4 Steps Indicator Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {steps.map((st) => {
          const isCurrent = currentStep === st.number;
          const isDone = currentStep > st.number;
          return (
            <button
              key={st.number}
              type="button"
              onClick={() => {
                onStepChange(st.number);
                scrollToTarget(st.targetId);
              }}
              className={`p-3 rounded-xl border text-left transition cursor-pointer space-y-1 ${
                isCurrent
                  ? 'bg-[#C99765] text-[#171311] border-[#DDB082] shadow-md font-medium'
                  : isDone
                  ? 'bg-[#2B231F] text-[#D4C7BC] border-[#3D332C]'
                  : 'bg-[#171311]/60 text-[#A69688] border-[#3D332C]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
                <span>{st.title}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <div className="text-xs font-sans line-clamp-1">{st.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Presenter Guidance (Collapsible) */}
      <div className="bg-[#171311] border border-[#3D332C] rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setIsPresenterNotesOpen((prev) => !prev)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs text-[#C99765] font-mono uppercase tracking-wider bg-[#221C18] hover:bg-[#2B231F] transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Presenter Guidance (Step {currentStep} of 4)</span>
          </span>
          <span>{isPresenterNotesOpen ? 'Hide Notes' : 'Show Notes'}</span>
        </button>

        {isPresenterNotesOpen && (
          <div className="p-4 space-y-2 text-xs sm:text-sm text-[#D4C7BC] font-sans bg-[#171311]">
            <p className="font-medium text-[#FAF7F2] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C99765] animate-ping" />
              <span>{activeStepInfo.hint}</span>
            </p>
            <p className="text-[11px] text-[#A69688]">
              {currentStep === 1 && 'Tip: Visitors can upload their own photos or use the exhibition presets below.'}
              {currentStep === 2 && 'Tip: Click "Run Comparison" to trigger the live multimodal Gemini analysis.'}
              {currentStep === 3 && 'Tip: Point out the 50-50 / probability split and the confidence percentage.'}
              {currentStep === 4 && 'Tip: Expand the radar chart or category breakdown to show the 8 visual dimensions.'}
            </p>
          </div>
        )}
      </div>

      {/* Demonstration Controls & Judge's View Shortcuts */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#3D332C]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer font-sans ${
              currentStep === 1
                ? 'bg-[#171311] text-[#7A6C60] border border-[#3D332C] cursor-not-allowed'
                : 'bg-[#3D2C21] hover:bg-[#5C4E43] text-[#FAF7F2]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentStep === 4}
            className={`px-5 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer font-sans ${
              currentStep === 4
                ? 'bg-[#171311] text-[#7A6C60] border border-[#3D332C] cursor-not-allowed'
                : 'bg-[#C99765] hover:bg-[#DDB082] text-[#171311]'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              onStepChange(1);
              scrollToTarget('comparison-lab-section');
            }}
            className="px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-medium bg-[#171311] hover:bg-[#2B231F] border border-[#3D332C] text-[#D4C7BC] transition flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C99765]" />
            <span>Restart Demo</span>
          </button>
        </div>

        {/* Judge's View Shortcuts ("Explore the Science") */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#A69688] hidden xl:inline">
            Explore the Science:
          </span>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('how-it-works-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-[#2B231F] hover:bg-[#3D2C21] text-[#D4C7BC] transition cursor-pointer font-sans"
          >
            How ANDESHA Works
          </button>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('science-behind-andesha');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-[#2B231F] hover:bg-[#3D2C21] text-[#D4C7BC] transition cursor-pointer font-sans"
          >
            The Science
          </button>
          <button
            type="button"
            onClick={onOpenMethodology}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-[#2B231F] hover:bg-[#3D2C21] text-[#D4C7BC] transition cursor-pointer font-sans"
          >
            Methodology
          </button>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('explore-the-data');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-[#2B231F] hover:bg-[#3D2C21] text-[#D4C7BC] transition cursor-pointer font-sans"
          >
            Explore Data
          </button>
        </div>
      </div>

      {!hasResult && currentStep >= 3 && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs flex items-center justify-between gap-3 font-sans">
          <span>Note: A live comparison has not been run yet. Run a comparison in Step 2 to see real live results below!</span>
          <button
            type="button"
            onClick={onRunComparison}
            className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-semibold cursor-pointer hover:bg-amber-400 whitespace-nowrap"
          >
            Run Now
          </button>
        </div>
      )}
    </div>
  );
};
