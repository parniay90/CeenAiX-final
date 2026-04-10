export interface ModelMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  sparklineData: number[];
}

export interface FeatureUsage {
  name: string;
  percentage: number;
  count: number;
  color: string;
}

export interface SpecialtyPerformance {
  specialty: string;
  interactions: number;
  accuracy: number;
  feedbackScore: number;
}

export interface BiasMetric {
  category: string;
  group: string;
  accuracy: number;
  sampleSize: number;
}

export interface HealthCondition {
  id: string;
  name: string;
  isDhaReportable: boolean;
}

export interface EmirateHealthData {
  emirate: string;
  prevalence: number;
  population: number;
  cases: number;
  lat: number;
  lng: number;
}

export interface DemographicData {
  ageGroups: { label: string; male: number; female: number }[];
  genderSplit: { gender: string; percentage: number }[];
  nationalityDistribution: { nationality: string; percentage: number }[];
}

export interface TrendData {
  month: string;
  incidenceRate: number;
  hospitalizationRate: number;
  screeningCompletionRate: number;
}

export interface PlatformMetric {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

export interface UserAcquisition {
  portalType: string;
  count: number;
  percentage: number;
}

export interface FeatureAdoption {
  feature: string;
  patient: number;
  doctor: number;
  pharmacy: number;
  lab: number;
}

export interface OrgPerformance {
  orgName: string;
  metric: number;
  ranking: number;
}

export interface RevenueData {
  month: string;
  subscription: number;
  transaction: number;
  total: number;
}

export interface PredictiveModel {
  id: string;
  name: string;
  description: string;
  trainingDataSize: number;
  lastRetrained: Date;
  validationAuc: number;
  activePredictionsToday: number;
  dhaApprovalStatus: 'approved' | 'pending' | 'under_review';
  category: 'diabetes' | 'hypertension' | 'readmission' | 'adherence' | 'sepsis';
}

export interface RiskPrediction {
  patientId: string;
  riskScore: number;
  riskType: string;
  recommendedAction: string;
  lastUpdated: Date;
}

export const HEALTH_CONDITIONS: HealthCondition[] = [
  { id: 'diabetes', name: 'Diabetes', isDhaReportable: true },
  { id: 'hypertension', name: 'Hypertension', isDhaReportable: true },
  { id: 'obesity', name: 'Obesity', isDhaReportable: false },
  { id: 'cvd', name: 'Cardiovascular Disease', isDhaReportable: true },
  { id: 'copd', name: 'COPD', isDhaReportable: true },
  { id: 'asthma', name: 'Asthma', isDhaReportable: false },
  { id: 'ckd', name: 'Chronic Kidney Disease', isDhaReportable: true },
];

export const EMIRATES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah',
];

export const MOCK_MODEL_METRICS: ModelMetric[] = [
  {
    name: 'Clinical Decision Accuracy',
    value: 94.7,
    unit: '%',
    trend: 'up',
    trendValue: 1.2,
    sparklineData: [92.1, 92.8, 93.2, 93.5, 93.9, 94.1, 94.3, 94.7],
  },
  {
    name: 'Prescription Interaction Catch Rate',
    value: 99.1,
    unit: '%',
    trend: 'stable',
    trendValue: 0.1,
    sparklineData: [98.9, 99.0, 99.1, 99.0, 99.1, 99.2, 99.1, 99.1],
  },
  {
    name: 'Diagnostic Suggestion Acceptance',
    value: 67.3,
    unit: '%',
    trend: 'up',
    trendValue: 3.4,
    sparklineData: [63.2, 64.1, 64.9, 65.7, 66.2, 66.8, 67.0, 67.3],
  },
  {
    name: 'False Positive Rate',
    value: 4.2,
    unit: '%',
    trend: 'down',
    trendValue: -0.8,
    sparklineData: [5.1, 4.9, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2],
  },
];

export const MOCK_FEATURE_USAGE: FeatureUsage[] = [
  { name: 'Clinical Decision Support', percentage: 34, count: 12847, color: '#8b5cf6' },
  { name: 'Drug Interaction Checker', percentage: 28, count: 10584, color: '#06b6d4' },
  { name: 'Health Score', percentage: 22, count: 8316, color: '#14b8a6' },
  { name: 'Chatbot', percentage: 16, count: 6048, color: '#64748b' },
];

export const MOCK_SPECIALTY_PERFORMANCE: SpecialtyPerformance[] = [
  { specialty: 'Cardiology', interactions: 3421, accuracy: 96.2, feedbackScore: 4.7 },
  { specialty: 'Endocrinology', interactions: 2837, accuracy: 95.8, feedbackScore: 4.6 },
  { specialty: 'Internal Medicine', interactions: 5124, accuracy: 94.1, feedbackScore: 4.5 },
  { specialty: 'Pediatrics', interactions: 1893, accuracy: 93.7, feedbackScore: 4.4 },
  { specialty: 'Neurology', interactions: 1456, accuracy: 92.9, feedbackScore: 4.3 },
];

