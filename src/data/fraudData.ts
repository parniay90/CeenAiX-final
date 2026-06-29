export type FraudRiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type FraudStatus = 'NEW' | 'UNDER_REVIEW' | 'MONITORING' | 'REPORTED' | 'CONFIRMED' | 'FALSE_POSITIVE';
export type FraudType =
  | 'Ghost Consultations'
  | 'Duplicate Billing'
  | 'Upcoding'
  | 'Phantom Pharmacy'
  | 'Out-of-Hours Pattern'
  | 'Identity Fraud'
  | 'Kickback Pattern';

export interface FraudClaim {
  date: string;
  claimId: string;
  patientId: string;
  service: string;
  cpt: string;
  amount: number;
  status: 'FROZEN' | 'PENDING' | 'PAID';
}

export interface FraudCase {
  id: string;
  caseRef: string;
  riskLevel: FraudRiskLevel;
  confidence: number;
  type: FraudType;
  subjectName: string;
  subjectRole: 'provider' | 'patient' | 'ring';
  subjectFacility?: string;
  subjectCity?: string;
  dhaLicense?: string;
  dhaLicenseValid?: boolean;
  amountAtRisk: number;
  claimsTotal: number;
  claimsFrozen: number;
  claimsPaid: number;
  amountPaid: number;
  patientsInvolved: number;
  nabidhMatch: number;
  nabidhTotal: number;
  flaggedAt: string;
  flaggedAtDisplay: string;
  startDate: string;
  status: FraudStatus;
  assignedTo: string | null;
  aiReasoning: string;
  aiRecommendations: string[];
  evidencePills: string[];
  evidenceText: string;
  isNewToday: boolean;
  claimsPerDay?: number;
  daysActive?: number;
  cptCode?: string;
  networkAvgPct?: number;
  subjectPct?: number;
  controlledSubstancesPct?: number;
  claimsHistory: FraudClaim[];
  dailyPattern: { day: string; count: number }[];
}

export interface ResolvedCase {
  id: string;
  caseRef: string;
  type: FraudType;
  subject: string;
  outcome: 'CONFIRMED' | 'FALSE_POSITIVE' | 'LEGAL';
  amount: number;
  closedDate: string;
  dhaReported: boolean;
  note: string;
}

// ── Daily claim pattern helpers ────────────────────────────────────────────────

const ghostPattern = [
  { day: 'Mar 24', count: 23 }, { day: 'Mar 25', count: 24 }, { day: 'Mar 26', count: 22 },
  { day: 'Mar 27', count: 23 }, { day: 'Mar 28', count: 24 }, { day: 'Mar 29', count: 22 },
  { day: 'Mar 30', count: 23 }, { day: 'Mar 31', count: 22 }, { day: 'Apr 1', count: 24 },
  { day: 'Apr 2', count: 23 }, { day: 'Apr 3', count: 22 }, { day: 'Apr 4', count: 23 },
  { day: 'Apr 5', count: 24 }, { day: 'Apr 6', count: 23 }, { day: 'Apr 7', count: 7 },
];

const dupPattern = [
  { day: 'Apr 1', count: 1 }, { day: 'Apr 2', count: 1 }, { day: 'Apr 3', count: 1 },
  { day: 'Apr 4', count: 1 }, { day: 'Apr 5', count: 1 }, { day: 'Apr 6', count: 0 },
  { day: 'Apr 7', count: 0 },
];

const upcodingPattern = [
  { day: 'Dec 1', count: 28 }, { day: 'Dec 15', count: 32 }, { day: 'Jan 1', count: 31 },
  { day: 'Jan 15', count: 29 }, { day: 'Feb 1', count: 34 }, { day: 'Feb 15', count: 30 },
  { day: 'Mar 1', count: 33 }, { day: 'Mar 15', count: 31 }, { day: 'Apr 1', count: 26 },
];

