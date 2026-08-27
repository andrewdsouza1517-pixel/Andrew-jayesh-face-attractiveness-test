import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  ArrowLeftRight,
  Download,
  Share2,
  Check,
  Sparkles,
  Shield,
  HelpCircle,
  Trophy,
  Flame,
  Scale,
  Volume2,
  Info,
  RefreshCw,
  Lock,
  Zap,
} from 'lucide-react';
import type { ComparisonResult, ImageInputItem, RoastStyle, RoastIntensity, RoastBreakdown } from '../types/experiment';
import { BradleyTerryGauge } from './BradleyTerryGauge';
import { RadarFeatureChart } from './RadarFeatureChart';
import { ContributingFactorsList } from './ContributingFactorsList';
import { AttributeComparisonList } from './AttributeComparisonList';
import { SpokenResultsPlayer } from './SpokenResultsPlayer';
import { RaviPrankBanner } from './RaviPrankBanner';

interface ResultsViewProps {
  imageA: ImageInputItem;
  imageB: ImageInputItem;
  result: ComparisonResult;
  roastMode: boolean;
  prankMode?: boolean;
  onToggleRoastMode: (enabled: boolean) => void;
  onTogglePrankMode?: (enabled: boolean) => void;
  onInvertPair: () => void;
  onNewComparison: () => void;
  onOpenMethodology: () => void;
}

const ROAST_STYLES: { id: RoastStyle; label: string; icon: string; description: string }[] = [
  { id: 'SAVAGE', label: 'Savage', icon: '🔥', description: 'Sharp, ruthless, competitive Hinglish comedy' },
  { id: 'DEADPAN', label: 'Deadpan', icon: '😐', description: 'Clinical, hyper-logical, emotionless Hinglish statistics' },
  { id: 'SPORTS', label: 'Sports Host', icon: '🎙️', description: 'High-octane IPL/stadium commentator energy' },
  { id: 'DRAMATIC', label: 'Dramatic', icon: '🎭', description: 'Bollywood cinematic drama with theatrical flair' },
  { id: 'CORPORATE', label: 'Corporate', icon: '💼', description: 'Passive-aggressive corporate HR performance review' },
  { id: 'CHAOTIC', label: 'Chaotic', icon: '🌀', description: 'Unpredictable, high-energy Indian internet meme commentary' },
];

const ROAST_INTENSITIES: { id: RoastIntensity; label: string; badge: string }[] = [
  { id: 'PLAYFUL', label: 'Playful', badge: '😊 Light' },
  { id: 'SAVAGE', label: 'Savage', badge: '🔥 Default' },
  { id: 'NUCLEAR', label: 'Nuclear', badge: '💀 Maximum' },
];

