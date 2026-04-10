import React, { useState, useEffect } from 'react';
import DoctorSidebarNew from '../components/doctor/DoctorSidebarNew';
import {
  AlertOctagon,
  Clock,
  FlaskConical,
  CheckCircle2,
  CalendarCheck,
  HeartPulse,
  Search,
  Plus,
  X,
  ChevronDown,
  Loader2,
  Copy,
  Printer,
  FileText,
  Bell,
  TrendingUp,
  Phone,
  Calendar,
  BarChart3,
  ClipboardList,
  ArrowUp,
  ArrowDown,
  Home,
  User,
  Send
} from 'lucide-react';

interface LabTest {
  id: string;
  name: string;
  loinc: string;
  priority: 'STAT' | 'Urgent' | 'Routine';
  status: 'pending' | 'in_progress' | 'resulted';
  price: number;
}

interface LabOrder {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: string;
  patientInsurance: string;
  tests: LabTest[];
  orderedTime: string;
  expectedTime: string;
  clinicalIndication: string;
  lab: string;
  priority: 'STAT' | 'Urgent' | 'Routine';
  status: 'pending' | 'in_progress' | 'resulted';
}

interface LabResult {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  value: string;
  unit: string;
  reference: string;
  flag: 'critical' | 'high' | 'low' | 'normal';
  resultTime: string;
  acknowledged: boolean;
  reviewNote?: string;
}

