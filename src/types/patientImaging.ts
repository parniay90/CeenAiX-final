export type ImagingModality = 'CT' | 'MRI' | 'X-Ray' | 'Ultrasound' | 'Echo' | 'PET' | 'Mammography';

export type FindingSeverity = 'normal' | 'mild' | 'moderate' | 'severe' | 'critical';

export interface ImagingFinding {
  id: string;
  category: string;
  finding: string;
  severity: FindingSeverity;
  severityLabel: string;
  location?: string;
  measurement?: string;
  patientExplanation: string;
  technicalDescription: string;
  color: string;
  doctorComment?: string;
}

export interface ImagingStudy {
  id: string;
  studyDate: string;
  modality: ImagingModality;
  studyType: string;
  bodyPart: string;
  indication: string;
  facility: string;
  facilityLocation: string;
  radiologist: string;
  radiologistCredentials: string;
  orderedBy: string;
  orderedBySpecialty: string;
  studyTime: string;
  reportedTime: string;
  accessionNumber: string;
  studyInstanceUID: string;
  seriesCount: number;
  imageCount: number;
  findings: ImagingFinding[];
  impression: string;
  patientSummary: string;
  reviewStatus: 'pending' | 'reviewed' | 'follow-up-needed';
  reviewedBy?: string;
  reviewedDate?: string;
  overallComment?: string;
  hasReport: boolean;
  reportURL?: string;
  hasImages: boolean;
  imageURLs?: string[];
  tags?: string[];
  followUpRecommended?: boolean;
  followUpInstructions?: string;
}

export interface ScheduledScan {
  id: string;
  scheduledDate: string;
  scheduledTime: string;
  modality: ImagingModality;
  studyType: string;
  bodyPart: string;
  indication: string;
  orderedBy: string;
  orderedBySpecialty: string;
  orderDate: string;
  facility: string;
  facilityAddress: string;
  facilityPhone: string;
  preparationInstructions: string[];
  estimatedDuration: string;
  cost: number;
  insuranceCoverage: number;
  patientCost: number;
  confirmed: boolean;
  bookingRef?: string;
  contrast?: boolean;
  contrastInstructions?: string;
}

export interface ImagingStats {
  totalStudies: number;
  pendingReviews: number;
  normalFindings: number;
  followUpNeeded: number;
  scheduledScans: number;
}

export interface DicomImage {
  id: string;
  seriesNumber: number;
  seriesDescription: string;
  imageNumber: number;
  thumbnailURL: string;
  fullURL: string;
  windowCenter?: number;
  windowWidth?: number;
}

export interface DicomSeries {
  id: string;
  seriesNumber: number;
  seriesDescription: string;
  modality: ImagingModality;
  imageCount: number;
  images: DicomImage[];
}
