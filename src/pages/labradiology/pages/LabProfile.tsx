import { useState } from 'react';
import { ChevronRight, Plus, Download } from 'lucide-react';

const tabs = ['🏥 Facility Info', '🧪 Lab Accreditation', '🩻 Radiology Accreditation', '📋 Test & Imaging Menu', '👥 Staff', '⚙️ Integrations'];

const labTests = [
  { name: 'Complete Blood Count (CBC)', dept: 'Haematology', loinc: '58410-2', specimen: 'EDTA', tat: '1h', price: '45 AED', coverage: '✅' },
  { name: 'HbA1c', dept: 'Chemistry', loinc: '41995-2', specimen: 'EDTA', tat: '2h', price: '85 AED', coverage: '✅' },
  { name: 'Lipid Panel', dept: 'Chemistry', loinc: '57698-3', specimen: 'Serum', tat: '4h', price: '95 AED', coverage: '✅' },
  { name: 'Thyroid Stimulating Hormone (TSH)', dept: 'Immunology', loinc: '3016-3', specimen: 'Serum', tat: '2h', price: '75 AED', coverage: '✅' },
  { name: 'Troponin I (High Sensitivity)', dept: 'Chemistry', loinc: '89579-7', specimen: 'Serum', tat: '1h', price: '120 AED', coverage: '✅' },
  { name: 'Blood Culture', dept: 'Microbiology', loinc: '17937-0', specimen: 'Blood', tat: '72h', price: '180 AED', coverage: '✅' },
];

const imagingStudies = [
  { name: 'MRI Brain with/without contrast', modality: 'MRI', prep: 'Remove metal', contrast: 'Optional', cpt: '70553', coverage: '✅', tat: '4h', price: '1,200 AED' },
  { name: 'CT Chest with contrast', modality: 'CT', prep: 'None', contrast: 'Required', cpt: '71250', coverage: '✅', tat: '3h', price: '950 AED' },
  { name: 'Chest X-Ray (PA + Lateral)', modality: 'X-Ray', prep: 'None', contrast: 'No', cpt: '71046', coverage: '✅', tat: '2h', price: '150 AED' },
  { name: '2D TTE Echocardiogram', modality: 'ECHO', prep: 'None', contrast: 'No', cpt: '93306', coverage: '✅', tat: '2h', price: '800 AED' },
  { name: 'Abdomen Ultrasound', modality: 'USS', prep: 'NPO 4h', contrast: 'No', cpt: '76700', coverage: '✅', tat: '2h', price: '400 AED' },
  { name: 'PET-CT Full Body', modality: 'PET', prep: 'Fasting 4–6h, FDG', contrast: 'FDG', cpt: '78816', coverage: 'Pre-auth', tat: '6h', price: '4,500 AED' },
];

const staff = [
  { name: 'Dr. Hind Al Zarooni', role: 'Lab Director', dept: 'Laboratory', dha: 'DHA-PATH-2012-004821', shift: 'Day', status: 'On duty' },
  { name: 'Tariq Al Hamdan', role: 'Lab Manager', dept: 'Laboratory', dha: 'DHA-MLS-2014-009231', shift: 'Day', status: 'On duty' },
  { name: 'Fatima Al Rashidi', role: 'Senior Diagnostics Coordinator', dept: 'Both', dha: 'DHA-MLS-2017-019847', shift: 'Day', status: 'On duty' },
  { name: 'Dr. Rania Al Suwaidi', role: 'Radiologist', dept: 'Radiology', dha: 'DHA-RAD-2021-004721', shift: 'Day', status: 'On duty' },
  { name: 'Ali Hassan', role: 'MLS Senior Technician', dept: 'Laboratory', dha: 'DHA-MLS-2019-024891', shift: 'Day', status: 'On duty' },
  { name: 'Nour Saleh', role: 'Microbiology Technician', dept: 'Laboratory', dha: 'DHA-MLS-2021-031842', shift: 'Day', status: 'On duty' },
  { name: 'Omar Said', role: 'Radiographer', dept: 'Radiology', dha: 'DHA-RAD-2018-014729', shift: 'Day', status: 'On duty' },
  { name: 'Dr. Rania Al Suwaidi', role: 'Night Radiologist', dept: 'Radiology', dha: 'DHA-RAD-2020-038291', shift: 'Night', status: 'Off duty' },
];

const integrations = [
  { name: 'NABIDH HIE', status: '✅ Connected', detail: 'NABIDH-VENDOR-2024-00847' },
  { name: 'DHA Lab Reporting API', status: '✅ Active', detail: 'v3.2.1' },
  { name: 'DHA Radiology Reporting API', status: '✅ Active', detail: 'v2.8.0' },
  { name: 'CeenAiX ePrescription (Lab)', status: '✅ Connected', detail: 'Real-time' },
  { name: 'CeenAiX Imaging Orders', status: '✅ Connected', detail: 'Real-time' },
  { name: 'PACS System (Radiology Archive)', status: '✅ Connected', detail: 'Agfa Enterprise Imaging' },
  { name: 'LIS (Lab Information System)', status: '✅ Connected', detail: 'Cerner PathNet' },
  { name: 'RIS (Radiology Information System)', status: '✅ Connected', detail: 'Sectra RIS' },
];

