export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  confidence?: 'High' | 'Medium' | 'Low';
  quickReplies?: string[];
}

export interface ContextItem {
  type: 'condition' | 'medication' | 'lab' | 'appointment';
  label: string;
  data: string;
  color: string;
}

export interface HealthInsight {
  id: string;
  title: string;
  summary: string;
  priority: 'high' | 'medium' | 'low';
  expanded?: boolean;
  fullDetails?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface MedicalIDCard {
  bloodType: string;
  allergies: string[];
  conditions: string[];
  emergencyContact: EmergencyContact;
}

export const CONVERSATION_STARTERS = [
  "What do my latest lab results mean?",
  "Am I due for any vaccines?",
  "Check if my medications interact",
  "Explain my diagnosis in simple terms",
  "What preventive screenings should I have?",
];

export const QUICK_TOPICS = [
  "Symptoms",
  "Medications",
  "My Results",
  "Preventive Care",
  "Emergency",
];

export const MOCK_ACTIVE_CONTEXT: ContextItem[] = [
  {
    type: 'condition',
    label: 'Type 2 Diabetes',
    data: 'Active since 2022',
    color: 'bg-red-100 text-red-700 border-red-300',
  },
  {
    type: 'condition',
    label: 'Hypertension',
    data: 'Controlled',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
  },
  {
    type: 'medication',
    label: 'Metformin 500mg',
    data: 'Twice daily',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  {
    type: 'lab',
    label: 'HbA1c: 7.8%',
    data: '15 Mar 2026',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
  },
  {
    type: 'appointment',
    label: 'Dr. Khalid',
    data: '14 Apr 2026',
    color: 'bg-teal-100 text-teal-700 border-teal-300',
  },
];

export const MOCK_HEALTH_INSIGHTS: HealthInsight[] = [
  {
    id: '1',
    title: 'Blood Pressure Trending Up',
    summary: 'Your last 3 readings show an upward trend. Consider reviewing with your doctor.',
    priority: 'high',
    fullDetails: 'Your systolic blood pressure has increased from 128 to 138 mmHg over the past two weeks. This is approaching the threshold that may require medication adjustment. Your next cardiology appointment is scheduled for April 10th - this would be a good time to discuss these readings.',
  },
  {
    id: '2',
    title: 'Flu Vaccine Recommended',
    summary: 'Based on your conditions, annual flu vaccination is recommended. Book now.',
    priority: 'medium',
    fullDetails: 'Given your Type 2 Diabetes and age, the UAE Ministry of Health recommends annual influenza vaccination. The 2026 flu season is approaching. Vaccination is available at any DHA-approved clinic and is typically covered by your insurance.',
  },
  {
    id: '3',
    title: 'Medication Refill Due Soon',
    summary: 'Your Metformin prescription expires in 5 days. Request refill now.',
    priority: 'medium',
    fullDetails: 'Your current Metformin 500mg prescription will run out on April 12, 2026. You can request a refill through the app or contact your pharmacy directly. Dr. Al Zarooni has authorized automatic refills for this medication.',
  },
];

export const MOCK_CONVERSATION: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'My HbA1c came back at 7.8. Is that bad?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '2',
    role: 'assistant',
    content: `Your HbA1c of 7.8% is slightly above the target of <7% recommended for most people with Type 2 Diabetes. This means your average blood sugar over the past 3 months has been around 177 mg/dL.

The good news is your result has improved from 8.2% six months ago. Your endocrinologist Dr. Khalid at Mediclinic has an appointment scheduled for Apr 14 — I'd recommend discussing a medication adjustment at that visit.

Would you like me to prepare a summary of your glucose trends to bring to the appointment?`,
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    sources: ['Based on your lab result 15 Mar 2026', 'Upcoming appointment with Dr. Khalid'],
    confidence: 'High',
    quickReplies: [
      'Yes, prepare summary',
      'What can I do to lower it?',
      'Book earlier appointment',
    ],
  },
];

export const MOCK_MEDICAL_ID: MedicalIDCard = {
  bloodType: 'O+',
  allergies: ['Penicillin', 'Sulfa drugs'],
  conditions: ['Type 2 Diabetes', 'Hypertension'],
  emergencyContact: {
    name: 'Sarah Ahmed',
    relationship: 'Spouse',
    phone: '+971 50 123 4567',
  },
};
