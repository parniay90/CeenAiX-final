export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  hospital: string;
  rating: number;
  languages: string[];
  nextAvailable: Date;
  consultationFee: number;
  inNetwork: boolean;
}

export interface AppointmentDetail {
  id: string;
  doctorName: string;
  doctorPhoto: string;
  specialty: string;
  clinicName: string;
  clinicAddress: string;
  date: Date;
  time: string;
  type: 'In-Person' | 'Teleconsult';
  status: 'Confirmed' | 'Awaiting Confirmation' | 'Completed' | 'Cancelled';
  prepNotes?: string;
  summary?: string;
  diagnosis?: string;
  prescriptionIssued?: boolean;
  followUpRequired?: boolean;
  followUpInstructions?: string;
  aiTakeaways?: string[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export const SPECIALTIES = [
  { id: 'gp', name: 'General Practice', icon: '🏥' },
  { id: 'cardiology', name: 'Cardiology', icon: '❤️' },
  { id: 'endocrinology', name: 'Endocrinology', icon: '💉' },
  { id: 'orthopedics', name: 'Orthopedics', icon: '🦴' },
  { id: 'dermatology', name: 'Dermatology', icon: '🧴' },
  { id: 'ophthalmology', name: 'Ophthalmology', icon: '👁️' },
  { id: 'gynecology', name: 'Gynecology', icon: '👶' },
  { id: 'pediatrics', name: 'Pediatrics', icon: '🧒' },
  { id: 'mental-health', name: 'Mental Health', icon: '🧠' },
  { id: 'dentistry', name: 'Dentistry', icon: '🦷' },
];

export const MOCK_DOCTORS: Doctor[] = [
  // ── Existing doctors ──────────────────────────────────────────────────────
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    photo: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=100',
    hospital: 'Dubai Healthcare City',
    rating: 4.8,
    languages: ['English', 'Arabic'],
    nextAvailable: new Date('2026-04-10T15:00:00'),
    consultationFee: 500,
    inNetwork: true,
  },
  {
    id: '2',
    name: 'Dr. Mohammed Al Zarooni',
    specialty: 'Endocrinology',
    photo: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
    hospital: 'Mediclinic Dubai Mall',
    rating: 4.9,
    languages: ['Arabic', 'English', 'Urdu'],
    nextAvailable: new Date('2026-04-15T10:30:00'),
    consultationFee: 450,
    inNetwork: true,
  },
  {
    id: '3',
    name: 'Dr. Fatima Hassan',
    specialty: 'General Practice',
    photo: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100',
    hospital: 'Cleveland Clinic Abu Dhabi',
    rating: 4.7,
    languages: ['Arabic', 'English', 'French'],
    nextAvailable: new Date('2026-04-08T09:00:00'),
    consultationFee: 350,
    inNetwork: true,
  },
  {
    id: '4',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Orthopedics',
    photo: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=100',
    hospital: 'American Hospital Dubai',
    rating: 4.6,
    languages: ['English', 'Hindi', 'Urdu'],
    nextAvailable: new Date('2026-04-12T14:00:00'),
    consultationFee: 550,
    inNetwork: true,
  },

  // ── New doctors for missing specialties ───────────────────────────────────
  {
    id: '5',
    name: 'Dr. Layla Al Mansouri',
    specialty: 'Dermatology',
    photo: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100',
    hospital: 'Mediclinic City Hospital',
    rating: 4.8,
    languages: ['Arabic', 'English'],
    nextAvailable: new Date('2026-04-11T11:00:00'),
    consultationFee: 400,
    inNetwork: true,
  },
  {
    id: '6',
    name: 'Dr. Ahmed Al Rashidi',
    specialty: 'Ophthalmology',
    photo: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=100',
    hospital: 'Dubai Healthcare City',
    rating: 4.7,
    languages: ['Arabic', 'English'],
    nextAvailable: new Date('2026-04-13T10:00:00'),
    consultationFee: 480,
    inNetwork: true,
  },
  {
    id: '7',
    name: 'Dr. Noor Al Farsi',
    specialty: 'Gynecology',
    photo: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=100',
    hospital: 'Latifa Hospital Dubai',
    rating: 4.9,
    languages: ['Arabic', 'English', 'French'],
    nextAvailable: new Date('2026-04-09T09:30:00'),
    consultationFee: 420,
    inNetwork: true,
  },
  {
    id: '8',
    name: 'Dr. Priya Sharma',
    specialty: 'Pediatrics',
    photo: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100',
    hospital: 'Mediclinic Dubai Mall',
    rating: 4.8,
    languages: ['English', 'Hindi', 'Arabic'],
    nextAvailable: new Date('2026-04-10T08:30:00'),
    consultationFee: 380,
    inNetwork: true,
  },
  {
    id: '9',
    name: 'Dr. Omar Al Suwaidi',
    specialty: 'Mental Health',
    photo: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
    hospital: 'American Hospital Dubai',
    rating: 4.9,
    languages: ['Arabic', 'English'],
    nextAvailable: new Date('2026-04-14T02:00:00'),
    consultationFee: 500,
    inNetwork: false,
  },
  {
    id: '10',
    name: 'Dr. Hana Al Blooshi',
    specialty: 'Dentistry',
    photo: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=100',
    hospital: 'Dubai Healthcare City',
    rating: 4.7,
    languages: ['Arabic', 'English'],
    nextAvailable: new Date('2026-04-11T03:00:00'),
    consultationFee: 350,
    inNetwork: true,
  },
];

export const MOCK_APPOINTMENTS: AppointmentDetail[] = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Johnson',
    doctorPhoto: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=100',
    specialty: 'Cardiology',
    clinicName: 'Dubai Healthcare City',
    clinicAddress: 'Building 27, Dubai Healthcare City, Dubai',
    date: new Date('2026-04-10T15:00:00'),
    time: '3:00 PM',
    type: 'In-Person',
    status: 'Confirmed',
    prepNotes: 'Bring your Emirates ID and insurance card. Your doctor may ask about your blood pressure readings from last week.',
  },
  {
    id: '2',
    doctorName: 'Dr. Mohammed Al Zarooni',
    doctorPhoto: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
    specialty: 'Endocrinology',
    clinicName: 'Mediclinic Dubai Mall',
    clinicAddress: 'Level 2, Dubai Mall, Downtown Dubai',
    date: new Date('2026-04-15T10:30:00'),
    time: '10:30 AM',
    type: 'Teleconsult',
    status: 'Confirmed',
    prepNotes: 'Ensure you have a stable internet connection. Keep your latest HbA1c results ready to discuss.',
  },
  {
    id: '3',
    doctorName: 'Dr. Fatima Hassan',
    doctorPhoto: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100',
    specialty: 'General Practice',
    clinicName: 'Cleveland Clinic Abu Dhabi',
    clinicAddress: 'Al Maryah Island, Abu Dhabi',
    date: new Date('2026-04-20T09:00:00'),
    time: '9:00 AM',
    type: 'In-Person',
    status: 'Awaiting Confirmation',
    prepNotes: 'Please arrive 15 minutes early for registration. Fast for 8 hours if blood work is needed.',
  },
];

