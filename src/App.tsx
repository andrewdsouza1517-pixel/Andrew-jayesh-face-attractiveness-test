import React, { useState, useEffect, useRef } from 'react';
import {
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  RefreshCw,
  Info,
  CheckCircle2,
  EyeOff,
  Sliders,
  Flame,
  ArrowLeft,
  Clock,
  Layers,
} from 'lucide-react';
import type { ComparisonResult, ImageInputItem, AnalysisStage } from './types/experiment';
import { Header } from './components/Header';
import { ConsentGateModal } from './components/ConsentGateModal';
import { ImageUploadCard } from './components/ImageUploadCard';
import { PresetSelector } from './components/PresetSelector';
import { ResultsView } from './components/ResultsView';
import { MethodologyDrawer } from './components/MethodologyDrawer';
import { SessionHistoryModal } from './components/SessionHistoryModal';

const CONSENT_STORAGE_KEY = 'pairwise_experiment_consent_v1';
const HISTORY_STORAGE_KEY = 'pairwise_experiment_history_v1';
const ROAST_MODE_STORAGE_KEY = 'pairwise_experiment_roast_mode_v1';
const PRANK_MODE_STORAGE_KEY = 'pairwise_experiment_prank_mode_v1';

// Total client timeout ceiling (65 seconds)
const CLIENT_FETCH_TIMEOUT_MS = 65000;

