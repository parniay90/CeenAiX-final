import { useState, useEffect, useCallback } from 'react';
import {
  Bell, CheckCheck, Settings, CheckCircle,
  Calendar, FlaskConical, Pill, MessageSquare, Bot, Shield, FileText, Settings2,
  ChevronDown, SlidersHorizontal, X
} from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';
import NotifCard from '../components/notifications/NotifCard';
import {
  PatientNotification, PARNIA_NOTIFICATIONS, PatientNotifCategory,
  groupNotificationsByDate
} from '../data/patientNotifications';

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

type ReadFilter = 'all' | 'unread' | 'read';
type DateFilter = 'today' | 'week' | 'month' | 'all';
type SortOrder = 'newest' | 'oldest' | 'type' | 'unread';

const SIDEBAR_CATEGORIES: { key: PatientNotifCategory | 'all'; label: string; Icon: React.ElementType; iconBg: string; iconColor: string }[] = [
  { key: 'all', label: 'All Notifications', Icon: Bell, iconBg: '#F8FAFC', iconColor: '#64748B' },
  { key: 'appointments', label: 'Appointments', Icon: Calendar, iconBg: '#D1FAE5', iconColor: '#059669' },
  { key: 'results', label: 'Lab & Imaging', Icon: FlaskConical, iconBg: '#DBEAFE', iconColor: '#1D4ED8' },
  { key: 'medications', label: 'Medications', Icon: Pill, iconBg: '#EDE9FE', iconColor: '#7C3AED' },
  { key: 'messages', label: 'Messages', Icon: MessageSquare, iconBg: '#CCFBF1', iconColor: '#0D9488' },
  { key: 'ai', label: 'AI Insights', Icon: Bot, iconBg: '#EDE9FE', iconColor: '#7C3AED' },
  { key: 'insurance', label: 'Insurance', Icon: Shield, iconBg: '#DBEAFE', iconColor: '#1E3A5F' },
  { key: 'records', label: 'Health Records', Icon: FileText, iconBg: '#DBEAFE', iconColor: '#1D4ED8' },
  { key: 'system', label: 'System', Icon: Settings2, iconBg: '#F8FAFC', iconColor: '#64748B' },
];

