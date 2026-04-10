export interface TeleConsultation {
  id: string;
  consultationId: string;
  patientName: string;
  patientPhoto: string;
  patientDob: string;
  chiefComplaint: string;
  startTime: Date;
  status: 'waiting' | 'active' | 'ended';
  connectionQuality: 'excellent' | 'good' | 'poor';
  isRecording: boolean;
  recordingStartTime?: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'doctor' | 'patient';
  message: string;
  timestamp: Date;
  isArabic?: boolean;
}

export interface SharedFile {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedBy: 'doctor' | 'patient';
  uploadedAt: Date;
  thumbnail?: string;
}

export interface QuickVitals {
  bp?: { systolic: number; diastolic: number };
  hr?: number;
  temp?: number;
  spo2?: number;
  weight?: number;
  glucose?: number;
  timestamp: Date;
}

export interface AIConsultationSummary {
  chiefComplaint: string;
  keySymptoms: string[];
  patientConcerns: string[];
  discussedTopics: string[];
  recommendedActions: string[];
  prescriptionsMentioned: string[];
  followUpNeeded: boolean;
  followUpReason?: string;
}

export const MOCK_TELECONSULTATION: TeleConsultation = {
  id: 'tele-001',
  consultationId: 'cons-001',
  patientName: 'Ahmed Al Zaabi',
  patientPhoto: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
  patientDob: '1985-07-22',
  chiefComplaint: 'Persistent headache for 3 days, mild fever',
  startTime: new Date(),
  status: 'active',
  connectionQuality: 'excellent',
  isRecording: true,
  recordingStartTime: new Date(),
};

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    senderId: 'patient-001',
    senderName: 'Ahmed Al Zaabi',
    senderType: 'patient',
    message: 'Good morning doctor, thank you for seeing me',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '2',
    senderId: 'doctor-001',
    senderName: 'Dr. Al-Rashid',
    senderType: 'doctor',
    message: 'Good morning Ahmed, happy to help. Can you describe your headache?',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
  },
  {
    id: '3',
    senderId: 'patient-001',
    senderName: 'Ahmed Al Zaabi',
    senderType: 'patient',
    message: 'It started 3 days ago, mostly on the right side. Pain level is about 6/10',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
  },
  {
    id: '4',
    senderId: 'patient-001',
    senderName: 'Ahmed Al Zaabi',
    senderType: 'patient',
    message: 'صباح الخير دكتور، شكراً على وقتك',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    isArabic: true,
  },
];

export const MOCK_SHARED_FILES: SharedFile[] = [
  {
    id: '1',
    fileName: 'temperature_readings.jpg',
    fileType: 'image/jpeg',
    fileUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=300',
    uploadedBy: 'patient',
    uploadedAt: new Date(Date.now() - 2 * 60 * 1000),
    thumbnail: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

export const MOCK_AI_SUMMARY: AIConsultationSummary = {
  chiefComplaint: 'Persistent headache for 3 days with mild fever',
  keySymptoms: [
    'Right-sided headache, 6/10 severity',
    'Low-grade fever (37.8°C)',
    'Mild photophobia',
    'No nausea or vomiting',
  ],
  patientConcerns: [
    'Worried about potential serious condition',
    'Difficulty sleeping due to pain',
    'Impact on work performance',
  ],
  discussedTopics: [
    'Headache characteristics and triggers',
    'Fever pattern and duration',
    'Previous similar episodes',
    'Current medications and allergies',
    'Stress levels and sleep quality',
  ],
  recommendedActions: [
    'Prescribed ibuprofen 400mg TID for 5 days',
    'Advised adequate hydration',
    'Rest and avoid screen time',
    'Monitor temperature',
  ],
  prescriptionsMentioned: ['Ibuprofen 400mg', 'Paracetamol as backup'],
  followUpNeeded: true,
  followUpReason: 'Review in 3 days if symptoms persist or worsen',
};
