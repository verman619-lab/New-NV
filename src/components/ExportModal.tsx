import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileCode, Copy, Check, X } from 'lucide-react';
import { Lead } from '../types';

interface ExportModalProps {
  leads: Lead[];
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ leads, onClose }) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [copied, setCopied] = useState(false);

  // Generate CSV String
  const generateCSV = () => {
    const headers = ['Business Name', 'Niche', 'City', 'State', 'Website', 'Email', 'Audit Score', 'Email Subject', 'Email Body'];
    const rows = leads.map(l => [
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.nicheLabel || '').replace(/"/g, '""')}"`,
      `"${(l.city || '').replace(/"/g, '""')}"`,
      `"${(l.state || '').replace(/"/g, '""')}"`,
      `"${(l.website || '').replace(/"/g, '""')}"`,
      `"${(l.manualEmail || l.foundEmail || '').replace(/"/g, '""')}"`,
      l.auditScore ?? l.auditResult?.score ?? '',
      `"${(l.emailDraft?.subject || '').replace(/"/g, '""')}"`,
      `"${(l.emailDraft?.body || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  // Generate JSON String
  const generateJSON = () => {
    return JSON.stringify(leads, null, 2);
  };

  const exportText = exportFormat === 'csv' ? generateCSV() : generateJSON();

  const handleDownload = () => {
    const blob = new Blob([exportText], { type: exportFormat === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prospectpilot_leads_${new Date().toISOString().slice(0, 10)}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-400" /> Export Outreach Campaign ({leads.length} Leads)
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExportFormat('csv')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              exportFormat === 'csv'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> CSV Format (Instantly / Smartlead)
          </button>

          <button
            onClick={() => setExportFormat('json')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              exportFormat === 'json'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileCode className="w-4 h-4" /> Raw JSON
          </button>
        </div>

        {/* Text Preview Box */}
        <div className="relative">
          <textarea
            readOnly
            value={exportText}
            className="w-full h-56 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-indigo-200 resize-none focus:outline-none"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleCopyText}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Content'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Download File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
