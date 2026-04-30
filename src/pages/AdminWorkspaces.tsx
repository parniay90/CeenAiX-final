import React, { useState } from 'react';
import {
  Plus, Search, MoreHorizontal, Globe, Settings, Users, Shield,
  ExternalLink, Trash2, Copy, CheckCircle, AlertCircle, Clock,
  Building2, X, ChevronRight, Activity, Eye, Edit2, Key,
} from 'lucide-react';
import AdminPageLayout from '../components/admin/AdminPageLayout';
import { MOCK_WORKSPACES, ENV_COLORS, Workspace, WorkspaceEnvironment, WorkspaceRole } from '../data/workspacesData';

interface WorkspaceExtended extends Workspace {
  status: 'Active' | 'Suspended' | 'Pending';
  users: number;
  patients: number;
  doctors: number;
  plan: string;
  region: string;
  createdAt: string;
  lastActivity: string;
  storageUsed: string;
  storageLimit: string;
}

const EXTENDED: WorkspaceExtended[] = [
  { ...MOCK_WORKSPACES[0], status: 'Active', users: 342, patients: 48231, doctors: 189, plan: 'Enterprise', region: 'UAE — Dubai', createdAt: '2024-01-15', lastActivity: '2 min ago', storageUsed: '847 GB', storageLimit: '2 TB' },
  { ...MOCK_WORKSPACES[1], status: 'Active', users: 18, patients: 2140, doctors: 12, plan: 'Enterprise', region: 'UAE — Dubai', createdAt: '2024-01-15', lastActivity: '45 min ago', storageUsed: '120 GB', storageLimit: '500 GB' },
  { ...MOCK_WORKSPACES[2], status: 'Active', users: 7, patients: 318, doctors: 3, plan: 'Developer', region: 'UAE — Dubai', createdAt: '2024-03-01', lastActivity: '3 hours ago', storageUsed: '12 GB', storageLimit: '50 GB' },
  { ...MOCK_WORKSPACES[3], status: 'Active', users: 24, patients: 6100, doctors: 41, plan: 'Professional', region: 'UAE — Abu Dhabi', createdAt: '2024-06-12', lastActivity: '1 day ago', storageUsed: '210 GB', storageLimit: '500 GB' },
  { ...MOCK_WORKSPACES[4], status: 'Suspended', users: 31, patients: 9800, doctors: 58, plan: 'Professional', region: 'UAE — Sharjah', createdAt: '2024-09-03', lastActivity: '5 days ago', storageUsed: '380 GB', storageLimit: '500 GB' },
];

const STATUS_COLORS: Record<string, string> = { Active: '#10B981', Suspended: '#EF4444', Pending: '#F59E0B' };
const PLAN_COLORS: Record<string, string> = { Enterprise: '#0D9488', Professional: '#0891B2', Developer: '#8B5CF6' };

