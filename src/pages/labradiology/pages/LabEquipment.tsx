import { ChevronRight, AlertTriangle, Phone } from 'lucide-react';

const analyzers = [
  {
    name: 'Roche Cobas 6000',
    type: 'Chemistry Analyzer',
    dept: 'Chemistry',
    status: 'RUNNING',
    currentRun: '12 samples in current batch · Lipid panels',
    progress: 62,
    eta: '~45 min remaining',
    qcLot: 'QC-2026-CH-044',
    qcStatus: '✅ PASS 6:00 AM',
    reagents: [
      { name: 'Cholesterol', level: 67, ok: true },
      { name: 'Glucose', level: 45, ok: false },
      { name: 'Triglycerides', level: 38, ok: false },
    ],
    maintenanceDue: '15 Apr 2026 (8 days)',
  },
  {
    name: 'Roche Cobas 8000',
    type: 'Immunoassay / Hormones Analyzer',
    dept: 'Immunology & Hormones',
    status: 'ONLINE',
    currentRun: 'Queue: 4 samples pending',
    qcLot: 'QC-2026-IM-021',
    qcStatus: '✅ PASS 6:30 AM',
    reagents: [
      { name: 'TSH reagent', level: 72, ok: true },
      { name: 'FT4 reagent', level: 58, ok: true },
      { name: 'Cortisol', level: 81, ok: true },
    ],
    maintenanceDue: '22 Apr 2026 (15 days)',
  },
  {
    name: 'Sysmex XN-3000',
    type: 'Haematology Analyser',
    dept: 'Haematology',
    status: 'ONLINE',
    currentRun: 'Queue: 8 CBCs pending',
    qcLot: 'QC-2026-HM-038',
    qcStatus: '✅ PASS 6:15 AM',
    reagents: [
      { name: 'CELL PACK DFL', level: 82, ok: true },
      { name: 'SE-PACK', level: 71, ok: true },
      { name: 'LYSERCELL WDF', level: 64, ok: true },
    ],
    maintenanceDue: '30 Apr 2026 (23 days)',
  },
  {
    name: 'Siemens BCS XP',
    type: 'Coagulation Analyser',
    dept: 'Coagulation',
    status: 'MAINTENANCE',
    maintenanceReason: 'Daily maintenance + ISI calibration',
    maintenanceSince: '1:30 PM',
    maintenanceEta: '3:00 PM',
    maintenanceEngineer: 'Siemens Field Service · On site',
    reroute: '✅ Samples rerouted to Sysmex CA-600',
    qcLot: 'N/A',
    qcStatus: '⚠️ No QC run — under maintenance',
    reagents: [],
    maintenanceDue: 'ETA: 3:00 PM',
  },
  {
    name: 'Sysmex CA-600',
    type: 'Coagulation Analyser (Backup)',
    dept: 'Coagulation',
    status: 'RUNNING',
    currentRun: 'Handling diverted BCS XP samples',
    progress: 45,
    eta: 'Ongoing',
    qcLot: 'QC-2026-CO-009',
    qcStatus: '✅ Recalibrated 1:30 PM · PASS',
    reagents: [
      { name: 'PT reagent', level: 76, ok: true },
      { name: 'aPTT reagent', level: 68, ok: true },
    ],
    maintenanceDue: '18 Apr 2026 (11 days)',
  },
  {
    name: 'BioMerieux VITEK 2',
    type: 'Microbiology Identification System',
    dept: 'Microbiology',
    status: 'ONLINE',
    currentRun: '7 active cultures — 48–72h cycles',
    qcLot: 'QC-2026-MC-017',
    qcStatus: '✅ PASS · Incubator: 35.0°C ✅',
    reagents: [
      { name: 'GN card', level: 83, ok: true },
      { name: 'GP card', level: 91, ok: true },
    ],
    maintenanceDue: '10 May 2026 (33 days)',
  },
  {
    name: 'Beckman AU 5800',
    type: 'Urinalysis Analyzer',
    dept: 'Urinalysis',
    status: 'ONLINE',
    currentRun: 'Queue: 3 samples',
    qcLot: 'QC-2026-UR-011',
    qcStatus: '✅ PASS 6:45 AM',
    reagents: [
      { name: 'Urisys reagent strips', level: 78, ok: true },
    ],
    maintenanceDue: '25 Apr 2026 (18 days)',
  },
];

