import { FileText, Play, Image as ImageIcon, CheckCheck, FileDown } from 'lucide-react';
import { Message } from '../../types/messaging';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
  showActions?: boolean;
  onReply?: (message: Message) => void;
  onForward?: (message: Message) => void;
  onDelete?: (message: Message) => void;
  onReport?: (message: Message) => void;
}

export default function MessageBubble({
  message,
  isSent,
  showActions = false,
}: MessageBubbleProps) {
  const renderMedicalContext = () => {
    if (!message.medicalContext) return null;

    const typeColors = {
      'lab-result': 'border-green-500 bg-green-950',
      'appointment': 'border-blue-500 bg-blue-950',
      'prescription': 'border-purple-500 bg-purple-950',
      'vital-sign': 'border-rose-500 bg-rose-950',
    };

    const bgColor = typeColors[message.medicalContext.type] || 'border-slate-500 bg-slate-800';

    return (
      <div className={`border-l-4 ${bgColor} bg-opacity-30 rounded-lg p-3 mb-2`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="text-xs font-bold text-teal-400 uppercase">
            {message.medicalContext.type.replace('-', ' ')}
          </div>
          <div className="text-xs text-slate-500">
            {format(message.medicalContext.date, 'MMM d, yyyy')}
          </div>
        </div>
        <h4 className="text-sm font-bold text-white mb-1">{message.medicalContext.title}</h4>
        <p className="text-sm text-slate-300 mb-2">{message.medicalContext.summary}</p>
        <div className="text-xs text-slate-400">Patient: {message.medicalContext.patientName}</div>
      </div>
    );
  };

  const renderAttachment = () => {
    if (!message.attachment) return null;

    const { type, filename, fileSize } = message.attachment;
    const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);

    if (type === 'image') {
      return (
        <div className="mb-2 rounded-lg overflow-hidden">
          <div className="w-64 h-48 bg-slate-700 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-slate-500" />
          </div>
          <div className="bg-slate-800 bg-opacity-50 px-3 py-2 text-xs text-slate-300">
            {filename}
          </div>
        </div>
      );
    }

    if (type === 'voice') {
      return (
        <div className="flex items-center gap-3 bg-slate-800 bg-opacity-50 rounded-lg px-4 py-3 mb-2">
          <button className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors">
            <Play className="w-4 h-4 text-white ml-0.5" />
          </button>
          <div className="flex-1">
            <div className="h-8 flex items-center gap-0.5">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-teal-500 rounded-full"
                  style={{ height: `${Math.random() * 100}%` }}
                ></div>
              ))}
            </div>
          </div>
          <div className="text-xs text-slate-400">
            {message.attachment.duration ? `${message.attachment.duration}s` : '0:00'}
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 bg-slate-800 bg-opacity-50 rounded-lg px-4 py-3 mb-2">
        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white truncate">{filename}</div>
          <div className="text-xs text-slate-400">{fileSizeMB} MB</div>
        </div>
        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
          <FileDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    );
  };

  const renderReplyTo = () => {
    if (!message.replyTo) return null;

    return (
      <div className="border-l-2 border-teal-500 pl-3 mb-2 text-xs">
        <div className="font-bold text-teal-400">{message.replyTo.senderName}</div>
        <div className="text-slate-400 line-clamp-1">{message.replyTo.content}</div>
      </div>
    );
  };

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div className={`max-w-[70%] ${isSent ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isSent && (
          <div className="text-xs font-bold text-slate-400 mb-1">{message.senderName}</div>
        )}

        <div
          className={`rounded-2xl px-4 py-2 ${
            isSent
              ? 'bg-teal-600 text-white'
              : 'bg-white border border-slate-300 text-slate-900'
          }`}
        >
          {renderReplyTo()}
          {renderMedicalContext()}
          {renderAttachment()}
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs ${isSent ? 'text-slate-500' : 'text-slate-500'}`}>
            {format(message.timestamp, 'h:mm a')}
          </span>
          {isSent && (
            <CheckCheck
              className={`w-4 h-4 ${
                message.isRead ? 'text-teal-400' : 'text-slate-500'
              }`}
            />
          )}
        </div>

        {showActions && (
          <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded transition-colors">
              Reply
            </button>
            <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded transition-colors">
              Forward
            </button>
            <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded transition-colors">
              Delete
            </button>
            {!isSent && (
              <button className="px-2 py-1 bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold rounded transition-colors">
                Report
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
