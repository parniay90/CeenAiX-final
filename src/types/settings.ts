export type SettingsSection =
  | 'general'
  | 'appearance'
  | 'notifications'
  | 'dashboard'
  | 'health-data'
  | 'connections'
  | 'ai'
  | 'privacy'
  | 'security'
  | 'devices'
  | 'accessibility'
  | 'language'
  | 'help'
  | 'feedback'
  | 'about';

export type NotificationChannel = 'push' | 'sms' | 'email' | 'whatsapp';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'teal' | 'emerald' | 'blue' | 'purple' | 'indigo' | 'slate';
export type FontSize = 'small' | 'medium' | 'large' | 'xl';
export type SidebarStyle = 'expanded' | 'collapsed' | 'auto-hide';

export interface GeneralSettings {
  defaultHome: string;
  autoLogoutTimer: number;
  stayLoggedIn: boolean;
  compactMode: boolean;
  quickActions: boolean;
}

export interface AppearanceSettings {
  theme: ThemeMode;
  accentColor: AccentColor;
  fontSize: FontSize;
  sidebarStyle: SidebarStyle;
  cardShadows: boolean;
  animations: boolean;
  chartStyle: 'filled' | 'lines' | 'bars';
}

export interface NotificationSettings {
  allNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  whatsappEnabled: boolean;
  emailDigest: 'daily' | 'weekly' | 'monthly' | 'off';
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  notificationSound: boolean;
  vibration: boolean;
  medicationReminderTiming: number;
  appointmentReminders: string[];
  labResultAlerts: boolean;
  messageNotifications: boolean;
  refillReminderDays: number[];
}

export interface DashboardSettings {
  todaysMedications: boolean;
  upcomingAppointment: boolean;
  healthStats: boolean;
  messagesPreview: boolean;
  hbA1cChart: boolean;
  insuranceSnapshot: boolean;
  bloodPressureChart: boolean;
  careTeam: boolean;
  aiHealthTip: boolean;
  remindersStrip: boolean;
  healthScore: boolean;
  healthScoreDetail: 'always' | 'hover' | 'hide';
  quickVitals: boolean;
  defaultVital: string;
}

export interface HealthDataSettings {
  glucoseUnit: 'mg/dL' | 'mmol/L';
  weightUnit: 'kg' | 'lbs';
  heightUnit: 'cm' | 'ft/in';
  temperatureUnit: 'C' | 'F';
  bpTargetSystolic: number;
  bpTargetDiastolic: number;
  hbA1cTarget: number;
  homeVitalsReminders: boolean;
  vitalsReminderFrequency: string;
  vitalsHistoryDisplay: string;
  labHistoryDisplay: string;
  autoShareVitals: boolean;
}

export interface ConnectionSettings {
  appleHealthConnected: boolean;
  googleFitConnected: boolean;
  fitbitConnected: boolean;
  garminConnected: boolean;
  calendarSync: boolean;
  damanLinked: boolean;
}

export interface AISettings {
  aiEnabled: boolean;
  aiLanguages: string[];
  responseDetail: 'brief' | 'detailed' | 'comprehensive';
  responseStyle: 'friendly' | 'clinical' | 'simple';
  dataAccess: string[];
  showDisclaimers: boolean;
  proactiveTips: boolean;
  tipFrequency: 'daily' | 'twice-daily' | 'weekly' | 'off';
  voiceInput: boolean;
  conversationHistory: string;
}

export interface PrivacySettings {
  nabidheConsent: boolean;
  researchParticipation: boolean;
  insuranceDataSharing: boolean;
  doctorSharing: boolean;
  pharmacyAccess: boolean;
  analytics: boolean;
  crashReports: boolean;
}

export interface SecuritySettings {
  password: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'sms' | 'authenticator' | null;
  biometricLogin: boolean;
  loginAlerts: boolean;
  suspiciousActivityAlerts: boolean;
  trustDevice: boolean;
  encryptExports: boolean;
}

export interface AccessibilitySettings {
  fontSize: FontSize;
  lineSpacing: 'compact' | 'normal' | 'relaxed' | 'spacious';
  highContrast: boolean;
  largeTouchTargets: boolean;
  reduceMotion: boolean;
  screenReaderOptimized: boolean;
  enhancedFocusIndicators: boolean;
  colorBlindMode: 'standard' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'monochromacy';
  dyslexiaFriendlyFont: boolean;
}

