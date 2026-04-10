import React, { useState, useEffect } from 'react';
import DoctorSidebarNew from '../components/doctor/DoctorSidebarNew';
import DoctorTopBarNew from '../components/doctor/DoctorTopBarNew';
import CriticalAlertBanner from '../components/doctor/CriticalAlertBanner';

const navigateTo = (path: string) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};
import {
  Users,
  Stethoscope,
  FileText,
  AlertCircle,
  TrendingUp,
  CalendarCheck,
  PenLine,
  FlaskConical,
  MessageSquare,
  CircleDollarSign,
  ShieldCheck,
  Clock,
  ChevronRight,
  Play,
  Activity,
  TestTube,
  ClipboardList,
  Video,
  Calendar,
  Send,
  Bot,
  AlertTriangle,
  Lightbulb,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';

const DoctorPortal: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(277);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const appointments = [
    {
      time: '9:00 AM',
      duration: '22 min',
      patient: 'Khalid Hassan',
      type: 'Follow-up · Hypertension',
      insurance: 'ADNIC',
      status: 'completed',
      flags: []
    },
    {
      time: '9:30 AM',
      duration: '28 min',
      patient: 'Parnia Yazdkhasti',
      type: 'Post-MRI Cardiology',
      insurance: 'Daman Gold',
      status: 'completed',
      flags: ['⚠️ Penicillin allergy']
    },
    {
      time: '10:00 AM',
      duration: '35 min',
      patient: 'Mohammed Al Shamsi',
      type: 'New — Chest Pain',
      insurance: 'Daman Basic',
      status: 'completed',
      flags: ['🔬 Labs ordered']
    },
    {
      time: '10:45 AM',
      duration: '20 min',
      patient: 'Fatima Bint Rashid',
      type: 'Echo Review',
      insurance: 'Thiqa',
      status: 'completed',
      flags: ['💊 New prescription']
    },
    {
      time: '11:30 AM',
      duration: '15 min',
      patient: 'Abdullah Hassan',
      type: 'URGENT — Chest Pain',
      insurance: 'Daman Gold',
      status: 'critical',
      flags: ['🔴 CRITICAL lab result']
    },
    {
      time: '2:00 PM',
      duration: 'In progress',
      patient: 'Aisha Mohammed Al Reem',
      type: 'Heart Failure Follow-up',
      insurance: 'AXA Gulf',
      status: 'in-progress',
      flags: ['⚠️ Fluid retention']
    },
    {
      time: '2:45 PM',
      duration: 'Upcoming',
      patient: 'Saeed Al Mansoori',
      type: 'Post-Stent Follow-up',
      insurance: 'Oman Insurance',
      status: 'upcoming',
      flags: ['🫀 Post-procedure']
    },
    {
      time: '3:30 PM',
      duration: 'Upcoming',
      patient: 'Noura Bint Khalid',
      type: 'New — Palpitations',
      insurance: 'Daman Basic',
      status: 'upcoming',
      flags: ['📋 First visit']
    }
  ];

  const kpiCards = [
    {
      icon: CalendarCheck,
      label: 'Appointments Today',
      value: '8',
      sub: '5 done · 1 in progress · 2 remaining',
      color: 'teal',
      progress: 62.5
    },
    {
      icon: PenLine,
      label: 'Prescriptions Written',
      value: '4',
      sub: 'Today · 1 pharmacy query pending',
      color: 'purple',
      badge: 'Query'
    },
    {
      icon: FlaskConical,
      label: 'Lab Orders Today',
      value: '3',
      sub: '1 critical pending · 1 complete',
      color: 'indigo',
      critical: true
    },
    {
      icon: MessageSquare,
      label: 'Unread Messages',
      value: '4',
      sub: '1 critical lab · 1 pharma query · 2 patients',
      color: 'blue'
    },
    {
      icon: CircleDollarSign,
      label: 'Revenue Today',
      value: 'AED 2,400',
      sub: 'AED 800 remaining if all 3 complete',
      color: 'emerald',
      progress: 75
    },
    {
      icon: ShieldCheck,
      label: 'DHA License Status',
      value: 'Valid ✓',
      sub: 'DHA-PRAC-2018-047821 · Expires Dec 2026',
      color: 'emerald',
      extraSub: '269 days remaining'
    }
  ];

  const labResults = [
    {
      patient: 'Abdullah Hassan',
      test: 'Troponin I — 2.8 ng/mL',
      status: 'critical',
      info: 'CRITICAL ↑↑ · Ref: <0.04 · Resulted 11:47 AM',
      time: 'Unacknowledged: 1h 12min'
    },
    {
      patient: 'Mohammed Al Shamsi',
      test: 'BNP + Troponin + CBC',
      status: 'pending',
      info: 'Ordered 10:30 AM · Expected ~5:00 PM',
      time: ''
    },
    {
      patient: 'Parnia Yazdkhasti',
      test: 'Full Panel — March 5',
      status: 'complete',
      info: 'Reviewed 5 March · HbA1c 6.8% ↓ improving',
      time: ''
    }
  ];

  const messages = [
    {
      from: 'Dubai Medical Lab',
      preview: 'CRITICAL: Abdullah Hassan — Troponin 2.8...',
      time: '11:47 AM',
      type: 'critical',
      icon: 'lab'
    },
    {
      from: 'Parnia Yazdkhasti',
      preview: 'Morning reading: 128/82. All good! ☕',
      time: '8:47 AM',
      type: 'patient',
      avatar: 'PY'
    },
    {
      from: 'Dr. Sarah Al Khateeb',
      preview: 'Referred: Mahmoud Siddiq — HCM query...',
      time: '10:30 AM',
      type: 'colleague',
      avatar: 'SK'
    },
    {
      from: 'Al Shifa Pharmacy',
      preview: 'Query: Atorvastatin generic substitution...',
      time: '1:15 PM',
      type: 'pharmacy',
      icon: 'pharmacy'
    }
  ];

  const quickActions = [
    { icon: ClipboardList, label: 'Write Prescription', color: 'purple' },
    { icon: TestTube, label: 'Order Lab Test', color: 'indigo', badge: '1 critical' },
    { icon: Calendar, label: 'Block Time Off', color: 'slate' },
    { icon: Send, label: 'Send Referral', color: 'teal' },
    { icon: FileText, label: 'Write Certificate', color: 'blue' },
    { icon: Bot, label: 'Ask Clinical AI', color: 'indigo' }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <DoctorSidebarNew
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        activeTab="dashboard"
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorTopBarNew hasCriticalAlert={true} />

        <main className="flex-1 overflow-y-auto px-6 py-5">
          <CriticalAlertBanner />

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-slate-900 font-bold text-[28px] mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Good afternoon, Dr. Ahmed. 🏥
              </h1>
              <p className="text-slate-400 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Wednesday, 7 April 2026 · Al Noor Medical Center
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 px-5 py-3 shadow-sm">
              <div className="flex items-center space-x-6">
                <div>
                  <p className="text-teal-600 font-bold text-xl font-mono">5 of 8</p>
                  <p className="text-slate-500 text-xs">appointments done</p>
                </div>
                <div className="w-32">
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full transition-all duration-600" style={{ width: '62.5%' }}></div>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">Finish est.: ~4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0A1628] to-teal-600 rounded-[20px] p-7 mb-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-teal-500/10 animate-pulse-slow"></div>

            <div className="relative flex items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 text-[10px] uppercase tracking-wider font-bold">
                    ● LIVE CONSULTATION
                  </span>
                </div>

                <h2 className="text-white font-bold text-[22px] mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Aisha Mohammed Al Reem
                </h2>

                <div className="flex items-center space-x-4 text-white/70 text-[13px] mb-3">
                  <span>42F · Daman Gold · AXA Gulf</span>
                  <span className="text-teal-300">❤️ Heart Failure — Follow-up</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded">
                    ⚠️ Fluid retention
                  </span>
                  <span className="px-2 py-1 bg-blue-800/50 text-blue-300 text-[10px] font-bold rounded">
                    💊 3 active medications
                  </span>
                  <span className="px-2 py-1 bg-slate-600 text-white/60 text-[10px] rounded">
                    📋 Last visit: 3 months ago
                  </span>
                </div>

                <div className="text-white">
                  <p className="text-white/40 text-xs mb-1">Session started: 2:00 PM</p>
                  <p className="font-mono text-2xl font-bold">Duration: {formatDuration(sessionDuration)}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setShowWorkspace(true)}
                  className="flex items-center justify-center space-x-2 px-6 py-4 bg-white hover:bg-slate-50 text-[#0A1628] rounded-2xl font-bold text-[15px] shadow-xl hover:scale-105 transition-all"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  <Play className="w-5 h-5" />
                  <span>Open Consultation Workspace</span>
                </button>

                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-colors">
                    📋 SOAP Notes
                  </button>
                  <button className="flex-1 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-colors">
                    💊 Prescribe
                  </button>
                  <button className="flex-1 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-colors">
                    🔬 Order Lab
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-4 mb-6">
            {kpiCards.map((card, index) => {
              const Icon = card.icon;
              const colors = {
                teal: { bg: 'bg-teal-100', icon: 'text-teal-600', text: 'text-teal-600' },
                purple: { bg: 'bg-purple-100', icon: 'text-purple-600', text: 'text-purple-600' },
                indigo: { bg: 'bg-indigo-100', icon: 'text-indigo-600', text: 'text-indigo-600' },
                blue: { bg: 'bg-blue-100', icon: 'text-blue-600', text: 'text-blue-600' },
                emerald: { bg: 'bg-emerald-100', icon: 'text-emerald-600', text: 'text-emerald-600' },
                slate: { bg: 'bg-slate-100', icon: 'text-slate-600', text: 'text-slate-600' }
              };
              const color = colors[card.color as keyof typeof colors];

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (card.label === 'Appointments Today') {
                      window.location.href = '/doctor/appointments';
                    }
                  }}
                  className={`bg-white rounded-2xl p-5 shadow-md border border-slate-200 hover:shadow-xl hover:scale-[1.015] transition-all cursor-pointer ${
                    card.critical ? 'ring-2 ring-red-500 animate-pulse' : ''
                  }`}
                >
                  <div className={`w-9 h-9 ${color.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className={`w-6 h-6 ${color.icon}`} />
                  </div>
                  <h3 className={`font-bold text-2xl mb-1 font-mono ${color.text}`}>
                    {card.value}
                  </h3>
                  <p className="text-[11px] uppercase text-slate-400 font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {card.label}
                  </p>
                  <p className="text-[11px] text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {card.sub}
                  </p>
                  {card.progress !== undefined && (
                    <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color.text.replace('text-', 'bg-')} rounded-full transition-all duration-600`}
                        style={{ width: `${card.progress}%` }}
                      ></div>
                    </div>
                  )}
                  {card.extraSub && (
                    <p className="text-[11px] text-emerald-600 mt-1 font-medium">{card.extraSub}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-slate-200 mb-6">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[17px] text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Today's Appointments
                </h2>
                <p className="text-[13px] text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Wednesday, 7 April
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-teal-600 font-bold text-[13px] font-mono">5/8 complete</span>
                <button
                  onClick={() => navigateTo('/doctor/appointments')}
                  className="text-teal-600 text-xs font-medium hover:underline"
                >
                  View Full Schedule →
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {appointments.map((apt, index) => (
                <div
                  key={index}
                  onClick={() => navigateTo('/doctor/appointments')}
                  className={`px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group ${
                    apt.status === 'in-progress' ? 'bg-teal-50' : apt.status === 'critical' ? 'bg-red-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="text-right w-20">
                        <p className="font-bold text-[13px] text-slate-700 font-mono">{apt.time}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{apt.duration}</p>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          {apt.patient}
                        </h3>
                        <p className="text-xs text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {apt.type}
                        </p>
                      </div>

                      <div className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-medium rounded">
                        {apt.insurance}
                      </div>

                      {apt.flags.length > 0 && (
                        <div className="text-xs space-x-1">
                          {apt.flags.map((flag, i) => (
                            <span key={i}>{flag}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      {apt.status === 'completed' && (
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-lg">
                          ✅ Completed
                        </span>
                      )}
                      {apt.status === 'in-progress' && (
                        <>
                          <span className="px-3 py-1.5 bg-teal-100 text-teal-700 text-[10px] font-semibold rounded-lg flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-pulse"></div>
                            <span>In Progress</span>
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateTo('/doctor/appointments');
                            }}
                            className="px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                          >
                            ▶ Open
                          </button>
                        </>
                      )}
                      {apt.status === 'upcoming' && (
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded-lg">
                          ⏰ Upcoming
                        </span>
                      )}
                      {apt.status === 'critical' && (
                        <span className="px-3 py-1.5 bg-red-100 text-red-700 text-[10px] font-semibold rounded-lg">
                          🔴 Critical
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 border-l-4 border-l-red-600">
              <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <FlaskConical className="w-3 h-3 text-red-500" />
                  </div>
                  <h3 className="font-bold text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Lab Results
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-500 text-xs font-bold">1 critical · 2 pending</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {labResults.map((lab, index) => (
                  <div
                    key={index}
                    className={`px-4 py-3.5 hover:bg-slate-50 transition-colors ${
                      lab.status === 'critical' ? 'bg-red-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {lab.status === 'critical' && <AlertOctagon className="w-4.5 h-4.5 text-red-600 animate-pulse" />}
                        {lab.status === 'pending' && <Clock className="w-4.5 h-4.5 text-amber-500" />}
                        {lab.status === 'complete' && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm mb-0.5 ${lab.status === 'critical' ? 'text-red-900' : 'text-slate-900'}`}>
                          {lab.patient}
                        </p>
                        <p className={`font-mono text-[13px] font-bold mb-0.5 ${lab.status === 'critical' ? 'text-red-700' : 'text-slate-600'}`}>
                          {lab.test}
                        </p>
                        <p className={`text-[11px] ${lab.status === 'critical' ? 'text-red-500' : lab.status === 'complete' ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {lab.info}
                        </p>
                        {lab.time && (
                          <p className="text-[11px] text-red-600 font-mono font-bold mt-1">{lab.time}</p>
                        )}
                      </div>
                      {lab.status === 'critical' && (
                        <button className="px-3 py-1.5 bg-red-600 text-white text-[11px] font-bold rounded hover:bg-red-700 transition-colors">
                          Acknowledge
                        </button>
                      )}
                      {lab.status === 'pending' && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-medium rounded">
                          ⏰ Pending
                        </span>
                      )}
                      {lab.status === 'complete' && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-medium rounded">
                          ✅ Reviewed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-3 border-t border-slate-200">
                <button className="text-teal-600 text-xs font-medium hover:underline">
                  View All Lab Results →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-slate-200">
              <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Messages
                  </h3>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-blue-500 text-xs font-bold">4 unread</span>
                  <button className="text-teal-600 text-xs font-medium hover:underline">
                    View All →
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`px-4 py-3.5 hover:bg-blue-50/30 transition-colors cursor-pointer ${
                      msg.type === 'critical' ? 'bg-red-50' : 'bg-blue-50/20'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative flex-shrink-0">
                        {msg.avatar ? (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
                            {msg.avatar}
                          </div>
                        ) : (
                          <div className={`w-9 h-9 rounded-full ${msg.type === 'critical' ? 'bg-red-100' : 'bg-amber-100'} flex items-center justify-center`}>
                            {msg.type === 'critical' && <FlaskConical className="w-4 h-4 text-red-600" />}
                            {msg.type === 'pharmacy' && <Activity className="w-4 h-4 text-amber-600" />}
                          </div>
                        )}
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-[13px] mb-0.5 ${msg.type === 'critical' ? 'text-red-900' : 'text-slate-900'}`}>
                          {msg.from}
                        </p>
                        <p className={`text-xs mb-1 truncate ${msg.type === 'critical' ? 'text-red-600 italic' : msg.type === 'pharmacy' ? 'text-amber-600' : 'text-slate-500'}`}>
                          {msg.preview}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">{msg.time}</p>
                      </div>

                      <button className={`px-2 py-1 text-[10px] font-semibold rounded transition-colors ${
                        msg.type === 'critical' ? 'bg-red-600 text-white hover:bg-red-700' :
                        msg.type === 'pharmacy' ? 'bg-amber-500 text-white hover:bg-amber-600' :
                        'bg-teal-600 text-white hover:bg-teal-700'
                      }`}>
                        {msg.type === 'critical' ? 'Ack' : msg.type === 'pharmacy' ? 'Respond' : 'Reply'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-slate-200 border-l-4 border-l-indigo-600 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    AI Clinical Insights 🤖
                  </h2>
                  <p className="text-[11px] text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Powered by CeenAiX AI — for clinical support only
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-amber-700 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                ⚠️ AI insights are for clinical support only. All diagnoses and treatment decisions remain the physician's sole responsibility.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-indigo-50/30 border border-indigo-200 rounded-xl p-4">
                <div className="flex items-start space-x-2 mb-2">
                  <TrendingUp className="w-4.5 h-4.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <h3 className="font-bold text-[13px] text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Pattern Detected: Parnia Yazdkhasti
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  HbA1c has improved 0.6% over 6 months at your current treatment. Projected to reach 6.5% target by June 2026.
                </p>
                <button className="text-indigo-600 text-[11px] font-medium hover:underline">
                  View Patient →
                </button>
              </div>

              <div className="bg-amber-50/30 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start space-x-2 mb-2">
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <h3 className="font-bold text-[13px] text-amber-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Potential Interaction — Aisha Mohammed
                  </h3>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Enalapril + Spironolactone combination increases hyperkalemia risk. Current K: 4.1 mEq/L (borderline).
                </p>
                <button className="text-amber-600 text-[11px] font-medium hover:underline">
                  Flag in Notes
                </button>
              </div>

              <div className="bg-emerald-50/30 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start space-x-2 mb-2">
                  <Lightbulb className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <h3 className="font-bold text-[13px] text-emerald-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Preventive Alert: Noura Bint Khalid
                  </h3>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  New patient reporting palpitations. Suggested: 12-lead ECG + 24h Holter as first step to rule out arrhythmia.
                </p>
                <button className="text-emerald-600 text-[11px] font-medium hover:underline">
                  Add to Pre-Order
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs uppercase text-slate-400 font-semibold mb-3 tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
              QUICK ACTIONS
            </p>
            <div className="grid grid-cols-6 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const colors = {
                  purple: 'hover:bg-purple-50 hover:border-purple-300',
                  indigo: 'hover:bg-indigo-50 hover:border-indigo-300',
                  slate: 'hover:bg-slate-50 hover:border-slate-300',
                  teal: 'hover:bg-teal-50 hover:border-teal-300',
                  blue: 'hover:bg-blue-50 hover:border-blue-300'
                };
                return (
                  <button
                    key={index}
                    className={`bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-all shadow-sm hover:shadow-md ${
                      colors[action.color as keyof typeof colors]
                    }`}
                  >
                    <Icon className={`w-6 h-6 text-${action.color}-600`} />
                    <span className="text-xs font-bold text-slate-700 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {action.label}
                    </span>
                    {action.badge && (
                      <span className="text-[9px] px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-bold">
                        {action.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.15;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default DoctorPortal;