const modalityColor: Record<string, string> = {
  MRI: 'bg-indigo-100 text-indigo-700', CT: 'bg-blue-100 text-blue-700',
  'X-Ray': 'bg-slate-100 text-slate-600', ECHO: 'bg-purple-100 text-purple-700',
  USS: 'bg-teal-100 text-teal-700', PET: 'bg-amber-100 text-amber-700',
};

export default function LabProfile() {
  const [activeTab, setActiveTab] = useState(0);
  const [menuTab, setMenuTab] = useState<'lab' | 'imaging'>('lab');

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-5 py-2.5">
        <div className="text-xs text-slate-500">
          <span className="font-medium text-slate-700">Lab & Radiology Portal</span>
          <ChevronRight size={10} className="inline mx-1" />
          <span className="text-indigo-700 font-medium">Profile</span>
        </div>
      </div>

      <div className="bg-white border-b border-slate-200 px-5 flex gap-1 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === i ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 0 && (
          <div className="max-w-2xl space-y-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  DM
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-lg" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Dubai Medical & Imaging Centre
                  </div>
                  <div className="text-slate-500 text-sm">مركز دبي للتشخيص والتصوير الطبي</div>
                  <div className="text-slate-400 text-xs mt-1">Healthcare City, Building 64, Dubai, UAE</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                {[
                  ['Type', 'Private Diagnostic Centre'],
                  ['Operating Hours', '24/7 — Day | Evening | Night shifts'],
                  ['Phone', '+971 4 372 1000'],
                  ['Email', 'lab@dubaimedicalimaging.ae'],
                  ['Website', 'www.dubaimedicalimaging.ae'],
                  ['CeenAiX Integration', '✅ Fully integrated'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-slate-400 mb-0.5">{k}</div>
                    <div className="font-semibold text-slate-700">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs">
                <div className="font-bold text-indigo-700 text-sm mb-2">🧪 DHA Lab License</div>
                <div className="font-mono text-indigo-600 font-bold">DHA-LAB-2015-002841</div>
                <div className="text-emerald-600 mt-1">✅ Valid — expires Dec 2026</div>
                <div className="text-slate-500 mt-2">CAP Accredited ✅ | ISO 15189:2022 ✅</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs">
                <div className="font-bold text-blue-700 text-sm mb-2">🩻 DHA Radiology License</div>
                <div className="font-mono text-blue-600 font-bold">DHA-RAD-2016-001247</div>
                <div className="text-emerald-600 mt-1">✅ Valid — expires Mar 2027</div>
                <div className="text-slate-500 mt-2">JCI Accredited ✅ | Radiation safety ✅</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="max-w-2xl space-y-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="font-bold text-slate-800 mb-3">Lab Accreditations & Licenses</div>
              {[
                { label: 'DHA Lab License', value: 'DHA-LAB-2015-002841', status: '✅ Valid · 269 days remaining', color: 'text-emerald-600' },
                { label: 'CAP Accreditation', value: 'CAP-2023-UAE-0044', status: '✅ Current cycle valid', color: 'text-emerald-600' },
                { label: 'ISO 15189:2022', value: 'ISO-AE-LAB-2024-0081', status: '✅ Certified', color: 'text-emerald-600' },
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="font-semibold text-slate-700 text-xs">{a.label}</div>
                    <div className="font-mono text-indigo-600 text-xs">{a.value}</div>
                  </div>
                  <span className={`text-xs font-medium ${a.color}`}>{a.status}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="font-semibold text-slate-600 text-xs uppercase tracking-wider mb-3">Key Personnel</div>
              <div className="space-y-2 text-xs">
                <div><span className="text-slate-500">Lab Director:</span> <span className="font-semibold">Dr. Hind Al Zarooni FRCPATH</span></div>
                <div><span className="text-slate-500">Lab Manager:</span> <span className="font-semibold">Tariq Al Hamdan (MLSc)</span></div>
              </div>
              <div className="mt-3 font-semibold text-slate-600 text-xs uppercase tracking-wider mb-2">Test Scope</div>
              <div className="flex flex-wrap gap-1.5">
                {['Chemistry', 'Haematology', 'Microbiology', 'Immunology', 'Coagulation', 'Hormones & Endocrinology', 'Urinalysis'].map(d => (
                  <span key={d} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded border border-indigo-100">{d}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="max-w-2xl space-y-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="font-bold text-slate-800 mb-3">Radiology Accreditations & Licenses</div>
              {[
                { label: 'DHA Radiology License', value: 'DHA-RAD-2016-001247', status: '✅ Valid · 332 days remaining', color: 'text-emerald-600' },
                { label: 'JCI Accreditation', value: 'JCI-UAE-2022-DIAG-017', status: '✅ Current', color: 'text-emerald-600' },
                { label: 'Radiation Safety Permit', value: 'ENEC-RAD-AE-2024-0092', status: '✅ Annual survey completed', color: 'text-emerald-600' },
                { label: 'MQSA Certification (Mammography)', value: 'MQSA-UAE-2024-0031', status: '✅ Certified', color: 'text-emerald-600' },
                { label: 'Radioactive Materials License (PET)', value: 'RML-UAE-2023-PET-004', status: '✅ Active', color: 'text-emerald-600' },
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="font-semibold text-slate-700 text-xs">{a.label}</div>
                    <div className="font-mono text-blue-600 text-xs">{a.value}</div>
                  </div>
                  <span className={`text-xs font-medium ${a.color}`}>{a.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 3 && (
          <div className="space-y-3">
            <div className="flex gap-2 bg-white rounded-xl p-1 border border-slate-100 w-fit shadow-sm">
              <button onClick={() => setMenuTab('lab')} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${menuTab === 'lab' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                🧪 Lab Tests
              </button>
              <button onClick={() => setMenuTab('imaging')} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${menuTab === 'imaging' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                🩻 Imaging Studies
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-700 text-sm">{menuTab === 'lab' ? 'Laboratory Test Catalog' : 'Imaging Study Catalog'}</span>
                <div className="flex gap-2">
                  <button className="text-xs text-slate-600 border border-slate-200 px-2.5 py-1.5 rounded hover:bg-slate-50 transition-colors">
                    <Plus size={10} className="inline mr-1" />Add
                  </button>
                  <button className="text-xs text-slate-600 border border-slate-200 px-2.5 py-1.5 rounded hover:bg-slate-50 transition-colors">
                    <Download size={10} className="inline mr-1" />Export
                  </button>
                </div>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {(menuTab === 'lab'
                      ? ['Test Name', 'Department', 'LOINC', 'Specimen', 'TAT', 'Price', 'Coverage']
                      : ['Study', 'Modality', 'Prep', 'Contrast', 'CPT', 'TAT', 'Price', 'Coverage']
                    ).map(h => (
                      <th key={h} className="text-left px-4 py-2 text-slate-400 font-semibold" style={{ fontSize: 9 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {menuTab === 'lab' ? labTests.map((t, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-medium text-slate-700">{t.name}</td>
                      <td className="px-4 py-2.5 text-slate-500">{t.dept}</td>
                      <td className="px-4 py-2.5 font-mono text-indigo-600">{t.loinc}</td>
                      <td className="px-4 py-2.5 text-slate-500">{t.specimen}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-600">{t.tat}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-700 font-bold">{t.price}</td>
                      <td className="px-4 py-2.5 text-emerald-600">{t.coverage}</td>
                    </tr>
                  )) : imagingStudies.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-medium text-slate-700">{s.name}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-1.5 py-0.5 rounded font-bold ${modalityColor[s.modality]}`} style={{ fontSize: 9 }}>{s.modality}</span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-500">{s.prep}</td>
                      <td className="px-4 py-2.5 text-slate-500">{s.contrast}</td>
                      <td className="px-4 py-2.5 font-mono text-blue-600">{s.cpt}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-600">{s.tat}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-700 font-bold">{s.price}</td>
                      <td className="px-4 py-2.5 text-emerald-600">{s.coverage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 4 && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-700 text-sm">Staff Roster</span>
              <span className="text-slate-400 text-xs">{staff.length} staff members</span>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Name', 'Role', 'Department', 'DHA License', 'Shift', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-slate-400 font-semibold" style={{ fontSize: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {staff.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-800">{s.name}</td>
                    <td className="px-4 py-3 text-slate-600">{s.role}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        s.dept === 'Laboratory' ? 'bg-indigo-50 text-indigo-700' :
                        s.dept === 'Radiology' ? 'bg-blue-50 text-blue-700' :
                        'bg-teal-50 text-teal-700'
                      }`}>{s.dept}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-emerald-600" style={{ fontSize: 10 }}>{s.dha} ✅</td>
                    <td className="px-4 py-3 text-slate-500">{s.shift}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.status === 'On duty' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 5 && (
          <div className="max-w-xl space-y-3">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              {integrations.map((int, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="font-semibold text-slate-700 text-sm">{int.name}</div>
                    <div className="font-mono text-slate-400 text-xs">{int.detail}</div>
                  </div>
                  <span className="text-emerald-600 font-medium text-xs">{int.status}</span>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors">
              <Plus size={12} /> Add Integration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
