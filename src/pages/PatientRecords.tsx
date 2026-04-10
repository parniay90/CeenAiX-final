import React, { useState } from 'react';
import DoctorSidebarNew from '../components/doctor/DoctorSidebarNew';
import PatientDetailView from '../components/patient/PatientDetailView';
import {
  Search,
  UserPlus,
  Download,
  ChevronDown,
  MoreVertical,
  MessageSquare,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Play,
  ArrowLeft,
  Pill,
  FlaskConical,
  Stethoscope,
  Activity,
  FileImage,
  Lock,
  TrendingUp,
  Users as UsersIcon,
  Bell
} from 'lucide-react';

const navigateTo = (path: string) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  bloodType: string;
  insurance: string;
  risk: 'critical' | 'high' | 'medium' | 'low' | 'new';
  conditions: string[];
  conditionsOther?: string[];
  allergies: string[];
  flags: string[];
  lastVisit: string;
  nextAppt: string;
  visitCount: number;
  inSession?: boolean;
  checkedIn?: boolean;
}

const PatientRecords: React.FC = () => {
  const [view, setView] = useState<'list' | 'card'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddPatient, setShowAddPatient] = useState(false);

  const patients: Patient[] = [
    {
      id: 'PT-005',
      name: 'Abdullah Hassan Al Zaabi',
      age: '62M',
      gender: 'Male',
      bloodType: 'A-',
      insurance: 'Daman Gold',
      risk: 'critical',
      conditions: ['Suspected STEMI — Al Noor ED now'],
      allergies: [],
      flags: ['Troponin 2.8 CRITICAL', 'In ED'],
      lastVisit: '7 Apr (Emergency)',
      nextAppt: 'N/A (in ED)',
      visitCount: 1
    },
    {
      id: 'PT-006',
      name: 'Aisha Mohammed Al Reem',
      age: '42F',
      gender: 'Female',
      bloodType: 'O-',
      insurance: 'AXA Gulf',
      risk: 'high',
      conditions: ['HFrEF (LVEF 38%)', 'Hypertension'],
      allergies: [],
      flags: ['K+ risk', 'In session', 'Fluid +2kg'],
      lastVisit: '7 Apr · In progress',
      nextAppt: 'Apr 28',
      visitCount: 5,
      inSession: true
    },
    {
      id: 'PT-009',
      name: 'Mohammed Al Rasheed',
      age: '71M',
      gender: 'Male',
      bloodType: 'Unknown',
      insurance: 'Daman Gold',
      risk: 'high',
      conditions: ['CAD', 'HFrEF (LVEF 42%)'],
      allergies: [],
      flags: [],
      lastVisit: '5 Apr 2026',
      nextAppt: 'May 1',
      visitCount: 18
    },
    {
      id: 'PT-007',
      name: 'Saeed Rashid Al Mansoori',
      age: '58M',
      gender: 'Male',
      bloodType: 'B-',
      insurance: 'Oman Insurance',
      risk: 'medium',
      conditions: ['Post-PCI (LAD)', 'HTN', 'Dyslipidemia'],
      allergies: [],
      flags: ['DAPT — no stop', 'Checked in'],
      lastVisit: '7 Apr (Today)',
      nextAppt: 'Not scheduled',
      visitCount: 2,
      checkedIn: true
    },
    {
      id: 'PT-003',
      name: 'Fatima Bint Rashid Al Maktoum',
      age: '65F',
      gender: 'Female',
      bloodType: 'AB+',
      insurance: 'Thiqa Abu Dhabi',
      risk: 'medium',
      conditions: ['Hypertension', 'Mild LVH (new)'],
      allergies: ['Aspirin'],
      flags: ['Aspirin allergy', 'New Rx today'],
      lastVisit: '7 Apr (Today ✅)',
      nextAppt: 'Jul 7, 2026',
      visitCount: 4
    },
    {
      id: 'PT-004',
      name: 'Mohammed Rashid Al Shamsi',
      age: '48M',
      gender: 'Male',
      bloodType: 'B+',
      insurance: 'Daman Basic',
      risk: 'medium',
      conditions: ['Atypical chest pain — workup pending'],
      allergies: [],
      flags: ['New patient', 'Stress Echo tomorrow'],
      lastVisit: '7 Apr (Today ✅)',
      nextAppt: 'After results',
      visitCount: 1
    },
    {
      id: 'PT-010',
      name: 'Sarah Al Hamdan',
      age: '45F',
      gender: 'Female',
      bloodType: 'Unknown',
      insurance: 'Daman Gold',
      risk: 'medium',
      conditions: ['Hypertension', 'Suspected arrhythmia'],
      allergies: [],
      flags: [],
      lastVisit: '22 Mar 2026 (16d ago)',
      nextAppt: 'Apr 19',
      visitCount: 7
    },
    {
      id: 'PT-012',
      name: 'Layla Al Suwaidi',
      age: '38F',
      gender: 'Female',
      bloodType: 'Unknown',
      insurance: 'Daman Basic',
      risk: 'medium',
      conditions: ['Palpitations', 'Anxiety (dx pending)'],
      allergies: [],
      flags: [],
      lastVisit: '12 Mar 2026',
      nextAppt: 'Apr 12',
      visitCount: 3
    },
    {
      id: 'PT-001',
      name: 'Parnia Yazdkhasti',
      age: '38F',
      gender: 'Female',
      bloodType: 'A+',
      insurance: 'Daman Gold',
      risk: 'medium',
      conditions: ['Hypertension (controlled)', 'CAC 42'],
      conditionsOther: ['T2 Diabetes (Dr. Fatima)'],
      allergies: ['Penicillin (SEVERE)', 'Sulfa drugs'],
      flags: ['Penicillin SEVERE', 'Sulfa drugs'],
      lastVisit: '7 Apr (Today ✅)',
      nextAppt: 'Apr 15',
      visitCount: 6
    },
    {
      id: 'PT-002',
      name: 'Khalid Hassan Abdullah',
      age: '54M',
      gender: 'Male',
      bloodType: 'O+',
      insurance: 'ADNIC Standard',
      risk: 'low',
      conditions: ['Hypertension (controlled)', 'Dyslipidemia'],
      allergies: [],
      flags: [],
      lastVisit: '7 Apr (Today ✅)',
      nextAppt: 'May 5',
      visitCount: 12
    },
    {
      id: 'PT-011',
      name: 'Hassan Ibrahim Al Kuwari',
      age: '55M',
      gender: 'Male',
      bloodType: 'Unknown',
      insurance: 'ADNIC',
      risk: 'low',
      conditions: ['Annual cardiac check'],
      allergies: [],
      flags: [],
      lastVisit: 'Jan 5, 2026 (3mo)',
      nextAppt: 'Jan 5, 2027',
      visitCount: 3
    },
    {
      id: 'PT-008',
      name: 'Noura Bint Khalid Al Hamdan',
      age: '34F',
      gender: 'Female',
      bloodType: 'Unknown',
      insurance: 'Daman Basic',
      risk: 'new',
      conditions: ['New patient — palpitations workup'],
      allergies: [],
      flags: ['First visit', 'ECG pre-ordered'],
      lastVisit: 'Today 3:30 PM',
      nextAppt: 'Today 3:30 PM',
      visitCount: 0
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'red';
      case 'high': return 'amber';
      case 'medium': return 'blue';
      case 'low': return 'emerald';
      case 'new': return 'teal';
      default: return 'slate';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'critical':
        return <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded animate-pulse">🔴 CRITICAL</span>;
      case 'high':
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">🟠 HIGH</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">🔵 MEDIUM</span>;
      case 'low':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">✅ LOW</span>;
      case 'new':
        return <span className="px-2 py-1 bg-teal-100 text-teal-700 text-[10px] font-bold rounded">🆕 NEW</span>;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts[0][0] + (parts[1]?.[0] || '');
  };

  const filteredPatients = patients.filter(p => {
    if (filterActive === 'today') return p.lastVisit.includes('Today') || p.lastVisit.includes('7 Apr');
    if (filterActive === 'critical') return p.risk === 'critical';
    if (filterActive === 'high') return p.risk === 'high';
    return true;
  });

  if (selectedPatient) {
    return (
      <div className="flex h-screen bg-slate-50">
        <DoctorSidebarNew />
        <PatientDetailView
          patient={selectedPatient}
          onBack={() => setSelectedPatient(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <DoctorSidebarNew />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-[22px] text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Patient Records
            </h1>
            <p className="text-[13px] text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
              {patients.length} patients — Al Noor Medical Center Cardiology
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddPatient(true)}
              className="px-4 py-2 bg-teal-600 text-white text-[13px] font-semibold rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Patient</span>
            </button>

            <button className="px-4 py-2 border border-slate-300 text-slate-600 text-[13px] font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

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

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Search + Filter Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, Emirates ID, condition, or medication..."
                  className="w-full h-12 pl-12 pr-4 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-500"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFilterActive('all')}
                    className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors ${
                      filterActive === 'all'
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Patients ({patients.length}) ●
                  </button>
                  <button
                    onClick={() => setFilterActive('today')}
                    className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors ${
                      filterActive === 'today'
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Today (8)
                  </button>
                  <button
                    onClick={() => setFilterActive('critical')}
                    className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors ${
                      filterActive === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    } ${filterActive !== 'critical' && patients.some(p => p.risk === 'critical') ? 'animate-pulse' : ''}`}
                  >
                    Critical (1)
                  </button>
                  <button
                    onClick={() => setFilterActive('high')}
                    className={`px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors ${
                      filterActive === 'high'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    High Risk (3)
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Sort: Last Visit</option>
                    <option>Sort: Risk (highest first)</option>
                    <option>Sort: Name A-Z</option>
                    <option>Sort: Next Appointment</option>
                  </select>

                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                    <button
                      onClick={() => setView('list')}
                      className={`px-2 py-1 rounded ${
                        view === 'list'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500'
                      }`}
                    >
                      ☰
                    </button>
                    <button
                      onClick={() => setView('card')}
                      className={`px-2 py-1 rounded ${
                        view === 'card'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500'
                      }`}
                    >
                      ⊞
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 grid grid-cols-12 gap-4 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <div className="col-span-3">Patient</div>
                <div className="col-span-1 text-center">Risk</div>
                <div className="col-span-2">Conditions</div>
                <div className="col-span-2">Flags</div>
                <div className="col-span-1">Last Visit</div>
                <div className="col-span-2">Next Appt</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Patient Rows */}
              <div>
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`px-5 py-4 border-b border-slate-100 grid grid-cols-12 gap-4 items-center cursor-pointer transition-all hover:bg-slate-50 group ${
                      patient.risk === 'critical'
                        ? 'bg-red-50 border-l-4 border-l-red-600 animate-pulse'
                        : patient.risk === 'high'
                        ? 'bg-amber-50 border-l-4 border-l-amber-500'
                        : patient.risk === 'medium'
                        ? 'border-l-4 border-l-blue-300'
                        : patient.risk === 'new'
                        ? 'border-l-4 border-l-teal-400'
                        : ''
                    }`}
                  >
                    {/* Patient */}
                    <div className="col-span-3 flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                        patient.risk === 'critical'
                          ? 'from-red-500 to-red-600'
                          : patient.risk === 'high'
                          ? 'from-amber-500 to-amber-600'
                          : patient.risk === 'medium'
                          ? 'from-blue-500 to-blue-600'
                          : patient.risk === 'new'
                          ? 'from-teal-500 to-teal-600'
                          : 'from-slate-500 to-slate-600'
                      } flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                        {getInitials(patient.name)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[14px] text-slate-900 truncate" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          {patient.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {patient.id} · {patient.age} · {patient.bloodType} · {patient.insurance}
                        </div>
                        {patient.allergies.length > 0 && (
                          <div className="mt-1">
                            <span className="inline-block px-1.5 py-0.5 bg-red-50 text-red-600 text-[9px] font-bold rounded">
                              ⚠️ {patient.allergies[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Risk */}
                    <div className="col-span-1 flex justify-center">
                      {getRiskBadge(patient.risk)}
                    </div>

                    {/* Conditions */}
                    <div className="col-span-2">
                      <div className="text-[13px] text-slate-700">
                        {patient.conditions.slice(0, 2).join(' · ')}
                      </div>
                      {patient.conditionsOther && (
                        <div className="text-[12px] text-slate-400 italic mt-0.5">
                          {patient.conditionsOther[0]}
                        </div>
                      )}
                    </div>

                    {/* Flags */}
                    <div className="col-span-2 flex flex-wrap gap-1">
                      {patient.flags.slice(0, 3).map((flag, idx) => (
                        <span
                          key={idx}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            flag.includes('CRITICAL') || flag.includes('Troponin')
                              ? 'bg-red-100 text-red-600 animate-pulse'
                              : flag.includes('SEVERE') || flag.includes('Penicillin') || flag.includes('allergy')
                              ? 'bg-red-50 text-red-600'
                              : flag.includes('DAPT') || flag.includes('Checked in')
                              ? 'bg-blue-100 text-blue-700'
                              : flag.includes('session')
                              ? 'bg-teal-100 text-teal-700'
                              : flag.includes('New') || flag.includes('First')
                              ? 'bg-teal-50 text-teal-600'
                              : 'bg-indigo-50 text-indigo-600'
                          }`}
                        >
                          {flag.includes('allergy') || flag.includes('SEVERE') ? '⚠️ ' : ''}
                          {flag.includes('CRITICAL') ? '🔴 ' : ''}
                          {flag.includes('session') || flag.includes('Checked') ? '● ' : ''}
                          {flag}
                        </span>
                      ))}
                    </div>

                    {/* Last Visit */}
                    <div className="col-span-1">
                      <div className="text-[12px] text-slate-600 font-mono">
                        {patient.lastVisit.split('(')[0].trim()}
                      </div>
                      {patient.lastVisit.includes('Today') && (
                        <div className="text-[10px] text-emerald-600 font-bold">
                          Today ✅
                        </div>
                      )}
                    </div>

                    {/* Next Appt */}
                    <div className="col-span-2">
                      <div className="text-[12px] text-slate-600 font-mono">
                        {patient.nextAppt}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end space-x-1">
                      {patient.risk === 'critical' && (
                        <button className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded hover:bg-red-700 transition-colors">
                          ✅ Acknowledge
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatient(patient);
                        }}
                        className="px-3 py-1.5 bg-teal-100 text-teal-700 text-[11px] font-medium rounded hover:bg-teal-200 transition-colors opacity-0 group-hover:opacity-100 flex items-center space-x-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Open Record</span>
                      </button>

                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-slate-200 rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[12px] text-slate-500">
                <div>
                  Showing {filteredPatients.length} of {patients.length} patients · Sorted by: Last Visit
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white transition-colors">
                    ← 1
                  </button>
                  <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white transition-colors">
                    2 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddPatient && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-[17px] font-bold text-white flex items-center space-x-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                <UserPlus className="w-5 h-5" />
                <span>Add Patient to Practice</span>
              </h2>
              <button
                onClick={() => setShowAddPatient(false)}
                className="text-slate-300 hover:text-white transition-colors text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Search Nabidh */}
                <div className="border-2 border-teal-200 rounded-xl p-5 hover:border-teal-300 transition-colors">
                  <h3 className="font-bold text-[15px] text-slate-900 mb-2">Find existing UAE patient</h3>
                  <p className="text-[13px] text-slate-500 mb-4">Search national health records</p>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="784-XXXX-XXXXXXX-X"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button className="w-full px-4 py-2.5 bg-teal-600 text-white text-[13px] font-semibold rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2">
                      <Search className="w-4 h-4" />
                      <span>Search Nabidh</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-3">
                    Patient must consent to connect their record
                  </p>
                </div>

                {/* Create New */}
                <div className="border-2 border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
                  <h3 className="font-bold text-[15px] text-slate-900 mb-2">Create new record</h3>
                  <p className="text-[13px] text-slate-500 mb-4">New patient — no Nabidh record</p>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Full name (English)"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      placeholder="Full name (Arabic)"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="date"
                      placeholder="Date of birth"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button className="w-full px-4 py-2.5 bg-slate-700 text-white text-[13px] font-semibold rounded-lg hover:bg-slate-800 transition-colors">
                      Create Patient Record
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
