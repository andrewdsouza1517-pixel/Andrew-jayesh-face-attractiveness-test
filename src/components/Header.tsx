import React from 'react';
import { BookOpen, History, RotateCcw, Flashlight, Info, Sparkles, Users } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onOpenAbout: () => void;
  onOpenMethodology: () => void;
  onOpenHistory: () => void;
  onOpenTeam: () => void;
  historyCount: number;
  onReset: () => void;
  isSpotlightActive?: boolean;
  onToggleSpotlight?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAbout,
  onOpenMethodology,
  onOpenHistory,
  onOpenTeam,
  historyCount,
  onReset,
  isSpotlightActive = true,
  onToggleSpotlight,
}) => {
  return (
    <header className="bg-[#FAF7F2]/90 dark:bg-[#171311]/90 backdrop-blur-md border-b border-[#E8E2D8] dark:border-[#3D332C] sticky top-0 z-30 shadow-xs dark:shadow-md dark:shadow-black/40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Editorial Wordmark */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onOpenAbout}
            className="w-9 h-9 bg-[#211813] dark:bg-[#C99765] rounded-lg flex items-center justify-center font-editorial font-bold text-[#FAF7F2] dark:text-[#171311] text-lg shadow-xs shrink-0 hover:scale-105 transition-transform cursor-pointer"
            title="Learn about ANDESHA and its creators, Andrew & Apeksha"
          >
            A
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-editorial font-medium text-[#211813] dark:text-[#F5EFEB] tracking-tight">
                ANDESHA
              </h1>
              <span className="hidden sm:inline text-xs text-[#8C7D70] dark:text-[#A69688]">
                · AI-Powered Visual Analysis Platform
              </span>
            </div>
            <div className="text-[11px] text-[#8C7D70] dark:text-[#A69688] flex items-center gap-2 mt-0.5 font-sans">
              <span className="text-[#8C5E3C] dark:text-[#C99765] font-medium">By Andrew & Apeksha</span>
              <span aria-hidden="true">·</span>
              <span>School Exhibition</span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span className="hidden sm:inline font-mono">v2.5</span>
            </div>
          </div>
        </div>

        {/* Actions & Theme Switcher */}
        <div className="flex items-center gap-2">
          {/* Meet the Team Button */}
          <button
            id="meet-the-team-btn"
            onClick={onOpenTeam}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#8C5E3C] dark:text-[#C99765] bg-white dark:bg-[#221C18] hover:bg-[#F4EFEA] dark:hover:bg-[#2B231F] border border-[#8C5E3C]/30 dark:border-[#C99765]/35 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Meet the team behind ANDESHA: Andrew & Apeksha"
          >
            <Users className="w-3.5 h-3.5 text-[#8C5E3C] dark:text-[#C99765]" />
            <span className="font-sans font-semibold">Meet the Team</span>
          </button>

          {/* About Button */}
          <button
            id="open-about-btn"
            onClick={onOpenAbout}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#5C4E43] dark:text-[#D4C7BC] hover:text-[#211813] dark:hover:text-[#F5EFEB] bg-white dark:bg-[#221C18] hover:bg-[#F4EFEA] dark:hover:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="About ANDESHA — Exhibition Project by Andrew & Apeksha"
          >
            <Info className="w-3.5 h-3.5 text-[#8C5E3C] dark:text-[#C99765]" />
            <span className="font-sans">About</span>
            <span className="hidden lg:inline font-sans text-[#8C7D70] dark:text-[#A69688]">ANDESHA</span>
          </button>

          {/* 3-state Theme Switcher */}
          <ThemeToggle />

          <div className="h-5 w-px bg-[#E8E2D8] dark:border-[#3D332C] hidden sm:block mx-0.5" />

          <button
            id="open-methodology-btn"
            onClick={onOpenMethodology}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#5C4E43] dark:text-[#D4C7BC] hover:text-[#211813] dark:hover:text-[#F5EFEB] bg-white dark:bg-[#221C18] hover:bg-[#F4EFEA] dark:hover:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="View psychometric framework and mathematical model"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#8C5E3C] dark:text-[#C99765]" />
            <span className="hidden md:inline font-sans">Methodology</span>
            <span className="md:hidden font-sans">Theory</span>
          </button>

          <button
            id="open-history-btn"
            onClick={onOpenHistory}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#5C4E43] dark:text-[#D4C7BC] hover:text-[#211813] dark:hover:text-[#F5EFEB] bg-white dark:bg-[#221C18] hover:bg-[#F4EFEA] dark:hover:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] transition-colors flex items-center gap-1.5 relative cursor-pointer shadow-2xs"
            title="View session comparison history"
          >
            <History className="w-3.5 h-3.5 text-[#8C7D70] dark:text-[#A69688]" />
            <span className="font-sans">History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-[#211813] dark:bg-[#C99765] text-[#FAF7F2] dark:text-[#171311] rounded-full text-[10px] font-mono font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {onToggleSpotlight && (
            <button
              id="toggle-spotlight-btn"
              onClick={onToggleSpotlight}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                isSpotlightActive
                  ? 'text-[#8C5E3C] dark:text-[#C99765] bg-[#F4EFEA] dark:bg-[#2B231F] border-[#8C5E3C]/35 dark:border-[#C99765]/40'
                  : 'text-[#8C7D70] dark:text-[#A69688] hover:text-[#211813] dark:hover:text-[#F5EFEB] bg-white dark:bg-[#221C18] hover:bg-[#F4EFEA] dark:hover:bg-[#2B231F] border-[#E8E2D8] dark:border-[#3D332C]'
              }`}
              title="Toggle cursor spotlight torch (Hotkey: L)"
            >
              <Flashlight className={`w-3.5 h-3.5 ${isSpotlightActive ? 'text-[#8C5E3C] dark:text-[#C99765]' : 'text-[#8C7D70] dark:text-[#A69688]'}`} />
              <span className="hidden sm:inline font-sans">Torch</span>
              <span className="text-[10px] font-mono opacity-70 hidden md:inline">[L]</span>
            </button>
          )}

          <button
            id="reset-experiment-btn"
            onClick={onReset}
            className="p-2 rounded-lg text-xs font-medium text-[#8C7D70] dark:text-[#A69688] hover:text-[#211813] dark:hover:text-[#F5EFEB] bg-white dark:bg-[#221C18] hover:bg-[#F4EFEA] dark:hover:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] transition-colors cursor-pointer shadow-2xs"
            title="Reset active comparison"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
