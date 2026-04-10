import { useState } from 'react';
import { CheckSquare, X, Printer, Phone, ChevronRight } from 'lucide-react';

const newOrders = [
  {
    ref: 'ORD-20260407-001',
    priority: 'Urgent',
    received: 'Today 2:05 PM',
    source: 'CeenAiX ePrescription ✅',
    patient: 'Aisha Mohammed Al Reem',
    age: '42F',
    bloodType: 'O-',
    insurance: 'AXA Gulf Standard',
    doctor: 'Dr. Ahmed Al Rashidi',
    specialty: 'Cardiologist',
    clinic: 'Al Noor Medical Center',
    dha: 'DHA-PRAC-2018-047821',
    clinicalNote: 'Patient on RAAS therapy (Enalapril + Spironolactone). K+ monitoring critical. Please flag if K+ > 5.0.',
    tests: [
      { name: 'BNP (B-type Natriuretic Peptide)', loinc: '30604-8', specimen: 'Serum', priority: 'Urgent', tat: '2h' },
      { name: 'K+ (Potassium)', loinc: '2823-3', specimen: 'Serum', priority: 'Urgent', tat: '1h' },
      { name: 'Creatinine', loinc: '2160-0', specimen: 'Serum', priority: 'Urgent', tat: '1h' },
    ],
    specimen: 'Serum separator tube (SST) × 2 · EDTA × 1',
    fasting: 'Not required',
    preAuth: 'Not required ✅',
  },
  {
    ref: 'ORD-20260407-002',
    priority: 'STAT',
    received: 'Today 1:55 PM',
    source: 'CeenAiX ePrescription ✅',
    patient: 'Ibrahim Al Marzouqi',
    age: '55M',
    bloodType: 'O+',
    insurance: 'Oman Insurance',
    doctor: 'Dr. Maryam Al Sayed',
    specialty: 'General Medicine',
    clinic: 'Al Zahra Clinic',
    dha: 'DHA-PRAC-2019-031042',
    clinicalNote: 'Acute chest pain. Rule out MI. Repeat troponin if first negative.',
    tests: [
      { name: 'Troponin I (High Sensitivity)', loinc: '89579-7', specimen: 'Serum', priority: 'STAT', tat: '1h' },
      { name: 'D-Dimer', loinc: '48065-7', specimen: 'Plasma', priority: 'STAT', tat: '1h' },
      { name: 'CBC with differential', loinc: '58410-2', specimen: 'EDTA', priority: 'STAT', tat: '1h' },
    ],
    specimen: 'SST × 1 · Citrate × 1 · EDTA × 1',
    fasting: 'Not required',
    preAuth: 'Not required ✅',
  },
  {
    ref: 'ORD-20260407-003',
    priority: 'Routine',
    received: 'Today 1:40 PM',
    source: 'Walk-in',
    patient: 'Noura Al Hashimi',
    age: '47F',
    bloodType: 'B+',
    insurance: 'Daman Enhanced',
    doctor: 'Dr. Layla Al Hashimi',
    specialty: 'Endocrinologist',
    clinic: 'City Hospital Dubai',
    dha: 'DHA-PRAC-2020-029481',
    clinicalNote: 'Routine diabetic check. Monitor HbA1c trend and lipid profile.',
    tests: [
      { name: 'HbA1c', loinc: '41995-2', specimen: 'EDTA', priority: 'Routine', tat: '4h' },
      { name: 'Fasting Blood Sugar', loinc: '1558-6', specimen: 'Fluoride', priority: 'Routine', tat: '4h' },
      { name: 'Lipid Panel', loinc: '57698-3', specimen: 'Serum', priority: 'Routine', tat: '4h' },
    ],
    specimen: 'EDTA × 1 · Fluoride oxalate × 1 · SST × 1',
    fasting: 'Required — 10–12 hours',
    preAuth: 'Covered by Daman Enhanced ✅',
  },
];

const tabs = ['📬 New (3)', '⏳ In Progress (31)', '✅ Completed (189)', '❌ Rejected (2)', 'All (234)'];

