import React from 'react';
import { Database, ArrowRight } from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/samplePresets';
import type { SamplePairPreset } from '../types/experiment';
import { urlToDataUrl } from '../utils/imageUtils';

interface PresetSelectorProps {
  onSelectPair: (dataUrlA: string, nameA: string, dataUrlB: string, nameB: string) => Promise<void>;
  isLoading: boolean;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelectPair, isLoading }) => {
  const [loadingPresetId, setLoadingPresetId] = React.useState<string | null>(null);

  const handleSelect = async (preset: SamplePairPreset) => {
    try {
      setLoadingPresetId(preset.id);
      const [dataUrlA, dataUrlB] = await Promise.all([
        urlToDataUrl(preset.imageA.url),
        urlToDataUrl(preset.imageB.url),
      ]);
      await onSelectPair(dataUrlA, preset.imageA.name, dataUrlB, preset.imageB.name);
    } catch (err) {
      console.error('Error loading preset images:', err);
    } finally {
      setLoadingPresetId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1E1815] border border-[#E8E2D8] dark:border-[#3D332C] rounded-xl p-5 space-y-4 shadow-xs dark:shadow-md transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#FAF7F2] dark:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C5E3C] dark:text-[#C99765] rounded-md">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#211813] dark:text-[#F5EFEB] uppercase tracking-wider font-sans">
              Standard Benchmark Datasets
            </h3>
            <p className="text-xs text-[#8C7D70] dark:text-[#A69688] font-sans">
              Calibrated visual pairs for Bradley–Terry probabilistic ranking verification
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7D70] dark:text-[#A69688]">
          3 Cohorts
        </span>
      </div>

      <div className="grid sm:grid-cols-3 gap-3.5 pt-1">
        {SAMPLE_PRESETS.map((preset) => {
          const isCurrentLoading = loadingPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelect(preset)}
              disabled={isLoading || isCurrentLoading}
              className="text-left bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] dark:bg-[#221C18] dark:hover:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] hover:border-[#8C5E3C] dark:hover:border-[#C99765] p-3.5 rounded-lg transition-all group cursor-pointer disabled:opacity-50 relative overflow-hidden shadow-2xs"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-11 h-11 rounded-md overflow-hidden border border-[#E8E2D8] dark:border-[#3D332C] relative shrink-0">
                  <img src={preset.imageA.url} alt="Subject Alpha" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 left-0 right-0 bg-[#211813]/90 dark:bg-[#C99765]/90 text-[8px] font-mono font-bold text-[#FAF7F2] dark:text-[#171311] text-center">
                    A
                  </span>
                </div>
                <div className="text-[#8C7D70] dark:text-[#A69688] font-mono font-bold text-xs italic">vs</div>
                <div className="w-11 h-11 rounded-md overflow-hidden border border-[#E8E2D8] dark:border-[#3D332C] relative shrink-0">
                  <img src={preset.imageB.url} alt="Subject Bravo" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 left-0 right-0 bg-[#4A6B53]/90 dark:bg-[#6B9071]/90 text-[8px] font-mono font-bold text-[#FAF7F2] dark:text-[#171311] text-center">
                    B
                  </span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-medium text-[#8C5E3C] dark:text-[#C99765] uppercase tracking-wider block">
                  {preset.category}
                </span>
                <p className="text-xs font-medium text-[#211813] dark:text-[#F5EFEB] line-clamp-1 group-hover:text-[#8C5E3C] dark:group-hover:text-[#C99765] transition font-sans">
                  {preset.title}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-[#8C7D70] dark:text-[#A69688] pt-2 border-t border-[#E8E2D8] dark:border-[#3D332C]/60 font-sans">
                <span className="text-[11px]">{isCurrentLoading ? 'Loading cohort...' : 'Load into lab'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8C7D70] dark:text-[#A69688] group-hover:text-[#8C5E3C] dark:group-hover:text-[#C99765] group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
