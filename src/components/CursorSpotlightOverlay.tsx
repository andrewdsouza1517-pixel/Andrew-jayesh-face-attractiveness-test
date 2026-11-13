import React, { useEffect, useRef, useState } from 'react';
import { Flashlight, Sliders, Sun } from 'lucide-react';
import { useTheme } from '../utils/themeContext';

export interface CursorSpotlightProps {
  isActive: boolean;
  onToggleActive?: () => void;
}

export const CursorSpotlightOverlay: React.FC<CursorSpotlightProps> = ({
  isActive,
  onToggleActive,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [coords, setCoords] = useState<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? 350 : 350,
  });

  const [radius, setRadius] = useState<number>(320);
  const [intensity, setIntensity] = useState<'dramatic' | 'ambient'>('dramatic');
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isPointerInside, setIsPointerInside] = useState<boolean>(true);

  // Target and current positions for smooth lerping
  const targetPos = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? 350 : 350,
  });
  const currentPos = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? 350 : 350,
  });
  const animFrameId = useRef<number | null>(null);

  // Smooth lerp animation loop (smooth 60/120fps tracking)
  useEffect(() => {
    if (!isActive) return;

    let isRunning = true;
    const lerpFactor = 0.22;

    const animate = () => {
      if (!isRunning) return;

      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpFactor;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpFactor;

      setCoords({
        x: Math.round(currentPos.current.x * 10) / 10,
        y: Math.round(currentPos.current.y * 10) / 10,
      });

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isActive]);

  // Global mouse & touch listeners
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setIsPointerInside(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        targetPos.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        setIsPointerInside(true);
      }
    };

    const handleMouseLeave = () => {
      setIsPointerInside(false);
    };

    const handleMouseEnter = () => {
      setIsPointerInside(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'l' || e.key === 'L') {
        if (onToggleActive) {
          onToggleActive();
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onToggleActive]);

  if (!isActive) {
    return null;
  }

  // Warm theme-aware shroud gradient
  // In DARK theme: High-contrast dramatic warm espresso & graphite darkness (non-neon)
  // In LIGHT theme: Soft warm linen & taupe focal vignette preserving complete legibility
  const maskOuterColor = isDark
    ? (intensity === 'dramatic' ? 'rgba(23, 19, 17, 0.96)' : 'rgba(30, 24, 21, 0.82)')
    : (intensity === 'dramatic' ? 'rgba(33, 24, 19, 0.16)' : 'rgba(33, 24, 19, 0.07)');

  const maskMidColor = isDark
    ? (intensity === 'dramatic' ? 'rgba(28, 23, 20, 0.76)' : 'rgba(34, 28, 24, 0.54)')
    : (intensity === 'dramatic' ? 'rgba(33, 24, 19, 0.07)' : 'rgba(33, 24, 19, 0.02)');

  const rimColor = isDark
    ? 'rgba(201, 151, 101, 0.14)'
    : 'rgba(140, 94, 60, 0.07)';

  return (
    <>
      {/* 
        Full-viewport Spotlight Shroud Layer
        pointer-events: none ensures clicks, drag & drops, sliders pass through unimpeded
      */}
      <div
        className="fixed inset-0 pointer-events-none z-35 transition-opacity duration-300"
        style={{
          background: `radial-gradient(
            circle ${radius}px at ${coords.x}px ${coords.y}px,
            transparent 0%,
            transparent 42%,
            ${isDark ? 'rgba(28, 22, 19, 0.22)' : 'transparent'} 62%,
            ${maskMidColor} 82%,
            ${maskOuterColor} 100%
          )`,
          opacity: isPointerInside ? 1 : 0.85,
        }}
        aria-hidden="true"
      />

      {/* 
        Illuminated Beam Rim & Warm Specular Halo
      */}
      <div
        className="fixed inset-0 pointer-events-none z-36 mix-blend-screen opacity-65 transition-opacity duration-300"
        style={{
          background: `radial-gradient(
            circle ${radius * 1.04}px at ${coords.x}px ${coords.y}px,
            ${rimColor} 0%,
            transparent 70%,
            ${isDark ? 'rgba(217, 169, 115, 0.12)' : 'rgba(140, 94, 60, 0.08)'} 90%,
            transparent 100%
          )`,
        }}
        aria-hidden="true"
      />

      {/* 
        Floating Spotlight Toolbar
      */}
      <div className="fixed bottom-6 right-6 z-40 pointer-events-auto flex flex-col items-end gap-2 text-xs">
        {showControls && (
          <div className="bg-[#FAF7F2]/95 dark:bg-[#1E1815]/95 backdrop-blur-md border border-[#E8E2D8] dark:border-[#3D332C] rounded-2xl p-3.5 shadow-xl dark:shadow-2xl dark:shadow-black/70 flex flex-col gap-3 min-w-[210px] animate-in fade-in zoom-in-95 duration-150 text-[#211813] dark:text-[#F5EFEB]">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] dark:border-[#3D332C] pb-2">
              <span className="font-semibold text-[#211813] dark:text-[#F5EFEB] flex items-center gap-1.5 font-editorial">
                <Flashlight className="w-3.5 h-3.5 text-[#8C5E3C] dark:text-[#C99765]" />
                Torch Optics
              </span>
              <span className="text-[10px] font-mono text-[#8C7D70] dark:text-[#A69688] bg-[#F4EFEA] dark:bg-[#2B231F] px-1.5 py-0.5 rounded border border-[#E8E2D8] dark:border-[#3D332C]">
                Key [L]
              </span>
            </div>

            {/* Beam Size Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-[#8C7D70] dark:text-[#A69688] font-medium font-sans">Beam Radius</span>
              <div className="grid grid-cols-3 gap-1 bg-[#F4EFEA] dark:bg-[#2B231F] p-0.5 rounded-lg border border-[#E8E2D8] dark:border-[#3D332C]">
                {[
                  { label: 'Narrow', val: 220 },
                  { label: 'Classic', val: 320 },
                  { label: 'Wide', val: 450 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    onClick={() => setRadius(preset.val)}
                    className={`py-1 rounded-md text-[10px] font-medium transition cursor-pointer ${
                      radius === preset.val
                        ? 'bg-[#211813] dark:bg-[#C99765] text-[#FAF7F2] dark:text-[#171311] font-semibold shadow-xs'
                        : 'text-[#8C7D70] dark:text-[#A69688] hover:text-[#211813] dark:hover:text-[#F5EFEB]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast Mode */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-[#8C7D70] dark:text-[#A69688] font-medium font-sans">Darkness Contrast</span>
              <div className="grid grid-cols-2 gap-1 bg-[#F4EFEA] dark:bg-[#2B231F] p-0.5 rounded-lg border border-[#E8E2D8] dark:border-[#3D332C]">
                <button
                  onClick={() => setIntensity('dramatic')}
                  className={`py-1 rounded-md text-[10px] font-medium transition cursor-pointer ${
                    intensity === 'dramatic'
                      ? 'bg-[#211813] dark:bg-[#C99765] text-[#FAF7F2] dark:text-[#171311] font-semibold shadow-xs'
                      : 'text-[#8C7D70] dark:text-[#A69688] hover:text-[#211813] dark:hover:text-[#F5EFEB]'
                  }`}
                >
                  Dramatic
                </button>
                <button
                  onClick={() => setIntensity('ambient')}
                  className={`py-1 rounded-md text-[10px] font-medium transition cursor-pointer ${
                    intensity === 'ambient'
                      ? 'bg-[#211813] dark:bg-[#C99765] text-[#FAF7F2] dark:text-[#171311] font-semibold shadow-xs'
                      : 'text-[#8C7D70] dark:text-[#A69688] hover:text-[#211813] dark:hover:text-[#F5EFEB]'
                  }`}
                >
                  Ambient
                </button>
              </div>
            </div>

            {/* Turn Off Button */}
            {onToggleActive && (
              <button
                onClick={onToggleActive}
                className="w-full mt-0.5 py-1.5 px-3 rounded-lg bg-[#F4EFEA] dark:bg-[#2B231F] hover:bg-[#EAE4DC] dark:hover:bg-[#382F2A] text-[#5C4E43] dark:text-[#D4C7BC] hover:text-[#211813] dark:hover:text-[#F5EFEB] border border-[#E8E2D8] dark:border-[#3D332C] font-medium text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer font-sans"
              >
                <Sun className="w-3 h-3 text-[#8C5E3C] dark:text-[#C99765]" />
                Floodlight (Turn Off Torch)
              </button>
            )}
          </div>
        )}

        {/* Small floating quick toggle pill */}
        <div className="flex items-center gap-1.5 bg-[#FAF7F2]/90 dark:bg-[#1E1815]/90 backdrop-blur-md border border-[#E8E2D8] dark:border-[#3D332C] rounded-full px-2.5 py-1.5 shadow-md dark:shadow-xl dark:shadow-black/60 transition-colors">
          <button
            onClick={() => setShowControls((prev) => !prev)}
            className="flex items-center gap-1.5 text-[#5C4E43] dark:text-[#D4C7BC] hover:text-[#211813] dark:hover:text-[#F5EFEB] cursor-pointer transition text-[11px] font-medium font-sans"
            title="Adjust spotlight beam radius & darkness"
          >
            <span className="w-2 h-2 rounded-full bg-[#8C5E3C] dark:bg-[#C99765] animate-pulse" />
            <Flashlight className="w-3.5 h-3.5 text-[#8C5E3C] dark:text-[#C99765]" />
            <span className="hidden sm:inline">Torch: {radius}px</span>
            <Sliders className="w-3 h-3 text-[#8C7D70] dark:text-[#A69688]" />
          </button>

          {onToggleActive && (
            <>
              <span className="text-[#D8CEBF] dark:text-[#3D332C]">|</span>
              <button
                onClick={onToggleActive}
                className="text-[10px] text-[#8C7D70] dark:text-[#A69688] hover:text-[#8C5E3C] dark:hover:text-[#C99765] transition font-mono px-1 cursor-pointer"
                title="Toggle spotlight mode (Hotkey: L)"
              >
                [L]
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
