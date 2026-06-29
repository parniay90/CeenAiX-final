// Network Providers mock data — Daman National Health Insurance

export type ProviderType = 'Doctor' | 'Hospital' | 'Clinic' | 'Pharmacy' | 'Diagnostic';
export type ProviderStatus = 'Active' | 'Pending' | 'Under Review' | 'Flagged' | 'Suspended' | 'Terminated';
export type FraudScore = 'LOW' | 'MEDIUM' | 'HIGH' | 'ACTIVE';
export type NetworkTier = 'Standard' | 'Premium' | 'Preferred';
export type PerformanceBand = 'excellent' | 'good' | 'average' | 'below' | 'flagged';

export function getPerformanceBand(denialRate: number, status: ProviderStatus): PerformanceBand {
  if (status === 'Flagged' || status === 'Suspended') return 'flagged';
  if (denialRate < 3) return 'excellent';
  if (denialRate < 5) return 'good';
  if (denialRate < 7) return 'average';
  return 'below';
}

export const perfBorderColor: Record<PerformanceBand, string> = {
  excellent: '#16A34A',
  good: '#0D9488',
  average: '#D97706',
  below: '#EA580C',
  flagged: '#DC2626',
};

export const perfBandLabel: Record<PerformanceBand, string> = {
  excellent: '⭐ Top Performer',
  good: '✅ Good',
  average: '⚠️ Average',
  below: '🔴 Below Avg',
  flagged: '🚩 Flagged',
};

export interface DenialSparkline {
  month: string;
  rate: number;
}

export interface NetworkProvider {
  id: string;
  type: ProviderType;
  name: string;
  nameAr?: string;
  dhaNumber: string;
  dhaValid: boolean;
  status: ProviderStatus;
  networkTier: NetworkTier;
  networkSince: string;
  networkSinceDisplay: string;
  specialty: string;
  subSpecialty?: string;
  location: string;
  emirate: 'Dubai' | 'Abu Dhabi' | 'Sharjah' | 'Ajman' | 'RAK' | 'Fujairah' | 'UAQ';
  facilityName?: string;
  claimsApril: number;
  claimsAllTime: number;
  avgClaim: number;
  specialtyAvgClaim: number;
  denialRate: number;
  denialSparkline: DenialSparkline[];
  rating: number | null;
  reviewCount: number;
  fraudScore: FraudScore;
  fraudNumericScore: number;
  fraudCaseRef?: string;
  contractExpiry: string;
  contractExpiryDays: number;
  paCompliance: number;
  overallScore: number;
  doctorCount?: number;
  isBoardCertified?: boolean;
  boardCerts?: string[];
  isOrgRow?: boolean;
  pendingInfo?: PendingInfo;
  reviewNote?: string;
  terminatedDate?: string;
  terminatedReason?: string;
  badges: string[];
  // map coordinates (relative %, UAE map)
  mapX: number;
  mapY: number;
}

export interface PendingInfo {
  appliedDate: string;
  waitingDays: number;
  docsComplete: number;
  docsTotal: number;
  missingDocs: string[];
  dhaVerified: boolean;
}

