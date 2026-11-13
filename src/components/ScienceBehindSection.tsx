import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  ArrowLeftRight,
  Percent,
  Gauge,
  Sigma,
  Radar,
  ChevronDown,
  ChevronUp,
  Info,
  BookOpenCheck,
} from 'lucide-react';

interface ScienceConcept {
  id: string;
  term: string;
  fieldLabel: string;
  simpleExplanation: string;
  exhibitionContext: string;
  exampleInAndesha: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CONCEPTS: ScienceConcept[] = [
  {
    id: 'ai',
    term: 'Artificial Intelligence',
    fieldLabel: 'Pattern Recognition',
    simpleExplanation: 'AI helps ANDESHA examine visual information and identify patterns.',
    exhibitionContext:
      'Instead of following a rigid human-written checklist for every possible photo, an AI vision system learns visual patterns—such as how light falls across a face or how sharp an image is—and describes them consistently.',
    exampleInAndesha:
      'When you upload two photos, AI looks at features like lighting balance, framing, and expression in both images before passing those observations to the math engine.',
    icon: BrainCircuit,
  },
  {
    id: 'gemini',
    term: 'Gemini',
    fieldLabel: 'Multimodal Vision System',
    simpleExplanation: 'Google Gemini is the AI system used to process the images.',
    exhibitionContext:
      'Gemini is a multimodal AI model, meaning it can read both images and text together. In ANDESHA, it acts as the visual observer that extracts structured measurements across 8 photographic qualities.',
    exampleInAndesha:
      'Gemini inspects both portraits in memory (RAM) and scores the 8 visual dimensions without storing your photographs.',
    icon: Sparkles,
  },
  {
    id: 'pairwise',
    term: 'Pairwise Comparison',
    fieldLabel: 'Comparative Psychology',
    simpleExplanation: 'Instead of analysing one image in isolation, ANDESHA compares two images directly.',
    exhibitionContext:
      'Psychologists have found that giving a single photo a "7 out of 10" rating is noisy and inconsistent because everyone uses rating scales differently. Comparing two photos side-by-side makes differences much clearer.',
    exampleInAndesha:
      'Every analysis pairs Subject Alpha against Subject Bravo directly, and you can even click "Invert Pair" to test whether swapping left and right changes the result.',
    icon: ArrowLeftRight,
  },
  {
    id: 'probability',
    term: 'Probability',
    fieldLabel: 'Statistical Likelihood',
    simpleExplanation: 'The probability represents how strongly the model favours one result over the other.',
    exhibitionContext:
      'A result like 64% vs 36% is a comparative preference split, not a personal grade out of 100. Closer numbers (like 52% vs 48%) mean the two photos are nearly evenly matched on the measured visual features.',
    exampleInAndesha:
      'The Preference Gauge shows how the model splits 100% of comparative preference between the two submitted photographs.',
    icon: Percent,
  },
  {
    id: 'confidence',
    term: 'Confidence',
    fieldLabel: 'Model Certainty',
    simpleExplanation: 'Confidence indicates how certain the model is about its result.',
    exhibitionContext:
      'If one photo has noticeably clearer lighting, sharper focus, and stronger visual scores across most dimensions, confidence is higher. If the two photos trade advantages back and forth, confidence is lower.',
    exampleInAndesha:
      'Look at the Certainty badge (High, Moderate, or Low) and the uncertainty interval to see how decisive the visual margin really is.',
    icon: Gauge,
  },
  {
    id: 'bradley-terry',
    term: 'Bradley–Terry Model',
    fieldLabel: 'Mathematical Choice Formula',
    simpleExplanation: 'A mathematical method for estimating the relative strength of two choices from a comparison.',
    exhibitionContext:
      'First published by statisticians Ralph Bradley and Milton Terry in 1952, this formula turns raw feature differences into smooth probabilities between 0% and 100%. It is widely used in sports rankings, chess ratings, and psychology.',
    exampleInAndesha:
      'ANDESHA feeds the score differences across all 8 visual dimensions into the Bradley–Terry formula to compute the final percentage split.',
    icon: Sigma,
  },
  {
    id: 'radar-chart',
    term: 'Radar Chart',
    fieldLabel: 'Multi-Axis Visualization',
    simpleExplanation: 'A visual chart that lets visitors see several evaluation dimensions at once.',
    exhibitionContext:
      'Sometimes called a spider chart, it arranges all 8 visual categories (like lighting, symmetry, expression, and background) around a central point so you can compare the overall "shape" of both photos in one glance.',
    exampleInAndesha:
      'On the results screen, the two overlapping shapes let you spot immediately where Photo A leads and where Photo B is stronger.',
    icon: Radar,
  },
];

export const ScienceBehindSection: React.FC = () => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const allExpanded = CONCEPTS.every((c) => expandedIds[c.id]);