function ToastMsg({ message, onUndo, onClose }: { message: string; onUndo?: () => void; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl z-50"
      style={{ background: '#1E293B', color: 'white', fontFamily: 'Inter, sans-serif', fontSize: 13, animation: 'toastIn 0.3s ease' }}>
      <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
      <span>{message}</span>
      {onUndo && <button onClick={onUndo} className="ml-2 text-teal-400 font-bold hover:text-teal-300 text-sm">Undo</button>}
      <button onClick={onClose} className="ml-1 opacity-50 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}

const SORT_LABELS: Record<SortOrder, string> = {
  newest: 'Newest First',
  oldest: 'Oldest First',
  type: 'By Type',
  unread: 'Unread First',
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<PatientNotification[]>(PARNIA_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState<PatientNotifCategory | 'all'>('all');
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState<{ msg: string; onUndo?: () => void } | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 600); return () => clearTimeout(t); }, []);

  const showToast = (msg: string, onUndo?: () => void) => setToast({ msg, onUndo });
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filterByDate = (n: PatientNotification) => {
    if (dateFilter === 'all') return true;
    const now = new Date('2026-04-07T14:07:00');
    const diff = now.getTime() - n.timestamp.getTime();
    if (dateFilter === 'today') return diff < 86400000;
    if (dateFilter === 'week') return diff < 86400000 * 7;
    if (dateFilter === 'month') return diff < 86400000 * 30;
    return true;
  };

  const filtered = notifications
    .filter(n => activeCategory === 'all' ? true : n.category === activeCategory)
    .filter(n => readFilter === 'all' ? true : readFilter === 'unread' ? !n.isRead : n.isRead)
    .filter(filterByDate)
    .sort((a, b) => {
      if (sortOrder === 'newest') return b.timestamp.getTime() - a.timestamp.getTime();
      if (sortOrder === 'oldest') return a.timestamp.getTime() - b.timestamp.getTime();
      if (sortOrder === 'type') return a.type.localeCompare(b.type);
      if (!a.isRead && b.isRead) return -1;
      if (a.isRead && !b.isRead) return 1;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

  const groups = groupNotificationsByDate(filtered);
  const getUnreadFor = (key: PatientNotifCategory | 'all') => key === 'all' ? notifications.filter(n => !n.isRead).length : notifications.filter(n => !n.isRead && n.category === key).length;
  const getTotalFor = (key: PatientNotifCategory | 'all') => key === 'all' ? notifications.length : notifications.filter(n => n.category === key).length;

  const markRead = useCallback((id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n)), []);
  const markUnread = useCallback((id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: false } : n)), []);
  const markAllRead = () => { setNotifications(prev => prev.map(n => ({ ...n, isRead: true }))); showToast('All notifications marked as read ✅'); };

  const dismiss = useCallback((id: string) => {
    const dismissed = notifications.find(n => n.id === id);
    setDismissingIds(prev => new Set([...prev, id]));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
      setDismissingIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    }, 250);
    showToast('Notification dismissed', () => { if (dismissed) setNotifications(prev => [dismissed, ...prev]); });
  }, [notifications]);

  const snooze = useCallback((id: string, until: Date) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, snoozedUntil: until } : n));
    showToast(`⏰ Snoozed until ${until.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`);
  }, []);

  const handleView = useCallback((notif: PatientNotification) => markRead(notif.id), [markRead]);
  const toggleSelect = useCallback((id: string) => setSelectedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; }), []);
  const selectAll = () => setSelectedIds(selectedIds.size === filtered.length ? new Set() : new Set(filtered.map(n => n.id)));
  const bulkMarkRead = () => { setNotifications(prev => prev.map(n => selectedIds.has(n.id) ? { ...n, isRead: true } : n)); setSelectedIds(new Set()); showToast('Selected notifications marked as read ✅'); };
  const bulkDismiss = () => { const ids = [...selectedIds]; setNotifications(prev => prev.filter(n => !ids.includes(n.id))); setSelectedIds(new Set()); showToast(`${ids.length} notifications dismissed`); };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#F8FAFC' }}>
      <PatientTopNav patientName="Parnia Yazdkhasti" />
      <div className="flex flex-1 overflow-hidden">
        <PatientSidebar currentPage="notifications" />
        <div className="flex flex-1 overflow-hidden">

          <div className="flex-shrink-0 flex flex-col border-r border-slate-100 overflow-y-auto" style={{ width: 240, background: 'white' }}>
            <div className="px-4 pt-5 pb-2">
              <span style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>
                Filter by Type
              </span>
            </div>
            {SIDEBAR_CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.key;
              const unread = getUnreadFor(cat.key);
              const total = getTotalFor(cat.key);
              const CatIcon = cat.Icon;
              return (
                <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                  className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl transition-all duration-100"
                  style={{ borderLeft: isActive ? '3px solid #0D9488' : '3px solid transparent', background: isActive ? '#F0FDFA' : 'transparent' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F8FAFC'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: cat.iconBg }}>
                    <CatIcon style={{ width: 16, height: 16, color: cat.iconColor }} />
                  </div>
                  <span className="flex-1 text-left" style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: isActive ? '#0D9488' : '#334155', fontWeight: isActive ? 600 : 400 }}>
                    {cat.label}
                  </span>
                  <div className="flex items-center gap-1">
                    {unread > 0 && (
                      <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', fontWeight: 700, background: '#CCFBF1', color: '#0F766E', padding: '1px 6px', borderRadius: 6 }}>{unread}</span>
                    )}
                    <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', background: '#F1F5F9', color: '#64748B', padding: '1px 6px', borderRadius: 6 }}>{total}</span>
                  </div>
                </button>
              );
            })}

            <div className="mx-4 my-3 border-t border-slate-100" />
            <div className="px-4 pb-2"><span style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>Filter by Status</span></div>
            {(['all', 'unread', 'read'] as ReadFilter[]).map(rf => (
              <button key={rf} onClick={() => setReadFilter(rf)} className="flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg transition-colors" style={{ background: readFilter === rf ? '#F0FDFA' : 'transparent' }}>
                <div className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: readFilter === rf ? '#0D9488' : '#CBD5E1' }}>
                  {readFilter === rf && <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
                </div>
                <span style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', color: '#475569' }}>{rf === 'all' ? 'All' : rf === 'unread' ? 'Unread only' : 'Read only'}</span>
              </button>
            ))}

            <div className="mx-4 my-3 border-t border-slate-100" />
            <div className="px-4 pb-2"><span style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>Filter by Date</span></div>
            {([{ key: 'today', label: 'Today' }, { key: 'week', label: 'This Week' }, { key: 'month', label: 'This Month' }, { key: 'all', label: 'All time' }] as { key: DateFilter; label: string }[]).map(df => (
              <button key={df.key} onClick={() => setDateFilter(df.key)} className="flex items-center gap-2 mx-2 px-3 py-1.5 rounded-lg transition-colors text-left"
                style={{ background: dateFilter === df.key ? '#F0FDFA' : 'transparent', fontSize: 12, fontFamily: 'Inter, sans-serif', color: dateFilter === df.key ? '#0D9488' : '#64748B', fontWeight: dateFilter === df.key ? 600 : 400 }}>
                {df.label}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22, fontWeight: 700, color: '#0F172A' }}>Notifications</h1>
                    <p style={{ fontSize: 13, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'} · {notifications.length} total</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={markAllRead} disabled={unreadCount === 0}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all"
                    style={{ background: unreadCount > 0 ? '#F0FDFA' : '#F8FAFC', color: unreadCount > 0 ? '#0F766E' : '#94A3B8', fontSize: 13, fontFamily: 'Inter, sans-serif', cursor: unreadCount === 0 ? 'not-allowed' : 'pointer' }}>
                    <CheckCheck className="w-4 h-4" />Mark All Read
                  </button>
                  <button onClick={() => setShowSettings(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-colors hover:bg-slate-100"
                    style={{ background: '#F1F5F9', color: '#475569', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
                    <Settings className="w-4 h-4" />Settings
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
              <span style={{ fontSize: 13, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>Showing {filtered.length} notification{filtered.length !== 1 ? 's' : ''}</span>
              <div className="flex items-center gap-2">
                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span style={{ fontSize: 12, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{selectedIds.size} selected</span>
                    <button onClick={bulkMarkRead} className="px-3 py-1.5 rounded-lg font-semibold" style={{ background: '#F0FDFA', color: '#0F766E', fontSize: 11, fontFamily: 'Inter, sans-serif' }}>✓ Mark Read</button>
                    <button onClick={bulkDismiss} className="px-3 py-1.5 rounded-lg font-semibold" style={{ background: '#F1F5F9', color: '#475569', fontSize: 11, fontFamily: 'Inter, sans-serif' }}>✕ Dismiss</button>
                  </div>
                )}
                <div className="relative">
                  <button onClick={() => setShowSortMenu(v => !v)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                    style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', color: '#475569' }}>
                    <SlidersHorizontal className="w-3.5 h-3.5" />{SORT_LABELS[sortOrder]}<ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {showSortMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                      <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50" style={{ width: 160 }}>
                        {(Object.keys(SORT_LABELS) as SortOrder[]).map(s => (
                          <button key={s} onClick={() => { setSortOrder(s); setShowSortMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                            style={{ fontFamily: 'Inter, sans-serif', color: sortOrder === s ? '#0D9488' : '#475569', fontWeight: sortOrder === s ? 600 : 400 }}>
                            {SORT_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <button onClick={selectAll} className="flex items-center gap-1.5 px-2 py-1.5" style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>
                  <div className="w-4 h-4 rounded border-2 flex items-center justify-center"
                    style={{ borderColor: selectedIds.size === filtered.length && filtered.length > 0 ? '#0D9488' : '#CBD5E1', background: selectedIds.size === filtered.length && filtered.length > 0 ? '#0D9488' : 'white' }}>
                    {selectedIds.size === filtered.length && filtered.length > 0 && <CheckCircle style={{ width: 10, height: 10, color: 'white' }} />}
                  </div>
                  Select All
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <ShimmerList />
              ) : filtered.length === 0 ? (
                <EmptyState onReset={() => { setActiveCategory('all'); setReadFilter('all'); setDateFilter('all'); }} />
              ) : (
                <>
                  {groups.map(group => (
                    <div key={group.label} className="mb-6">
                      <div className="sticky top-0 py-2 mb-3 z-10" style={{ background: '#F8FAFC' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', fontFamily: 'Inter, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '2px solid #E2E8F0', paddingBottom: 8, display: 'block' }}>
                          {group.label}
                        </span>
                      </div>
                      {group.items.map(notif => (
                        <NotifCard
                          key={notif.id}
                          notif={notif}
                          selected={selectedIds.has(notif.id)}
                          onToggleSelect={toggleSelect}
                          onMarkRead={markRead}
                          onMarkUnread={markUnread}
                          onDismiss={dismiss}
                          onSnooze={snooze}
                          onView={handleView}
                          dismissing={dismissingIds.has(notif.id)}
                        />
                      ))}
                    </div>
                  ))}
                  <NotificationPreferencesCard />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSettings && (
        <NotificationSettingsModal onClose={() => setShowSettings(false)} onSave={() => { setShowSettings(false); showToast('Notification preferences saved ✅'); }} />
      )}

      {toast && <ToastMsg message={toast.msg} onUndo={toast.onUndo} onClose={() => setToast(null)} />}

      <style>{`
        @keyframes dropdownIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes toastIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bellShake { 0%,100%{transform:rotate(0)} 15%{transform:rotate(-15deg)} 30%{transform:rotate(15deg)} 45%{transform:rotate(-10deg)} 60%{transform:rotate(10deg)} 75%{transform:rotate(-5deg)} 90%{transform:rotate(5deg)} }
        @keyframes badgeGlow { 0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0.4)} 50%{box-shadow:0 0 8px 4px rgba(124,58,237,0.2)} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
      `}</style>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mb-4">
        <CheckCircle className="w-10 h-10 text-teal-400" />
      </div>
      <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22, fontWeight: 700, color: '#1E293B' }}>You're all caught up!</h3>
      <p style={{ fontSize: 14, color: '#94A3B8', fontFamily: 'Inter, sans-serif', marginTop: 6 }}>No notifications to show for this filter.</p>
      <div className="flex gap-2 mt-6">
        <button onClick={onReset} className="px-5 py-2.5 rounded-xl font-semibold" style={{ background: '#F0FDFA', color: '#0F766E', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>Show All Notifications</button>
        <button onClick={() => navigate('/my-health')} className="px-5 py-2.5 rounded-xl font-semibold" style={{ background: '#F1F5F9', color: '#475569', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>Browse Health Records</button>
      </div>
    </div>
  );
}

function ShimmerCard({ delay }: { delay: number }) {
  return (
    <div className="bg-white mb-2 p-5 rounded-2xl" style={{ border: '1px solid #F1F5F9', animationDelay: `${delay}ms` }}>
      <div className="flex gap-4">
        <div style={{ width: 44, height: 44, borderRadius: 16, background: '#E2E8F0', flexShrink: 0 }} />
        <div className="flex-1 space-y-2.5">
          {['60%', '95%', '80%', '40%'].map((w, i) => (
            <div key={i} style={{ height: 12, width: w, borderRadius: 6, backgroundImage: 'linear-gradient(90deg,#E2E8F0 0%,#F1F5F9 50%,#E2E8F0 100%)', backgroundSize: '800px 100%', animation: 'shimmer 1.5s infinite linear' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ShimmerList() {
  return <div>{[0, 40, 80, 120, 160].map(d => <ShimmerCard key={d} delay={d} />)}</div>;
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className="w-10 h-6 rounded-full transition-all duration-200 relative flex-shrink-0" style={{ background: on ? '#0D9488' : '#CBD5E1' }}>
      <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200" style={{ left: on ? '18px' : '2px' }} />
    </button>
  );
}

function NotificationPreferencesCard() {
  const [channels, setChannels] = useState([
    { label: 'In-App Notifications', desc: 'Always shown in the notification panel', on: true, locked: true },
    { label: 'Push Notifications', desc: 'Sent to your phone for important updates', on: true, locked: false },
    { label: 'SMS Alerts', desc: 'For appointment reminders and urgent alerts', on: true, locked: false },
    { label: 'Email Digest', desc: 'Weekly summary to parnia.yazdkhasti@email.com', on: true, locked: false },
    { label: 'WhatsApp', desc: 'Enable WhatsApp notifications', on: false, locked: false },
  ]);
  const [types, setTypes] = useState([
    { label: 'Appointment reminders', on: true },
    { label: 'Lab results ready', on: true },
    { label: 'Prescription updates', on: true },
    { label: 'Doctor messages', on: true },
    { label: 'AI health insights', on: true },
    { label: 'Insurance claim updates', on: true },
    { label: 'Health record updates', on: true },
    { label: 'Medication refill reminders', on: true },
    { label: 'Platform updates', on: false },
  ]);

  return (
    <div className="mt-6 bg-white rounded-2xl p-6" style={{ border: '1px solid #F1F5F9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center">
          <Bell className="w-4 h-4 text-teal-600" />
        </div>
        <div>
          <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Notification Preferences</h3>
          <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>Manage how and when you receive notifications</p>
        </div>
      </div>

      <p style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Delivery Channels</p>
      {channels.map((ch, i) => (
        <div key={i} className="flex items-center justify-between py-3.5 border-b border-slate-50 last:border-0">
          <div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>{ch.label}</span>
              {ch.locked && <span style={{ fontSize: 9, background: '#F1F5F9', color: '#64748B', padding: '1px 6px', borderRadius: 4 }}>Required</span>}
            </div>
            <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>{ch.desc}</p>
          </div>
          <Toggle on={ch.on} onChange={v => !ch.locked && setChannels(prev => prev.map((c, j) => j === i ? { ...c, on: v } : c))} />
        </div>
      ))}

      <p style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 20, marginBottom: 8 }}>Which Notifications to Receive</p>
      <div className="grid grid-cols-2 gap-1">
        {types.map((tp, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-50">
            <span style={{ fontSize: 13, color: '#334155', fontFamily: 'Inter, sans-serif' }}>{tp.label}</span>
            <Toggle on={tp.on} onChange={v => setTypes(prev => prev.map((t, j) => j === i ? { ...t, on: v } : t))} />
          </div>
        ))}
      </div>

      <button className="w-full mt-5 py-3 rounded-xl font-bold text-white transition-all hover:brightness-105" style={{ background: '#0D9488', fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Save Preferences
      </button>
    </div>
  );
}

function NotificationSettingsModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full overflow-y-auto z-50" style={{ width: 460, background: 'white', boxShadow: '-8px 0 40px rgba(0,0,0,0.12)' }}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-600" />
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, fontWeight: 700 }}>Notification Settings</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <div className="p-6">
          <NotificationPreferencesCard />
          <div className="flex gap-2 mt-4">
            <button onClick={onSave} className="flex-1 py-3 rounded-xl font-bold text-white" style={{ background: '#0D9488', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Save & Close</button>
            <button onClick={onClose} className="px-4 py-3 rounded-xl font-semibold" style={{ background: '#F1F5F9', color: '#475569', fontFamily: 'Inter, sans-serif' }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
