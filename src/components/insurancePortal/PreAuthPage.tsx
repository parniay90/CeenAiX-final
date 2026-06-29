import React, { useState, useCallback, useMemo } from 'react';
import {
  Search, Filter, LayoutGrid, LayoutList, CheckCircle2,
  Clock, AlertOctagon, XCircle, Brain, ChevronDown,
  FileCheck, Download, RefreshCw, ChevronRight,
} from 'lucide-react';
import type { PreAuthRequest } from '../../types/insurancePortal';
import { preAuthRequests, processedPreAuths } from '../../data/insurancePortalData';
import InsuranceSidebar from './InsuranceSidebar';
import SlaOverdueBanner from './SlaOverdueBanner';
import PreAuthDetailPanel from './PreAuthDetailPanel';
import BulkApproveModal from './BulkApproveModal';

interface Toast { id: number; msg: string; type: 'success' | 'warning' | 'info' }

interface Props {
  onNavigate: (page: string) => void;
}

type TabKey = 'pending' | 'processed' | 'all';
type SortKey = 'priority' | 'sla' | 'cost' | 'submitted';

const PRIORITY_ORDER: Record<string, number> = { OVERDUE: 0, URGENT: 1, HIGH: 2, STANDARD: 3 };

const priorityAccent: Record<string, string> = {
  OVERDUE: '#DC2626', URGENT: '#D97706', HIGH: '#3B82F6', STANDARD: '#64748B',
};

const planColors: Record<string, { bg: string; color: string }> = {
  Gold:   { bg: '#FEF9C3', color: '#713F12' },
  Silver: { bg: '#F1F5F9', color: '#334155' },
  Basic:  { bg: '#EFF6FF', color: '#1E40AF' },
  Thiqa:  { bg: '#F3E8FF', color: '#581C87' },
};

const aiColors: Record<string, { bg: string; color: string }> = {
  APPROVE: { bg: '#DCFCE7', color: '#065F46' },
  DENY:    { bg: '#FEE2E2', color: '#991B1B' },
  REVIEW:  { bg: '#FEF3C7', color: '#92400E' },
};

const SlaChip: React.FC<{ mins: number; hours: number }> = ({ mins, hours }) => {
  const isOverdue = mins < 0;
  const pct = isOverdue ? 0 : Math.min(100, (mins / (hours * 60)) * 100);
  const color = isOverdue ? '#DC2626' : pct < 20 ? '#D97706' : '#059669';
  const absH = Math.abs(Math.floor(mins / 60));
  const absM = Math.abs(mins % 60);
  return (
    <div style={{ minWidth: 88 }}>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700, color, marginBottom: 3 }}>
        {isOverdue ? `+${absH}h ${absM}m` : `${absH}h ${absM}m`}
      </div>
      <div className="rounded-full" style={{ height: 3, background: '#F1F5F9', width: 72 }}>
        <div className="rounded-full" style={{ height: 3, width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  label: string; value: string | number; sub?: string;
  accent: string; icon: React.ReactNode;
}> = ({ label, value, sub, accent, icon }) => (
  <div
    className="rounded-xl flex items-center gap-3"
    style={{ background: '#fff', border: '1px solid #E2E8F0', borderLeft: `3px solid ${accent}`, padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
  >
    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: accent + '15' }}>
      {icon}
    </div>
    <div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 22, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: accent, fontWeight: 600, marginTop: 1 }}>{sub}</div>}
    </div>
  </div>
);

