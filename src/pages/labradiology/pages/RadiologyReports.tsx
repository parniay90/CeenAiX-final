import { useState } from 'react';
import { CheckSquare, ChevronRight } from 'lucide-react';

const worklist = [
  { accession: 'CT-20260407-004', patient: 'Mohammed Al Khalidi', age: '48M', study: 'CT Chest w/ contrast', doctor: 'Dr. Fatima Al Mansoori', clinic: 'Pulmonology · Al Noor', tat: '2.5h', tatStatus: 'warning', modality: 'CT' },
  { accession: 'MRI-20260407-005', patient: 'Aisha Al Mansoori', age: '44F', study: 'MRI Lumbar Spine', doctor: 'Dr. Rashed Al Blooshi', clinic: 'NMC Royal Hospital', tat: '4.8h', tatStatus: 'overdue', modality: 'MRI' },
  { accession: 'USS-20260407-010', patient: 'Noura Al Hashimi', age: '47F', study: 'Abdomen Ultrasound', doctor: 'Dr. Layla Al Hashimi', clinic: 'City Hospital Dubai', tat: '1.8h', tatStatus: 'ok', modality: 'USS' },
];

const modalityColor: Record<string, string> = {
  MRI: 'bg-indigo-100 text-indigo-700',
  CT: 'bg-blue-100 text-blue-700',
  USS: 'bg-teal-100 text-teal-700',
  'X-Ray': 'bg-slate-100 text-slate-600',
};

const checklist = [
  'Clinical indication referenced',
  'All anatomical regions documented',
  'Impression section complete',
  'ICD-10 coded',
  'Comparison study referenced',
  'Recommendations included',
  'QA: measurements consistent with viewer',
];

