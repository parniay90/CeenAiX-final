import { useState } from 'react';
import { CheckSquare, X, ChevronRight, Calendar, AlertTriangle } from 'lucide-react';

const modalityColor: Record<string, string> = {
  MRI: 'bg-indigo-100 text-indigo-700',
  CT: 'bg-blue-100 text-blue-700',
  'X-Ray': 'bg-slate-100 text-slate-600',
  USS: 'bg-teal-100 text-teal-700',
  PET: 'bg-amber-100 text-amber-700',
  ECHO: 'bg-purple-100 text-purple-700',
  MAMMO: 'bg-rose-100 text-rose-700',
};

const newOrders = [
  {
    ref: 'IORD-20260407-001',
    source: 'CeenAiX ePrescription ✅',
    received: 'Today 2:05 PM',
    priority: 'Routine',
    patient: 'Aisha Mohammed Al Reem',
    age: '42F', bloodType: 'O-',
    insurance: 'AXA Gulf Standard',
    doctor: 'Dr. Ahmed Al Rashidi',
    specialty: 'Cardiologist',
    clinic: 'Al Noor Medical Center',
    dha: 'DHA-PRAC-2018-047821',
    note: 'Assess cardiac function in HFrEF. Previous echo Oct 2025 showed EF 38%.',
    modality: 'ECHO',
    study: '2D TTE Echocardiogram',
    icd10: 'I50.9 — Heart Failure',
    cpt: '93306',
    contrast: 'No',
    prep: 'Fasting not required',
    availability: '4 of 6 rooms available ✅',
    slots: ['Today 4:00 PM', 'Tomorrow 9:00 AM'],
    preAuth: 'AXA Gulf — Pre-auth required ⚠️',
    coverage: '80% covered pending pre-auth',
  },
  {
    ref: 'IORD-20260407-002',
    source: 'CeenAiX ePrescription ✅',
    received: 'Today 1:50 PM',
    priority: 'Urgent',
    patient: 'Mohammed Al Rasheed',
    age: '63M', bloodType: 'A+',
    insurance: 'Thiqa',
    doctor: 'Dr. Amira Al Nabulsi',
    specialty: 'Oncologist',
    clinic: 'Dubai Hospital',
    dha: 'DHA-PRAC-2017-019234',
    note: 'Staging PET-CT for newly diagnosed lung malignancy. Recent biopsy: NSCLC adenocarcinoma.',
    modality: 'PET',
    study: 'PET-CT Full Body',
    icd10: 'C34.9 — Malignant neoplasm of bronchus and lung',
    cpt: '78816',
    contrast: 'FDG (radiopharmaceutical)',
    prep: 'Fasting 4–6 hours. Blood glucose < 11 mmol/L required.',
    availability: 'PET-CT scheduled 3:30 PM ✅',
    slots: ['Today 3:30 PM'],
    preAuth: 'Thiqa — Pre-auth required ⚠️',
    coverage: '100% covered subject to approval',
  },
  {
    ref: 'IORD-20260407-003',
    source: 'Walk-in',
    received: 'Today 1:35 PM',
    priority: 'Routine',
    patient: 'Salem Al Mazrouei',
    age: '29M', bloodType: 'O+',
    insurance: 'Daman',
    doctor: 'Dr. Hassan Al Ali',
    specialty: 'GP',
    clinic: 'Walk-in',
    dha: 'DHA-PRAC-2022-062811',
    note: 'Productive cough 2 weeks. Rule out pneumonia or TB.',
    modality: 'X-Ray',
    study: 'Chest X-Ray (PA + Lateral)',
    icd10: 'R05 — Cough',
    cpt: '71046',
    contrast: 'No',
    prep: 'Remove metal objects from chest',
    availability: '2 of 3 X-Ray rooms available ✅',
    slots: ['Today 2:30 PM', 'Today 2:45 PM'],
    preAuth: 'Not required ✅',
    coverage: 'Covered by Daman',
  },
];

const tabs = ['📬 New (3)', '⏳ Scheduled (7)', '🔄 Active (3)', '✅ Completed (28)', '❌ Rejected (1)', 'All (47)'];

