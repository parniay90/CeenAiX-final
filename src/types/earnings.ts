export interface Transaction {
  id: string;
  date: string;
  time: string;
  patientName: string;
  patientId: string;
  type: 'consultation' | 'insurance_payin' | 'payout' | 'fee' | 'refund';
  consultationType?: 'follow-up' | 'new-patient' | 'post-procedure' | 'walk-in' | 'annual-check' | 'emergency';
  gross: number;
  platformFee: number;
  net: number;
  status: 'completed' | 'pending' | 'processing' | 'transferred' | 'in-progress';
  paymentMethod?: 'insurance' | 'card' | 'cash' | 'wallet';
  insuranceProvider?: string;
  claimRef?: string;
  payoutRef?: string;
}

export interface InsuranceClaim {
  id: string;
  claimRef: string;
  date: string;
  patientName: string;
  patientId: string;
  insurer: string;
  insurerType: 'daman' | 'adnic' | 'axa' | 'thiqa' | 'oman';
  gross: number;
  insurancePortion: number;
  copay: number;
  status: 'approved' | 'pending' | 'rejected' | 'processing' | 'preapproved' | 'resubmitted';
  rejectionReason?: string;
  processingDays?: number;
  submittedDate?: string;
}

export interface InsurerSummary {
  id: string;
  name: string;
  type: 'daman' | 'adnic' | 'axa' | 'thiqa' | 'oman';
  logo: string;
  totalClaims: number;
  approved: number;
  pending: number;
  rejected: number;
  totalAmount: number;
  approvedAmount: number;
  pendingAmount: number;
  rejectedAmount: number;
  avgProcessingDays: number;
  color: string;
}

export interface Payout {
  id: string;
  date: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  consultations: number;
  status: 'transferred' | 'processing' | 'estimated' | 'projected';
  reference?: string;
  daysUntil?: number;
  breakdown?: {
    insurance: number;
    direct: number;
  };
}

export interface MonthlyData {
  month: string;
  gross: number;
  net: number;
  consultations: number;
  platformFee: number;
}

export interface DailyRevenue {
  day: number;
  date: string;
  revenue: number;
  consultations: number;
  isWeekend: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export interface PaymentSourceBreakdown {
  insurance: number;
  card: number;
  cash: number;
  wallet: number;
}

export interface AppointmentTypeBreakdown {
  type: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface NoShowData {
  month: string;
  noShows: number;
  cancellations: number;
  noShowRevenueLost: number;
  cancellationRevenueLost: number;
}
