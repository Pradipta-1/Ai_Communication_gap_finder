import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AnalysisMode,
  api,
  getAnalysisPreferences,
  saveAnalysisPreferences,
} from '../services/api';
import {
  DEMO_PROJECT_MEETING_RAW,
  DEMO_SOFTWARE_TEAM_RAW,
  DEMO_EVENT_PLANNING_RAW,
} from '../data/demoConversations';
import { AnalysisLoader } from '../components/AnalysisLoader';
import { AnalysisModeSelector } from '../components/AnalysisModeSelector';
import {
  Upload,
  FileText,
  Zap,
  Sliders,
  Shield,
  AlertCircle,
  Copy,
  Sparkles,
  Check,
  Cpu,
} from 'lucide-react';

export const Analyze: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'paste' | 'upload' | 'demo'>('paste');
  const [inputText, setInputText] = useState(DEMO_PROJECT_MEETING_RAW);
  const [title, setTitle] = useState('Q4 Strategy & Delivery Sync');
  const [confidenceThreshold, setConfidenceThreshold] = useState(
    () => getAnalysisPreferences().confidenceThreshold,
  );
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode | null>(
    () => getAnalysisPreferences().aiMode,
  );
  const [selectedFocus, setSelectedFocus] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pasteToast, setPasteToast] = useState(false);

  const handleAnalysisModeChange = (mode: AnalysisMode) => {
    setAnalysisMode(mode);
    saveAnalysisPreferences({ ...getAnalysisPreferences(), aiMode: mode });
    setErrorMsg(null);
  };

  const handleLoadDemo = (type: 1 | 2 | 3) => {
    if (type === 1) {
      setInputText(DEMO_PROJECT_MEETING_RAW);
      setTitle('Q4 Roadmap & Infrastructure Planning');
    } else if (type === 2) {
      setInputText(DEMO_SOFTWARE_TEAM_RAW);
      setTitle('Sprint Release & Incident Sync');
    } else {
      setInputText(DEMO_EVENT_PLANNING_RAW);
      setTitle('DevCon Summit Venue & Sponsor Clash');
    }
    setActiveTab('paste');
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as string;
      if (content) {
        setInputText(content);
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
        setActiveTab('paste');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!analysisMode) {
      setErrorMsg('CHOOSE OPENROUTER API OR LOCAL AI BEFORE CONTINUING.');
      return;
    }
    if (!inputText.trim()) {
      setErrorMsg('PLEASE INPUT A CONVERSATION TRANSCRIPT BEFORE EXECUTING PIPELINE.');
      return;
    }
    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      const minDelay = new Promise(resolve => setTimeout(resolve, 2000));
      const [result] = await Promise.all([
        api.analyzeConversation(inputText, {
          title: title || 'Conversation Audit',
          aiMode: analysisMode,
          confidenceThreshold,
        }),
        minDelay,
      ]);

      navigate(`/results/${result.id}`);
    } catch (err: any) {
      setIsAnalyzing(false);
      setErrorMsg(err.message || 'Unable to analyze this conversation. Please check input syntax.');
    }
  };

  return (
    <div className="p-3.5 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-[#babecc] shadow-[0_1px_0_#ffffff]">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-mono font-extrabold uppercase text-[#2d3436] text-embossed tracking-tight">
            DATA INGESTION PIPELINE
          </h1>
          <p className="text-xs font-mono text-[#4a5568] mt-1">
            Feed raw dialogue to parse question trees, semantic dependencies, and communication gaps.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] border border-[#ff4757]/40 text-[#ff4757] text-xs font-mono font-bold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Analysis Processing Loader State */}
      {isAnalyzing ? (
        <div className="py-12">
          <AnalysisLoader mode={analysisMode || undefined} durationMs={2000} />
        </div>
      ) : (
        /* Two Column Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Input Options & Textarea (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* Input Method Tabs */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-[#babecc] shadow-[0_1px_0_#ffffff] pb-3">
              <button
                onClick={() => setActiveTab('paste')}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all ${
                  activeTab === 'paste'
                    ? 'bg-[#e0e5ec] text-[#ff4757] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff]'
                    : 'bg-[#e0e5ec] text-[#4a5568] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] hover:text-[#2d3436]'
                }`}
              >
                01. PASTE TRANSCRIPT
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all ${
                  activeTab === 'upload'
                    ? 'bg-[#e0e5ec] text-[#ff4757] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff]'
                    : 'bg-[#e0e5ec] text-[#4a5568] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] hover:text-[#2d3436]'
                }`}
              >
                02. UPLOAD FILE
              </button>
              <button
                onClick={() => setActiveTab('demo')}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all ${
                  activeTab === 'demo'
                    ? 'bg-[#e0e5ec] text-[#ff4757] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff]'
                    : 'bg-[#e0e5ec] text-[#4a5568] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] hover:text-[#2d3436]'
                }`}
              >
                03. BENCH PRESETS
              </button>
            </div>

            {/* Paste Tab */}
            {activeTab === 'paste' && (
              <div className="space-y-3 font-mono">
                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    rows={15}
                    placeholder="Alice: Are we meeting tomorrow?&#10;Bob: Yes, at 3pm.&#10;Charlie: Where should we meet?&#10;David: Working on the slide deck now."
                    className="w-full bg-[#e0e5ec] shadow-[inset_5px_5px_10px_#babecc,inset_-5px_-5px_10px_#ffffff] border-none p-4 text-xs font-mono text-[#2d3436] placeholder:text-[#4a5568]/50 rounded-2xl focus:shadow-[inset_5px_5px_10px_#babecc,inset_-5px_-5px_10px_#ffffff,0_0_0_2px_#ff4757] focus:outline-none leading-relaxed resize-y"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.readText().then(text => {
                          if (text) {
                            setInputText(text);
                            setPasteToast(true);
                            setTimeout(() => setPasteToast(false), 2000);
                          }
                        });
                      }}
                      className="btn-tactile-chassis text-[10px] uppercase font-bold px-2.5 py-1 rounded"
                    >
                      {pasteToast ? 'PASTED' : 'PASTE CLIPBOARD'}
                    </button>
                    {inputText && (
                      <button
                        onClick={() => setInputText('')}
                        className="btn-tactile-chassis text-[10px] uppercase font-bold text-[#ff4757] px-2.5 py-1 rounded"
                      >
                        CLEAR
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#4a5568] px-1 font-bold">
                  <span>LINES: {inputText.split('\n').filter(Boolean).length}</span>
                  <span>FORMAT: "SPEAKER: MESSAGE", TIMESTAMPS, CSV, JSON</span>
                </div>
              </div>
            )}

            {/* Upload File Tab */}
            {activeTab === 'upload' && (
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`p-10 rounded-2xl text-center transition-all ${
                  dragOver
                    ? 'bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#babecc,inset_-6px_-6px_12px_#ffffff,0_0_0_2px_#ff4757]'
                    : 'bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#babecc,inset_-4px_-4px_8px_#ffffff]'
                }`}
              >
                <div className="max-w-xs mx-auto space-y-4 font-mono">
                  <div className="p-4 bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] w-fit mx-auto rounded-xl text-[#ff4757]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase text-[#2d3436] text-embossed">
                      DROP TRANSCRIPT DATA FILE
                    </h3>
                    <p className="text-[10px] text-[#4a5568] mt-1">
                      SUPPORTS .TXT, .CSV, AND .JSON TRANSCRIPT DUMPS
                    </p>
                  </div>
                  <label className="btn-tactile-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase rounded-xl cursor-pointer">
                    <span>BROWSE HARD DRIVE</span>
                    <input
                      type="file"
                      accept=".txt,.csv,.json"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Presets Tab */}
            {activeTab === 'demo' && (
              <div className="space-y-3 font-mono">
                <div className="text-[11px] text-[#4a5568] font-bold uppercase mb-1">
                  SELECT CALIBRATED TEST SCENARIO:
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => handleLoadDemo(1)}
                    className="p-4 bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] rounded-xl text-left transition-all group border border-[#ffffff]/50"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#2d3436] uppercase text-embossed">
                      <span>01. Project Planning Meeting</span>
                      <span className="text-[#ff4757]">LOAD PRESET →</span>
                    </div>
                    <p className="text-[11px] text-[#4a5568] mt-1">
                      Features repeated questions about meeting time, partial responses, and database debate.
                    </p>
                  </button>

                  <button
                    onClick={() => handleLoadDemo(2)}
                    className="p-4 bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] rounded-xl text-left transition-all group border border-[#ffffff]/50"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#2d3436] uppercase text-embossed">
                      <span>02. Software Team Incident Sync</span>
                      <span className="text-[#0284c7]">LOAD PRESET →</span>
                    </div>
                    <p className="text-[11px] text-[#4a5568] mt-1">
                      Features stalled code review promises, token expiration queries, and production memory alerts.
                    </p>
                  </button>

                  <button
                    onClick={() => handleLoadDemo(3)}
                    className="p-4 bg-[#e0e5ec] shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] rounded-xl text-left transition-all group border border-[#ffffff]/50"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#2d3436] uppercase text-embossed">
                      <span>03. DevCon Summit Planning</span>
                      <span className="text-[#7c3aed]">LOAD PRESET →</span>
                    </div>
                    <p className="text-[11px] text-[#4a5568] mt-1">
                      Features date conflicts between keynote speaker and venue booking with topic abandonment.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Notice */}
            <div className="p-4 bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] rounded-xl flex items-start gap-2.5 text-[11px] font-mono text-[#4a5568] border border-[#ffffff]/40">
              <Shield className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
              <span>
                {analysisMode === 'local'
                  ? 'Local AI analyzes the transcript in this browser without contacting an external AI provider.'
                  : analysisMode === 'openrouter'
                    ? 'OpenRouter sends the transcript to the configured provider. Analysis requires a working server API key.'
                    : 'Choose OpenRouter API or Local AI to continue. The choice is required before analysis.'}
              </span>
            </div>
          </div>

          {/* Right Column: Configuration & Trigger (5 Cols) */}
          <div className="lg:col-span-5 bg-[#e0e5ec] shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl corner-screws border border-[#ffffff]/40 space-y-4 sm:space-y-6 font-mono">
            <div className="flex items-center gap-2 pb-3 border-b border-[#babecc] shadow-[0_1px_0_#ffffff]">
              <Sliders className="w-4 h-4 text-[#ff4757]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2d3436] text-embossed">
                CALIBRATION CONTROLS
              </h3>
            </div>

            <AnalysisModeSelector value={analysisMode} onChange={handleAnalysisModeChange} />

            {/* Title field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-[#4a5568] block text-embossed">
                SESSION AUDIT TITLE
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Q4 Strategy Review"
                className="w-full bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] border-none px-3.5 py-2.5 text-xs font-mono text-[#2d3436] rounded-xl focus:shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff,0_0_0_2px_#ff4757] focus:outline-none"
              />
            </div>

            {/* Confidence Threshold Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#4a5568] uppercase text-embossed">
                  CONFIDENCE THRESHOLD
                </span>
                <span className="text-[#ff4757]">
                  {Math.round(confidenceThreshold * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={e => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full accent-[#ff4757] bg-[#d1d9e6] h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-[#4a5568] block leading-relaxed">
                {confidenceThreshold >= 0.85
                  ? 'STRICT: Flags only unambiguous, verifiable communication gaps.'
                  : 'BALANCED: Detects high and moderate probability questions & dropped threads.'}
              </span>
            </div>

            {/* Diagnostic Focus Filter */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase text-[#4a5568] block text-embossed">
                ANALYSIS FOCUS
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {[
                  { id: 'all', label: 'All Communication Gaps (Recommended)' },
                  { id: 'questions', label: 'Unanswered Questions & Clarifications' },
                  { id: 'decisions', label: 'Unresolved Decisions & Topic Abandonment' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedFocus(opt.id)}
                    className={`p-3 text-left rounded-xl transition-all font-mono text-xs ${
                      selectedFocus === opt.id
                        ? 'bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] text-[#ff4757] font-bold'
                        : 'bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] text-[#4a5568] hover:text-[#2d3436]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze CTA */}
            <button
              onClick={startAnalysis}
              disabled={!analysisMode}
              className="btn-tactile-primary w-full py-4 px-6 text-xs font-mono font-bold uppercase rounded-xl tracking-wider flex items-center justify-center gap-2 active:translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white stroke-[2.5]" />
              <span>EXECUTE NEURAL INGESTION</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
