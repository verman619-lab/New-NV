import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { ProgressBar } from './components/ProgressBar';
import { LeadCard } from './components/LeadCard';
import { LeadFilters } from './components/LeadFilters';
import { ExportModal } from './components/ExportModal';
import { Lead, SearchParams, PipelineProgress } from './types';
import { Sparkles, Building2, ShieldAlert, Mail, Rocket, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);
  const [hasGeoapifyKey, setHasGeoapifyKey] = useState<boolean>(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<PipelineProgress>({
    stage: 'idle',
    message: '',
    completedLeads: 0,
    totalLeads: 0,
    percentage: 0,
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'med' | 'low'>('all');
  const [emailFilter, setEmailFilter] = useState<'all' | 'has_email' | 'no_email'>('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedAllEmails, setCopiedAllEmails] = useState(false);

  // Check server health on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setHasGeminiKey(Boolean(data.hasGeminiKey));
        setHasGeoapifyKey(Boolean(data.hasGeoapifyKey));
      })
      .catch(() => {
        // Fallback assuming server is active
      });
  }, []);

  // Main Lead Scraping & Processing Pipeline
  const handleSearch = async (params: SearchParams) => {
    setIsProcessing(true);
    setProgress({
      stage: 'scraping',
      message: `Scraping ${params.nicheId} leads in ${params.cityName}, ${params.stateName}...`,
      completedLeads: 0,
      totalLeads: params.limit,
      percentage: 10,
    });

    try {
      // Step 1: Scrape leads via Geoapify or realistic local generator
      const searchRes = await fetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!searchRes.ok) {
        throw new Error('Failed to search leads');
      }

      const searchData = await searchRes.json();
      const rawLeads: Lead[] = searchData.leads || [];

      if (rawLeads.length === 0) {
        setProgress({
          stage: 'error',
          message: 'No businesses with valid websites found. Try another city or niche.',
          completedLeads: 0,
          totalLeads: 0,
          percentage: 0,
        });
        setIsProcessing(false);
        return;
      }

      // Populate initial scraped leads in state
      setLeads(rawLeads);

      const total = rawLeads.length;
      const updatedLeadsList: Lead[] = [...rawLeads];

      // Sequential Lead Processing: Extract Email -> Capture Screenshot -> Audit -> Draft
      for (let i = 0; i < total; i++) {
        const lead = updatedLeadsList[i];
        const stepProgressBase = ((i) / total) * 90 + 10;

        // Stage 2: Extracting Contact Emails
        setProgress({
          stage: 'extracting_emails',
          message: `Extracting contact email for ${lead.name}...`,
          completedLeads: i,
          totalLeads: total,
          percentage: stepProgressBase + 5,
          currentLeadName: lead.name,
        });

        try {
          const emailRes = await fetch('/api/leads/extract-emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ website: lead.website, leadName: lead.name }),
          });

          if (emailRes.ok) {
            const emailData = await emailRes.json();
            lead.foundEmail = emailData.foundEmail || '';
            lead.manualEmail = emailData.foundEmail || '';
            lead.allFoundEmails = emailData.allFoundEmails || [];
            lead.emailConfidence = emailData.emailConfidence || 'medium';
            lead.emailSource = emailData.emailSource || '';
          }
        } catch (e) {
          console.warn(`Email extraction failed for ${lead.name}`, e);
        }

        // Stage 3: Capturing Screenshots (Handled via Microlink URL on lead)
        setProgress({
          stage: 'capturing_screenshots',
          message: `Capturing Microlink website screenshot for ${lead.name}...`,
          completedLeads: i,
          totalLeads: total,
          percentage: stepProgressBase + 12,
          currentLeadName: lead.name,
        });

        // Stage 4 & 5: Gemini AI Website Audit & Cold Email Copywriting
        setProgress({
          stage: 'auditing',
          message: `Gemini AI Auditing CRO & drafting email for ${lead.name}...`,
          completedLeads: i,
          totalLeads: total,
          percentage: stepProgressBase + 20,
          currentLeadName: lead.name,
        });

        try {
          const auditRes = await fetch('/api/leads/audit-and-draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lead }),
          });

          if (auditRes.ok) {
            const auditData = await auditRes.json();
            lead.auditResult = auditData.auditResult;
            lead.emailDraft = auditData.emailDraft;
            lead.auditScore = auditData.auditScore;
            lead.status = 'ready';
          }
        } catch (auditErr) {
          console.warn(`Audit failed for ${lead.name}`, auditErr);
          lead.status = 'ready';
        }

        // Update single lead in state reactively for instant feedback
        updatedLeadsList[i] = { ...lead };
        setLeads([...updatedLeadsList]);
      }

      // Pipeline Complete
      setProgress({
        stage: 'completed',
        message: `Successfully processed and audited ${total} leads!`,
        completedLeads: total,
        totalLeads: total,
        percentage: 100,
      });

      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);

    } catch (err: any) {
      console.error('Error running lead pipeline:', err);
      setProgress({
        stage: 'error',
        message: err.message || 'Pipeline execution failed.',
        completedLeads: 0,
        totalLeads: 0,
        percentage: 0,
      });
      setIsProcessing(false);
    }
  };

  // Lead updates
  const handleUpdateEmail = (leadId: string, email: string) => {
    setLeads(prev =>
      prev.map(l => {
        if (l.id === leadId) {
          const updatedDraft = l.emailDraft ? { ...l.emailDraft, recipientEmail: email } : undefined;
          return { ...l, manualEmail: email, emailDraft: updatedDraft };
        }
        return l;
      })
    );
  };

  const handleRegenerateDraft = async (leadId: string, tone: string) => {
    const targetLead = leads.find(l => l.id === leadId);
    if (!targetLead) return;

    try {
      const res = await fetch('/api/leads/audit-and-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: targetLead, customTone: tone }),
      });

      if (res.ok) {
        const data = await res.json();
        setLeads(prev =>
          prev.map(l =>
            l.id === leadId
              ? { ...l, auditResult: data.auditResult, emailDraft: data.emailDraft, auditScore: data.auditScore }
              : l
          )
        );
      }
    } catch (e) {
      console.error('Error regenerating draft:', e);
    }
  };

  const handleMarkContacted = (leadId: string) => {
    setLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, status: 'ready' } : l))
    );
  };

  const handleCopyAllEmails = () => {
    const emailList = leads
      .map(l => l.manualEmail || l.foundEmail)
      .filter(Boolean)
      .join('\n');

    if (emailList) {
      navigator.clipboard.writeText(emailList);
      setCopiedAllEmails(true);
      setTimeout(() => setCopiedAllEmails(false), 2000);
    }
  };

  // Run Sample Batch trigger
  const handleRunSampleBatch = () => {
    handleSearch({
      nicheId: 'dentist',
      cityName: 'Austin',
      stateName: 'Texas',
      limit: 5,
      requireWebsiteOnly: true,
    });
  };

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    // Search Query
    const matchQuery =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.city.toLowerCase().includes(searchQuery.toLowerCase());

    // Score filter
    const score = l.auditScore ?? l.auditResult?.score ?? 60;
    let matchScore = true;
    if (scoreFilter === 'high') matchScore = score > 75;
    if (scoreFilter === 'med') matchScore = score >= 50 && score <= 75;
    if (scoreFilter === 'low') matchScore = score < 50;

    // Email filter
    const hasEmail = Boolean(l.manualEmail || l.foundEmail);
    let matchEmail = true;
    if (emailFilter === 'has_email') matchEmail = hasEmail;
    if (emailFilter === 'no_email') matchEmail = !hasEmail;

    return matchQuery && matchScore && matchEmail;
  });

  const auditedCount = leads.filter(l => l.auditResult).length;
  const emailsExtractedCount = leads.filter(l => l.manualEmail || l.foundEmail).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Header */}
      <Header
        hasGeminiKey={hasGeminiKey}
        hasGeoapifyKey={hasGeoapifyKey}
        totalLeads={leads.length}
        auditedCount={auditedCount}
        emailsExtractedCount={emailsExtractedCount}
        onReset={() => setLeads([])}
        onRunDemo={handleRunSampleBatch}
        isProcessing={isProcessing}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6 flex-1">
        {/* Lead Targeting Search Panel */}
        <SearchForm onSearch={handleSearch} isProcessing={isProcessing} />

        {/* Pipeline Progress Indicator */}
        <ProgressBar progress={progress} />

        {/* Results Feed Area */}
        {leads.length > 0 ? (
          <div className="space-y-4">
            {/* Filter & Export Bar */}
            <LeadFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              scoreFilter={scoreFilter}
              onScoreFilterChange={setScoreFilter}
              emailFilter={emailFilter}
              onEmailFilterChange={setEmailFilter}
              onOpenExport={() => setShowExportModal(true)}
              onCopyAllEmails={handleCopyAllEmails}
              copiedAllEmails={copiedAllEmails}
              totalCount={leads.length}
              filteredCount={filteredLeads.length}
            />

            {/* Lead Cards Staggered Feed */}
            <div className="space-y-4">
              {filteredLeads.map((lead, idx) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onUpdateEmail={handleUpdateEmail}
                  onRegenerateDraft={handleRegenerateDraft}
                  onMarkContacted={handleMarkContacted}
                  index={idx}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State Landing Showcase */
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center max-w-3xl mx-auto my-8 space-y-6 relative overflow-hidden">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/25 text-white">
              <Rocket className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Ready to Scrape & Audit Local Business Prospects
              </h3>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                ProspectPilot targets US local businesses, extracts contact emails, captures website screenshots, and generates zero-flattery cold emails following the <span className="text-indigo-300 font-semibold">Observation → Insight → Gap</span> framework.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
                <Building2 className="w-5 h-5 text-indigo-400 mx-auto" />
                <span className="font-semibold text-white block">100+ US Cities</span>
                <span className="text-slate-400">Geoapify search with state auto-mapping</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
                <Mail className="w-5 h-5 text-emerald-400 mx-auto" />
                <span className="font-semibold text-white block">Contact Extractor</span>
                <span className="text-slate-400">Prioritizes personal vs generic emails</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
                <ShieldAlert className="w-5 h-5 text-violet-400 mx-auto" />
                <span className="font-semibold text-white block">Gemini CRO Audit</span>
                <span className="text-slate-400">Zero-flattery video pitch copywriting</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleRunSampleBatch}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Run Sample Campaign (Dentists in Austin, TX)</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          leads={filteredLeads}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>ProspectPilot Cold Outreach Engine • Powered by Gemini 3.6 & Geoapify</p>
      </footer>
    </div>
  );
}