const ghostClaims: FraudClaim[] = Array.from({ length: 47 }, (_, i) => ({
  date: i < 7 ? 'Apr 7' : i < 14 ? 'Apr 6' : i < 21 ? 'Apr 5' : i < 28 ? 'Apr 4' : i < 35 ? 'Apr 3' : 'Apr 2',
  claimId: `CLM-2026-${(340 - i).toString().padStart(6, '0')}`,
  patientId: `PT-ANON-${(i + 1).toString().padStart(3, '0')}`,
  service: 'Cardiology Consultation',
  cpt: '99213',
  amount: 400,
  status: 'FROZEN',
}));

// ── Active fraud cases ─────────────────────────────────────────────────────────

export const fraudCases: FraudCase[] = [
  {
    id: 'fraud-001',
    caseRef: 'FRAUD-20260407-001',
    riskLevel: 'CRITICAL',
    confidence: 94,
    type: 'Ghost Consultations',
    subjectName: 'Dr. Khalid Ibrahim',
    subjectRole: 'provider',
    subjectFacility: 'Unnamed Clinic',
    subjectCity: 'Dubai',
    dhaLicense: 'DHA-PRAC-2023-084721',
    dhaLicenseValid: true,
    amountAtRisk: 136000,
    claimsTotal: 340,
    claimsFrozen: 47,
    claimsPaid: 0,
    amountPaid: 0,
    patientsInvolved: 340,
    nabidhMatch: 0,
    nabidhTotal: 340,
    flaggedAt: '7 Apr 2026, 12:30 PM',
    flaggedAtDisplay: 'Today 12:30 PM',
    startDate: '24 Mar 2026',
    status: 'NEW',
    assignedTo: null,
    aiReasoning:
      'Ghost consultation billing fraud. Pattern matches type 3 billing fraud (fabricated visits). No clinical records exist in Nabidh for any of 340 patients. Physical impossibility: 22.7 consults/day requires 22+ hours of consecutive clinical work. Provider joined CeenAiX on the same day as first fraudulent claims (24 Mar 2026). All claims are identical CPT 99213 — zero variance is a definitive fraud indicator.',
    aiRecommendations: [
      'Immediate claims freeze',
      'Provider suspension',
      'DHA report submission',
      'Pattern type 3 — ghost billing',
    ],
    evidencePills: [
      '340 consults / 15 days',
      '22.7/day average',
      '0/340 Nabidh records',
      'All identical CPT 99213',
      'AED 400 × 340 = AED 136,000',
    ],
    evidenceText:
      '340 consultations billed over 15 days from unnamed clinic. Physical impossibility: achieving 22.7 consults/day requires 22+ consecutive working hours. Nabidh HIE cross-check: ZERO of 340 patients have any health records — definitive indicator of ghost consultation fraud.',
    isNewToday: true,
    claimsPerDay: 22.7,
    daysActive: 15,
    cptCode: 'CPT 99213',
    claimsHistory: ghostClaims,
    dailyPattern: ghostPattern,
  },
  {
    id: 'fraud-002',
    caseRef: 'FRAUD-20260407-002',
    riskLevel: 'CRITICAL',
    confidence: 91,
    type: 'Duplicate Billing',
    subjectName: 'PT-089241 + 3 Doctors + 3 Clinics',
    subjectRole: 'ring',
    subjectFacility: 'Multiple Facilities',
    subjectCity: 'Dubai',
    amountAtRisk: 28500,
    claimsTotal: 5,
    claimsFrozen: 3,
    claimsPaid: 2,
    amountPaid: 11400,
    patientsInvolved: 1,
    nabidhMatch: 1,
    nabidhTotal: 1,
    flaggedAt: '7 Apr 2026, 10:45 AM',
    flaggedAtDisplay: 'Today 10:45 AM',
    startDate: '1 Apr 2026',
    status: 'UNDER_REVIEW',
    assignedTo: 'Mariam Al Khateeb',
    aiReasoning:
      'Organized ring billing — patient may be complicit or identity compromised. Rare procedure (echocardiography) billed 5× in 7 days is clinically implausible without documented cardiac emergency. Three different providers at three different facilities submitted identical procedure codes within a 7-day window. Only 1 echocardiography on record in Nabidh (February 2026).',
    aiRecommendations: [
      'Freeze remaining 3 claims',
      'Investigate all 3 providers',
      'Patient identity verification',
      'Recover AED 11,400 paid',
    ],
    evidencePills: [
      'Echo CPT B1245 × 5 in 7 days',
      '3 providers, 3 clinics',
      '1 Nabidh echo on record',
      'AED 11,400 already paid',
    ],
    evidenceText:
      'Procedure code B1245 (echocardiography) billed 5 times in 7 days for the same patient (Fatima Al Khoury) by 3 different doctors at 3 different clinics. Only 1 echocardiography recorded in Nabidh (February 2026). 2 claims already paid (AED 11,400) before detection. 3 claims frozen pending investigation.',
    isNewToday: true,
    cptCode: 'CPT B1245',
    claimsHistory: [
      { date: 'Apr 1', claimId: 'CLM-2026-088421', patientId: 'PT-089241', service: 'Echocardiography', cpt: 'B1245', amount: 5700, status: 'PAID' },
      { date: 'Apr 2', claimId: 'CLM-2026-088892', patientId: 'PT-089241', service: 'Echocardiography', cpt: 'B1245', amount: 5700, status: 'PAID' },
      { date: 'Apr 3', claimId: 'CLM-2026-089147', patientId: 'PT-089241', service: 'Echocardiography', cpt: 'B1245', amount: 5700, status: 'FROZEN' },
      { date: 'Apr 5', claimId: 'CLM-2026-089621', patientId: 'PT-089241', service: 'Echocardiography', cpt: 'B1245', amount: 5700, status: 'FROZEN' },
      { date: 'Apr 7', claimId: 'CLM-2026-090014', patientId: 'PT-089241', service: 'Echocardiography', cpt: 'B1245', amount: 5700, status: 'FROZEN' },
    ],
    dailyPattern: dupPattern,
  },
  {
    id: 'fraud-003',
    caseRef: 'FRAUD-20260407-003',
    riskLevel: 'HIGH',
    confidence: 84,
    type: 'Upcoding',
    subjectName: 'Emirates Medical Center',
    subjectRole: 'provider',
    subjectFacility: 'Emirates Medical Center',
    subjectCity: 'Abu Dhabi',
    dhaLicense: 'DHA-FAC-2019-002847',
    dhaLicenseValid: true,
    amountAtRisk: 64800,
    claimsTotal: 324,
    claimsFrozen: 0,
    claimsPaid: 324,
    amountPaid: 64800,
    patientsInvolved: 287,
    nabidhMatch: 263,
    nabidhTotal: 287,
    flaggedAt: '7 Apr 2026, 09:00 AM',
    flaggedAtDisplay: 'This week',
    startDate: '1 Dec 2025',
    status: 'UNDER_REVIEW',
    assignedTo: 'Ahmad Al Mansouri',
    aiReasoning:
      'Systematic upcoding pattern. All 3 providers at same facility show identical anomaly — 94% of consultations billed as 99215 (highest complexity), versus 18% network average for this specialty mix. Facility management may be directing coding behavior. 4-month duration suggests systemic issue rather than individual error. Recommend facility audit before individual provider action.',
    aiRecommendations: [
      'Facility-level audit',
      'Coding practice review',
      'Provider education letter',
      'Recoupment of excess billing',
    ],
    evidencePills: [
      '94% CPT 99215 billed',
      'Network avg: 18%',
      '3 providers, same pattern',
      'AED 64,800 excess',
      'Dec 2025 – Apr 2026',
    ],
    evidenceText:
      '94% of consultations billed as CPT 99215 (highest complexity office visit, AED 800) versus 18% network average for this specialty mix. All 3 providers at Emirates Medical Center show identical anomalous pattern over 4 months. 91.8% Nabidh patient match confirms patients are real — complexity coding is inconsistent with diagnoses on file.',
    isNewToday: false,
    networkAvgPct: 18,
    subjectPct: 94,
    daysActive: 127,
    claimsHistory: [],
    dailyPattern: upcodingPattern,
  },
  {
    id: 'fraud-004',
    caseRef: 'FRAUD-20260404-004',
    riskLevel: 'HIGH',
    confidence: 81,
    type: 'Phantom Pharmacy',
    subjectName: 'Al Baraka Pharmacy',
    subjectRole: 'provider',
    subjectFacility: 'Al Baraka Pharmacy',
    subjectCity: 'Deira, Dubai',
    amountAtRisk: 18400,
    claimsTotal: 67,
    claimsFrozen: 12,
    claimsPaid: 55,
    amountPaid: 15100,
    patientsInvolved: 34,
    nabidhMatch: 0,
    nabidhTotal: 67,
    flaggedAt: '4 Apr 2026, 3:00 PM',
    flaggedAtDisplay: '4 Apr 2026',
    startDate: '10 Mar 2026',
    status: 'UNDER_REVIEW',
    assignedTo: 'Mariam Al Khateeb',
    aiReasoning:
      'Pharmacy dispensing without valid prescriptions. 67 pharmacy claims submitted with no traceable prescription source in CeenAiX or Nabidh. Controlled substances represent 23% of claims (15 claims). Potential drug diversion scheme. Pharmacy joined CeenAiX 28 Feb 2026 — claims started 10 days later.',
    aiRecommendations: [
      'Freeze remaining claims',
      'Request prescription records',
      'MOH controlled substance audit',
      'Possible criminal referral',
    ],
    evidencePills: [
      '67 claims, 0 prescriptions',
      '23% controlled substances',
      'No Nabidh RX records',
      'AED 18,400 total',
    ],
    evidenceText:
      '67 pharmacy claims submitted for medications without any corresponding doctor prescriptions in CeenAiX or Nabidh national health records. 15 of 67 claims (23%) involve controlled substances. This pattern is consistent with a drug diversion scheme where medications are dispensed without valid medical authorization.',
    isNewToday: false,
    controlledSubstancesPct: 23,
    daysActive: 28,
    claimsHistory: [],
    dailyPattern: [
      { day: 'Mar 10', count: 4 }, { day: 'Mar 15', count: 6 }, { day: 'Mar 20', count: 5 },
      { day: 'Mar 25', count: 7 }, { day: 'Mar 31', count: 6 }, { day: 'Apr 4', count: 8 },
    ],
  },
  {
    id: 'fraud-005',
    caseRef: 'FRAUD-20260401-005',
    riskLevel: 'MEDIUM',
    confidence: 68,
    type: 'Out-of-Hours Pattern',
    subjectName: 'City Health Clinic',
    subjectRole: 'provider',
    subjectFacility: 'City Health Clinic',
    subjectCity: 'Dubai',
    amountAtRisk: 11800,
    claimsTotal: 89,
    claimsFrozen: 0,
    claimsPaid: 31,
    amountPaid: 4100,
    patientsInvolved: 62,
    nabidhMatch: 41,
    nabidhTotal: 62,
    flaggedAt: '1 Apr 2026, 8:00 AM',
    flaggedAtDisplay: '1 Apr 2026',
    startDate: '10 Mar 2026',
    status: 'MONITORING',
    assignedTo: null,
    aiReasoning:
      'Temporal anomaly — billing patterns inconsistent with facility type. 89% of claims submitted between 11 PM and 2 AM over 3 weeks. Clinic is outpatient only (no 24-hour license). May indicate backdated claims or unauthorized after-hours operations. Lower confidence assigned as 66% of patients have Nabidh records, suggesting some legitimate activity.',
    aiRecommendations: [
      'Request facility operating hours',
      'Cross-check with DHA licensing',
      'Monitor for 14 days',
      'Site inspection if pattern continues',
    ],
    evidencePills: [
      '89% claims 11PM–2AM',
      'Outpatient only clinic',
      '66% Nabidh match',
      'AED 11,800 total',
      '3 weeks pattern',
    ],
    evidenceText:
      '89% of claims from City Health Clinic submitted between 11 PM and 2 AM over a 3-week period. The facility holds an outpatient-only license with no after-hours authorization. Some patient records found in Nabidh, suggesting the clinic may be legitimate but backdating claims, or operating beyond their licensed hours.',
    isNewToday: false,
    daysActive: 21,
    claimsHistory: [],
    dailyPattern: [
      { day: 'Mar 10', count: 5 }, { day: 'Mar 12', count: 6 }, { day: 'Mar 14', count: 4 },
      { day: 'Mar 17', count: 6 }, { day: 'Mar 20', count: 5 }, { day: 'Mar 24', count: 7 },
      { day: 'Mar 28', count: 6 }, { day: 'Apr 1', count: 4 },
    ],
  },
];

