import React, { useState } from 'react';
import {
  FileText, DollarSign, Shield, AlertTriangle, Users, Stethoscope, CheckSquare,
  Calendar, Clock, Download, Bell, Plus, ChevronDown, ChevronUp, RefreshCw,
  AlertCircle, Loader, CheckCircle, Lock, X, Settings, Archive,
} from 'lucide-react';
import InsuranceSidebar from './InsuranceSidebar';
import GenerateReportModal from './GenerateReportModal';
import ScheduleReportModal from './ScheduleReportModal';
import CustomReportBuilder from './CustomReportBuilder';
import ReportArchiveModal from './ReportArchiveModal';
import {
  ReportCatalogItem, ReportCategory, categoryMeta,
  reportCatalog, recentHistory, scheduledReports, dhaCalendar, reportKpis,
} from '../../data/reportsData';

interface Props {
  onNavigate?: (page: string) => void;
}

interface Toast { id: number; msg: string; type: 'success' | 'warning' | 'info' }

const CATEGORY_ICONS: Record<ReportCategory, React.ComponentType<{ size: number; color?: string }>> = {
  claims: FileText, financial: DollarSign, preauth: Shield, fraud: AlertTriangle,
  members: Users, provider: Stethoscope, dha: CheckSquare,
};

const STATUS_CHIP: Record<string, { bg: string; color: string; label: string }> = {
  completed:  { bg: '#ECFDF5', color: '#059669', label: 'Completed' },
  generating: { bg: '#FFF7ED', color: '#D97706', label: 'Generating' },
  failed:     { bg: '#FEF2F2', color: '#EF4444', label: 'Failed' },
  scheduled:  { bg: '#EFF6FF', color: '#1D4ED8', label: 'Scheduled' },
  archived:   { bg: '#F8FAFC', color: '#94A3B8', label: 'Archived' },
};

