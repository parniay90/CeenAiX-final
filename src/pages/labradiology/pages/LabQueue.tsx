import { useState } from 'react';
import {
  Search, ScanLine, Download, Upload, Filter, ChevronRight,
  X, MoreVertical, Play, CheckSquare, FileText, Send
} from 'lucide-react';
import { mockSamples } from '../mockData';
import type { LabSample } from '../types';

const statusColors: Record<string, string> = {
  'Received': 'bg-blue-100 text-blue-700',
  'Accessioned': 'bg-indigo-100 text-indigo-700',
  'In Progress': 'bg-violet-100 text-violet-700',
  'Resulted': 'bg-amber-100 text-amber-700',
  'Pending Verify': 'bg-orange-100 text-orange-700',
  'Verified': 'bg-teal-100 text-teal-700',
  'Released': 'bg-emerald-100 text-emerald-700',
  'NABIDH Submitted': 'bg-emerald-100 text-emerald-700',
};

function SampleDetailPanel({ sample, onClose }: { sample: LabSample; onClose: () => void }) {
  const stages = ['Received', 'Accessioned', 'In Progress', 'Resulted', 'Verified', 'Released', 'NABIDH Submitted'];
  const currentIdx = stages.indexOf(sample.status);

  return (
    <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full overflow-y-auto">
      <div className="bg-indigo-700 px-4 py-4 flex items-start justify-between">
        <div>
          <div className="text-white font-bold text-sm" style={{ fontFamily: 'DM Mono, monospace' }}>
            {sample.id}
          </div>
          <div className="text-indigo-200 text-xs mt-0.5">{sample.patientName} · {sample.patientAge}{sample.patientGender}</div>
        </div>
        <button onClick={onClose} className="text-indigo-200 hover:text-white">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-slate-400 mb-0.5">Blood Type</div>
            <div className="font-semibold text-slate-700">{sample.bloodType}</div>
          </div>
          <div>
            <div className="text-slate-400 mb-0.5">Insurance</div>
            <div className="font-semibold text-slate-700">{sample.insurance}</div>
          </div>
          <div>
            <div className="text-slate-400 mb-0.5">Doctor</div>
            <div className="font-semibold text-slate-700">{sample.doctor}</div>
          </div>
          <div>
            <div className="text-slate-400 mb-0.5">Clinic</div>
            <div className="font-semibold text-slate-700">{sample.clinic}</div>
          </div>
          <div>
            <div className="text-slate-400 mb-0.5">Collected</div>
            <div className="font-mono text-slate-700">{sample.collectedAt}</div>
          </div>
          <div>
            <div className="text-slate-400 mb-0.5">Received</div>
            <div className="font-mono text-slate-700">{sample.receivedAt}</div>
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">Pipeline</div>
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {stages.map((stage, i) => (
              <div key={stage} className="flex items-center gap-1">
                <div className={`flex flex-col items-center`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < currentIdx ? 'bg-indigo-600 text-white' :
                    i === currentIdx ? 'bg-indigo-200 text-indigo-700 ring-2 ring-indigo-400' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {i < currentIdx ? '✓' : i + 1}
                  </div>
                  <div className="text-slate-500 mt-0.5" style={{ fontSize: 7 }}>{stage.split(' ')[0]}</div>
                </div>
                {i < stages.length - 1 && (
                  <div className={`w-4 h-px mt-[-12px] ${i < currentIdx ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">Tests Ordered</div>
          <div className="space-y-1.5">
            {sample.tests.map((test, i) => (
              <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                sample.isCritical && i === 0 ? 'bg-red-50 border border-red-200' : 'bg-slate-50'
              }`}>
                <div>
                  <div className="font-medium text-slate-700 text-xs">{test}</div>
                  <div className="text-slate-400" style={{ fontSize: 9 }}>LOINC: {['2823-3', '2951-2', '2075-0', '1963-8'][i % 4]}</div>
                </div>
                <div className="text-xs">
                  {sample.isCritical && i === 0 ? (
                    <span className="text-red-600 font-mono font-bold">6.8 ↑↑</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {sample.doctor && (
          <div className="bg-blue-50 rounded-lg p-3 text-xs">
            <div className="font-semibold text-blue-700 mb-1">Clinical Notes</div>
            <div className="text-blue-800">K+ monitoring critical — patient on RAAS therapy (Enalapril + Spironolactone). Flag if K+ &gt; 5.0.</div>
          </div>
        )}

        <div className="bg-slate-50 rounded-lg p-3 text-xs">
          <div className="font-semibold text-slate-600 mb-1 uppercase tracking-wider" style={{ fontSize: 9 }}>Previous Values — NABIDH</div>
          <div className="grid grid-cols-2 gap-1.5">
            {[['K+', '4.2 mEq/L ✅'], ['Na+', '138 mmol/L ✅'], ['Creatinine', '82 µmol/L ✅'], ['eGFR', '84 ✅']].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-slate-500">{k}</span>
                <span className="font-mono text-slate-700">{v}</span>
              </div>
            ))}
          </div>
          <div className="text-slate-400 mt-1" style={{ fontSize: 9 }}>Last results: 15 Jan 2026</div>
        </div>
      </div>

      <div className="mt-auto p-4 space-y-2 border-t border-slate-100">
        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
          <Play size={12} /> Begin Processing
        </button>
        <button className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
          <Send size={12} /> Message {sample.doctor}
        </button>
        <button className="w-full bg-amber-50 text-amber-700 py-2 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors">
          ⏸ Put on Hold
        </button>
        <button className="w-full border border-red-200 text-red-500 py-2 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors">
          ❌ Reject Sample
        </button>
      </div>
    </div>
  );
}

export default function LabQueue() {
  const [selectedSample, setSelectedSample] = useState<LabSample | null>(null);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilters, setStatusFilters] = useState<string[]>([
    'Received', 'Accessioned', 'In Progress', 'Resulted', 'Pending Verify', 'Verified', 'Released',
  ]);

  const priorities = ['All', 'STAT', 'Urgent', 'Routine'];
  const allStatuses = ['Received', 'Accessioned', 'In Progress', 'Resulted', 'Pending Verify', 'Verified', 'Released', 'NABIDH Submitted'];

  const filtered = mockSamples.filter(s => {
    if (priorityFilter !== 'All' && s.priority !== priorityFilter) return false;
    if (!statusFilters.includes(s.status)) return false;
    if (search && !s.patientName.toLowerCase().includes(search.toLowerCase()) && !s.id.includes(search)) return false;
    return true;
  });

  function toggleStatus(st: string) {
    setStatusFilters(prev => prev.includes(st) ? prev.filter(x => x !== st) : [...prev, st]);
  }

  return (
    <div className="flex h-full">
      <aside className="w-56 bg-white border-r border-slate-200 p-3 shrink-0 overflow-y-auto">
        <div className="relative mb-3">
          <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Sample ID, patient..."
            className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-400"
          />
        </div>
        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg text-xs font-medium mb-4 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors">
          <ScanLine size={12} /> Scan Barcode
        </button>

        <div className="mb-3">
          <div className="text-slate-400 uppercase tracking-widest text-xs mb-2 font-semibold" style={{ fontSize: 9 }}>PRIORITY</div>
          {priorities.map(p => (
            <label key={p} className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="radio"
                name="priority"
                checked={priorityFilter === p}
                onChange={() => setPriorityFilter(p)}
                className="text-indigo-600"
              />
              <span className="text-xs text-slate-600">{p}</span>
            </label>
          ))}
        </div>

        <div className="mb-3">
          <div className="text-slate-400 uppercase tracking-widest text-xs mb-2 font-semibold" style={{ fontSize: 9 }}>STATUS</div>
          {allStatuses.map(st => (
            <label key={st} className="flex items-center gap-2 py-0.5 cursor-pointer">
              <input
                type="checkbox"
                checked={statusFilters.includes(st)}
                onChange={() => toggleStatus(st)}
                className="text-indigo-600"
              />
              <span className="text-xs text-slate-600">{st}</span>
            </label>
          ))}
        </div>

        <div className="mb-4">
          <div className="text-slate-400 uppercase tracking-widest text-xs mb-2 font-semibold" style={{ fontSize: 9 }}>DEPARTMENT</div>
          {['Chemistry', 'Haematology', 'Microbiology', 'Immunology', 'Coagulation', 'Urinalysis'].map(d => (
            <label key={d} className="flex items-center gap-2 py-0.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="text-indigo-600" />
              <span className="text-xs text-slate-600">{d}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-indigo-600 text-white py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors">
            Apply
          </button>
          <button className="flex-1 border border-slate-200 text-slate-600 py-1.5 rounded-lg text-xs hover:bg-slate-50 transition-colors">
            Reset
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center gap-3">
          <div className="text-xs text-slate-500">
            <span className="text-xs font-medium text-slate-700">Lab & Radiology Portal</span>
            <ChevronRight size={10} className="inline mx-1" />
            <span>Laboratory</span>
            <ChevronRight size={10} className="inline mx-1" />
            <span className="text-indigo-700 font-medium">Queue</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
              <Download size={12} /> Import Samples
            </button>
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
              <Upload size={12} /> Bulk Release
            </button>
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
              <Download size={12} /> Export CSV
            </button>
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
              <Filter size={12} /> Advanced
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <div className="bg-slate-50 px-4 py-2 flex items-center justify-between border-b border-slate-200 sticky top-0 z-10">
              <span className="text-xs text-slate-500">Total: <strong className="text-slate-700">234 samples</strong> — showing {filtered.length}</span>
              <select className="text-xs border border-slate-200 rounded px-2 py-1 bg-white">
                <option>Show 25 per page</option>
                <option>Show 50 per page</option>
              </select>
            </div>

            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-10 z-10">
                <tr>
                  {['Sample ID', 'Patient', 'Doctor / Clinic', 'Tests', 'Priority', 'Status', 'Collection', 'TAT', 'Tech', 'Actions'].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 text-slate-500 font-semibold whitespace-nowrap cursor-pointer hover:text-slate-700" style={{ fontSize: 10 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(s => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedSample(s === selectedSample ? null : s)}
                    className={`cursor-pointer transition-colors ${
                      s.isCritical ? 'bg-red-50 hover:bg-red-100 border-l-4 border-red-500' :
                      s.priority === 'STAT' ? 'bg-red-50/40 hover:bg-red-50 border-l-4 border-red-400' :
                      s.priority === 'Urgent' ? 'bg-amber-50/40 hover:bg-amber-50 border-l-4 border-amber-400' :
                      'hover:bg-slate-50 border-l-4 border-transparent'
                    } ${selectedSample?.id === s.id ? 'ring-1 ring-indigo-400 ring-inset' : ''}`}
                    style={{ height: 64 }}
                  >
                    <td className="px-3 py-2">
                      <div className="font-mono font-bold text-indigo-600" style={{ fontSize: 11 }}>{s.id}</div>
                      <div className="text-slate-300" style={{ fontSize: 9 }}>▐▌▌▐▐▌▌▐</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-semibold text-slate-800">{s.patientName}</div>
                      <div className="font-mono text-slate-400" style={{ fontSize: 9 }}>{s.patientAge}{s.patientGender} · {s.bloodType}</div>
                      <span className="bg-blue-50 text-blue-600 rounded px-1" style={{ fontSize: 9 }}>{s.insurance}</span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-slate-700">{s.doctor}</div>
                      <div className="text-slate-400" style={{ fontSize: 10 }}>{s.clinic}</div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5 font-bold" style={{ fontSize: 10 }}>
                        {s.tests.length}
                      </span>
                      <div className="text-slate-500 mt-0.5 max-w-24 truncate" style={{ fontSize: 10 }}>{s.tests.slice(0, 2).join(' · ')}</div>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 font-bold ${
                        s.priority === 'STAT' ? 'bg-red-100 text-red-700' :
                        s.priority === 'Urgent' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-500'
                      }`} style={{ fontSize: 9 }}>
                        {s.priority === 'STAT' || s.priority === 'Urgent' ? '⚡ ' : ''}{s.priority}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 font-medium ${statusColors[s.status] || 'bg-slate-100 text-slate-600'} ${s.isCritical ? 'animate-pulse' : ''}`} style={{ fontSize: 9 }}>
                        {s.isCritical ? '⚠️ CRITICAL UNNOTIFIED' : s.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-500" style={{ fontSize: 10 }}>
                      <div>7 Apr · {s.collectedAt}</div>
                      <div style={{ fontSize: 9 }}>Rcvd: {s.receivedAt}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className={`font-mono font-bold ${
                        parseFloat(s.tat) > 4 ? 'text-red-600' :
                        parseFloat(s.tat) > 3 ? 'text-amber-600' :
                        'text-emerald-600'
                      }`} style={{ fontSize: 11 }}>{s.tat}</div>
                      <div className="text-slate-400" style={{ fontSize: 9 }}>Target: &lt;4h</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold" style={{ fontSize: 8 }}>
                          {s.tech.split(' ').map(w => w[0]).join('')}
                        </div>
                        <span className="text-slate-600" style={{ fontSize: 10 }}>{s.tech}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        {s.status === 'Received' || s.status === 'Accessioned' ? (
                          <button className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                            <Play size={10} />
                          </button>
                        ) : s.status === 'In Progress' ? (
                          <button className="p-1.5 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors">
                            <FileText size={10} />
                          </button>
                        ) : s.status === 'Resulted' || s.status === 'Pending Verify' ? (
                          <button className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                            <CheckSquare size={10} />
                          </button>
                        ) : s.status === 'Verified' ? (
                          <button className="p-1.5 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors">
                            <Upload size={10} />
                          </button>
                        ) : null}
                        <button className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                          <MoreVertical size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedSample && (
            <SampleDetailPanel sample={selectedSample} onClose={() => setSelectedSample(null)} />
          )}
        </div>
      </div>
    </div>
  );
}
