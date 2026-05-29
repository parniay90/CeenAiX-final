import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Sparkles, Plus, Search, X, Check, Loader2, ChevronDown } from 'lucide-react';

type SOAPSection = 'subjective' | 'objective' | 'assessment' | 'plan';

interface Props {
  onDictate?: (section: SOAPSection) => void;
  onAIAssist?: (section: SOAPSection) => void;
}

// Demo dictation content per section
const DICTATION_DEMO: Record<SOAPSection, string> = {
  subjective: 'Patient presents with a 3-day history of persistent headache, bilateral, rated 7/10 in severity. Reports associated blurry vision on waking and occasional dizziness on standing. Denies chest pain, shortness of breath, or neurological symptoms. Admits to missing Amlodipine doses last week due to pharmacy access issues.',
  objective: 'General: Alert and oriented x3. Appears mildly distressed. BP 152/88 mmHg (elevated). HR 78 bpm regular. Temp 36.8°C. SpO2 98% on room air. Weight 72.5 kg (+1.2 kg). Bilateral mild pitting edema at ankles. JVP not elevated. Fundoscopy pending. Neurological exam grossly intact.',
  assessment: '',
  plan: 'Restart Amlodipine 5mg once daily immediately. Consider adding Ramipril 5mg OD if BP remains elevated on follow-up — check eGFR first. Order: eGFR, microalbumin/creatinine ratio, HbA1c, BMP, urine dipstick. Refer ophthalmology urgently for hypertensive retinopathy screening. Daily home BP monitoring. Restrict sodium <2g/day. Follow-up in 2 weeks.',
};

// Demo AI assist content
const AI_ASSIST_DEMO: Record<SOAPSection, string> = {
  subjective: '— AI-enhanced —\nChief Complaint: Persistent headache + visual disturbance in known hypertensive patient.\n\nHPI: Patient is a 62-year-old female with essential hypertension (I10), T2DM (E11.9), and hyperlipidemia (E78.5) presenting with a 3-day history of bilateral, non-pulsatile headache (7/10 NRS). Associated symptoms include morning blurry vision and postural dizziness. Medication non-adherence noted — missed Amlodipine 5mg doses for approximately one week. No fever, vomiting, speech difficulty, or limb weakness.',
  objective: '— AI-enhanced —\nVitals: BP 152/88 (elevated from baseline ~130/80), HR 78, RR 16, Temp 36.8°C, SpO2 98%, Wt 72.5 kg (+1.2 kg since last visit).\n\nExam: Bilateral ankle pitting edema grade I. Cardiovascular: S1 S2 present, no murmurs. Respiratory: Clear bilaterally. Neurological: No focal deficits. Fundoscopy: Scheduled — results pending.',
  assessment: '',
  plan: '— AI-enhanced plan based on DHA HTN Guideline 2025 —\n1. Restart Amlodipine 5mg OD — medication non-adherence identified as primary driver.\n2. Escalation: If BP >140/90 at follow-up, add Ramipril 5mg OD (ACE inhibitor per DHA guidelines). Check eGFR first — concern for early nephropathy.\n3. Labs ordered: eGFR · Creatinine · Microalbumin/Cr ratio · HbA1c · BMP · Urine dipstick.\n4. Ophthalmology referral — visual disturbance in diabetic-hypertensive warrants retinopathy screening.\n5. Patient education: Daily weight monitoring, fluid restriction 1.5L, sodium <2g, home BP log.\n6. Follow-up: 2 weeks or sooner if headache worsens, vision deteriorates, or BP remains elevated.',
};

