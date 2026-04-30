import React, { useState } from 'react';
import { MessageCircle, Phone, Calendar, AlertOctagon, Plus, Clock, ChevronRight, Search, X, ExternalLink } from 'lucide-react';
import AdminPageLayout from '../components/admin/AdminPageLayout';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In progress' | 'Awaiting your reply' | 'Resolved' | 'Closed';
  lastUpdate: string;
  agent: string;
}

const MOCK_TICKETS: Ticket[] = [
  { id: 'TKT-0042', subject: 'Daman Insurance API timeout errors', category: 'Integration', severity: 'High', status: 'In progress', lastUpdate: '12m ago', agent: 'Sara K.' },
  { id: 'TKT-0039', subject: 'Patient #48231 — data export request', category: 'Compliance', severity: 'Medium', status: 'Awaiting your reply', lastUpdate: '2h ago', agent: 'Omar F.' },
  { id: 'TKT-0035', subject: 'Login audit log anomaly report', category: 'Bug', severity: 'Low', status: 'Resolved', lastUpdate: '1d ago', agent: 'Layla H.' },
  { id: 'TKT-0031', subject: 'NABIDH sync batch error — 3421 records', category: 'Integration', severity: 'High', status: 'Closed', lastUpdate: '3d ago', agent: 'Ahmed M.' },
];

