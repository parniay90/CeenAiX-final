export type SamplePriority = 'stat' | 'urgent' | 'routine';
export type SampleStatus = 'received' | 'accessioned' | 'in_progress' | 'resulted' | 'verified' | 'released' | 'nabidh_submitted';
export type TestCategory = 'chemistry' | 'hematology' | 'microbiology' | 'hormones' | 'serology';
export type EquipmentStatus = 'online' | 'running' | 'maintenance' | 'offline';

export interface LabTest {
  id: string;
  code: string;
  name: string;
  category: TestCategory;
  normalRange: string;
  unit: string;
  tatMinutes: number;
}

export interface SampleTest {
  id: string;
  testId: string;
  testName: string;
  testCode: string;
  category: TestCategory;
  status: SampleStatus;
  result?: string;
  unit?: string;
  referenceRange?: string;
  isCritical?: boolean;
  resultedAt?: Date;
  resultedBy?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface Sample {
  id: string;
  sampleId: string;
  patientId: string;
  patientName: string;
  patientMRN: string;
  orderingDoctor: string;
  orderingDoctorId: string;
  clinic: string;
  tests: SampleTest[];
  collectionTime: Date;
  receivedTime: Date;
  priority: SamplePriority;
  status: SampleStatus;
  assignedTechnician?: string;
  assignedTechnicianId?: string;
  barcode: string;
  specimenType: string;
}

export interface CriticalValue {
  id: string;
  sampleId: string;
  patientName: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  orderingDoctor: string;
  orderingDoctorContact: string;
  resultedAt: Date;
  notified: boolean;
  notifiedAt?: Date;
  notifiedBy?: string;
  minutesSinceResult: number;
}

export interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  category: TestCategory;
  status: EquipmentStatus;
  lastQCResult: 'pass' | 'fail' | 'pending';
  lastQCDate: Date;
  lastMaintenanceDate: Date;
  nextMaintenanceDate: Date;
}

export interface TATMetric {
  category: TestCategory;
  categoryLabel: string;
  avgTATMinutes: number;
  targetTATMinutes: number;
  sampleCount: number;
  withinTarget: number;
  exceedsTarget: number;
}

export interface LabDashboardStats {
  samplesToday: number;
  samplesCompleted: number;
  samplesInProgress: number;
  samplesPending: number;
  criticalValues: number;
  avgTATHours: number;
  pendingNABIDH: number;
  qcFailures: number;
}