// ─── DENIAL SPARKLINE HELPERS ─────────────────────────────────────────────────
const flatTeal: DenialSparkline[] = [
  { month: 'Nov', rate: 2.4 }, { month: 'Dec', rate: 2.2 }, { month: 'Jan', rate: 2.0 },
  { month: 'Feb', rate: 2.3 }, { month: 'Mar', rate: 2.1 }, { month: 'Apr', rate: 2.1 },
];
const improvingGreen: DenialSparkline[] = [
  { month: 'Nov', rate: 5.2 }, { month: 'Dec', rate: 4.8 }, { month: 'Jan', rate: 4.2 },
  { month: 'Feb', rate: 3.8 }, { month: 'Mar', rate: 3.9 }, { month: 'Apr', rate: 3.9 },
];
const worseningAmber: DenialSparkline[] = [
  { month: 'Nov', rate: 4.1 }, { month: 'Dec', rate: 4.8 }, { month: 'Jan', rate: 5.4 },
  { month: 'Feb', rate: 6.1 }, { month: 'Mar', rate: 6.4 }, { month: 'Apr', rate: 6.8 },
];
const stableGood: DenialSparkline[] = [
  { month: 'Nov', rate: 4.1 }, { month: 'Dec', rate: 4.3 }, { month: 'Jan', rate: 4.0 },
  { month: 'Feb', rate: 4.2 }, { month: 'Mar', rate: 4.8 }, { month: 'Apr', rate: 4.8 },
];
const tooLow: DenialSparkline[] = [
  { month: 'Nov', rate: 0.4 }, { month: 'Dec', rate: 0.3 }, { month: 'Jan', rate: 0.2 },
  { month: 'Feb', rate: 0.1 }, { month: 'Mar', rate: 0.1 }, { month: 'Apr', rate: 0.1 },
];

