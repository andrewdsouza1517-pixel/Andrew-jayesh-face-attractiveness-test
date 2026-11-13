import React from 'react';
import { X, BookOpen, Scale, Binary, ShieldCheck, Cpu } from 'lucide-react';

interface MethodologyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyDrawer: React.FC<MethodologyDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171311]/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1E1815] rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-xl dark:shadow-2xl border border-[#E8E2D8] dark:border-[#3D332C] overflow-hidden my-6 transition-colors">
        {/* Header */}
        <div className="bg-[#FAF7F2] dark:bg-[#221C18] px-6 py-4 flex items-center justify-between border-b border-[#E8E2D8] dark:border-[#3D332C]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-[#171311] rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C5E3C] dark:text-[#C99765]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial font-medium text-base text-[#211813] dark:text-[#F5EFEB]">
                ANDESHA — Methodology & Mathematical Framework
              </h3>
              <p className="text-[11px] text-[#8C7D70] dark:text-[#A69688] font-sans">
                School Exhibition Project by Andrew & Apeksha · Bradley–Terry Choice Model
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8C7D70] hover:text-[#211813] dark:hover:text-[#F5EFEB] rounded-md hover:bg-[#F4EFEA] dark:hover:bg-[#2B231F] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#5C4E43] dark:text-[#D4C7BC] text-xs leading-relaxed font-sans">
          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#8C5E3C] dark:text-[#C99765] font-semibold text-sm">
              <Binary className="w-4 h-4" />
              <h4>1. Pairwise Ranking vs. Arbitrary 1–10 Ratings</h4>
            </div>
            <p>
              In psychometrics, asking human judges or AI models for an isolated numerical rating (such as 1–10) produces heavy cognitive bias, scale compression, and inconsistent baseline shifts across observers.
            </p>
            <p>
              This experiment implements the <strong>Bradley–Terry probabilistic choice model</strong> (Bradley & Terry, 1952). For two items $i$ and $j$ with positive latent quality parameters $\pi_i$ and $\pi_j$, the probability that reference observers prefer $i$ over $j$ is:
            </p>
            <div className="bg-[#FAF7F2] dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] text-[#211813] dark:text-[#F5EFEB] p-3.5 rounded-lg font-mono text-center text-xs">
              P(Person A &gt; Person B) = exp(s_A) / [exp(s_A) + exp(s_B)] = 1 / [1 + exp(-(s_A - s_B))]
            </div>
            <p className="text-[#8C7D70] dark:text-[#A69688]">
              Where $s_A$ and $s_B$ represent latent perception parameters estimated from visual feature representations.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 border-t border-[#E8E2D8] dark:border-[#3D332C] pt-5">
            <div className="flex items-center gap-2 text-[#8C5E3C] dark:text-[#C99765] font-semibold text-sm">
              <Cpu className="w-4 h-4" />
              <h4>2. Decoupled Visual Analysis & Ranking Layer</h4>
            </div>
            <p>
              The system isolates feature extraction from comparison math:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3.5 bg-[#FAF7F2]/60 dark:bg-[#221C18] rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] shadow-2xs">
                <span className="font-semibold text-[#211813] dark:text-[#F5EFEB] block mb-1">Layer 1: Visual Perception</span>
                Decomposes photographic exposure, facial affect, composition, symmetry, and sharpness into independent multidimensional vectors.
              </div>
              <div className="p-3.5 bg-[#FAF7F2]/60 dark:bg-[#221C18] rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] shadow-2xs">
                <span className="font-semibold text-[#211813] dark:text-[#F5EFEB] block mb-1">Layer 2: Bradley–Terry Engine</span>
                Transforms latent vectors into calibrated preference odds, confidence intervals, and uncertainty factors.
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 border-t border-[#E8E2D8] dark:border-[#3D332C] pt-5">
            <div className="flex items-center gap-2 text-[#8C5E3C] dark:text-[#C99765] font-semibold text-sm">
              <Scale className="w-4 h-4" />
              <h4>3. The Subjectivity Principle</h4>
            </div>
            <p>
              Physical attractiveness is <strong>inherently subjective and context-dependent</strong>. Human perception varies across:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#8C7D70] dark:text-[#A69688] pl-2">
              <li><strong>Individual observer tastes</strong> and personal familiarity</li>
              <li><strong>Cultural backgrounds</strong> and regional aesthetic norms</li>
              <li><strong>Photographic framing</strong> (studio vs candid, angle, smile, lens focal length)</li>
              <li><strong>Situational context</strong> and emotional presentation</li>
            </ul>
            <p className="text-[#8C7D70] dark:text-[#A69688] italic">
              Predictions produced here model average tendencies in reference sample datasets; they never dictate universal or objective aesthetic truth.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 border-t border-[#E8E2D8] dark:border-[#3D332C] pt-5">
            <div className="flex items-center gap-2 text-[#4A6B53] dark:text-[#6B9071] font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <h4>4. Privacy & Ethical Protocols</h4>
            </div>
            <p>
              To protect participant dignity and privacy:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#8C7D70] dark:text-[#A69688] pl-2">
              <li>Images are evaluated in RAM during active computation and discarded immediately.</li>
              <li>No facial recognition templates or identifiers are ever stored to disk or databases.</li>
              <li>Adult verification (18+) is required for all comparisons.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
