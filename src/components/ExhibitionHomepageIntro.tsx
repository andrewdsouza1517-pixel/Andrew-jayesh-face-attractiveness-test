import React from 'react';
import {
  BrainCircuit,
  Sigma,
  BarChart3,
  Sparkles,
  ArrowDown,
  Layers,
  MessageSquareText,
  Search,
} from 'lucide-react';

interface ExhibitionHomepageIntroProps {
  onStartComparison: () => void;
  onOpenExhibitionMode: () => void;
}

export const ExhibitionHomepageIntro: React.FC<ExhibitionHomepageIntroProps> = ({
  onStartComparison,
  onOpenExhibitionMode,
}) => {
  return (
    <div className="space-y-10">
      {/* 1. Strong Exhibition Introduction */}
      <section
        aria-labelledby="exhibition-intro-heading"
        className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-6 sm:p-10 shadow-xs dark:shadow-xl space-y-8 transition-colors"
      >
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765]">
            <span className="px-2.5 py-1 rounded-md bg-[#FAF7F2] dark:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C]">
              Live Exhibition Demonstration
            </span>
            <span aria-hidden="true" className="text-[#D8CEBF] dark:text-[#3D332C]">·</span>
            <span>By Andrew & Apeksha</span>
          </div>

          <div className="space-y-2">
            <h1
              id="exhibition-intro-heading"
              className="text-4xl sm:text-6xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight"
            >
              ANDESHA
            </h1>
            <p className="text-sm sm:text-base font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765] font-semibold">
              AI-Powered Visual Analysis Platform
            </p>
            <p className="text-xl sm:text-2xl font-editorial italic text-[#5C4E43] dark:text-[#D4C7BC]">
              “See Beyond the Image. Understand the Data.”
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans max-w-2xl">
            ANDESHA compares two images using AI, converts its visual analysis into structured data, and explains the result through probability, charts and mathematical modelling.
          </p>

          {/* 3. Prominent "Try ANDESHA" Action Button & Secondary Exhibition Mode Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="start-comparison-hero-btn"
              type="button"
              onClick={onStartComparison}
              className="px-8 py-4 min-h-[48px] rounded-xl text-sm font-semibold bg-[#211813] hover:bg-[#3D2C21] dark:bg-[#C99765] dark:hover:bg-[#DDB082] text-[#FAF7F2] dark:text-[#171311] transition shadow-md hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer uppercase tracking-wider font-sans"
            >
              <span>Start a Comparison</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              id="exhibition-mode-entry-btn"
              type="button"
              onClick={onOpenExhibitionMode}
              className="px-6 py-4 min-h-[48px] rounded-xl text-sm font-medium bg-[#FAF7F2] hover:bg-[#F4EFEA] dark:bg-[#2B231F] dark:hover:bg-[#382F2A] border border-[#E8E2D8] dark:border-[#3D332C] text-[#5C4E43] dark:text-[#D4C7BC] hover:text-[#211813] dark:hover:text-[#F5EFEB] transition flex items-center gap-2 cursor-pointer font-sans shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-[#8C5E3C] dark:text-[#C99765]" />
              <span>Exhibition Mode</span>
            </button>
          </div>
        </div>

        {/* 2. Three Quick Concept Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-[#E8E2D8] dark:border-[#3D332C]">
          {/* Card 1: AI */}
          <div className="bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-5 space-y-3 shadow-2xs hover:border-[#8C5E3C]/40 transition-all duration-200">
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] flex items-center justify-center text-[#8C5E3C] dark:text-[#C99765] shadow-2xs">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-editorial font-semibold text-[#211813] dark:text-[#F5EFEB] uppercase tracking-wider">
                AI
              </h3>
              <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans">
                Artificial Intelligence examines the selected visual characteristics.
              </p>
            </div>
          </div>

          {/* Card 2: MATH */}
          <div className="bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-5 space-y-3 shadow-2xs hover:border-[#8C5E3C]/40 transition-all duration-200">
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] flex items-center justify-center text-[#8C5E3C] dark:text-[#C99765] shadow-2xs">
              <Sigma className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-editorial font-semibold text-[#211813] dark:text-[#F5EFEB] uppercase tracking-wider">
                MATH
              </h3>
              <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans">
                Mathematical modelling turns those observations into a pairwise comparison.
              </p>
            </div>
          </div>

          {/* Card 3: DATA */}
          <div className="bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-5 space-y-3 shadow-2xs hover:border-[#8C5E3C]/40 transition-all duration-200">
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] flex items-center justify-center text-[#4A6B53] dark:text-[#6B9071] shadow-2xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-editorial font-semibold text-[#211813] dark:text-[#F5EFEB] uppercase tracking-wider">
                DATA
              </h3>
              <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans">
                Charts and explanations make the result easier to understand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What makes ANDESHA different? & 5. Exhibition Navigation Path */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* What makes ANDESHA different? */}
        <section
          aria-labelledby="differentiators-heading"
          className="lg:col-span-6 bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-6 sm:p-8 shadow-xs dark:shadow-xl space-y-6 transition-colors flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765] font-semibold">
                Design Principles
              </span>
              <h2 id="differentiators-heading" className="text-2xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight">
                What makes ANDESHA different?
              </h2>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] space-y-1 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8C5E3C] dark:text-[#C99765]" />
                  <h3 className="text-sm font-semibold text-[#211813] dark:text-[#F5EFEB] font-sans">
                    AI + Mathematics
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans pl-6">
                  Combines AI image analysis with statistical modelling.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] space-y-1 shadow-2xs">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="w-4 h-4 text-[#8C5E3C] dark:text-[#C99765]" />
                  <h3 className="text-sm font-semibold text-[#211813] dark:text-[#F5EFEB] font-sans">
                    Explainable Results
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans pl-6">
                  Every major result is accompanied by a plain-language explanation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] space-y-1 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#4A6B53] dark:text-[#6B9071]" />
                  <h3 className="text-sm font-semibold text-[#211813] dark:text-[#F5EFEB] font-sans">
                    Interactive Research
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans pl-6">
                  Visitors can perform their own comparison instead of only viewing a demonstration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Exhibition Navigation Path */}
        <section
          aria-labelledby="exhibition-path-heading"
          className="lg:col-span-6 bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-6 sm:p-8 shadow-xs dark:shadow-xl space-y-6 transition-colors flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765] font-semibold">
                Visitor Roadmap
              </span>
              <h2 id="exhibition-path-heading" className="text-2xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight">
                Exhibition Navigation Path
              </h2>
            </div>

            <ol className="space-y-3 pt-2 font-sans">
              {[
                { step: '01', title: 'Understand', desc: 'Learn what ANDESHA does.', icon: Search },
                { step: '02', title: 'Compare', desc: 'Upload two images and run a live analysis.', icon: BrainCircuit },
                { step: '03', title: 'Explore', desc: 'Read the result and investigate the charts.', icon: BarChart3 },
                { step: '04', title: 'Learn', desc: 'Explore the mathematics and AI behind the result.', icon: Sigma },
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <li
                    key={idx}
                    className="flex items-center gap-3.5 p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] shadow-2xs"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C5E3C] dark:text-[#C99765] font-mono text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                      {item.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-[#211813] dark:text-[#F5EFEB]">
                          {item.title}
                        </span>
                        <IconComp className="w-3.5 h-3.5 text-[#8C7D70] dark:text-[#A69688]" />
                      </div>
                      <p className="text-xs text-[#5C4E43] dark:text-[#D4C7BC] leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </div>

      {/* 6. Small Creators Section */}
      <section
        aria-labelledby="creators-heading"
        className="bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-6 sm:p-8 text-center space-y-3 shadow-2xs transition-colors"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C5E3C] dark:text-[#C99765] font-editorial font-bold text-lg mb-1 shadow-2xs">
          AA
        </div>
        <h2 id="creators-heading" className="text-lg font-editorial font-medium text-[#211813] dark:text-[#F5EFEB]">
          Created by Andrew & Apeksha
        </h2>
        <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] max-w-xl mx-auto leading-relaxed font-sans">
          A student-built interactive project exploring AI, visual analysis, probability and statistical modelling.
        </p>
      </section>
    </div>
  );
};
