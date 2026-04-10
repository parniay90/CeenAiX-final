export type LabPage =
  | 'dashboard'
  | 'queue'
  | 'orders'
  | 'results'
  | 'qc'
  | 'imaging-queue'
  | 'imaging-orders'
  | 'imaging-reports'
  | 'imaging-equipment'
  | 'equipment'
  | 'nabidh'
  | 'analytics'
  | 'profile'
  | 'settings';

export interface LabSample {
  id: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  bloodType: string;
  patientId: string;
  insurance: string;
  doctor: string;
  clinic: string;
  tests: string[];
  priority: 'STAT' | 'Urgent' | 'Routine';
  status: 'Received' | 'Accessioned' | 'In Progress' | 'Resulted' | 'Pending Verify' | 'Verified' | 'Released' | 'NABIDH Submitted';
  collectedAt: string;
  receivedAt: string;
  tat: string;
  tech: string;
  isCritical?: boolean;
  criticalValue?: string;
  department: string;
}

export interface ImagingStudy {
  accession: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  modality: 'MRI' | 'CT' | 'X-Ray' | 'USS' | 'MAMMO' | 'PET' | 'ECHO';
  studyName: string;
  doctor: string;
  clinic: string;
  scheduledTime: string;
  status: 'Ordered' | 'Scheduled' | 'Patient Arrived' | 'Scanning' | 'Scan Complete' | 'Reported' | 'Verified' | 'Released' | 'NABIDH Submitted';
  room: string;
  tat?: string;
  progress?: number;
  eta?: string;
  alerts?: string[];
}
