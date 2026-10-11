import React, { useState } from 'react';
import { ConversationAnalysis } from '../types/conversation';
import { exportAnalysisAsJSON, exportAnalysisAsCSV, triggerPrintReport } from '../utils/export';
import { Download, FileJson, FileSpreadsheet, Printer, X, Check } from 'lucide-react';

interface ExportModalProps {
  analysis: ConversationAnalysis;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ analysis, onClose }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleJSON = () => {
    exportAnalysisAsJSON(analysis);
    setDownloadSuccess('JSON SCHEMA EXPORTED');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const handleCSV = () => {
    exportAnalysisAsCSV(analysis);
    setDownloadSuccess('CSV DATA EXPORTED');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      triggerPrintReport();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2d3436]/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-[#e0e5ec] shadow-[16px_16px_32px_rgba(0,0,0,0.25),-16px_-16px_32px_#ffffff] border border-[#ffffff]/60 w-full max-w-md p-6 rounded-2xl relative space-y-5 corner-screws animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#2d3436] rounded-lg bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff]"
          aria-label="Close export dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#2d3436] text-embossed flex items-center gap-2">
            <Download className="w-4 h-4 text-[#ff4757]" />
            <span>EXPORT TELEMETRY PACKAGE</span>
          </h3>
          <p className="text-xs font-mono text-[#4a5568] mt-1">
            Produce verified audit artifacts for "{analysis.title}".
          </p>
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-lg bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] border border-[#16a34a]/30 text-[#15803d] text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-[#16a34a]" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        <div className="space-y-3 font-mono">
          {/* JSON Option */}
          <button
            onClick={handleJSON}
            className="w-full flex items-center justify-between p-4 bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] rounded-xl transition-all group border border-[#ffffff]/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#e0e5ec] shadow-[2px_2px_4px_#babecc,-2px_-2px_4px_#ffffff] text-[#ff4757]">
                <FileJson className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold uppercase text-[#2d3436] block">
                  JSON RAW SCHEMA
                </span>
                <span className="text-[10px] text-[#4a5568]">
                  Full transcript graph & message nodes
                </span>
              </div>
            </div>
            <span className="text-xs text-[#ff4757] font-bold">.JSON</span>
          </button>

          {/* CSV Option */}
          <button
            onClick={handleCSV}
            className="w-full flex items-center justify-between p-4 bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] rounded-xl transition-all group border border-[#ffffff]/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#e0e5ec] shadow-[2px_2px_4px_#babecc,-2px_-2px_4px_#ffffff] text-[#0284c7]">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold uppercase text-[#2d3436] block">
                  GAP TELEMETRY CSV
                </span>
                <span className="text-[10px] text-[#4a5568]">
                  Tabular spreadsheet of communication gaps
                </span>
              </div>
            </div>
            <span className="text-xs text-[#0284c7] font-bold">.CSV</span>
          </button>

          {/* Printable Report Option */}
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-between p-4 bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] rounded-xl transition-all group border border-[#ffffff]/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#e0e5ec] shadow-[2px_2px_4px_#babecc,-2px_-2px_4px_#ffffff] text-[#7c3aed]">
                <Printer className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold uppercase text-[#2d3436] block">
                  PRINT SCHEMATIC (PDF)
                </span>
                <span className="text-[10px] text-[#4a5568]">
                  Clean one-page executive audit layout
                </span>
              </div>
            </div>
            <span className="text-xs text-[#7c3aed] font-bold">.PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
