import React from 'react';
import { Lock } from 'lucide-react';

/* ── Toggle ───────────────────────────────────────────────────── */
interface ToggleProps {
  checked: boolean;
  onChange?: (v: boolean) => void;
  locked?: boolean;
  lockedColor?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, locked, lockedColor = '#F59E0B', disabled }: ToggleProps) {
  const isDisabled = locked || disabled;
  const bg = checked
    ? (locked ? lockedColor : '#0D9488')
    : '#CBD5E1';
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={isDisabled}
      onClick={() => !isDisabled && onChange?.(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: isDisabled ? 'not-allowed' : 'pointer',
        background: bg, position: 'relative', flexShrink: 0, transition: 'background 200ms',
        padding: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: 9, background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 200ms ease',
      }} />
    </button>
  );
}

/* ── SettingRow ───────────────────────────────────────────────── */
interface SettingRowProps {
  label: string;
  desc?: string;
  locked?: boolean;
  lockedNote?: string;
  amber?: boolean;
  last?: boolean;
  children: React.ReactNode;
}

export function SettingRow({ label, desc, locked, lockedNote, amber, last, children }: SettingRowProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0', gap: 16,
      borderBottom: last ? 'none' : '1px solid #F9FAFB',
      background: amber ? 'rgba(254,243,199,0.3)' : 'transparent',
      minHeight: 52,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{label}</span>
          {locked && <Lock size={12} color="#F59E0B" />}
        </div>
        {desc && <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2, lineHeight: 1.4 }}>{desc}</div>}
        {locked && lockedNote && (
          <div style={{ fontSize: 10, color: '#D97706', fontStyle: 'italic', marginTop: 2 }}>{lockedNote}</div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

/* ── SectionLabel ─────────────────────────────────────────────── */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, marginTop: 16, fontFamily: 'Inter, sans-serif' }}>
      {children}
    </div>
  );
}