// ─── PROVIDERS DATA ───────────────────────────────────────────────────────────
export const networkProviders: NetworkProvider[] = [
  {
    id: 'prov-001', type: 'Doctor', name: 'Dr. Ahmed Al Rashidi', nameAr: 'د. أحمد خالد الراشدي',
    dhaNumber: 'DHA-PRAC-2018-047821', dhaValid: true,
    status: 'Active', networkTier: 'Premium',
    networkSince: '2018-03-01', networkSinceDisplay: 'Mar 2018 (8y)',
    specialty: 'Cardiology', subSpecialty: 'Interventional Cardiology',
    location: 'Dubai · Jumeirah', emirate: 'Dubai', facilityName: 'Al Noor Medical Center',
    claimsApril: 127, claimsAllTime: 1247, avgClaim: 357, specialtyAvgClaim: 512,
    denialRate: 2.1, denialSparkline: flatTeal,
    rating: 4.9, reviewCount: 186, fraudScore: 'LOW', fraudNumericScore: 8,
    contractExpiry: 'Dec 2026', contractExpiryDays: 269, paCompliance: 94,
    overallScore: 94, isBoardCertified: true, boardCerts: ['FESC', 'ACC', 'Arabian Board'],
    badges: ['⭐ Premium Network', '🎓 Board Certified'],
    mapX: 62, mapY: 58,
  },
  {
    id: 'prov-002', type: 'Hospital', name: 'Al Noor Medical Center', isOrgRow: true,
    dhaNumber: 'DHA-FAC-2015-012847', dhaValid: true,
    status: 'Active', networkTier: 'Premium',
    networkSince: '2015-01-01', networkSinceDisplay: 'Jan 2015 (11y)',
    specialty: 'Multi-specialty', subSpecialty: '8 specialties',
    location: 'Dubai · Jumeirah', emirate: 'Dubai',
    claimsApril: 1247, claimsAllTime: 42184, avgClaim: 359, specialtyAvgClaim: 400,
    denialRate: 2.1, denialSparkline: flatTeal,
    rating: 4.7, reviewCount: 0, fraudScore: 'LOW', fraudNumericScore: 6,
    contractExpiry: 'Dec 2026', contractExpiryDays: 269, paCompliance: 96,
    overallScore: 95, doctorCount: 24,
    badges: ['⭐ Premium Network'],
    mapX: 63, mapY: 56,
  },
  {
    id: 'prov-003', type: 'Doctor', name: 'Dr. Maryam Al Farsi',
    dhaNumber: 'DHA-PRAC-2021-062841', dhaValid: true,
    status: 'Active', networkTier: 'Standard',
    networkSince: '2021-06-01', networkSinceDisplay: 'Jun 2021 (5y)',
    specialty: 'General Practice', location: 'Dubai · Al Barsha', emirate: 'Dubai',
    facilityName: 'Gulf Medical Center',
    claimsApril: 234, claimsAllTime: 3841, avgClaim: 392, specialtyAvgClaim: 410,
    denialRate: 3.9, denialSparkline: improvingGreen,
    rating: 4.6, reviewCount: 89, fraudScore: 'LOW', fraudNumericScore: 12,
    contractExpiry: 'Jun 2026', contractExpiryDays: 84, paCompliance: 91,
    overallScore: 87, badges: [],
    mapX: 60, mapY: 62,
  },
  {
    id: 'prov-004', type: 'Hospital', name: 'Dubai Specialist Hospital', isOrgRow: true,
    dhaNumber: 'DHA-FAC-2012-008241', dhaValid: true,
    status: 'Active', networkTier: 'Premium',
    networkSince: '2012-04-01', networkSinceDisplay: 'Apr 2012 (14y)',
    specialty: 'Multi-specialty', subSpecialty: '18 specialties',
    location: 'Dubai · Deira', emirate: 'Dubai',
    claimsApril: 892, claimsAllTime: 58241, avgClaim: 700, specialtyAvgClaim: 700,
    denialRate: 4.2, denialSparkline: stableGood,
    rating: 4.5, reviewCount: 0, fraudScore: 'LOW', fraudNumericScore: 9,
    contractExpiry: 'Mar 2027', contractExpiryDays: 341, paCompliance: 93,
    overallScore: 91, doctorCount: 67,
    badges: ['⭐ Premium Network'],
    mapX: 65, mapY: 54,
  },
  {
    id: 'prov-005', type: 'Doctor', name: 'Dr. Hessa Al Zaabi',
    dhaNumber: 'DHA-PRAC-2020-059841', dhaValid: true,
    status: 'Active', networkTier: 'Standard',
    networkSince: '2020-09-01', networkSinceDisplay: 'Sep 2020 (6y)',
    specialty: 'Orthopedic Surgery', location: 'Dubai · Healthcare City', emirate: 'Dubai',
    facilityName: 'Emirates Specialty Hospital',
    claimsApril: 54, claimsAllTime: 847, avgClaim: 1847, specialtyAvgClaim: 2100,
    denialRate: 4.8, denialSparkline: stableGood,
    rating: 4.7, reviewCount: 61, fraudScore: 'LOW', fraudNumericScore: 14,
    contractExpiry: 'Dec 2026', contractExpiryDays: 269, paCompliance: 94,
    overallScore: 86, isBoardCertified: true, boardCerts: ['Arab Board Ortho'],
    badges: ['🎓 Board Certified'],
    mapX: 64, mapY: 60,
  },
  {
    id: 'prov-006', type: 'Diagnostic', name: 'Dubai Medical & Imaging Centre', isOrgRow: true,
    dhaNumber: 'DHA-FAC-2016-018472', dhaValid: true,
    status: 'Active', networkTier: 'Preferred',
    networkSince: '2016-02-01', networkSinceDisplay: 'Feb 2016 (10y)',
    specialty: 'Diagnostic & Imaging', subSpecialty: 'Radiology · Pathology',
    location: 'Dubai · Al Garhoud', emirate: 'Dubai',
    claimsApril: 634, claimsAllTime: 29847, avgClaim: 1557, specialtyAvgClaim: 1600,
    denialRate: 3.8, denialSparkline: improvingGreen,
    rating: 4.6, reviewCount: 0, fraudScore: 'LOW', fraudNumericScore: 11,
    contractExpiry: 'Feb 2027', contractExpiryDays: 311, paCompliance: 97,
    overallScore: 89, doctorCount: 20, badges: [],
    mapX: 66, mapY: 57,
  },
  {
    id: 'prov-007', type: 'Doctor', name: 'Dr. Fatima Al Mansoori',
    dhaNumber: 'DHA-PRAC-2019-054812', dhaValid: true,
    status: 'Active', networkTier: 'Standard',
    networkSince: '2019-11-01', networkSinceDisplay: 'Nov 2019 (7y)',
    specialty: 'Endocrinology', location: 'Dubai · Healthcare City', emirate: 'Dubai',
    facilityName: 'Dubai Specialist Hospital',
    claimsApril: 89, claimsAllTime: 1841, avgClaim: 400, specialtyAvgClaim: 450,
    denialRate: 4.9, denialSparkline: stableGood,
    rating: 4.8, reviewCount: 124, fraudScore: 'LOW', fraudNumericScore: 10,
    contractExpiry: 'Nov 2026', contractExpiryDays: 218, paCompliance: 92,
    overallScore: 89, badges: ['❤️ Best Rating'],
    mapX: 64, mapY: 59,
  },
  {
    id: 'prov-008', type: 'Pharmacy', name: 'Al Shifa Pharmacy Group', isOrgRow: true,
    dhaNumber: 'DHA-PHR-2014-005821', dhaValid: true,
    status: 'Active', networkTier: 'Preferred',
    networkSince: '2014-08-01', networkSinceDisplay: 'Aug 2014 (12y)',
    specialty: 'Pharmacy', subSpecialty: '8 Dubai locations',
    location: 'Dubai · Multiple', emirate: 'Dubai',
    claimsApril: 2841, claimsAllTime: 184721, avgClaim: 245, specialtyAvgClaim: 260,
    denialRate: 1.2, denialSparkline: flatTeal,
    rating: 4.4, reviewCount: 0, fraudScore: 'LOW', fraudNumericScore: 7,
    contractExpiry: 'Aug 2026', contractExpiryDays: 126, paCompliance: 99,
    overallScore: 93, doctorCount: 0, badges: ['⭐ Premium Network'],
    mapX: 61, mapY: 61,
  },
  {
    id: 'prov-009', type: 'Clinic', name: 'Emirates Medical Center', isOrgRow: true,
    dhaNumber: 'DHA-FAC-2017-022841', dhaValid: true,
    status: 'Under Review', networkTier: 'Standard',
    networkSince: '2017-03-01', networkSinceDisplay: 'Mar 2017 (9y)',
    specialty: 'Multi-specialty', subSpecialty: '34 doctors',
    location: 'Dubai · Bur Dubai', emirate: 'Dubai',
    claimsApril: 421, claimsAllTime: 18472, avgClaim: 687, specialtyAvgClaim: 500,
    denialRate: 6.8, denialSparkline: worseningAmber,
    rating: 4.1, reviewCount: 0, fraudScore: 'MEDIUM', fraudNumericScore: 62,
    contractExpiry: 'Mar 2027', contractExpiryDays: 341, paCompliance: 79,
    overallScore: 58, doctorCount: 34,
    badges: ['🔍 Under Review'],
    reviewNote: '⚠️ Upcoding investigation active — 94% CPT 99215 vs 18% network avg',
    mapX: 62, mapY: 60,
  },
  {
    id: 'prov-010', type: 'Doctor', name: 'Dr. Rashida Yousuf',
    dhaNumber: 'DHA-PRAC-2018-049214', dhaValid: true,
    status: 'Under Review', networkTier: 'Standard',
    networkSince: '2018-08-01', networkSinceDisplay: 'Aug 2018 (8y)',
    specialty: 'General Practice', location: 'Dubai · Bur Dubai', emirate: 'Dubai',
    facilityName: 'Emirates Medical Center',
    claimsApril: 147, claimsAllTime: 2847, avgClaim: 729, specialtyAvgClaim: 410,
    denialRate: 5.2, denialSparkline: worseningAmber,
    rating: 4.0, reviewCount: 34, fraudScore: 'MEDIUM', fraudNumericScore: 58,
    contractExpiry: 'Mar 2027', contractExpiryDays: 341, paCompliance: 77,
    overallScore: 55, badges: ['🔍 Under Review'],
    reviewNote: '94% CPT 99215 vs 18% avg — upcoding investigation (FRAUD-20260407-003)',
    mapX: 62, mapY: 61,
  },
  {
    id: 'prov-011', type: 'Clinic', name: 'Gulf Medical Center', isOrgRow: true,
    dhaNumber: 'DHA-FAC-2013-010284', dhaValid: true,
    status: 'Active', networkTier: 'Standard',
    networkSince: '2013-07-01', networkSinceDisplay: 'Jul 2013 (13y)',
    specialty: 'Multi-specialty', location: 'Dubai · Al Barsha', emirate: 'Dubai',
    claimsApril: 318, claimsAllTime: 22481, avgClaim: 400, specialtyAvgClaim: 420,
    denialRate: 4.5, denialSparkline: stableGood,
    rating: 4.3, reviewCount: 0, fraudScore: 'LOW', fraudNumericScore: 15,
    contractExpiry: 'Jul 2026', contractExpiryDays: 97, paCompliance: 88,
    overallScore: 82, doctorCount: 18, badges: [],
    mapX: 59, mapY: 63,
  },
  {
    id: 'prov-012', type: 'Doctor', name: 'Dr. Khalid Al Rashedi',
    dhaNumber: 'DHA-PRAC-2019-056481', dhaValid: true,
    status: 'Active', networkTier: 'Standard',
    networkSince: '2019-02-01', networkSinceDisplay: 'Feb 2019 (7y)',
    specialty: 'Neurology', location: 'Dubai · Healthcare City', emirate: 'Dubai',
    facilityName: 'Emirates Specialty Hospital',
    claimsApril: 47, claimsAllTime: 724, avgClaim: 1247, specialtyAvgClaim: 1400,
    denialRate: 4.7, denialSparkline: stableGood,
    rating: 4.5, reviewCount: 47, fraudScore: 'LOW', fraudNumericScore: 16,
    contractExpiry: 'Feb 2027', contractExpiryDays: 311, paCompliance: 89,
    overallScore: 83, badges: [],
    mapX: 64, mapY: 58,
  },
  {
    id: 'prov-013', type: 'Doctor', name: 'Dr. Rania Al Suwaidi',
    dhaNumber: 'DHA-PRAC-2017-044128', dhaValid: true,
    status: 'Active', networkTier: 'Premium',
    networkSince: '2017-05-01', networkSinceDisplay: 'May 2017 (9y)',
    specialty: 'Cardiology', location: 'Dubai · Healthcare City', emirate: 'Dubai',
    facilityName: 'Dubai Specialist Hospital',
    claimsApril: 89, claimsAllTime: 1847, avgClaim: 891, specialtyAvgClaim: 512,
    denialRate: 3.1, denialSparkline: improvingGreen,
    rating: 4.8, reviewCount: 203, fraudScore: 'LOW', fraudNumericScore: 9,
    contractExpiry: 'May 2027', contractExpiryDays: 372, paCompliance: 96,
    overallScore: 91, isBoardCertified: true, boardCerts: ['FESC', 'FACC'],
    badges: ['⭐ Premium Network', '🎓 Board Certified'],
    mapX: 65, mapY: 59,
  },
  {
    id: 'prov-014', type: 'Doctor', name: 'Dr. Khalid Ibrahim',
    dhaNumber: 'DHA-PRAC-2023-084721', dhaValid: true,
    status: 'Suspended', networkTier: 'Standard',
    networkSince: '2023-06-01', networkSinceDisplay: 'Jun 2023 (3y)',
    specialty: 'General Practice', location: 'Dubai · Al Qusais', emirate: 'Dubai',
    facilityName: 'Unnamed Clinic',
    claimsApril: 340, claimsAllTime: 341, avgClaim: 400, specialtyAvgClaim: 410,
    denialRate: 0.1, denialSparkline: tooLow,
    rating: null, reviewCount: 0, fraudScore: 'ACTIVE', fraudNumericScore: 94,
    fraudCaseRef: 'FRAUD-20260407-001',
    contractExpiry: 'Jun 2026', contractExpiryDays: 84, paCompliance: 0,
    overallScore: 5, badges: ['🔒 Fraud Active'],
    reviewNote: 'All 340 April claims frozen · Ghost consultations confirmed',
    mapX: 67, mapY: 55,
  },
  {
    id: 'prov-015', type: 'Doctor', name: 'Dr. Noura Al Mazrouei',
    dhaNumber: 'DHA-PRAC-2023-087421', dhaValid: true,
    status: 'Pending', networkTier: 'Standard',
    networkSince: '', networkSinceDisplay: 'Not yet active',
    specialty: 'Pediatrics', location: 'Dubai · Jumeirah', emirate: 'Dubai',
    facilityName: 'Dubai Children\'s Medical Center',
    claimsApril: 0, claimsAllTime: 0, avgClaim: 0, specialtyAvgClaim: 380,
    denialRate: 0, denialSparkline: [],
    rating: null, reviewCount: 0, fraudScore: 'LOW', fraudNumericScore: 0,
    contractExpiry: '', contractExpiryDays: 0, paCompliance: 0,
    overallScore: 0, badges: ['⏳ Pending'],
    pendingInfo: {
      appliedDate: '3 Apr 2026', waitingDays: 4, docsComplete: 6, docsTotal: 6,
      missingDocs: [], dhaVerified: true,
    },
    mapX: 63, mapY: 57,
  },
];