export default function RadiologyReports() {
  const [activeStudy, setActiveStudy] = useState(worklist[0]);
  const [findings, setFindings] = useState(
    `Solid nodule in the right lower lobe measuring 7.2 × 6.8mm (series 4, image 87). Previously measured 6mm (June 2025 CT) representing 20% growth over 10 months.`
  );
  const [impression, setImpression] = useState(
    `1. RLL pulmonary nodule now measuring 7.2mm (previously 6mm, June 2025), representing 20% growth. Recommend follow-up CT in 3 months per Fleischner Society guidelines (≥6mm solid nodule).`
  );
  const [recommendations, setRecommendations] = useState(
    `Follow-up CT chest in 3 months. Clinical correlation with smoking cessation counselling recommended.`
  );
  const [technique, setTechnique] = useState(
    `CT chest performed with IV contrast (Omnipaque 350, 80mL IV) and without contrast.`
  );
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [signed, setSigned] = useState(false);
  const [preliminary, setPreliminary] = useState(false);
  const checklistDone = checklist.map((_, i) => i < 6);
  const allChecked = checklistDone.every(Boolean);

  function handleSign() {
    if (pin.length >= 4) {
      setShowPin(false);
      setSigned(true);
    }
  }

  return (
    <div className="flex h-full">
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">Lab & Radiology Portal</span>
            <ChevronRight size={10} className="inline mx-1" />
            <span>Radiology</span>
            <ChevronRight size={10} className="inline mx-1" />
            <span className="text-blue-700 font-medium">Reports</span>
          </div>
          <div className="bg-blue-50 rounded-lg p-2.5 mt-2">
            <div className="font-semibold text-blue-700 text-xs">Dr. Rania Al Suwaidi FRCR</div>
            <div className="text-blue-600 text-xs">Radiologist on duty · 9 reports in queue</div>
            <div className="text-red-500 text-xs font-medium">2 overdue</div>
            <button className="mt-1.5 w-full bg-blue-600 text-white py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors">
              🏃 Start Reporting
            </button>
          </div>
        </div>

        <div className="px-3 py-2 border-b border-slate-100">
          <div className="flex gap-1">
            {['Pending (9)', 'Draft (2)', 'Done (28)'].map((t, i) => (
              <button key={i} className={`flex-1 py-1 text-xs rounded transition-colors ${i === 0 ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {worklist.map(w => (
            <div
              key={w.accession}
              onClick={() => setActiveStudy(w)}
              className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${activeStudy.accession === w.accession ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${modalityColor[w.modality]}`}>{w.modality}</span>
                <span className={`font-mono text-xs font-bold ${
                  w.tatStatus === 'overdue' ? 'text-red-600' :
                  w.tatStatus === 'warning' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {w.tat} {w.tatStatus === 'overdue' ? '🔴 OVERDUE' : w.tatStatus === 'warning' ? '⚠️' : '✅'}
                </span>
              </div>
              <div className="font-semibold text-slate-800 text-xs">{w.patient}</div>
              <div className="text-slate-500 text-xs">{w.study}</div>
              <div className="text-slate-400 text-xs">{w.doctor}</div>
              <button className="mt-1.5 w-full bg-blue-100 text-blue-700 py-1 rounded text-xs hover:bg-blue-200 transition-colors font-medium">
                ▶ Report
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {signed ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center max-w-md">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare size={32} className="text-emerald-600" />
              </div>
              <div className="text-emerald-700 font-bold text-lg mb-1">Report Signed and Released ✅</div>
              <div className="font-mono text-blue-700 text-sm mb-4">RPT-20260407-CT-002</div>
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                {['Report PDF generated', 'Doctor notified via CeenAiX', 'Patient app updated', 'NABIDH ImagingStudy submitted'].map((item, i) => (
                  <div key={i} className="bg-white rounded-lg p-2 border border-blue-100 text-emerald-600 font-medium">✅ {item}</div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
                  🖨️ Print Report
                </button>
                <button onClick={() => { setSigned(false); setPin(''); }} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors">
                  ← Next Study
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-slate-800 px-4 py-3 flex items-center gap-4">
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">{activeStudy.study} · {activeStudy.patient} · {activeStudy.age}</div>
                <div className="text-blue-300 font-mono text-xs mt-0.5">{activeStudy.accession}</div>
                <div className="text-slate-400 text-xs">{activeStudy.doctor} · {activeStudy.clinic}</div>
              </div>
              <div className="flex gap-2">
                {['W/L', 'Zoom', 'Pan', 'Measure', 'Compare'].map(t => (
                  <button key={t} className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded text-xs transition-colors">{t}</button>
                ))}
              </div>
              <div className="text-right">
                <div className={`font-mono font-bold text-sm ${activeStudy.tatStatus === 'overdue' ? 'text-red-400' : activeStudy.tatStatus === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  TAT: {activeStudy.tat}
                </div>
                <div className="text-slate-500 text-xs">Target: &lt;3h</div>
              </div>
            </div>

            <div className="bg-slate-900 h-52 flex items-center justify-center relative">
              <div className="text-center">
                <div className="text-slate-500 text-6xl mb-2">⬛</div>
                <div className="text-slate-600 text-xs">CT Chest Viewer · Slice 45/120</div>
                <div className="flex gap-2 mt-2 justify-center">
                  {['Lung', 'Mediastinum', 'Bone', 'Liver'].map(p => (
                    <button key={p} className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs hover:bg-slate-600 transition-colors">{p}</button>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/60 rounded px-2 py-1 text-xs text-white font-mono">
                RLL Nodule · 7.2mm × 6.8mm
              </div>
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs hover:bg-slate-600 transition-colors">◀ Prev</button>
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">45 / 120</span>
                <button className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs hover:bg-slate-600 transition-colors">Next ▶</button>
              </div>
            </div>

            <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-xs flex items-center gap-4">
              <span className="font-semibold text-blue-700">Comparison:</span>
              <span className="text-blue-600">Previous CT June 2025 · Dubai Medical Lab · RLL nodule 6mm</span>
              <span className="text-amber-600 font-semibold">Current: 7.2mm (+1.2mm · +20% growth)</span>
              <span className="font-mono text-amber-600">~2mm/year growth rate</span>
              <button className="ml-auto text-blue-600 hover:underline">Compare in Viewer</button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="bg-blue-50 rounded-lg p-3 text-xs">
                  <div className="font-semibold text-blue-700 mb-1 uppercase tracking-wider" style={{ fontSize: 9 }}>CLINICAL INDICATION</div>
                  <div className="text-blue-800">Known smoker, RLL nodule surveillance from June 2025 CT. Query growth/progression.</div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Technique</div>
                  <textarea
                    value={technique}
                    onChange={e => setTechnique(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-400 resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Findings — Right Lower Lobe</div>
                    <button className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded text-xs font-medium hover:bg-violet-200 transition-colors">
                      🤖 AI Assist
                    </button>
                  </div>
                  <textarea
                    value={findings}
                    onChange={e => setFindings(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-400 resize-none"
                    rows={3}
                  />
                </div>

                {['Left Lung', 'Pleura', 'Mediastinum & Hila', 'Heart', 'Bones & Soft Tissues'].map(section => (
                  <div key={section}>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{section}</div>
                    <textarea
                      placeholder={`${section} findings...`}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-400 resize-none text-slate-400"
                      rows={2}
                    />
                  </div>
                ))}

                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3">
                  <div className="text-blue-700 font-bold text-xs uppercase tracking-wider mb-2">IMPRESSION *</div>
                  <textarea
                    value={impression}
                    onChange={e => setImpression(e.target.value)}
                    className="w-full bg-transparent border-0 text-xs focus:outline-none resize-none text-slate-700 font-medium"
                    rows={4}
                    placeholder="Impression required..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">ICD-10</div>
                    <div className="flex flex-wrap gap-1.5">
                      {['R91.8 — Lung lesion', 'Z87.891 — H/O tobacco use'].map(code => (
                        <span key={code} className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                          {code}
                          <span className="text-violet-400 text-xs" style={{ fontSize: 8 }}>AI</span>
                        </span>
                      ))}
                    </div>
                    <button className="mt-1.5 text-blue-600 text-xs hover:underline">+ Add ICD-10</button>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">CPT</div>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-mono">71250 — CT Thorax w/ contrast</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Recommendations</div>
                  <textarea
                    value={recommendations}
                    onChange={e => setRecommendations(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-400 resize-none"
                    rows={2}
                  />
                </div>
              </div>

              <div className="w-52 border-l border-slate-200 p-3 overflow-y-auto">
                <div className="text-slate-500 uppercase tracking-widest text-xs font-semibold mb-3" style={{ fontSize: 9 }}>REPORT CHECKLIST</div>
                <div className="space-y-2">
                  {checklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className={checklistDone[i] ? 'text-emerald-500' : 'text-slate-300'}>
                        {checklistDone[i] ? '✅' : '○'}
                      </span>
                      <span className={checklistDone[i] ? 'text-emerald-700' : 'text-slate-400'}>{item}</span>
                    </div>
                  ))}
                </div>
                {allChecked && (
                  <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-xs text-emerald-700 font-semibold text-center">
                    ✅ Ready to Sign
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-3">
              <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">
                💾 Save Draft
              </button>
              <button
                onClick={() => setPreliminary(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-200 transition-colors"
              >
                📤 Submit Preliminary
              </button>
              <button
                onClick={() => setShowPin(true)}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckSquare size={14} /> Verify & Sign Report
              </button>
            </div>
          </>
        )}
      </div>

      {showPin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-80 overflow-hidden">
            <div className="bg-blue-700 px-5 py-4">
              <div className="text-white font-bold">Digitally Sign Report</div>
              <div className="text-blue-200 text-xs mt-0.5">Dr. Rania Al Suwaidi FRCR · DHA-RAD-2021-004721</div>
            </div>
            <div className="p-5 space-y-3">
              <div className="text-sm text-slate-600 text-center">Enter your DHA credentials PIN to sign</div>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="••••"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-center text-xl font-mono focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={handleSign}
                disabled={pin.length < 4}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                Confirm & Sign
              </button>
              <button onClick={() => setShowPin(false)} className="w-full text-slate-500 text-xs hover:underline">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
