export interface DoctorInfo {
  id: string;
  name: string;
  specialty: string;
  subspecialty: string;
  clinic: string;
  location: string;
  dhaLicense: string;
  licenseExpiry: string;
  consultationFee: number;
  telehealthFee: number;
  workingDays: string;
  workingHours: string;
  languages: string[];
  avatar: string;
}

export interface Appointment {
  id: string;
  time: string;
  duration: number;
  patientName: string;
  patientMRN: string;
  patientInitials: string;
  visitType: string;
  condition: string;
  insurance: string;
  insuranceColor: string;
  copay: number;
  copayPaid: boolean;
  status: 'completed' | 'in-progress' | 'upcoming' | 'urgent';
  notes: string;
  flags: AppointmentFlag[];
  chiefComplaint?: string;
}

export interface AppointmentFlag {
  type: 'allergy' | 'chronic' | 'lab' | 'prescription' | 'critical' | 'first-visit' | 'post-procedure';
  label: string;
  severity: 'high' | 'medium' | 'low';
}

export interface LabResult {
  id: string;
  patientName: string;
  patientMRN: string;
  testName: string;
  result: string;
  unit: string;
  referenceRange: string;
  status: 'critical' | 'pending' | 'complete';
  severity?: 'high' | 'low';
  labName: string;
  resultedTime: string;
  unacknowledgedMinutes?: number;
  orderedTime?: string;
  expectedTime?: string;
  reviewedDate?: string;
  reviewNotes?: string;
}

export interface Message {
  id: string;
  from: string;
  fromType: 'patient' | 'doctor' | 'lab' | 'pharmacy' | 'system';
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  priority: 'critical' | 'urgent' | 'normal';
  avatar?: string;
  initials?: string;
  color?: string;
}

export interface RevenueData {
  date: string;
  amount: number;
  consultations: number;
}

export interface AppointmentData {
  day: string;
  count: number;
  isToday: boolean;
  isPast: boolean;
}

export interface PatientQuickView {
  id: string;
  name: string;
  initials: string;
  age: number;
  gender: string;
  condition: string;
  status: 'in-progress' | 'completed' | 'upcoming' | 'critical';
  statusText: string;
  time?: string;
  hasAllergy: boolean;
  avatar: string;
}

export interface AIInsight {
  id: string;
  type: 'pattern' | 'interaction' | 'preventive';
  title: string;
  patientName: string;
  description: string;
  actionLabel: string;
  actionLink: string;
  icon: 'trending' | 'alert' | 'lightbulb';
  color: 'indigo' | 'amber' | 'emerald';
}

export interface DayStats {
  appointmentsTotal: number;
  appointmentsCompleted: number;
  appointmentsInProgress: number;
  appointmentsRemaining: number;
  prescriptionsWritten: number;
  labOrdersPlaced: number;
  unreadMessages: number;
  revenueToday: number;
  revenuePotential: number;
  criticalAlerts: number;
}

export const MOCK_DOCTOR: DoctorInfo = {
  id: 'DR-001',
  name: 'Dr. Ahmed Al Rashidi',
  specialty: 'Cardiologist',
  subspecialty: 'Interventional Cardiology',
  clinic: 'Al Noor Medical Center',
  location: 'Jumeirah, Dubai',
  dhaLicense: 'DHA-PRAC-2018-047821',
  licenseExpiry: 'Dec 2026',
  consultationFee: 400,
  telehealthFee: 300,
  workingDays: 'Sunday–Thursday',
  workingHours: '9AM–5PM',
  languages: ['Arabic', 'English'],
  avatar: 'AA',
};

