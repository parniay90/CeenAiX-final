export interface PatientInfo {
  id: string;
  name: string;
  emiratesId: string;
  dateOfBirth: Date;
  phone: string;
  photoUrl?: string;
  insuranceCard: string;
  insuranceNetwork: string;
  allergies: string[];
}

export interface PrescriberInfo {
  id: string;
  name: string;
  specialty: string;
  dhaLicense: string;
  clinic: string;
  contactNumber: string;
  prescribeDate: Date;
}

export type MedicationStatus = 'available' | 'out_of_stock' | 'partial' | 'controlled_substance';
export type CoverageStatus = 'covered' | 'co_pay' | 'not_covered';
export type InteractionLevel = 'safe' | 'monitor' | 'major';
export type PaymentMethod = 'cash' | 'card' | 'insurance_direct';

export interface MedicationItem {
  id: string;
  drugName: string;
  genericName: string;
  onDHAFormulary: boolean;
  strength: string;
  dose: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
  instructionsArabic: string;
  status: MedicationStatus;
  interactionLevel: InteractionLevel;
  interactionDetails?: string;
  genericSubstitutionAllowed: boolean;
  genericOptions?: GenericOption[];
  coverageStatus: CoverageStatus;
  preAuthRequired: boolean;
  patientCopay: number;
  price: number;
  dispensedQuantity: number;
  batchNumber: string;
  expiryDate: string;
}

export interface GenericOption {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  inStock: boolean;
}

export interface CounselingPoint {
  id: string;
  category: 'dosage' | 'side_effects' | 'interactions' | 'storage' | 'refill_date';
  label: string;
  checked: boolean;
}

export interface DispensingRecord {
  id: string;
  prescriptionId: string;
  patient: PatientInfo;
  prescriber: PrescriberInfo;
  medications: MedicationItem[];
  nabidheConnected: boolean;
  totalAmount: number;
  insuranceCoverage: number;
  patientPayment: number;
  paymentMethod: PaymentMethod;
  counselingPoints: CounselingPoint[];
  counselingNotes: string;
  pharmacistPin: string;
  dispensedAt?: Date;
  dhaSubmitted: boolean;
  dhaSubmissionTime?: Date;
  sendToPatientApp: boolean;
}

export const MOCK_DISPENSING_RECORD: DispensingRecord = {
  id: 'disp-001',
  prescriptionId: 'rx-001',
  patient: {
    id: 'pat-001',
    name: 'Ahmed Al Zaabi',
    emiratesId: '784-1985-1234567-8',
    dateOfBirth: new Date('1985-03-15'),
    phone: '+971 50 123 4567',
    insuranceCard: 'DAMAN-2024-789456',
    insuranceNetwork: 'Daman Essential',
    allergies: ['Penicillin', 'Sulfa drugs', 'Aspirin'],
  },
  prescriber: {
    id: 'doc-001',
    name: 'Dr. Sarah Al-Rashid',
    specialty: 'Internal Medicine',
    dhaLicense: 'DHA-MD-2018-45821',
    clinic: 'Dubai Medical Center - Jumeirah',
    contactNumber: '+971 4 345 6789',
    prescribeDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  medications: [
    {
      id: 'med-1',
      drugName: 'Metformin',
      genericName: 'Metformin Hydrochloride',
      onDHAFormulary: true,
      strength: '500mg',
      dose: '1 tablet',
      frequency: 'Twice daily',
      duration: '30 days',
      quantity: 60,
      instructions: 'Take with meals to reduce stomach upset',
      instructionsArabic: 'تناول مع الوجبات لتقليل اضطراب المعدة',
      status: 'available',
      interactionLevel: 'safe',
      genericSubstitutionAllowed: true,
      genericOptions: [
        {
          id: 'gen-1',
          name: 'Metformin (Julphar)',
          manufacturer: 'Julphar',
          price: 45.0,
          inStock: true,
        },
        {
          id: 'gen-2',
          name: 'Metformin (Spimaco)',
          manufacturer: 'Spimaco',
          price: 42.0,
          inStock: true,
        },
      ],
      coverageStatus: 'covered',
      preAuthRequired: false,
      patientCopay: 0,
      price: 58.0,
      dispensedQuantity: 60,
      batchNumber: '',
      expiryDate: '',
    },
    {
      id: 'med-2',
      drugName: 'Atorvastatin',
      genericName: 'Atorvastatin Calcium',
      onDHAFormulary: true,
      strength: '20mg',
      dose: '1 tablet',
      frequency: 'Once daily',
      duration: '30 days',
      quantity: 30,
      instructions: 'Take at bedtime. Avoid grapefruit juice.',
      instructionsArabic: 'تناول قبل النوم. تجنب عصير الجريب فروت',
      status: 'available',
      interactionLevel: 'monitor',
      interactionDetails: 'May increase blood sugar levels. Monitor glucose regularly.',
      genericSubstitutionAllowed: true,
      coverageStatus: 'co_pay',
      preAuthRequired: false,
      patientCopay: 15.0,
      price: 85.0,
      dispensedQuantity: 30,
      batchNumber: '',
      expiryDate: '',
    },
  ],
  nabidheConnected: true,
  totalAmount: 143.0,
  insuranceCoverage: 128.0,
  patientPayment: 15.0,
  paymentMethod: 'insurance_direct',
  counselingPoints: [
    { id: 'cp-1', category: 'dosage', label: 'Dosage and timing', checked: false },
    { id: 'cp-2', category: 'side_effects', label: 'Common side effects', checked: false },
    { id: 'cp-3', category: 'interactions', label: 'Drug and food interactions', checked: false },
    { id: 'cp-4', category: 'storage', label: 'Storage instructions', checked: false },
    { id: 'cp-5', category: 'refill_date', label: 'Next refill date', checked: false },
  ],
  counselingNotes: '',
  pharmacistPin: '',
  dhaSubmitted: false,
  sendToPatientApp: true,
};

export const CONTROLLED_SUBSTANCE_MOCK: MedicationItem = {
  id: 'med-3',
  drugName: 'Tramadol',
  genericName: 'Tramadol Hydrochloride',
  onDHAFormulary: true,
  strength: '50mg',
  dose: '1 tablet',
  frequency: 'Every 6 hours as needed',
  duration: '7 days',
  quantity: 28,
  instructions: 'For pain relief. May cause drowsiness. Do not drive or operate machinery.',
  instructionsArabic: 'لتخفيف الألم. قد يسبب النعاس. لا تقود أو تشغل الآلات',
  status: 'controlled_substance',
  interactionLevel: 'monitor',
  interactionDetails: 'May cause respiratory depression. Avoid alcohol.',
  genericSubstitutionAllowed: false,
  coverageStatus: 'covered',
  preAuthRequired: true,
  patientCopay: 0,
  price: 65.0,
  dispensedQuantity: 28,
  batchNumber: '',
  expiryDate: '',
};
