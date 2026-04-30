import React, { useState } from 'react';
import { Search, Bell, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import AdminPageLayout from '../components/admin/AdminPageLayout';

type ReleaseType = 'Feature' | 'Improvement' | 'Fix' | 'Security' | 'Breaking change' | 'Compliance';

interface Release {
  version: string;
  date: string;
  headline: string;
  types: ReleaseType[];
  isNew: boolean;
  summary: string;
  sections: {
    whatsnew?: string[];
    improvements?: string[];
    fixes?: string[];
    security?: string[];
    breaking?: string[];
    migration?: string;
  };
}

const RELEASES: Release[] = [
  {
    version: 'v2.4.1', date: '30 Apr 2026', headline: 'Impersonation audit trail & lock screen improvements',
    types: ['Feature', 'Security'], isNew: true,
    summary: 'This release adds the admin impersonation audit trail side panel, improves the lock screen overlay, and patches two minor security issues found during internal review.',
    sections: {
      whatsnew: ['Impersonation audit trail side panel — view every action taken during a session in real time', 'Lock screen now shows relative time since locked and current clock'],
      improvements: ['Idle timer now pauses correctly when user is active', 'Avatar dropdown now shows impersonation badge overlay'],
      security: ['Patched XSS vulnerability in patient name display on admin table', 'Rate limit tightened on /auth/unlock endpoint'],
    },
  },
  {
    version: 'v2.4.0', date: '22 Apr 2026', headline: 'Switch Workspace, NABIDH bulk sync improvements, and 14 fixes',
    types: ['Feature', 'Improvement', 'Fix'], isNew: true,
    summary: 'Major platform release adding workspace switching from the avatar dropdown, NABIDH sync performance improvements, and 14 bug fixes.',
    sections: {
      whatsnew: ['Switch Workspace submenu with search, recent workspaces, and confirmation modal', 'Workspace session scoping — switching clears all in-memory caches cleanly'],
      improvements: ['NABIDH batch sync reduced from 45s to 12s average', 'DHA ePrescription API retry logic improved with exponential backoff'],
      fixes: ['Fixed patient count badge overflow at >99,999', 'Fixed RTL sidebar animation flicker in Firefox', 'Fixed timezone offset in audit log exports'],
    },
  },
  {
    version: 'v2.3.8', date: '10 Apr 2026', headline: 'Insurance portal performance, compliance reporting updates',
    types: ['Improvement', 'Compliance'], isNew: false,
    summary: 'Performance improvements to the Insurance Portal API and updated compliance reporting to align with DHA Q2 2026 requirements.',
    sections: {
      improvements: ['Insurance Portal API response time reduced from 3.2s to 0.9s under normal load', 'Daman API retry queue now has a configurable grace window (1–7 days)'],
      security: ['TLS 1.0/1.1 disabled on all external-facing endpoints'],
    },
  },
  {
    version: 'v2.3.5', date: '28 Mar 2026', headline: 'Breaking: API key scopes restructured',
    types: ['Breaking change', 'Feature'], isNew: false,
    summary: 'API key scopes have been restructured for more granular access control. Existing keys retain access but should be rotated before May 31.',
    sections: {
      breaking: ['`read:all` and `write:all` wildcard scopes are deprecated. Existing keys continue to work until 2026-05-31.', 'New granular scopes: read:patients, write:patients, read:doctors, etc.'],
      migration: 'Rotate all existing API keys before May 31, 2026. Use the new scope picker in API Keys & Tokens settings. See migration guide in docs.',
    },
  },
];

const TYPE_COLORS: Record<ReleaseType, string> = {
  Feature: '#0D9488', Improvement: '#0891B2', Fix: '#64748B', Security: '#F59E0B', 'Breaking change': '#EF4444', Compliance: '#8B5CF6',
};

export default function AdminSystemChangelog() {
  const [selectedRelease, setSelectedRelease] = useState<Release>(RELEASES[0]);
  const [search, setSearch] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const filtered = RELEASES.filter(r =>
    !search || r.headline.toLowerCase().includes(search.toLowerCase()) || r.version.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminPageLayout activeSection="system">
      <div className="p-6 h-full flex flex-col" style={{ maxHeight: 'calc(100vh - 64px)' }}>
        <div className="flex items-start justify-between mb-5 flex-shrink-0">
          <div>
            <h1 className="font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22 }}>Release Notes</h1>
            <p style={{ fontSize: 13, color: '#64748B' }}>What's new, improved, and fixed in CeenAiX.</p>
          </div>
          <button onClick={() => setSubscribed(p => !p)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all" style={{ background: subscribed ? 'rgba(13,148,136,0.2)' : 'rgba(51,65,85,0.5)', color: subscribed ? '#5EEAD4' : '#94A3B8', border: `1px solid ${subscribed ? 'rgba(13,148,136,0.3)' : 'rgba(51,65,85,0.5)'}` }}>
            <Bell className="w-4 h-4" />
            {subscribed ? 'Subscribed' : 'Subscribe to updates'}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#475569' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search releases…" className="w-full rounded-xl pl-9 pr-3 py-2.5 focus:outline-none" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', color: '#E2E8F0', fontSize: 13 }} />
        </div>

        <div className="flex gap-5 flex-1 overflow-hidden">
          {/* Version rail */}
          <div className="w-64 flex-shrink-0 overflow-y-auto rounded-2xl" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
            {filtered.map(r => (
              <button key={r.version} onClick={() => setSelectedRelease(r)}
                className="w-full text-left px-4 py-4 border-b transition-colors"
                style={{ borderColor: 'rgba(51,65,85,0.3)', background: selectedRelease.version === r.version ? 'rgba(13,148,136,0.1)' : 'transparent', borderLeft: `3px solid ${selectedRelease.version === r.version ? '#0D9488' : 'transparent'}` }}
                onMouseEnter={e => { if (selectedRelease.version !== r.version) e.currentTarget.style.background = 'rgba(51,65,85,0.2)'; }}
                onMouseLeave={e => { if (selectedRelease.version !== r.version) e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: selectedRelease.version === r.version ? '#5EEAD4' : '#CBD5E1', fontWeight: 600 }}>{r.version}</span>
                  {r.isNew && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: 'rgba(16,185,129,0.2)', color: '#34D399' }}>NEW</span>}
                </div>
                <div style={{ fontSize: 11, color: '#64748B', marginBottom: 6 }}>{r.date}</div>
                <div className="flex flex-wrap gap-1">
                  {r.types.map(t => <span key={t} className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: `${TYPE_COLORS[t]}22`, color: TYPE_COLORS[t] }}>{t}</span>)}
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="flex-1 overflow-y-auto rounded-2xl" style={{ background: '#1E293B', border: '1px solid rgba(51,65,85,0.6)' }}>
            <div className="px-7 py-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 18, color: '#5EEAD4', fontWeight: 700 }}>{selectedRelease.version}</span>
                    {selectedRelease.isNew && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(16,185,129,0.2)', color: '#34D399' }}>NEW</span>}
                  </div>
                  <h2 className="font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 17 }}>{selectedRelease.headline}</h2>
                  <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{selectedRelease.date}</div>
                </div>
                <div className="flex gap-1">
                  {selectedRelease.types.map(t => <span key={t} className="px-2 py-1 rounded text-[10px] font-semibold" style={{ background: `${TYPE_COLORS[t]}22`, color: TYPE_COLORS[t] }}>{t}</span>)}
                </div>
              </div>

              <p className="mb-6" style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7 }}>{selectedRelease.summary}</p>

              {selectedRelease.sections.whatsnew && (
                <section className="mb-5">
                  <h3 className="font-bold mb-3" style={{ fontSize: 13, color: '#2DD4BF', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>What's New</h3>
                  <ul className="space-y-2">
                    {selectedRelease.sections.whatsnew.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#0D9488' }} />
                        <span style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {selectedRelease.sections.improvements && (
                <section className="mb-5">
                  <h3 className="font-bold mb-3" style={{ fontSize: 13, color: '#0891B2', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Improvements</h3>
                  <ul className="space-y-2">
                    {selectedRelease.sections.improvements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#0891B2' }} />
                        <span style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {selectedRelease.sections.fixes && (
                <section className="mb-5">
                  <h3 className="font-bold mb-3" style={{ fontSize: 13, color: '#64748B', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Bug Fixes</h3>
                  <ul className="space-y-2">
                    {selectedRelease.sections.fixes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#475569' }} />
                        <span style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {selectedRelease.sections.security && (
                <section className="mb-5">
                  <h3 className="font-bold mb-3" style={{ fontSize: 13, color: '#F59E0B', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Security</h3>
                  <ul className="space-y-2">
                    {selectedRelease.sections.security.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#F59E0B' }} />
                        <span style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {selectedRelease.sections.breaking && (
                <section className="mb-5">
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <h3 className="font-bold mb-3 flex items-center gap-2" style={{ fontSize: 13, color: '#F87171', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      Breaking Changes
                    </h3>
                    <ul className="space-y-2">
                      {selectedRelease.sections.breaking.map((item, i) => (
                        <li key={i} style={{ fontSize: 12, color: '#FCA5A5', lineHeight: 1.6 }}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
              {selectedRelease.sections.migration && (
                <section className="mb-5 p-4 rounded-xl" style={{ background: 'rgba(8,145,178,0.08)', border: '1px solid rgba(8,145,178,0.2)' }}>
                  <h3 className="font-bold mb-2" style={{ fontSize: 12, color: '#38BDF8' }}>Migration Notes</h3>
                  <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.6 }}>{selectedRelease.sections.migration}</p>
                  <button className="flex items-center gap-1 mt-2 text-xs" style={{ color: '#38BDF8' }}>
                    View migration guide <ExternalLink className="w-3 h-3" />
                  </button>
                </section>
              )}

              {/* Feedback */}
              <div className="pt-5 border-t flex items-center gap-4" style={{ borderColor: 'rgba(51,65,85,0.4)' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Was this helpful?</span>
                <button onClick={() => setFeedback(feedback === 'up' ? null : 'up')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all"
                  style={{ background: feedback === 'up' ? 'rgba(16,185,129,0.15)' : 'rgba(51,65,85,0.4)', color: feedback === 'up' ? '#34D399' : '#94A3B8' }}>
                  <ThumbsUp className="w-3.5 h-3.5" /> Yes
                </button>
                <button onClick={() => setFeedback(feedback === 'down' ? null : 'down')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all"
                  style={{ background: feedback === 'down' ? 'rgba(239,68,68,0.1)' : 'rgba(51,65,85,0.4)', color: feedback === 'down' ? '#F87171' : '#94A3B8' }}>
                  <ThumbsDown className="w-3.5 h-3.5" /> No
                </button>
                <button className="ml-auto flex items-center gap-1 text-xs" style={{ color: '#64748B' }}>
                  <ExternalLink className="w-3 h-3" /> Share link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}
