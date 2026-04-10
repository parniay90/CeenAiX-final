export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  dhaLicense: string;
  clinicName: string;
  avatar: string;
}

export interface DailyStat {
  label: string;
  value: number;
  total?: number;
  subtitle?: string;
  color: string;
  badge?: {
    text: string;
    color: string;
  };
}

export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  patientPhoto: string;
  age: number;
  gender: 'M' | 'F';
  reason: string;
  type: 'New' | 'Follow-up' | 'Urgent' | 'Teleconsult';
  status: 'confirmed' | 'pending' | 'completed' | 'no-show';
  lastVisit?: string;
  conditions?: string[];
  medications?: string[];
  aiNote?: string;
}

export interface CriticalAlert {
  id: string;
  patientName: string;
  message: string;
  severity: 'critical' | 'warning';
  actionLabel: string;
  actionType: 'contact' | 'message' | 'review';
}

export interface AIInsight {
  id: string;
  message: string;
  count?: number;
  type: 'screening' | 'interaction' | 'referral' | 'general';
  color: string;
  expandable?: boolean;
  details?: string[];
}

export interface PatientActivity {
  id: string;
  type: 'lab' | 'message' | 'appointment' | 'prescription';
  patientName: string;
  message: string;
  timestamp: Date;
  actionLabel?: string;
}

export const MOCK_DOCTOR: Doctor = {
  id: '1',
  name: 'Dr. Sarah Al-Rashid',
  specialty: 'Internal Medicine',
  dhaLicense: 'DHA-12345678',
  clinicName: 'Mediclinic City Hospital',
  avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=200',
};

export const MOCK_DAILY_STATS: DailyStat[] = [
  {
    label: "Today's Appointments",
    value: 12,
    subtitle: '8 completed, 3 remaining, 1 cancelled',
    color: '#14B8A6',
  },
  {
    label: 'Pending Lab Reviews',
    value: 7,
    color: '#F59E0B',
    badge: {
      text: '3 abnormal',
      color: 'bg-amber-100 text-amber-700',
    },
  },
  {
    label: 'Pending Prescriptions',
    value: 4,
    subtitle: 'Action needed',
    color: '#8B5CF6',
  },
  {
    label: 'Unread Messages',
    value: 11,
    color: '#64748B',
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    time: '09:00',
    patientName: 'Ahmed Al Maktoum',
    patientPhoto: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    age: 45,
    gender: 'M',
    reason: 'Annual physical examination',
    type: 'Follow-up',
    status: 'completed',
    lastVisit: '6 months ago',
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    medications: ['Metformin 500mg', 'Lisinopril 10mg'],
  },
  {
    id: '2',
    time: '09:30',
    patientName: 'Fatima Al Mansoori',
    patientPhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    age: 62,
    gender: 'F',
    reason: 'Follow-up - blood pressure management',
    type: 'Follow-up',
    status: 'completed',
    lastVisit: '2 weeks ago',
    conditions: ['Hypertension', 'Hyperlipidemia'],
    medications: ['Amlodipine 5mg', 'Atorvastatin 20mg'],
    aiNote: "Patient's blood pressure has been elevated in 3 recent home readings. Consider reviewing antihypertensive dosage.",
  },
  {
    id: '3',
    time: '10:00',
    patientName: 'John Davidson',
    patientPhoto: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
    age: 38,
    gender: 'M',
    reason: 'Persistent headaches',
    type: 'New',
    status: 'confirmed',
    aiNote: 'First-time patient. No prior medical records in system. Consider comprehensive intake assessment.',
  },
  {
    id: '4',
    time: '10:30',
    patientName: 'Mariam Hassan',
    patientPhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    age: 29,
    gender: 'F',
    reason: 'Prenatal checkup - 24 weeks',
    type: 'Follow-up',
    status: 'pending',
    lastVisit: '1 month ago',
    conditions: ['Pregnancy - 24 weeks'],
    medications: ['Prenatal vitamins'],
  },
  {
    id: '5',
    time: '11:00',
    patientName: 'Omar Abdullah',
    patientPhoto: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
    age: 56,
    gender: 'M',
    reason: 'Chest pain - urgent',
    type: 'Urgent',
    status: 'confirmed',
    conditions: ['Coronary artery disease', 'Type 2 Diabetes'],
    medications: ['Aspirin 81mg', 'Metformin 1000mg', 'Atorvastatin 40mg'],
    aiNote: 'URGENT: Patient reporting chest discomfort. Recent cardiac history. Ensure ECG and cardiac enzyme panel ordered.',
  },
  {
    id: '6',
    time: '11:30',
    patientName: 'Sarah Williams',
    patientPhoto: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=100',
    age: 41,
    gender: 'F',
    reason: 'Virtual consultation - medication review',
    type: 'Teleconsult',
    status: 'confirmed',
    lastVisit: '3 months ago',
    conditions: ['Hypothyroidism', 'Anxiety'],
    medications: ['Levothyroxine 100mcg', 'Sertraline 50mg'],
  },
  {
    id: '7',
    time: '14:00',
    patientName: 'Khalid Rahman',
    patientPhoto: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=100',
    age: 70,
    gender: 'M',
    reason: 'Diabetes management review',
    type: 'Follow-up',
    status: 'no-show',
    lastVisit: '1 month ago',
    conditions: ['Type 2 Diabetes', 'Chronic kidney disease'],
    medications: ['Insulin glargine', 'Metformin 500mg'],
  },
];

