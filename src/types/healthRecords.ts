export interface HealthTimelineEvent {
  id: string;
  eventType: 'visit' | 'diagnosis' | 'prescription' | 'lab';
  eventTitle: string;
  providerName: string;
  eventDate: Date;
  details?: any;
}

export interface ActiveCondition {
  id: string;
  conditionName: string;
  icd10Code: string;
  onsetDate: Date;
  managingDoctor: string;
  status: 'Active' | 'Controlled' | 'Resolved';
  notes?: string;
}

export interface PatientMedication {
  id: string;
  drugName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  prescribingDoctor: string;
  prescribedDate: Date;
  refillDate: Date;
  quantityRemaining: number;
  totalQuantity: number;
  status: 'Active' | 'Stopped' | 'NeedsRefill';
  interactionWarnings: string[];
}

export interface PatientAllergy {
  id: string;
  allergenName: string;
  category: 'Drug' | 'Food' | 'Environmental' | 'Latex';
  reactionDescription: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Anaphylaxis';
  discoveryDate: Date;
  onEmergencyCard: boolean;
}

export interface LabResult {
  id: string;
  testName: string;
  testType: string;
  collectionDate: Date;
  labName: string;
  resultValue: string;
  referenceRange: string;
  unit: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
  aiInterpretation?: string;
  fileUrl?: string;
}

export interface VitalLog {
  id: string;
  recordedAt: Date;
  systolicBp?: number;
  diastolicBp?: number;
  heartRate?: number;
  bloodSugar?: number;
  bloodSugarTiming?: 'pre_meal' | 'post_meal' | 'fasting';
  weight?: number;
  temperature?: number;
  spo2?: number;
  source: 'manual' | 'apple_health' | 'google_fit' | 'fitbit';
}

export interface Vaccination {
  id: string;
  vaccineName: string;
  diseaseTarget: string;
  doseNumber: number;
  administrationDate: Date;
  administrator: string;
  location: string;
  lotNumber: string;
  nextDoseDue?: Date;
}

// ── Medical History interfaces ────────────────────────────────────────────────
export interface PastCondition {
  condition: string;
  diagnosed: string;
  resolved: string;
  doctor: string;
  notes: string;
}

export interface Surgery {
  procedure: string;
  date: string;
  hospital: string;
  surgeon: string;
  notes: string;
}

export interface Hospitalization {
  reason: string;
  hospital: string;
  admitted: string;
  discharged: string;
  days: number;
}

export interface SocialHistoryItem {
  label: string;
  value: string;
}

// ── Existing mock data (unchanged) ───────────────────────────────────────────
export const MOCK_TIMELINE_EVENTS: HealthTimelineEvent[] = [
  {
    id: '1',
    eventType: 'lab',
    eventTitle: 'HbA1c Blood Test',
    providerName: 'Dubai Healthcare City Laboratory',
    eventDate: new Date('2026-04-05'),
  },
  {
    id: '2',
    eventType: 'prescription',
    eventTitle: 'Metformin prescription renewed',
    providerName: 'Dr. Mohammed Al Zarooni',
    eventDate: new Date('2026-04-01'),
  },
  {
    id: '3',
    eventType: 'visit',
    eventTitle: 'Cardiology follow-up visit',
    providerName: 'Dr. Sarah Johnson - Dubai Healthcare City',
    eventDate: new Date('2026-03-28'),
  },
  {
    id: '4',
    eventType: 'diagnosis',
    eventTitle: 'Type 2 Diabetes Mellitus diagnosed',
    providerName: 'Dr. Mohammed Al Zarooni - Mediclinic Dubai Mall',
    eventDate: new Date('2025-11-15'),
  },
  {
    id: '5',
    eventType: 'lab',
    eventTitle: 'Lipid Panel',
    providerName: 'Cleveland Clinic Abu Dhabi Laboratory',
    eventDate: new Date('2026-03-15'),
  },
];

export const MOCK_ACTIVE_CONDITIONS: ActiveCondition[] = [
  {
    id: '1',
    conditionName: 'Type 2 Diabetes Mellitus',
    icd10Code: 'E11.9',
    onsetDate: new Date('2025-11-15'),
    managingDoctor: 'Dr. Mohammed Al Zarooni',
    status: 'Controlled',
  },
  {
    id: '2',
    conditionName: 'Essential Hypertension',
    icd10Code: 'I10',
    onsetDate: new Date('2024-06-20'),
    managingDoctor: 'Dr. Sarah Johnson',
    status: 'Active',
  },
  {
    id: '3',
    conditionName: 'Hyperlipidemia',
    icd10Code: 'E78.5',
    onsetDate: new Date('2024-08-10'),
    managingDoctor: 'Dr. Sarah Johnson',
    status: 'Controlled',
  },
];

