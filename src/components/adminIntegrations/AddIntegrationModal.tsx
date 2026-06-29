import { useState } from 'react';
import { X, CheckCircle2, Loader2, ChevronRight } from 'lucide-react';

interface Props { onClose: () => void }

const SCOPES = [
  'read:patients', 'write:patients', 'read:lab-results', 'write:lab-results',
  'read:prescriptions', 'write:prescriptions', 'read:appointments', 'write:appointments',
  'read:claims', 'write:claims', 'nabidh:sync', 'admin:read',
];

const PRE_BUILT = [
  { id: 'malaffi', name: 'Malaffi HIE', desc: 'Abu Dhabi national health records' },
  { id: 'riayati', name: 'Riayati', desc: 'UAE MOH national medical records' },
  { id: 'stripe', name: 'Stripe', desc: 'International card processing' },
  { id: 'mailgun', name: 'Mailgun', desc: 'Transactional email delivery' },
  { id: 'twilio', name: 'Twilio', desc: 'SMS gateway' },
  { id: 'custom', name: 'Custom Webhook', desc: 'Any HTTP endpoint' },
];

export default function AddIntegrationModal({ onClose }: Props) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState('');
  const [testState, setTestState] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['read:patients']);
  const [keyGenerated, setKeyGenerated] = useState(false);
  const [generatedKey] = useState('ck_live_AbCdEfGhIjKl1234567890XYZ');
  const [keyCopied, setKeyCopied] = useState(false);

  function runTest() {
    setTestState('testing');
    setTimeout(() => setTestState('ok'), 1800);
  }

  function copyKey() {
    navigator.clipboard.writeText(generatedKey).catch(() => {});
    setKeyCopied(true);
  }

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="rounded-2xl overflow-hidden w-[560px] flex flex-col" style={{ background: '#1E293B', border: '1px solid #334155', boxShadow: '0 24px 80px rgba(0,0,0,0.7)', maxHeight: '85vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: '1px solid #334155' }}>
          <div>
            <div className="font-bold text-white text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Add Integration</div>
            <div className="flex items-center gap-2 mt-1">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: step >= s ? '#0D9488' : '#334155', color: step >= s ? '#fff' : '#64748B', fontFamily: 'DM Mono, monospace' }}>
                    {s}
                  </div>
                  {s < 3 && <ChevronRight size={10} style={{ color: '#475569' }} />}
                </div>
              ))}
              <span className="text-xs text-slate-500 ml-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                {step === 1 ? 'Select type' : step === 2 ? 'Configure' : 'Activate'}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={15} /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-3">
                {PRE_BUILT.map(p => (
                  <button key={p.id} onClick={() => setSelected(p.id)}
                    className="p-4 rounded-xl text-left transition-all"
                    style={{
                      background: selected === p.id ? 'rgba(13,148,136,0.15)' : '#0F172A',
                      border: `1px solid ${selected === p.id ? 'rgba(13,148,136,0.5)' : '#334155'}`,
                    }}>
                    <div className="font-semibold text-sm text-slate-200 mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{p.name}</div>
                    <div className="text-xs text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Base URL', placeholder: 'https://api.example.com/v1', mono: true },
                { label: 'API Version', placeholder: 'v1', mono: true },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>{f.label}</label>
                  <input
                    placeholder={f.placeholder}
                    className="w-full h-10 px-3 rounded-xl text-sm focus:outline-none"
                    style={{ background: '#0F172A', border: '1px solid #334155', color: '#E2E8F0', fontFamily: f.mono ? 'DM Mono, monospace' : 'Inter, sans-serif' }}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Authentication</label>
                <div className="flex gap-2">
                  {['OAuth 2.0', 'API Key', 'Basic Auth'].map(a => (
                    <button key={a} className="flex-1 py-2 rounded-xl text-xs font-semibold transition-colors"
                      style={{ background: a === 'OAuth 2.0' ? 'rgba(13,148,136,0.2)' : '#0F172A', color: a === 'OAuth 2.0' ? '#2DD4BF' : '#64748B', border: `1px solid ${a === 'OAuth 2.0' ? 'rgba(13,148,136,0.4)' : '#334155'}` }}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { label: 'Client ID', placeholder: 'your-client-id' },
                { label: 'Client Secret', placeholder: '●●●●●●●●●●●●●●●●●●●●', type: 'password' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full h-10 px-3 rounded-xl text-sm focus:outline-none"
                    style={{ background: '#0F172A', border: '1px solid #334155', color: '#E2E8F0', fontFamily: 'DM Mono, monospace' }}
                  />
                </div>
              ))}

              <button
                onClick={runTest}
                disabled={testState === 'testing'}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                style={{ background: '#0D9488', color: '#fff' }}>
                {testState === 'testing' && <Loader2 size={13} className="animate-spin" />}
                {testState === 'idle' && 'Test Connection'}
                {testState === 'testing' && 'Testing…'}
                {testState === 'ok' && <><CheckCircle2 size={13} /> Connected · 0.42s</>}
                {testState === 'fail' && 'Connection failed — check credentials'}
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && !keyGenerated && (
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Scopes</label>
                <div className="grid grid-cols-2 gap-2">
                  {SCOPES.map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox"
                        checked={selectedScopes.includes(s)}
                        onChange={() => setSelectedScopes(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])}
                        className="w-3.5 h-3.5 accent-teal-500" />
                      <span className="text-xs text-slate-400" style={{ fontFamily: 'DM Mono, monospace' }}>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Data Direction</label>
                <div className="flex gap-2">
                  {['Inbound ←', 'Outbound →', 'Both ↔'].map(d => (
                    <button key={d} className="flex-1 py-2 rounded-xl text-xs font-semibold"
                      style={{ background: d === 'Both ↔' ? 'rgba(167,139,250,0.2)' : '#0F172A', color: d === 'Both ↔' ? '#A78BFA' : '#64748B', border: `1px solid ${d === 'Both ↔' ? 'rgba(167,139,250,0.4)' : '#334155'}` }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Key generated confirmation */}
          {step === 3 && keyGenerated && (
            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.3)' }}>
                <CheckCircle2 size={28} style={{ color: '#34D399', margin: '0 auto 12px' }} />
                <div className="font-bold text-white text-sm mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Integration Activated</div>
                <div className="text-xs text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>Connection verified and active</div>
              </div>

              <div className="rounded-xl p-4" style={{ background: '#0F172A', border: '1px solid #334155' }}>
                <div className="text-xs font-bold text-amber-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>⚠️ Copy this key now — it will never be shown again</div>
                <div className="text-sm font-bold text-teal-300 mb-3 break-all" style={{ fontFamily: 'DM Mono, monospace' }}>{generatedKey}</div>
                <button onClick={copyKey} className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ background: keyCopied ? 'rgba(16,185,129,0.2)' : '#0D9488', color: keyCopied ? '#34D399' : '#fff' }}>
                  {keyCopied ? <><CheckCircle2 size={13} /> Copied!</> : '📋 Copy Key'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        {!(step === 3 && keyGenerated) && (
          <div className="px-6 py-4 flex gap-3 shrink-0" style={{ borderTop: '1px solid #334155' }}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="px-6 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'rgba(51,65,85,0.4)', color: '#94A3B8' }}>
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (step < 3) { setStep(s => s + 1); }
                else { setKeyGenerated(true); }
              }}
              disabled={step === 1 && !selected}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ background: step === 1 && !selected ? '#334155' : '#0D9488', color: step === 1 && !selected ? '#64748B' : '#fff' }}
            >
              {step === 3 ? '✅ Activate Integration' : 'Continue'}
            </button>
          </div>
        )}

        {step === 3 && keyGenerated && (
          <div className="px-6 py-4 shrink-0" style={{ borderTop: '1px solid #334155' }}>
            <button onClick={onClose} className="w-full py-2.5 rounded-xl text-sm font-semibold" style={{ background: '#0D9488', color: '#fff' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
