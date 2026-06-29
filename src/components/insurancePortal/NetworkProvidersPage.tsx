import React, { useState, useCallback, useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Building2, Search, Filter, ChevronDown, Download, Bell, MapPin, CheckCircle, Clock, AlertTriangle, BarChart3, Star, AlertOctagon, MoreVertical, Eye, BarChart2, Grid2x2 as Grid, List, Map as MapIcon, X, FileText, Users } from 'lucide-react';
import InsuranceSidebar from './InsuranceSidebar';
import ProviderDetailDrawer from './ProviderDetailDrawer';
import CredentialingModal from './CredentialingModal';
import {
  networkProviders, pendingProviders, terminatedProviders, networkSummary,
  NetworkProvider, perfBorderColor, getPerformanceBand, FraudScore, ProviderStatus,
} from '../../data/networkData';

const MONO = "'DM Mono', monospace";
const fmt = (n: number) => n >= 1000 ? `AED ${n.toLocaleString()}` : `AED ${n}`;

type MainTab = 'all' | 'pending' | 'top' | 'review' | 'terminated';
type ViewMode = 'table' | 'cards' | 'map';
type Toast = { id: number; msg: string; type: 'success' | 'warning' | 'info' };

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const statusChip: Record<ProviderStatus, { bg: string; color: string; label: string }> = {
  Active: { bg: '#F0FDF4', color: '#15803D', label: '✅ Active' },
  Pending: { bg: '#FFFBEB', color: '#92400E', label: '⏳ Pending' },
  'Under Review': { bg: '#EFF6FF', color: '#1D4ED8', label: '🔍 Under Review' },
  Flagged: { bg: '#FFF7ED', color: '#9A3412', label: '🚩 Flagged' },
  Suspended: { bg: '#FFF5F5', color: '#DC2626', label: '🔒 Suspended' },
  Terminated: { bg: '#F1F5F9', color: '#64748B', label: '❌ Terminated' },
};

