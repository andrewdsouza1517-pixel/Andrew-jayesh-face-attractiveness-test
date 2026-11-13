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
    <div id="consent-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-[#171311]/70 backdrop-blur-md p-4 overflow-y-auto">
      <div id="consent-modal-card" className="bg-white dark:bg-[#1E1815] rounded-xl shadow-xl dark:shadow-2xl max-w-2xl w-full border border-[#E8E2D8] dark:border-[#3D332C] overflow-hidden my-8 transition-colors">
        {/* Header */}
        <div className="bg-[#FAF7F2] dark:bg-[#221C18] px-6 py-5 flex items-center justify-between border-b border-[#E8E2D8] dark:border-[#3D332C]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-[#171311] rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C5E3C] dark:text-[#C99765]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight">
                ANDESHA — Protocol & Consent Agreement
              </h2>
              <p className="text-xs text-[#8C7D70] dark:text-[#A69688] font-sans">
                AI-Powered Visual Analysis Platform · Exhibition Project by Andrew & Apeksha
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider px-2 py-0.5 border border-red-500/30 text-red-700 dark:text-red-400 rounded">
            18+ Strictly Required
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-[#5C4E43] dark:text-[#D4C7BC] text-xs leading-relaxed font-sans">
          <div className="bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg p-4 flex gap-3 text-[#5C4E43] dark:text-[#D4C7BC]">
            <AlertTriangle className="w-5 h-5 text-[#8C5E3C] dark:text-[#C99765] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-[#211813] dark:text-[#F5EFEB]">Scientific & Ethical Disclaimer:</p>
              <p>
                Attractiveness is <strong>not an objective biological constant or scientific truth</strong>. Human perceptions of physical attractiveness vary profoundly across individuals, cultures, generations, photographic lighting, and contextual framing.
              </p>
              <p className="text-[#8C5E3C] dark:text-[#C99765] font-mono text-[11px]">
                This research system uses a <strong>Bradley–Terry probabilistic pairwise model</strong> to predict comparative preference distributions from reference population observer datasets.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-[#FAF7F2]/60 dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg p-3.5 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 font-semibold text-[#211813] dark:text-[#F5EFEB]">
                <EyeOff className="w-4 h-4 text-[#8C5E3C] dark:text-[#C99765]" />
                <span>Zero Image Retention</span>
              </div>
              <p className="text-[#8C7D70] dark:text-[#A69688]">
                Uploaded images are processed in-memory solely during active pairwise computation and are immediately discarded. No photos or facial biometrics are stored.
              </p>
            </div>

            <div className="bg-[#FAF7F2]/60 dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg p-3.5 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 font-semibold text-[#211813] dark:text-[#F5EFEB]">
                <ShieldCheck className="w-4 h-4 text-[#4A6B53] dark:text-[#6B9071]" />
                <span>Ethical Safeguards</span>
              </div>
              <p className="text-[#8C7D70] dark:text-[#A69688]">
                Analysis strictly excludes minors, does not infer sensitive demographic traits (race, religion, health, sexuality), and enforces non-derogatory language.
              </p>
            </div>
          </div>

          {/* Checkbox Declarations */}
          <div className="space-y-2.5 pt-2 border-t border-[#E8E2D8] dark:border-[#3D332C]">
            <label className="flex items-start gap-3 p-3 rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] bg-[#FAF7F2]/60 dark:bg-[#171311] hover:bg-[#FAF7F2] dark:hover:bg-[#221C18] cursor-pointer transition">
              <input
                type="checkbox"
                id="age-confirm-checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#D8CEBF] text-[#211813] focus:ring-[#8C5E3C]"
              />
              <span className="text-xs text-[#211813] dark:text-[#F5EFEB]">
                I confirm that I am at least <strong>18 years of age</strong>.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] bg-[#FAF7F2]/60 dark:bg-[#171311] hover:bg-[#FAF7F2] dark:hover:bg-[#221C18] cursor-pointer transition">
              <input
                type="checkbox"
                id="consent-confirm-checkbox"
                checked={consentConfirmed}
                onChange={(e) => setConsentConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#D8CEBF] text-[#211813] focus:ring-[#8C5E3C]"
              />
              <span className="text-xs text-[#211813] dark:text-[#F5EFEB]">
                I verify that all photographs uploaded represent <strong>consenting adults (18+)</strong> and strictly comply with ethical research guidelines.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] bg-[#FAF7F2]/60 dark:bg-[#171311] hover:bg-[#FAF7F2] dark:hover:bg-[#221C18] cursor-pointer transition">
              <input
                type="checkbox"
                id="scientific-confirm-checkbox"
                checked={scientificAcknowledge}
                onChange={(e) => setScientificAcknowledge(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#D8CEBF] text-[#211813] focus:ring-[#8C5E3C]"
              />
              <span className="text-xs text-[#211813] dark:text-[#F5EFEB]">
                I acknowledge that results are <strong>probabilistic perceptions based on model training data</strong>, not objective judgments of human value.
              </span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#FAF7F2] dark:bg-[#221C18] px-6 py-4 border-t border-[#E8E2D8] dark:border-[#3D332C] flex items-center justify-between">
          <div className="text-[11px] text-[#8C7D70] dark:text-[#A69688] font-mono">
            {canProceed ? (
              <span className="text-[#4A6B53] dark:text-[#6B9071] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Requirements Met
              </span>
            ) : (
              <span>Please confirm all 3 declarations</span>
            )}
          </div>
          <button
            id="consent-proceed-btn"
            onClick={onConfirm}
            disabled={!canProceed}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer font-sans ${
              canProceed
                ? 'bg-[#211813] hover:bg-[#3D2C21] dark:bg-[#C99765] dark:hover:bg-[#DDB082] text-[#FAF7F2] dark:text-[#171311] shadow-xs'
                : 'bg-[#EAE4DC] dark:bg-[#2B231F] text-[#8C7D70] dark:text-[#A69688] cursor-not-allowed'
            }`}
          >
            Enter ANDESHA Platform
          </button>
        </div>
      </div>
    </div>
  );
};
