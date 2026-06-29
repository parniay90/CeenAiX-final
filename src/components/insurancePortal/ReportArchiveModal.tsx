import React, { useState, useMemo } from 'react';
import { X, Search, Download, Trash2, Lock, Shield, FileText, FileSpreadsheet, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { ReportHistoryItem, ReportCategory, categoryMeta } from '../../data/reportsData';

interface Props {
  onClose: () => void;
}

const ALL_ARCHIVE: ReportHistoryItem[] = [
  { id: 'RPT-147', name: 'Monthly Claims Summary', category: 'claims', format: 'Excel', size: '7.8 MB', generatedAt: '2026-05-01T06:00:00', generatedAtDisplay: 'May 1, 2026', generatedBy: 'System', status: 'completed', downloads: 8 },
  { id: 'RPT-146', name: 'Loss Ratio Statement', category: 'financial', format: 'PDF', size: '3.9 MB', generatedAt: '2026-04-30T18:00:00', generatedAtDisplay: 'Apr 30, 2026', generatedBy: 'Mariam Al Hashemi', status: 'completed', downloads: 5, isConfidential: true },
  { id: 'RPT-145', name: 'Provider Performance Scorecard', category: 'provider', format: 'PDF', size: '2.1 MB', generatedAt: '2026-04-01T07:30:00', generatedAtDisplay: 'Apr 1, 2026', generatedBy: 'System', status: 'completed', downloads: 11 },
  { id: 'RPT-144', name: 'Risk Stratification Report', category: 'members', format: 'Excel', size: '5.8 MB', generatedAt: '2026-04-01T07:00:00', generatedAtDisplay: 'Apr 1, 2026', generatedBy: 'System', status: 'completed', downloads: 3, isConfidential: true },
  { id: 'RPT-143', name: 'DHA Monthly Claims (DHA-F001)', category: 'dha', format: 'DHA XML', size: '17.1 MB', generatedAt: '2026-03-14T23:55:00', generatedAtDisplay: 'Mar 14, 2026', generatedBy: 'System', status: 'completed', downloads: 1, dhaSubmissionId: 'DHA-2026-03-DN-0038' },
  { id: 'RPT-142', name: 'Denial Analysis Report', category: 'claims', format: 'PDF', size: '2.4 MB', generatedAt: '2026-03-02T06:00:00', generatedAtDisplay: 'Mar 2, 2026', generatedBy: 'System', status: 'completed', downloads: 6 },
  { id: 'RPT-141', name: 'SIU Investigation Register', category: 'fraud', format: 'PDF', size: '4.7 MB', generatedAt: '2026-02-28T14:00:00', generatedAtDisplay: 'Feb 28, 2026', generatedBy: 'Fatima Al Zahra', status: 'completed', downloads: 2, isConfidential: true },
  { id: 'RPT-140', name: 'Budget vs Actual Variance', category: 'financial', format: 'Excel', size: '2.2 MB', generatedAt: '2026-02-05T07:00:00', generatedAtDisplay: 'Feb 5, 2026', generatedBy: 'System', status: 'completed', downloads: 4, isConfidential: true },
  { id: 'RPT-139', name: 'Monthly Claims Summary', category: 'claims', format: 'Excel', size: '7.2 MB', generatedAt: '2026-02-01T06:00:00', generatedAtDisplay: 'Feb 1, 2026', generatedBy: 'System', status: 'completed', downloads: 9 },
  { id: 'RPT-138', name: 'Contract Expiry Watch List', category: 'provider', format: 'PDF', size: '1.1 MB', generatedAt: '2026-01-26T06:00:00', generatedAtDisplay: 'Jan 26, 2026', generatedBy: 'System', status: 'completed', downloads: 7 },
  { id: 'RPT-137', name: 'Annual Actuarial Certification (DHA-F012)', category: 'dha', format: 'PDF', size: '9.3 MB', generatedAt: '2026-01-31T12:00:00', generatedAtDisplay: 'Jan 31, 2026', generatedBy: 'Ahmad Al Rashidi', status: 'completed', downloads: 2, isConfidential: true, dhaSubmissionId: 'DHA-2026-ACT-0001' },
  { id: 'RPT-136', name: 'Anomaly Detection Alerts', category: 'fraud', format: 'Excel', size: '3.2 MB', generatedAt: '2026-01-19T06:00:00', generatedAtDisplay: 'Jan 19, 2026', generatedBy: 'System', status: 'completed', downloads: 4, isConfidential: true },
];

const FORMAT_ICON: Record<string, React.ReactNode> = {
  'PDF': <FileText size={13} color="#EF4444" />,
  'Excel': <FileSpreadsheet size={13} color="#16A34A" />,
  'CSV': <FileText size={13} color="#F59E0B" />,
  'DHA XML': <Shield size={13} color="#0284C7" />,
};

const CATS: { id: ReportCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'claims', label: 'Claims' },
  { id: 'financial', label: 'Financial' },
  { id: 'preauth', label: 'Pre-Auth' },
  { id: 'fraud', label: 'Fraud' },
  { id: 'members', label: 'Members' },
  { id: 'provider', label: 'Provider' },
  { id: 'dha', label: 'DHA' },
];

