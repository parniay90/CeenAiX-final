import { useState } from 'react';
import {
  Bell, ShoppingBag, MessageSquare, FlaskConical, Bot,
  Calendar, Pill, Shield, FileText, Scan, CheckCircle,
  X, Clock, Mail, MailOpen, MoreVertical, Check
} from 'lucide-react';
import { PatientNotification, getNotifTypeConfig, formatNotifTime } from '../../data/patientNotifications';

const ICON_MAP: Record<string, React.ElementType> = {
  ShoppingBag, MessageSquare, FlaskConical, Bot,
  Calendar, Pill, Shield, FileText, Scan, CheckCircle, Bell,
};

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

interface Props {
  notif: PatientNotification;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onMarkRead: (id: string) => void;
  onMarkUnread: (id: string) => void;
  onDismiss: (id: string) => void;
  onSnooze: (id: string, until: Date) => void;
  onView: (notif: PatientNotification) => void;
  dismissing: boolean;
}

const ACTION_CONFIG: Record<string, { bg: string; text: string }> = {
  'lab-result': { bg: '#EFF6FF', text: '#1E40AF' },
  'imaging-report': { bg: '#EFF6FF', text: '#1E40AF' },
  'appointment-confirmed': { bg: '#ECFDF5', text: '#065F46' },
  'appointment-reminder': { bg: '#ECFDF5', text: '#065F46' },
  'appointment-summary': { bg: '#ECFDF5', text: '#065F46' },
  'message': { bg: '#F0FDFA', text: '#0F766E' },
  'prescription-issued': { bg: '#F5F3FF', text: '#4C1D95' },
  'prescription-ready': { bg: '#FEF3C7', text: '#92400E' },
  'medication-refill': { bg: '#F5F3FF', text: '#4C1D95' },
  'ai-insight': { bg: '#F5F3FF', text: '#4C1D95' },
  'insurance-claim': { bg: '#EFF6FF', text: '#1E40AF' },
  'insurance-renewal': { bg: '#EFF6FF', text: '#1E40AF' },
  'health-record': { bg: '#EFF6FF', text: '#1E40AF' },
};

const SECONDARY_ACTION_CONFIG: Record<string, { bg: string; text: string }> = {
  'prescription-ready': { bg: '#F1F5F9', text: '#475569' },
  'lab-result': { bg: '#F5F3FF', text: '#4C1D95' },
  'appointment-confirmed': { bg: '#F1F5F9', text: '#475569' },
};

const TYPE_BADGE: Record<string, string> = {
  'lab-result': 'Lab Result',
  'imaging-report': 'Imaging Report',
  'appointment-confirmed': 'Appointment',
  'appointment-reminder': 'Appointment',
  'appointment-summary': 'Visit Summary',
  'message': 'Message',
  'prescription-issued': 'Prescription',
  'prescription-ready': 'Prescription',
  'medication-refill': 'Medication',
  'ai-insight': 'AI Insight',
  'insurance-claim': 'Insurance',
  'insurance-renewal': 'Insurance',
  'health-record': 'Health Record',
};

const TYPE_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  'lab-result': { bg: '#DBEAFE', text: '#1E40AF' },
  'imaging-report': { bg: '#DBEAFE', text: '#1E40AF' },
  'appointment-confirmed': { bg: '#D1FAE5', text: '#065F46' },
  'appointment-reminder': { bg: '#D1FAE5', text: '#065F46' },
  'appointment-summary': { bg: '#D1FAE5', text: '#065F46' },
  'message': { bg: '#CCFBF1', text: '#134E4A' },
  'prescription-issued': { bg: '#EDE9FE', text: '#4C1D95' },
  'prescription-ready': { bg: '#FEF3C7', text: '#92400E' },
  'medication-refill': { bg: '#EDE9FE', text: '#4C1D95' },
  'ai-insight': { bg: '#EDE9FE', text: '#4C1D95' },
  'insurance-claim': { bg: '#DBEAFE', text: '#1E40AF' },
  'insurance-renewal': { bg: '#DBEAFE', text: '#1E40AF' },
  'health-record': { bg: '#DBEAFE', text: '#1E40AF' },
};

