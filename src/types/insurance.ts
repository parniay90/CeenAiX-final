export type PreAuthStatus = 'pending' | 'approved' | 'denied' | 'escalated' | 'more-info-needed';
export type PreAuthPriority = 'urgent' | 'standard';
export type AIRecommendation = 'approve' | 'review' | 'deny';
export type ClaimStatus = 'approved' | 'pending' | 'denied' | 'appealed';

export interface PreAuthorization {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  diagnosis: string;
  icd10: string;
  procedure: string;
  estimatedCost: number;
  priority: PreAuthPriority;
  submittedDate: Date;
  slaDeadline: Date;
  status: PreAuthStatus;
  aiRecommendation: AIRecommendation;
  aiConfidence: number;
  aiReason?: string;
}

export interface RiskInsight {
  id: string;
  type: 'high-cost-risk' | 'chronic-deterioration' | 'fraud-alert' | 'preventive-care';
  severity: 'critical' | 'high' | 'medium';
  patientId?: string;
  memberCount?: number;
  title: string;
  description: string;
  recommendation: string;
  potentialSavings?: number;
}

export interface ClaimsSummary {
  approved: number;
  pending: number;
  denied: number;
  appealed: number;
}

export interface NetworkProvider {
  id: string;
  name: string;
  specialty: string;
  claimsCount: number;
  avgClaimValue: number;
  denialRate: number;
  fraudScore: number;
}

export interface InsuranceKPIs {
  openPreAuthRequests: number;
  urgentPreAuthRequests: number;
  claimsSubmittedToday: number;
  claimsTotalValue: number;
  autoApprovalRate: number;
  fraudAlerts: number;
  avgProcessingTime: number;
  activeMembers: number;
}

export const MOCK_INSURANCE_KPIS: InsuranceKPIs = {
  openPreAuthRequests: 47,
  urgentPreAuthRequests: 23,
  claimsSubmittedToday: 312,
  claimsTotalValue: 1240000,
  autoApprovalRate: 78,
  fraudAlerts: 5,
  avgProcessingTime: 4.2,
  activeMembers: 12450,
};

export const MOCK_PRE_AUTHORIZATIONS: PreAuthorization[] = [
  {
    id: 'pa-001',
    patientName: 'Ahmed Al Maktoum',
    patientId: '4821',
    doctorName: 'Dr. Sarah Johnson',
    diagnosis: 'Coronary Artery Disease',
    icd10: 'I25.10',
    procedure: 'Coronary Angioplasty with Stent',
    estimatedCost: 45000,
    priority: 'urgent',
    submittedDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    slaDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: 'pending',
    aiRecommendation: 'approve',
    aiConfidence: 94,
    aiReason: 'Medical necessity confirmed. Patient history supports intervention.',
  },
  {
    id: 'pa-002',
    patientName: 'Fatima Hassan',
    patientId: '3892',
    doctorName: 'Dr. Mohammed Ali',
    diagnosis: 'Severe Osteoarthritis',
    icd10: 'M17.0',
    procedure: 'Total Knee Replacement',
    estimatedCost: 38000,
    priority: 'standard',
    submittedDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    slaDeadline: new Date(Date.now() + 19 * 60 * 60 * 1000),
    status: 'pending',
    aiRecommendation: 'approve',
    aiConfidence: 91,
    aiReason: 'Conservative treatment completed. Surgery medically necessary.',
  },
  {
    id: 'pa-003',
    patientName: 'Raj Kumar',
    patientId: '5621',
    doctorName: 'Dr. Emily Chen',
    diagnosis: 'Lower Back Pain',
    icd10: 'M54.5',
    procedure: 'Lumbar Spinal Fusion',
    estimatedCost: 52000,
    priority: 'standard',
    submittedDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
    slaDeadline: new Date(Date.now() + 21 * 60 * 60 * 1000),
    status: 'pending',
    aiRecommendation: 'review',
    aiConfidence: 67,
    aiReason: 'Insufficient documentation of conservative treatment failure.',
  },
  {
    id: 'pa-004',
    patientName: 'Maria Santos',
    patientId: '2934',
    doctorName: 'Dr. Ahmed Khalil',
    diagnosis: 'Acute Appendicitis',
    icd10: 'K35.80',
    procedure: 'Laparoscopic Appendectomy',
    estimatedCost: 12000,
    priority: 'urgent',
    submittedDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
    slaDeadline: new Date(Date.now() + 3 * 60 * 60 * 1000),
    status: 'pending',
    aiRecommendation: 'approve',
    aiConfidence: 98,
    aiReason: 'Emergency procedure. Standard treatment for acute appendicitis.',
  },
  {
    id: 'pa-005',
    patientName: 'John Williams',
    patientId: '7123',
    doctorName: 'Dr. Laila Rahman',
    diagnosis: 'Sleep Apnea',
    icd10: 'G47.33',
    procedure: 'CPAP Therapy Equipment',
    estimatedCost: 3500,
    priority: 'standard',
    submittedDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
    slaDeadline: new Date(Date.now() + 18 * 60 * 60 * 1000),
    status: 'pending',
    aiRecommendation: 'deny',
    aiConfidence: 88,
    aiReason: 'No sleep study documented. Diagnostic testing required first.',
  },
  {
    id: 'pa-006',
    patientName: 'Khalid Abdullah',
    patientId: '8456',
    doctorName: 'Dr. Lisa Park',
    diagnosis: 'Type 2 Diabetes Mellitus',
    icd10: 'E11.9',
    procedure: 'Continuous Glucose Monitor',
    estimatedCost: 2800,
    priority: 'standard',
    submittedDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
    slaDeadline: new Date(Date.now() + 20 * 60 * 60 * 1000),
    status: 'pending',
    aiRecommendation: 'approve',
    aiConfidence: 89,
    aiReason: 'HbA1c levels support need for continuous monitoring.',
  },
  {
    id: 'pa-007',
    patientName: 'Sophia Martinez',
    patientId: '9234',
    doctorName: 'Dr. Omar Hassan',
    diagnosis: 'Breast Cancer',
    icd10: 'C50.9',
    procedure: 'Mastectomy with Reconstruction',
    estimatedCost: 65000,
    priority: 'urgent',
    submittedDate: new Date(Date.now() - 30 * 60 * 1000),
    slaDeadline: new Date(Date.now() + 3.5 * 60 * 60 * 1000),
    status: 'pending',
    aiRecommendation: 'approve',
    aiConfidence: 96,
    aiReason: 'Oncology board recommendation. Medically necessary treatment.',
  },
  {
    id: 'pa-008',
    patientName: 'Ali Mohammed',
    patientId: '6789',
    doctorName: 'Dr. Jennifer Lee',
    diagnosis: 'Cosmetic Rhinoplasty',
    icd10: 'Z41.1',
    procedure: 'Rhinoplasty',
    estimatedCost: 18000,
    priority: 'standard',
    submittedDate: new Date(Date.now() - 7 * 60 * 60 * 1000),
    slaDeadline: new Date(Date.now() + 17 * 60 * 60 * 1000),
    status: 'pending',
    aiRecommendation: 'deny',
    aiConfidence: 95,
    aiReason: 'Cosmetic procedure not covered under policy terms.',
  },
];

