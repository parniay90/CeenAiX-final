// Risk Analytics mock data — April 2026

export interface MonthlyActual {
  month: string;
  shortMonth: string;
  claimsSubmitted: number;
  claimsPaid: number;
  budget: number;
  memberCount: number;
  avgClaimValue: number;
  approvalRate: number;
  denialRate: number;
}

export interface PlanBreakdown {
  plan: string;
  shortName: string;
  members: number;
  premiumRevenue: number;
  claimsPaid: number;
  lossRatio: number;
  avgCostPerMember: number;
  color: string;
}

export interface SpecialtySpend {
  specialty: string;
  budget: number;
  actual: number;
  variance: number;
  variancePct: number;
  claimsCount: number;
  avgClaim: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ProviderPerformance {
  id: string;
  name: string;
  city: string;
  type: string;
  claimsSubmitted: number;
  claimsApproved: number;
  claimsDenied: number;
  totalPaid: number;
  avgClaim: number;
  slaScore: number;
  qualityScore: number;
  overallScore: number;
  trend: 'up' | 'down' | 'stable';
  fraudFlags: number;
}

export interface RiskTier {
  tier: 'Critical' | 'High' | 'Moderate' | 'Low';
  members: number;
  pct: number;
  totalSpend: number;
  avgSpend: number;
  projectedSpend: number;
  topConditions: string[];
  color: string;
  bgColor: string;
}

export interface SlaEntry {
  category: string;
  target: number;
  actual: number;
  met: boolean;
  trend: 'up' | 'down' | 'stable';
}

export interface DenialRatePoint {
  month: string;
  overall: number;
  medical: number;
  pharmacy: number;
  dental: number;
}

export interface UtilizationPoint {
  month: string;
  inpatient: number;
  outpatient: number;
  pharmacy: number;
  dental: number;
  vision: number;
}

export interface PredictiveQuarter {
  quarter: string;
  baseCase: number;
  optimistic: number;
  pessimistic: number;
  confidence: number;
}

// ─── MONTHLY ACTUALS (Jan–Apr 2026) ──────────────────────────────────────────
export const monthlyActuals: MonthlyActual[] = [
  {
    month: 'January 2026', shortMonth: 'Jan',
    claimsSubmitted: 15841200, claimsPaid: 14241800, budget: 14500000,
    memberCount: 47240, avgClaimValue: 1180, approvalRate: 89.9, denialRate: 10.1,
  },
  {
    month: 'February 2026', shortMonth: 'Feb',
    claimsSubmitted: 15120600, claimsPaid: 13680400, budget: 13800000,
    memberCount: 47410, avgClaimValue: 1142, approvalRate: 90.5, denialRate: 9.5,
  },
  {
    month: 'March 2026', shortMonth: 'Mar',
    claimsSubmitted: 16438900, claimsPaid: 15012700, budget: 15200000,
    memberCount: 47880, avgClaimValue: 1214, approvalRate: 91.3, denialRate: 8.7,
  },
  {
    month: 'April 2026 (to date)', shortMonth: 'Apr',
    claimsSubmitted: 4847200, claimsPaid: 3912100, budget: 15400000,
    memberCount: 48120, avgClaimValue: 1201, approvalRate: 92.1, denialRate: 7.9,
  },
];

// ─── FINANCIAL SNAPSHOT (current month April 2026 to date) ───────────────────
export const financialSnapshot = {
  premiumRevenue: 18240000,
  claimsPaid: 3912100,
  pendingExposure: 6284700,
  lossRatio: 0.214,
  lossRatioTarget: 0.72,
  adminCostRatio: 0.089,
  netMargin: 0.697,
  memberCount: 48120,
  activePolicies: 12847,
  budgetUtilization: 0.254,
  budgetRemaining: 11487900,
  monthlyBudget: 15400000,
  fraudSavings: 1240000,
  slaCompliance: 0.923,
};

// ─── PLAN BREAKDOWN ───────────────────────────────────────────────────────────
export const planBreakdown: PlanBreakdown[] = [
  {
    plan: 'Enhanced Plan', shortName: 'Enhanced',
    members: 18420, premiumRevenue: 7382400, claimsPaid: 1621800,
    lossRatio: 0.220, avgCostPerMember: 881,
    color: '#1E40AF',
  },
  {
    plan: 'Essential Plan', shortName: 'Essential',
    members: 15840, premiumRevenue: 6048000, claimsPaid: 1294200,
    lossRatio: 0.214, avgCostPerMember: 817,
    color: '#0369A1',
  },
  {
    plan: 'Premium Plan', shortName: 'Premium',
    members: 8210, premiumRevenue: 3692400, claimsPaid: 726400,
    lossRatio: 0.197, avgCostPerMember: 885,
    color: '#0F766E',
  },
  {
    plan: 'Basic Plan', shortName: 'Basic',
    members: 5650, premiumRevenue: 1117800, claimsPaid: 269700,
    lossRatio: 0.241, avgCostPerMember: 477,
    color: '#7C3AED',
  },
];

// ─── SPECIALTY SPEND ──────────────────────────────────────────────────────────
export const specialtySpend: SpecialtySpend[] = [
  {
    specialty: 'General Practice', budget: 3200000, actual: 2841200,
    variance: -358800, variancePct: -11.2, claimsCount: 4218, avgClaim: 674, trend: 'down',
  },
  {
    specialty: 'Cardiology', budget: 2800000, actual: 3142600,
    variance: 342600, variancePct: 12.2, claimsCount: 1847, avgClaim: 1701, trend: 'up',
  },
  {
    specialty: 'Orthopedics', budget: 2400000, actual: 2618900,
    variance: 218900, variancePct: 9.1, claimsCount: 1234, avgClaim: 2122, trend: 'up',
  },
  {
    specialty: 'Pharmacy', budget: 3600000, actual: 3418700,
    variance: -181300, variancePct: -5.0, claimsCount: 8941, avgClaim: 382, trend: 'stable',
  },
  {
    specialty: 'Mental Health', budget: 1200000, actual: 984200,
    variance: -215800, variancePct: -18.0, claimsCount: 612, avgClaim: 1608, trend: 'down',
  },
  {
    specialty: 'Oncology', budget: 2100000, actual: 2384100,
    variance: 284100, variancePct: 13.5, claimsCount: 298, avgClaim: 8000, trend: 'up',
  },
];

// ─── PROVIDER PERFORMANCE ─────────────────────────────────────────────────────
export const providerPerformance: ProviderPerformance[] = [
  {
    id: 'PRV-001', name: 'Cleveland Clinic Abu Dhabi', city: 'Abu Dhabi', type: 'Hospital',
    claimsSubmitted: 4218, claimsApproved: 3962, claimsDenied: 256,
    totalPaid: 9841200, avgClaim: 2334, slaScore: 98, qualityScore: 96, overallScore: 97,
    trend: 'up', fraudFlags: 0,
  },
  {
    id: 'PRV-002', name: 'Burjeel Hospital', city: 'Abu Dhabi', type: 'Hospital',
    claimsSubmitted: 3847, claimsApproved: 3594, claimsDenied: 253,
    totalPaid: 8214800, avgClaim: 2135, slaScore: 94, qualityScore: 91, overallScore: 93,
    trend: 'stable', fraudFlags: 0,
  },
  {
    id: 'PRV-003', name: 'Prime Medical Centre', city: 'Dubai', type: 'Clinic',
    claimsSubmitted: 2941, claimsApproved: 2714, claimsDenied: 227,
    totalPaid: 2184100, avgClaim: 743, slaScore: 89, qualityScore: 88, overallScore: 89,
    trend: 'up', fraudFlags: 1,
  },
  {
    id: 'PRV-004', name: 'Mediclinic City Hospital', city: 'Dubai', type: 'Hospital',
    claimsSubmitted: 3124, claimsApproved: 2871, claimsDenied: 253,
    totalPaid: 6841200, avgClaim: 2189, slaScore: 91, qualityScore: 93, overallScore: 92,
    trend: 'up', fraudFlags: 0,
  },
  {
    id: 'PRV-005', name: 'NMC Royal Hospital', city: 'Abu Dhabi', type: 'Hospital',
    claimsSubmitted: 2818, claimsApproved: 2542, claimsDenied: 276,
    totalPaid: 5912400, avgClaim: 2097, slaScore: 82, qualityScore: 79, overallScore: 81,
    trend: 'down', fraudFlags: 2,
  },
  {
    id: 'PRV-006', name: 'LLH Hospital', city: 'Abu Dhabi', type: 'Hospital',
    claimsSubmitted: 1947, claimsApproved: 1742, claimsDenied: 205,
    totalPaid: 3214800, avgClaim: 1651, slaScore: 86, qualityScore: 84, overallScore: 85,
    trend: 'stable', fraudFlags: 0,
  },
  {
    id: 'PRV-007', name: 'Al Noor Hospital', city: 'Abu Dhabi', type: 'Hospital',
    claimsSubmitted: 2214, claimsApproved: 1947, claimsDenied: 267,
    totalPaid: 4184200, avgClaim: 1888, slaScore: 77, qualityScore: 75, overallScore: 76,
    trend: 'down', fraudFlags: 3,
  },
];

// ─── RISK STRATIFICATION ──────────────────────────────────────────────────────
export const riskStratification: RiskTier[] = [
  {
    tier: 'Critical', members: 1284, pct: 2.7,
    totalSpend: 1841200, avgSpend: 14341, projectedSpend: 22094400,
    topConditions: ['End-Stage Renal', 'Metastatic Cancer', 'Heart Failure'],
    color: '#DC2626', bgColor: 'rgba(220,38,38,0.08)',
  },
  {
    tier: 'High', members: 4818, pct: 10.0,
    totalSpend: 2184100, avgSpend: 4532, projectedSpend: 26184000,
    topConditions: ['Diabetes T2', 'COPD', 'Ischemic Heart Disease'],
    color: '#EA580C', bgColor: 'rgba(234,88,12,0.08)',
  },
  {
    tier: 'Moderate', members: 12847, pct: 26.7,
    totalSpend: 1412400, avgSpend: 1099, projectedSpend: 16989600,
    topConditions: ['Hypertension', 'Asthma', 'Anxiety Disorders'],
    color: '#D97706', bgColor: 'rgba(217,119,6,0.08)',
  },
  {
    tier: 'Low', members: 29171, pct: 60.6,
    totalSpend: 474400, avgSpend: 163, projectedSpend: 5688000,
    topConditions: ['Preventive Care', 'Minor Infections', 'Dental'],
    color: '#16A34A', bgColor: 'rgba(22,163,74,0.08)',
  },
];

// ─── SLA DATA ─────────────────────────────────────────────────────────────────
export const slaData: SlaEntry[] = [
  { category: 'Pre-Auth Emergency', target: 2, actual: 1.4, met: true, trend: 'down' },
  { category: 'Pre-Auth Routine', target: 24, actual: 18.2, met: true, trend: 'down' },
  { category: 'Claims Processing', target: 48, actual: 41.8, met: true, trend: 'stable' },
  { category: 'Claims Payment', target: 168, actual: 142.4, met: true, trend: 'down' },
  { category: 'Member Enquiry', target: 4, actual: 3.1, met: true, trend: 'stable' },
  { category: 'Provider Appeal', target: 72, actual: 89.4, met: false, trend: 'up' },
  { category: 'DHA Reporting', target: 720, actual: 694.2, met: true, trend: 'stable' },
];

// ─── DENIAL RATE TREND ────────────────────────────────────────────────────────
export const denialRateTrend: DenialRatePoint[] = [
  { month: 'Oct', overall: 13.2, medical: 14.8, pharmacy: 8.4, dental: 11.2 },
  { month: 'Nov', overall: 12.8, medical: 14.1, pharmacy: 7.9, dental: 10.8 },
  { month: 'Dec', overall: 13.6, medical: 15.2, pharmacy: 8.8, dental: 12.4 },
  { month: 'Jan', overall: 10.1, medical: 11.4, pharmacy: 6.2, dental: 9.8 },
  { month: 'Feb', overall: 9.5, medical: 10.8, pharmacy: 5.9, dental: 9.2 },
  { month: 'Mar', overall: 8.7, medical: 9.9, pharmacy: 5.4, dental: 8.1 },
  { month: 'Apr', overall: 7.9, medical: 9.1, pharmacy: 4.8, dental: 7.4 },
];

// ─── UTILIZATION TREND ────────────────────────────────────────────────────────
export const utilizationTrend: UtilizationPoint[] = [
  { month: 'Jan', inpatient: 5241800, outpatient: 4812400, pharmacy: 2418700, dental: 1241800, vision: 527100 },
  { month: 'Feb', inpatient: 4918200, outpatient: 4641200, pharmacy: 2312400, dental: 1184200, vision: 624400 },
  { month: 'Mar', inpatient: 5412400, outpatient: 5018400, pharmacy: 2614800, dental: 1384200, vision: 582900 },
  { month: 'Apr', inpatient: 1541200, outpatient: 1284100, pharmacy: 698400, dental: 284200, vision: 104200 },
];

// ─── PREDICTIVE MODELING ──────────────────────────────────────────────────────
export const quarterlyProjections: PredictiveQuarter[] = [
  { quarter: 'Q2 2026', baseCase: 44841200, optimistic: 41284100, pessimistic: 49241800, confidence: 84 },
  { quarter: 'Q3 2026', baseCase: 46284100, optimistic: 42814200, pessimistic: 51841200, confidence: 71 },
  { quarter: 'Q4 2026', baseCase: 47841200, optimistic: 43814100, pessimistic: 54284200, confidence: 58 },
];

export const fullYearProjection = [
  { month: 'Jan', actual: 14241800, projected: null, budget: 14500000 },
  { month: 'Feb', actual: 13680400, projected: null, budget: 13800000 },
  { month: 'Mar', actual: 15012700, projected: null, budget: 15200000 },
  { month: 'Apr', actual: 3912100, projected: null, budget: 15400000 },
  { month: 'May', actual: null, projected: 14812400, budget: 15400000 },
  { month: 'Jun', actual: null, projected: 15241800, budget: 15800000 },
  { month: 'Jul', actual: null, projected: 15618400, budget: 16000000 },
  { month: 'Aug', actual: null, projected: 15984100, budget: 16000000 },
  { month: 'Sep', actual: null, projected: 14841200, budget: 15600000 },
  { month: 'Oct', actual: null, projected: 15284100, budget: 15800000 },
  { month: 'Nov', actual: null, projected: 15841200, budget: 16200000 },
  { month: 'Dec', actual: null, projected: 16241800, budget: 16400000 },
];

// ─── FINANCIAL BREAKDOWN TABLE ────────────────────────────────────────────────
export const financialBreakdown = [
  { category: 'Inpatient Claims', q1Budget: 18400000, q1Actual: 15572200, ytdBudget: 18400000, ytdActual: 17113400, variance: -1286600, variancePct: -7.0 },
  { category: 'Outpatient Claims', q1Budget: 14700000, q1Actual: 14471600, ytdBudget: 14700000, ytdActual: 15756300, variance: 1056300, variancePct: 7.2 },
  { category: 'Pharmacy', q1Budget: 9600000, q1Actual: 8345800, ytdBudget: 9600000, ytdActual: 9040300, variance: -559700, variancePct: -5.8 },
  { category: 'Dental & Vision', q1Budget: 3200000, q1Actual: 2810200, ytdBudget: 3200000, ytdActual: 3094600, variance: -105400, variancePct: -3.3 },
  { category: 'Emergency Care', q1Budget: 2400000, q1Actual: 2714100, ytdBudget: 2400000, ytdActual: 2998700, variance: 598700, variancePct: 24.9 },
  { category: 'Admin & Processing', q1Budget: 1240000, q1Actual: 1181400, ytdBudget: 1240000, ytdActual: 1297800, variance: 57800, variancePct: 4.7 },
  { category: 'Reinsurance Premium', q1Budget: 2100000, q1Actual: 2100000, ytdBudget: 2100000, ytdActual: 2100000, variance: 0, variancePct: 0 },
];

// ─── MONTHLY FRAUD OVERVIEW ───────────────────────────────────────────────────
export const fraudOverview = [
  { month: 'Jan', detected: 12, confirmed: 8, savings: 2841200 },
  { month: 'Feb', detected: 9, confirmed: 6, savings: 1984100 },
  { month: 'Mar', detected: 15, confirmed: 11, savings: 3412800 },
  { month: 'Apr', detected: 7, confirmed: 4, savings: 1240000 },
];

// ─── AI INSIGHTS ──────────────────────────────────────────────────────────────
export const aiInsights = [
  {
    id: 'ai-1',
    type: 'warning' as const,
    title: 'Cardiology Spend Acceleration',
    detail: 'Cardiology claims are tracking 12.2% above budget. AI projects a AED 1.84M overrun by year-end if current trend continues. Consider implementing pre-authorization thresholds for high-cost cardiology procedures.',
    confidence: 87,
    impactAmount: 1840000,
    category: 'Budget Overrun',
  },
  {
    id: 'ai-2',
    type: 'success' as const,
    title: 'Denial Rate Improving',
    detail: 'Denial rates have fallen 5.3 percentage points since October. The new pre-auth protocol introduced in January is performing above expectations — projected to save AED 2.1M annually in re-submission costs.',
    confidence: 92,
    impactAmount: 2100000,
    category: 'Efficiency Gain',
  },
  {
    id: 'ai-3',
    type: 'info' as const,
    title: 'Critical Risk Members — Intervention Opportunity',
    detail: 'AI has identified 284 Critical-tier members with no care management touchpoint in the last 90 days. Proactive outreach for this segment is projected to reduce ER admissions by 18% and save AED 3.4M over 12 months.',
    confidence: 78,
    impactAmount: 3400000,
    category: 'Care Management',
  },
];
