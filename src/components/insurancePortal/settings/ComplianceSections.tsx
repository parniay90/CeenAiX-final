import React, { useState } from 'react';
import { ShieldCheck, ClipboardCheck, Lock as LockIcon } from 'lucide-react';
import { SectionCard, SettingRow, SectionLabel, Toggle, InfoCard, SettingsInput, SmallBtn, CheckboxRow } from './SettingsPrimitives';

interface Props {
  dirty: Record<string, boolean>;
  markDirty: (id: string) => void;
  onSave: (id: string, msg: string) => void;
  saving: string | null;
}

/* ── DHA & REGULATORY ─────────────────────────────────────────── */
export function DhaRegulatorySection({ dirty, markDirty, onSave, saving }: Props) {
  const [autoMonthly, setAutoMonthly] = useState(true);
  const [autoQuarterlyClaims, setAutoQuarterlyClaims] = useState(false);
  const [autoQuarterlyFraud, setAutoQuarterlyFraud] = useState(false);
  const [dhaContact, setDhaContact] = useState('compliance@daman.ae');
  const [submissionConfirm, setSubmissionConfirm] = useState(true);
  const [reminderDays1, setReminderDays1] = useState('7');
  const [reminderDays2, setReminderDays2] = useState('2');
  const [denialRateAlert, setDenialRateAlert] = useState('8');
  const [autoApprovalFloor, setAutoApprovalFloor] = useState('60');

  return (
    <SectionCard
      id="dha-regulatory"
      icon={<ShieldCheck size={20} color="#1E3A5F" />}
      title="DHA & Regulatory"
      desc="DHA compliance configuration and regulatory settings"
      hasChanges={dirty['dha-regulatory']}
      onSave={() => onSave('dha-regulatory', 'DHA regulatory settings saved')}
      saving={saving === 'dha-regulatory'}
    >
      {/* DHA status */}
      <div style={{ padding: '14px 16px', borderRadius: 10, background: '#ECFDF5', border: '1px solid #A7F3D0', marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#065F46', marginBottom: 6 }}>✅ CONNECTED TO DHA SHERYAN</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 12, color: '#059669', marginBottom: 8 }}>
          <span>License: <strong style={{ fontFamily: 'DM Mono, monospace' }}>CBUAE-INS-2006-001847 ✅</strong></span>
          <span>DHA API: <strong>✅ Active · Last verified: Today 2:07 PM</strong></span>
        </div>
        <SmallBtn variant="teal">Test DHA Connection</SmallBtn>
      </div>

      <SectionLabel>DHA Submission Configuration</SectionLabel>
      <SettingRow label="Auto-submit monthly SLA report" desc="Runs 1st of each month automatically">
        <Toggle checked={autoMonthly} onChange={v => { setAutoMonthly(v); markDirty('dha-regulatory'); }} />
      </SettingRow>
      <SettingRow label="Auto-submit quarterly claims return" desc="Manual review recommended before submission">
        <Toggle checked={autoQuarterlyClaims} onChange={v => { setAutoQuarterlyClaims(v); markDirty('dha-regulatory'); }} />
      </SettingRow>
      <SettingRow label="Auto-submit quarterly fraud report" desc="Compliance team reviews first — manual by default">
        <Toggle checked={autoQuarterlyFraud} onChange={v => { setAutoQuarterlyFraud(v); markDirty('dha-regulatory'); }} />
      </SettingRow>
      {!autoQuarterlyClaims && !autoQuarterlyFraud && (
        <div style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic', padding: '4px 0 12px' }}>
          Non-auto reports sent to My Reports for manual review before DHA submission.
        </div>
      )}
      <SettingRow label="DHA submission contact email" desc="Receives all DHA-related notifications and confirmations">
        <SettingsInput value={dhaContact} onChange={v => { setDhaContact(v); markDirty('dha-regulatory'); }} width={220} />
      </SettingRow>
      <SettingRow label="Require DHA receipt confirmation" desc="Require DHA receipt confirmation before marking submitted">
        <Toggle checked={submissionConfirm} onChange={v => { setSubmissionConfirm(v); markDirty('dha-regulatory'); }} />
      </SettingRow>

      <SectionLabel>Regulatory Deadlines</SectionLabel>
      <SettingRow label="First reminder before DHA deadline">
        <SettingsInput value={reminderDays1} onChange={v => { setReminderDays1(v); markDirty('dha-regulatory'); }} unit="days before" mono width={60} />
      </SettingRow>
      <SettingRow label="Second reminder">
        <SettingsInput value={reminderDays2} onChange={v => { setReminderDays2(v); markDirty('dha-regulatory'); }} unit="days before" mono width={60} />
      </SettingRow>

      <SectionLabel>Compliance Monitoring</SectionLabel>
      <SettingRow label="Alert when SLA breach occurs" locked lockedNote="Immediate alert — always on">
        <Toggle checked={true} locked />
      </SettingRow>
      <SettingRow label="Alert when denial rate exceeds" desc="DHA investigates insurers with >8% denial rate">
        <SettingsInput value={denialRateAlert} onChange={v => { setDenialRateAlert(v); markDirty('dha-regulatory'); }} unit="%" mono width={70} />
      </SettingRow>
      <SettingRow label="Alert when auto-approval rate drops below" desc="May indicate AI configuration issue" last>
        <SettingsInput value={autoApprovalFloor} onChange={v => { setAutoApprovalFloor(v); markDirty('dha-regulatory'); }} unit="%" mono width={70} />
      </SettingRow>
    </SectionCard>
  );
}

/* ── AUDIT & LOGGING ──────────────────────────────────────────── */
export function AuditLoggingSection({ dirty, markDirty, onSave, saving }: Props) {
  const [stdRetention, setStdRetention] = useState('90');

  return (
    <SectionCard
      id="audit-logging"
      icon={<ClipboardCheck size={20} color="#1E3A5F" />}
      title="Audit & Logging"
      desc="Configure audit trail and activity logging"
      hasChanges={dirty['audit-logging']}
      onSave={() => onSave('audit-logging', 'Audit settings saved')}
      saving={saving === 'audit-logging'}
    >
      <InfoCard color="amber" icon={<LockIcon size={13} />}>
        All audit logging settings are locked per DHA Insurance Law. Logging cannot be disabled.
      </InfoCard>

      {[
        'All PA decisions logged',
        'All claim decisions logged',
        'All fraud actions logged',
        'User login/logout logged',
        'Data access logged',
        'Config changes logged',
      ].map((label, i, arr) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#374151' }}>{label}</span>
            <LockIcon size={11} color="#F59E0B" />
          </div>
          <Toggle checked={true} locked />
        </div>
      ))}

      <SectionLabel>Log Retention</SectionLabel>
      <SettingRow label="Standard logs retention" desc="Minimum 90 days required">
        <SettingsInput value={stdRetention} onChange={v => { setStdRetention(v); markDirty('audit-logging'); }} unit="days" mono width={70} />
      </SettingRow>
      <SettingRow label="DHA-required logs" desc="DHA minimum: 7 years" locked>
        <SettingsInput value="7 years" onChange={() => {}} readOnly mono width={90} />
      </SettingRow>
      <SettingRow label="Fraud investigation logs" desc="UAE Insurance Law requirement" locked last>
        <SettingsInput value="10 years" onChange={() => {}} readOnly mono width={90} />
      </SettingRow>
      <InfoCard color="amber">DHA minimum retention: 7 years. Reducing below this value is not permitted.</InfoCard>

      <SectionLabel>Audit Log Access</SectionLabel>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <SmallBtn>📋 View My Activity Log</SmallBtn>
        <SmallBtn>📋 View Team Activity Log</SmallBtn>
        <SmallBtn>📤 Export Audit Log</SmallBtn>
      </div>
    </SectionCard>
  );
}

/* ── DATA & PRIVACY ───────────────────────────────────────────── */
export function DataPrivacySection({ dirty, markDirty, onSave, saving }: Props) {
  const [anonResearch, setAnonResearch] = useState(false);
  const [timerReveal, setTimerReveal] = useState(true);
  const [managerApproval, setManagerApproval] = useState(false);
  const [allStaffAccess, setAllStaffAccess] = useState(false);
  const [exportJustification, setExportJustification] = useState(true);
  const [exportAuditLog, setExportAuditLog] = useState(true);
  const [exportManagerApproval, setExportManagerApproval] = useState(false);

  return (
    <SectionCard
      id="data-privacy"
      icon={<LockIcon size={20} color="#1E3A5F" />}
      title="Data & Privacy"
      desc="Data handling, privacy, and PDPL compliance"
      hasChanges={dirty['data-privacy']}
      onSave={() => onSave('data-privacy', 'Data & privacy settings saved')}
      saving={saving === 'data-privacy'}
    >
      <SectionLabel>Data Location</SectionLabel>
      <div style={{ padding: '12px 16px', borderRadius: 10, background: '#ECFDF5', border: '1px solid #A7F3D0', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>✅ All data stored in UAE (AWS AE-EAST-1)</div>
        <div style={{ fontSize: 12, color: '#059669' }}>Member PHI never leaves UAE jurisdiction ✅</div>
        <div style={{ fontSize: 12, color: '#059669' }}>Nabidh integration: UAE HIE only ✅</div>
      </div>

      <SectionLabel>CeenAiX Data Access</SectionLabel>
      {[
        { label: 'Claims processing', locked: true },
        { label: 'Pre-authorization', locked: true },
        { label: 'Fraud detection', locked: true },
        { label: 'Member portal display', locked: true },
      ].map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F9FAFB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#374151' }}>{r.label}</span>
            <LockIcon size={10} color="#F59E0B" />
            <span style={{ fontSize: 10, color: '#D97706' }}>Required</span>
          </div>
          <Toggle checked={true} locked />
        </div>
      ))}
      <SettingRow label="Anonymized research participation" desc="Allow CeenAiX to use anonymized Daman data for UAE population health research">
        <Toggle checked={anonResearch} onChange={v => { setAnonResearch(v); markDirty('data-privacy'); }} />
      </SettingRow>
      <div style={{ fontSize: 11, color: '#64748B', marginBottom: 12 }}>
        Daman-CeenAiX DPA v2.1 · Signed: Jan 2024 — <span style={{ color: '#0D9488', cursor: 'pointer', textDecoration: 'underline' }}>View Agreement</span>
      </div>

      <SectionLabel>Member PHI Access Controls</SectionLabel>
      <SettingRow label="Emirates ID reveal — 30-second timer" desc="ID hidden by default, shows for 30 seconds when revealed">
        <Toggle checked={timerReveal} onChange={v => { setTimerReveal(v); markDirty('data-privacy'); }} />
      </SettingRow>
      <SettingRow label="Emirates ID reveal — manager approval" desc="Add extra approval step for sensitive access">
        <Toggle checked={managerApproval} onChange={v => { setManagerApproval(v); markDirty('data-privacy'); }} />
      </SettingRow>
      <SettingRow label="Member health data — all portal staff" desc="Recommended OFF — limit to claims officers and medical directors">
        <Toggle checked={allStaffAccess} onChange={v => { setAllStaffAccess(v); markDirty('data-privacy'); }} />
      </SettingRow>
      <InfoCard color="blue">PHI access logged per UAE PDPL Federal Law 45/2021</InfoCard>

      <SectionLabel>Export Permissions</SectionLabel>
      <SettingRow label="PHI in exports — justification note required">
        <Toggle checked={exportJustification} onChange={v => { setExportJustification(v); markDirty('data-privacy'); }} />
      </SettingRow>
      <SettingRow label="PHI in exports — audit log entry required" locked>
        <Toggle checked={true} locked />
      </SettingRow>
      <SettingRow label="PHI in exports — manager approval" desc="Enable for extra control" last>
        <Toggle checked={exportManagerApproval} onChange={v => { setExportManagerApproval(v); markDirty('data-privacy'); }} />
      </SettingRow>
    </SectionCard>
  );
}
