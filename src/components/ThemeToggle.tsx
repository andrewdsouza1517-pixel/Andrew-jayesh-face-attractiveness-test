import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../utils/themeContext';
import { ThemePreference } from '../utils/theme';

export const ThemeToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { preference, resolvedTheme, setPreference } = useTheme();

  const options: { id: ThemePreference; label: string; icon: React.ReactNode }[] = [
    {
      id: 'light',
      label: 'Light',
      icon: <Sun className="w-3.5 h-3.5" />,
    },
    {
      id: 'dark',
      label: 'Dark',
      icon: <Moon className="w-3.5 h-3.5" />,
    },
    {
      id: 'system',
      label: 'Auto',
      icon: <Monitor className="w-3.5 h-3.5" />,
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center bg-[#F4EFEA] dark:bg-[#1E1815] p-0.5 rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] shadow-2xs">
        {options.map((opt) => {
          const isSelected = preference === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setPreference(opt.id)}
              className={`p-1.5 rounded-md text-xs transition-all cursor-pointer flex items-center justify-center ${
                isSelected
                  ? 'bg-white dark:bg-[#2B231F] text-[#8C5E3C] dark:text-[#C99765] shadow-xs font-medium border border-[#E8E2D8]/80 dark:border-[#3D332C]'
                  : 'text-[#8C7D70] dark:text-[#A69688] hover:text-[#211813] dark:hover:text-[#F5EFEB]'
              }`}
              title={`Switch to ${opt.label} mode (${opt.id === 'system' ? 'OS Preference: ' + resolvedTheme : opt.label})`}
              aria-label={`Switch to ${opt.label} theme`}
            >
              {opt.icon}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className="inline-flex items-center bg-[#F4EFEA] dark:bg-[#1E1815] p-0.5 rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] shadow-2xs"
    >
      {options.map((opt) => {
        const isSelected = preference === opt.id;
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => setPreference(opt.id)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              isSelected
                ? 'bg-white dark:bg-[#2B231F] text-[#211813] dark:text-[#F5EFEB] shadow-xs border border-[#E8E2D8]/80 dark:border-[#3D332C]'
                : 'text-[#8C7D70] dark:text-[#A69688] hover:text-[#211813] dark:hover:text-[#F5EFEB]'
            }`}
            title={`Switch to ${opt.label} mode (${opt.id === 'system' ? 'System OS: ' + resolvedTheme : opt.label})`}
          >
            <span className={isSelected ? 'text-[#8C5E3C] dark:text-[#C99765]' : ''}>{opt.icon}</span>
            <span className="hidden sm:inline font-sans">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
