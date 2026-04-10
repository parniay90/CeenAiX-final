import { MessageCircle } from 'lucide-react';
import { CONVERSATION_STARTERS } from '../../types/aiChat';

interface ConversationStartersProps {
  onSelectStarter: (starter: string) => void;
}

export default function ConversationStarters({ onSelectStarter }: ConversationStartersProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
          <MessageCircle className="w-8 h-8 text-violet-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">How can I help you today?</h3>
        <p className="text-gray-600">Select a question below or type your own</p>
      </div>

      <div className="grid grid-cols-1 gap-3 w-full max-w-2xl">
        {CONVERSATION_STARTERS.map((starter, idx) => (
          <button
            key={idx}
            onClick={() => onSelectStarter(starter)}
            className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-violet-500 hover:bg-violet-50 transition-all text-left group"
          >
            <span className="text-gray-700 group-hover:text-violet-700 font-medium">
              {starter}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
