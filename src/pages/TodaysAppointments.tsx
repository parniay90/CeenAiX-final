import React, { useState, useEffect } from 'react';
import DoctorSidebarNew from '../components/doctor/DoctorSidebarNew';
import CriticalAlertBanner from '../components/doctor/CriticalAlertBanner';
import {
  Clock,
  Calendar,
  Users,
  DollarSign,
  Printer,
  UserPlus,
  ChevronRight,
  Play,
  FileText,
  Pill,
  MessageSquare,
  RotateCcw,
  FlaskConical,
  CheckCircle2,
  XCircle,
  Bell,
  ExternalLink,
  Eye,
  CheckSquare,
  Ban,
  AlertTriangle,
  Heart,
  Activity,
  Stethoscope
} from 'lucide-react';

const navigateTo = (path: string) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

interface Appointment {
  id: string;
  time: string;
  duration: string;
  actualDuration?: string;
  patient: string;
  patientId: string;
  age: string;
  gender: string;
  bloodType: string;
  insurance: string;
  type: string;
  status: 'completed' | 'in-progress' | 'checked-in' | 'upcoming' | 'critical' | 'walk-in';
  arrived?: string;
  started?: string;
  completed?: string;
  revenue: string;
  revenuePaid: boolean;
  conditions: string[];
  allergies: string[];
  medications: string[];
  flags: string[];
  vitals?: {
    bp: string;
    hr: string;
    spo2?: string;
    weight?: string;
  };
  summary?: string;
  plan?: string;
  soapComplete?: boolean;
  chiefComplaint?: string;
  lastVisit?: string;
  visitCount?: number;
  lastVisitSummary?: string;
  agenda?: string[];
}