export const MOCK_DAY_STATS: DayStats = {
  appointmentsTotal: 8,
  appointmentsCompleted: 5,
  appointmentsInProgress: 1,
  appointmentsRemaining: 2,
  prescriptionsWritten: 4,
  labOrdersPlaced: 3,
  unreadMessages: 4,
  revenueToday: 2400,
  revenuePotential: 3200,
  criticalAlerts: 1,
};

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-001',
    time: '9:00 AM',
    duration: 22,
    patientName: 'Khalid Hassan Abdullah',
    patientMRN: 'MRN-2024-1001',
    patientInitials: 'KH',
    visitType: 'Follow-up',
    condition: 'Hypertension management',
    insurance: 'ADNIC',
    insuranceColor: 'blue',
    copay: 40,
    copayPaid: true,
    status: 'completed',
    notes: 'BP well controlled. Continue Losartan.',
    flags: [],
  },
  {
    id: 'APT-002',
    time: '9:30 AM',
    duration: 28,
    patientName: 'Parnia Yazdkhasti',
    patientMRN: 'MRN-2024-1002',
    patientInitials: 'PY',
    visitType: 'Cardiology Follow-up',
    condition: 'Post-MRI review',
    insurance: 'Daman Gold',
    insuranceColor: 'purple',
    copay: 40,
    copayPaid: true,
    status: 'completed',
    notes: 'MRI reviewed — mild T1 elevation discussed. Lung nodule follow-up CT scheduled Feb 2027.',
    flags: [{ type: 'allergy', label: 'Penicillin allergy', severity: 'high' }],
  },
  {
    id: 'APT-003',
    time: '10:00 AM',
    duration: 35,
    patientName: 'Mohammed Al Shamsi',
    patientMRN: 'MRN-2024-1003',
    patientInitials: 'MS',
    visitType: 'New patient',
    condition: 'Chest pain workup',
    insurance: 'Daman Basic',
    insuranceColor: 'slate',
    copay: 40,
    copayPaid: true,
    status: 'completed',
    notes: 'ECG normal. Stress test ordered.',
    flags: [{ type: 'lab', label: 'Labs ordered', severity: 'medium' }],
  },
  {
    id: 'APT-004',
    time: '10:45 AM',
    duration: 20,
    patientName: 'Fatima Bint Rashid Al Maktoum',
    patientMRN: 'MRN-2024-1004',
    patientInitials: 'FR',
    visitType: 'Echocardiogram review',
    condition: 'Echo Review',
    insurance: 'Thiqa',
    insuranceColor: 'green',
    copay: 0,
    copayPaid: true,
    status: 'completed',
    notes: 'Echo: mild LVH. Added ACE inhibitor.',
    flags: [{ type: 'prescription', label: 'New Rx: Ramipril + Bisoprolol', severity: 'medium' }],
  },
  {
    id: 'APT-005',
    time: '11:30 AM',
    duration: 15,
    patientName: 'Abdullah Hassan Al Zaabi',
    patientMRN: 'MRN-2024-1005',
    patientInitials: 'AH',
    visitType: 'Urgent',
    condition: 'Chest pain (walk-in)',
    insurance: 'Daman Gold',
    insuranceColor: 'purple',
    copay: 40,
    copayPaid: true,
    status: 'completed',
    notes: 'Troponin I elevated (CRITICAL). Referred to Al Noor Emergency. STEMI protocol activated.',
    flags: [{ type: 'critical', label: 'Critical lab result', severity: 'high' }],
  },
  {
    id: 'APT-006',
    time: '2:00 PM',
    duration: 0,
    patientName: 'Aisha Mohammed Al Reem',
    patientMRN: 'MRN-2024-1006',
    patientInitials: 'AM',
    visitType: 'Follow-up',
    condition: 'Heart failure management',
    insurance: 'AXA Gulf',
    insuranceColor: 'blue',
    copay: 40,
    copayPaid: false,
    status: 'in-progress',
    notes: '',
    chiefComplaint: 'Increased shortness of breath',
    flags: [
      { type: 'chronic', label: 'Fluid retention noted', severity: 'medium' },
      { type: 'allergy', label: 'ACE inhibitor caution', severity: 'high' },
    ],
  },
  {
    id: 'APT-007',
    time: '2:45 PM',
    duration: 30,
    patientName: 'Saeed Al Mansoori',
    patientMRN: 'MRN-2024-1007',
    patientInitials: 'SM',
    visitType: 'Post-procedure follow-up',
    condition: 'Stent placement (3 months ago)',
    insurance: 'Oman Insurance',
    insuranceColor: 'red',
    copay: 50,
    copayPaid: false,
    status: 'upcoming',
    notes: '',
    flags: [{ type: 'post-procedure', label: 'Post-stent monitoring', severity: 'medium' }],
  },
  {
    id: 'APT-008',
    time: '3:30 PM',
    duration: 30,
    patientName: 'Noura Bint Khalid',
    patientMRN: 'MRN-2024-1008',
    patientInitials: 'NK',
    visitType: 'New patient',
    condition: 'Palpitations',
    insurance: 'Daman Basic',
    insuranceColor: 'slate',
    copay: 40,
    copayPaid: false,
    status: 'upcoming',
    notes: 'First visit — no prior records',
    flags: [{ type: 'first-visit', label: 'First visit', severity: 'low' }],
  },
];

