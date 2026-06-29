import React, { useState, useCallback, useMemo } from 'react';
import {
  Search, Download, Plus, FileText, CheckCircle2, Clock, XCircle,
  AlertTriangle, Eye, MoreVertical, LayoutGrid, LayoutList,
  ChevronLeft, ChevronRight, Copy, Shield, Scale, Bell, User,
  TrendingUp, AlertOctagon, Filter, SlidersHorizontal,
} from 'lucide-react';
import type { PortalClaim, PortalClaimStatus } from '../../types/insurancePortal';
import { claimsData, claimsSummary } from '../../data/claimsData';
import InsuranceSidebar from './InsuranceSidebar';
import ClaimDetailDrawer from './ClaimDetailDrawer';
import AppealReviewModal from './AppealReviewModal';
import QuickDecisionModal from './QuickDecisionModal';
import EOBExportModal from './EOBExportModal';
import ManualClaimModal from './ManualClaimModal';

interface Props {
  onNavigate: (page: string) => void;
}

type TabKey = 'all' | 'pending' | 'approved' | 'denied' | 'appealed' | 'flagged';
type ViewMode = 'table' | 'card';

interface Toast { id: number; msg: string; type: 'success' | 'warning' | 'info' }

const STATUS_MAP: Record<PortalClaimStatus, { border: string; bg: string; chip: string; chipText: string; text: string }> = {
  AUTO_APPROVED: { border: '#0D9488', bg: '#F0FDFA', chip: '#CCFBF1', chipText: '#0F766E', text: 'Auto-Approved' },
  APPROVED:      { border: '#059669', bg: '#F0FDF4', chip: '#DCFCE7', chipText: '#065F46', text: 'Approved' },
  PENDING:       { border: '#D97706', bg: '#FFFBEB', chip: '#FEF3C7', chipText: '#92400E', text: 'Pending' },
  DENIED:        { border: '#DC2626', bg: '#FFF5F5', chip: '#FEE2E2', chipText: '#991B1B', text: 'Denied' },
  APPEALED:      { border: '#7C3AED', bg: '#F5F3FF', chip: '#EDE9FE', chipText: '#4C1D95', text: 'Appealed' },
  FRAUD_FLAGGED: { border: '#EA580C', bg: '#FFF7ED', chip: '#FED7AA', chipText: '#9A3412', text: 'Fraud Flagged' },
  ON_HOLD:       { border: '#64748B', bg: '#F8FAFC', chip: '#F1F5F9', chipText: '#475569', text: 'On Hold' },
};

const planColors: Record<string, { bg: string; color: string }> = {
  Gold:   { bg: '#FEF9C3', color: '#713F12' },
  Silver: { bg: '#F1F5F9', color: '#334155' },
  Basic:  { bg: '#EFF6FF', color: '#1E40AF' },
  Thiqa:  { bg: '#F3E8FF', color: '#581C87' },
};

const TAB_FILTERS: Record<TabKey, (c: PortalClaim) => boolean> = {
  all:      () => true,
  pending:  c => c.status === 'PENDING' || c.status === 'ON_HOLD',
  approved: c => c.status === 'APPROVED' || c.status === 'AUTO_APPROVED',
  denied:   c => c.status === 'DENIED',
  appealed: c => c.status === 'APPEALED',
  flagged:  c => c.status === 'FRAUD_FLAGGED',
};

