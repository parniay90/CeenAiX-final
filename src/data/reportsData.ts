export type ReportCategory = 'claims' | 'financial' | 'preauth' | 'fraud' | 'members' | 'provider' | 'dha';
export type ReportFormat = 'PDF' | 'Excel' | 'CSV' | 'DHA XML' | 'ZIP';
export type ReportStatus = 'completed' | 'generating' | 'scheduled' | 'failed' | 'archived';
export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export interface ReportCatalogItem {
  id: string;
  category: ReportCategory;
  title: string;
  description: string;
  formats: ReportFormat[];
  isScheduled: boolean;
  scheduleDesc?: string;
  lastGenerated?: string;
  lastGeneratedDisplay?: string;
  isDhaRequired: boolean;
  isConfidential: boolean;
  insight?: { text: string; type: 'warning' | 'success' | 'info' };
  dueDate?: string;
  dueDaysRemaining?: number;
}

export interface ReportHistoryItem {
  id: string;
  name: string;
  category: ReportCategory;
  format: ReportFormat;
  size: string;
  generatedAt: string;
  generatedAtDisplay: string;
  generatedBy: string;
  status: ReportStatus;
  downloads?: number;
  dhaSubmissionId?: string;
  isConfidential?: boolean;
  progressPct?: number;
  errorMessage?: string;
}

export interface ScheduledReport {
  id: string;
  name: string;
  category: ReportCategory;
  frequency: ScheduleFrequency;
  nextRun: string;
  nextRunDisplay: string;
  recipients: string[];
  format: ReportFormat;
  isActive: boolean;
  lastRun?: string;
  lastRunDisplay?: string;
}

export interface DhaCalendarItem {
  id: string;
  title: string;
  dueDate: string;
  dueDateDisplay: string;
  daysRemaining: number;
  status: 'overdue' | 'urgent' | 'upcoming' | 'submitted';
  reportType: string;
  period: string;
  submissionId?: string;
}

export const categoryMeta: Record<ReportCategory, { label: string; color: string; bg: string; border: string; icon: string }> = {
  claims:    { label: 'Claims',          color: '#1E3A5F', bg: '#EFF6FF', border: '#BFDBFE', icon: 'FileText' },
  financial: { label: 'Financial',       color: '#065F46', bg: '#ECFDF5', border: '#A7F3D0', icon: 'DollarSign' },
  preauth:   { label: 'Pre-Auth',        color: '#92400E', bg: '#FFFBEB', border: '#FDE68A', icon: 'Shield' },
  fraud:     { label: 'Fraud & SIU',     color: '#7F1D1D', bg: '#FEF2F2', border: '#FECACA', icon: 'AlertTriangle' },
  members:   { label: 'Members',         color: '#1E40AF', bg: '#EFF6FF', border: '#BFDBFE', icon: 'Users' },
  provider:  { label: 'Provider',        color: '#4C1D95', bg: '#F5F3FF', border: '#DDD6FE', icon: 'Stethoscope' },
  dha:       { label: 'DHA Compliance',  color: '#065F46', bg: '#ECFDF5', border: '#6EE7B7', icon: 'CheckSquare' },
};

