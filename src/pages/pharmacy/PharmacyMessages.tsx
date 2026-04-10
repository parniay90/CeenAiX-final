import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { messages } from '../../data/pharmacyData';

const contactBorder: Record<string, string> = {
  doctor: 'border-l-amber-400',
  patient: 'border-l-teal-400',
  system: 'border-l-slate-300',
  dha: 'border-l-red-400',
};

const contactBg: Record<string, string> = {
  doctor: 'bg-amber-50',
  patient: 'bg-teal-50',
  system: 'bg-slate-50',
  dha: 'bg-red-50',
};

const statusBadge: Record<string, { label: string; cls: string }> = {
  awaiting: { label: 'Awaiting', cls: 'bg-amber-100 text-amber-700' },
  sent: { label: 'Sent', cls: 'bg-teal-100 text-teal-700' },
  resolved: { label: 'Resolved', cls: 'bg-emerald-100 text-emerald-700' },
  info: { label: 'Info', cls: 'bg-blue-100 text-blue-700' },
  confirmed: { label: 'Confirmed', cls: 'bg-emerald-100 text-emerald-700' },
};

interface Props {
  onNavigate: (page: string) => void;
}

const PharmacyMessages: React.FC<Props> = ({ onNavigate }) => {
  const [selected, setSelected] = useState(messages[0]);
  const [newMessage, setNewMessage] = useState('');
  const [localThreads, setLocalThreads] = useState<Record<string, typeof messages[0]['thread']>>(
    Object.fromEntries(messages.map(m => [m.id, m.thread]))
  );
  const [approvalShown, setApprovalShown] = useState(false);

  const currentThread = localThreads[selected.id] || selected.thread;

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setLocalThreads(prev => ({
      ...prev,
      [selected.id]: [
        ...currentThread,
        {
          id: `msg-${Date.now()}`,
          sender: 'pharmacy' as const,
          time: '2:10 PM',
          type: 'response' as const,
          content: newMessage,
        },
      ],
    }));
    setNewMessage('');
  };

  return (
    <div className="flex h-full bg-slate-50" style={{ minHeight: 0 }}>
      {/* Conversation list */}
      <div className="w-72 flex-shrink-0 border-r border-slate-200 bg-white overflow-y-auto">
        <div className="px-4 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>
            Messages
          </h2>
          <div className="text-slate-400" style={{ fontSize: 12 }}>Pharmacy communications</div>
        </div>
        {messages.map(msg => {
          const badge = statusBadge[msg.status];
          const border = contactBorder[msg.contactType];
          const isActive = selected.id === msg.id;
          return (
            <button
              key={msg.id}
              onClick={() => setSelected(msg)}
              className={`w-full text-left px-4 py-3.5 border-b border-slate-50 border-l-4 transition-all ${border} ${isActive ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${msg.contactColor}`}>
                  {msg.contactInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 truncate" style={{ fontSize: 13 }}>
                      {msg.contact}
                    </span>
                    <span className="text-slate-400 flex-shrink-0" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
                      {msg.lastTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-slate-500 truncate" style={{ fontSize: 11 }}>
                      {msg.lastMessage.substring(0, 45)}...
                    </span>
                    {msg.unread > 0 && (
                      <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 animate-pulse">
                        {msg.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-400" style={{ fontSize: 10 }}>{msg.specialty}</span>
                {badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badge.cls}`}>
                    {badge.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active conversation */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className={`border-b border-slate-200 px-6 py-4 flex items-center gap-3 ${contactBg[selected.contactType]}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${selected.contactColor}`}>
            {selected.contactInitials}
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-900" style={{ fontSize: 15 }}>{selected.contact}</div>
            <div className="text-slate-500" style={{ fontSize: 12 }}>{selected.specialty}</div>
          </div>
          {selected.relatedRx && (
            <div className="bg-teal-100 text-teal-700 font-mono text-xs px-3 py-1.5 rounded-lg font-semibold">
              {selected.relatedRx}
            </div>
          )}
          {statusBadge[selected.status] && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusBadge[selected.status].cls}`}>
              {statusBadge[selected.status].label}
            </span>
          )}
        </div>

        {/* Special approval toast for Dr Ahmed conversation */}
        {selected.id === 'msg1' && currentThread.some(t => t.sender === 'doctor') && !approvalShown && (
          <div className="mx-4 mt-3">
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="flex-1 text-sm">
                <span className="font-semibold text-emerald-800">Dr. Ahmed approved substitution</span>
                <span className="text-emerald-700"> — Parnia's Rx moved to dispense queue ✅</span>
              </div>
              <button
                onClick={() => { setApprovalShown(true); onNavigate('dispense'); }}
                className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors flex-shrink-0"
              >
                Dispense Now
              </button>
            </div>
          </div>
        )}

        {/* Thread */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {currentThread.map(msg => {
            const isPharmacy = msg.sender === 'pharmacy';
            return (
              <div key={msg.id} className={`flex ${isPharmacy ? 'justify-end' : 'justify-start'}`}>
                {!isPharmacy && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 ${selected.contactColor}`}>
                    {selected.contactInitials}
                  </div>
                )}
                <div className={`max-w-[60%] rounded-2xl px-4 py-3 ${isPharmacy
                  ? 'bg-emerald-600 text-white rounded-br-sm'
                  : msg.type === 'approval'
                    ? 'bg-emerald-50 border-2 border-emerald-400 text-slate-800 rounded-bl-sm'
                    : msg.type === 'query'
                      ? 'bg-amber-50 border border-amber-300 text-slate-800 rounded-bl-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                  }`}>
                  {msg.type === 'query' && !isPharmacy && (
                    <div className="text-amber-600 text-xs font-bold uppercase mb-1">⚠️ Query</div>
                  )}
                  {msg.type === 'approval' && !isPharmacy && (
                    <div className="text-emerald-600 text-xs font-bold uppercase mb-1">✅ Approval</div>
                  )}
                  {msg.type === 'query' && isPharmacy && (
                    <div className="text-emerald-200 text-xs font-bold uppercase mb-1">📋 Prescription Query</div>
                  )}
                  {msg.type === 'notification' && !isPharmacy && (
                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">🔔 Notification</div>
                  )}
                  <div style={{ fontSize: 13 }}>{msg.content}</div>
                  <div className={`mt-1 text-right ${isPharmacy ? 'text-emerald-200' : 'text-slate-400'}`} style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
                    {msg.time} {msg.sender === 'system' ? '· System' : msg.sender === 'doctor' ? '· Doctor' : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        {(selected.contactType === 'doctor' || selected.contactType === 'patient') && (
          <div className="border-t border-slate-200 px-4 py-3 bg-white">
            <div className="flex items-end gap-2">
              <textarea
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={`Message ${selected.contact}...`}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-emerald-400 resize-none"
                rows={2}
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        {selected.contactType === 'system' || selected.contactType === 'dha' ? (
          <div className="border-t border-slate-200 px-4 py-3 bg-slate-50 text-center">
            <span className="text-slate-400 text-xs">System messages are read-only</span>
          </div>
        ) : null}
      </div>

      {/* Context panel - right */}
      <div className="w-60 flex-shrink-0 border-l border-slate-200 bg-white p-4 hidden xl:block">
        <div className="text-slate-400 uppercase tracking-widest mb-3" style={{ fontSize: 9, fontFamily: 'DM Mono, monospace' }}>
          CONTEXT
        </div>
        {selected.relatedRx && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 mb-3">
            <div className="text-teal-600 text-xs font-bold mb-1">Related Prescription</div>
            <div className="font-mono text-teal-700 text-xs">{selected.relatedRx}</div>
            <button
              onClick={() => onNavigate('dispense')}
              className="mt-2 w-full bg-teal-600 text-white text-xs font-medium py-1.5 rounded-lg hover:bg-teal-700 transition-colors"
            >
              View Prescription
            </button>
          </div>
        )}
        <div className="space-y-2">
          <div className="text-slate-500 text-xs font-semibold">{selected.contact}</div>
          <div className="text-slate-400 text-xs">{selected.specialty}</div>
          <div className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${contactBg[selected.contactType]}`}>
            {selected.contactType.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyMessages;
