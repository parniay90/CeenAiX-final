import { useState, useEffect } from 'react';
import DoctorSidebarNew from '../components/doctor/DoctorSidebarNew';
import DoctorTopBarNew from '../components/doctor/DoctorTopBarNew';
import PatientIntelligence from '../components/consultation/PatientIntelligence';
import SOAPEditor from '../components/consultation/SOAPEditor';
import ClinicalAI from '../components/consultation/ClinicalAI';
import PrescriptionModal from '../components/consultation/PrescriptionModal';
import AIVisitRecorder from '../components/consultation/AIVisitRecorder';
import {
  MOCK_CONSULTATION_PATIENT,
  MOCK_DIFFERENTIAL_DIAGNOSES,
  MOCK_GUIDELINE_ALERTS,
  MOCK_PREVENTIVE_CARE,
} from '../types/consultation';
import {
  ArrowLeft, Clock, PhoneOff, Save, Printer, ChevronRight,
  Calendar, Users, FlaskConical, ClipboardList, MessageSquare,
  Video, Mic, MicOff, VideoOff, Check, X,
  Plus, Activity, Pill, Brain, Sparkles
} from 'lucide-react';

const navigateTo = (path: string) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

export default function ConsultationWorkspace() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [showAIRecorder, setShowAIRecorder] = useState(false);
  const [visitType, setVisitType] = useState<'in-person' | 'virtual'>('in-person');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [saved, setSaved] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(false);
  const [labOpen, setLabOpen] = useState(false);
  const [newLab, setNewLab] = useState('');
  const [orderedLabs, setOrderedLabs] = useState<string[]>([]);
  const [activePanel, setActivePanel] = useState<'intel' | 'soap' | 'ai'>('soap');

  useEffect(() => {
    const t = setInterval(() => setSessionDuration(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function addLab() {
    if (!newLab.trim()) return;
    setOrderedLabs(p => [...p, newLab.trim()]);
    setNewLab('');
  }

  const patient = MOCK_CONSULTATION_PATIENT;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <DoctorSidebarNew
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(c => !c)}
        activeTab="consultation"
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBarNew hasCriticalAlert={false} />

        {/* Workspace header */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('/doctor/dashboard')}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm transition-colors"
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>
            <div className="w-px h-5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Live Consultation</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
              <Clock size={13} className="text-slate-500" />
              <span className="font-mono text-slate-700 font-bold text-sm">{fmt(sessionDuration)}</span>
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {patient.patientName} · {patient.bloodType}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setVisitType('in-person'); setShowAIRecorder(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#0A1628] hover:bg-slate-800 text-teal-400 border border-teal-600/40 hover:border-teal-500 transition-all shadow-sm"
            >
              <Brain size={15} />
              AI Recorder
            </button>
            <button
              onClick={() => { setVisitType('virtual'); setShowAIRecorder(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
            >
              <Sparkles size={15} />
              Virtual AI
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
            >
              {saved ? <><Check size={14} /> Saved</> : <><Save size={14} /> Save Notes</>}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Printer size={14} />
              Print
            </button>
            <button
              onClick={() => navigateTo('/doctor/prescribe')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-900 text-white transition-colors"
            >
              <Pill size={14} />
              Prescribe
            </button>
            <button
              onClick={() => setLabOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <FlaskConical size={14} />
              Order Lab
            </button>
            <button
              onClick={() => navigateTo('/doctor/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
            >
              <PhoneOff size={14} />
              End
            </button>
          </div>
        </div>

        {/* Mobile panel switcher */}
        <div className="bg-white border-b border-slate-200 flex items-center gap-1 px-6 shrink-0 xl:hidden">
          {(['intel', 'soap', 'ai'] as const).map(p => (
            <button
              key={p}
              onClick={() => setActivePanel(p)}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${activePanel === p ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {p === 'intel' ? 'Patient Info' : p === 'soap' ? 'SOAP Notes' : 'Clinical AI'}
            </button>
          ))}
        </div>

        {/* Three-column workspace */}
        <div className="flex-1 flex overflow-hidden">

          {/* Left: Patient Intelligence */}
          <div className={`w-[300px] shrink-0 overflow-y-auto border-r border-slate-200 ${activePanel !== 'intel' ? 'hidden xl:block' : ''}`}>
            <PatientIntelligence patient={patient} />
          </div>

          {/* Center: SOAP Editor */}
          <div className={`flex-1 min-w-0 overflow-y-auto ${activePanel !== 'soap' ? 'hidden xl:block' : ''}`}>
            <SOAPEditor />

            {/* Action bar */}
            <div className="border-t border-slate-200 bg-white px-6 py-4 flex items-center gap-3 flex-wrap">
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
              >
                {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Draft</>}
              </button>
              <button
                onClick={() => setLabOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 transition-colors"
              >
                <FlaskConical size={15} />
                Order Labs
              </button>
              <button
                onClick={() => setIsPrescriptionModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white border border-slate-200 hover:border-teal-400 text-slate-700 hover:text-teal-700 transition-colors"
              >
                <Pill size={15} />
                Write Prescription
              </button>
              <button
                onClick={() => navigateTo('/doctor/labs')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white border border-slate-200 hover:border-slate-400 text-slate-700 transition-colors"
              >
                <Activity size={15} />
                Create Referral
              </button>
              <button
                onClick={handleSave}
                className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                <Check size={15} />
                Complete &amp; Sign
              </button>
            </div>
          </div>

          {/* Right: Clinical AI + telemedicine */}
          <div className={`w-[320px] shrink-0 flex flex-col border-l border-slate-200 ${activePanel !== 'ai' ? 'hidden xl:block' : ''}`}>

            {/* Telemedicine mini-panel */}
            <div className="bg-white border-b border-slate-200 p-4 shrink-0">
              <div className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider mb-3">Telemedicine</div>
              <div className="bg-slate-900 rounded-xl aspect-video flex items-center justify-center mb-3">
                <div className="text-center text-slate-600">
                  <Video size={22} className="mx-auto mb-1 opacity-40" />
                  <span className="text-xs opacity-40">Video off</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setMicOn(m => !m)}
                  title={micOn ? 'Mute' : 'Unmute'}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${micOn ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-red-100 text-red-600'}`}
                >
                  {micOn ? <Mic size={16} /> : <MicOff size={16} />}
                </button>
                <button
                  onClick={() => setVideoOn(v => !v)}
                  title={videoOn ? 'Turn off video' : 'Turn on video'}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${videoOn ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-red-100 text-red-600'}`}
                >
                  {videoOn ? <Video size={16} /> : <VideoOff size={16} />}
                </button>
                <button
                  onClick={() => navigateTo('/doctor/dashboard')}
                  title="End call"
                  className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors"
                >
                  <PhoneOff size={16} />
                </button>
              </div>
            </div>

            {/* Clinical AI scrollable */}
            <div className="flex-1 overflow-y-auto">
              <ClinicalAI
                differentials={MOCK_DIFFERENTIAL_DIAGNOSES}
                guidelines={MOCK_GUIDELINE_ALERTS}
                preventiveCare={MOCK_PREVENTIVE_CARE}
              />
            </div>

            {/* Navigation shortcuts */}
            <div className="bg-white border-t border-slate-200 p-4 shrink-0">
              <div className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider mb-2.5">Navigate To</div>
              <div className="space-y-1">
                {[
                  { label: 'Appointments', path: '/doctor/appointments', icon: Calendar },
                  { label: 'Patient Records', path: '/doctor/patients', icon: Users },
                  { label: 'Lab Referrals', path: '/doctor/labs', icon: FlaskConical },
                  { label: 'Write Prescription', path: '/doctor/prescribe', icon: ClipboardList },
                  { label: 'Messages', path: '/doctor/messages', icon: MessageSquare },
                ].map(n => {
                  const Icon = n.icon;
                  return (
                    <button
                      key={n.path}
                      onClick={() => navigateTo(n.path)}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-teal-700 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={13} />
                        <span className="text-xs font-medium">{n.label}</span>
                      </div>
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Visit Recorder */}
      {showAIRecorder && (
        <AIVisitRecorder
          patient={MOCK_CONSULTATION_PATIENT}
          visitType={visitType}
          onClose={() => setShowAIRecorder(false)}
        />
      )}

      {/* Prescription modal */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        onSave={(rx) => {
          console.log('Prescription saved:', rx);
          setIsPrescriptionModalOpen(false);
        }}
      />

      {/* Lab order modal */}
      {labOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FlaskConical size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Order Lab / Imaging</h3>
              </div>
              <button onClick={() => setLabOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                {['BNP', 'CBC', 'CMP', 'Troponin I', 'HbA1c', 'Chest X-Ray', 'Echo', '12-Lead ECG', 'Holter Monitor', 'Lipid Panel'].map(t => (
                  <button
                    key={t}
                    onClick={() => setNewLab(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${newLab === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-400'}`}
                  >{t}</button>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Or type custom test</label>
                <input
                  value={newLab}
                  onChange={e => setNewLab(e.target.value)}
                  placeholder="e.g. Renal Function Panel"
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {orderedLabs.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 font-semibold">Ordered this session:</div>
                  {orderedLabs.map((l, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <Check size={12} className="text-emerald-600" /> {l}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={addLab}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  <Plus size={14} className="inline mr-1" />
                  Order Test
                </button>
                <button
                  onClick={() => { addLab(); setLabOpen(false); navigateTo('/doctor/labs'); }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  Order &amp; Go to Labs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
