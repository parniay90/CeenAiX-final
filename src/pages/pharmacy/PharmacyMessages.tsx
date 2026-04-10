import React, { useState } from 'react';
import { Send, CheckCircle2, Shield, AlertCircle, Info, MessageSquare } from 'lucide-react';
import { messages } from '../../data/pharmacyData';

type Message = typeof messages[0];
type ThreadEntry = typeof messages[0]['thread'][0];

const contactTypeConfig: Record<string, { border: string; activeBg: string; headerBg: string; tag: string; tagBg: string; tagText: string }> = {
  doctor:  { border: '#F59E0B', activeBg: '#FFFBEB', headerBg: '#FFFBEB', tag: 'DOCTOR',  tagBg: '#FEF3C7', tagText: '#92400E' },
  patient: { border: '#14B8A6', activeBg: '#F0FDFA', headerBg: '#F0FDFA', tag: 'PATIENT', tagBg: '#CCFBF1', tagText: '#0F766E' },
  system:  { border: '#94A3B8', activeBg: '#F8FAFC', headerBg: '#F8FAFC', tag: 'SYSTEM',  tagBg: '#F1F5F9', tagText: '#475569' },
  dha:     { border: '#EF4444', activeBg: '#FEF2F2', headerBg: '#FEF2F2', tag: 'DHA',     tagBg: '#FEE2E2', tagText: '#991B1B' },
};

const statusBadge: Record<string, { label: string; bg: string; text: string }> = {
  awaiting:  { label: 'Awaiting',  bg: '#FEF3C7', text: '#92400E' },
  sent:      { label: 'Sent',      bg: '#CCFBF1', text: '#0F766E' },
  resolved:  { label: 'Resolved',  bg: '#D1FAE5', text: '#065F46' },
  info:      { label: 'Info',      bg: '#DBEAFE', text: '#1E40AF' },
  confirmed: { label: 'Confirmed', bg: '#D1FAE5', text: '#065F46' },
};