// ─── PENDING CREDENTIALING ────────────────────────────────────────────────────
export const pendingProviders = [
  {
    id: 'pend-001', name: 'Dr. Noura Al Mazrouei', role: 'Pediatrician',
    clinic: 'Dubai Children\'s Medical Center', dha: 'DHA-PRAC-2023-087421',
    dhaVerified: true, appliedDate: '3 Apr 2026', waitingDays: 4,
    docsComplete: 6, docsTotal: 6, missingDocs: [], status: 'ready' as const,
  },
  {
    id: 'pend-002', name: 'City Health Diagnostics', role: 'Diagnostic Laboratory',
    clinic: 'Deira, Dubai', dha: 'DHA-LAB-2024-002847',
    dhaVerified: true, appliedDate: '1 Apr 2026', waitingDays: 6,
    docsComplete: 6, docsTotal: 6, missingDocs: [], status: 'ready' as const,
  },
  {
    id: 'pend-003', name: 'Dr. Omar Al Hussein', role: 'Neurologist',
    clinic: 'Al Rashid Medical Center, Sharjah', dha: 'DHA-PRAC-2024-091234',
    dhaVerified: true, appliedDate: '5 Apr 2026', waitingDays: 2,
    docsComplete: 5, docsTotal: 6, missingDocs: ['Board Certificate'], status: 'incomplete' as const,
  },
  {
    id: 'pend-004', name: 'Dr. Sara Al Hammadi', role: 'Dermatologist',
    clinic: 'Skin & Laser Clinic, Dubai', dha: 'DHA-PRAC-2024-092841',
    dhaVerified: true, appliedDate: '4 Apr 2026', waitingDays: 3,
    docsComplete: 5, docsTotal: 6, missingDocs: ['Passport Copy'], status: 'incomplete' as const,
  },
  {
    id: 'pend-005', name: 'Wellness Clinic JLT', role: 'Medical Clinic',
    clinic: 'Jumeirah Lake Towers, Dubai', dha: 'DHA-FAC-2024-004821',
    dhaVerified: false, appliedDate: '2 Apr 2026', waitingDays: 5,
    docsComplete: 4, docsTotal: 6, missingDocs: ['DHA Facility License', 'Insurance Certificate'], status: 'dha_issue' as const,
  },
];