export default function LabOrders() {
  const [activeTab, setActiveTab] = useState(0);
  const [accepted, setAccepted] = useState<string[]>([]);

  function handleAccept(ref: string) {
    setAccepted(prev => [...prev, ref]);
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-5 py-2.5">
        <div className="text-xs text-slate-500 mb-1">
          <span className="font-medium text-slate-700">Lab & Radiology Portal</span>
          <ChevronRight size={10} className="inline mx-1" />
          <span>Laboratory</span>
          <ChevronRight size={10} className="inline mx-1" />
          <span className="text-indigo-700 font-medium">Lab Orders</span>
        </div>
        {activeTab === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-700 font-semibold">3 new orders received — CeenAiX ePrescription</span>
            </div>
            <div className="flex gap-2">
              <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors">
                Accept All
              </button>
              <button className="border border-blue-300 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors">
                Review Each
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-b border-slate-200 px-5 flex gap-1">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
              activeTab === i
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {activeTab === 0 && newOrders.map(order => (
          <div
            key={order.ref}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
              accepted.includes(order.ref) ? 'border-emerald-300' : 'border-indigo-200'
            }`}
          >
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-indigo-600 text-sm">{order.ref}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  order.priority === 'STAT' ? 'bg-red-100 text-red-700' :
                  order.priority === 'Urgent' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {order.priority === 'STAT' || order.priority === 'Urgent' ? '⚡ ' : ''}{order.priority}
                </span>
                <span className="text-slate-400 text-xs">{order.received}</span>
                <span className="text-emerald-600 text-xs font-medium">{order.source}</span>
              </div>
              {accepted.includes(order.ref) && (
                <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                  <CheckSquare size={12} /> Accepted
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
                <div className="font-mono text-emerald-600 text-xs mt-0.5">DHA: {order.dha} ✅</div>
              </div>
            </div>

            {order.clinicalNote && (
              <div className="mx-5 mb-3 bg-blue-50 rounded-lg p-3 text-xs text-blue-800">
                <span className="font-semibold text-blue-700">Clinical Notes: </span>
                {order.clinicalNote}
              </div>
            )}

            <div className="px-5 mb-3">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold" style={{ fontSize: 9 }}>Tests Ordered</div>
              <table className="w-full text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    {['Test Name', 'LOINC Code', 'Specimen', 'Priority', 'TAT'].map(h => (
                      <th key={h} className="text-left px-3 py-1.5 text-slate-400 font-semibold" style={{ fontSize: 9 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.tests.map((t, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-medium text-slate-700">{t.name}</td>
                      <td className="px-3 py-2 font-mono text-indigo-600">{t.loinc}</td>
                      <td className="px-3 py-2 text-slate-500">{t.specimen}</td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                          t.priority === 'STAT' ? 'bg-red-100 text-red-700' :
                          t.priority === 'Urgent' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-600">{t.tat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`mx-5 mb-3 rounded-lg p-3 text-xs ${order.fasting !== 'Not required' ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'}`}>
              <span className="font-semibold text-slate-600">Specimen: </span>
              <span className="text-slate-700">{order.specimen}</span>
              <span className="mx-3 text-slate-300">·</span>
              <span className="font-semibold text-slate-600">Fasting: </span>
              <span className={order.fasting !== 'Not required' ? 'text-amber-700 font-semibold' : 'text-slate-700'}>{order.fasting}</span>
            </div>

            <div className="px-5 mb-3 flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-600">Insurance Pre-auth:</span>
              <span className={order.preAuth.includes('Not required') ? 'text-emerald-600' : 'text-amber-600'}>
                {order.preAuth}
              </span>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2">
              {!accepted.includes(order.ref) ? (
                <button
                  onClick={() => handleAccept(order.ref)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  <CheckSquare size={12} /> Accept Order
                </button>
              ) : (
                <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1 px-4 py-2">
                  <CheckSquare size={12} /> Order accepted — tube labels ready to print
                </span>
              )}
              <button className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-xs hover:bg-slate-200 transition-colors">
                <Printer size={12} /> Print Tube Labels
              </button>
              <button className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-xs hover:bg-slate-200 transition-colors">
                <Phone size={12} /> Contact Doctor
              </button>
              <button className="flex items-center gap-1.5 border border-red-200 text-red-500 px-3 py-2 rounded-lg text-xs hover:bg-red-50 transition-colors ml-auto">
                <X size={12} /> Reject
              </button>
            </div>
          </div>
        ))}

        {activeTab !== 0 && (
          <div className="text-center py-16 text-slate-400">
            <div className="text-4xl mb-3">📋</div>
            <div className="font-semibold text-slate-600 mb-1">{tabs[activeTab].replace(/[📬⏳✅❌]/g, '').trim()}</div>
            <div className="text-sm">Select filters to view orders in this category.</div>
          </div>
        )}
      </div>
    </div>
  );
}
