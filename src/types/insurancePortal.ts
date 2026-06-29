export type AiRecommendation = 'APPROVE' | 'REVIEW' | 'DENY';
export type Priority = 'OVERDUE' | 'URGENT' | 'HIGH' | 'STANDARD';
export type ClaimStatus = 'AUTO_APPROVED' | 'PENDING' | 'DENIED' | 'APPEALED';
export type FraudRisk = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type PlanType = 'Gold' | 'Silver' | 'Basic' | 'Thiqa';

export interface PreAuthRequest {
  id: string;
  paRef: string;
  patientName: string;
  patientId: string;
  policyNumber: string;
  planType: PlanType;
  patientAge: number;
  patientGender: 'M' | 'F';
  doctorName: string;
  clinicName: string;
  procedure: string;
  icd10: string;
  icd10Description: string;
  estimatedCost: number;
  coveragePercent: number;
  aiRecommendation: AiRecommendation;
  aiConfidence: number;
  aiReason: string;
  priority: Priority;
  slaHours: number;
  slaRemainingMinutes: number;
  submittedAt: string;
  responseDueAt: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
}

export interface Claim {
  id: string;
  claimRef: string;
  patientName: string;
  policyNumber: string;
  planType: PlanType;
  doctorName: string;
  service: string;
  amount: number;
  status: ClaimStatus;
}

export interface FraudAlert {
  id: string;
  risk: FraudRisk;
  confidence: number;
  subject: string;
  pattern: string;
  amountAtRisk: number;
  flaggedBy: 'AI' | 'MANUAL';
}

export interface NetworkProvider {
  id: string;
  name: string;
  claims: number;
  avgValue: number;
  denialRate: number;
  fraudScore: FraudRisk;
  note?: string;
  flagged?: boolean;
}

export interface RiskInsight {
  id: string;
  type: 'PREVENTIVE' | 'CLUSTER' | 'PROVIDER';
  title: string;
  body: string;
  costImpact?: string;
  actionLabel: string;
  actionSecondary?: string;
}

export interface MonthlyClaimData {
  month: string;
  claims: number;
  value: number;
  budget: number;
}

export type PortalClaimStatus = 'AUTO_APPROVED' | 'APPROVED' | 'PENDING' | 'DENIED' | 'APPEALED' | 'FRAUD_FLAGGED' | 'ON_HOLD';
export type ServiceCategory = 'Consultation' | 'Lab' | 'Radiology' | 'Pharmacy' | 'Surgery' | 'Emergency' | 'Physiotherapy' | 'Specialist';
export type PaymentStatus = 'Batch tonight' | 'Paid' | 'On hold' | 'Denied' | 'Pending';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface MemberCondition {
  code: string;
  name: string;
  abbr: string;
  status?: string;
  statusColor?: 'emerald' | 'teal' | 'amber' | 'red';
  doctor?: string;
}

export interface MemberMedication {
  name: string;
  dose: string;
  frequency?: string;
}

export interface MemberAllergy {
  name: string;
  severity: 'SEVERE' | 'MODERATE';
}

export interface MemberClaim {
  date: string;
  ref: string;
  service: string;
  gross: number;
  damanPays: number;
  status: string;
  paRef?: string;
}

export interface Member {
  id: string;
  memberId: string;
  policyNumber: string;
  planType: PlanType;
  copayPercent: number;
  annualLimit: number;
  annualUsed: number;
  fullName: string;
  initials: string;
  age: number;
  gender: 'M' | 'F';
  nationality: string;
  dobDisplay: string;
  emiratesId: string;
  mobile: string;
  email: string;
  memberSince: string;
  riskLevel: RiskLevel;
  riskScore: number;
  aiHealthScore: number;
  aiHealthTrend?: number;
  aiPrediction?: string;
  aiInsightChip?: string;
  conditions: MemberCondition[];
  medications: MemberMedication[];
  allergies?: MemberAllergy[];
  primaryDoctor: string;
  primarySpecialty: string;
  primaryFacility: string;
  nextAppointment?: string;
  claimsCount: number;
  claimsTotal: number;
  lastClaimDate: string;
  lastClaimDateLabel: string;
  lastClaimAmount?: number;
  lastClaimRef?: string;
  lastPlatformLogin: string;
  engagementLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  labResults: number;
  appointments: number;
  activePrescriptions: number;
  wellnessFlag?: string;
  benefitAlertLevel?: 'EXHAUSTED' | 'NEAR_LIMIT';
  pendingPreAuth?: string;
  patientId?: string;
  arabicName?: string;
  claimsHistory?: MemberClaim[];
  vitals?: { bp: string; bpOk: boolean; hr: string; weight: string; bmi: string; spo2: string; temp: string };
  keyLabs?: { name: string; value: string; ref: string; status: 'ok' | 'warn'; note?: string }[];
  usageByCategory?: { category: string; amount: number; color: string }[];
}

export interface MembersSummary {
  total: number;
  active: number;
  inactive: number;
  activePct: number;
  gold: number; silver: number; basic: number; thiqa: number;
  low: number; medium: number; high: number; critical: number;
  benefitsPaidApril: number;
  avgUtilizationPct: number;
  nearLimit: number;
  limitExhausted: number;
  avgHealthScore: number;
  avgAge: number;
}

export interface PortalClaim {
  id: string;
  claimRef: string;
  shortRef: string;
  submittedAt: string;
  submittedDate: string;
  processedAt?: string;
  turnaroundMins?: number;
  patientName: string;
  patientInitials: string;
  patientAge: number;
  patientGender: 'M' | 'F';
  patientNationality?: string;
  policyNumber: string;
  planType: PlanType;
  annualUsed: number;
  annualLimit: number;
  allergies?: string[];
  doctorName: string;
  doctorSpecialty: string;
  facilityName: string;
  facilityDha?: string;
  doctorDha?: string;
  inNetwork: boolean;
  providerFraudFlag?: boolean;
  serviceName: string;
  serviceCategory: ServiceCategory;
  icd10: string;
  icd10Description: string;
  cpt?: string;
  cptDescription?: string;
  visitDate?: string;
  visitType?: string;
  paRef?: string;
  grossAmount: number;
  copayPercent: number;
  copayAmount: number;
  damanPays: number;
  copayCollected: boolean;
  paymentStatus: PaymentStatus;
  status: PortalClaimStatus;
  aiConfidence?: number;
  reviewReason?: string;
  denialReason?: string;
  denialReasonCode?: string;
  fraudReason?: string;
  appealFiledAt?: string;
  appealDeadline?: string;
  appealDaysRemaining?: number;
  appealStatus?: string;
  appealFiledBy?: string;
  appealReason?: string;
  eobGenerated: boolean;
  eobGeneratedAt?: string;
  aiAuditLog?: { time: string; event: string }[];
}
