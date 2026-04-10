export type UserRole = 'patient' | 'doctor' | 'pharmacist' | 'lab-staff' | 'admin' | 'system';

export type ConversationType = 'patient-doctor' | 'doctor-doctor' | 'doctor-pharmacy' | 'doctor-lab' | 'system';

export type MessageType = 'text' | 'file' | 'image' | 'voice' | 'medical-context';

export type AttachmentType = 'pdf' | 'image' | 'voice' | 'document';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  organization: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface MedicalContext {
  type: 'lab-result' | 'appointment' | 'prescription' | 'vital-sign';
  patientId: string;
  patientName: string;
  title: string;
  summary: string;
  date: Date;
  detailUrl?: string;
}

export interface MessageAttachment {
  id: string;
  type: AttachmentType;
  filename: string;
  fileSize: number;
  url: string;
  thumbnail?: string;
  duration?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  type: MessageType;
  content: string;
  timestamp: Date;
  isRead: boolean;
  readAt?: Date;
  attachment?: MessageAttachment;
  medicalContext?: MedicalContext;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
}

export interface Conversation {
  id: string;
  type: ConversationType;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  sharedPatient?: {
    id: string;
    name: string;
    emiratesId: string;
    age: number;
  };
  isEncrypted: true;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientContext {
  patientId: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  riskLevel: 'low' | 'medium' | 'high';
  allergies: Array<{
    name: string;
    severity: 'mild' | 'moderate' | 'severe';
  }>;
  conditions: Array<{
    name: string;
    icd10: string;
    status: 'controlled' | 'uncontrolled' | 'monitoring';
    managedBy?: string;
  }>;
  medications: Array<{
    name: string;
    dose: string;
    prescribedBy?: string;
  }>;
  vitals: {
    bp: string;
    hr: number;
    weight: number;
    recordedAt: string;
  };
  labs: Array<{
    name: string;
    value: string;
    status: 'normal' | 'abnormal' | 'critical';
  }>;
  appointments: {
    last?: {
      date: string;
      status: string;
    };
    next?: {
      date: string;
      time: string;
    };
  };
}

export const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    name: 'Dr. Sarah Johnson',
    role: 'doctor',
    organization: 'Mediclinic Dubai Mall',
    isOnline: true,
  },
  {
    id: 'user-002',
    name: 'Ahmed Al Maktoum',
    role: 'patient',
    organization: 'Self',
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'user-003',
    name: 'Dr. Mohamed Khalil',
    role: 'doctor',
    organization: 'American Hospital Dubai',
    isOnline: true,
  },
  {
    id: 'user-004',
    name: 'Pharmacy Team',
    role: 'pharmacist',
    organization: 'Aster Pharmacy - Dubai Mall',
    isOnline: true,
  },
  {
    id: 'user-005',
    name: 'Laboratory Services',
    role: 'lab-staff',
    organization: 'LabCorp Dubai',
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'user-006',
    name: 'Fatima Hassan',
    role: 'patient',
    organization: 'Self',
    isOnline: true,
  },
  {
    id: 'user-007',
    name: 'Dr. Raj Kumar',
    role: 'doctor',
    organization: 'Mediclinic Dubai Mall',
    isOnline: false,
    lastSeen: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 'user-current',
    name: 'Dr. John Williams',
    role: 'doctor',
    organization: 'Mediclinic Dubai Mall',
    isOnline: true,
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    type: 'patient-doctor',
    participants: [MOCK_USERS[1], MOCK_USERS[7]],
    lastMessage: {
      id: 'msg-001',
      conversationId: 'conv-001',
      senderId: 'user-002',
      senderName: 'Ahmed Al Maktoum',
      senderRole: 'patient',
      type: 'text',
      content: 'Thank you doctor. When should I come for the follow-up?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
    },
    unreadCount: 2,
    sharedPatient: {
      id: 'patient-001',
      name: 'Ahmed Al Maktoum',
      emiratesId: '784-1985-1234567-1',
      age: 38,
    },
    isEncrypted: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: 'conv-002',
    type: 'doctor-pharmacy',
    participants: [MOCK_USERS[3], MOCK_USERS[7]],
    lastMessage: {
      id: 'msg-002',
      conversationId: 'conv-002',
      senderId: 'user-current',
      senderName: 'Dr. John Williams',
      senderRole: 'doctor',
      type: 'text',
      content: 'Please verify the dosage for patient Fatima Hassan before dispensing.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 10 * 60 * 1000),
    },
    unreadCount: 0,
    sharedPatient: {
      id: 'patient-002',
      name: 'Fatima Hassan',
      emiratesId: '784-1990-7654321-2',
      age: 33,
    },
    isEncrypted: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: 'conv-003',
    type: 'doctor-doctor',
    participants: [MOCK_USERS[2], MOCK_USERS[7]],
    lastMessage: {
      id: 'msg-003',
      conversationId: 'conv-003',
      senderId: 'user-003',
      senderName: 'Dr. Mohamed Khalil',
      senderRole: 'doctor',
      type: 'text',
      content: 'I agree with your assessment. The cardiac markers are trending down.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    unreadCount: 0,
    isEncrypted: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    id: 'conv-004',
    type: 'patient-doctor',
    participants: [MOCK_USERS[5], MOCK_USERS[7]],
    lastMessage: {
      id: 'msg-004',
      conversationId: 'conv-004',
      senderId: 'user-006',
      senderName: 'Fatima Hassan',
      senderRole: 'patient',
      type: 'text',
      content: 'Good morning doctor, I have a question about my medication.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
    },
    unreadCount: 1,
    sharedPatient: {
      id: 'patient-002',
      name: 'Fatima Hassan',
      emiratesId: '784-1990-7654321-2',
      age: 33,
    },
    isEncrypted: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'conv-005',
    type: 'doctor-lab',
    participants: [MOCK_USERS[4], MOCK_USERS[7]],
    lastMessage: {
      id: 'msg-005',
      conversationId: 'conv-005',
      senderId: 'user-current',
      senderName: 'Dr. John Williams',
      senderRole: 'doctor',
      type: 'text',
      content: 'Can you expedite the HbA1c test for this patient?',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    unreadCount: 0,
    isEncrypted: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'conv-001': [
    {
      id: 'msg-101',
      conversationId: 'conv-001',
      senderId: 'user-current',
      senderName: 'Dr. John Williams',
      senderRole: 'doctor',
      type: 'text',
      content: 'Good morning Ahmed. I reviewed your latest lab results.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    },
    {
      id: 'msg-102',
      conversationId: 'conv-001',
      senderId: 'user-current',
      senderName: 'Dr. John Williams',
      senderRole: 'doctor',
      type: 'medical-context',
      content: 'Here are your test results from yesterday',
      timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      medicalContext: {
        type: 'lab-result',
        patientId: 'patient-001',
        patientName: 'Ahmed Al Maktoum',
        title: 'Complete Blood Count (CBC)',
        summary: 'All values within normal range. Hemoglobin: 14.2 g/dL',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        detailUrl: '/lab-results/12345',
      },
    },
    {
      id: 'msg-103',
      conversationId: 'conv-001',
      senderId: 'user-002',
      senderName: 'Ahmed Al Maktoum',
      senderRole: 'patient',
      type: 'text',
      content: 'That\'s great news! Does this mean my anemia is improving?',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000),
    },
    {
      id: 'msg-104',
      conversationId: 'conv-001',
      senderId: 'user-current',
      senderName: 'Dr. John Williams',
      senderRole: 'doctor',
      type: 'text',
      content: 'Yes, absolutely! Your hemoglobin levels have normalized. Continue taking your iron supplements for another month.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 45 * 60 * 1000),
    },
    {
      id: 'msg-105',
      conversationId: 'conv-001',
      senderId: 'user-002',
      senderName: 'Ahmed Al Maktoum',
      senderRole: 'patient',
      type: 'text',
      content: 'Thank you doctor. When should I come for the follow-up?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
    },
  ],
  'conv-002': [
    {
      id: 'msg-201',
      conversationId: 'conv-002',
      senderId: 'user-current',
      senderName: 'Dr. John Williams',
      senderRole: 'doctor',
      type: 'text',
      content: 'Hello, I just sent a prescription for Fatima Hassan.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 25 * 60 * 1000),
    },
    {
      id: 'msg-202',
      conversationId: 'conv-002',
      senderId: 'user-004',
      senderName: 'Pharmacy Team',
      senderRole: 'pharmacist',
      type: 'text',
      content: 'Received. I notice the Metformin dosage is 1000mg twice daily. Is this correct?',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 18 * 60 * 1000),
    },
    {
      id: 'msg-203',
      conversationId: 'conv-002',
      senderId: 'user-current',
      senderName: 'Dr. John Williams',
      senderRole: 'doctor',
      type: 'text',
      content: 'Please verify the dosage for patient Fatima Hassan before dispensing.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: true,
      readAt: new Date(Date.now() - 10 * 60 * 1000),
    },
  ],
};

export const MOCK_SHARED_FILES = [
  {
    id: 'file-001',
    conversationId: 'conv-001',
    type: 'pdf' as AttachmentType,
    filename: 'Lab_Results_CBC_20260407.pdf',
    fileSize: 245000,
    url: '#',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'file-002',
    conversationId: 'conv-001',
    type: 'image' as AttachmentType,
    filename: 'Prescription_Image.jpg',
    fileSize: 1200000,
    url: '#',
    thumbnail: '#',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'file-003',
    conversationId: 'conv-002',
    type: 'pdf' as AttachmentType,
    filename: 'Prescription_RX4521.pdf',
    fileSize: 180000,
    url: '#',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
];
