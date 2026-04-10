export type ImagingModality = 'MRI' | 'CT' | 'Echo' | 'Holter' | 'X-Ray' | 'Stress Echo' | 'PET' | 'CTCA';

export type StudyStatus = 'pending' | 'in_progress' | 'resulted' | 'reviewed' | 'scheduled' | 'cancelled';

export type FindingSeverity = 'normal' | 'minor' | 'significant' | 'expected';

export interface Finding {
  label: string;
  value: string;
  severity: FindingSeverity;
}

export interface QuantitativeMeasurement {
  label: string;
  value: string;
  reference: string;
  severity: FindingSeverity;
  unit?: string;
}

export interface ImagingStudy {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  insurance: string;
  modality: ImagingModality;
  studyType: string;
  studyDate: string;
  orderedBy: string;
  performedAt: string;
  radiologist?: string;
  accessionNumber: string;
  status: StudyStatus;
  reviewedDate?: string;
  technique?: string;
  quantitativeMeasurements?: QuantitativeMeasurement[];
  findings: Finding[];
  impression: string;
  radiologistName?: string;
  radiologistTitle?: string;
  reportedDate?: string;
  dhaReference?: string;
  clinicalNote?: string;
  clinicalNoteDate?: string;
  incidentalFinding?: {
    title: string;
    description: string;
    recommendation: string;
  };
  urgencyNote?: {
    type: 'clinical' | 'warning';
    title: string;
    message: string;
    action?: string;
  };
  scheduledTime?: string;
  location?: string;
  performingDoctor?: string;
  indication?: string;
  preAuthStatus?: 'pending' | 'approved' | 'denied';
  preAuthSubmitted?: string;
  estimatedCost?: number;
  patientCoPay?: number;
  deviceInfo?: string;
  returnTime?: string;
  elapsedTime?: string;
}

export interface ImagingKPIs {
  pendingReview: number;
  inProgress: number;
  scheduled: number;
  thisMonth: number;
  significantFindings: number;
}
