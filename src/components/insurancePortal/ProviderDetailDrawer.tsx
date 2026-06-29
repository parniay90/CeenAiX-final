import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  X, Mail, MessageSquare, RefreshCw, AlertTriangle, FileText,
  Star, CheckCircle, Copy, ChevronLeft, ChevronRight, ExternalLink,
} from 'lucide-react';
import { NetworkProvider, ahmedClaimsHistory, ahmedMonthlyTrend } from '../../data/networkData';

const MONO = "'DM Mono', monospace";
const fmt = (n: number) => n >= 1000 ? `AED ${n.toLocaleString()}` : `AED ${n}`;

type DrawerTab = 'overview' | 'performance' | 'claims' | 'contract' | 'notes';

interface Props {
  provider: NetworkProvider;
  onClose: () => void;
  onToast: (msg: string, type: 'success' | 'warning' | 'info') => void;
}

const TABS: { id: DrawerTab; label: string }[] = [
  { id: 'overview', label: '👤 Overview' },
  { id: 'performance', label: '📊 Performance' },
  { id: 'claims', label: '💰 Claims' },
  { id: 'contract', label: '📋 Contract & DHA' },
  { id: 'notes', label: '📝 Notes' },
];

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = size * 0.42;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 85 ? '#16A34A' : score >= 70 ? '#0D9488' : score >= 55 ? '#D97706' : '#DC2626';
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={size * 0.08} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={size * 0.08}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      </svg>
      <div className="flex flex-col items-center" style={{ position: 'relative', zIndex: 1 }}>
        <span style={{ fontFamily: MONO, fontSize: size * 0.3, fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: size * 0.12, color: '#94A3B8' }}>/100</span>
      </div>
    </div>
  );
}

function MiniBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif', width: 100, flexShrink: 0 }}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span style={{ fontFamily: MONO, fontSize: 11, color: '#1E293B', width: 28, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function OverviewTab({ provider, onToast }: { provider: NetworkProvider; onToast: Props['onToast'] }) {
  const initials = provider.name.replace('Dr. ', '').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="p-5 flex flex-col gap-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
      {/* Identity card */}
      <div className="rounded-xl p-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="rounded-full flex items-center justify-center" style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #0D9488, #0F766E)', fontFamily: MONO, fontSize: 18, fontWeight: 700, color: '#fff' }}>
              {initials}
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white" style={{ background: provider.status === 'Active' ? '#16A34A' : provider.status === 'Suspended' ? '#DC2626' : '#F59E0B' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{provider.name}</p>
            {provider.nameAr && <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'Inter, sans-serif' }}>{provider.nameAr}</p>}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded" style={{ fontSize: 10, fontFamily: MONO, background: '#F0FDFA', color: '#0F766E', border: '1px solid #CCFBF1' }}>{provider.dhaNumber}</span>
              <span className="px-2 py-0.5 rounded" style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', background: '#EFF6FF', color: '#1D4ED8' }}>{provider.specialty}</span>
              {provider.networkTier === 'Premium' && <span className="px-2 py-0.5 rounded" style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', background: '#FFFBEB', color: '#92400E' }}>⭐ Premium Network</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Identity grid */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Identity Details</p>
        <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {[
            { label: 'Type', val: provider.type },
            { label: 'Emirate', val: provider.emirate },
            { label: 'Network Since', val: provider.networkSinceDisplay || 'Pending' },
            { label: 'Network Tier', val: provider.networkTier },
            { label: 'Location', val: provider.location },
            { label: 'DHA Status', val: provider.dhaValid ? '✅ Valid' : '❌ Invalid' },
          ].map(item => (
            <div key={item.label} className="p-2.5 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <p style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{item.label}</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>{item.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      {provider.isBoardCertified && provider.boardCerts && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Board Certifications</p>
          <div className="flex flex-wrap gap-2">
            {provider.boardCerts.map(cert => (
              <span key={cert} className="px-2.5 py-1 rounded-lg" style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>🎓 {cert}</span>
            ))}
          </div>
        </div>
      )}

      {/* Facility */}
      {provider.facilityName && (
        <div className="p-3 rounded-xl" style={{ background: '#F0FDFA', border: '1px solid #CCFBF1' }}>
          <p style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>Primary Facility</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>{provider.facilityName}</p>
          <p style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{provider.location}</p>
        </div>
      )}

      {/* Performance snapshot */}
      {provider.status !== 'Pending' && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Performance Snapshot</p>
          <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
            {[
              { label: 'All-Time Claims', val: provider.claimsAllTime.toLocaleString(), color: '#0D9488' },
              { label: 'Patient Rating', val: provider.rating ? `${provider.rating}★` : 'N/A', color: '#D97706' },
              { label: 'Denial Rate', val: `${provider.denialRate}%`, color: provider.denialRate < 3 ? '#16A34A' : provider.denialRate < 5 ? '#0D9488' : '#D97706' },
              { label: 'Avg Claim', val: fmt(provider.avgClaim), color: '#1E3A5F' },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                <p style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: s.color }}>{s.val}</p>
                <p style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Actions</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '📧 Send Email', bg: '#EFF6FF', color: '#1E40AF', onClick: () => onToast('Email composer opened', 'info') },
            { label: '💬 Message', bg: '#F1F5F9', color: '#475569', onClick: () => onToast('Messaging opened', 'info') },
            { label: '🔄 Renew Contract', bg: '#F0FDFA', color: '#0F766E', onClick: () => onToast('Contract renewal initiated', 'success') },
            { label: '⚠️ Flag for Review', bg: '#FFFBEB', color: '#92400E', onClick: () => onToast('Provider flagged for review', 'warning') },
          ].map(btn => (
            <button key={btn.label} onClick={btn.onClick} className="px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: btn.bg, color: btn.color, fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PerformanceTab({ provider }: { provider: NetworkProvider }) {
  const scoreColor = provider.overallScore >= 85 ? '#16A34A' : provider.overallScore >= 70 ? '#0D9488' : '#D97706';
  const denialColor = provider.denialRate < 3 ? '#16A34A' : provider.denialRate < 5 ? '#0D9488' : provider.denialRate < 7 ? '#D97706' : '#DC2626';

  const donutData = [
    { name: 'Missing Docs', value: 67, color: '#64748B' },
    { name: 'Plan Exclusion', value: 22, color: '#94A3B8' },
    { name: 'Other', value: 11, color: '#CBD5E1' },
  ];

  return (
    <div className="p-5 flex flex-col gap-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
      {/* Score card */}
      <div className="rounded-xl p-4 flex items-center gap-5" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
        <ScoreRing score={provider.overallScore} size={80} />
        <div className="flex-1">
          <p style={{ fontSize: 10, fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Overall Performance Score</p>
          <div className="flex flex-col gap-2">
            <MiniBar label="Quality (denial)" value={Math.round(100 - provider.denialRate * 5)} color={scoreColor} />
            <MiniBar label="Efficiency (cost)" value={Math.min(100, Math.round((provider.specialtyAvgClaim / Math.max(provider.avgClaim, 1)) * 85))} color={scoreColor} />
            <MiniBar label="PA Compliance" value={provider.paCompliance} color={scoreColor} />
          </div>
          <p style={{ fontSize: 11, color: '#15803D', fontFamily: 'Inter, sans-serif', fontStyle: 'italic', marginTop: 8 }}>
            {provider.overallScore >= 90 ? 'Top 5% of network providers' : provider.overallScore >= 80 ? 'Above network average' : 'Network average'}
          </p>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {[
          { label: 'Claims This Month', val: provider.claimsApril.toLocaleString() },
          { label: 'All-Time Claims', val: provider.claimsAllTime.toLocaleString() },
          { label: 'Approval Rate', val: `${(100 - provider.denialRate).toFixed(1)}%` },
          { label: 'Average Claim', val: fmt(provider.avgClaim) },
          { label: 'Specialty Avg', val: fmt(provider.specialtyAvgClaim) },
          { label: 'PA Compliance', val: `${provider.paCompliance}%` },
        ].map(m => (
          <div key={m.label} className="p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
            <p style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{m.label}</p>
            <p style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{m.val}</p>
          </div>
        ))}
      </div>

      {/* Denial rate trend */}
      {provider.denialSparkline && provider.denialSparkline.length > 0 && (
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif', marginBottom: 10 }}>Denial Rate Trend (6 months)</p>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={provider.denialSparkline} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8', fontFamily: 'Inter, sans-serif' }} />
              <YAxis unit="%" tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: MONO }} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <ReferenceLine y={4.7} stroke="#CBD5E1" strokeDasharray="4 3" label={{ value: 'Avg', position: 'right', fontSize: 9, fill: '#94A3B8' }} />
              <Line dataKey="rate" stroke={denialColor} strokeWidth={2} dot={{ r: 3, fill: denialColor }} animationDuration={600} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Claims monthly trend */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif', marginBottom: 10 }}>Monthly Claims Trend — 2026</p>
        <ResponsiveContainer width="100%" height={110}>
          <BarChart data={ahmedMonthlyTrend} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'Inter, sans-serif' }} />
            <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: MONO }} />
            <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E2E8F0' }} />
            <Bar dataKey="amount" fill="#0D9488" radius={[3, 3, 0, 0]} animationDuration={600} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Denial reasons */}
      {provider.claimsAllTime > 0 && (
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif', marginBottom: 10 }}>Denial Reasons</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={80} height={80}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={24} outerRadius={38} dataKey="value" animationDuration={600}>
                  {donutData.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5">
              {donutData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                  <span style={{ fontSize: 11, color: '#475569', fontFamily: 'Inter, sans-serif' }}>{d.name}: <span style={{ fontFamily: MONO, fontWeight: 600 }}>{d.value}%</span></span>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 11, color: '#16A34A', fontFamily: 'Inter, sans-serif', marginTop: 8 }}>✅ No anomalous denial patterns detected</p>
        </div>
      )}

      {/* Rating */}
      {provider.rating && (
        <div className="p-3 rounded-xl" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <p style={{ fontSize: 11, color: '#92400E', fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>Patient Satisfaction — {provider.reviewCount} reviews</p>
          <div className="flex items-center gap-2">
            <Star size={18} fill="#F59E0B" color="#F59E0B" />
            <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: '#92400E' }}>{provider.rating}</span>
            <span style={{ fontSize: 12, color: '#78350F', fontFamily: 'Inter, sans-serif' }}>/ 5.0</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ClaimsTab({ provider }: { provider: NetworkProvider }) {
  return (
    <div className="p-5 flex flex-col gap-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
      {/* Summary */}
      <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {[
          { label: 'April Claims', val: provider.claimsApril.toLocaleString() },
          { label: 'April Total', val: fmt(provider.claimsApril * provider.avgClaim) },
          { label: 'All-Time Claims', val: provider.claimsAllTime.toLocaleString() },
          { label: 'All-Time Total', val: fmt(provider.claimsAllTime * provider.avgClaim) },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
            <p style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: '#1E293B' }}>{s.val}</p>
            <p style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Claims table */}
      {provider.id === 'prov-001' && (
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif', marginBottom: 10 }}>Recent Claims — April 2026</p>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
            <table className="w-full" style={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['Date', 'Claim ID', 'Plan', 'Service', 'Amount', 'Status'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5" style={{ fontSize: 10, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ahmedClaimsHistory.map((claim, i) => (
                  <tr key={claim.claimId} style={{ borderBottom: i < ahmedClaimsHistory.length - 1 ? '1px solid #F1F5F9' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                    <td className="px-3 py-2.5" style={{ fontFamily: MONO, fontSize: 10, color: '#94A3B8' }}>{claim.date}</td>
                    <td className="px-3 py-2.5" style={{ fontFamily: MONO, fontSize: 10, color: '#0D9488' }}>{claim.claimId}</td>
                    <td className="px-3 py-2.5" style={{ fontSize: 11, color: '#475569' }}>{claim.plan}</td>
                    <td className="px-3 py-2.5" style={{ fontSize: 11, color: '#1E293B' }}>{claim.service}</td>
                    <td className="px-3 py-2.5" style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: '#1E293B' }}>{fmt(claim.amount)}</td>
                    <td className="px-3 py-2.5">
                      <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{
                        fontFamily: 'Inter, sans-serif', fontSize: 10,
                        background: claim.status === 'Approved' ? '#F0FDF4' : '#FFF5F5',
                        color: claim.status === 'Approved' ? '#15803D' : '#DC2626',
                      }}>{claim.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fraud note for Dr. Khalid */}
      {provider.fraudScore === 'ACTIVE' && (
        <div className="p-4 rounded-xl" style={{ background: '#FFF5F5', border: '1px solid #FCA5A5' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#DC2626', fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>🔴 All Claims Frozen</p>
          <p style={{ fontSize: 11, color: '#7F1D1D', fontFamily: 'Inter, sans-serif' }}>{provider.claimsApril} claims totaling approx. {fmt(provider.claimsApril * provider.avgClaim)} have been frozen pending fraud investigation {provider.fraudCaseRef}.</p>
        </div>
      )}
    </div>
  );
}

function ContractTab({ provider, onToast }: { provider: NetworkProvider; onToast: Props['onToast'] }) {
  const daysRemaining = provider.contractExpiryDays;
  const expiryColor = daysRemaining < 60 ? '#DC2626' : daysRemaining < 90 ? '#D97706' : '#16A34A';
  const expiryPct = Math.min(100, (daysRemaining / 365) * 100);

  return (
    <div className="p-5 flex flex-col gap-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
      {/* DHA License card */}
      <div className="rounded-xl p-4" style={{ background: '#F0FDFA', border: '1px solid #CCFBF1' }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>DHA License</p>
        <p style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: '#0F766E', marginBottom: 8 }}>{provider.dhaNumber}</p>
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: provider.dhaValid ? '#16A34A' : '#DC2626', fontFamily: 'Inter, sans-serif' }}>{provider.dhaValid ? '✅ VALID' : '❌ INVALID'}</p>
            {provider.contractExpiry && (
              <>
                <p style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>Expires: {provider.contractExpiry}</p>
                <p style={{ fontFamily: MONO, fontSize: 18, fontWeight: 700, color: expiryColor, marginTop: 4 }}>{daysRemaining} days</p>
              </>
            )}
            <p style={{ fontSize: 10, color: '#0D9488', fontFamily: 'Inter, sans-serif', marginTop: 4 }}>✅ Last DHA API check: Today 2:07 PM</p>
          </div>
          {daysRemaining > 0 && (
            <div className="relative flex items-center justify-center" style={{ width: 60, height: 60 }}>
              <svg width="60" height="60" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                <circle cx="30" cy="30" r="24" fill="none" stroke="#F1F5F9" strokeWidth="5" />
                <circle cx="30" cy="30" r="24" fill="none" stroke={expiryColor} strokeWidth="5"
                  strokeDasharray={`${(expiryPct / 100) * 150.8} 150.8`} strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: expiryColor, position: 'relative', zIndex: 1 }}>{Math.round(expiryPct)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Contract */}
      {provider.contractExpiry && (
        <div className="rounded-xl p-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Network Contract</p>
          <div className="flex flex-col gap-2.5">
            {[
              { label: 'Contract Type', val: provider.isOrgRow ? 'Facility Network Agreement' : 'Panel Doctor Contract' },
              { label: 'Network Tier', val: provider.networkTier },
              { label: 'Current Term', val: `Jan 2026 – ${provider.contractExpiry}` },
              { label: 'Renewal', val: '✅ Auto-renewal configured' },
              { label: 'PA Requirements', val: provider.specialty.includes('General') ? 'Routine: No PA required' : 'Specialist procedures: PA required' },
            ].map(item => (
              <div key={item.label} className="flex items-start justify-between gap-4">
                <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>{item.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#1E293B', fontFamily: 'Inter, sans-serif', textAlign: 'right' }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance record */}
      <div className="rounded-xl p-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: '#64748B', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Compliance Record</p>
        <div className="flex flex-col gap-2">
          {[
            { label: 'PA Submission Rate', val: `${provider.paCompliance}%`, ok: provider.paCompliance >= 85 },
            { label: 'Claims within 30 days', val: '99.2%', ok: true },
            { label: 'Open Grievances', val: '0', ok: true },
            { label: 'DHA Audit Violations', val: '0', ok: true },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between">
              <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{r.label}</span>
              <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: r.ok ? '#16A34A' : '#DC2626' }}>{r.ok ? '✅ ' : '⚠️ '}{r.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onToast('Contract PDF opened', 'info')} className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2" style={{ background: '#EFF6FF', color: '#1D4ED8', fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }}>
          <FileText size={13} /> View Full Contract
        </button>
        <button onClick={() => onToast('Contract renewal initiated', 'success')} className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2" style={{ background: '#F0FDFA', color: '#0F766E', fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }}>
          <RefreshCw size={13} /> Renew Contract
        </button>
      </div>
    </div>
  );
}

function NotesTab({ provider, onToast }: { provider: NetworkProvider; onToast: Props['onToast'] }) {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([
    { text: 'Long-standing network partner. Highest volume cardiologist in Daman network. Top 5% performance. Premium tier — maintain relationship.', author: 'Network Management', date: 'Jan 2024' },
  ]);
  const addNote = () => {
    if (!note.trim()) return;
    setNotes(n => [...n, { text: note.trim(), author: 'Mariam Al Khateeb', date: '7 Apr 2026' }]);
    setNote('');
    onToast('Note added successfully', 'success');
  };
  return (
    <div className="p-5 flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
      <div className="p-2.5 rounded-lg" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
        <p style={{ fontSize: 11, color: '#92400E', fontFamily: 'Inter, sans-serif' }}>🔒 Internal notes — not visible to the provider</p>
      </div>
      {notes.map((n, i) => (
        <div key={i} className="p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
          <p style={{ fontSize: 12, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, marginBottom: 6 }}>{n.text}</p>
          <p style={{ fontSize: 10, color: '#94A3B8', fontFamily: MONO }}>{n.author} · {n.date}</p>
        </div>
      ))}
      <div>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add an internal note..." rows={3}
          className="w-full rounded-xl p-3 resize-none" style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', border: '1px solid #E2E8F0', outline: 'none', color: '#374151' }} />
        <button onClick={addNote} className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold"
          style={{ background: '#1E3A5F', color: '#fff', fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }}>
          + Add Note
        </button>
      </div>
    </div>
  );
}

export default function ProviderDetailDrawer({ provider, onClose, onToast }: Props) {
  const [activeTab, setActiveTab] = useState<DrawerTab>('overview');

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[200]" style={{ background: 'rgba(15,45,74,0.25)', backdropFilter: 'blur(2px)' }} onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 z-[300] flex flex-col"
        style={{ width: 660, background: '#fff', borderLeft: '1px solid #E2E8F0', boxShadow: '-8px 0 40px rgba(15,45,74,0.14)', animation: 'slideInRight 0.3s ease' }}>

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5" style={{ height: 72, background: '#0F2D4A', borderBottom: '1px solid #1E3A5F' }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Provider Profile</p>
            <p style={{ fontFamily: MONO, fontSize: 11, color: '#93C5FD' }}>{provider.name} · {provider.dhaNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            {provider.overallScore >= 85 && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(245,158,11,0.25)', color: '#FDE68A', fontFamily: 'Inter, sans-serif' }}>⭐ TOP PERFORMER</span>
            )}
            {provider.fraudScore === 'ACTIVE' && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(220,38,38,0.3)', color: '#FCA5A5', fontFamily: 'Inter, sans-serif' }}>🔴 FRAUD ACTIVE</span>
            )}
            <button onClick={onClose} className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer' }}>
              <X size={16} color="#fff" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', overflowX: 'auto' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="px-4 py-3 flex-shrink-0 text-xs font-semibold transition-all"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: activeTab === tab.id ? '#1E3A5F' : '#64748B', background: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #1E3A5F' : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'overview' && <OverviewTab provider={provider} onToast={onToast} />}
          {activeTab === 'performance' && <PerformanceTab provider={provider} />}
          {activeTab === 'claims' && <ClaimsTab provider={provider} />}
          {activeTab === 'contract' && <ContractTab provider={provider} onToast={onToast} />}
          {activeTab === 'notes' && <NotesTab provider={provider} onToast={onToast} />}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center gap-2 px-5" style={{ height: 56, borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
          {[
            { icon: <Mail size={13} />, label: 'Email', onClick: () => onToast('Email opened', 'info') },
            { icon: <MessageSquare size={13} />, label: 'Message', onClick: () => onToast('Message opened', 'info') },
            { icon: <FileText size={13} />, label: 'Report', onClick: () => onToast('Performance report generated', 'success') },
            { icon: <ExternalLink size={13} />, label: 'EOB History', onClick: () => onToast('EOB history opened', 'info') },
          ].map(btn => (
            <button key={btn.label} onClick={btn.onClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: '#F1F5F9', color: '#475569', fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }}>
              {btn.icon} {btn.label}
            </button>
          ))}
          <div className="ml-auto flex gap-1">
            <button className="p-1.5 rounded-lg" style={{ background: '#F1F5F9', border: 'none', cursor: 'pointer' }}><ChevronLeft size={14} color="#64748B" /></button>
            <button className="p-1.5 rounded-lg" style={{ background: '#F1F5F9', border: 'none', cursor: 'pointer' }}><ChevronRight size={14} color="#64748B" /></button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
