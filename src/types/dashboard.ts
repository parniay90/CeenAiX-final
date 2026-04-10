export interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  clinicName: string;
  appointmentDate: Date;
  status: 'Confirmed' | 'Pending' | 'Teleconsult';
  isTeleconsult: boolean;
}

export interface Medication {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  timeOfDay: string;
  active: boolean;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  takenAt: Date;
  scheduledFor: Date;
}

export interface HealthMetric {
  id: string;
  metricType: 'blood_pressure' | 'blood_sugar' | 'weight' | 'heart_rate';
  value: any;
  measuredAt: Date;
}

export interface PreventiveCare {
  id: string;
  careType: string;
  status: 'completed' | 'overdue' | 'upcoming';
  dueDate?: Date;
  completedDate?: Date;
}

export interface Document {
  id: string;
  documentType: 'lab_report' | 'prescription' | 'referral' | 'other';
  title: string;
  fileUrl?: string;
  uploadedAt: Date;
}

export interface AIInsight {
  id: string;
  insightText: string;
  insightType: 'alert' | 'recommendation' | 'trend';
  priority: 'high' | 'medium' | 'low';
  relatedMetric?: string;
}

export interface HealthScore {
  score: number;
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  color: string;
}

export const MOCK_PATIENT = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Ahmed Al Hashimi',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
};

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialty: 'Cardiologist',
    doctorAvatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=100',
    clinicName: 'Dubai Healthcare City',
    appointmentDate: new Date('2026-04-10T15:00:00'),
    status: 'Confirmed',
    isTeleconsult: false,
  },
  {
    id: '2',
    doctorName: 'Dr. Mohammed Al Zarooni',
    doctorSpecialty: 'Endocrinologist',
    doctorAvatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
    clinicName: 'Mediclinic Dubai Mall',
    appointmentDate: new Date('2026-04-15T10:30:00'),
    status: 'Teleconsult',
    isTeleconsult: true,
  },
  {
    id: '3',
    doctorName: 'Dr. Fatima Hassan',
    doctorSpecialty: 'General Practitioner',
    doctorAvatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100',
    clinicName: 'Cleveland Clinic Abu Dhabi',
    appointmentDate: new Date('2026-04-20T09:00:00'),
    status: 'Pending',
    isTeleconsult: false,
  },
];

export const MOCK_MEDICATIONS: Medication[] = [
  {
    id: '1',
    drugName: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    timeOfDay: '8AM',
    active: true,
  },
  {
    id: '2',
    drugName: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    timeOfDay: '8PM',
    active: true,
  },
  {
    id: '3',
    drugName: 'Aspirin',
    dosage: '81mg',
    frequency: 'Once daily',
    timeOfDay: '8AM',
    active: true,
  },
  {
    id: '4',
    drugName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    timeOfDay: '2PM',
    active: true,
  },
];

export const MOCK_AI_INSIGHTS: AIInsight[] = [
  {
    id: '1',
    insightText: 'Blood pressure trending up — 3 readings',
    insightType: 'alert',
    priority: 'medium',
    relatedMetric: 'blood_pressure',
  },
  {
    id: '2',
    insightText: 'Metformin refill due in 5 days',
    insightType: 'recommendation',
    priority: 'high',
    relatedMetric: 'medications',
  },
  {
    id: '3',
    insightText: 'Annual eye screening overdue',
    insightType: 'alert',
    priority: 'medium',
    relatedMetric: 'preventive_care',
  },
];

export const MOCK_PREVENTIVE_CARE: PreventiveCare[] = [
  {
    id: '1',
    careType: 'Annual Physical',
    status: 'completed',
    dueDate: new Date('2026-03-01'),
    completedDate: new Date('2026-02-15'),
  },
  {
    id: '2',
    careType: 'Eye Exam',
    status: 'overdue',
    dueDate: new Date('2026-02-01'),
  },
  {
    id: '3',
    careType: 'Dental Checkup',
    status: 'upcoming',
    dueDate: new Date('2026-05-15'),
  },
  {
    id: '4',
    careType: 'Colonoscopy',
    status: 'upcoming',
    dueDate: new Date('2026-08-01'),
  },
  {
    id: '5',
    careType: 'Flu Vaccine',
    status: 'completed',
    dueDate: new Date('2025-10-01'),
    completedDate: new Date('2025-09-20'),
  },
  {
    id: '6',
    careType: 'Blood Panel',
    status: 'completed',
    dueDate: new Date('2026-02-01'),
    completedDate: new Date('2026-01-28'),
  },
  {
    id: '7',
    careType: 'Mammogram',
    status: 'upcoming',
    dueDate: new Date('2026-06-01'),
  },
];

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    documentType: 'lab_report',
    title: 'Blood Test Results - Complete Metabolic Panel',
    uploadedAt: new Date('2026-04-05'),
  },
  {
    id: '2',
    documentType: 'prescription',
    title: 'Prescription - Metformin & Lisinopril',
    uploadedAt: new Date('2026-04-01'),
  },
  {
    id: '3',
    documentType: 'referral',
    title: 'Cardiology Referral Letter',
    uploadedAt: new Date('2026-03-28'),
  },
  {
    id: '4',
    documentType: 'lab_report',
    title: 'HbA1c Test Results',
    uploadedAt: new Date('2026-03-15'),
  },
  {
    id: '5',
    documentType: 'prescription',
    title: 'Prescription - Aspirin',
    uploadedAt: new Date('2026-03-10'),
  },
];
