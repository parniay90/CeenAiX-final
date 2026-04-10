import { Video, Phone, User, Shield, MoreVertical } from 'lucide-react';
import { Conversation, Message } from '../../types/messaging';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ActiveChatPanelProps {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string, type: 'text' | 'file' | 'image' | 'voice' | 'medical-context') => void;
}

export default function ActiveChatPanel({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
}: ActiveChatPanelProps) {
  const otherParticipant = conversation.participants.find(p => p.id !== currentUserId) || conversation.participants[0];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'bg-violet-600';
      case 'patient':
        return 'bg-teal-600';
      case 'pharmacist':
        return 'bg-amber-600';
      case 'lab-staff':
        return 'bg-blue-600';
      default:
        return 'bg-slate-600';
    }
  };

  const [isTyping] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white">
              {otherParticipant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              {otherParticipant.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">{otherParticipant.name}</h2>
                <span className={`px-2 py-0.5 ${getRoleBadgeColor(otherParticipant.role)} text-white text-xs font-bold rounded`}>
                  {otherParticipant.role.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-slate-400">{otherParticipant.organization}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Video className="w-5 h-5 text-slate-400" />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-slate-400" />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <User className="w-5 h-5 text-slate-400" />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
          <Shield className="w-3 h-3" />
          <span>End-to-end encrypted · DHA compliant</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isSent={message.senderId === currentUserId}
            showActions={true}
          />
        ))}

        {isTyping && (
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-2xl px-4 py-3">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}

function useState(arg0: boolean): [any] {
  return [arg0];
}
