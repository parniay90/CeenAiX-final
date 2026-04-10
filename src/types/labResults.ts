export type ResultStatus = 'draft' | 'verified' | 'released' | 'nabidh_submitted';
export type SensitivityResult = 'S' | 'I' | 'R' | 'ND';
export type AbnormalFlag = 'normal' | 'abnormal' | 'critical';

export interface PatientInfo {
  id: string;
  name: string;
  emiratesId: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  age: number;
  referringDoctor: string;
  referringDoctorId: string;
  clinic: string;
  insurance: string;
  insuranceNumber?: string;
}

export interface SampleInfo {
  id: string;
  sampleId: string;
  sampleType: string;
  collectionTime: Date;
  accessioningTime: Date;
  assignedTech: string;
  assignedTechId: string;
  priority: 'stat' | 'urgent' | 'routine';
}

export interface OrderedTest {
  id: string;
  cptCode: string;
  testName: string;
  category: string;
  priority: 'stat' | 'urgent' | 'routine';
  method?: string;
  completed: boolean;
}

export interface PreviousResult {
  testName: string;
  value: string;
  unit: string;
  date: Date;
  flag: AbnormalFlag;
}

export interface ReferenceRange {
  min?: number;
  max?: number;
  text?: string;
  isCriticalLow?: number;
  isCriticalHigh?: number;
}

export interface TestResult {
  id: string;
  testId: string;
  testName: string;
  cptCode: string;
  category: string;
  method: string;
  instrument: string;
  resultValue: string;
  unit: string;
  referenceRange: ReferenceRange;
  referenceRangeText: string;
  abnormalFlag: AbnormalFlag;
  isCritical: boolean;
  comment: string;
  qcPassed: boolean;
  qcLotNumber: string;
  resultedAt?: Date;
  resultedBy?: string;
}

export interface MicrobiologyOrganism {
  id: string;
  name: string;
  atccCode: string;
  colonyCount: string;
}

export interface AntibioticSensitivity {
  antibiotic: string;
  antibioticCode: string;
  result: SensitivityResult;
  micValue?: string;
}

export interface MicrobiologyResult extends TestResult {
  organisms: MicrobiologyOrganism[];
  sensitivities: Record<string, AntibioticSensitivity[]>;
}

export interface VerificationData {
  technicianName: string;
  technicianPin: string;
  supervisorName?: string;
  supervisorPin?: string;
  supervisorAcknowledged: boolean;
  overrideReason?: string;
}

export interface AuditEntry {
  action: string;
  timestamp: Date;
  performedBy: string;
  details?: string;
}

export interface LabOrder {
  id: string;
  patient: PatientInfo;
  sample: SampleInfo;
  orderedTests: OrderedTest[];
  clinicalNotes?: string;
  previousResults: PreviousResult[];
  results: TestResult[];
  microbiologyResults: MicrobiologyResult[];
  status: ResultStatus;
  verification?: VerificationData;
  auditTrail: AuditEntry[];
  releasedAt?: Date;
  nabidhSubmittedAt?: Date;
  doctorNotifiedAt?: Date;
  patientNotifiedAt?: Date;
}

export const MOCK_LAB_ORDER: LabOrder = {
  id: 'order-001',
  patient: {
    id: 'pt-789',
    name: 'Ahmed Al Mansouri',
    emiratesId: '784-1985-1234567-1',
    dateOfBirth: new Date('1985-03-15'),
    gender: 'male',
    age: 41,
    referringDoctor: 'Dr. Sarah Johnson',
    referringDoctorId: 'doc-456',
    clinic: 'Internal Medicine - Dubai Marina',
    insurance: 'Dubai Health Insurance',
    insuranceNumber: 'DHI-2024-45678',
  },
  sample: {
    id: 'smp-001',
    sampleId: 'LAB-2026-001234',
    sampleType: 'Blood - Serum',
    collectionTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    accessioningTime: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
    assignedTech: 'Maria Santos, MT(ASCP)',
    assignedTechId: 'tech-123',
    priority: 'stat',
  },
  orderedTests: [
    {
      id: 'ot-001',
      cptCode: '82947',
      testName: 'Glucose, Blood',
      category: 'Chemistry',
      priority: 'stat',
      completed: false,
    },
    {
      id: 'ot-002',
      cptCode: '84132',
      testName: 'Potassium',
      category: 'Chemistry',
      priority: 'stat',
      completed: false,
    },
    {
      id: 'ot-003',
      cptCode: '84295',
      testName: 'Sodium',
      category: 'Chemistry',
      priority: 'stat',
      completed: false,
    },
    {
      id: 'ot-004',
      cptCode: '83735',
      testName: 'Magnesium',
      category: 'Chemistry',
      priority: 'routine',
      completed: false,
    },
    {
      id: 'ot-005',
      cptCode: '82565',
      testName: 'Creatinine',
      category: 'Chemistry',
      priority: 'routine',
      completed: false,
    },
  ],
  clinicalNotes: 'Patient presenting with severe dehydration and electrolyte imbalance. Suspected hyperkalemia. STAT chemistry panel requested for immediate management.',
  previousResults: [
    {
      testName: 'Glucose, Blood',
      value: '95',
      unit: 'mg/dL',
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      flag: 'normal',
    },
    {
      testName: 'Potassium',
      value: '4.2',
      unit: 'mmol/L',
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      flag: 'normal',
    },
    {
      testName: 'Creatinine',
      value: '0.9',
      unit: 'mg/dL',
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      flag: 'normal',
    },
  ],
  results: [],
  microbiologyResults: [],
  status: 'draft',
  auditTrail: [
    {
      action: 'Sample Received',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      performedBy: 'Lab Reception',
    },
    {
      action: 'Sample Accessioned',
      timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      performedBy: 'Maria Santos, MT(ASCP)',
      details: 'Barcode: 2026001234',
    },
    {
      action: 'Assigned to Technician',
      timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      performedBy: 'Lab System',
      details: 'Assigned to Maria Santos',
    },
  ],
};

