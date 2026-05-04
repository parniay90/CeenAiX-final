import { useState } from 'react';
import { Copy, Flag, ChevronDown } from 'lucide-react';
import { AuditEntry } from '../../data/auditLogsData';
import {
  A, SeverityDot, CategoryChip, OutcomeChip, PhiBadge, AiBadge, AnomalyBadge,
  TH, TR, CopyableId,
} from './AuditPrimitives';
import { AuditDetailPanel } from './AuditDetailPanel';

interface Props {
  entries: AuditEntry[];
  liveTail: boolean;
}

export function AuditTableView({ entries, liveTail }: Props) {
  const [selected, setSelected] = useState<AuditEntry | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-1 min-h-0 gap-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {/* Bulk actions */}
        {checkedIds.size > 0 && (
          <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-2" style={{ background: A.tealBg, borderBottom: `1px solid ${A.tealBorder}` }}>
            <span className="text-xs font-semibold" style={{ color: A.tealLight }}>{checkedIds.size} selected</span>
            {['Export selected', 'Flag for review', 'Add to incident', 'Acknowledge anomalies'].map(a => (
              <button key={a} className="text-[10px] px-2.5 py-1 rounded-lg"
                style={{ background: A.bg2, color: A.text2, border: `1px solid ${A.border}` }}>
                {a}
              </button>
            ))}
            <button onClick={() => setCheckedIds(new Set())} className="ml-auto text-[10px]" style={{ color: A.text3 }}>Clear</button>
          </div>
        )}

        {/* Live tail indicator */}
        {liveTail && (
          <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-1.5" style={{ background: 'rgba(5,150,105,0.08)', borderBottom: `1px solid rgba(5,150,105,0.2)` }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-[10px] font-semibold" style={{ color: A.successLight }}>Live tail active — streaming new entries</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10" style={{ background: '#0A1628' }}>
              <tr style={{ borderBottom: `1px solid ${A.border}` }}>
                <th className="py-2 pr-2 pl-4 w-8">
                  <input type="checkbox" className="w-3 h-3" style={{ accentColor: A.teal }} />
                </th>
                <TH>Time</TH>
                <TH>Sev</TH>
                <TH>Category</TH>
                <TH>Event</TH>
                <TH>Actor</TH>
                <TH>Resource</TH>
                <TH>Workspace</TH>
                <TH>Portal</TH>
                <TH>Outcome</TH>
                <TH>IP</TH>
                <TH>Correlation</TH>
                <TH>Flags</TH>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => {
                const isChecked = checkedIds.has(entry.id);
                const isSelected = selected?.id === entry.id;
                return (
                  <TR key={entry.id} onClick={() => setSelected(selected?.id === entry.id ? null : entry)}
                    highlight={entry.severity === 'Critical' || !!entry.anomaly}
                    selected={isSelected}>
                    <td className="py-2 pr-2 pl-4" onClick={e => toggleCheck(entry.id, e)}>
                      <input type="checkbox" checked={isChecked} readOnly className="w-3 h-3" style={{ accentColor: A.teal }} />
                    </td>

                    {/* Timestamp */}
                    <td className="py-2 pr-3 whitespace-nowrap">
                      <div className="text-[10px]" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>{entry.timestamp.split(' ')[1]}</div>
                      <div className="text-[9px]" style={{ color: A.text3 }}>{entry.timestamp.split(' ')[0]}</div>
                    </td>

                    {/* Severity */}
                    <td className="py-2 pr-3">
                      <SeverityDot severity={entry.severity} />
                    </td>

                    {/* Category */}
                    <td className="py-2 pr-3">
                      <CategoryChip category={entry.category} />
                    </td>

                    {/* Event */}
                    <td className="py-2 pr-3 max-w-[220px]">
                      <div className="text-xs truncate" style={{ color: A.text1 }} title={entry.event}>{entry.event}</div>
                    </td>

                    {/* Actor */}
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                          style={{ background: A.tealBg, color: A.tealLight }}>
                          {entry.actorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] truncate max-w-[120px]" style={{ color: A.text1 }}>{entry.actorName}</div>
                          {entry.impersonating && (
                            <div className="text-[9px]" style={{ color: '#FB923C' }}>as {entry.impersonating.split('(')[0].trim()}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Resource */}
                    <td className="py-2 pr-3">
                      <div className="text-[10px]" style={{ color: A.text2 }}>{entry.resourceType}</div>
                      <div className="text-[9px]" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>{entry.resourceId}</div>
                    </td>

                    {/* Workspace */}
                    <td className="py-2 pr-3 max-w-[120px]">
                      <div className="text-[10px] truncate" style={{ color: A.text3 }}>{entry.workspace}</div>
                    </td>

                    {/* Portal */}
                    <td className="py-2 pr-3">
                      <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: A.bg1, color: A.text3, border: `1px solid ${A.border}` }}>{entry.portal}</span>
                    </td>

                    {/* Outcome */}
                    <td className="py-2 pr-3">
                      <OutcomeChip outcome={entry.outcome} />
                    </td>

                    {/* IP */}
                    <td className="py-2 pr-3">
                      <div className="text-[10px] whitespace-nowrap" style={{ color: A.text3, fontFamily: 'DM Mono, monospace' }}>{entry.ip}</div>
                    </td>

                    {/* Correlation */}
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-1">
                        <CopyableId value={entry.correlationId} />
                        <button onClick={e => { e.stopPropagation(); navigator.clipboard?.writeText(entry.correlationId); }}>
                          <Copy size={9} style={{ color: A.text3 }} />
                        </button>
                      </div>
                    </td>

                    {/* Flags */}
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        {entry.phiAccessed && <PhiBadge />}
                        {entry.aiModel && <AiBadge model={entry.aiModel} />}
                        {entry.anomaly && <AnomalyBadge score={entry.anomaly.score} reason={entry.anomaly.reason} />}
                        {entry.flagged && <Flag size={10} style={{ color: A.warningLight }} />}
                      </div>
                    </td>
                  </TR>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: `1px solid ${A.border}` }}>
          <span className="text-[10px]" style={{ color: A.text3 }}>Showing {entries.length} of 284,920 entries</span>
          <div className="flex items-center gap-1">
            {['←', '1', '2', '3', '...', '24', '→'].map(p => (
              <button key={p + Math.random()} className="min-w-[24px] h-6 rounded px-1 text-[10px]"
                style={{ background: p === '1' ? A.tealBg : A.bg2, color: p === '1' ? A.tealLight : A.text3, border: `1px solid ${p === '1' ? A.tealBorder : A.border}` }}>
                {p}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span style={{ color: A.text3 }}>Jump to date:</span>
            <input type="date" className="px-2 py-1 rounded text-[10px] outline-none"
              style={{ background: A.bg1, border: `1px solid ${A.border}`, color: A.text2 }} />
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <AuditDetailPanel entry={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
