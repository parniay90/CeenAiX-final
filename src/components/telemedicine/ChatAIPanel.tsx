import { useState } from 'react';
import { X, Send, Paperclip, Image, FileText, Download, Brain, AlertCircle } from 'lucide-react';
import { ChatMessage, SharedFile } from '../../types/telemedicine';
import { formatDistanceToNow } from 'date-fns';
import {
  MOCK_DIFFERENTIAL_DIAGNOSES,
  MOCK_GUIDELINE_ALERTS,
} from '../../types/consultation';

interface ChatAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  sharedFiles: SharedFile[];
  onSendMessage: (message: string, isArabic: boolean) => void;
}

export default function ChatAIPanel({
  isOpen,
  onClose,
  messages,
  sharedFiles,
  onSendMessage,
}: ChatAIPanelProps) {
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'files' | 'ai'>('chat');

  const handleSend = () => {
    if (newMessage.trim()) {
      const isArabic = /[\u0600-\u06FF]/.test(newMessage);
      onSendMessage(newMessage, isArabic);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 right-0 bottom-18 w-80 bg-gray-900 bg-opacity-95 backdrop-blur-sm border-l border-gray-700 shadow-2xl z-30 flex flex-col">
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              activeTab === 'chat'
                ? 'bg-teal-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              activeTab === 'files'
                ? 'bg-teal-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Files
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              activeTab === 'ai'
                ? 'bg-violet-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            AI Support
          </button>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {activeTab === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderType === 'doctor' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] ${
                    msg.senderType === 'doctor'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-700 text-white'
                  } rounded-lg px-3 py-2`}
                  dir={msg.isArabic ? 'rtl' : 'ltr'}
                >
                  <div className="text-xs opacity-75 mb-1">{msg.senderName}</div>
                  <div className="text-sm">{msg.message}</div>
                  <div className="text-xs opacity-60 mt-1">
                    {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type message... (Arabic supported)"
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <button className="mt-2 text-xs text-gray-400 hover:text-white flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              Attach file
            </button>
          </div>
        </>
      )}

      {activeTab === 'files' && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <button className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
              <Paperclip className="w-4 h-4" />
              Upload File
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase">Shared Files</h4>
            {sharedFiles.map((file) => (
              <div
                key={file.id}
                className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {file.fileType.startsWith('image/') ? (
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={file.thumbnail || file.fileUrl}
                        alt={file.fileName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-semibold truncate">
                      {file.fileName}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Uploaded by {file.uploadedBy}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {formatDistanceToNow(file.uploadedAt, { addSuffix: true })}
                    </div>
                    <button className="mt-2 text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-gradient-to-br from-violet-900 to-violet-800 rounded-lg p-3 border border-violet-600">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-violet-300" />
              <h4 className="text-xs font-bold text-white">AI Clinical Support</h4>
            </div>
            <p className="text-xs text-violet-200">
              Real-time clinical decision support during your consultation
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="px-3 py-2 bg-violet-900 bg-opacity-30 border-b border-gray-700">
              <h4 className="text-xs font-bold text-violet-300">Differential Diagnosis</h4>
            </div>
            <div className="p-3 space-y-2">
              {MOCK_DIFFERENTIAL_DIAGNOSES.slice(0, 2).map((dx) => (
                <div
                  key={dx.id}
                  className="p-2 bg-gray-900 rounded border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-semibold text-white">{dx.diagnosis}</span>
                    <span className="text-xs font-bold text-violet-400">{dx.probability}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-violet-600 h-1.5 rounded-full"
                      style={{ width: `${dx.probability}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 font-mono mt-1">{dx.icd10Code}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="px-3 py-2 bg-blue-900 bg-opacity-30 border-b border-gray-700">
              <h4 className="text-xs font-bold text-blue-300">Clinical Guidelines</h4>
            </div>
            <div className="p-3 space-y-2">
              {MOCK_GUIDELINE_ALERTS.slice(0, 1).map((guideline) => (
                <div
                  key={guideline.id}
                  className="p-2 bg-blue-900 bg-opacity-20 rounded border border-blue-800"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-blue-300 mb-1">
                        {guideline.title}
                      </h5>
                      <p className="text-xs text-blue-200 leading-relaxed">
                        {guideline.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
