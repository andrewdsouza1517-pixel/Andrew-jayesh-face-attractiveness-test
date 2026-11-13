import React, { useState, useEffect, useRef } from 'react';
import {
  Scale,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Loader2,
  RefreshCw,
  EyeOff,
  Sliders,
  Flame,
  ArrowLeft,
  Clock,
  Info,
  CheckCircle2,
} from 'lucide-react';
import type { ComparisonResult, ImageInputItem, AnalysisStage } from './types/experiment';
import { Header } from './components/Header';
import { ConsentGateModal } from './components/ConsentGateModal';
import { ImageUploadCard } from './components/ImageUploadCard';
import { PresetSelector } from './components/PresetSelector';
import { ResultsView } from './components/ResultsView';
import { MethodologyDrawer } from './components/MethodologyDrawer';
import { SessionHistoryModal } from './components/SessionHistoryModal';
import { LiquidSculptureHero } from './components/LiquidSculptureHero';
import { CursorSpotlightOverlay } from './components/CursorSpotlightOverlay';
import { AboutModal } from './components/AboutModal';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ScienceBehindSection } from './components/ScienceBehindSection';

import { ExhibitionHomepageIntro } from './components/ExhibitionHomepageIntro';
import { ExhibitionModeGuide } from './components/ExhibitionModeGuide';
import { AboutTheTeamPage } from './components/AboutTheTeamPage';

const CONSENT_STORAGE_KEY = 'pairwise_experiment_consent_v1';
const HISTORY_STORAGE_KEY = 'pairwise_experiment_history_v1';
const ROAST_MODE_STORAGE_KEY = 'pairwise_experiment_roast_mode_v1';
const PRANK_MODE_STORAGE_KEY = 'pairwise_experiment_prank_mode_v1';
const SPOTLIGHT_STORAGE_KEY = 'pairwise_experiment_spotlight_v1';

const CLIENT_FETCH_TIMEOUT_MS = 65000;