export default function App() {
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [imageA, setImageA] = useState<ImageInputItem | null>(null);
  const [imageB, setImageB] = useState<ImageInputItem | null>(null);
  const [roastMode, setRoastMode] = useState<boolean>(false);
  const [prankMode, setPrankMode] = useState<boolean>(false);
  const [activeResult, setActiveResult] = useState<ComparisonResult | null>(null);
  const [history, setHistory] = useState<ComparisonResult[]>([]);

  // Explicit Analysis State Machine
  const [analysisStage, setAnalysisStage] = useState<AnalysisStage>('IDLE');
  const [stageMessage, setStageMessage] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<{ title: string; message: string; isTimeout?: boolean } | null>(null);

  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Ref to abort ongoing fetch if user cancels or resets
  const abortControllerRef = useRef<AbortController | null>(null);
  const stageTimersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllStageTimers = () => {
    stageTimersRef.current.forEach((t) => clearTimeout(t));
    stageTimersRef.current = [];
  };

  // Initialize consent, history, and roast mode from localStorage
  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (savedConsent === 'true') {
      setHasConsented(true);
    }
    const savedRoast = localStorage.getItem(ROAST_MODE_STORAGE_KEY);
    if (savedRoast === 'true') {
      setRoastMode(true);
    }
    const savedPrank = localStorage.getItem(PRANK_MODE_STORAGE_KEY);
    if (savedPrank === 'true') {
      setPrankMode(true);
    }
    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn('Failed to parse history from storage:', e);
    }
  }, []);

  const handleConsentConfirm = () => {
    setHasConsented(true);
    localStorage.setItem(CONSENT_STORAGE_KEY, 'true');
  };

  const handleToggleRoastMode = (enabled: boolean) => {
    setRoastMode(enabled);
    localStorage.setItem(ROAST_MODE_STORAGE_KEY, String(enabled));
  };

  const handleTogglePrankMode = (enabled: boolean) => {
    setPrankMode(enabled);
    localStorage.setItem(PRANK_MODE_STORAGE_KEY, String(enabled));
  };

  const handleSelectPreset = async (
    dataUrlA: string,
    nameA: string,
    dataUrlB: string,
    nameB: string
  ) => {
    // Extract actual name from preset names if possible (e.g. removing file extensions, etc) or use as is
    setImageA({
      id: 'preset_a_' + Date.now(),
      name: nameA,
      personName: nameA.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
      dataUrl: dataUrlA,
      mimeType: 'image/jpeg',
      isSample: true,
    });
    setImageB({
      id: 'preset_b_' + Date.now(),
      name: nameB,
      personName: nameB.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
      dataUrl: dataUrlB,
      mimeType: 'image/jpeg',
      isSample: true,
    });
    setActiveResult(null);
    setAnalysisStage('IDLE');
    setErrorDetails(null);
  };

  const handleRunComparison = async () => {
    // 1. Validation phase
    if (!imageA || !imageB) {
      setErrorDetails({
        title: 'Photographs Required',
        message: 'Please upload or select both photographs (Subject Alpha and Subject Bravo) to run the analysis.',
      });
      setAnalysisStage('ERROR');
      return;
    }
    

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    clearAllStageTimers();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const analysisId = 'exp_' + Math.random().toString(36).substring(2, 9);
    console.log(`[Frontend] [${analysisId}] Initiating pairwise analysis request.`);

    setErrorDetails(null);
    setAnalysisStage('VALIDATING');
    setStageMessage('Validating photograph data & resolution integrity...');

    // Progress Stage progression timers
    const timer1 = setTimeout(() => {
      setAnalysisStage('UPLOADING');
      setStageMessage('Encrypting and sending portrait vectors to AI perception service...');
    }, 600);
    stageTimersRef.current.push(timer1);

    const timer2 = setTimeout(() => {
      setAnalysisStage('ANALYZING');
      setStageMessage('Evaluating 8 visual axes (symmetry, lighting, expression warmth, styling)...');
    }, 2200);
    stageTimersRef.current.push(timer2);

    const timer3 = setTimeout(() => {
      setStageMessage('Primary AI model busy — utilizing high-speed backup model...');
    }, 12000);
    stageTimersRef.current.push(timer3);

    const timer4 = setTimeout(() => {
      setAnalysisStage('PROCESSING_RESULT');
      setStageMessage('Computing Bradley–Terry probabilistic ranking & confidence intervals...');
    }, 18000);
    stageTimersRef.current.push(timer4);

    // Hard client-side timeout timer
    const hardTimeoutTimer = setTimeout(() => {
      console.warn(`[Frontend] [${analysisId}] Client hard timeout (${CLIENT_FETCH_TIMEOUT_MS}ms) fired.`);
      controller.abort();
    }, CLIENT_FETCH_TIMEOUT_MS);
    stageTimersRef.current.push(hardTimeoutTimer);

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Analysis-Id': analysisId,
        },
        signal: controller.signal,
        body: JSON.stringify({
          analysisId,
          imageA: imageA.dataUrl,
          imageB: imageB.dataUrl, nameA: imageA.personName || imageA.name || "Person A", nameB: imageB.personName || imageB.name || "Person B",
        }),
      });

      clearAllStageTimers();

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson.error || `Server responded with status ${response.status}`;
        throw new Error(errMsg);
      }

      setAnalysisStage('PROCESSING_RESULT');
      setStageMessage('Finalizing statistical outputs and commentary...');

      const result: ComparisonResult = await response.json();

      if (!result || typeof result !== 'object') {
        throw new Error('Received an invalid or malformed result from the server.');
      }

      console.log(`[Frontend] [${analysisId}] Successfully received comparison result:`, result.winner, result.preference);

      setActiveResult(result);
      setAnalysisStage('SUCCESS');
      setStageMessage('');

      if (result.status === 'success' && result.adultVerificationPassed) {
        const updatedHistory = [result, ...history.slice(0, 19)];
        setHistory(updatedHistory);
        try {
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
        } catch (e) {
          console.warn('Storage quota exceeded');
        }
      }
    } catch (err: any) {
      clearAllStageTimers();
      console.error(`[Frontend] [${analysisId}] Comparison error:`, err);

      const isAbort = err.name === 'AbortError' || String(err).includes('aborted');
      let friendlyTitle = 'Analysis couldn’t be completed';
      let friendlyMessage = 'The AI service didn’t return a usable result. Please try again.';

      if (isAbort) {
        friendlyTitle = 'Analysis Timed Out';
        friendlyMessage = 'The visual analysis took longer than expected (exceeded timeout limit). Please try again with clear portrait photographs.';
      } else if (err.message) {
        const rawMsg = err.message.toLowerCase();
        if (rawMsg.includes('failed to fetch') || rawMsg.includes('load failed')) {
          friendlyMessage = 'Connection to the perception server was interrupted. Please check your connection and try again.';
        } else if (rawMsg.includes('adult') || rawMsg.includes('18+')) {
          friendlyTitle = 'Safety Protocol Notice';
          friendlyMessage = err.message;
        } else if (rawMsg.includes('quota') || rawMsg.includes('rate limit') || rawMsg.includes('busy')) {
          friendlyTitle = 'AI Service High Demand';
          friendlyMessage = 'The AI perception engine is currently handling high traffic. Please retry in a few moments.';
        } else {
          friendlyMessage = err.message;
        }
      }

      setErrorDetails({
        title: friendlyTitle,
        message: friendlyMessage,
        isTimeout: isAbort,
      });
      setAnalysisStage('ERROR');
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleInvertPair = () => {
    if (!imageA || !imageB) return;
    const tempA = imageA;
    const tempB = imageB;
    setImageA(tempB);
    setImageB(tempA);

    if (activeResult && activeResult.status === 'success') {
      const prevA = activeResult.preference?.A ?? activeResult.pairwiseProbabilities?.preferenceA ?? 0.5;
      const prevB = activeResult.preference?.B ?? activeResult.pairwiseProbabilities?.preferenceB ?? 0.5;
      const [low, high] = activeResult.bradleyTerryMetrics.uncertaintyInterval;

      const invertedWinner: 'A' | 'B' | 'TIE' =
        activeResult.winner === 'A' ? 'B' : activeResult.winner === 'B' ? 'A' : 'TIE';

      const invertedAttributes = (activeResult.attributes || []).map((attr) => ({
        ...attr,
        A: attr.B,
        B: attr.A,
        winner: (attr.winner === 'A' ? 'B' : attr.winner === 'B' ? 'A' : 'TIE') as 'A' | 'B' | 'TIE',
      }));

      const inverted: ComparisonResult = {
        ...activeResult,
        id: 'res_' + Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        winner: invertedWinner,
        preference: {
          A: prevB,
          B: prevA,
        },
        attributes: invertedAttributes,
        imageA: activeResult.imageB,
        imageB: activeResult.imageA,
        pairwiseProbabilities: {
          preferenceA: prevB,
          preferenceB: prevA,
          oddsRatio: Number((prevB / (prevA || 0.001)).toFixed(2)),
        },
        bradleyTerryMetrics: {
          ...activeResult.bradleyTerryMetrics,
          scoreDelta: -activeResult.bradleyTerryMetrics.scoreDelta,
          logisticCurveValue: prevB,
          uncertaintyInterval: [
            Number((1 - high).toFixed(3)),
            Number((1 - low).toFixed(3)),
          ],
        },
      };
      setActiveResult(inverted);
    }
  };

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    clearAllStageTimers();
    setImageA(null);
    setImageB(null);
    setActiveResult(null);
    setAnalysisStage('IDLE');
    setErrorDetails(null);
    setStageMessage('');
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  const isAnalyzing =
    analysisStage === 'VALIDATING' ||
    analysisStage === 'UPLOADING' ||
    analysisStage === 'ANALYZING' ||
    analysisStage === 'PROCESSING_RESULT';

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* 18+ Consent Gate Modal */}
      <ConsentGateModal
        isOpen={!hasConsented}
        onConfirm={handleConsentConfirm}
      />

      {/* Main Navigation Header */}
      <Header
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onReset={handleReset}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Research Context Banner with Roast Mode Toggle */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 backdrop-blur-md">
          <div className="max-w-2xl space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                Bradley–Terry Model
              </span>
              <h2 className="text-xl font-light text-white tracking-tight">
                Pairwise Perception Analysis Lab
              </h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Quantifies relative pairwise preference probabilities across 8 visual and photographic dimensions based on adult observer calibration data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Roast Mode Toggle Button */}
            <button
              id="main-roast-toggle-btn"
              onClick={() => handleToggleRoastMode(!roastMode)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center gap-2 cursor-pointer shadow-md ${
                roastMode
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-amber-900/20'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className={`w-4 h-4 ${roastMode ? 'text-amber-400' : 'text-slate-500'}`} />
              <div className="text-left font-mono">
                <div className="text-[10px] uppercase text-slate-400">Roast Mode</div>
                <div className="font-bold">{roastMode ? 'ON (Playful)' : 'OFF (Neutral)'}</div>
              </div>
            </button>

            {/* Prank Mode Toggle Button */}
            <button
              id="main-prank-toggle-btn"
              onClick={() => handleTogglePrankMode(!prankMode)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center gap-2 cursor-pointer shadow-md ${
                prankMode
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-purple-950/30'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Prank Mode for fictional comedic results (OFF by default)"
            >
              <Sparkles className={`w-4 h-4 ${prankMode ? 'text-purple-400' : 'text-slate-500'}`} />
              <div className="text-left font-mono">
                <div className="text-[10px] uppercase text-slate-400">Prank Mode 😈</div>
                <div className="font-bold">{prankMode ? 'ON (Ravi Prank)' : 'OFF'}</div>
              </div>
            </button>

            {/* Metrics Mini Box */}
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 flex items-center space-x-5 text-center">
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-mono font-bold">Categories</div>
                <div className="text-base font-mono font-bold text-blue-400">8 Axes</div>
              </div>
              <div className="h-6 w-px bg-slate-700/50" />
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-mono font-bold">Speech Audio</div>
                <div className="text-base font-mono font-bold text-emerald-400">Enabled</div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Screen OR Upload Screen */}
        {activeResult && analysisStage === 'SUCCESS' ? (
          <ResultsView
            result={activeResult}
            imageA={imageA!}
            imageB={imageB!}
            roastMode={roastMode}
            prankMode={prankMode}
            onToggleRoastMode={handleToggleRoastMode}
            onTogglePrankMode={handleTogglePrankMode}
            onNewComparison={() => {
              setActiveResult(null);
              setAnalysisStage('IDLE');
              setErrorDetails(null);
            }}
            onInvertPair={handleInvertPair}
            onOpenMethodology={() => setIsMethodologyOpen(true)}
          />
        ) : (
          <div className="space-y-6">
            {/* Upload Area: 2 Columns with VS Divider */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5">
                <ImageUploadCard
                  label="Subject Alpha"
                  badge="Person A"
                  image={imageA}
                  onImageChange={(img) => {
                    setImageA(img);
                    if (analysisStage === 'ERROR') setAnalysisStage('IDLE');
                  }}
                  accentColor="indigo"
                  disabled={isAnalyzing}
                />
              </div>

              <div className="md:col-span-2 flex flex-col items-center justify-center space-y-4 py-2">
                <div className="text-3xl sm:text-4xl font-black text-slate-700 italic tracking-widest select-none">
                  VS
                </div>

                <button
                  id="run-compare-btn"
                  onClick={handleRunComparison}
                  disabled={!imageA || !imageB || isAnalyzing}
                  className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    imageA && imageB && !isAnalyzing
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40 hover:-translate-y-0.5'
                      : 'bg-slate-800/80 text-slate-600 border border-slate-700/50 cursor-not-allowed'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Scale className="w-4 h-4" />
                      <span>Run Comparison</span>
                    </>
                  )}
                </button>

                <div className="text-center space-y-0.5">
                  <p className="text-[10px] uppercase text-slate-500 tracking-wider font-mono">
                    8-Axis Perception
                  </p>
                  <p className="text-[10px] uppercase text-slate-500 tracking-wider font-mono">
                    Voice Narration Ready
                  </p>
                </div>
              </div>

              <div className="md:col-span-5">
                <ImageUploadCard
                  label="Subject Bravo"
                  badge="Person B"
                  image={imageB}
                  onImageChange={(img) => {
                    setImageB(img);
                    if (analysisStage === 'ERROR') setAnalysisStage('IDLE');
                  }}
                  accentColor="emerald"
                  disabled={isAnalyzing}
                />
              </div>
            </div>

            {/* ERROR CARD: Clean user-facing state when analysis fails or times out */}
            {analysisStage === 'ERROR' && errorDetails && (
              <div
                id="analysis-error-card"
                className="max-w-xl mx-auto bg-slate-900/90 border border-red-500/30 rounded-2xl p-6 shadow-2xl space-y-4 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="text-base font-semibold text-white tracking-tight">
                      {errorDetails.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {errorDetails.message}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-end gap-3">
                  <button
                    id="error-back-btn"
                    onClick={() => {
                      setAnalysisStage('IDLE');
                      setErrorDetails(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Setup</span>
                  </button>

                  <button
                    id="error-retry-btn"
                    onClick={handleRunComparison}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-900/30 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE PROGRESS CARD: Explicit Stage Feedback with Animated Stepper */}
            {isAnalyzing && (
              <div
                id="analysis-progress-card"
                className="max-w-lg mx-auto bg-slate-900/90 rounded-2xl border border-blue-500/30 p-6 shadow-2xl text-center space-y-4 backdrop-blur-md animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-center gap-2.5 text-xs font-semibold text-blue-400 font-mono">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="uppercase tracking-wider">
                    {analysisStage === 'VALIDATING' && 'Step 1: Format Validation'}
                    {analysisStage === 'UPLOADING' && 'Step 2: Vector Packaging'}
                    {analysisStage === 'ANALYZING' && 'Step 3: Multi-Axis Vision Evaluation'}
                    {analysisStage === 'PROCESSING_RESULT' && 'Step 4: Bradley–Terry Ranking'}
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-200">
                  {stageMessage || 'Processing pairwise visual signals...'}
                </p>

                {/* Stepper Dots & Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-500 rounded-full"
                      style={{
                        width:
                          analysisStage === 'VALIDATING'
                            ? '25%'
                            : analysisStage === 'UPLOADING'
                            ? '50%'
                            : analysisStage === 'ANALYZING'
                            ? '75%'
                            : '95%',
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
                    <span className={analysisStage === 'VALIDATING' ? 'text-blue-400 font-bold' : ''}>Validate</span>
                    <span className={analysisStage === 'UPLOADING' ? 'text-blue-400 font-bold' : ''}>Transmit</span>
                    <span className={analysisStage === 'ANALYZING' ? 'text-blue-400 font-bold' : ''}>Vision Model</span>
                    <span className={analysisStage === 'PROCESSING_RESULT' ? 'text-blue-400 font-bold' : ''}>Bradley–Terry</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Hard timeout active (65s limit)</span>
                  </div>
                  <button
                    onClick={() => {
                      if (abortControllerRef.current) {
                        abortControllerRef.current.abort();
                      }
                      clearAllStageTimers();
                      setAnalysisStage('IDLE');
                      setStageMessage('');
                    }}
                    className="text-red-400 hover:text-red-300 font-medium text-[11px] transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Benchmark Sample Presets */}
            <PresetSelector
              onSelectPair={handleSelectPreset}
              isLoading={isAnalyzing}
            />

            {/* Scientific Guardrails Checklist */}
            <div className="grid sm:grid-cols-3 gap-4 text-xs text-slate-400">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-start gap-3">
                <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-200 block mb-0.5">8 Visual Axes</span>
                  Outputs structured categories (lighting, symmetry, styling, expressions, etc.) with relative scores.
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-start gap-3">
                <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-200 block mb-0.5">Zero Image Retention</span>
                  Uploaded photographs are evaluated ephemerally in RAM and immediately discarded.
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-start gap-3">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-200 block mb-0.5">Strict Adult-Only (18+)</span>
                  Enforces 18+ consenting adult verification and respectful, non-derogatory analysis.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800 py-4 px-4 sm:px-8 text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 uppercase tracking-widest font-medium text-[10px]">
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Ethical Guidelines
            </button>
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Data Retention Policy
            </button>
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Methodology
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-2 py-0.5 border border-slate-700 rounded text-[10px] font-mono text-slate-400">
              ENC-V3
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Strict Privacy Mode: Active</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Methodology & Theoretical Framework Drawer */}
      <MethodologyDrawer
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Session History Modal */}
      <SessionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(item) => {
          setActiveResult(item);
          setAnalysisStage('SUCCESS');
        }}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
