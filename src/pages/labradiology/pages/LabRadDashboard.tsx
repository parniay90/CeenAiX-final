import { useState, useEffect } from 'react';
import {
  AlertOctagon, Phone, MessageSquare, FlaskConical, Scan,
  AlertTriangle, CheckCircle, Clock, Upload, Activity,
  ChevronRight, Cpu, BarChart2, TrendingUp, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { mockSamples, mockStudies, tatChartData, volumeData } from '../mockData';
import type { LabPage } from '../types';

interface Props { onNavigate: (page: LabPage) => void; }

function useCriticalTimer(startSeconds: number) {
  const [seconds, setSeconds] = useState(startSeconds);
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function ScanProgressRing({ progress, size = 56 }: { progress: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (progress / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#7c3aed" strokeWidth={4}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.5s ease' }}
      />
    </svg>
  );
}

const modalityColor: Record<string, string> = {
  MRI: 'bg-indigo-100 text-indigo-700',
  CT: 'bg-blue-100 text-blue-700',
  'X-Ray': 'bg-slate-100 text-slate-600',
  USS: 'bg-teal-100 text-teal-700',
  MAMMO: 'bg-rose-100 text-rose-700',
  PET: 'bg-amber-100 text-amber-700',
  ECHO: 'bg-purple-100 text-purple-700',
};

export default function LabRadDashboard({ onNavigate }: Props) {
  const timer = useCriticalTimer(44 * 60 + 12);
  const [notifying, setNotifying] = useState(false);
  const [notified, setNotified] = useState(false);

  function handleNotify() {
    setNotifying(true);
    setTimeout(() => { setNotifying(false); setNotified(true); }, 1500);
  }

  const scanning = mockStudies.filter(s => s.status === 'Scanning');
  const reportPending = mockStudies.filter(s => s.status === 'Scan Complete');
  const scheduled = mockStudies.filter(s => s.status === 'Scheduled');

  return (
    <div className="flex flex-col gap-4 p-5 bg-slate-50 min-h-full">

      {!notified && (
        <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 flex gap-4 items-start animate-pulse shadow-sm">
          <div className="animate-pulse shrink-0 mt-1">
            <AlertOctagon size={32} className="text-red-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-bold text-red-700 text-sm uppercase tracking-wide">🔴 CRITICAL VALUE — UNNOTIFIED</span>
              <span className="text-red-500 text-xs">DHA requires notification within 60 minutes</span>
              <span className="font-mono font-bold text-red-600 text-lg ml-auto">{timer}</span>
            </div>
            <div className="flex flex-wrap gap-6 items-center">
              <div>
                <div className="text-slate-600 text-xs">Patient</div>
                <div className="font-semibold text-slate-800 text-sm">Ibrahim Al Marzouqi · 55M</div>
              </div>
              <div>
                <div className="text-slate-600 text-xs">Test</div>
                <div className="font-semibold text-slate-800 text-sm">Potassium (K+)</div>
              </div>
              <div>
                <div className="text-slate-600 text-xs">Value</div>
                <div className="font-mono font-bold text-red-700 text-3xl">6.8 <span className="text-base font-semibold">mEq/L</span></div>
                <div className="text-red-600 text-xs font-semibold">CRITICAL HIGH ↑↑</div>
              </div>
              <div>
                <div className="text-slate-600 text-xs">Reference</div>
                <div className="font-mono text-slate-500 text-sm">3.5–5.0 mEq/L</div>
              </div>
              <div>
                <div className="text-slate-600 text-xs">Doctor</div>
                <div className="font-semibold text-slate-800 text-sm">Dr. Maryam Al Sayed · Al Zahra Clinic</div>
              </div>
              <div>
                <div className="text-slate-600 text-xs">Resulted</div>
                <div className="font-mono text-slate-500 text-sm">1:52 PM · 15 min ago</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={handleNotify}
              disabled={notifying}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              <Phone size={15} />
              {notifying ? 'Notifying...' : 'Notify Doctor Now'}
            </button>
            <button className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
              <MessageSquare size={15} />
              CeenAiX Alert
            </button>
          </div>
        </div>
      )}

      {notified && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle size={24} className="text-emerald-600" />
          <div>
            <span className="font-semibold text-emerald-700 text-sm">Doctor notified successfully</span>
            <span className="text-emerald-600 text-xs ml-3">Dr. Maryam Al Sayed alerted via CeenAiX · 2:07 PM</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-1.5 mb-1">
          <FlaskConical size={12} className="text-indigo-600" />
          <span className="text-indigo-600 font-bold uppercase tracking-widest" style={{ fontSize: 9 }}>LABORATORY</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: '234 Samples', sub: 'Total today', icon: <FlaskConical size={16} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: '7 Critical', sub: '1 unnotified ⚠️', icon: <AlertOctagon size={16} />, color: 'text-red-600', bg: 'bg-red-50' },
            { label: '3.2h', sub: 'Avg TAT', icon: <Clock size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: '42/47', sub: 'NABIDH submitted', icon: <Upload size={16} />, color: 'text-teal-600', bg: 'bg-teal-50' },
            { label: '4/5 QC ✅', sub: '1 in maintenance', icon: <CheckCircle size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 p-3 flex items-center gap-3 shadow-sm">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.bg} ${c.color}`}>
                {c.icon}
              </div>
              <div>
                <div className={`font-bold text-sm ${c.color}`} style={{ fontFamily: 'DM Mono, monospace' }}>{c.label}</div>
                <div className="text-slate-500" style={{ fontSize: 10 }}>{c.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 mt-3 mb-1">
          <Scan size={12} className="text-blue-700" />
          <span className="text-blue-700 font-bold uppercase tracking-widest" style={{ fontSize: 9 }}>RADIOLOGY</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: '47 Studies', sub: 'Total today', icon: <Scan size={16} />, color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: '3 Scanning', sub: 'Active now', icon: <Activity size={16} />, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: '9 Reports', sub: 'Pending sign-off', icon: <BarChart2 size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: '7 Scheduled', sub: 'Today remaining', icon: <Clock size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: '2 Issues ⚠️', sub: 'Equipment alerts', icon: <Cpu size={16} />, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 p-3 flex items-center gap-3 shadow-sm">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.bg} ${c.color}`}>
                {c.icon}
              </div>
              <div>
                <div className={`font-bold text-sm ${c.color}`} style={{ fontFamily: 'DM Mono, monospace' }}>{c.label}</div>
                <div className="text-slate-500" style={{ fontSize: 10 }}>{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-5 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="border-t-4 border-indigo-500 px-4 pt-3 pb-2 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FlaskConical size={14} className="text-indigo-600" /> Lab Queue
              </div>
              <div className="text-slate-400 text-xs">234 samples · 45 active</div>
            </div>
            <button onClick={() => onNavigate('queue')} className="text-indigo-600 text-xs flex items-center gap-1 hover:underline">
              View All <ChevronRight size={12} />
            </button>
          </div>

          <div className="px-4 pb-2">
            <div className="flex gap-1 mb-3">
              {['All', 'STAT (2)', 'Urgent (8)', 'Routine'].map((p, i) => (
                <button key={i} className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${i === 0 ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-500 hover:border-indigo-300'}`}>
                  {p}
                </button>
              ))}
            </div>
            <div className="relative mb-3">
              <input
                placeholder="▐ Scan barcode or type sample ID..."
                className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-slate-50 focus:outline-none focus:border-indigo-400"
                style={{ fontFamily: 'DM Mono, monospace' }}
              />
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {mockSamples.slice(0, 5).map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50 ${
                  s.isCritical ? 'bg-red-50 border-l-4 border-red-500' :
                  s.priority === 'Urgent' ? 'border-l-4 border-amber-400' :
                  'border-l-4 border-transparent'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600">{s.id.split('-').pop()}</span>
                    <span className="font-semibold text-slate-800 text-xs truncate">{s.patientName}</span>
                    <span className="text-slate-400 text-xs">· {s.patientAge}{s.patientGender}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-1.5 py-0.5 rounded font-medium">{s.tests.length} tests</span>
                    <span className="text-slate-400 text-xs truncate">{s.tests.slice(0, 3).join(' · ')}</span>
                  </div>
                  {s.isCritical && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-red-600 font-mono text-xs font-bold">{s.criticalValue}</span>
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    s.status === 'Resulted' && s.isCritical ? 'bg-red-100 text-red-700 animate-pulse' :
                    s.status === 'Received' ? 'bg-blue-100 text-blue-700' :
                    s.status === 'In Progress' ? 'bg-violet-100 text-violet-700' :
                    s.status === 'Verified' ? 'bg-teal-100 text-teal-700' :
                    s.status === 'Released' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-amber-100 text-amber-700'
                  }`} style={{ fontSize: 9 }}>
                    {s.status}
                  </div>
                  {s.isCritical ? (
                    <button className="mt-1 bg-red-600 text-white text-xs px-2 py-1 rounded-lg hover:bg-red-700 transition-colors w-full">
                      📞 Notify
                    </button>
                  ) : (
                    <button className="mt-1 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-lg hover:bg-indigo-200 transition-colors w-full">
                      {s.status === 'Received' ? '▶ Process' : s.status === 'Resulted' ? '✅ Verify' : '📋 View'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 text-center">
            <button onClick={() => onNavigate('queue')} className="text-indigo-600 text-xs hover:underline">
              7 more samples · View all in queue →
            </button>
          </div>
        </div>

        <div className="col-span-5 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="border-t-4 border-blue-600 px-4 pt-3 pb-2 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Scan size={14} className="text-blue-600" /> Imaging Queue
              </div>
              <div className="text-slate-400 text-xs">47 studies · 3 scanning</div>
            </div>
            <button onClick={() => onNavigate('imaging-queue')} className="text-blue-600 text-xs flex items-center gap-1 hover:underline">
              View All <ChevronRight size={12} />
            </button>
          </div>
          <div className="px-4 pb-2">
            <div className="flex gap-1 flex-wrap mb-2">
              {['All ●', 'MRI', 'CT', 'USS', 'X-Ray', 'Other'].map((m, i) => (
                <button key={i} className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${i === 0 ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-500 hover:border-blue-300'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="px-3 py-2">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-violet-700 font-semibold uppercase tracking-wide" style={{ fontSize: 9 }}>ACTIVE NOW</span>
            </div>
            {scanning.map((s) => (
              <div key={s.accession} className="bg-violet-50 border border-violet-200 rounded-lg p-3 mb-2">
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <ScanProgressRing progress={s.progress || 0} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-mono text-xs font-bold text-violet-700">{s.progress}%</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${modalityColor[s.modality]}`}>{s.modality}</span>
                      <span className="font-semibold text-slate-800 text-xs">{s.patientName}</span>
                      <span className="text-slate-400 text-xs">· {s.patientAge}{s.patientGender}</span>
                    </div>
                    <div className="text-slate-600 text-xs">{s.studyName}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{s.room}</div>
                    <div className="mt-1.5 bg-violet-200 rounded-full h-1">
                      <div className="bg-violet-600 h-1 rounded-full transition-all" style={{ width: `${s.progress}%` }} />
                    </div>
                    <div className="text-violet-700 text-xs mt-1 font-medium">{s.eta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-3 pb-2">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-amber-600 font-semibold uppercase tracking-wide" style={{ fontSize: 9 }}>REPORT PENDING ({reportPending.length})</span>
            </div>
            {reportPending.map((s) => (
              <div key={s.accession} className="flex items-center gap-3 bg-amber-50 rounded-lg p-2.5 mb-1.5">
                <span className={`text-xs px-1.5 py-0.5 rounded font-bold shrink-0 ${modalityColor[s.modality]}`}>{s.modality}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-700 text-xs">{s.patientName}</div>
                  <div className="text-slate-500 text-xs">{s.studyName}</div>
                </div>
                <span className={`font-mono text-xs font-bold ${s.tat && parseFloat(s.tat) > 4 ? 'text-red-600' : 'text-amber-600'}`}>
                  {s.tat} {s.tat && parseFloat(s.tat) > 4 ? '🔴 OVERDUE' : '⚠️'}
                </span>
              </div>
            ))}
            <button onClick={() => onNavigate('imaging-queue')} className="text-blue-600 text-xs hover:underline">
              7 more collapsed · View All →
            </button>
          </div>

          <div className="px-3 py-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-blue-600 font-semibold uppercase tracking-wide" style={{ fontSize: 9 }}>SCHEDULED ({scheduled.length})</span>
            </div>
            {scheduled.map((s) => (
              <div key={s.accession} className="flex items-center gap-2 mb-1.5">
                <span className={`text-xs px-1.5 py-0.5 rounded font-bold shrink-0 ${modalityColor[s.modality]}`}>{s.modality}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-700 text-xs font-medium truncate">{s.patientName}</div>
                  {s.alerts && s.alerts.length > 0 && (
                    <div className="text-amber-600 text-xs">⚠️ {s.alerts[0]}</div>
                  )}
                </div>
                <span className="font-mono text-blue-600 text-xs font-bold shrink-0">{s.scheduledTime}</span>
              </div>
            ))}
          </div>

          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex gap-4 text-xs text-slate-500" style={{ fontFamily: 'DM Mono, monospace' }}>
            <span>MRI 12</span><span>CT 10</span><span>USS 8</span><span>XR 14</span><span>Other 3</span>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-3">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
            <div className="font-semibold text-slate-700 text-xs mb-2 flex items-center gap-1.5">
              <Cpu size={12} className="text-blue-600" /> Equipment
            </div>
            <div className="text-blue-700 font-bold text-xs mb-1.5 uppercase tracking-widest" style={{ fontSize: 9 }}>🩻 RADIOLOGY</div>
            {[
              { name: 'MRI 3T', status: '🔄 Scanning', color: 'text-violet-600' },
              { name: 'MRI 1.5T', status: '✅ Online', color: 'text-emerald-600' },
              { name: 'CT 256', status: '🔄 Scanning', color: 'text-violet-600' },
              { name: 'CT 64', status: '✅ Online', color: 'text-emerald-600' },
              { name: 'USS', status: '5/6 available', color: 'text-teal-600' },
              { name: 'X-Ray', status: '2/3 (QA)', color: 'text-amber-600' },
              { name: 'PET-CT', status: '⏰ 3:30 PM', color: 'text-blue-600' },
            ].map((e, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-0.5">
                <span className="text-slate-600">{e.name}</span>
                <span className={`font-medium ${e.color}`} style={{ fontSize: 9 }}>{e.status}</span>
              </div>
            ))}
            <hr className="my-2 border-slate-100" />
            <div className="text-indigo-700 font-bold text-xs mb-1.5 uppercase tracking-widest" style={{ fontSize: 9 }}>🧪 LABORATORY</div>
            {[
              { name: 'Cobas 6000', status: '🔄 ~45 min', color: 'text-violet-600' },
              { name: 'XN-3000', status: '✅ 8 queued', color: 'text-emerald-600' },
              { name: 'BCS XP', status: '⚠️ Maintenance', color: 'text-amber-600' },
              { name: 'CA-600', status: '🔄 Backup', color: 'text-teal-600' },
            ].map((e, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-0.5">
                <span className="text-slate-600">{e.name}</span>
                <span className={`font-medium ${e.color}`} style={{ fontSize: 9 }}>{e.status}</span>
              </div>
            ))}
            <button onClick={() => onNavigate('equipment')} className="mt-2 text-indigo-600 text-xs hover:underline w-full text-center">
              View All Equipment →
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
            <div className="font-semibold text-slate-700 text-xs mb-2 flex items-center gap-1.5">
              <TrendingUp size={12} className="text-indigo-600" /> TAT Monitor
            </div>
            <ResponsiveContainer width="100%" height={110}>
              <BarChart data={tatChartData} barSize={6} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 8, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 8, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
                <Bar dataKey="lab" fill="#4F46E5" name="Lab" radius={[2, 2, 0, 0]} />
                <Bar dataKey="radiology" fill="#1D4ED8" name="Radiology" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-amber-600 text-xs mt-1">⚠️ MRI report TAT 4.8h vs 4h target</div>
            <div className="text-emerald-600 text-xs">⭐ Troponin STAT: 17 min</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
            <div className="font-semibold text-slate-700 text-xs mb-1 flex items-center gap-1.5">
              🇦🇪 NABIDH HIE · FHIR R4
            </div>
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw size={10} className="text-emerald-500 animate-spin" />
              <span className="text-emerald-600 text-xs">Connected · synced 12s ago</span>
            </div>
            <div className="space-y-1.5 mb-2">
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-indigo-600">🧪 Lab 42/47</span>
                  <span className="font-mono text-slate-500" style={{ fontSize: 9 }}>89%</span>
                </div>
                <div className="bg-slate-100 rounded-full h-1.5">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '89%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-blue-600">🩻 Radiology 25/28</span>
                  <span className="font-mono text-slate-500" style={{ fontSize: 9 }}>89%</span>
                </div>
                <div className="bg-slate-100 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '89%' }} />
                </div>
              </div>
            </div>
            <div className="text-slate-600 text-xs mb-2">Total: 67/75 · 8 pending</div>
            <button onClick={() => onNavigate('nabidh')} className="w-full bg-violet-600 text-white text-xs py-1.5 rounded-lg hover:bg-violet-700 transition-colors font-medium">
              📤 Submit All Pending
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
            <div className="font-semibold text-slate-700 text-xs mb-2 flex items-center gap-1.5">
              <Activity size={12} /> Volume Today
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={volumeData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="labGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="radGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 7, fill: '#94a3b8' }} />
                <Area type="monotone" dataKey="lab" stroke="#4F46E5" fill="url(#labGrad)" strokeWidth={1.5} dot={false} />
                <Area type="monotone" dataKey="radiology" stroke="#1D4ED8" fill="url(#radGrad)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="text-slate-500 text-xs mt-1">234 lab + 47 radiology = 281 total</div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock size={12} className="text-amber-600" />
              <span className="font-semibold text-amber-700 text-xs">Day shift ends in 53 min</span>
            </div>
            <div className="space-y-0.5 text-xs mb-2">
              <div className="text-amber-700">Lab: ⚠️ 1 critical · 14 pending · 5 NABIDH</div>
              <div className="text-amber-700">Radiology: ⚠️ 9 reports pending · 3 NABIDH</div>
            </div>
            <button className="w-full bg-amber-500 text-white text-xs py-1.5 rounded-lg hover:bg-amber-600 transition-colors font-medium">
              📋 Generate Handoff Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
