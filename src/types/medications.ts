export type MedicationCategory = 'Diabetes' | 'Cardiovascular' | 'Cholesterol' | 'Supplement' | 'Antibiotic' | 'Painkiller' | 'General';

export type MedicationForm = 'Tablet' | 'Capsule' | 'Softgel' | 'Liquid' | 'Injection';

export type DoseStatus = 'taken' | 'pending' | 'scheduled' | 'missed';

export interface Dose {
  time: string;
  status: DoseStatus;
  takenAt?: string;
}

export interface Medication {
  id: string;
  genericName: string;
  brandName: string;
  strength: string;
  form: MedicationForm;
  category: MedicationCategory;
  categoryColor: string;
  categoryEmoji: string;
  condition: string;
  prescribedBy: string;
  prescribedBySpecialty: string;
  prescribedOn: string;
  instructions: string;
  schedule: Dose[];
  duration: string;
  courseStart: string;
  courseEnd?: string;
  quantityDispensed: number;
  refillsRemaining: number;
  daysSupplyRemaining: number;
  nextRefillDue: string;
  pharmacy: string;
  pharmacyLocation: string;
  insuranceCovered: boolean;
  insuranceName?: string;
  monthlyPrice: number;
  insurancePrice: number;
  nabidh: string;
  todaysDoses?: Dose[];
  adherenceRate: number;
  adherenceTaken: number;
  adherenceTotal: number;
  missedPattern?: string;
  drugInfo: {
    howItWorks: string;
    commonSideEffects: string[];
    seriousSideEffects: string;
    foodInteractions: string;
    avoid?: string;
    storage: string;
    important: string;
  };
  warnings?: string[];
  doctorNote?: string;
  retestDate?: string;
  retestInfo?: string;
}

export interface PastMedication {
  id: string;
  genericName: string;
  brandName: string;
  strength: string;
  category: MedicationCategory;
  prescribedOn: string;
  stoppedOn: string;
  duration: string;
  reason: string;
  prescribedBy: string;
  status: 'completed' | 'stopped' | 'expired';
  statusLabel: string;
}

export interface Reminder {
  id: string;
  medicationId: string;
  medicationName: string;
  dose: string;
  time: string;
  frequency: string;
  channels: {
    sms: boolean;
    app: boolean;
    whatsapp: boolean;
  };
  active: boolean;
  messagePreview: string;
}

export interface AdherenceData {
  date: string;
  taken: number;
  missed: number;
  total: number;
}
