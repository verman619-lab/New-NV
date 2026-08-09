import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, MapPin, ExternalLink, Mail, Check, Copy, RefreshCw, 
  ShieldAlert, Sparkles, Send, Phone, AlertCircle, Eye, FileText, CheckCircle
} from 'lucide-react';
import { Lead } from '../types';

interface LeadCardProps {
  lead: Lead;
  onUpdateEmail: (leadId: string, email: string) => void;
  onRegenerateDraft: (leadId: string, tone: string) => void;
  onMarkContacted: (leadId: string) => void;
  index: number;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onUpdateEmail,
  onRegenerateDraft,
  onMarkContacted,
  index,
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'email'>('audit');
  const [editableEmail, setEditableEmail] = useState<string>(
    lead.manualEmail || lead.foundEmail || ''
  );
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [selectedTone, setSelectedTone] = useState('Direct & Helpful');

  const getMicrolinkUrl = (url: string) => {
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
    const encoded = encodeURIComponent(cleanUrl);
    return `https://api.microlink.io/?url=${encoded}&screenshot=true&embed=screenshot.url&screenshot.waitForTimeout=10000&screenshot.type=png`;
  };

  const [imgSrc, setImgSrc] = useState<string>(
    lead.screenshotUrl || getMicrolinkUrl(lead.website)
  );
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgSrc(lead.screenshotUrl || getMicrolinkUrl(lead.website));
    setImgFailed(false);
  }, [lead.screenshotUrl, lead.website]);

  const handleImgError = () => {
    if (imgSrc.includes('api.microlink.io')) {
      // Fallback 1: Direct Microlink screenshot endpoint with 10s wait delay
      setImgSrc(`https://screenshot.microlink.io/?url=${encodeURIComponent(lead.website)}&waitForTimeout=10000`);
    } else if (imgSrc.includes('microlink')) {
      // Fallback 2: WordPress mshots
      setImgSrc(`https://s.wordpress.com/mshots/v1/${encodeURIComponent(lead.website)}?w=800&h=500`);
    } else if (imgSrc.includes('wordpress.com')) {
      // Fallback 3: 11ty screenshot
      setImgSrc(`https://v1.screenshot.11ty.dev/${encodeURIComponent(lead.website)}/opengraph`);
    } else {
      // Final Fallback: Styled Browser Mockup Frame
      setImgFailed(true);
    }
  };

  // Email Persistence rule: If foundEmail exists but manualEmail/editableEmail is empty, sync it automatically
  useEffect(() => {
    if (lead.manualEmail) {
      setEditableEmail(lead.manualEmail);
    } else if (lead.foundEmail && !editableEmail) {
      setEditableEmail(lead.foundEmail);
      onUpdateEmail(lead.id, lead.foundEmail);
    }
  }, [lead.foundEmail, lead.manualEmail]);

  const handleEmailChange = (val: string) => {
    setEditableEmail(val);
    onUpdateEmail(lead.id, val);
  };

  const getMailtoUrl = () => {
    const recipient = editableEmail || lead.foundEmail || lead.manualEmail || '';
    const subject = lead.emailDraft?.subject || `Quick question regarding ${lead.name}`;
    const body = lead.emailDraft?.body || '';
    return `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getGmailUrl = () => {
    const recipient = editableEmail || lead.foundEmail || lead.manualEmail || '';
    const subject = lead.emailDraft?.subject || `Quick question regarding ${lead.name}`;
    const body = lead.emailDraft?.body || '';
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getOutlookUrl = () => {
    const recipient = editableEmail || lead.foundEmail || lead.manualEmail || '';
    const subject = lead.emailDraft?.subject || `Quick question regarding ${lead.name}`;
    const body = lead.emailDraft?.body || '';
    return `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(recipient)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSendEmail = (type: 'mailto' | 'gmail' | 'outlook') => {
    const recipient = editableEmail || lead.foundEmail || lead.manualEmail;
    if (!recipient) {
      alert('Please enter or select a recipient email address first.');
      return;
    }
    let targetUrl = getMailtoUrl();
    if (type === 'gmail') targetUrl = getGmailUrl();
    if (type === 'outlook') targetUrl = getOutlookUrl();

    window.open(targetUrl, '_blank');
    onMarkContacted(lead.id);
  };

  const handleCopy = (text: string, type: 'email' | 'subject' | 'body') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else if (type === 'subject') {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    } else if (type === 'body') {
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    }
  };

  // Score styling dynamic colors (Green > 75, Yellow 50-75, Red < 50)
  const score = lead.auditScore ?? lead.auditResult?.score ?? 60;
  const getScoreBadge = (s: number) => {
    if (s > 75) {
      return {
        bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
        dot: 'bg-emerald-500',
        label: 'High Score'
      };
    } else if (s >= 50) {
      return {
        bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
        dot: 'bg-amber-400',
        label: 'Moderate Gaps'
      };
    } else {
      return {
        bg: 'bg-rose-500/15 border-rose-500/40 text-rose-400',
        dot: 'bg-rose-500',
        label: 'Major Conversion Friction'
      };
    }
  };

  const scoreBadge = getScoreBadge(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl shadow-slate-950/40 hover:border-indigo-500/50 transition-all flex flex-col md:flex-row"
    >
      {/* Left Column: Business Info & Screenshot Preview */}
      <div className="md:w-5/12 p-5 border-b md:border-b-0 md:border-r border-slate-700/60 bg-slate-900/40 flex flex-col justify-between gap-4">
        <div>
          {/* Header & Badges */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {lead.nicheLabel}
            </span>
            <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${scoreBadge.bg}`}>
              <span className={`w-2 h-2 rounded-full ${scoreBadge.dot}`} />
              <span>Audit Score: {score}/100</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
            {lead.name}
          </h3>

          <div className="space-y-1 mt-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{lead.fullAddress || `${lead.city}, ${lead.state}`}</span>
            </div>
            {lead.phone && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{lead.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 pt-1">
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-300 hover:text-indigo-200 hover:underline underline-offset-2 truncate"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {lead.website.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </div>
          </div>
        </div>

        {/* Website Screenshot Preview */}
        <div className="relative group rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 aspect-video flex items-center justify-center">
          {!imgFailed ? (
            <img
              src={imgSrc}
              alt={`Website screenshot of ${lead.name}`}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              onError={handleImgError}
            />
          ) : (
            /* Styled Interactive Browser Mockup Frame Fallback */
            <div className="w-full h-full bg-slate-900 border border-slate-800 p-3 flex flex-col justify-between text-left relative">
              {/* Browser Header Bar */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                </div>
                <div className="flex-1 bg-slate-950 px-2 py-0.5 rounded text-[10px] text-slate-400 font-mono truncate flex items-center gap-1 border border-slate-800">
                  <span className="text-emerald-400">🔒</span>
                  <span className="truncate">{lead.website}</span>
                </div>
              </div>

              {/* Simulated Hero Viewport */}
              <div className="flex-1 py-2 space-y-1.5 flex flex-col justify-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">{lead.nicheLabel}</span>
                <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{lead.name}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1">{lead.fullAddress || lead.city}</p>
                <div className="pt-1 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-indigo-600 text-[9px] font-semibold text-white rounded">Book Appointment</span>
                  <span className="px-2 py-0.5 bg-slate-800 text-[9px] text-slate-300 rounded border border-slate-700">Services</span>
                </div>
              </div>

              {/* CRO Hotspot Tag */}
              <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-amber-400 font-mono">
                <span>⚠️ CRO Audit Hotspot</span>
                <span className="text-slate-400">Score: {score}/100</span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <button
              onClick={() => setShowScreenshotModal(true)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-900/90 hover:bg-slate-950 text-white rounded-lg border border-slate-700 flex items-center gap-1.5 backdrop-blur-sm shadow-lg"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" /> View Full Screenshot
            </button>
          </div>
        </div>

        {/* Email Extraction Section */}
        <div className="p-3 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" /> Contact Email
            </span>
            {editableEmail ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Found
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3 text-amber-400" /> Email Needed
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="email"
              value={editableEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Enter or confirm recipient email..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {editableEmail && (
              <button
                onClick={() => handleCopy(editableEmail, 'email')}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg transition-colors shrink-0"
                title="Copy Email"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* Direct Send Email Action Buttons in Left Column */}
          {editableEmail && (
            <div className="pt-1 flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleSendEmail('mailto')}
                className="flex-1 py-1.5 px-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold rounded-lg shadow transition-all flex items-center justify-center gap-1.5"
                title="Send via default mail application (Apple Mail, Outlook, etc.)"
              >
                <Send className="w-3.5 h-3.5" /> Send Email
              </button>
              <button
                onClick={() => handleSendEmail('gmail')}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1"
                title="Compose directly in Gmail web"
              >
                <span>Gmail</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={() => handleSendEmail('outlook')}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1"
                title="Compose directly in Outlook web"
              >
                <span>Outlook</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          )}

          {lead.allFoundEmails && lead.allFoundEmails.length > 1 && (
            <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/80">
              <span>Other candidates:</span>
              {lead.allFoundEmails.slice(1, 3).map((e, idx) => (
                <button
                  key={idx}
                  onClick={() => handleEmailChange(e)}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-indigo-300 border border-slate-700 transition-colors"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Audit Findings & Cold Email Draft Tabs */}
      <div className="md:w-7/12 p-5 flex flex-col justify-between">
        <div>
          {/* Tab Bar */}
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('audit')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'audit'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Audit Detail
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'email'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Cold Email Draft
              </button>
            </div>

            <div className="flex items-center gap-2">
              {lead.status === 'contacted' ? (
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Email Sent
                </span>
              ) : (
                <button
                  onClick={() => handleSendEmail('mailto')}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5"
                  title="Send cold outreach email"
                >
                  <Send className="w-3.5 h-3.5" /> Send Email
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: AUDIT DETAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              {lead.auditResult ? (
                <>
                  <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl space-y-1">
                    <span className="text-[11px] uppercase font-bold text-indigo-400 tracking-wider">
                      Audit Overview
                    </span>
                    <p className="text-xs text-slate-200 font-medium">
                      {lead.auditResult.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-[11px] font-semibold text-rose-400 block">Visual Friction Point</span>
                      <p className="text-xs text-slate-300">{lead.auditResult.visualFriction}</p>
                    </div>
                    <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-[11px] font-semibold text-amber-400 block">Conversion Blocker</span>
                      <p className="text-xs text-slate-300">{lead.auditResult.conversionBlocker}</p>
                    </div>
                  </div>

                  {lead.auditResult.findings && lead.auditResult.findings.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-semibold text-slate-300 block">Specific Gaps Identified:</span>
                      {lead.auditResult.findings.map((f, fIdx) => (
                        <div key={fIdx} className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-white">{f.title}</span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              f.severity === 'high' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}>
                              {f.severity} severity
                            </span>
                          </div>
                          <p className="text-xs text-slate-300">{f.observation}</p>
                          <div className="text-[11px] text-indigo-300 bg-indigo-950/40 p-2 rounded-lg border border-indigo-900/50 mt-1">
                            <strong>Actionable Fix:</strong> {f.gap}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-2.5 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-xs text-indigo-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span><strong>Loom Pitch Hook:</strong> {lead.auditResult.recommendedVideoHook}</span>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                  <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Running Gemini AI Website Audit...</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COLD EMAIL DRAFT */}
          {activeTab === 'email' && (
            <div className="space-y-3">
              {lead.emailDraft ? (
                <>
                  {/* Subject Line Box */}
                  <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                        Subject Line (2-4 Words Lowercase)
                      </span>
                      <button
                        onClick={() => handleCopy(lead.emailDraft!.subject, 'subject')}
                        className="px-2 py-0.5 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors flex items-center gap-1"
                      >
                        {copiedSubject ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSubject ? 'Copied' : 'Copy Subject'}</span>
                      </button>
                    </div>
                    <div className="text-sm font-mono text-emerald-300 font-semibold bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                      {lead.emailDraft.subject}
                    </div>
                  </div>

                  {/* Body Box */}
                  <div className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Email Body (Observation → Insight → Gap)
                      </span>
                      <button
                        onClick={() => handleCopy(lead.emailDraft!.body, 'body')}
                        className="px-2.5 py-1 text-xs text-white bg-indigo-600 hover:bg-indigo-500 font-medium rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                      >
                        {copiedBody ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedBody ? 'Copied Body' : 'Copy Full Body'}</span>
                      </button>
                    </div>

                    <div className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      {lead.emailDraft.body}
                    </div>
                  </div>

                  {/* Send Email Outreach Dispatch Options */}
                  <div className="p-3 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
                      <span className="flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-indigo-400" /> Dispatch Cold Outreach
                      </span>
                      {lead.status === 'contacted' ? (
                        <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Marked as Sent
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          Recipient: <span className="text-white font-mono">{editableEmail || 'Not set'}</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => handleSendEmail('mailto')}
                        className="py-2 px-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" /> Mail App (Default)
                      </button>

                      <button
                        onClick={() => handleSendEmail('gmail')}
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-medium text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5 text-rose-400" /> Send via Gmail
                      </button>

                      <button
                        onClick={() => handleSendEmail('outlook')}
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-medium text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5 text-blue-400" /> Send via Outlook
                      </button>
                    </div>
                  </div>

                  {/* Tone / Angle Regenerate options */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span>Angle:</span>
                      <select
                        value={selectedTone}
                        onChange={(e) => setSelectedTone(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs"
                      >
                        <option value="Direct & Helpful">Direct & Helpful</option>
                        <option value="CRO Audit Focus">CRO Audit Focus</option>
                        <option value="Mobile UX Friction">Mobile UX Friction</option>
                      </select>
                      <button
                        onClick={() => onRegenerateDraft(lead.id, selectedTone)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-300 rounded transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Regenerate
                      </button>
                    </div>

                    <button
                      onClick={() => onMarkContacted(lead.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                        lead.status === 'contacted'
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>{lead.status === 'contacted' ? 'Marked Sent' : 'Mark as Sent'}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                  <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Drafting Observation → Insight → Gap Email...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Screenshot Full View Modal */}
      {showScreenshotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-4 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" /> Screenshot Audit Target: {lead.name}
              </h4>
              <button
                onClick={() => setShowScreenshotModal(false)}
                className="px-3 py-1 text-xs bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700"
              >
                Close
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-2">
              {!imgFailed ? (
                <img
                  src={imgSrc}
                  alt={`Screenshot preview of ${lead.name}`}
                  className="w-full h-auto rounded-lg"
                  onError={handleImgError}
                />
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-indigo-400 font-mono text-xs bg-slate-950 py-2 px-4 rounded-lg border border-slate-800 max-w-lg mx-auto">
                    <span>🔒 {lead.website}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">{lead.name}</h3>
                    <p className="text-xs text-slate-400">{lead.fullAddress || lead.city}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2">
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      ⚠️ Conversion Rate Audit Target Area
                    </span>
                    <p className="text-slate-300">
                      Mobile hero call button requires scrolling past main header banners.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
