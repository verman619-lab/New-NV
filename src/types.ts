export interface USCity {
  name: string;
  state: string;
  stateCode: string;
}

export interface NicheCategory {
  id: string;
  label: string;
  geoapifyCategory: string;
  iconName: string;
  description: string;
  commonProblems: string[];
}

export interface AuditFinding {
  title: string;
  observation: string;
  insight: string;
  gap: string;
  severity: 'high' | 'medium' | 'low';
}

export interface AuditResult {
  score: number; // 0 - 100
  summary: string;
  visualFriction: string;
  conversionBlocker: string;
  findings: AuditFinding[];
  recommendedVideoHook: string;
  auditedAt: string;
}

export interface EmailDraft {
  subject: string;
  body: string;
  recipientEmail: string;
  senderSignature: string;
  generatedAt: string;
  angleUsed?: string;
}

export interface Lead {
  id: string;
  name: string;
  nicheId: string;
  nicheLabel: string;
  website: string;
  screenshotUrl: string;
  city: string;
  state: string;
  fullAddress?: string;
  phone?: string;
  
  // Email Extraction
  foundEmail?: string;
  emailSource?: string;
  allFoundEmails?: string[];
  emailConfidence?: 'high' | 'medium' | 'low' | 'none';
  manualEmail?: string; // Editable recipient email

  // AI Output
  auditScore?: number;
  auditResult?: AuditResult;
  emailDraft?: EmailDraft;

  // Pipeline Status
  status: 'scraped' | 'extracting' | 'auditing' | 'ready' | 'error';
  errorMessage?: string;
  createdAt: string;
}

export type PipelineStage = 
  | 'idle' 
  | 'scraping' 
  | 'extracting_emails' 
  | 'capturing_screenshots' 
  | 'auditing' 
  | 'drafting' 
  | 'completed'
  | 'error';

export interface PipelineProgress {
  stage: PipelineStage;
  message: string;
  completedLeads: number;
  totalLeads: number;
  percentage: number;
  currentLeadName?: string;
}

export interface SearchParams {
  nicheId: string;
  cityName: string;
  stateName: string;
  limit: number;
  requireWebsiteOnly: boolean;
}