export default function ReportArchiveModal({ onClose }: Props) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<ReportCategory | 'all'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return ALL_ARCHIVE.filter(r => {
      if (catFilter !== 'all' && r.category !== catFilter) return false;
      if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, catFilter]);

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(r => r.id)));
  }

  async function handleDownload(id: string) {
    setDownloading(id);
    await new Promise(r => setTimeout(r, 900));
    setDownloading(null);
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#fff', borderRadius: 16, width: 760, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, background: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Download size={17} color="#475569" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Report Archive</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>147 reports stored • 7-year retention policy</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Filter bar */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              placeholder="Search reports..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '7px 10px 7px 30px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {CATS.map(c => (
              <button
                key={c.id}
                onClick={() => setCatFilter(c.id as ReportCategory | 'all')}
                style={{
                  padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  background: catFilter === c.id ? '#1E3A5F' : '#F8FAFC',
                  color: catFilter === c.id ? '#fff' : '#475569',
                  border: catFilter === c.id ? '1px solid #1E3A5F' : '1px solid #E2E8F0',
                }}
              >{c.label}</button>
            ))}
          </div>
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div style={{ padding: '8px 24px', background: '#EFF6FF', borderBottom: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: '#1E3A5F', fontWeight: 500 }}>{selected.size} selected</span>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              <Download size={12} /> Download Selected
            </button>
            <button onClick={() => setSelected(new Set())} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              <Trash2 size={12} /> Delete Selected
            </button>
          </div>
        )}

        {/* Table */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                <th style={{ padding: '10px 14px', width: 36 }}>
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll}
                    style={{ accentColor: '#1E3A5F', width: 14, height: 14 }} />
                </th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.04em' }}>REPORT</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.04em' }}>DATE</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.04em' }}>GENERATED BY</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.04em' }}>SIZE</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.04em' }}>DL</th>
                <th style={{ padding: '10px 14px', width: 80 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const meta = categoryMeta[r.category];
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F8FAFC', background: selected.has(r.id) ? '#EFF6FF' : '#fff' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)}
                        style={{ accentColor: '#1E3A5F', width: 14, height: 14 }} />
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {FORMAT_ICON[r.format] || <FileText size={13} color="#94A3B8" />}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{r.name}</span>
                            {r.isConfidential && <Lock size={11} color="#EF4444" />}
                            {r.dhaSubmissionId && <CheckCircle size={11} color="#059669" />}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                            <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: '#94A3B8' }}>{r.id}</span>
                            <span style={{ fontSize: 10, fontWeight: 600, color: meta.color, background: meta.bg, borderRadius: 3, padding: '1px 5px' }}>{meta.label}</span>
                            <span style={{ fontSize: 11, color: '#94A3B8' }}>{r.format}</span>
                          </div>
                          {r.dhaSubmissionId && (
                            <div style={{ fontSize: 10, color: '#059669', fontFamily: 'DM Mono, monospace', marginTop: 1 }}>{r.dhaSubmissionId}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#64748B', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>{r.generatedAtDisplay}</td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: '#64748B' }}>{r.generatedBy}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 12, color: '#374151', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>{r.size}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: 12, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{r.downloads ?? 0}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <button
                        onClick={() => handleDownload(r.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        {downloading === r.id ? <Loader size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={11} />}
                        {downloading === r.id ? 'Getting...' : 'Download'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>No reports match your search</div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={13} color="#F59E0B" />
          <span style={{ fontSize: 12, color: '#78716C' }}>Reports older than 7 years are automatically purged per DHA data retention policy.</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', padding: '8px 20px', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