export const AVAILABLE_INSTRUMENTS = [
  { id: 'cobas-6000', name: 'Cobas 6000 (Chemistry)', category: 'chemistry' },
  { id: 'architect-i2000', name: 'Architect i2000SR (Immunoassay)', category: 'hormones' },
  { id: 'sysmex-xn1000', name: 'Sysmex XN-1000 (Hematology)', category: 'hematology' },
  { id: 'bact-alert', name: 'BacT/ALERT 3D (Microbiology)', category: 'microbiology' },
  { id: 'vidas', name: 'VIDAS (Serology)', category: 'serology' },
];

export const COMMON_ANTIBIOTICS = [
  { code: 'AMP', name: 'Ampicillin' },
  { code: 'AMC', name: 'Amoxicillin-Clavulanic Acid' },
  { code: 'CIP', name: 'Ciprofloxacin' },
  { code: 'LEV', name: 'Levofloxacin' },
  { code: 'GEN', name: 'Gentamicin' },
  { code: 'AMK', name: 'Amikacin' },
  { code: 'CTX', name: 'Cefotaxime' },
  { code: 'CAZ', name: 'Ceftazidime' },
  { code: 'FEP', name: 'Cefepime' },
  { code: 'MEM', name: 'Meropenem' },
  { code: 'IMP', name: 'Imipenem' },
  { code: 'TZP', name: 'Piperacillin-Tazobactam' },
  { code: 'VAN', name: 'Vancomycin' },
  { code: 'LNZ', name: 'Linezolid' },
  { code: 'SXT', name: 'Trimethoprim-Sulfamethoxazole' },
];

export const COMMON_ORGANISMS = [
  { id: 'org-001', name: 'Escherichia coli', atccCode: 'ATCC 25922' },
  { id: 'org-002', name: 'Staphylococcus aureus', atccCode: 'ATCC 25923' },
  { id: 'org-003', name: 'Pseudomonas aeruginosa', atccCode: 'ATCC 27853' },
  { id: 'org-004', name: 'Klebsiella pneumoniae', atccCode: 'ATCC 13883' },
  { id: 'org-005', name: 'Enterococcus faecalis', atccCode: 'ATCC 29212' },
  { id: 'org-006', name: 'Streptococcus pneumoniae', atccCode: 'ATCC 49619' },
  { id: 'org-007', name: 'Acinetobacter baumannii', atccCode: 'ATCC 19606' },
  { id: 'org-008', name: 'Enterobacter cloacae', atccCode: 'ATCC 13047' },
];

export function calculateReferenceRange(
  testName: string,
  age: number,
  gender: 'male' | 'female'
): ReferenceRange {
  const ranges: Record<string, ReferenceRange> = {
    'Glucose, Blood': { min: 70, max: 100, isCriticalLow: 50, isCriticalHigh: 400 },
    Potassium: { min: 3.5, max: 5.0, isCriticalLow: 2.5, isCriticalHigh: 6.5 },
    Sodium: { min: 136, max: 145, isCriticalLow: 120, isCriticalHigh: 160 },
    Magnesium: { min: 1.7, max: 2.2, isCriticalLow: 1.0, isCriticalHigh: 3.0 },
    Creatinine:
      gender === 'male'
        ? { min: 0.7, max: 1.3, isCriticalHigh: 5.0 }
        : { min: 0.6, max: 1.1, isCriticalHigh: 5.0 },
  };

  return ranges[testName] || { text: 'See reference manual' };
}

export function determineAbnormalFlag(
  value: number,
  range: ReferenceRange
): AbnormalFlag {
  if (range.isCriticalLow !== undefined && value <= range.isCriticalLow) {
    return 'critical';
  }
  if (range.isCriticalHigh !== undefined && value >= range.isCriticalHigh) {
    return 'critical';
  }
  if (range.min !== undefined && value < range.min) {
    return 'abnormal';
  }
  if (range.max !== undefined && value > range.max) {
    return 'abnormal';
  }
  return 'normal';
}
