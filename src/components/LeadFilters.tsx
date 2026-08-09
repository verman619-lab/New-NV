import React from 'react';
import { Search, Filter, Download, Copy, Check } from 'lucide-react';

interface LeadFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  scoreFilter: 'all' | 'high' | 'med' | 'low';
  onScoreFilterChange: (f: 'all' | 'high' | 'med' | 'low') => void;
  emailFilter: 'all' | 'has_email' | 'no_email';
  onEmailFilterChange: (f: 'all' | 'has_email' | 'no_email') => void;
  onOpenExport: () => void;
  onCopyAllEmails: () => void;
  copiedAllEmails: boolean;
  totalCount: number;
  filteredCount: number;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  searchQuery,
  onSearchChange,
  scoreFilter,
  onScoreFilterChange,
  emailFilter,
  onEmailFilterChange,
  onOpenExport,
  onCopyAllEmails,
  copiedAllEmails,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="relative w-full md:w-72">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by business name, site..."
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Filter Selectors */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Filter className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Score:</span>
          <select
            value={scoreFilter}
            onChange={(e) => onScoreFilterChange(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
          >
            <option value="all">All Scores</option>
            <option value="high">High (&gt; 75)</option>
            <option value="med">Moderate (50-75)</option>
            <option value="low">Major Friction (&lt; 50)</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <span>Email:</span>
          <select
            value={emailFilter}
            onChange={(e) => onEmailFilterChange(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
          >
            <option value="all">All Leads</option>
            <option value="has_email">Has Email Only</option>
            <option value="no_email">Email Needed</option>
          </select>
        </div>

        <span className="text-slate-500 hidden sm:inline">|</span>

        {/* Counter */}
        <span className="text-slate-400 font-mono">
          Showing <strong className="text-white">{filteredCount}</strong> of {totalCount}
        </span>
      </div>

      {/* Action Export Buttons */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <button
          onClick={onCopyAllEmails}
          className="px-3 py-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
          title="Copy all extracted lead email addresses"
        >
          {copiedAllEmails ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
          <span>{copiedAllEmails ? 'Copied Emails' : 'Copy All Emails'}</span>
        </button>

        <button
          onClick={onOpenExport}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Outreach</span>
        </button>
      </div>
    </div>
  );
};