export const MOCK_SAMPLES: Sample[] = [
  {
    id: 'smp-001',
    sampleId: 'LAB-2026-001234',
    patientId: 'pt-789',
    patientName: 'Ahmed Al Mansouri',
    patientMRN: 'MRN-20245678',
    orderingDoctor: 'Dr. Sarah Johnson',
    orderingDoctorId: 'doc-456',
    clinic: 'Internal Medicine - Dubai Marina',
    tests: [
      {
        id: 'st-001',
        testId: 'test-cbc',
        testName: 'Complete Blood Count',
        testCode: 'CBC',
        category: 'hematology',
        status: 'resulted',
        resultedAt: new Date(Date.now() - 15 * 60 * 1000),
      },
      {
        id: 'st-002',
        testId: 'test-crp',
        testName: 'C-Reactive Protein',
        testCode: 'CRP',
        category: 'chemistry',
        status: 'verified',
        result: '45',
        unit: 'mg/L',
        referenceRange: '0-10',
        isCritical: true,
        resultedAt: new Date(Date.now() - 10 * 60 * 1000),
        verifiedAt: new Date(Date.now() - 5 * 60 * 1000),
      },
    ],
    collectionTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    receivedTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    priority: 'stat',
    status: 'verified',
    assignedTechnician: 'Maria Santos',
    assignedTechnicianId: 'tech-123',
    barcode: '2026001234',
    specimenType: 'Blood - EDTA',
  },
  {
    id: 'smp-002',
    sampleId: 'LAB-2026-001235',
    patientId: 'pt-790',
    patientName: 'Fatima Hassan',
    patientMRN: 'MRN-20245679',
    orderingDoctor: 'Dr. Mohammed Ali',
    orderingDoctorId: 'doc-457',
    clinic: 'Family Medicine - JBR',
    tests: [
      {
        id: 'st-003',
        testId: 'test-glucose',
        testName: 'Fasting Blood Glucose',
        testCode: 'FBS',
        category: 'chemistry',
        status: 'in_progress',
      },
      {
        id: 'st-004',
        testId: 'test-hba1c',
        testName: 'HbA1c',
        testCode: 'HBA1C',
        category: 'chemistry',
        status: 'accessioned',
      },
    ],
    collectionTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    receivedTime: new Date(Date.now() - 1.8 * 60 * 60 * 1000),
    priority: 'urgent',
    status: 'in_progress',
    assignedTechnician: 'John Smith',
    assignedTechnicianId: 'tech-124',
    barcode: '2026001235',
    specimenType: 'Blood - Fluoride',
  },
  {
    id: 'smp-003',
    sampleId: 'LAB-2026-001236',
    patientId: 'pt-791',
    patientName: 'Omar Abdullah',
    patientMRN: 'MRN-20245680',
    orderingDoctor: 'Dr. Emily Chen',
    orderingDoctorId: 'doc-458',
    clinic: 'Cardiology - Downtown',
    tests: [
      {
        id: 'st-005',
        testId: 'test-troponin',
        testName: 'Troponin I',
        testCode: 'TROP-I',
        category: 'chemistry',
        status: 'resulted',
        result: '2.5',
        unit: 'ng/mL',
        referenceRange: '0-0.04',
        isCritical: true,
        resultedAt: new Date(Date.now() - 25 * 60 * 1000),
      },
    ],
    collectionTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    receivedTime: new Date(Date.now() - 1.3 * 60 * 60 * 1000),
    priority: 'stat',
    status: 'resulted',
    assignedTechnician: 'Maria Santos',
    assignedTechnicianId: 'tech-123',
    barcode: '2026001236',
    specimenType: 'Blood - Serum',
  },
  {
    id: 'smp-004',
    sampleId: 'LAB-2026-001237',
    patientId: 'pt-792',
    patientName: 'Layla Ibrahim',
    patientMRN: 'MRN-20245681',
    orderingDoctor: 'Dr. Sarah Johnson',
    orderingDoctorId: 'doc-456',
    clinic: 'Internal Medicine - Dubai Marina',
    tests: [
      {
        id: 'st-006',
        testId: 'test-tsh',
        testName: 'Thyroid Stimulating Hormone',
        testCode: 'TSH',
        category: 'hormones',
        status: 'accessioned',
      },
      {
        id: 'st-007',
        testId: 'test-ft4',
        testName: 'Free T4',
        testCode: 'FT4',
        category: 'hormones',
        status: 'accessioned',
      },
    ],
    collectionTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    receivedTime: new Date(Date.now() - 0.8 * 60 * 60 * 1000),
    priority: 'routine',
    status: 'accessioned',
    assignedTechnician: 'John Smith',
    assignedTechnicianId: 'tech-124',
    barcode: '2026001237',
    specimenType: 'Blood - Serum',
  },
  {
    id: 'smp-005',
    sampleId: 'LAB-2026-001238',
    patientId: 'pt-793',
    patientName: 'Khalid Rahman',
    patientMRN: 'MRN-20245682',
    orderingDoctor: 'Dr. Mohammed Ali',
    orderingDoctorId: 'doc-457',
    clinic: 'Family Medicine - JBR',
    tests: [
      {
        id: 'st-008',
        testId: 'test-culture',
        testName: 'Urine Culture',
        testCode: 'U-CULT',
        category: 'microbiology',
        status: 'received',
      },
    ],
    collectionTime: new Date(Date.now() - 0.5 * 60 * 60 * 1000),
    receivedTime: new Date(Date.now() - 0.3 * 60 * 60 * 1000),
    priority: 'routine',
    status: 'received',
    barcode: '2026001238',
    specimenType: 'Urine',
  },
];

