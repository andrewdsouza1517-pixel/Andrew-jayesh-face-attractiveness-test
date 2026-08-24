import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, EyeOff, Scale, CheckCircle2 } from 'lucide-react';

interface ConsentGateModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export const ConsentGateModal: React.FC<ConsentGateModalProps> = ({ isOpen, onConfirm }) => {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [scientificAcknowledge, setScientificAcknowledge] = useState(false);

  if (!isOpen) return null;

  const canProceed = ageConfirmed && consentConfirmed && scientificAcknowledge;

  return (
    <div id="consent-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div id="consent-modal-card" className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-800 overflow-hidden my-8 backdrop-blur-lg">
        {/* Header */}
        <div className="bg-slate-950/80 px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white tracking-tight">Research Protocol & Consent Agreement</h2>
              </div>
              <p className="text-xs text-slate-400">Pairwise Attractiveness Perception Experiment</p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded">
            18+ Strictly Required
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-slate-300 text-xs leading-relaxed">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-200">Scientific & Ethical Disclaimer:</p>
              <p className="text-slate-300">
                Attractiveness is <strong>not an objective biological constant or scientific truth</strong>. Human perceptions of physical attractiveness vary profoundly across individuals, cultures, generations, photographic lighting, and contextual framing.
              </p>
              <p className="text-amber-300/90 font-mono text-[11px]">
                This research system uses a <strong>Bradley–Terry probabilistic pairwise model</strong> to predict comparative preference distributions from reference population observer datasets.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <EyeOff className="w-4 h-4 text-blue-400" />
                <span>Zero Image Retention</span>
              </div>
              <p className="text-slate-400">
                Uploaded images are processed in-memory solely during active pairwise computation and are immediately discarded. No photos or facial biometrics are stored.
              </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Ethical Safeguards</span>
              </div>
              <p className="text-slate-400">
                Analysis strictly excludes minors, does not infer sensitive demographic traits (race, religion, health, sexuality), and enforces non-derogatory language.
              </p>
            </div>
          </div>

          {/* Checkbox Declarations */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-800/40 cursor-pointer transition">
              <input
                type="checkbox"
                id="age-confirm-checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
              />
              <span className="text-xs text-slate-200">
                I confirm that I am at least <strong>18 years of age</strong>.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-800/40 cursor-pointer transition">
              <input
                type="checkbox"
                id="consent-confirm-checkbox"
                checked={consentConfirmed}
                onChange={(e) => setConsentConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
              />
              <span className="text-xs text-slate-200">
                I verify that all photographs uploaded represent <strong>consenting adults (18+)</strong> and strictly comply with ethical research guidelines.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-800/40 cursor-pointer transition">
              <input
                type="checkbox"
                id="science-confirm-checkbox"
                checked={scientificAcknowledge}
                onChange={(e) => setScientificAcknowledge(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
              />
              <span className="text-xs text-slate-200">
                I acknowledge that model outputs are <strong>statistical reference predictions</strong> and do not represent personal worth, moral value, or objective reality.
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950/80 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">All 3 requirements required</span>
          <button
            id="enter-experiment-btn"
            onClick={onConfirm}
            disabled={!canProceed}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition uppercase tracking-wider ${
              canProceed
                ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-lg shadow-blue-900/30'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Enter Research Experiment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
