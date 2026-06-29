import React, { useState } from 'react';
import { Bell, Mail, Users, Lock, Smartphone, MessageSquare } from 'lucide-react';
import { SectionCard, SettingRow, SectionLabel, Toggle, InfoCard, SettingsInput, SettingsSelect, SmallBtn, CheckboxRow } from './SettingsPrimitives';

interface Props {
  dirty: Record<string, boolean>;
  markDirty: (id: string) => void;
  onSave: (id: string, msg: string) => void;
  saving: string | null;
}

type Channel = 'app' | 'push' | 'email' | 'sms';

interface NotifRow {
  label: string;
  locked?: boolean;
  lockNote?: string;
  app: boolean; push: boolean; email: boolean; sms: boolean;
}

/* ── NOTIFICATIONS ────────────────────────────────────────────── */
export function NotificationsSection({ dirty, markDirty, onSave, saving }: Props) {
  const [pushOn, setPushOn] = useState(true);
  const [emailOn, setEmailOn] = useState(true);
  const [smsOn, setSmsOn] = useState(true);
  const [quietEnabled, setQuietEnabled] = useState(true);
  const [quietFrom, setQuietFrom] = useState('22:00');
  const [quietTo, setQuietTo] = useState('07:00');

  const [notifs, setNotifs] = useState<Record<string, NotifRow>>({
    pa_new:      { label: 'New PA received',              app: true,  push: true,  email: false, sms: false },
    pa_urgent:   { label: 'Urgent PA (4h SLA)',           app: true,  push: true,  email: true,  sms: true  },
    pa_breach:   { label: 'SLA breach',                   app: true,  push: true,  email: true,  sms: true,  locked: true, lockNote: 'SLA alerts always delivered' },
    pa_decision: { label: 'PA approved/denied',           app: true,  push: false, email: false, sms: false },
    pa_info:     { label: 'Info request response',        app: true,  push: true,  email: true,  sms: false },
    clm_new:     { label: 'New claim submitted',          app: true,  push: false, email: false, sms: false },
    clm_pending: { label: 'Claim pending review',         app: true,  push: true,  email: false, sms: false },
    clm_appeal:  { label: 'Claim appealed',               app: true,  push: true,  email: true,  sms: false },
    clm_bulk:    { label: 'Bulk approval complete',       app: true,  push: true,  email: true,  sms: false },
    clm_eob:     { label: 'EOB batch complete',           app: true,  push: true,  email: true,  sms: false },
    frd_new:     { label: 'NEW fraud alert',              app: true,  push: true,  email: true,  sms: true,  locked: true, lockNote: 'Fraud alerts always delivered on all channels' },
    frd_high:    { label: 'HIGH fraud alert',             app: true,  push: true,  email: true,  sms: true  },
    frd_resolve: { label: 'Fraud case resolved',          app: true,  push: true,  email: true,  sms: false },
    frd_freeze:  { label: 'Claims frozen by AI',          app: true,  push: true,  email: true,  sms: false },
    mbr_near:    { label: 'Member near benefit limit',    app: true,  push: false, email: true,  sms: false },
    mbr_exhaust: { label: 'Member limit exhausted',       app: true,  push: true,  email: true,  sms: false },
    mbr_crit:    { label: 'Critical risk member alert',   app: true,  push: true,  email: true,  sms: false },
    rpt_done:    { label: 'Report generated',             app: true,  push: false, email: false, sms: false },
    rpt_fail:    { label: 'Scheduled report failure',     app: true,  push: true,  email: true,  sms: false },
    dha_due:     { label: 'DHA submission due',           app: true,  push: true,  email: true,  sms: false },
    sys_maint:   { label: 'System maintenance',           app: true,  push: true,  email: true,  sms: false },
    prv_cred:    { label: 'Provider credentialing ready', app: true,  push: true,  email: true,  sms: false },
  });

  function toggleCell(id: string, ch: Channel) {
    const row = notifs[id];
    if (row.locked) return;
    setNotifs(prev => ({ ...prev, [id]: { ...prev[id], [ch]: !prev[id][ch] } }));
    markDirty('notifications');
  }

  const SECTION_ROWS: { label: string; ids: string[] }[] = [
    { label: 'PRE-AUTHORIZATION', ids: ['pa_new', 'pa_urgent', 'pa_breach', 'pa_decision', 'pa_info'] },
    { label: 'CLAIMS',            ids: ['clm_new', 'clm_pending', 'clm_appeal', 'clm_bulk', 'clm_eob'] },
    { label: 'FRAUD',             ids: ['frd_new', 'frd_high', 'frd_resolve', 'frd_freeze'] },
    { label: 'MEMBERS',           ids: ['mbr_near', 'mbr_exhaust', 'mbr_crit'] },
    { label: 'REPORTS & SYSTEM',  ids: ['rpt_done', 'rpt_fail', 'dha_due', 'sys_maint', 'prv_cred'] },
  ];

  const channels: { key: Channel; label: string }[] = [
    { key: 'app', label: 'In-App' },
    { key: 'push', label: 'Push' },
    { key: 'email', label: 'Email' },
    { key: 'sms', label: 'SMS' },
  ];

  return (
    <SectionCard
      id="notifications"
      icon={<Bell size={20} color="#1E3A5F" />}
      title="Notifications"
      desc="Control which events trigger alerts and how you receive them"
      hasChanges={dirty['notifications']}
      onSave={() => onSave('notifications', 'Notification preferences saved')}
      saving={saving === 'notifications'}
    >
      <SectionLabel>Notification Channels</SectionLabel>
      {[
        { icon: Bell, label: 'In-App Notifications', desc: 'Portal notification bell', on: true, locked: true, sub: undefined },
        { icon: Smartphone, label: 'Push Notifications', desc: 'Mobile push alerts', on: pushOn, sub: '3 devices configured', onChange: (v: boolean) => { setPushOn(v); markDirty('notifications'); } },
        { icon: Mail, label: 'Email Alerts', desc: 'mariam.khateeb@daman.ae', on: emailOn, sub: 'Summary: Immediate for urgent, daily digest for others', onChange: (v: boolean) => { setEmailOn(v); markDirty('notifications'); } },
        { icon: MessageSquare, label: 'SMS Alerts', desc: '+971 50 XXX XXXX', on: smsOn, sub: 'Only for: SLA breaches + HIGH fraud alerts', onChange: (v: boolean) => { setSmsOn(v); markDirty('notifications'); } },
      ].map((ch, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F9FAFB' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ch.icon size={15} color="#64748B" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{ch.label}</span>
              {ch.locked && <Lock size={11} color="#F59E0B" />}
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>{ch.desc}</div>
            {ch.sub && <div style={{ fontSize: 10, color: '#0D9488', fontFamily: 'DM Mono, monospace', marginTop: 1 }}>{ch.sub}</div>}
          </div>
          <Toggle checked={ch.on} locked={ch.locked} onChange={ch.onChange} />
        </div>
      ))}

      {/* Notification table */}
      <div style={{ marginTop: 20, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#94A3B8', borderBottom: '1px solid #F1F5F9' }}>Event</th>
              {channels.map(c => (
                <th key={c.key} style={{ textAlign: 'center', padding: '8px 10px', fontSize: 11, fontWeight: 700, color: '#94A3B8', borderBottom: '1px solid #F1F5F9', whiteSpace: 'nowrap' }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SECTION_ROWS.map(sec => (
              <React.Fragment key={sec.label}>
                <tr>
                  <td colSpan={5} style={{ padding: '10px 12px 4px', fontSize: 10, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', background: '#FAFAFA' }}>
                    {sec.label}
                  </td>
                </tr>
                {sec.ids.map((id, rowIdx) => {
                  const row = notifs[id];
                  return (
                    <tr key={id} style={{ borderBottom: '1px solid #F9FAFB', background: row.locked ? 'rgba(254,243,199,0.2)' : '#fff' }}>
                      <td style={{ padding: '8px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 12, color: '#374151' }}>{row.label}</span>
                          {row.locked && <Lock size={10} color="#F59E0B" />}
                        </div>
                        {row.lockNote && <div style={{ fontSize: 10, color: '#D97706', fontStyle: 'italic', marginTop: 1 }}>{row.lockNote}</div>}
                      </td>
                      {channels.map(c => (
                        <td key={c.key} style={{ textAlign: 'center', padding: '8px 10px' }}>
                          <input
                            type="checkbox"
                            checked={row[c.key]}
                            disabled={row.locked}
                            onChange={() => toggleCell(id, c.key)}
                            style={{ width: 15, height: 15, accentColor: '#0D9488', cursor: row.locked ? 'not-allowed' : 'pointer' }}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <SectionLabel>Quiet Hours</SectionLabel>
      <SettingRow label="Suppress non-urgent notifications" desc="Urgent alerts (SLA breaches, HIGH fraud) override quiet hours">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Toggle checked={quietEnabled} onChange={v => { setQuietEnabled(v); markDirty('notifications'); }} />
          {quietEnabled && (
            <>
              <span style={{ fontSize: 12, color: '#64748B' }}>From</span>
              <input type="time" value={quietFrom} onChange={e => { setQuietFrom(e.target.value); markDirty('notifications'); }}
                style={{ height: 32, padding: '0 8px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none' }} />
              <span style={{ fontSize: 12, color: '#64748B' }}>to</span>
              <input type="time" value={quietTo} onChange={e => { setQuietTo(e.target.value); markDirty('notifications'); }}
                style={{ height: 32, padding: '0 8px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none' }} />
            </>
          )}
        </div>
      </SettingRow>
    </SectionCard>
  );
}

/* ── EMAIL & ALERTS ───────────────────────────────────────────── */
export function EmailAlertsSection({ dirty, markDirty, onSave, saving }: Props) {
  const [slaCc, setSlaCc] = useState('manager@daman.ae');
  const [fraudCc, setFraudCc] = useState('fraud@daman.ae, cso@daman.ae');
  const [dhaCc, setDhaCc] = useState('compliance@daman.ae');
  const [dailyDigest, setDailyDigest] = useState(true);
  const [dailyTime, setDailyTime] = useState('08:00');
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [weeklyDay, setWeeklyDay] = useState('Monday');
  const [weeklyTime, setWeeklyTime] = useState('07:00');
  const [emailLang, setEmailLang] = useState('english');
  const [dailyClaimsAlert, setDailyClaimsAlert] = useState('2000000');
  const [budgetPct, setBudgetPct] = useState('90');
  const [singleClaimAlert, setSingleClaimAlert] = useState('50000');

  return (
    <SectionCard
      id="email-alerts"
      icon={<Mail size={20} color="#1E3A5F" />}
      title="Email & Alerts"
      desc="Configure email delivery preferences and alert thresholds"
      hasChanges={dirty['email-alerts']}
      onSave={() => onSave('email-alerts', 'Email alert settings saved')}
      saving={saving === 'email-alerts'}
    >
      <SettingRow label="Primary Email" locked desc="Managed by IT">
        <SettingsInput value="mariam.khateeb@daman.ae" onChange={() => {}} readOnly width={220} />
      </SettingRow>

      <SectionLabel>CC Recipients</SectionLabel>
      <SettingRow label="SLA Breaches CC">
        <SettingsInput value={slaCc} onChange={v => { setSlaCc(v); markDirty('email-alerts'); }} width={220} />
      </SettingRow>
      <SettingRow label="Fraud HIGH CC">
        <SettingsInput value={fraudCc} onChange={v => { setFraudCc(v); markDirty('email-alerts'); }} width={220} />
      </SettingRow>
      <SettingRow label="DHA Reports CC">
        <SettingsInput value={dhaCc} onChange={v => { setDhaCc(v); markDirty('email-alerts'); }} width={220} />
      </SettingRow>

      <SectionLabel>Email Digest</SectionLabel>
      <SettingRow label="Daily Digest" desc="PA queue summary, claims overview, pending actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Toggle checked={dailyDigest} onChange={v => { setDailyDigest(v); markDirty('email-alerts'); }} />
          {dailyDigest && <input type="time" value={dailyTime} onChange={e => { setDailyTime(e.target.value); markDirty('email-alerts'); }}
            style={{ height: 32, padding: '0 8px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none' }} />}
        </div>
      </SettingRow>
      <SettingRow label="Weekly Digest" desc="Full week summary and performance metrics">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Toggle checked={weeklyDigest} onChange={v => { setWeeklyDigest(v); markDirty('email-alerts'); }} />
          {weeklyDigest && <>
            <select value={weeklyDay} onChange={e => { setWeeklyDay(e.target.value); markDirty('email-alerts'); }}
              style={{ height: 32, padding: '0 8px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none' }}>
              {['Monday','Tuesday','Wednesday','Thursday','Friday'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input type="time" value={weeklyTime} onChange={e => { setWeeklyTime(e.target.value); markDirty('email-alerts'); }}
              style={{ height: 32, padding: '0 8px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none' }} />
          </>}
        </div>
      </SettingRow>

      <SectionLabel>Email Language</SectionLabel>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['english', 'arabic', 'both'] as const).map(l => (
          <button key={l} onClick={() => { setEmailLang(l); markDirty('email-alerts'); }}
            style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: emailLang === l ? '#1E3A5F' : '#F8FAFC', color: emailLang === l ? '#fff' : '#475569', border: emailLang === l ? '1px solid #1E3A5F' : '1px solid #E2E8F0' }}>
            {l === 'both' ? 'Bilingual' : l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>

      <SectionLabel>Financial Alert Rules</SectionLabel>
      <SettingRow label="Alert when daily claims exceed">
        <SettingsInput value={dailyClaimsAlert} onChange={v => { setDailyClaimsAlert(v); markDirty('email-alerts'); }} unit="AED" mono width={110} />
      </SettingRow>
      <SettingRow label="Alert when monthly spend exceeds % of budget" desc="Alert Mariam when this % of monthly budget reached">
        <SettingsInput value={budgetPct} onChange={v => { setBudgetPct(v); markDirty('email-alerts'); }} unit="%" mono width={70} />
      </SettingRow>
      <SettingRow label="Alert when single claim exceeds" desc="High-value claims get individual email alerts" last>
        <SettingsInput value={singleClaimAlert} onChange={v => { setSingleClaimAlert(v); markDirty('email-alerts'); }} unit="AED" mono width={100} />
      </SettingRow>
    </SectionCard>
  );
}

/* ── MEMBER COMMUNICATIONS ───────────────────────────────────── */
export function MemberCommsSection({ dirty, markDirty, onSave, saving }: Props) {
  const [paApprovedNotif, setPaApprovedNotif] = useState(true);
  const [claimApprovedNotif, setClaimApprovedNotif] = useState(true);
  const [benefitAlertOn, setBenefitAlertOn] = useState(true);
  const [aiOutreach, setAiOutreach] = useState(true);
  const [campaignLang, setCampaignLang] = useState('both');
  const [campaignConsent, setCampaignConsent] = useState(true);

  return (
    <SectionCard
      id="member-comms"
      icon={<Users size={20} color="#1E3A5F" />}
      title="Member Communications"
      desc="Configure automated messages sent to Daman members"
      hasChanges={dirty['member-comms']}
      onSave={() => onSave('member-comms', 'Member communication settings saved')}
      saving={saving === 'member-comms'}
    >
      <InfoCard color="blue">
        ℹ️ All member communications via CeenAiX must comply with UAE PDPL (Federal Law No. 45/2021) and DHA communication guidelines. All messages are logged.
      </InfoCard>

      <SectionLabel>Automated Member Notifications</SectionLabel>
      <SettingRow label="PA approved notification" desc="Patient notified when PA approved">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Toggle checked={paApprovedNotif} onChange={v => { setPaApprovedNotif(v); markDirty('member-comms'); }} />
          <span style={{ fontSize: 11, color: '#94A3B8' }}>App · Email</span>
        </div>
      </SettingRow>
      <SettingRow label="PA denied notification" locked lockedNote="Members must be notified of PA denials with appeal rights per UAE Insurance Law Art. 22" desc="Legally required — includes appeal rights">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Toggle checked={true} locked />
          <span style={{ fontSize: 11, color: '#94A3B8' }}>App · Email · SMS</span>
        </div>
      </SettingRow>
      <SettingRow label="Claim approved" desc="Member notified when claim is paid">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Toggle checked={claimApprovedNotif} onChange={v => { setClaimApprovedNotif(v); markDirty('member-comms'); }} />
          <span style={{ fontSize: 11, color: '#94A3B8' }}>App only</span>
        </div>
      </SettingRow>
      <SettingRow label="Benefit limit alerts" desc="Trigger at 75%, 85%, 95%, 100%">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Toggle checked={benefitAlertOn} onChange={v => { setBenefitAlertOn(v); markDirty('member-comms'); }} />
          <span style={{ fontSize: 11, color: '#94A3B8' }}>App · Email</span>
        </div>
      </SettingRow>
      <SettingRow label="Benefit limit exhausted" locked lockedNote="Required by UAE Insurance Law" desc="Member notified when annual limit is reached">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Toggle checked={true} locked />
          <span style={{ fontSize: 11, color: '#94A3B8' }}>App · Email · SMS</span>
        </div>
      </SettingRow>

      <SectionLabel>Wellness Campaigns</SectionLabel>
      <SettingRow label="AI-suggested outreach" desc="CeenAiX AI identifies members for wellness outreach and suggests campaigns">
        <Toggle checked={aiOutreach} onChange={v => { setAiOutreach(v); markDirty('member-comms'); }} />
      </SettingRow>
      <SettingRow label="Campaign language">
        <div style={{ display: 'flex', gap: 8 }}>
          {(['arabic', 'english', 'both'] as const).map(l => (
            <button key={l} onClick={() => { setCampaignLang(l); markDirty('member-comms'); }}
              style={{ padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer', background: campaignLang === l ? '#1E3A5F' : '#F8FAFC', color: campaignLang === l ? '#fff' : '#475569', border: campaignLang === l ? '1px solid #1E3A5F' : '1px solid #E2E8F0' }}>
              {l === 'both' ? 'Arabic + English' : l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>
      </SettingRow>
      <SettingRow label="Campaign consent required" desc="Members must have opted in to receive wellness messages">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <Toggle checked={campaignConsent} onChange={v => { setCampaignConsent(v); markDirty('member-comms'); }} />
          <span style={{ fontSize: 10, color: '#0D9488', fontFamily: 'DM Mono, monospace' }}>6,891 / 8,247 opted in (83.6%)</span>
        </div>
      </SettingRow>
      <SettingRow label="Unsubscribe link" locked lockedNote="Always included per UAE PDPL requirements" last>
        <Toggle checked={true} locked />
      </SettingRow>

      <SectionLabel>Template Management</SectionLabel>
      <SmallBtn variant="navy">✏️ Edit Templates</SmallBtn>
    </SectionCard>
  );
}
