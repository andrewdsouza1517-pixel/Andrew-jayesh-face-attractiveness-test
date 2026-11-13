import React from 'react';
import { X, History, Trash2, ArrowRight, Download } from 'lucide-react';
import type { ComparisonResult } from '../types/experiment';

interface SessionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ComparisonResult[];
  onSelectResult: (result: ComparisonResult) => void;
  onClearHistory: () => void;
}

export const SessionHistoryModal: React.FC<SessionHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const handleExportAll = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pairwise_experiment_session_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171311]/70 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-[#1E1815] rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl dark:shadow-2xl border border-[#E8E2D8] dark:border-[#3D332C] overflow-hidden transition-colors">
        {/* Header */}
        <div className="bg-[#FAF7F2] dark:bg-[#221C18] px-6 py-4 flex items-center justify-between border-b border-[#E8E2D8] dark:border-[#3D332C]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white dark:bg-[#171311] border border-[#E8E2D8] dark:border-[#3D332C] text-[#8C5E3C] dark:text-[#C99765] rounded-md">
              <History className="w-4 h-4" />
            </div>
            <h3 className="font-editorial font-medium text-base text-[#211813] dark:text-[#F5EFEB]">
              Session Comparison History ({history.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8C7D70] hover:text-[#211813] dark:hover:text-[#F5EFEB] rounded-md hover:bg-[#F4EFEA] dark:hover:bg-[#2B231F] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3 font-sans">
          {history.length === 0 ? (
            <div className="text-center py-12 text-[#8C7D70] dark:text-[#A69688] text-xs">
              <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No pairwise comparisons recorded in this session yet.</p>
            </div>
          ) : (
            history.map((item, idx) => {
              const prefA = Math.round(item.pairwiseProbabilities.preferenceA * 100);
              const prefB = Math.round(item.pairwiseProbabilities.preferenceB * 100);

              return (
                <div
                  key={item.id}
                  className="bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] dark:bg-[#221C18] dark:hover:bg-[#2B231F] border border-[#E8E2D8] dark:border-[#3D332C] hover:border-[#8C5E3C] dark:hover:border-[#C99765] p-4 rounded-lg transition flex items-center justify-between gap-4 group cursor-pointer shadow-2xs"
                  onClick={() => {
                    onSelectResult(item);
                    onClose();
                  }}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#211813] dark:text-[#F5EFEB] font-mono">Trial #{idx + 1}</span>
                      <span className="text-[10px] font-mono text-[#8C7D70] dark:text-[#A69688]">{item.id}</span>
                      <span className="text-[10px] text-[#8C7D70] dark:text-[#A69688] font-mono">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-semibold text-[#8C5E3C] dark:text-[#C99765] font-mono">A: {prefA}%</span>
                      <span className="text-[#8C7D70] dark:text-[#A69688] font-mono">vs</span>
                      <span className="font-semibold text-[#4A6B53] dark:text-[#6B9071] font-mono">B: {prefB}%</span>
                      <span className="text-[11px] text-[#8C7D70] dark:text-[#A69688] truncate max-w-xs font-sans">
                        • {item.scientificAnalysis.summary}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#8C7D70] dark:text-[#A69688] group-hover:text-[#8C5E3C] dark:group-hover:text-[#C99765] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="bg-[#FAF7F2] dark:bg-[#221C18] px-6 py-3.5 border-t border-[#E8E2D8] dark:border-[#3D332C] flex items-center justify-between font-sans">
            <button
              onClick={onClearHistory}
              className="text-xs text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <button
              onClick={handleExportAll}
              className="px-3.5 py-1.5 rounded-lg border border-[#E8E2D8] dark:border-[#3D332C] bg-white dark:bg-[#1E1815] text-[#5C4E43] dark:text-[#D4C7BC] hover:text-[#211813] dark:hover:text-[#F5EFEB] text-xs font-medium transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Session Data</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