export const MOCK_CRITICAL_VALUES: CriticalValue[] = [
  {
    id: 'cv-001',
    sampleId: 'LAB-2026-001234',
    patientName: 'Ahmed Al Mansouri',
    testName: 'C-Reactive Protein',
    value: '45',
    unit: 'mg/L',
    referenceRange: '0-10',
    orderingDoctor: 'Dr. Sarah Johnson',
    orderingDoctorContact: '+971 50 123 4567',
    resultedAt: new Date(Date.now() - 10 * 60 * 1000),
    notified: false,
    minutesSinceResult: 10,
  },
  {
    id: 'cv-002',
    sampleId: 'LAB-2026-001236',
    patientName: 'Omar Abdullah',
    testName: 'Troponin I',
    value: '2.5',
    unit: 'ng/mL',
    referenceRange: '0-0.04',
    orderingDoctor: 'Dr. Emily Chen',
    orderingDoctorContact: '+971 50 234 5678',
    resultedAt: new Date(Date.now() - 25 * 60 * 1000),
    notified: false,
    minutesSinceResult: 25,
  },
  {
    id: 'cv-003',
    sampleId: 'LAB-2026-001220',
    patientName: 'Sarah Mohammed',
    testName: 'Potassium',
    value: '6.8',
    unit: 'mmol/L',
    referenceRange: '3.5-5.0',
    orderingDoctor: 'Dr. Ahmed Hassan',
    orderingDoctorContact: '+971 50 345 6789',
    resultedAt: new Date(Date.now() - 45 * 60 * 1000),
    notified: false,
    minutesSinceResult: 45,
  },
  {
    id: 'cv-004',
    sampleId: 'LAB-2026-001215',
    patientName: 'Hassan Ali',
    testName: 'Platelet Count',
    value: '25',
    unit: 'x10^9/L',
    referenceRange: '150-400',
    orderingDoctor: 'Dr. Fatima Al Zaabi',
    orderingDoctorContact: '+971 50 456 7890',
    resultedAt: new Date(Date.now() - 52 * 60 * 1000),
    notified: false,
    minutesSinceResult: 52,
  },
];

export const MOCK_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-001',
    name: 'Cobas 6000',
    model: 'Roche Cobas 6000',
    serialNumber: 'COB-2024-4567',
    category: 'chemistry',
    status: 'running',
    lastQCResult: 'pass',
    lastQCDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastMaintenanceDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    nextMaintenanceDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'eq-002',
    name: 'Sysmex XN-1000',
    model: 'Sysmex XN-1000',
    serialNumber: 'SYS-2024-3456',
    category: 'hematology',
    status: 'online',
    lastQCResult: 'pass',
    lastQCDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
    lastMaintenanceDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    nextMaintenanceDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'eq-003',
    name: 'BacT/ALERT',
    model: 'bioMérieux BacT/ALERT 3D',
    serialNumber: 'BAC-2024-2345',
    category: 'microbiology',
    status: 'online',
    lastQCResult: 'pass',
    lastQCDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
    lastMaintenanceDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    nextMaintenanceDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'eq-004',
    name: 'Architect i2000SR',
    model: 'Abbott Architect i2000SR',
    serialNumber: 'ARC-2024-5678',
    category: 'hormones',
    status: 'maintenance',
    lastQCResult: 'fail',
    lastQCDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
    lastMaintenanceDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
    nextMaintenanceDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'eq-005',
    name: 'VIDAS',
    model: 'bioMérieux VIDAS',
    serialNumber: 'VID-2024-6789',
    category: 'serology',
    status: 'online',
    lastQCResult: 'pass',
    lastQCDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
    lastMaintenanceDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    nextMaintenanceDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
  },
];

export const MOCK_TAT_METRICS: TATMetric[] = [
  {
    category: 'chemistry',
    categoryLabel: 'Chemistry',
    avgTATMinutes: 180,
    targetTATMinutes: 240,
    sampleCount: 145,
    withinTarget: 132,
    exceedsTarget: 13,
  },
  {
    category: 'hematology',
    categoryLabel: 'Hematology',
    avgTATMinutes: 90,
    targetTATMinutes: 120,
    sampleCount: 198,
    withinTarget: 185,
    exceedsTarget: 13,
  },
  {
    category: 'microbiology',
    categoryLabel: 'Microbiology',
    avgTATMinutes: 2880,
    targetTATMinutes: 4320,
    sampleCount: 42,
    withinTarget: 38,
    exceedsTarget: 4,
  },
  {
    category: 'hormones',
    categoryLabel: 'Hormones',
    avgTATMinutes: 210,
    targetTATMinutes: 180,
    sampleCount: 67,
    withinTarget: 45,
    exceedsTarget: 22,
  },
  {
    category: 'serology',
    categoryLabel: 'Serology',
    avgTATMinutes: 150,
    targetTATMinutes: 180,
    sampleCount: 89,
    withinTarget: 81,
    exceedsTarget: 8,
  },
];

export const MOCK_STATS: LabDashboardStats = {
  samplesToday: 234,
  samplesCompleted: 189,
  samplesInProgress: 31,
  samplesPending: 14,
  criticalValues: 7,
  avgTATHours: 3.2,
  pendingNABIDH: 5,
  qcFailures: 2,
};
