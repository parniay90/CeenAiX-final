import React, { useState } from 'react';
import DoctorSidebarNew from '../components/doctor/DoctorSidebarNew';
import {
  MessageSquare,
  Search,
  Plus,
  Video,
  Phone,
  User,
  MoreVertical,
  Lock,
  CheckCheck,
  Send,
  Paperclip,
  TestTube,
  Pill,
  Calendar,
  FileText,
  Mic,
  AlertOctagon,
  CheckCircle2,
  Bell,
  Settings,
  ChevronRight,
  FileHeart
} from 'lucide-react';
import type { Conversation, Message as MessageType, PatientContext, ConversationType } from '../types/messages';

export default function SecureMessaging() {
  const [selectedConversation, setSelectedConversation] = useState<string>('conv-1');
  const [messageInput, setMessageInput] = useState('');
  const [showContextPanel, setShowContextPanel] = useState(true);
  const [filterType, setFilterType] = useState<ConversationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mockConversations: Conversation[] = [
    {
      id: 'conv-1',
      type: 'patient',
      name: 'Parnia Yazdkhasti',
      avatar: 'PY',
      avatarType: 'initials',
      subtitle: 'Patient · PT-001',
      lastMessage: 'Morning reading: 128/82. All good! ☕',
      lastMessageTime: 'Today 8:47 AM',
      unreadCount: 1,
      isOnline: true,
      patientId: 'PT-001',
      metadata: {
        insurance: 'Daman Gold',
        riskLevel: 'MEDIUM'
      },
      messages: [
        {
          id: 'msg-1',
          conversationId: 'conv-1',
          senderId: 'PT-001',
          senderName: 'Parnia Yazdkhasti',
          senderType: 'patient',
          content: 'Dr. Ahmed, quick question — is drinking 2–3 cups of coffee per day okay for my blood pressure? I saw something online about caffeine and hypertension.',
          type: 'text',
          timestamp: '2026-03-13T14:15:00',
          read: true
        },
        {
          id: 'msg-2',
          conversationId: 'conv-1',
          senderId: 'DR-001',
          senderName: 'Dr. Ahmed Al Rashidi',
          senderType: 'doctor',
          content: 'Hi Parnia. Good question. Moderate coffee (2–3 cups/day) is generally fine for people with well-controlled hypertension. Your BP has been excellent. Just avoid drinking it immediately before taking your morning reading — can give a false high. ☕',
          type: 'text',
          timestamp: '2026-03-13T14:34:00',
          read: true
        },
        {
          id: 'msg-3',
          conversationId: 'conv-1',
          senderId: 'PT-001',
          senderName: 'Parnia Yazdkhasti',
          senderType: 'patient',
          content: 'Ah perfect, that explains why my readings are always a bit higher first thing! I\'ll wait 30 min after my coffee. Thank you!',
          type: 'text',
          timestamp: '2026-03-13T14:36:00',
          read: true
        },
        {
          id: 'msg-4',
          conversationId: 'conv-1',
          senderId: 'DR-001',
          senderName: 'Dr. Ahmed Al Rashidi',
          senderType: 'doctor',
          content: 'Your March labs are in. LDL is excellent (118 mg/dL) — Atorvastatin is working well. Your HbA1c is still slightly above normal but has improved significantly. See you April 7th!',
          type: 'clinical_attachment',
          timestamp: '2026-03-14T09:00:00',
          read: true,
          attachment: {
            type: 'lab_result',
            title: 'Lab Results',
            subtitle: 'March 5, 2026',
            data: {
              tests: [
                { name: 'HbA1c', value: '6.8%', status: 'abnormal', note: 'Pre-diabetic range, improving ↓ from 7.4%' },
                { name: 'LDL', value: '118 mg/dL', status: 'normal', note: 'Excellent ↓ (was 142 in 2021)' }
              ]
            }
          }
        },
        {
          id: 'msg-5',
          conversationId: 'conv-1',
          senderId: 'PT-001',
          senderName: 'Parnia Yazdkhasti',
          senderType: 'patient',
          content: 'Morning reading: 128/82. All good! ☕',
          type: 'text',
          timestamp: '2026-04-07T08:47:00',
          read: false
        }
      ]
    },
    {
      id: 'conv-2',
      type: 'lab',
      name: 'Dubai Medical Laboratory',
      avatar: 'lab',
      avatarType: 'icon',
      subtitle: 'Laboratory',
      lastMessage: '⚡ CRITICAL: Abdullah Hassan — Troponin I 2.8...',
      lastMessageTime: 'Today 11:47 AM',
      unreadCount: 1,
      isCritical: true,
      metadata: {
        location: 'Healthcare City, Dubai'
      },
      messages: [
        {
          id: 'msg-lab-1',
          conversationId: 'conv-2',
          senderId: 'LAB-001',
          senderName: 'Dubai Medical Laboratory',
          senderType: 'system',
          content: 'Lab order received: PT-004 Mohammed Al Shamsi. 4 tests (Troponin, BNP, Lipids, CBC). Urgent. Expected results ~5:00 PM today. Order ref: LAB-20260407-003241',
          type: 'text',
          timestamp: '2026-04-07T10:37:00',
          read: true
        },
        {
          id: 'msg-lab-2',
          conversationId: 'conv-2',
          senderId: 'LAB-001',
          senderName: 'Dubai Medical Laboratory',
          senderType: 'system',
          content: 'CRITICAL LAB RESULT',
          type: 'critical_alert',
          timestamp: '2026-04-07T11:47:00',
          read: false,
          criticalAlert: {
            patientId: 'PT-005',
            patientName: 'Abdullah Hassan Al Zaabi',
            testName: 'Troponin I (high-sensitivity)',
            result: '2.8 ng/mL',
            reference: '< 0.04 ng/mL',
            severity: 'CRITICAL HIGH ↑↑ — 70× upper limit',
            acknowledged: false
          }
        }
      ]
    },
    {
      id: 'conv-3',
      type: 'doctor',
      name: 'Dr. Sarah Al Khateeb',
      avatar: 'SK',
      avatarType: 'initials',
      subtitle: 'Cardiologist',
      lastMessage: '📎 Ahmed, I\'ve referred a patient...',
      lastMessageTime: 'Today 10:30 AM',
      unreadCount: 1,
      isOnline: false,
      metadata: {
        specialty: 'Cardiologist',
        organization: 'Al Zahra Hospital'
      },
      messages: [
        {
          id: 'msg-dr-1',
          conversationId: 'conv-3',
          senderId: 'DR-002',
          senderName: 'Dr. Sarah Al Khateeb',
          senderType: 'other',
          content: 'Ahmed, I\'ve referred a patient to you — Mahmoud Siddiq, 52M, presenting with exertional dyspnea and palpitations. Echo shows asymmetric LVH (IVS 16mm). Query HCM vs hypertensive LVH. DM + HTN background. Please see within 2 weeks if possible. I\'ve sent through his Echo report and recent labs through CeenAiX.',
          type: 'referral',
          timestamp: '2026-04-07T10:30:00',
          read: false,
          attachment: {
            type: 'referral',
            title: 'Patient Referral — Mahmoud Siddiq',
            subtitle: 'Dr. Sarah Al Khateeb → Dr. Ahmed Al Rashidi',
            data: {
              patient: 'Mahmoud Siddiq, 52M',
              query: 'HCM vs Hypertensive LVH',
              urgency: 'Within 2 weeks',
              findings: 'IVS: 16mm | LVEF: 60% | Asymmetric LVH'
            }
          }
        }
      ]
    },
    {
      id: 'conv-4',
      type: 'pharmacy',
      name: 'Al Shifa Pharmacy',
      avatar: 'pharmacy',
      avatarType: 'icon',
      subtitle: 'Pharmacy',
      lastMessage: 'Query on Parnia Yazdkhasti\'s Atorvastatin...',
      lastMessageTime: 'Today 1:15 PM',
      unreadCount: 1,
      metadata: {
        location: 'Al Barsha, Dubai'
      },
      messages: [
        {
          id: 'msg-ph-1',
          conversationId: 'conv-4',
          senderId: 'PH-001',
          senderName: 'Al Shifa Pharmacy',
          senderType: 'system',
          content: 'Dr. Ahmed, Atorvastatin 20mg brand (Lipitor, AED 48) is currently out of stock at our branch. Generic Atorvastatin 20mg (AED 12) is available and bioequivalent. As per DHA substitution policy, can we substitute? Please confirm.',
          type: 'prescription',
          timestamp: '2026-04-07T13:15:00',
          read: false,
          attachment: {
            type: 'prescription',
            title: 'Prescription Query',
            subtitle: 'Parnia Yazdkhasti — PT-001',
            data: {
              medication: 'Atorvastatin 20mg',
              brand: 'Lipitor',
              brandPrice: 'AED 48',
              generic: 'Generic Atorvastatin 20mg',
              genericPrice: 'AED 12',
              dhaRef: 'RX-20260407-002847'
            },
            action: 'query'
          }
        }
      ]
    }
  ];

  const patientContext: PatientContext = {
    patientId: 'PT-001',
    name: 'Parnia Yazdkhasti',
    age: '38F',
    gender: 'Female',
    bloodType: 'A+',
    insurance: 'Daman Gold',
    riskLevel: 'MEDIUM',
    isOnline: true,
    allergies: [
      { name: 'Penicillin', severity: 'severe' },
      { name: 'Sulfa drugs', severity: 'moderate' }
    ],
    conditions: [
      { name: 'Hypertension', code: 'I10', status: 'controlled ✅' },
      { name: 'CAC Score 42', code: '', status: 'mild ⚠️' }
    ],
    medications: [
      { name: 'Atorvastatin', dose: '20mg' },
      { name: 'Amlodipine', dose: '5mg' },
      { name: 'Metformin', dose: '850mg', prescribedBy: 'Dr. Fatima' }
    ],
    vitals: {
      bp: '128/82 ✅',
      hr: '72',
      weight: '68kg',
      recordedAt: 'Today 9:30 AM'
    },
    recentLabs: [
      { name: 'HbA1c', value: '6.8%', status: 'abnormal' },
      { name: 'LDL', value: '118', status: 'normal' },
      { name: 'Vit D', value: '22 ↓', status: 'abnormal' }
    ],
    appointments: {
      last: 'Today ✅ · Completed',
      next: 'Apr 15, 2026 · 10:30 AM'
    }
  };

  const activeConversation = mockConversations.find(c => c.id === selectedConversation);
  const filteredConversations = mockConversations.filter(conv => {
    if (filterType !== 'all' && conv.type !== filterType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return conv.name.toLowerCase().includes(query) || conv.lastMessage.toLowerCase().includes(query);
    }
    return true;
  });

  const unreadConversations = filteredConversations.filter(c => c.unreadCount > 0);
  const readConversations = filteredConversations.filter(c => c.unreadCount === 0);

  const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setMessageInput('');
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <DoctorSidebarNew />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                    Messages
                  </h1>
                </div>
              </div>
              {totalUnread > 0 && (
                <div className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">
                  {totalUnread} unread
                </div>
              )}

              {activeConversation && (
                <div className="flex items-center gap-3 ml-8 pl-8 border-l border-slate-200">
                  <Avatar conversation={activeConversation} size="sm" />
                  <div>
                    <div className="font-semibold text-sm text-slate-800">{activeConversation.name}</div>
                    <div className="text-xs text-slate-500">{activeConversation.subtitle}</div>
                  </div>
                  {activeConversation.isOnline && (
                    <div className="flex items-center gap-1 text-xs text-emerald-600">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      Online
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors">
                ✓ Mark All Read
              </button>
              <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors" title="AES-256 encrypted">
                <Lock className="w-4 h-4" />
              </button>
              <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button className="relative p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                  4
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <ConversationList
            conversations={filteredConversations}
            unreadConversations={unreadConversations}
            readConversations={readConversations}
            selectedId={selectedConversation}
            onSelect={setSelectedConversation}
            filterType={filterType}
            onFilterChange={setFilterType}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {activeConversation ? (
            <>
              <ChatWindow
                conversation={activeConversation}
                messageInput={messageInput}
                onMessageInputChange={setMessageInput}
                onSendMessage={handleSendMessage}
              />

              {showContextPanel && activeConversation.type === 'patient' && (
                <ContextPanel
                  context={patientContext}
                  onClose={() => setShowContextPanel(false)}
                />
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-400 mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  Select a conversation
                </h3>
                <p className="text-sm text-slate-400 mb-4">Choose from your conversations on the left</p>
                <button className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto">
                  <Plus className="w-4 h-4" />
                  New Message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConversationList({
  conversations,
  unreadConversations,
  readConversations,
  selectedId,
  onSelect,
  filterType,
  onFilterChange,
  searchQuery,
  onSearchChange
}: {
  conversations: Conversation[];
  unreadConversations: Conversation[];
  readConversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
  filterType: ConversationType | 'all';
  onFilterChange: (type: ConversationType | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  const filters = [
    { id: 'all' as const, label: 'All', count: conversations.length },
    { id: 'patient' as const, label: 'Patients', count: conversations.filter(c => c.type === 'patient').length },
    { id: 'doctor' as const, label: 'Doctors', count: conversations.filter(c => c.type === 'doctor').length },
    { id: 'pharmacy' as const, label: 'Pharmacy', count: conversations.filter(c => c.type === 'pharmacy').length },
    { id: 'lab' as const, label: 'Labs', count: conversations.filter(c => c.type === 'lab').length }
  ];

  return (
    <div className="w-[280px] bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-100">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto pb-2">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === filter.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        <button className="w-full mt-3 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          New Message
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {unreadConversations.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-blue-50">
              <div className="text-xs uppercase tracking-wide font-semibold text-blue-600">
                UNREAD · {unreadConversations.length}
              </div>
            </div>
            {unreadConversations.map(conv => (
              <ConversationRow
                key={conv.id}
                conversation={conv}
                isActive={conv.id === selectedId}
                onClick={() => onSelect(conv.id)}
              />
            ))}
          </div>
        )}

        {readConversations.length > 0 && (
          <div>
            <div className="px-4 py-2">
              <div className="text-xs uppercase tracking-wide font-semibold text-slate-400">
                RECENT
              </div>
            </div>
            {readConversations.map(conv => (
              <ConversationRow
                key={conv.id}
                conversation={conv}
                isActive={conv.id === selectedId}
                onClick={() => onSelect(conv.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationRow({
  conversation,
  isActive,
  onClick
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  const isUnread = conversation.unreadCount > 0;

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-slate-50 transition-colors ${
        isActive
          ? 'bg-teal-50 border-l-3 border-l-teal-500'
          : isUnread
          ? 'bg-blue-50/40 hover:bg-blue-50'
          : 'bg-white hover:bg-slate-50'
      }`}
    >
      <div className="relative flex-shrink-0">
        <Avatar conversation={conversation} size="md" />
        {isUnread && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
        )}
        {conversation.isCritical && (
          <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-0.5">
            <AlertOctagon className="w-3 h-3 text-white" />
          </div>
        )}
        {conversation.isOnline && conversation.type === 'patient' && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <div className={`font-semibold text-sm truncate ${isUnread ? 'text-slate-900' : 'text-slate-600'}`} style={{ fontFamily: 'Plus Jakarta Sans' }}>
            {conversation.name}
          </div>
          <div className="font-mono text-xs text-slate-400 ml-2 flex-shrink-0">
            {conversation.lastMessageTime.replace('Today ', '')}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs px-2 py-0.5 rounded ${getTypeStyle(conversation.type)}`}>
            {conversation.type.charAt(0).toUpperCase() + conversation.type.slice(1)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className={`text-xs truncate flex-1 ${isUnread ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
            {conversation.lastMessage}
          </p>
          {conversation.unreadCount > 0 && (
            <div className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold font-mono ${
              conversation.isCritical ? 'bg-red-600 text-white' : 'bg-teal-600 text-white'
            }`}>
              {conversation.unreadCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Avatar({ conversation, size = 'md' }: { conversation: Conversation; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const borderColors = {
    patient: 'border-teal-400',
    doctor: 'border-violet-400',
    pharmacy: 'border-amber-400',
    lab: 'border-blue-400',
    system: 'border-slate-300 border-dashed'
  };

  if (conversation.avatarType === 'icon') {
    const iconClass = `${sizeClasses[size]} rounded-full flex items-center justify-center border-2 ${borderColors[conversation.type]}`;

    if (conversation.type === 'lab') {
      return (
        <div className={`${iconClass} bg-blue-100`}>
          <TestTube className="w-5 h-5 text-blue-600" />
        </div>
      );
    }
    if (conversation.type === 'pharmacy') {
      return (
        <div className={`${iconClass} bg-amber-100`}>
          <Pill className="w-5 h-5 text-amber-600" />
        </div>
      );
    }
  }

  const gradients = {
    patient: 'from-teal-400 to-teal-600',
    doctor: 'from-violet-400 to-violet-600',
    pharmacy: 'from-amber-400 to-amber-600',
    lab: 'from-blue-400 to-blue-600',
    system: 'from-slate-400 to-slate-600'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradients[conversation.type]} flex items-center justify-center text-white font-bold border-2 ${borderColors[conversation.type]}`}>
      {conversation.avatar}
    </div>
  );
}

function getTypeStyle(type: ConversationType) {
  switch (type) {
    case 'patient': return 'bg-teal-50 text-teal-700';
    case 'doctor': return 'bg-violet-50 text-violet-700';
    case 'pharmacy': return 'bg-amber-50 text-amber-700';
    case 'lab': return 'bg-blue-50 text-blue-700';
    case 'system': return 'bg-slate-50 text-slate-500';
  }
}

function ChatWindow({
  conversation,
  messageInput,
  onMessageInputChange,
  onSendMessage
}: {
  conversation: Conversation;
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
}) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  const groupedMessages = groupMessagesByDate(conversation.messages);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Avatar conversation={conversation} size="md" />
            <div>
              <div className="font-semibold text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                {conversation.name}
              </div>
              <div className="text-xs text-slate-500">
                {conversation.subtitle}
                {conversation.metadata?.location && ` · ${conversation.metadata.location}`}
              </div>
            </div>
            {conversation.isOnline && (
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Online
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {conversation.type === 'patient' && (
              <>
                <button className="px-3 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Video
                </button>
                <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2">
                  <User className="w-4 h-4" />
                  View Record
                </button>
              </>
            )}
            <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {conversation.type === 'patient' && conversation.patientId && (
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-bold">
              ⚠️ Penicillin SEVERE
            </div>
            <div className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-xs font-bold">
              ⚠️ Sulfa drugs
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-teal-50 border-b border-teal-100 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-teal-600">
          <Lock className="w-3 h-3" />
          <span>
            End-to-end encrypted · DHA compliant · All messages linked to {conversation.patientId || 'record'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-4">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
            <DateSeparator date={date} />
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} conversation={conversation} />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
          <button className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1">
            <Paperclip className="w-3 h-3" />
            Clinical Context
          </button>
          <button className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1">
            <TestTube className="w-3 h-3" />
            Lab Result
          </button>
          <button className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1">
            <Pill className="w-3 h-3" />
            Prescription
          </button>
          <button className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Appointment
          </button>
          <button className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Document
          </button>
          <button className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1">
            <Mic className="w-3 h-3" />
            Voice
          </button>
        </div>

        <div className="flex gap-2">
          <textarea
            value={messageInput}
            onChange={(e) => onMessageInputChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder={`Message ${conversation.name}... (encrypted)`}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            rows={1}
          />
          <button
            onClick={onSendMessage}
            disabled={!messageInput.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              messageInput.trim()
                ? 'bg-teal-500 hover:bg-teal-600 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-2 text-center">
          <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Encrypted · Logged to {conversation.patientId || 'record'} · DHA compliant
          </div>
        </div>
      </div>
    </div>
  );
}

function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-slate-200" />
      <div className="text-xs text-slate-400 font-medium">{date}</div>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

function MessageBubble({ message, conversation }: { message: MessageType; conversation: Conversation }) {
  const isDoctor = message.senderType === 'doctor';

  if (message.type === 'critical_alert' && message.criticalAlert) {
    return (
      <div className="mb-4">
        <CriticalAlertCard alert={message.criticalAlert} timestamp={message.timestamp} />
      </div>
    );
  }

  return (
    <div className={`flex gap-3 mb-4 ${isDoctor ? 'justify-end' : 'justify-start'}`}>
      {!isDoctor && <Avatar conversation={conversation} size="sm" />}

      <div className={`max-w-[70%] ${isDoctor ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {message.attachment && (
          <AttachmentCard attachment={message.attachment} type={message.type} />
        )}

        {message.content && (
          <div className={`px-4 py-2.5 rounded-2xl ${
            isDoctor
              ? 'bg-teal-500 text-white rounded-br-none'
              : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
          }`}>
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
        )}

        <div className={`flex items-center gap-2 text-xs font-mono ${isDoctor ? 'text-teal-300' : 'text-slate-400'}`}>
          <span>{formatTime(message.timestamp)}</span>
          {isDoctor && message.read && (
            <CheckCheck className="w-3 h-3 text-teal-400" />
          )}
        </div>
      </div>
    </div>
  );
}

function AttachmentCard({ attachment, type }: { attachment: any; type: string }) {
  if (type === 'clinical_attachment' && attachment.type === 'lab_result') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-2">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TestTube className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wide text-blue-600 font-semibold mb-1">
              Lab Result · {attachment.subtitle}
            </div>
            {attachment.data.tests.map((test: any, idx: number) => (
              <div key={idx} className="mb-2">
                <div className="flex items-baseline gap-2">
                  <span className={`font-mono text-base font-bold ${
                    test.status === 'abnormal' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {test.name}: {test.value}
                  </span>
                  <span className="text-xs">{test.status === 'abnormal' ? '⚠️ H' : '✅'}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{test.note}</p>
              </div>
            ))}
            <button className="text-xs text-blue-600 font-medium hover:text-blue-700 mt-2">
              View Full Result →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'referral') {
    return (
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-2">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FileHeart className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wide text-indigo-600 font-semibold mb-1">
              Clinical Referral
            </div>
            <div className="font-semibold text-sm text-slate-900 mb-2">{attachment.title}</div>
            <div className="text-xs text-slate-600 mb-1">{attachment.subtitle}</div>
            <div className="text-xs text-slate-700 space-y-1">
              <div>Patient: {attachment.data.patient}</div>
              <div>Query: {attachment.data.query}</div>
              <div>Urgency: {attachment.data.urgency}</div>
              <div className="font-mono text-xs mt-2 text-blue-600">{attachment.data.findings}</div>
            </div>
            <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700 mt-3">
              📄 View Full Referral
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'prescription' && attachment.action === 'query') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-2">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <AlertOctagon className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wide text-amber-700 font-semibold mb-2">
              Prescription Query
            </div>
            <div className="text-sm font-semibold text-slate-900 mb-1">
              {attachment.subtitle}
            </div>
            <div className="text-xs text-slate-700 space-y-1 mb-3">
              <div>Rx: {attachment.data.medication} — {attachment.data.brand}</div>
              <div>Brand price: {attachment.data.brandPrice} (out of stock)</div>
              <div>Generic available: {attachment.data.generic} — {attachment.data.genericPrice}</div>
              <div className="font-mono text-xs text-slate-500 mt-1">DHA Ref: {attachment.data.dhaRef}</div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium transition-colors">
                ✅ Allow Generic
              </button>
              <button className="flex-1 px-3 py-2 bg-white hover:bg-slate-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium transition-colors">
                ❌ Brand Only
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function CriticalAlertCard({ alert, timestamp }: { alert: any; timestamp: string }) {
  const [acknowledged, setAcknowledged] = React.useState(alert.acknowledged);

  return (
    <div className={`${acknowledged ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-200'} border-2 rounded-xl p-5`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-full ${acknowledged ? 'bg-slate-200' : 'bg-red-100 animate-pulse'}`}>
          {acknowledged ? (
            <CheckCircle2 className="w-8 h-8 text-slate-600" />
          ) : (
            <AlertOctagon className="w-8 h-8 text-red-600" />
          )}
        </div>
        <div className="flex-1">
          <div className={`text-xs uppercase tracking-wider font-bold mb-2 ${acknowledged ? 'text-slate-600' : 'text-red-700'}`}>
            {acknowledged ? '✅ CRITICAL RESULT ACKNOWLEDGED' : 'CRITICAL LAB RESULT'}
          </div>
          <div className="bg-white rounded-lg p-3 mb-3">
            <div className="font-semibold text-sm text-slate-900 mb-1">
              {alert.patientName} — {alert.patientId}
            </div>
          </div>

          <div className="mb-3">
            <div className="font-semibold text-base text-slate-800 mb-1">{alert.testName}</div>
            <div className="font-mono text-4xl font-bold text-red-700 mb-1">{alert.result}</div>
            <div className="font-mono text-xs text-slate-600 mb-1">Reference: {alert.reference}</div>
            <div className="inline-block px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold">
              {alert.severity}
            </div>
          </div>

          <div className="font-mono text-xs text-slate-500 mb-3">
            Resulted: {formatTime(timestamp)}
            {!acknowledged && ' · DHA requires acknowledgment within 1 hour'}
          </div>

          {!acknowledged ? (
            <button
              onClick={() => setAcknowledged(true)}
              className="w-full px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              ACKNOWLEDGE THIS RESULT
            </button>
          ) : (
            <div className="text-sm text-slate-600">
              Acknowledged: {formatTime(new Date().toISOString())} · Logged to patient record ✅
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ContextPanel({ context, onClose }: { context: PatientContext; onClose: () => void }) {
  return (
    <div className="w-[280px] bg-white border-l border-slate-200 flex flex-col overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <h3 className="font-bold text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>Patient Context</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-100 rounded transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm border-2 border-teal-400">
              {context.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{context.name}</div>
              <div className="font-mono text-xs text-slate-500">
                {context.age} · {context.bloodType} · {context.patientId}
              </div>
            </div>
          </div>
          {context.isOnline && (
            <div className="flex items-center gap-1 text-xs text-emerald-600 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              Online now
            </div>
          )}
          <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
            🔵 {context.riskLevel}
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-3">
          <div className="text-xs uppercase tracking-wide font-semibold text-red-600 mb-2">
            ALLERGIES
          </div>
          {context.allergies.map((allergy, idx) => (
            <div key={idx} className={`text-sm font-bold mb-1 ${
              allergy.severity === 'severe' ? 'text-red-700' : 'text-amber-700'
            }`}>
              ⚠️ {allergy.name} — {allergy.severity.toUpperCase()}
            </div>
          ))}
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide font-semibold text-slate-400 mb-2">
            CONDITIONS
          </div>
          <div className="space-y-1">
            {context.conditions.map((condition, idx) => (
              <div key={idx} className="text-sm text-slate-700">
                • {condition.name} — {condition.code} ({condition.status})
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide font-semibold text-slate-400 mb-2">
            MEDICATIONS
          </div>
          <div className="space-y-1">
            {context.medications.map((med, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-mono text-slate-700">💊 {med.name} {med.dose}</span>
                {med.prescribedBy && (
                  <div className="text-xs text-slate-500 italic ml-4">({med.prescribedBy})</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {context.vitals && (
          <div>
            <div className="text-xs uppercase tracking-wide font-semibold text-slate-400 mb-2">
              LATEST VITALS
            </div>
            <div className="space-y-1">
              <div className="font-mono text-sm text-emerald-600">BP: {context.vitals.bp}</div>
              <div className="font-mono text-xs text-slate-500">
                HR: {context.vitals.hr} · Wt: {context.vitals.weight}
              </div>
              <div className="font-mono text-xs text-slate-300">
                Recorded: {context.vitals.recordedAt}
              </div>
            </div>
          </div>
        )}

        {context.recentLabs && (
          <div>
            <div className="text-xs uppercase tracking-wide font-semibold text-slate-400 mb-2">
              RECENT LABS — Mar 2026
            </div>
            <div className="space-y-1">
              {context.recentLabs.map((lab, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">{lab.name}:</span>
                  <span className={`font-mono text-xs font-semibold ${
                    lab.status === 'normal' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {lab.value} {lab.status === 'normal' ? '✅' : '⚠️'}
                  </span>
                </div>
              ))}
            </div>
            <button className="text-xs text-teal-600 font-medium hover:text-teal-700 mt-2">
              View All Labs →
            </button>
          </div>
        )}

        <div>
          <div className="text-xs uppercase tracking-wide font-semibold text-slate-400 mb-2">
            APPOINTMENTS
          </div>
          <div className="space-y-1 text-xs">
            {context.appointments.last && (
              <div className="text-emerald-600">Last: {context.appointments.last}</div>
            )}
            {context.appointments.next && (
              <div className="text-teal-600">Next: {context.appointments.next}</div>
            )}
          </div>
          <button className="text-xs text-teal-600 font-medium hover:text-teal-700 mt-2">
            📅 Book Appointment
          </button>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-200">
          <button className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors">
            💊 Write Prescription
          </button>
          <button className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors">
            🔬 Order Lab
          </button>
          <button className="w-full px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg text-xs font-medium transition-colors">
            📅 Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

function groupMessagesByDate(messages: MessageType[]): Record<string, MessageType[]> {
  const grouped: Record<string, MessageType[]> = {};

  messages.forEach(message => {
    const date = new Date(message.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey: string;
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Today — Wednesday, 7 April 2026';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Yesterday';
    } else {
      dateKey = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(message);
  });

  return grouped;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}
