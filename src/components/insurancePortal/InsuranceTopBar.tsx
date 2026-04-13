import React, { useState } from 'react';
import { AlertOctagon, Download, Bell, ChevronDown, X } from 'lucide-react';

interface Props {
  onReviewOverdue: () => void;
}

const InsuranceTopBar: React.FC<Props> = ({ onReviewOverdue }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);

  const notifications = [
    { id: 1, text: 'PA-00912 SLA breached — PCI approval overdue', time: '2 min ago', type: 'red' as const },
    { id: 2, text: 'New fraud alert: Dr. Khalid Ibrahim (HIGH)', time: '18 min ago', type: 'red' as const },
    { id: 3, text: '5 new pre-auth requests submitted', time: '34 min ago', type: 'amber' as const },
    { id: 4, text: 'AI auto-approved 31 claims today', time: '1h ago', type: 'green' as const },
  ];

  return (
    <div
      className="flex items-center px-5 flex-shrink-0 sticky top-0 z-30"
      style={{ height: 64, background: '#fff', borderBottom: '1px solid #E2E8F0' }}
    >
      <div className="flex items-center gap-3 min-w-0" style={{ flex: '0 0 280px' }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: '#1E3A5F' }}
        >
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>D</span>
        </div>
        <div className="min-w-0">
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 17, color: '#1E293B', lineHeight: 1.2 }}>
            Insurance Dashboard
          </div>
          <div style={{ fontSize: 13, color: '#94A3B8' }}>
            Daman National Health Insurance · 7 April 2026
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <button
          onClick={onReviewOverdue}
          className="flex items-center gap-2.5 rounded-xl px-4 py-2 transition-all"
          style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.25)',
            maxWidth: 560,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
        >
          <AlertOctagon style={{ width: 15, height: 15, color: '#DC2626', flexShrink: 0 }} className="animate-pulse" />
          <span style={{ fontSize: 12, color: '#DC2626', fontWeight: 600 }}>
            1 pre-auth SLA OVERDUE
          </span>
          <span style={{ fontSize: 12, color: '#7F1D1D' }}>
            — PA-20260407-00912 · Coronary Angioplasty · Mohammed Ibrahim · 17 min overdue
          </span>
          <span
            className="rounded-lg px-2.5 py-1 flex-shrink-0"
            style={{ fontSize: 11, background: '#DC2626', color: '#fff', fontWeight: 600 }}
          >
            Review Now
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 transition-colors"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.14)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span style={{ fontSize: 12, color: '#DC2626', fontWeight: 600 }}>2 Fraud Alerts</span>
        </button>

        <button
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 transition-colors"
          style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; }}
        >
          <Download style={{ width: 14, height: 14, color: '#64748B' }} />
          <span style={{ fontSize: 12, color: '#64748B' }}>Export</span>
        </button>

        <div className="relative">
          <button
            onClick={() => { setShowNotifications(n => !n); setShowAvatar(false); }}
            className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-colors"
            style={{ background: '#F1F5F9' }}
          >
            <Bell style={{ width: 16, height: 16, color: '#475569' }} />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
          {showNotifications && (
            <div
              className="absolute right-0 top-11 rounded-2xl shadow-xl overflow-hidden z-50"
              style={{ width: 320, background: '#fff', border: '1px solid #E2E8F0' }}
            >
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>Notifications</span>
                <button onClick={() => setShowNotifications(false)}>
                  <X style={{ width: 14, height: 14, color: '#94A3B8' }} />
                </button>
              </div>
              {notifications.map(n => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3" style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                    style={{ background: n.type === 'red' ? '#EF4444' : n.type === 'amber' ? '#F59E0B' : '#10B981' }}
                  />
                  <div>
                    <div style={{ fontSize: 12, color: '#334155' }}>{n.text}</div>
                    <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setShowAvatar(a => !a); setShowNotifications(false); }}
            className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors"
            style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: '#1E3A5F' }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>MK</span>
            </div>
            <ChevronDown style={{ width: 12, height: 12, color: '#94A3B8' }} />
          </button>
          {showAvatar && (
            <div
              className="absolute right-0 top-11 rounded-2xl shadow-xl overflow-hidden z-50"
              style={{ width: 200, background: '#fff', border: '1px solid #E2E8F0' }}
            >
              <div className="px-4 py-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>Mariam Al Khateeb</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Senior Claims Officer</div>
              </div>
              {['Profile', 'Settings', 'Sign Out'].map(item => (
                <button key={item} className="flex w-full px-4 py-2.5 text-left transition-colors"
                  style={{ fontSize: 13, color: item === 'Sign Out' ? '#EF4444' : '#475569' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  onClick={() => { if (item === 'Sign Out') { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); } }}>
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsuranceTopBar;
