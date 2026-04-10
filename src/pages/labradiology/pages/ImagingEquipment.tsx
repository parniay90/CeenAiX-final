import { ChevronRight, AlertTriangle, Phone } from 'lucide-react';

interface Equipment {
  name: string;
  type: string;
  room: string;
  status: 'SCANNING' | 'ONLINE' | 'MAINTENANCE' | 'QA' | 'SCHEDULED' | 'OFFLINE';
  currentStudy?: string;
  progress?: number;
  eta?: string;
  todayCount: number;
  uptime: string;
  qc: string;
  details?: string;
  alert?: string;
  dose?: string;
}

const equipment: Equipment[] = [
  {
    name: 'Siemens MAGNETOM Vida 3T',
    type: 'MRI · 3 Tesla',
    room: 'MRI-2',
    status: 'SCANNING',
    currentStudy: 'Sarah Al Hamdan · Brain MRI',
    progress: 55,
    eta: '~20 min remaining',
    todayCount: 12,
    uptime: '94%',
    qc: '✅ Daily QC passed 6:00 AM',
  },
  {
    name: 'Siemens MAGNETOM Sola 1.5T',
    type: 'MRI · 1.5 Tesla',
    room: 'MRI-1',
    status: 'ONLINE',
    details: 'Queue: 1 study (Yousuf Al Zaabi, 2:30 PM)',
    todayCount: 8,
    uptime: '97%',
    qc: '✅ QC Passed 6:00 AM',
  },
  {
    name: 'Philips IQon Spectral CT 256-slice',
    type: 'CT · 256-slice',
    room: 'CT-2',
    status: 'SCANNING',
    currentStudy: 'Hassan Al Mansoori · CT Chest',
    progress: 78,
    eta: '~5 min remaining',
    todayCount: 7,
    uptime: '99%',
    qc: '✅ Passed',
    dose: 'Today avg DLP: 287 mGy·cm',
  },
  {
    name: 'Siemens SOMATOM Definition 64-slice',
    type: 'CT · 64-slice',
    room: 'CT-1',
    status: 'ONLINE',
    details: 'Queue: Mariam Al Suwaidi · 2:45 PM',
    todayCount: 3,
    uptime: '98%',
    qc: '✅ Passed · Contrast injector: Ready',
  },
  {
    name: 'Ultrasound Suite',
    type: 'Diagnostic Ultrasound',
    room: 'USS-1 to USS-6',
    status: 'ONLINE',
    details: '5 of 6 rooms available — USS-3 currently scanning (Fatima Ibrahim · Obstetric)',
    todayCount: 8,
    uptime: '100%',
    qc: '✅ All units calibrated',
  },
  {
    name: 'Mammography Unit',
    type: 'Full-field digital mammography',
    room: 'MAMMO-1',
    status: 'ONLINE',
    details: 'Next screening: 3 Jan 2027 (annual calibration)',
    todayCount: 2,
    uptime: '100%',
    qc: '✅ Within MQSA standards',
    dose: 'Within MQSA dose limits',
  },
  {
    name: 'GE Discovery MI PET-CT',
    type: 'PET-CT Hybrid',
    room: 'PET-1',
    status: 'SCHEDULED',
    details: 'Next study: Mohammed Al Rasheed · 3:30 PM',
    todayCount: 0,
    uptime: '100%',
    qc: '✅ Monthly radiation survey completed',
    alert: 'FDG injection due at 2:30 PM — 23 min away',
  },
  {
    name: 'Digital X-Ray Suite',
    type: 'DR Radiography',
    room: 'XR-1, XR-2, XR-3',
    status: 'QA',
    details: 'XR-3 in QA: Image quality phantom test · ETA 15 min. XR-1 & XR-2 online.',
    todayCount: 20,
    uptime: '96%',
    qc: '✅ Daily QA in progress',
  },
];

const statusConfig: Record<string, { label: string; border: string; bg: string; badge: string; dot: string }> = {
  SCANNING: { label: 'SCANNING', border: 'border-violet-500', bg: 'bg-violet-50', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500 animate-pulse' },
  ONLINE: { label: 'ONLINE', border: 'border-emerald-500', bg: 'bg-white', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  MAINTENANCE: { label: 'MAINTENANCE', border: 'border-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  QA: { label: 'QA IN PROGRESS', border: 'border-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  SCHEDULED: { label: 'SCHEDULED', border: 'border-blue-400', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-600', dot: 'bg-blue-400' },
  OFFLINE: { label: 'OFFLINE', border: 'border-red-500', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

export default function ImagingEquipment() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-5 py-2.5">
        <div className="text-xs text-slate-500">
          <span className="font-medium text-slate-700">Lab & Radiology Portal</span>
          <ChevronRight size={10} className="inline mx-1" />
          <span>Radiology</span>
          <ChevronRight size={10} className="inline mx-1" />
          <span className="text-blue-700 font-medium">Imaging Equipment</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-3 gap-4">
          {equipment.map((eq, i) => {
            const cfg = statusConfig[eq.status];
            return (
              <div
                key={i}
                className={`rounded-xl border-l-4 border border-slate-100 shadow-sm p-4 transition-all ${cfg.border} ${cfg.bg}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot} shrink-0`} />
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded font-mono">{eq.room}</span>
                </div>

                <div className="font-bold text-slate-800 text-sm mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {eq.name}
                </div>
                <div className="text-slate-500 text-xs mb-3">{eq.type}</div>

                {eq.currentStudy && (
                  <div className="mb-3">
                    <div className="text-xs text-slate-600 font-medium mb-1">{eq.currentStudy}</div>
                    {eq.progress !== undefined && (
                      <>
                        <div className="bg-violet-200 rounded-full h-1.5 mb-1">
                          <div className="bg-violet-600 h-1.5 rounded-full" style={{ width: `${eq.progress}%` }} />
                        </div>
                        <div className="text-violet-700 text-xs">{eq.eta}</div>
                      </>
                    )}
                  </div>
                )}

                {eq.details && (
                  <div className="text-xs text-slate-600 mb-3 bg-white/60 rounded p-2">{eq.details}</div>
                )}

                {eq.alert && (
                  <div className="bg-amber-100 border border-amber-300 rounded-lg px-2.5 py-2 mb-3 flex items-center gap-1.5">
                    <AlertTriangle size={12} className="text-amber-600 animate-pulse shrink-0" />
                    <span className="text-amber-700 text-xs font-medium">{eq.alert}</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="bg-white/60 rounded p-2 text-center">
                    <div className="font-bold text-slate-700 text-sm">{eq.todayCount}</div>
                    <div className="text-slate-400" style={{ fontSize: 9 }}>Today</div>
                  </div>
                  <div className="bg-white/60 rounded p-2 text-center">
                    <div className="font-bold text-slate-700 text-sm">{eq.uptime}</div>
                    <div className="text-slate-400" style={{ fontSize: 9 }}>Uptime</div>
                  </div>
                  <div className="bg-white/60 rounded p-2 text-center">
                    <div className="font-bold text-emerald-600 text-sm">✅</div>
                    <div className="text-slate-400" style={{ fontSize: 9 }}>QC</div>
                  </div>
                </div>

                <div className="text-emerald-600 text-xs mb-1">{eq.qc}</div>
                {eq.dose && <div className="text-slate-500 text-xs">{eq.dose}</div>}

                <div className="flex gap-1.5 mt-3">
                  <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-1.5 rounded-lg text-xs hover:bg-slate-50 transition-colors">
                    📋 Schedule
                  </button>
                  <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-1.5 rounded-lg text-xs hover:bg-slate-50 transition-colors">
                    ⚙️ Maintenance
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