export interface LanguageSettings {
  portalLanguage: string;
  aiLanguages: string[];
  timezone: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12' | '24';
  firstDayOfWeek: 'sunday' | 'monday' | 'saturday';
  workingDays: string[];
  ramadanMode: boolean;
}

export interface ActiveSession {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  location: string;
  ipAddress: string;
  lastActive: Date;
  isCurrent: boolean;
}

export interface LoginHistory {
  id: string;
  timestamp: Date;
  deviceName: string;
  location: string;
  ipAddress: string;
  success: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const MOCK_GENERAL_SETTINGS: GeneralSettings = {
  defaultHome: 'dashboard',
  autoLogoutTimer: 30,
  stayLoggedIn: false,
  compactMode: false,
  quickActions: true,
};

export const MOCK_APPEARANCE_SETTINGS: AppearanceSettings = {
  theme: 'system',
  accentColor: 'teal',
  fontSize: 'medium',
  sidebarStyle: 'expanded',
  cardShadows: true,
  animations: true,
  chartStyle: 'filled',
};

export const MOCK_NOTIFICATION_SETTINGS: NotificationSettings = {
  allNotifications: true,
  pushNotifications: true,
  smsNotifications: true,
  whatsappEnabled: false,
  emailDigest: 'weekly',
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  notificationSound: true,
  vibration: true,
  medicationReminderTiming: 15,
  appointmentReminders: ['24h', '1h'],
  labResultAlerts: true,
  messageNotifications: true,
  refillReminderDays: [7],
};

export const MOCK_DASHBOARD_SETTINGS: DashboardSettings = {
  todaysMedications: true,
  upcomingAppointment: true,
  healthStats: true,
  messagesPreview: true,
  hbA1cChart: true,
  insuranceSnapshot: true,
  bloodPressureChart: true,
  careTeam: true,
  aiHealthTip: true,
  remindersStrip: true,
  healthScore: true,
  healthScoreDetail: 'hover',
  quickVitals: true,
  defaultVital: 'blood-pressure',
};

export const MOCK_HEALTH_DATA_SETTINGS: HealthDataSettings = {
  glucoseUnit: 'mg/dL',
  weightUnit: 'kg',
  heightUnit: 'cm',
  temperatureUnit: 'C',
  bpTargetSystolic: 130,
  bpTargetDiastolic: 80,
  hbA1cTarget: 6.5,
  homeVitalsReminders: true,
  vitalsReminderFrequency: 'daily-8am',
  vitalsHistoryDisplay: '30-days',
  labHistoryDisplay: 'all',
  autoShareVitals: false,
};

export const MOCK_AI_SETTINGS: AISettings = {
  aiEnabled: true,
  aiLanguages: ['english', 'persian'],
  responseDetail: 'detailed',
  responseStyle: 'friendly',
  dataAccess: ['medications', 'labs', 'imaging', 'appointments', 'conditions', 'allergies'],
  showDisclaimers: true,
  proactiveTips: true,
  tipFrequency: 'daily',
  voiceInput: true,
  conversationHistory: '30-days',
};

export const MOCK_PRIVACY_SETTINGS: PrivacySettings = {
  nabidheConsent: true,
  researchParticipation: false,
  insuranceDataSharing: true,
  doctorSharing: true,
  pharmacyAccess: true,
  analytics: true,
  crashReports: true,
};

export const MOCK_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: 'session-001',
    deviceName: 'MacBook Pro — Chrome',
    deviceType: 'desktop',
    location: 'Dubai, UAE',
    ipAddress: '178.XX.XX.XX',
    lastActive: new Date(),
    isCurrent: true,
  },
  {
    id: 'session-002',
    deviceName: 'iPhone 14 — CeenAiX iOS App v2.4.1',
    deviceType: 'mobile',
    location: 'Dubai, UAE',
    ipAddress: '178.XX.YY.YY',
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isCurrent: false,
  },
];

