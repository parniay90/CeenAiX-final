import React, { useState } from 'react';
import { AlertOctagon, Download, Bell, ChevronDown, X, Search } from 'lucide-react';

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

  const typeColor = { red: '#EF4444', amber: '#F59E0B', green: '#10B981' };

  return (
    <div
      className="flex items-center px-5 flex-shrink-0 sticky top-0 z-30"
      style={{ height: 60, background: '#ffffff', borderBottom: '1px solid #E2E8F0' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 flex-shrink-0" style={{ width: 240 }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0D9488 100%)' }}
        >
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>C</span>
        </div>
        <div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 15, color: '#0F172A', lineHeight: 1.2 }}>
            Insurance Portal
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1 }}>Daman National Health Insurance</div>
        </div>
      </div>

      {/* SLA alert in center */}
      <div className="flex-1 flex items-center justify-center px-4">
        <button
          onClick={onReviewOverdue}
          className="flex items-center gap-2.5 rounded-lg px-3.5 py-2 transition-all"
          style={{
            background: '#FFF5F5',
            border: '1px solid #FCA5A5',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#FFF5F5'; }}
        >
          <AlertOctagon style={{ width: 13, height: 13, color: '#DC2626', flexShrink: 0 }} className="animate-pulse" />
          <span style={{ fontSize: 12, color: '#991B1B', fontWeight: 700 }}>SLA BREACH:</span>
          <span style={{ fontSize: 12, color: '#DC2626' }}>PA-20260407-00912 · Coronary Angioplasty · Mohammed Ibrahim</span>
          <span className="rounded px-2 py-0.5 flex-shrink-0" style={{ fontSize: 11, background: '#DC2626', color: '#fff', fontWeight: 700 }}>
            Review
          </span>
        </button>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search */}
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}
        >
          <Search style={{ width: 14, height: 14, color: '#64748B' }} />
        </button>

        {/* Export */}
        <button
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
          style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 12, color: '#475569' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}
        >
          <Download style={{ width: 13, height: 13 }} />
          Export
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(n => !n); setShowAvatar(false); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center relative transition-colors"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}
          >
            <Bell style={{ width: 14, height: 14, color: '#475569' }} />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: '#EF4444' }} />
          </button>
          {showNotifications && (
            <div
              className="absolute right-0 top-10 rounded-xl shadow-2xl overflow-hidden z-50"
              style={{ width: 320, background: '#fff', border: '1px solid #E2E8F0' }}
            >
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Notifications</span>
                <button onClick={() => setShowNotifications(false)} className="rounded-md p-1 hover:bg-slate-100 transition-colors">
                  <X style={{ width: 13, height: 13, color: '#94A3B8' }} />
                </button>
              </div>
              {notifications.map(n => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer" style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: typeColor[n.type] }} />
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5" style={{ borderTop: '1px solid #F1F5F9' }}>
                <button className="text-center w-full" style={{ fontSize: 12, color: '#2563EB', fontWeight: 600 }}>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="relative">
          <button
            onClick={() => { setShowAvatar(a => !a); setShowNotifications(false); }}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: '#1E3A5F' }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>MK</span>
            </div>
            <span style={{ fontSize: 12, color: '#334155', fontWeight: 500 }}>Mariam</span>
            <ChevronDown style={{ width: 11, height: 11, color: '#94A3B8' }} />
          </button>
          {showAvatar && (
            <div
              className="absolute right-0 top-10 rounded-xl shadow-2xl overflow-hidden z-50"
              style={{ width: 200, background: '#fff', border: '1px solid #E2E8F0' }}
            >
              <div className="px-4 py-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Mariam Al Khateeb</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Senior Claims Officer</div>
              </div>
              {[
                { label: 'Profile', color: '#475569' },
                { label: 'Settings', color: '#475569' },
                { label: 'Sign Out', color: '#EF4444' },
              ].map(item => (
                <button
                  key={item.label}
                  className="flex w-full px-4 py-2.5 text-left transition-colors hover:bg-slate-50"
                  style={{ fontSize: 13, color: item.color }}
                  onClick={() => {
                    if (item.label === 'Sign Out') {
                      window.history.pushState({}, '', '/');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                >
                  {item.label}
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
