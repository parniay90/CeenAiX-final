import { useState } from 'react';
import { ShieldAlert, Plus, Eye, EyeOff, Copy, Check, RefreshCw, X as XIcon } from 'lucide-react';

const SCOPES = ['read:patients', 'write:patients', 'read:lab-results', 'write:lab-results', 'read:prescriptions', 'write:prescriptions', 'read:appointments', 'nabidh:sync', 'admin:read'];

const API_KEYS = [
  { name: 'CeenAiX Production — Internal', org: 'AryAiX LLC', key: 'ck_live_Ax9fP●●●●●●●●●●●●●●●●', scopes: ['Full access', 'All portals'], created: 'Jan 2024', lastUsed: '2 seconds ago', rateLimit: '10,000/hour', status: 'active' as const },
  { name: 'Al Noor Medical Center — Portal', org: 'Al Noor Medical Center', key: 'ck_live_BnQ4k●●●●●●●●●●●●●●●●', scopes: ['read:patients', 'write:prescriptions', 'read:labs'], created: 'Mar 2024', lastUsed: '11:34 AM', rateLimit: '1,000/hour', status: 'active' as const },
  { name: 'Dubai Medical & Imaging Centre', org: 'Dubai Medical & Imaging', key: 'ck_live_CpR7m●●●●●●●●●●●●●●●●', scopes: ['read:patients', 'write:lab-results', 'nabidh:sync'], created: 'Apr 2024', lastUsed: '2:05 PM', rateLimit: '500/hour', status: 'active' as const },
  { name: 'Daman Insurance — Claims API', org: 'Daman Health', key: 'ck_live_DqS2n●●●●●●●●●●●●●●●●', scopes: ['read:claims', 'write:preauth', 'read:patient-summary'], created: 'Feb 2024', lastUsed: 'Continuous', rateLimit: '2,000/hour', status: 'active' as const },
  { name: 'AXA Gulf — Claims', org: 'AXA Gulf', key: 'ck_live_ErT8o●●●●●●●●●●●●●●●●', scopes: ['read:claims', 'write:preauth'], created: 'May 2024', lastUsed: '1:02 PM', rateLimit: '500/hour', status: 'active' as const },
  { name: 'CeenAiX Mobile App', org: 'AryAiX LLC', key: 'ck_live_FsU1p●●●●●●●●●●●●●●●●', scopes: ['read:patient-portal'], created: 'Jan 2024', lastUsed: '2:07 PM', rateLimit: '5,000/hour', status: 'active' as const },
  { name: 'Test Key — Staging', org: 'AryAiX LLC (Dev)', key: 'ck_test_GtV9q●●●●●●●●●●●●●●●●', scopes: ['Full access (staging)'], created: 'Mar 2025', lastUsed: 'Today 10:22 AM', rateLimit: '10,000/hour', status: 'expiring' as const },
  { name: 'Old Key — Revoked 15 Feb 2026', org: 'Legacy', key: 'ck_live_HuW●●●●●●●●●●●●●●●●●●', scopes: ['read:patients'], created: 'Jun 2023', lastUsed: 'Feb 2026', rateLimit: '100/hour', status: 'revoked' as const },
];

const WEBHOOKS = [
  { name: 'Nabidh HIE (inbound sync)', endpoint: 'api.ceenaix.com/webhooks/nabidh', events: 'patient.updated, lab.result.released', method: 'POST', delivery: '99.97%', last: '12s ago', status: 'active' as const },
  { name: 'Daman Insurance', endpoint: 'api.ceenaix.com/webhooks/daman', events: 'claim.approved, claim.denied, preauth.response', method: 'POST', delivery: '98.4%', last: '1:58 PM', status: 'degraded' as const },
  { name: 'Tatmeen Drug Recall', endpoint: 'api.ceenaix.com/webhooks/tatmeen', events: 'drug.recall, stock.alert', method: 'POST', delivery: '100%', last: '3h ago', status: 'active' as const },
  { name: 'DHA ePrescription', endpoint: 'api.ceenaix.com/webhooks/dha-rx', events: 'prescription.signed, prescription.dispensed', method: 'POST', delivery: '99.99%', last: '2:05 PM', status: 'active' as const },
];

type SubTab = 'keys' | 'webhooks' | 'oauth';

