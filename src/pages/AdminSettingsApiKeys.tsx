import React, { useState } from 'react';
import { Key, Plus, Copy, Download, RotateCcw, Trash2, Check, X, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import AdminPageLayout from '../components/admin/AdminPageLayout';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  created: string;
  lastUsed: string;
  expires: string;
  status: 'Active' | 'Expired' | 'Revoked';
}

const MOCK_KEYS: ApiKey[] = [
  { id: 'k1', name: 'Production Integration', prefix: 'ck_live_8fK3m...', scopes: ['read:patients', 'read:doctors', 'write:prescriptions'], created: '2026-01-15', lastUsed: '2 min ago', expires: 'Never', status: 'Active' },
  { id: 'k2', name: 'Analytics Dashboard', prefix: 'ck_live_2Rp9q...', scopes: ['read:analytics', 'read:audit'], created: '2026-02-20', lastUsed: '3 hours ago', expires: '2026-07-20', status: 'Active' },
  { id: 'k3', name: 'CI/CD Pipeline', prefix: 'ck_live_7Kx1y...', scopes: ['read:system'], created: '2025-12-01', lastUsed: '5 days ago', expires: '2026-03-01', status: 'Expired' },
];

const SCOPE_TREE = [
  { group: 'Patients', scopes: ['read:patients', 'write:patients', 'delete:patients'] },
  { group: 'Doctors', scopes: ['read:doctors', 'write:doctors'] },
  { group: 'Analytics', scopes: ['read:analytics', 'write:analytics'] },
  { group: 'Audit', scopes: ['read:audit'] },
  { group: 'System', scopes: ['read:system', 'write:system'] },
  { group: 'Prescriptions', scopes: ['read:prescriptions', 'write:prescriptions'] },
];

const STATUS_COLORS: Record<string, string> = { Active: '#10B981', Expired: '#F59E0B', Revoked: '#EF4444' };

function CreateKeyModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [expiry, setExpiry] = useState('Never');
  const [copied, setCopied] = useState(false);
  const generatedKey = 'ck_live_' + Math.random().toString(36).slice(2, 10) + '...';

  const toggleScope = (s: string) => setSelectedScopes(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }} />
      <div className="relative rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.8)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: 'rgba(51,65,85,0.5)' }}>
          <div>
            <h3 className="font-bold text-white" style={{ fontSize: 15, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Create API Key</h3>
            <div className="flex gap-1 mt-2">
              {[1,2,3,4,5].map(s => <div key={s} className="h-1 rounded-full flex-1" style={{ background: s <= step ? '#0D9488' : 'rgba(51,65,85,0.5)' }} />)}
            </div>
          </div>
          <button onClick={onClose}><X className="w-4 h-4" style={{ color: '#64748B' }} /></button>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Key Name <span style={{ color: '#EF4444' }}>*</span></label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Production Integration" className="w-full rounded-xl px-4 py-2.5 focus:outline-none" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} className="w-full rounded-xl px-4 py-2.5 focus:outline-none resize-none" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }} />
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: '#94A3B8' }}>Select Scopes</p>
              {SCOPE_TREE.map(group => (
                <div key={group.group} className="mb-3">
                  <div style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', marginBottom: 6 }}>{group.group}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.scopes.map(s => (
                      <button key={s} onClick={() => toggleScope(s)} className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                        style={{ background: selectedScopes.includes(s) ? 'rgba(13,148,136,0.2)' : 'rgba(51,65,85,0.4)', color: selectedScopes.includes(s) ? '#5EEAD4' : '#94A3B8', border: `1px solid ${selectedScopes.includes(s) ? 'rgba(13,148,136,0.4)' : 'rgba(51,65,85,0.5)'}` }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold" style={{ color: '#94A3B8' }}>Expiration</p>
              {['Never', '30 days', '90 days', '1 year', 'Custom'].map(e => (
                <button key={e} onClick={() => setExpiry(e)} className="w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all"
                  style={{ background: expiry === e ? 'rgba(13,148,136,0.15)' : 'rgba(51,65,85,0.3)', color: expiry === e ? '#5EEAD4' : '#94A3B8', border: `1px solid ${expiry === e ? 'rgba(13,148,136,0.3)' : 'transparent'}` }}>
                  {e}
                </button>
              ))}
            </div>
          )}
          {step === 4 && (
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>IP Allowlist (optional)</label>
              <textarea placeholder="192.168.1.0/24, 10.0.0.0/8" rows={3} className="w-full rounded-xl px-4 py-2.5 focus:outline-none resize-none" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13, fontFamily: 'DM Mono, monospace' }} />
            </div>
          )}
          {step === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
                  <p style={{ fontSize: 11, color: '#FCD34D' }}>This is the only time you'll see the full key. Store it securely.</p>
                </div>
              </div>
              <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.5)' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#5EEAD4', flex: 1 }}>{generatedKey}</span>
                <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-1.5 rounded-lg" style={{ background: 'rgba(13,148,136,0.2)' }}>
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-teal-400" />}
                </button>
              </div>
              <button className="flex items-center gap-2 text-xs" style={{ color: '#5EEAD4' }}>
                <Download className="w-3.5 h-3.5" /> Download as .env file
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-5">
          {step > 1 && step < 5 && <button onClick={() => setStep(p => p - 1)} className="flex-1 py-2.5 rounded-xl font-semibold text-sm" style={{ background: 'rgba(51,65,85,0.6)', color: '#CBD5E1' }}>Back</button>}
          {step < 5
            ? <button onClick={() => setStep(p => p + 1)} disabled={step === 1 && !name} className="flex-1 py-2.5 rounded-xl font-semibold text-sm" style={{ background: step === 1 && !name ? 'rgba(51,65,85,0.4)' : '#0D9488', color: step === 1 && !name ? '#475569' : '#fff' }}>
                {step === 4 ? 'Create Key' : 'Continue'}
              </button>
            : <button onClick={onClose} className="flex-1 py-2.5 rounded-xl font-semibold text-sm" style={{ background: '#0D9488', color: '#fff' }}>Done</button>
          }
        </div>
      </div>
    </div>
  );
}