export default function NotifCard({
  notif, selected, onToggleSelect, onMarkRead, onMarkUnread,
  onDismiss, onSnooze, onView, dismissing
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSnooze, setShowSnooze] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const cfg = getNotifTypeConfig(notif.type);
  const Icon = ICON_MAP[cfg.icon] || Bell;
  const actionCfg = ACTION_CONFIG[notif.type] || { bg: '#F0FDFA', text: '#0F766E' };
  const secondaryCfg = notif.secondaryActionLabel
    ? (SECONDARY_ACTION_CONFIG[notif.type] || { bg: '#F1F5F9', text: '#475569' })
    : null;
  const typeBadge = TYPE_BADGE[notif.type];
  const typeBadgeColor = TYPE_BADGE_COLORS[notif.type] || { bg: '#F1F5F9', text: '#475569' };

  const handleAction = () => {
    onView(notif);
    navigate(notif.actionRoute);
  };

  const handleSecondaryAction = () => {
    if (notif.secondaryActionRoute) {
      onMarkRead(notif.id);
      navigate(notif.secondaryActionRoute);
    }
  };

  const handleSnooze1h = () => {
    const until = new Date('2026-04-07T15:07:00');
    onSnooze(notif.id, until);
    setShowSnooze(false);
  };

  const handleSnoozeTomorrow = () => {
    const until = new Date('2026-04-08T09:00:00');
    onSnooze(notif.id, until);
    setShowSnooze(false);
  };

  const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
    amber: { bg: '#FEF3C7', text: '#B45309' },
    violet: { bg: '#EDE9FE', text: '#7C3AED' },
    blue: { bg: '#DBEAFE', text: '#1E40AF' },
    green: { bg: '#D1FAE5', text: '#065F46' },
    teal: { bg: '#CCFBF1', text: '#0F766E' },
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative bg-white mb-2 cursor-pointer transition-all duration-150"
      style={{
        borderRadius: 14,
        border: notif.isRead ? '1px solid #F8FAFC' : '1px solid #CCFBF1',
        borderLeft: notif.isRead ? '4px solid transparent' : '4px solid #2DD4BF',
        background: notif.isRead ? 'white' : 'rgba(204,251,241,0.12)',
        boxShadow: hovered
          ? '0 4px 20px rgba(0,0,0,0.08)'
          : '0 1px 4px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        opacity: dismissing ? 0 : 1,
        transition: 'all 0.15s ease, opacity 0.2s ease',
        overflow: 'hidden',
      }}
    >
      <div className="flex items-start gap-3.5 p-[18px] pb-3">
        <div
          className={`flex-shrink-0 mt-0.5 transition-opacity duration-100 ${hovered || selected ? 'opacity-100' : 'opacity-0'}`}
          onClick={(e) => { e.stopPropagation(); onToggleSelect(notif.id); }}
        >
          <div
            className="w-5 h-5 rounded flex items-center justify-center border-2 transition-colors"
            style={{
              borderColor: selected ? '#0D9488' : '#CBD5E1',
              background: selected ? '#0D9488' : 'white',
              cursor: 'pointer',
            }}
          >
            {selected && <Check style={{ width: 12, height: 12, color: 'white' }} />}
          </div>
        </div>

        <div className="flex-shrink-0 relative">
          <div
            className="w-11 h-11 flex items-center justify-center"
            style={{ background: cfg.iconBg, borderRadius: 16 }}
          >
            <Icon style={{ width: 22, height: 22, color: cfg.iconColor }} />
          </div>
          {!notif.isRead && (
            <div
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal-500"
              style={{ border: '2px solid white' }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: notif.isRead ? 13 : 14,
                fontWeight: notif.isRead ? 400 : 700,
                color: notif.isRead ? '#475569' : '#0F172A',
                lineHeight: 1.3,
              }}
            >
              {notif.title}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: '#94A3B8' }}>
                {formatNotifTime(notif.timestamp)}
              </span>
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(v => !v); }}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}
                  style={{ background: showMenu ? '#F1F5F9' : 'transparent' }}
                >
                  <MoreVertical style={{ width: 15, height: 15, color: '#94A3B8' }} />
                </button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
                    <div
                      className="absolute right-0 z-50 bg-white rounded-xl shadow-xl border border-slate-100 py-1"
                      style={{ top: '100%', width: 200, marginTop: 4 }}
                      onClick={e => e.stopPropagation()}
                    >
                      {[
                        { label: notif.isRead ? '✉ Mark as Unread' : '✓ Mark as Read', onClick: () => { notif.isRead ? onMarkUnread(notif.id) : onMarkRead(notif.id); setShowMenu(false); } },
                        { label: '🔔 Snooze 1 hour', onClick: () => { handleSnooze1h(); setShowMenu(false); } },
                        { label: '🔔 Snooze until tomorrow', onClick: () => { handleSnoozeTomorrow(); setShowMenu(false); } },
                        { label: '📋 View related page', onClick: () => { handleAction(); setShowMenu(false); } },
                        { label: '✕ Dismiss', onClick: () => { onDismiss(notif.id); setShowMenu(false); } },
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={item.onClick}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <p
            className={`mt-1 ${expanded ? '' : 'line-clamp-3'}`}
            style={{ fontSize: 13, color: '#475569', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}
          >
            {notif.body}
          </p>
          {notif.body.length > 160 && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
              style={{ fontSize: 11, color: '#0D9488', fontFamily: 'Inter, sans-serif', marginTop: 2 }}
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}

          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span
              style={{
                background: '#F8FAFC',
                color: '#64748B',
                fontSize: 9,
                padding: '2px 7px',
                borderRadius: 6,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {notif.source}
            </span>
            {typeBadge && (
              <span
                style={{
                  background: typeBadgeColor.bg,
                  color: typeBadgeColor.text,
                  fontSize: 9,
                  padding: '2px 7px',
                  borderRadius: 6,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {typeBadge}
              </span>
            )}
            {notif.badge && (
              <span
                style={{
                  background: BADGE_COLORS[notif.badge.color]?.bg || '#FEF3C7',
                  color: BADGE_COLORS[notif.badge.color]?.text || '#B45309',
                  fontSize: 9,
                  padding: '2px 7px',
                  borderRadius: 6,
                  fontFamily: 'DM Mono, monospace',
                  fontWeight: 700,
                  animation: notif.badge.color === 'violet' ? 'badgeGlow 2s ease-in-out infinite' : undefined,
                }}
              >
                {notif.badge.text}
              </span>
            )}
            {notif.snoozedUntil && (
              <span
                style={{
                  background: '#FEF3C7',
                  color: '#B45309',
                  fontSize: 9,
                  padding: '2px 7px',
                  borderRadius: 6,
                  fontFamily: 'DM Mono, monospace',
                }}
              >
                ⏰ Snoozed until {notif.snoozedUntil.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-[18px] pb-[14px] pt-1" style={{ marginLeft: 55 + 14 + 44 }}>
        <button
          onClick={(e) => { e.stopPropagation(); handleAction(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all hover:brightness-95"
          style={{ background: actionCfg.bg, color: actionCfg.text, fontSize: 11, fontFamily: 'Inter, sans-serif' }}
        >
          {notif.actionLabel} →
        </button>
        {notif.secondaryActionLabel && secondaryCfg && (
          <button
            onClick={(e) => { e.stopPropagation(); handleSecondaryAction(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all hover:brightness-95"
            style={{ background: secondaryCfg.bg, color: secondaryCfg.text, fontSize: 11, fontFamily: 'Inter, sans-serif' }}
          >
            {notif.secondaryActionLabel}
          </button>
        )}

        <div className="flex items-center gap-1 ml-auto">
          {showSnooze && (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); handleSnooze1h(); }}
                className="px-2 py-1 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                style={{ fontSize: 10, fontFamily: 'Inter, sans-serif' }}
              >
                1 hour
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleSnoozeTomorrow(); }}
                className="px-2 py-1 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                style={{ fontSize: 10, fontFamily: 'Inter, sans-serif' }}
              >
                Tomorrow
              </button>
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setShowSnooze(v => !v); }}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:bg-slate-100 ${hovered ? 'opacity-100' : 'opacity-0'}`}
            title="Snooze"
          >
            <Clock style={{ width: 14, height: 14, color: '#94A3B8' }} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); notif.isRead ? onMarkUnread(notif.id) : onMarkRead(notif.id); }}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:bg-slate-100 ${hovered ? 'opacity-100' : 'opacity-0'}`}
            title={notif.isRead ? 'Mark unread' : 'Mark read'}
          >
            {notif.isRead
              ? <Mail style={{ width: 14, height: 14, color: '#94A3B8' }} />
              : <MailOpen style={{ width: 14, height: 14, color: '#0D9488' }} />
            }
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss(notif.id); }}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:bg-red-50 ${hovered ? 'opacity-100' : 'opacity-0'}`}
            title="Dismiss"
          >
            <X style={{ width: 14, height: 14, color: '#94A3B8' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
