export type PatientNotifCategory =
  | 'all'
  | 'appointments'
  | 'results'
  | 'medications'
  | 'messages'
  | 'ai'
  | 'insurance'
  | 'records'
  | 'system';

export type PatientNotifType =
  | 'prescription-ready'
  | 'message'
  | 'lab-result'
  | 'ai-insight'
  | 'appointment-confirmed'
  | 'appointment-reminder'
  | 'medication-refill'
  | 'insurance-claim'
  | 'health-record'
  | 'imaging-report'
  | 'prescription-issued'
  | 'appointment-summary'
  | 'insurance-renewal';

export interface PatientNotification {
  id: string;
  type: PatientNotifType;
  category: PatientNotifCategory;
  title: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
  source: string;
  actionLabel: string;
  actionRoute: string;
  secondaryActionLabel?: string;
  secondaryActionRoute?: string;
  badge?: { text: string; color: 'amber' | 'violet' | 'blue' | 'green' | 'teal' };
  snoozedUntil?: Date;
}

const now = new Date('2026-04-07T14:07:00');
const today = (h: number, m: number) =>
  new Date(`2026-04-07T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
const daysAgo = (d: number, h = 9, m = 0) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() - d);
  dt.setHours(h, m, 0, 0);
  return dt;
};
const monthsAgo = (mo: number, d: number, h = 10, m = 0) => {
  const dt = new Date(now);
  dt.setMonth(dt.getMonth() - mo, d);
  dt.setHours(h, m, 0, 0);
  return dt;
};

export const PARNIA_NOTIFICATIONS: PatientNotification[] = [
  {
    id: 'pn-01',
    type: 'prescription-ready',
    category: 'medications',
    title: 'Prescription Ready for Pickup',
    body: 'Your Atorvastatin 20mg (90 tabs) + Amlodipine 5mg (90 tabs) are ready for pickup at Al Shifa Pharmacy, Al Barsha. Open until 10 PM today.',
    timestamp: today(14, 10),
    isRead: false,
    source: 'Al Shifa Pharmacy',
    actionLabel: 'Get Directions',
    actionRoute: '/medications',
    secondaryActionLabel: 'View Medications',
    secondaryActionRoute: '/medications',
  },
  {
    id: 'pn-02',
    type: 'message',
    category: 'messages',
    title: 'Message from Dr. Ahmed Al Rashidi',
    body: 'Your lab results look great — LDL has improved significantly on Atorvastatin. He\'s pleased with the progress and will discuss next steps on April 15.',
    timestamp: today(14, 15),
    isRead: false,
    source: 'Al Noor Medical Center',
    actionLabel: 'Read Message',
    actionRoute: '/messages',
  },
  {
    id: 'pn-03',
    type: 'lab-result',
    category: 'results',
    title: 'Lab Results Available — March 2026',
    body: 'Your full blood panel from March 5, 2026 is ready. Results include HbA1c, lipid panel, vitamin D, renal function, and thyroid. 3 values are outside normal range.',
    timestamp: today(11, 20),
    isRead: false,
    source: 'Dubai Medical Lab',
    actionLabel: 'View Results',
    actionRoute: '/lab-results',
    secondaryActionLabel: 'Ask AI to explain',
    secondaryActionRoute: '/ai-assistant',
    badge: { text: '3 flags ⚠️', color: 'amber' },
  },
  {
    id: 'pn-04',
    type: 'ai-insight',
    category: 'ai',
    title: 'AI Health Insight — Your Progress This Month',
    body: 'Your HbA1c has improved from 7.4% to 6.8% since January — great progress! Your LDL is now within target range. New personalized recommendations are ready.',
    timestamp: today(9, 0),
    isRead: false,
    source: 'CeenAiX AI',
    actionLabel: 'View AI Insights',
    actionRoute: '/ai-assistant',
    badge: { text: 'AI', color: 'violet' },
  },
  {
    id: 'pn-05',
    type: 'appointment-confirmed',
    category: 'appointments',
    title: 'Appointment Confirmed — April 15',
    body: 'Your cardiology follow-up with Dr. Ahmed Al Rashidi at Al Noor Medical Center is confirmed for April 15, 2026 at 10:30 AM. Duration: ~30 minutes.',
    timestamp: today(8, 30),
    isRead: true,
    source: 'Al Noor Medical Center',
    actionLabel: 'View Appointment',
    actionRoute: '/appointments',
    secondaryActionLabel: 'Get Directions',
    secondaryActionRoute: '/appointments',
  },
  {
    id: 'pn-06',
    type: 'medication-refill',
    category: 'medications',
    title: 'Medication Refill Due in 30 Days',
    body: 'Your Atorvastatin 20mg prescription (90 tabs) will run out in approximately 30 days. Your next valid prescription is until May 7, 2026. Consider requesting a refill at your upcoming appointment.',
    timestamp: daysAgo(1, 10, 0),
    isRead: true,
    source: 'Al Shifa Pharmacy',
    actionLabel: 'Request Refill',
    actionRoute: '/medications',
    badge: { text: '30 days', color: 'amber' },
  },
  {
    id: 'pn-07',
    type: 'insurance-claim',
    category: 'insurance',
    title: 'Insurance Claim Approved — AED 360',
    body: 'Your Daman Gold claim CLM-20260407-00481 for your April 7 cardiology consultation has been approved. Daman paid AED 360 directly to Al Noor Medical Center.',
    timestamp: daysAgo(1, 14, 30),
    isRead: true,
    source: 'Daman Gold',
    actionLabel: 'View Claim',
    actionRoute: '/patient/insurance',
    badge: { text: 'AED 360 ✅', color: 'green' },
  },
  {
    id: 'pn-08',
    type: 'appointment-reminder',
    category: 'appointments',
    title: 'Appointment Tomorrow — Dr. Ahmed',
    body: 'Reminder: You have a cardiology appointment tomorrow, April 7 at 9:30 AM at Al Noor Medical Center. Please bring your Emirates ID and insurance card.',
    timestamp: daysAgo(1, 18, 0),
    isRead: true,
    source: 'Al Noor Medical Center',
    actionLabel: 'View Appointment',
    actionRoute: '/appointments',
  },
  {
    id: 'pn-09',
    type: 'health-record',
    category: 'records',
    title: 'Health Record Updated by Dr. Ahmed',
    body: 'Dr. Ahmed Al Rashidi has updated your health record following your April 5 consultation. New entries: blood pressure readings, SOAP notes, updated care plan.',
    timestamp: daysAgo(2, 16, 45),
    isRead: true,
    source: 'Al Noor Medical Center',
    actionLabel: 'View Record',
    actionRoute: '/my-health',
  },
  {
    id: 'pn-10',
    type: 'imaging-report',
    category: 'results',
    title: 'Cardiac MRI Report Finalized',
    body: 'Dr. Rania Al Suwaidi FRCR has signed and released your Cardiac MRI report. LVEF 64% (normal), T1 mildly elevated, no late gadolinium enhancement detected.',
    timestamp: daysAgo(5, 11, 30),
    isRead: true,
    source: 'Dubai Medical & Imaging',
    actionLabel: 'View Report',
    actionRoute: '/imaging',
  },
  {
    id: 'pn-11',
    type: 'prescription-issued',
    category: 'medications',
    title: 'New Prescription Issued — Dr. Ahmed',
    body: 'Dr. Ahmed Al Rashidi has issued a 3-month prescription renewal: Atorvastatin 20mg × 90 tabs + Amlodipine 5mg × 90 tabs. Sent to Al Shifa Pharmacy.',
    timestamp: monthsAgo(0, 14, 15, 30),
    isRead: true,
    source: 'Al Noor Medical Center',
    actionLabel: 'View Prescription',
    actionRoute: '/medications',
  },
  {
    id: 'pn-12',
    type: 'appointment-summary',
    category: 'appointments',
    title: 'Visit Summary — March 14 Consultation',
    body: 'Your cardiology visit summary with Dr. Ahmed is available in your health records. Includes SOAP notes, updated care plan, and next steps.',
    timestamp: monthsAgo(0, 14, 17, 0),
    isRead: true,
    source: 'Al Noor Medical Center',
    actionLabel: 'View Summary',
    actionRoute: '/my-health',
  },
  {
    id: 'pn-13',
    type: 'insurance-renewal',
    category: 'insurance',
    title: 'Daman Gold Policy Renewed for 2026',
    body: 'Your Daman Gold individual policy has been renewed for 2026. Annual benefit: AED 500,000. Co-pay: 10%. Valid: 1 January – 31 December 2026.',
    timestamp: new Date('2026-01-01T09:00:00'),
    isRead: true,
    source: 'Daman Gold',
    actionLabel: 'View Insurance',
    actionRoute: '/patient/insurance',
    badge: { text: '2026 ✅', color: 'blue' },
  },
];

export const CATEGORY_META: Record<PatientNotifCategory, {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}> = {
  all: { label: 'All Notifications', icon: 'Bell', color: '#64748B', bgColor: '#F8FAFC', textColor: '#475569', borderColor: '#CBD5E1' },
  appointments: { label: 'Appointments', icon: 'Calendar', color: '#059669', bgColor: '#ECFDF5', textColor: '#065F46', borderColor: '#6EE7B7' },
  results: { label: 'Lab & Imaging', icon: 'FlaskConical', color: '#1D4ED8', bgColor: '#EFF6FF', textColor: '#1E3A8A', borderColor: '#93C5FD' },
  medications: { label: 'Medications', icon: 'Pill', color: '#7C3AED', bgColor: '#F5F3FF', textColor: '#4C1D95', borderColor: '#C4B5FD' },
  messages: { label: 'Messages', icon: 'MessageSquare', color: '#0D9488', bgColor: '#F0FDFA', textColor: '#134E4A', borderColor: '#5EEAD4' },
  ai: { label: 'AI Insights', icon: 'Bot', color: '#7C3AED', bgColor: '#F5F3FF', textColor: '#4C1D95', borderColor: '#C4B5FD' },
  insurance: { label: 'Insurance', icon: 'Shield', color: '#1E3A5F', bgColor: '#EFF6FF', textColor: '#1E3A8A', borderColor: '#93C5FD' },
  records: { label: 'Health Records', icon: 'FileText', color: '#1D4ED8', bgColor: '#EFF6FF', textColor: '#1E3A8A', borderColor: '#93C5FD' },
  system: { label: 'System', icon: 'Settings', color: '#64748B', bgColor: '#F8FAFC', textColor: '#475569', borderColor: '#CBD5E1' },
};

export function getNotifTypeConfig(type: PatientNotifType) {
  const configs: Record<PatientNotifType, { icon: string; iconBg: string; iconColor: string }> = {
    'prescription-ready': { icon: 'ShoppingBag', iconBg: '#FEF3C7', iconColor: '#D97706' },
    'message': { icon: 'MessageSquare', iconBg: '#F0FDFA', iconColor: '#0D9488' },
    'lab-result': { icon: 'FlaskConical', iconBg: '#DBEAFE', iconColor: '#1D4ED8' },
    'ai-insight': { icon: 'Bot', iconBg: '#EDE9FE', iconColor: '#7C3AED' },
    'appointment-confirmed': { icon: 'Calendar', iconBg: '#D1FAE5', iconColor: '#059669' },
    'appointment-reminder': { icon: 'Calendar', iconBg: '#D1FAE5', iconColor: '#059669' },
    'medication-refill': { icon: 'Pill', iconBg: '#EDE9FE', iconColor: '#7C3AED' },
    'insurance-claim': { icon: 'Shield', iconBg: '#DBEAFE', iconColor: '#1E3A5F' },
    'health-record': { icon: 'FileText', iconBg: '#DBEAFE', iconColor: '#1D4ED8' },
    'imaging-report': { icon: 'Scan', iconBg: '#DBEAFE', iconColor: '#1D4ED8' },
    'prescription-issued': { icon: 'Pill', iconBg: '#EDE9FE', iconColor: '#7C3AED' },
    'appointment-summary': { icon: 'CheckCircle', iconBg: '#D1FAE5', iconColor: '#059669' },
    'insurance-renewal': { icon: 'Shield', iconBg: '#DBEAFE', iconColor: '#1E3A5F' },
  };
  return configs[type];
}

export function formatNotifTime(date: Date): string {
  const now = new Date('2026-04-07T14:07:00');
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  if (diffDays === 1) {
    return 'Yesterday · ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  if (diffDays < 7) {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' · ' +
      date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function groupNotificationsByDate(notifications: PatientNotification[]): {
  label: string;
  items: PatientNotification[];
}[] {
  const now = new Date('2026-04-07T14:07:00');
  const today: PatientNotification[] = [];
  const yesterday: PatientNotification[] = [];
  const thisWeek: PatientNotification[] = [];
  const older: PatientNotification[] = [];

  const todayDate = new Date(now);
  todayDate.setHours(0, 0, 0, 0);
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const weekDate = new Date(todayDate);
  weekDate.setDate(weekDate.getDate() - 7);

  for (const n of notifications) {
    const d = new Date(n.timestamp);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === todayDate.getTime()) today.push(n);
    else if (d.getTime() === yesterdayDate.getTime()) yesterday.push(n);
    else if (d >= weekDate) thisWeek.push(n);
    else older.push(n);
  }

  const groups = [];
  if (today.length) groups.push({ label: 'TODAY — 7 April 2026', items: today });
  if (yesterday.length) groups.push({ label: 'YESTERDAY — 6 April 2026', items: yesterday });
  if (thisWeek.length) groups.push({ label: 'THIS WEEK', items: thisWeek });
  if (older.length) groups.push({ label: 'OLDER', items: older });
  return groups;
}
