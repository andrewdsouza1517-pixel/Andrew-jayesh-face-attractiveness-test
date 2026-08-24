import React from 'react';
import { Sparkles, ArrowRight, Database } from 'lucide-react';
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
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Standard Benchmark Datasets
            </h3>
            <p className="text-xs text-slate-400">
              Load calibrated visual pairs to test the Bradley–Terry probabilistic ranking engine
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
          PRESETS (3)
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
              className="text-left bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-blue-500/50 p-3.5 rounded-xl transition-all group cursor-pointer disabled:opacity-50 relative overflow-hidden"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-700 relative shrink-0">
                  <img src={preset.imageA.url} alt="Subject Alpha" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 left-0 right-0 bg-blue-600/90 text-[8px] font-mono font-bold text-white text-center">
                    A
                  </span>
                </div>
                <div className="text-slate-600 font-mono font-bold text-xs italic">vs</div>
                <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-700 relative shrink-0">
                  <img src={preset.imageB.url} alt="Subject Bravo" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 left-0 right-0 bg-emerald-600/90 text-[8px] font-mono font-bold text-white text-center">
                    B
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-semibold text-blue-400 uppercase tracking-wider">
                  {preset.category}
                </span>
                <p className="text-xs font-medium text-slate-200 line-clamp-1 group-hover:text-white transition">
                  {preset.title}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2.5 border-t border-slate-700/40 font-mono">
                <span className="text-[11px]">{isCurrentLoading ? 'Loading cohort...' : 'Load to lab'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
