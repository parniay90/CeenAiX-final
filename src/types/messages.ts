export type ConversationType = 'patient' | 'doctor' | 'pharmacy' | 'lab' | 'system';

export type MessageType = 'text' | 'clinical_attachment' | 'prescription' | 'lab_result' | 'appointment' | 'document' | 'referral' | 'critical_alert';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: 'doctor' | 'patient' | 'system' | 'other';
  content: string;
  type: MessageType;
  timestamp: string;
  read: boolean;
  attachment?: {
    type: 'lab_result' | 'prescription' | 'referral' | 'echo' | 'document';
    title: string;
    subtitle?: string;
    data?: any;
    action?: string;
  };
  criticalAlert?: {
    patientId: string;
    patientName: string;
    testName: string;
    result: string;
    reference: string;
    severity: string;
    acknowledged: boolean;
    acknowledgedAt?: string;
  };
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string;
  avatar: string;
  avatarType: 'initials' | 'icon';
  subtitle?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
  isCritical?: boolean;
  patientId?: string;
  messages: Message[];
  metadata?: {
    insurance?: string;
    riskLevel?: string;
    allergies?: string[];
    location?: string;
    specialty?: string;
    organization?: string;
  };
}

export interface PatientContext {
  patientId: string;
  name: string;
  age: string;
  gender: string;
  bloodType: string;
  insurance: string;
  riskLevel: string;
  isOnline: boolean;
  allergies: Array<{
    name: string;
    severity: 'severe' | 'moderate' | 'mild';
  }>;
  conditions: Array<{
    name: string;
    code: string;
    status: string;
  }>;
  medications: Array<{
    name: string;
    dose: string;
    prescribedBy?: string;
  }>;
  vitals?: {
    bp: string;
    hr: string;
    weight: string;
    recordedAt: string;
  };
  recentLabs?: Array<{
    name: string;
    value: string;
    status: 'normal' | 'abnormal' | 'critical';
  }>;
  appointments: {
    last?: string;
    next?: string;
  };
}
