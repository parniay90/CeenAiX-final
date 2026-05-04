import { useState } from 'react';
import { X, Copy, Eye, EyeOff, Shield, Hash, FileText, Flag } from 'lucide-react';
import { AuditEntry } from '../../data/auditLogsData';
import { A, SeverityChip, CategoryChip, OutcomeChip, PhiBadge, AiBadge } from './AuditPrimitives';

const TABS = ['Overview', 'Related', 'Chain', 'Compliance', 'Notes'] as const;
type PanelTab = typeof TABS[number];

export function AuditDetailPanel({ entry, onClose }: { entry: AuditEntry; onClose: () => void }) {
  const [tab, setTab] = useState<PanelTab>('Overview');
  const [phiRevealed, setPhiRevealed] = useState(false);

  return (
    <div className="w-96 flex-shrink-0 flex flex-col" style={{ background: A.bg2, borderLeft: `1px solid ${A.border}` }}>
      {/* Panel header */}
      <div className="flex items-start justify-between p-4 flex-shrink-0" style={{ borderBottom: `1px solid ${A.border}` }}>
        <div className="flex-1 min-w-0 pr-2">
          <div className="text-xs font-semibold mb-1.5 leading-snug" style={{ color: A.text1, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {entry.event}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <SeverityChip severity={entry.severity} />
            <CategoryChip category={entry.category} />
            <OutcomeChip outcome={entry.outcome} />
          </div>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: A.bg1, color: A.text3 }}>
          <X size={14} />
        </button>
      </div>

      {/* Timestamp + correlation */}
      <div className="px-4 py-2 flex items-center gap-4 flex-shrink-0" style={{ borderBottom: `1px solid ${A.border}`, background: A.bg3 }}>
        <div className="text-[10px]" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>{entry.timestamp}</div>
        <div className="flex items-center gap-1 text-[10px]">
          <span style={{ color: A.text3 }}>CORR:</span>
          <span style={{ color: A.tealLight, fontFamily: 'DM Mono, monospace' }}>{entry.correlationId}</span>
          <button onClick={() => navigator.clipboard?.writeText(entry.correlationId)}>
            <Copy size={9} style={{ color: A.text3 }} />
          </button>
        </div>
        {entry.phiAccessed && <PhiBadge />}
        {entry.aiModel && <AiBadge model={entry.aiModel} />}
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-shrink-0" style={{ borderBottom: `1px solid ${A.border}` }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 text-[10px] py-2.5 transition-colors"
            style={{
              color: tab === t ? A.tealLight : A.text3,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: tab === t ? 600 : 400,
              borderBottom: tab === t ? `2px solid ${A.teal}` : '2px solid transparent',
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Panel body */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'Overview' && (
          <div className="space-y-5">
            {/* Actor */}
            <div>
              <div className="text-[9px] uppercase tracking-wider mb-2 font-semibold" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>Actor</div>
              <div className="p-3 rounded-xl" style={{ background: A.bg1, border: `1px solid ${A.border}` }}>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ background: A.tealBg, color: A.tealLight }}>
                    {entry.actorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: A.text1 }}>{entry.actorName}</div>
                    <div className="text-[10px]" style={{ color: A.text3 }}>{entry.actorRole} · {entry.actorType}</div>
                  </div>
                </div>
                {entry.impersonating && (
                  <div className="mt-2 p-2 rounded-lg text-[10px]" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', color: '#FB923C' }}>
                    Acting as: <span className="font-semibold">{entry.impersonating}</span>
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                  {[
                    { label: 'Actor ID', value: entry.actorId },
                    { label: 'Session', value: entry.sessionId },
                  ].map(f => (
                    <div key={f.label} className="flex-1 min-w-0">
                      <div style={{ color: A.text3 }}>{f.label}</div>
                      <div style={{ color: A.text2, fontFamily: 'DM Mono, monospace', fontSize: 10 }}>{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resource */}
            <div>
              <div className="text-[9px] uppercase tracking-wider mb-2 font-semibold" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>Resource</div>
              <div className="p-3 rounded-xl" style={{ background: A.bg1, border: `1px solid ${A.border}` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold" style={{ color: A.text1 }}>{entry.resourceType}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: A.tealBg, color: A.tealLight }}>{entry.workspace}</span>
                </div>
                <div className="text-[11px]" style={{ color: A.tealLight, fontFamily: 'DM Mono, monospace' }}>{entry.resourceId}</div>
                {entry.resourceName && (
                  <div className="text-[10px] mt-0.5" style={{ color: A.text3 }}>{entry.resourceName}</div>
                )}
              </div>
            </div>

            {/* Context */}
            <div>
              <div className="text-[9px] uppercase tracking-wider mb-2 font-semibold" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>Context</div>
              <div className="space-y-1.5">
                {[
                  { label: 'Source portal', value: entry.portal },
                  { label: 'IP address', value: entry.ip, mono: true },
                  { label: 'Location', value: entry.location },
                  { label: 'Request ID', value: entry.requestId, mono: true },
                ].map(f => (
                  <div key={f.label} className="flex justify-between text-[10px]">
                    <span style={{ color: A.text3 }}>{f.label}</span>
                    <span style={{ color: A.text2, fontFamily: f.mono ? 'DM Mono, monospace' : undefined }}>{f.value}</span>
                  </div>
                ))}
                {entry.aiModel && (
                  <div className="flex justify-between text-[10px]">
                    <span style={{ color: A.text3 }}>AI model</span>
                    <span style={{ color: '#A78BFA', fontFamily: 'DM Mono, monospace' }}>{entry.aiModel}</span>
                  </div>
                )}
              </div>
            </div>

            {/* PHI */}
            {entry.phiAccessed && (
              <div>
                <div className="text-[9px] uppercase tracking-wider mb-2 font-semibold" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>PHI Fields</div>
                <div className="p-3 rounded-xl" style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  {phiRevealed ? (
                    <div className="space-y-1">
                      {['Patient name', 'Date of birth', 'Emirates ID', 'Diagnosis codes'].map(f => (
                        <div key={f} className="text-[10px] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#FB923C', flexShrink: 0 }} />
                          <span style={{ color: '#FB923C' }}>{f}</span>
                        </div>
                      ))}
                      <button onClick={() => setPhiRevealed(false)} className="mt-2 flex items-center gap-1.5 text-[10px]"
                        style={{ color: A.text3 }}>
                        <EyeOff size={9} /> Hide PHI fields
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setPhiRevealed(true)} className="flex items-center gap-1.5 text-[10px] w-full"
                      style={{ color: '#FB923C' }}>
                      <Eye size={9} /> Reveal redacted fields (audit:view-phi required · logged)
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Anomaly */}
            {entry.anomaly && (
              <div>
                <div className="text-[9px] uppercase tracking-wider mb-2 font-semibold" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>Anomaly</div>
                <div className="p-3 rounded-xl" style={{ background: A.errorBg, border: `1px solid rgba(220,38,38,0.25)` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold" style={{ color: A.errorLight }}>Score: {entry.anomaly.score}</span>
                  </div>
                  <div className="text-[10px]" style={{ color: A.text2 }}>{entry.anomaly.reason}</div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Flag for review', icon: Flag, style: { background: A.warningBg, color: A.warningLight } },
                { label: 'Export entry', icon: FileText, style: { background: A.bg1, color: A.text2, border: `1px solid ${A.border}` } },
              ].map(a => {
                const Icon = a.icon;
                return (
                  <button key={a.label} className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg flex-1 justify-center"
                    style={a.style as React.CSSProperties}>
                    <Icon size={10} /> {a.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'Related' && (
          <div>
            <div className="text-[10px] mb-3" style={{ color: A.text3 }}>All entries with correlation ID <span style={{ color: A.tealLight, fontFamily: 'DM Mono, monospace' }}>{entry.correlationId}</span></div>
            <div className="space-y-2">
              {[entry].concat([]).map((e, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: A.bg1, border: `1px solid ${A.border}` }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: A.tealLight }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold" style={{ color: A.text1 }}>{e.event}</div>
                    <div className="text-[9px] mt-0.5" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>{e.timestamp}</div>
                  </div>
                </div>
              ))}
              <div className="text-[10px] text-center py-2" style={{ color: A.text3 }}>1 of 1 entries shown for this correlation ID</div>
            </div>
          </div>
        )}

        {tab === 'Chain' && (
          <div className="space-y-4">
            <div>
              <div className="text-[9px] uppercase tracking-wider mb-1.5" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>Entry Hash</div>
              <div className="p-2 rounded-lg text-[10px] break-all" style={{ background: A.bg1, border: `1px solid ${A.border}`, color: A.tealLight, fontFamily: 'DM Mono, monospace' }}>
                {entry.entryHash}
              </div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider mb-1.5" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>Previous Entry Hash</div>
              <div className="p-2 rounded-lg text-[10px] break-all" style={{ background: A.bg1, border: `1px solid ${A.border}`, color: A.text3, fontFamily: 'DM Mono, monospace' }}>
                {entry.prevHash}
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: A.successBg, border: `1px solid rgba(5,150,105,0.25)` }}>
              <Shield size={14} style={{ color: A.successLight }} />
              <div>
                <div className="text-xs font-semibold" style={{ color: A.successLight }}>Chain integrity verified</div>
                <div className="text-[10px]" style={{ color: A.text3 }}>Hash validated against previous entry · SHA-256</div>
              </div>
            </div>
            <button className="w-full text-[10px] py-2 rounded-lg"
              style={{ background: A.tealBg, color: A.tealLight, border: `1px solid ${A.tealBorder}` }}>
              <Hash size={10} className="inline mr-1" /> Verify this entry
            </button>
          </div>
        )}

        {tab === 'Compliance' && (
          <div className="space-y-4">
            <div>
              <div className="text-[9px] uppercase tracking-wider mb-2" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>Applicable Regulations</div>
              <div className="flex flex-wrap gap-2">
                {['HIPAA', 'DHA', 'NABIDH', 'PDPL'].map(r => (
                  <span key={r} className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: A.tealBg, color: A.tealLight, border: `1px solid ${A.tealBorder}` }}>{r}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider mb-1.5" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>Retention Policy</div>
              <div className="text-xs" style={{ color: A.text2 }}>7 years (DHA minimum). Cannot be reduced. Legal holds: None active.</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider mb-1.5" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>Exportable</div>
              <div className="text-xs" style={{ color: A.successLight }}>Yes — subject to redaction rules and permissions</div>
            </div>
          </div>
        )}

        {tab === 'Notes' && (
          <div>
            <div className="text-[10px] mb-3" style={{ color: A.text3 }}>Notes are immutable once submitted. Corrections create new versioned notes.</div>
            <textarea className="w-full px-3 py-2 rounded-xl text-xs outline-none resize-none"
              placeholder="Add a note (audit:annotate required)…"
              rows={4}
              style={{ background: A.bg1, border: `1px solid ${A.border}`, color: A.text1 }} />
            <button className="mt-2 text-[10px] px-3 py-1.5 rounded-lg"
              style={{ background: A.tealBg, color: A.tealLight, border: `1px solid ${A.tealBorder}` }}>
              Submit Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
