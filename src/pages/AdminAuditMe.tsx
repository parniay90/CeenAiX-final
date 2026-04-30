import React, { useState } from 'react';
import { Search, Download, Filter, X, ChevronDown, Shield, Eye, CreditCard as Edit, Trash2, LogIn, Activity, UserCheck } from 'lucide-react';
import AdminPageLayout from '../components/admin/AdminPageLayout';

const ACTION_TYPES = ['Read', 'Create', 'Update', 'Delete', 'Login', 'Security', 'Impersonation', 'System'];
const RESOURCES = ['Users', 'Patients', 'Doctors', 'Settings', 'API Keys', 'Workspaces'];

const ACTION_ICONS: Record<string, React.ElementType> = {
  Read: Eye, Create: Activity, Update: Edit, Delete: Trash2, Login: LogIn, Security: Shield, Impersonation: UserCheck, System: Activity,
};
const ACTION_COLORS: Record<string, string> = {
  Read: '#64748B', Create: '#10B981', Update: '#0891B2', Delete: '#EF4444', Login: '#5EEAD4', Security: '#F59E0B', Impersonation: '#F97316', System: '#94A3B8',
};

interface AuditEntry {
  id: string;
  ts: string;
  action: string;
  resource: string;
  workspace: string;
  ip: string;
  device: string;
  impersonated?: string;
  status: 'success' | 'failed';
}

const MOCK_ENTRIES: AuditEntry[] = [
  { id: 'A001', ts: '2026-04-30 14:07:22', action: 'Read', resource: 'Patient #48231', workspace: 'CeenAiX Production', ip: '91.74.232.15', device: 'Chrome / macOS', status: 'success' },
  { id: 'A002', ts: '2026-04-30 13:52:10', action: 'Update', resource: 'Settings / Security', workspace: 'CeenAiX Production', ip: '91.74.232.15', device: 'Chrome / macOS', status: 'success' },
  { id: 'A003', ts: '2026-04-30 13:21:05', action: 'Impersonation', resource: 'User PT-006', workspace: 'CeenAiX Production', ip: '91.74.232.15', device: 'Chrome / macOS', impersonated: 'Aisha Mohammed Al Reem', status: 'success' },
  { id: 'A004', ts: '2026-04-30 11:44:33', action: 'Login', resource: 'Admin Portal', workspace: 'CeenAiX Production', ip: '91.74.232.15', device: 'Chrome / macOS', status: 'success' },
  { id: 'A005', ts: '2026-04-29 16:03:18', action: 'Create', resource: 'API Key / ck_live_8fK', workspace: 'CeenAiX Production', ip: '91.74.232.22', device: 'Safari / iPhone', status: 'success' },
  { id: 'A006', ts: '2026-04-29 14:11:09', action: 'Delete', resource: 'User ORG-003', workspace: 'CeenAiX Staging', ip: '91.74.232.22', device: 'Safari / iPhone', status: 'success' },
  { id: 'A007', ts: '2026-04-29 10:32:01', action: 'Security', resource: 'Password Change', workspace: 'CeenAiX Production', ip: '91.74.232.15', device: 'Chrome / macOS', status: 'success' },
  { id: 'A008', ts: '2026-04-28 09:15:42', action: 'Login', resource: 'Admin Portal', workspace: 'Developer Sandbox', ip: '212.48.10.1', device: 'Chrome / Windows', status: 'failed' },
];

const DATE_PRESETS = ['Today', 'Last 7 days', 'Last 30 days', 'This month', 'Custom'];

interface DetailPanel {
  entry: AuditEntry;
}

