import React from 'react';
import { Lock } from 'lucide-react';

/* ── Toggle ─────────────────────────────────────────────────────── */
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
        background: bg, position: 'relative', flexShrink: 0,
        transition: 'background 200ms',
        opacity: isDisabled && !locked ? 0.5 : 1,
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: checked ? 22 : 2,
        width: 20, height: 20, borderRadius: 10, background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 200ms',
      }} />
    </button>
  );
}

/* ── LockedBadge ─────────────────────────────────────────────────── */
export function LockedNote({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
      <Lock size={10} color="#D97706" />
      <span style={{ fontSize: 10, color: '#D97706', fontStyle: 'italic', fontFamily: 'Inter, sans-serif' }}>{text}</span>
    </div>
  );
}

/* ── SettingRow ──────────────────────────────────────────────────── */
interface SettingRowProps {
  label: string;
  description?: string;
  control: React.ReactNode;
  locked?: boolean;
  lockedNote?: string;
  last?: boolean;
  changed?: boolean;
}

export function SettingRow({ label, description, control, locked, lockedNote, last, changed }: SettingRowProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      minHeight: 52, paddingTop: 10, paddingBottom: 10,
      borderBottom: last ? 'none' : '1px solid #F9FAFB',
      background: locked ? 'rgba(255,251,235,0.5)' : (changed ? 'rgba(13,148,136,0.03)' : 'transparent'),
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>{label}</span>
          {locked && <Lock size={12} color="#D97706" />}
        </div>
        {description && (
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2, fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>{description}</div>
        )}
        {lockedNote && <LockedNote text={lockedNote} />}
      </div>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        {control}
      </div>
    </div>
  );
}

/* ── SectionLabel ────────────────────────────────────────────────── */
export function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase',
      letterSpacing: '0.08em', fontFamily: 'Inter, sans-serif',
      marginTop: 20, marginBottom: 8,
    }}>
      {text}
    </div>
  );
}

/* ── NumericInput ────────────────────────────────────────────────── */
interface NumericInputProps {
  value: string | number;
  onChange?: (v: string) => void;
  unit?: string;
  width?: number;
  mono?: boolean;
  locked?: boolean;
}

export function NumericInput({ value, onChange, unit, width = 80, mono = true, locked }: NumericInputProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <input
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={locked}
        style={{
          width, height: 36, padding: '0 10px',
          borderRadius: 8, border: '1px solid #E2E8F0',
          background: locked ? '#F8FAFC' : '#F8FAFC',
          fontFamily: mono ? 'DM Mono, monospace' : 'Inter, sans-serif',
          fontSize: 13, fontWeight: 600, color: '#0F172A',
          outline: 'none', textAlign: 'center',
          cursor: locked ? 'not-allowed' : 'text',
        }}
        onFocus={e => { if (!locked) e.currentTarget.style.borderColor = '#0D9488'; }}
        onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; }}
      />
      {unit && <span style={{ fontSize: 12, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{unit}</span>}
    </div>
  );
}

/* ── TextInput ───────────────────────────────────────────────────── */
interface TextInputProps {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  width?: number | string;
  locked?: boolean;
  type?: string;
}

export function TextInput({ value, onChange, placeholder, width = 220, locked, type = 'text' }: TextInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={locked}
      style={{
        width, height: 36, padding: '0 12px',
        borderRadius: 8, border: '1px solid #E2E8F0',
        background: locked ? '#F8FAFC' : '#fff',
        fontFamily: 'Inter, sans-serif',
        fontSize: 13, color: locked ? '#94A3B8' : '#0F172A',
        outline: 'none', cursor: locked ? 'not-allowed' : 'text',
        boxSizing: 'border-box',
      }}
      onFocus={e => { if (!locked) e.currentTarget.style.borderColor = '#0D9488'; }}
      onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0'; }}
    />
  );
}

/* ── SelectInput ─────────────────────────────────────────────────── */
interface SelectInputProps {
  value: string;
  onChange?: (v: string) => void;
  options: { value: string; label: string }[];
  width?: number;
}

