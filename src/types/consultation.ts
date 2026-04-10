export interface PatientConsultation {
  id: string;
  patientName: string;
  patientPhoto: string;
  dob: string;
  emiratesId: string;
  mrn: string;
  bloodType: string;
  allergyCount: number;
  allergies: Allergy[];
  activeConditions: Condition[];
  currentMedications: Medication[];
  vitals: VitalSigns;
  previousVisits: VisitSummary[];
  aiHealthScore: number;
  healthScoreTrend: 'up' | 'down' | 'stable';
}

export interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface Condition {
  id: string;
  name: string;
  icd10Code: string;
  diagnosedDate: string;
  status: 'active' | 'controlled' | 'resolved';
}

export interface Medication {
  id: string;
  drugName: string;
  dose: string;
  frequency: string;
  prescriber: string;
  startDate: string;
  hasInteraction: boolean;
  interactionSeverity?: 'low' | 'moderate' | 'high';
}

export interface VitalSigns {
  bp: { systolic: number; diastolic: number; change?: number };
  hr: { value: number; change?: number };
  weight: { value: number; unit: string; change?: number };
  temp: { value: number; unit: string; change?: number };
  spo2: { value: number; change?: number };
  takenAt: Date;
}

export interface VisitSummary {
  id: string;
  date: Date;
  chiefComplaint: string;
  diagnosis: string;
  treatment: string;
}

export interface SOAPNotes {
  subjective: string;
  objective: string;
  assessment: AssessmentNote[];
  plan: PlanNote;
}

export interface AssessmentNote {
  diagnosis: string;
  icd10Code: string;
  isPrimary: boolean;
}

export interface PlanNote {
  prescriptions: Prescription[];
  labOrders: string[];
  imagingOrders: string[];
  referrals: string[];
  followUp: string;
  patientInstructions: string;
}

export interface Prescription {
  id: string;
  drug: string;
  form: string;
  strength: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions: string;
  instructionsArabic?: string;
  quantity: number;
  refills: number;
  hasInteraction: boolean;
  interactionLevel?: 'safe' | 'monitor' | 'contraindicated';
}

export interface DifferentialDiagnosis {
  id: string;
  diagnosis: string;
  probability: number;
  evidence: string[];
  icd10Code: string;
}

export interface DrugInteraction {
  severity: 'safe' | 'monitor' | 'contraindicated';
  message: string;
  drugs: string[];
}

export interface GuidelineAlert {
  id: string;
  title: string;
  message: string;
  source: string;
  url?: string;
}

export interface PreventiveCareReminder {
  id: string;
  test: string;
  message: string;
  lastDone?: string;
  dueDate: string;
}