const fraudChip: Record<FraudScore, { bg: string; color: string; label: string }> = {
  LOW: { bg: '#F0FDF4', color: '#15803D', label: '🟢 LOW' },
  MEDIUM: { bg: '#FFFBEB', color: '#92400E', label: '🟡 MEDIUM' },
  HIGH: { bg: '#FFF7ED', color: '#9A3412', label: '🟠 HIGH' },
  ACTIVE: { bg: '#FFF5F5', color: '#DC2626', label: '🔴 ACTIVE' },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function DenialCell({ rate, sparkline, status }: { rate: number; sparkline: { month: string; rate: number }[]; status: ProviderStatus }) {
  const color = rate < 3 ? '#16A34A' : rate < 5 ? '#0D9488' : rate < 7 ? '#D97706' : '#EA580C';
  const lineColor = sparkline.length > 1
    ? sparkline[sparkline.length - 1].rate < sparkline[sparkline.length - 2].rate ? '#16A34A' : '#EF4444'
    : '#94A3B8';
  if (status === 'Pending') return <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>—</span>;
  return (
    <div className="flex flex-col gap-1">
      <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color }}>{rate}%</span>
      {sparkline.length > 1 && (
        <ResponsiveContainer width={40} height={16}>
          <LineChart data={sparkline} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Line dataKey="rate" stroke={lineColor} strokeWidth={1.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ─── TABLE ROW ────────────────────────────────────────────────────────────────
function ProviderRow({ prov, selected, onSelect, onView }: { prov: NetworkProvider; selected: boolean; onSelect: () => void; onView: () => void; }) {
  const band = getPerformanceBand(prov.denialRate, prov.status);
  const border = perfBorderColor[band];
  const sc = statusChip[prov.status];
  const fc = fraudChip[prov.fraudScore];
  const initials = prov.name.replace('Dr. ', '').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  const pulsing = prov.fraudScore === 'ACTIVE';
  const rowBg = prov.fraudScore === 'ACTIVE' ? 'rgba(254,242,242,0.7)' : prov.status === 'Under Review' ? 'rgba(255,251,235,0.5)' : prov.status === 'Pending' ? 'rgba(255,251,235,0.3)' : '#fff';

  return (
    <tr className="group" style={{ borderBottom: '1px solid #F8FAFC', background: selected ? '#EFF6FF' : rowBg, cursor: 'pointer' }}
      onClick={onView}>
      {/* Colored left border via td */}
      <td style={{ width: 4, padding: 0, background: border, position: 'relative' }}>
        {pulsing && <div style={{ position: 'absolute', inset: 0, background: border, animation: 'pulse 1.4s ease-in-out infinite' }} />}
      </td>
      {/* Checkbox */}
      <td className="px-3 py-4" style={{ width: 36 }} onClick={e => { e.stopPropagation(); onSelect(); }}>
        <input type="checkbox" checked={selected} onChange={() => {}} style={{ accentColor: '#1E3A5F', cursor: 'pointer' }} />
      </td>
      {/* Provider */}
      <td className="py-3 pr-3" style={{ width: 200 }}>
        <div className="flex items-center gap-2.5">
          <div className="relative flex-shrink-0">
            <div className="rounded-full flex items-center justify-center" style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #0D9488, #0F766E)', fontFamily: MONO, fontSize: 11, fontWeight: 700, color: '#fff' }}>
              {prov.isOrgRow ? <Building2 size={14} color="#fff" /> : initials}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white" style={{ background: prov.status === 'Active' ? '#16A34A' : prov.status === 'Suspended' ? '#DC2626' : '#F59E0B' }} />
          </div>
          <div className="min-w-0">
            <p style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150 }}>{prov.name}</p>
            <p style={{ fontFamily: MONO, fontSize: 9, color: '#0D9488', marginTop: 1 }}>{prov.dhaNumber}</p>
            <p style={{ fontFamily: MONO, fontSize: 9, color: '#94A3B8', marginTop: 1 }}>{prov.networkSinceDisplay}</p>
            {prov.badges.slice(0, 1).map(b => (
              <span key={b} className="inline-block px-1.5 py-0.5 rounded mt-1" style={{ fontSize: 9, fontFamily: 'Inter, sans-serif', background: '#FFFBEB', color: '#92400E' }}>{b}</span>
            ))}
          </div>
        </div>
      </td>
      {/* Type */}
      <td className="px-2 py-3" style={{ width: 80 }}>
        <span className="px-2 py-0.5 rounded" style={{ fontSize: 9, fontWeight: 700, fontFamily: 'Inter, sans-serif', background: prov.type === 'Hospital' ? '#EFF6FF' : prov.type === 'Pharmacy' ? '#FFFBEB' : prov.type === 'Diagnostic' ? '#F5F3FF' : '#F0FDFA', color: prov.type === 'Hospital' ? '#1D4ED8' : prov.type === 'Pharmacy' ? '#92400E' : prov.type === 'Diagnostic' ? '#6D28D9' : '#0F766E' }}>
          {prov.type}
        </span>
      </td>
      {/* Specialty */}
      <td className="px-2 py-3" style={{ width: 130 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>{prov.specialty}</p>
        {prov.subSpecialty && <p style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>{prov.subSpecialty}</p>}
        {prov.doctorCount !== undefined && <p style={{ fontFamily: MONO, fontSize: 9, color: '#64748B', marginTop: 1 }}>{prov.doctorCount} doctors</p>}
      </td>
      {/* Location */}
      <td className="px-2 py-3" style={{ width: 100 }}>
        <div className="flex items-start gap-1">
          <MapPin size={10} color="#94A3B8" className="mt-0.5 flex-shrink-0" />
          <p style={{ fontSize: 11, color: '#475569', fontFamily: 'Inter, sans-serif' }}>{prov.location}</p>
        </div>
      </td>
      {/* Claims */}
      <td className="px-2 py-3" style={{ width: 80 }}>
        <p style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: '#0D9488' }}>{prov.claimsApril > 0 ? prov.claimsApril.toLocaleString() : '—'}</p>
        {prov.claimsAllTime > 0 && <p style={{ fontFamily: MONO, fontSize: 9, color: '#94A3B8', marginTop: 1 }}>{prov.claimsAllTime.toLocaleString()} all</p>}
      </td>
      {/* Avg */}
      <td className="px-2 py-3" style={{ width: 100 }}>
        {prov.avgClaim > 0 ? (
          <>
            <p style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: '#1E293B' }}>AED {prov.avgClaim.toLocaleString()}</p>
            <p style={{ fontFamily: MONO, fontSize: 9, color: '#94A3B8', marginTop: 1 }}>avg {fmt(prov.specialtyAvgClaim)}</p>
            {prov.avgClaim < prov.specialtyAvgClaim
              ? <p style={{ fontSize: 9, color: '#16A34A', fontFamily: 'Inter, sans-serif', marginTop: 1 }}>✅ below avg</p>
              : <p style={{ fontSize: 9, color: '#D97706', fontFamily: 'Inter, sans-serif', marginTop: 1 }}>⚠️ above avg</p>
            }
          </>
        ) : <span style={{ color: '#94A3B8', fontSize: 11 }}>—</span>}
      </td>
      {/* Denial */}
      <td className="px-2 py-3" style={{ width: 80 }}>
        <DenialCell rate={prov.denialRate} sparkline={prov.denialSparkline} status={prov.status} />
      </td>
      {/* Rating */}
      <td className="px-2 py-3" style={{ width: 72 }}>
        {prov.rating ? (
          <div className="flex items-center gap-1">
            <Star size={12} fill="#F59E0B" color="#F59E0B" />
            <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: '#D97706' }}>{prov.rating}</span>
          </div>
        ) : <span style={{ fontSize: 10, color: '#CBD5E1', fontFamily: 'Inter, sans-serif' }}>—</span>}
      </td>
      {/* Fraud */}
      <td className="px-2 py-3" style={{ width: 90 }}>
        <div>
          <span className="inline-block px-2 py-0.5 rounded" style={{ fontSize: 9, fontWeight: 700, fontFamily: 'Inter, sans-serif', background: fc.bg, color: fc.color, border: pulsing ? `1px solid ${fc.color}` : 'none' }}>{fc.label}</span>
          <p style={{ fontFamily: MONO, fontSize: 9, color: '#94A3B8', marginTop: 2 }}>Score: {prov.fraudNumericScore}/100</p>
          {prov.fraudCaseRef && <p style={{ fontSize: 8, color: '#DC2626', fontFamily: 'Inter, sans-serif', marginTop: 1 }}>{prov.fraudCaseRef}</p>}
        </div>
      </td>
      {/* Status */}
      <td className="px-2 py-3" style={{ width: 110 }}>
        <span className="inline-block px-2 py-0.5 rounded" style={{ fontSize: 9, fontWeight: 700, fontFamily: 'Inter, sans-serif', background: sc.bg, color: sc.color }}>{sc.label}</span>
        {prov.contractExpiry && (
          <p style={{ fontFamily: MONO, fontSize: 9, color: prov.contractExpiryDays < 90 ? '#D97706' : '#94A3B8', marginTop: 3 }}>
            {prov.contractExpiryDays < 90 ? `⚠️ ${prov.contractExpiryDays}d` : `📋 ${prov.contractExpiry}`}
          </p>
        )}
        {prov.reviewNote && (
          <p style={{ fontSize: 8, color: '#D97706', fontFamily: 'Inter, sans-serif', marginTop: 2, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prov.reviewNote}</p>
        )}
      </td>
      {/* Actions */}
      <td className="px-2 py-3" style={{ width: 80 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 rounded-lg hover:bg-slate-100" onClick={onView} title="View"><Eye size={13} color="#475569" /></button>
          <button className="p-1.5 rounded-lg hover:bg-slate-100" title="Report"><BarChart2 size={13} color="#475569" /></button>
          <button className="p-1.5 rounded-lg hover:bg-slate-100" title="More"><MoreVertical size={13} color="#475569" /></button>
        </div>
      </td>
    </tr>
  );
}

// ─── PROVIDER CARD (card view) ────────────────────────────────────────────────
function ProviderCard({ prov, onView }: { prov: NetworkProvider; onView: () => void }) {
  const band = getPerformanceBand(prov.denialRate, prov.status);
  const border = perfBorderColor[band];
  const sc = statusChip[prov.status];
  const fc = fraudChip[prov.fraudScore];
  const initials = prov.name.replace('Dr. ', '').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  const r = 26;
  const circ = 2 * Math.PI * r;
  const fill = prov.overallScore > 0 ? (prov.overallScore / 100) * circ : 0;
  const scoreColor = prov.overallScore >= 85 ? '#16A34A' : prov.overallScore >= 70 ? '#0D9488' : prov.overallScore >= 55 ? '#D97706' : '#DC2626';

  return (
    <div className="rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-md" style={{ background: '#fff', border: '1px solid #E2E8F0' }} onClick={onView}>
      <div style={{ height: 4, background: border }} />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <div className="rounded-full flex items-center justify-center" style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #0D9488, #0F766E)', fontFamily: MONO, fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {prov.isOrgRow ? <Building2 size={16} color="#fff" /> : initials}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white" style={{ background: prov.status === 'Active' ? '#16A34A' : prov.status === 'Suspended' ? '#DC2626' : '#F59E0B' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>{prov.name}</p>
            <p style={{ fontFamily: MONO, fontSize: 9, color: '#0D9488', marginTop: 1 }}>{prov.dhaNumber}</p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              <span style={{ fontSize: 9, fontFamily: 'Inter, sans-serif', background: '#EFF6FF', color: '#1D4ED8', padding: '1px 6px', borderRadius: 4 }}>{prov.specialty}</span>
              <span style={{ fontSize: 9, fontFamily: 'Inter, sans-serif', background: sc.bg, color: sc.color, padding: '1px 6px', borderRadius: 4 }}>{sc.label}</span>
            </div>
          </div>
          {/* Score ring */}
          <div className="flex-shrink-0 relative flex items-center justify-center" style={{ width: 54, height: 54 }}>
            <svg width="54" height="54" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
              <circle cx="27" cy="27" r={r} fill="none" stroke="#F1F5F9" strokeWidth="4" />
              <circle cx="27" cy="27" r={r} fill="none" stroke={scoreColor} strokeWidth="4"
                strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
            </svg>
            <div className="flex flex-col items-center" style={{ position: 'relative', zIndex: 1 }}>
              <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: scoreColor, lineHeight: 1 }}>{prov.overallScore || '—'}</span>
              {prov.overallScore > 0 && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 8, color: '#94A3B8' }}>/100</span>}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          {[
            { label: 'Claims', val: prov.claimsApril > 0 ? prov.claimsApril.toString() : '—', color: '#0D9488' },
            { label: 'Avg', val: prov.avgClaim > 0 ? `${prov.avgClaim}` : '—', color: '#1E293B' },
            { label: 'Denial', val: prov.status !== 'Pending' ? `${prov.denialRate}%` : '—', color: prov.denialRate < 3 ? '#16A34A' : prov.denialRate < 5 ? '#0D9488' : '#D97706' },
          ].map(s => (
            <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: '#F8FAFC' }}>
              <p style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: s.color }}>{s.val}</p>
              <p style={{ fontSize: 9, color: '#94A3B8', fontFamily: 'Inter, sans-serif', marginTop: 1 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span style={{ fontSize: 9, fontFamily: 'Inter, sans-serif', background: fc.bg, color: fc.color, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>{fc.label}</span>
          {prov.rating && (
            <div className="flex items-center gap-1">
              <Star size={11} fill="#F59E0B" color="#F59E0B" />
              <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: '#D97706' }}>{prov.rating}</span>
            </div>
          )}
          <p style={{ fontSize: 9, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>{prov.location.split('·')[0].trim()}</p>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-1.5">
          <button className="flex-1 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#EFF6FF', color: '#1E40AF', fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }} onClick={onView}>👁 Profile</button>
          <button className="flex-1 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#F1F5F9', color: '#475569', fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }}>📊 Perf</button>
          <button className="py-1.5 px-2 rounded-lg" style={{ background: '#F1F5F9', border: 'none', cursor: 'pointer' }}><MoreVertical size={12} color="#64748B" /></button>
        </div>
      </div>
    </div>
  );
}

// ─── MAP VIEW ─────────────────────────────────────────────────────────────────
function MapView() {
  const dots = networkProviders.filter(p => p.status !== 'Terminated');
  const coverage = networkSummary.coverageByEmirate;
  return (
    <div className="flex gap-4 p-4">
      {/* UAE Map SVG */}
      <div className="flex-1 rounded-2xl overflow-hidden relative" style={{ background: '#0F172A', minHeight: 480 }}>
        <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%' }}>
          {/* UAE outline — simplified polygon */}
          <polygon points="400,80 520,90 620,120 700,160 720,200 680,250 650,300 600,340 540,360 500,380 460,420 420,430 380,440 320,430 270,400 240,360 200,320 180,280 200,230 220,180 260,130 320,90" fill="rgba(30,58,95,0.8)" stroke="rgba(147,197,253,0.4)" strokeWidth="1.5" />
          {/* Emirates labels */}
          <text x="580" y="180" fill="rgba(147,197,253,0.6)" fontSize="11" fontFamily="Inter, sans-serif">Dubai</text>
          <text x="350" y="280" fill="rgba(147,197,253,0.5)" fontSize="11" fontFamily="Inter, sans-serif">Abu Dhabi</text>
          <text x="560" y="130" fill="rgba(147,197,253,0.5)" fontSize="10" fontFamily="Inter, sans-serif">Sharjah</text>
          <text x="610" y="230" fill="rgba(147,197,253,0.4)" fontSize="9" fontFamily="Inter, sans-serif">Ajman</text>
          <text x="640" y="270" fill="rgba(147,197,253,0.4)" fontSize="9" fontFamily="Inter, sans-serif">RAK</text>
          <text x="680" y="310" fill="rgba(147,197,253,0.4)" fontSize="9" fontFamily="Inter, sans-serif">Fujairah</text>
          {/* Provider dots */}
          {dots.map(p => {
            const x = (p.mapX / 100) * 800;
            const y = (p.mapY / 100) * 500;
            const r = p.claimsApril > 500 ? 8 : p.claimsApril > 100 ? 6 : 4;
            const color = p.fraudScore === 'ACTIVE' ? '#DC2626' : p.status === 'Under Review' ? '#D97706' : p.overallScore >= 85 ? '#16A34A' : '#0D9488';
            return (
              <g key={p.id}>
                <circle cx={x} cy={y} r={r + 3} fill={color} fillOpacity={0.2} />
                <circle cx={x} cy={y} r={r} fill={color} fillOpacity={0.9} stroke="#0F172A" strokeWidth="1" />
                {p.networkTier === 'Premium' && <text x={x} y={y - r - 3} fill="#FDE68A" fontSize="7" textAnchor="middle">★</text>}
              </g>
            );
          })}
        </svg>
        <div className="absolute bottom-4 left-4 flex flex-col gap-1.5" style={{ background: 'rgba(15,23,42,0.85)', padding: '10px 12px', borderRadius: 10 }}>
          {[
            { color: '#16A34A', label: 'Top Performer' },
            { color: '#0D9488', label: 'Active' },
            { color: '#D97706', label: 'Under Review' },
            { color: '#DC2626', label: 'Fraud / Flagged' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
              <span style={{ fontSize: 10, color: '#CBD5E1', fontFamily: 'Inter, sans-serif' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage panel */}
      <div className="flex flex-col gap-3" style={{ width: 220 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Network Coverage</p>
        {coverage.map(c => (
          <div key={c.emirate} className="flex items-center justify-between">
            <span style={{ fontSize: 12, color: '#475569', fontFamily: 'Inter, sans-serif' }}>{c.emirate}</span>
            <div className="flex items-center gap-1.5">
              <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: c.status === 'good' ? '#16A34A' : c.status === 'warn' ? '#D97706' : '#DC2626' }}>{c.count}</span>
              <span style={{ fontSize: 10, color: c.status === 'good' ? '#16A34A' : c.status === 'warn' ? '#D97706' : '#DC2626' }}>{c.status === 'good' ? '✅' : c.status === 'warn' ? '⚠️' : '❌'}</span>
            </div>
          </div>
        ))}
        <div className="mt-2 p-3 rounded-xl" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#92400E', fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>Network Gap Alert</p>
          <p style={{ fontSize: 10, color: '#78350F', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>Fujairah (10) and UAQ (4) critically under-served. Recommend recruiting 5+ providers per emirate.</p>
        </div>
      </div>
    </div>
  );
}

// ─── PENDING TAB ──────────────────────────────────────────────────────────────
function PendingTab({ onToast }: { onToast: (m: string, t: 'success' | 'warning' | 'info') => void }) {
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());

  const handleApprove = (id: string, name: string) => {
    setApproved(s => new Set([...s, id]));
    onToast(`${name} added to Daman network · Welcome email sent`, 'success');
  };
  const handleReject = (id: string, name: string) => {
    setRejected(s => new Set([...s, id]));
    onToast(`${name} — credentialing rejected`, 'warning');
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={20} color="#D97706" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Credentialing Queue — {pendingProviders.length} providers</span>
        </div>
        <button onClick={() => { onToast('2 providers approved · Welcome emails sent · Directories updated', 'success'); }} className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
          <CheckCircle size={13} /> Approve All Ready (2)
        </button>
      </div>

      {pendingProviders.map(p => {
        const done = approved.has(p.id);
        const rej = rejected.has(p.id);
        const borderColor = p.status === 'ready' ? '#16A34A' : p.status === 'dha_issue' ? '#DC2626' : '#D97706';
        return (
          <div key={p.id} className="rounded-2xl p-4" style={{ border: `1px solid ${borderColor}30`, borderLeft: `4px solid ${borderColor}`, background: done ? '#F0FDF4' : rej ? '#FFF5F5' : '#fff', opacity: done || rej ? 0.7 : 1 }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.name}</p>
                  {done && <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: '#F0FDF4', color: '#15803D', fontFamily: 'Inter, sans-serif' }}>✅ Approved</span>}
                  {rej && <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: '#FFF5F5', color: '#DC2626', fontFamily: 'Inter, sans-serif' }}>❌ Rejected</span>}
                </div>
                <p style={{ fontSize: 12, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>{p.role} · {p.clinic}</p>
                <p style={{ fontFamily: MONO, fontSize: 11, color: '#0D9488', marginBottom: 8 }}>{p.dha}</p>

                {/* DHA status */}
                <div className="inline-block px-3 py-1.5 rounded-lg mb-3" style={{ background: p.dhaVerified ? '#F0FDF4' : '#FFF5F5', border: `1px solid ${p.dhaVerified ? '#BBF7D0' : '#FCA5A5'}` }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: p.dhaVerified ? '#16A34A' : '#DC2626', fontFamily: 'Inter, sans-serif' }}>
                    {p.dhaVerified ? '✅ DHA VERIFIED — LICENSE VALID' : '❌ DHA LICENSE NOT VERIFIED'}
                  </p>
                </div>

                {/* Doc checklist */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {['Emirates ID', 'DHA License', 'Medical Degree', 'Board Certificate', 'Passport', 'Profile Photo'].map((doc, idx) => {
                    const present = idx < p.docsComplete;
                    const missing = p.missingDocs.some(m => doc.toLowerCase().includes(m.toLowerCase().split(' ')[0].toLowerCase()));
                    return (
                      <span key={doc} className="px-2 py-0.5 rounded text-xs" style={{ fontFamily: 'Inter, sans-serif', background: missing ? '#FFF7ED' : present ? '#F0FDF4' : '#F1F5F9', color: missing ? '#92400E' : present ? '#15803D' : '#94A3B8' }}>
                        {missing ? '⚠️' : present ? '✅' : '○'} {doc}
                      </span>
                    );
                  })}
                </div>

                {p.missingDocs.length > 0 && (
                  <div className="p-2.5 rounded-xl mb-3" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#92400E', fontFamily: 'Inter, sans-serif' }}>⚠️ Missing: {p.missingDocs.join(', ')}</p>
                    <p style={{ fontSize: 10, color: '#78350F', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>Please submit via CeenAiX portal or email credentialing@daman.ae</p>
                  </div>
                )}

                <p style={{ fontFamily: MONO, fontSize: 10, color: '#94A3B8' }}>Applied: {p.appliedDate} · Waiting {p.waitingDays} days · {p.docsComplete}/{p.docsTotal} docs</p>
              </div>
            </div>

            {!done && !rej && (
              <div className="flex gap-2 mt-4">
                {p.status === 'ready' && (
                  <button onClick={() => handleApprove(p.id, p.name)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: '#16A34A', color: '#fff', fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }}>
                    ✅ Approve & Add to Network
                  </button>
                )}
                {p.status === 'incomplete' && (
                  <button onClick={() => onToast(`Document request email sent to ${p.name}`, 'warning')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
                    📧 Request Missing Documents
                  </button>
                )}
                <button onClick={() => handleReject(p.id, p.name)} className="py-2.5 px-4 rounded-xl text-sm font-semibold"
                  style={{ background: 'transparent', color: '#DC2626', border: '1px solid #FCA5A5', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
                  ❌ Reject
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── NEEDS REVIEW TAB ─────────────────────────────────────────────────────────
function ReviewTab({ onToast }: { onToast: (m: string, t: 'success' | 'warning' | 'info') => void }) {
  const reviewItems = networkProviders.filter(p => p.status === 'Under Review' || p.status === 'Suspended');
  return (
    <div className="p-4 flex flex-col gap-4">
      {reviewItems.map(p => {
        const isFraud = p.fraudScore === 'ACTIVE';
        const borderColor = isFraud ? '#DC2626' : p.status === 'Under Review' ? '#EA580C' : '#D97706';
        return (
          <div key={p.id} className="rounded-2xl p-4" style={{ border: `1px solid ${borderColor}30`, borderLeft: `4px solid ${borderColor}`, background: isFraud ? 'rgba(254,242,242,0.6)' : 'rgba(255,247,237,0.5)' }}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {isFraud ? <AlertOctagon size={16} color="#DC2626" /> : <AlertTriangle size={16} color="#EA580C" />}
                  <p style={{ fontSize: 14, fontWeight: 700, color: isFraud ? '#7F1D1D' : '#7C2D12', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.name}</p>
                </div>
                {p.fraudCaseRef && <span className="inline-block px-2 py-0.5 rounded mb-2" style={{ fontSize: 10, fontWeight: 700, fontFamily: MONO, background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }}>{p.fraudCaseRef} — ACTIVE</span>}
                <p style={{ fontSize: 12, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>{p.specialty} · {p.facilityName || p.location}</p>
                {p.reviewNote && <p style={{ fontSize: 11, color: isFraud ? '#DC2626' : '#D97706', fontFamily: 'Inter, sans-serif', marginBottom: 8 }}>{p.reviewNote}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onToast(`Fraud investigation opened for ${p.name}`, 'warning')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: isFraud ? '#FFF5F5' : '#FFF7ED', color: isFraud ? '#DC2626' : '#EA580C', border: `1px solid ${isFraud ? '#FCA5A5' : '#FED7AA'}`, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
                🔍 View Investigation
              </button>
              {isFraud && (
                <button onClick={() => onToast(`${p.name} terminated from network · DHA notified`, 'warning')} className="py-2.5 px-4 rounded-xl text-sm font-semibold"
                  style={{ background: 'transparent', color: '#DC2626', border: '1px solid #FCA5A5', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
                  ⛔ Terminate
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── TOP PERFORMERS TAB ───────────────────────────────────────────────────────
function TopTab({ onView, onToast }: { onView: (p: NetworkProvider) => void; onToast: (m: string, t: 'success' | 'warning' | 'info') => void }) {
  const top = [...networkProviders].filter(p => p.overallScore >= 80).sort((a, b) => b.overallScore - a.overallScore);
  const podium = top.slice(0, 3);
  const rest = top.slice(3);
  const medals = ['🥇', '🥈', '🥉'];
  const medalColors = ['#D97706', '#94A3B8', '#92400E'];
  return (
    <div className="p-4 flex flex-col gap-5">
      {/* Podium */}
      <div className="flex items-end justify-center gap-6" style={{ height: 140, paddingBottom: 0 }}>
        {[podium[1], podium[0], podium[2]].map((p, idx) => {
          if (!p) return <div key={idx} style={{ width: 140 }} />;
          const heights = [100, 140, 80];
          const rank = idx === 1 ? 0 : idx === 0 ? 1 : 2;
          return (
            <div key={p.id} className="flex flex-col items-center cursor-pointer" style={{ width: 140 }} onClick={() => onView(p)}>
              <p style={{ fontSize: 11, fontWeight: 700, color: medalColors[rank], fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>{medals[rank]} {p.name.split(' ').slice(-1)[0]}</p>
              <p style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: medalColors[rank], marginBottom: 6 }}>{p.overallScore}/100</p>
              <div className="w-full rounded-t-xl flex items-center justify-center" style={{ height: heights[idx], background: idx === 1 ? '#1E3A5F' : '#E2E8F0', transition: 'height 0.6s ease' }}>
                <p style={{ fontFamily: MONO, fontSize: 13, color: idx === 1 ? '#fff' : '#64748B', fontWeight: 700 }}>{rank + 1}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest of top performers */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
        <table className="w-full" style={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              {['Rank', 'Provider', 'Specialty', 'Denial', 'Rating', 'Score', 'Badge'].map(h => (
                <th key={h} className="text-left px-3 py-2.5" style={{ fontSize: 10, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...podium, ...rest].map((p, i) => (
              <tr key={p.id} className="cursor-pointer hover:bg-slate-50" style={{ borderBottom: '1px solid #F1F5F9' }} onClick={() => onView(p)}>
                <td className="px-3 py-3" style={{ fontFamily: MONO, fontSize: 12, color: '#94A3B8' }}>#{i + 1}</td>
                <td className="px-3 py-3" style={{ fontWeight: 600, color: '#1E293B' }}>{p.name}</td>
                <td className="px-3 py-3" style={{ color: '#64748B' }}>{p.specialty}</td>
                <td className="px-3 py-3" style={{ fontFamily: MONO, fontWeight: 700, color: p.denialRate < 3 ? '#16A34A' : '#0D9488' }}>{p.denialRate}%</td>
                <td className="px-3 py-3">
                  {p.rating ? <span style={{ fontFamily: MONO, color: '#D97706', fontWeight: 700 }}>{p.rating}★</span> : '—'}
                </td>
                <td className="px-3 py-3">
                  <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: p.overallScore >= 90 ? '#16A34A' : '#0D9488' }}>{p.overallScore}</span>
                </td>
                <td className="px-3 py-3">
                  {i === 0 && <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: '#FFFBEB', color: '#92400E', fontFamily: 'Inter, sans-serif' }}>⭐ Lowest Denial</span>}
                  {i === 1 && <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: '#EFF6FF', color: '#1D4ED8', fontFamily: 'Inter, sans-serif' }}>🎖 Top Rated</span>}
                  {i === 2 && <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: '#F0FDF4', color: '#15803D', fontFamily: 'Inter, sans-serif' }}>🏆 Top Score</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onToast('Excellence certificates sent to top 10 providers', 'success')} className="px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
          📧 Send Excellence Certificates
        </button>
        <button onClick={() => onToast('Excellence report generated for DHA', 'success')} className="px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
          📊 Export for DHA
        </button>
      </div>
    </div>
  );
}

// ─── TERMINATED TAB ───────────────────────────────────────────────────────────
function TerminatedTab({ onToast }: { onToast: (m: string, t: 'success' | 'warning' | 'info') => void }) {
  return (
    <div className="p-4 flex flex-col gap-4">
      {terminatedProviders.map(p => (
        <div key={p.id} className="rounded-2xl p-4" style={{ background: '#FAFBFC', border: '1px solid #E2E8F0', opacity: 0.75 }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>❌ TERMINATED — {p.terminatedDate}</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#475569', fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: 2 }}>{p.name}</p>
              <p style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>{p.specialty} · {p.dha}</p>
              <p style={{ fontSize: 12, color: '#64748B', fontFamily: 'Inter, sans-serif', marginTop: 6 }}>Reason: {p.reason}</p>
              <div className="flex items-center gap-3 mt-3">
                {p.amountRecovered > 0 && <span style={{ fontFamily: MONO, fontSize: 12, color: '#16A34A', fontWeight: 600 }}>💰 AED {p.amountRecovered.toLocaleString()} recovered</span>}
                {p.dhaReportSubmitted && <span style={{ fontSize: 11, color: '#16A34A', fontFamily: 'Inter, sans-serif' }}>✅ DHA Report submitted</span>}
              </div>
            </div>
          </div>
          <button onClick={() => onToast('Case file opened', 'info')} className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold"
            style={{ background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
            📋 View Case File
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── EXPORT MODAL ─────────────────────────────────────────────────────────────
function ExportModal({ onClose, onToast }: { onClose: () => void; onToast: (m: string, t: 'success' | 'warning' | 'info') => void }) {
  const [reportType, setReportType] = useState('directory');
  const [format, setFormat] = useState('csv');
  const [generating, setGenerating] = useState(false);
  const reportTypes = [
    { id: 'directory', label: 'Provider Directory' },
    { id: 'performance', label: 'Performance Report' },
    { id: 'credentialing', label: 'Credentialing Status' },
    { id: 'contracts', label: 'Contract Expiry Report' },
    { id: 'coverage', label: 'Network Coverage Analysis' },
    { id: 'dha', label: 'DHA Compliance Report' },
  ];
  const go = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); onClose(); onToast(`Provider ${reportType} report generated (${format.toUpperCase()}) — ready for download`, 'success'); }, 1800);
  };
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)' }}>
      <div className="rounded-2xl overflow-hidden" style={{ width: 480, background: '#fff', boxShadow: '0 24px 60px rgba(0,0,0,0.18)', border: '1px solid #E2E8F0' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ background: '#1E3A5F' }}>
          <div className="flex items-center gap-2.5"><FileText size={16} color="#93C5FD" /><span style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Export Provider Directory</span></div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', borderRadius: 8, padding: 6 }}><X size={14} color="#fff" /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Report Type</p>
            <div className="flex flex-col gap-2">
              {reportTypes.map(r => (
                <label key={r.id} className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer" style={{ border: `1px solid ${reportType === r.id ? '#BFDBFE' : '#F1F5F9'}`, background: reportType === r.id ? '#EFF6FF' : '#FAFBFC' }}>
                  <input type="radio" name="report" checked={reportType === r.id} onChange={() => setReportType(r.id)} style={{ accentColor: '#1E3A5F' }} />
                  <span style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', color: '#374151' }}>{r.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Format</p>
            <div className="flex gap-2">
              {['csv', 'xlsx', 'pdf'].map(f => (
                <button key={f} onClick={() => setFormat(f)} className="flex-1 py-2 rounded-xl text-xs font-semibold"
                  style={{ border: `2px solid ${format === f ? '#1E3A5F' : '#E2E8F0'}`, background: format === f ? '#EFF6FF' : '#fff', color: format === f ? '#1E3A5F' : '#64748B', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
                  .{f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>Cancel</button>
            <button onClick={go} disabled={generating} className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
              style={{ background: generating ? '#94A3B8' : '#1E3A5F', color: '#fff', fontFamily: 'Inter, sans-serif', border: 'none', cursor: generating ? 'not-allowed' : 'pointer' }}>
              {generating ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />Generating…</> : <><Download size={14} />Generate</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const MAIN_TABS: { id: MainTab; label: string; count?: number }[] = [
  { id: 'all', label: '🏥 All Providers', count: networkSummary.totalProviders },
  { id: 'pending', label: '⏳ Pending Credentialing', count: networkSummary.pendingCredentialing },
  { id: 'top', label: '⭐ Top Performers' },
  { id: 'review', label: '⚠️ Needs Review', count: networkSummary.underReview + 1 },
  { id: 'terminated', label: '📋 Terminated', count: networkSummary.terminated },
];

const NetworkProvidersPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openDrawer, setOpenDrawer] = useState<NetworkProvider | null>(null);
  const [showCredentialing, setShowCredentialing] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const filteredProviders = useMemo(() => {
    return networkProviders.filter(p => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.dhaNumber.toLowerCase().includes(q) && !p.specialty.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search]);

  const toggleSelect = (id: string) => setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelectedIds(prev => prev.size === filteredProviders.length ? new Set() : new Set(filteredProviders.map(p => p.id)));

  const toastColors: Record<Toast['type'], { border: string; color: string; bg: string }> = {
    success: { border: '#6EE7B7', color: '#065F46', bg: '#F0FDF4' },
    warning: { border: '#FCA5A5', color: '#991B1B', bg: '#FFF5F5' },
    info: { border: '#93C5FD', color: '#1E40AF', bg: '#EFF6FF' },
  };

  const kpiCards = [
    { icon: <Building2 size={18} color="#1E3A5F" />, iconBg: '#EFF6FF', value: networkSummary.totalProviders.toLocaleString(), label: 'TOTAL PROVIDERS', sub: `${networkSummary.totalDoctors} doctors · ${networkSummary.totalOrganizations} orgs`, tab: 'all' as MainTab },
    { icon: <CheckCircle size={18} color="#16A34A" />, iconBg: '#F0FDF4', value: networkSummary.totalDoctors.toLocaleString(), label: 'ACTIVE DOCTORS', sub: 'All DHA licensed · UAE-wide', subColor: '#16A34A', tab: 'all' as MainTab, valueColor: '#16A34A' },
    { icon: <Clock size={18} color="#D97706" />, iconBg: '#FFFBEB', value: networkSummary.pendingCredentialing.toString(), label: 'PENDING CREDENTIALING', sub: '2 ready to approve', subColor: '#D97706', tab: 'pending' as MainTab, valueColor: '#D97706', pulse: true },
    { icon: <BarChart3 size={18} color="#0D9488" />, iconBg: '#F0FDFA', value: `${networkSummary.avgDenialRate}%`, label: 'AVG DENIAL RATE', sub: 'Target: <6% ✅', subColor: '#16A34A', tab: 'all' as MainTab, valueColor: '#0D9488' },
    { icon: <AlertTriangle size={18} color="#EF4444" />, iconBg: '#FFF5F5', value: networkSummary.flagged.toString(), label: 'FLAGGED / ISSUES', sub: '1 fraud · 1 upcoding · 1 performance', subColor: '#EA580C', tab: 'review' as MainTab, valueColor: '#EF4444', pulse: true },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F0F4F8' }}>
      <InsuranceSidebar activePage="network" onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-6" style={{ height: 64, background: '#fff', borderBottom: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1E3A5F' }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>D</span>
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Network Providers</p>
              <p style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>Daman National Health Insurance · 7 April 2026 · 2:07 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: '#16A34A', animation: 'pulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, color: '#15803D', fontFamily: 'Inter, sans-serif' }}>847 doctors · 34 organizations · UAE-wide network</span>
            </div>
            <button onClick={() => setShowCredentialing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: '#1E3A5F', color: '#fff', fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }}>
              + Add Provider
            </button>
            <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
              style={{ background: '#F1F5F9', color: '#475569', fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }}>
              <Download size={14} /> Export
            </button>
            <div className="relative">
              <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#FFF7ED', border: 'none', cursor: 'pointer' }}>
                <Bell size={15} color="#D97706" />
              </button>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#DC2626', fontSize: 9, color: '#fff', fontFamily: MONO }}>3</span>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#1E3A5F', fontFamily: MONO, fontSize: 12, fontWeight: 700, color: '#fff' }}>MK</div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          {/* Alerts strip */}
          <div className="flex items-center gap-4 px-6" style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '10px 24px', flexWrap: 'wrap', gap: 12 }}>
            {[
              { icon: <AlertOctagon size={13} color="#EF4444" />, text: 'Dr. Khalid Ibrahim — Fraud investigation active · 47 claims frozen', btnBg: '#FEE2E2', btnColor: '#DC2626', btnText: 'View Case →', tab: 'review' as MainTab },
              { icon: <Clock size={13} color="#D97706" />, text: '12 providers pending credentialing · 2 ready to approve', btnBg: '#FEF3C7', btnColor: '#D97706', btnText: 'Review Queue →', tab: 'pending' as MainTab },
              { icon: <AlertTriangle size={13} color="#EA580C" />, text: 'Emirates Medical Center — upcoding under review', btnBg: '#FFEDD5', btnColor: '#EA580C', btnText: 'View Details →', tab: 'review' as MainTab },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                {a.icon}
                <span style={{ fontSize: 11, color: '#475569', fontFamily: 'Inter, sans-serif' }}>{a.text}</span>
                <button onClick={() => setActiveTab(a.tab)} className="px-2 py-0.5 rounded text-xs font-semibold"
                  style={{ background: a.btnBg, color: a.btnColor, fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }}>
                  {a.btnText}
                </button>
              </div>
            ))}
          </div>

          {/* KPI strip */}
          <div className="grid gap-4 px-6 pt-4" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {kpiCards.map(card => (
              <div key={card.label} onClick={() => setActiveTab(card.tab)}
                className="rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md"
                style={{ background: '#fff', border: `1px solid ${card.pulse ? '#FCA5A5' : '#E2E8F0'}`, boxShadow: '0 1px 6px rgba(15,45,74,0.06)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-xl" style={{ background: card.iconBg }}>{card.icon}</div>
                  {card.pulse && <div className="w-2 h-2 rounded-full" style={{ background: '#DC2626', animation: 'pulse 1.4s ease-in-out infinite' }} />}
                </div>
                <p style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: card.valueColor || '#0F172A', lineHeight: 1 }}>{card.value}</p>
                <p style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 3 }}>{card.label}</p>
                <p style={{ fontSize: 11, color: card.subColor || '#94A3B8', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Main content card */}
          <div className="mx-6 mt-4 mb-6 rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
            {/* Filter row */}
            <div className="flex items-center gap-3 px-4 py-3 flex-wrap" style={{ borderBottom: '1px solid #F1F5F9' }}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', flex: '1 1 260px', maxWidth: 360 }}>
                <Search size={14} color="#94A3B8" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search provider name, DHA license, specialty..."
                  className="flex-1 bg-transparent outline-none" style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#374151', border: 'none' }} />
                {search && <button onClick={() => setSearch('')}><X size={12} color="#94A3B8" /></button>}
              </div>
              {/* View toggles */}
              <div className="ml-auto flex items-center gap-1 p-1 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                {([['table', <List size={14} />], ['cards', <Grid size={14} />], ['map', <MapIcon size={14} />]] as [ViewMode, React.ReactNode][]).map(([v, icon]) => (
                  <button key={v} onClick={() => setViewMode(v)} className="p-2 rounded-lg transition-all"
                    style={{ background: viewMode === v ? '#1E3A5F' : 'transparent', border: 'none', cursor: 'pointer', color: viewMode === v ? '#fff' : '#94A3B8' }}>
                    {icon}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                style={{ background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
                <Filter size={12} /> Filters <ChevronDown size={11} />
              </button>
            </div>

            {/* Tab bar */}
            <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid #F1F5F9' }}>
              {MAIN_TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="flex-shrink-0 px-5 py-3 text-xs font-semibold transition-all"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: activeTab === tab.id ? '#1E3A5F' : '#64748B', background: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '3px solid #1E3A5F' : '3px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {tab.label}{tab.count !== undefined ? ` (${tab.count})` : ''}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'all' && (
              <>
                {viewMode === 'map' && <MapView />}
                {viewMode === 'cards' && (
                  <div className="p-4 grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {filteredProviders.map(p => <ProviderCard key={p.id} prov={p} onView={() => setOpenDrawer(p)} />)}
                  </div>
                )}
                {viewMode === 'table' && (
                  <div className="overflow-x-auto">
                    <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 1100 }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          <th style={{ width: 4, padding: 0, background: 'transparent' }} />
                          <th className="px-3 py-3" style={{ width: 36 }}>
                            <input type="checkbox" checked={selectedIds.size === filteredProviders.length && filteredProviders.length > 0} onChange={toggleAll} style={{ accentColor: '#1E3A5F' }} />
                          </th>
                          {['Provider', 'Type', 'Specialty', 'Location', 'Claims', 'Avg Claim', 'Denial %', 'Rating', 'Fraud', 'Status', 'Actions'].map(h => (
                            <th key={h} className="text-left px-2 py-3" style={{ fontSize: 10, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'Inter, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProviders.map(p => (
                          <ProviderRow key={p.id} prov={p} selected={selectedIds.has(p.id)} onSelect={() => toggleSelect(p.id)} onView={() => setOpenDrawer(p)} />
                        ))}
                      </tbody>
                    </table>
                    <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>
                        Showing {filteredProviders.length} of {networkSummary.totalProviders} providers
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: '#94A3B8' }}>
                        847 active · 12 pending · 3 flagged · 2 terminated
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
            {activeTab === 'pending' && <PendingTab onToast={addToast} />}
            {activeTab === 'top' && <TopTab onView={p => setOpenDrawer(p)} onToast={addToast} />}
            {activeTab === 'review' && <ReviewTab onToast={addToast} />}
            {activeTab === 'terminated' && <TerminatedTab onToast={addToast} />}
          </div>
        </main>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 z-[100] flex items-center gap-3 px-6" style={{ left: 264, right: 0, height: 52, background: '#1E3A5F', borderTop: '1px solid #2D4A6F', boxShadow: '0 -4px 20px rgba(0,0,0,0.25)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'Inter, sans-serif' }}>{selectedIds.size} providers selected</span>
          <div className="flex gap-2 ml-2">
            {[
              { label: '📧 Email', onClick: () => addToast(`Email sent to ${selectedIds.size} providers`, 'success') },
              { label: '💬 Message', onClick: () => addToast(`Message sent to ${selectedIds.size} providers`, 'success') },
              { label: '📊 Export', onClick: () => { setShowExport(true); } },
              { label: '⚠️ Flag', onClick: () => addToast(`${selectedIds.size} providers flagged for review`, 'warning') },
            ].map(btn => (
              <button key={btn.label} onClick={btn.onClick} className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
                {btn.label}
              </button>
            ))}
          </div>
          <button onClick={() => setSelectedIds(new Set())} className="ml-auto p-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer' }}>
            <X size={14} color="#fff" />
          </button>
        </div>
      )}

      {/* Drawer */}
      {openDrawer && <ProviderDetailDrawer provider={openDrawer} onClose={() => setOpenDrawer(null)} onToast={addToast} />}

      {/* Credentialing modal */}
      {showCredentialing && <CredentialingModal onClose={() => setShowCredentialing(false)} onToast={addToast} />}

      {/* Export modal */}
      {showExport && <ExportModal onClose={() => setShowExport(false)} onToast={addToast} />}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[500] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 400 }}>
        {toasts.map(t => {
          const c = toastColors[t.type];
          return (
            <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-xl pointer-events-auto"
              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: 13, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.14)', fontFamily: 'Inter, sans-serif' }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
              <span>{t.msg}</span>
            </div>
          );
        })}
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
};

export default NetworkProvidersPage;
