import React, { useState, useEffect, useRef } from 'react';
import { Settings, Bell, X, CheckCircle, AlertCircle, Search, Save } from 'lucide-react';
import InsuranceSidebar from './InsuranceSidebar';
import { CompanyProfileSection, MyAccountSection, SecuritySection } from './settings/AccountSections';
import { PlanConfigSection, PreAuthSlaSection, AIAutomationSection, FraudDetectionSection } from './settings/OperationsSections';
import { NotificationsSection, EmailAlertsSection, MemberCommsSection } from './settings/CommunicationsSections';
import { DhaRegulatorySection, AuditLoggingSection, DataPrivacySection } from './settings/ComplianceSections';
import { ApiIntegrationsSection, DisplayPrefsSection, HelpSupportSection } from './settings/SystemSections';

interface Props {
  onNavigate?: (page: string) => void;
}

interface Toast { id: number; msg: string; type: 'success' | 'warning' | 'info' }

interface NavItem {
  id: string;
  label: string;
  icon: string;
  group: string;
}

const NAV_ITEMS: NavItem[] = [
  // ACCOUNT
  { id: 'company-profile', label: 'Company Profile',    icon: '🏢', group: 'ACCOUNT' },
  { id: 'my-account',      label: 'My Account',         icon: '👤', group: 'ACCOUNT' },
  { id: 'security',        label: 'Security & Access',  icon: '🔐', group: 'ACCOUNT' },
  // OPERATIONS
  { id: 'plan-config',     label: 'Plan Configuration', icon: '📋', group: 'OPERATIONS' },
  { id: 'preauth-sla',     label: 'Pre-Auth & SLA',     icon: '⚡', group: 'OPERATIONS' },
  { id: 'ai-automation',   label: 'AI & Automation',    icon: '🤖', group: 'OPERATIONS' },
  { id: 'fraud-detection', label: 'Fraud Detection',    icon: '🔍', group: 'OPERATIONS' },
  // COMMUNICATIONS
  { id: 'notifications',   label: 'Notifications',      icon: '🔔', group: 'COMMUNICATIONS' },
  { id: 'email-alerts',    label: 'Email & Alerts',     icon: '📧', group: 'COMMUNICATIONS' },
  { id: 'member-comms',    label: 'Member Communications', icon: '💬', group: 'COMMUNICATIONS' },
  // COMPLIANCE
  { id: 'dha-regulatory',  label: 'DHA & Regulatory',   icon: '🏛️', group: 'COMPLIANCE' },
  { id: 'audit-logging',   label: 'Audit & Logging',    icon: '📊', group: 'COMPLIANCE' },
  { id: 'data-privacy',    label: 'Data & Privacy',     icon: '🔒', group: 'COMPLIANCE' },
  // SYSTEM
  { id: 'api-integrations', label: 'API & Integrations', icon: '🔗', group: 'SYSTEM' },
  { id: 'display',         label: 'Display Preferences', icon: '🎨', group: 'SYSTEM' },
  { id: 'help-support',    label: 'Help & Support',     icon: '❓', group: 'SYSTEM' },
];

const GROUPS = ['ACCOUNT', 'OPERATIONS', 'COMMUNICATIONS', 'COMPLIANCE', 'SYSTEM'];