  const toggleCard = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleAll = () => {
    if (allExpanded) {
      setExpandedIds({});
    } else {
      const next: Record<string, boolean> = {};
      CONCEPTS.forEach((c) => {
        next[c.id] = true;
      });
      setExpandedIds(next);
    }
  };

  return (
    <section
      id="science-behind-andesha"
      aria-labelledby="science-behind-heading"
      className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-6 sm:p-8 shadow-xs dark:shadow-xl space-y-6 scroll-mt-24 transition-colors"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#E8E2D8] dark:border-[#3D332C]">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C7D70] dark:text-[#A69688] font-sans">
            <span className="font-mono font-semibold text-[#8C5E3C] dark:text-[#C99765] uppercase tracking-wider">
              Interactive Glossary
            </span>
            <span aria-hidden="true">·</span>
            <span>7 Core Concepts Explained Simply</span>
          </div>
          <h2
            id="science-behind-heading"
            className="text-2xl sm:text-3xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight"
          >
            The Science Behind ANDESHA
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans">
            Tap any concept card below to explore the AI and mathematical ideas powering this exhibition project—explained in clear, everyday language.
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleAll}
          className="self-start md:self-auto px-4 py-2 rounded-lg text-xs font-medium text-[#5C4E43] dark:text-[#D4C7BC] hover:text-[#211813] dark:hover:text-[#F5EFEB] bg-[#FAF7F2] hover:bg-[#F4EFEA] dark:bg-[#221C18] dark:hover:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 font-sans shadow-2xs"
        >
          <BookOpenCheck className="w-3.5 h-3.5 text-[#8C5E3C] dark:text-[#C99765]" />
          <span>{allExpanded ? 'Collapse All Cards' : 'Expand All Concepts'}</span>
        </button>
      </div>

      {/* Expandable Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {CONCEPTS.map((concept) => {
          const isExpanded = !!expandedIds[concept.id];
          const IconComponent = concept.icon;

          return (
            <div
              key={concept.id}
              className={`rounded-xl border transition-all duration-200 ${
                isExpanded
                  ? 'bg-[#FAF7F2] dark:bg-[#221C18] border-[#8C5E3C]/45 dark:border-[#C99765]/45 shadow-xs'
                  : 'bg-[#FAF7F2]/60 dark:bg-[#221C18]/70 border-[#E8E2D8] dark:border-[#3D332C] hover:border-[#8C5E3C]/35 dark:hover:border-[#C99765]/35'
              }`}
            >
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={`science-card-body-${concept.id}`}
                onClick={() => toggleCard(concept.id)}
                className="w-full p-5 text-left flex items-start justify-between gap-4 cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C5E3C] dark:focus-visible:ring-[#C99765]"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-white dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] flex items-center justify-center text-[#8C5E3C] dark:text-[#C99765] shrink-0 mt-0.5 shadow-2xs">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-editorial font-medium text-[#211813] dark:text-[#F5EFEB]">
                        {concept.term}
                      </h3>
                      <span className="text-[11px] font-sans text-[#8C7D70] dark:text-[#A69688]">
                        · {concept.fieldLabel}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans">
                      {concept.simpleExplanation}
                    </p>
                  </div>
                </div>

                <span className="p-1.5 rounded-md bg-white dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C5E3C] dark:text-[#C99765] shrink-0 mt-0.5 transition-transform duration-200">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </button>

              {isExpanded && (
                <div
                  id={`science-card-body-${concept.id}`}
                  className="px-5 pb-5 pt-3 border-t border-[#E8E2D8] dark:border-[#3D332C] space-y-3 text-xs font-sans animate-in fade-in duration-150"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765] font-semibold block">
                      Plain-Language Deeper Look
                    </span>
                    <p className="text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed">
                      {concept.exhibitionContext}
                    </p>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#171311] rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] space-y-1">
                    <span className="text-[11px] font-semibold text-[#211813] dark:text-[#F5EFEB] block">
                      Where you see it in ANDESHA
                    </span>
                    <p className="text-[11px] text-[#8C7D70] dark:text-[#A69688] leading-relaxed">
                      {concept.exampleInAndesha}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Honest Scientific Disclaimer */}
      <div className="pt-2">
        <div className="bg-[#FAF7F2] dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-4 sm:p-5 flex items-start gap-3.5 text-xs font-sans">
          <div className="p-2 bg-white dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg text-[#8C5E3C] dark:text-[#C99765] shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-[#211813] dark:text-[#F5EFEB] text-xs sm:text-sm">
              Important Note on AI & Visual Perception
            </h3>
            <p className="text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed">
              ANDESHA demonstrates how AI models estimate statistical preference patterns from photographic features—such as lighting, composition, and image clarity. These outputs are <strong>probabilistic estimates, not objective or universal judgments</strong>, and they never define personal worth or absolute beauty.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
