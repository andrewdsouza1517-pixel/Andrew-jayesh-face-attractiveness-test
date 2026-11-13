import React from 'react';
import { X, Sparkles, GraduationCap, Users, ShieldCheck, HelpCircle, Layers, HeartHandshake, Eye } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="about-andesha-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#171311]/75 backdrop-blur-md p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="about-andesha-modal"
        className="bg-white dark:bg-[#1E1815] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E2D8] dark:border-[#3D332C] overflow-hidden my-6 transition-colors animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-[#FAF7F2] dark:bg-[#221C18] px-6 sm:px-8 py-5 flex items-center justify-between border-b border-[#E8E2D8] dark:border-[#3D332C]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-[#211813] dark:bg-[#C99765] rounded-xl flex items-center justify-center font-editorial font-bold text-[#FAF7F2] dark:text-[#171311] text-lg shadow-xs shrink-0">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight">
                  ANDESHA
                </h2>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765] px-2 py-0.5 rounded border border-[#8C5E3C]/30 dark:border-[#C99765]/35 bg-white/60 dark:bg-[#171311]/60">
                  School Exhibition Project
                </span>
              </div>
              <p className="text-xs text-[#8C7D70] dark:text-[#A69688] font-sans mt-0.5">
                AI-Powered Visual Analysis Platform · Created by Andrew & Apeksha
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8C7D70] hover:text-[#211813] dark:hover:text-[#F5EFEB] rounded-lg hover:bg-[#F4EFEA] dark:hover:bg-[#2B231F] transition cursor-pointer"
            aria-label="Close About Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tagline Ribbon */}
        <div className="bg-[#FAF7F2]/60 dark:bg-[#171311]/70 px-6 sm:px-8 py-2.5 border-b border-[#E8E2D8] dark:border-[#3D332C] flex items-center justify-between text-xs text-[#5C4E43] dark:text-[#D4C7BC]">
          <span className="italic font-editorial text-sm text-[#8C5E3C] dark:text-[#C99765]">
            “See Beyond the Image. Understand the Data.”
          </span>
          <span className="text-[11px] font-sans text-[#8C7D70] dark:text-[#A69688] hidden sm:inline">
            Interactive STEM & AI Demonstration
          </span>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#5C4E43] dark:text-[#D4C7BC] text-xs leading-relaxed font-sans">
          {/* Welcome & Story */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#8C5E3C] dark:text-[#C99765] font-semibold text-sm">
              <GraduationCap className="w-4 h-4" />
              <h3 className="font-editorial text-base text-[#211813] dark:text-[#F5EFEB]">
                The Story of ANDESHA
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-[#5C4E43] dark:text-[#D4C7BC]">
              Welcome to our school exhibition! <strong>ANDESHA</strong> is an AI-powered visual analysis platform designed and built by <strong>Andrew and Apeksha</strong>. Our project investigates a fundamental question at the crossroads of computer vision and human psychology: <em>How does artificial intelligence evaluate visual perception, photographic harmony, and aesthetic preference when comparing two portraits side-by-side?</em>
            </p>
            <p className="text-xs text-[#8C7D70] dark:text-[#A69688]">
              Rather than reducing people to arbitrary, dehumanizing 1–10 scores, ANDESHA applies the proven <strong>Bradley–Terry probabilistic choice model</strong> alongside multimodal AI vision. It breaks down portraits into 8 transparent visual axes — giving viewers clear, actionable insights into lighting, composition, facial expression, and image quality.
            </p>
          </div>

          {/* Creators Section */}
          <div className="border-t border-[#E8E2D8] dark:border-[#3D332C] pt-5 space-y-3">
            <div className="flex items-center gap-2 text-[#8C5E3C] dark:text-[#C99765] font-semibold text-sm">
              <Users className="w-4 h-4" />
              <h3 className="font-editorial text-base text-[#211813] dark:text-[#F5EFEB]">
                Meet the Creators
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF7F2]/70 dark:bg-[#221C18] rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-editorial font-medium text-sm text-[#211813] dark:text-[#F5EFEB]">
                    Andrew
                  </h4>
                  <span className="text-[10px] font-mono text-[#8C5E3C] dark:text-[#C99765] uppercase">
                    Co-Creator & Lead Engineer
                  </span>
                </div>
                <p className="text-xs text-[#5C4E43] dark:text-[#D4C7BC]">
                  Focused on computer vision integration, Gemini multimodal pipelines, the 125,000-particle WebGL2 liquid simulation, and mathematical Bradley–Terry probability modeling.
                </p>
              </div>

              <div className="p-4 bg-[#FAF7F2]/70 dark:bg-[#221C18] rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-editorial font-medium text-sm text-[#211813] dark:text-[#F5EFEB]">
                    Apeksha
                  </h4>
                  <span className="text-[10px] font-mono text-[#8C5E3C] dark:text-[#C99765] uppercase">
                    Co-Creator & Research Lead
                  </span>
                </div>
                <p className="text-xs text-[#5C4E43] dark:text-[#D4C7BC]">
                  Focused on the 8-axis psychometric framework, editorial user experience design, visitor accessibility for non-technical audiences, and ethical data privacy safeguards.
                </p>
              </div>
            </div>
          </div>

          {/* Visitor & Parent Friendly Guide */}
          <div className="border-t border-[#E8E2D8] dark:border-[#3D332C] pt-5 space-y-3">
            <div className="flex items-center gap-2 text-[#8C5E3C] dark:text-[#C99765] font-semibold text-sm">
              <HelpCircle className="w-4 h-4" />
              <h3 className="font-editorial text-base text-[#211813] dark:text-[#F5EFEB]">
                A Quick Guide for Parents & Visitors (No Tech Jargon!)
              </h3>
            </div>
            <p className="text-xs text-[#8C7D70] dark:text-[#A69688]">
              We designed ANDESHA so anyone visiting our exhibition can easily understand and try the experiment. Here is how it works in simple terms:
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="p-3.5 bg-white dark:bg-[#171311] rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-[#8C5E3C] dark:text-[#C99765] font-medium text-xs">
                  <Eye className="w-4 h-4 shrink-0" />
                  <span className="font-semibold text-[#211813] dark:text-[#F5EFEB]">1. The 8 Visual Axes</span>
                </div>
                <p className="text-[11px] text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed">
                  The AI doesn’t just guess; it measures 8 concrete photographic factors: lighting, composition, facial expression, styling, image sharpness, symmetry, background, and color warmth.
                </p>
              </div>

              <div className="p-3.5 bg-white dark:bg-[#171311] rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-[#8C5E3C] dark:text-[#C99765] font-medium text-xs">
                  <Layers className="w-4 h-4 shrink-0" />
                  <span className="font-semibold text-[#211813] dark:text-[#F5EFEB]">2. The Percentages</span>
                </div>
                <p className="text-[11px] text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed">
                  If the gauge says 55% vs 45%, it means in a pairwise comparison of these specific photos, 55% of observers are estimated to find Photo A more visually striking. It is <strong>not</strong> a grade out of 100!
                </p>
              </div>

              <div className="p-3.5 bg-white dark:bg-[#171311] rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-[#8C5E3C] dark:text-[#C99765] font-medium text-xs">
                  <HeartHandshake className="w-4 h-4 shrink-0" />
                  <span className="font-semibold text-[#211813] dark:text-[#F5EFEB]">3. Why Side-by-Side?</span>
                </div>
                <p className="text-[11px] text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed">
                  Psychology research shows people can’t reliably grade photos in isolation (a "7/10" means different things to different people). Comparing two items side-by-side yields far more scientific and consistent results.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy & Ethics */}
          <div className="border-t border-[#E8E2D8] dark:border-[#3D332C] pt-5 space-y-3">
            <div className="flex items-center gap-2 text-[#4A6B53] dark:text-[#6B9071] font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="font-editorial text-base text-[#211813] dark:text-[#F5EFEB]">
                Privacy & Ethical Standards
              </h3>
            </div>
            <div className="p-4 bg-[#FAF7F2]/60 dark:bg-[#221C18] rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] space-y-2 text-xs">
              <div className="flex items-center gap-2 font-medium text-[#211813] dark:text-[#F5EFEB]">
                <span>Zero Image Retention (Your privacy is guaranteed)</span>
              </div>
              <p className="text-[#8C7D70] dark:text-[#A69688]">
                Every photograph tested during the school exhibition is analyzed in-memory (RAM) only and discarded immediately. No photos, facial biometric templates, or personal identifiers are ever stored to databases, disks, or servers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF7F2] dark:bg-[#221C18] px-6 sm:px-8 py-4 border-t border-[#E8E2D8] dark:border-[#3D332C] flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-[#8C7D70] dark:text-[#A69688] font-mono">
            ANDESHA · School Exhibition · Andrew & Apeksha
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#211813] hover:bg-[#3D2C21] dark:bg-[#C99765] dark:hover:bg-[#DDB082] text-[#FAF7F2] dark:text-[#171311] shadow-xs cursor-pointer transition font-sans"
          >
            Explore Platform
          </button>
        </div>
      </div>
    </div>
  );
};
