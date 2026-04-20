export interface PatientInfo {
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  emiratesId: string;
  phone: string;
  email: string;
}

export interface Insurance {
  provider: string;
  plan: string;
  policyNumber: string;
  validUntil: string;
  annualLimit: number;
  used: number;
  coPay: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  frequency: string;
  nextDose: string;
  nextDoseTime: string;
  status: 'taken' | 'due' | 'scheduled';
  takenAt?: string;
  refillDays: number;
  pharmacy: string;
  color: string;
  morning?: { time: string; status: 'taken' | 'pending'; takenAt?: string };
  evening?: { time: string; status: 'taken' | 'pending'; takenAt?: string };
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  location: string;
  avatar: string;
  initials: string;
  isOnline: boolean;
  nextAppointment?: string;
  daysUntil?: number;
  coordinates?: { lat: number; lng: number };
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: Doctor;
  type: string;
  daysUntil: number;
  insurance: string;
  coPay: number;
}

export interface Message {
  id: string;
  from: string;
  fromDoctor: Doctor;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface HbA1cReading {
  month: string;
  value: number;
  date: string;
}

export interface BPReading {
  date: string;
  systolic: number;
  diastolic: number;
}

export interface HealthStat {
  label: string;
  value: string;
  unit: string;
  status: string;
  statusColor: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'stable';
  context: string;
  icon: string;
  iconColor: string;
}

export interface AIHealthTip {
  id: string;
  content: string;
  category: string;
}

export const MOCK_PATIENT: PatientInfo = {
  name: 'Parnia Yazdkhasti',
  age: 38,
  gender: 'Female',
  bloodType: 'A+',
  emiratesId: '784-1988-XXXXXXX-X',
  phone: '+971 50 XXX XXXX',
  email: 'parnia.y@example.ae',
};

export const MOCK_INSURANCE: Insurance = {
  provider: 'Daman',
  plan: 'Gold',
  policyNumber: 'DAM-2024-XXXXXX',
  validUntil: 'Dec 2026',
  annualLimit: 150000,
  used: 8450,
  coPay: 10,
};

export const MOCK_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    name: 'Metformin',
    dosage: '850mg',
    instructions: 'Take with meals',
    frequency: 'twice daily',
    nextDose: '8:00 PM tonight',
    nextDoseTime: '20:00',
    status: 'due',
    refillDays: 21,
    pharmacy: 'Al Shifa Pharmacy',
    color: 'blue',
    morning: { time: '8:00 AM', status: 'taken', takenAt: '8:12 AM' },
    evening: { time: '8:00 PM', status: 'pending' },
  },
  {
    id: 'med-2',
    name: 'Atorvastatin',
    dosage: '20mg',
    instructions: 'Take at bedtime',
    frequency: 'once daily',
    nextDose: '10:00 PM tonight',
    nextDoseTime: '22:00',
    status: 'due',
    refillDays: 28,
    pharmacy: 'Al Shifa Pharmacy',
    color: 'purple',
  },
  {
    id: 'med-3',
    name: 'Amlodipine',
    dosage: '5mg',
    instructions: 'Take in morning',
    frequency: 'once daily',
    nextDose: 'Tomorrow 8:00 AM',
    nextDoseTime: '08:00',
    status: 'taken',
    takenAt: '8:12 AM',
    refillDays: 28,
    pharmacy: 'Al Shifa Pharmacy',
    color: 'red',
  },
  {
    id: 'med-4',
    name: 'Vitamin D',
    dosage: '2000IU',
    instructions: 'Once daily',
    frequency: 'once daily',
    nextDose: 'Tomorrow 8:00 AM',
    nextDoseTime: '08:00',
    status: 'taken',
    takenAt: '8:12 AM',
    refillDays: 45,
    pharmacy: 'Al Shifa Pharmacy',
    color: 'yellow',
  },
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Ahmed Al Rashidi',
    specialty: 'Cardiologist',
    clinic: 'Al Noor Medical Center',
    location: 'Jumeirah',
    avatar: '',
    initials: 'AA',
    isOnline: true,
    nextAppointment: 'Apr 15, 2026',
    daysUntil: 30,
    coordinates: { lat: 25.2048, lng: 55.2708 },
  },
  {
    id: 'doc-2',
    name: 'Dr. Fatima Al Mansoori',
    specialty: 'Endocrinologist',
    clinic: 'Dubai Specialist Clinic',
    location: 'Dubai Healthcare City',
    avatar: '',
    initials: 'FA',
    isOnline: false,
    nextAppointment: 'Jun 5, 2026',
    daysUntil: 81,
    coordinates: { lat: 25.2333, lng: 55.3567 },
  },
  {
    id: 'doc-3',
    name: 'Dr. Tooraj Helmi',
    specialty: 'General Practitioner',
    clinic: 'Gulf Medical Center',
    location: 'Marina',
    avatar: '',
    initials: 'TH',
    isOnline: false,
    coordinates: { lat: 25.0819, lng: 55.1367 },
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-1',
    date: 'April 15, 2026',
    time: '10:30 AM',
    doctor: MOCK_DOCTORS[0],
    type: 'Cardiology Follow-up',
    daysUntil: 30,
    insurance: 'Daman Gold — covered',
    coPay: 40,
  },
  {
    id: 'appt-2',
    date: 'June 5, 2026',
    time: '2:00 PM',
    doctor: MOCK_DOCTORS[1],
    type: 'Endocrinology 3-month check',
    daysUntil: 81,
    insurance: 'Daman Gold — covered',
    coPay: 40,
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    from: 'Dr. Ahmed Al Rashidi',
    fromDoctor: MOCK_DOCTORS[0],
    content: 'Please do not skip your Amlodipine. BP was slightly elevated at your last visit.',
    timestamp: '2 hours ago',
    isRead: false,
  },
  {
    id: 'msg-2',
    from: 'Dr. Fatima Al Mansoori',
    fromDoctor: MOCK_DOCTORS[1],
    content: 'Your HbA1c is improving — keep up the diet changes, Parnia 💪',
    timestamp: '1 day ago',
    isRead: false,
  },
];

