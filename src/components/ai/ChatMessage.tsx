import { useState, useEffect } from 'react';
import { Tag, TrendingUp, TrendingDown } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types/aiChat';

interface ChatMessageProps {
  message: ChatMessageType;
  onQuickReply?: (reply: string) => void;
  showTyping?: boolean;
}

export default function ChatMessage({ message, onQuickReply, showTyping }: ChatMessageProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(!showTyping);

  useEffect(() => {
    if (showTyping && message.role === 'assistant') {
      let index = 0;
      setDisplayedText('');
      setIsTypingComplete(false);

      const interval = setInterval(() => {
        if (index < message.content.length) {
          setDisplayedText((prev) => prev + message.content[index]);
          index++;
        } else {
          clearInterval(interval);
          setIsTypingComplete(true);
        }
      }, 20);

      return () => clearInterval(interval);
    } else {
      setDisplayedText(message.content);
      setIsTypingComplete(true);
    }
  }, [message.content, showTyping, message.role]);

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[70%]">
          <div className="bg-teal-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {message.timestamp.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[85%]">
        <div className="bg-white border-2 border-slate-200 border-l-4 border-l-violet-600 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
          {!isTypingComplete && (
            <div className="flex gap-1 mb-2">
              <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}

          <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
            {displayedText}
          </p>

          {isTypingComplete && message.confidence && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">Confidence:</span>
              <div className="flex items-center gap-1">
                {message.confidence === 'High' && (
                  <>
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">High</span>
                  </>
                )}
                {message.confidence === 'Medium' && (
                  <>
                    <TrendingDown className="w-3 h-3 text-amber-600" />
                    <span className="text-xs font-semibold text-amber-700">Medium</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {isTypingComplete && message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.sources.map((source, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 px-2 py-1 bg-violet-50 border border-violet-200 rounded-full"
              >
                <Tag className="w-3 h-3 text-violet-600" />
                <span className="text-xs text-violet-700">{source}</span>
              </div>
            ))}
          </div>
        )}

        {isTypingComplete && message.quickReplies && message.quickReplies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => onQuickReply?.(reply)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-violet-100 hover:text-violet-700 text-gray-700 rounded-full text-sm font-medium transition-all border border-gray-200 hover:border-violet-300"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