const ICD10_DB = [
  { code: 'I10', name: 'Essential (primary) hypertension' },
  { code: 'I16.0', name: 'Hypertensive urgency' },
  { code: 'I16.1', name: 'Hypertensive emergency' },
  { code: 'I16.9', name: 'Hypertensive crisis, unspecified' },
  { code: 'I11.9', name: 'Hypertensive heart disease without heart failure' },
  { code: 'E11.9', name: 'Type 2 diabetes mellitus without complications' },
  { code: 'E11.21', name: 'Type 2 DM with diabetic nephropathy' },
  { code: 'E78.5', name: 'Hyperlipidemia, unspecified' },
  { code: 'N18.9', name: 'Chronic kidney disease, unspecified' },
  { code: 'N18.3', name: 'Chronic kidney disease, stage 3' },
  { code: 'H35.30', name: 'Unspecified macular degeneration' },
  { code: 'H36', name: 'Retinal disorders in diseases classified elsewhere' },
  { code: 'R51', name: 'Headache' },
  { code: 'R11.0', name: 'Nausea' },
  { code: 'R42', name: 'Dizziness and giddiness' },
];

interface Dx { code: string; name: string; isPrimary: boolean }

export default function SOAPEditor({ onDictate, onAIAssist }: Props) {
  const [activeTab, setActiveTab] = useState<SOAPSection>('subjective');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [subjectiveText, setSubjectiveText] = useState('');
  const [objectiveText, setObjectiveText] = useState('');
  const [diagnoses, setDiagnoses] = useState<Dx[]>([]);
  const [icd10Search, setIcd10Search] = useState('');
  const [showIcdDropdown, setShowIcdDropdown] = useState(false);
  const [planText, setPlanText] = useState('');
  const [followUp, setFollowUp] = useState('');

  // Dictate states
  const [dictatingSection, setDictatingSection] = useState<SOAPSection | null>(null);
  const [dictateProgress, setDictateProgress] = useState(0);
  const dictateTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // AI Assist states
  const [aiAssistLoading, setAiAssistLoading] = useState<SOAPSection | null>(null);

  // ICD dropdown ref for closing on outside click
  const icdRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (icdRef.current && !icdRef.current.contains(e.target as Node)) setShowIcdDropdown(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const icdResults = ICD10_DB.filter(r =>
    icd10Search.length > 0 &&
    (r.code.toLowerCase().includes(icd10Search.toLowerCase()) ||
      r.name.toLowerCase().includes(icd10Search.toLowerCase()))
  ).slice(0, 6);

  function addDx(code: string, name: string) {
    if (diagnoses.find(d => d.code === code)) return;
    setDiagnoses(prev => [...prev, { code, name, isPrimary: prev.length === 0 }]);
    setIcd10Search('');
    setShowIcdDropdown(false);
  }

  function removeDx(code: string) {
    setDiagnoses(prev => {
      const filtered = prev.filter(d => d.code !== code);
      if (filtered.length > 0 && !filtered.some(d => d.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  }

  function setPrimary(code: string) {
    setDiagnoses(prev => prev.map(d => ({ ...d, isPrimary: d.code === code })));
  }

  // Dictate: streams text char by char into the right field
  function handleDictate(section: SOAPSection) {
    if (dictatingSection === section) {
      // Stop
      setDictatingSection(null);
      if (dictateTimerRef.current) clearInterval(dictateTimerRef.current);
      return;
    }
    const fullText = DICTATION_DEMO[section];
    if (!fullText) return;

    setDictatingSection(section);
    setDictateProgress(0);
    let idx = 0;

    // Clear existing content first then stream
    if (section === 'subjective') setSubjectiveText('');
    if (section === 'objective') setObjectiveText('');
    if (section === 'plan') setPlanText('');

    dictateTimerRef.current = setInterval(() => {
      idx += 3; // 3 chars at a time for speed
      const slice = fullText.slice(0, idx);
      if (section === 'subjective') setSubjectiveText(slice);
      if (section === 'objective') setObjectiveText(slice);
      if (section === 'plan') setPlanText(slice);
      setDictateProgress(Math.min(100, Math.round((idx / fullText.length) * 100)));

      if (idx >= fullText.length) {
        setDictatingSection(null);
        if (dictateTimerRef.current) clearInterval(dictateTimerRef.current);
      }
    }, 40);
    onDictate?.(section);
  }

  // AI Assist: shows loading then fills content
  function handleAIAssist(section: SOAPSection) {
    setAiAssistLoading(section);
    const content = AI_ASSIST_DEMO[section];
    setTimeout(() => {
      setAiAssistLoading(null);
      if (section === 'subjective') setSubjectiveText(content);
      if (section === 'objective') setObjectiveText(content);
      if (section === 'plan') setPlanText(content);
      onAIAssist?.(section);
    }, 1600);
  }

  const tabs: { id: SOAPSection; label: string }[] = [
    { id: 'subjective', label: 'S' },
    { id: 'objective', label: 'O' },
    { id: 'assessment', label: 'A' },
    { id: 'plan', label: 'P' },
  ];

  function DictateAIBar({ section }: { section: SOAPSection }) {
    const isDictating = dictatingSection === section;
    const isAILoading = aiAssistLoading === section;
    return (
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => handleDictate(section)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isDictating ? 'bg-red-600 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
        >
          {isDictating ? <><MicOff size={12} /> Stop ({dictateProgress}%)</> : <><Mic size={12} /> Dictate</>}
        </button>
        <button
          onClick={() => handleAIAssist(section)}
          disabled={isAILoading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A1628] hover:bg-slate-800 text-teal-400 rounded-lg text-xs font-semibold transition-all disabled:opacity-70 border border-teal-600/30"
        >
          {isAILoading ? <><Loader2 size={11} className="animate-spin" /> Thinking…</> : <><Sparkles size={11} /> AI Assist</>}
        </button>
        {isDictating && (
          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full transition-all duration-100" style={{ width: `${dictateProgress}%` }} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Header */}
      <div className="bg-[#0A1628] text-white px-5 py-3 flex items-center justify-between shrink-0">
        <h3 className="font-bold text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>SOAP Notes</h3>
        <div className="flex gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${activeTab === t.id ? 'bg-teal-600 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Full tab bar */}
      <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
        {[
          { id: 'subjective', label: 'Subjective' },
          { id: 'objective', label: 'Objective' },
          { id: 'assessment', label: 'Assessment' },
          { id: 'plan', label: 'Plan' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SOAPSection)}
            className={`flex-1 px-4 py-3 text-xs font-semibold transition-colors ${activeTab === tab.id ? 'bg-white text-teal-700 border-b-2 border-teal-600' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">

        {/* Subjective */}
        {activeTab === 'subjective' && (
          <div className="space-y-4">
            <DictateAIBar section="subjective" />
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Chief Complaint</label>
              <input
                value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)}
                placeholder="Primary reason for visit…"
                className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">History of Present Illness</label>
              <textarea
                value={subjectiveText}
                onChange={e => setSubjectiveText(e.target.value)}
                placeholder="Patient reports…"
                rows={9}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none leading-relaxed transition-colors ${dictatingSection === 'subjective' ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
              />
              <div className="flex justify-end mt-1">
                <span className="text-[10px] text-slate-400">{subjectiveText.length} chars</span>
              </div>
            </div>
          </div>
        )}

        {/* Objective */}
        {activeTab === 'objective' && (
          <div className="space-y-4">
            <DictateAIBar section="objective" />
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Physical Examination &amp; Findings</label>
              <textarea
                value={objectiveText}
                onChange={e => setObjectiveText(e.target.value)}
                placeholder="General: Alert and oriented x3. Vitals: BP…"
                rows={11}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none leading-relaxed transition-colors ${dictatingSection === 'objective' ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors">
                <Plus size={12} /> Add Vital Signs
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors">
                <Plus size={12} /> Add Finding
              </button>
            </div>
          </div>
        )}

        {/* Assessment */}
        {activeTab === 'assessment' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => handleAIAssist('assessment')}
                disabled={aiAssistLoading === 'assessment'}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A1628] hover:bg-slate-800 text-teal-400 rounded-lg text-xs font-semibold transition-all disabled:opacity-70 border border-teal-600/30"
              >
                {aiAssistLoading === 'assessment' ? <><Loader2 size={11} className="animate-spin" /> Thinking…</> : <><Sparkles size={11} /> AI Suggest Diagnoses</>}
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">ICD-10 Diagnoses</label>
              <div ref={icdRef} className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={icd10Search}
                  onChange={e => { setIcd10Search(e.target.value); setShowIcdDropdown(true); }}
                  onFocus={() => icd10Search && setShowIcdDropdown(true)}
                  placeholder="Search diagnosis or ICD-10 code…"
                  className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {showIcdDropdown && icdResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-white border border-slate-300 rounded-xl shadow-xl mt-1 overflow-hidden">
                    {icdResults.map(r => (
                      <button
                        key={r.code}
                        onClick={() => addDx(r.code, r.name)}
                        className="w-full px-4 py-2.5 hover:bg-teal-50 text-left border-b border-slate-100 last:border-0 flex items-center gap-3 transition-colors"
                      >
                        <span className="font-mono font-bold text-teal-700 text-xs w-14 shrink-0">{r.code}</span>
                        <span className="text-slate-700 text-xs">{r.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {aiAssistLoading === 'assessment' && (
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl mb-3">
                  <Loader2 size={14} className="text-teal-600 animate-spin" />
                  <span className="text-sm text-slate-600">AI is analysing symptoms and patient background…</span>
                </div>
              )}

              <div className="space-y-2">
                {diagnoses.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm border border-dashed border-slate-300 rounded-xl">
                    Search or use AI Suggest to add diagnoses
                  </div>
                )}
                {diagnoses.map(dx => (
                  <div key={dx.code} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="font-mono font-bold text-blue-700 text-xs w-14 shrink-0">{dx.code}</span>
                    <span className="flex-1 text-slate-800 text-sm">{dx.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {dx.isPrimary ? (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded-full">PRIMARY</span>
                      ) : (
                        <button onClick={() => setPrimary(dx.code)} className="px-2 py-0.5 bg-white border border-blue-300 text-blue-600 text-[9px] font-semibold rounded-full hover:bg-blue-50 transition-colors">Set Primary</button>
                      )}
                      <button onClick={() => removeDx(dx.code)} className="p-1 hover:bg-red-100 rounded-lg transition-colors">
                        <X size={12} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Plan */}
        {activeTab === 'plan' && (
          <div className="space-y-4">
            <DictateAIBar section="plan" />

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-teal-900">Prescriptions</h4>
                  <span className="text-[10px] bg-teal-200 text-teal-800 px-1.5 py-0.5 rounded-full font-semibold">0</span>
                </div>
                <button className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors">
                  + Add Prescription
                </button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-blue-900">Lab Orders</h4>
                  <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded-full font-semibold">0</span>
                </div>
                <button className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors">
                  + Order Labs
                </button>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-amber-900">Imaging</h4>
                  <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full font-semibold">0</span>
                </div>
                <button className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors">
                  + Order Imaging
                </button>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-rose-900">Referrals</h4>
                  <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded-full font-semibold">0</span>
                </div>
                <button className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors">
                  + Create Referral
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Treatment Plan &amp; Instructions</label>
              <textarea
                value={planText}
                onChange={e => setPlanText(e.target.value)}
                placeholder="Medications, lifestyle changes, patient instructions…"
                rows={7}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none leading-relaxed transition-colors ${dictatingSection === 'plan' ? 'border-red-400 bg-red-50' : 'border-slate-300'}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Follow-up Instructions</label>
              <input
                value={followUp}
                onChange={e => setFollowUp(e.target.value)}
                placeholder="e.g. Return in 2 weeks for BP check"
                className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