export const reportCatalog: ReportCatalogItem[] = [
  // CLAIMS
  {
    id: 'CLM-001', category: 'claims',
    title: 'Monthly Claims Summary',
    description: 'Aggregate claims submitted, adjudicated, paid and denied by plan, specialty and provider for the selected period.',
    formats: ['PDF', 'Excel', 'CSV'],
    isScheduled: true, scheduleDesc: 'Auto-runs 1st of each month',
    lastGenerated: '2026-06-01T06:00:00', lastGeneratedDisplay: 'Jun 1, 2026 — 06:00',
    isDhaRequired: false, isConfidential: false,
    insight: { text: 'Denial rate up 1.2 pp vs. May — review CLM-003', type: 'warning' },
  },
  {
    id: 'CLM-002', category: 'claims',
    title: 'Claims Aging Report',
    description: 'Outstanding claims bucketed by 0–30, 31–60, 61–90 and 90+ days with payer liability and SLA breach flags.',
    formats: ['PDF', 'Excel'],
    isScheduled: false,
    lastGenerated: '2026-06-18T14:22:00', lastGeneratedDisplay: 'Jun 18, 2026 — 14:22',
    isDhaRequired: false, isConfidential: false,
    insight: { text: '23 claims have breached 90-day SLA threshold', type: 'warning' },
  },
  {
    id: 'CLM-003', category: 'claims',
    title: 'Denial Analysis Report',
    description: 'Denial reasons, appeal success rates, denial-by-provider breakdown and trend comparison vs prior 3 months.',
    formats: ['PDF', 'Excel', 'CSV'],
    isScheduled: true, scheduleDesc: 'Weekly every Monday',
    lastGenerated: '2026-06-16T06:00:00', lastGeneratedDisplay: 'Jun 16, 2026 — 06:00',
    isDhaRequired: false, isConfidential: false,
  },
  {
    id: 'CLM-004', category: 'claims',
    title: 'High-Value Claims Register',
    description: 'All claims above AED 50,000 with full clinical notes, authorization trail and adjudication rationale.',
    formats: ['PDF', 'Excel'],
    isScheduled: false,
    lastGenerated: '2026-06-20T10:05:00', lastGeneratedDisplay: 'Jun 20, 2026 — 10:05',
    isDhaRequired: false, isConfidential: true,
    insight: { text: '7 claims above AED 100K pending final review', type: 'info' },
  },

  // FINANCIAL
  {
    id: 'FIN-001', category: 'financial',
    title: 'Loss Ratio Statement',
    description: 'Premium revenue vs claims paid with MLR calculation, trend lines and plan-level breakdown for actuarial review.',
    formats: ['PDF', 'Excel'],
    isScheduled: true, scheduleDesc: 'Monthly — end of month',
    lastGenerated: '2026-05-31T18:00:00', lastGeneratedDisplay: 'May 31, 2026 — 18:00',
    isDhaRequired: false, isConfidential: true,
    insight: { text: 'Overall MLR at 21.4% — well within 65% target', type: 'success' },
  },
  {
    id: 'FIN-002', category: 'financial',
    title: 'Budget vs Actual Variance',
    description: 'Month-to-date and year-to-date expenditure vs approved budget by cost centre, specialty and geography.',
    formats: ['PDF', 'Excel', 'CSV'],
    isScheduled: true, scheduleDesc: 'Monthly — 5th of each month',
    lastGenerated: '2026-06-05T07:00:00', lastGeneratedDisplay: 'Jun 5, 2026 — 07:00',
    isDhaRequired: false, isConfidential: true,
  },
  {
    id: 'FIN-003', category: 'financial',
    title: 'Actuarial Reserve Report',
    description: 'IBNR estimates, reserve adequacy analysis and projected ultimate losses by accident year and plan.',
    formats: ['PDF'],
    isScheduled: false,
    lastGenerated: '2026-06-01T09:30:00', lastGeneratedDisplay: 'Jun 1, 2026 — 09:30',
    isDhaRequired: false, isConfidential: true,
  },
  {
    id: 'FIN-004', category: 'financial',
    title: 'Cash Flow Projection',
    description: '13-week rolling cash flow forecast with claim payment run schedule, premium collection and investment income.',
    formats: ['Excel', 'PDF'],
    isScheduled: true, scheduleDesc: 'Weekly every Friday',
    lastGenerated: '2026-06-20T07:00:00', lastGeneratedDisplay: 'Jun 20, 2026 — 07:00',
    isDhaRequired: false, isConfidential: true,
  },

  // PRE-AUTH
  {
    id: 'PA-001', category: 'preauth',
    title: 'Pre-Auth Volume & TAT Report',
    description: 'Authorization requests by type, approval/denial rates and turnaround time vs 4-hour DHA SLA requirement.',
    formats: ['PDF', 'Excel', 'CSV'],
    isScheduled: true, scheduleDesc: 'Daily at 07:00',
    lastGenerated: '2026-06-23T07:00:00', lastGeneratedDisplay: 'Jun 23, 2026 — 07:00',
    isDhaRequired: false, isConfidential: false,
    insight: { text: 'TAT SLA compliance at 98.2% — above 95% target', type: 'success' },
  },
  {
    id: 'PA-002', category: 'preauth',
    title: 'Pending Authorizations Log',
    description: 'All open pre-auth requests with age, clinical urgency flag, assigned reviewer and escalation status.',
    formats: ['PDF', 'Excel'],
    isScheduled: false,
    lastGenerated: '2026-06-23T08:15:00', lastGeneratedDisplay: 'Jun 23, 2026 — 08:15',
    isDhaRequired: false, isConfidential: false,
    insight: { text: '3 requests approaching 4-hour DHA deadline', type: 'warning' },
  },
  {
    id: 'PA-003', category: 'preauth',
    title: 'Auth Denial & Appeal Report',
    description: 'Denied authorizations with clinical rationale, appeal outcomes and physician peer review decisions.',
    formats: ['PDF', 'Excel'],
    isScheduled: false,
    lastGenerated: '2026-06-17T15:00:00', lastGeneratedDisplay: 'Jun 17, 2026 — 15:00',
    isDhaRequired: false, isConfidential: true,
  },

  // FRAUD
  {
    id: 'FRD-001', category: 'fraud',
    title: 'SIU Investigation Register',
    description: 'Active and closed special investigations with case status, provider actions, recovery amounts and referral outcomes.',
    formats: ['PDF', 'Excel'],
    isScheduled: false,
    lastGenerated: '2026-06-19T11:00:00', lastGeneratedDisplay: 'Jun 19, 2026 — 11:00',
    isDhaRequired: false, isConfidential: true,
    insight: { text: 'AED 284,500 recovered YTD from 3 closed cases', type: 'success' },
  },
  {
    id: 'FRD-002', category: 'fraud',
    title: 'Anomaly Detection Alerts',
    description: 'ML-flagged billing anomalies by provider: upcoding patterns, duplicate submissions, unbundling and phantom billing.',
    formats: ['PDF', 'Excel', 'CSV'],
    isScheduled: true, scheduleDesc: 'Weekly every Monday',
    lastGenerated: '2026-06-16T06:00:00', lastGeneratedDisplay: 'Jun 16, 2026 — 06:00',
    isDhaRequired: false, isConfidential: true,
    insight: { text: '2 providers escalated to HIGH fraud risk this week', type: 'warning' },
  },
  {
    id: 'FRD-003', category: 'fraud',
    title: 'Provider Risk Scorecard',
    description: 'Composite fraud risk scores for all active network providers with trend, peer benchmarks and recommended actions.',
    formats: ['PDF', 'Excel'],
    isScheduled: true, scheduleDesc: 'Monthly — 1st of month',
    lastGenerated: '2026-06-01T06:00:00', lastGeneratedDisplay: 'Jun 1, 2026 — 06:00',
    isDhaRequired: false, isConfidential: true,
  },

  // MEMBERS
  {
    id: 'MBR-001', category: 'members',
    title: 'Member Eligibility Register',
    description: 'Full census of active, lapsed and pending members with eligibility dates, plan enrollment and dependent status.',
    formats: ['Excel', 'CSV'],
    isScheduled: true, scheduleDesc: 'Daily at 02:00',
    lastGenerated: '2026-06-23T02:00:00', lastGeneratedDisplay: 'Jun 23, 2026 — 02:00',
    isDhaRequired: false, isConfidential: true,
  },
  {
    id: 'MBR-002', category: 'members',
    title: 'Risk Stratification Report',
    description: 'Member population segmented by risk tier (Critical/High/Moderate/Low) with spend concentration and care gap analysis.',
    formats: ['PDF', 'Excel'],
    isScheduled: true, scheduleDesc: 'Monthly — 1st of month',
    lastGenerated: '2026-06-01T07:00:00', lastGeneratedDisplay: 'Jun 1, 2026 — 07:00',
    isDhaRequired: false, isConfidential: true,
    insight: { text: '847 Critical-tier members driving 42% of total spend', type: 'warning' },
  },
  {
    id: 'MBR-003', category: 'members',
    title: 'Chronic Disease Management Report',
    description: 'Enrolled members in CDM programs (diabetes, hypertension, cardiac) with compliance rates and cost trajectories.',
    formats: ['PDF', 'Excel'],
    isScheduled: true, scheduleDesc: 'Quarterly',
    lastGenerated: '2026-04-01T08:00:00', lastGeneratedDisplay: 'Apr 1, 2026 — 08:00',
    isDhaRequired: false, isConfidential: true,
  },

  // PROVIDER
  {
    id: 'PRV-001', category: 'provider',
    title: 'Network Provider Directory',
    description: 'Full directory of credentialed providers with DHA license status, tier, specialty, contact details and contract terms.',
    formats: ['PDF', 'Excel', 'CSV'],
    isScheduled: false,
    lastGenerated: '2026-06-22T09:00:00', lastGeneratedDisplay: 'Jun 22, 2026 — 09:00',
    isDhaRequired: false, isConfidential: false,
  },
  {
    id: 'PRV-002', category: 'provider',
    title: 'Provider Performance Scorecard',
    description: 'Quality scores, denial rates, claim volumes, patient ratings and benchmark comparisons for all network providers.',
    formats: ['PDF', 'Excel'],
    isScheduled: true, scheduleDesc: 'Monthly — 1st of month',
    lastGenerated: '2026-06-01T07:30:00', lastGeneratedDisplay: 'Jun 1, 2026 — 07:30',
    isDhaRequired: false, isConfidential: false,
    insight: { text: '94.1% of providers meeting quality benchmarks', type: 'success' },
  },
  {
    id: 'PRV-003', category: 'provider',
    title: 'Contract Expiry Watch List',
    description: 'Providers with contracts expiring within 30, 60 and 90 days with renewal status and negotiation priority flags.',
    formats: ['PDF', 'Excel'],
    isScheduled: true, scheduleDesc: 'Weekly every Monday',
    lastGenerated: '2026-06-16T06:00:00', lastGeneratedDisplay: 'Jun 16, 2026 — 06:00',
    isDhaRequired: false, isConfidential: false,
    insight: { text: '8 contracts expiring within 30 days', type: 'warning' },
  },

  // DHA COMPLIANCE
  {
    id: 'DHA-001', category: 'dha',
    title: 'Monthly Claims Submission (DHA-F001)',
    description: 'Mandatory monthly electronic claims submission to DHA Health Financing System in HAAD XML format with reconciliation report.',
    formats: ['DHA XML', 'PDF'],
    isScheduled: true, scheduleDesc: 'Monthly — due by 15th',
    lastGenerated: '2026-06-14T23:55:00', lastGeneratedDisplay: 'Jun 14, 2026 — 23:55',
    isDhaRequired: true, isConfidential: false,
    dueDate: '2026-07-15', dueDaysRemaining: 22,
    insight: { text: 'June submission due Jul 15 — 22 days remaining', type: 'info' },
  },
  {
    id: 'DHA-002', category: 'dha',
    title: 'Quarterly Loss Ratio Return (DHA-F004)',
    description: 'Mandatory quarterly financial return including premium, claims, admin expenses and MLR calculation for DHA review.',
    formats: ['DHA XML', 'PDF', 'Excel'],
    isScheduled: true, scheduleDesc: 'Quarterly — due 30 days after quarter end',
    lastGenerated: '2026-04-28T17:00:00', lastGeneratedDisplay: 'Apr 28, 2026 — 17:00',
    isDhaRequired: true, isConfidential: false,
    dueDate: '2026-07-30', dueDaysRemaining: 37,
    insight: { text: 'Q2 2026 return due Jul 30 — prepare data now', type: 'info' },
  },
  {
    id: 'DHA-003', category: 'dha',
    title: 'Provider Network Adequacy (DHA-F007)',
    description: 'Semi-annual provider network adequacy report demonstrating compliance with DHA access standards by specialty and emirate.',
    formats: ['DHA XML', 'PDF'],
    isScheduled: true, scheduleDesc: 'Semi-annual — Jan 31 & Jul 31',
    lastGenerated: '2026-01-30T16:00:00', lastGeneratedDisplay: 'Jan 30, 2026 — 16:00',
    isDhaRequired: true, isConfidential: false,
    dueDate: '2026-07-31', dueDaysRemaining: 38,
    insight: { text: 'H2 2026 submission due Jul 31', type: 'warning' },
  },
  {
    id: 'DHA-004', category: 'dha',
    title: 'Annual Actuarial Certification (DHA-F012)',
    description: 'Annual actuarial opinion on reserve adequacy, pricing reasonableness and solvency margin for DHA regulatory filing.',
    formats: ['PDF'],
    isScheduled: false,
    lastGenerated: '2026-01-31T12:00:00', lastGeneratedDisplay: 'Jan 31, 2026 — 12:00',
    isDhaRequired: true, isConfidential: true,
    dueDate: '2027-01-31', dueDaysRemaining: 222,
  },
];

