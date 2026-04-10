export type PrescriptionStatus =
  | 'pending'
  | 'in_progress'
  | 'ready'
  | 'dispensed'
  | 'on_hold'
  | 'insurance_pending';

export type InteractionSeverity = 'moderate' | 'major' | 'contraindicated';
export type InteractionType = 'pharmacokinetic' | 'pharmacodynamic';
export type StockLevel = 'critical' | 'low' | 'adequate';

export interface Prescription {
  id: string;
  rxNumber: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorClinic: string;
  medications: PrescriptionMedication[];
  medicationCount: number;
  insuranceProvider: string;
  status: PrescriptionStatus;
  timeReceived: Date;
  isUrgent: boolean;
  patientAllergies: string[];
  insuranceAuthStatus: 'approved' | 'pending' | 'denied' | 'not_required';
  interactionFlags: DrugInteraction[];
}

export interface PrescriptionMedication {
  id: string;
  drugName: string;
  strength: string;
  form: string;
  quantity: number;
  dosage: string;
  duration: string;
  instructions: string;
}

export interface DrugInteraction {
  id: string;
  patientName: string;
  patientId: string;
  drugA: string;
  drugB: string;
  interactionType: InteractionType;
  severity: InteractionSeverity;
  description: string;
  prescribingDoctor: string;
  prescriptionId: string;
  flaggedAt: Date;
  resolved: boolean;
}

export interface StockAlert {
  id: string;
  drugName: string;
  genericName: string;
  currentStock: number;
  reorderPoint: number;
  level: StockLevel;
  autoReorderEnabled: boolean;
  supplier: string;
  lastOrderDate?: Date;
}

export interface PharmacyKPIs {
  prescriptionsToday: {
    total: number;
    dispensed: number;
    pending: number;
    onHold: number;
  };
  lowStockAlerts: {
    total: number;
    critical: number;
  };
  drugInteractionsFlagged: number;
  insuranceClaimsPending: number;
  revenueToday: number;
}

export const MOCK_PHARMACY_KPIS: PharmacyKPIs = {
  prescriptionsToday: {
    total: 47,
    dispensed: 34,
    pending: 8,
    onHold: 5,
  },
  lowStockAlerts: {
    total: 12,
    critical: 3,
  },
  drugInteractionsFlagged: 3,
  insuranceClaimsPending: 8,
  revenueToday: 12450,
};

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-001',
    rxNumber: 'RX-2026-001247',
    patientName: 'Ahmed Al Zaabi',
    patientId: 'pat-001',
    doctorName: 'Dr. Sarah Al-Rashid',
    doctorClinic: 'Dubai Medical Center',
    medications: [
      {
        id: 'med-1',
        drugName: 'Metformin',
        strength: '500mg',
        form: 'Tablet',
        quantity: 60,
        dosage: '1 tablet twice daily',
        duration: '30 days',
        instructions: 'Take with meals',
      },
      {
        id: 'med-2',
        drugName: 'Atorvastatin',
        strength: '20mg',
        form: 'Tablet',
        quantity: 30,
        dosage: '1 tablet daily',
        duration: '30 days',
        instructions: 'Take at bedtime',
      },
    ],
    medicationCount: 2,
    insuranceProvider: 'Daman',
    status: 'pending',
    timeReceived: new Date(Date.now() - 15 * 60 * 1000),
    isUrgent: true,
    patientAllergies: ['Penicillin', 'Sulfa drugs'],
    insuranceAuthStatus: 'approved',
    interactionFlags: [],
  },
  {
    id: 'rx-002',
    rxNumber: 'RX-2026-001248',
    patientName: 'Fatima Hassan',
    patientId: 'pat-002',
    doctorName: 'Dr. Mohammed Khalil',
    doctorClinic: 'Emirates Healthcare',
    medications: [
      {
        id: 'med-3',
        drugName: 'Warfarin',
        strength: '5mg',
        form: 'Tablet',
        quantity: 30,
        dosage: '1 tablet daily',
        duration: '30 days',
        instructions: 'Monitor INR regularly',
      },
      {
        id: 'med-4',
        drugName: 'Aspirin',
        strength: '81mg',
        form: 'Tablet',
        quantity: 30,
        dosage: '1 tablet daily',
        duration: '30 days',
        instructions: 'Take with food',
      },
    ],
    medicationCount: 2,
    insuranceProvider: 'Abu Dhabi National Insurance',
    status: 'on_hold',
    timeReceived: new Date(Date.now() - 45 * 60 * 1000),
    isUrgent: false,
    patientAllergies: [],
    insuranceAuthStatus: 'pending',
    interactionFlags: [
      {
        id: 'int-001',
        patientName: 'Fatima Hassan',
        patientId: 'pat-002',
        drugA: 'Warfarin',
        drugB: 'Aspirin',
        interactionType: 'pharmacodynamic',
        severity: 'major',
        description: 'Increased risk of bleeding when used together. Monitor patient closely.',
        prescribingDoctor: 'Dr. Mohammed Khalil',
        prescriptionId: 'rx-002',
        flaggedAt: new Date(Date.now() - 40 * 60 * 1000),
        resolved: false,
      },
    ],
  },
  {
    id: 'rx-003',
    rxNumber: 'RX-2026-001249',
    patientName: 'Omar Abdullah',
    patientId: 'pat-003',
    doctorName: 'Dr. Layla Mahmoud',
    doctorClinic: 'Al Zahra Hospital',
    medications: [
      {
        id: 'med-5',
        drugName: 'Amoxicillin',
        strength: '500mg',
        form: 'Capsule',
        quantity: 21,
        dosage: '1 capsule three times daily',
        duration: '7 days',
        instructions: 'Complete full course',
      },
    ],
    medicationCount: 1,
    insuranceProvider: 'None',
    status: 'in_progress',
    timeReceived: new Date(Date.now() - 30 * 60 * 1000),
    isUrgent: false,
    patientAllergies: [],
    insuranceAuthStatus: 'not_required',
    interactionFlags: [],
  },
  {
    id: 'rx-004',
    rxNumber: 'RX-2026-001250',
    patientName: 'Laila Mohammed',
    patientId: 'pat-004',
    doctorName: 'Dr. Rashid Ahmed',
    doctorClinic: 'Mediclinic Dubai',
    medications: [
      {
        id: 'med-6',
        drugName: 'Lisinopril',
        strength: '10mg',
        form: 'Tablet',
        quantity: 30,
        dosage: '1 tablet daily',
        duration: '30 days',
        instructions: 'Take in the morning',
      },
    ],
    medicationCount: 1,
    insuranceProvider: 'Cigna',
    status: 'ready',
    timeReceived: new Date(Date.now() - 120 * 60 * 1000),
    isUrgent: false,
    patientAllergies: ['Latex'],
    insuranceAuthStatus: 'approved',
    interactionFlags: [],
  },
  {
    id: 'rx-005',
    rxNumber: 'RX-2026-001251',
    patientName: 'Khalid Saeed',
    patientId: 'pat-005',
    doctorName: 'Dr. Aisha Rahman',
    doctorClinic: 'American Hospital Dubai',
    medications: [
      {
        id: 'med-7',
        drugName: 'Simvastatin',
        strength: '40mg',
        form: 'Tablet',
        quantity: 30,
        dosage: '1 tablet daily',
        duration: '30 days',
        instructions: 'Take at bedtime',
      },
      {
        id: 'med-8',
        drugName: 'Amlodipine',
        strength: '5mg',
        form: 'Tablet',
        quantity: 30,
        dosage: '1 tablet daily',
        duration: '30 days',
        instructions: 'Take in morning',
      },
    ],
    medicationCount: 2,
    insuranceProvider: 'Daman',
    status: 'insurance_pending',
    timeReceived: new Date(Date.now() - 60 * 60 * 1000),
    isUrgent: true,
    patientAllergies: [],
    insuranceAuthStatus: 'pending',
    interactionFlags: [],
  },
];