// ── Resolved cases ─────────────────────────────────────────────────────────────

export const resolvedCases: ResolvedCase[] = [
  {
    id: 'res-001',
    caseRef: 'FRAUD-20260310-091',
    type: 'Ghost Consultations',
    subject: 'Dr. Yousuf Malik',
    outcome: 'CONFIRMED',
    amount: 47200,
    closedDate: '15 Mar 2026',
    dhaReported: true,
    note: 'AED 47,200 recovered. Provider DHA license suspended. Criminal referral to Dubai Police.',
  },
  {
    id: 'res-002',
    caseRef: 'FRAUD-20260318-047',
    type: 'Ghost Consultations',
    subject: 'Dr. Samira Al Rashidi',
    outcome: 'FALSE_POSITIVE',
    amount: 0,
    closedDate: '19 Mar 2026',
    dhaReported: false,
    note: 'High-volume specialist clinic — legitimate. Provider notified and cleared. AI model feedback submitted.',
  },
  {
    id: 'res-003',
    caseRef: 'FRAUD-20260325-062',
    type: 'Duplicate Billing',
    subject: 'Al Noor Medical Center (Deira branch)',
    outcome: 'CONFIRMED',
    amount: 8400,
    closedDate: '28 Mar 2026',
    dhaReported: true,
    note: 'AED 8,400 recovered. Billing error (not malicious). Provider educated and corrected.',
  },
  {
    id: 'res-004',
    caseRef: 'FRAUD-20260302-031',
    type: 'Upcoding',
    subject: 'Gulf Medical Centre',
    outcome: 'CONFIRMED',
    amount: 124800,
    closedDate: '10 Mar 2026',
    dhaReported: true,
    note: 'AED 124,800 recouped. Systematic upcoding over 6 months. Facility fined.',
  },
  {
    id: 'res-005',
    caseRef: 'FRAUD-20260308-019',
    type: 'Phantom Pharmacy',
    subject: 'Nile Pharmacy (Al Nahda)',
    outcome: 'LEGAL',
    amount: 38600,
    closedDate: '12 Mar 2026',
    dhaReported: true,
    note: 'Referred to MOH for drug diversion investigation. AED 38,600 frozen pending legal proceedings.',
  },
];