export const MOCK_CONSULTATION_PATIENT: PatientConsultation = {
  id: '1',
  patientName: 'Fatima Al Mansoori',
  patientPhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  dob: '1962-03-15',
  emiratesId: '784-1962-1234567-8',
  mrn: 'MRN-2024-008821',
  bloodType: 'A+',
  allergyCount: 2,
  allergies: [
    { id: '1', allergen: 'Penicillin', reaction: 'Anaphylaxis', severity: 'severe' },
    { id: '2', allergen: 'Shellfish', reaction: 'Hives', severity: 'moderate' },
  ],
  activeConditions: [
    { id: '1', name: 'Essential Hypertension', icd10Code: 'I10', diagnosedDate: '2020-05-12', status: 'controlled' },
    { id: '2', name: 'Type 2 Diabetes Mellitus', icd10Code: 'E11.9', diagnosedDate: '2019-08-22', status: 'controlled' },
    { id: '3', name: 'Hyperlipidemia', icd10Code: 'E78.5', diagnosedDate: '2021-01-10', status: 'active' },
  ],
  currentMedications: [
    {
      id: '1',
      drugName: 'Amlodipine',
      dose: '5mg',
      frequency: 'Once daily',
      prescriber: 'Dr. Al-Rashid',
      startDate: '2023-06-15',
      hasInteraction: false,
    },
    {
      id: '2',
      drugName: 'Metformin',
      dose: '1000mg',
      frequency: 'Twice daily',
      prescriber: 'Dr. Al-Rashid',
      startDate: '2023-03-10',
      hasInteraction: false,
    },
    {
      id: '3',
      drugName: 'Atorvastatin',
      dose: '20mg',
      frequency: 'Once daily at bedtime',
      prescriber: 'Dr. Al-Rashid',
      startDate: '2023-06-15',
      hasInteraction: true,
      interactionSeverity: 'moderate',
    },
  ],
  vitals: {
    bp: { systolic: 152, diastolic: 88, change: 8 },
    hr: { value: 78, change: -2 },
    weight: { value: 72.5, unit: 'kg', change: 1.2 },
    temp: { value: 36.8, unit: '°C', change: 0 },
    spo2: { value: 98, change: 0 },
    takenAt: new Date(),
  },
  previousVisits: [
    {
      id: '1',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      chiefComplaint: 'Follow-up BP check',
      diagnosis: 'Hypertension - controlled',
      treatment: 'Continued current medications',
    },
    {
      id: '2',
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      chiefComplaint: 'Routine diabetes management',
      diagnosis: 'Type 2 DM - well controlled',
      treatment: 'HbA1c: 6.8%, continued Metformin',
    },
    {
      id: '3',
      date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      chiefComplaint: 'Annual physical examination',
      diagnosis: 'Routine follow-up',
      treatment: 'Lipid panel ordered, all stable',
    },
  ],
  aiHealthScore: 72,
  healthScoreTrend: 'down',
};

export const MOCK_DIFFERENTIAL_DIAGNOSES: DifferentialDiagnosis[] = [
  {
    id: '1',
    diagnosis: 'Hypertensive Crisis',
    probability: 75,
    icd10Code: 'I16.9',
    evidence: [
      'BP 152/88 mmHg (elevated from baseline)',
      'History of hypertension',
      'Recent medication adherence issues',
    ],
  },
  {
    id: '2',
    diagnosis: 'Chronic Kidney Disease',
    probability: 45,
    icd10Code: 'N18.9',
    evidence: [
      'Long-standing diabetes and hypertension',
      'Consider eGFR assessment',
    ],
  },
  {
    id: '3',
    diagnosis: 'Diabetic Nephropathy',
    probability: 35,
    icd10Code: 'E11.21',
    evidence: [
      'Type 2 DM for 5+ years',
      'Recommend microalbumin screening',
    ],
  },
];

export const MOCK_GUIDELINE_ALERTS: GuidelineAlert[] = [
  {
    id: '1',
    title: 'DHA Hypertension Guideline 2025',
    message: 'For patients with BP >150/90 despite monotherapy, consider adding second agent. Combination of ACE inhibitor + calcium channel blocker recommended.',
    source: 'DHA Clinical Practice Guidelines',
    url: '#',
  },
  {
    id: '2',
    title: 'ADA Diabetes Management',
    message: 'HbA1c target for most adults with T2DM is <7%. Consider individualized targets based on patient factors.',
    source: 'American Diabetes Association 2024',
    url: '#',
  },
];

export const MOCK_PREVENTIVE_CARE: PreventiveCareReminder[] = [
  {
    id: '1',
    test: 'HbA1c',
    message: 'Patient is due for HbA1c',
    lastDone: '4 months ago',
    dueDate: 'Overdue',
  },
  {
    id: '2',
    test: 'Lipid Panel',
    message: 'Annual lipid panel due',
    lastDone: '11 months ago',
    dueDate: 'Due in 1 month',
  },
  {
    id: '3',
    test: 'Diabetic Eye Exam',
    message: 'Annual ophthalmology screening',
    lastDone: '13 months ago',
    dueDate: 'Overdue',
  },
];