export const MOCK_BIAS_METRICS: BiasMetric[] = [
  { category: 'Age', group: '18-30', accuracy: 94.2, sampleSize: 1247 },
  { category: 'Age', group: '31-45', accuracy: 94.9, sampleSize: 2841 },
  { category: 'Age', group: '46-60', accuracy: 94.5, sampleSize: 3124 },
  { category: 'Age', group: '61+', accuracy: 94.8, sampleSize: 1956 },
  { category: 'Gender', group: 'Male', accuracy: 94.6, sampleSize: 4832 },
  { category: 'Gender', group: 'Female', accuracy: 94.8, sampleSize: 4336 },
  { category: 'Nationality', group: 'UAE National', accuracy: 94.7, sampleSize: 2156 },
  { category: 'Nationality', group: 'Expat', accuracy: 94.7, sampleSize: 7012 },
];

export const MOCK_PREDICTIVE_MODELS: PredictiveModel[] = [
  {
    id: 'model-1',
    name: 'Diabetes Complication Risk',
    description: 'Predicts risk of diabetic complications within 12 months',
    trainingDataSize: 125847,
    lastRetrained: new Date('2026-03-15'),
    validationAuc: 0.89,
    activePredictionsToday: 3421,
    dhaApprovalStatus: 'approved',
    category: 'diabetes',
  },
  {
    id: 'model-2',
    name: 'Hypertension Event Risk',
    description: 'Predicts cardiovascular events in hypertensive patients',
    trainingDataSize: 98234,
    lastRetrained: new Date('2026-03-10'),
    validationAuc: 0.85,
    activePredictionsToday: 2847,
    dhaApprovalStatus: 'approved',
    category: 'hypertension',
  },
  {
    id: 'model-3',
    name: 'Readmission Risk',
    description: '30-day hospital readmission prediction',
    trainingDataSize: 67891,
    lastRetrained: new Date('2026-03-20'),
    validationAuc: 0.82,
    activePredictionsToday: 1567,
    dhaApprovalStatus: 'approved',
    category: 'readmission',
  },
  {
    id: 'model-4',
    name: 'Drug Adherence Prediction',
    description: 'Predicts medication non-adherence risk',
    trainingDataSize: 145672,
    lastRetrained: new Date('2026-04-01'),
    validationAuc: 0.78,
    activePredictionsToday: 4132,
    dhaApprovalStatus: 'under_review',
    category: 'adherence',
  },
  {
    id: 'model-5',
    name: 'Sepsis Early Warning',
    description: 'Early detection of sepsis onset in hospitalized patients',
    trainingDataSize: 34567,
    lastRetrained: new Date('2026-03-28'),
    validationAuc: 0.91,
    activePredictionsToday: 892,
    dhaApprovalStatus: 'approved',
    category: 'sepsis',
  },
];

export const MOCK_RISK_PREDICTIONS: RiskPrediction[] = [
  {
    patientId: 'PT-8934',
    riskScore: 92.4,
    riskType: 'Sepsis Early Warning',
    recommendedAction: 'Immediate ICU assessment',
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    patientId: 'PT-7821',
    riskScore: 88.7,
    riskType: 'Diabetes Complication',
    recommendedAction: 'Schedule urgent endocrinology consult',
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    patientId: 'PT-6745',
    riskScore: 86.2,
    riskType: 'Hypertension Event',
    recommendedAction: 'Review medication regimen, increase monitoring',
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    patientId: 'PT-5623',
    riskScore: 84.9,
    riskType: 'Readmission Risk',
    recommendedAction: 'Arrange home health visit within 48h',
    lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    patientId: 'PT-4512',
    riskScore: 81.3,
    riskType: 'Drug Non-Adherence',
    recommendedAction: 'Pharmacist counseling session',
    lastUpdated: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    patientId: 'PT-3401',
    riskScore: 79.8,
    riskType: 'Diabetes Complication',
    recommendedAction: 'Intensify glucose monitoring',
    lastUpdated: new Date(Date.now() - 10 * 60 * 60 * 1000),
  },
  {
    patientId: 'PT-2289',
    riskScore: 77.5,
    riskType: 'Sepsis Early Warning',
    recommendedAction: 'Increase vital signs monitoring frequency',
    lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    patientId: 'PT-1178',
    riskScore: 75.2,
    riskType: 'Hypertension Event',
    recommendedAction: 'Schedule cardiology follow-up',
    lastUpdated: new Date(Date.now() - 14 * 60 * 60 * 1000),
  },
  {
    patientId: 'PT-9067',
    riskScore: 73.6,
    riskType: 'Readmission Risk',
    recommendedAction: 'Care coordination team contact',
    lastUpdated: new Date(Date.now() - 16 * 60 * 60 * 1000),
  },
  {
    patientId: 'PT-8956',
    riskScore: 71.9,
    riskType: 'Drug Non-Adherence',
    recommendedAction: 'Patient education session',
    lastUpdated: new Date(Date.now() - 18 * 60 * 60 * 1000),
  },
];