const ClaimsPage: React.FC<Props> = ({ onNavigate }) => {
  const [claims, setClaims] = useState<PortalClaim[]>(claimsData);
  const [tab, setTab] = useState<TabKey>('all');
  const [view, setView] = useState<ViewMode>('table');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Modals
  const [drawerClaim, setDrawerClaim] = useState<PortalClaim | null>(null);
  const [appealClaim, setAppealClaim] = useState<PortalClaim | null>(null);
  const [quickDecision, setQuickDecision] = useState<{ claim: PortalClaim; type: 'approve' | 'deny' } | null>(null);
  const [showEobExport, setShowEobExport] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const addToast = useCallback((msg: string, type: 'success' | 'warning' | 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const filtered = useMemo(() => {
    let list = claims.filter(TAB_FILTERS[tab]);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.patientName.toLowerCase().includes(q) ||
        c.shortRef.toLowerCase().includes(q) ||
        c.claimRef.toLowerCase().includes(q) ||
        c.serviceName.toLowerCase().includes(q) ||
        c.doctorName.toLowerCase().includes(q) ||
        c.facilityName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [claims, tab, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const tabCount = (key: TabKey) => claims.filter(TAB_FILTERS[key]).length;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map(c => c.id)));
    }
  };

  const applyDecision = (claimId: string, decision: 'APPROVED' | 'DENIED', note: string) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: decision } : c));
    addToast(decision === 'APPROVED' ? `Claim approved — ${note}` : `Claim denied — ${note}`, decision === 'APPROVED' ? 'success' : 'warning');
    setQuickDecision(null);
    if (drawerClaim?.id === claimId) setDrawerClaim(null);
  };

  const applyUphold = (claimId: string) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'APPROVED' as PortalClaimStatus } : c));
    addToast('Appeal upheld — claim approved', 'success');
    setAppealClaim(null);
  };

  const applyDismiss = (claimId: string, reason: string) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'DENIED' as PortalClaimStatus, denialReason: reason } : c));
    addToast('Appeal dismissed — denial maintained', 'warning');
    setAppealClaim(null);
  };

  const bulkApprove = () => {
    setClaims(prev => prev.map(c => selectedIds.has(c.id) && c.status === 'PENDING' ? { ...c, status: 'APPROVED' as PortalClaimStatus } : c));
    addToast(`${selectedIds.size} claims approved in bulk`, 'success');
    setSelectedIds(new Set());
  };

  const bulkDeny = () => {
    setClaims(prev => prev.map(c => selectedIds.has(c.id) && c.status === 'PENDING' ? { ...c, status: 'DENIED' as PortalClaimStatus } : c));
    addToast(`${selectedIds.size} claims denied`, 'warning');
    setSelectedIds(new Set());
  };

  const totalValue = filtered.reduce((s, c) => s + c.grossAmount, 0);
  const totalDamanPays = filtered.reduce((s, c) => s + c.damanPays, 0);

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'all', label: 'All Claims' },
    { key: 'pending', label: 'Pending Review' },
    { key: 'approved', label: 'Approved' },
    { key: 'denied', label: 'Denied' },
    { key: 'appealed', label: 'Appealed' },
    { key: 'flagged', label: 'Flagged' },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F0F4F8', fontFamily: 'Inter, sans-serif' }}>
      <InsuranceSidebar activePage="claims" onNavigate={onNavigate} />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between flex-shrink-0" style={{ height: 64, padding: '0 24px', background: '#1E3A5F', borderBottom: '1px solid #2D4A6F' }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: '#0D9488', color: '#fff', fontWeight: 900, fontSize: 16, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>D</div>
            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.15)' }} />
            <FileText style={{ width: 16, height: 16, color: '#93C5FD' }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Claims</span>
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: 'rgba(13,148,136,0.2)', border: '1px solid rgba(13,148,136,0.4)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 11, color: '#6EE7B7', fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>
                {claimsSummary.total} claims today · AED {claimsSummary.totalValue.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowEobExport(true)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#E2E8F0', fontSize: 12, border: '1px solid rgba(255,255,255,0.12)' }}>
              <Download style={{ width: 13, height: 13 }} /> Export EOB Batch
            </button>
            <button onClick={() => setShowManual(true)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors"
              style={{ background: '#0D9488', color: '#fff', fontSize: 12, fontWeight: 600 }}>
              <Plus style={{ width: 13, height: 13 }} /> Manual Claim
            </button>
            <div className="relative">
              <button className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.08)', color: '#94A3B8' }}>
                <Bell style={{ width: 15, height: 15 }} />
              </button>
              <div className="absolute -top-1 -right-1 rounded-full flex items-center justify-center" style={{ width: 14, height: 14, background: '#DC2626', fontSize: 8, color: '#fff', fontWeight: 700 }}>3</div>
            </div>
            <div className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32, background: '#2D4A6F', color: '#93C5FD' }}>
              <User style={{ width: 15, height: 15 }} />
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main */}
          <div className="flex-1 overflow-y-auto" style={{ padding: '20px 24px' }}>
            {/* Stats strip */}
            <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {[
                { label: 'Total Claims Today', value: claimsSummary.total, sub: `AED ${(claimsSummary.totalValue / 1000).toFixed(0)}K gross`, accent: '#1E3A5F', icon: <FileText style={{ width: 16, height: 16, color: '#1E3A5F' }} /> },
                { label: 'Auto-Approved', value: claimsSummary.autoApproved, sub: `${claimsSummary.autoApprovedPct}% · avg ${claimsSummary.autoApprovedAvgSecs}s`, accent: '#0D9488', icon: <CheckCircle2 style={{ width: 16, height: 16, color: '#0D9488' }} /> },
                { label: 'Pending Review', value: claimsSummary.pending, sub: `AED ${(claimsSummary.pendingValue / 1000).toFixed(0)}K on hold`, accent: '#D97706', icon: <Clock style={{ width: 16, height: 16, color: '#D97706' }} /> },
                { label: 'Denied', value: claimsSummary.denied, sub: `${claimsSummary.denialRate}% denial rate`, accent: '#DC2626', icon: <XCircle style={{ width: 16, height: 16, color: '#DC2626' }} /> },
                { label: 'Under Appeal', value: claimsSummary.appealed, sub: `AED ${(claimsSummary.appealedValue / 1000).toFixed(0)}K contested`, accent: '#7C3AED', icon: <Scale style={{ width: 16, height: 16, color: '#7C3AED' }} /> },
              ].map(s => (
                <div key={s.label} className="rounded-xl flex items-center gap-3"
                  style={{ background: '#fff', border: '1px solid #E2E8F0', borderLeft: `3px solid ${s.accent}`, padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, background: s.accent + '15' }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 22, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>{s.label}</div>
                    {s.sub && <div style={{ fontSize: 10, color: s.accent, fontWeight: 600, marginTop: 1 }}>{s.sub}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Pending amber banner */}
            {tab === 'pending' && (
              <div className="rounded-xl p-3 mb-4 flex items-center gap-3" style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
                <AlertTriangle style={{ width: 15, height: 15, color: '#D97706', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>
                  {tabCount('pending')} claims require human review — average wait time 2.4 hours. SLA deadline approaching for {Math.min(tabCount('pending'), 7)} claims.
                </span>
              </div>
            )}

            {/* Main card */}
            <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              {/* Filter row */}
              <div className="flex items-center gap-2 flex-wrap" style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
                <div className="relative flex-1" style={{ minWidth: 220 }}>
                  <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: '#94A3B8' }} />
                  <input
                    value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search by patient, claim ID, provider..."
                    className="w-full rounded-lg outline-none"
                    style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, fontSize: 12, background: '#fff', border: '1px solid #E2E8F0', color: '#0F172A' }} />
                </div>
                <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ fontSize: 12, color: '#475569', background: '#fff', border: '1px solid #E2E8F0' }}>
                  <SlidersHorizontal style={{ width: 12, height: 12 }} /> Filters
                </button>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                  <button onClick={() => setView('table')} className="rounded-lg p-2"
                    style={{ background: view === 'table' ? '#EFF6FF' : 'transparent', color: view === 'table' ? '#2563EB' : '#94A3B8' }}>
                    <LayoutList style={{ width: 14, height: 14 }} />
                  </button>
                  <button onClick={() => setView('card')} className="rounded-lg p-2"
                    style={{ background: view === 'card' ? '#EFF6FF' : 'transparent', color: view === 'card' ? '#2563EB' : '#94A3B8' }}>
                    <LayoutGrid style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>

              {/* Tab bar */}
              <div className="flex" style={{ borderBottom: '1px solid #F1F5F9', padding: '0 16px', overflowX: 'auto' }}>
                {TABS.map(t => (
                  <button key={t.key} onClick={() => { setTab(t.key); setPage(1); setSelectedIds(new Set()); }}
                    className="flex items-center gap-1.5 py-3 px-3 flex-shrink-0 transition-colors"
                    style={{
                      fontSize: 12, fontWeight: tab === t.key ? 700 : 400,
                      color: tab === t.key ? '#1E3A5F' : '#64748B',
                      borderBottom: tab === t.key ? '2px solid #1E3A5F' : '2px solid transparent',
                      marginBottom: -1,
                    }}>
                    {t.label}
                    <span className="rounded-full px-1.5 py-0.5"
                      style={{ fontSize: 10, fontWeight: 700, background: tab === t.key ? '#EFF6FF' : '#F1F5F9', color: tab === t.key ? '#1E3A5F' : '#94A3B8' }}>
                      {tabCount(t.key)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Table view */}
              {view === 'table' && (
                <div className="overflow-x-auto">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                        <th style={{ width: 36, padding: '10px 12px' }}>
                          <input type="checkbox" checked={paginated.length > 0 && selectedIds.size === paginated.length}
                            onChange={toggleAll} style={{ accentColor: '#1E3A5F' }} />
                        </th>
                        {['Claim ID', 'Submitted', 'Patient & Plan', 'Provider / Facility', 'Service & ICD-10', 'Gross', 'Co-pay', 'Daman Pays', 'Status', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '10px 12px', fontSize: 10, fontWeight: 700, color: '#94A3B8', textAlign: 'left', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map(claim => {
                        const s = STATUS_MAP[claim.status];
                        const plan = planColors[claim.planType] ?? { bg: '#F8FAFC', color: '#475569' };
                        const isSelected = selectedIds.has(claim.id);
                        const annualPct = Math.round((claim.annualUsed / claim.annualLimit) * 100);
                        return (
                          <tr key={claim.id}
                            style={{ borderBottom: '1px solid #F8FAFC', background: isSelected ? '#EFF6FF' : s.bg, borderLeft: `3px solid ${s.border}`, cursor: 'pointer' }}
                            onClick={() => setDrawerClaim(claim)}>
                            <td style={{ padding: '10px 12px' }} onClick={e => { e.stopPropagation(); toggleSelect(claim.id); }}>
                              <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(claim.id)} style={{ accentColor: '#1E3A5F' }} />
                            </td>
                            <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                              <div className="flex items-center gap-1.5">
                                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700, color: '#2563EB' }}>{claim.shortRef}</span>
                                <button onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(claim.claimRef); addToast('Claim ID copied', 'info'); }}
                                  style={{ color: '#CBD5E1', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                  <Copy style={{ width: 10, height: 10 }} />
                                </button>
                              </div>
                              {claim.turnaroundMins && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#0D9488', marginTop: 1 }}>{claim.turnaroundMins}m TA</div>}
                            </td>
                            <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                              <div style={{ fontSize: 11, color: '#475569' }}>{claim.submittedAt}</div>
                              <div style={{ fontSize: 10, color: '#94A3B8' }}>{claim.submittedDate}</div>
                            </td>
                            <td style={{ padding: '10px 12px', minWidth: 160 }}>
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className="rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ width: 22, height: 22, background: '#1E3A5F', color: '#fff', fontSize: 9, fontWeight: 700 }}>
                                  {claim.patientInitials}
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{claim.patientName}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="rounded px-1.5 py-0.5" style={{ fontSize: 9, fontWeight: 700, background: plan.bg, color: plan.color }}>Daman {claim.planType}</span>
                                <div style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{annualPct}% used</div>
                              </div>
                              <div className="rounded-full overflow-hidden mt-1" style={{ height: 2, width: 80, background: '#E2E8F0' }}>
                                <div style={{ height: 2, width: `${Math.min(100, annualPct)}%`, background: annualPct > 80 ? '#DC2626' : '#0D9488' }} />
                              </div>
                            </td>
                            <td style={{ padding: '10px 12px', minWidth: 160 }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{claim.doctorName}</div>
                              <div style={{ fontSize: 10, color: '#64748B' }}>{claim.facilityName}</div>
                              {!claim.inNetwork && <span style={{ fontSize: 9, color: '#DC2626', fontWeight: 600 }}>OUT OF NETWORK</span>}
                            </td>
                            <td style={{ padding: '10px 12px', minWidth: 160 }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{claim.serviceName}</div>
                              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#64748B' }}>{claim.icd10} · {claim.icd10Description}</div>
                            </td>
                            <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{claim.grossAmount.toLocaleString()}</span>
                            </td>
                            <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#D97706' }}>{claim.copayAmount.toLocaleString()}</span>
                            </td>
                            <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#059669' }}>{claim.damanPays.toLocaleString()}</span>
                            </td>
                            <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                              <div className="flex items-center gap-1.5">
                                <span className="rounded-full px-2 py-0.5" style={{ fontSize: 10, fontWeight: 700, background: s.chip, color: s.chipText }}>
                                  {s.text}
                                </span>
                                {claim.status === 'FRAUD_FLAGGED' && <AlertOctagon style={{ width: 12, height: 12, color: '#EA580C' }} />}
                                {claim.aiConfidence && <span style={{ fontSize: 9, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{claim.aiConfidence}%</span>}
                              </div>
                              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{claim.paymentStatus}</div>
                            </td>
                            <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }} onClick={e => e.stopPropagation()}>
                              <div className="flex items-center gap-1">
                                <button onClick={() => setDrawerClaim(claim)}
                                  className="rounded p-1 transition-colors"
                                  style={{ color: '#2563EB', background: '#EFF6FF' }}>
                                  <Eye style={{ width: 12, height: 12 }} />
                                </button>
                                {claim.status === 'PENDING' && (
                                  <>
                                    <button onClick={() => setQuickDecision({ claim, type: 'approve' })}
                                      className="rounded p-1"
                                      style={{ color: '#059669', background: '#F0FDF4' }}>
                                      <CheckCircle2 style={{ width: 12, height: 12 }} />
                                    </button>
                                    <button onClick={() => setQuickDecision({ claim, type: 'deny' })}
                                      className="rounded p-1"
                                      style={{ color: '#DC2626', background: '#FFF5F5' }}>
                                      <XCircle style={{ width: 12, height: 12 }} />
                                    </button>
                                  </>
                                )}
                                {claim.status === 'APPEALED' && (
                                  <button onClick={() => setAppealClaim(claim)}
                                    className="rounded p-1"
                                    style={{ color: '#7C3AED', background: '#F5F3FF' }}>
                                    <Scale style={{ width: 12, height: 12 }} />
                                  </button>
                                )}
                                <div className="relative">
                                  <button onClick={() => setOpenMenuId(openMenuId === claim.id ? null : claim.id)}
                                    className="rounded p-1"
                                    style={{ color: '#94A3B8', background: 'transparent' }}>
                                    <MoreVertical style={{ width: 12, height: 12 }} />
                                  </button>
                                  {openMenuId === claim.id && (
                                    <div className="absolute right-0 rounded-xl overflow-hidden z-50" style={{ top: '100%', width: 180, background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                                      {[
                                        { label: 'View Details', icon: <Eye style={{ width: 12, height: 12 }} />, action: () => { setDrawerClaim(claim); setOpenMenuId(null); } },
                                        { label: 'Download EOB', icon: <Download style={{ width: 12, height: 12 }} />, action: () => { addToast(`EOB downloaded for ${claim.shortRef}`, 'success'); setOpenMenuId(null); } },
                                        { label: 'Copy Claim Ref', icon: <Copy style={{ width: 12, height: 12 }} />, action: () => { navigator.clipboard.writeText(claim.claimRef); addToast('Claim ID copied', 'info'); setOpenMenuId(null); } },
                                        ...(claim.status === 'PENDING' ? [
                                          { label: 'Quick Approve', icon: <CheckCircle2 style={{ width: 12, height: 12 }} />, action: () => { setQuickDecision({ claim, type: 'approve' }); setOpenMenuId(null); } },
                                          { label: 'Quick Deny', icon: <XCircle style={{ width: 12, height: 12 }} />, action: () => { setQuickDecision({ claim, type: 'deny' }); setOpenMenuId(null); } },
                                        ] : []),
                                        ...(claim.status === 'APPEALED' ? [
                                          { label: 'Review Appeal', icon: <Scale style={{ width: 12, height: 12 }} />, action: () => { setAppealClaim(claim); setOpenMenuId(null); } },
                                        ] : []),
                                        { label: 'Flag for Review', icon: <Shield style={{ width: 12, height: 12 }} />, action: () => { addToast(`${claim.shortRef} flagged for review`, 'warning'); setOpenMenuId(null); } },
                                      ].map(item => (
                                        <button key={item.label} onClick={item.action}
                                          className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors"
                                          style={{ fontSize: 12, color: '#334155', borderBottom: '1px solid #F8FAFC' }}
                                          onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; }}
                                          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>
                                          {item.icon} {item.label}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Card view */}
              {view === 'card' && (
                <div className="grid gap-3 p-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {paginated.map(claim => {
                    const s = STATUS_MAP[claim.status];
                    const plan = planColors[claim.planType] ?? { bg: '#F8FAFC', color: '#475569' };
                    return (
                      <div key={claim.id} onClick={() => setDrawerClaim(claim)}
                        className="rounded-xl cursor-pointer transition-shadow"
                        style={{ background: s.bg, border: `1px solid ${s.border}30`, borderLeft: `3px solid ${s.border}`, padding: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}>
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700, color: '#2563EB' }}>{claim.shortRef}</span>
                          <span className="rounded-full px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700, background: s.chip, color: s.chipText }}>{s.text}</span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{claim.patientName}</div>
                        <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>{claim.serviceName}</div>
                        <div className="flex items-center justify-between">
                          <span className="rounded px-1.5 py-0.5" style={{ fontSize: 9, fontWeight: 700, background: plan.bg, color: plan.color }}>Daman {claim.planType}</span>
                          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 800, color: '#059669' }}>AED {claim.damanPays.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Table footer */}
              <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', background: '#FAFAFA' }}>
                <div style={{ fontSize: 12, color: '#64748B' }}>
                  Showing <span style={{ fontWeight: 700, color: '#0F172A' }}>{Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)}</span> of <span style={{ fontWeight: 700, color: '#0F172A' }}>{filtered.length}</span> claims
                  <span style={{ fontFamily: 'DM Mono, monospace', color: '#94A3B8', marginLeft: 8 }}>· AED {totalValue.toLocaleString()} gross · AED {totalDamanPays.toLocaleString()} Daman liability</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="rounded-lg p-1.5 transition-colors"
                    style={{ color: page === 1 ? '#CBD5E1' : '#475569', background: '#fff', border: '1px solid #E2E8F0' }}>
                    <ChevronLeft style={{ width: 13, height: 13 }} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => Math.abs(p - page) <= 2 || p === 1 || p === totalPages).map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span style={{ fontSize: 12, color: '#CBD5E1', padding: '0 2px' }}>…</span>}
                      <button onClick={() => setPage(p)}
                        className="rounded-lg px-2.5 py-1.5 transition-colors"
                        style={{ fontSize: 12, fontWeight: p === page ? 700 : 400, background: p === page ? '#1E3A5F' : '#fff', color: p === page ? '#fff' : '#475569', border: '1px solid #E2E8F0', minWidth: 32 }}>
                        {p}
                      </button>
                    </React.Fragment>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="rounded-lg p-1.5 transition-colors"
                    style={{ color: page === totalPages ? '#CBD5E1' : '#475569', background: '#fff', border: '1px solid #E2E8F0' }}>
                    <ChevronRight style={{ width: 13, height: 13 }} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Drawer */}
          {drawerClaim && (
            <ClaimDetailDrawer
              claim={drawerClaim}
              allClaims={filtered}
              onClose={() => setDrawerClaim(null)}
              onDecision={applyDecision}
              onToast={addToast}
              onNavigate={(claim) => setDrawerClaim(claim)}
            />
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 right-0 z-[500] flex items-center justify-between" style={{ left: 264, padding: '12px 24px', background: '#1E3A5F', borderTop: '1px solid #2D4A6F', boxShadow: '0 -4px 20px rgba(0,0,0,0.25)' }}>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full" style={{ width: 24, height: 24, background: '#0D9488', color: '#fff', fontSize: 11, fontWeight: 700 }}>
              {selectedIds.size}
            </div>
            <span style={{ fontSize: 13, color: '#E2E8F0' }}>claims selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={bulkApprove}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2"
              style={{ background: '#059669', color: '#fff', fontSize: 12, fontWeight: 700 }}>
              <CheckCircle2 style={{ width: 13, height: 13 }} /> Approve Selected
            </button>
            <button onClick={bulkDeny}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2"
              style={{ background: '#DC2626', color: '#fff', fontSize: 12, fontWeight: 700 }}>
              <XCircle style={{ width: 13, height: 13 }} /> Deny Selected
            </button>
            <button onClick={() => setShowEobExport(true)}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#E2E8F0', fontSize: 12, border: '1px solid rgba(255,255,255,0.2)' }}>
              <Download style={{ width: 13, height: 13 }} /> Export EOBs
            </button>
            <button onClick={() => addToast(`EOBs emailed for ${selectedIds.size} claims`, 'info')}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#E2E8F0', fontSize: 12, border: '1px solid rgba(255,255,255,0.2)' }}>
              <TrendingUp style={{ width: 13, height: 13 }} /> Email EOBs
            </button>
            <button onClick={() => setSelectedIds(new Set())}
              className="rounded-lg px-3 py-2"
              style={{ background: 'transparent', color: '#94A3B8', fontSize: 12 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Click away for context menus */}
      {openMenuId && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
      )}

      {/* Modals */}
      {appealClaim && (
        <AppealReviewModal
          claim={appealClaim}
          onClose={() => setAppealClaim(null)}
          onUphold={applyUphold}
          onDismiss={applyDismiss}
        />
      )}
      {quickDecision && (
        <QuickDecisionModal
          claim={quickDecision.claim}
          type={quickDecision.type}
          onClose={() => setQuickDecision(null)}
          onConfirm={applyDecision}
        />
      )}
      {showEobExport && (
        <EOBExportModal
          totalClaims={claimsSummary.total}
          totalValue={claimsSummary.totalValue}
          approvedClaims={tabCount('approved')}
          selectedClaims={selectedIds.size}
          onClose={() => setShowEobExport(false)}
          onToast={addToast}
        />
      )}
      {showManual && (
        <ManualClaimModal
          onClose={() => setShowManual(false)}
          onToast={addToast}
        />
      )}

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[700] flex flex-col gap-2" style={{ pointerEvents: 'none' }}>
        {toasts.map(t => (
          <div key={t.id} className="rounded-xl flex items-center gap-2 shadow-xl"
            style={{
              padding: '10px 16px', minWidth: 280, maxWidth: 380, pointerEvents: 'auto',
              background: t.type === 'success' ? '#F0FDF4' : t.type === 'warning' ? '#FFFBEB' : '#EFF6FF',
              border: `1px solid ${t.type === 'success' ? '#86EFAC' : t.type === 'warning' ? '#FCD34D' : '#BFDBFE'}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}>
            {t.type === 'success' && <CheckCircle2 style={{ width: 14, height: 14, color: '#059669', flexShrink: 0 }} />}
            {t.type === 'warning' && <AlertTriangle style={{ width: 14, height: 14, color: '#D97706', flexShrink: 0 }} />}
            {t.type === 'info' && <FileText style={{ width: 14, height: 14, color: '#2563EB', flexShrink: 0 }} />}
            <span style={{ fontSize: 12, color: '#0F172A', fontWeight: 500 }}>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClaimsPage;