export const MOCK_RISK_INSIGHTS: RiskInsight[] = [
  {
    id: 'risk-001',
    type: 'high-cost-risk',
    severity: 'critical',
    patientId: '4821',
    title: 'High-Cost Claim Risk Identified',
    description: 'Patient #4821 - predicted hospitalization within 30 days based on chronic disease trajectory.',
    recommendation: 'Preventive intervention recommended. Schedule care management outreach.',
    potentialSavings: 25000,
  },
  {
    id: 'risk-002',
    type: 'chronic-deterioration',
    severity: 'high',
    memberCount: 3,
    title: 'Chronic Disease Management Alert',
    description: '3 members with diabetes showing deteriorating HbA1c trend (>8.5% from <7%).',
    recommendation: 'Proactive outreach suggested. Consider diabetes education program enrollment.',
    potentialSavings: 15000,
  },
  {
    id: 'risk-003',
    type: 'preventive-care',
    severity: 'medium',
    memberCount: 127,
    title: 'Preventive Care Gap',
    description: '127 members overdue for annual preventive screening (mammography, colonoscopy).',
    recommendation: 'Send automated reminders. Offer incentives for completion.',
    potentialSavings: 45000,
  },
];

export const MOCK_CLAIMS_SUMMARY: ClaimsSummary = {
  approved: 68,
  pending: 22,
  denied: 7,
  appealed: 3,
};

export const MOCK_NETWORK_PROVIDERS: NetworkProvider[] = [
  {
    id: 'prov-001',
    name: 'Mediclinic Dubai Mall',
    specialty: 'Multi-Specialty Hospital',
    claimsCount: 2847,
    avgClaimValue: 3450,
    denialRate: 4.2,
    fraudScore: 12,
  },
  {
    id: 'prov-002',
    name: 'American Hospital Dubai',
    specialty: 'Multi-Specialty Hospital',
    claimsCount: 2134,
    avgClaimValue: 4230,
    denialRate: 3.8,
    fraudScore: 8,
  },
  {
    id: 'prov-003',
    name: 'Aster Hospital Al Qusais',
    specialty: 'Multi-Specialty Hospital',
    claimsCount: 1923,
    avgClaimValue: 2890,
    denialRate: 5.1,
    fraudScore: 15,
  },
  {
    id: 'prov-004',
    name: 'Emirates Specialty Hospital',
    specialty: 'Specialized Care',
    claimsCount: 1456,
    avgClaimValue: 5670,
    denialRate: 6.3,
    fraudScore: 34,
  },
  {
    id: 'prov-005',
    name: 'Saudi German Hospital',
    specialty: 'Multi-Specialty Hospital',
    claimsCount: 1289,
    avgClaimValue: 3120,
    denialRate: 4.5,
    fraudScore: 11,
  },
  {
    id: 'prov-006',
    name: 'Thumbay Hospital',
    specialty: 'Multi-Specialty Hospital',
    claimsCount: 1167,
    avgClaimValue: 2340,
    denialRate: 7.2,
    fraudScore: 22,
  },
  {
    id: 'prov-007',
    name: 'NMC Royal Hospital',
    specialty: 'Multi-Specialty Hospital',
    claimsCount: 1045,
    avgClaimValue: 2980,
    denialRate: 4.8,
    fraudScore: 13,
  },
  {
    id: 'prov-008',
    name: 'Zulekha Hospital',
    specialty: 'Multi-Specialty Hospital',
    claimsCount: 934,
    avgClaimValue: 2650,
    denialRate: 5.4,
    fraudScore: 16,
  },
  {
    id: 'prov-009',
    name: 'Aster Clinic Marina',
    specialty: 'Primary Care',
    claimsCount: 856,
    avgClaimValue: 450,
    denialRate: 2.1,
    fraudScore: 5,
  },
  {
    id: 'prov-010',
    name: 'Prime Medical Center',
    specialty: 'Primary Care',
    claimsCount: 723,
    avgClaimValue: 380,
    denialRate: 3.2,
    fraudScore: 7,
  },
];