export const MOCK_LAB_RESULTS: LabResult[] = [
  {
    id: 'LAB-001',
    patientName: 'Abdullah Hassan Al Zaabi',
    patientMRN: 'MRN-2024-1005',
    testName: 'Troponin I',
    result: '2.8',
    unit: 'ng/mL',
    referenceRange: '< 0.04',
    status: 'critical',
    severity: 'high',
    labName: 'Dubai Medical Laboratory',
    resultedTime: '11:47 AM',
    unacknowledgedMinutes: 72,
  },
  {
    id: 'LAB-002',
    patientName: 'Mohammed Al Shamsi',
    patientMRN: 'MRN-2024-1003',
    testName: 'BNP + Troponin + CBC',
    result: '',
    unit: '',
    referenceRange: '',
    status: 'pending',
    labName: 'Dubai Medical Laboratory',
    orderedTime: '10:30 AM',
    expectedTime: '5:00 PM',
    resultedTime: '',
  },
  {
    id: 'LAB-003',
    patientName: 'Parnia Yazdkhasti',
    patientMRN: 'MRN-2024-1002',
    testName: 'Full Panel',
    result: 'HbA1c 6.8%',
    unit: '%',
    referenceRange: '< 5.7',
    status: 'complete',
    labName: 'Dubai Medical Laboratory',
    resultedTime: 'March 5',
    reviewedDate: '5 March',
    reviewNotes: 'HbA1c 6.8% ↓ improving',
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'MSG-001',
    from: 'Dubai Medical Lab',
    fromType: 'lab',
    subject: 'CRITICAL RESULT',
    preview: 'CRITICAL: Abdullah Hassan — Troponin I 2.8 ng/mL. Please acknowledge immediately.',
    time: '11:47 AM',
    unread: true,
    priority: 'critical',
    initials: 'DML',
    color: 'red',
  },
  {
    id: 'MSG-002',
    from: 'Parnia Yazdkhasti',
    fromType: 'patient',
    subject: 'Vitals update',
    preview: 'Morning reading: 128/82. All good! ☕',
    time: '8:47 AM',
    unread: true,
    priority: 'normal',
    initials: 'PY',
    color: 'teal',
  },
  {
    id: 'MSG-003',
    from: 'Dr. Sarah Al Khateeb',
    fromType: 'doctor',
    subject: 'Patient referral',
    preview: 'Ahmed, I\'ve referred a patient to you — Mahmoud Siddiq, 52M, hypertrophic cardiomyopathy query.',
    time: '10:30 AM',
    unread: true,
    priority: 'normal',
    initials: 'SK',
    color: 'purple',
  },
  {
    id: 'MSG-004',
    from: 'Al Shifa Pharmacy',
    fromType: 'pharmacy',
    subject: 'Prescription query',
    preview: 'Query on Parnia Yazdkhasti\'s Atorvastatin — brand substitution to generic? Please confirm.',
    time: '1:15 PM',
    unread: true,
    priority: 'urgent',
    initials: 'ASP',
    color: 'amber',
  },
];