// ── Analytics data ─────────────────────────────────────────────────────────────

export const monthlyFraudData = [
  { month: 'Jan', confirmed: 12, review: 4, falsePositive: 3 },
  { month: 'Feb', confirmed: 8, review: 2, falsePositive: 5 },
  { month: 'Mar', confirmed: 19, review: 5, falsePositive: 7 },
  { month: 'Apr', confirmed: 5, review: 3, falsePositive: 0 },
];

export const fraudByType = [
  { name: 'Ghost Consultations', value: 136000, fill: '#DC2626', pct: 64.4 },
  { name: 'Upcoding', value: 64800, fill: '#EA580C', pct: 30.7 },
  { name: 'Phantom Pharmacy', value: 18400, fill: '#F59E0B', pct: 8.7 },
  { name: 'Duplicate Billing', value: 28500, fill: '#D97706', pct: 13.5 },
];

export const aiAccuracyData = [
  { month: 'Jan', truePositive: 84, falsePositive: 8 },
  { month: 'Feb', truePositive: 86, falsePositive: 6.5 },
  { month: 'Mar', truePositive: 87.5, falsePositive: 5.2 },
  { month: 'Apr', truePositive: 89.1, falsePositive: 4.2 },
];

export const fraudByPlan = [
  { plan: 'Daman Gold', pct: 71, fill: '#F59E0B' },
  { plan: 'Daman Silver', pct: 19, fill: '#64748B' },
  { plan: 'Thiqa', pct: 7, fill: '#8B5CF6' },
  { plan: 'Daman Basic', pct: 3, fill: '#3B82F6' },
];