function StorageBar({ used, limit }: { used: string; limit: string }) {
  const usedGB = parseFloat(used);
  const limitGB = limit.includes('TB') ? parseFloat(limit) * 1024 : parseFloat(limit);
  const pct = Math.min((usedGB / limitGB) * 100, 100);
  const color = pct > 85 ? '#EF4444' : pct > 65 ? '#F59E0B' : '#10B981';
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'DM Mono, monospace' }}>{used}</span>
        <span style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace' }}>{limit}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: 'rgba(51,65,85,0.6)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function WorkspaceDetailDrawer({ ws, onClose }: { ws: WorkspaceExtended; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'billing' | 'settings'>('overview');
  const envColor = ENV_COLORS[ws.environment];
  const statusColor = STATUS_COLORS[ws.status];

  return (
    <div className="fixed inset-0 z-40 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(2,6,23,0.6)', backdropFilter: 'blur(4px)' }} />
      <div
        className="relative w-full max-w-xl h-full flex flex-col overflow-hidden"
        style={{ background: '#0F172A', borderLeft: '1px solid rgba(51,65,85,0.7)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b flex-shrink-0" style={{ borderColor: 'rgba(51,65,85,0.5)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ background: ws.brandColor }}>
              {ws.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>{ws.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${envColor}22`, color: envColor }}>{ws.environment}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${statusColor}22`, color: statusColor }}>{ws.status}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: '#64748B' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b flex-shrink-0" style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
          {(['overview', 'users', 'billing', 'settings'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="flex-1 py-3 text-xs font-semibold capitalize transition-colors"
              style={{ color: activeTab === tab ? '#2DD4BF' : '#64748B', borderBottom: `2px solid ${activeTab === tab ? '#0D9488' : 'transparent'}` }}>
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Users', value: ws.users.toLocaleString(), icon: Users, color: '#0891B2' },
                  { label: 'Patients', value: ws.patients.toLocaleString(), icon: Activity, color: '#0D9488' },
                  { label: 'Doctors', value: ws.doctors.toLocaleString(), icon: Shield, color: '#10B981' },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.4)' }}>
                    <stat.icon className="w-4 h-4 mx-auto mb-1" style={{ color: stat.color }} />
                    <div className="font-bold text-white" style={{ fontSize: 18 }}>{stat.value}</div>
                    <div style={{ fontSize: 10, color: '#64748B' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.4)' }}>
                <h4 className="font-semibold text-white" style={{ fontSize: 12 }}>Details</h4>
                {[
                  ['Workspace ID', ws.id],
                  ['Plan', ws.plan],
                  ['Region', ws.region],
                  ['Created', ws.createdAt],
                  ['Last Activity', ws.lastActivity],
                  ['Your Role', ws.role],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ fontSize: 12, color: '#64748B' }}>{k}</span>
                    <span style={{ fontSize: 12, color: '#CBD5E1', fontFamily: k === 'Workspace ID' ? 'DM Mono, monospace' : undefined }}>{v}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-4" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.4)' }}>
                <h4 className="font-semibold text-white mb-3" style={{ fontSize: 12 }}>Storage</h4>
                <StorageBar used={ws.storageUsed} limit={ws.storageLimit} />
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold" style={{ background: '#0D9488', color: '#fff' }}>
                  <ExternalLink className="w-4 h-4" /> Open Workspace
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'rgba(51,65,85,0.5)', color: '#CBD5E1' }}>
                  <Settings className="w-4 h-4" /> Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span style={{ fontSize: 12, color: '#64748B' }}>{ws.users} members</span>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(13,148,136,0.2)', color: '#5EEAD4' }}>
                  <Plus className="w-3 h-3" /> Invite
                </button>
              </div>
              {[
                { name: 'Ahmed Al Rashid', role: 'Super Admin', status: 'Active', initials: 'AR' },
                { name: 'Dr. Sarah Chen', role: 'Admin', status: 'Active', initials: 'SC' },
                { name: 'Mohammed Al Farsi', role: 'Viewer', status: 'Active', initials: 'MF' },
                { name: 'Layla Hassan', role: 'Admin', status: 'Invited', initials: 'LH' },
              ].map(u => (
                <div key={u.name} className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'rgba(51,65,85,0.3)' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #0D9488, #0891B2)' }}>{u.initials}</div>
                    <div>
                      <div style={{ fontSize: 13, color: '#E2E8F0', fontWeight: 500 }}>{u.name}</div>
                      <div style={{ fontSize: 10, color: '#64748B' }}>{u.role}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: u.status === 'Active' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: u.status === 'Active' ? '#34D399' : '#FCD34D' }}>{u.status}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-4">
              <div className="rounded-xl p-4" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.4)' }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-white mb-1" style={{ fontSize: 16 }}>{ws.plan} Plan</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>Billed annually</div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: `${PLAN_COLORS[ws.plan] ?? '#0D9488'}22`, color: PLAN_COLORS[ws.plan] ?? '#0D9488' }}>{ws.plan}</span>
                </div>
                <div className="text-white font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 28 }}>
                  AED 18,000<span style={{ fontSize: 14, fontWeight: 400, color: '#64748B' }}>/yr</span>
                </div>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.4)' }}>
                <h4 className="font-semibold mb-2 text-white" style={{ fontSize: 12 }}>Next Invoice</h4>
                <div className="flex justify-between">
                  <span style={{ fontSize: 12, color: '#64748B' }}>Due date</span>
                  <span style={{ fontSize: 12, color: '#CBD5E1', fontFamily: 'DM Mono, monospace' }}>2026-12-31</span>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'rgba(51,65,85,0.5)', color: '#CBD5E1' }}>
                View Invoices
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              {[
                { label: 'Custom Domain', desc: 'Map a custom domain to this workspace', action: 'Configure', icon: Globe },
                { label: 'API Access', desc: 'Manage API keys scoped to this workspace', action: 'Manage', icon: Key },
                { label: 'SSO / SAML', desc: 'Configure single sign-on for this workspace', action: 'Set up', icon: Shield },
                { label: 'Audit Logs', desc: 'View all actions within this workspace', action: 'View', icon: Eye },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.4)' }}>
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" style={{ color: '#5EEAD4' }} />
                    <div>
                      <div style={{ fontSize: 13, color: '#E2E8F0', fontWeight: 500 }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: '#475569' }}>{item.desc}</div>
                    </div>
                  </div>
                  <button className="text-xs font-semibold flex items-center gap-1" style={{ color: '#5EEAD4' }}>
                    {item.action} <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {ws.status === 'Active' && (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <h4 className="font-semibold mb-2" style={{ fontSize: 12, color: '#F87171' }}>Danger Zone</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ fontSize: 12, color: '#FCA5A5' }}>Suspend workspace</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>Disables all user access immediately</div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171' }}>Suspend</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateWorkspaceModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [env, setEnv] = useState<WorkspaceEnvironment>('staging');
  const [plan, setPlan] = useState('Professional');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }} />
      <div className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.8)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: 'rgba(51,65,85,0.5)' }}>
          <h3 className="font-bold text-white" style={{ fontSize: 15, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>New Workspace</h3>
          <button onClick={onClose}><X className="w-4 h-4" style={{ color: '#64748B' }} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Workspace Name <span style={{ color: '#EF4444' }}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Medcare Partner Staging" className="w-full rounded-xl px-4 py-2.5 focus:outline-none" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Environment</label>
            <div className="grid grid-cols-2 gap-2">
              {(['staging', 'sandbox', 'partner', 'production'] as WorkspaceEnvironment[]).map(e => (
                <button key={e} onClick={() => setEnv(e)} className="py-2 rounded-xl text-sm font-semibold capitalize transition-all"
                  style={{ background: env === e ? `${ENV_COLORS[e]}22` : 'rgba(51,65,85,0.3)', color: env === e ? ENV_COLORS[e] : '#64748B', border: `1px solid ${env === e ? ENV_COLORS[e] + '44' : 'transparent'}` }}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Plan</label>
            <div className="flex gap-2">
              {['Developer', 'Professional', 'Enterprise'].map(p => (
                <button key={p} onClick={() => setPlan(p)} className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: plan === p ? `${PLAN_COLORS[p] ?? '#0D9488'}22` : 'rgba(51,65,85,0.3)', color: plan === p ? PLAN_COLORS[p] ?? '#0D9488' : '#64748B', border: `1px solid ${plan === p ? (PLAN_COLORS[p] ?? '#0D9488') + '44' : 'transparent'}` }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl font-semibold text-sm" style={{ background: 'rgba(51,65,85,0.6)', color: '#CBD5E1' }}>Cancel</button>
          <button disabled={!name} className="flex-1 py-2.5 rounded-xl font-semibold text-sm" style={{ background: name ? '#0D9488' : 'rgba(51,65,85,0.4)', color: name ? '#fff' : '#475569' }}>
            Create Workspace
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminWorkspaces() {
  const [search, setSearch] = useState('');
  const [envFilter, setEnvFilter] = useState<WorkspaceEnvironment | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Suspended'>('all');
  const [selectedWs, setSelectedWs] = useState<WorkspaceExtended | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = EXTENDED.filter(w => {
    if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (envFilter !== 'all' && w.environment !== envFilter) return false;
    if (statusFilter !== 'all' && w.status !== statusFilter) return false;
    return true;
  });

  const totalUsers = EXTENDED.reduce((s, w) => s + w.users, 0);
  const activeCount = EXTENDED.filter(w => w.status === 'Active').length;

  return (
    <AdminPageLayout activeSection="workspaces">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22 }}>Workspaces</h1>
            <p style={{ fontSize: 13, color: '#64748B' }}>Manage all tenant workspaces under your administration.</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm" style={{ background: '#0D9488', color: '#fff' }}>
            <Plus className="w-4 h-4" /> New Workspace
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Workspaces', value: EXTENDED.length, icon: Building2, color: '#0D9488' },
            { label: 'Active', value: activeCount, icon: CheckCircle, color: '#10B981' },
            { label: 'Total Users', value: totalUsers.toLocaleString(), icon: Users, color: '#0891B2' },
            { label: 'Suspended', value: EXTENDED.filter(w => w.status === 'Suspended').length, icon: AlertCircle, color: '#EF4444' },
          ].map(kpi => (
            <div key={kpi.label} className="rounded-2xl px-4 py-4" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.5)' }}>
              <kpi.icon className="w-5 h-5 mb-2" style={{ color: kpi.color }} />
              <div className="font-bold text-white mb-0.5" style={{ fontSize: 22 }}>{kpi.value}</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workspaces…" className="w-full rounded-xl pl-9 pr-3 py-2.5 focus:outline-none" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }} />
          </div>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(30,41,59,0.6)' }}>
            {(['all', 'production', 'staging', 'sandbox', 'partner'] as const).map(e => (
              <button key={e} onClick={() => setEnvFilter(e as WorkspaceEnvironment | 'all')} className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                style={{ background: envFilter === e ? '#1E293B' : 'transparent', color: envFilter === e ? '#E2E8F0' : '#64748B' }}>
                {e === 'all' ? 'All' : e}
              </button>
            ))}
          </div>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(30,41,59,0.6)' }}>
            {(['all', 'Active', 'Suspended'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ background: statusFilter === s ? '#1E293B' : 'transparent', color: statusFilter === s ? '#E2E8F0' : '#64748B' }}>
                {s === 'all' ? 'All Status' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
          {/* Header row */}
          <div className="grid border-b px-5 py-2.5" style={{ gridTemplateColumns: '2fr 110px 90px 80px 80px 80px 160px 80px', borderColor: 'rgba(51,65,85,0.5)' }}>
            {['Workspace', 'Environment', 'Status', 'Users', 'Patients', 'Doctors', 'Storage', ''].map(h => (
              <div key={h} style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
            ))}
          </div>

          {filtered.map(ws => {
            const envColor = ENV_COLORS[ws.environment];
            const statusColor = STATUS_COLORS[ws.status];
            return (
              <div
                key={ws.id}
                className="grid items-center px-5 py-4 border-b cursor-pointer transition-colors"
                style={{ gridTemplateColumns: '2fr 110px 90px 80px 80px 80px 160px 80px', borderColor: 'rgba(51,65,85,0.3)', background: selectedWs?.id === ws.id ? 'rgba(13,148,136,0.06)' : 'transparent' }}
                onClick={() => setSelectedWs(ws)}
                onMouseEnter={e => { if (selectedWs?.id !== ws.id) e.currentTarget.style.background = 'rgba(51,65,85,0.15)'; }}
                onMouseLeave={e => { if (selectedWs?.id !== ws.id) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{ background: ws.brandColor }}>
                    {ws.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate" style={{ fontSize: 13, color: '#E2E8F0' }}>{ws.name}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#475569', marginTop: 1 }}>{ws.id}</div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit capitalize" style={{ background: `${envColor}22`, color: envColor }}>{ws.environment}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: statusColor }} />
                  <span style={{ fontSize: 12, color: statusColor }}>{ws.status}</span>
                </div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#94A3B8' }}>{ws.users.toLocaleString()}</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#94A3B8' }}>{ws.patients.toLocaleString()}</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#94A3B8' }}>{ws.doctors.toLocaleString()}</span>
                <div className="pr-4">
                  <StorageBar used={ws.storageUsed} limit={ws.storageLimit} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setSelectedWs(ws)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: '#475569' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#5EEAD4'}
                    onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                    title="View details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: '#475569' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                    title="Settings"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === ws.id ? null : ws.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: '#475569' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
                      onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                    {openMenuId === ws.id && (
                      <div className="absolute right-0 top-8 w-44 rounded-xl shadow-2xl z-30 overflow-hidden" style={{ background: '#0F172A', border: '1px solid rgba(51,65,85,0.8)' }}>
                        {[
                          { icon: ExternalLink, label: 'Open Workspace', color: '#5EEAD4' },
                          { icon: Edit2, label: 'Edit Details', color: '#94A3B8' },
                          { icon: Copy, label: 'Copy Workspace ID', color: '#94A3B8' },
                          { icon: Users, label: 'Manage Members', color: '#94A3B8' },
                          ...(ws.status === 'Active' ? [{ icon: AlertCircle, label: 'Suspend', color: '#F87171' }] : [{ icon: CheckCircle, label: 'Reactivate', color: '#34D399' }]),
                        ].map(action => (
                          <button key={action.label} onClick={() => setOpenMenuId(null)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs transition-colors"
                            style={{ color: action.color }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(51,65,85,0.3)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <action.icon className="w-3.5 h-3.5" />{action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Building2 className="w-10 h-10" style={{ color: '#334155' }} />
              <span style={{ fontSize: 13, color: '#475569' }}>No workspaces match your filters</span>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="mt-3 flex items-center justify-between">
          <span style={{ fontSize: 11, color: '#475569' }}>Showing {filtered.length} of {EXTENDED.length} workspaces</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" style={{ color: '#475569' }} />
            <span style={{ fontSize: 11, color: '#475569', fontFamily: 'DM Mono, monospace' }}>Auto-refreshes every 60s</span>
          </div>
        </div>
      </div>

      {selectedWs && <WorkspaceDetailDrawer ws={selectedWs} onClose={() => setSelectedWs(null)} />}
      {showCreate && <CreateWorkspaceModal onClose={() => setShowCreate(false)} />}

      {/* Close menu on outside click */}
      {openMenuId && <div className="fixed inset-0 z-20" onClick={() => setOpenMenuId(null)} />}
    </AdminPageLayout>
  );
}
