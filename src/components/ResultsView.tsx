import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  ArrowLeftRight,
  Download,
  Share2,
  Check,
  Shield,
  HelpCircle,
  Trophy,
  Flame,
  RefreshCw,
  Lock,
  Zap,
  ChevronDown,
  ChevronUp,
  Calculator,
  MessageSquareText,
  ArrowDown,
  Eye,
  BarChart3,
  Sigma,
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
  { id: 'SPORTS', label: 'Sports Host', icon: '🎙️', description: 'High-octane stadium commentator energy' },
  { id: 'DRAMATIC', label: 'Dramatic', icon: '🎭', description: 'Cinematic drama with theatrical flair' },
  { id: 'CORPORATE', label: 'Corporate', icon: '💼', description: 'Passive-aggressive corporate performance review' },
  { id: 'CHAOTIC', label: 'Chaotic', icon: '🌀', description: 'Unpredictable, high-energy internet meme commentary' },
];

const ROAST_INTENSITIES: { id: RoastIntensity; label: string; badge: string }[] = [
  { id: 'PLAYFUL', label: 'Playful', badge: 'Light' },
  { id: 'SAVAGE', label: 'Savage', badge: 'Default' },
  { id: 'NUCLEAR', label: 'Nuclear', badge: 'Maximum' },
];

