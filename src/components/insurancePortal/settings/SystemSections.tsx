import React, { useState } from 'react';
import { Link2, Monitor, HelpCircle, RefreshCw, Headphones, Building2, ExternalLink, ShieldCheck } from 'lucide-react';
import { SectionCard, SettingRow, SectionLabel, Toggle, InfoCard, SettingsInput, SettingsSelect, RadioGroup, SmallBtn } from './SettingsPrimitives';

interface Props {
  dirty: Record<string, boolean>;
  markDirty: (id: string) => void;
  onSave: (id: string, msg: string) => void;
  saving: string | null;
}

/* ── API & INTEGRATIONS ──────────────────────────────────────── */
export function ApiIntegrationsSection({ dirty, markDirty, onSave, saving }: Props) {
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  async function handleTestConnection() {
    setTesting(true);
    setTestResult(null);
    await new Promise(r => setTimeout(r, 1200));
    setTesting(false);
    setTestResult('✅ DHA connection tested — 0.41s response');
  }

  return (
    <SectionCard
      id="api-integrations"
      icon={<Link2 size={20} color="#1E3A5F" />}
      title="API & Integrations"
      desc="API connection status and webhook configuration"
    >
      <SectionLabel>CeenAiX API Connection</SectionLabel>
      <div style={{ padding: '12px 16px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#059669' }}>Connected · 0.42s avg</span>
        </div>
        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>
          API Key:&nbsp;
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}>
            {showKey ? 'ck_live_daman_a8f2k9b3m1x7y4z6' : 'ck_live_daman_●●●●●●●●●●●●●●●●'}
          </span>
          &nbsp;<button onClick={() => setShowKey(!showKey)} style={{ fontSize: 11, color: '#0D9488', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            {showKey ? 'Hide' : 'Reveal'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 11, color: '#94A3B8', marginBottom: 8 }}>
          <span>Rate limit: <strong style={{ fontFamily: 'DM Mono, monospace' }}>1,000 req/hour</strong></span>
          <span>Used today: <strong style={{ fontFamily: 'DM Mono, monospace', color: '#059669' }}>34%</strong></span>
          <span>Last event: <strong style={{ fontFamily: 'DM Mono, monospace' }}>Today 2:07 PM</strong></span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <SmallBtn>🔄 Rotate Key</SmallBtn>
          <SmallBtn>⚙️ Manage Webhooks</SmallBtn>
        </div>
      </div>

      <SectionLabel>Shafafiya (DHA Claims)</SectionLabel>
      <div style={{ padding: '12px 16px', borderRadius: 10, background: '#FFFBEB', border: '1px solid #FDE68A', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>⚠️ DEGRADED — 3.2s response (normal &lt;0.8s)</div>
        <div style={{ fontSize: 12, color: '#B45309', marginBottom: 8 }}>Since: Today 1:20 PM · Daman IT notified</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <SmallBtn variant="amber">📞 Contact Daman IT</SmallBtn>
          <button
            onClick={handleTestConnection}
            disabled={testing}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: testing ? 'not-allowed' : 'pointer', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0' }}
          >
            <RefreshCw size={12} style={{ animation: testing ? 'spin 1s linear infinite' : 'none' }} /> Test Connection
          </button>
        </div>
        {testResult && <div style={{ fontSize: 12, color: '#059669', marginTop: 8 }}>{testResult}</div>}
      </div>

      <SectionLabel>Nabidh HIE</SectionLabel>
      <div style={{ padding: '12px 16px', borderRadius: 10, background: '#ECFDF5', border: '1px solid #A7F3D0', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>✅ NABIDH Connected · 0.29s</div>
        <div style={{ fontSize: 12, color: '#059669' }}>Last sync: 12 seconds ago</div>
      </div>
    </SectionCard>
  );
}

/* ── DISPLAY PREFERENCES ─────────────────────────────────────── */
export function DisplayPrefsSection({ dirty, markDirty, onSave, saving }: Props) {
  const [currency, setCurrency] = useState('standard');
  const [dateFormat, setDateFormat] = useState('ddmmyyyy');
  const [timeFormat, setTimeFormat] = useState('12');
  const [rowsPerPage, setRowsPerPage] = useState('25');
  const [sidebarState, setSidebarState] = useState('remember');
  const [defaultView, setDefaultView] = useState('preauth');
  const [density, setDensity] = useState('standard');

  return (
    <SectionCard
      id="display"
      icon={<Monitor size={20} color="#1E3A5F" />}
      title="Display Preferences"
      desc="Customize how the portal looks and behaves"
      hasChanges={dirty['display']}
      onSave={() => onSave('display', 'Display preferences saved')}
      saving={saving === 'display'}
    >
      <SettingRow label="Currency Display">
        <RadioGroup
          name="currency"
          value={currency}
          onChange={v => { setCurrency(v); markDirty('display'); }}
          options={[
            { value: 'standard', label: 'AED 1,247,840 (standard)' },
            { value: 'abbreviated', label: 'AED 1.2M (abbreviated for large values)' },
          ]}
        />
      </SettingRow>

      <SettingRow label="Date Format">
        <RadioGroup
          name="date"
          value={dateFormat}
          onChange={v => { setDateFormat(v); markDirty('display'); }}
          options={[
            { value: 'ddmmyyyy', label: 'DD/MM/YYYY (UAE standard)' },
            { value: 'mmddyyyy', label: 'MM/DD/YYYY (US format)' },
            { value: 'iso', label: 'YYYY-MM-DD (ISO 8601)' },
          ]}
        />
      </SettingRow>

      <SettingRow label="Time Format">
        <RadioGroup
          name="time"
          value={timeFormat}
          onChange={v => { setTimeFormat(v); markDirty('display'); }}
          options={[
            { value: '12', label: '12-hour (AM/PM)' },
            { value: '24', label: '24-hour' },
          ]}
        />
      </SettingRow>

      <SettingRow label="Items Per Page (Tables)">
        <SettingsSelect
          value={rowsPerPage}
          onChange={v => { setRowsPerPage(v); markDirty('display'); }}
          options={[
            { value: '15', label: '15 rows' },
            { value: '25', label: '25 rows' },
            { value: '50', label: '50 rows' },
            { value: '100', label: '100 rows' },
          ]}
          width={130}
        />
      </SettingRow>

      <SettingRow label="Sidebar State">
        <RadioGroup
          name="sidebar"
          value={sidebarState}
          onChange={v => { setSidebarState(v); markDirty('display'); }}
          options={[
            { value: 'remember', label: 'Remember last state' },
            { value: 'expanded', label: 'Always expanded' },
            { value: 'collapsed', label: 'Always collapsed' },
          ]}
        />
      </SettingRow>

      <SettingRow label="Dashboard Default View">
        <RadioGroup
          name="default-view-disp"
          value={defaultView}
          onChange={v => { setDefaultView(v); markDirty('display'); }}
          options={[
            { value: 'preauth', label: 'Pre-Authorization Queue' },
            { value: 'claims', label: 'Claims Dashboard' },
            { value: 'analytics', label: 'Full Analytics Overview' },
          ]}
        />
      </SettingRow>

      <SettingRow label="Table Density" last>
        <RadioGroup
          name="density"
          value={density}
          onChange={v => { setDensity(v); markDirty('display'); }}
          options={[
            { value: 'comfortable', label: 'Comfortable (72px rows)' },
            { value: 'standard', label: 'Standard (56px rows — current)' },
            { value: 'compact', label: 'Compact (44px rows, dense)' },
          ]}
        />
      </SettingRow>
    </SectionCard>
  );
}

/* ── HELP & SUPPORT ──────────────────────────────────────────── */
export function HelpSupportSection({ onSave, saving }: Props) {
  return (
    <SectionCard
      id="help-support"
      icon={<HelpCircle size={20} color="#1E3A5F" />}
      title="Help & Support"
      desc="Contact CeenAiX support and access documentation"
    >
      {/* 3-col support cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          {
            Icon: Headphones, iconBg: '#F0FDFA', iconColor: '#0D9488',
            title: 'CeenAiX Tech Support',
            desc: 'For platform bugs, API issues, access problems',
            contact: 'support@ceenaix.com',
            hours: 'Sun–Thu 8AM–8PM · Response: <4 hours',
            actions: [{ label: '💬 Chat Now', variant: 'teal' as const }, { label: '📧 Email', variant: 'default' as const }],
          },
          {
            Icon: ShieldCheck, iconBg: '#EFF6FF', iconColor: '#1E3A5F',
            title: 'DHA Sheryan Support',
            desc: 'For DHA regulatory and submission questions',
            contact: 'sheryan@dha.gov.ae | 800-DHA-GOV',
            hours: 'Available 24/7 for emergencies',
            actions: [{ label: '🔗 Sheryan Portal', variant: 'navy' as const }],
          },
          {
            Icon: Building2, iconBg: '#EFF6FF', iconColor: '#2563EB',
            title: 'Daman IT Helpdesk',
            desc: 'For Daman account, Shafafiya API, credentials',
            contact: 'it@daman.ae | +971 4 XXX XXXX',
            hours: 'Sun–Thu 8AM–5PM',
            actions: [{ label: '📧 Email IT', variant: 'default' as const }],
          },
        ].map((card, i) => (
          <div key={i} style={{ padding: 16, borderRadius: 12, border: '1px solid #F1F5F9', background: '#FAFAFA' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <card.Icon size={18} color={card.iconColor} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{card.title}</div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6, lineHeight: 1.4 }}>{card.desc}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 2 }}>{card.contact}</div>
            <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 10 }}>{card.hours}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {card.actions.map((a, j) => (
                <SmallBtn key={j} variant={a.variant}>{a.label}</SmallBtn>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SectionLabel>Resources</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {[
          { label: '📄 CeenAiX Insurance Portal Guide', color: '#0D9488' },
          { label: '📄 DHA Insurance Regulations 2026', color: '#0D9488' },
          { label: '📄 UAE PDPL Compliance Guide', color: '#0D9488' },
          { label: '🎥 Video Tutorials', color: '#7C3AED' },
          { label: '📋 Changelog — What\'s New', color: '#64748B' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: r.color, cursor: 'pointer' }}>
            {r.label}
            <ExternalLink size={11} />
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 14px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
        <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>CeenAiX Insurance Portal v2.4.1</div>
        <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>Last updated: 2 April 2026</div>
        <div style={{ fontSize: 11, color: '#059669', marginTop: 2 }}>UAE Insurance Authority compliance: ✅ Current</div>
      </div>
    </SectionCard>
  );
}
