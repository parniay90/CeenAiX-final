import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bell, CheckCheck, Settings2, ChevronRight, X,
  ShoppingBag, MessageSquare, FlaskConical, Bot,
  Calendar, Pill, Shield, FileText, Scan, CheckCircle
} from 'lucide-react';
import {
  PatientNotification, PARNIA_NOTIFICATIONS, getNotifTypeConfig,
  formatNotifTime, groupNotificationsByDate, PatientNotifCategory
} from '../../data/patientNotifications';

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

const ICON_MAP: Record<string, React.ElementType> = {
  ShoppingBag, MessageSquare, FlaskConical, Bot,
  Calendar, Pill, Shield, FileText, Scan, CheckCircle, Bell,
};

const FILTER_PILLS: { key: PatientNotifCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'results', label: 'Results' },
  { key: 'messages', label: 'Messages' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'medications', label: 'Prescriptions' },
  { key: 'ai', label: 'AI' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'system', label: 'System' },
];

interface Props {
  notifications: PatientNotification[];
  onNotificationsChange: (notifs: PatientNotification[]) => void;
}

export default function NotificationBell({ notifications, onNotificationsChange }: Props) {
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<PatientNotifCategory | 'all'>('all');
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const [shakeBell, setShakeBell] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevUnreadRef = useRef(notifications.filter(n => !n.isRead).length);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (unreadCount > prevUnreadRef.current) {
      setShakeBell(true);
      setTimeout(() => setShakeBell(false), 600);
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const escHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', escHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', escHandler);
    };
  }, []);

  const markAllRead = () => {
    onNotificationsChange(notifications.map(n => ({ ...n, isRead: true })));
  };

  const markOneRead = useCallback((id: string) => {
    onNotificationsChange(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, [notifications, onNotificationsChange]);

  const dismiss = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDismissingId(id);
    setTimeout(() => {
      onNotificationsChange(notifications.filter(n => n.id !== id));
      setDismissingId(null);
    }, 200);
  }, [notifications, onNotificationsChange]);

  const handleItemClick = (notif: PatientNotification) => {
    markOneRead(notif.id);
    setTimeout(() => {
      setOpen(false);
      navigate(notif.actionRoute);
    }, 150);
  };

  const filtered = notifications.filter(n =>
    activeFilter === 'all' ? true : n.category === activeFilter
  );

  const getUnreadCountForFilter = (key: PatientNotifCategory | 'all') =>
    key === 'all'
      ? notifications.filter(n => !n.isRead).length
      : notifications.filter(n => !n.isRead && n.category === key).length;

  const groups = groupNotificationsByDate(filtered);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 ${
          open
            ? 'bg-teal-50 border border-teal-200'
            : 'hover:bg-slate-50 border border-transparent'
        }`}
        style={{ flexShrink: 0 }}
      >
        <Bell
          className={`w-5 h-5 transition-colors duration-150 ${
            open ? 'text-teal-600' : 'text-slate-600'
          } ${shakeBell ? 'animate-[bellShake_0.4s_ease]' : ''}`}
        />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white rounded-full flex items-center justify-center z-10"
            style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', fontWeight: 700, padding: '0 3px' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 z-50"
          style={{
            top: 'calc(100% + 8px)',
            width: 400,
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #E2E8F0',
            animation: 'dropdownIn 0.2s ease-out',
          }}
        >
          <div
            className="absolute"
            style={{
              top: -8,
              right: 12,
              width: 16,
              height: 8,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                background: 'white',
                border: '1px solid #E2E8F0',
                transform: 'rotate(45deg)',
                margin: '4px auto 0',
              }}
            />
          </div>

          <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-slate-100" style={{ minHeight: 52 }}>
            <div className="flex items-center gap-2">
              <Bell className="w-[18px] h-[18px] text-teal-600" />
              <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  className="px-2 py-0.5 rounded-lg"
                  style={{ background: '#CCFBF1', color: '#0F766E', fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 hover:underline"
                  style={{ color: '#0D9488', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => { navigate('/settings'); setOpen(false); }}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                title="Notification settings"
              >
                <Settings2 className="w-[18px] h-[18px] text-slate-400 hover:text-slate-700" />
              </button>
            </div>
          </div>

          <div
            className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-50 overflow-x-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            {FILTER_PILLS.map(pill => {
              const unread = getUnreadCountForFilter(pill.key);
              const isActive = activeFilter === pill.key;
              return (
                <button
                  key={pill.key}
                  onClick={() => setActiveFilter(pill.key)}
                  className="flex-shrink-0 transition-all duration-150"
                  style={{
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: isActive ? 700 : 400,
                    background: isActive ? '#0D9488' : '#F1F5F9',
                    color: isActive ? 'white' : '#64748B',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {pill.label}{unread > 0 ? ` (${unread})` : ''}
                </button>
              );
            })}
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 380, scrollbarWidth: 'thin' }}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 px-6">
                <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-7 h-7 text-teal-400" />
                </div>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, fontWeight: 700, color: '#334155' }}>
                  All caught up!
                </p>
                <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Inter, sans-serif', marginTop: 4 }}>
                  No new notifications
                </p>
                <button
                  onClick={() => { navigate('/my-health'); setOpen(false); }}
                  className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold"
                  style={{ background: '#F0FDFA', color: '#0D9488', fontFamily: 'Inter, sans-serif' }}
                >
                  Browse Health Records
                </button>
              </div>
            ) : (
              groups.map(group => (
                <div key={group.label}>
                  <div
                    className="sticky top-0 bg-white border-b border-slate-50 px-[18px] py-2"
                    style={{ zIndex: 1 }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', fontFamily: 'Inter, sans-serif', letterSpacing: 1, textTransform: 'uppercase' }}>
                      {group.label}
                    </span>
                  </div>
                  {group.items.map(notif => {
                    const cfg = getNotifTypeConfig(notif.type);
                    const Icon = ICON_MAP[cfg.icon] || Bell;
                    const isDismissing = dismissingId === notif.id;
                    return (
                      <DropdownItem
                        key={notif.id}
                        notif={notif}
                        Icon={Icon}
                        cfg={cfg}
                        isDismissing={isDismissing}
                        onDismiss={dismiss}
                        onClick={handleItemClick}
                      />
                    );
                  })}
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100" style={{ minHeight: 48 }}>
            <button
              onClick={() => { navigate('/notifications'); setOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-[18px] py-3 rounded-b-2xl hover:bg-teal-50 transition-colors duration-100"
            >
              <Bell className="w-3.5 h-3.5 text-teal-600" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0D9488', fontFamily: 'Inter, sans-serif' }}>
                See all notifications
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-teal-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  notif: PatientNotification;
  Icon: React.ElementType;
  cfg: { iconBg: string; iconColor: string };
  isDismissing: boolean;
  onDismiss: (e: React.MouseEvent, id: string) => void;
  onClick: (notif: PatientNotification) => void;
}

function DropdownItem({ notif, Icon, cfg, isDismissing, onDismiss, onClick }: DropdownItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(notif)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-pointer border-b border-slate-50 transition-all duration-200"
      style={{
        padding: '12px 18px',
        borderLeft: notif.isRead ? '3px solid transparent' : '3px solid #2DD4BF',
        background: notif.isRead ? 'white' : 'rgba(204,251,241,0.15)',
        opacity: isDismissing ? 0 : 1,
        transform: isDismissing ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'opacity 0.2s, transform 0.2s, background 0.1s',
      }}
    >
      <div className="flex items-start gap-2.5">
        <div className="relative flex-shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: cfg.iconBg }}
          >
            <Icon style={{ width: 18, height: 18, color: cfg.iconColor }} />
          </div>
          {!notif.isRead && (
            <div
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal-500"
              style={{ border: '1.5px solid white' }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <span
              className="truncate leading-snug"
              style={{
                fontSize: 13,
                fontFamily: 'Inter, sans-serif',
                fontWeight: notif.isRead ? 400 : 700,
                color: notif.isRead ? '#475569' : '#0F172A',
              }}
            >
              {notif.title}
            </span>
            <span
              className="flex-shrink-0"
              style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: '#94A3B8' }}
            >
              {formatNotifTime(notif.timestamp)}
            </span>
          </div>
          <p
            className="mt-0.5 line-clamp-2"
            style={{ fontSize: 12, color: '#64748B', fontFamily: 'Inter, sans-serif', lineHeight: 1.4 }}
          >
            {notif.body}
          </p>
          {notif.badge && (
            <div className="mt-1.5 flex items-center gap-1">
              <BadgePill badge={notif.badge} />
            </div>
          )}
        </div>

        <div className="flex-shrink-0 flex items-center" style={{ width: 20 }}>
          {hovered ? (
            <button
              onClick={(e) => onDismiss(e, notif.id)}
              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"
            >
              <X style={{ width: 12, height: 12, color: '#94A3B8' }} />
            </button>
          ) : !notif.isRead ? (
            <div className="w-2 h-2 rounded-full bg-teal-500" />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function BadgePill({ badge }: { badge: PatientNotification['badge'] }) {
  if (!badge) return null;
  const colors: Record<string, { bg: string; text: string }> = {
    amber: { bg: '#FEF3C7', text: '#B45309' },
    violet: { bg: '#EDE9FE', text: '#7C3AED' },
    blue: { bg: '#DBEAFE', text: '#1E40AF' },
    green: { bg: '#D1FAE5', text: '#065F46' },
    teal: { bg: '#CCFBF1', text: '#0F766E' },
  };
  const c = colors[badge.color] || colors.amber;
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        fontSize: 9,
        fontFamily: 'DM Mono, monospace',
        fontWeight: 700,
        padding: '2px 6px',
        borderRadius: 6,
        animation: badge.color === 'violet' ? 'badgeGlow 2s ease-in-out infinite' : undefined,
      }}
    >
      {badge.text}
    </span>
  );
}
