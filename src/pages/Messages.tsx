import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Search, CreditCard as Edit, MoreVertical, Send, Paperclip, Smile, Mic, Calendar, Info, X, FileText, Image as ImageIcon, Activity, Download, Check, Clock, Phone, MapPin, Award, ChevronLeft, Video, PhoneCall, PhoneOff, VideoOff, MicOff, Volume2, Maximize2, Settings } from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';

type OnlineStatus = 'online' | 'offline' | 'away';
type MessageSender = 'patient' | 'doctor' | 'system' | 'pharmacy' | 'support';
type CallType = 'video' | 'audio' | null;
type CallStatus = 'idle' | 'calling' | 'connected' | 'ended';

interface Contact {
  id: string;
  name: string;
  role: string;
  organization: string;
  specialty?: string;
  status: OnlineStatus;
  lastSeen?: string;
  avatar: string;
  avatarGradient: string;
  responseTime?: string;
}

interface MessageAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'vitals';
  size: string;
  pages?: number;
  icon: string;
}

interface ChatMessage {
  id: string;
  sender: MessageSender;
  senderName?: string;
  content: string;
  timestamp: string;
  time: string;
  isRead: boolean;
  delivered?: boolean;
  attachment?: MessageAttachment;
  isNew?: boolean;
}

interface Conversation {
  id: string;
  contact: Contact;
  unread: number;
  lastMessage: string;
  lastTime: string;
  messages: ChatMessage[];
}

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('conv-ahmed');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDoctorInfo, setShowDoctorInfo] = useState(false);
  const [showSharedDocs, setShowSharedDocs] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [callType, setCallType] = useState<CallType>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setCallType(null);
      setCallStatus('idle');
      setCallDuration(0);
      setIsMuted(false);
      setIsVideoOff(false);
    }, 2000);
  };

  const contacts: Record<string, Contact> = {
    'dr-ahmed': {
      id: 'dr-ahmed',
      name: 'Dr. Ahmed Al Rashidi',
      role: 'Cardiologist',
      organization: 'Al Noor Medical Center',
      specialty: 'Cardiology',
      status: 'online',
      avatar: 'AA',
      avatarGradient: 'from-slate-800 to-teal-700',
      responseTime: '4 hours'
    },
    'dr-fatima': {
      id: 'dr-fatima',
      name: 'Dr. Fatima Al Mansoori',
      role: 'Endocrinologist',
      organization: 'Dubai Specialist Clinic',
      specialty: 'Endocrinology',
      status: 'offline',
      lastSeen: '1 day ago',
      avatar: 'FA',
      avatarGradient: 'from-emerald-700 to-teal-600',
      responseTime: '6 hours'
    },
    'dr-tooraj': {
      id: 'dr-tooraj',
      name: 'Dr. Tooraj Helmi',
      role: 'General Practitioner',
      organization: 'Gulf Medical Center',
      specialty: 'General Medicine',
      status: 'offline',
      lastSeen: '3 days ago',
      avatar: 'TH',
      avatarGradient: 'from-blue-700 to-indigo-600',
      responseTime: '8 hours'
    },
    'pharmacy': {
      id: 'pharmacy',
      name: 'Al Shifa Pharmacy',
      role: 'Pharmacy',
      organization: 'Al Barsha, Dubai',
      status: 'away',
      avatar: '🏪',
      avatarGradient: 'from-amber-600 to-orange-500',
      responseTime: '2 hours'
    },
    'support': {
      id: 'support',
      name: 'CeenAiX Support',
      role: 'Platform Support',
      organization: 'CeenAiX',
      status: 'online',
      avatar: '⚙️',
      avatarGradient: 'from-slate-600 to-slate-400',
      responseTime: 'Usually instant'
    }
  };

  const conversations: Conversation[] = [
    {
      id: 'conv-ahmed',
      contact: contacts['dr-ahmed'],
      unread: 1,
      lastMessage: "That's excellent! 128/80 is right on target. Keep it up and see you April 15.",
      lastTime: '2h ago',
      messages: [
        {
          id: 'sys-1',
          sender: 'system',
          content: '🔒 End-to-end encrypted · Connected to Dr. Ahmed Al Rashidi\nCardiologist · Al Noor Medical Center',
          timestamp: 'Mar 7',
          time: '',
          isRead: true
        },
        {
          id: 'msg-1',
          sender: 'doctor',
          senderName: 'Dr. Ahmed Al Rashidi',
          content: "Hi Parnia, I reviewed your latest blood pressure readings you shared. Your BP was 128/82 which is well controlled with the Amlodipine. However please do not skip your medication — consistency is everything with blood pressure.\n\nOne missed dose can cause a spike.",
          timestamp: 'Wednesday, 11 March 2026',
          time: '2:15 PM',
          isRead: true,
          delivered: true
        },
        {
          id: 'msg-2',
          sender: 'patient',
          content: "Thank you Dr. Ahmed. I'll make sure to take it every morning. Should I be concerned about the slight elevation I had last week (131/84)?",
          timestamp: 'Wednesday, 11 March 2026',
          time: '3:30 PM',
          isRead: true,
          delivered: true
        },
        {
          id: 'msg-3',
          sender: 'doctor',
          senderName: 'Dr. Ahmed Al Rashidi',
          content: '131/84 is within acceptable range — nothing to be alarmed about. Occasional variations happen, especially if you were stressed, had coffee, or after physical activity.\n\nThe trend over 7 days is what matters, and yours is looking very good. Keep logging at home!',
          timestamp: 'Wednesday, 11 March 2026',
          time: '4:00 PM',
          isRead: true,
          delivered: true
        },
        {
          id: 'msg-4',
          sender: 'patient',
          content: "That's reassuring! I've been logging every morning before getting out of bed.\n\nHere's my log for the past week:",
          timestamp: 'Wednesday, 11 March 2026',
          time: '4:22 PM',
          isRead: true,
          delivered: true,
          attachment: {
            id: 'att-1',
            name: 'Blood pressure log — Mar 8-14',
            type: 'image',
            size: '1.2 MB',
            icon: '📊'
          }
        },
        {
          id: 'msg-5',
          sender: 'doctor',
          senderName: 'Dr. Ahmed Al Rashidi',
          content: 'Perfect technique — measuring before getting up is exactly right (reduces white coat effect). Your readings are very consistent.\n\nAmlodipine is working well! 💪',
          timestamp: 'Wednesday, 11 March 2026',
          time: '4:35 PM',
          isRead: true,
          delivered: true
        },
        {
          id: 'msg-6',
          sender: 'patient',
          content: 'Good morning Dr. Ahmed!\n\nBP this morning: 126/80.\n\nFeeling much better and less anxious about it now. Thank you for explaining everything so clearly.',
          timestamp: 'Friday, 13 March 2026',
          time: '9:00 AM',
          isRead: true,
          delivered: true
        },
        {
          id: 'msg-7',
          sender: 'doctor',
          senderName: 'Dr. Ahmed Al Rashidi',
          content: "126/80 is excellent — that's nearly perfect! You're doing a great job, Parnia.\n\nLet's keep the current treatment and see you on April 15 for your regular follow-up. If anything changes or you feel unwell before then, don't hesitate to message me.",
          timestamp: 'Friday, 13 March 2026',
          time: '10:30 AM',
          isRead: true,
          delivered: true
        },
        {
          id: 'msg-8',
          sender: 'patient',
          content: "Perfect, see you then! One more question — is it okay to drink coffee? I've been avoiding it but miss it a lot 😅",
          timestamp: 'Friday, 13 March 2026',
          time: '10:47 AM',
          isRead: true,
          delivered: true
        },
        {
          id: 'msg-9',
          sender: 'doctor',
          senderName: 'Dr. Ahmed Al Rashidi',
          content: 'Haha yes, you can absolutely have coffee! ☕\n\n1-2 cups in the morning is completely fine. Large amounts can temporarily raise BP, but moderate coffee has no long-term impact on blood pressure for most people.\n\nJust avoid coffee right before you measure!',
          timestamp: 'Friday, 13 March 2026',
          time: '11:15 AM',
          isRead: true,
          delivered: true
        },
        {
          id: 'msg-10',
          sender: 'patient',
          content: 'This is the best news I\'ve received all week 😄\n\nThank you so much Dr. Ahmed!',
          timestamp: 'Friday, 13 March 2026',
          time: '11:20 AM',
          isRead: true,
          delivered: true
        },
        {
          id: 'msg-11',
          sender: 'patient',
          content: 'Morning reading: 128/82. All good! ☕',
          timestamp: 'Saturday, 14 March 2026',
          time: '8:47 AM',
          isRead: true,
          delivered: true
        },
        {
          id: 'msg-12',
          sender: 'doctor',
          senderName: 'Dr. Ahmed Al Rashidi',
          content: "That's excellent! 🎉 128/82 is right on target. Keep it up and see you on April 15.\n\nI've noted your consistent readings in your Nabidh record — keep it up!",
          timestamp: 'Saturday, 14 March 2026',
          time: '10:00 AM',
          isRead: false,
          delivered: true,
          isNew: true
        }
      ]
    },
    {
      id: 'conv-fatima',
      contact: contacts['dr-fatima'],
      unread: 1,
      lastMessage: 'Your HbA1c is improving — keep up the diet changes, Parnia 💪',
      lastTime: '1 day ago',
      messages: [
        {
          id: 'msg-f1',
          sender: 'doctor',
          senderName: 'Dr. Fatima Al Mansoori',
          content: 'Hi Parnia, please come in for your blood tests tomorrow (March 5) — fasting from 10 PM tonight. Your 3-month checkup is due.\n\nI\'ve sent the lab order to Dubai Medical Lab.',
          timestamp: 'Tuesday, 3 March 2026',
          time: '9:00 AM',
          isRead: true,
          delivered: true
        },
        {
          id: 'msg-f2',
          sender: 'patient',
          content: "Of course, Dr. Fatima. I'll be there at 7:30 AM.\n\nShould I take my Metformin tonight or skip it before the fasting test?",
          timestamp: 'Tuesday, 3 March 2026',
          time: '9:45 AM',
          isRead: true,
          delivered: true
        },
        {
          id: 'msg-f3',
          sender: 'doctor',
          senderName: 'Dr. Fatima Al Mansoori',
          content: "Take your evening Metformin as usual tonight. For fasting tests, it's the food we restrict, not the medication.\n\nYou can take your morning Metformin AFTER the blood draw.",
          timestamp: 'Tuesday, 3 March 2026',
          time: '10:00 AM',
          isRead: true,
          delivered: true
        },
        {
          id: 'msg-f4',
          sender: 'doctor',
          senderName: 'Dr. Fatima Al Mansoori',
          content: "Parnia, I've reviewed your lab results.\n\nHbA1c is 6.8% — improved from 7.1% in October. This is wonderful progress! 🎉\n\nVitamin D is 22 — still insufficient, please continue the supplements I prescribed.\n\nCRP slightly elevated at 3.2 — mild, nothing to worry about, will monitor.\n\nOverall I'm very pleased with your progress.",
          timestamp: 'Thursday, 5 March 2026',
          time: '3:47 PM',
          isRead: true,
          delivered: true,
          attachment: {
            id: 'att-f1',
            name: 'Full Blood Panel — March 2026',
            type: 'pdf',
            size: '284 KB',
            pages: 2,
            icon: '📄'
          }
        },
        {
          id: 'msg-f5',
          sender: 'patient',
          content: "This is such good news! I've been working hard on the diet changes you recommended.\n\nThe HbA1c improvement really motivates me!",
          timestamp: 'Thursday, 5 March 2026',
          time: '4:15 PM',
          isRead: true,
          delivered: true
        },
        {
          id: 'msg-f6',
          sender: 'doctor',
          senderName: 'Dr. Fatima Al Mansoori',
          content: "It absolutely should! You've dropped 0.6 points in 6 months — that's real clinical improvement.\n\nKeep taking the Metformin, maintain the low-carb diet, and walk after meals when possible.\n\nI've renewed your prescriptions for another 6 months. See you in June! 💪",
          timestamp: 'Thursday, 5 March 2026',
          time: '4:30 PM',
          isRead: true,
          delivered: true
        },
        {
          id: 'msg-f7',
          sender: 'doctor',
          senderName: 'Dr. Fatima Al Mansoori',
          content: 'Your HbA1c is improving — keep up the diet changes, Parnia 💪 See you June 5!',
          timestamp: 'Thursday, 6 March 2026',
          time: '9:30 AM',
          isRead: false,
          delivered: true,
          isNew: true
        }
      ]
    },
    {
      id: 'conv-tooraj',
      contact: contacts['dr-tooraj'],
      unread: 0,
      lastMessage: "See you at your next visit. Take care of yourself! 😊",
      lastTime: '5 days ago',
      messages: []
    },
    {
      id: 'conv-pharmacy',
      contact: contacts['pharmacy'],
      unread: 0,
      lastMessage: 'Your Metformin refill is ready for pickup. Pharmacy hours: 9AM-10PM',
      lastTime: '3 days ago',
      messages: []
    },
    {
      id: 'conv-support',
      contact: contacts['support'],
      unread: 0,
      lastMessage: 'Welcome to CeenAiX! Your account is fully set up. How can we help?',
      lastTime: '30 days ago',
      messages: []
    }
  ];

  const activeConversation = conversations.find(c => c.id === selectedConversation);
  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unread, 0);

  const getStatusDot = (status: OnlineStatus) => {
    switch (status) {
      case 'online':
        return <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />;
      case 'away':
        return <div className="w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-white" />;
      default:
        return <div className="w-2.5 h-2.5 bg-slate-300 rounded-full ring-2 ring-white" />;
    }
  };

  const getStatusText = (contact: Contact) => {
    if (contact.status === 'online') {
      return <span className="text-emerald-600">● Online</span>;
    }
    if (contact.status === 'away') {
      return <span className="text-amber-600">⌛ Away</span>;
    }
    return <span className="text-slate-400">⚫ Last seen {contact.lastSeen}</span>;
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    setMessageText('');

    if (activeConversation?.contact.status === 'online') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2500);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    if (timestamp.includes(',')) {
      return (
        <div className="flex items-center justify-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-200" />
          <div className="text-xs text-slate-400">{timestamp}</div>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <PatientSidebar currentPage="messages" />

      <div className="flex-1 ml-64 flex flex-col h-screen">
        <PatientTopNav patientName="Ahmed Al Maktoum" />

        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Messages 💬
                  </h2>
                  {unreadCount > 0 && (
                    <p className="text-xs text-blue-500 font-medium">{unreadCount} unread</p>
                  )}
                </div>
                <button
                  onClick={() => setShowNewMessage(true)}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Edit className="w-3.5 h-3.5" />
                  New
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-4 border-b border-slate-100 hover:bg-slate-50 transition-all text-left ${
                    selectedConversation === conv.id
                      ? 'bg-teal-50 border-l-3 border-l-teal-600'
                      : conv.unread > 0
                      ? 'bg-blue-50 border-l-2 border-l-blue-500'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${conv.contact.avatarGradient} flex items-center justify-center text-white font-bold text-sm`}>
                        {conv.contact.avatar}
                      </div>
                      <div className="absolute bottom-0 right-0">
                        {getStatusDot(conv.contact.status)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-bold text-slate-900 truncate ${conv.unread > 0 ? 'font-extrabold' : ''}`}>
                          {conv.contact.name}
                        </h3>
                        <span className="text-xs text-slate-400 ml-2">{conv.lastTime}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-teal-50 text-teal-600 rounded text-xs font-medium">
                          {conv.contact.role}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className={`text-xs truncate ${conv.unread > 0 ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                          {conv.lastMessage}
                        </p>
                        {conv.unread > 0 && (
                          <div className="ml-2 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                            {conv.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <span className="text-sm">🔒</span>
                <span>End-to-end encrypted · DHA Compliant</span>
              </div>
            </div>
          </div>

          {activeConversation ? (
            <div className="flex-1 flex flex-col bg-slate-50">
              <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${activeConversation.contact.avatarGradient} flex items-center justify-center text-white font-bold text-sm`}>
                      {activeConversation.contact.avatar}
                    </div>
                    <div className="absolute bottom-0 right-0">
                      {getStatusDot(activeConversation.contact.status)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {activeConversation.contact.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {getStatusText(activeConversation.contact)} · {activeConversation.contact.role} · {activeConversation.contact.organization}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 mr-4">
                    <span className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-medium">
                      ⚠️ Penicillin allergy
                    </span>
                    {activeConversation.contact.specialty && (
                      <span className="px-2 py-1 bg-teal-50 text-teal-600 rounded-lg text-xs font-medium">
                        🩺 {activeConversation.contact.specialty} patient
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setCallType('audio');
                      setCallStatus('calling');
                      setTimeout(() => setCallStatus('connected'), 2000);
                    }}
                    disabled={activeConversation.contact.status === 'offline'}
                    className="p-2 hover:bg-emerald-50 rounded-lg transition-all group disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Audio Call"
                  >
                    <PhoneCall className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                  </button>
                  <button
                    onClick={() => {
                      setCallType('video');
                      setCallStatus('calling');
                      setTimeout(() => setCallStatus('connected'), 2000);
                    }}
                    disabled={activeConversation.contact.status === 'offline'}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-all group disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Video Call"
                  >
                    <Video className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-all group">
                    <Calendar className="w-5 h-5 text-slate-400 group-hover:text-teal-600" />
                  </button>
                  <button
                    onClick={() => setShowSharedDocs(true)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-all group relative"
                  >
                    <FileText className="w-5 h-5 text-slate-400 group-hover:text-teal-600" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                      3
                    </span>
                  </button>
                  <button
                    onClick={() => setShowDoctorInfo(true)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-all group"
                  >
                    <Info className="w-5 h-5 text-slate-400 group-hover:text-teal-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-all group">
                    <MoreVertical className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {activeConversation.messages.map((message, index) => {
                  const showTimestamp = index === 0 || message.timestamp !== activeConversation.messages[index - 1]?.timestamp;
                  const isFirstInGroup = index === 0 ||
                    message.sender !== activeConversation.messages[index - 1]?.sender ||
                    message.timestamp !== activeConversation.messages[index - 1]?.timestamp;

                  return (
                    <div key={message.id}>
                      {showTimestamp && message.timestamp && formatTimestamp(message.timestamp)}

                      {message.isNew && (
                        <div className="flex items-center justify-center gap-3 my-4">
                          <div className="flex-1 h-px bg-blue-400" />
                          <div className="text-xs text-blue-400 font-medium">New message</div>
                          <div className="flex-1 h-px bg-blue-400" />
                        </div>
                      )}

                      {message.sender === 'system' ? (
                        <div className="flex justify-center my-4">
                          <div className="max-w-xs bg-slate-100 rounded-xl px-4 py-2 text-center">
                            <p className="text-xs text-slate-500 whitespace-pre-line">{message.content}</p>
                          </div>
                        </div>
                      ) : message.sender === 'doctor' ? (
                        <div className={`flex items-start gap-3 ${isFirstInGroup ? 'mt-4' : 'mt-1'}`}>
                          <div className="w-8 h-8">
                            {isFirstInGroup && (
                              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeConversation.contact.avatarGradient} flex items-center justify-center text-white font-bold text-xs`}>
                                {activeConversation.contact.avatar}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 max-w-[72%]">
                            <div className="bg-white border border-blue-100 rounded-[4px_18px_18px_18px] p-3 shadow-sm">
                              {isFirstInGroup && message.senderName && (
                                <p className="text-xs font-bold text-teal-600 mb-1">{message.senderName}</p>
                              )}
                              <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                                {message.content}
                              </p>
                              {message.attachment && (
                                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-2xl">
                                      {message.attachment.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-slate-900 truncate">
                                        {message.attachment.name}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {message.attachment.type.toUpperCase()} · {message.attachment.pages && `${message.attachment.pages} pages · `}{message.attachment.size}
                                      </p>
                                    </div>
                                    <button className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all">
                                      <Download className="w-4 h-4 text-slate-600" />
                                    </button>
                                  </div>
                                </div>
                              )}
                              <p className="text-xs text-slate-400 mt-2">{message.time}</p>
                            </div>
                          </div>
                        </div>
                      ) : message.sender === 'patient' ? (
                        <div className={`flex items-start justify-end ${isFirstInGroup ? 'mt-4' : 'mt-1'}`}>
                          <div className="flex-1 max-w-[72%]">
                            <div className="bg-teal-600 rounded-[18px_4px_18px_18px] p-3 shadow-lg shadow-teal-500/20">
                              <p className="text-sm text-white whitespace-pre-line leading-relaxed">
                                {message.content}
                              </p>
                              {message.attachment && (
                                <div className="mt-3 bg-white rounded-xl p-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-2xl">
                                      {message.attachment.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-slate-900 truncate">
                                        {message.attachment.name}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {message.attachment.type.toUpperCase()} · {message.attachment.size}
                                      </p>
                                    </div>
                                    <button className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all">
                                      <Download className="w-4 h-4 text-slate-600" />
                                    </button>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center justify-end gap-1 mt-2">
                                <p className="text-xs text-teal-200">{message.time}</p>
                                {message.delivered && (
                                  <div className="flex">
                                    <Check className="w-3 h-3 text-white" />
                                    <Check className="w-3 h-3 text-white -ml-1.5" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-start gap-3 mt-4">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeConversation.contact.avatarGradient} flex items-center justify-center text-white font-bold text-xs`}>
                      {activeConversation.contact.avatar}
                    </div>
                    <div>
                      <div className="bg-white border border-blue-100 rounded-[4px_18px_18px_18px] p-3 shadow-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 ml-1">{activeConversation.contact.name} is typing...</p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="bg-red-50 border-t border-red-200 px-6 py-2">
                <p className="text-xs text-red-600 text-center">
                  🚨 For medical emergencies call 998 (Ambulance) or 999 (Police) — do not use messaging for emergencies
                </p>
              </div>

              <div className="bg-white border-t border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
                  <button className="px-3 py-1.5 bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 text-slate-600 rounded-full text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all">
                    <Activity className="w-3.5 h-3.5" />
                    Share Vitals
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 text-slate-600 rounded-full text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all">
                    <FileText className="w-3.5 h-3.5" />
                    Share Lab Result
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 text-slate-600 rounded-full text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Share Scan
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 text-slate-600 rounded-full text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all">
                    <Calendar className="w-3.5 h-3.5" />
                    Request Appointment
                  </button>
                </div>

                <div className="flex items-end gap-3">
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                    <Paperclip className="w-5 h-5 text-slate-400 hover:text-teal-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                    <Smile className="w-5 h-5 text-slate-400 hover:text-teal-600" />
                  </button>

                  <div className="flex-1">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={`Message ${activeConversation.contact.name}...`}
                      rows={1}
                      className="w-full px-4 py-3 bg-slate-50 rounded-[20px] text-sm resize-none focus:outline-none"
                      style={{ maxHeight: '120px' }}
                    />
                  </div>

                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                    <Mic className="w-5 h-5 text-slate-400 hover:text-teal-600" />
                  </button>

                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className={`p-2 rounded-lg transition-all ${
                      messageText.trim()
                        ? 'bg-teal-600 hover:bg-teal-700 hover:scale-105'
                        : 'bg-slate-100'
                    }`}
                  >
                    <Send className={`w-5 h-5 ${messageText.trim() ? 'text-white' : 'text-slate-300'}`} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-slate-50">
              <div className="text-center max-w-md">
                <MessageCircle className="w-18 h-18 text-teal-200 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-700 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Your messages 💬
                </h3>
                <p className="text-slate-400 mb-6">
                  Select a conversation to start messaging with your care team
                </p>

                <div className="grid grid-cols-1 gap-3">
                  <button className="p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-xl">
                        💊
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Ask about medications</p>
                        <p className="text-xs text-slate-500">Message Dr. Fatima</p>
                      </div>
                    </div>
                  </button>
                  <button className="p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-xl">
                        ❤️
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Report blood pressure</p>
                        <p className="text-xs text-slate-500">Message Dr. Ahmed</p>
                      </div>
                    </div>
                  </button>
                  <button className="p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                        🤒
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Report new symptoms</p>
                        <p className="text-xs text-slate-500">Message Dr. Tooraj</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {callType && activeConversation && (
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
          {callType === 'video' && (
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  {callStatus === 'calling' && (
                    <>
                      <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${activeConversation.contact.avatarGradient} flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6 animate-pulse`}>
                        {activeConversation.contact.avatar}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Calling {activeConversation.contact.name}...
                      </h3>
                      <p className="text-slate-400 mb-8">{activeConversation.contact.role}</p>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                      </div>
                    </>
                  )}
                  {callStatus === 'connected' && (
                    <>
                      <div className="mb-6">
                        <div className="w-full h-screen bg-slate-800 rounded-xl overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-teal-900/50 flex items-center justify-center">
                            {isVideoOff ? (
                              <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${activeConversation.contact.avatarGradient} flex items-center justify-center text-white font-bold text-5xl`}>
                                {activeConversation.contact.avatar}
                              </div>
                            ) : (
                              <div className="text-center">
                                <Video className="w-20 h-20 text-white/40 mx-auto mb-4" />
                                <p className="text-white/60 text-sm">Doctor video</p>
                              </div>
                            )}
                          </div>

                          <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
                            <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl px-4 py-3">
                              <p className="text-white font-bold">{activeConversation.contact.name}</p>
                              <p className="text-teal-400 text-sm">{activeConversation.contact.role}</p>
                            </div>
                            <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl px-4 py-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <p className="text-white font-mono font-bold">{formatCallDuration(callDuration)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="absolute bottom-6 right-6 w-48 h-36 bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                              {isVideoOff ? (
                                <div>
                                  <VideoOff className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                                  <p className="text-slate-400 text-xs">Camera off</p>
                                </div>
                              ) : (
                                <p className="text-slate-400 text-sm">Your video</p>
                              )}
                            </div>
                          </div>

                          <div className="absolute top-6 right-6">
                            <button
                              onClick={() => setIsVideoOff(!isVideoOff)}
                              className="w-10 h-10 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800 rounded-full flex items-center justify-center transition-all"
                            >
                              <Maximize2 className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {callStatus === 'ended' && (
                    <>
                      <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${activeConversation.contact.avatarGradient} flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6 opacity-60`}>
                        {activeConversation.contact.avatar}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Call Ended</h3>
                      <p className="text-slate-400">Duration: {formatCallDuration(callDuration)}</p>
                    </>
                  )}
                </div>
              </div>

              {callStatus === 'connected' && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {isMuted ? (
                      <MicOff className="w-6 h-6 text-white" />
                    ) : (
                      <Mic className="w-6 h-6 text-white" />
                    )}
                  </button>

                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {isVideoOff ? (
                      <VideoOff className="w-6 h-6 text-white" />
                    ) : (
                      <Video className="w-6 h-6 text-white" />
                    )}
                  </button>

                  <button
                    onClick={endCall}
                    className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all shadow-lg shadow-red-500/50"
                  >
                    <PhoneOff className="w-7 h-7 text-white" />
                  </button>

                  <button className="w-14 h-14 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center transition-all">
                    <Volume2 className="w-6 h-6 text-white" />
                  </button>

                  <button className="w-14 h-14 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center transition-all">
                    <Settings className="w-6 h-6 text-white" />
                  </button>
                </div>
              )}

              {callStatus === 'calling' && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                  <button
                    onClick={endCall}
                    className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all shadow-lg shadow-red-500/50"
                  >
                    <PhoneOff className="w-7 h-7 text-white" />
                  </button>
                </div>
              )}
            </div>
          )}

          {callType === 'audio' && (
            <div className="flex-1 relative bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                {callStatus === 'calling' && (
                  <>
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${activeConversation.contact.avatarGradient} flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6 animate-pulse`}>
                      {activeConversation.contact.avatar}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Calling {activeConversation.contact.name}...
                    </h3>
                    <p className="text-slate-300 mb-8">{activeConversation.contact.role}</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                    </div>
                  </>
                )}
                {callStatus === 'connected' && (
                  <>
                    <div className="relative mb-8">
                      <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${activeConversation.contact.avatarGradient} flex items-center justify-center text-white font-bold text-5xl mx-auto`}>
                        {activeConversation.contact.avatar}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500 px-4 py-1 rounded-full">
                        <p className="text-white text-sm font-bold">Connected</p>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {activeConversation.contact.name}
                    </h3>
                    <p className="text-slate-300 mb-6">{activeConversation.contact.role}</p>
                    <div className="flex items-center justify-center gap-2 mb-8">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <p className="text-white font-mono text-xl font-bold">{formatCallDuration(callDuration)}</p>
                    </div>

                    <div className="flex items-center justify-center gap-6 mb-8">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-emerald-400 rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 40 + 20}px`,
                            animationDelay: `${i * 100}ms`,
                            animationDuration: '800ms'
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
                {callStatus === 'ended' && (
                  <>
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${activeConversation.contact.avatarGradient} flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6 opacity-60`}>
                      {activeConversation.contact.avatar}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Call Ended</h3>
                    <p className="text-slate-300">Duration: {formatCallDuration(callDuration)}</p>
                  </>
                )}
              </div>

              {callStatus === 'connected' && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                    }`}
                  >
                    {isMuted ? (
                      <MicOff className="w-6 h-6 text-white" />
                    ) : (
                      <Mic className="w-6 h-6 text-white" />
                    )}
                  </button>

                  <button
                    onClick={endCall}
                    className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all shadow-lg shadow-red-500/50"
                  >
                    <PhoneOff className="w-7 h-7 text-white" />
                  </button>

                  <button className="w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all">
                    <Volume2 className="w-6 h-6 text-white" />
                  </button>
                </div>
              )}

              {callStatus === 'calling' && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                  <button
                    onClick={endCall}
                    className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all shadow-lg shadow-red-500/50"
                  >
                    <PhoneOff className="w-7 h-7 text-white" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showDoctorInfo && activeConversation && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="w-80 bg-white h-full shadow-2xl animate-slideInRight overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Doctor Information</h3>
              <button
                onClick={() => setShowDoctorInfo(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${activeConversation.contact.avatarGradient} flex items-center justify-center text-white font-bold text-xl mx-auto mb-3`}>
                  {activeConversation.contact.avatar}
                </div>
                <h4 className="font-bold text-slate-900 mb-1">{activeConversation.contact.name}</h4>
                <p className="text-sm text-slate-500">{activeConversation.contact.role}</p>
                <div className="mt-2">
                  {getStatusText(activeConversation.contact)}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🏥</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Hospital</p>
                    <p className="font-medium text-slate-900">{activeConversation.contact.organization}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="font-medium text-slate-900">Jumeirah, Dubai</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Response time</p>
                    <p className="font-medium text-slate-900">~{activeConversation.contact.responseTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Credentials</p>
                    <p className="font-medium text-emerald-600">DHA Verified ✓</p>
                  </div>
                </div>
              </div>

              {activeConversation.contact.id === 'dr-ahmed' && (
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl mb-6">
                  <p className="text-xs text-teal-600 font-medium mb-1">Next Appointment</p>
                  <p className="text-sm font-bold text-slate-900">April 15, 2026 · 10:30 AM</p>
                  <p className="text-xs text-slate-500 mt-1">Cardiology Follow-up</p>
                </div>
              )}

              <div className="space-y-2">
                <button className="w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all">
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </button>
                <button className="w-full px-4 py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-all">
                  <Phone className="w-4 h-4" />
                  Clinic Phone
                </button>
              </div>

              <button className="w-full mt-4 text-teal-600 hover:text-teal-700 text-sm font-medium">
                View Full Profile →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
