import { useState } from 'react';
import { CheckSquare, Send, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';

interface TestResult {
  name: string;
  loinc: string;
  value: string;
  unit: string;
  refLow: number;
  refHigh: number;
  criticalLow?: number;
  criticalHigh?: number;
  comment: string;
}

function getFlag(val: string, low: number, high: number, critLow?: number, critHigh?: number) {
  const n = parseFloat(val);
  if (isNaN(n)) return null;
  if (critHigh && n >= critHigh) return 'CRITICAL_HIGH';
  if (critLow && n <= critLow) return 'CRITICAL_LOW';
  if (n > high) return 'HIGH';
  if (n < low) return 'LOW';
  return 'NORMAL';
}

function FlagBadge({ flag }: { flag: string | null }) {
  if (!flag) return null;
  const map: Record<string, { text: string; cls: string }> = {
    CRITICAL_HIGH: { text: '↑↑ CRITICAL', cls: 'bg-red-100 text-red-700 animate-pulse' },
    CRITICAL_LOW: { text: '↓↓ CRITICAL', cls: 'bg-red-100 text-red-700 animate-pulse' },
    HIGH: { text: '↑ HIGH', cls: 'bg-amber-100 text-amber-700' },
    LOW: { text: '↓ LOW', cls: 'bg-amber-100 text-amber-700' },
    NORMAL: { text: '✓ Normal', cls: 'bg-emerald-100 text-emerald-700' },
  };
  const m = map[flag];
  if (!m) return null;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${m.cls}`}>
      {m.text}
    </span>
  );
}

const initialTests: TestResult[] = [
  { name: 'BNP', loinc: '30604-8', value: '', unit: 'pg/mL', refLow: 0, refHigh: 100, comment: '' },
  { name: 'K+ (Potassium)', loinc: '2823-3', value: '', unit: 'mEq/L', refLow: 3.5, refHigh: 5.0, criticalLow: 2.5, criticalHigh: 6.0, comment: '' },
  { name: 'Na+ (Sodium)', loinc: '2951-2', value: '', unit: 'mmol/L', refLow: 135, refHigh: 145, comment: '' },
  { name: 'Cl- (Chloride)', loinc: '2075-0', value: '', unit: 'mmol/L', refLow: 98, refHigh: 107, comment: '' },
  { name: 'HCO3-', loinc: '1963-8', value: '', unit: 'mmol/L', refLow: 22, refHigh: 29, comment: '' },
  { name: 'Creatinine', loinc: '2160-0', value: '', unit: 'µmol/L', refLow: 44, refHigh: 97, comment: '' },
  { name: 'eGFR', loinc: '33914-3', value: '', unit: 'mL/min/1.73m²', refLow: 60, refHigh: 200, comment: '' },
  { name: 'Urea', loinc: '3094-0', value: '', unit: 'mmol/L', refLow: 2.5, refHigh: 7.1, comment: '' },
];

export default function LabResults() {
  const [tests, setTests] = useState<TestResult[]>(initialTests);
  const [pin, setPin] = useState('');
  const [supervisorPin, setSupervisorPin] = useState('');
  const [releasing, setReleasing] = useState(false);
  const [released, setReleased] = useState(false);
  const [critAck, setCritAck] = useState(false);

  function updateTest(i: number, field: keyof TestResult, val: string) {
    setTests(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: val } : t));
  }

  const flags = tests.map(t => getFlag(t.value, t.refLow, t.refHigh, t.criticalLow, t.criticalHigh));
  const hasCritical = flags.some(f => f === 'CRITICAL_HIGH' || f === 'CRITICAL_LOW');
  const hasAbnormal = flags.some(f => f && f !== 'NORMAL');
  const abnormalCount = flags.filter(f => f && f !== 'NORMAL').length;
  const kIndex = 1;
  const kFlag = flags[kIndex];

  async function handleRelease() {
    setReleasing(true);
    await new Promise(r => setTimeout(r, 3000));
    setReleasing(false);
    setReleased(true);
  }

  return (
    <div className="flex h-full bg-slate-50">
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-y-auto shrink-0">
        <div className="bg-white border-b border-slate-100 px-4 py-2.5">
          <div className="text-xs text-slate-500">
            <span className="font-medium text-slate-700">Lab & Radiology Portal</span>
            <ChevronRight size={10} className="inline mx-1" />
            <span>Laboratory</span>
            <ChevronRight size={10} className="inline mx-1" />
            <span className="text-indigo-700 font-medium">Results</span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="bg-indigo-50 rounded-xl p-3 border-t-2 border-indigo-400">
            <div className="font-bold text-slate-800 text-sm">Aisha Mohammed Al Reem</div>
            <div className="font-mono text-slate-500 text-xs mt-0.5">42F · O- · PT-006</div>
            <div className="flex gap-1 mt-1.5">
              <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded">AXA Gulf Standard</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs">
              <span className="text-slate-400">Emirates ID:</span>
              <span className="font-mono text-slate-600">784-****-****-1</span>
              <button className="text-indigo-600 text-xs hover:underline">Scan ID</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {['HFrEF', 'HTN', 'T2DM'].map(c => (
                <span key={c} className="bg-blue-50 text-blue-700 text-xs px-1.5 py-0.5 rounded border border-blue-100">{c}</span>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-2.5 text-xs">
            <div className="font-semibold text-emerald-700">✅ No known allergies</div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1">
            <div className="font-semibold text-slate-600 uppercase tracking-wider mb-1" style={{ fontSize: 9 }}>SAMPLE INFO</div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sample ID</span>
              <span className="font-mono text-indigo-700 font-bold">LAB-20260407-003891</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Type</span>
              <span className="text-slate-700">Venous blood — EDTA + SST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Collected</span>
              <span className="font-mono text-slate-700">2:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Received</span>
              <span className="font-mono text-slate-700">2:05 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Accessioned</span>
              <span className="font-mono text-slate-700">2:07 PM</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 text-xs">
            <div className="font-semibold text-slate-600 uppercase tracking-wider mb-1" style={{ fontSize: 9 }}>REQUESTING DOCTOR</div>
            <div className="font-bold text-slate-800">Dr. Ahmed Al Rashidi</div>
            <div className="text-slate-500">Cardiologist · Al Noor Medical Center</div>
            <div className="font-mono text-emerald-600 text-xs mt-0.5">DHA-PRAC-2018-047821 ✅</div>
            <div className="bg-blue-50 rounded p-2 mt-2 text-blue-800 text-xs">
              Patient on RAAS therapy (Enalapril + Spironolactone). K+ monitoring critical. Please flag if K+ &gt; 5.0.
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 text-xs">
            <div className="font-semibold text-slate-600 uppercase tracking-wider mb-2" style={{ fontSize: 9 }}>TESTS ORDERED</div>
            {[
              { test: 'BNP', loinc: '30604-8', priority: 'Urgent' },
              { test: 'Electrolytes Panel (K+/Na+/Cl-/HCO3-)', loinc: '24326-1', priority: 'Urgent' },
              { test: 'Renal Function (Creatinine, eGFR, Urea)', loinc: '33914-3', priority: 'Urgent' },
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2 py-1 border-b border-slate-100 last:border-0">
                <div className="w-3 h-3 rounded-full border-2 border-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-slate-700">{t.test}</div>
                  <div className="font-mono text-slate-400" style={{ fontSize: 9 }}>{t.loinc} · {t.priority}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-lg p-3 text-xs">
            <div className="font-semibold text-slate-600 uppercase tracking-wider mb-2" style={{ fontSize: 9 }}>PREVIOUS VALUES — NABIDH · 15 Jan 2026</div>
            {[
              ['K+', '4.2 mEq/L', '✅'],
              ['Na+', '138 mmol/L', '✅'],
              ['Creatinine', '82 µmol/L', '✅'],
              ['eGFR', '84', '✅'],
            ].map(([k, v, f]) => (
              <div key={k} className="flex justify-between py-0.5">
                <span className="text-slate-500">{k}</span>
                <span className="font-mono text-slate-700">{v} {f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto p-5">
        {released ? (
          <div className="max-w-lg mx-auto mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={32} className="text-emerald-600" />
              </div>
              <div className="text-emerald-700 font-bold text-lg mb-1">Results Released ✅</div>
              <div className="font-mono text-blue-700 text-sm mb-4">REL-20260407-04821</div>
              <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
                <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                  <div className="text-emerald-600 font-semibold">✅ Doctor Notified</div>
                  <div className="text-slate-500">Dr. Ahmed Al Rashidi</div>
                </div>
                <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                  <div className="text-emerald-600 font-semibold">✅ Patient Updated</div>
                  <div className="text-slate-500">CeenAiX app</div>
                </div>
                <div className="bg-white rounded-lg p-2.5 border border-blue-100">
                  <div className="text-emerald-600 font-semibold">✅ NABIDH</div>
                  <div className="text-slate-500">Submitted</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors">
                  🖨️ Print Report
                </button>
                <button
                  onClick={() => { setReleased(false); setTests(initialTests); setPin(''); setSupervisorPin(''); }}
                  className="flex-1 bg-teal-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-teal-700 transition-colors"
                >
                  ← Next Sample
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-sm font-semibold text-slate-700">Select Instrument:</div>
                {['Roche Cobas 6000 ●', 'Cobas 8000', 'Manual Entry'].map((inst, i) => (
                  <button key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${i === 0 ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                    {inst}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-2 text-xs">
                  <span className="font-mono text-slate-500">QC-2026-CH-044</span>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">✅ QC PASS</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-4">
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                <div className="font-semibold text-slate-700 text-sm">Result Entry — All Panels</div>
                <div className="text-slate-500 text-xs">Aisha Mohammed Al Reem · LAB-20260407-003891</div>
              </div>

              <div className="divide-y divide-slate-50">
                {tests.map((t, i) => {
                  const flag = flags[i];
                  const isCrit = flag === 'CRITICAL_HIGH' || flag === 'CRITICAL_LOW';
                  return (
                    <div key={i} className={`px-5 py-3 ${isCrit ? 'bg-red-50' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-48 shrink-0">
                          <div className="font-semibold text-slate-800 text-xs">{t.name}</div>
                          <div className="font-mono text-slate-400" style={{ fontSize: 9 }}>LOINC: {t.loinc}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={t.value}
                            onChange={e => updateTest(i, 'value', e.target.value)}
                            placeholder="—"
                            className={`w-24 border rounded-lg px-2 py-1.5 text-sm font-bold text-center focus:outline-none transition-all ${
                              isCrit ? 'border-red-400 bg-red-50 text-red-700 focus:ring-2 focus:ring-red-300' :
                              flag === 'HIGH' || flag === 'LOW' ? 'border-amber-400 bg-amber-50 text-amber-700' :
                              flag === 'NORMAL' ? 'border-emerald-400 bg-emerald-50' :
                              'border-slate-200 focus:border-indigo-400'
                            }`}
                            style={{ fontFamily: 'DM Mono, monospace' }}
                          />
                          <span className="text-slate-500 text-xs w-28 shrink-0">{t.unit}</span>
                          <span className="font-mono text-slate-400 text-xs w-32 shrink-0">
                            Ref: {t.refLow}–{t.refHigh}
                          </span>
                          <FlagBadge flag={flag} />
                        </div>
                        <div className="ml-auto">
                          <input
                            value={t.comment}
                            onChange={e => updateTest(i, 'comment', e.target.value)}
                            placeholder="Comment..."
                            className="border border-slate-100 rounded px-2 py-1 text-xs text-slate-500 focus:outline-none focus:border-slate-300 w-40"
                          />
                        </div>
                      </div>

                      {isCrit && (
                        <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3 text-xs">
                          <div className="flex items-center gap-2 text-red-700 font-semibold mb-1">
                            <AlertTriangle size={12} />
                            ⚠️ CRITICAL HIGH — {t.name} above critical threshold
                          </div>
                          <div className="text-red-600 mb-2">DHA requires doctor notification within 60 min after result verification and release.</div>
                          {i === kIndex && (
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={critAck}
                                onChange={e => setCritAck(e.target.checked)}
                                className="text-red-600"
                              />
                              <span className="text-red-700 font-medium">I acknowledge critical value protocol</span>
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-500">Abnormal: </span>
                  <span className={`font-bold ${abnormalCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {abnormalCount} of {tests.length} tests flagged
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Critical: </span>
                  <span className={`font-bold ${hasCritical ? 'text-red-600' : 'text-emerald-600'}`}>
                    {hasCritical ? '⚠️ Critical value present' : 'None'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">QC: </span>
                  <span className="text-emerald-600 font-bold">✅ Passed for this run</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4 space-y-3">
              <div className="font-semibold text-slate-700 text-xs uppercase tracking-wider mb-2">Verification Sign-off</div>

              <div className="flex items-center gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Technician</div>
                  <div className="font-semibold text-slate-800 text-sm">Fatima Al Rashidi · MLS Senior</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Technician PIN</div>
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-20 border border-slate-200 rounded-lg px-3 py-1.5 text-center text-sm font-mono focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              {(hasCritical || hasAbnormal) && (
                <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Supervisor Verification (Required)</div>
                    <div className="font-semibold text-slate-800 text-sm">Tariq Al Hamdan · Lab Manager</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Supervisor PIN</div>
                    <input
                      type="password"
                      maxLength={4}
                      value={supervisorPin}
                      onChange={e => setSupervisorPin(e.target.value)}
                      placeholder="••••"
                      className="w-20 border border-slate-200 rounded-lg px-3 py-1.5 text-center text-sm font-mono focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">
                💾 Save Draft
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2.5 bg-teal-50 text-teal-700 border border-teal-300 rounded-lg text-xs font-medium hover:bg-teal-100 transition-colors"
              >
                <Send size={12} /> Release & Notify Doctor
              </button>
              <button
                onClick={handleRelease}
                disabled={releasing || (hasCritical && !critAck) || pin.length < 4}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
              >
                <CheckSquare size={14} />
                {releasing ? (
                  <span className="flex flex-col items-start gap-0.5">
                    <span>Verifying results...</span>
                  </span>
                ) : 'Verify & Release'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