const getReadableCategoryName = (rawName: string): string => {
  const normalized = rawName.trim().toLowerCase();
  if (normalized.includes('symmetry') || normalized.includes('proportionality')) return 'Visual Balance & Symmetry';
  if (normalized.includes('grooming')) return 'Grooming & Neatness';
  if (normalized.includes('facial presentation')) return 'Facial Presentation';
  if (normalized.includes('hairstyle') || normalized === 'hair') return 'Hair Styling';
  if (normalized.includes('expression')) return 'Facial Expression & Warmth';
  if (normalized.includes('harmony')) return 'Overall Visual Harmony';
  if (normalized === 'styling') return 'Wardrobe & Styling';
  if (normalized.includes('image conditions') || normalized.includes('lighting')) return 'Lighting, Framing & Sharpness';
  return rawName;
};

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
  const [revealStage, setRevealStage] = useState<number>(0);

  // Collapsible exhibition panels
  const [isCategoryBreakdownOpen, setIsCategoryBreakdownOpen] = useState<boolean>(true);
  const [isDetailedChartsOpen, setIsDetailedChartsOpen] = useState<boolean>(false);
  const [isCuriousMathOpen, setIsCuriousMathOpen] = useState<boolean>(false);
  const [isVisitorGuideOpen, setIsVisitorGuideOpen] = useState<boolean>(false);

  useEffect(() => {
    setCurrentResult(initialResult);
    setRoastHistory([]);
  }, [initialResult]);

  useEffect(() => {
    setRevealStage(1);
    const t1 = setTimeout(() => setRevealStage(2), 120);
    const t2 = setTimeout(() => setRevealStage(3), 260);
    const t3 = setTimeout(() => setRevealStage(4), 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [initialResult.id]);

  const percentA = Math.round((currentResult.preference?.A ?? currentResult.pairwiseProbabilities?.preferenceA ?? 0.5) * 100);
  const percentB = Math.round((currentResult.preference?.B ?? currentResult.pairwiseProbabilities?.preferenceB ?? 0.5) * 100);
  const confPercent = Math.round((currentResult.confidence ?? 0.8) * 100);

  const nameA = imageA?.personName || imageA?.name || 'Image A';
  const nameB = imageB?.personName || imageB?.name || 'Image B';

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
      : 'Evenly Matched (Tie)';

  const rawConfidenceLevel = currentResult.bradleyTerryMetrics?.confidenceLevel || 'Moderate';
  const simpleConfidence =
    rawConfidenceLevel === 'High' || confPercent >= 80
      ? {
          label: 'High confidence',
          explanation: 'The visual differences across the examined categories were clear and consistent. Still a probabilistic model estimate, not an objective fact.',
          colorClass: 'text-[#4A6B53] dark:text-[#6B9071] border-[#4A6B53]/30',
        }
      : rawConfidenceLevel === 'Moderate' || confPercent >= 60
      ? {
          label: 'Moderate confidence',
          explanation: 'The model found noticeable differences alongside some evenly matched features. Still a probabilistic model estimate, not an objective fact.',
          colorClass: 'text-[#8C5E3C] dark:text-[#C99765] border-[#8C5E3C]/30',
        }
      : {
          label: 'Lower confidence',
          explanation: 'Both images scored closely on several visual features, leaving a narrower margin. Still a probabilistic model estimate, not an objective fact.',
          colorClass: 'text-amber-700 dark:text-amber-400 border-amber-500/30',
        };

  const scoreDeltaVal = Math.abs(currentResult.bradleyTerryMetrics?.scoreDelta ?? 0);
  const oddsRatioVal = currentResult.pairwiseProbabilities?.oddsRatio ?? 1;

  const buildInSimpleWords = (): { headline: string; details: string } => {
    const attrs = currentResult.attributes || [];
    if (currentResult.winner === 'TIE') {
      return {
        headline: `ANDESHA found an almost even match between Image A (${nameA}, ${percentA}%) and Image B (${nameB}, ${percentB}%), with ${confPercent}% confidence (${simpleConfidence.label.toLowerCase()}).`,
        details: currentResult.summary
          ? currentResult.summary
          : 'Across the examined visual categories, neither image held a decisive lead over the other.',
      };
    }

    const isWinnerA = currentResult.winner === 'A';
    const winName = isWinnerA ? nameA : nameB;
    const winSlot = isWinnerA ? 'Image A' : 'Image B';
    const loseName = isWinnerA ? nameB : nameA;
    const winPct = isWinnerA ? percentA : percentB;
    const losePct = isWinnerA ? percentB : percentA;

    const topWinnerAttrs = attrs
      .filter((a) => a.winner === currentResult.winner)
      .sort((x, y) => Math.abs(y.A - y.B) - Math.abs(x.A - x.B))
      .slice(0, 3)
      .map((a) => getReadableCategoryName(a.name).toLowerCase());

    const attrPhrase =
      topWinnerAttrs.length > 0
        ? ` ${winName} scored higher in ${topWinnerAttrs.join(', ')}.`
        : '';

    return {
      headline: `In this probabilistic comparison, ANDESHA favoured ${winSlot} (${winName}) over ${loseName} by ${winPct}% to ${losePct}%, with ${confPercent}% confidence (${simpleConfidence.label.toLowerCase()}).`,
      details: `${currentResult.summary || ''}${attrPhrase}`.trim(),
    };
  };

  const simpleWords = buildInSimpleWords();

  // Build "What did ANDESHA notice?" strictly from actual generated attributes & visual features
  const buildVisualNotices = (): {
    categoryNotices: { title: string; winnerText: string; scoreText: string; detail: string; favored: 'A' | 'B' | 'TIE' }[];
    photographicNotes: string[];
  } => {
    const attrs = [...(currentResult.attributes || [])];
    attrs.sort((x, y) => Math.abs(y.A - y.B) - Math.abs(x.A - x.B));

    const topAttrs = attrs.slice(0, 4).map((attr) => {
      const diff = Math.abs(attr.A - attr.B);
      const favored: 'A' | 'B' | 'TIE' = attr.winner === 'A' ? 'A' : attr.winner === 'B' ? 'B' : 'TIE';
      const winnerText =
        diff < 2 || favored === 'TIE'
          ? 'Closely matched'
          : favored === 'A'
          ? `Higher in Image A (${nameA})`
          : `Higher in Image B (${nameB})`;

      return {
        title: getReadableCategoryName(attr.name),
        winnerText,
        scoreText: `${attr.A} vs ${attr.B}`,
        detail: attr.explanation,
        favored,
      };
    });

    const photographicNotes: string[] = [];
    const featA = currentResult.imageA?.visualFeatures;
    const featB = currentResult.imageB?.visualFeatures;

    if (featA && featB) {
      const checks: { label: string; a: number; b: number }[] = [
        { label: 'Lighting clarity', a: featA.lightingQuality, b: featB.lightingQuality },
        { label: 'Framing and composition', a: featA.compositionAndFraming, b: featB.compositionAndFraming },
        { label: 'Facial expression warmth', a: featA.expressionWarmth, b: featB.expressionWarmth },
        { label: 'Visual balance and symmetry', a: featA.symmetryAndHarmony, b: featB.symmetryAndHarmony },
        { label: 'Image sharpness and focus', a: featA.photoSharpness, b: featB.photoSharpness },
      ];

      checks
        .sort((x, y) => Math.abs(y.a - y.b) - Math.abs(x.a - x.b))
        .slice(0, 3)
        .forEach((item) => {
          const gap = item.a - item.b;
          if (Math.abs(gap) <= 2) {
            photographicNotes.push(
              `${item.label} was nearly identical across both photographs (${item.a} vs ${item.b}).`
            );
          } else if (gap > 0) {
            photographicNotes.push(
              `${item.label} was rated higher for Image A (${nameA}: ${item.a} vs ${nameB}: ${item.b}).`
            );
          } else {
            photographicNotes.push(
              `${item.label} was rated higher for Image B (${nameB}: ${item.b} vs ${nameA}: ${item.a}).`
            );
          }
        });
    }

    if (currentResult.imageA?.keyObservation) {
      photographicNotes.push(`Image A (${nameA}): ${currentResult.imageA.keyObservation}`);
    }
    if (currentResult.imageB?.keyObservation) {
      photographicNotes.push(`Image B (${nameB}): ${currentResult.imageB.keyObservation}`);
    }

    return { categoryNotices: topAttrs, photographicNotes };
  };

  const visualNotices = buildVisualNotices();

  const scrollToScienceSection = () => {
    const el = document.getElementById('science-behind-andesha');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentResult, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ANDESHA_visual_report_${currentResult.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopySummary = () => {
    const roastTxt = currentResult.roastData
      ? `${currentResult.roastData.verdict} (Loser: ${currentResult.roastData.loserRoast})`
      : currentResult.roastCommentary;

    const text = `[ANDESHA — AI-Powered Visual Analysis Platform]
School Exhibition Project by Andrew & Apeksha
Tagline: "See Beyond the Image. Understand the Data."
Model Preference: ${winnerLabel}
Comparison Probability:
- Image A (${nameA}): ${percentA}%
- Image B (${nameB}): ${percentB}%
Model Confidence: ${confPercent}% (${simpleConfidence.label})
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

  const isAllDataExpanded = isCategoryBreakdownOpen && isDetailedChartsOpen;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1 & 2. STRONG EXHIBITION RESULT HEADER (Readable from 3 metres away) */}
      <section
        aria-label="ANDESHA Analysis Result"
        className={`bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-6 sm:p-8 shadow-xs dark:shadow-xl space-y-6 transition-all duration-300 ${
          revealStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Top Status & Quick Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8] dark:border-[#3D332C]">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="font-mono font-bold uppercase tracking-widest text-[#8C5E3C] dark:text-[#C99765]">
              ANDESHA ANALYSIS COMPLETE
            </span>
            <span aria-hidden="true" className="text-[#D8CEBF] dark:text-[#3D332C]">·</span>
            <span className="text-[#8C7D70] dark:text-[#A69688] font-sans">
              Image A ({nameA}) / Image B ({nameB})
            </span>
            <span aria-hidden="true" className="text-[#D8CEBF] dark:text-[#3D332C] hidden sm:inline">·</span>
            <span className="text-[#8C7D70] dark:text-[#A69688] font-sans hidden sm:inline">
              {new Date(currentResult.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-sans">
            <button
              id="roast-mode-toggle-btn"
              onClick={() => onToggleRoastMode(!roastMode)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-2xs ${
                roastMode
                  ? 'bg-[#F4EFEA] dark:bg-[#2B231F] border-[#8C5E3C]/35 dark:border-[#C99765]/40 text-[#8C5E3C] dark:text-[#C99765]'
                  : 'bg-[#FAF7F2] hover:bg-[#F4EFEA] dark:bg-[#221C18] dark:hover:bg-[#2B231F] border-[#E8E2D8] dark:border-[#3D332C] text-[#5C4E43] dark:text-[#D4C7BC]'
              }`}
              title="Toggle between neutral constructive commentary and playful competitive roast mode"
            >
              <Flame className={`w-3.5 h-3.5 ${roastMode ? 'text-[#8C5E3C] dark:text-[#C99765]' : 'text-[#8C7D70] dark:text-[#A69688]'}`} />
              <span>Roast Mode: {roastMode ? 'ON' : 'OFF'}</span>
            </button>

            <button
              id="invert-pair-btn"
              onClick={onInvertPair}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-[#FAF7F2] hover:bg-[#F4EFEA] dark:bg-[#221C18] dark:hover:bg-[#2B231F] text-[#5C4E43] dark:text-[#D4C7BC] border border-[#E8E2D8] dark:border-[#3D332C] transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
              title="Swap Image A and Image B to verify order neutrality"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#8C5E3C] dark:text-[#C99765]" />
              <span>Invert Pair</span>
            </button>

            <button
              id="export-json-btn"
              onClick={handleExportJson}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-[#FAF7F2] hover:bg-[#F4EFEA] dark:bg-[#221C18] dark:hover:bg-[#2B231F] text-[#5C4E43] dark:text-[#D4C7BC] border border-[#E8E2D8] dark:border-[#3D332C] transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#8C7D70] dark:text-[#A69688]" />
              <span>Export</span>
            </button>

            <button
              id="copy-summary-btn"
              onClick={handleCopySummary}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-[#FAF7F2] hover:bg-[#F4EFEA] dark:bg-[#221C18] dark:hover:bg-[#2B231F] text-[#5C4E43] dark:text-[#D4C7BC] border border-[#E8E2D8] dark:border-[#3D332C] transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#4A6B53] dark:text-[#6B9071]" />
                  <span className="text-[#4A6B53] dark:text-[#6B9071]">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#8C7D70] dark:text-[#A69688]" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              id="new-comparison-btn"
              onClick={onNewComparison}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#211813] hover:bg-[#3D2C21] dark:bg-[#C99765] dark:hover:bg-[#DDB082] text-[#FAF7F2] dark:text-[#171311] transition shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Comparison</span>
            </button>
          </div>
        </div>

        {/* Ravi Prank Banner Overlay (if active) */}
        {showPrankBanner && <RaviPrankBanner raviName={raviName} />}

        {/* Headline: Model Preference (3-metre readability) */}
        <div className="text-center space-y-2 pt-1">
          <div className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#8C7D70] dark:text-[#A69688]">
            Model Preference · Probabilistic Output
          </div>
          <h2 className="text-3xl sm:text-5xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight text-balance">
            {currentResult.winner === 'A' ? (
              <>
                Favours <span className="text-[#8C5E3C] dark:text-[#C99765]">{nameA}</span>
              </>
            ) : currentResult.winner === 'B' ? (
              <>
                Favours <span className="text-[#4A6B53] dark:text-[#6B9071]">{nameB}</span>
              </>
            ) : (
              <span>Evenly Matched (Tie)</span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] max-w-2xl mx-auto font-sans">
            Probabilistic preference estimate generated from the examined photographic features—not an objective or universal judgment.
          </p>
        </div>

        {/* Prominent Side-by-Side Score Cards (Readable from several feet away) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {/* Image A Result Card */}
          <div
            className={`rounded-xl p-5 sm:p-6 border transition-colors flex items-center justify-between gap-4 ${
              currentResult.winner === 'A'
                ? 'bg-[#FAF7F2] dark:bg-[#261E19] border-[#8C5E3C] dark:border-[#C99765] shadow-xs'
                : 'bg-[#FAF7F2]/50 dark:bg-[#221C18]/70 border-[#E8E2D8] dark:border-[#3D332C]'
            }`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-[#8C5E3C]/40 dark:border-[#C99765]/40 shrink-0 bg-[#EAE4DC] dark:bg-[#171311] flex items-center justify-center">
                {imageA?.dataUrl ? (
                  <img src={imageA.dataUrl} alt={nameA} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-editorial text-2xl text-[#8C5E3C] dark:text-[#C99765]">A</span>
                )}
              </div>
              <div className="min-w-0 space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765] font-semibold">
                  Image A
                </div>
                <div className="text-lg sm:text-2xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] truncate">
                  {nameA}
                </div>
                <div className="text-xs font-sans font-medium text-[#5C4E43] dark:text-[#D4C7BC] flex items-center gap-1.5">
                  {currentResult.winner === 'A' && (
                    <Trophy className="w-3.5 h-3.5 text-[#8C5E3C] dark:text-[#C99765] shrink-0" />
                  )}
                  <span>
                    {currentResult.winner === 'A'
                      ? 'Favoured by model'
                      : currentResult.winner === 'TIE'
                      ? 'Evenly matched'
                      : 'Comparison baseline'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-4xl sm:text-5xl font-editorial font-medium tabular-nums text-[#8C5E3C] dark:text-[#C99765]">
                {percentA}%
              </div>
              <div className="text-[11px] font-sans text-[#8C7D70] dark:text-[#A69688]">
                Probability
              </div>
            </div>
          </div>

          {/* Image B Result Card */}
          <div
            className={`rounded-xl p-5 sm:p-6 border transition-colors flex items-center justify-between gap-4 ${
              currentResult.winner === 'B'
                ? 'bg-[#FAF7F2] dark:bg-[#1A221C] border-[#4A6B53] dark:border-[#6B9071] shadow-xs'
                : 'bg-[#FAF7F2]/50 dark:bg-[#221C18]/70 border-[#E8E2D8] dark:border-[#3D332C]'
            }`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-[#4A6B53]/40 dark:border-[#6B9071]/40 shrink-0 bg-[#EAE4DC] dark:bg-[#171311] flex items-center justify-center">
                {imageB?.dataUrl ? (
                  <img src={imageB.dataUrl} alt={nameB} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-editorial text-2xl text-[#4A6B53] dark:text-[#6B9071]">B</span>
                )}
              </div>
              <div className="min-w-0 space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-[#4A6B53] dark:text-[#6B9071] font-semibold">
                  Image B
                </div>
                <div className="text-lg sm:text-2xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] truncate">
                  {nameB}
                </div>
                <div className="text-xs font-sans font-medium text-[#5C4E43] dark:text-[#D4C7BC] flex items-center gap-1.5">
                  {currentResult.winner === 'B' && (
                    <Trophy className="w-3.5 h-3.5 text-[#4A6B53] dark:text-[#6B9071] shrink-0" />
                  )}
                  <span>
                    {currentResult.winner === 'B'
                      ? 'Favoured by model'
                      : currentResult.winner === 'TIE'
                      ? 'Evenly matched'
                      : 'Comparison baseline'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-4xl sm:text-5xl font-editorial font-medium tabular-nums text-[#4A6B53] dark:text-[#6B9071]">
                {percentB}%
              </div>
              <div className="text-[11px] font-sans text-[#8C7D70] dark:text-[#A69688]">
                Probability
              </div>
            </div>
          </div>
        </div>

        {/* High-Contrast Proportional Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-sans text-[#5C4E43] dark:text-[#D4C7BC]">
            <span className="font-medium">
              Image A ({nameA}): <strong className="tabular-nums text-[#8C5E3C] dark:text-[#C99765]">{percentA}%</strong>
            </span>
            <span className="text-[11px] text-[#8C7D70] dark:text-[#A69688]">Comparison Probability Split</span>
            <span className="font-medium">
              Image B ({nameB}): <strong className="tabular-nums text-[#4A6B53] dark:text-[#6B9071]">{percentB}%</strong>
            </span>
          </div>
          <div className="h-4 w-full bg-[#FAF7F2] dark:bg-[#171311] rounded-full overflow-hidden flex border border-[#E8E2D8] dark:border-[#3D332C]">
            <div
              style={{ width: `${percentA}%` }}
              className="bg-[#8C5E3C] dark:bg-[#C99765] h-full transition-all duration-700"
            />
            <div
              style={{ width: `${percentB}%` }}
              className="bg-[#4A6B53] dark:bg-[#6B9071] h-full transition-all duration-700"
            />
          </div>
        </div>

        {/* 5. CONFIDENCE DISPLAY + IN SIMPLE WORDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch pt-1">
          {/* Confidence Card */}
          <div className="lg:col-span-5 rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] bg-[#FAF7F2] dark:bg-[#221C18] p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#8C7D70] dark:text-[#A69688] block">
                  Model Confidence
                </span>
                <div className="text-3xl sm:text-4xl font-editorial font-medium tabular-nums text-[#211813] dark:text-[#F5EFEB] mt-1">
                  {confPercent}%
                </div>
              </div>
              <span className={`text-xs font-sans font-semibold px-3 py-1 rounded-md border bg-white dark:bg-[#171311] ${simpleConfidence.colorClass}`}>
                {simpleConfidence.label}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans">
              {simpleConfidence.explanation}
            </p>
          </div>

          {/* In Simple Words Card */}
          <div
            id="in-simple-words-card"
            className="lg:col-span-7 rounded-xl border border-[#8C5E3C]/30 dark:border-[#C99765]/35 bg-[#FAF7F2] dark:bg-[#221C18] p-5 space-y-2.5 flex flex-col justify-center"
          >
            <div className="flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-[#8C5E3C] dark:text-[#C99765] shrink-0" />
              <h3 className="text-base font-editorial font-medium text-[#211813] dark:text-[#F5EFEB]">
                In Simple Words
              </h3>
            </div>
            <p className="text-sm sm:text-base font-medium text-[#211813] dark:text-[#F5EFEB] leading-relaxed font-sans">
              {simpleWords.headline}
            </p>
            {simpleWords.details && (
              <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans">
                {simpleWords.details}
              </p>
            )}
          </div>
        </div>

        {/* Standard Neutral Model Commentary (when Roast Mode is OFF) */}
        {!roastMode && currentResult.playfulCommentary && (
          <div className="p-4 rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] bg-[#FAF7F2]/60 dark:bg-[#171311]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans">
              <strong className="text-[#211813] dark:text-[#F5EFEB] font-medium">Exhibition Note: </strong>
              {currentResult.playfulCommentary}
            </p>
            <button
              id="enable-roast-link-btn"
              onClick={() => onToggleRoastMode(true)}
              className="text-xs font-sans font-medium text-[#8C5E3C] dark:text-[#C99765] hover:underline cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Try Roast Mode</span>
            </button>
          </div>
        )}
      </section>

      {/* ROAST MODE CARD (If Enabled) */}
      {roastMode && (
        <section
          id="roast-mode-card"
          className={`bg-[#FAF7F2]/90 dark:bg-[#201A16] border border-[#8C5E3C]/35 dark:border-[#C99765]/40 rounded-2xl p-6 shadow-md dark:shadow-xl space-y-6 relative overflow-hidden transition-all duration-300 ${
            revealStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8] dark:border-[#3D332C]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white dark:bg-[#2B231F] border border-[#8C5E3C]/30 text-[#8C5E3C] dark:text-[#C99765] rounded-lg shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight">
                    Scoreboard Roast
                  </h3>
                  <span className="text-xs font-sans text-[#8C5E3C] dark:text-[#C99765]">
                    · Active
                  </span>
                </div>
                <p className="text-xs text-[#8C7D70] dark:text-[#A69688] font-sans mt-0.5">
                  Playful competitive commentary grounded in the 8 visual categories
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] text-[11px] text-[#5C4E43] dark:text-[#D4C7BC] font-mono shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-[#4A6B53] dark:text-[#6B9071]" />
              <span>Scores Frozen</span>
            </div>
          </div>

          <div className="space-y-3 font-sans">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#8C7D70] dark:text-[#A69688] font-medium">
                Persona Style:
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8C7D70] dark:text-[#A69688]">
                <span>Intensity:</span>
                <div className="flex bg-white dark:bg-[#1E1815] rounded-md p-0.5 border border-[#E8E2D8] dark:border-[#3D332C]">
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
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                          isActive
                            ? 'bg-[#211813] dark:bg-[#C99765] text-[#FAF7F2] dark:text-[#171311]'
                            : 'text-[#8C7D70] dark:text-[#A69688] hover:text-[#211813] dark:hover:text-[#F5EFEB]'
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                      isActive
                        ? 'bg-[#211813] dark:bg-[#C99765] text-[#FAF7F2] dark:text-[#171311] border-[#211813] dark:border-[#C99765]'
                        : 'bg-white dark:bg-[#1E1815] hover:bg-[#FAF7F2] dark:hover:bg-[#2B231F] text-[#5C4E43] dark:text-[#D4C7BC] border-[#E8E2D8] dark:border-[#3D332C]'
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

          <div className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#8C5E3C] dark:text-[#C99765] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                The Verdict ({selectedStyle})
              </span>
              <span className="text-[#8C7D70] dark:text-[#A69688] font-normal text-[10px]">
                Grounded on 8 Visual Axes
              </span>
            </div>
            <blockquote className="text-sm sm:text-base font-editorial italic text-[#211813] dark:text-[#F5EFEB] leading-relaxed pt-1">
              "{activeRoast.verdict}"
            </blockquote>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg p-4 space-y-1.5 shadow-2xs">
              <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-rose-700 dark:text-rose-400">
                For the Competition ({currentResult.winner === 'A' ? nameB : nameA})
              </div>
              <p className="text-xs text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans">
                {activeRoast.loserRoast}
              </p>
            </div>

            <div className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg p-4 space-y-1.5 shadow-2xs">
              <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#4A6B53] dark:text-[#6B9071]">
                Winner Energy ({winnerLabel})
              </div>
              <p className="text-xs text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans">
                {activeRoast.winnerEnergy}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E8E2D8] dark:border-[#3D332C] flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-[#8C7D70] dark:text-[#A69688] flex items-center gap-1.5 font-sans">
              <Shield className="w-3.5 h-3.5" />
              <span>Humor targets presentation and photographic dynamics only.</span>
            </div>

            <button
              id="roast-again-btn"
              onClick={() => handleRegenerateRoast()}
              disabled={isRegeneratingRoast}
              className={`px-4 py-2 rounded-lg font-medium text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-xs font-sans ${
                isRegeneratingRoast
                  ? 'bg-[#EAE4DC] dark:bg-[#2B231F] text-[#8C7D70] dark:text-[#A69688] cursor-not-allowed'
                  : 'bg-[#211813] hover:bg-[#3D2C21] dark:bg-[#C99765] dark:hover:bg-[#DDB082] text-[#FAF7F2] dark:text-[#171311]'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingRoast ? 'animate-spin' : ''}`} />
              <span>{isRegeneratingRoast ? 'Generating...' : '🔥 Roast Again'}</span>
            </button>
          </div>
        </section>
      )}

      {/* 3. WHAT DID ANDESHA NOTICE? (Directly from actual generated data) */}
      <section
        id="what-andesha-noticed"
        aria-labelledby="noticed-heading"
        className={`bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-6 sm:p-8 shadow-xs dark:shadow-xl space-y-6 transition-all duration-300 ${
          revealStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex flex-wrap items-end justify-between gap-3 pb-4 border-b border-[#E8E2D8] dark:border-[#3D332C]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765]">
              <Eye className="w-4 h-4" />
              <span>Visual Observations</span>
            </div>
            <h3 id="noticed-heading" className="text-xl sm:text-2xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight">
              What did ANDESHA notice?
            </h3>
            <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] font-sans">
              The clearest differences observed between Image A ({nameA}) and Image B ({nameB}) in this comparison.
            </p>
          </div>
        </div>

        {/* Top Category Differences Grid */}
        {visualNotices.categoryNotices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visualNotices.categoryNotices.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-4 sm:p-5 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#211813] dark:text-[#F5EFEB] font-sans">
                    {item.title}
                  </span>
                  <span
                    className={`text-xs font-mono tabular-nums font-semibold ${
                      item.favored === 'A'
                        ? 'text-[#8C5E3C] dark:text-[#C99765]'
                        : item.favored === 'B'
                        ? 'text-[#4A6B53] dark:text-[#6B9071]'
                        : 'text-[#8C7D70] dark:text-[#A69688]'
                    }`}
                  >
                    {item.winnerText} · {item.scoreText}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed font-sans">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Specific Photographic Observations */}
        {visualNotices.photographicNotes.length > 0 && (
          <div className="bg-[#FAF7F2]/70 dark:bg-[#171311]/70 border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-4 sm:p-5 space-y-2.5">
            <div className="text-xs font-mono uppercase tracking-wider text-[#8C7D70] dark:text-[#A69688] font-semibold">
              Photographic & Framing Notes
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] font-sans">
              {visualNotices.photographicNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span aria-hidden="true" className="text-[#8C5E3C] dark:text-[#C99765] mt-0.5">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Spoken Narration Player */}
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

      {/* 6. EXPLORE THE DATA AREA (More technical information cleanly below the main result) */}
      <section
        id="explore-the-data"
        aria-labelledby="explore-data-heading"
        className={`space-y-5 transition-all duration-300 ${
          revealStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-6 sm:p-8 shadow-xs dark:shadow-xl space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-[#E8E2D8] dark:border-[#3D332C]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8C5E3C] dark:text-[#C99765]">
                <BarChart3 className="w-4 h-4" />
                <span>Technical Breakdown</span>
              </div>
              <h3 id="explore-data-heading" className="text-xl sm:text-2xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight">
                Explore the Data
              </h3>
              <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] font-sans">
                Examine the statistical probability, confidence, score gap, category ratings, and radar chart behind this result.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextState = !isAllDataExpanded;
                setIsCategoryBreakdownOpen(nextState);
                setIsDetailedChartsOpen(nextState);
              }}
              className="px-4 py-2 rounded-lg text-xs font-medium text-[#5C4E43] dark:text-[#D4C7BC] hover:text-[#211813] dark:hover:text-[#F5EFEB] bg-[#FAF7F2] hover:bg-[#F4EFEA] dark:bg-[#221C18] dark:hover:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] transition cursor-pointer whitespace-nowrap shrink-0 font-sans"
            >
              {isAllDataExpanded ? 'Collapse Data Panels' : 'Expand All Data'}
            </button>
          </div>

          {/* 4-Column Key Numbers Strip (Probability, Confidence, Score gap, Comparison margin) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C7D70] dark:text-[#A69688] block">
                Probability
              </span>
              <div className="text-xl font-editorial font-medium tabular-nums text-[#211813] dark:text-[#F5EFEB]">
                {percentA}% vs {percentB}%
              </div>
              <p className="text-xs text-[#5C4E43] dark:text-[#D4C7BC] font-sans">
                How strongly the model favours each image.
              </p>
            </div>

            <div className="bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C7D70] dark:text-[#A69688] block">
                Confidence
              </span>
              <div className="text-xl font-editorial font-medium tabular-nums text-[#211813] dark:text-[#F5EFEB]">
                {confPercent}% · {simpleConfidence.label}
              </div>
              <p className="text-xs text-[#5C4E43] dark:text-[#D4C7BC] font-sans">
                How certain the model is about this prediction.
              </p>
            </div>

            <div className="bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C7D70] dark:text-[#A69688] block">
                Score Gap
              </span>
              <div className="text-xl font-editorial font-medium tabular-nums text-[#8C5E3C] dark:text-[#C99765]">
                {scoreDeltaVal.toFixed(1)} Logit
              </div>
              <p className="text-xs text-[#5C4E43] dark:text-[#D4C7BC] font-sans">
                Numerical gap used to compute the split.
              </p>
            </div>

            <div className="bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-4 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C7D70] dark:text-[#A69688] block">
                Comparison Margin
              </span>
              <div className="text-xl font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] truncate">
                {Math.abs(percentA - 50) < 6 ? 'Close Match' : `${winnerLabel} Favoured`}
              </div>
              <p className="text-xs text-[#5C4E43] dark:text-[#D4C7BC] font-sans tabular-nums">
                Odds ratio: {oddsRatioVal.toFixed(2)}× head-to-head
              </p>
            </div>
          </div>

          {/* Collapsible Panel A: Category Breakdown */}
          <div className="border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setIsCategoryBreakdownOpen((prev) => !prev)}
              aria-expanded={isCategoryBreakdownOpen}
              className="w-full px-5 py-4 bg-[#FAF7F2] dark:bg-[#221C18] hover:bg-[#F4EFEA] dark:hover:bg-[#2B231F] flex items-center justify-between gap-4 text-left transition cursor-pointer"
            >
              <div>
                <span className="font-editorial font-medium text-base text-[#211813] dark:text-[#F5EFEB] block">
                  Category Breakdown (8 Visual Characteristics)
                </span>
                <span className="text-xs text-[#8C7D70] dark:text-[#A69688] font-sans">
                  Side-by-side scores across lighting, framing, expression, symmetry, styling, and more
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#8C5E3C] dark:text-[#C99765] shrink-0 font-sans">
                <span>{isCategoryBreakdownOpen ? 'Hide' : 'Show'}</span>
                {isCategoryBreakdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>

            {isCategoryBreakdownOpen && (
              <div className="p-4 sm:p-5 bg-white dark:bg-[#1E1815] border-t border-[#E8E2D8] dark:border-[#3D332C]">
                <AttributeComparisonList
                  attributes={currentResult.attributes || []}
                  nameA={nameA}
                  nameB={nameB}
                />
              </div>
            )}
          </div>

          {/* Collapsible Panel B: Detailed Charts & Explanation (Probability Gauge, Radar Chart, Key Drivers) */}
          <div className="border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setIsDetailedChartsOpen((prev) => !prev)}
              aria-expanded={isDetailedChartsOpen}
              className="w-full px-5 py-4 bg-[#FAF7F2] dark:bg-[#221C18] hover:bg-[#F4EFEA] dark:hover:bg-[#2B231F] flex items-center justify-between gap-4 text-left transition cursor-pointer"
            >
              <div>
                <span className="font-editorial font-medium text-base text-[#211813] dark:text-[#F5EFEB] block">
                  Radar Chart, Probability Gauge & Detailed Explanation
                </span>
                <span className="text-xs text-[#8C7D70] dark:text-[#A69688] font-sans">
                  Explore the 5-axis radar chart, 90% confidence interval gauge, and detailed visual drivers
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#8C5E3C] dark:text-[#C99765] shrink-0 font-sans">
                <span>{isDetailedChartsOpen ? 'Hide' : 'Show Charts'}</span>
                {isDetailedChartsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>

            {isDetailedChartsOpen && (
              <div className="p-4 sm:p-5 bg-white dark:bg-[#1E1815] border-t border-[#E8E2D8] dark:border-[#3D332C] space-y-6">
                <BradleyTerryGauge result={currentResult} nameA={nameA} nameB={nameB} />

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
                    nameA={nameA}
                    nameB={nameB}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. FOR CURIOUS VISITORS: WHAT'S HAPPENING MATHEMATICALLY? */}
      <section className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl overflow-hidden transition-colors shadow-xs">
        <button
          type="button"
          onClick={() => setIsCuriousMathOpen((prev) => !prev)}
          aria-expanded={isCuriousMathOpen}
          className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-[#FAF7F2] dark:hover:bg-[#221C18] transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FAF7F2] dark:bg-[#2B231F] rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C5E3C] dark:text-[#C99765] shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <span className="font-editorial font-medium text-base text-[#211813] dark:text-[#F5EFEB] block">
                For Curious Visitors: What's happening mathematically?
              </span>
              <span className="text-xs text-[#8C7D70] dark:text-[#A69688] font-sans">
                A simple explanation of how scores turn into comparison probabilities
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#8C5E3C] dark:text-[#C99765] font-medium font-sans shrink-0">
            <span>{isCuriousMathOpen ? 'Hide' : 'Read More'}</span>
            {isCuriousMathOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isCuriousMathOpen && (
          <div className="px-6 pb-6 pt-4 border-t border-[#E8E2D8] dark:border-[#3D332C] space-y-4 bg-[#FAF7F2]/50 dark:bg-[#171311]/50 font-sans">
            <p className="text-sm text-[#211813] dark:text-[#F5EFEB] leading-relaxed font-medium">
              ANDESHA converts the visual analysis into numerical scores and then uses a pairwise comparison model to estimate which result is more strongly supported by the analysed features.
            </p>
            <div className="p-4 rounded-xl bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8C5E3C] dark:text-[#C99765]">
                <Sigma className="w-4 h-4" />
                <span>About the Bradley–Terry Model</span>
              </div>
              <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] leading-relaxed">
                The Bradley–Terry model compares the difference between two numerical scores and converts that difference into smooth probabilities between 0% and 100%. Larger gaps in the visual scores produce a stronger probability split, while very similar scores result in a split closer to 50% vs 50%.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
              <button
                type="button"
                onClick={scrollToScienceSection}
                className="text-[#8C5E3C] dark:text-[#C99765] hover:underline font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explore all 7 concepts in The Science Behind ANDESHA</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onOpenMethodology}
                className="text-[#5C4E43] dark:text-[#D4C7BC] hover:text-[#211813] dark:hover:text-[#F5EFEB] hover:underline font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Full Methodology</span>
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Visitor & Parent Quick Reference Accordion */}
      <div className="bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl overflow-hidden transition-colors shadow-2xs">
        <button
          onClick={() => setIsVisitorGuideOpen((prev) => !prev)}
          aria-expanded={isVisitorGuideOpen}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#F4EFEA] dark:hover:bg-[#2B231F] transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-[#171311] rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C5E3C] dark:text-[#C99765]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-editorial font-medium text-sm sm:text-base text-[#211813] dark:text-[#F5EFEB] block">
                Visitor & Parent Guide: Quick Reading Tips
              </span>
              <span className="text-xs text-[#8C7D70] dark:text-[#A69688] font-sans">
                Helpful notes for first-time exhibition visitors
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#8C5E3C] dark:text-[#C99765] font-medium font-sans shrink-0">
            <span>{isVisitorGuideOpen ? 'Hide' : 'Expand'}</span>
            {isVisitorGuideOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isVisitorGuideOpen && (
          <div className="px-6 pb-6 pt-3 border-t border-[#E8E2D8] dark:border-[#3D332C] grid sm:grid-cols-3 gap-3 text-xs font-sans text-[#5C4E43] dark:text-[#D4C7BC]">
            <div className="p-3.5 bg-white dark:bg-[#171311] rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] space-y-1">
              <span className="font-semibold text-[#211813] dark:text-[#F5EFEB] block">
                1. What the Score Means
              </span>
              <p className="text-xs text-[#8C7D70] dark:text-[#A69688] leading-relaxed">
                The {percentA}% vs {percentB}% comparison probability shows how strongly the model favoured each photo side-by-side. It is not a grade out of 100.
              </p>
            </div>

            <div className="p-3.5 bg-white dark:bg-[#171311] rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] space-y-1">
              <span className="font-semibold text-[#211813] dark:text-[#F5EFEB] block">
                2. Evaluated on 8 Visual Factors
              </span>
              <p className="text-xs text-[#8C7D70] dark:text-[#A69688] leading-relaxed">
                ANDESHA examines photographic characteristics like lighting, framing, expression warmth, symmetry, and sharpness.
              </p>
            </div>

            <div className="p-3.5 bg-white dark:bg-[#171311] rounded-xl border border-[#E8E2D8] dark:border-[#3D332C] space-y-1">
              <span className="font-semibold text-[#211813] dark:text-[#F5EFEB] block">
                3. Privacy & Zero Retention
              </span>
              <p className="text-xs text-[#8C7D70] dark:text-[#A69688] leading-relaxed">
                Photos tested at our exhibition booth are evaluated ephemerally in memory and never saved to any database.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Scientific Context & Guardrail */}
      <div className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-5 text-[#5C4E43] dark:text-[#D4C7BC] text-xs flex items-start gap-4 shadow-xs transition-colors">
        <div className="p-2 bg-[#FAF7F2] dark:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C5E3C] dark:text-[#C99765] rounded-lg shrink-0 mt-0.5">
          <Shield className="w-4 h-4" />
        </div>
        <div className="space-y-1.5 flex-1 font-sans">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-[#211813] dark:text-[#F5EFEB] text-xs uppercase tracking-wider">
              Scientific Transparency & Guardrail
            </span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={scrollToScienceSection}
                className="text-[#8C5E3C] dark:text-[#C99765] hover:underline font-mono text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <span>Science Behind ANDESHA</span>
                <ArrowDown className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={onOpenMethodology}
                className="text-[#8C5E3C] dark:text-[#C99765] hover:underline font-mono text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <span>Full methodology</span>
                <HelpCircle className="w-3 h-3" />
              </button>
            </div>
          </div>
          <p className="text-[#8C7D70] dark:text-[#A69688] leading-relaxed">
            These results are probabilistic estimates based on photographic features and model reference patterns—not objective measurements or universal judgments about people.
          </p>
        </div>
      </div>

      {/* 8. EXHIBITION RESET CTA AT END OF RESULTS */}
      <div className="bg-[#FAF7F2] dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="text-center sm:text-left space-y-1">
          <h4 className="text-lg font-editorial font-medium text-[#211813] dark:text-[#F5EFEB]">
            Ready to test another pair?
          </h4>
          <p className="text-xs sm:text-sm text-[#5C4E43] dark:text-[#D4C7BC] font-sans">
            Return to the comparison workspace to upload new images or select an exhibition preset.
          </p>
        </div>
        <button
          id="bottom-new-comparison-btn"
          type="button"
          onClick={onNewComparison}
          className="px-6 py-3.5 min-h-[48px] rounded-xl text-sm font-semibold bg-[#211813] hover:bg-[#3D2C21] dark:bg-[#C99765] dark:hover:bg-[#DDB082] text-[#FAF7F2] dark:text-[#171311] transition shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 font-sans"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Comparison</span>
        </button>
      </div>
    </div>
  );
};