export const MOCK_CRITICAL_ALERTS: CriticalAlert[] = [
  {
    id: '1',
    patientName: 'Al Mansoori, Fatima',
    message: 'Critical Lab: Potassium 6.2 mEq/L',
    severity: 'critical',
    actionLabel: 'Contact Patient',
    actionType: 'contact',
  },
  {
    id: '2',
    patientName: 'Johnson, Mark',
    message: 'Missed 3 Metformin refills, HbA1c trend worsening',
    severity: 'warning',
    actionLabel: 'Send Message',
    actionType: 'message',
  },
];

export const MOCK_AI_INSIGHTS: AIInsight[] = [
  {
    id: '1',
    message: 'patients flagged for preventive screening review',
    count: 3,
    type: 'screening',
    color: 'bg-violet-50 border-violet-200 text-violet-900',
    expandable: true,
    details: [
      'Ahmed Al Maktoum - Colonoscopy due (age 50+)',
      'Sarah Williams - Mammogram overdue by 3 months',
      'Fatima Hassan - Bone density scan recommended',
    ],
  },
  {
    id: '2',
    message: 'Drug-drug interaction flagged on Rx #4821',
    type: 'interaction',
    color: 'bg-amber-50 border-amber-200 text-amber-900',
    expandable: true,
    details: [
      'Patient: Omar Abdullah',
      'Interaction: Aspirin + Warfarin',
      'Risk: Increased bleeding risk',
      'Recommendation: Consider dose adjustment or alternative anticoagulant',
    ],
  },
  {
    id: '3',
    message: 'Referral response received from Dr. Haddad — Neurology',
    type: 'referral',
    color: 'bg-teal-50 border-teal-200 text-teal-900',
    expandable: false,
  },
];

export const MOCK_PATIENT_ACTIVITIES: PatientActivity[] = [
  {
    id: '1',
    type: 'lab',
    patientName: 'Ahmed Al Maktoum',
    message: 'Lab results received: Complete Blood Count',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    actionLabel: 'Review',
  },
  {
    id: '2',
    type: 'message',
    patientName: 'Sarah Williams',
    message: 'New message: "When should I take my medication?"',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    actionLabel: 'Reply',
  },
  {
    id: '3',
    type: 'appointment',
    patientName: 'Mariam Hassan',
    message: 'Appointment request for next week',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    actionLabel: 'Schedule',
  },
  {
    id: '4',
    type: 'prescription',
    patientName: 'Omar Abdullah',
    message: 'Prescription filled: Atorvastatin 40mg',
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
  },
  {
    id: '5',
    type: 'lab',
    patientName: 'Fatima Al Mansoori',
    message: 'Lab results received: Lipid Panel - ABNORMAL',
    timestamp: new Date(Date.now() - 120 * 60 * 1000),
    actionLabel: 'Review',
  },
];