export default function APIKeysWebhooksTab() {
  const [sub, setSub] = useState<SubTab>('keys');
  const [revealedKeys, setRevealedKeys] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState<number | null>(null);
  const [keyFilter, setKeyFilter] = useState('all');
  const [scopeSearch, setScopeSearch] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['read:patients']);
  const [expiry, setExpiry] = useState('never');
  const [rateLimit, setRateLimit] = useState('1000');

  function revealKey(i: number) {
    setRevealedKeys(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
    if (!revealedKeys.has(i)) setTimeout(() => setRevealedKeys(p => { const n = new Set(p); n.delete(i); return n; }), 10000);
  }
  function copy(i: number) {
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-5">
      {/* Security banner */}
      <div className="flex items-start gap-3 rounded-2xl px-5 py-4" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <ShieldAlert size={16} style={{ color: '#F87171', flexShrink: 0, marginTop: 1 }} />
        <div className="text-xs text-red-300 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
          API keys grant access to CeenAiX platform data. Treat all keys as secrets. Never share in chat or email.
          All key operations are audit-logged with admin identity.
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1" style={{ borderBottom: '1px solid #334155' }}>
        {([['keys', '🔑 API Keys'], ['webhooks', '🪝 Webhooks'], ['oauth', '📋 OAuth Apps']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setSub(id)}
            className="px-4 py-3 text-xs font-semibold transition-all"
            style={{ color: sub === id ? '#2DD4BF' : '#64748B', borderBottom: sub === id ? '2px solid #0D9488' : '2px solid transparent', fontFamily: 'Inter, sans-serif' }}>
            {label}
          </button>
        ))}
      </div>

      {/* API KEYS */}
      {sub === 'keys' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {['all', 'active', 'expiring', 'expired', 'revoked'].map(f => (
                <button key={f} onClick={() => setKeyFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  style={{
                    background: keyFilter === f ? 'rgba(13,148,136,0.2)' : 'rgba(30,41,59,0.5)',
                    color: keyFilter === f ? '#2DD4BF' : '#64748B',
                    fontFamily: 'DM Mono, monospace',
                  }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <button className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold" style={{ background: '#0D9488', color: '#fff' }}>
              <Plus size={12} /> Generate New Key
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid #334155' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
                  {['Key Name / Value', 'Organization', 'Scopes', 'Rate Limit', 'Last Used', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {API_KEYS.map((key, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(51,65,85,0.3)', opacity: key.status === 'revoked' ? 0.45 : 1 }}
                    onMouseEnter={e => { if (key.status !== 'revoked') e.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-200 text-xs mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>{key.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#475569' }}>
                          {revealedKeys.has(i) ? key.key.replace('●●●●●●●●●●●●●●●●', 'AbCd1234XyZ9') : key.key}
                        </span>
                        <button onClick={() => revealKey(i)} className="text-slate-600 hover:text-slate-300 transition-colors">
                          {revealedKeys.has(i) ? <EyeOff size={10} /> : <Eye size={10} />}
                        </button>
                        <button onClick={() => copy(i)} className="text-slate-600 hover:text-teal-400 transition-colors">
                          {copied === i ? <Check size={10} style={{ color: '#34D399' }} /> : <Copy size={10} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>{key.org}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {key.scopes.slice(0, 2).map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded-full text-xs" style={{ background: 'rgba(13,148,136,0.1)', color: '#2DD4BF', fontFamily: 'DM Mono, monospace', fontSize: 8 }}>{s}</span>
                        ))}
                        {key.scopes.length > 2 && <span className="text-xs text-slate-500" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9 }}>+{key.scopes.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#64748B' }}>{key.rateLimit}</span></td>
                    <td className="px-4 py-3"><span className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#64748B' }}>{key.lastUsed}</span></td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{
                        background: key.status === 'active' ? 'rgba(16,185,129,0.1)' : key.status === 'expiring' ? 'rgba(245,158,11,0.1)' : 'rgba(100,116,139,0.1)',
                        color: key.status === 'active' ? '#34D399' : key.status === 'expiring' ? '#FCD34D' : '#94A3B8',
                        fontFamily: 'DM Mono, monospace', fontSize: 9,
                      }}>
                        {key.status === 'active' ? '✅ Active' : key.status === 'expiring' ? '⚠️ Expiring' : '🔒 Revoked'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button className="px-2 py-1 rounded-lg text-xs" style={{ background: 'rgba(13,148,136,0.1)', color: '#2DD4BF', fontFamily: 'DM Mono, monospace', fontSize: 9 }}>Rotate</button>
                        {key.status !== 'revoked' && (
                          <button className="px-2 py-1 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', fontFamily: 'DM Mono, monospace', fontSize: 9 }}>Revoke</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* WEBHOOKS */}
      {sub === 'webhooks' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold" style={{ background: '#0D9488', color: '#fff' }}>
              <Plus size={12} /> Add Webhook
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid #334155' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(15,23,42,0.5)', borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
                  {['Name / Endpoint', 'Events', 'Method', 'Delivery', 'Last', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left" style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WEBHOOKS.map((wh, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(51,65,85,0.3)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-xs text-slate-200 mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{wh.name}</div>
                      <div className="text-xs text-slate-500 truncate" style={{ fontFamily: 'DM Mono, monospace', maxWidth: 200 }}>{wh.endpoint}</div>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs text-slate-500 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10 }}>{wh.events}</span></td>
                    <td className="px-4 py-3"><span className="text-xs font-bold text-teal-400" style={{ fontFamily: 'DM Mono, monospace' }}>{wh.method}</span></td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold" style={{ fontFamily: 'DM Mono, monospace', color: parseFloat(wh.delivery) >= 99 ? '#34D399' : '#FCD34D' }}>{wh.delivery}</span>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs text-slate-500" style={{ fontFamily: 'DM Mono, monospace' }}>{wh.last}</span></td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{
                        background: wh.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        color: wh.status === 'active' ? '#34D399' : '#FCD34D',
                        fontFamily: 'DM Mono, monospace', fontSize: 9,
                      }}>
                        {wh.status === 'active' ? '✅ Active' : '⚠️ Degraded'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button className="px-2 py-1 rounded-lg text-xs" style={{ background: 'rgba(13,148,136,0.1)', color: '#2DD4BF', fontSize: 9, fontFamily: 'DM Mono, monospace' }}>Test</button>
                        <button className="px-2 py-1 rounded-lg text-xs" style={{ background: 'rgba(51,65,85,0.4)', color: '#94A3B8', fontSize: 9, fontFamily: 'DM Mono, monospace' }}>Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OAUTH APPS */}
      {sub === 'oauth' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="font-bold text-slate-200 text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>OAuth 2.0 Applications</div>
              <div className="text-xs text-slate-500 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>Manage third-party apps authorized to access CeenAiX data via OAuth 2.0</div>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold" style={{ background: '#0D9488', color: '#fff' }}>
              <Plus size={12} /> Register OAuth App
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { name: 'CeenAiX Patient Mobile App', client: 'oauth_CnX_mob_7f2a1', scopes: ['read:profile', 'read:appointments', 'read:medications'], redirect: 'ceenaix://oauth/callback', status: 'active', lastAuth: '2 min ago', users: 8247 },
              { name: 'Daman Insurance Portal', client: 'oauth_Dmn_ins_9k4b2', scopes: ['read:claims', 'write:preauth', 'read:patient-summary'], redirect: 'https://portal.damanhealth.ae/callback', status: 'active', lastAuth: '8 min ago', users: 1204 },
              { name: 'DHA Physician Connect', client: 'oauth_DHA_phys_3m7c9', scopes: ['read:patients', 'write:prescriptions', 'nabidh:sync'], redirect: 'https://dha.gov.ae/physician/oauth', status: 'active', lastAuth: '1h ago', users: 312 },
              { name: 'Shafafiya Claims Gateway', client: 'oauth_Shf_clm_1x5d8', scopes: ['read:claims', 'write:claims'], redirect: 'https://api.shafafiya.ae/oauth/return', status: 'degraded', lastAuth: '3.2s avg', users: 89 },
            ].map((app, i) => (
              <div key={i} className="rounded-2xl p-5" style={{ background: '#1E293B', border: `1px solid ${app.status === 'degraded' ? 'rgba(245,158,11,0.4)' : '#334155'}` }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0" style={{ background: 'rgba(13,148,136,0.15)', color: '#2DD4BF', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-200 text-sm mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{app.name}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#475569' }}>{app.client}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{
                          background: app.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                          color: app.status === 'active' ? '#34D399' : '#FCD34D',
                          fontFamily: 'DM Mono, monospace', fontSize: 9,
                        }}>
                          {app.status === 'active' ? '✅ Active' : '⚠️ Degraded'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(51,65,85,0.4)', color: '#94A3B8', fontFamily: 'DM Mono, monospace', fontSize: 10 }}>Edit</button>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', fontFamily: 'DM Mono, monospace', fontSize: 10 }}>Revoke</button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 pt-4" style={{ borderTop: '1px solid rgba(51,65,85,0.4)' }}>
                  <div>
                    <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9 }}>Scopes Granted</div>
                    <div className="flex flex-wrap gap-1">
                      {app.scopes.map(s => (
                        <span key={s} className="px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(13,148,136,0.1)', color: '#2DD4BF', fontFamily: 'DM Mono, monospace', fontSize: 8 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9 }}>Redirect URI</div>
                    <div className="text-xs text-slate-400 truncate" style={{ fontFamily: 'DM Mono, monospace', maxWidth: 200 }}>{app.redirect}</div>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9 }}>Active Users</div>
                      <div className="font-bold" style={{ fontFamily: 'DM Mono, monospace', fontSize: 16, color: '#2DD4BF' }}>{app.users.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9 }}>Last Auth</div>
                      <div className="text-xs" style={{ fontFamily: 'DM Mono, monospace', color: '#94A3B8' }}>{app.lastAuth}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