const SEV_COLORS: Record<string, string> = { Low: '#10B981', Medium: '#0891B2', High: '#F59E0B', Critical: '#EF4444' };
const STATUS_COLORS: Record<string, string> = { Open: '#5EEAD4', 'In progress': '#0891B2', 'Awaiting your reply': '#F59E0B', Resolved: '#10B981', Closed: '#475569' };
const CATEGORIES = ['Bug', 'Account', 'Billing', 'Integration', 'Feature request', 'Compliance', 'Other'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const AREAS = ['Patient Portal', 'Doctor Portal', 'Pharmacy', 'Lab & Radiology', 'Insurance', 'Admin', 'Public', 'API'];

function NewTicketModal({ onClose }: { onClose: () => void }) {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');
  const [includeDiag, setIncludeDiag] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }} />
      <div className="relative rounded-2xl shadow-2xl w-full max-w-sm mx-4 text-center" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.8)' }} onClick={e => e.stopPropagation()}>
        <div className="px-8 py-10">
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(13,148,136,0.15)' }}>
            <MessageCircle className="w-7 h-7" style={{ color: '#0D9488' }} />
          </div>
          <h3 className="font-bold text-white mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16 }}>Ticket Submitted!</h3>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 4 }}>Your ticket ID is:</p>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, color: '#5EEAD4', marginBottom: 16 }}>TKT-0043</p>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl font-semibold text-sm" style={{ background: '#0D9488', color: '#fff' }}>Done</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }} />
      <div className="relative rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden flex flex-col" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.8)', maxHeight: '85vh' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b flex-shrink-0" style={{ borderColor: 'rgba(51,65,85,0.5)' }}>
          <h3 className="font-bold text-white" style={{ fontSize: 15, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Open a Ticket</h3>
          <button onClick={onClose}><X className="w-4 h-4" style={{ color: '#64748B' }} /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Subject <span style={{ color: '#EF4444' }}>*</span></label>
            <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full rounded-xl px-4 py-2.5 focus:outline-none" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-xl px-3 py-2.5 focus:outline-none" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }}>
                <option value="" style={{ background: '#1E293B' }}>Select…</option>
                {CATEGORIES.map(c => <option key={c} style={{ background: '#1E293B' }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Affected Area</label>
              <select value={area} onChange={e => setArea(e.target.value)} className="w-full rounded-xl px-3 py-2.5 focus:outline-none" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }}>
                <option value="" style={{ background: '#1E293B' }}>Select…</option>
                {AREAS.map(a => <option key={a} style={{ background: '#1E293B' }}>{a}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: '#94A3B8' }}>Severity</label>
            <div className="flex gap-2">
              {SEVERITIES.map(s => (
                <button key={s} onClick={() => setSeverity(s)} className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: severity === s ? `${SEV_COLORS[s]}22` : 'rgba(51,65,85,0.4)', color: severity === s ? SEV_COLORS[s] : '#94A3B8', border: `1px solid ${severity === s ? SEV_COLORS[s] + '44' : 'rgba(51,65,85,0.5)'}` }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full rounded-xl px-4 py-3 focus:outline-none resize-none" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="w-4 h-4 rounded flex items-center justify-center transition-colors flex-shrink-0" style={{ background: includeDiag ? '#0D9488' : 'transparent', border: `2px solid ${includeDiag ? '#0D9488' : '#475569'}` }} onClick={() => setIncludeDiag(p => !p)}>
              {includeDiag && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>Include diagnostic info (browser, OS, current route, recent actions)</span>
          </label>
        </div>
        <div className="flex gap-3 px-6 pb-5 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl font-semibold text-sm" style={{ background: 'rgba(51,65,85,0.6)', color: '#CBD5E1' }}>Cancel</button>
          <button onClick={() => { if (subject) setSubmitted(true); }} disabled={!subject} className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: subject ? '#0D9488' : 'rgba(51,65,85,0.4)', color: subject ? '#fff' : '#475569' }}>
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSupport() {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketSearch, setTicketSearch] = useState('');

  const filteredTickets = MOCK_TICKETS.filter(t =>
    !ticketSearch || t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) || t.id.toLowerCase().includes(ticketSearch.toLowerCase())
  );

  return (
    <AdminPageLayout activeSection="platform-settings">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22 }}>Support</h1>
            <p style={{ fontSize: 13, color: '#64748B' }}>Get help, report issues, and track your tickets.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span style={{ fontSize: 12, color: '#34D399' }}>Avg first response: 14 min</span>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left — Quick Actions */}
          <div className="w-64 flex-shrink-0 space-y-3">
            <button onClick={() => setShowNewTicket(true)} className="w-full p-4 rounded-2xl text-left transition-all group" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(13,148,136,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(51,65,85,0.6)'; }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(13,148,136,0.15)' }}>
                  <Plus className="w-5 h-5" style={{ color: '#0D9488' }} />
                </div>
                <span className="font-semibold text-white" style={{ fontSize: 13 }}>Open a Ticket</span>
              </div>
              <p style={{ fontSize: 11, color: '#64748B' }}>Submit a support request or report an issue.</p>
            </button>

            {[
              { icon: MessageCircle, title: 'Live Chat', sub: 'Average wait: 2 min', color: '#0891B2' },
              { icon: Calendar, title: 'Schedule a Call', sub: 'Book a 30-min session', color: '#10B981' },
            ].map(item => (
              <button key={item.title} className="w-full p-4 rounded-2xl text-left transition-all" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${item.color}44`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(51,65,85,0.6)'; }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${item.color}22` }}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <span className="font-semibold text-white" style={{ fontSize: 13 }}>{item.title}</span>
                </div>
                <p style={{ fontSize: 11, color: '#64748B' }}>{item.sub}</p>
              </button>
            ))}

            <button className="w-full p-4 rounded-2xl text-left transition-all" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
                  <AlertOctagon className="w-5 h-5" style={{ color: '#EF4444' }} />
                </div>
                <span className="font-semibold" style={{ fontSize: 13, color: '#F87171' }}>Emergency Escalation</span>
              </div>
              <p style={{ fontSize: 11, color: '#64748B' }}>Sev-1 incidents — notifies on-call engineer immediately.</p>
            </button>

            {/* Links */}
            <div className="pt-2 space-y-2">
              {[
                { label: 'Knowledge Base', icon: ExternalLink },
                { label: 'System Status', icon: ExternalLink },
              ].map(l => (
                <button key={l.label} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors" style={{ color: '#64748B', fontSize: 12 }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(51,65,85,0.3)'; e.currentTarget.style.color = '#94A3B8'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
                  <l.icon className="w-3.5 h-3.5" />
                  {l.label}
                </button>
              ))}
              <div className="px-3 py-2 space-y-1">
                <div style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Mono, monospace' }}>Direct contact</div>
                {['info@aryaix.com', 'support@ceeenaix.com'].map(e => (
                  <button key={e} className="flex items-center gap-2 text-left" style={{ fontSize: 11, color: '#5EEAD4', fontFamily: 'DM Mono, monospace' }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — My Tickets */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15 }}>My Tickets</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#475569' }} />
                <input value={ticketSearch} onChange={e => setTicketSearch(e.target.value)} placeholder="Search tickets…" className="rounded-xl pl-8 pr-3 py-2 focus:outline-none" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 12, width: 200 }} />
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
              <div className="grid border-b px-5 py-2.5" style={{ gridTemplateColumns: '90px 1fr 90px 70px 90px 80px', borderColor: 'rgba(51,65,85,0.5)' }}>
                {['Ticket ID', 'Subject', 'Status', 'Severity', 'Updated', 'Agent'].map(h => (
                  <div key={h} style={{ fontSize: 9, color: '#475569', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
                ))}
              </div>
              {filteredTickets.map(t => (
                <div key={t.id} className="grid items-center px-5 py-3.5 border-b cursor-pointer transition-colors" style={{ gridTemplateColumns: '90px 1fr 90px 70px 90px 80px', borderColor: 'rgba(51,65,85,0.3)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(51,65,85,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#5EEAD4' }}>{t.id}</span>
                  <div>
                    <div style={{ fontSize: 12, color: '#E2E8F0', fontWeight: 500 }}>{t.subject}</div>
                    <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>{t.category}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-semibold w-fit" style={{ background: `${STATUS_COLORS[t.status]}22`, color: STATUS_COLORS[t.status] }}>{t.status}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-semibold w-fit" style={{ background: `${SEV_COLORS[t.severity]}22`, color: SEV_COLORS[t.severity] }}>{t.severity}</span>
                  <span style={{ fontSize: 11, color: '#64748B' }}>{t.lastUpdate}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold" style={{ background: '#0D9488' }}>{t.agent[0]}</div>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{t.agent}</span>
                  </div>
                </div>
              ))}
              {filteredTickets.length === 0 && (
                <div className="py-10 text-center" style={{ color: '#475569', fontSize: 13 }}>No tickets match your search</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showNewTicket && <NewTicketModal onClose={() => setShowNewTicket(false)} />}
    </AdminPageLayout>
  );
}
