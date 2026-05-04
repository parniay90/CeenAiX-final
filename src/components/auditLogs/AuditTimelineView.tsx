import { useState } from 'react';
import { AuditEntry } from '../../data/auditLogsData';
import { A, SeverityDot, CategoryChip, OutcomeChip, PhiBadge, AnomalyBadge } from './AuditPrimitives';
import { AuditDetailPanel } from './AuditDetailPanel';

const ZOOM_OPTS = ['1m', '5m', '1h', '1d'] as const;
type Zoom = typeof ZOOM_OPTS[number];

const SEVERITY_COLORS: Record<string, string> = {
  Info: A.tealLight,
  Notice: A.blueLight,
  Warning: A.warningLight,
  Error: A.orangeLight,
  Critical: '#F87171',
};

export function AuditTimelineView({ entries }: { entries: AuditEntry[] }) {
  const [zoom, setZoom] = useState<Zoom>('1h');
  const [selected, setSelected] = useState<AuditEntry | null>(null);
  const [lane, setLane] = useState<'None' | 'Actor' | 'Portal'>('Portal');

  const groupKey = (e: AuditEntry) =>
    lane === 'Actor' ? e.actorName : lane === 'Portal' ? e.portal : 'All events';

  const groups = entries.reduce<Record<string, AuditEntry[]>>((acc, e) => {
    const k = groupKey(e);
    if (!acc[k]) acc[k] = [];
    acc[k].push(e);
    return acc;
  }, {});

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5">
        {/* Timeline controls */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex gap-1">
            {ZOOM_OPTS.map(z => (
              <button key={z} onClick={() => setZoom(z)} className="text-[10px] px-2.5 py-1 rounded-lg"
                style={zoom === z
                  ? { background: A.tealBg, color: A.tealLight, border: `1px solid ${A.tealBorder}` }
                  : { background: A.bg2, color: A.text3, border: `1px solid ${A.border}` }}>
                {z}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span style={{ color: A.text3 }}>Swimlanes:</span>
            {(['None', 'Actor', 'Portal'] as const).map(l => (
              <button key={l} onClick={() => setLane(l)} className="px-2 py-1 rounded-lg"
                style={lane === l
                  ? { background: A.tealBg, color: A.tealLight, border: `1px solid ${A.tealBorder}` }
                  : { background: A.bg2, color: A.text3, border: `1px solid ${A.border}` }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-5">
          {Object.entries(SEVERITY_COLORS).map(([sev, color]) => (
            <div key={sev} className="flex items-center gap-1.5 text-[10px]" style={{ color: A.text3 }}>
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              {sev}
            </div>
          ))}
        </div>

        {/* Timeline swimlanes */}
        {Object.entries(groups).map(([groupName, groupEntries]) => (
          <div key={groupName} className="mb-6">
            <div className="text-[10px] font-semibold mb-3 flex items-center gap-2"
              style={{ color: A.text2, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              <span className="px-2 py-0.5 rounded" style={{ background: A.tealBg, color: A.tealLight }}>{groupName}</span>
              <span style={{ color: A.text3 }}>{groupEntries.length} events</span>
            </div>

            {/* Horizontal time axis */}
            <div className="relative">
              {/* Connector line */}
              <div className="absolute left-0 right-0 top-4" style={{ height: 1, background: A.border }} />

              <div className="flex gap-3 overflow-x-auto pb-4">
                {groupEntries.map((entry) => {
                  const color = SEVERITY_COLORS[entry.severity] || A.text3;
                  return (
                    <div key={entry.id} className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                      style={{ minWidth: 160 }}
                      onClick={() => setSelected(selected?.id === entry.id ? null : entry)}>
                      {/* Node */}
                      <div className="w-8 h-8 rounded-full flex items-center justify-center z-10 transition-transform group-hover:scale-110"
                        style={{
                          background: selected?.id === entry.id ? color : `${color}22`,
                          border: `2px solid ${color}`,
                          boxShadow: entry.severity === 'Critical' ? `0 0 8px ${color}` : undefined,
                        }}>
                        <SeverityDot severity={entry.severity} />
                      </div>

                      {/* Event card */}
                      <div className="mt-3 p-2.5 rounded-xl w-full transition-all"
                        style={{
                          background: selected?.id === entry.id ? `${color}12` : A.bg2,
                          border: `1px solid ${selected?.id === entry.id ? `${color}40` : A.border}`,
                        }}>
                        <div className="text-[9px] mb-1" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>{entry.timestamp.split(' ')[1]}</div>
                        <div className="text-[10px] font-semibold leading-snug mb-1.5" style={{ color: A.text1 }}>{entry.event}</div>
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <CategoryChip category={entry.category} />
                          <OutcomeChip outcome={entry.outcome} />
                        </div>
                        <div className="text-[9px] mt-1.5" style={{ color: A.text3 }}>{entry.actorName}</div>
                        <div className="flex gap-1 mt-1">
                          {entry.phiAccessed && <PhiBadge />}
                          {entry.anomaly && <AnomalyBadge score={entry.anomaly.score} reason={entry.anomaly.reason} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {selected && (
        <AuditDetailPanel entry={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
