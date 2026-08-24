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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-800 overflow-hidden backdrop-blur-lg">
        {/* Header */}
        <div className="bg-slate-950/90 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
              <History className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-white">Session Comparison History ({history.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
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
                  className="bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-blue-500/50 p-4 rounded-xl transition flex items-center justify-between gap-4 group cursor-pointer"
                  onClick={() => {
                    onSelectResult(item);
                    onClose();
                  }}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-white font-mono">Trial #{idx + 1}</span>
                      <span className="text-[10px] font-mono text-slate-500">{item.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-bold text-blue-400 font-mono">A: {prefA}%</span>
                      <span className="text-slate-600 font-mono">vs</span>
                      <span className="font-bold text-emerald-400 font-mono">B: {prefB}%</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-xs">
                        • {item.scientificAnalysis.summary}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="bg-slate-950/90 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>

            <button
              onClick={handleExportAll}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-900/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Session JSON</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