export default function InsuranceSettingsPage({ onNavigate }: Props) {
  const [activeSection, setActiveSection] = useState('company-profile');
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSaveAll, setShowSaveAll] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const dirtyCount = Object.values(dirty).filter(Boolean).length;

  useEffect(() => {
    setShowSaveAll(dirtyCount > 0);
  }, [dirtyCount]);

  // Scroll-spy
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      entries => {
        let best: { id: string; ratio: number } | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio;
            if (!best || ratio > best.ratio) {
              best = { id: entry.target.id, ratio };
            }
          }
        }
        if (best) setActiveSection(best.id);
      },
      { root: contentRef.current, threshold: [0.2, 0.5, 0.8], rootMargin: '-80px 0px -60% 0px' }
    );

    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  function markDirty(id: string) {
    setDirty(prev => ({ ...prev, [id]: true }));
  }

  function addToast(msg: string, type: Toast['type'] = 'success') {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }

  async function handleSave(sectionId: string, msg: string) {
    setSaving(sectionId);
    await new Promise(r => setTimeout(r, 500));
    setSaving(null);
    setDirty(prev => ({ ...prev, [sectionId]: false }));
    addToast(`✅ ${msg}`, 'success');
  }

  async function handleSaveAll() {
    const dirtySections = Object.entries(dirty).filter(([, v]) => v).map(([k]) => k);
    for (const sec of dirtySections) {
      setSaving(sec);
      await new Promise(r => setTimeout(r, 300));
    }
    setSaving(null);
    setDirty({});
    addToast('✅ All changes saved successfully', 'success');
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el && contentRef.current) {
      const top = el.offsetTop - 24;
      contentRef.current.scrollTo({ top, behavior: 'smooth' });
    }
    setActiveSection(id);
  }

  const filteredNav = searchQuery
    ? NAV_ITEMS.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : NAV_ITEMS;

  const sectionProps = { dirty, markDirty, onSave: handleSave, saving };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F8FAFC', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      <InsuranceSidebar activePage="settings" onNavigate={p => onNavigate?.(p)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{ height: 64, background: '#fff', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16, flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 18, color: '#1E3A5F' }}>D</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 17, fontWeight: 700, color: '#1E293B' }}>Settings</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>Daman National Health Insurance · 7 April 2026 · 2:07 PM</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {dirtyCount > 0 && (
              <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: '#D97706', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 6, padding: '3px 8px' }}>
                {dirtyCount} unsaved
              </span>
            )}
            <button style={{ position: 'relative', width: 36, height: 36, background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={16} color="#D97706" />
              <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, background: '#DC2626', borderRadius: 8, fontSize: 9, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Mono, monospace' }}>3</span>
            </button>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: 'linear-gradient(135deg, #1E3A5F, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>MK</span>
            </div>
          </div>
        </div>

        {/* 2-column layout */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left nav */}
          <div style={{ width: 240, background: '#fff', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100%', overflowY: 'auto' }}>
            <div style={{ padding: '16px 16px 8px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={13} color="#94A3B8" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', height: 34, padding: '0 10px 0 28px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' }}
                />
              </div>
            </div>
            <div style={{ flex: 1, padding: '4px 0 16px' }}>
              {(searchQuery ? [''] : GROUPS).map(group => {
                const items = filteredNav.filter(n => !searchQuery ? n.group === group : true);
                if (items.length === 0) return null;
                return (
                  <div key={group || 'search'}>
                    {!searchQuery && (
                      <div style={{ padding: '8px 24px 4px', fontSize: 9, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{group}</div>
                    )}
                    {items.map(item => {
                      const isActive = activeSection === item.id;
                      const hasDirt = dirty[item.id];
                      return (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          style={{
                            width: 'calc(100% - 16px)', display: 'flex', alignItems: 'center', gap: 8,
                            height: 40, padding: '0 16px', margin: '1px 8px',
                            borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left',
                            background: isActive ? 'rgba(30,58,95,0.08)' : 'transparent',
                            transition: 'background 0.1s',
                          }}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F8FAFC'; }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <span style={{ fontSize: 14 }}>{item.icon}</span>
                          <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 400, color: isActive ? '#1E3A5F' : '#64748B', flex: 1 }}>{item.label}</span>
                          {hasDirt && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#F59E0B', flexShrink: 0 }} />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right content */}
          <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: '32px 40px 80px', maxWidth: 820 + 80 }}>
            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 28 }}>
              <Settings size={24} color="#64748B" />
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22, fontWeight: 700, color: '#0F172A' }}>Settings</div>
                <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>Configure your Daman insurance portal experience</div>
              </div>
            </div>

            {/* Sections */}
            <CompanyProfileSection {...sectionProps} />
            <MyAccountSection {...sectionProps} />
            <SecuritySection {...sectionProps} />
            <PlanConfigSection {...sectionProps} />
            <PreAuthSlaSection {...sectionProps} />
            <AIAutomationSection {...sectionProps} />
            <FraudDetectionSection {...sectionProps} />
            <NotificationsSection {...sectionProps} />
            <EmailAlertsSection {...sectionProps} />
            <MemberCommsSection {...sectionProps} />
            <DhaRegulatorySection {...sectionProps} />
            <AuditLoggingSection {...sectionProps} />
            <DataPrivacySection {...sectionProps} />
            <ApiIntegrationsSection {...sectionProps} />
            <DisplayPrefsSection {...sectionProps} />
            <HelpSupportSection {...sectionProps} />
          </div>
        </div>
      </div>

      {/* Fixed Save All button */}
      {showSaveAll && (
        <button
          onClick={handleSaveAll}
          style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 100,
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 22px', background: '#1E3A5F', color: '#fff',
            border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(30,58,95,0.4)',
            animation: 'saveGlow 2s ease-in-out infinite',
          }}
        >
          <Save size={16} />
          Save All Changes
          <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', background: 'rgba(255,255,255,0.2)', borderRadius: 4, padding: '2px 6px' }}>
            {dirtyCount} section{dirtyCount !== 1 ? 's' : ''}
          </span>
        </button>
      )}

      {/* Toasts */}
      <div style={{ position: 'fixed', bottom: 90, right: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 200 }}>
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px',
              background: t.type === 'success' ? '#ECFDF5' : t.type === 'warning' ? '#FFFBEB' : '#EFF6FF',
              border: `1px solid ${t.type === 'success' ? '#6EE7B7' : t.type === 'warning' ? '#FDE68A' : '#BFDBFE'}`,
              borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: 340,
              animation: 'fadeSlideIn 0.2s ease',
            }}
          >
            {t.type === 'success' ? <CheckCircle size={14} color="#059669" /> : <AlertCircle size={14} color="#D97706" />}
            <span style={{ fontSize: 13, color: '#0F172A', flex: 1 }}>{t.msg}</span>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0 }}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes saveGlow {
          0%, 100% { box-shadow: 0 4px 20px rgba(30,58,95,0.4); }
          50% { box-shadow: 0 4px 28px rgba(30,58,95,0.7); }
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes aiPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes ring { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.3); opacity: 0; } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes savePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(13,148,136,0); }
          50% { box-shadow: 0 0 0 4px rgba(13,148,136,0.3); }
        }
      `}</style>
    </div>
  );
}