const PreAuthPage: React.FC<Props> = ({ onNavigate }) => {
  const [records, setRecords] = useState<PreAuthRequest[]>(preAuthRequests);
  const [selectedPanel, setSelectedPanel] = useState<PreAuthRequest | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('priority');
  const [filterAi, setFilterAi] = useState<string>('ALL');
  const [filterPlan, setFilterPlan] = useState<string>('ALL');
  const [showBulk, setShowBulk] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const handleDecision = useCallback((paId: string, decision: 'APPROVED' | 'DENIED', note: string) => {
    setRecords(prev => prev.map(r => r.id === paId ? { ...r, status: decision } : r));
    setSelectedPanel(null);
    toast(
      decision === 'APPROVED'
        ? `Pre-authorization approved successfully`
        : `Pre-authorization denied — ${note.slice(0, 60)}...`,
      decision === 'APPROVED' ? 'success' : 'warning'
    );
  }, [toast]);

  const handleBulkConfirm = useCallback((ids: string[], note: string) => {
    setRecords(prev => prev.map(r => ids.includes(r.id) ? { ...r, status: 'APPROVED' as const } : r));
    setShowBulk(false);
    toast(`${ids.length} pre-authorizations approved in bulk`, 'success');
  }, [toast]);

  const pendingRecords = useMemo(() => records.filter(r => r.status === 'PENDING'), [records]);
  const approvedRecords = useMemo(() => records.filter(r => r.status !== 'PENDING'), [records]);

  const displayRecords = useMemo(() => {
    let base = activeTab === 'pending' ? pendingRecords : activeTab === 'processed' ? approvedRecords : records;
    if (search) {
      const q = search.toLowerCase();
      base = base.filter(r =>
        r.patientName.toLowerCase().includes(q) ||
        r.paRef.toLowerCase().includes(q) ||
        r.procedure.toLowerCase().includes(q) ||
        r.doctorName.toLowerCase().includes(q)
      );
    }
    if (filterAi !== 'ALL') base = base.filter(r => r.aiRecommendation === filterAi);
    if (filterPlan !== 'ALL') base = base.filter(r => r.planType === filterPlan);
    return [...base].sort((a, b) => {
      if (sortKey === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sortKey === 'sla') return a.slaRemainingMinutes - b.slaRemainingMinutes;
      if (sortKey === 'cost') return b.estimatedCost - a.estimatedCost;
      return 0;
    });
  }, [records, activeTab, pendingRecords, approvedRecords, search, filterAi, filterPlan, sortKey]);

  const bulkCandidates = pendingRecords.filter(r =>
    r.aiRecommendation === 'APPROVE' || r.aiRecommendation === 'REVIEW'
  );

  const overdue = pendingRecords.find(r => r.priority === 'OVERDUE');
  const toastColors: Record<Toast['type'], { border: string; color: string; bg: string }> = {
    success: { border: '#6EE7B7', color: '#065F46', bg: '#F0FDF4' },
    warning: { border: '#FCA5A5', color: '#991B1B', bg: '#FFF5F5' },
    info:    { border: '#93C5FD', color: '#1E40AF', bg: '#EFF6FF' },
  };

  const TABS: { key: TabKey; label: string; count: number }[] = [
    { key: 'pending',   label: 'Pending Review', count: pendingRecords.length },
    { key: 'processed', label: 'Processed Today', count: approvedRecords.length + processedPreAuths.length },
    { key: 'all',       label: 'All',             count: records.length },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F1F5F9' }}>
      <InsuranceSidebar activePage="preauth" onNavigate={onNavigate} slaBreached={!!overdue} />

      <div className="flex-1 flex overflow-hidden min-w-0">
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Page header */}
          <div
            className="flex items-center justify-between flex-shrink-0"
            style={{ padding: '0 24px', height: 60, background: '#fff', borderBottom: '1px solid #E2E8F0' }}
          >
            <div className="flex items-center gap-2" style={{ fontSize: 12, color: '#94A3B8' }}>
              <span
                className="cursor-pointer transition-colors"
                onClick={() => onNavigate('dashboard')}
                onMouseEnter={e => { e.currentTarget.style.color = '#2563EB'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; }}
              >
                Dashboard
              </span>
              <ChevronRight style={{ width: 12, height: 12 }} />
              <span style={{ color: '#0F172A', fontWeight: 700 }}>Pre-Authorizations</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
                style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 12, color: '#475569' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}
              >
                <RefreshCw style={{ width: 12, height: 12 }} />
                Refresh
              </button>
              <button
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
                style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 12, color: '#475569' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}
              >
                <Download style={{ width: 12, height: 12 }} />
                Export
              </button>
              <button
                onClick={() => setShowBulk(true)}
                className="flex items-center gap-2 rounded-lg px-4 py-1.5 transition-colors"
                style={{ background: '#059669', color: '#fff', fontSize: 12, fontWeight: 700 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#047857'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#059669'; }}
              >
                <CheckCircle2 style={{ width: 13, height: 13 }} />
                Bulk Approve
                <span className="rounded-full px-1.5 py-0.5" style={{ background: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>
                  {bulkCandidates.filter(c => c.aiRecommendation === 'APPROVE').length}
                </span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto" style={{ padding: '20px 24px 32px' }}>
            {/* SLA banner */}
            {overdue && (
              <div className="mb-4">
                <SlaOverdueBanner onReview={() => setSelectedPanel(overdue)} />
              </div>
            )}

            {/* Stats strip */}
            <div className="grid grid-cols-4 gap-4 mb-5">
              <StatCard
                label="Pending Review"
                value={pendingRecords.length}
                sub={`${pendingRecords.filter(r => r.priority === 'OVERDUE' || r.priority === 'URGENT').length} urgent`}
                accent="#DC2626"
                icon={<Clock style={{ width: 16, height: 16, color: '#DC2626' }} />}
              />
              <StatCard
                label="AI Recommended Approve"
                value={pendingRecords.filter(r => r.aiRecommendation === 'APPROVE').length}
                sub="Ready for bulk action"
                accent="#059669"
                icon={<Brain style={{ width: 16, height: 16, color: '#059669' }} />}
              />
              <StatCard
                label="Auto-Approved Today"
                value={processedPreAuths.length}
                sub="By AI engine"
                accent="#2563EB"
                icon={<CheckCircle2 style={{ width: 16, height: 16, color: '#2563EB' }} />}
              />
              <StatCard
                label="Total Exposure"
                value={`AED ${(pendingRecords.reduce((s, r) => s + Math.round(r.estimatedCost * r.coveragePercent / 100), 0) / 1000).toFixed(0)}K`}
                sub="Pending decisions"
                accent="#D97706"
                icon={<AlertOctagon style={{ width: 16, height: 16, color: '#D97706' }} />}
              />
            </div>

            {/* Filter + search + tabs row */}
            <div
              className="rounded-xl mb-4"
              style={{ background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              {/* Tabs */}
              <div className="flex items-center gap-1 px-4 pt-3 pb-0" style={{ borderBottom: '1px solid #F1F5F9' }}>
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="flex items-center gap-2 px-3 py-2.5 transition-colors relative"
                    style={{
                      fontSize: 13,
                      fontWeight: activeTab === tab.key ? 700 : 500,
                      color: activeTab === tab.key ? '#0F172A' : '#64748B',
                      borderBottom: activeTab === tab.key ? '2px solid #0F172A' : '2px solid transparent',
                      marginBottom: -1,
                    }}
                  >
                    {tab.label}
                    <span
                      className="rounded-full px-1.5 py-0.5"
                      style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: 11,
                        fontWeight: 700,
                        background: activeTab === tab.key ? '#0F172A' : '#F1F5F9',
                        color: activeTab === tab.key ? '#fff' : '#64748B',
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Filters bar */}
              <div className="flex items-center gap-3 px-4 py-3">
                {/* Search */}
                <div className="relative flex-1" style={{ maxWidth: 300 }}>
                  <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: '#94A3B8' }} />
                  <input
                    type="text"
                    placeholder="Search patient, PA ref, procedure..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full rounded-lg outline-none"
                    style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, fontSize: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }}
                  />
                </div>

                {/* AI filter */}
                <div className="relative">
                  <select
                    value={filterAi}
                    onChange={e => setFilterAi(e.target.value)}
                    className="rounded-lg outline-none appearance-none pr-7 pl-3 py-1.5"
                    style={{ fontSize: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#475569' }}
                  >
                    <option value="ALL">All AI Recs</option>
                    <option value="APPROVE">AI: Approve</option>
                    <option value="REVIEW">AI: Review</option>
                    <option value="DENY">AI: Deny</option>
                  </select>
                  <ChevronDown style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 11, height: 11, color: '#94A3B8', pointerEvents: 'none' }} />
                </div>

                {/* Plan filter */}
                <div className="relative">
                  <select
                    value={filterPlan}
                    onChange={e => setFilterPlan(e.target.value)}
                    className="rounded-lg outline-none appearance-none pr-7 pl-3 py-1.5"
                    style={{ fontSize: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#475569' }}
                  >
                    <option value="ALL">All Plans</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Basic">Basic</option>
                    <option value="Thiqa">Thiqa</option>
                  </select>
                  <ChevronDown style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 11, height: 11, color: '#94A3B8', pointerEvents: 'none' }} />
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortKey}
                    onChange={e => setSortKey(e.target.value as SortKey)}
                    className="rounded-lg outline-none appearance-none pr-7 pl-3 py-1.5"
                    style={{ fontSize: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#475569' }}
                  >
                    <option value="priority">Sort: Priority</option>
                    <option value="sla">Sort: SLA Urgency</option>
                    <option value="cost">Sort: Cost (High)</option>
                    <option value="submitted">Sort: Submitted</option>
                  </select>
                  <ChevronDown style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 11, height: 11, color: '#94A3B8', pointerEvents: 'none' }} />
                </div>

                <div className="ml-auto flex items-center gap-1 rounded-lg p-1" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  {(['table', 'card'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setViewMode(v)}
                      className="rounded-md p-1.5 transition-all"
                      style={{
                        background: viewMode === v ? '#fff' : 'transparent',
                        color: viewMode === v ? '#0F172A' : '#94A3B8',
                        boxShadow: viewMode === v ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      }}
                    >
                      {v === 'table' ? <LayoutList style={{ width: 13, height: 13 }} /> : <LayoutGrid style={{ width: 13, height: 13 }} />}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1" style={{ fontSize: 11, color: '#94A3B8' }}>
                  <Filter style={{ width: 11, height: 11 }} />
                  {displayRecords.length} results
                </div>
              </div>
            </div>

            {/* Table view */}
            {viewMode === 'table' && (
              <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                {/* Table header */}
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: '90px 155px 1fr 115px 100px 110px 90px 108px',
                    background: '#F8FAFC',
                    borderBottom: '1px solid #E2E8F0',
                    padding: '0 16px',
                  }}
                >
                  {['PA Ref', 'Patient', 'Procedure', 'Plan · Doctor', 'AI Rec', 'Cost', 'SLA', 'Actions'].map(col => (
                    <div key={col} className="py-2.5" style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {col}
                    </div>
                  ))}
                </div>

                {displayRecords.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <FileCheck style={{ width: 32, height: 32, color: '#E2E8F0', marginBottom: 12 }} />
                    <p style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>No pre-authorizations match your filters</p>
                  </div>
                ) : (
                  displayRecords.map((pa, idx) => {
                    const accent = priorityAccent[pa.priority] ?? '#64748B';
                    const ai = aiColors[pa.aiRecommendation];
                    const plan = planColors[pa.planType];
                    const isProcessed = pa.status !== 'PENDING';
                    return (
                      <div
                        key={pa.id}
                        onClick={() => setSelectedPanel(pa)}
                        className="grid cursor-pointer transition-colors"
                        style={{
                          gridTemplateColumns: '90px 155px 1fr 115px 100px 110px 90px 108px',
                          padding: '0 16px',
                          borderBottom: idx < displayRecords.length - 1 ? '1px solid #F8FAFC' : 'none',
                          background: pa.priority === 'OVERDUE' ? 'rgba(254,226,226,0.25)' : 'transparent',
                          borderLeft: `3px solid ${accent}`,
                          alignItems: 'center',
                          minHeight: 52,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = pa.priority === 'OVERDUE' ? 'rgba(254,226,226,0.45)' : '#F8FAFC';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = pa.priority === 'OVERDUE' ? 'rgba(254,226,226,0.25)' : 'transparent';
                        }}
                      >
                        {/* PA Ref */}
                        <div style={{ paddingRight: 8 }}>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fontWeight: 700, color: accent }}>{pa.priority}</div>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#94A3B8', marginTop: 1 }}>{pa.paRef.slice(-5)}</div>
                        </div>

                        {/* Patient */}
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>{pa.patientName}</div>
                          <div style={{ fontSize: 10, color: '#94A3B8' }}>{pa.patientGender}/{pa.patientAge} · {pa.patientId}</div>
                        </div>

                        {/* Procedure */}
                        <div style={{ paddingRight: 8 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', lineHeight: 1.3 }}>{pa.procedure}</div>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#94A3B8' }}>{pa.icd10}</div>
                        </div>

                        {/* Plan · Doctor */}
                        <div>
                          <span className="rounded px-1.5 py-0.5 inline-block mb-1" style={{ background: plan.bg, color: plan.color, fontSize: 10, fontWeight: 700 }}>
                            {pa.planType}
                          </span>
                          <div style={{ fontSize: 10, color: '#64748B' }}>{pa.doctorName.replace('Dr. ', '')}</div>
                        </div>

                        {/* AI Rec */}
                        <div>
                          <span
                            className="rounded px-2 py-0.5 inline-flex items-center gap-1"
                            style={{ background: ai.bg, color: ai.color, fontSize: 10, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}
                          >
                            <Brain style={{ width: 9, height: 9 }} />
                            {pa.aiRecommendation}
                          </span>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{pa.aiConfidence}% conf.</div>
                        </div>

                        {/* Cost */}
                        <div>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                            AED {(pa.estimatedCost / 1000).toFixed(0)}K
                          </div>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#059669' }}>
                            {pa.coveragePercent}% cov.
                          </div>
                        </div>

                        {/* SLA */}
                        <div>
                          {isProcessed ? (
                            <span className="rounded px-1.5 py-0.5 inline-block" style={{ background: '#DCFCE7', color: '#065F46', fontSize: 10, fontWeight: 700 }}>
                              {pa.status}
                            </span>
                          ) : (
                            <SlaChip mins={pa.slaRemainingMinutes} hours={pa.slaHours} />
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          {!isProcessed && (
                            <>
                              <button
                                onClick={() => { setSelectedPanel(pa); }}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                                style={{ background: '#DCFCE7', color: '#065F46' }}
                                title="Approve"
                                onMouseEnter={e => { e.currentTarget.style.background = '#BBF7D0'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#DCFCE7'; }}
                              >
                                <CheckCircle2 style={{ width: 12, height: 12 }} />
                              </button>
                              <button
                                onClick={() => { setSelectedPanel(pa); }}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                                style={{ background: '#FEE2E2', color: '#DC2626' }}
                                title="Deny"
                                onMouseEnter={e => { e.currentTarget.style.background = '#FECACA'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#FEE2E2'; }}
                              >
                                <XCircle style={{ width: 12, height: 12 }} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setSelectedPanel(pa)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                            style={{ background: '#F1F5F9', color: '#64748B' }}
                            title="Review"
                            onMouseEnter={e => { e.currentTarget.style.background = '#E2E8F0'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; }}
                          >
                            <FileCheck style={{ width: 12, height: 12 }} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Card view */}
            {viewMode === 'card' && (
              <div className="grid grid-cols-3 gap-4">
                {displayRecords.map(pa => {
                  const accent = priorityAccent[pa.priority] ?? '#64748B';
                  const ai = aiColors[pa.aiRecommendation];
                  const plan = planColors[pa.planType];
                  const isProcessed = pa.status !== 'PENDING';
                  return (
                    <div
                      key={pa.id}
                      onClick={() => setSelectedPanel(pa)}
                      className="rounded-xl cursor-pointer transition-all"
                      style={{
                        background: '#fff',
                        border: '1px solid #E2E8F0',
                        borderLeft: `3px solid ${accent}`,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
                    >
                      <div style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9' }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, fontWeight: 700, color: accent }}>{pa.priority}</span>
                          <span className="rounded px-1.5 py-0.5" style={{ background: plan.bg, color: plan.color, fontSize: 10, fontWeight: 700 }}>{pa.planType}</span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2, lineHeight: 1.3 }}>{pa.procedure}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{pa.patientName} · {pa.patientGender}/{pa.patientAge}</div>
                      </div>
                      <div style={{ padding: '10px 14px' }}>
                        <div className="flex items-center justify-between mb-2.5">
                          <span
                            className="rounded px-2 py-0.5 inline-flex items-center gap-1"
                            style={{ background: ai.bg, color: ai.color, fontSize: 10, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}
                          >
                            <Brain style={{ width: 9, height: 9 }} />
                            {pa.aiRecommendation} {pa.aiConfidence}%
                          </span>
                          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                            AED {(pa.estimatedCost / 1000).toFixed(0)}K
                          </span>
                        </div>
                        {!isProcessed ? (
                          <SlaChip mins={pa.slaRemainingMinutes} hours={pa.slaHours} />
                        ) : (
                          <span className="rounded px-1.5 py-0.5" style={{ background: '#DCFCE7', color: '#065F46', fontSize: 10, fontWeight: 700 }}>
                            {pa.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Slide-out detail panel */}
        {selectedPanel && (
          <div
            className="flex-shrink-0 overflow-hidden transition-all"
            style={{ width: 680, borderLeft: '1px solid #E2E8F0' }}
          >
            <PreAuthDetailPanel
              pa={selectedPanel}
              onClose={() => setSelectedPanel(null)}
              onDecision={handleDecision}
            />
          </div>
        )}
      </div>

      {/* Bulk approve modal */}
      {showBulk && (
        <BulkApproveModal
          candidates={bulkCandidates}
          onClose={() => setShowBulk(false)}
          onConfirm={handleBulkConfirm}
        />
      )}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-[500] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 360 }}>
        {toasts.map(t => {
          const c = toastColors[t.type];
          return (
            <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: c.bg, border: `1px solid ${c.border}`, color: c.color,
                fontSize: 13, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
                pointerEvents: 'auto', fontFamily: 'Inter, sans-serif',
              }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
              <span>{t.msg}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreAuthPage;