export const ResultsView: React.FC<ResultsViewProps> = ({
  imageA,
  imageB,
  result: initialResult,
  roastMode,
  prankMode = false,
  onToggleRoastMode,
  onTogglePrankMode,
  onInvertPair,
  onNewComparison,
  onOpenMethodology,
}) => {
  const [currentResult, setCurrentResult] = useState<ComparisonResult>(initialResult);
  const [selectedStyle, setSelectedStyle] = useState<RoastStyle>('SAVAGE');
  const [selectedIntensity, setSelectedIntensity] = useState<RoastIntensity>('SAVAGE');
  const [isRegeneratingRoast, setIsRegeneratingRoast] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [roastHistory, setRoastHistory] = useState<string[]>([]);

  // Staged Reveal Animation State
  const [revealStage, setRevealStage] = useState<number>(0);

  // Keep currentResult in sync if initialResult changes from outside
  useEffect(() => {
    setCurrentResult(initialResult);
    setRoastHistory([]); // Clear history on new result
  }, [initialResult]);

  // Staged reveal sequence on mount
  useEffect(() => {
    setRevealStage(1);
    const t1 = setTimeout(() => setRevealStage(2), 120);
    const t2 = setTimeout(() => setRevealStage(3), 280);
    const t3 = setTimeout(() => setRevealStage(4), 450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [initialResult.id]);

  const percentA = Math.round((currentResult.preference?.A ?? currentResult.pairwiseProbabilities?.preferenceA ?? 0.5) * 100);
  const percentB = Math.round((currentResult.preference?.B ?? currentResult.pairwiseProbabilities?.preferenceB ?? 0.5) * 100);
  const confPercent = Math.round((currentResult.confidence ?? 0.8) * 100);

  const nameA = imageA.personName || imageA.name || 'Person A';
  const nameB = imageB.personName || imageB.name || 'Person B';

  const isRaviA = nameA.trim().toLowerCase() === 'ravi';
  const isRaviB = nameB.trim().toLowerCase() === 'ravi';
  const isRaviPresent = isRaviA || isRaviB;
  const raviName = isRaviA ? nameA : isRaviB ? nameB : 'Ravi';
  const showPrankBanner = prankMode && isRaviPresent;

  const winnerLabel =
    currentResult.winner === 'A'
      ? nameA
      : currentResult.winner === 'B'
      ? nameB
      : 'Equally Matched (Tie)';

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentResult, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pairwise_perception_exp_${currentResult.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopySummary = () => {
    const roastTxt = currentResult.roastData
      ? `${currentResult.roastData.verdict} (Loser: ${currentResult.roastData.loserRoast})`
      : currentResult.roastCommentary;

    const text = `[Pairwise Perception Model Evaluation]
Winner: ${winnerLabel}
Predicted Preference:
- ${nameA}: ${percentA}%
- ${nameB}: ${percentB}%
Confidence: ${confPercent}%
Summary: ${currentResult.summary}
Commentary (${roastMode ? `Roast Mode - ${selectedStyle}` : 'Standard'}): ${roastMode ? roastTxt : currentResult.playfulCommentary}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateRoast = async (targetStyle?: RoastStyle, targetIntensity?: RoastIntensity) => {
    const styleToUse = targetStyle || selectedStyle;
    const intensityToUse = targetIntensity || selectedIntensity;
    setIsRegeneratingRoast(true);

    try {
      console.log(`[Roast Pipeline] Generating Hinglish roast with style=${styleToUse} intensity=${intensityToUse} for analysisId=${currentResult.id}`);
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          result: currentResult,
          style: styleToUse,
          intensity: intensityToUse,
          history: roastHistory,
          names: { A: nameA, B: nameB }
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to generate roast commentary: HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data && data.roastData) {
        console.log(`[Roast Pipeline] New Hinglish roast received. length=${data.roastData.verdict?.length}`);
        setCurrentResult((prev) => ({
          ...prev,
          roastData: data.roastData,
          playfulCommentary: data.playfulCommentary || prev.playfulCommentary,
          roastCommentary: data.roastCommentary || prev.roastCommentary,
        }));
        setRoastHistory((prev) => [...prev, data.roastData.verdict]);
      }
    } catch (err) {
      console.error('[Roast Pipeline] Error regenerating roast:', err);
    } finally {
      setIsRegeneratingRoast(false);
    }
  };

  const activeRoast: RoastBreakdown = currentResult.roastData || {
    style: selectedStyle,
    verdict: currentResult.roastCommentary || currentResult.playfulCommentary || 'The scoreboard has spoken.',
    loserRoast: currentResult.winner === 'A' ? `${nameB}'s comeback arc starts next season.` : `${nameA}'s comeback arc starts next season.`,
    winnerEnergy: `Commanding lead for ${winnerLabel}.`,
    spokenVersion: currentResult.roastCommentary || currentResult.playfulCommentary || 'The scoreboard has spoken.',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Pair Preview and Global Actions */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-blue-500/50 shadow-md relative group">
              <img src={imageA.dataUrl} alt={nameA} className="w-full h-full object-cover" />
              <span className="absolute bottom-0 left-0 right-0 bg-blue-600/90 text-[9px] font-mono font-bold text-white text-center">
                A
              </span>
            </div>
            <span className="text-slate-600 font-mono font-black italic text-xs">VS</span>
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-500/50 shadow-md relative group">
              <img src={imageB.dataUrl} alt={nameB} className="w-full h-full object-cover" />
              <span className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 text-[9px] font-mono font-bold text-white text-center">
                B
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              Pairwise Perception Analysis Completed
            </h2>
            <p className="text-xs text-slate-400">
              Evaluated on {new Date(currentResult.timestamp).toLocaleTimeString()} • Model: Decoupled Bradley–Terry Vision
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Roast Mode Toggle in Toolbar */}
          <button
            id="roast-mode-toggle-btn"
            onClick={() => onToggleRoastMode(!roastMode)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
              roastMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-md shadow-amber-950/20'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle between neutral constructive commentary and playful competitive roast mode"
          >
            <Flame className={`w-3.5 h-3.5 ${roastMode ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Roast Mode: {roastMode ? 'ON (Savage)' : 'OFF (Neutral)'}</span>
          </button>

          {/* Prank Mode Toggle in Toolbar */}
          {onTogglePrankMode && (
            <button
              id="prank-mode-toggle-btn"
              onClick={() => onTogglePrankMode(!prankMode)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
                prankMode
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-md shadow-purple-950/20'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Prank Mode for fictional comedic results (OFF by default)"
            >
              <Sparkles className={`w-3.5 h-3.5 ${prankMode ? 'text-purple-400 animate-pulse' : 'text-slate-500'}`} />
              <span>Prank Mode 😈: {prankMode ? 'ON' : 'OFF'}</span>
            </button>
          )}

          <button
            id="invert-pair-btn"
            onClick={onInvertPair}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition flex items-center gap-1.5 cursor-pointer"
            title="Invert pair order (A ⇄ B) to test for presentation order invariance"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
            <span>Invert Pair</span>
          </button>

          <button
            id="export-json-btn"
            onClick={handleExportJson}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export JSON</span>
          </button>

          <button
            id="copy-summary-btn"
            onClick={handleCopySummary}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-mono">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            id="new-comparison-btn"
            onClick={onNewComparison}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg shadow-blue-900/30 flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Pair</span>
          </button>
        </div>
      </div>

      {/* Ravi Prank Banner Overlay (If Prank Mode ON and name is Ravi) */}
      {showPrankBanner && (
        <RaviPrankBanner raviName={raviName} />
      )}

      {/* Primary Executive Results Summary Card (Stage 1 & 2) */}
      <div
        className={`bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-6 transition-all duration-300 ${
          revealStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Winner Block */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl shrink-0">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block">
                Predicted Recipient
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {currentResult.winner === 'A' ? (
                  <span className="text-blue-400">{nameA}</span>
                ) : currentResult.winner === 'B' ? (
                  <span className="text-emerald-400">{nameB}</span>
                ) : (
                  <span className="text-amber-400">Statistical Tie</span>
                )}
              </h3>
            </div>
          </div>

          {/* Predicted Preference Split */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block mb-1">
              Predicted Preference
            </span>
            <div className="flex items-center justify-between font-mono text-sm font-bold">
              <span className="text-blue-400">{nameA}: {percentA}%</span>
              <span className="text-slate-500 text-xs font-normal">vs</span>
              <span className="text-emerald-400">{nameB}: {percentB}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex border border-slate-700/40 mt-2">
              <div style={{ width: `${percentA}%` }} className="bg-blue-500 h-full transition-all duration-700" />
              <div style={{ width: `${percentB}%` }} className="bg-emerald-500 h-full transition-all duration-700" />
            </div>
          </div>

          {/* Confidence Rating */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block">
                Model Confidence
              </span>
              <div className="text-xl font-mono font-bold text-white mt-0.5">
                {confPercent}%
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
              {currentResult.bradleyTerryMetrics?.confidenceLevel || 'Moderate'}
            </span>
          </div>
        </div>

        {/* Standard Model Commentary (When Roast Mode is OFF) */}
        {!roastMode && (
          <div className="p-4 rounded-xl border bg-blue-500/5 border-blue-500/20 text-slate-200">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 font-mono text-blue-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Model Analytical Commentary</span>
              </span>
              <button
                id="enable-roast-link-btn"
                onClick={() => onToggleRoastMode(true)}
                className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer flex items-center gap-1"
              >
                <Flame className="w-3 h-3" />
                <span>Enable Roast Mode</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              {currentResult.playfulCommentary}
            </p>
          </div>
        )}
      </div>

      {/* FLAGSHIP ROAST MODE CARD (When Roast Mode is ON) */}
      {roastMode && (
        <div
          id="roast-mode-card"
          className={`bg-slate-900/95 border-2 border-amber-500/40 rounded-2xl p-6 shadow-2xl shadow-amber-950/20 backdrop-blur-md space-y-6 relative overflow-hidden transition-all duration-300 ${
            revealStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Subtle Ambient Background Glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl shrink-0">
                <Flame className="w-5 h-5 animate-bounce" style={{ animationDuration: '2s' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight uppercase font-mono">
                    Scoreboard Roast
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/20 border border-amber-500/30 text-amber-300">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Result-aware, attribute-grounded competitive commentary
                </p>
              </div>
            </div>

            {/* Score Stability Guarantee Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300 font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scoreboard Frozen</span>
            </div>
          </div>

          {/* Roast Style & Intensity Selector Chips */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Select Personality Persona:
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                <span>Intensity:</span>
                <div className="flex bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/80">
                  {ROAST_INTENSITIES.map((inst) => {
                    const isActive = selectedIntensity === inst.id;
                    return (
                      <button
                        key={inst.id}
                        id={`roast-intensity-${inst.id.toLowerCase()}-btn`}
                        onClick={() => {
                          setSelectedIntensity(inst.id);
                          handleRegenerateRoast(selectedStyle, inst.id);
                        }}
                        disabled={isRegeneratingRoast}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {inst.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {ROAST_STYLES.map((st) => {
                const isActive = selectedStyle === st.id;
                return (
                  <button
                    key={st.id}
                    id={`roast-style-${st.id.toLowerCase()}-btn`}
                    onClick={() => {
                      setSelectedStyle(st.id);
                      handleRegenerateRoast(st.id, selectedIntensity);
                    }}
                    disabled={isRegeneratingRoast}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-900/40'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80'
                    }`}
                    title={st.description}
                  >
                    <span>{st.icon}</span>
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Verdict Roast Quote Block */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-5 space-y-2 relative">
            <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                The Verdict ({selectedStyle})
              </span>
              <span className="text-slate-500 font-normal text-[10px]">
                Grounded on 8 Visual Axes
              </span>
            </div>
            <blockquote className="text-sm sm:text-base font-medium text-amber-100 italic leading-relaxed pt-1">
              "{activeRoast.verdict}"
            </blockquote>
          </div>

          {/* Side-by-Side: Loser Roast & Winner Energy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* For the Loser */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-red-400 flex items-center gap-1.5">
                <span>🔥</span>
                <span>For the Competition ({currentResult.winner === 'A' ? nameB : nameA})</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeRoast.loserRoast}
              </p>
            </div>

            {/* Winner Energy */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
                <span>⚡</span>
                <span>Winner Energy ({winnerLabel})</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeRoast.winnerEnergy}
              </p>
            </div>
          </div>

          {/* Action Footer Bar */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span>Humor targets scoreboard & presentation choices only. Safe & respectful.</span>
            </div>

            <button
              id="roast-again-btn"
              onClick={() => handleRegenerateRoast()}
              disabled={isRegeneratingRoast}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-lg ${
                isRegeneratingRoast
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/40 hover:-translate-y-0.5'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingRoast ? 'animate-spin' : ''}`} />
              <span>{isRegeneratingRoast ? 'Crafting New Roast...' : '🔥 Roast Again'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Spoken Narration Player Component (Stage 3) */}
      <div
        className={`transition-all duration-300 ${
          revealStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <SpokenResultsPlayer
          result={currentResult}
          imageA={imageA}
          imageB={imageB}
          roastMode={roastMode}
          prankMode={showPrankBanner}
          prankRoastText="Ravi has somehow achieved a score so low that the algorithm is requesting a software update."
        />
      </div>

      {/* Visual Attribute-by-Attribute Breakdown (Stage 4) */}
      <div
        className={`transition-all duration-300 ${
          revealStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <AttributeComparisonList
          attributes={currentResult.attributes || []}
          nameA={nameA}
          nameB={nameB}
        />
      </div>

      {/* Latent Probability Distribution & Confidence Interval */}
      <BradleyTerryGauge result={currentResult} />

      {/* Two Column Visual Breakdown: Radar Chart & Factors List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RadarFeatureChart
          featuresA={currentResult.imageA?.visualFeatures}
          featuresB={currentResult.imageB?.visualFeatures}
          nameA={nameA}
          nameB={nameB}
        />
        <ContributingFactorsList
          factors={currentResult.scientificAnalysis?.contributingFactors || []}
          featuresA={currentResult.imageA?.visualFeatures}
          featuresB={currentResult.imageB?.visualFeatures}
        />
      </div>

      {/* Scientific Context & Ethical Guardrail Callout */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-slate-300 text-xs flex items-start gap-4 backdrop-blur-md">
        <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl shrink-0 mt-0.5">
          <Shield className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white text-xs uppercase tracking-wider">
              Psychometric Interpretation Guardrail
            </span>
            <button
              onClick={onOpenMethodology}
              className="text-blue-400 hover:text-blue-300 font-mono text-[11px] underline flex items-center gap-1 cursor-pointer"
            >
              <span>Review full methodology</span>
              <HelpCircle className="w-3 h-3" />
            </button>
          </div>
          <p className="text-slate-400 leading-relaxed">
            These are AI predictions of perceived attractiveness based on the model’s reference data, not objective measurements of human worth or universal beauty.
          </p>
        </div>
      </div>
    </div>
  );
};