export default function ImagingOrders() {
  const [activeTab, setActiveTab] = useState(0);
  const [accepted, setAccepted] = useState<string[]>([]);
  const [showSlots, setShowSlots] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-5 py-2.5">
        <div className="text-xs text-slate-500 mb-2">
          <span className="font-medium text-slate-700">Lab & Radiology Portal</span>
          <ChevronRight size={10} className="inline mx-1" />
          <span>Radiology</span>
          <ChevronRight size={10} className="inline mx-1" />
          <span className="text-blue-700 font-medium">Imaging Orders</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle size={14} className="text-amber-600" />
            <span className="text-amber-700 font-semibold">2 studies awaiting insurance pre-authorization</span>
          </div>
          <button className="text-amber-700 text-xs hover:underline font-medium">View Pre-Auth Tracker →</button>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200 px-5 flex gap-1">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
              activeTab === i ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {activeTab === 0 && newOrders.map(order => (
          <div key={order.ref} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${accepted.includes(order.ref) ? 'border-emerald-300' : 'border-blue-200'}`}>
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3">
              <span className="font-mono font-bold text-blue-600 text-sm">{order.ref}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                order.priority === 'Urgent' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {order.priority}
              </span>
              <span className="text-slate-400 text-xs">{order.received}</span>
              <span className="text-emerald-600 text-xs font-medium">{order.source}</span>
              {accepted.includes(order.ref) && (
                <span className="ml-auto text-emerald-600 text-xs font-semibold flex items-center gap-1">
                  <CheckSquare size={12} /> Accepted & Scheduled
                </span>
              )}
            </div>

            <div className="px-5 py-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold" style={{ fontSize: 9 }}>Patient</div>
                <div className="font-bold text-slate-800 text-sm">{order.patient}</div>
                <div className="font-mono text-slate-500 text-xs">{order.age} · {order.bloodType}</div>
                <span className="bg-blue-50 text-blue-700 text-xs px-1.5 py-0.5 rounded mt-1 inline-block">{order.insurance}</span>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold" style={{ fontSize: 9 }}>Doctor</div>
                <div className="font-bold text-slate-800 text-sm">{order.doctor}</div>
                <div className="text-slate-500 text-xs">{order.specialty} · {order.clinic}</div>
                <div className="font-mono text-emerald-600 text-xs">DHA: {order.dha} ✅</div>
              </div>
            </div>

            {order.note && (
              <div className="mx-5 mb-3 bg-blue-50 rounded-lg p-3 text-xs text-blue-800">
                <span className="font-semibold text-blue-700">Clinical Indication: </span>{order.note}
              </div>
            )}

            <div className="px-5 mb-3">
              <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                <span className={`text-sm px-2 py-1 rounded font-bold ${modalityColor[order.modality]}`}>{order.modality}</span>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-sm">{order.study}</div>
                  <div className="flex gap-4 mt-1 text-xs">
                    <span className="font-mono text-slate-500">{order.icd10}</span>
                    <span className="font-mono text-slate-500">CPT: {order.cpt}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-slate-600">
                <span><span className="font-semibold">Contrast: </span>{order.contrast}</span>
                <span><span className="font-semibold">Prep: </span>{order.prep}</span>
                <span><span className="font-semibold">Priority: </span>{order.priority}</span>
              </div>
            </div>

            <div className="mx-5 mb-3 bg-slate-50 rounded-lg p-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckSquare size={12} /> {order.availability}
              </div>
              <div className="mt-1 text-slate-600">Suggested: {order.slots.join(' or ')}</div>
            </div>

            <div className="px-5 mb-3 flex items-center gap-3 text-xs">
              <AlertTriangle size={12} className={order.preAuth.includes('required') ? 'text-amber-500' : 'text-emerald-500'} />
              <span className="font-semibold text-slate-600">Pre-auth:</span>
              <span className={order.preAuth.includes('required') ? 'text-amber-700 font-semibold' : 'text-emerald-600'}>{order.preAuth}</span>
              <span className="text-slate-500">{order.coverage}</span>
              {order.preAuth.includes('required') && (
                <button className="ml-auto bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-medium hover:bg-amber-200 transition-colors">
                  📋 Request Pre-Auth
                </button>
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2">
              {!accepted.includes(order.ref) ? (
                <button
                  onClick={() => { setAccepted(prev => [...prev, order.ref]); setShowSlots(order.ref); }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Calendar size={12} /> Accept & Schedule
                </button>
              ) : (
                <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                  <CheckSquare size={12} /> Scheduled · Confirmation sent to doctor & patient
                </span>
              )}
              <button className="flex items-center gap-1.5 border border-red-200 text-red-500 px-3 py-2 rounded-lg text-xs hover:bg-red-50 transition-colors ml-auto">
                <X size={12} /> Reject
              </button>
            </div>

            {showSlots === order.ref && !accepted.includes(order.ref) && (
              <div className="mx-5 mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                <div className="font-semibold text-blue-700 mb-2">Select Time Slot</div>
                <div className="flex gap-2">
                  {order.slots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setShowSlots(null)}
                      className="px-3 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {activeTab !== 0 && (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">🩻</div>
            <div className="font-semibold text-slate-600 mb-1">{tabs[activeTab].replace(/[📬⏳🔄✅❌]/g, '').trim()}</div>
            <div className="text-sm">Filter results to view imaging orders in this category.</div>
          </div>
        )}
      </div>
    </div>
  );
}
