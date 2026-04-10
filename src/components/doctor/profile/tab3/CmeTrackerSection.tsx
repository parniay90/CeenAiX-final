import React, { useEffect, useState } from 'react';
import { GraduationCap, Plus, X } from 'lucide-react';

interface CmeTrackerSectionProps {
  showToast: (msg: string, type?: 'success' | 'warning') => void;
}

const categories = [
  { name: 'Clinical Practice', completed: 6, required: 8, color: '#10B981' },
  { name: 'Communication', completed: 0, required: 3, color: '#F59E0B' },
  { name: 'Ethics', completed: 0, required: 3, color: '#F59E0B' },
  { name: 'Management', completed: 0, required: 2, color: '#F59E0B' },
  { name: 'Technology / AI', completed: 2, required: 4, color: '#3B82F6' },
  { name: 'Safety & Quality', completed: 4, required: 5, color: '#3B82F6' },
  { name: 'Research', completed: 0, required: 5, color: '#3B82F6' },
];

const activities = [
  { date: 'Apr 2026', activity: 'Grand Rounds × 2', hours: 2, category: 'Clinical', cert: true },
  { date: 'Mar 2026', activity: 'DHA Webinar: AI in Medicine', hours: 2, category: 'Technology', cert: true },
  { date: 'Mar 2026', activity: 'Journal self-study', hours: 2, category: 'Academic', cert: true },
  { date: 'Feb 2026', activity: 'Grand Rounds × 4', hours: 6, category: 'Clinical', cert: true },
];

const CmeTrackerSection: React.FC<CmeTrackerSectionProps> = ({ showToast }) => {
  const [barWidth, setBarWidth] = useState(0);
  const [logModal, setLogModal] = useState(false);

  useEffect(() => { setTimeout(() => setBarWidth(40), 400); }, []);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-l-4 border-purple-500">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>CME — Continuing Medical Education</h2>
              <p className="text-[12px] text-slate-400">DHA requires 30 hours per renewal cycle</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-4">
            <p className="text-[28px] font-bold text-purple-600 leading-none" style={{ fontFamily: 'DM Mono, monospace' }}>12 / 30 hours</p>
            <p className="text-[13px] text-slate-500 mt-1">completed · 18 hours remaining</p>
          </div>

          <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-purple-500 rounded-full transition-all duration-700 ease-out" style={{ width: `${barWidth}%` }} />
          </div>
          <p className="text-[11px] text-amber-600 mb-4">Renewal deadline: December 2026 (8 months)</p>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-5">
            <p className="text-[12px] text-amber-800 font-medium mb-0.5">Projection warning</p>
            <p className="text-[12px] text-amber-700">At current rate (1.5h/month), you will reach 24h by December — below the 30h requirement.</p>
            <p className="text-[12px] text-amber-700 mt-1">⚠️ Increase CME activity by ~2.5h/month to comply.</p>
          </div>

          <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-3">DHA Required Categories</p>
          <div className="space-y-2.5 mb-5">
            {categories.map((cat) => {
              const catPct = Math.min((cat.completed / cat.required) * 100, 100);
              return (
                <div key={cat.name} className="flex items-center space-x-3">
                  <span className="text-[12px] text-slate-600 w-36 flex-shrink-0">{cat.name}</span>
                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                    <div className="h-full rounded-full" style={{ width: `${catPct}%`, backgroundColor: cat.color }} />
                  </div>
                  <span className="text-[11px] flex-shrink-0" style={{ fontFamily: 'DM Mono, monospace', color: cat.color }}>
                    {cat.completed}/{cat.required}h
                    {cat.completed === 0 ? ' ⚠️' : cat.completed >= cat.required ? ' ✅' : ''}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-5">
            <p className="text-[12px] text-amber-800 font-semibold mb-1">⚠️ 3 DHA categories have 0 hours completed</p>
            <p className="text-[12px] text-amber-700">Communication · Ethics · Management — required for renewal. Complete before December 2026.</p>
            <button onClick={() => showToast('✅ Opening DHA-approved course browser')} className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold underline mt-1 transition-colors">
              Browse DHA-Approved Courses →
            </button>
          </div>

          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] uppercase tracking-widest text-slate-400">Activity Log</p>
            <button onClick={() => setLogModal(true)} className="flex items-center space-x-1.5 px-3 py-1.5 border border-purple-300 text-purple-600 hover:bg-purple-50 rounded-lg text-[12px] font-medium transition-colors">
              <Plus className="w-3.5 h-3.5" /><span>Log CME Activity</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Date', 'Activity', 'Hours', 'Category', 'Certificate'].map((h) => (
                    <th key={h} className="text-left py-2 pr-4 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activities.map((act, i) => (
                  <tr key={i}>
                    <td className="py-2.5 pr-4 text-slate-400" style={{ fontFamily: 'DM Mono, monospace' }}>{act.date}</td>
                    <td className="py-2.5 pr-4 text-slate-700">{act.activity}</td>
                    <td className="py-2.5 pr-4 text-purple-600 font-bold" style={{ fontFamily: 'DM Mono, monospace' }}>{act.hours}h</td>
                    <td className="py-2.5 pr-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full">{act.category}</span>
                    </td>
                    <td className="py-2.5">
                      <span className="text-emerald-500">✅</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 mt-3" style={{ fontFamily: 'DM Mono, monospace' }}>Total logged: 12 hours this renewal cycle</p>
        </div>
      </div>

      {logModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setLogModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-slate-900">Log CME Activity</h3>
              <button onClick={() => setLogModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[12px] text-slate-500 mb-1 block">Activity Type</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-400">
                  <option>Grand Rounds</option>
                  <option>Conference</option>
                  <option>Online Course</option>
                  <option>Journal Study</option>
                  <option>Workshop</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] text-slate-500 mb-1 block">Event Name</label>
                <input placeholder="Name of CME activity" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] text-slate-500 mb-1 block">Date</label>
                  <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
                <div>
                  <label className="text-[12px] text-slate-500 mb-1 block">Duration (hours)</label>
                  <input type="number" min={0.5} step={0.5} placeholder="2" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
              </div>
              <div>
                <label className="text-[12px] text-slate-500 mb-1 block">DHA Category</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-400">
                  {categories.map((c) => <option key={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[12px] text-slate-500 mb-1 block">Certificate (PDF)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center text-[12px] text-slate-400 cursor-pointer hover:border-purple-300 hover:text-purple-500 transition-colors">
                  Upload certificate PDF
                </div>
              </div>
            </div>
            <button
              onClick={() => { setLogModal(false); showToast('✅ CME activity logged — 12 hours total'); }}
              className="w-full mt-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-colors"
            >
              Log Activity
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CmeTrackerSection;