const LabReferrals: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'critical' | 'pending' | 'results' | 'scheduled'>('critical');
  const [showAcknowledgeModal, setShowAcknowledgeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedTests, setSelectedTests] = useState<LabTest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [acknowledgmentChecks, setAcknowledgmentChecks] = useState({
    reviewed: false,
    careProvided: false,
    transferred: false,
    noAction: false,
    understand: false
  });
  const [timeUnacknowledged, setTimeUnacknowledged] = useState('1:20:14');
  const [expandedResults, setExpandedResults] = useState<string[]>([]);
  const [showTrend, setShowTrend] = useState<string | null>(null);

  const criticalResult: LabResult = {
    id: 'RES-001',
    patientId: 'PT-005',
    patientName: 'Abdullah Hassan Al Zaabi',
    testName: 'Troponin I',
    value: '2.8',
    unit: 'ng/mL',
    reference: '< 0.04',
    flag: 'critical',
    resultTime: '11:47 AM',
    acknowledged: false
  };

  const pendingOrders: LabOrder[] = [
    {
      id: 'LAB-003891',
      patientId: 'PT-006',
      patientName: 'Aisha Mohammed Al Reem',
      patientAge: '42F',
      patientInsurance: 'AXA Gulf',
      tests: [
        { id: 'T1', name: 'BNP/NT-proBNP', loinc: '42637-9', priority: 'Urgent', status: 'pending', price: 180 },
        { id: 'T2', name: 'Electrolytes (K+/Na+/Cl-)', loinc: '24326-1', priority: 'Urgent', status: 'pending', price: 120 },
        { id: 'T3', name: 'Renal Function (Cr, eGFR)', loinc: '33914-3', priority: 'Urgent', status: 'pending', price: 130 }
      ],
      orderedTime: '2:05 PM (2 min ago)',
      expectedTime: '~6:00 PM today',
      clinicalIndication: 'Heart failure follow-up. Weight +2kg, dyspnea worse. Check fluid status + K+ (on RAAS therapy)',
      lab: 'Dubai Medical Laboratory — Healthcare City',
      priority: 'Urgent',
      status: 'pending'
    },
    {
      id: 'LAB-003847',
      patientId: 'PT-004',
      patientName: 'Mohammed Rashid Al Shamsi',
      patientAge: '48M',
      patientInsurance: 'Daman Basic',
      tests: [
        { id: 'T4', name: 'Troponin I (high-sensitivity)', loinc: '42637-9', priority: 'STAT', status: 'pending', price: 200 },
        { id: 'T5', name: 'BNP/NT-proBNP', loinc: '42637-9', priority: 'Urgent', status: 'pending', price: 180 },
        { id: 'T6', name: 'Lipid Panel (Full)', loinc: '57698-3', priority: 'Routine', status: 'pending', price: 150 },
        { id: 'T7', name: 'CBC with differential', loinc: '58410-2', priority: 'Routine', status: 'pending', price: 100 }
      ],
      orderedTime: '10:35 AM (3h 32min ago)',
      expectedTime: '~5:00 PM today',
      clinicalIndication: 'New patient — atypical chest pain 3 weeks, smoker, family history MI at 58. Rule out ACS. Pre-HTN noted.',
      lab: 'Dubai Medical Laboratory',
      priority: 'STAT',
      status: 'pending'
    },
    {
      id: 'LAB-003802',
      patientId: 'PT-008',
      patientName: 'Noura Bint Khalid Al Hamdan',
      patientAge: '34F',
      patientInsurance: 'Daman Basic',
      tests: [
        { id: 'T8', name: '12-lead ECG (in-clinic)', loinc: 'ECG-001', priority: 'Routine', status: 'resulted', price: 80 },
        { id: 'T9', name: '24h Holter Monitor', loinc: 'HOLTER-001', priority: 'Routine', status: 'pending', price: 350 },
        { id: 'T10', name: 'TSH / Free T4', loinc: '11579-0', priority: 'Routine', status: 'pending', price: 140 },
        { id: 'T11', name: 'CBC with differential', loinc: '58410-2', priority: 'Routine', status: 'pending', price: 100 }
      ],
      orderedTime: '9:00 AM (5h 7min ago)',
      expectedTime: 'Blood results: 9 April 2026',
      clinicalIndication: 'New patient — palpitations 6 weeks, anxiety background. Rule out arrhythmia, thyroid disorder, anemia.',
      lab: 'In-clinic (ECG/Holter) + Emirates Diagnostics',
      priority: 'Routine',
      status: 'pending'
    }
  ];

  const testCatalog = [
    { id: '1', name: 'Troponin I (high-sensitivity)', loinc: '42637-9', price: 200, category: 'Cardiac Markers' },
    { id: '2', name: 'BNP/NT-proBNP', loinc: '42637-9', price: 180, category: 'Cardiac Markers' },
    { id: '3', name: 'CK-MB', loinc: '13969-1', price: 120, category: 'Cardiac Markers' },
    { id: '4', name: 'D-Dimer', loinc: '48065-7', price: 150, category: 'Cardiac Markers' },
    { id: '5', name: 'Full Lipid Panel', loinc: '57698-3', price: 150, category: 'Lipids' },
    { id: '6', name: 'LDL Cholesterol', loinc: '13457-7', price: 80, category: 'Lipids' },
    { id: '7', name: 'HDL Cholesterol', loinc: '2085-9', price: 80, category: 'Lipids' },
    { id: '8', name: 'Electrolytes Panel (K+/Na+/Cl-)', loinc: '24326-1', price: 120, category: 'Metabolic' },
    { id: '9', name: 'Renal Function (Creatinine, eGFR)', loinc: '33914-3', price: 130, category: 'Metabolic' },
    { id: '10', name: 'HbA1c', loinc: '4548-4', price: 110, category: 'Metabolic' },
    { id: '11', name: 'Fasting Glucose', loinc: '1558-6', price: 60, category: 'Metabolic' },
    { id: '12', name: 'TSH / Thyroid Panel', loinc: '11579-0', price: 140, category: 'Metabolic' },
    { id: '13', name: 'CBC with Differential', loinc: '58410-2', price: 100, category: 'Haematology' },
    { id: '14', name: 'INR/PT (Warfarin monitoring)', loinc: '5902-2', price: 90, category: 'Haematology' },
    { id: '15', name: 'CRP (C-reactive protein)', loinc: '1988-5', price: 100, category: 'Inflammatory' }
  ];

  const ldlTrendData = [
    { date: 'Oct 2021', value: 142 },
    { date: 'Jan 2022', value: 128 },
    { date: 'Oct 2023', value: 118 },
    { date: 'Mar 2026', value: 118 }
  ];

  useEffect(() => {
    setSelectedPatient({
      id: 'PT-006',
      name: 'Aisha Mohammed Al Reem',
      age: '42F',
      insurance: 'AXA Gulf Standard',
      conditions: 'HFrEF (LVEF 38%) · HTN · T2DM',
      recentLabs: 'BNP: 450 (Jan) · K+: 4.1 (Jan)',
      medAlert: '⚠️ Enalapril + Spironolactone → K+ monitoring needed'
    });

    const timer = setInterval(() => {
      const [h, m, s] = timeUnacknowledged.split(':').map(Number);
      let newS = s + 1;
      let newM = m;
      let newH = h;

      if (newS >= 60) {
        newS = 0;
        newM++;
      }
      if (newM >= 60) {
        newM = 0;
        newH++;
      }

      setTimeUnacknowledged(`${newH}:${String(newM).padStart(2, '0')}:${String(newS).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeUnacknowledged]);

  const handleAcknowledge = () => {
    if (Object.values(acknowledgmentChecks).every(v => v)) {
      setShowAcknowledgeModal(false);
      setShowSuccessModal(true);
    }
  };

  const addTest = (test: any) => {
    const newTest: LabTest = {
      id: `T${Date.now()}`,
      name: test.name,
      loinc: test.loinc,
      priority: 'Urgent',
      status: 'pending',
      price: test.price
    };
    setSelectedTests([...selectedTests, newTest]);
    setSearchQuery('');
  };

  const removeTest = (testId: string) => {
    setSelectedTests(selectedTests.filter(t => t.id !== testId));
  };

  const toggleExpanded = (resultId: string) => {
    if (expandedResults.includes(resultId)) {
      setExpandedResults(expandedResults.filter(id => id !== resultId));
    } else {
      setExpandedResults([...expandedResults, resultId]);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <DoctorSidebarNew />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Header */}
        <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-[22px] text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Lab Referrals
            </h1>
            <p className="text-[13px] text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
              Orders · Results · Critical Alerts · DHA Compliance
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button className="px-4 py-2.5 bg-teal-600 text-white text-[13px] font-bold rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Lab Order</span>
            </button>

            <button className="px-4 py-2 bg-slate-100 text-slate-700 text-[13px] font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center space-x-2">
              <ClipboardList className="w-4 h-4" />
              <span>All Results</span>
            </button>

            <button className="px-4 py-2 bg-slate-100 text-slate-700 text-[13px] font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button className="relative">
              <Bell className="w-5 h-5 text-slate-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                1
              </div>
            </button>

            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer">
              AA
            </div>
          </div>
        </div>

        {/* Critical Result Banner */}
        {!criticalResult.acknowledged && (
          <div className="bg-red-50 border-b-2 border-red-200 px-6 py-4 shadow-lg shadow-red-100/50 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <AlertOctagon className="w-8 h-8 text-red-600 animate-pulse" />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-bold text-[14px] text-red-700" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      🔴 CRITICAL RESULT — ACKNOWLEDGMENT REQUIRED
                    </h3>
                    <div className="font-mono text-[12px] text-red-500">
                      DHA compliance overdue — {timeUnacknowledged}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-bold text-[18px] text-red-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {criticalResult.patientName}
                      </div>
                      <div className="text-[14px] text-red-700">
                        {criticalResult.testName}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono font-bold text-[32px] text-red-700">
                        {criticalResult.value} <span className="text-[18px]">{criticalResult.unit}</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-600">
                        Reference: {criticalResult.reference} {criticalResult.unit}
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-red-700 text-white text-[12px] font-bold rounded">
                      CRITICAL HIGH ↑↑
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAcknowledgeModal(true)}
                  className="px-6 py-3 bg-red-600 text-white text-[14px] font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Acknowledge This Result</span>
                </button>
                <button className="px-4 py-2 bg-red-100 text-red-700 text-[13px] font-semibold rounded-lg hover:bg-red-200 transition-colors">
                  View Patient
                </button>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-red-500 italic">
              ⚠️ UAE DHA requires critical lab value acknowledgment within 1 hour. This is overdue. Acknowledgment logged to Nabidh for compliance audit.
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* KPI Strip */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {/* Critical Unacknowledged */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-red-200 p-5 hover:shadow-lg transition-all cursor-pointer animate-pulse">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertOctagon className="w-6 h-6 text-red-600" />
                </div>
                <div className="font-mono font-bold text-[30px] text-red-600">1</div>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Critical Unacknowledged
              </div>
              <div className="text-[11px] text-red-500">
                Abdullah Hassan — Troponin 2.8 · DHA overdue
              </div>
            </div>

            {/* Pending Today */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <div className="font-mono font-bold text-[30px] text-blue-600">3</div>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Orders Pending Today
              </div>
              <div className="text-[11px] text-slate-600">
                Mohammed · Noura · Aisha — awaiting results
              </div>
            </div>

            {/* Results Today */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FlaskConical className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="font-mono font-bold text-[30px] text-emerald-600">4</div>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Results Received Today
              </div>
              <div className="text-[11px] text-slate-600">
                1 critical · 3 normal/reviewed
              </div>
            </div>

            {/* This Week */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <CalendarCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="font-mono font-bold text-[30px] text-slate-700">12</div>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Orders This Week
              </div>
              <div className="text-[11px] text-slate-600">
                Apr 5–7 · 8 resulted · 3 pending · 1 scheduled
              </div>
            </div>

            {/* Stress Echo Scheduled */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <HeartPulse className="w-6 h-6 text-purple-600" />
                </div>
                <div className="font-bold text-[18px] text-purple-600" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Tomorrow
                </div>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Stress Echo Scheduled
              </div>
              <div className="text-[11px] text-slate-600">
                Mohammed Al Shamsi · 8 Apr 9:00 AM · Al Noor
              </div>
            </div>
          </div>

          {/* 2-Column Layout */}
          <div className="flex gap-5">
            {/* Left Column - Orders & Results */}
            <div className="flex-1">
              {/* Tabs */}
              <div className="flex space-x-1 mb-5 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('critical')}
                  className={`px-4 py-3 text-[13px] font-semibold transition-all ${
                    activeTab === 'critical'
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  🔴 Critical <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded animate-pulse">1</span>
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-3 text-[13px] font-semibold transition-all ${
                    activeTab === 'pending'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  🔵 Pending <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded">3</span>
                </button>
                <button
                  onClick={() => setActiveTab('results')}
                  className={`px-4 py-3 text-[13px] font-semibold transition-all ${
                    activeTab === 'results'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  📋 Today's Results <span className="ml-1 px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">4</span>
                </button>
                <button
                  onClick={() => setActiveTab('scheduled')}
                  className={`px-4 py-3 text-[13px] font-semibold transition-all ${
                    activeTab === 'scheduled'
                      ? 'text-teal-600 border-b-2 border-teal-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  📅 Scheduled <span className="ml-1 px-1.5 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded">1</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                {activeTab === 'critical' && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg shadow-red-100/50 animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <AlertOctagon className="w-6 h-6 text-red-600 animate-pulse" />
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-red-700 font-bold">
                            🔴 CRITICAL RESULT
                          </div>
                          <div className="font-bold text-[15px] text-red-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            {criticalResult.patientName} — PT-005 · 62M · A-
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-[18px] text-red-700">
                          UNACKNOWLEDGED: {timeUnacknowledged}
                        </div>
                        <div className="font-mono text-[11px] text-red-500">
                          DHA Limit: 1 hour — OVERDUE
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-red-100 rounded-xl p-5 mb-4">
                      <div className="mb-3">
                        <div className="font-bold text-[16px] text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          Troponin I (High-Sensitivity)
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">LOINC: 42637-9</div>
                        <div className="text-[12px] text-slate-500">Dubai Medical Laboratory — Healthcare City</div>
                      </div>

                      <div className="flex items-center justify-center space-x-4 py-4">
                        <div className="text-center">
                          <div className="font-mono font-bold text-[48px] text-red-700">
                            {criticalResult.value}
                          </div>
                          <div className="font-mono text-[18px] text-red-500">{criticalResult.unit}</div>
                        </div>
                        <div className="text-[32px] text-red-600">↑↑</div>
                      </div>

                      <div className="text-center mb-3">
                        <div className="font-mono text-[12px] text-slate-400">
                          Reference: {criticalResult.reference} {criticalResult.unit}
                        </div>
                        <div className="text-[12px] text-red-600 italic">
                          CRITICAL HIGH — 70× above upper limit
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-6 text-[11px] font-mono text-slate-500">
                        <div>Ordered: 11:30 AM</div>
                        <div>·</div>
                        <div>Resulted: 11:47 AM</div>
                        <div>·</div>
                        <div>Turnaround: 17 minutes</div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="text-[12px] text-teal-700">
                        <strong>Patient context:</strong> Emergency walk-in with severe chest pain + ST elevation V2–V4. STEMI protocol activated. Patient transferred to Al Noor ED at 11:48 AM. This result confirmed STEMI diagnosis post-transfer.
                      </div>
                      <div className="mt-2 text-[12px] text-teal-600 font-semibold">
                        Patient is currently in Al Noor Emergency Department
                      </div>
                    </div>

                    <button
                      onClick={() => setShowAcknowledgeModal(true)}
                      className="w-full py-3 bg-red-600 text-white text-[15px] font-bold rounded-xl hover:bg-red-700 transition-colors mb-3"
                    >
                      ✅ ACKNOWLEDGE THIS CRITICAL RESULT
                    </button>

                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 bg-red-100 text-red-700 text-[13px] font-semibold rounded-lg hover:bg-red-200 transition-colors">
                        📋 View Full Patient Record
                      </button>
                      <button className="flex-1 py-2 bg-slate-100 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                        💬 Contact ED Team
                      </button>
                      <button className="flex-1 py-2 bg-slate-100 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                        📄 Export Result
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'pending' && pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`bg-white rounded-2xl shadow-sm border-l-4 p-5 transition-all hover:shadow-md ${
                      order.priority === 'STAT' || order.priority === 'Urgent'
                        ? 'border-l-amber-400 bg-amber-50/30'
                        : 'border-l-blue-400 bg-blue-50/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        {(order.priority === 'STAT' || order.priority === 'Urgent') && (
                          <div className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-[9px] font-bold uppercase rounded mb-2">
                            ⚡ {order.priority}
                          </div>
                        )}
                        <div className="font-bold text-[14px] text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          {order.patientName} — {order.patientId}
                        </div>
                        <div className="text-[12px] text-slate-400">
                          {order.patientAge} · {order.patientInsurance}
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-[11px] font-mono text-slate-400">
                          <div>Ordered: {order.orderedTime}</div>
                          <div className="text-teal-600">Expected: {order.expectedTime}</div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="p-2 hover:bg-slate-100 rounded transition-colors" title="Call Lab">
                          <Phone className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded transition-colors" title="Cancel Order">
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.tests.map((test) => (
                        <div key={test.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-slate-100">
                          <div className="flex items-center space-x-3 flex-1">
                            <FlaskConical className={`w-3.5 h-3.5 ${test.priority === 'STAT' ? 'text-red-500' : test.priority === 'Urgent' ? 'text-amber-500' : 'text-teal-500'}`} />
                            <div>
                              <div className="text-[13px] font-bold text-slate-900">{test.name}</div>
                              <div className="text-[10px] font-mono text-slate-300">LOINC: {test.loinc}</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {test.priority === 'STAT' && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-bold rounded">
                                ⚡ STAT
                              </span>
                            )}
                            {test.priority === 'Urgent' && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded">
                                ⚡ Urgent
                              </span>
                            )}
                            {test.status === 'resulted' ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded">
                                ✅ Done
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded">
                                ⏳ Pending
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.priority === 'STAT' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                        <div className="text-[11px] text-red-600">
                          ⚡ STAT order: Dubai Medical Lab will call Dr. Ahmed directly if Troponin I comes back abnormal — before entering into CeenAiX
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <div className="text-[12px] text-slate-600 italic">
                        <strong>Clinical indication:</strong> {order.clinicalIndication}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <div>
                        <strong>Lab:</strong> {order.lab}
                      </div>
                      <div className="font-mono">Order ID: {order.id}</div>
                    </div>

                    <div className="mt-2 text-[11px] text-emerald-600">
                      {order.patientInsurance} — Auto-approved ✅
                    </div>
                  </div>
                ))}

                {activeTab === 'results' && (
                  <div className="space-y-4">
                    {/* Parnia's Results - Reviewed */}
                    <div className="bg-white rounded-2xl shadow-sm border-l-4 border-l-emerald-400 p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <div>
                            <div className="font-bold text-[14px] text-slate-600" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                              Parnia Yazdkhasti — PT-001
                            </div>
                            <div className="text-[12px] text-slate-400">
                              Full Metabolic + Cardiac Panel · 5 March 2026
                            </div>
                            <div className="text-[11px] font-mono text-emerald-600 mt-1">
                              Reviewed: Today 9:58 AM
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleExpanded('parnia-results')}
                          className="text-teal-600 hover:text-teal-700 text-[12px] font-medium"
                        >
                          {expandedResults.includes('parnia-results') ? '▲ Collapse' : '▼ View All Results'}
                        </button>
                      </div>

                      {!expandedResults.includes('parnia-results') && (
                        <div className="text-[12px] text-slate-600">
                          <div className="mb-2">
                            <strong>Key abnormals:</strong> HbA1c 6.8% ⚠️ · Vit D 22↓ ⚠️ · CRP 3.2↑
                          </div>
                          <div>
                            <strong>Key normals:</strong> LDL 118 ✅ · CBC normal ✅
                          </div>
                        </div>
                      )}

                      {expandedResults.includes('parnia-results') && (
                        <div>
                          <div className="overflow-x-auto mb-4">
                            <table className="w-full text-[12px]">
                              <thead>
                                <tr className="border-b border-slate-200">
                                  <th className="text-left py-2 font-semibold text-slate-700">Test</th>
                                  <th className="text-right py-2 font-semibold text-slate-700">Value</th>
                                  <th className="text-left py-2 font-semibold text-slate-700">Unit</th>
                                  <th className="text-left py-2 font-semibold text-slate-700">Reference</th>
                                  <th className="text-center py-2 font-semibold text-slate-700">Flag</th>
                                </tr>
                              </thead>
                              <tbody className="font-mono">
                                <tr className="border-b border-slate-100">
                                  <td className="py-2">HbA1c</td>
                                  <td className="text-right text-amber-600 font-bold">6.8</td>
                                  <td>%</td>
                                  <td className="text-slate-400">&lt;5.7</td>
                                  <td className="text-center text-amber-600">⚠️ H</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                  <td className="py-2">Fasting Glucose</td>
                                  <td className="text-right text-amber-600">118</td>
                                  <td>mg/dL</td>
                                  <td className="text-slate-400">70–99</td>
                                  <td className="text-center text-amber-600">⚠️ H</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                  <td className="py-2">Total Cholesterol</td>
                                  <td className="text-right text-emerald-600">195</td>
                                  <td>mg/dL</td>
                                  <td className="text-slate-400">&lt;200</td>
                                  <td className="text-center text-emerald-600">✅ N</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                  <td className="py-2">LDL</td>
                                  <td className="text-right text-emerald-600 font-bold">118</td>
                                  <td>mg/dL</td>
                                  <td className="text-slate-400">&lt;130</td>
                                  <td className="text-center text-emerald-600">✅ N</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                  <td className="py-2">HDL</td>
                                  <td className="text-right text-emerald-600">52</td>
                                  <td>mg/dL</td>
                                  <td className="text-slate-400">&gt;40</td>
                                  <td className="text-center text-emerald-600">✅ N</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                  <td className="py-2">Vit D (25-OH)</td>
                                  <td className="text-right text-amber-600">22</td>
                                  <td>ng/mL</td>
                                  <td className="text-slate-400">30–80</td>
                                  <td className="text-center text-amber-600">⚠️ L</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                  <td className="py-2">CRP</td>
                                  <td className="text-right text-amber-600">3.2</td>
                                  <td>mg/L</td>
                                  <td className="text-slate-400">&lt;3.0</td>
                                  <td className="text-center text-amber-600">⚠️ H</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {showTrend === 'ldl' && (
                            <div className="bg-slate-50 rounded-lg p-4 mb-4">
                              <div className="text-[12px] font-semibold text-slate-700 mb-3">LDL Trend — Parnia Yazdkhasti</div>

                              <div className="relative h-32 mb-2">
                                {/* Simple CSS-based trend visualization */}
                                <div className="absolute inset-0 flex items-end justify-between px-4">
                                  {ldlTrendData.map((point, index) => {
                                    const heightPercentage = ((point.value - 100) / 60) * 100;
                                    const isAboveTarget = point.value > 130;
                                    return (
                                      <div key={index} className="flex flex-col items-center flex-1">
                                        <div className="relative w-full flex justify-center mb-1">
                                          <div
                                            className={`w-3 h-3 rounded-full ${isAboveTarget ? 'bg-amber-500' : 'bg-teal-500'} border-2 border-white shadow-sm`}
                                            style={{
                                              position: 'relative',
                                              bottom: `${heightPercentage}px`
                                            }}
                                          />
                                        </div>
                                        <div className="font-mono text-[10px] font-bold text-slate-700">
                                          {point.value}
                                        </div>
                                        <div className="text-[9px] text-slate-400 mt-0.5">
                                          {point.date}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Target line at 130 */}
                                <div
                                  className="absolute left-0 right-0 border-t-2 border-dashed border-emerald-400"
                                  style={{ bottom: '50%' }}
                                >
                                  <span className="absolute -top-4 right-2 text-[9px] text-emerald-600 font-semibold">
                                    Target &lt;130
                                  </span>
                                </div>
                              </div>

                              <div className="text-[11px] text-emerald-600 text-center mt-2">
                                LDL stable ✅ — Atorvastatin effective
                              </div>
                              <div className="text-[10px] text-slate-500 text-center italic mt-1">
                                Atorvastatin started Oct 2021 ↓
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => setShowTrend(showTrend === 'ldl' ? null : 'ldl')}
                            className="w-full py-2 bg-teal-50 text-teal-600 text-[12px] font-semibold rounded-lg hover:bg-teal-100 transition-colors mb-3 flex items-center justify-center space-x-2"
                          >
                            <TrendingUp className="w-4 h-4" />
                            <span>{showTrend === 'ldl' ? 'Hide' : 'View'} LDL Trend Chart</span>
                          </button>

                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="text-[12px] text-slate-700 mb-2">
                              Lipid panel excellent — statin working. HbA1c still slightly elevated but improving. CRP mild — linked to glucose dysregulation. No cardiac action needed from lipid perspective.
                            </div>
                            <div className="text-[11px] text-slate-500 italic">
                              — Dr. Ahmed, 7 April 2026, 9:58 AM
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'scheduled' && (
                  <div className="bg-purple-50/20 border-l-4 border-l-purple-400 rounded-2xl shadow-sm p-5">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] uppercase tracking-wider text-purple-600 font-bold mb-1">
                          SCHEDULED
                        </div>
                        <div className="font-bold text-[14px] text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          Mohammed Rashid Al Shamsi — PT-004
                        </div>
                        <div className="text-[12px] text-slate-400">
                          48M · Daman Basic · Atypical chest pain
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 mb-4">
                      <div className="font-bold text-[15px] text-purple-800 mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        Stress Echocardiogram with Protocol
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] text-slate-600">Date:</span>
                          <span className="text-[13px] font-mono text-purple-700 font-bold">Thursday, 8 April 2026</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] text-slate-600">Time:</span>
                          <span className="text-[20px] font-mono text-purple-600 font-bold">9:00 AM</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] text-slate-600">Location:</span>
                          <span className="text-[12px] text-slate-700">Al Noor Medical Center — Cardiology Imaging Suite, Floor 3</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] text-slate-600">Duration:</span>
                          <span className="text-[12px] text-slate-700">~90 minutes (incl. recovery)</span>
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-3 mb-3">
                        <div className="text-[11px] font-semibold text-purple-900 mb-2">Patient Preparation:</div>
                        <div className="space-y-1 text-[11px] text-purple-700">
                          <div>✅ NPO 4 hours before (no food 5AM+)</div>
                          <div>✅ No beta blockers morning of (hold Metoprolol)</div>
                          <div>✅ Wear comfortable clothing + walking shoes</div>
                          <div>✅ Bring insurance card</div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 mb-2">
                        <strong>Insurance:</strong> Daman Basic — pre-auth requested ⏳
                      </div>
                      <div className="text-[11px] text-amber-600">
                        Pre-auth status: Pending — submitted 7 Apr 10:35 AM
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <div className="text-[12px] text-slate-700 italic">
                        <strong>Clinical indication:</strong> New patient — atypical exertional chest pain, smoker, family Hx MI. Rule out inducible ischaemia.
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 bg-purple-100 text-purple-700 text-[12px] font-semibold rounded-lg hover:bg-purple-200 transition-colors">
                        📅 View in Calendar
                      </button>
                      <button className="flex-1 py-2 bg-slate-100 text-slate-700 text-[12px] font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                        💬 Send Prep Instructions
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Clinical Insights */}
              <div className="mt-6 bg-white border-l-4 border-l-indigo-400 rounded-2xl shadow-sm p-5">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-bold text-[14px] text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      CeenAiX Clinical AI — Lab Insights
                    </div>
                    <div className="text-[11px] text-slate-400">
                      For clinical support only — physician judgment applies
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <div className="text-[12px] text-slate-700 leading-relaxed">
                      ⏳ Mohammed Al Shamsi's Troponin result is expected around 5:00 PM. Given his presentation (exertional chest pain, ST-normal ECG, risk factors), a negative Troponin still warrants Stress Echo (already scheduled Apr 8) to rule out inducible ischaemia.
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-3">
                    <div className="text-[12px] text-slate-700 leading-relaxed">
                      Aisha Mohammed's BNP has risen from 280 (Jul 2025) to 320 (Oct 2025) to 450 pg/mL (Jan 2026) — an upward trend over 6 months. Today's order should help clarify current fluid status. If BNP &gt; 500, consider increasing Furosemide dose or urgent review.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - New Order Panel */}
            <div className="w-[380px] flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-0">
                <div className="mb-5">
                  <h3 className="font-bold text-[16px] text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    New Lab Order
                  </h3>
                  <p className="text-[12px] text-slate-400">DHA-compliant lab requisition</p>
                </div>

                {/* Patient Selection */}
                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    FOR PATIENT
                  </div>

                  {selectedPatient && (
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 mb-2">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          AM
                        </div>
                        <div>
                          <div className="font-bold text-[13px] text-slate-900">{selectedPatient.name}</div>
                          <div className="text-[10px] font-mono text-slate-500">{selectedPatient.id} · {selectedPatient.age}</div>
                        </div>
                      </div>
                      <button className="w-full px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-medium rounded hover:bg-slate-200 transition-colors flex items-center justify-center space-x-1">
                        <span>Change</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {selectedPatient && (
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div><strong>Active conditions:</strong> {selectedPatient.conditions}</div>
                      <div className="font-mono text-[11px]"><strong>Recent labs:</strong> {selectedPatient.recentLabs}</div>
                      <div className="text-amber-600">{selectedPatient.medAlert}</div>
                    </div>
                  )}
                </div>

                {/* Quick Panels */}
                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    QUICK PANELS
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 bg-teal-600 text-white text-[11px] font-medium rounded-lg hover:bg-teal-700 transition-colors">
                      🫀 HF Monitoring
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-lg hover:bg-slate-200 transition-colors">
                      ❤️ ACS Rule-out
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-lg hover:bg-slate-200 transition-colors">
                      💊 RAAS Monitoring
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-lg hover:bg-slate-200 transition-colors">
                      🩺 Annual Cardiac
                    </button>
                  </div>
                </div>

                {/* Test Search */}
                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    ADD TESTS
                  </div>
                  <div className="relative">
                    <FlaskConical className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search test name or LOINC..."
                      className="w-full h-11 pl-10 pr-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {searchQuery && (
                    <div className="absolute mt-2 w-[350px] bg-white border border-slate-200 rounded-xl shadow-xl max-h-[300px] overflow-y-auto z-10">
                      {testCatalog
                        .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(test => (
                          <div
                            key={test.id}
                            onClick={() => addTest(test)}
                            className="px-4 py-3 hover:bg-teal-50 cursor-pointer border-b border-slate-50 last:border-0"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="text-[13px] font-bold text-slate-900">{test.name}</div>
                                <div className="text-[10px] font-mono text-slate-400">LOINC: {test.loinc}</div>
                              </div>
                              <div className="text-[11px] font-mono text-slate-500">AED {test.price}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Selected Tests */}
                {selectedTests.length > 0 && (
                  <div className="mb-5">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                      SELECTED TESTS ({selectedTests.length})
                    </div>
                    <div className="space-y-2">
                      {selectedTests.map((test) => (
                        <div key={test.id} className="flex items-center justify-between py-2 px-3 bg-teal-50 rounded-lg border border-teal-100">
                          <div className="flex items-center space-x-2 flex-1">
                            <FlaskConical className="w-3.5 h-3.5 text-teal-500" />
                            <div className="flex-1">
                              <div className="text-[13px] font-bold text-slate-900">{test.name}</div>
                              <div className="text-[10px] font-mono text-slate-400">LOINC: {test.loinc}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeTest(test.id)}
                            className="p-1 hover:bg-red-100 rounded transition-colors"
                          >
                            <X className="w-3.5 h-3.5 text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clinical Indication */}
                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    CLINICAL INDICATION
                  </div>
                  <textarea
                    placeholder="e.g., I50.9 — Heart Failure follow-up..."
                    className="w-full h-16 px-3 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    defaultValue="Heart failure follow-up. Weight +2kg, increased SOB. K+ monitoring on RAAS therapy."
                  />
                </div>

                {/* Priority */}
                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    PRIORITY
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-lg hover:bg-slate-200 transition-colors">
                      STAT
                    </button>
                    <button className="px-3 py-1.5 bg-teal-600 text-white text-[11px] font-medium rounded-lg">
                      Urgent
                    </button>
                    <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-lg hover:bg-slate-200 transition-colors">
                      Routine
                    </button>
                  </div>
                </div>

                {/* Lab Selection */}
                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    SEND TO LAB
                  </div>
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <FlaskConical className="w-4 h-4 text-teal-600" />
                      <div className="text-[13px] font-bold text-slate-900">Dubai Medical Laboratory</div>
                    </div>
                    <div className="text-[11px] text-slate-600 mb-1">Healthcare City · Nearest to patient</div>
                    <div className="text-[10px] text-teal-600">Urgent: 2h | STAT: 1h | ePrescription ✅</div>
                    <div className="text-[10px] text-emerald-600 mt-1">AXA Gulf partner ✅ · Recommended</div>
                  </div>
                </div>

                {/* Cost Summary */}
                {selectedTests.length > 0 && (
                  <div className="mb-5 bg-slate-50 rounded-lg p-4">
                    <div className="text-[11px] font-semibold text-slate-700 mb-2">Cost Summary</div>
                    <div className="space-y-1 text-[11px] font-mono">
                      <div className="flex justify-between text-slate-600">
                        <span>Total:</span>
                        <span>AED {selectedTests.reduce((sum, t) => sum + t.price, 0)}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Insurance (80%):</span>
                        <span>AED {Math.floor(selectedTests.reduce((sum, t) => sum + t.price, 0) * 0.8)}</span>
                      </div>
                      <div className="flex justify-between text-teal-600 font-bold text-[13px] pt-2 border-t border-slate-200">
                        <span>Patient pays:</span>
                        <span>AED {Math.floor(selectedTests.reduce((sum, t) => sum + t.price, 0) * 0.2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Send Button */}
                <button
                  disabled={selectedTests.length === 0}
                  className="w-full py-3 bg-teal-600 text-white text-[15px] font-bold rounded-xl hover:bg-teal-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  <Send className="w-5 h-5" />
                  <span>📤 Send Lab Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acknowledgment Modal */}
      {showAcknowledgeModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="bg-red-600 rounded-t-2xl p-5 text-center">
              <AlertOctagon className="w-8 h-8 text-white mx-auto mb-2" />
              <h2 className="text-white font-bold text-[16px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Critical Result Acknowledgment
              </h2>
              <p className="text-white/70 text-[12px]">DHA Compliance Required</p>
            </div>

            <div className="p-6">
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="font-bold text-[14px] text-slate-900 mb-1">{criticalResult.patientName}</div>
                <div className="text-[13px] text-red-700 mb-1">
                  {criticalResult.testName} — {criticalResult.value} {criticalResult.unit} CRITICAL ↑↑
                </div>
                <div className="text-[11px] text-slate-500">
                  Dubai Medical Laboratory · Resulted: {criticalResult.resultTime} — {timeUnacknowledged} ago
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acknowledgmentChecks.reviewed}
                    onChange={(e) => setAcknowledgmentChecks({ ...acknowledgmentChecks, reviewed: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-[12px] text-slate-700">I have reviewed this critical lab result</span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acknowledgmentChecks.careProvided}
                    onChange={(e) => setAcknowledgmentChecks({ ...acknowledgmentChecks, careProvided: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-[12px] text-slate-700">Patient has received appropriate clinical care</span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acknowledgmentChecks.transferred}
                    onChange={(e) => setAcknowledgmentChecks({ ...acknowledgmentChecks, transferred: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-[12px] text-slate-700">Patient was transferred to Al Noor ED</span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acknowledgmentChecks.noAction}
                    onChange={(e) => setAcknowledgmentChecks({ ...acknowledgmentChecks, noAction: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-[12px] text-slate-700">No additional action required from me at this time</span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acknowledgmentChecks.understand}
                    onChange={(e) => setAcknowledgmentChecks({ ...acknowledgmentChecks, understand: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-[12px] text-slate-700">I understand this acknowledgment is logged to Nabidh HIE and the DHA audit trail</span>
                </label>
              </div>

              <div className="bg-white rounded-lg p-3 mb-5 border border-slate-200">
                <div className="text-[11px] text-slate-600 mb-1">
                  <strong>Acknowledging as:</strong> Dr. Ahmed Al Rashidi
                </div>
                <div className="text-[10px] font-mono text-slate-400">DHA License: DHA-PRAC-2018-047821</div>
                <div className="text-[10px] font-mono text-slate-400">Timestamp: 7 April 2026, 2:07 PM GST</div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAcknowledgeModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 text-[13px] font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcknowledge}
                  disabled={!Object.values(acknowledgmentChecks).every(v => v)}
                  className="flex-1 py-2.5 bg-red-600 text-white text-[13px] font-bold rounded-lg hover:bg-red-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  ✅ Acknowledge & Submit to DHA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <h2 className="text-[20px] font-bold text-emerald-700 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Critical Result Acknowledged ✅
            </h2>

            <div className="bg-teal-50 rounded-lg p-4 mb-4">
              <div className="text-[11px] text-slate-500 mb-1">Nabidh Audit ID</div>
              <div className="text-[16px] font-mono font-bold text-teal-600 flex items-center justify-center space-x-2">
                <span>CRV-20260407-004821</span>
                <button className="p-1 hover:bg-teal-100 rounded transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-left space-y-2 mb-6 text-[13px] text-slate-600">
              <div className="text-emerald-600 text-[12px]">
                ✅ DHA Compliance: Fulfilled (logged 2:07 PM)<br />
                ✅ Submitted to DHA critical result registry<br />
                ✅ Logged to Nabidh HIE audit trail<br />
                ✅ Notification sent to Dubai Medical Lab
              </div>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                criticalResult.acknowledged = true;
              }}
              className="w-full py-2.5 bg-teal-600 text-white text-[14px] font-semibold rounded-lg hover:bg-teal-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabReferrals;