export const MOCK_PATIENT_MEDICATIONS: PatientMedication[] = [
  {
    id: '1',
    drugName: 'Glucophage',
    genericName: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily with meals',
    prescribingDoctor: 'Dr. Mohammed Al Zarooni',
    prescribedDate: new Date('2025-11-15'),
    refillDate: new Date('2026-04-12'),
    quantityRemaining: 15,
    totalQuantity: 60,
    status: 'NeedsRefill',
    interactionWarnings: [],
  },
  {
    id: '2',
    drugName: 'Zestril',
    genericName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    prescribingDoctor: 'Dr. Sarah Johnson',
    prescribedDate: new Date('2024-06-20'),
    refillDate: new Date('2026-05-20'),
    quantityRemaining: 45,
    totalQuantity: 90,
    status: 'Active',
    interactionWarnings: [],
  },
  {
    id: '3',
    drugName: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    dosage: '81mg',
    frequency: 'Once daily',
    prescribingDoctor: 'Dr. Sarah Johnson',
    prescribedDate: new Date('2024-07-01'),
    refillDate: new Date('2026-06-01'),
    quantityRemaining: 60,
    totalQuantity: 90,
    status: 'Active',
    interactionWarnings: [],
  },
  {
    id: '4',
    drugName: 'Lipitor',
    genericName: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily at bedtime',
    prescribingDoctor: 'Dr. Sarah Johnson',
    prescribedDate: new Date('2024-08-10'),
    refillDate: new Date('2026-05-10'),
    quantityRemaining: 30,
    totalQuantity: 90,
    status: 'Active',
    interactionWarnings: [],
  },
];

export const MOCK_PATIENT_ALLERGIES: PatientAllergy[] = [
  {
    id: '1',
    allergenName: 'Penicillin',
    category: 'Drug',
    reactionDescription: 'Severe rash and difficulty breathing',
    severity: 'Severe',
    discoveryDate: new Date('2010-03-15'),
    onEmergencyCard: true,
  },
  {
    id: '2',
    allergenName: 'Peanuts',
    category: 'Food',
    reactionDescription: 'Hives and swelling',
    severity: 'Moderate',
    discoveryDate: new Date('2008-06-20'),
    onEmergencyCard: true,
  },
  {
    id: '3',
    allergenName: 'Shellfish',
    category: 'Food',
    reactionDescription: 'Stomach upset and nausea',
    severity: 'Mild',
    discoveryDate: new Date('2015-09-10'),
    onEmergencyCard: false,
  },
];

export const MOCK_LAB_RESULTS: LabResult[] = [
  {
    id: '1',
    testName: 'HbA1c (Glycated Hemoglobin)',
    testType: 'Blood Chemistry',
    collectionDate: new Date('2026-04-05'),
    labName: 'Dubai Healthcare City Laboratory',
    resultValue: '6.8',
    referenceRange: '4.0 - 5.6',
    unit: '%',
    status: 'Abnormal',
    aiInterpretation: 'Your HbA1c has improved 0.4% since last quarter — good progress on diabetes management. Continue current treatment plan.',
  },
  {
    id: '2',
    testName: 'Total Cholesterol',
    testType: 'Lipid Panel',
    collectionDate: new Date('2026-03-15'),
    labName: 'Cleveland Clinic Abu Dhabi Laboratory',
    resultValue: '185',
    referenceRange: '< 200',
    unit: 'mg/dL',
    status: 'Normal',
  },
  {
    id: '3',
    testName: 'LDL Cholesterol',
    testType: 'Lipid Panel',
    collectionDate: new Date('2026-03-15'),
    labName: 'Cleveland Clinic Abu Dhabi Laboratory',
    resultValue: '105',
    referenceRange: '< 100',
    unit: 'mg/dL',
    status: 'Abnormal',
    aiInterpretation: 'LDL cholesterol is slightly elevated. Consider dietary modifications and ensure statin medication compliance.',
  },
  {
    id: '4',
    testName: 'Creatinine',
    testType: 'Kidney Function',
    collectionDate: new Date('2026-02-20'),
    labName: 'Mediclinic Dubai Mall Laboratory',
    resultValue: '1.1',
    referenceRange: '0.7 - 1.3',
    unit: 'mg/dL',
    status: 'Normal',
  },
];

