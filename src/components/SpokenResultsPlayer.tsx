import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Flame } from 'lucide-react';
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

    window.speechSynthesis.cancel();

    const script = generateNarrativeText();
    const utterance = new SpeechSynthesisUtterance(script);
    utteranceRef.current = utterance;

    utterance.rate = rate;
    utterance.pitch = 1.0;

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

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [result.id]);

  if (!isSupported) {
    return (
      <div className="bg-[#FAF7F2] dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-4 text-xs text-[#8C7D70] dark:text-[#A69688] flex items-center gap-3">
        <VolumeX className="w-4 h-4 text-[#8C7D70] dark:text-[#A69688] shrink-0" />
        <span>Speech Synthesis is not supported in this browser window. You can read the full breakdown below.</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-5 shadow-xs dark:shadow-xl space-y-4 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8E2D8] dark:border-[#3D332C]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#FAF7F2] dark:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C5E3C] dark:text-[#C99765] rounded-lg">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#211813] dark:text-[#F5EFEB] uppercase tracking-wider flex items-center gap-2 font-sans">
              Spoken Audio Summary
              {roastMode && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Roast Mode
                </span>
              )}
            </h4>
            <p className="text-xs text-[#8C7D70] dark:text-[#A69688] mt-0.5 font-sans">
              Verbal breakdown and analytical commentary
            </p>
          </div>
        </div>

        {/* Audio Rate Selector */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#8C7D70] dark:text-[#A69688] text-[11px]">Speed:</span>
          {[0.9, 1.0, 1.2].map((r) => (
            <button
              key={r}
              onClick={() => setRate(r)}
              className={`px-2 py-0.5 rounded text-[11px] transition cursor-pointer ${
                rate === r
                  ? 'bg-[#211813] dark:bg-[#C99765] text-[#FAF7F2] dark:text-[#171311] font-bold'
                  : 'bg-[#FAF7F2] dark:bg-[#2B231F] text-[#8C7D70] dark:text-[#A69688] hover:text-[#211813] dark:hover:text-[#F5EFEB]'
              }`}
            >
              {r.toFixed(1)}x
            </button>
          ))}
        </div>
      </div>

      {/* Spoken Text Preview Quote */}
      <div className="bg-[#FAF7F2]/60 dark:bg-[#221C18] border border-[#E8E2D8] dark:border-[#3D332C] rounded-lg p-4 text-xs text-[#5C4E43] dark:text-[#D4C7BC] italic leading-relaxed relative shadow-2xs font-editorial">
        <p className="line-clamp-3">"{generateNarrativeText()}"</p>
      </div>

      {/* Player Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              id="tts-play-btn"
              onClick={handlePlay}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#211813] hover:bg-[#3D2C21] dark:bg-[#C99765] dark:hover:bg-[#DDB082] text-[#FAF7F2] dark:text-[#171311] transition shadow-xs flex items-center gap-2 cursor-pointer uppercase tracking-wider font-sans"
              aria-label="Play spoken results"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPaused ? 'Resume Speech' : 'Play Narration'}</span>
            </button>
          ) : (
            <button
              id="tts-pause-btn"
              onClick={handlePause}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-700 hover:bg-amber-600 text-white transition shadow-xs flex items-center gap-2 cursor-pointer uppercase tracking-wider font-sans"
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
              className="px-3 py-2 rounded-lg text-xs font-medium bg-[#FAF7F2] hover:bg-[#EAE4DC] dark:bg-[#2B231F] dark:hover:bg-[#382F2A] text-[#5C4E43] dark:text-[#D4C7BC] border border-[#E8E2D8] dark:border-[#3D332C] transition flex items-center gap-1.5 cursor-pointer shadow-2xs font-sans"
              aria-label="Stop speech"
            >
              <Square className="w-3.5 h-3.5 fill-current text-[#8C7D70] dark:text-[#A69688]" />
              <span>Stop</span>
            </button>
          )}
        </div>

        {isPlaying && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#8C5E3C] dark:text-[#C99765] animate-pulse">
            <span className="flex items-end gap-0.5 h-4">
              <span className="w-1 bg-[#8C5E3C] dark:bg-[#C99765] h-2 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 bg-[#8C5E3C] dark:bg-[#C99765] h-4 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 bg-[#8C5E3C] dark:bg-[#C99765] h-3 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            <span>Narrating breakdown...</span>
          </div>
        )}
      </div>
    </div>
  );
};