// ─── TERMINATED PROVIDERS ─────────────────────────────────────────────────────
export const terminatedProviders = [
  {
    id: 'term-001', name: 'Dr. Yousuf Malik', specialty: 'General Practice',
    dha: 'DHA-PRAC-2019-051247', terminatedDate: '15 March 2026',
    reason: 'Fraud confirmed — ghost consultations (84 claims over 3 months)',
    dhaReportSubmitted: true, amountRecovered: 47200, fraudCaseRef: 'FRAUD-20260114-001',
  },
  {
    id: 'term-002', name: 'Medifast Clinic', specialty: 'General Practice',
    dha: 'DHA-FAC-2011-004127', terminatedDate: '1 February 2026',
    reason: 'DHA facility license expired — clinic failed to renew',
    dhaReportSubmitted: false, amountRecovered: 0,
  },
];

// ─── NETWORK SUMMARY ──────────────────────────────────────────────────────────
export const networkSummary = {
  totalProviders: 881,
  totalDoctors: 847,
  totalOrganizations: 34,
  pendingCredentialing: 12,
  underReview: 3,
  flagged: 3,
  terminated: 2,
  avgDenialRate: 4.7,
  avgClaimValue: 512,
  avgRating: 4.4,
  coverageByEmirate: [
    { emirate: 'Dubai', count: 512, status: 'good' as const },
    { emirate: 'Abu Dhabi', count: 178, status: 'good' as const },
    { emirate: 'Sharjah', count: 94, status: 'good' as const },
    { emirate: 'Ajman', count: 28, status: 'warn' as const },
    { emirate: 'RAK', count: 21, status: 'warn' as const },
    { emirate: 'Fujairah', count: 10, status: 'critical' as const },
    { emirate: 'UAQ', count: 4, status: 'critical' as const },
  ],
  specialtyDistribution: [
    { specialty: 'General Practice', count: 234, pct: 27.6 },
    { specialty: 'Cardiology', count: 89, pct: 10.5 },
    { specialty: 'Dermatology', count: 72, pct: 8.5 },
    { specialty: 'Orthopedics', count: 68, pct: 8.0 },
    { specialty: 'Endocrinology', count: 64, pct: 7.6 },
    { specialty: 'Pediatrics', count: 58, pct: 6.9 },
    { specialty: 'Neurology', count: 47, pct: 5.6 },
    { specialty: 'Psychiatry', count: 41, pct: 4.8 },
    { specialty: 'Radiology', count: 38, pct: 4.5 },
    { specialty: 'Other', count: 136, pct: 16.1 },
  ],
};

