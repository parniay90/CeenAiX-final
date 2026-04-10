import { useState, useEffect } from 'react';
import {
  CalendarCheck,
  PenLine,
  FlaskConical,
  MessageSquare,
  CircleDollarSign,
  ShieldCheck,
  Clock,
  AlertOctagon,
  CheckCircle,
  User,
  Calendar,
  Play,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  Bot,
  Send,
  FileText,
  CalendarX,
  Activity,
  Heart,
  Zap,
  Users,
  ArrowRight,
  Bell,
  Search,
  Settings,
} from 'lucide-react';
import CriticalAlertBanner from '../components/doctor/dashboard/CriticalAlertBanner';
import ConsultationWorkspaceCard from '../components/doctor/dashboard/ConsultationWorkspaceCard';
import DoctorSidebar from '../components/doctor/DoctorSidebar';
import {
  MOCK_DOCTOR,
  MOCK_DAY_STATS,
  MOCK_APPOINTMENTS,
  MOCK_LAB_RESULTS,
  MOCK_MESSAGES,
  MOCK_PATIENTS_QUICK,
  MOCK_AI_INSIGHTS,
  type Appointment,
} from '../types/doctorDashboard';

export default function DoctorDashboardNew() {
  const [showCriticalAlert, setShowCriticalAlert] = useState(true);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = MOCK_DAY_STATS;
  const criticalLab = MOCK_LAB_RESULTS.find((lab) => lab.status === 'critical');
  const activeAppointment = MOCK_APPOINTMENTS.find((apt) => apt.status === 'in-progress');

  const chartData = [
    { day: 'Mon', count: 6, target: 8 },
    { day: 'Tue', count: 9, target: 8 },
    { day: 'Wed', count: 8, target: 8 },
    { day: 'Thu', count: 7, target: 8 },
    { day: 'Fri', count: 5, target: 8 },
  ];

  const revenueData = [
    { date: '1', amount: 2800 },
    { date: '2', amount: 3200 },
    { date: '3', amount: 0 },
    { date: '4', amount: 2400 },
    { date: '5', amount: 3600 },
    { date: '6', amount: 2800 },
    { date: '7', amount: 2400 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'in-progress':
        return 'bg-teal-100 text-teal-700';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></span>;
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/20 to-blue-50/30">
      <aside className="fixed left-0 top-0 h-screen w-64 z-40">
        <DoctorSidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />
      </aside>

      <div className="flex-1 ml-64">
        <main className="min-h-screen">
          <div className="flex items-center justify-between px-6 py-4 bg-white/50 backdrop-blur-sm border-b border-cyan-100">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-xl blur group-hover:blur-lg transition-all" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 z-10" />
              <input
                type="text"
                placeholder="Search patients, records, orders..."
                className="relative pl-10 pr-4 py-2 w-[400px] bg-white border-2 border-cyan-200/50 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all hover:border-cyan-300 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border-2 border-cyan-200/50 shadow-sm">
                <p className="text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-slate-500 text-center">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <button className="relative p-2 hover:bg-cyan-50 rounded-lg transition-all border-2 border-transparent hover:border-cyan-200 group">
                <Bell className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white shadow-lg shadow-red-500/50" />
              </button>
              <button className="p-2 hover:bg-cyan-50 rounded-lg transition-all border-2 border-transparent hover:border-cyan-200 group">
                <Settings className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors" />
              </button>
              <div className="h-8 w-px bg-gradient-to-b from-cyan-200 via-blue-200 to-cyan-200 mx-2" />
              <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-cyan-50 rounded-lg transition-all cursor-pointer border-2 border-transparent hover:border-cyan-200 group">
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                  {MOCK_DOCTOR.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{MOCK_DOCTOR.name.split(' ')[1]}</p>
                  <p className="text-xs bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent font-medium">{MOCK_DOCTOR.specialty}</p>
                </div>
              </div>
            </div>
          </div>


        <div className="p-6 space-y-6">
        {showCriticalAlert && criticalLab && (
          <div className="animate-fadeIn" style={{ animationDelay: '0ms' }}>
            <CriticalAlertBanner
              labResult={criticalLab}
              onAcknowledge={() => setShowCriticalAlert(false)}
              onViewPatient={() => alert('View patient record')}
            />
          </div>
        )}

        <div className="grid grid-cols-12 gap-6 animate-fadeIn" style={{ animationDelay: '60ms' }}>
          <div className="col-span-8">
            <div className="bg-gradient-to-br from-cyan-600 via-blue-600 to-cyan-700 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden border border-cyan-400/20 group hover:shadow-cyan-500/20 transition-all duration-500">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/10 rounded-full -ml-48 -mb-48 blur-3xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className="space-y-1">
                    <p className="text-cyan-100 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse" />
                      Good afternoon,
                    </p>
                    <h2 className="text-3xl font-bold drop-shadow-lg">Dr. {MOCK_DOCTOR.name.split(' ')[1]}</h2>
                    <p className="text-cyan-100 text-sm flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      {MOCK_DOCTOR.clinic} • {MOCK_DOCTOR.specialty}
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:scale-105 transition-transform cursor-pointer">
                    <p className="text-4xl font-bold mb-1 drop-shadow-lg">{stats.appointmentsCompleted}/{stats.appointmentsTotal}</p>
                    <p className="text-xs text-cyan-100 uppercase tracking-wider">Appointments</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { icon: Calendar, label: 'Remaining', value: stats.appointmentsRemaining },
                    { icon: PenLine, label: 'Prescriptions', value: stats.prescriptionsWritten },
                    { icon: FlaskConical, label: 'Lab Orders', value: stats.labOrdersPlaced },
                    { icon: MessageSquare, label: 'Messages', value: stats.unreadMessages },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/20 hover:scale-105 transition-all cursor-pointer group/card">
                      <item.icon className="w-5 h-5 text-white/80 mb-2 group-hover/card:scale-110 transition-transform" />
                      <p className="text-2xl font-bold mb-0.5 drop-shadow">{item.value}</p>
                      <p className="text-xs text-cyan-100">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-5 border-2 border-cyan-200/50 hover:border-cyan-300 transition-all hover:shadow-2xl hover:shadow-cyan-500/10 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <CircleDollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Today's Revenue</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">AED {stats.revenueToday.toLocaleString()}</p>
                </div>
              </div>
              <div className="h-3 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full overflow-hidden mb-2 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-1000 rounded-full shadow-lg relative"
                  style={{ width: `${(stats.revenueToday / stats.revenuePotential) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium">AED {stats.revenuePotential - stats.revenueToday} to target</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-5 border-2 border-cyan-200/50 hover:border-cyan-300 transition-all hover:shadow-2xl hover:shadow-cyan-500/10 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">DHA License</p>
                  <p className="text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Valid • 269 days
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-mono bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">{MOCK_DOCTOR.dhaLicense}</p>
            </div>
          </div>
        </div>

        {activeAppointment && (
          <div className="animate-fadeIn" style={{ animationDelay: '120ms' }}>
            <div
              onClick={() => setShowWorkspaceModal(true)}
              className="group bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 rounded-2xl shadow-2xl p-6 cursor-pointer hover:shadow-cyan-500/20 transition-all hover:scale-[1.02] relative overflow-hidden border-2 border-cyan-400/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform shadow-xl">
                    <Activity className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <div>
                    <p className="text-cyan-100 text-sm mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                      Active Consultation
                    </p>
                    <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{activeAppointment.patientName}</h3>
                    <p className="text-white/90 text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      {activeAppointment.condition} • {activeAppointment.visitType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/20">
                    <p className="text-cyan-100 text-xs mb-0.5">Duration</p>
                    <p className="text-2xl font-bold text-white drop-shadow">{activeAppointment.duration || '25'} min</p>
                  </div>
                  <button className="px-6 py-3 bg-white text-cyan-600 rounded-xl font-bold hover:bg-cyan-50 transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 group/btn">
                    <Play className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    Open Workspace
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="animate-fadeIn" style={{ animationDelay: '180ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Today's Schedule</h2>
              <p className="text-sm text-slate-500">Wednesday, 7 April 2026</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-5 py-2.5 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-xl text-sm font-bold border-2 border-cyan-200 shadow-sm">
                {stats.appointmentsCompleted}/{stats.appointmentsTotal} Complete
              </span>
              <button className="px-5 py-2.5 bg-white border-2 border-cyan-200 rounded-xl text-sm font-semibold text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 transition-all flex items-center gap-2 group shadow-sm">
                View Calendar
                <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {MOCK_APPOINTMENTS.map((apt, idx) => (
              <div
                key={apt.id}
                className={`group bg-white rounded-2xl border-2 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 hover:scale-[1.01] ${
                  apt.status === 'in-progress'
                    ? 'border-cyan-400 bg-gradient-to-r from-cyan-50/70 to-blue-50/70 shadow-cyan-500/10'
                    : apt.id === 'APT-005'
                    ? 'border-red-300 bg-red-50/30'
                    : 'border-cyan-200/50 hover:border-cyan-300'
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="p-5 flex items-center gap-6">
                  <div className={`flex-shrink-0 px-3 py-2 rounded-xl text-center ${
                    apt.status === 'in-progress' ? 'bg-cyan-100 border-2 border-cyan-200' : 'bg-slate-100 border-2 border-slate-200'
                  }`}>
                    <p className="text-base font-bold text-slate-900">{apt.time}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{apt.duration || '30'} min</p>
                  </div>

                  <div className="w-px h-12 bg-slate-200" />

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{apt.patientName}</h3>
                      {apt.flags.map((flag, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            flag.type === 'allergy' ? 'bg-amber-100 text-amber-700' :
                            flag.type === 'critical' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                          }`}
                          title={flag.label}
                        >
                          {flag.label}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{apt.condition}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {apt.visitType}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        apt.insuranceColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                        apt.insuranceColor === 'green' ? 'bg-green-100 text-green-700' :
                        apt.insuranceColor === 'red' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {apt.insurance}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border-2 ${
                      apt.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      apt.status === 'in-progress' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {getStatusIcon(apt.status)}
                      {apt.status === 'completed' && 'Completed'}
                      {apt.status === 'in-progress' && 'In Progress'}
                      {apt.status === 'upcoming' && 'Upcoming'}
                    </div>

                    {apt.status === 'in-progress' && (
                      <button
                        onClick={() => setShowWorkspaceModal(true)}
                        className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 group/btn"
                      >
                        <Play className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        Open
                      </button>
                    )}
                    {apt.status === 'upcoming' && (
                      <button className="px-5 py-3 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border-2 border-cyan-200 rounded-xl hover:bg-gradient-to-r hover:from-cyan-100 hover:to-blue-100 transition-all text-sm font-semibold hover:scale-105">
                        View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 animate-fadeIn" style={{ animationDelay: '240ms' }}>
          <div className="bg-white rounded-2xl border-2 border-red-200 shadow-xl hover:shadow-2xl hover:border-red-300 transition-all">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center">
                    <FlaskConical className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Lab Results</h2>
                    <p className="text-xs text-slate-500">Requires attention</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  1 Critical
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {MOCK_LAB_RESULTS.map((lab, idx) => (
                <div
                  key={lab.id}
                  className={`p-4 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer ${
                    lab.status === 'critical'
                      ? 'bg-red-50 border-red-300 animate-pulse'
                      : lab.status === 'pending'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-emerald-50 border-emerald-200'
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {lab.status === 'critical' && (
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                          <AlertOctagon className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {lab.status === 'pending' && (
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {lab.status === 'complete' && (
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold mb-1 ${
                        lab.status === 'critical' ? 'text-red-900' : 'text-slate-900'
                      }`}>
                        {lab.patientName}
                      </h3>
                      <p className={`text-sm font-mono font-bold mb-1 ${
                        lab.status === 'critical' ? 'text-red-700' : 'text-slate-700'
                      }`}>
                        {lab.testName}
                        {lab.result && ` → ${lab.result} ${lab.unit}`}
                      </p>
                      <p className="text-xs text-slate-600">
                        {lab.status === 'critical' && `Critical • Ref: ${lab.referenceRange} • ${lab.resultedTime}`}
                        {lab.status === 'pending' && `Ordered ${lab.orderedTime} • Expected ${lab.expectedTime}`}
                        {lab.status === 'complete' && lab.reviewNotes}
                      </p>
                      {lab.status === 'critical' && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs font-bold text-red-600">⏰ {lab.unacknowledgedMinutes}min unacknowledged</span>
                          <button className="ml-auto px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-bold">
                            Acknowledge Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-cyan-200 shadow-xl hover:shadow-2xl hover:border-cyan-300 transition-all">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-cyan-100 to-blue-50 rounded-xl flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Messages</h2>
                    <p className="text-xs text-slate-500">Recent communications</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-lg text-sm font-bold border-2 border-cyan-200 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-600 rounded-full animate-pulse" />
                  {stats.unreadMessages} Unread
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {MOCK_MESSAGES.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer ${
                    msg.priority === 'critical'
                      ? 'bg-red-50 border-red-300'
                      : msg.unread
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white relative shadow-lg ${
                      msg.color === 'red' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                      msg.color === 'teal' ? 'bg-gradient-to-br from-teal-500 to-teal-600' :
                      msg.color === 'amber' ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                      'bg-gradient-to-br from-slate-500 to-slate-600'
                    }`}>
                      {msg.initials}
                      {msg.unread && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-bold ${
                          msg.priority === 'critical' ? 'text-red-900' : 'text-slate-900'
                        }`}>
                          {msg.from}
                        </h3>
                        <span className="text-xs text-slate-400">{msg.time}</span>
                      </div>
                      <p className={`text-sm line-clamp-2 ${
                        msg.priority === 'critical' ? 'text-red-700 font-medium' :
                        msg.priority === 'urgent' ? 'text-amber-700' :
                        'text-slate-600'
                      }`}>
                        {msg.preview}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          msg.priority === 'critical' ? 'bg-red-100 text-red-700' :
                          msg.priority === 'urgent' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {msg.priority === 'critical' ? 'CRITICAL' : msg.priority === 'urgent' ? 'URGENT' : 'Normal'}
                        </span>
                        <button className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          msg.priority === 'critical' ? 'bg-red-600 text-white hover:bg-red-700' :
                          'bg-blue-600 text-white hover:bg-blue-700'
                        }`}>
                          {msg.priority === 'critical' ? 'Respond' : 'Reply'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <div className="bg-white rounded-2xl border-2 border-cyan-200/50 shadow-xl p-5 hover:border-cyan-300 hover:shadow-2xl transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-blue-50 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Weekly Volume</h2>
                <p className="text-xs text-slate-500">Appointments</p>
              </div>
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex-1 group">
                  <div className="h-40 flex flex-col justify-end mb-2">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-700 group-hover:opacity-80 ${
                        item.day === 'Wed' ? 'bg-gradient-to-t from-cyan-600 to-blue-500 shadow-lg shadow-cyan-500/30' : 'bg-slate-300'
                      }`}
                      style={{
                        height: `${(item.count / 12) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">{item.count}</p>
                    <p className="text-xs text-slate-500">{item.day}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-600">Weekly total: <strong>35</strong></span>
              <span className="text-sm text-slate-400">Target: 40</span>
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-2xl border-2 border-cyan-200/50 shadow-xl p-5 hover:border-cyan-300 hover:shadow-2xl transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Revenue Trend — April 2026</h2>
                <p className="text-xs text-slate-500">Week to date performance</p>
              </div>
            </div>
            <div className="h-48 relative mb-4">
              <svg width="100%" height="180" className="overflow-visible">
                <defs>
                  <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 ${180 - (2800 / 4000) * 150}
                      L ${100 / 7} ${180 - (3200 / 4000) * 150}
                      L ${(100 / 7) * 2} ${180 - (0 / 4000) * 150}
                      L ${(100 / 7) * 3} ${180 - (2400 / 4000) * 150}
                      L ${(100 / 7) * 4} ${180 - (3600 / 4000) * 150}
                      L ${(100 / 7) * 5} ${180 - (2800 / 4000) * 150}
                      L ${(100 / 7) * 6} ${180 - (2400 / 4000) * 150}
                      L 100 180 L 0 180 Z`}
                  fill="url(#revenueGradient)"
                  className="transition-all duration-700"
                />
                <polyline
                  points={`0,${180 - (2800 / 4000) * 150}
                          ${(100 / 7) * 1},${180 - (3200 / 4000) * 150}
                          ${(100 / 7) * 2},${180 - (0 / 4000) * 150}
                          ${(100 / 7) * 3},${180 - (2400 / 4000) * 150}
                          ${(100 / 7) * 4},${180 - (3600 / 4000) * 150}
                          ${(100 / 7) * 5},${180 - (2800 / 4000) * 150}
                          ${(100 / 7) * 6},${180 - (2400 / 4000) * 150}`}
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3"
                  className="transition-all duration-700"
                />
                {revenueData.map((item, idx) => (
                  <g key={idx}>
                    <circle
                      cx={`${(100 / 7) * idx}%`}
                      cy={180 - (item.amount / 4000) * 150}
                      r="5"
                      fill="#059669"
                      className="transition-all duration-700"
                    />
                    <text
                      x={`${(100 / 7) * idx}%`}
                      y={180 - (item.amount / 4000) * 150 - 12}
                      textAnchor="middle"
                      className="text-xs fill-emerald-700 font-bold"
                    >
                      {item.amount}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                {revenueData.map((item, idx) => (
                  <span key={idx} className="text-xs text-slate-500 font-medium">
                    Day {item.date}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">AED <strong className="text-emerald-600 text-lg">16,800</strong> earned</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">AED 8,200 to target</span>
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-1000 rounded-full" style={{ width: '67%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-fadeIn" style={{ animationDelay: '360ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recent Patients</h2>
              <p className="text-sm text-slate-500">Quick access to patient records</p>
            </div>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Users className="w-4 h-4" />
              View All
            </button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {MOCK_PATIENTS_QUICK.map((patient, idx) => (
              <div
                key={patient.id}
                className="group bg-white border-2 border-cyan-200/50 rounded-2xl p-4 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all cursor-pointer hover:-translate-y-2 hover:border-cyan-400 hover:scale-105"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-xl relative group-hover:scale-110 transition-transform ${
                    patient.avatar === 'teal' ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30' :
                    patient.avatar === 'red' ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30' :
                    patient.avatar === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30' :
                    'bg-gradient-to-br from-slate-500 to-slate-600 shadow-slate-500/30'
                  }`}>
                    {patient.initials}
                    {patient.status === 'in-progress' && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                    )}
                    {patient.hasAllergy && (
                      <span className="absolute -top-2 -right-2 text-lg">⚠️</span>
                    )}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{patient.name}</h3>
                <p className="text-xs text-slate-500 mb-2">
                  {patient.condition}
                </p>
                <p className="text-xs text-slate-400 mb-2">
                  {patient.age}{patient.gender}
                </p>
                <div className={`px-2 py-1 rounded-lg text-xs font-bold mb-2 border-2 ${
                  patient.status === 'in-progress' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                  patient.status === 'critical' ? 'bg-red-50 text-red-700 border-red-200' :
                  patient.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {patient.status === 'in-progress' && '● '}
                  {patient.statusText}
                </div>
                <button className="w-full px-3 py-2 bg-gradient-to-r from-slate-100 to-slate-50 group-hover:from-cyan-600 group-hover:to-blue-600 group-hover:text-white rounded-xl text-xs font-bold text-slate-700 transition-all group-hover:scale-105 group-hover:shadow-lg">
                  {patient.status === 'in-progress' ? 'Open Record' : 'View Record'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl shadow-2xl border-2 border-cyan-500/20 animate-fadeIn overflow-hidden hover:border-cyan-500/40 transition-all group" style={{ animationDelay: '420ms' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-5 border-b border-cyan-700/30 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-cyan-500/50 group-hover:scale-110 transition-transform">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    AI Clinical Assistant
                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-xs font-bold border border-cyan-400/30 animate-pulse">BETA</span>
                  </h2>
                  <p className="text-sm text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    Powered by CeenAiX AI • Clinical support only
                  </p>
                </div>
              </div>
              <button className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/30 hover:scale-105 hover:shadow-xl">
                <Zap className="w-5 h-5" />
                Ask AI
              </button>
            </div>
          </div>

          <div className="p-5 grid grid-cols-3 gap-4 relative">
            {MOCK_AI_INSIGHTS.map((insight, idx) => (
              <div
                key={insight.id}
                className={`group bg-white/5 backdrop-blur-sm border-2 rounded-xl p-4 transition-all hover:bg-white/10 hover:scale-105 cursor-pointer hover:shadow-2xl ${
                  insight.color === 'indigo' ? 'border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-500/20' :
                  insight.color === 'amber' ? 'border-amber-500/30 hover:border-amber-400 hover:shadow-amber-500/20' :
                  'border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-500/20'
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform ${
                    insight.color === 'indigo' ? 'bg-cyan-500/20 shadow-cyan-500/30' :
                    insight.color === 'amber' ? 'bg-amber-500/20 shadow-amber-500/30' :
                    'bg-cyan-500/20 shadow-cyan-500/30'
                  }`}>
                    {insight.icon === 'trending' && <TrendingUp className="w-6 h-6 text-cyan-400" />}
                    {insight.icon === 'alert' && <AlertTriangle className="w-6 h-6 text-amber-400" />}
                    {insight.icon === 'lightbulb' && <Lightbulb className="w-6 h-6 text-cyan-400" />}
                  </div>
                  <h3 className="text-sm font-bold text-white flex-1 leading-snug">{insight.title}</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{insight.description}</p>
                <button className={`text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all ${
                  insight.color === 'indigo' ? 'text-cyan-400' :
                  insight.color === 'amber' ? 'text-amber-400' :
                  'text-teal-400'
                }`}>
                  {insight.actionLabel}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="px-5 pb-5">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <p className="text-xs text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                AI insights are for clinical support only. All diagnoses and treatment decisions remain the physician's sole responsibility.
              </p>
            </div>
          </div>
        </div>

        <div className="animate-fadeIn" style={{ animationDelay: '480ms' }}>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
            <p className="text-sm text-slate-500">Common clinical workflows</p>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {[
              { icon: PenLine, label: 'Write Prescription', color: 'from-blue-500 to-blue-600', textColor: 'text-blue-600' },
              { icon: FlaskConical, label: 'Order Lab Test', color: 'from-red-500 to-red-600', textColor: 'text-red-600', badge: '1 critical' },
              { icon: CalendarX, label: 'Block Time Off', color: 'from-slate-500 to-slate-600', textColor: 'text-slate-600' },
              { icon: Send, label: 'Send Referral', color: 'from-cyan-500 to-blue-600', textColor: 'text-cyan-600' },
              { icon: FileText, label: 'Write Certificate', color: 'from-cyan-500 to-cyan-600', textColor: 'text-cyan-600' },
              { icon: Bot, label: 'Ask Clinical AI', color: 'from-cyan-600 to-blue-700', textColor: 'text-cyan-600' },
            ].map((action, idx) => (
              <button
                key={idx}
                className="group bg-white border-2 border-cyan-200/50 rounded-2xl p-5 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all hover:-translate-y-2 hover:scale-105 hover:border-cyan-400 relative"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-bold text-slate-700 text-center block">{action.label}</span>
                {action.badge && (
                  <span className="absolute -top-2 -right-2 px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-xl shadow-red-500/50 animate-pulse ring-2 ring-white">
                    {action.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        </div>
      </main>

      {showWorkspaceModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-50 flex items-center justify-center p-8 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scaleIn border-2 border-cyan-200">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-8 flex items-center justify-between border-b border-cyan-400/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-pulse" />
              <div className="relative">
                <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">Consultation Workspace — {activeAppointment?.patientName}</h2>
                <p className="text-sm text-cyan-100 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  {activeAppointment?.condition} • {activeAppointment?.insurance}
                </p>
              </div>
              <button
                onClick={() => setShowWorkspaceModal(false)}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all text-sm font-bold flex items-center gap-2 border border-white/20 hover:scale-105 relative"
              >
                <span>✕</span> Close
              </button>
            </div>
            <div className="p-8 overflow-y-auto bg-gradient-to-br from-slate-50 to-cyan-50/20" style={{ maxHeight: 'calc(90vh - 120px)' }}>
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-100 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Activity className="w-12 h-12 text-cyan-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Full Consultation Workspace</h3>
                <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-lg">
                  This comprehensive workspace includes 6 integrated tabs: Patient Vitals, SOAP Notes, Health Summary,
                  Smart Prescriptions, Lab Orders & Referrals, and Follow-up Scheduling with AI clinical decision support.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