export const MOCK_VITALS_LOG: VitalLog[] = [
  {
    id: '1',
    recordedAt: new Date('2026-04-07'),
    systolicBp: 138,
    diastolicBp: 88,
    heartRate: 72,
    bloodSugar: 125,
    bloodSugarTiming: 'fasting',
    weight: 85.2,
    spo2: 98,
    source: 'manual',
  },
  {
    id: '2',
    recordedAt: new Date('2026-04-06'),
    systolicBp: 142,
    diastolicBp: 90,
    heartRate: 75,
    bloodSugar: 118,
    bloodSugarTiming: 'fasting',
    weight: 85.5,
    spo2: 97,
    source: 'manual',
  },
  {
    id: '3',
    recordedAt: new Date('2026-04-05'),
    systolicBp: 135,
    diastolicBp: 86,
    heartRate: 70,
    bloodSugar: 130,
    bloodSugarTiming: 'post_meal',
    weight: 85.3,
    spo2: 98,
    source: 'apple_health',
  },
];

export const MOCK_VACCINATIONS: Vaccination[] = [
  {
    id: '1',
    vaccineName: 'Influenza Vaccine',
    diseaseTarget: 'Influenza',
    doseNumber: 1,
    administrationDate: new Date('2025-09-20'),
    administrator: 'Nurse Sarah Ahmed',
    location: 'Dubai Healthcare City',
    lotNumber: 'FLU2025-8874',
    nextDoseDue: new Date('2026-09-20'),
  },
  {
    id: '2',
    vaccineName: 'COVID-19 Vaccine (Pfizer-BioNTech)',
    diseaseTarget: 'COVID-19',
    doseNumber: 3,
    administrationDate: new Date('2024-12-10'),
    administrator: 'Dr. Fatima Hassan',
    location: 'Mediclinic Dubai Mall',
    lotNumber: 'CV19-PF-2024-3421',
  },
  {
    id: '3',
    vaccineName: 'Tetanus-Diphtheria (Td)',
    diseaseTarget: 'Tetanus and Diphtheria',
    doseNumber: 1,
    administrationDate: new Date('2023-05-15'),
    administrator: 'Nurse John Smith',
    location: 'Cleveland Clinic Abu Dhabi',
    lotNumber: 'TD-2023-5567',
    nextDoseDue: new Date('2033-05-15'),
  },
];

// ── Medical History mock data ─────────────────────────────────────────────────
export const MOCK_PAST_CONDITIONS: PastCondition[] = [
  {
    condition: 'Pneumonia',
    diagnosed: '2019',
    resolved: '2019',
    doctor: 'Dr. Fatima Hassan',
    notes: 'Treated with antibiotics, full recovery',
  },
  {
    condition: 'Acute Gastroenteritis',
    diagnosed: '2021',
    resolved: '2021',
    doctor: 'Dr. Ahmed Al Rashidi',
    notes: 'Recovered after 5 days of treatment',
  },
  {
    condition: 'Iron Deficiency Anemia',
    diagnosed: '2020',
    resolved: '2021',
    doctor: 'Dr. Noor Al Farsi',
    notes: 'Resolved after 6 months of iron supplementation',
  },
];

export const MOCK_SURGERIES: Surgery[] = [
  {
    procedure: 'Appendectomy',
    date: 'March 2015',
    hospital: 'American Hospital Dubai',
    surgeon: 'Dr. Rajesh Kumar',
    notes: 'Laparoscopic procedure, no complications',
  },
  {
    procedure: 'Wisdom Tooth Extraction',
    date: 'June 2018',
    hospital: 'Dubai Healthcare City',
    surgeon: 'Dr. Hana Al Blooshi',
    notes: 'All 4 wisdom teeth removed under local anesthesia',
  },
];

export const MOCK_HOSPITALIZATIONS: Hospitalization[] = [
  {
    reason: 'Severe Pneumonia',
    hospital: 'Mediclinic Dubai Mall',
    admitted: 'Jan 12, 2019',
    discharged: 'Jan 18, 2019',
    days: 6,
  },
  {
    reason: 'Appendectomy Recovery',
    hospital: 'American Hospital Dubai',
    admitted: 'Mar 5, 2015',
    discharged: 'Mar 7, 2015',
    days: 2,
  },
];

export const MOCK_SOCIAL_HISTORY: SocialHistoryItem[] = [
  { label: 'Smoking Status', value: 'Non-smoker' },
  { label: 'Alcohol Use', value: 'Non-drinker' },
  { label: 'Exercise', value: '3–4 times per week (moderate intensity)' },
  { label: 'Diet', value: 'Balanced diet, low sugar due to pre-diabetic condition' },
  { label: 'Occupation', value: 'Software Engineer' },
  { label: 'Marital Status', value: 'Married' },
  { label: 'Living Situation', value: 'Lives with family' },
  { label: 'Stress Level', value: 'Moderate' },
];