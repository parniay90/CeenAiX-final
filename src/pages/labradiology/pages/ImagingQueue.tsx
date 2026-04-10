import { useState } from 'react';
import { ChevronRight, X, FileText, MessageSquare, List, LayoutGrid } from 'lucide-react';
import { mockStudies } from '../mockData';
import type { ImagingStudy } from '../types';

const modalityColor: Record<string, string> = {
  MRI: 'bg-indigo-100 text-indigo-700',
  CT: 'bg-blue-100 text-blue-700',
  'X-Ray': 'bg-slate-100 text-slate-600',
  USS: 'bg-teal-100 text-teal-700',
  MAMMO: 'bg-rose-100 text-rose-700',
  PET: 'bg-amber-100 text-amber-700',
  ECHO: 'bg-purple-100 text-purple-700',
};

const pipelineStages = ['Ordered', 'Scheduled', 'Patient Arrived', 'Scanning', 'Scan Complete', 'Reported', 'Released'];

function StudyDetailPanel({ study, onClose }: { study: ImagingStudy; onClose: () => void }) {
  const currentIdx = pipelineStages.indexOf(study.status);

  const sequences: Record<string, string[]> = {
    MRI: ['Localizer', 'T1 axial', 'T2/FLAIR', 'DWI', 'T1 + contrast'],
    CT: ['Scout', 'Arterial phase', 'Venous phase', 'Delayed'],
    USS: ['Survey', 'BPD/FL/AC', 'Amniotic fluid', 'Placenta', 'Biophysical'],
  };

  const seqs = sequences[study.modality] || [];

  return (
    <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full overflow-y-auto">
      <div className="bg-blue-700 px-4 py-4 flex items-start justify-between">
        <div>
          <div className="text-white font-bold text-sm">Radiology Study Detail</div>
          <div className="text-blue-200 font-mono text-xs mt-0.5">{study.accession}</div>
        </div>
        <button onClick={onClose} className="text-blue-200 hover:text-white">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-slate-400 mb-0.5">Patient</div>
            <div className="font-semibold text-slate-800">{study.patientName}</div>
            <div className="text-slate-500">{study.patientAge}{study.patientGender}</div>
          </div>
          <div>
            <div className="text-slate-400 mb-0.5">Modality</div>
            <span className={`px-2 py-0.5 rounded font-bold ${modalityColor[study.modality]}`}>{study.modality}</span>
          </div>
          <div className="col-span-2">
            <div className="text-slate-400 mb-0.5">Study</div>
            <div className="font-semibold text-slate-700">{study.studyName}</div>
          </div>
          <div className="col-span-2">
            <div className="text-slate-400 mb-0.5">Doctor</div>
            <div className="font-semibold text-slate-700">{study.doctor}</div>
            <div className="text-slate-500">{study.clinic}</div>
          </div>
          <div>
            <div className="text-slate-400 mb-0.5">Room</div>
            <div className="font-semibold text-slate-700">{study.room}</div>
          </div>
          <div>
            <div className="text-slate-400 mb-0.5">Scheduled</div>
            <div className="font-mono text-blue-700 font-bold">{study.scheduledTime}</div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 text-xs">
          <div className="font-semibold text-slate-600 mb-1 uppercase tracking-wider" style={{ fontSize: 9 }}>PREVIOUS IMAGING — NABIDH</div>
          <div className="text-slate-700">Previous: CT Chest Jun 2025 · RLL nodule 6mm</div>
          <button className="text-blue-600 hover:underline mt-1">Compare Studies →</button>
        </div>

        {study.status === 'Scanning' && seqs.length > 0 && (
          <div>
            <div className="font-semibold text-slate-600 text-xs uppercase tracking-wider mb-2" style={{ fontSize: 9 }}>SCAN PROGRESS</div>
            {seqs.map((seq, i) => (
              <div key={seq} className="flex items-center gap-2 mb-1.5 text-xs">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 ${
                  i < Math.floor((study.progress || 0) / (100 / seqs.length)) ? 'bg-emerald-500' :
                  i === Math.floor((study.progress || 0) / (100 / seqs.length)) ? 'bg-violet-500 animate-pulse' :
                  'bg-slate-200'
                }`} style={{ fontSize: 8 }}>
                  {i < Math.floor((study.progress || 0) / (100 / seqs.length)) ? '✓' : i + 1}
                </div>
                <span className={
                  i < Math.floor((study.progress || 0) / (100 / seqs.length)) ? 'text-emerald-700 line-through' :
                  i === Math.floor((study.progress || 0) / (100 / seqs.length)) ? 'text-violet-700 font-medium' :
                  'text-slate-400'
                }>{seq}</span>
              </div>
            ))}
          </div>
        )}

        <div>
          <div className="font-semibold text-slate-600 text-xs uppercase tracking-wider mb-2" style={{ fontSize: 9 }}>CONSENT STATUS</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-600">✅ General consent signed</span>
            </div>
            {study.alerts && study.alerts.some(a => a.includes('Contrast consent')) ? (
              <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700">
                ⚠️ Contrast consent not obtained
                <button className="block w-full mt-1.5 bg-amber-500 text-white py-1 rounded font-medium hover:bg-amber-600 transition-colors">
                  📋 Get Consent
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-600">✅ Contrast consent signed</div>
            )}
          </div>
        </div>

        <div>
          <div className="font-semibold text-slate-600 text-xs uppercase tracking-wider mb-2" style={{ fontSize: 9 }}>PIPELINE</div>
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {pipelineStages.map((stage, i) => (
              <div key={stage} className="flex items-center gap-1">
                <div className={`flex flex-col items-center min-w-0`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    i < currentIdx ? 'bg-blue-600 text-white' :
                    i === currentIdx ? 'bg-blue-200 text-blue-700 ring-2 ring-blue-400' :
                    'bg-slate-100 text-slate-400'
                  }`} style={{ fontSize: 8 }}>
                    {i < currentIdx ? '✓' : i + 1}
                  </div>
                  <div className="text-slate-400 mt-0.5 truncate max-w-12 text-center" style={{ fontSize: 7 }}>{stage}</div>
                </div>
                {i < pipelineStages.length - 1 && (
                  <div className={`w-3 h-px mt-[-10px] shrink-0 ${i < currentIdx ? 'bg-blue-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {study.alerts && study.alerts.length > 0 && (
          <div className="space-y-1">
            {study.alerts.map((a, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-700">
                ⚠️ {a}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto p-4 space-y-2 border-t border-slate-100">
        <button className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
          <FileText size={12} /> View Full Protocol
        </button>
        {study.status === 'Scheduled' && (
          <button className="w-full bg-teal-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-teal-700 transition-colors">
            ▶ Mark Patient Arrived
          </button>
        )}
        {study.status === 'Scan Complete' && (
          <button className="w-full bg-amber-500 text-white py-2 rounded-lg text-xs font-semibold hover:bg-amber-600 transition-colors">
            📄 Open for Reporting
          </button>
        )}
        <button className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
          <MessageSquare size={12} /> Message Doctor
        </button>
        {study.status === 'Scanning' && (
          <button className="w-full border border-red-200 text-red-500 py-2 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors">
            🚨 Emergency Stop
          </button>
        )}
      </div>
    </div>
  );
}

function ScanProgress({ progress }: { progress: number }) {
  const size = 64;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (progress / 100) * circ;
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={32} cy={32} r={r} fill="none" stroke="#ede9fe" strokeWidth={5} />
        <circle cx={32} cy={32} r={r} fill="none" stroke="#7c3aed" strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-xs font-bold text-violet-700">{progress}%</span>
      </div>
    </div>
  );
}

export default function ImagingQueue() {
  const [selected, setSelected] = useState<ImagingStudy | null>(null);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [modalityFilter, setModalityFilter] = useState('All');

  const modalities = ['All', 'MRI', 'CT', 'X-Ray', 'USS', 'MAMMO', 'PET'];

  const scanning = mockStudies.filter(s => s.status === 'Scanning');
  const scanComplete = mockStudies.filter(s => s.status === 'Scan Complete');
  const scheduled = mockStudies.filter(s => s.status === 'Scheduled');
  const reported = mockStudies.filter(s => s.status === 'Reported' || s.status === 'Released');

  const filtered = modalityFilter === 'All' ? mockStudies : mockStudies.filter(s => s.modality === modalityFilter);

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-5 py-2.5">
          <div className="text-xs text-slate-500 mb-2">
            <span className="font-medium text-slate-700">Lab & Radiology Portal</span>
            <ChevronRight size={10} className="inline mx-1" />
            <span>Radiology</span>
            <ChevronRight size={10} className="inline mx-1" />
            <span className="text-blue-700 font-medium">Imaging Queue</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 text-sm">Imaging Queue — 7 April 2026</div>
              <div className="text-slate-400 text-xs">47 studies today · 3 scanning · 28 reported · 7 scheduled</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                <button onClick={() => setView('kanban')} className={`p-1.5 rounded ${view === 'kanban' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>
                  <LayoutGrid size={14} />
                </button>
                <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-b border-slate-200 px-5 py-2 flex items-center gap-2">
          <div className="flex gap-1">
            {modalities.map(m => (
              <button
                key={m}
                onClick={() => setModalityFilter(m)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  modalityFilter === m
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {m} {m === 'All' && '●'}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            {['All', 'Scanning', 'Report Pending', 'Scheduled', 'Complete'].map(s => (
              <button key={s} className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {view === 'kanban' ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-pulse" />
                  <span className="font-bold text-violet-700 text-sm uppercase tracking-wide">ACTIVE NOW</span>
                  <span className="bg-violet-100 text-violet-700 text-xs px-2 py-0.5 rounded-full font-bold">{scanning.length}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {scanning.map(s => (
                    <div
                      key={s.accession}
                      onClick={() => setSelected(s)}
                      className="bg-violet-50 border-2 border-violet-300 rounded-xl p-4 cursor-pointer hover:border-violet-400 transition-colors"
                      style={{ animation: 'pulse 2s infinite' }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${modalityColor[s.modality]}`}>{s.modality}</span>
                        <span className="font-mono text-slate-400" style={{ fontSize: 9 }}>{s.accession}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <ScanProgress progress={s.progress || 0} />
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{s.patientName}</div>
                          <div className="text-slate-500 text-xs">{s.patientAge}{s.patientGender}</div>
                        </div>
                      </div>
                      <div className="text-slate-700 text-xs font-medium mb-1">{s.studyName}</div>
                      <div className="bg-violet-200 rounded-full h-1 mb-1">
                        <div className="bg-violet-600 h-1 rounded-full" style={{ width: `${s.progress}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-violet-700 font-medium">{s.eta}</span>
                        <span className="text-slate-400">{s.room}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
                        <span className="text-violet-700 font-bold text-xs uppercase">SCANNING</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-amber-600 text-sm uppercase tracking-wide">REPORT PENDING</span>
                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">{scanComplete.length + 1}</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {scanComplete.map(s => (
                    <div
                      key={s.accession}
                      onClick={() => setSelected(s)}
                      className="bg-amber-50 border border-amber-200 rounded-xl p-3 cursor-pointer hover:border-amber-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${modalityColor[s.modality]}`}>{s.modality}</span>
                        <span className={`font-mono text-xs font-bold ${s.tat && parseFloat(s.tat) > 4 ? 'text-red-600' : 'text-amber-600'}`}>
                          {s.tat} {s.tat && parseFloat(s.tat) > 4 ? '🔴' : '⚠️'}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800 text-xs">{s.patientName}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{s.studyName}</div>
                      <div className="text-slate-400 text-xs">{s.doctor}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-blue-600 text-sm uppercase tracking-wide">SCHEDULED</span>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">{scheduled.length}</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {scheduled.map(s => (
                    <div
                      key={s.accession}
                      onClick={() => setSelected(s)}
                      className="bg-blue-50 border border-blue-200 rounded-xl p-3 cursor-pointer hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${modalityColor[s.modality]}`}>{s.modality}</span>
                        <span className="font-mono text-blue-700 font-bold text-xs">{s.scheduledTime}</span>
                      </div>
                      <div className="font-semibold text-slate-800 text-xs">{s.patientName}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{s.studyName}</div>
                      <div className="text-blue-500 text-xs mt-0.5">Patient: Not yet arrived</div>
                      {s.alerts && s.alerts.map((a, i) => (
                        <div key={i} className="text-amber-600 text-xs mt-1">⚠️ {a}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-emerald-600 text-sm uppercase tracking-wide">REPORTED / RELEASED</span>
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-bold">{reported.length}</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {reported.map(s => (
                    <div
                      key={s.accession}
                      onClick={() => setSelected(s)}
                      className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 cursor-pointer hover:border-emerald-300 transition-colors opacity-70"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${modalityColor[s.modality]}`}>{s.modality}</span>
                        <span className="text-emerald-600 text-xs">✅ {s.status}</span>
                      </div>
                      <div className="font-semibold text-slate-700 text-xs">{s.patientName}</div>
                      <div className="text-slate-400 text-xs">{s.studyName}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['Accession', 'Patient', 'Modality', 'Study', 'Doctor', 'Scheduled', 'Status', 'TAT', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-slate-500 font-semibold" style={{ fontSize: 10 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(s => (
                    <tr key={s.accession} onClick={() => setSelected(s)} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-4 py-3 font-mono text-blue-600 font-bold text-xs">{s.accession}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{s.patientName}</div>
                        <div className="text-slate-400">{s.patientAge}{s.patientGender}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${modalityColor[s.modality]}`}>{s.modality}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{s.studyName}</td>
                      <td className="px-4 py-3 text-slate-600">{s.doctor}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{s.scheduledTime}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.status === 'Scanning' ? 'bg-violet-100 text-violet-700' :
                          s.status === 'Scan Complete' ? 'bg-amber-100 text-amber-700' :
                          s.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                          s.status === 'Released' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>{s.status}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">{s.tat || '—'}</td>
                      <td className="px-4 py-3">
                        <button className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <StudyDetailPanel study={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