export const MOCK_PAST_APPOINTMENTS: AppointmentDetail[] = [
  {
    id: '4',
    doctorName: 'Dr. Sarah Johnson',
    doctorPhoto: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=100',
    specialty: 'Cardiology',
    clinicName: 'Dubai Healthcare City',
    clinicAddress: 'Building 27, Dubai Healthcare City, Dubai',
    date: new Date('2026-03-28T15:00:00'),
    time: '3:00 PM',
    type: 'In-Person',
    status: 'Completed',
    summary: 'Routine cardiology check-up',
    diagnosis: 'Essential Hypertension - stable and controlled',
    prescriptionIssued: true,
    followUpRequired: true,
    followUpInstructions: 'Continue current medication. Schedule follow-up in 3 months. Monitor blood pressure daily.',
    aiTakeaways: [
      'Blood pressure is well-controlled on current medication',
      'No changes to treatment plan needed',
      'Next visit recommended in 3 months',
    ],
  },
  {
    id: '5',
    doctorName: 'Dr. Mohammed Al Zarooni',
    doctorPhoto: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
    specialty: 'Endocrinology',
    clinicName: 'Mediclinic Dubai Mall',
    clinicAddress: 'Level 2, Dubai Mall, Downtown Dubai',
    date: new Date('2026-02-15T10:30:00'),
    time: '10:30 AM',
    type: 'Teleconsult',
    status: 'Completed',
    summary: 'Diabetes management review',
    diagnosis: 'Type 2 Diabetes Mellitus - improving',
    prescriptionIssued: false,
    followUpRequired: true,
    followUpInstructions: 'Continue Metformin 500mg twice daily. Increase physical activity to 30 min/day. Check HbA1c in 3 months.',
    aiTakeaways: [
      'HbA1c improved from 7.2% to 6.8%',
      'Current medication regimen is effective',
      'Lifestyle modifications showing positive results',
    ],
  },
];

export const MOCK_TIME_SLOTS: TimeSlot[] = [
  { time: '09:00 AM', available: true },
  { time: '09:30 AM', available: false },
  { time: '10:00 AM', available: true },
  { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: false },
  { time: '11:30 AM', available: true },
  { time: '02:00 PM', available: true },
  { time: '02:30 PM', available: true },
  { time: '03:00 PM', available: false },
  { time: '03:30 PM', available: true },
  { time: '04:00 PM', available: true },
  { time: '04:30 PM', available: true },
];