/* ── InfoCard ─────────────────────────────────────────────────── */
interface InfoCardProps {
  color: 'amber' | 'blue' | 'emerald' | 'violet' | 'red';
  icon?: React.ReactNode;
  children: React.ReactNode;
}
const INFO_COLORS = {
  amber:   { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
  blue:    { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
  emerald: { bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46' },
  violet:  { bg: '#F5F3FF', border: '#DDD6FE', text: '#4C1D95' },
  red:     { bg: '#FEF2F2', border: '#FECACA', text: '#7F1D1D' },
};

export function InfoCard({ color, icon, children }: InfoCardProps) {
  const c = INFO_COLORS[color];
  return (
    <div style={{ padding: '12px 14px', borderRadius: 10, background: c.bg, border: `1px solid ${c.border}`, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: c.text, fontSize: 12, lineHeight: 1.5 }}>
        {icon && <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>}
        <div>{children}</div>
      </div>
    </div>
  );
}

/* ── SettingsInput ────────────────────────────────────────────── */
interface SettingsInputProps {
  value: string | number;
  onChange: (v: string) => void;
  unit?: string;
  width?: number;
  mono?: boolean;
  readOnly?: boolean;
  type?: string;
  placeholder?: string;
  changed?: boolean;
}

export function SettingsInput({ value, onChange, unit, width = 80, mono, readOnly, type = 'text', placeholder, changed }: SettingsInputProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        style={{
          width, height: 36, padding: '0 10px',
          borderRadius: 8, fontSize: 13, outline: 'none',
          fontFamily: mono ? 'DM Mono, monospace' : 'Inter, sans-serif',
          background: readOnly ? '#F8FAFC' : '#F8FAFC',
          border: changed ? '1.5px solid #0D9488' : '1px solid #E2E8F0',
          color: readOnly ? '#94A3B8' : '#0F172A',
          cursor: readOnly ? 'not-allowed' : 'text',
          boxSizing: 'border-box',
        }}
      />
      {unit && <span style={{ fontSize: 12, color: '#64748B', whiteSpace: 'nowrap' }}>{unit}</span>}
    </div>
  );
}

/* ── SettingsSelect ───────────────────────────────────────────── */
interface SettingsSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  width?: number;
  changed?: boolean;
}

export function SettingsSelect({ value, onChange, options, width = 160, changed }: SettingsSelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width, height: 36, padding: '0 10px',
        borderRadius: 8, fontSize: 13,
        background: '#F8FAFC', border: changed ? '1.5px solid #0D9488' : '1px solid #E2E8F0',
        color: '#0F172A', outline: 'none', cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

/* ── SectionCard ──────────────────────────────────────────────── */
interface SectionCardProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc?: string;
  children: React.ReactNode;
  hasChanges?: boolean;
  onSave?: () => void;
  saving?: boolean;
}

export function SectionCard({ id, icon, title, desc, children, hasChanges, onSave, saving }: SectionCardProps) {
  return (
    <div
      id={id}
      style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 16, marginBottom: 24, padding: 24, boxShadow: '0 1px 6px rgba(15,45,74,0.08)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
          </div>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A' }}>{title}</div>
            {desc && <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{desc}</div>}
          </div>
        </div>
        {hasChanges && (
          <button
            onClick={onSave}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
              background: saving ? '#94A3B8' : '#1E3A5F', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              animation: saving ? 'none' : 'savePulse 2s ease-in-out infinite',
              whiteSpace: 'nowrap',
            }}
          >
            {saving ? '...' : '💾 Save'}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── RadioGroup ──────────────────────────────────────────────── */
interface RadioOption { value: string; label: string; desc?: string }
interface RadioGroupProps {
  value: string;
  onChange: (v: string) => void;
  options: RadioOption[];
  name: string;
}

export function RadioGroup({ value, onChange, options, name }: RadioGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map(opt => (
        <label key={opt.value} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
          <div
            onClick={() => onChange(opt.value)}
            style={{
              width: 16, height: 16, borderRadius: '50%', border: `2px solid ${value === opt.value ? '#0D9488' : '#CBD5E1'}`,
              background: value === opt.value ? '#0D9488' : '#fff',
              flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {value === opt.value && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
          </div>
          <div onClick={() => onChange(opt.value)}>
            <div style={{ fontSize: 13, color: '#374151', fontWeight: value === opt.value ? 600 : 400 }}>{opt.label}</div>
            {opt.desc && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{opt.desc}</div>}
          </div>
        </label>
      ))}
    </div>
  );
}

/* ── CheckboxRow ──────────────────────────────────────────────── */
interface CheckboxRowProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc?: string;
  locked?: boolean;
}

export function CheckboxRow({ checked, onChange, label, desc, locked }: CheckboxRowProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: locked ? 'not-allowed' : 'pointer', padding: '6px 0' }}>
      <input
        type="checkbox"
        checked={checked}
        disabled={locked}
        onChange={e => !locked && onChange(e.target.checked)}
        style={{ width: 15, height: 15, accentColor: '#0D9488', marginTop: 2, flexShrink: 0 }}
      />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#374151' }}>
          {label}
          {locked && <Lock size={11} color="#F59E0B" />}
        </div>
        {desc && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{desc}</div>}
      </div>
    </label>
  );
}

/* ── SmallBtn ─────────────────────────────────────────────────── */
interface SmallBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'navy' | 'teal' | 'amber' | 'red';
}

const BTN_STYLES = {
  default: { bg: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0' },
  navy:    { bg: '#1E3A5F', color: '#fff',    border: '1px solid #1E3A5F' },
  teal:    { bg: '#F0FDFA', color: '#0D9488', border: '1px solid #99F6E4' },
  amber:   { bg: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A' },
  red:     { bg: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA' },
};

export function SmallBtn({ children, onClick, variant = 'default' }: SmallBtnProps) {
  const s = BTN_STYLES[variant];
  return (
    <button
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: s.bg, color: s.color, border: s.border, whiteSpace: 'nowrap' }}
    >
      {children}
    </button>
  );
}
