import React from 'react';
import { Compass, Sparkles, CheckCircle2, ShieldAlert, Database, RefreshCw, Mail } from 'lucide-react';

interface HeaderProps {
  hasGeminiKey: boolean;
  hasGeoapifyKey: boolean;
  totalLeads: number;
  auditedCount: number;
  emailsExtractedCount: number;
  onReset: () => void;
  onRunDemo: () => void;
  isProcessing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  hasGeminiKey,
  hasGeoapifyKey,
  totalLeads,
  auditedCount,
  emailsExtractedCount,
  onReset,
  onRunDemo,
  isProcessing,
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 px-4 sm:px-8 py-4 text-slate-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                ProspectPilot
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Cold Outreach Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Scrape local leads • AI website audits • Email extraction • Zero-flattery outreach
            </p>
          </div>
        </div>

        {/* Stats & Status Indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Key Status Indicators */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Gemini 3.6 Vision
            </span>
            <span className="text-slate-600">|</span>
            {hasGeoapifyKey ? (
              <span className="flex items-center gap-1 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Geoapify Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-300" title="Geoapify key not set; using realistic local lead generator">
                <Database className="w-3.5 h-3.5 text-amber-400" /> Demo Places Mode
              </span>
            )}
          </div>

          {/* Quick Metrics */}
          {totalLeads > 0 && (
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg text-slate-300">
              <span>Leads: <strong className="text-white">{totalLeads}</strong></span>
              <span className="text-slate-600">•</span>
              <span>Audited: <strong className="text-indigo-400">{auditedCount}</strong></span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-emerald-400" />
                Emails: <strong className="text-emerald-400">{emailsExtractedCount}</strong>
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRunDemo}
              disabled={isProcessing}
              className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              title="Run 1-click sample search (Dentists in Austin)"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Sample Batch
            </button>
            {totalLeads > 0 && (
              <button
                onClick={onReset}
                disabled={isProcessing}
                className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors disabled:opacity-50"
                title="Clear current workspace"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