export default function AdminSettingsApiKeys() {
  const [activeTab, setActiveTab] = useState<'personal' | 'workspace' | 'oauth'>('personal');
  const [showCreate, setShowCreate] = useState(false);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [keys, setKeys] = useState(MOCK_KEYS);

  return (
    <AdminPageLayout activeSection="platform-settings">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22 }}>API Keys & Tokens</h1>
            <p style={{ fontSize: 13, color: '#64748B' }}>Create and manage credentials for programmatic access.</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm" style={{ background: '#0D9488', color: '#fff' }}>
            <Plus className="w-4 h-4" /> Create new key
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: 'rgba(30,41,59,0.6)' }}>
          {(['personal', 'workspace', 'oauth'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className="flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
              style={{ background: activeTab === t ? '#1E293B' : 'transparent', color: activeTab === t ? '#E2E8F0' : '#64748B' }}>
              {t === 'oauth' ? 'OAuth Authorizations' : `${t.charAt(0).toUpperCase() + t.slice(1)} Keys`}
            </button>
          ))}
        </div>

        {/* Key table */}
        {(activeTab === 'personal' || activeTab === 'workspace') && (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
            <div className="grid border-b px-5 py-2.5" style={{ gridTemplateColumns: '1fr 160px 100px 90px 80px 100px', borderColor: 'rgba(51,65,85,0.5)' }}>
              {['Name', 'Key', 'Scopes', 'Last Used', 'Expires', 'Status'].map(h => (
                <div key={h} style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
              ))}
            </div>
            {keys.map(key => (
              <div key={key.id} className="grid items-center px-5 py-4 border-b transition-colors" style={{ gridTemplateColumns: '1fr 160px 100px 90px 80px 100px', borderColor: 'rgba(51,65,85,0.3)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(51,65,85,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div>
                  <div style={{ fontSize: 13, color: '#E2E8F0', fontWeight: 500 }}>{key.name}</div>
                  <div style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace', marginTop: 1 }}>{key.created}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#5EEAD4' }}>{showKey === key.id ? 'ck_live_FULLKEY1234' : key.prefix}</span>
                  <button onClick={() => setShowKey(showKey === key.id ? null : key.id)} style={{ color: '#475569' }}>
                    {showKey === key.id ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-medium" style={{ background: 'rgba(13,148,136,0.15)', color: '#5EEAD4' }}>{key.scopes.length} scopes</span>
                </div>
                <span style={{ fontSize: 11, color: '#64748B' }}>{key.lastUsed}</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#64748B' }}>{key.expires}</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: `${STATUS_COLORS[key.status]}22`, color: STATUS_COLORS[key.status] }}>{key.status}</span>
                  <button className="p-1 rounded" style={{ color: '#475569' }} title="Rotate">
                    <RotateCcw className="w-3 h-3" />
                  </button>
                  <button onClick={() => setKeys(p => p.filter(k => k.id !== key.id))} className="p-1 rounded" style={{ color: '#475569' }} title="Revoke">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'oauth' && (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
            <div className="px-6 py-10 text-center">
              <Key className="w-10 h-10 mx-auto mb-3" style={{ color: '#334155' }} />
              <p style={{ fontSize: 13, color: '#475569' }}>No OAuth authorizations yet.</p>
            </div>
          </div>
        )}
      </div>

      {showCreate && <CreateKeyModal onClose={() => setShowCreate(false)} />}
    </AdminPageLayout>
  );
}
