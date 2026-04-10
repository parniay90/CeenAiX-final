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
