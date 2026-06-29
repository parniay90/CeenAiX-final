import React, { useState } from 'react';
import { X, Clock, Calendar, Users, Plus, Trash2, Bell } from 'lucide-react';
import { ReportCatalogItem, ReportFormat, ScheduleFrequency, categoryMeta } from '../../data/reportsData';

interface Props {
  report: ReportCatalogItem | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

const FREQUENCIES: { value: ScheduleFrequency; label: string; desc: string }[] = [
  { value: 'daily',     label: 'Daily',     desc: 'Every day at the selected time' },
  { value: 'weekly',    label: 'Weekly',    desc: 'Once per week on the selected day' },
  { value: 'monthly',   label: 'Monthly',   desc: 'Once per month on the selected date' },
  { value: 'quarterly', label: 'Quarterly', desc: 'Once per quarter at period-end' },
];

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const MONTH_DATES = Array.from({ length: 28 }, (_, i) => i + 1);

export default function ScheduleReportModal({ report, onClose, onSuccess }: Props) {
  const [frequency, setFrequency] = useState<ScheduleFrequency>('monthly');
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('PDF');
  const [runTime, setRunTime] = useState('06:00');
  const [weekDay, setWeekDay] = useState('Monday');
  const [monthDate, setMonthDate] = useState(1);
  const [recipients, setRecipients] = useState<string[]>(['reports@daman.ae']);
  const [newEmail, setNewEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!report) return null;

  const meta = categoryMeta[report.category];

  function addRecipient() {
    const email = newEmail.trim();
    if (email && !recipients.includes(email)) {
      setRecipients(prev => [...prev, email]);
      setNewEmail('');
    }
  }

  function getNextRunText() {
    if (frequency === 'daily') return `Daily at ${runTime}`;
    if (frequency === 'weekly') return `Every ${weekDay} at ${runTime}`;
    if (frequency === 'monthly') return `${monthDate}${['st','nd','rd'][monthDate - 1] || 'th'} of each month at ${runTime}`;
    return 'At end of each quarter';
  }

  async function handleSave() {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    setSubmitting(false);
    onSuccess(`Schedule saved — ${report.title} will run ${getNextRunText()}`);
    onClose();
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#fff', borderRadius: 16, width: 540, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: meta.bg, border: `1px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bell size={18} color={meta.color} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Schedule Report</div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{report.title}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Frequency */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Frequency</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {FREQUENCIES.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFrequency(f.value)}
                  style={{
                    padding: '12px 14px', borderRadius: 10, textAlign: 'left', cursor: 'pointer',
                    background: frequency === f.value ? '#EFF6FF' : '#F8FAFC',
                    border: frequency === f.value ? '2px solid #1E3A5F' : '1px solid #E2E8F0',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: frequency === f.value ? '#1E3A5F' : '#374151' }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Timing */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Run Time</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              {frequency === 'weekly' && (
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>DAY OF WEEK</label>
                  <select value={weekDay} onChange={e => setWeekDay(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, color: '#0F172A', outline: 'none', background: '#fff' }}>
                    {WEEK_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}
              {frequency === 'monthly' && (
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>DAY OF MONTH</label>
                  <select value={monthDate} onChange={e => setMonthDate(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, color: '#0F172A', outline: 'none', background: '#fff' }}>
                    {MONTH_DATES.map(d => <option key={d} value={d}>{d}{['st','nd','rd'][d-1] || 'th'}</option>)}
                  </select>
                </div>
              )}
              {frequency !== 'quarterly' && (
                <div style={{ flex: frequency === 'daily' ? 1 : 0.6 }}>
                  <label style={{ fontSize: 11, color: '#94A3B8', display: 'block', marginBottom: 4 }}>TIME (UAE)</label>
                  <input type="time" value={runTime} onChange={e => setRunTime(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, color: '#0F172A', outline: 'none' }} />
                </div>
              )}
            </div>
          </div>

          {/* Format */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Output Format</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {report.formats.map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFormat(f)}
                  style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    background: selectedFormat === f ? '#1E3A5F' : '#F8FAFC',
                    color: selectedFormat === f ? '#fff' : '#475569',
                    border: selectedFormat === f ? '1px solid #1E3A5F' : '1px solid #E2E8F0',
                    transition: 'all 0.15s',
                  }}
                >{f}</button>
              ))}
            </div>
          </div>

          {/* Recipients */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={14} color="#64748B" /> Recipients
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              {recipients.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#1E3A5F' }}>
                    {r[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, fontSize: 13, color: '#374151' }}>{r}</div>
                  <button onClick={() => setRecipients(prev => prev.filter((_, j) => j !== i))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 2 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                placeholder="Add email address..."
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addRecipient()}
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, color: '#0F172A', outline: 'none' }}
              />
              <button onClick={addRecipient} style={{ padding: '8px 14px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Subject */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email Subject (optional)</div>
            <input
              type="text"
              placeholder={`Scheduled: ${report.title} — {period}`}
              value={subject}
              onChange={e => setSubject(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Use {'{period}'} to auto-insert the reporting period</div>
          </div>

          {/* Preview */}
          <div style={{ padding: '12px 16px', borderRadius: 10, background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Calendar size={14} color="#0284C7" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0284C7' }}>Next Scheduled Run</span>
            </div>
            <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{getNextRunText()}</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
              Delivered as {selectedFormat} to {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={submitting || recipients.length === 0}
            style={{
              padding: '10px 24px', background: submitting ? '#94A3B8' : '#1E3A5F', color: '#fff',
              border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, minWidth: 140,
            }}
          >
            {submitting ? (
              <><Clock size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
            ) : (
              <><Bell size={15} /> Save Schedule</>
            )}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
