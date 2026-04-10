import { useState } from 'react';
import { Send, Paperclip, Mic, Smile, Brain } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string, type: 'text' | 'file' | 'image' | 'voice' | 'medical-context') => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message, 'text');
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 px-6 py-4">
      <div className="flex items-end gap-3">
        <div className="flex gap-1">
          <button
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors group"
            title="Insert medical context"
          >
            <div className="relative">
              <Paperclip className="w-5 h-5 text-slate-500 group-hover:text-teal-600" />
              <Brain className="w-3 h-3 text-teal-600 absolute -top-1 -right-1" />
            </div>
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Attach file">
            <Paperclip className="w-5 h-5 text-slate-500 hover:text-teal-600" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Emoji">
            <Smile className="w-5 h-5 text-slate-500 hover:text-teal-600" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Voice note">
            <Mic className="w-5 h-5 text-slate-500 hover:text-teal-600" />
          </button>
        </div>

        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
