export type ResidencyStatus = 'UAE National' | 'UAE Resident' | 'Medical Tourist';
export type Gender = 'Male' | 'Female';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-' | 'Unknown';
export type PreferredLanguage = 'Arabic' | 'English' | 'Urdu' | 'Hindi' | 'Tagalog' | 'Other';
export type CommunicationMethod = 'SMS' | 'WhatsApp' | 'Email' | 'App notification';
export type HealthGoal = 'Preventive Care' | 'Chronic Disease Management' | 'Weight Management' | 'Mental Wellness' | 'Family Health';
export type PreExistingCondition = 'Diabetes' | 'Hypertension' | 'Asthma' | 'Heart Disease' | 'Cancer History' | 'None';

export interface PatientRegistrationData {
  emiratesId: string;
  fullNameEnglish: string;
  fullNameArabic: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
  phone: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  residencyStatus: ResidencyStatus;
  insuranceProvider: string;
  insuranceCardNumber: string;
  preExistingConditions: PreExistingCondition[];
  currentMedications: string;
  allergies: string[];
  bloodType: BloodType;
  preferredLanguage: PreferredLanguage;
  preferredCommunication: CommunicationMethod[];
  healthGoals: HealthGoal[];
  preferredGp: string;
  dhaConsent: boolean;
  nabidhEnrolled: boolean;
  aiAssistantConsent: boolean;
  termsAccepted: boolean;
}

export const INSURANCE_PROVIDERS = [
  'Daman',
  'AXA',
  'Allianz',
  'Thiqa',
  'Oman Insurance',
  'Dubai Insurance',
  'Cigna',
  'Bupa',
  'MetLife',
  'Noor Takaful',
  'Other',
];

export const NATIONALITIES = [
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
];
