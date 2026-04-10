import { useState } from 'react';
import { ArrowLeft, ScanLine, Heart, Activity, AlertTriangle, Calendar, CheckCircle, FileText, Brain } from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import type { MRIStudy, MRIStats, MRISafetyScreening } from '../types/mriTypes';

type TabType = 'studies' | 'viewer' | 'reports' | 'findings' | 'prepare';

export default function MRIScans() {
  const [activeTab, setActiveTab] = useState<TabType>('studies');
  const [showWhatIsMRI, setShowWhatIsMRI] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const safetyScreening: MRISafetyScreening = {
    metalImplants: false,
    pacemaker: false,
    cochlearImplants: false,
    previousMRI: true,
    previousMRICount: 2,
    gadoliniumAllergy: false,
    kidneyProblems: false,
    pregnancy: false,
    claustrophobia: true,
    claustrophobiaSeverity: 'mild',
    cleared: true
  };

  const stats: MRIStats = {
    totalMRIs: 2,
    latestDate: '15 Feb',
    daysAgoLatest: 49,
    findingsToMonitor: 2,
    heartLVEF: 64,
    backStatus: 'L5/S1'
  };

  const studies: MRIStudy[] = [
    {
      id: 'mri-1',
      studyType: 'Cardiac MRI with LGE',
      fullName: 'Cardiovascular MRI — Late Gadolinium Enhancement',
      bodyPart: 'Cardiac',
      studyDate: '15 February 2026',
      studyTime: '09:15 AM',
      duration: 45,
      magnet: '1.5T Siemens MAGNETOM Aera',
      contrast: true,
      contrastAgent: 'Gadolinium (Dotarem)',
      contrastDose: '0.2 mmol/kg IV',
      facility: 'Al Noor Medical Center — Advanced Imaging Suite',
      facilityDHA: 'DHA-FAC-2018-031204',
      facilityLocation: 'Jumeirah, Dubai',
      radiologist: 'Dr. Rania Al Suwaidi',
      radiologistCredentials: 'FRCR, FSCMR',
      radiologistDHA: 'DHA-PRAC-2017-052314',
      orderedBy: 'Dr. Ahmed Al Rashidi',
      orderedBySpecialty: 'Cardiologist',
      indication: 'Comprehensive cardiac evaluation — hypertensive patient with mild CAC on prior CT. Assess myocardial function, viability, and tissue characterization.',
      safetyCleared: true,
      claustrophobiaNote: 'Mild claustrophobia — open-bore position used. Music provided.',
      sequences: [
        {
          id: 'seq-1',
          sequenceType: 'CINE_SSFP',
          sequenceName: 'Cine SSFP',
          badge: 'CINE',
          purpose: 'Cardiac function assessment',
          result: 'LVEF 64% — Normal',
          resultStatus: 'normal',
          frameCount: 25,
          isCine: true
        },
        {
          id: 'seq-2',
          sequenceType: 'T1_MAPPING',
          sequenceName: 'T1 Mapping',
          badge: 'T1',
          purpose: 'Myocardial tissue characterization',
          result: '1024 ms — Mildly elevated',
          resultStatus: 'monitoring'
        },
        {
          id: 'seq-3',
          sequenceType: 'T2_STIR',
          sequenceName: 'T2-STIR',
          badge: 'T2',
          purpose: 'Myocardial edema assessment',
          result: 'No edema',
          resultStatus: 'normal'
        },
        {
          id: 'seq-4',
          sequenceType: 'LGE',
          sequenceName: 'Late Gadolinium Enhancement',
          badge: 'LGE',
          purpose: 'Scar/fibrosis detection',
          result: 'No enhancement — No scar',
          resultStatus: 'normal'
        },
        {
          id: 'seq-5',
          sequenceType: 'T2_STAR',
          sequenceName: 'T2*',
          badge: 'T2*',
          purpose: 'Iron/hemorrhage assessment',
          result: 'Normal',
          resultStatus: 'normal'
        },
        {
          id: 'seq-6',
          sequenceType: 'PHASE_CONTRAST',
          sequenceName: 'Phase Contrast',
          badge: 'PHASE',
          purpose: 'Flow quantification',
          result: 'Normal',
          resultStatus: 'normal'
        }
      ],
      findings: [
        {
          id: 'finding-1-1',
          category: 'Left Ventricular Function',
          finding: 'Normal LV systolic function',
          severity: 'normal',
          severityLabel: 'Normal',
          measurement: 'LVEF 64%',
          plainEnglish: 'Your heart\'s main pumping chamber is working perfectly. LVEF of 64% means your heart is pumping out 64% of the blood with each beat, which is completely normal (normal is 55-70%). This is great news for someone with diabetes.',
          technicalDescription: 'LV dimensions normal. No regional wall motion abnormalities. LVEF 64% by Simpson\'s biplane method. Normal LV diastolic function.',
          color: '#10b981'
        },
        {
          id: 'finding-1-2',
          category: 'Myocardial Tissue',
          finding: 'Mildly elevated native T1',
          severity: 'mild',
          severityLabel: 'Mild',
          measurement: 'T1: 1024 ms',
          plainEnglish: 'The T1 mapping sequence measured your heart muscle health. Your T1 value is 1024 ms — slightly above average (950 ms). This suggests very early, subtle changes from years of high blood pressure — NOT damage.',
          technicalDescription: 'Native T1 = 1024 ms (reference 950 ± 25 ms). Mildly elevated — possible early diffuse myocardial fibrosis in hypertensive heart disease context.',
          color: '#f59e0b',
          whatItDoesNotMean: [
            'You had a heart attack',
            'Your heart is damaged',
            'You need urgent treatment'
          ],
          whatItDoesMean: [
            'Very early, subtle changes from blood pressure',
            'Your Amlodipine is the right medicine',
            'Controlling BP will prevent this worsening',
            'Recheck in 2–3 years (next MRI: 2028–2029)'
          ],
          visualData: {
            type: 'gauge',
            data: {
              value: 1024,
              normal: 975,
              mild: 1050,
              high: 1100,
              unit: 'ms'
            }
          }
        },
        {
          id: 'finding-1-3',
          category: 'Late Gadolinium Enhancement',
          finding: 'No LGE — No scarring',
          severity: 'normal',
          severityLabel: 'Normal',
          plainEnglish: 'The LGE scan showed absolutely no scarring or old heart attack damage. Your heart muscle tissue is intact. This is excellent news.',
          technicalDescription: 'No focal or diffuse LGE identified. No evidence of myocardial infarction, myocarditis, or significant focal fibrosis.',
          color: '#10b981'
        },
        {
          id: 'finding-1-4',
          category: 'Incidental — Lungs',
          finding: 'Bilateral pulmonary micronodules',
          severity: 'mild',
          severityLabel: 'Monitor',
          measurement: 'Largest: 3.8mm',
          plainEnglish: 'Very tiny spots (3.8 mm) in the lungs — smaller than a grain of rice. At this size they are almost certainly harmless — often just old infection scars. CT follow-up in 1 year is standard best practice.',
          technicalDescription: 'Bilateral pulmonary micronodules, largest measuring 3.8 mm in right lower lobe. Below threshold for MRI characterization. Recommend CT thorax follow-up in 12 months per Fleischner guidelines.',
          color: '#f59e0b',
          visualData: {
            type: 'comparison',
            data: {
              noduleSize: 3.8,
              comparisons: [
                { name: 'Marble', size: 15 },
                { name: 'Pea', size: 8 },
                { name: 'Rice grain', size: 5 },
                { name: 'Your spot', size: 3.8 }
              ]
            }
          }
        }
      ],
      impression: 'Normal biventricular systolic function (LVEF 64%). Mildly elevated native T1 (1024 ms) — possible early diffuse myocardial fibrosis in hypertensive heart disease context. No focal LGE. No myocardial infarction or significant fibrosis. Trace mitral regurgitation — not significant. Incidental bilateral pulmonary micronodules <4mm — recommend CT follow-up in 12 months.',
      overallStatus: 'mostly-normal',
      overallStatusLabel: 'Mostly Normal — 2 minor notes',
      doctorReviewed: true,
      reviewedBy: 'Dr. Ahmed Al Rashidi',
      reviewedDate: '17 Feb 2026',
      doctorNote: 'Great news from your cardiac MRI, Parnia! Your heart muscle is healthy — no scarring, no past heart attack, pumping well at 64%. The slight T1 elevation is a very early sign of how hypertension affects the heart muscle over years — this is why controlling your BP with Amlodipine is so important. The tiny lung spots are very common, very small, and almost certainly harmless — we\'ll just check them with a CT scan in a year as a precaution. Overall I\'m very pleased with these results! 🎉',
      reportRef: 'DHA-RAD-RPT-2026-00289',
      nabidh: true,
      fhirSubmitted: true,
      followUpPlan: 'Continue antihypertensive therapy. Repeat cardiac MRI in 2–3 years. CT thorax follow-up in 12 months.',
      daysAgo: 49
    },
    {
      id: 'mri-2',
      studyType: 'MRI Lumbar Spine',
      fullName: 'MRI Lumbar Spine — Non-contrast',
      bodyPart: 'Spine',
      studyDate: '12 September 2025',
      studyTime: '02:45 PM',
      duration: 35,
      magnet: '1.5T',
      contrast: false,
      facility: 'Emirates Diagnostics Centre',
      facilityDHA: 'DHA-FAC-2019-041233',
      facilityLocation: 'Al Barsha, Dubai',
      radiologist: 'Dr. Omar Al Farsi',
      radiologistCredentials: 'FRCR',
      radiologistDHA: 'DHA-PRAC-2019-041233',
      orderedBy: 'Dr. Tooraj Helmi',
      orderedBySpecialty: 'General Practitioner',
      indication: 'Lower back pain for 3 weeks — radiating to left leg. Rule out disc herniation or nerve compression.',
      safetyCleared: true,
      sequences: [
        {
          id: 'seq-2-1',
          sequenceType: 'T1W_SAG',
          sequenceName: 'T1W Sagittal',
          badge: 'T1W SAG',
          purpose: 'Anatomy overview',
          result: 'Normal vertebral alignment',
          resultStatus: 'normal'
        },
        {
          id: 'seq-2-2',
          sequenceType: 'T2W_SAG',
          sequenceName: 'T2W Sagittal',
          badge: 'T2W SAG',
          purpose: 'Disc hydration, nerve assessment',
          result: 'L5/S1 degeneration noted',
          resultStatus: 'abnormal'
        },
        {
          id: 'seq-2-3',
          sequenceType: 'T2W_AXL',
          sequenceName: 'T2W Axial',
          badge: 'T2W AXL',
          purpose: 'Cross-sectional nerve assessment',
          result: '4mm protrusion at L5/S1',
          resultStatus: 'abnormal'
        },
        {
          id: 'seq-2-4',
          sequenceType: 'STIR',
          sequenceName: 'STIR Sagittal',
          badge: 'STIR',
          purpose: 'Edema/inflammation assessment',
          result: 'Mild paraspinal strain',
          resultStatus: 'abnormal'
        }
      ],
      findings: [
        {
          id: 'finding-2-1',
          category: 'Intervertebral Discs',
          finding: 'L5/S1 mild disc degeneration with posterior protrusion',
          severity: 'resolved',
          severityLabel: 'Resolved',
          measurement: '4mm posterior protrusion',
          plainEnglish: 'A mild disc bulge at the bottom of your spine was found to be gently touching the L5 nerve root — causing your back pain and left leg symptoms. After 6 weeks of physiotherapy, symptoms fully resolved.',
          technicalDescription: 'L5/S1: Mild disc degeneration with reduced disc height, reduced T2 signal (dehydration). Broad-based posterior disc protrusion 4mm. Mild bilateral neural foraminal narrowing. No frank spinal canal stenosis.',
          color: '#10b981',
          visualData: {
            type: 'diagram',
            data: {
              levels: ['L1/L2', 'L2/L3', 'L3/L4', 'L4/L5', 'L5/S1'],
              affected: 'L5/S1',
              grade: 1
            }
          }
        }
      ],
      impression: 'L5/S1 mild disc degeneration with 4mm posterior protrusion causing mild left L5 nerve root contact. This correlates clinically with left-sided sciatica. No cauda equina syndrome. Conservative management appropriate.',
      overallStatus: 'findings',
      overallStatusLabel: 'Disc finding — RESOLVED',
      doctorReviewed: true,
      reviewedBy: 'Dr. Tooraj Helmi',
      reviewedDate: '14 Sep 2025',
      doctorNote: 'The MRI shows a mild disc bulge at the bottom of your spine that\'s gently touching a nerve — this is what\'s causing your back pain and leg symptoms. It\'s a Grade 1 bulge — the mildest type. The good news is these often get better on their own with physiotherapy and time. I\'ve referred you to a physiotherapist. Avoid heavy lifting, and the pain medication I prescribed should help in the meantime. Come back in 6 weeks if not improving.',
      reportRef: 'DHA-RAD-RPT-2025-00847',
      nabidh: true,
      fhirSubmitted: true,
      resolutionNote: 'Resolved with physiotherapy by Nov 2025 — Dr. Tooraj noted improvement in record',
      daysAgo: 207
    }
  ];

  const tabs = [
    { id: 'studies' as TabType, label: 'My MRI Studies', icon: ScanLine, count: 2 },
    { id: 'viewer' as TabType, label: 'MRI Viewer', icon: Brain },
    { id: 'reports' as TabType, label: 'Reports', icon: FileText },
    { id: 'findings' as TabType, label: 'Findings Explained', icon: CheckCircle },
    { id: 'prepare' as TabType, label: 'MRI Guide', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 flex">
      <PatientSidebar currentPage="imaging" />

      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                    MRI Scans 🧲
                  </h1>
                </div>
                <p className="text-slate-500 text-sm">
                  Magnetic Resonance Imaging — detailed soft tissue studies
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/imaging"
                  className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  All Imaging Studies
                </a>
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/30"
                >
                  <ScanLine className="w-5 h-5" />
                  Request MRI
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowWhatIsMRI(!showWhatIsMRI)}
            className="w-full mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-left hover:bg-indigo-100 transition-all animate-slideUp"
            style={{ animationDelay: '80ms' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">ℹ️</span>
                <span className="text-sm font-bold text-indigo-900">What is MRI? Learn more</span>
              </div>
              <span className="text-indigo-600">{showWhatIsMRI ? '▲' : '▼'}</span>
            </div>

            {showWhatIsMRI && (
              <div className="mt-6 pt-6 border-t border-indigo-200 grid grid-cols-3 gap-6">
                <div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                    <ScanLine className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">How MRI Works</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    MRI uses powerful magnets and radio waves — NOT radiation (unlike X-ray or CT scan).
                    It creates detailed images of your body's soft tissues: muscles, organs, brain, nerves, and discs.
                    It's completely safe — no radiation.
                  </p>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: '40%' }} />
                      </div>
                      <span className="text-slate-500 w-16">X-Ray</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-orange-500 h-full" style={{ width: '80%' }} />
                      </div>
                      <span className="text-slate-500 w-16">CT Scan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2" />
                      <span className="text-emerald-600 font-bold w-16">MRI: ZERO ✅</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                    <Activity className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">During an MRI Scan</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    You lie still inside a large tube-shaped machine. It makes loud knocking and buzzing noises —
                    this is completely normal. Most scans take 30–60 minutes. You can listen to music!
                  </p>
                </div>

                <div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Your MRI Safety Status</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>No metal implants</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>No pacemaker</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>Gadolinium allergy: None</span>
                    </div>
                    {safetyScreening.claustrophobia && (
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                        💡 Mild claustrophobia — open-bore position used. Music provided.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </button>

          <div className="grid grid-cols-5 gap-4 mb-8">
            <div
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 animate-slideUp"
              style={{ animationDelay: '160ms' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <ScanLine className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'DM Mono, monospace' }}>
                  {stats.totalMRIs}
                </div>
              </div>
              <div className="text-xs text-slate-600">MRI Studies</div>
              <div className="text-xs text-indigo-600 mt-1">Cardiac · Lumbar Spine</div>
            </div>

            <div
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 animate-slideUp"
              style={{ animationDelay: '240ms' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'DM Mono, monospace' }}>
                  {stats.latestDate}
                </div>
              </div>
              <div className="text-xs text-slate-600">Latest MRI</div>
              <div className="text-xs text-slate-400 mt-1">{stats.daysAgoLatest} days ago</div>
            </div>

            <div
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 animate-slideUp"
              style={{ animationDelay: '320ms' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-amber-600" style={{ fontFamily: 'DM Mono, monospace' }}>
                  {stats.findingsToMonitor}
                </div>
              </div>
              <div className="text-xs text-slate-600">Notes to Follow Up</div>
              <div className="text-xs text-slate-400 mt-1">Both minor — being monitored</div>
            </div>

            <div
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 animate-slideUp"
              style={{ animationDelay: '400ms' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-2xl font-bold text-emerald-600" style={{ fontFamily: 'DM Mono, monospace' }}>
                  {stats.heartLVEF}%
                </div>
              </div>
              <div className="text-xs text-slate-600">Heart Pumping (LVEF)</div>
              <div className="text-xs text-emerald-600 mt-1">Normal ✅ — Feb 2026</div>
            </div>

            <div
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 animate-slideUp"
              style={{ animationDelay: '480ms' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-xl font-bold text-amber-600" style={{ fontFamily: 'DM Mono, monospace' }}>
                  {stats.backStatus}
                </div>
              </div>
              <div className="text-xs text-slate-600">Disc Finding</div>
              <div className="text-xs text-emerald-600 mt-1">Resolved with physio ✅</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-slideUp" style={{ animationDelay: '560ms' }}>
            <div className="border-b border-slate-200">
              <div className="flex">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'text-indigo-600 border-b-3 border-indigo-600 bg-indigo-50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Icon className="w-4 h-4" />
                        {tab.label}
                        {tab.count && (
                          <span className="ml-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                            {tab.count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-8">
              {activeTab === 'studies' && <div>Studies tab content</div>}
              {activeTab === 'viewer' && <div>Viewer tab content</div>}
              {activeTab === 'reports' && <div>Reports tab content</div>}
              {activeTab === 'findings' && <div>Findings tab content</div>}
              {activeTab === 'prepare' && <div>Prepare tab content</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