export function SelectInput({ value, onChange, options, width = 160 }: SelectInputProps) {
  return (
    <select
      value={value}
      onChange={e => onChange?.(e.target.value)}
      style={{
        width, height: 36, padding: '0 10px',
        borderRadius: 8, border: '1px solid #E2E8F0',
        background: '#F8FAFC', fontFamily: 'Inter, sans-serif',
        fontSize: 13, color: '#0F172A', outline: 'none', cursor: 'pointer',
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

/* ── InfoCard ────────────────────────────────────────────────────── */
interface InfoCardProps {
  type: 'amber' | 'blue' | 'emerald' | 'red' | 'violet';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const INFO_COLORS = {
  amber:   { bg: '#FFFBEB', border: '#FDE68A', color: '#92400E' },
  blue:    { bg: '#EFF6FF', border: '#BFDBFE', color: '#1E40AF' },
  emerald: { bg: '#ECFDF5', border: '#A7F3D0', color: '#065F46' },
  red:     { bg: '#FEF2F2', border: '#FECACA', color: '#7F1D1D' },
  violet:  { bg: '#F5F3FF', border: '#DDD6FE', color: '#4C1D95' },
};

export function InfoCard({ type, icon, children }: InfoCardProps) {
  const c = INFO_COLORS[type];
  return (
    <div style={{
      padding: '12px 14px', borderRadius: 10,
      background: c.bg, border: `1px solid ${c.border}`,
      display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12,
    }}>
      {icon && <div style={{ color: c.color, flexShrink: 0, marginTop: 1 }}>{icon}</div>}
      <div style={{ fontSize: 12, color: c.color, fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

/* ── SectionCard ─────────────────────────────────────────────────── */
interface SectionCardProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  onSave?: () => void;
  hasChanges?: boolean;
  children: React.ReactNode;
}

export function SectionCard({ id, icon, title, description, onSave, hasChanges, children }: SectionCardProps) {
  return (
    <div
      id={id}
      style={{
        background: '#fff', borderRadius: 16, marginBottom: 24,
        border: '1px solid #F1F5F9',
        boxShadow: '0 1px 6px rgba(15,45,74,0.06)',
        overflow: 'hidden',
      }}
    >
      <div style={{
        padding: '18px 24px 14px',
        borderBottom: '1px solid #F8FAFC',
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, background: '#EFF6FF',
          border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</div>
          {description && <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2, fontFamily: 'Inter, sans-serif' }}>{description}</div>}
        </div>
        {hasChanges && onSave && (
          <button
            onClick={onSave}
            style={{
              padding: '7px 14px', background: '#0F2D4A', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              animation: 'settingsPulse 2s ease-in-out infinite',
            }}
          >
            💾 Save
          </button>
        )}
      </div>
      <div style={{ padding: '8px 24px 20px' }}>
        {children}
      </div>
    </div>
  );
}

/* ── NotifCheckbox ───────────────────────────────────────────────── */
export function NotifCheckbox({ checked, onChange, locked }: { checked: boolean; onChange?: () => void; locked?: boolean }) {
  return (
    <button
      onClick={() => !locked && onChange?.()}
      disabled={locked}
      style={{
        width: 20, height: 20, borderRadius: 4, border: `1.5px solid ${checked ? '#0D9488' : '#CBD5E1'}`,
        background: checked ? '#0D9488' : '#fff', cursor: locked ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all 0.15s',
      }}
    >
      {checked && <div style={{ width: 10, height: 10, background: '#fff', borderRadius: 2 }} />}
    </button>
  );
}

/* ── RadioGroup ──────────────────────────────────────────────────── */
export function RadioGroup({ options, value, onChange }: {
  options: { value: string; label: string; description?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map(opt => (
        <label key={opt.value} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
          <div
            onClick={() => onChange(opt.value)}
            style={{
              width: 18, height: 18, borderRadius: 9, border: `2px solid ${value === opt.value ? '#0D9488' : '#CBD5E1'}`,
              background: value === opt.value ? '#0D9488' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: 1, cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            {value === opt.value && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }} />}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>{opt.label}</div>
            {opt.description && <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>{opt.description}</div>}
          </div>
        </label>
      ))}
    </div>
  );
}