function DetailPanel({ entry }: DetailPanel) {
  const Icon = ACTION_ICONS[entry.action] ?? Activity;
  const color = ACTION_COLORS[entry.action] ?? '#64748B';
  return (
    <div className="h-full flex flex-col" style={{ background: '#0F172A', borderLeft: '1px solid rgba(51,65,85,0.6)' }}>
      <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(51,65,85,0.5)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div>
          <div style={{ fontSize: 13, color: '#E2E8F0', fontWeight: 600 }}>{entry.action} — {entry.resource}</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#475569' }}>{entry.id}</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {[
          ['Timestamp', entry.ts],
          ['Workspace', entry.workspace],
          ['IP Address', entry.ip],
          ['Device', entry.device],
          ['Status', entry.status],
          ...(entry.impersonated ? [['Impersonating', entry.impersonated]] : []),
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{k}</div>
            <div style={{ fontSize: 12, color: '#E2E8F0', fontFamily: k === 'IP Address' || k === 'Timestamp' ? 'DM Mono, monospace' : 'Inter, sans-serif' }}>{v}</div>
          </div>
        ))}
        {entry.impersonated && (
          <div className="p-3 rounded-xl flex items-center gap-2" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
            <UserCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#F97316' }} />
            <span style={{ fontSize: 11, color: '#FDE68A' }}>Performed while impersonating {entry.impersonated}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminAuditMe() {
  const [search, setSearch] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [datePreset, setDatePreset] = useState('Last 7 days');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [impersonationFilter, setImpersonationFilter] = useState('All');

  const filtered = MOCK_ENTRIES.filter(e => {
    if (search && !e.resource.toLowerCase().includes(search.toLowerCase()) && !e.action.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedActions.length > 0 && !selectedActions.includes(e.action)) return false;
    if (impersonationFilter === 'Impersonated actions only' && !e.impersonated) return false;
    if (impersonationFilter === 'Direct actions only' && e.impersonated) return false;
    return true;
  });

  const toggleAction = (a: string) => setSelectedActions(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a]);

  return (
    <AdminPageLayout activeSection="audit">
      <div className="p-6 h-full flex flex-col" style={{ maxHeight: 'calc(100vh - 64px)' }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-5 flex-shrink-0">
          <div>
            <h1 className="font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22 }}>My Audit Trail</h1>
            <p style={{ fontSize: 13, color: '#64748B' }}>A complete record of your actions across CeenAiX.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: 'rgba(13,148,136,0.2)', color: '#5EEAD4', border: '1px solid rgba(13,148,136,0.3)' }}>
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-4 gap-3 mb-4 flex-shrink-0">
          {[
            { label: 'Total Actions', value: filtered.length },
            { label: 'Sessions', value: 3 },
            { label: 'Impersonation Sessions', value: MOCK_ENTRIES.filter(e => e.impersonated).length },
            { label: 'Failed Actions', value: MOCK_ENTRIES.filter(e => e.status === 'failed').length },
          ].map(k => (
            <div key={k.label} className="rounded-xl px-4 py-3" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
              <div className="font-bold text-white" style={{ fontSize: 20 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events, resource IDs…" className="w-full rounded-xl pl-9 pr-3 py-2.5 focus:outline-none" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }} />
          </div>
          <select value={datePreset} onChange={e => setDatePreset(e.target.value)} className="rounded-xl px-3 py-2.5 focus:outline-none" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }}>
            {DATE_PRESETS.map(p => <option key={p} style={{ background: '#1E293B' }}>{p}</option>)}
          </select>
          <select value={impersonationFilter} onChange={e => setImpersonationFilter(e.target.value)} className="rounded-xl px-3 py-2.5 focus:outline-none" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }}>
            {['All', 'Direct actions only', 'Impersonated actions only'].map(o => <option key={o} style={{ background: '#1E293B' }}>{o}</option>)}
          </select>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: showFilters ? 'rgba(13,148,136,0.2)' : 'rgba(51,65,85,0.5)', color: showFilters ? '#5EEAD4' : '#94A3B8', border: `1px solid ${showFilters ? 'rgba(13,148,136,0.3)' : 'rgba(51,65,85,0.5)'}` }}>
            <Filter className="w-4 h-4" /> Filters
            {selectedActions.length > 0 && <span className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background: '#0D9488', color: '#fff' }}>{selectedActions.length}</span>}
          </button>
        </div>

        {showFilters && (
          <div className="flex gap-2 flex-wrap mb-4 flex-shrink-0">
            {ACTION_TYPES.map(a => (
              <button key={a} onClick={() => toggleAction(a)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ background: selectedActions.includes(a) ? `${ACTION_COLORS[a]}22` : 'rgba(51,65,85,0.4)', color: selectedActions.includes(a) ? ACTION_COLORS[a] : '#94A3B8', border: `1px solid ${selectedActions.includes(a) ? ACTION_COLORS[a] + '44' : 'rgba(51,65,85,0.5)'}` }}>
                {a}
                {selectedActions.includes(a) && <X className="w-3 h-3" />}
              </button>
            ))}
            {selectedActions.length > 0 && <button onClick={() => setSelectedActions([])} className="text-xs" style={{ color: '#F87171' }}>Clear filters</button>}
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Table */}
          <div className="flex-1 overflow-hidden flex flex-col rounded-2xl" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
            <div className="grid border-b px-4 py-2" style={{ gridTemplateColumns: '160px 120px 1fr 120px 110px 80px', borderColor: 'rgba(51,65,85,0.5)' }}>
              {['Timestamp', 'Action', 'Resource', 'IP', 'Device', 'Status'].map(h => (
                <div key={h} style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
              ))}
            </div>
            <div className="overflow-y-auto flex-1">
              {filtered.map(entry => {
                const Icon = ACTION_ICONS[entry.action] ?? Activity;
                const color = ACTION_COLORS[entry.action] ?? '#64748B';
                const isSelected = selectedEntry?.id === entry.id;
                return (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedEntry(isSelected ? null : entry)}
                    className="grid items-center px-4 py-3 border-b cursor-pointer transition-colors"
                    style={{ gridTemplateColumns: '160px 120px 1fr 120px 110px 80px', borderColor: 'rgba(51,65,85,0.3)', background: isSelected ? 'rgba(13,148,136,0.08)' : 'transparent' }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(51,65,85,0.2)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#64748B' }}>{entry.ts.split(' ')[1]}</span>
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                      <span style={{ fontSize: 12, color, fontWeight: 500 }}>{entry.action}</span>
                      {entry.impersonated && <UserCheck className="w-3 h-3" style={{ color: '#F97316' }} />}
                    </div>
                    <span className="truncate" style={{ fontSize: 12, color: '#CBD5E1' }}>{entry.resource}</span>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#475569' }}>{entry.ip}</span>
                    <span className="truncate" style={{ fontSize: 10, color: '#64748B' }}>{entry.device.split(' / ')[0]}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold w-fit" style={{ background: entry.status === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: entry.status === 'success' ? '#34D399' : '#F87171' }}>
                      {entry.status}
                    </span>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                  <Activity className="w-10 h-10" style={{ color: '#334155' }} />
                  <span style={{ fontSize: 13, color: '#475569' }}>No actions match these filters</span>
                </div>
              )}
            </div>
          </div>

          {/* Detail panel */}
          {selectedEntry && (
            <div className="w-72 flex-shrink-0 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(51,65,85,0.6)' }}>
              <DetailPanel entry={selectedEntry} />
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
}