export const MOCK_LOGIN_HISTORY: LoginHistory[] = [
  {
    id: 'login-001',
    timestamp: new Date(),
    deviceName: 'Chrome/Mac',
    location: 'Dubai',
    ipAddress: '178.XX.XX.XX',
    success: true,
  },
  {
    id: 'login-002',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    deviceName: 'iPhone 14 app',
    location: 'Dubai',
    ipAddress: '178.XX.YY.YY',
    success: true,
  },
  {
    id: 'login-003',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    deviceName: 'Chrome/Mac',
    location: 'Dubai',
    ipAddress: '178.XX.XX.XX',
    success: true,
  },
  {
    id: 'login-004',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    deviceName: 'iPhone 14',
    location: 'Dubai',
    ipAddress: '178.XX.YY.YY',
    success: true,
  },
  {
    id: 'login-005',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    deviceName: 'Chrome/Mac',
    location: 'Dubai',
    ipAddress: '178.XX.XX.XX',
    success: true,
  },
];

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  emiratesId: string;
  profilePhoto?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'child' | 'parent' | 'spouse';
  emiratesId: string;
  dateOfBirth: string;
  linkedDate: Date;
}

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'user-001',
  displayName: 'Parnia Yazdkhasti',
  email: 'parnia.yazdkhasti@email.com',
  phone: '+971 50 XXX XXXX',
  dateOfBirth: '1988-01-01',
  emiratesId: '784-1988-1234567-1',
  emergencyContact: {
    name: 'Emergency Contact',
    relationship: 'Family',
    phone: '+971 50 XXX XXXX',
  },
};

export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [];

export const MOCK_FAQS: FAQ[] = [
  {
    id: 'faq-001',
    question: 'How do I book an appointment?',
    answer: 'Navigate to the Appointments page and click "Book Appointment". Select your preferred doctor, date, and time slot. You\'ll receive confirmation via your preferred notification channel.',
    category: 'Appointments',
  },
  {
    id: 'faq-002',
    question: 'How do I share lab results with my doctor?',
    answer: 'Go to Lab Results, select the result you want to share, and click the share icon. Choose your doctor from the list and add an optional message.',
    category: 'Lab Results',
  },
  {
    id: 'faq-003',
    question: 'What does my HbA1c result mean?',
    answer: 'HbA1c measures your average blood sugar levels over the past 2-3 months. Normal is below 5.7%, pre-diabetes is 5.7-6.4%, and diabetes is 6.5% or above. Your AI assistant can explain your specific results in detail.',
    category: 'Lab Results',
  },
  {
    id: 'faq-004',
    question: 'How do I set up medication reminders?',
    answer: 'Go to Settings > Notifications > Medication Reminders. Choose when to be reminded before each dose, enable snooze options, and customize reminder settings.',
    category: 'Medications',
  },
  {
    id: 'faq-005',
    question: 'How do I check my insurance coverage?',
    answer: 'Visit the Insurance page to see your current coverage, claims status, and check if specific procedures are covered by your plan.',
    category: 'Insurance',
  },
  {
    id: 'faq-006',
    question: 'How do I add an allergy?',
    answer: 'Go to My Health > Allergies tab and click "Add Allergy". Enter the allergen name, reaction type, and severity. This information is shared with all your healthcare providers.',
    category: 'Health Records',
  },
  {
    id: 'faq-007',
    question: 'How do I change my notification settings?',
    answer: 'Navigate to Settings > Notifications to customize which notifications you receive, through which channels (Push, SMS, Email, WhatsApp), and when.',
    category: 'Settings',
  },
  {
    id: 'faq-008',
    question: 'Is my health data secure?',
    answer: 'Yes. CeenAiX uses AES-256 encryption, TLS 1.3 for data transmission, and complies with DHA regulations. All data is stored in UAE data centers and follows strict access controls.',
    category: 'Security',
  },
  {
    id: 'faq-009',
    question: 'What is Nabidh and should I enable it?',
    answer: 'Nabidh is the UAE\'s national health information exchange. Enabling it allows any healthcare provider in the UAE to access your medical history in emergencies, improving care coordination and safety.',
    category: 'Privacy',
  },
  {
    id: 'faq-010',
    question: 'How do I connect Apple Health?',
    answer: 'Go to Settings > Connections & Integrations, find Apple Health, and click "Connect". Authorize CeenAiX to sync data like steps, heart rate, and weight.',
    category: 'Integrations',
  },
  {
    id: 'faq-011',
    question: 'How do I request a prescription refill?',
    answer: 'Go to Medications, find the medication that needs refilling, and click "Request Refill". Your doctor will be notified and can approve the refill directly in CeenAiX.',
    category: 'Medications',
  },
  {
    id: 'faq-012',
    question: 'How do I contact my doctor through CeenAiX?',
    answer: 'Use the Messages page to send secure messages to your healthcare providers. You can attach documents, lab results, or images to your messages.',
    category: 'Messages',
  },
];
