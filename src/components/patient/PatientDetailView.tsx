import React, { useState } from 'react';
import { ArrowLeft, Play, MessageSquare, Calendar, MoreVertical, Home, FileText, Heart, AlertTriangle, Pill, FlaskConical, FileImage, File, Lock, TrendingUp, Users, ChevronDown, ChevronUp, CreditCard as Edit, Trash2, Download, Share2 } from 'lucide-react';

interface PatientDetailViewProps {
  patient: any;
  onBack: () => void;
}

const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient, onBack }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null);
  const [showPrivateNoteForm, setShowPrivateNoteForm] = useState(false);
  const [privateNote, setPrivateNote] = useState('');

  const navItems = [
    { id: 'overview', icon: Home, label: 'Overview', color: 'teal' },
    { id: 'consultation-history', icon: FileText, label: 'Consultation History', count: 6, color: 'teal' },
    { id: 'conditions', icon: Heart, label: 'Conditions', count: 4, color: 'teal' },
    { id: 'allergies', icon: AlertTriangle, label: 'Allergies', count: 2, color: 'red' },
    { id: 'medications', icon: Pill, label: 'Medications', count: 4, color: 'teal' },
    { id: 'labs', icon: FlaskConical, label: 'Lab Results', count: 5, color: 'teal' },
    { id: 'imaging', icon: FileImage, label: 'Imaging', count: 4, color: 'teal' },
    { id: 'documents', icon: File, label: 'Documents', count: 6, color: 'teal' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', color: 'teal' },
    { id: 'private-notes', icon: Lock, label: 'Private Notes', color: 'amber' },
    { id: 'risk', icon: TrendingUp, label: 'Risk Assessment', color: 'teal' },
    { id: 'providers', icon: Users, label: 'Other Providers', color: 'teal' }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Top Bar */}
      <div className="fixed top-16 left-[260px] right-0 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 text-[13px] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Patient Records</span>
          </button>
          <span className="text-slate-300">/</span>
          <h1 className="font-bold text-[16px] text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {patient.name}
          </h1>
          <span className="text-[11px] text-slate-400 font-mono">{patient.id}</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-[12px] font-bold rounded-lg">
            🔵 MEDIUM RISK
          </span>
          {patient.allergies.length > 0 && (
            <span className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded">
              ⚠️ {patient.allergies[0]}
            </span>
          )}
          <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-mono">
            {patient.age} · {patient.bloodType} · {patient.insurance}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-teal-600 text-white text-[13px] font-semibold rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Open Workspace</span>
          </button>
          <button className="px-3 py-2 bg-slate-100 text-slate-600 text-[13px] font-medium rounded-lg hover:bg-slate-200 transition-colors">
            <MessageSquare className="w-4 h-4" />
          </button>
          <button className="px-3 py-2 bg-slate-100 text-slate-600 text-[13px] font-medium rounded-lg hover:bg-slate-200 transition-colors">
            <Calendar className="w-4 h-4" />
          </button>
          <button className="px-3 py-2 bg-slate-100 text-slate-600 text-[13px] font-medium rounded-lg hover:bg-slate-200 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nabidh Status Strip */}
      <div className="fixed top-32 left-[260px] right-0 h-8 bg-teal-50 border-b border-teal-100 px-6 flex items-center z-30">
        <p className="text-[11px] text-teal-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          🔵 Nabidh HIE: Synced — 7 April 2026, 2:03 PM · Viewing national + local clinical records
        </p>
      </div>

      {/* Left Navigation */}
      <div className="w-[220px] bg-white border-r border-slate-200 fixed left-[260px] top-40 bottom-0 overflow-y-auto">
        {/* Patient Mini Card */}
        <div className="p-4 bg-teal-50 border-b border-teal-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
              PY
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[14px] text-slate-900 truncate" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {patient.name.split(' ')[0]}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {patient.age} · {patient.bloodType} · {patient.id}
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-600 font-mono space-y-0.5">
            <div>BP 128/82 · HR 72</div>
            <div>Wt 68 kg</div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  activeSection === item.id
                    ? `bg-${item.color}-50 text-${item.color}-700 border-l-3 border-${item.color}-600`
                    : `text-slate-600 hover:bg-slate-50`
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${item.color === 'red' ? 'text-red-500' : item.color === 'amber' ? 'text-amber-500' : ''}`} />
                  <span>{item.label}</span>
                </div>
                {item.count && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({item.count})
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="p-3 border-t border-slate-200 space-y-2">
          <button className="w-full px-3 py-2 bg-teal-600 text-white text-[12px] font-semibold rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2">
            <Play className="w-3.5 h-3.5" />
            <span>Open Workspace</span>
          </button>
          <button className="w-full px-3 py-2 bg-slate-100 text-slate-600 text-[12px] font-medium rounded-lg hover:bg-slate-200 transition-colors">
            💊 Quick Prescribe
          </button>
          <button className="w-full px-3 py-2 bg-slate-100 text-slate-600 text-[12px] font-medium rounded-lg hover:bg-slate-200 transition-colors">
            🔬 Quick Lab Order
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-[220px] overflow-y-auto pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-6 space-y-6">
          {/* Section 1: Overview */}
          <div id="overview" className="scroll-mt-24">
            <h2 className="text-[20px] font-bold text-slate-900 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Overview
            </h2>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="grid grid-cols-2 gap-8">
                {/* Left: Demographics */}
                <div className="space-y-4">
                  <h3 className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-3">
                    DEMOGRAPHICS & IDENTITY
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-[13px]">
                    <div>
                      <div className="text-[10px] text-slate-400 mb-1">Full Name (EN)</div>
                      <div className="text-slate-900 font-medium">{patient.name}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 mb-1">Full Name (AR)</div>
                      <div className="text-slate-900 font-medium">بارنيا يزدخواستي</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 mb-1">DOB</div>
                      <div className="text-slate-900 font-medium">15 March 1988 (38 years)</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 mb-1">Gender</div>
                      <div className="text-slate-900 font-medium">{patient.gender}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 mb-1">Blood Type</div>
                      <div className="inline-block px-2 py-1 bg-red-100 text-red-700 text-[12px] font-mono font-bold rounded">
                        {patient.bloodType}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 mb-1">Nationality</div>
                      <div className="text-slate-900 font-medium">🇮🇷 Iranian</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[10px] text-slate-400 mb-1">Languages</div>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[11px] font-medium rounded">
                          🇬🇧 English
                        </span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[11px] font-medium rounded">
                          🇮🇷 Persian
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div>
                      <div className="text-[10px] text-slate-400 mb-1">Emirates ID</div>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-900 font-mono text-[13px]">784-1988-●●●●●●●-●</span>
                        <button className="text-[10px] text-teal-600 hover:text-teal-700 font-medium">
                          👁 Reveal 30s
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 mb-1">Insurance</div>
                      <div className="text-slate-900 font-medium text-[13px]">
                        Daman National Health Insurance — Gold
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-1">
                        Policy: DAM-2024-IND-047821
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Valid: 1 Jan – 31 Dec 2026
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Clinical Quick Reference */}
                <div className="space-y-4">
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                    <h4 className="text-[11px] uppercase tracking-wider text-teal-700 font-semibold mb-3">
                      RISK SUMMARY
                    </h4>

                    <div className="flex items-center justify-center mb-4">
                      <div className="text-center">
                        <div className="text-[32px] font-mono font-bold text-amber-600">~8%</div>
                        <div className="text-[12px] text-slate-600">10-Year ASCVD Risk</div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1.5">
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-600">✅</span>
                        <span>Hypertension (controlled) — adds risk</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-600">✅</span>
                        <span>CAC Score 42 (mild calcification)</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-600">✅</span>
                        <span>T2 Diabetes (comorbidity)</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-600">✅</span>
                        <span>Non-smoker (protective)</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-emerald-600">✅</span>
                        <span>Statin therapy active (reduces risk)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="text-[11px] uppercase tracking-wider text-blue-700 font-semibold mb-3">
                      UPCOMING CLINICAL ACTIONS
                    </h4>

                    <div className="space-y-2 text-[12px] text-slate-700">
                      <div className="flex items-start space-x-2">
                        <Calendar className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Next appt: Apr 15, 2026 — 8 days</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <FileImage className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>CT thorax follow-up: Feb 2027 (nodules)</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <FlaskConical className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Labs due: Apr 15 (ordered)</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Pill className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Prescriptions valid: until Oct 2026</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="text-[10px] uppercase tracking-wider text-blue-600 font-semibold mb-3">
                      NABIDH HIE — CARE TEAM
                    </h4>

                    <div className="space-y-2 text-[12px]">
                      <div className="text-slate-700">
                        <span className="font-semibold">Dr. Ahmed Al Rashidi</span>
                        <span className="text-slate-500"> (YOU)</span>
                        <div className="text-[11px] text-slate-500">Cardiologist — Al Noor</div>
                      </div>
                      <div className="text-slate-700">
                        <span className="font-semibold">Dr. Fatima Al Mansoori</span>
                        <div className="text-[11px] text-slate-500">Endocrinologist — Dubai Specialist</div>
                      </div>
                      <div className="text-slate-700">
                        <span className="font-semibold">Dr. Tooraj Helmi</span>
                        <div className="text-[11px] text-slate-500">GP — Gulf Medical</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Consultation History */}
          <div id="consultation-history" className="scroll-mt-24">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[20px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Consultation History
                </h2>
                <p className="text-[13px] text-slate-500">6 visits with Dr. Ahmed</p>
              </div>

              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-teal-100 text-teal-700">
                  All ●
                </button>
                <button className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-slate-100 text-slate-600">
                  By Dr. Ahmed
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {/* Visit 6 - Most Recent */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-teal-500">
                <div
                  onClick={() => setExpandedVisit(expandedVisit === 'v6' ? null : 'v6')}
                  className="px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-[13px] font-mono font-bold text-teal-600">
                          7 April 2026 · 9:30 AM
                        </span>
                        <span className="text-[12px] text-slate-500">
                          Post-MRI Cardiology Review · 28 minutes
                        </span>
                        <span className="text-[12px] font-mono text-emerald-600 font-semibold">
                          AED 400 ✅
                        </span>
                      </div>

                      <p className="text-[13px] text-slate-700">
                        HTN well controlled (128/82). MRI findings reviewed. Atorvastatin + Amlodipine renewed. CT Feb 2027 noted.
                      </p>

                      <div className="flex items-center space-x-4 mt-2 text-[11px]">
                        <span className="text-emerald-600 font-mono">✅ SOAP Complete</span>
                        <span className="text-emerald-600 font-mono">✅ Nabidh Synced 9:59 AM</span>
                      </div>
                    </div>

                    <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                      {expandedVisit === 'v6' ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedVisit === 'v6' && (
                  <div className="px-5 pb-5 space-y-4 border-t border-slate-100">
                    {/* Vitals Grid */}
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2 mt-4">
                        VITALS
                      </h4>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <div className="text-[10px] text-slate-400">BP</div>
                          <div className="text-[14px] font-mono font-bold text-emerald-600">128/82</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">HR</div>
                          <div className="text-[14px] font-mono font-bold text-slate-700">72</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">Weight</div>
                          <div className="text-[14px] font-mono font-bold text-slate-700">68 kg</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">SpO2</div>
                          <div className="text-[14px] font-mono font-bold text-emerald-600">99%</div>
                        </div>
                      </div>
                    </div>

                    {/* SOAP */}
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-[11px] font-bold text-blue-700 mb-1">S: SUBJECTIVE</div>
                        <div className="text-[13px] text-slate-700 italic">
                          Patient reviewed cardiac MRI (Feb 2026). No new cardiac symptoms. BP well controlled at home. Medication adherence confirmed.
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-[11px] font-bold text-slate-700 mb-1">O: OBJECTIVE</div>
                        <div className="text-[13px] text-slate-700">
                          BP 128/82 mmHg. HR 72 bpm regular. Weight 68 kg. ECG: NSR. No peripheral edema. Lungs clear.
                        </div>
                      </div>

                      <div className="bg-teal-50 p-4 rounded-lg">
                        <div className="text-[11px] font-bold text-teal-700 mb-1">A: ASSESSMENT</div>
                        <div className="text-[13px] text-slate-700">
                          ICD-10: I10 — Essential Hypertension · Controlled<br />
                          ICD-10: I25.10 — CAC Score 42 · Mild (stable)
                        </div>
                      </div>

                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <div className="text-[11px] font-bold text-emerald-700 mb-1">P: PLAN</div>
                        <div className="text-[13px] text-slate-700">
                          1. Atorvastatin 20mg — renewed (sent Al Shifa) ✅<br />
                          2. Amlodipine 5mg — renewed (sent Al Shifa) ✅<br />
                          3. CT thorax for lung nodules: Feb 2027 (diarized)<br />
                          4. Next: April 15, 2026 ✅
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1.5 border border-slate-300 text-slate-700 text-[12px] font-medium rounded-lg hover:bg-slate-100 transition-colors">
                        <Download className="w-3.5 h-3.5 inline mr-1" />
                        Export
                      </button>
                      <button className="px-3 py-1.5 bg-slate-700 text-white text-[12px] font-medium rounded-lg hover:bg-slate-800 transition-colors">
                        <Edit className="w-3.5 h-3.5 inline mr-1" />
                        Re-open to Amend
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Previous Visits (Collapsed) */}
              {['v5', 'v4', 'v3', 'v2', 'v1'].map((id, idx) => (
                <div key={id} className="bg-white rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-slate-300">
                  <div className="px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-[12px] font-mono text-slate-600">
                        {['15 Feb 2026', '10 Jan 2026', '20 Oct 2023', '15 Jan 2022', '15 Oct 2021'][idx]}
                      </span>
                      <span className="text-[12px] text-slate-500">
                        {['Post-MRI via message', 'CT results + MRI ordered', 'HTN Year 2 + Statin ↑', 'HTN Year 1 + Statin', 'NEW PATIENT | Stage 2 HTN'][idx]}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}

              {/* Nabidh Visits */}
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 mt-4">
                <h4 className="text-[11px] uppercase tracking-wider text-blue-600 font-semibold mb-3">
                  OTHER PROVIDER VISITS — from Nabidh HIE
                </h4>
                <div className="space-y-2 text-[12px] text-slate-700">
                  <div>Dr. Fatima — 5 Mar 2026: Labs review + Rx renewal</div>
                  <div>Dr. Fatima — Oct 2025: HbA1c review</div>
                  <div>Dr. Tooraj — Feb 2026: Respiratory infection (Azithromycin)</div>
                </div>
                <button className="mt-3 text-[12px] text-blue-600 hover:text-blue-700 font-medium">
                  View Dr. Fatima notes →
                </button>
              </div>
            </div>
          </div>

          {/* Section 10: Private Notes */}
          <div id="private-notes" className="scroll-mt-24">
            <h2 className="text-[20px] font-bold text-slate-900 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Private Notes
            </h2>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-amber-100 px-5 py-3 border-b border-amber-200">
                <div className="flex items-center space-x-2 mb-1">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <h3 className="text-[13px] font-bold text-amber-900 uppercase tracking-wider">
                    DOCTOR'S PRIVATE NOTES
                  </h3>
                </div>
                <p className="text-[11px] text-amber-700">
                  Visible only to: Dr. Ahmed Al Rashidi · Not visible to patient, other providers, or Nabidh · All access and edits are audit-logged
                </p>
              </div>

              {/* Notes */}
              <div className="p-5 space-y-4">
                {/* Note 1 */}
                <div className="bg-white rounded-lg border border-amber-200 p-4">
                  <p className="text-[13px] text-slate-700 mb-3">
                    Patient very engaged with her health — asks detailed questions. Responds well to data-driven explanations.
                    Iranian background — note cultural context. Works in AI industry — understands technical explanations.
                    ⚠️ DIARIZE: Book CT chest Feb 2027 — lung nodules follow-up. ASPIRIN CONSIDERATION: 10-year CVD risk ~8% —
                    borderline for aspirin. Discuss at April 15 visit.
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-amber-700 font-mono">
                    <span>7 April 2026, 9:59 AM · Dr. Ahmed</span>
                    <div className="flex items-center space-x-2">
                      <button className="hover:text-amber-900">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button className="hover:text-amber-900">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Note 2 */}
                <div className="bg-white rounded-lg border border-amber-200 p-4">
                  <p className="text-[13px] text-slate-700 mb-3">
                    Patient slightly anxious about cardiac findings. Reassured with detailed data explanation — responded well.
                    Prefers to receive comprehensive written summaries.
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-amber-700 font-mono">
                    <span>10 January 2026, 10:15 AM · Dr. Ahmed</span>
                    <div className="flex items-center space-x-2">
                      <button className="hover:text-amber-900">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button className="hover:text-amber-900">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add Note Form */}
                {showPrivateNoteForm ? (
                  <div className="bg-white rounded-lg border border-amber-200 p-4">
                    <textarea
                      value={privateNote}
                      onChange={(e) => setPrivateNote(e.target.value)}
                      placeholder="Write private note..."
                      className="w-full h-32 px-3 py-2 border border-amber-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    <div className="flex items-center space-x-2 mt-3">
                      <button
                        onClick={() => {
                          setShowPrivateNoteForm(false);
                          setPrivateNote('');
                        }}
                        className="px-4 py-2 bg-amber-600 text-white text-[13px] font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Save Note
                      </button>
                      <button
                        onClick={() => {
                          setShowPrivateNoteForm(false);
                          setPrivateNote('');
                        }}
                        className="px-4 py-2 border border-amber-300 text-amber-700 text-[13px] font-medium rounded-lg hover:bg-amber-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPrivateNoteForm(true)}
                    className="w-full px-4 py-3 border-2 border-dashed border-amber-300 text-amber-700 text-[13px] font-semibold rounded-lg hover:bg-amber-100 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Add Private Note</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Placeholder sections for other areas */}
          <div id="conditions" className="scroll-mt-24 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-[20px] font-bold text-slate-900 mb-4">Conditions & Diagnoses</h2>
            <p className="text-slate-500">Section content here...</p>
          </div>

          <div id="allergies" className="scroll-mt-24 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-[20px] font-bold text-slate-900 mb-4">Allergies</h2>
            <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl mb-4">
              <div className="text-[12px] font-bold text-red-700 mb-2">
                ⚠️ CRITICAL SAFETY — ALWAYS VERIFY BEFORE PRESCRIBING
              </div>
              {patient.allergies.map((allergy: string, idx: number) => (
                <div key={idx} className="bg-white border border-red-200 rounded-lg p-4 mt-2">
                  <h3 className="text-[16px] font-bold text-red-900 mb-2">{allergy}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-red-700 text-white text-[10px] font-bold rounded">
                      {allergy.includes('SEVERE') ? 'SEVERE — ANAPHYLAXIS' : 'MODERATE — Rash'}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-600">
                    Nabidh: ✅ Registered nationally
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div id="medications" className="scroll-mt-24 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-[20px] font-bold text-slate-900 mb-4">Medications</h2>
            <p className="text-slate-500">Active medications content here...</p>
          </div>

          <div id="labs" className="scroll-mt-24 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-[20px] font-bold text-slate-900 mb-4">Laboratory Results</h2>
            <p className="text-slate-500">Lab results content here...</p>
          </div>

          <div id="imaging" className="scroll-mt-24 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-[20px] font-bold text-slate-900 mb-4">Imaging & Radiology Studies</h2>
            <p className="text-slate-500">Imaging studies content here...</p>
          </div>

          <div id="documents" className="scroll-mt-24 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-[20px] font-bold text-slate-900 mb-4">Documents</h2>
            <p className="text-slate-500">Documents content here...</p>
          </div>

          <div id="messages" className="scroll-mt-24 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-[20px] font-bold text-slate-900 mb-4">Messages</h2>
            <p className="text-slate-500">Message history content here...</p>
          </div>

          <div id="risk" className="scroll-mt-24 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-[20px] font-bold text-slate-900 mb-4">Cardiovascular Risk Assessment</h2>
            <p className="text-slate-500">Risk assessment content here...</p>
          </div>

          <div id="providers" className="scroll-mt-24 bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h2 className="text-[20px] font-bold text-slate-900 mb-4">Other Providers</h2>
            <p className="text-slate-600">Provider information from Nabidh HIE...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailView;