const CALENDAR_STATUS: Record<string, { color: string; bg: string; border: string; label: string }> = {
  overdue:   { color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', label: 'Overdue' },
  urgent:    { color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', label: 'Due Soon' },
  upcoming:  { color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE', label: 'Upcoming' },
  submitted: { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', label: 'Submitted' },
};

function SnapCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 12, padding: '16px 20px', flex: 1 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: color || '#0F172A', fontFamily: 'DM Mono, monospace', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#64748B', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function InsightBadge({ type, text }: { type: 'warning' | 'success' | 'info'; text: string }) {
  const conf = {
    warning: { bg: '#FFFBEB', color: '#92400E', border: '#FDE68A', icon: <AlertCircle size={12} /> },
    success: { bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0', icon: <CheckCircle size={12} /> },
    info:    { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE', icon: <AlertCircle size={12} /> },
  }[type];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '7px 10px', background: conf.bg, border: `1px solid ${conf.border}`, borderRadius: 7, marginTop: 8 }}>
      <span style={{ color: conf.color, flexShrink: 0, marginTop: 1 }}>{conf.icon}</span>
      <span style={{ fontSize: 12, color: conf.color }}>{text}</span>
    </div>
  );
}

export default function ReportsPage({ onNavigate }: Props) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [generateTarget, setGenerateTarget] = useState<ReportCatalogItem | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<ReportCatalogItem | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [collapsedCats, setCollapsedCats] = useState<Set<ReportCategory>>(new Set());
  const [scheduleManageOpen, setScheduleManageOpen] = useState(false);

  function toast(msg: string, type: Toast['type'] = 'success') {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }

  function toggleCat(cat: ReportCategory) {
    setCollapsedCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  const categories = Array.from(new Set(reportCatalog.map(r => r.category))) as ReportCategory[];

  const navigate = (page: string) => onNavigate?.(page);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F8FAFC', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      <InsuranceSidebar activePage="reports" onNavigate={navigate} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #F1F5F9', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Reports & Analytics</div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 1 }}>Generate, schedule and distribute regulatory and management reports</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#065F46' }}>DHA Compliance: 97.8%</span>
            </div>
            <button onClick={() => setShowArchive(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              <Archive size={14} /> Archive
            </button>
            <button onClick={() => setShowBuilder(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={14} /> Custom Report
            </button>
          </div>
        </div>

        {/* Alert strip */}
        <div style={{ background: '#FFFBEB', borderBottom: '1px solid #FDE68A', padding: '9px 28px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Loader size={13} color="#D97706" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 13, color: '#92400E' }}><strong>RPT-009</strong> Anomaly Detection Alerts is generating — 67% complete</span>
          </div>
          <div style={{ width: 1, height: 16, background: '#FDE68A' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <AlertCircle size={13} color="#DC2626" />
            <span style={{ fontSize: 13, color: '#7F1D1D' }}><strong>RPT-003</strong> Cash Flow Projection failed — data source timeout. <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Retry</span></span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={12} color="#92400E" />
            <span style={{ fontSize: 12, color: '#92400E' }}>Member Census (DHA-F002) due in 7 days</span>
          </div>
        </div>

        {/* KPI strip */}
        <div style={{ padding: '16px 28px', display: 'flex', gap: 14, flexShrink: 0 }}>
          <SnapCard label="Reports Generated" value={reportKpis.totalGenerated} sub={`+${reportKpis.generatedThisMonth} this month`} />
          <SnapCard label="Schedules Active" value={reportKpis.scheduledActive} sub="Running on schedule" color="#059669" />
          <SnapCard label="DHA Submissions Pending" value={reportKpis.dhaPending} sub="Next due in 7 days" color="#D97706" />
          <SnapCard label="Avg Generation Time" value={`${reportKpis.avgGenerationSecs}s`} sub="Last 30 days" />
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', gap: 0 }}>
          {/* Left: catalog */}
          <div style={{ flex: '0 0 65%', overflowY: 'auto', padding: '0 0 28px 28px', paddingRight: 14 }}>
            {categories.map(cat => {
              const meta = categoryMeta[cat];
              const Icon = CATEGORY_ICONS[cat];
              const items = reportCatalog.filter(r => r.category === cat);
              const isCollapsed = collapsedCats.has(cat);
              const dhaItems = items.filter(r => r.isDhaRequired);

              return (
                <div key={cat} style={{ marginBottom: 16, background: '#fff', border: '1px solid #F1F5F9', borderRadius: 14, overflow: 'hidden' }}>
                  {/* Category header */}
                  <button
                    onClick={() => toggleCat(cat)}
                    style={{ width: '100%', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: meta.bg, border: `1px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={17} color={meta.color} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{meta.label} Reports</div>
                      <div style={{ fontSize: 12, color: '#94A3B8' }}>{items.length} reports{dhaItems.length > 0 ? ` • ${dhaItems.length} DHA required` : ''}</div>
                    </div>
                    {isCollapsed ? <ChevronDown size={16} color="#94A3B8" /> : <ChevronUp size={16} color="#94A3B8" />}
                  </button>

                  {/* Report cards */}
                  {!isCollapsed && (
                    <div style={{ borderTop: '1px solid #F8FAFC' }}>
                      {items.map((r, idx) => (
                        <div
                          key={r.id}
                          style={{
                            padding: '14px 20px',
                            borderBottom: idx < items.length - 1 ? '1px solid #F8FAFC' : 'none',
                            display: 'flex', alignItems: 'flex-start', gap: 14,
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: '#94A3B8' }}>{r.id}</span>
                              <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{r.title}</span>
                              {r.isDhaRequired && (
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#065F46', background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 4, padding: '2px 6px' }}>DHA</span>
                              )}
                              {r.isConfidential && <Lock size={12} color="#EF4444" />}
                              {r.isScheduled && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: '#1D4ED8', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 4, padding: '2px 6px' }}>
                                  <Bell size={9} /> Auto
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5, marginBottom: 8 }}>{r.description}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                              <div style={{ display: 'flex', gap: 4 }}>
                                {r.formats.map(f => (
                                  <span key={f} style={{ fontSize: 10, fontWeight: 600, color: '#475569', background: '#F1F5F9', borderRadius: 4, padding: '2px 6px' }}>{f}</span>
                                ))}
                              </div>
                              {r.lastGeneratedDisplay && (
                                <span style={{ fontSize: 11, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Clock size={10} /> Last: {r.lastGeneratedDisplay}
                                </span>
                              )}
                              {r.scheduleDesc && (
                                <span style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <RefreshCw size={10} /> {r.scheduleDesc}
                                </span>
                              )}
                              {r.dueDaysRemaining !== undefined && (
                                <span style={{ fontSize: 11, fontWeight: 600, color: r.dueDaysRemaining <= 7 ? '#D97706' : '#1D4ED8', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Calendar size={10} /> Due in {r.dueDaysRemaining}d
                                </span>
                              )}
                            </div>
                            {r.insight && <InsightBadge type={r.insight.type} text={r.insight.text} />}
                          </div>

                          {/* Actions */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                            <button
                              onClick={() => setGenerateTarget(r)}
                              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              <FileText size={12} /> Generate
                            </button>
                            <button
                              onClick={() => setScheduleTarget(r)}
                              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              <Bell size={12} /> Schedule
                            </button>
                            {r.lastGeneratedDisplay && (
                              <button
                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}
                              >
                                <Download size={12} /> Download
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right panel */}
          <div style={{ flex: '0 0 35%', overflowY: 'auto', padding: '0 28px 28px 14px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Recent Reports */}
            <div style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={15} color="#64748B" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Recent Reports</span>
                <button onClick={() => setShowArchive(true)} style={{ marginLeft: 'auto', fontSize: 12, color: '#1E3A5F', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>View all</button>
              </div>
              {recentHistory.map((r, idx) => {
                const meta = categoryMeta[r.category];
                const chipConf = STATUS_CHIP[r.status] || STATUS_CHIP.completed;
                return (
                  <div key={r.id} style={{ padding: '11px 18px', borderBottom: idx < recentHistory.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 7, background: meta.bg, border: `1px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {r.status === 'generating' ? (
                        <Loader size={13} color={meta.color} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <FileText size={13} color={meta.color} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: '#94A3B8' }}>{r.id}</span>
                        <span style={{ fontSize: 10, color: '#94A3B8' }}>{r.generatedAtDisplay}</span>
                        <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: '#64748B' }}>{r.size}</span>
                      </div>
                      {r.status === 'generating' && r.progressPct !== undefined && (
                        <div style={{ marginTop: 4, background: '#F1F5F9', borderRadius: 3, height: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: '#F59E0B', width: `${r.progressPct}%`, transition: 'width 0.3s ease', borderRadius: 3 }} />
                        </div>
                      )}
                      {r.status === 'failed' && r.errorMessage && (
                        <div style={{ fontSize: 11, color: '#EF4444', marginTop: 2 }}>{r.errorMessage}</div>
                      )}
                      {r.dhaSubmissionId && (
                        <div style={{ fontSize: 10, color: '#059669', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>{r.dhaSubmissionId}</div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: chipConf.color, background: chipConf.bg, borderRadius: 4, padding: '2px 6px', whiteSpace: 'nowrap' }}>{chipConf.label}</span>
                      {r.status === 'completed' && (
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 2 }}>
                          <Download size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DHA Compliance Calendar */}
            <div style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)' }}>
                <Calendar size={15} color="#6EE7B7" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>DHA Compliance Calendar</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#A7F3D0' }}>2026</span>
              </div>
              {dhaCalendar.map((item, idx) => {
                const statusConf = CALENDAR_STATUS[item.status];
                return (
                  <div key={item.id} style={{ padding: '12px 18px', borderBottom: idx < dhaCalendar.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 9, background: statusConf.bg, border: `1px solid ${statusConf.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: statusConf.color, lineHeight: 1 }}>
                        {item.daysRemaining < 0 ? 'DONE' : item.daysRemaining}
                      </div>
                      {item.daysRemaining >= 0 && <div style={{ fontSize: 9, color: statusConf.color, fontWeight: 600 }}>days</div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Period: {item.period} • Due: {item.dueDateDisplay}</div>
                      {item.submissionId && (
                        <div style={{ fontSize: 10, color: '#059669', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>{item.submissionId}</div>
                      )}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: statusConf.color, background: statusConf.bg, border: `1px solid ${statusConf.border}`, borderRadius: 5, padding: '3px 7px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {statusConf.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Scheduled Reports */}
            <div style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={15} color="#64748B" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Scheduled Reports</span>
                <span style={{ marginLeft: 4, fontSize: 11, color: '#94A3B8' }}>({scheduledReports.filter(s => s.isActive).length} active)</span>
                <button onClick={() => setScheduleManageOpen(!scheduleManageOpen)}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex' }}>
                  <Settings size={14} />
                </button>
              </div>
              {scheduledReports.map((s, idx) => {
                const meta = categoryMeta[s.category];
                const freqColors: Record<string, string> = { daily: '#0284C7', weekly: '#7C3AED', monthly: '#059669', quarterly: '#D97706' };
                return (
                  <div key={s.id} style={{ padding: '11px 18px', borderBottom: idx < scheduledReports.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', alignItems: 'center', gap: 10, opacity: s.isActive ? 1 : 0.5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.isActive ? '#059669' : '#94A3B8', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: freqColors[s.frequency] || '#64748B', background: '#F8FAFC', borderRadius: 4, padding: '2px 5px', border: '1px solid #E2E8F0', textTransform: 'capitalize' }}>{s.frequency}</span>
                        <span style={{ fontSize: 11, color: '#94A3B8' }}>Next: {s.nextRunDisplay}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: meta.color, background: meta.bg, borderRadius: 4, padding: '2px 5px' }}>{s.format}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <GenerateReportModal
        report={generateTarget}
        onClose={() => setGenerateTarget(null)}
        onSuccess={(msg) => { toast(msg, 'success'); }}
      />
      <ScheduleReportModal
        report={scheduleTarget}
        onClose={() => setScheduleTarget(null)}
        onSuccess={(msg) => { toast(msg, 'success'); }}
      />
      {showBuilder && (
        <CustomReportBuilder
          onClose={() => setShowBuilder(false)}
          onSuccess={(msg) => { toast(msg, 'success'); }}
        />
      )}
      {showArchive && <ReportArchiveModal onClose={() => setShowArchive(false)} />}

      {/* Toasts */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 2000 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
            background: t.type === 'success' ? '#ECFDF5' : t.type === 'warning' ? '#FFFBEB' : '#EFF6FF',
            border: `1px solid ${t.type === 'success' ? '#6EE7B7' : t.type === 'warning' ? '#FDE68A' : '#BFDBFE'}`,
            borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: 340,
            animation: 'fadeSlideIn 0.2s ease',
          }}>
            {t.type === 'success' && <CheckCircle size={15} color="#059669" />}
            {t.type === 'warning' && <AlertCircle size={15} color="#D97706" />}
            {t.type === 'info' && <AlertCircle size={15} color="#1D4ED8" />}
            <span style={{ fontSize: 13, color: '#0F172A', flex: 1 }}>{t.msg}</span>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0 }}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
