import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Flame, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import type { ComparisonResult, ImageInputItem } from '../types/experiment';

interface SpokenResultsPlayerProps {
  result: ComparisonResult;
  imageA: ImageInputItem;
  imageB: ImageInputItem;
  roastMode: boolean;
  prankMode?: boolean;
  prankRoastText?: string;
}

export const SpokenResultsPlayer: React.FC<SpokenResultsPlayerProps> = ({
  result,
  imageA,
  imageB,
  roastMode,
  prankMode,
  prankRoastText,
}) => {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(1.0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  // Construct the spoken narrative text based on result and roast mode
  const generateNarrativeText = (): string => {
    let prankPrefix = '';
    if (prankMode && prankRoastText) {
      prankPrefix = `Prank result, for entertainment only! Ravi Prank Mode active! 10 out of 100, Absolutely Disastrous. ${prankRoastText}. Now reading genuine analysis. `;
    }

    if (roastMode && result.roastData?.spokenVersion) {
      const rawScript = `${prankPrefix}${result.roastData.spokenVersion}`;
      return rawScript
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    const nameA = imageA.personName || imageA.name || 'Person A';
    const nameB = imageB.personName || imageB.name || 'Person B';
    const prefA = Math.round(result.preference.A * 100);
    const prefB = Math.round(result.preference.B * 100);

    let winnerSentence = '';
    if (result.winner === 'TIE') {
      winnerSentence = `The model predicted a tie between ${nameA} and ${nameB}, with an even 50 percent split across the reference observer dataset.`;
    } else if (result.winner === 'A') {
      winnerSentence = `${nameA} received the higher predicted preference at ${prefA} percent, compared to ${prefB} percent for ${nameB}.`;
    } else {
      winnerSentence = `${nameB} received the higher predicted preference at ${prefB} percent, compared to ${prefA} percent for ${nameA}.`;
    }

    // Top differing attributes
    const significantAttrs = (result.attributes || [])
      .filter((attr) => Math.abs(attr.A - attr.B) >= 5)
      .slice(0, 3)
      .map((attr) => attr.name.toLowerCase());

    let attrSentence = '';
    if (significantAttrs.length > 0) {
      attrSentence = `The most noticeable differences were observed in ${significantAttrs.join(', ')}.`;
    } else {
      attrSentence = 'Visual characteristics were closely matched across all evaluation categories.';
    }

    const summarySentence = result.summary || '';
    
    let commentary = result.playfulCommentary;
    if (roastMode) {
      if (result.roastData) {
        commentary = `${result.roastData.verdict} ${result.roastData.loserRoast} ${result.roastData.winnerEnergy}`;
      } else {
        commentary = result.roastCommentary || result.playfulCommentary;
      }
    }

    const rawScript = `${prankPrefix}${winnerSentence} ${attrSentence} ${summarySentence} ${commentary ? commentary : ''}`;
    // Strip emojis so browser SpeechSynthesis speaks pure Hinglish naturally
    return rawScript
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handlePlay = () => {
    if (!isSupported || !window.speechSynthesis) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const script = generateNarrativeText();
    const utterance = new SpeechSynthesisUtterance(script);
    utteranceRef.current = utterance;

    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (!isSupported || !window.speechSynthesis) return;
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (!isSupported || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Stop speech when component unmounts or result changes
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [result.id]);

  if (!isSupported) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-3">
        <VolumeX className="w-4 h-4 text-slate-500 shrink-0" />
        <span>Speech Synthesis is not supported in this browser window. You can read the full breakdown below.</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              Spoken Audio Summary
              {roastMode && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" /> Roast Mode Active
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Listen to the model's verbal breakdown and analysis commentary
            </p>
          </div>
        </div>

        {/* Audio Rate Selector */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 text-[11px]">Speed:</span>
          <button
            onClick={() => setRate(0.9)}
            className={`px-2 py-0.5 rounded text-[11px] transition ${
              rate === 0.9 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            0.9x
          </button>
          <button
            onClick={() => setRate(1.0)}
            className={`px-2 py-0.5 rounded text-[11px] transition ${
              rate === 1.0 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            1.0x
          </button>
          <button
            onClick={() => setRate(1.2)}
            className={`px-2 py-0.5 rounded text-[11px] transition ${
              rate === 1.2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            1.2x
          </button>
        </div>
      </div>

      {/* Spoken Text Preview Quote */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-300 italic leading-relaxed relative">
        <p className="line-clamp-3">"{generateNarrativeText()}"</p>
      </div>

      {/* Player Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              id="tts-play-btn"
              onClick={handlePlay}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-md shadow-blue-900/30 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
              aria-label="Play spoken results"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPaused ? 'Resume Speech' : 'Play Narration'}</span>
            </button>
          ) : (
            <button
              id="tts-pause-btn"
              onClick={handlePause}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition shadow-md shadow-amber-900/30 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
              aria-label="Pause speech"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {(isPlaying || isPaused) && (
            <button
              id="tts-stop-btn"
              onClick={handleStop}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              aria-label="Stop speech"
            >
              <Square className="w-3.5 h-3.5 fill-current text-slate-400" />
              <span>Stop</span>
            </button>
          )}
        </div>

        {/* Live Speaking Indicator */}
        {isPlaying && (
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 animate-pulse">
            <span className="flex items-end gap-0.5 h-4">
              <span className="w-1 bg-blue-400 h-2 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 bg-blue-400 h-4 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 bg-blue-400 h-3 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            <span>Narrating breakdown...</span>
          </div>
        )}
      </div>
    </div>
  );
};
