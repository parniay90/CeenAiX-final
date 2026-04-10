export type TestStatus = 'normal' | 'borderline' | 'elevated' | 'low' | 'critical';

export type TestFlag = 'N' | 'H' | 'L' | 'HH' | 'LL';

export interface ReferenceZone {
  label: string;
  min?: number;
  max?: number;
  color: string;
}

export interface ReferenceRange {
  min?: number;
  max?: number;
  text: string;
  zones?: ReferenceZone[];
}

export interface SubTest {
  name: string;
  value: number;
  unit: string;
  status: TestStatus;
  referenceRange: ReferenceRange;
  flag?: TestFlag;
}

export interface LabTest {
  id: string;
  name: string;
  fullName: string;
  loinc: string;
  value?: number;
  unit?: string;
  status: TestStatus;
  statusLabel: string;
  referenceRange: ReferenceRange;
  flag?: TestFlag;
  doctorComment?: string;
  patientExplanation: string;
  trend?: number[];
  trendDates?: string[];
  trendDirection?: 'improving' | 'worsening' | 'stable';
  subTests?: SubTest[];
  fastingRequired?: boolean;
  medication?: string;
  retestDate?: string;
  categoryColor: string;
}

export interface LabVisit {
  id: string;
  visitDate: string;
  labName: string;
  labLocation: string;
  labDHA: string;
  orderedBy: string;
  orderedBySpecialty: string;
  orderDate: string;
  sampleCollectionDate: string;
  sampleCollectionTime: string;
  resultsReleasedDate: string;
  resultsReleasedTime: string;
  reviewedBy?: string;
  reviewedDate?: string;
  reviewStatus: 'pending' | 'reviewed';
  overallComment?: string;
  tests: LabTest[];
  nabidh: string;
  reportUrl?: string;
}

export interface UpcomingTest {
  name: string;
  loinc: string;
  description: string;
  cost: number;
  insuranceCoverage: number;
  patientCost: number;
  fastingRequired: boolean;
}

export interface UpcomingLabOrder {
  id: string;
  orderedBy: string;
  orderedBySpecialty: string;
  orderDate: string;
  dueDate: string;
  daysRemaining: number;
  tests: UpcomingTest[];
  preferredLab?: string;
  urgency: 'routine' | 'urgent' | 'stat';
}

export interface TrendData {
  date: string;
  value: number;
  status: TestStatus;
}