export const MOCK_HBA1C_DATA: HbA1cReading[] = [
  { month: 'Sep', value: 7.4, date: 'Sep 2025' },
  { month: 'Oct', value: 7.2, date: 'Oct 2025' },
  { month: 'Nov', value: 7.1, date: 'Nov 2025' },
  { month: 'Dec', value: 7.0, date: 'Dec 2025' },
  { month: 'Jan', value: 6.9, date: 'Jan 2026' },
  { month: 'Mar', value: 6.8, date: 'Mar 2026' },
];

export const MOCK_BP_DATA: BPReading[] = [
  { date: 'Mar 8', systolic: 131, diastolic: 84 },
  { date: 'Mar 9', systolic: 129, diastolic: 82 },
  { date: 'Mar 10', systolic: 128, diastolic: 83 },
  { date: 'Mar 11', systolic: 130, diastolic: 81 },
  { date: 'Mar 12', systolic: 127, diastolic: 80 },
  { date: 'Mar 13', systolic: 126, diastolic: 82 },
  { date: 'Mar 14', systolic: 128, diastolic: 82 },
];

export const MOCK_AI_TIPS: AIHealthTip[] = [
  {
    id: 'tip-1',
    content: '💡 Walking 30 minutes after meals has been shown to significantly reduce post-meal blood glucose spikes for people with Type 2 Diabetes — especially effective after your largest meal of the day.',
    category: 'diabetes',
  },
  {
    id: 'tip-2',
    content: '💡 Avoid large amounts of dates and fruit juices — despite being natural, they cause rapid blood sugar spikes. Choose whole fruit instead.',
    category: 'diabetes',
  },
  {
    id: 'tip-3',
    content: '💡 Your Amlodipine is most effective when taken at the same time every day. Morning is ideal — set a reminder.',
    category: 'medication',
  },
  {
    id: 'tip-4',
    content: '💡 Stress raises blood pressure. Even 10 minutes of deep breathing or Quran recitation can help lower your BP.',
    category: 'hypertension',
  },
  {
    id: 'tip-5',
    content: '💡 Staying hydrated helps your kidneys process Metformin effectively. Aim for 8 glasses of water daily.',
    category: 'medication',
  },
];