const threadBubble = (msg: ThreadEntry, contactColor: string, contactInitials: string, isPharmacy: boolean) => {
  const bg =
    isPharmacy ? '#059669' :
    msg.type === 'approval' ? undefined :
    msg.type === 'query' ? undefined :
    msg.type === 'confirmation' ? undefined :
    undefined;

  const bubbleStyle: React.CSSProperties = isPharmacy
    ? { background: '#059669', color: '#fff', borderRadius: '18px 18px 4px 18px' }
    : msg.type === 'approval'
      ? { background: '#ECFDF5', border: '2px solid #34D399', color: '#065F46', borderRadius: '18px 18px 18px 4px' }
      : msg.type === 'query'
        ? { background: '#FFFBEB', border: '1px solid #FCD34D', color: '#1e293b', borderRadius: '18px 18px 18px 4px' }
        : msg.type === 'confirmation'
          ? { background: '#EFF6FF', border: '1px solid #93C5FD', color: '#1e3a5f', borderRadius: '18px 18px 18px 4px' }
          : { background: '#fff', border: '1px solid #E2E8F0', color: '#1e293b', borderRadius: '18px 18px 18px 4px' };

  return (
    <div key={msg.id} className={`flex ${isPharmacy ? 'justify-end' : 'justify-start'}`}>
      {!isPharmacy && (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 ${contactColor}`}>
          {contactInitials}
        </div>
      )}
      <div className="max-w-[65%]" style={bubbleStyle}>
        {!isPharmacy && msg.type === 'query' && (
          <div className="flex items-center gap-1 px-4 pt-3 pb-1" style={{ fontSize: 10, color: '#D97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <AlertCircle style={{ width: 10, height: 10 }} /> Query
          </div>
        )}
        {!isPharmacy && msg.type === 'approval' && (
          <div className="flex items-center gap-1 px-4 pt-3 pb-1" style={{ fontSize: 10, color: '#059669', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <CheckCircle2 style={{ width: 10, height: 10 }} /> Approval
          </div>
        )}
        {!isPharmacy && (msg.type === 'notification' || msg.type === 'confirmation') && (
          <div className="flex items-center gap-1 px-4 pt-3 pb-1" style={{ fontSize: 10, color: '#3B82F6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Info style={{ width: 10, height: 10 }} /> {msg.type === 'confirmation' ? 'Confirmation' : 'Notification'}
          </div>
        )}
        {isPharmacy && msg.type === 'query' && (
          <div className="flex items-center gap-1 px-4 pt-3 pb-1" style={{ fontSize: 10, color: '#A7F3D0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Prescription Query
          </div>
        )}
        <div className={`px-4 ${!isPharmacy && (msg.type === 'query' || msg.type === 'approval' || msg.type === 'notification' || msg.type === 'confirmation') ? 'pb-3' : 'py-3'}`} style={{ fontSize: 13, lineHeight: 1.55 }}>
          {msg.content}
        </div>
        <div
          className="px-4 pb-2.5 text-right"
          style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: isPharmacy ? 'rgba(255,255,255,0.6)' : '#94A3B8' }}
        >
          {msg.time}
          {msg.sender === 'system' ? ' · System' : msg.sender === 'doctor' ? ' · Doctor' : ''}
        </div>
      </div>
    </div>
  );
};

interface Props {
  onNavigate: (page: string) => void;
}

const PharmacyMessages: React.FC<Props> = ({ onNavigate }) => {
  const [selected, setSelected] = useState<Message>(messages[0]);
  const [newMessage, setNewMessage] = useState('');
  const [localThreads, setLocalThreads] = useState<Record<string, ThreadEntry[]>>(
    Object.fromEntries(messages.map(m => [m.id, m.thread as ThreadEntry[]]))
  );
  const [approvalDismissed, setApprovalDismissed] = useState(false);

  const currentThread = localThreads[selected.id] || selected.thread;
  const cfg = contactTypeConfig[selected.contactType] || contactTypeConfig.system;

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

  const canType = selected.contactType === 'doctor' || selected.contactType === 'patient';
  const showApprovalBanner =
    selected.id === 'msg1' &&
    !approvalDismissed &&
    currentThread.some(t => t.sender === 'doctor' && t.type === 'approval');

  return (
    <div className="flex h-full" style={{ minHeight: 0, background: '#F8FAFC' }}>
      {/* Conversation list */}
      <div className="w-72 flex-shrink-0 border-r border-slate-200 bg-white overflow-y-auto flex flex-col">
        <div className="px-4 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>
            Messages
          </h2>
          <div className="text-slate-400" style={{ fontSize: 12 }}>Pharmacy communications</div>
        </div>

        {messages.map(msg => {
          const c = contactTypeConfig[msg.contactType] || contactTypeConfig.system;
          const badge = statusBadge[msg.status];
          const isActive = selected.id === msg.id;
          return (
            <button
              key={msg.id}
              onClick={() => setSelected(msg)}
              className="w-full text-left px-4 py-3.5 border-b border-slate-50 border-l-4 transition-all"
              style={{
                borderLeftColor: c.border,
                background: isActive ? c.activeBg : 'white',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F8FAFC'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'white'; }}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${msg.contactColor}`}>
                  {msg.contactInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-slate-800 truncate" style={{ fontSize: 13 }}>
                      {msg.contact}
                    </span>
                    <span className="text-slate-400 flex-shrink-0" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
                      {msg.lastTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <span className="text-slate-500 truncate" style={{ fontSize: 11 }}>
                      {msg.lastMessage.substring(0, 42)}…
                    </span>
                    {msg.unread > 0 && (
                      <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 animate-pulse">
                        {msg.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-1.5 py-0.5 font-bold"
                  style={{ fontSize: 9, background: c.tagBg, color: c.tagText }}
                >
                  {c.tag}
                </span>
                {badge && (
                  <span className="rounded-full px-1.5 py-0.5 font-bold" style={{ fontSize: 9, background: badge.bg, color: badge.text }}>
                    {badge.label}
                  </span>
                )}
                <span className="text-slate-400 truncate" style={{ fontSize: 10 }}>{msg.specialty}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active conversation */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4 flex items-center gap-3 flex-shrink-0" style={{ background: cfg.headerBg }}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${selected.contactColor}`}>
            {selected.contactInitials}
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-900" style={{ fontSize: 15 }}>{selected.contact}</div>
            <div className="text-slate-500" style={{ fontSize: 12 }}>{selected.specialty}</div>
          </div>
          <div className="flex items-center gap-2">
            {selected.relatedRx && (
              <div
                className="font-mono text-xs px-3 py-1.5 rounded-lg font-semibold"
                style={{ background: '#CCFBF1', color: '#0F766E' }}
              >
                {selected.relatedRx}
              </div>
            )}
            {statusBadge[selected.status] && (
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: statusBadge[selected.status].bg, color: statusBadge[selected.status].text }}
              >
                {statusBadge[selected.status].label}
              </span>
            )}
          </div>
        </div>

        {/* Approval banner */}
        {showApprovalBanner && (
          <div className="mx-4 mt-3 flex-shrink-0">
            <div
              className="rounded-xl p-3 flex items-center gap-3"
              style={{ background: '#ECFDF5', border: '1px solid #6EE7B7' }}
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#059669' }} />
              <div className="flex-1" style={{ fontSize: 13 }}>
                <span className="font-semibold" style={{ color: '#065F46' }}>Dr. Ahmed approved substitution</span>
                <span style={{ color: '#047857' }}> — Parnia's Rx moved to dispense queue</span>
              </div>
              <button
                onClick={() => { setApprovalDismissed(true); onNavigate('dispense'); }}
                className="text-white text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors"
                style={{ background: '#059669' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#047857'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#059669'; }}
              >
                Dispense Now
              </button>
              <button
                onClick={() => setApprovalDismissed(true)}
                className="text-slate-400 hover:text-slate-600 ml-1 transition-colors"
                style={{ fontSize: 18, lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Thread */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {currentThread.map(msg =>
            threadBubble(
              msg as ThreadEntry,
              selected.contactColor,
              selected.contactInitials,
              msg.sender === 'pharmacy'
            )
          )}
        </div>

        {/* Input or read-only footer */}
        {canType ? (
          <div className="border-t border-slate-200 px-4 py-3 bg-white flex-shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={`Message ${selected.contact}...`}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-emerald-400 resize-none transition-colors"
                rows={2}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: 13 }}
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                style={{ background: '#059669' }}
                onMouseEnter={e => { if (newMessage.trim()) e.currentTarget.style.background = '#047857'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#059669'; }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t border-slate-200 px-4 py-3 flex-shrink-0" style={{ background: '#F8FAFC' }}>
            <div className="flex items-center justify-center gap-2 text-slate-400" style={{ fontSize: 12 }}>
              {selected.contactType === 'dha' ? (
                <><Shield className="w-3.5 h-3.5" /> DHA system messages are read-only</>
              ) : (
                <><Info className="w-3.5 h-3.5" /> System notifications are read-only</>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Context panel */}
      <div className="w-56 flex-shrink-0 border-l border-slate-200 bg-white p-4 hidden xl:flex xl:flex-col">
        <div className="text-slate-400 uppercase tracking-widest mb-3" style={{ fontSize: 9, fontFamily: 'DM Mono, monospace' }}>
          CONTACT INFO
        </div>

        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3 ${selected.contactColor}`}>
          {selected.contactInitials}
        </div>
        <div className="font-bold text-slate-800 mb-0.5" style={{ fontSize: 14 }}>{selected.contact}</div>
        <div className="text-slate-400 mb-3" style={{ fontSize: 11 }}>{selected.specialty}</div>

        <span
          className="rounded-full px-2 py-1 font-bold mb-4 self-start"
          style={{
            fontSize: 10,
            background: contactTypeConfig[selected.contactType]?.tagBg ?? '#F1F5F9',
            color: contactTypeConfig[selected.contactType]?.tagText ?? '#475569',
          }}
        >
          {contactTypeConfig[selected.contactType]?.tag ?? 'UNKNOWN'}
        </span>

        {selected.relatedRx && (
          <div
            className="rounded-xl p-3 mb-4"
            style={{ background: '#F0FDFA', border: '1px solid #99F6E4' }}
          >
            <div className="font-semibold mb-1" style={{ fontSize: 11, color: '#0F766E' }}>Related Prescription</div>
            <div className="font-mono mb-2" style={{ fontSize: 10, color: '#0F766E' }}>{selected.relatedRx}</div>
            <button
              onClick={() => onNavigate('dispense')}
              className="w-full text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
              style={{ background: '#0D9488', fontSize: 11 }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0F766E'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0D9488'; }}
            >
              View Prescription
            </button>
          </div>
        )}

        <div className="mt-auto">
          <div className="text-slate-400 uppercase tracking-widest mb-2" style={{ fontSize: 9, fontFamily: 'DM Mono, monospace' }}>
            STATUS
          </div>
          {statusBadge[selected.status] && (
            <span
              className="rounded-full px-2 py-1 font-bold"
              style={{
                fontSize: 11,
                background: statusBadge[selected.status].bg,
                color: statusBadge[selected.status].text,
              }}
            >
              {statusBadge[selected.status].label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyMessages;