export const MOCK_REVENUE_DATA: RevenueData[] = [
  { date: 'Apr 1', amount: 2800, consultations: 7 },
  { date: 'Apr 2', amount: 3200, consultations: 8 },
  { date: 'Apr 3', amount: 0, consultations: 0 },
  { date: 'Apr 4', amount: 2400, consultations: 6 },
  { date: 'Apr 5', amount: 3600, consultations: 9 },
  { date: 'Apr 6', amount: 2800, consultations: 7 },
  { date: 'Apr 7', amount: 2400, consultations: 6 },
];

export const MOCK_APPOINTMENT_DATA: AppointmentData[] = [
  { day: 'Mon', count: 6, isToday: false, isPast: true },
  { day: 'Tue', count: 9, isToday: false, isPast: true },
  { day: 'Wed', count: 8, isToday: true, isPast: false },
  { day: 'Thu', count: 7, isToday: false, isPast: false },
  { day: 'Fri', count: 5, isToday: false, isPast: false },
];

export const MOCK_PATIENTS_QUICK: PatientQuickView[] = [
  {
    id: 'PT-006',
    name: 'Aisha Mohammed',
    initials: 'AM',
    age: 42,
    gender: 'F',
    condition: 'Heart Failure',
    status: 'in-progress',
    statusText: 'IN PROGRESS',
    time: '2:00 PM',
    hasAllergy: true,
    avatar: 'teal',
  },
  {
    id: 'PT-002',
    name: 'Parnia Yazdkhasti',
    initials: 'PY',
    age: 38,
    gender: 'F',
    condition: 'Cardiology',
    status: 'completed',
    statusText: 'Today 9:30 AM',
    hasAllergy: true,
    avatar: 'purple',
  },
  {
    id: 'PT-005',
    name: 'Abdullah Hassan',
    initials: 'AH',
    age: 55,
    gender: 'M',
    condition: 'Emergency',
    status: 'critical',
    statusText: 'Critical Lab Pending',
    hasAllergy: false,
    avatar: 'red',
  },
  {
    id: 'PT-007',
    name: 'Saeed Al Mansoori',
    initials: 'SM',
    age: 58,
    gender: 'M',
    condition: 'Post-Stent',
    status: 'upcoming',
    statusText: 'Next: 2:45 PM',
    hasAllergy: false,
    avatar: 'blue',
  },
  {
    id: 'PT-001',
    name: 'Khalid Hassan',
    initials: 'KH',
    age: 54,
    gender: 'M',
    condition: 'Hypertension',
    status: 'completed',
    statusText: 'Done 9:00 AM',
    hasAllergy: false,
    avatar: 'slate',
  },
];

export const MOCK_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'AI-001',
    type: 'pattern',
    title: 'Pattern Detected: Parnia Yazdkhasti',
    patientName: 'Parnia Yazdkhasti',
    description: 'HbA1c has improved 0.6% over 6 months at your current treatment. Projected to reach 6.5% target by June 2026. Diastolic BP also improved from 90 → 82 mmHg. Current regimen is effective.',
    actionLabel: 'View Patient',
    actionLink: '/doctor/patients/PT-002',
    icon: 'trending',
    color: 'indigo',
  },
  {
    id: 'AI-002',
    type: 'interaction',
    title: 'Potential Interaction — Aisha Mohammed',
    patientName: 'Aisha Mohammed',
    description: 'Enalapril (ACE inhibitor) + Spironolactone combination increases hyperkalemia risk. Current potassium: 4.1 mEq/L (borderline). Consider monitoring potassium closely at next visit.',
    actionLabel: 'Flag in Notes',
    actionLink: '#',
    icon: 'alert',
    color: 'amber',
  },
  {
    id: 'AI-003',
    type: 'preventive',
    title: 'Preventive Alert: Noura Bint Khalid',
    patientName: 'Noura Bint Khalid',
    description: 'New patient (3:30 PM) reporting palpitations. Age 34F with no prior cardiac history. Suggested: 12-lead ECG + 24h Holter as first step to rule out arrhythmia before further workup.',
    actionLabel: 'Add to Pre-Order',
    actionLink: '#',
    icon: 'lightbulb',
    color: 'emerald',
  },
];