export const recentHistory: ReportHistoryItem[] = [
  {
    id: 'RPT-010', name: 'Pre-Auth Volume & TAT Report',
    category: 'preauth', format: 'PDF', size: '1.2 MB',
    generatedAt: '2026-06-23T07:00:00', generatedAtDisplay: 'Today, 07:00',
    generatedBy: 'System (Scheduled)', status: 'completed', downloads: 0,
  },
  {
    id: 'RPT-009', name: 'Anomaly Detection Alerts',
    category: 'fraud', format: 'Excel', size: '3.8 MB',
    generatedAt: '2026-06-22T14:30:00', generatedAtDisplay: 'Yesterday, 14:30',
    generatedBy: 'Fatima Al Zahra', status: 'generating', progressPct: 67,
  },
  {
    id: 'RPT-008', name: 'Provider Network Directory',
    category: 'provider', format: 'CSV', size: '892 KB',
    generatedAt: '2026-06-22T09:00:00', generatedAtDisplay: 'Yesterday, 09:00',
    generatedBy: 'Ahmed Al Rashidi', status: 'completed', downloads: 3,
  },
  {
    id: 'RPT-007', name: 'Monthly Claims Submission (DHA-F001)',
    category: 'dha', format: 'DHA XML', size: '18.4 MB',
    generatedAt: '2026-06-14T23:55:00', generatedAtDisplay: 'Jun 14, 23:55',
    generatedBy: 'System (Scheduled)', status: 'completed', downloads: 1,
    dhaSubmissionId: 'DHA-2026-06-DN-0041',
  },
  {
    id: 'RPT-006', name: 'Loss Ratio Statement',
    category: 'financial', format: 'PDF', size: '4.1 MB',
    generatedAt: '2026-06-10T11:00:00', generatedAtDisplay: 'Jun 10, 11:00',
    generatedBy: 'Mariam Al Hashemi', status: 'completed', downloads: 7,
    isConfidential: true,
  },
  {
    id: 'RPT-005', name: 'Risk Stratification Report',
    category: 'members', format: 'Excel', size: '6.3 MB',
    generatedAt: '2026-06-08T09:15:00', generatedAtDisplay: 'Jun 8, 09:15',
    generatedBy: 'Khalid Bin Salem', status: 'completed', downloads: 2,
    isConfidential: true,
  },
  {
    id: 'RPT-004', name: 'Denial Analysis Report',
    category: 'claims', format: 'PDF', size: '2.7 MB',
    generatedAt: '2026-06-05T14:00:00', generatedAtDisplay: 'Jun 5, 14:00',
    generatedBy: 'System (Scheduled)', status: 'completed', downloads: 4,
  },
  {
    id: 'RPT-003', name: 'Cash Flow Projection',
    category: 'financial', format: 'Excel', size: '1.9 MB',
    generatedAt: '2026-06-05T08:30:00', generatedAtDisplay: 'Jun 5, 08:30',
    generatedBy: 'System (Scheduled)', status: 'failed',
    errorMessage: 'Data source timeout — retry scheduled for Jun 6',
  },
  {
    id: 'RPT-002', name: 'SIU Investigation Register',
    category: 'fraud', format: 'PDF', size: '5.2 MB',
    generatedAt: '2026-06-03T16:45:00', generatedAtDisplay: 'Jun 3, 16:45',
    generatedBy: 'Fatima Al Zahra', status: 'completed', downloads: 1,
    isConfidential: true,
  },
  {
    id: 'RPT-001', name: 'Monthly Claims Summary',
    category: 'claims', format: 'Excel', size: '8.1 MB',
    generatedAt: '2026-06-01T06:00:00', generatedAtDisplay: 'Jun 1, 06:00',
    generatedBy: 'System (Scheduled)', status: 'completed', downloads: 12,
  },
];