const statusConfig: Record<string, { label: string; border: string; bg: string; badge: string; dot: string }> = {
  RUNNING: { label: 'RUNNING', border: 'border-teal-500', bg: 'bg-teal-50', badge: 'bg-teal-100 text-teal-700', dot: 'bg-teal-500 animate-pulse' },
  ONLINE: { label: 'ONLINE', border: 'border-emerald-500', bg: 'bg-white', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  MAINTENANCE: { label: 'MAINTENANCE', border: 'border-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
};

export default function LabEquipment() {
  const lowReagents = analyzers.flatMap(a => a.reagents.filter(r => !r.ok).map(r => ({ analyzer: a.name, ...r })));

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-5 py-2.5">
        <div className="text-xs text-slate-500">
          <span className="font-medium text-slate-700">Lab & Radiology Portal</span>
          <ChevronRight size={10} className="inline mx-1" />
          <span>Laboratory</span>
          <ChevronRight size={10} className="inline mx-1" />
          <span className="text-indigo-700 font-medium">Lab Equipment & Analyzers</span>
        </div>
      </div>

      {lowReagents.length > 0 && (
        <div className="mx-5 mt-4 bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle size={16} className="text-amber-600" />
            <div>
              <div className="font-semibold text-amber-800 text-xs">{lowReagents.length} reagents below 50% — order required:</div>
              <div className="text-amber-700 text-xs mt-0.5">
                {lowReagents.map(r => `${r.analyzer}: ${r.name} ${r.level}%`).join(' · ')}
              </div>
            </div>
          </div>
          <button className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-amber-600 transition-colors">
            📦 Generate Purchase Order
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-3 gap-4">
          {analyzers.map((eq, i) => {
            const cfg = statusConfig[eq.status] || statusConfig.ONLINE;
            return (
              <div key={i} className={`rounded-xl border-l-4 border border-slate-100 shadow-sm p-4 ${cfg.border} ${cfg.bg}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot} shrink-0`} />
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                  </div>
                  <span className="bg-slate-100 text-slate-500 text-xs px-1.5 py-0.5 rounded" style={{ fontSize: 9 }}>{eq.dept}</span>
                </div>

                <div className="font-bold text-slate-800 text-sm mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {eq.name}
                </div>
                <div className="text-slate-500 text-xs mb-3">{eq.type}</div>

                {eq.currentRun && (
                  <div className="text-xs text-slate-600 mb-2">{eq.currentRun}</div>
                )}

                {eq.progress !== undefined && (
                  <div className="mb-3">
                    <div className="bg-teal-200 rounded-full h-1.5 mb-1">
                      <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${eq.progress}%` }} />
                    </div>
                    <div className="text-teal-700 text-xs">{eq.eta}</div>
                  </div>
                )}

                {eq.status === 'MAINTENANCE' && (
                  <div className="bg-amber-100 border border-amber-200 rounded-lg p-2.5 mb-3 text-xs">
                    <div className="font-semibold text-amber-800">⚠️ UNDER MAINTENANCE</div>
                    <div className="text-amber-700">Since: {eq.maintenanceSince} · ETA: {eq.maintenanceEta}</div>
                    <div className="text-amber-700">Reason: {eq.maintenanceReason}</div>
                    <div className="text-emerald-700 mt-1">{eq.reroute}</div>
                    <div className="text-amber-700">Engineer: {eq.maintenanceEngineer}</div>
                  </div>
                )}

                <div className="text-xs mb-2">
                  <div className="font-semibold text-slate-500 uppercase tracking-wider mb-1" style={{ fontSize: 9 }}>QC</div>
                  <div className="font-mono text-slate-500" style={{ fontSize: 9 }}>{eq.qcLot}</div>
                  <div className={`text-xs ${eq.qcStatus.includes('⚠️') ? 'text-amber-600' : 'text-emerald-600'}`}>{eq.qcStatus}</div>
                </div>

                {eq.reagents.length > 0 && (
                  <div className="mb-2">
                    <div className="font-semibold text-slate-500 uppercase tracking-wider mb-1" style={{ fontSize: 9 }}>REAGENT LEVELS</div>
                    {eq.reagents.map((r, j) => (
                      <div key={j} className="flex items-center gap-2 mb-1">
                        <span className="text-slate-600 text-xs flex-1 truncate">{r.name}</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${r.ok ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${r.level}%` }}
                          />
                        </div>
                        <span className={`font-mono text-xs font-bold w-8 text-right ${r.ok ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {r.level}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-slate-400 text-xs mb-3">
                  Maintenance due: <span className="font-medium">{eq.maintenanceDue}</span>
                </div>

                <div className="flex gap-1.5">
                  <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-1.5 rounded-lg text-xs hover:bg-slate-50 transition-colors">
                    📊 Stats
                  </button>
                  <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-1.5 rounded-lg text-xs hover:bg-slate-50 transition-colors">
                    ⚙️ Log Maintenance
                  </button>
                  <button className="p-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors">
                    <Phone size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