export const MOCK_STOCK_ALERTS: StockAlert[] = [
  {
    id: 'stock-001',
    drugName: 'Insulin Glargine (Lantus)',
    genericName: 'Insulin Glargine',
    currentStock: 3,
    reorderPoint: 10,
    level: 'critical',
    autoReorderEnabled: true,
    supplier: 'Sanofi UAE',
    lastOrderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'stock-002',
    drugName: 'Salbutamol Inhaler (Ventolin)',
    genericName: 'Salbutamol',
    currentStock: 2,
    reorderPoint: 15,
    level: 'critical',
    autoReorderEnabled: false,
    supplier: 'GSK Middle East',
  },
  {
    id: 'stock-003',
    drugName: 'Paracetamol 500mg',
    genericName: 'Paracetamol',
    currentStock: 4,
    reorderPoint: 50,
    level: 'critical',
    autoReorderEnabled: true,
    supplier: 'Julphar',
  },
  {
    id: 'stock-004',
    drugName: 'Omeprazole 20mg',
    genericName: 'Omeprazole',
    currentStock: 18,
    reorderPoint: 25,
    level: 'low',
    autoReorderEnabled: true,
    supplier: 'Spimaco',
    lastOrderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'stock-005',
    drugName: 'Ibuprofen 400mg',
    genericName: 'Ibuprofen',
    currentStock: 15,
    reorderPoint: 30,
    level: 'low',
    autoReorderEnabled: false,
    supplier: 'Gulf Pharma',
  },
];

export const MOCK_DRUG_INTERACTIONS: DrugInteraction[] = [
  {
    id: 'int-001',
    patientName: 'Fatima Hassan',
    patientId: 'pat-002',
    drugA: 'Warfarin',
    drugB: 'Aspirin',
    interactionType: 'pharmacodynamic',
    severity: 'major',
    description: 'Increased risk of bleeding when used together. Monitor patient closely for signs of bleeding.',
    prescribingDoctor: 'Dr. Mohammed Khalil',
    prescriptionId: 'rx-002',
    flaggedAt: new Date(Date.now() - 40 * 60 * 1000),
    resolved: false,
  },
  {
    id: 'int-002',
    patientName: 'Sara Ali',
    patientId: 'pat-006',
    drugA: 'Simvastatin',
    drugB: 'Clarithromycin',
    interactionType: 'pharmacokinetic',
    severity: 'contraindicated',
    description: 'Clarithromycin significantly increases simvastatin levels, increasing risk of rhabdomyolysis. Contraindicated combination.',
    prescribingDoctor: 'Dr. Ahmed Malik',
    prescriptionId: 'rx-006',
    flaggedAt: new Date(Date.now() - 20 * 60 * 1000),
    resolved: false,
  },
  {
    id: 'int-003',
    patientName: 'Hassan Ibrahim',
    patientId: 'pat-007',
    drugA: 'Metformin',
    drugB: 'Contrast Dye (CT scan)',
    interactionType: 'pharmacodynamic',
    severity: 'moderate',
    description: 'Hold metformin before and after contrast procedures to reduce risk of lactic acidosis.',
    prescribingDoctor: 'Dr. Noor Khalifa',
    prescriptionId: 'rx-007',
    flaggedAt: new Date(Date.now() - 10 * 60 * 1000),
    resolved: false,
  },
];
