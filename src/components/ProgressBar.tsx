import React from 'react';
import { PipelineProgress } from '../types';
import { Search, Mail, Camera, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface ProgressBarProps {
  progress: PipelineProgress;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  if (progress.stage === 'idle') return null;

  const steps = [
    { id: 'scraping', label: 'Scraping Leads', icon: Search },
    { id: 'extracting_emails', label: 'Extracting Emails', icon: Mail },
    { id: 'capturing_screenshots', label: 'Capturing Screenshots', icon: Camera },
    { id: 'auditing', label: 'Auditing Sites', icon: ShieldAlert },
    { id: 'drafting', label: 'Drafting Emails', icon: FileText },
  ];

  const getStepStatus = (stepId: string) => {
    const stageOrder = ['scraping', 'extracting_emails', 'capturing_screenshots', 'auditing', 'drafting', 'completed'];
    const currentIndex = stageOrder.indexOf(progress.stage);
    const stepIndex = stageOrder.indexOf(stepId);

    if (progress.stage === 'completed') return 'completed';
    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="bg-slate-800/90 border border-indigo-500/30 rounded-2xl p-5 shadow-xl shadow-slate-950/50 space-y-4">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
          <span className="font-semibold text-white">{progress.message}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-300">
          <span>{progress.completedLeads} / {progress.totalLeads} leads processed</span>
          <span className="text-slate-500">|</span>
          <span className="font-bold text-white">{Math.round(progress.percentage)}%</span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-slate-900 rounded-full h-2.5 p-0.5 border border-slate-700/60 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out shadow-sm shadow-indigo-500/50"
          style={{ width: `${Math.max(progress.percentage, 4)}%` }}
        />
      </div>

      {/* Pipeline Steps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        {steps.map((s) => {
          const status = getStepStatus(s.id);
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs transition-all ${
                status === 'completed'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : status === 'active'
                  ? 'bg-indigo-950/50 border-indigo-500 text-white font-medium shadow-md shadow-indigo-500/10'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              {status === 'completed' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : status === 'active' ? (
                <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <Icon className="w-4 h-4 shrink-0 opacity-60" />
              )}
              <span className="truncate">{s.label}</span>
            </div>
          );
        })}
      </div>

      {progress.currentLeadName && (
        <div className="text-xs text-slate-400 text-center bg-slate-900/60 py-1.5 px-3 rounded-lg border border-slate-800">
          Currently processing: <span className="text-indigo-300 font-medium">{progress.currentLeadName}</span>
        </div>
      )}
    </div>
  );
};
