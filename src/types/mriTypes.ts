export type MRISequenceType =
  | 'CINE_SSFP'
  | 'T1_MAPPING'
  | 'T2_STIR'
  | 'LGE'
  | 'T2_STAR'
  | 'PHASE_CONTRAST'
  | 'T1W_SAG'
  | 'T2W_SAG'
  | 'T2W_AXL'
  | 'STIR'
  | 'FLAIR'
  | 'DWI';

export type MRIBodyPart = 'Cardiac' | 'Brain' | 'Spine' | 'Abdomen' | 'Pelvis' | 'Joint';

export type MRIFindingSeverity = 'normal' | 'mild' | 'moderate' | 'severe' | 'resolved';

export interface MRISequence {
  id: string;
  sequenceType: MRISequenceType;
  sequenceName: string;
  badge: string;
  purpose: string;
  result?: string;
  resultStatus?: 'normal' | 'abnormal' | 'monitoring';
  frameCount?: number;
  isCine?: boolean;
}

export interface MRIFinding {
  id: string;
  category: string;
  finding: string;
  severity: MRIFindingSeverity;
  severityLabel: string;
  location?: string;
  measurement?: string;
  plainEnglish: string;
  technicalDescription: string;
  color: string;
  whatItDoesNotMean?: string[];
  whatItDoesMean?: string[];
  visualData?: {
    type: 'gauge' | 'comparison' | 'timeline' | 'diagram';
    data: any;
  };
}

export interface MRIStudy {
  id: string;
  studyType: string;
  fullName: string;
  bodyPart: MRIBodyPart;
  studyDate: string;
  studyTime: string;
  duration: number;
  magnet: string;
  contrast: boolean;
  contrastAgent?: string;
  contrastDose?: string;
  facility: string;
  facilityDHA: string;
  facilityLocation: string;
  radiologist: string;
  radiologistCredentials: string;
  radiologistDHA: string;
  orderedBy: string;
  orderedBySpecialty: string;
  indication: string;
  safetyCleared: boolean;
  claustrophobiaNote?: string;
  sequences: MRISequence[];
  findings: MRIFinding[];
  impression: string;
  overallStatus: 'normal' | 'mostly-normal' | 'findings' | 'significant';
  overallStatusLabel: string;
  doctorReviewed: boolean;
  reviewedBy?: string;
  reviewedDate?: string;
  doctorNote?: string;
  reportRef: string;
  nabidh: boolean;
  fhirSubmitted: boolean;
  followUpPlan?: string;
  resolutionNote?: string;
  daysAgo: number;
}

export interface MRISafetyScreening {
  metalImplants: boolean;
  pacemaker: boolean;
  cochlearImplants: boolean;
  previousMRI: boolean;
  previousMRICount?: number;
  gadoliniumAllergy: boolean;
  kidneyProblems: boolean;
  pregnancy: boolean;
  claustrophobia: boolean;
  claustrophobiaSeverity?: 'none' | 'mild' | 'moderate' | 'severe';
  cleared: boolean;
}

export interface MRIStats {
  totalMRIs: number;
  latestDate: string;
  daysAgoLatest: number;
  findingsToMonitor: number;
  heartLVEF?: number;
  backStatus?: string;
}

export interface MRIRequest {
  doctor: string;
  mriType: string;
  reason: string;
  symptomsDuration: string;
  claustrophobia: boolean;
  urgency: 'urgent' | 'routine';
  requestRef: string;
  safetyScreening: MRISafetyScreening;
}
