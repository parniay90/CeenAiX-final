import { Search, Lock } from 'lucide-react';
import { useState } from 'react';
import { Conversation, ConversationType } from '../../types/messaging';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListPanelProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export default function ConversationListPanel({
  conversations,
  activeConversationId,
  onSelectConversation,
}: ConversationListPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'patients' | 'doctors' | 'pharmacy' | 'lab' | 'system'>('all');

  const getAvatarColor = (type: ConversationType) => {
    switch (type) {
      case 'patient-doctor':
        return 'border-teal-500';
      case 'doctor-doctor':
        return 'border-violet-500';
      case 'doctor-pharmacy':
        return 'border-amber-500';
      case 'doctor-lab':
        return 'border-blue-500';
      case 'system':
        return 'border-slate-500';
      default:
        return 'border-slate-500';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participants.some(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'patients') return conv.type === 'patient-doctor';
    if (activeFilter === 'doctors') return conv.type === 'doctor-doctor';
    if (activeFilter === 'pharmacy') return conv.type === 'doctor-pharmacy';
    if (activeFilter === 'lab') return conv.type === 'doctor-lab';
    if (activeFilter === 'system') return conv.type === 'system';

    return true;
  });

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'patients', label: 'Patients' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'pharmacy', label: 'Pharmacy' },
    { id: 'lab', label: 'Lab' },
    { id: 'system', label: 'System' },
  ] as const;

  return (
    <div className="w-[30%] bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      <div className="px-4 py-3 border-b border-slate-800 overflow-x-auto">
        <div className="flex gap-2">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                activeFilter === tab.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map(conversation => {
          const otherParticipant = conversation.participants.find(p => p.id !== 'user-current') || conversation.participants[0];
          const isActive = conversation.id === activeConversationId;

          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full p-4 border-b border-slate-800 hover:bg-slate-800 transition-colors text-left ${
                isActive ? 'bg-slate-800' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`relative flex-shrink-0 w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white border-2 ${getAvatarColor(conversation.type)}`}>
                  {getInitials(otherParticipant.name)}
                  {otherParticipant.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white truncate">{otherParticipant.name}</h3>
                      <Lock className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: true })}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 mb-1">{otherParticipant.organization}</div>

                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm line-clamp-2 ${conversation.unreadCount > 0 ? 'text-white font-bold' : 'text-slate-400'}`}>
                      {conversation.lastMessage.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