export const scheduledReports: ScheduledReport[] = [
  {
    id: 'SCH-001', name: 'Monthly Claims Summary',
    category: 'claims', frequency: 'monthly',
    nextRun: '2026-07-01T06:00:00', nextRunDisplay: 'Jul 1, 2026 — 06:00',
    recipients: ['claims@daman.ae', 'coo@daman.ae'],
    format: 'Excel', isActive: true,
    lastRun: '2026-06-01T06:00:00', lastRunDisplay: 'Jun 1, 2026',
  },
  {
    id: 'SCH-002', name: 'Pre-Auth Volume & TAT',
    category: 'preauth', frequency: 'daily',
    nextRun: '2026-06-24T07:00:00', nextRunDisplay: 'Jun 24, 2026 — 07:00',
    recipients: ['preauth@daman.ae'],
    format: 'PDF', isActive: true,
    lastRun: '2026-06-23T07:00:00', lastRunDisplay: 'Jun 23, 2026',
  },
  {
    id: 'SCH-003', name: 'Cash Flow Projection',
    category: 'financial', frequency: 'weekly',
    nextRun: '2026-06-26T07:00:00', nextRunDisplay: 'Jun 26, 2026 — 07:00',
    recipients: ['cfo@daman.ae', 'finance@daman.ae'],
    format: 'Excel', isActive: true,
    lastRun: '2026-06-20T07:00:00', lastRunDisplay: 'Jun 20, 2026',
  },
  {
    id: 'SCH-004', name: 'Anomaly Detection Alerts',
    category: 'fraud', frequency: 'weekly',
    nextRun: '2026-06-29T06:00:00', nextRunDisplay: 'Jun 29 — 06:00',
    recipients: ['siu@daman.ae', 'compliance@daman.ae'],
    format: 'Excel', isActive: false,
    lastRun: '2026-06-16T06:00:00', lastRunDisplay: 'Jun 16, 2026',
  },
  {
    id: 'SCH-005', name: 'DHA Monthly Claims (DHA-F001)',
    category: 'dha', frequency: 'monthly',
    nextRun: '2026-07-14T23:00:00', nextRunDisplay: 'Jul 14, 2026 — 23:00',
    recipients: ['compliance@daman.ae', 'coo@daman.ae'],
    format: 'DHA XML', isActive: true,
    lastRun: '2026-06-14T23:55:00', lastRunDisplay: 'Jun 14, 2026',
  },
];

