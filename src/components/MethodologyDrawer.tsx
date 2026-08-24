import React from 'react';
import { X, BookOpen, Scale, Binary, ShieldCheck, Cpu } from 'lucide-react';

interface MethodologyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyDrawer: React.FC<MethodologyDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-800 overflow-hidden my-6 backdrop-blur-lg">
        {/* Header */}
        <div className="bg-slate-950/90 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Research Methodology & Mathematical Framework</h3>
              <p className="text-[11px] text-slate-400">Bradley–Terry Psychometric Model & Ethics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs leading-relaxed">
          {/* Section 1: The Bradley-Terry Formulation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Binary className="w-4 h-4 text-blue-400" />
              <h4>1. Pairwise Ranking vs. Arbitrary 1–10 Ratings</h4>
            </div>
            <p>
              In psychometrics, asking human judges or AI models for an isolated numerical rating (such as 1–10) produces heavy cognitive bias, scale compression, and inconsistent baseline shifts across observers.
            </p>
            <p>
              This experiment implements the <strong>Bradley–Terry probabilistic choice model</strong> (Bradley & Terry, 1952). For two items $i$ and $j$ with positive latent quality parameters $\pi_i$ and $\pi_j$, the probability that reference observers prefer $i$ over $j$ is:
            </p>
            <div className="bg-slate-950 border border-slate-800 text-blue-300 p-3.5 rounded-xl font-mono text-center text-xs shadow-inner">
              P(Person A &gt; Person B) = exp(s_A) / [exp(s_A) + exp(s_B)] = 1 / [1 + exp(-(s_A - s_B))]
            </div>
            <p className="text-slate-400">
              Where $s_A$ and $s_B$ represent latent perception parameters estimated from visual feature representations.
            </p>
          </div>

          {/* Section 2: Modular Architecture */}
          <div className="space-y-3 border-t border-slate-800 pt-5">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Cpu className="w-4 h-4 text-blue-400" />
              <h4>2. Decoupled Visual Analysis & Ranking Layer</h4>
            </div>
            <p>
              The system isolates feature extraction from comparison math:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <span className="font-semibold text-white block mb-1">Layer 1: Visual Perception</span>
                Decomposes photographic exposure, facial affect, composition, symmetry, and sharpness into independent multidimensional vectors.
              </div>
              <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <span className="font-semibold text-white block mb-1">Layer 2: Bradley–Terry Engine</span>
                Transforms latent vectors into calibrated preference odds, confidence intervals, and uncertainty factors.
              </div>
            </div>
          </div>

          {/* Section 3: Subjectivity & Non-Objective Axiom */}
          <div className="space-y-3 border-t border-slate-800 pt-5">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Scale className="w-4 h-4 text-blue-400" />
              <h4>3. The Subjectivity Principle</h4>
            </div>
            <p>
              Physical attractiveness is <strong>inherently subjective and context-dependent</strong>. Human perception varies across:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
              <li><strong>Individual observer tastes</strong> and personal familiarity</li>
              <li><strong>Cultural backgrounds</strong> and regional aesthetic norms</li>
              <li><strong>Photographic framing</strong> (studio vs candid, angle, smile, lens focal length)</li>
              <li><strong>Situational context</strong> and emotional presentation</li>
            </ul>
            <p className="text-slate-500 italic">
              Predictions produced here model average tendencies in reference sample datasets; they never dictate universal or objective aesthetic truth.
            </p>
          </div>

          {/* Section 4: Privacy & Ethics Protocol */}
          <div className="space-y-3 border-t border-slate-800 pt-5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4>4. Safety, Privacy & Ethical Constraints</h4>
            </div>
            <div className="p-3.5 bg-emerald-500/10 text-emerald-300 rounded-xl border border-emerald-500/20 space-y-1.5">
              <p className="font-semibold text-emerald-200">Ethical Commitments:</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-emerald-300/90">
                <li>Strict 18+ enforcement. Image sets containing minors are immediately rejected.</li>
                <li>Zero retention: Images are processed in-memory and discarded immediately upon response.</li>
                <li>No inference of sensitive attributes (race, religion, sexuality, health, socioeconomic status).</li>
                <li>Prohibition of toxic, pejorative, or derogatory descriptors.</li>
              </ul>
            </div>
          </div>

          {/* Section 5: Positional Symmetry & Bias Mitigation */}
          <div className="space-y-3 border-t border-slate-800 pt-5">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Scale className="w-4 h-4 text-purple-400" />
              <h4>5. Positional Symmetry & Photographic Factor Decoupling</h4>
            </div>
            <p>
              To ensure the most unbiased evaluation possible, the system explicitly enforces:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
              <li><strong>Positional Symmetry:</strong> Subjects are evaluated without order preference (Image 1 vs Image 2 order does not dictate outcome).</li>
              <li><strong>Photographic Factor Decoupling:</strong> Camera quality, lighting, and focal length differences are separated from intrinsic facial harmony.</li>
              <li><strong>Demographic Neutrality:</strong> Facial features and cultural presentation across all demographic backgrounds are given equal weight and respect.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950/90 px-6 py-3.5 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-md shadow-blue-900/30"
          >
            Close Framework Guide
          </button>
        </div>
      </div>
    </div>
  );
};
