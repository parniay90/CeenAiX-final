import React, { useState } from 'react';
import { CreditCard, ClipboardList, Bot, AlertTriangle, Lock, AlertCircle } from 'lucide-react';
import { SectionCard, SettingRow, SectionLabel, Toggle, InfoCard, SettingsInput, RadioGroup, CheckboxRow, SmallBtn } from './SettingsPrimitives';

interface Props {
  dirty: Record<string, boolean>;
  markDirty: (id: string) => void;
  onSave: (id: string, msg: string) => void;
  saving: string | null;
}

/* ── PLAN CONFIGURATION ──────────────────────────────────────── */
export function PlanConfigSection({ dirty, markDirty, onSave, saving }: Props) {
  const [activePlan, setActivePlan] = useState<'gold' | 'silver' | 'basic' | 'thiqa'>('gold');
  const [copays, setCopays] = useState({
    gp: '10', specialist: '10', emergency: '0', lab: '10', radiology: '10',
    pharmaGeneric: '10', pharmaBrand: '20', physio: '10', mental: '10',
    dental: '50', tele: '10',
  });
  const [covered, setCovered] = useState({
    gp: true, specialist: true, emergency: true, lab: true, radiology: true,
    pharmaGeneric: true, pharmaBrand: true, physio: true, mental: true,
    dentalEmergency: true, dentalCosmetic: false, optical: false, fertility: false,
    cosmetic: false, tele: true, altMed: false,
  });
  const [annualLimit, setAnnualLimit] = useState('500000');
  const [showConfirm, setShowConfirm] = useState(false);

  const PLANS = [
    { id: 'gold',   label: 'Daman Gold',   members: 2847, limit: 'AED 500,000', copay: '10%',  color: '#D97706', bg: '#FFFBEB' },
    { id: 'silver', label: 'Daman Silver', members: 3104, limit: 'AED 150,000', copay: '30%',  color: '#64748B', bg: '#F8FAFC' },
    { id: 'basic',  label: 'Daman Basic',  members: 1896, limit: 'AED 75,000',  copay: '20%',  color: '#0284C7', bg: '#EFF6FF' },
    { id: 'thiqa',  label: 'Thiqa',        members: 400,  limit: 'AED 1,000,000', copay: '0%', color: '#059669', bg: '#ECFDF5' },
  ] as const;

  const COPAY_ROWS = [
    { key: 'gp', label: 'General Consultation', locked: false },
    { key: 'specialist', label: 'Specialist Consultation', locked: false },
    { key: 'emergency', label: 'Emergency', locked: true, note: 'Emergency must be 0% per UAE law' },
    { key: 'lab', label: 'Lab Tests', locked: false },
    { key: 'radiology', label: 'Radiology / Imaging', locked: false },
    { key: 'pharmaGeneric', label: 'Pharmacy — Generic', locked: false },
    { key: 'pharmaBrand', label: 'Pharmacy — Brand', locked: false },
    { key: 'physio', label: 'Physiotherapy', locked: false },
    { key: 'mental', label: 'Mental Health', locked: false },
    { key: 'dental', label: 'Dental (emergency)', locked: false },
    { key: 'tele', label: 'Teleconsultation', locked: false },
  ] as const;

  const COVERED_ROWS: { key: keyof typeof covered; label: string; locked?: boolean; lockNote?: string }[] = [
    { key: 'gp', label: 'General Practice' },
    { key: 'specialist', label: 'Specialist Consultations' },
    { key: 'emergency', label: 'Emergency Care', locked: true, lockNote: 'Mandatory by UAE law' },
    { key: 'lab', label: 'Lab Tests' },
    { key: 'radiology', label: 'Radiology' },
    { key: 'pharmaGeneric', label: 'Pharmacy (generic)' },
    { key: 'pharmaBrand', label: 'Pharmacy (brand)' },
    { key: 'physio', label: 'Physiotherapy' },
    { key: 'mental', label: 'Mental Health' },
    { key: 'dentalEmergency', label: 'Dental (emergency only)' },
    { key: 'dentalCosmetic', label: 'Dental (cosmetic)', locked: true, lockNote: 'Cosmetic dental excluded per policy' },
    { key: 'optical', label: 'Optical' },
    { key: 'fertility', label: 'Fertility Treatment', locked: true, lockNote: 'Excluded per policy' },
    { key: 'cosmetic', label: 'Cosmetic Procedures', locked: true, lockNote: 'Cosmetic exclusion — cannot be enabled' },
    { key: 'tele', label: 'Teleconsultation' },
    { key: 'altMed', label: 'Alternative Medicine' },
  ];

  const currentPlanData = PLANS.find(p => p.id === activePlan)!;

  return (
    <SectionCard
      id="plan-config"
      icon={<CreditCard size={20} color="#1E3A5F" />}
      title="Plan Configuration"
      desc="Manage Daman insurance plan coverage rules on CeenAiX"
      hasChanges={dirty['plan-config']}
      onSave={() => setShowConfirm(true)}
      saving={saving === 'plan-config'}
    >
      <InfoCard color="amber" icon={<AlertTriangle size={14} />}>
        <strong>Plan configuration affects all 8,247 members.</strong> Changes take effect immediately. Contact CeenAiX admin before making coverage changes.
      </InfoCard>

      {/* Plan tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid #F1F5F9', paddingBottom: 0 }}>
        {PLANS.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePlan(p.id)}
            style={{
              padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: activePlan === p.id ? 700 : 500,
              color: activePlan === p.id ? '#1E3A5F' : '#64748B',
              borderBottom: activePlan === p.id ? '2px solid #1E3A5F' : '2px solid transparent',
              marginBottom: -1,
            }}
          >{p.label}</button>
        ))}
      </div>

      {/* Plan overview */}
      <div style={{ padding: '14px 16px', borderRadius: 10, background: '#F0F9FF', border: '1px solid #BAE6FD', marginBottom: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>PLAN</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{currentPlanData.label}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>MEMBERS</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', fontFamily: 'DM Mono, monospace' }}>{currentPlanData.members.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>ANNUAL LIMIT</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#059669', fontFamily: 'DM Mono, monospace' }}>{currentPlanData.limit}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>BASE CO-PAY</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#0D9488', fontFamily: 'DM Mono, monospace' }}>{currentPlanData.copay}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>STATUS</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#059669' }}>✅ Active</div>
        </div>
      </div>

      {/* Co-pay rates */}
      <SectionLabel>Co-pay Rates by Service Type</SectionLabel>
      {COPAY_ROWS.map(row => (
        <div key={row.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F9FAFB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{row.label}</span>
            {row.locked && <Lock size={11} color="#F59E0B" />}
            {row.locked && row.note && <span style={{ fontSize: 10, color: '#D97706', fontStyle: 'italic' }}>{row.note}</span>}
          </div>
          <SettingsInput
            value={copays[row.key]}
            onChange={v => { setCopays(prev => ({ ...prev, [row.key]: v })); markDirty('plan-config'); }}
            unit="%"
            width={60}
            mono
            readOnly={row.locked}
          />
        </div>
      ))}

      {/* Annual limit */}
      <SectionLabel>Benefit Limits</SectionLabel>
      <SettingRow label="Annual Limit (AED)" desc={`Change affects all ${currentPlanData.members.toLocaleString()} ${currentPlanData.label} members`}>
        <SettingsInput value={annualLimit} onChange={v => { setAnnualLimit(v); markDirty('plan-config'); }} mono width={120} unit="AED" />
      </SettingRow>

      {/* PA Rules */}
      <SectionLabel>Pre-Auth Requirements</SectionLabel>
      {[
        { label: 'MRI / CT Imaging — PA required', value: true, locked: true, note: 'MRI/CT pre-auth required per DHA' },
        { label: 'Elective Surgery — PA required', value: true, locked: true, note: '' },
        { label: 'Emergency Procedures — PA required', value: false, locked: true, note: 'Emergency care proceeds without PA' },
      ].map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F9FAFB' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{r.label}</span>
              <Lock size={11} color="#F59E0B" />
            </div>
            {r.note && <div style={{ fontSize: 11, color: '#D97706', fontStyle: 'italic', marginTop: 2 }}>{r.note}</div>}
          </div>
          <Toggle checked={r.value} locked lockedColor={r.value ? '#F59E0B' : '#CBD5E1'} />
        </div>
      ))}

      {/* Covered services */}
      <SectionLabel>Covered Services</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        {COVERED_ROWS.map(r => (
          <div key={r.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: r.locked && !covered[r.key] ? 'rgba(254,243,199,0.2)' : '#F9FAFB' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: '#374151' }}>
                {r.label}
                {r.locked && <Lock size={10} color="#F59E0B" />}
              </div>
              {r.lockNote && <div style={{ fontSize: 10, color: '#D97706', fontStyle: 'italic' }}>{r.lockNote}</div>}
            </div>
            <Toggle
              checked={covered[r.key]}
              locked={r.locked}
              lockedColor={covered[r.key] ? '#F59E0B' : '#CBD5E1'}
              onChange={v => { setCovered(prev => ({ ...prev, [r.key]: v })); markDirty('plan-config'); }}
            />
          </div>
        ))}
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: 380, boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Confirm Plan Changes</div>
            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
              Saving this will affect <strong>{currentPlanData.members.toLocaleString()} {currentPlanData.label} members</strong>. Are you sure?
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: '10px 0', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowConfirm(false); onSave('plan-config', `${currentPlanData.label} plan configuration saved`); }} style={{ flex: 1, padding: '10px 0', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>✅ Confirm Save</button>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

/* ── PRE-AUTH & SLA ─────────────────────────────────────────── */
export function PreAuthSlaSection({ dirty, markDirty, onSave, saving }: Props) {
  const [urgentTarget, setUrgentTarget] = useState('2');
  const [highTarget, setHighTarget] = useState('4');
  const [stdTarget, setStdTarget] = useState('12');
  const [bulkThreshold, setBulkThreshold] = useState('90');
  const [responseWindow, setResponseWindow] = useState('3');
  const [validityDays, setValidityDays] = useState('30');
  const [escalateAfter, setEscalateAfter] = useState('2');
  const [queueOrder, setQueueOrder] = useState('urgency');
  const [emailEscalation, setEmailEscalation] = useState(true);
  const [smsEscalation, setSmsEscalation] = useState(false);

  return (
    <SectionCard
      id="preauth-sla"
      icon={<ClipboardList size={20} color="#1E3A5F" />}
      title="Pre-Auth & SLA"
      desc="Configure SLA targets and pre-authorization workflow"
      hasChanges={dirty['preauth-sla']}
      onSave={() => onSave('preauth-sla', 'Pre-auth SLA settings saved')}
      saving={saving === 'preauth-sla'}
    >
      {/* DHA locked SLA */}
      <div style={{ padding: '14px 16px', borderRadius: 10, background: '#FFFBEB', border: '1px solid #FDE68A', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Lock size={13} color="#F59E0B" />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>DHA Mandated SLA Targets — Cannot Be Changed</span>
        </div>
        {[
          { type: 'Urgent pre-auth', time: '4 hours', note: 'DHA Insurance Law Art. 34' },
          { type: 'High priority', time: '8 hours', note: 'DHA mandate' },
          { type: 'Standard', time: '24 hours', note: 'DHA mandate' },
          { type: 'Emergency', time: 'Immediate', note: 'No PA required' },
        ].map(r => (
          <div key={r.type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(253,230,138,0.5)' }}>
            <span style={{ fontSize: 12, color: '#92400E' }}>{r.type}</span>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E', fontFamily: 'DM Mono, monospace' }}>{r.time}</span>
              <span style={{ fontSize: 11, color: '#B45309' }}>{r.note}</span>
            </div>
          </div>
        ))}
        <div style={{ fontSize: 11, color: '#92400E', fontStyle: 'italic', marginTop: 8 }}>
          These SLA targets are set by UAE DHA regulation and cannot be modified.
        </div>
      </div>

      <SectionLabel>Daman Internal Targets</SectionLabel>
      <SettingRow label="Urgent (internal goal)" desc="DHA limit: 4h — buffer ensures compliance">
        <SettingsInput value={urgentTarget} onChange={v => { setUrgentTarget(v); markDirty('preauth-sla'); }} unit="hours" mono width={60} />
      </SettingRow>
      <SettingRow label="High Priority" desc="DHA limit: 8h">
        <SettingsInput value={highTarget} onChange={v => { setHighTarget(v); markDirty('preauth-sla'); }} unit="hours" mono width={60} />
      </SettingRow>
      <SettingRow label="Standard" desc="DHA limit: 24h">
        <SettingsInput value={stdTarget} onChange={v => { setStdTarget(v); markDirty('preauth-sla'); }} unit="hours" mono width={60} />
      </SettingRow>
      <InfoCard color="emerald">Buffer time protects against SLA breaches and DHA penalties.</InfoCard>

      <SectionLabel>Breach Response Actions</SectionLabel>
      {[
        { label: 'Alert in portal top bar', locked: true },
        { label: 'Push notification to claims team', locked: true },
        { label: 'Auto-log in DHA compliance record', locked: true },
        { label: 'Email alert to department head', locked: false, checked: emailEscalation, onChange: (v: boolean) => { setEmailEscalation(v); markDirty('preauth-sla'); } },
        { label: 'SMS alert to medical director', locked: false, checked: smsEscalation, onChange: (v: boolean) => { setSmsEscalation(v); markDirty('preauth-sla'); } },
      ].map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F9FAFB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#374151' }}>{r.label}</span>
            {r.locked && <Lock size={11} color="#F59E0B" />}
          </div>
          <Toggle
            checked={r.locked ? true : (r.checked ?? false)}
            locked={r.locked}
            onChange={r.onChange ?? (() => {})}
          />
        </div>
      ))}
      <SettingRow label="Auto-escalation threshold" desc="Escalate to medical director if not resolved within:">
        <SettingsInput value={escalateAfter} onChange={v => { setEscalateAfter(v); markDirty('preauth-sla'); }} unit="hours overdue" mono width={60} />
      </SettingRow>

      <SectionLabel>Pre-Auth Workflow</SectionLabel>
      <SettingRow label="Queue Order" desc="How PA requests are sorted in the queue">
        <RadioGroup
          name="queue-order"
          value={queueOrder}
          onChange={v => { setQueueOrder(v); markDirty('preauth-sla'); }}
          options={[
            { value: 'urgency', label: 'Urgency (SLA remaining)' },
            { value: 'time', label: 'Submission time (FIFO)' },
            { value: 'risk', label: 'Risk level (high-cost first)' },
          ]}
        />
      </SettingRow>
      <SettingRow label="Bulk Approve AI Threshold" desc="Allow bulk approve when AI confidence ≥ this value">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          <SettingsInput value={bulkThreshold} onChange={v => { setBulkThreshold(v); markDirty('preauth-sla'); }} unit="%" mono width={70} changed={dirty['preauth-sla']} />
          {Number(bulkThreshold) < 85 && (
            <div style={{ fontSize: 11, color: '#D97706', fontStyle: 'italic', textAlign: 'right' }}>⚠️ Below 85% not recommended</div>
          )}
        </div>
      </SettingRow>
      <SettingRow label="Info Request Response Window" desc="Doctor must respond to information requests within:">
        <SettingsInput value={responseWindow} onChange={v => { setResponseWindow(v); markDirty('preauth-sla'); }} unit="business days" mono width={60} />
      </SettingRow>
      <SettingRow label="Approved PA Validity" desc="Standard validity period for approved pre-authorizations" last>
        <SettingsInput value={validityDays} onChange={v => { setValidityDays(v); markDirty('preauth-sla'); }} unit="days" mono width={60} />
      </SettingRow>
    </SectionCard>
  );
}

/* ── AI & AUTOMATION ──────────────────────────────────────────── */
export function AIAutomationSection({ dirty, markDirty, onSave, saving }: Props) {
  const [showRecs, setShowRecs] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);
  const [showReasoning, setShowReasoning] = useState(true);
  const [autoApproveThreshold, setAutoApproveThreshold] = useState('90');
  const [autoDenyThreshold, setAutoDenyThreshold] = useState('99');
  const [autoDenyReason, setAutoDenyReason] = useState(true);
  const [fraudSensitivity, setFraudSensitivity] = useState('medium');
  const [fraudFreezeThreshold, setFraudFreezeThreshold] = useState('90');
  const [fraudEscalateAfter, setFraudEscalateAfter] = useState('24');
  const [aiDropAlert, setAiDropAlert] = useState('85');
  const [fpRateAlert, setFpRateAlert] = useState('8');
  const [monthlyReport, setMonthlyReport] = useState(true);

  const approvalPct = Math.max(0, Math.min(100, (Number(autoApproveThreshold) - 80) / 20 * 100));

  return (
    <SectionCard
      id="ai-automation"
      icon={<Bot size={20} color="#7C3AED" />}
      title="AI & Automation"
      desc="Configure CeenAiX AI behavior for your portal"
      hasChanges={dirty['ai-automation']}
      onSave={() => onSave('ai-automation', `AI threshold updated — ${autoApproveThreshold}% confidence required`)}
      saving={saving === 'ai-automation'}
    >
      {/* AI Status */}
      <div style={{ padding: '14px 16px', borderRadius: 10, background: '#F5F3FF', border: '1px solid #DDD6FE', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <Bot size={20} color="#7C3AED" style={{ animation: 'aiPulse 2s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: '2px solid rgba(124,58,237,0.3)', animation: 'ring 2s ease-in-out infinite' }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#4C1D95' }}>CeenAiX AI · claude-sonnet-4 · Production</div>
          <div style={{ fontSize: 12, color: '#6D28D9' }}>AI is active and processing all claims and pre-auths</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#059669', marginTop: 2 }}>✅ Operational · 99.98% uptime</div>
        </div>
      </div>

      <SectionLabel>AI Recommendations</SectionLabel>
      <SettingRow label="Enable AI recommendations on pre-auth" desc="Show ✅ AI: APPROVE / ⚠️ AI: REVIEW / ❌ AI: DENY badges">
        <Toggle checked={showRecs} onChange={v => { setShowRecs(v); markDirty('ai-automation'); }} />
      </SettingRow>
      <SettingRow label="Show AI confidence score" desc="Display confidence % (e.g., 98%) on badges">
        <Toggle checked={showConfidence} onChange={v => { setShowConfidence(v); markDirty('ai-automation'); }} />
      </SettingRow>
      <SettingRow label="Show AI reasoning tooltip" desc="Hover on badge shows full AI reasoning">
        <Toggle checked={showReasoning} onChange={v => { setShowReasoning(v); markDirty('ai-automation'); }} />
      </SettingRow>

      <SectionLabel>Automated Claim Processing</SectionLabel>
      <SettingRow label="Auto-approve threshold" desc="Claims where AI confidence ≥ this are auto-approved">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', minWidth: 160 }}>
          <SettingsInput value={autoApproveThreshold} onChange={v => { setAutoApproveThreshold(v); markDirty('ai-automation'); }} unit="%" mono width={70} changed={dirty['ai-automation']} />
          <div style={{ width: 160, background: '#E2E8F0', borderRadius: 4, height: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${approvalPct}%`, background: '#0D9488', borderRadius: 4, transition: 'width 0.2s' }} />
          </div>
          <div style={{ fontSize: 10, color: '#0D9488', fontFamily: 'DM Mono, monospace' }}>At {autoApproveThreshold}%: ~{Math.round(approvalPct * 0.78 + 20)}% claims auto-approved</div>
          {Number(autoApproveThreshold) < 85 && (
            <div style={{ fontSize: 11, color: '#D97706', fontStyle: 'italic', textAlign: 'right' }}>⚠️ Below 85% significantly increases false positives</div>
          )}
        </div>
      </SettingRow>
      <SettingRow label="Auto-deny threshold" desc="Only deny automatically when AI is near-certain (e.g., clear plan exclusions)">
        <SettingsInput value={autoDenyThreshold} onChange={v => { setAutoDenyThreshold(v); markDirty('ai-automation'); }} unit="%" mono width={70} />
      </SettingRow>
      <SettingRow label="Auto-denials include AI reasoning in EOB">
        <Toggle checked={autoDenyReason} onChange={v => { setAutoDenyReason(v); markDirty('ai-automation'); }} />
      </SettingRow>

      <SectionLabel>AI Fraud Detection</SectionLabel>
      <SettingRow label="Fraud detection" desc="Required for Daman compliance" locked lockedNote="Required for Daman compliance">
        <Toggle checked={true} locked />
      </SettingRow>
      <SettingRow label="Fraud detection sensitivity">
        <RadioGroup
          name="fraud-sensitivity"
          value={fraudSensitivity}
          onChange={v => { setFraudSensitivity(v); markDirty('ai-automation'); }}
          options={[
            { value: 'low', label: 'Low — fewer alerts, lower false positives' },
            { value: 'medium', label: 'Medium — balanced (recommended)' },
            { value: 'high', label: 'High — more alerts, higher false positive rate' },
          ]}
        />
      </SettingRow>
      <SettingRow label="Auto-freeze threshold" desc="Claims automatically frozen pending review">
        <SettingsInput value={fraudFreezeThreshold} onChange={v => { setFraudFreezeThreshold(v); markDirty('ai-automation'); }} unit="%" mono width={70} />
      </SettingRow>
      <SettingRow label="Fraud alert escalation" desc="If not reviewed by investigator within:">
        <SettingsInput value={fraudEscalateAfter} onChange={v => { setFraudEscalateAfter(v); markDirty('ai-automation'); }} unit="hours" mono width={70} />
      </SettingRow>

      <SectionLabel>AI Performance Alerts</SectionLabel>
      <SettingRow label="Alert when AI accuracy drops below" desc="True positive rate">
        <SettingsInput value={aiDropAlert} onChange={v => { setAiDropAlert(v); markDirty('ai-automation'); }} unit="%" mono width={70} />
      </SettingRow>
      <SettingRow label="Alert when false positive rate exceeds" desc="Higher = AI triggering too many alerts">
        <SettingsInput value={fpRateAlert} onChange={v => { setFpRateAlert(v); markDirty('ai-automation'); }} unit="%" mono width={70} />
      </SettingRow>
      <SettingRow label="Monthly AI performance report" desc="Auto-generated first of month → sent to your email" last>
        <Toggle checked={monthlyReport} onChange={v => { setMonthlyReport(v); markDirty('ai-automation'); }} />
      </SettingRow>
    </SectionCard>
  );
}

/* ── FRAUD DETECTION ──────────────────────────────────────────── */
export function FraudDetectionSection({ dirty, markDirty, onSave, saving }: Props) {
  const [claimsPerDay, setClaimsPerDay] = useState('20');
  const [valueVariance, setValueVariance] = useState('10');
  const [nabidhMatchRate, setNabidhMatchRate] = useState('70');
  const [dupDays, setDupDays] = useState('30');
  const [dupMultiDays, setDupMultiDays] = useState('7');
  const [upcodeRate, setUpcodeRate] = useState('40');
  const [afterHours, setAfterHours] = useState(true);
  const [dhaNotify, setDhaNotify] = useState('confidence');
  const [dhaReminder, setDhaReminder] = useState('48');

  return (
    <SectionCard
      id="fraud-detection"
      icon={<AlertTriangle size={20} color="#DC2626" />}
      title="Fraud Detection"
      desc="Configure fraud monitoring rules and thresholds"
      hasChanges={dirty['fraud-detection']}
      onSave={() => onSave('fraud-detection', 'Fraud detection settings saved')}
      saving={saving === 'fraud-detection'}
    >
      <SectionLabel>Anomalous Volume Detection</SectionLabel>
      <SettingRow label="Flag provider if claims/day exceeds" desc="Network avg: 6/day · Absolute max: ~15/day">
        <SettingsInput value={claimsPerDay} onChange={v => { setClaimsPerDay(v); markDirty('fraud-detection'); }} unit="claims/day" mono width={70} />
      </SettingRow>
      <SettingRow label="Flag if claim value variance below" desc="Identical amounts = billing fraud signal">
        <SettingsInput value={valueVariance} onChange={v => { setValueVariance(v); markDirty('fraud-detection'); }} unit="%" mono width={70} />
      </SettingRow>

      <SectionLabel>Nabidh Verification Thresholds</SectionLabel>
      <SettingRow label="Flag provider if Nabidh match rate below" desc="Network avg: 91.4% · <70% = strong fraud indicator">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          <SettingsInput value={nabidhMatchRate} onChange={v => { setNabidhMatchRate(v); markDirty('fraud-detection'); }} unit="%" mono width={70} />
          <div style={{ fontSize: 10, color: '#EF4444', fontStyle: 'italic', background: '#FEF2F2', padding: '3px 8px', borderRadius: 4 }}>Dr. Khalid Ibrahim: 0% → auto-escalated</div>
        </div>
      </SettingRow>

      <SectionLabel>Duplicate Detection</SectionLabel>
      <SettingRow label="Flag same procedure, same patient within" desc="Same CPT + same patient = duplicate">
        <SettingsInput value={dupDays} onChange={v => { setDupDays(v); markDirty('fraud-detection'); }} unit="days" mono width={70} />
      </SettingRow>
      <SettingRow label="Flag same procedure, multiple providers within" desc="Catches coordinated billing rings">
        <SettingsInput value={dupMultiDays} onChange={v => { setDupMultiDays(v); markDirty('fraud-detection'); }} unit="days" mono width={70} />
      </SettingRow>

      <SectionLabel>Billing Patterns</SectionLabel>
      <SettingRow label="Flag if CPT 99215 rate exceeds" desc="Network avg: 18% · >40% = systematic upcoding">
        <SettingsInput value={upcodeRate} onChange={v => { setUpcodeRate(v); markDirty('fraud-detection'); }} unit="%" mono width={70} />
      </SettingRow>
      <SettingRow label="Flag out-of-hours claims" desc="Claims between 11 PM and 6 AM if >50% from provider">
        <Toggle checked={afterHours} onChange={v => { setAfterHours(v); markDirty('fraud-detection'); }} />
      </SettingRow>

      <SectionLabel>DHA Fraud Reporting</SectionLabel>
      <SettingRow label="Auto-notify DHA for HIGH-confidence cases">
        <RadioGroup
          name="dha-fraud"
          value={dhaNotify}
          onChange={v => { setDhaNotify(v); markDirty('fraud-detection'); }}
          options={[
            { value: 'never', label: 'Never (manual only)' },
            { value: 'confidence', label: 'When AI confidence >90% (recommended)' },
            { value: 'always', label: 'Always (for all flagged cases)' },
          ]}
        />
      </SettingRow>
      <SettingRow label="DHA submission deadline reminder" desc="Remind before DHA fraud reporting deadline" last>
        <SettingsInput value={dhaReminder} onChange={v => { setDhaReminder(v); markDirty('fraud-detection'); }} unit="hours before" mono width={70} />
      </SettingRow>
    </SectionCard>
  );
}