// ─── PROVIDER CLAIM HISTORY (for Dr. Ahmed drawer) ───────────────────────────
export const ahmedClaimsHistory = [
  { date: '7 Apr', claimId: 'CLM-2026-00481', plan: 'Daman Gold', service: 'Cardiology Consultation', amount: 360, status: 'Approved' as const },
  { date: '7 Apr', claimId: 'CLM-2026-00289', plan: 'Thiqa', service: 'Echocardiogram Review', amount: 800, status: 'Approved' as const },
  { date: '5 Apr', claimId: 'CLM-2026-00248', plan: 'Daman Silver', service: 'Cardiac Follow-up', amount: 320, status: 'Approved' as const },
  { date: '4 Apr', claimId: 'CLM-2026-00214', plan: 'Daman Enhanced', service: 'Stress ECG', amount: 480, status: 'Approved' as const },
  { date: '3 Apr', claimId: 'CLM-2026-00187', plan: 'Daman Gold', service: 'Consultation', amount: 360, status: 'Denied' as const },
  { date: '2 Apr', claimId: 'CLM-2026-00162', plan: 'Daman Essential', service: 'Cardiology Review', amount: 310, status: 'Approved' as const },
];

export const ahmedMonthlyTrend = [
  { month: 'Jan', amount: 41200, claims: 112 },
  { month: 'Feb', amount: 38900, claims: 104 },
  { month: 'Mar', amount: 48400, claims: 131 },
  { month: 'Apr', amount: 45300, claims: 127 },
];