const TodaysAppointments: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTimer, setActiveTimer] = useState(432); // 7:12 in seconds
  const [showCriticalAlert, setShowCriticalAlert] = useState(true);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [showPatientBrief, setShowPatientBrief] = useState(false);
  const [showSoapModal, setShowSoapModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);

  const appointments: Appointment[] = [
    {
      id: '1',
      time: '9:00 AM',
      duration: '20 min',
      actualDuration: '22 min',
      patient: 'Khalid Hassan Abdullah',
      patientId: 'PT-002',
      age: '54M',
      gender: 'Male',
      bloodType: 'O+',
      insurance: 'ADNIC Standard',
      type: 'Follow-up | Hypertension Management',
      status: 'completed',
      arrived: '8:52 AM',
      started: '9:00 AM',
      completed: '9:22 AM',
      revenue: 'AED 400',
      revenuePaid: true,
      conditions: ['Essential Hypertension (2018)', 'Dyslipidemia (2020)'],
      allergies: [],
      medications: ['Losartan 50mg', 'Amlodipine 10mg'],
      flags: [],
      vitals: { bp: '138/86', hr: '74', weight: '88 kg' },
      summary: 'HTN partly controlled — trending better',
      plan: 'Increase Amlodipine to 10mg | Repeat in 4 weeks',
      soapComplete: true,
      lastVisit: '15 Mar 2026',
      visitCount: 8
    },
    {
      id: '2',
      time: '9:30 AM',
      duration: '30 min',
      actualDuration: '28 min',
      patient: 'Parnia Yazdkhasti',
      patientId: 'PT-001',
      age: '38F',
      gender: 'Female',
      bloodType: 'A+',
      insurance: 'Daman Gold',
      type: 'Follow-up | Cardiac MRI Review',
      status: 'completed',
      revenue: 'AED 400',
      revenuePaid: true,
      conditions: ['Hypertension (controlled)', 'CAC Score 42'],
      allergies: ['Penicillin (SEVERE — anaphylaxis)', 'Sulfa drugs (rash)'],
      medications: ['Atorvastatin 20mg', 'Amlodipine 5mg'],
      flags: ['ALLERGY: Penicillin SEVERE', 'ALLERGY: Sulfa drugs'],
      vitals: { bp: '128/82', hr: '72', weight: '68 kg' },
      summary: 'HTN well controlled. MRI findings discussed.',
      plan: 'Atorvastatin + Amlodipine renewed. CT Feb 2027.',
      soapComplete: true,
      lastVisit: '10 Jan 2026',
      visitCount: 6
    },
    {
      id: '3',
      time: '10:00 AM',
      duration: '30 min',
      actualDuration: '35 min',
      patient: 'Mohammed Rashid Al Shamsi',
      patientId: 'PT-004',
      age: '48M',
      gender: 'Male',
      bloodType: 'B+',
      insurance: 'Daman Basic',
      type: 'New Patient | Chest Pain Workup',
      status: 'completed',
      revenue: 'AED 400',
      revenuePaid: true,
      conditions: [],
      allergies: [],
      medications: ['Aspirin 100mg'],
      flags: ['New Patient', 'Labs: Urgent · Stress Echo tomorrow'],
      summary: 'Atypical chest pain — cardiac cause excluded. Pre-hypertension.',
      plan: 'Stress Echo tomorrow 9 AM. BNP + Troponin + Lipids ordered. Smoking cessation.',
      soapComplete: true,
      visitCount: 1
    },
    {
      id: '4',
      time: '10:45 AM',
      duration: '20 min',
      actualDuration: '20 min',
      patient: 'Fatima Bint Rashid Al Maktoum',
      patientId: 'PT-003',
      age: '65F',
      gender: 'Female',
      bloodType: 'AB+',
      insurance: 'Thiqa (Abu Dhabi Gov.)',
      type: 'Follow-up | Echo Review',
      status: 'completed',
      revenue: 'AED 400',
      revenuePaid: true,
      conditions: ['Hypertension', 'Mild LVH (newly detected)'],
      allergies: ['Aspirin (GI intolerance)'],
      medications: ['Ramipril 5mg', 'Bisoprolol 2.5mg'],
      flags: ['ALLERGY: Aspirin — GI intolerance'],
      vitals: { bp: '136/84', hr: '68' },
      summary: 'Mild LVH consistent with HTN. Grade I DD.',
      plan: 'Added Ramipril 5mg. No Aspirin (allergy respected ✅)',
      soapComplete: true,
      lastVisit: '15 Feb 2026',
      visitCount: 4
    },
    {
      id: '5',
      time: '11:30 AM',
      duration: '15 min',
      actualDuration: '15 min',
      patient: 'Abdullah Hassan Al Zaabi',
      patientId: 'PT-005',
      age: '62M',
      gender: 'Male',
      bloodType: 'A-',
      insurance: 'Daman Gold',
      type: 'URGENT WALK-IN | Acute Chest Pain',
      status: 'critical',
      revenue: 'AED 400',
      revenuePaid: true,
      conditions: [],
      allergies: [],
      medications: [],
      flags: ['Troponin 2.8 CRITICAL — 1h 20min unacknowledged', 'Patient in Al Noor ED now'],
      vitals: { bp: '162/94', hr: '108' },
      summary: 'STEMI protocol activated. Transferred to ED at 11:48 AM.',
      soapComplete: true
    },
    {
      id: '6',
      time: '2:00 PM',
      duration: '30 min',
      patient: 'Aisha Mohammed Al Reem',
      patientId: 'PT-006',
      age: '42F',
      gender: 'Female',
      bloodType: 'O-',
      insurance: 'AXA Gulf Standard',
      type: 'Follow-up | Heart Failure Management',
      status: 'in-progress',
      started: '2:00 PM',
      revenue: 'AED 400',
      revenuePaid: false,
      conditions: ['HFrEF (LVEF 38%)', 'Hypertension', 'T2 Diabetes'],
      allergies: [],
      medications: ['Furosemide 40mg', 'Bisoprolol 5mg', 'Enalapril 10mg', 'Spironolactone 25mg'],
      flags: ['ACE + Spironolactone = ↑K+ risk', 'Fluid retention +2kg', 'SpO2 95%', 'BP elevated 148/92'],
      vitals: { bp: '148/92', hr: '96', spo2: '95%', weight: '74 kg (+2kg)' },
      chiefComplaint: 'Increased SOB + ankle swelling this week',
      lastVisit: '12 Jan 2026',
      visitCount: 5
    },
    {
      id: '7',
      time: '2:45 PM',
      duration: '20 min',
      patient: 'Saeed Rashid Al Mansoori',
      patientId: 'PT-007',
      age: '58M',
      gender: 'Male',
      bloodType: 'B-',
      insurance: 'Oman Insurance Co.',
      type: 'Follow-up | Post-PCI 3 Months',
      status: 'checked-in',
      arrived: '2:15 PM',
      revenue: 'AED 400',
      revenuePaid: false,
      conditions: ['CAD — Single vessel (LAD stent Jan 7, 2026)', 'Hypertension', 'Dyslipidemia'],
      allergies: [],
      medications: ['Aspirin 100mg', 'Clopidogrel 75mg', 'Atorvastatin 40mg', 'Ramipril 10mg'],
      flags: ['DAPT — DO NOT STOP Clopidogrel'],
      lastVisit: '7 Jan 2026',
      visitCount: 2,
      agenda: [
        'Confirm DAPT adherence (CRITICAL)',
        'Symptoms since PCI? (chest pain, SOB, palpitations)',
        'Review lipids (LDL 62 mg/dL — Jan)',
        'Plan 6-month stress test (July 2026)',
        'Discuss DAPT duration — stop Clopidogrel at 12 months'
      ]
    },
    {
      id: '8',
      time: '3:30 PM',
      duration: '30 min',
      patient: 'Noura Bint Khalid Al Hamdan',
      patientId: 'PT-008',
      age: '34F',
      gender: 'Female',
      bloodType: 'Unknown',
      insurance: 'Daman Basic',
      type: 'New Patient | Palpitations Workup',
      status: 'upcoming',
      revenue: 'AED 400',
      revenuePaid: false,
      conditions: [],
      allergies: [],
      medications: [],
      flags: ['New patient · first visit', 'ECG done on arrival', 'Holter to be fitted today'],
      chiefComplaint: 'Intermittent palpitations x 6 weeks, worse with stress and coffee. No syncope. No chest pain.',
      visitCount: 0
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const inProgressCount = appointments.filter(a => a.status === 'in-progress').length;
  const checkedInCount = appointments.filter(a => a.status === 'checked-in').length;
  const upcomingCount = appointments.filter(a => a.status === 'upcoming').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'emerald-400';
      case 'in-progress': return 'teal-500';
      case 'checked-in': return 'blue-400';
      case 'upcoming': return 'slate-200';
      case 'critical': return 'red-500';
      case 'walk-in': return 'amber-400';
      default: return 'slate-200';
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts[0][0] + (parts[1]?.[0] || '');
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <DoctorSidebarNew />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="font-bold text-[17px] text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Today's Appointments
            </h1>
            <p className="text-[13px] text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
              Wednesday, 7 April 2026 · Al Noor Medical Center
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Live Session Badge */}
            <div className="flex items-center space-x-3 px-4 py-2 bg-teal-50 rounded-lg border border-teal-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                <span className="text-[13px] text-teal-700 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Consulting: Aisha Mohammed Al Reem
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {formatTimer(activeTimer)} elapsed
              </span>
              <button
                onClick={() => {
                  setSelectedPatient(appointments[5]);
                  setShowWorkspace(true);
                }}
                className="px-3 py-1 bg-teal-600 text-white text-[11px] font-semibold rounded-md hover:bg-teal-700 transition-colors flex items-center space-x-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open Workspace</span>
              </button>
            </div>

            {/* Critical Alert Pill */}
            {showCriticalAlert && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-[11px] font-semibold">Abdullah Troponin 2.8</span>
                <button className="px-3 py-0.5 bg-white text-red-600 text-[10px] font-bold rounded hover:bg-red-50 transition-colors">
                  Acknowledge
                </button>
              </div>
            )}

            <button className="relative">
              <Bell className="w-5 h-5 text-slate-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                4
              </div>
            </button>

            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer">
              AA
            </div>
          </div>
        </div>

        {/* Critical Alert Banner */}
        {showCriticalAlert && (
          <CriticalAlertBanner onDismiss={() => setShowCriticalAlert(false)} />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-4">
            {/* Day Progress Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-0 z-30">
              {/* Progress Timeline */}
              <div className="relative mb-6">
                <div className="flex items-center justify-between relative">
                  {/* Line */}
                  <div className="absolute top-1.5 left-0 right-0 h-[3px] bg-slate-200"></div>
                  <div className="absolute top-1.5 left-0 h-[3px] bg-emerald-300" style={{ width: `${(completedCount / appointments.length) * 100}%` }}></div>

                  {/* Dots */}
                  {appointments.map((apt, idx) => (
                    <div key={apt.id} className="relative z-10 flex flex-col items-center group">
                      <div
                        className={`w-3 h-3 rounded-full border-2 border-white ${
                          apt.status === 'in-progress'
                            ? 'w-4 h-4 bg-teal-500 ring-4 ring-teal-200 animate-pulse'
                            : apt.status === 'critical'
                            ? 'bg-red-500 animate-pulse'
                            : apt.status === 'completed'
                            ? 'bg-emerald-400'
                            : apt.status === 'checked-in'
                            ? 'bg-blue-400'
                            : 'bg-slate-300'
                        }`}
                        title={`${apt.patient} - ${apt.time}`}
                      ></div>
                      <span className="text-[10px] text-slate-400 font-mono mt-1.5">
                        {apt.time.replace(' AM', '').replace(' PM', '')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-[12px]">
                  <span className="font-mono text-[13px] font-bold text-teal-600">
                    {completedCount}/{appointments.length} complete
                  </span>
                  <span className="text-slate-300">·</span>
                  {inProgressCount > 0 && (
                    <>
                      <span className="flex items-center space-x-1 text-teal-600">
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
                        <span>{inProgressCount} in progress</span>
                      </span>
                      <span className="text-slate-300">·</span>
                    </>
                  )}
                  {checkedInCount > 0 && (
                    <>
                      <span className="text-blue-600">{checkedInCount} checked in</span>
                      <span className="text-slate-300">·</span>
                    </>
                  )}
                  <span className="text-slate-600">{upcomingCount} upcoming</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono text-emerald-600">
                    AED {appointments.filter(a => a.revenuePaid).length * 400} collected
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right text-[11px] text-slate-400 space-y-0.5">
                    <div>Est. finish: ~4:10 PM</div>
                    <div className="text-emerald-600">Avg: 26 min/appt · On time ✅</div>
                  </div>

                  <button className="px-3 py-1.5 border border-slate-300 text-slate-600 text-[11px] font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-1.5">
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Today's List</span>
                  </button>

                  <button
                    onClick={() => setShowWalkInModal(true)}
                    className="px-3 py-1.5 bg-amber-500 text-white text-[11px] font-semibold rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Walk-in</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Appointment Cards */}
            <div className="space-y-3">
              {appointments.map((apt, index) => (
                <React.Fragment key={apt.id}>
                  {/* Current Time Divider */}
                  {index === 5 && (
                    <div className="flex items-center space-x-4 my-4">
                      <div className="flex-1 h-[2px] bg-red-400"></div>
                      <div className="px-4 py-1 bg-red-500 text-white text-[11px] font-bold rounded-full font-mono">
                        NOW — 2:07 PM
                      </div>
                      <div className="flex-1 h-[2px] bg-red-400"></div>
                    </div>
                  )}

                  {/* Appointment Card */}
                  <div
                    className={`bg-white rounded-2xl shadow-sm border-l-[5px] border-${getStatusColor(apt.status)} ${
                      apt.status === 'in-progress'
                        ? 'shadow-lg shadow-teal-100'
                        : apt.status === 'critical'
                        ? 'shadow-lg shadow-red-100 animate-pulse'
                        : ''
                    }`}
                  >
                    {/* Header */}
                    <div
                      className={`px-5 py-4 border-b border-slate-100 ${
                        apt.status === 'in-progress'
                          ? 'bg-teal-50'
                          : apt.status === 'checked-in'
                          ? 'bg-blue-50/40'
                          : apt.status === 'critical'
                          ? 'bg-red-50'
                          : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        {/* Left: Time */}
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className={`font-mono text-[16px] font-bold text-${getStatusColor(apt.status)}`}>
                              {apt.time}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              · {apt.actualDuration || `~${apt.duration}`}
                            </span>
                          </div>
                          {apt.started && (
                            <div className="text-[10px] text-slate-400 font-mono">
                              Started {apt.started}
                            </div>
                          )}
                          {apt.arrived && apt.status === 'checked-in' && (
                            <div className="text-[10px] text-amber-600 font-mono">
                              Waited: 22 min
                            </div>
                          )}
                          <div className="text-[12px] text-slate-300 font-mono">
                            #{index + 1} <span className="text-[10px]">of 8 today</span>
                          </div>
                        </div>

                        {/* Center: Patient */}
                        <div className="flex items-center space-x-3 flex-1 mx-6">
                          <div className="relative">
                            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${
                              apt.status === 'completed'
                                ? 'from-slate-400 to-slate-500'
                                : apt.status === 'in-progress'
                                ? 'from-teal-500 to-teal-600'
                                : apt.status === 'checked-in'
                                ? 'from-blue-500 to-blue-600'
                                : apt.status === 'critical'
                                ? 'from-red-500 to-red-600'
                                : 'from-slate-500 to-slate-600'
                            } flex items-center justify-center text-white text-sm font-bold`}>
                              {getInitials(apt.patient)}
                            </div>
                            {apt.status === 'in-progress' && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-teal-500 border-2 border-white rounded-full animate-pulse"></div>
                            )}
                          </div>

                          <div className="flex-1">
                            <h3 className={`font-bold text-[16px] ${
                              apt.status === 'completed' ? 'text-slate-600' : 'text-slate-900'
                            }`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                              {apt.patient}
                            </h3>
                            <div className="text-[12px] text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {apt.age} · {apt.bloodType} · {apt.insurance} · {apt.patientId}
                            </div>
                            <div className={`inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                              apt.type.includes('New Patient')
                                ? 'bg-blue-50 text-blue-700'
                                : apt.type.includes('URGENT')
                                ? 'bg-red-50 text-red-700'
                                : 'bg-teal-50 text-teal-700'
                            }`}>
                              {apt.type}
                            </div>
                          </div>
                        </div>

                        {/* Right: Status */}
                        <div className="text-right space-y-2">
                          <div>
                            {apt.status === 'completed' && (
                              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-[12px] font-bold rounded-lg inline-flex items-center space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Completed</span>
                              </span>
                            )}
                            {apt.status === 'in-progress' && (
                              <div className="space-y-1">
                                <span className="px-3 py-1.5 bg-teal-100 text-teal-700 text-[12px] font-bold rounded-lg inline-flex items-center space-x-1.5">
                                  <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-pulse"></div>
                                  <span>In Progress</span>
                                </span>
                                <div className="text-[14px] font-mono font-bold text-teal-600">
                                  {formatTimer(activeTimer)}
                                </div>
                              </div>
                            )}
                            {apt.status === 'checked-in' && (
                              <div className="space-y-1">
                                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-[12px] font-bold rounded-lg">
                                  Checked In · Rm 2
                                </span>
                                <div className="text-[11px] font-mono text-amber-600">
                                  Waiting: 22 min
                                </div>
                              </div>
                            )}
                            {apt.status === 'upcoming' && (
                              <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[12px] font-bold rounded-lg">
                                In 1h 23min
                              </span>
                            )}
                            {apt.status === 'critical' && (
                              <span className="px-3 py-1.5 bg-red-100 text-red-700 text-[12px] font-bold rounded-lg">
                                Emergency → ED
                              </span>
                            )}
                          </div>

                          <div className="space-y-0.5">
                            <div className={`text-[12px] font-mono font-bold ${
                              apt.revenuePaid ? 'text-emerald-600' : 'text-slate-400'
                            }`}>
                              {apt.revenue} {apt.revenuePaid ? '✅' : '⏳'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {apt.insurance}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Clinical Brief */}
                    <div className="px-5 py-4 grid grid-cols-3 gap-6">
                      {/* Left Column */}
                      <div className="col-span-2 space-y-4">
                        {/* Flags */}
                        {apt.flags.length > 0 && (
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                              FLAGS
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {apt.flags.map((flag, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-1 rounded text-[10px] font-bold ${
                                    flag.includes('ALLERGY') || flag.includes('Penicillin') || flag.includes('Aspirin')
                                      ? 'bg-red-50 text-red-600'
                                      : flag.includes('CRITICAL') || flag.includes('Troponin')
                                      ? 'bg-red-100 text-red-600 animate-pulse'
                                      : flag.includes('DAPT')
                                      ? 'bg-blue-100 text-blue-700'
                                      : flag.includes('New patient')
                                      ? 'bg-blue-50 text-blue-600'
                                      : 'bg-indigo-50 text-indigo-600'
                                  }`}
                                >
                                  {flag.includes('ALLERGY') || flag.includes('Penicillin') || flag.includes('Aspirin') ? '⚠️ ' : ''}
                                  {flag.includes('CRITICAL') || flag.includes('Troponin') ? '🔴 ' : ''}
                                  {flag.includes('DAPT') ? '⚠️ ' : ''}
                                  {flag.includes('New') ? '🆕 ' : ''}
                                  {flag.includes('Labs') || flag.includes('ECG') || flag.includes('Holter') ? '🔬 ' : ''}
                                  {flag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Conditions or Summary */}
                        {apt.status === 'completed' && apt.summary && (
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-emerald-600 font-semibold mb-2">
                              COMPLETED
                            </div>
                            <div className="text-[12px] text-slate-700 mb-1">
                              {apt.summary}
                            </div>
                            <div className="text-[12px] text-slate-500">
                              {apt.plan}
                            </div>
                            {apt.soapComplete && (
                              <div className="text-[10px] text-emerald-600 font-mono mt-2">
                                ✅ SOAP complete · Nabidh synced
                              </div>
                            )}
                          </div>
                        )}

                        {apt.status === 'in-progress' && apt.vitals && (
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-teal-600 font-semibold mb-2">
                              VITALS TODAY
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                              <div>
                                <div className="text-[9px] text-slate-400 mb-0.5">BP</div>
                                <div className="text-[12px] font-mono font-bold text-amber-600">
                                  {apt.vitals.bp} ↑
                                </div>
                              </div>
                              <div>
                                <div className="text-[9px] text-slate-400 mb-0.5">HR</div>
                                <div className="text-[12px] font-mono font-bold text-amber-600">
                                  {apt.vitals.hr} ↑
                                </div>
                              </div>
                              {apt.vitals.spo2 && (
                                <div>
                                  <div className="text-[9px] text-slate-400 mb-0.5">SpO2</div>
                                  <div className="text-[12px] font-mono font-bold text-amber-600">
                                    {apt.vitals.spo2} ⚠️
                                  </div>
                                </div>
                              )}
                              {apt.vitals.weight && (
                                <div>
                                  <div className="text-[9px] text-slate-400 mb-0.5">Weight</div>
                                  <div className="text-[12px] font-mono font-bold text-amber-600">
                                    {apt.vitals.weight}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {(apt.status === 'checked-in' || apt.status === 'upcoming') && apt.conditions.length > 0 && (
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                              CONDITIONS
                            </div>
                            <div className="text-[12px] text-slate-700 space-y-1">
                              {apt.conditions.map((cond, idx) => (
                                <div key={idx}>• {cond}</div>
                              ))}
                            </div>
                          </div>
                        )}

                        {apt.chiefComplaint && (
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                              CHIEF COMPLAINT
                            </div>
                            <div className="text-[12px] text-slate-600 italic bg-blue-50 px-3 py-2 rounded">
                              "{apt.chiefComplaint}"
                            </div>
                          </div>
                        )}

                        {apt.agenda && apt.agenda.length > 0 && (
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                              VISIT AGENDA
                            </div>
                            <div className="text-[11px] text-slate-600 space-y-1">
                              {apt.agenda.map((item, idx) => (
                                <div key={idx} className="flex items-start space-x-2">
                                  <span className="text-slate-400">{idx + 1}.</span>
                                  <span className={item.includes('CRITICAL') ? 'font-bold text-blue-700' : ''}>
                                    {item}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {apt.medications.length > 0 && (
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                              KEY MEDS
                            </div>
                            <div className="text-[12px] text-slate-700 space-y-1">
                              {apt.medications.slice(0, 3).map((med, idx) => (
                                <div key={idx} className="flex items-start space-x-1.5">
                                  <Pill className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                                  <span>{med}</span>
                                </div>
                              ))}
                              {apt.medications.length > 3 && (
                                <div className="text-[11px] text-slate-400 italic">
                                  + {apt.medications.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {apt.lastVisit && (
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                              LAST VISIT
                            </div>
                            <div className="text-[12px] text-slate-600 font-mono">
                              {apt.lastVisit}
                            </div>
                            {apt.visitCount !== undefined && (
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {apt.visitCount} {apt.visitCount === 1 ? 'visit' : 'visits'} total
                              </div>
                            )}
                          </div>
                        )}

                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                            INSURANCE
                          </div>
                          <div className="text-[12px] text-slate-700">
                            {apt.insurance}
                          </div>
                          {!apt.revenuePaid && (
                            <div className="text-[11px] text-amber-600 font-mono mt-0.5">
                              Co-pay: AED 40
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className={`px-5 py-3 border-t border-slate-100 flex items-center space-x-2 ${
                      apt.status === 'in-progress'
                        ? 'bg-teal-50'
                        : apt.status === 'checked-in'
                        ? 'bg-blue-50/40'
                        : apt.status === 'critical'
                        ? 'bg-red-50'
                        : 'bg-white'
                    }`}>
                      {apt.status === 'completed' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedPatient(apt);
                              setShowSoapModal(true);
                            }}
                            className="px-3 py-2 bg-slate-100 text-slate-600 text-[12px] font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center space-x-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View SOAP Notes</span>
                          </button>
                          <button className="px-3 py-2 bg-slate-100 text-slate-600 text-[12px] font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center space-x-1.5">
                            <Pill className="w-3.5 h-3.5" />
                            <span>View Prescription</span>
                          </button>
                          <button className="px-3 py-2 bg-slate-100 text-slate-600 text-[12px] font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center space-x-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Message Patient</span>
                          </button>
                          <button className="px-3 py-2 text-slate-400 text-[11px] font-medium rounded-lg hover:bg-slate-100 transition-colors flex items-center space-x-1.5 ml-auto">
                            <RotateCcw className="w-3 h-3" />
                            <span>Re-open</span>
                          </button>
                        </>
                      )}

                      {apt.status === 'in-progress' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedPatient(apt);
                              setShowWorkspace(true);
                            }}
                            className="px-5 py-2.5 bg-teal-600 text-white text-[14px] font-bold rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
                          >
                            <Play className="w-4 h-4" />
                            <span>OPEN WORKSPACE</span>
                          </button>
                          <button className="px-3 py-2 bg-teal-100 text-teal-700 text-[12px] font-medium rounded-lg hover:bg-teal-200 transition-colors flex items-center space-x-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Quick SOAP</span>
                          </button>
                          <button className="px-3 py-2 bg-teal-100 text-teal-700 text-[12px] font-medium rounded-lg hover:bg-teal-200 transition-colors flex items-center space-x-1.5">
                            <Pill className="w-3.5 h-3.5" />
                            <span>Prescribe</span>
                          </button>
                          <button className="px-3 py-2 bg-teal-100 text-teal-700 text-[12px] font-medium rounded-lg hover:bg-teal-200 transition-colors flex items-center space-x-1.5">
                            <FlaskConical className="w-3.5 h-3.5" />
                            <span>Order Lab</span>
                          </button>
                          <button className="px-3 py-2 border border-slate-300 text-red-600 text-[11px] font-medium rounded-lg hover:bg-red-50 transition-colors ml-auto">
                            ⏹ End Session
                          </button>
                        </>
                      )}

                      {apt.status === 'checked-in' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedPatient(apt);
                              setShowWorkspace(true);
                            }}
                            className="px-5 py-2.5 bg-teal-600 text-white text-[14px] font-bold rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
                          >
                            <Play className="w-4 h-4" />
                            <span>START CONSULTATION</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPatient(apt);
                              setShowPatientBrief(true);
                            }}
                            className="px-3 py-2 bg-blue-100 text-blue-700 text-[12px] font-medium rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Pre-Review</span>
                          </button>
                          <button className="px-3 py-2 bg-slate-100 text-slate-600 text-[12px] font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center space-x-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Send Prep Note</span>
                          </button>
                          <button className="px-3 py-2 text-red-500 text-[11px] font-medium rounded-lg hover:bg-red-50 transition-colors ml-auto">
                            ❌ No Show
                          </button>
                        </>
                      )}

                      {apt.status === 'upcoming' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedPatient(apt);
                              setShowPatientBrief(true);
                            }}
                            className="px-3 py-2 bg-slate-100 text-slate-600 text-[12px] font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center space-x-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Pre-Review</span>
                          </button>
                          <button className="px-3 py-2 bg-blue-100 text-blue-700 text-[12px] font-medium rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1.5">
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span>Mark Arrived</span>
                          </button>
                          <button className="px-3 py-2 text-red-500 text-[11px] font-medium rounded-lg hover:bg-red-50 transition-colors">
                            ❌ Cancel
                          </button>
                          <button className="px-3 py-2 bg-slate-100 text-slate-600 text-[12px] font-medium rounded-lg hover:bg-slate-200 transition-colors ml-auto">
                            <Bell className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {apt.status === 'critical' && (
                        <>
                          <button className="flex-1 px-5 py-2.5 bg-red-600 text-white text-[14px] font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>ACKNOWLEDGE CRITICAL RESULT</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPatient(apt);
                              setShowSoapModal(true);
                            }}
                            className="px-3 py-2 bg-red-100 text-red-700 text-[12px] font-medium rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View SOAP</span>
                          </button>
                          <button className="px-3 py-2 bg-red-100 text-red-700 text-[12px] font-medium rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1.5">
                            <Activity className="w-3.5 h-3.5" />
                            <span>Contact ED</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* End of Day Summary */}
            {completedCount === appointments.length && (
              <div className="bg-white rounded-2xl shadow-sm border-l-[5px] border-emerald-400 p-6 bg-emerald-50">
                <h3 className="text-[16px] font-bold text-emerald-700 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  ✅ All appointments complete — 7 April 2026
                </h3>

                <div className="grid grid-cols-4 gap-4 text-[13px]">
                  <div>
                    <div className="text-slate-400">Total appointments</div>
                    <div className="font-mono font-bold text-slate-700">8</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Completed</div>
                    <div className="font-mono font-bold text-emerald-600">8</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Revenue collected</div>
                    <div className="font-mono font-bold text-emerald-600">AED 3,200</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Avg consultation</div>
                    <div className="font-mono font-bold text-slate-700">26 min</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-emerald-200">
                  <div className="text-[11px] text-emerald-700 font-mono">
                    ✅ 8/8 SOAP notes complete · All synced to Nabidh
                  </div>
                  {showCriticalAlert && (
                    <div className="mt-2 px-3 py-2 bg-red-100 text-red-700 text-[11px] font-semibold rounded-lg">
                      ⚠️ Pending action: Critical result acknowledgment — Abdullah
                    </div>
                  )}
                </div>

                <button className="mt-4 text-[12px] text-teal-600 font-semibold hover:underline">
                  📊 View Day Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals would go here - Patient Brief, SOAP View, Walk-in, Workspace */}
      {showPatientBrief && selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-[17px] font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Pre-Consultation Brief
                </h2>
                <p className="text-[13px] text-slate-300">
                  {selectedPatient.patient} · {selectedPatient.patientId}
                </p>
              </div>
              <button
                onClick={() => setShowPatientBrief(false)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(92vh-120px)]">
              <div className="space-y-6">
                {/* Patient Overview */}
                <div className="flex items-center space-x-4 pb-4 border-b border-slate-200">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {getInitials(selectedPatient.patient)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[18px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {selectedPatient.patient}
                    </h3>
                    <div className="text-[14px] text-slate-500">
                      {selectedPatient.age} · {selectedPatient.bloodType} · {selectedPatient.insurance}
                    </div>
                    {selectedPatient.allergies.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedPatient.allergies.map((allergy, idx) => (
                          <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 text-[11px] font-bold rounded">
                            ⚠️ {allergy}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded inline-block">
                        ✅ No known allergies
                      </div>
                    )}
                  </div>
                </div>

                {/* Conditions */}
                {selectedPatient.conditions.length > 0 && (
                  <div>
                    <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                      ACTIVE CONDITIONS
                    </h4>
                    <div className="space-y-1 text-[13px] text-slate-700">
                      {selectedPatient.conditions.map((cond, idx) => (
                        <div key={idx}>• {cond}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medications */}
                {selectedPatient.medications.length > 0 && (
                  <div>
                    <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                      CURRENT MEDICATIONS
                    </h4>
                    <div className="space-y-2">
                      {selectedPatient.medications.map((med, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-[13px] text-slate-700">
                          <Pill className="w-4 h-4 text-teal-500" />
                          <span className={med.includes('Clopidogrel') ? 'font-bold text-red-600' : ''}>
                            {med}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visit Agenda */}
                {selectedPatient.agenda && selectedPatient.agenda.length > 0 && (
                  <div>
                    <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                      SUGGESTED AGENDA FOR TODAY'S VISIT
                    </h4>
                    <div className="space-y-2 text-[13px] text-slate-700">
                      {selectedPatient.agenda.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <span className="font-mono text-slate-400">{idx + 1}.</span>
                          <span className={item.includes('CRITICAL') ? 'font-bold text-blue-700' : ''}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center space-x-3">
              <button
                onClick={() => {
                  setShowPatientBrief(false);
                  setShowWorkspace(true);
                }}
                className="flex-1 px-5 py-3 bg-teal-600 text-white text-[14px] font-bold rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Open Workspace</span>
              </button>
              <button className="flex-1 px-5 py-3 border-2 border-slate-300 text-slate-700 text-[14px] font-semibold rounded-lg hover:bg-slate-100 transition-colors">
                Message Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOAP Modal */}
      {showSoapModal && selectedPatient && selectedPatient.soapComplete && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-[17px] font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  SOAP Notes — {selectedPatient.patient}
                </h2>
                <p className="text-[13px] text-slate-300 font-mono">
                  7 April 2026 · {selectedPatient.time} · {selectedPatient.actualDuration}
                </p>
              </div>
              <button
                onClick={() => setShowSoapModal(false)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(92vh-180px)]">
              <div className="space-y-6">
                {/* Vitals */}
                {selectedPatient.vitals && (
                  <div>
                    <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-3">
                      VITALS
                    </h4>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-[10px] text-slate-400">BP</div>
                        <div className="text-[14px] font-mono font-bold text-slate-700">
                          {selectedPatient.vitals.bp}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">HR</div>
                        <div className="text-[14px] font-mono font-bold text-slate-700">
                          {selectedPatient.vitals.hr}
                        </div>
                      </div>
                      {selectedPatient.vitals.weight && (
                        <div>
                          <div className="text-[10px] text-slate-400">Weight</div>
                          <div className="text-[14px] font-mono font-bold text-slate-700">
                            {selectedPatient.vitals.weight}
                          </div>
                        </div>
                      )}
                      {selectedPatient.vitals.spo2 && (
                        <div>
                          <div className="text-[10px] text-slate-400">SpO2</div>
                          <div className="text-[14px] font-mono font-bold text-slate-700">
                            {selectedPatient.vitals.spo2}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SOAP */}
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-3">
                    SOAP DOCUMENTATION
                  </h4>

                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-[11px] font-bold text-blue-700 mb-1">S: SUBJECTIVE</div>
                      <div className="text-[13px] text-slate-700 italic">
                        {selectedPatient.chiefComplaint || 'Patient reports improvement in symptoms since last visit.'}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-[11px] font-bold text-slate-700 mb-1">O: OBJECTIVE</div>
                      <div className="text-[13px] text-slate-700">
                        Vitals as documented above. Physical examination unremarkable.
                      </div>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="text-[11px] font-bold text-teal-700 mb-1">A: ASSESSMENT</div>
                      <div className="text-[13px] text-slate-700">
                        {selectedPatient.summary}
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="text-[11px] font-bold text-emerald-700 mb-1">P: PLAN</div>
                      <div className="text-[13px] text-slate-700">
                        {selectedPatient.plan}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medications */}
                {selectedPatient.medications.length > 0 && (
                  <div>
                    <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                      MEDICATIONS PRESCRIBED
                    </h4>
                    <div className="space-y-2">
                      {selectedPatient.medications.slice(0, 2).map((med, idx) => (
                        <div key={idx} className="text-[13px] text-slate-700">
                          {med} — <span className="text-emerald-600">✅ Rx sent</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nabidh Status */}
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="text-[13px] text-emerald-700 font-semibold mb-1">
                    ✅ Synced to national record — {selectedPatient.completed}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Encounter ID: ENC-20260407-{selectedPatient.id.padStart(6, '0')}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center space-x-3">
              <button
                onClick={() => setShowSoapModal(false)}
                className="px-5 py-2 border-2 border-slate-300 text-slate-700 text-[13px] font-semibold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button className="px-5 py-2 bg-slate-700 text-white text-[13px] font-semibold rounded-lg hover:bg-slate-800 transition-colors">
                Re-open to Amend
              </button>
              <button className="px-5 py-2 bg-teal-600 text-white text-[13px] font-semibold rounded-lg hover:bg-teal-700 transition-colors ml-auto">
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodaysAppointments;
