export interface BoardCertification {
  name: string;
  year: number;
}

export interface ClinicAffiliation {
  id: string;
  name: string;
  role: string;
  department?: string;
  type: 'Primary' | 'Secondary';
  since: string;
  dhaFacility: string;
  schedule?: string;
}

export interface InsuranceProvider {
  name: string;
  accepted: boolean;
}

export interface PatientReview {
  id: string;
  authorName: string;
  isAnonymous: boolean;
  insuranceContext?: string;
  rating: number;
  text: string;
  date: string;
  doctorReply?: string;
}

export interface CmeActivity {
  date: string;
  activity: string;
  hours: number;
  category: string;
  certified: boolean;
}

export interface CmeCategory {
  name: string;
  completed: number;
  required: number;
  color: string;
}