export const dhaCalendar: DhaCalendarItem[] = [
  {
    id: 'DHA-CAL-001', title: 'Monthly Claims Submission (DHA-F001)',
    dueDate: '2026-07-15', dueDateDisplay: 'Jul 15, 2026',
    daysRemaining: 22, status: 'upcoming',
    reportType: 'Claims', period: 'June 2026',
  },
  {
    id: 'DHA-CAL-002', title: 'Quarterly Loss Ratio Return (DHA-F004)',
    dueDate: '2026-07-30', dueDateDisplay: 'Jul 30, 2026',
    daysRemaining: 37, status: 'upcoming',
    reportType: 'Financial', period: 'Q2 2026',
  },
  {
    id: 'DHA-CAL-003', title: 'Provider Network Adequacy (DHA-F007)',
    dueDate: '2026-07-31', dueDateDisplay: 'Jul 31, 2026',
    daysRemaining: 38, status: 'upcoming',
    reportType: 'Network', period: 'H1 2026',
  },
  {
    id: 'DHA-CAL-004', title: 'Member Census Update (DHA-F002)',
    dueDate: '2026-06-30', dueDateDisplay: 'Jun 30, 2026',
    daysRemaining: 7, status: 'urgent',
    reportType: 'Members', period: 'June 2026',
  },
  {
    id: 'DHA-CAL-005', title: 'Anti-Fraud Quarterly Report (DHA-F010)',
    dueDate: '2026-06-15', dueDateDisplay: 'Jun 15, 2026',
    daysRemaining: -8, status: 'submitted',
    reportType: 'Fraud & SIU', period: 'Q1 2026',
    submissionId: 'DHA-2026-Q1-AF-0019',
  },
];

export const reportKpis = {
  totalGenerated: 847,
  generatedThisMonth: 43,
  scheduledActive: 12,
  dhaPending: 3,
  complianceRate: 97.8,
  avgGenerationSecs: 14,
};