export default function App() {
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [imageA, setImageA] = useState<ImageInputItem | null>(null);
  const [imageB, setImageB] = useState<ImageInputItem | null>(null);
  const [roastMode, setRoastMode] = useState<boolean>(false);
  const [prankMode, setPrankMode] = useState<boolean>(false);
  const [activeResult, setActiveResult] = useState<ComparisonResult | null>(null);
  const [history, setHistory] = useState<ComparisonResult[]>([]);
  const [isSpotlightActive, setIsSpotlightActive] = useState<boolean>(true);
  const [isExhibitionMode, setIsExhibitionMode] = useState<boolean>(false);
  const [exhibitionStep, setExhibitionStep] = useState<number>(1);
  const [showTeamPage, setShowTeamPage] = useState<boolean>(false);

  const [analysisStage, setAnalysisStage] = useState<AnalysisStage>('IDLE');
  const [stageMessage, setStageMessage] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<{ title: string; message: string; isTimeout?: boolean } | null>(null);

  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const stageTimersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllStageTimers = () => {
    stageTimersRef.current.forEach((t) => clearTimeout(t));
    stageTimersRef.current = [];
  };

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
    const savedSpotlight = localStorage.getItem(SPOTLIGHT_STORAGE_KEY);
    if (savedSpotlight !== null) {
      setIsSpotlightActive(savedSpotlight === 'true');
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

  const handleToggleSpotlight = () => {
    setIsSpotlightActive((prev) => {
      const next = !prev;
      localStorage.setItem(SPOTLIGHT_STORAGE_KEY, String(next));
      return next;
    });
  };

  const handleSelectPreset = async (
    dataUrlA: string,
    nameA: string,
    dataUrlB: string,
    nameB: string
  ) => {
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
    if (!imageA || !imageB) {
      setErrorDetails({
        title: 'Photographs Required',
        message: 'Please upload or select both photographs (Subject Alpha and Subject Bravo) to run the analysis.',
      });
      setAnalysisStage('ERROR');
      return;
    }

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
    setStageMessage('Reading the images and checking resolution...');

    const timer1 = setTimeout(() => {
      setAnalysisStage('UPLOADING');
      setStageMessage('Analysing visual characteristics across both images...');
    }, 800);
    stageTimersRef.current.push(timer1);

    const timer2 = setTimeout(() => {
      setAnalysisStage('ANALYZING');
      setStageMessage('Comparing the two results side-by-side...');
    }, 3500);
    stageTimersRef.current.push(timer2);

    const timer3 = setTimeout(() => {
      setStageMessage('Still comparing visual characteristics — thank you for waiting...');
    }, 12000);
    stageTimersRef.current.push(timer3);

    const timer4 = setTimeout(() => {
      setAnalysisStage('PROCESSING_RESULT');
      setStageMessage('Preparing the explanation and visual charts...');
    }, 18000);
    stageTimersRef.current.push(timer4);

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
          imageB: imageB.dataUrl,
          nameA: imageA.personName || imageA.name || "Person A",
          nameB: imageB.personName || imageB.name || "Person B",
        }),
      });

      clearAllStageTimers();

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson.error || `Server responded with status ${response.status}`;
        throw new Error(errMsg);
      }

      setAnalysisStage('PROCESSING_RESULT');
      setStageMessage('Preparing the explanation and visual charts...');

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

  if (showTeamPage) {
    return <AboutTheTeamPage onReturnToApp={() => setShowTeamPage(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#171311] text-[#211813] dark:text-[#F5EFEB] flex flex-col font-sans antialiased selection:bg-[#8C5E3C] selection:text-white transition-colors duration-200">
      {/* 18+ Consent Gate Modal */}
      <ConsentGateModal
        isOpen={!hasConsented}
        onConfirm={handleConsentConfirm}
      />

      {/* Dynamic Cursor Spotlight & Torch Reveal Shroud */}
      <CursorSpotlightOverlay
        isActive={isSpotlightActive}
        onToggleActive={handleToggleSpotlight}
      />

      {/* Main Navigation Header */}
      <Header
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenTeam={() => setShowTeamPage(true)}
        historyCount={history.length}
        onReset={handleReset}
        isSpotlightActive={isSpotlightActive}
        onToggleSpotlight={handleToggleSpotlight}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Exhibition Mode Guide Banner (When Active) */}
        {isExhibitionMode && (
          <ExhibitionModeGuide
            currentStep={exhibitionStep}
            onStepChange={setExhibitionStep}
            onExit={() => setIsExhibitionMode(false)}
            hasResult={Boolean(activeResult)}
            onRunComparison={handleRunComparison}
            onOpenMethodology={() => setIsMethodologyOpen(true)}
          />
        )}

        {/* Flagship Exhibition Homepage Intro & Hero */}
        {!activeResult && (
          <div className="space-y-8">
            <ExhibitionHomepageIntro
              onStartComparison={() => {
                const el = document.getElementById('comparison-lab-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenExhibitionMode={() => {
                setIsExhibitionMode(true);
                setExhibitionStep(1);
                setTimeout(() => {
                  const el = document.getElementById('comparison-lab-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            />
            <LiquidSculptureHero
              onScrollToLab={() => {
                const el = document.getElementById('comparison-lab-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAbout={() => setIsAboutOpen(true)}
              roastMode={roastMode}
              prankMode={prankMode}
            />
          </div>
        )}

        {/* Research Context Banner */}
        <section
          id="comparison-lab-section"
          className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-6 shadow-xs dark:shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 scroll-mt-20 transition-colors"
        >
          <div className="max-w-2xl space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-bold text-[#8C5E3C] dark:text-[#C99765] uppercase tracking-wider">
                ANDESHA Exhibition Lab
              </span>
              <span aria-hidden="true" className="text-[#D8CEBF] dark:text-[#3D332C]">·</span>
              <span className="text-[#8C7D70] dark:text-[#A69688]">By Andrew & Apeksha</span>
              <span aria-hidden="true" className="text-[#D8CEBF] dark:text-[#3D332C]">·</span>
              <span className="text-[#8C7D70] dark:text-[#A69688]">8 Visual Dimensions</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight">
                Pairwise Visual Analysis Engine
              </h2>
              <p className="text-xs sm:text-sm font-editorial italic text-[#8C5E3C] dark:text-[#C99765]">
                “See Beyond the Image. Understand the Data.”
              </p>
            </div>
            <p className="text-[#5C4E43] dark:text-[#D4C7BC] text-xs sm:text-sm leading-relaxed font-sans">
              Welcome to our exhibition booth! ANDESHA evaluates two portraits side-by-side using the Bradley–Terry probabilistic choice model and multimodal vision AI across 8 real-world photographic qualities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-sans">
            {/* Roast Mode Toggle Button */}
            <button
              id="main-roast-toggle-btn"
              onClick={() => handleToggleRoastMode(!roastMode)}
              className={`px-3.5 py-2.5 rounded-lg text-xs font-medium border transition flex items-center gap-2 cursor-pointer shadow-2xs ${
                roastMode
                  ? 'bg-[#FAF7F2] dark:bg-[#2B231F] border-[#8C5E3C]/35 dark:border-[#C99765]/40 text-[#8C5E3C] dark:text-[#C99765]'
                  : 'bg-white dark:bg-[#221C18] hover:bg-[#FAF7F2] dark:hover:bg-[#2B231F] border-[#E8E2D8] dark:border-[#3D332C] text-[#5C4E43] dark:text-[#D4C7BC]'
              }`}
            >
              <Flame className={`w-4 h-4 ${roastMode ? 'text-[#8C5E3C] dark:text-[#C99765]' : 'text-[#8C7D70] dark:text-[#A69688]'}`} />
              <div className="text-left font-mono">
                <div className="text-[10px] uppercase text-[#8C7D70] dark:text-[#A69688]">Roast Mode</div>
                <div className="font-bold">{roastMode ? 'ON (Active)' : 'OFF (Neutral)'}</div>
              </div>
            </button>

            {/* Prank Mode Toggle Button */}
            <button
              id="main-prank-toggle-btn"
              onClick={() => handleTogglePrankMode(!prankMode)}
              className={`px-3.5 py-2.5 rounded-lg text-xs font-medium border transition flex items-center gap-2 cursor-pointer shadow-2xs ${
                prankMode
                  ? 'bg-purple-500/10 border-purple-500/35 text-purple-800 dark:text-purple-300'
                  : 'bg-white dark:bg-[#221C18] hover:bg-[#FAF7F2] dark:hover:bg-[#2B231F] border-[#E8E2D8] dark:border-[#3D332C] text-[#5C4E43] dark:text-[#D4C7BC]'
              }`}
              title="Toggle Prank Mode for fictional comedic results (OFF by default)"
            >
              <Sparkles className={`w-4 h-4 ${prankMode ? 'text-purple-600 dark:text-purple-400' : 'text-[#8C7D70] dark:text-[#A69688]'}`} />
              <div className="text-left font-mono">
                <div className="text-[10px] uppercase text-[#8C7D70] dark:text-[#A69688]">Prank Mode 😈</div>
                <div className="font-bold">{prankMode ? 'ON (Ravi Prank)' : 'OFF'}</div>
              </div>
            </button>

            {/* Metrics Mini Box */}
            <div className="bg-[#FAF7F2] dark:bg-[#221C18] p-3 rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] flex items-center space-x-5 text-center">
              <div>
                <div className="text-[9px] text-[#8C7D70] dark:text-[#A69688] uppercase font-mono">Axes</div>
                <div className="text-base font-editorial font-medium text-[#8C5E3C] dark:text-[#C99765]">8 Axes</div>
              </div>
              <div className="h-6 w-px bg-[#E8E2D8] dark:bg-[#3D332C]" />
              <div>
                <div className="text-[9px] text-[#8C7D70] dark:text-[#A69688] uppercase font-mono">Voice Audio</div>
                <div className="text-base font-editorial font-medium text-[#4A6B53] dark:text-[#6B9071]">Enabled</div>
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
              setTimeout(() => {
                const el = document.getElementById('comparison-lab-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            onInvertPair={handleInvertPair}
            onOpenMethodology={() => setIsMethodologyOpen(true)}
          />
        ) : (
          <div className="space-y-6">
            {/* Short Pre-Analysis Explanation Banner */}
            <div className="bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl px-5 py-4 flex items-start sm:items-center gap-3 shadow-2xs transition-colors">
              <div className="p-2 bg-white dark:bg-[#171311] rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C5E3C] dark:text-[#C99765] shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans">
                Compare two images side by side. ANDESHA will analyse the visual characteristics selected by the system and generate a probabilistic comparison.
              </p>
            </div>

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
                <div className="text-3xl sm:text-4xl font-editorial font-medium text-[#8C7D70] dark:text-[#A69688] italic tracking-widest select-none">
                  VS
                </div>

                <button
                  id="run-compare-btn"
                  onClick={handleRunComparison}
                  disabled={!imageA || !imageB || isAnalyzing}
                  className={`w-full py-4 px-4 min-h-[48px] rounded-lg font-semibold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-sans ${
                    imageA && imageB && !isAnalyzing
                      ? 'bg-[#211813] hover:bg-[#3D2C21] dark:bg-[#C99765] dark:hover:bg-[#DDB082] text-[#FAF7F2] dark:text-[#171311] shadow-xs hover:-translate-y-0.5'
                      : 'bg-[#EAE4DC] dark:bg-[#221C18] text-[#8C7D70] dark:text-[#7A6C60] border border-[#E8E2D8] dark:border-[#3D332C] cursor-not-allowed'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-current" />
                      <span>Comparing...</span>
                    </>
                  ) : (
                    <>
                      <Scale className="w-4 h-4" />
                      <span>Run Comparison</span>
                    </>
                  )}
                </button>

                <div className="text-center space-y-0.5 font-sans">
                  <p className="text-[10px] uppercase text-[#8C7D70] dark:text-[#A69688] tracking-wider font-mono">
                    8-Axis Perception
                  </p>
                  <p className="text-[10px] uppercase text-[#8C7D70] dark:text-[#A69688] tracking-wider font-mono">
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

            {/* ERROR CARD */}
            {analysisStage === 'ERROR' && errorDetails && (
              <div
                id="analysis-error-card"
                className="max-w-xl mx-auto bg-white dark:bg-[#1E1815] border border-red-500/30 rounded-xl p-6 shadow-xl dark:shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="flex items-start gap-4 font-sans">
                  <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="text-sm font-semibold text-[#211813] dark:text-[#F5EFEB] tracking-tight">
                      {errorDetails.title}
                    </h3>
                    <p className="text-xs text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed">
                      {errorDetails.message}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8E2D8] dark:border-[#3D332C] flex flex-wrap items-center justify-end gap-3 font-sans">
                  <button
                    id="error-back-btn"
                    onClick={() => {
                      setAnalysisStage('IDLE');
                      setErrorDetails(null);
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-[#5C4E43] dark:text-[#D4C7BC] hover:text-[#211813] dark:hover:text-[#F5EFEB] bg-[#FAF7F2] hover:bg-[#F4EFEA] dark:bg-[#221C18] dark:hover:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] transition cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Setup</span>
                  </button>

                  <button
                    id="error-retry-btn"
                    onClick={handleRunComparison}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-[#FAF7F2] dark:text-[#171311] bg-[#211813] hover:bg-[#3D2C21] dark:bg-[#C99765] dark:hover:bg-[#DDB082] shadow-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE PROGRESS CARD */}
            {isAnalyzing && (
              <div
                id="analysis-progress-card"
                className="max-w-lg mx-auto bg-white dark:bg-[#1E1815] rounded-xl border border-[#8C5E3C]/35 dark:border-[#C99765]/40 p-6 shadow-xl dark:shadow-2xl space-y-5 animate-in fade-in duration-200"
              >
                <div className="text-center space-y-1.5">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#8C5E3C] dark:text-[#C99765] font-mono">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="uppercase tracking-wider">ANDESHA Comparison in Progress</span>
                  </div>
                  <p className="text-sm font-medium text-[#211813] dark:text-[#F5EFEB] font-sans">
                    {stageMessage || 'Reading the images...'}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#FAF7F2] dark:bg-[#171311] h-1.5 rounded-full overflow-hidden border border-[#E8E2D8] dark:border-[#3D332C]">
                  <div
                    className="bg-[#8C5E3C] dark:bg-[#C99765] h-full transition-all duration-500 rounded-full"
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

                {/* Plain-Language 4-Step Sequence */}
                <ol className="space-y-2 text-left font-sans text-xs">
                  {[
                    { key: 'VALIDATING', label: 'Reading the images', order: 1 },
                    { key: 'UPLOADING', label: 'Analysing visual characteristics', order: 2 },
                    { key: 'ANALYZING', label: 'Comparing the two results', order: 3 },
                    { key: 'PROCESSING_RESULT', label: 'Preparing the explanation', order: 4 },
                  ].map((step) => {
                    const currentOrder =
                      analysisStage === 'VALIDATING'
                        ? 1
                        : analysisStage === 'UPLOADING'
                        ? 2
                        : analysisStage === 'ANALYZING'
                        ? 3
                        : 4;
                    const isDone = currentOrder > step.order;
                    const isCurrent = currentOrder === step.order;

                    return (
                      <li
                        key={step.key}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border transition-colors ${
                          isCurrent
                            ? 'bg-[#FAF7F2] dark:bg-[#221C18] border-[#8C5E3C]/40 dark:border-[#C99765]/40 text-[#211813] dark:text-[#F5EFEB] font-medium'
                            : isDone
                            ? 'bg-[#FAF7F2]/40 dark:bg-[#171311]/50 border-[#E8E2D8] dark:border-[#3D332C] text-[#4A6B53] dark:text-[#6B9071]'
                            : 'bg-transparent border-[#E8E2D8]/60 dark:border-[#3D332C]/60 text-[#8C7D70] dark:text-[#A69688]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[11px] tabular-nums opacity-75">
                            0{step.order}
                          </span>
                          <span>{step.label}</span>
                        </div>
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-[#4A6B53] dark:text-[#6B9071] shrink-0" />
                        ) : isCurrent ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8C5E3C] dark:text-[#C99765] shrink-0" />
                        ) : (
                          <span className="text-[10px] font-mono uppercase">Pending</span>
                        )}
                      </li>
                    );
                  })}
                </ol>

                <div className="pt-2 border-t border-[#E8E2D8] dark:border-[#3D332C] flex items-center justify-between text-[11px] text-[#8C7D70] dark:text-[#A69688] font-sans">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Evaluated in memory · No photos saved</span>
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
                    className="text-red-700 dark:text-red-400 hover:underline font-medium text-[11px] transition cursor-pointer px-2 py-1"
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
            <div className="grid sm:grid-cols-3 gap-4 text-xs text-[#5C4E43] dark:text-[#D4C7BC] font-sans">
              <div className="p-4 bg-white dark:bg-[#1E1815] rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] shadow-2xs flex items-start gap-3">
                <div className="p-1.5 bg-[#FAF7F2] dark:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg text-[#8C5E3C] dark:text-[#C99765] shrink-0">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#211813] dark:text-[#F5EFEB] block mb-0.5">8 Visual Axes</span>
                  Outputs structured categories (lighting, symmetry, styling, expressions, etc.) with relative scores.
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-[#1E1815] rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] shadow-2xs flex items-start gap-3">
                <div className="p-1.5 bg-[#FAF7F2] dark:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg text-[#8C5E3C] dark:text-[#C99765] shrink-0">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#211813] dark:text-[#F5EFEB] block mb-0.5">Zero Image Retention</span>
                  Uploaded photographs are evaluated ephemerally in RAM and immediately discarded.
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-[#1E1815] rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] shadow-2xs flex items-start gap-3">
                <div className="p-1.5 bg-[#FAF7F2] dark:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg text-[#4A6B53] dark:text-[#6B9071] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-[#211813] dark:text-[#F5EFEB] block mb-0.5">Strict Adult-Only (18+)</span>
                  Enforces 18+ consenting adult verification and respectful, non-derogatory analysis.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* First-Time Visitor Guide: How ANDESHA Works (4 Simple Visual Steps) */}
        <HowItWorksSection
          onTryExperiment={() => {
            const el = document.getElementById('comparison-lab-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Interactive Glossary: The Science Behind ANDESHA */}
        <ScienceBehindSection />
      </main>

      {/* Footer */}
      <footer className="bg-[#FAF7F2]/90 dark:bg-[#171311]/90 border-t border-[#E8E2D8] dark:border-[#3D332C] py-6 px-4 sm:px-8 text-[11px] text-[#8C7D70] dark:text-[#A69688] transition-colors font-sans">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8] dark:border-[#3D332C]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAboutOpen(true)}
                className="w-8 h-8 bg-[#211813] dark:bg-[#C99765] rounded-lg flex items-center justify-center font-editorial font-bold text-[#FAF7F2] dark:text-[#171311] text-sm hover:scale-105 transition-transform cursor-pointer"
                title="About ANDESHA"
              >
                A
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-editorial font-medium text-sm text-[#211813] dark:text-[#F5EFEB]">ANDESHA</span>
                  <span className="text-[11px] text-[#8C7D70] dark:text-[#A69688]">· AI-Powered Visual Analysis Platform</span>
                </div>
                <p className="text-[11px] font-editorial italic text-[#8C5E3C] dark:text-[#C99765]">
                  “See Beyond the Image. Understand the Data.”
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 uppercase tracking-wider font-medium text-[10px]">
              <button
                onClick={() => setIsAboutOpen(true)}
                className="text-[#8C5E3C] dark:text-[#C99765] hover:underline transition-colors cursor-pointer"
              >
                About ANDESHA
              </button>
              <button
                onClick={() => setIsMethodologyOpen(true)}
                className="hover:text-[#211813] dark:hover:text-[#F5EFEB] transition-colors cursor-pointer"
              >
                Methodology
              </button>
              <button
                onClick={() => setIsMethodologyOpen(true)}
                className="hover:text-[#211813] dark:hover:text-[#F5EFEB] transition-colors cursor-pointer"
              >
                Ethical Guidelines
              </button>
              <button
                onClick={() => setIsMethodologyOpen(true)}
                className="hover:text-[#211813] dark:hover:text-[#F5EFEB] transition-colors cursor-pointer"
              >
                Zero Retention Policy
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[#8C7D70] dark:text-[#A69688]">
            <span>
              Created by <strong className="text-[#211813] dark:text-[#F5EFEB]">Andrew & Apeksha</strong> for School Exhibition · STEM & AI Demonstration
            </span>
            <div className="flex items-center space-x-4">
              <span className="px-2 py-0.5 border border-[#E8E2D8] dark:border-[#3D332C] rounded font-mono text-[10px]">
                ANDESHA-PROD
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A6B53] dark:bg-[#6B9071]"></span>
                <span>RAM-Only Ephemeral Mode</span>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* About Modal (Introducing ANDESHA & Creators Andrew & Apeksha) */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

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
