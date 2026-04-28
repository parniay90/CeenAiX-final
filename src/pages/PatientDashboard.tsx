import { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Heart,
  Pill,
  MessageSquare,
  Bot,
  ShieldCheck,
  Activity,
  TrendingDown,
  TrendingUp,
  Minus,
  ChevronRight,
  MapPin,
  RefreshCw,
  Check,
  AlertTriangle,
  X,
  Clock,
  FlaskConical,
  Stethoscope,
  ChevronUp,
} from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';
import DirectionsModal from '../components/patient/DirectionsModal';
import {
  MOCK_PATIENT,
  MOCK_INSURANCE,
  MOCK_MEDICATIONS,
  MOCK_DOCTORS,
  MOCK_APPOINTMENTS,
  MOCK_MESSAGES,
  MOCK_HBA1C_DATA,
  MOCK_BP_DATA,
  MOCK_AI_TIPS,
  type Medication,
} from '../types/patientDashboard';

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function PatientDashboard() {
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS);
  const [tipIndex, setTipIndex] = useState(0);
  const [allergyDismissed, setAllergyDismissed] = useState(false);
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Real-time clock — updates every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Show scroll-to-top button after scrolling 300px
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setShowScrollTop(el.scrollTop > 300);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = MOCK_PATIENT.name.split(' ')[0];

  const formattedDate = now.toLocaleDateString('en-AE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const takenCount = medications.filter(m =>
    m.status === 'taken' ||
    (m.morning?.status === 'taken' && m.evening?.status === 'taken')
  ).length;

  const markTaken = (id: string, slot?: 'morning' | 'evening') => {
    setMedications(prev => prev.map(m => {
      if (m.id !== id) return m;
      if (slot && m[slot]) {
        return { ...m, [slot]: { ...m[slot]!, status: 'taken' as const, takenAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) } };
      }
      return { ...m, status: 'taken' as const, takenAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) };
    }));
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <PatientTopNav patientName={MOCK_PATIENT.name} />

      <div className="flex flex-1 overflow-hidden">
        <PatientSidebar currentPage="dashboard" />

        <main ref={mainRef} className="flex-1 overflow-y-auto">
          {!allergyDismissed && (
            <div className="bg-red-50 border-b border-red-100 px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-red-700 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">Allergy Alert:</span>
                <span className="text-red-600">Penicillin (anaphylaxis) · Sulfa drugs (rash)</span>
              </div>
              <button onClick={() => setAllergyDismissed(true)} className="text-red-400 hover:text-red-600 transition-colors ml-4">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="max-w-[1320px] mx-auto px-6 py-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">{greeting},</p>
                <h1 className="text-2xl font-bold text-slate-900 mt-0.5">{firstName}</h1>
                <p className="text-xs text-slate-400 mt-1">{formattedDate} · Dubai, UAE</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-3 text-center">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Health Score</p>
                  <div className="flex items-baseline gap-1 justify-center mt-1">
                    <span className="text-3xl font-bold text-teal-600">78</span>
                    <span className="text-sm text-slate-400">/100</span>
                  </div>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">Good</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-3 text-center">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Adherence</p>
                  <div className="flex items-baseline gap-1 justify-center mt-1">
                    <span className="text-3xl font-bold text-slate-800">87</span>
                    <span className="text-sm text-slate-400">%</span>
                  </div>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">This month</p>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Activity className="w-5 h-5 text-amber-600" />}
                iconBg="bg-amber-50"
                label="HbA1c"
                value="6.8%"
                badge="Pre-diabetic"
                badgeColor="bg-amber-50 text-amber-700"
                trend="down"
                trendLabel="−0.3% vs last"
                onClick={() => navigate('/my-health')}
              />
              <StatCard
                icon={<Heart className="w-5 h-5 text-rose-500" />}
                iconBg="bg-rose-50"
                label="Blood Pressure"
                value="128/82"
                badge="Controlled"
                badgeColor="bg-emerald-50 text-emerald-700"
                trend="stable"
                trendLabel="Stable"
                onClick={() => navigate('/my-health')}
              />
              <StatCard
                icon={<FlaskConical className="w-5 h-5 text-blue-600" />}
                iconBg="bg-blue-50"
                label="Last Labs"
                value="Normal"
                badge="6 tests"
                badgeColor="bg-blue-50 text-blue-700"
                trend="stable"
                trendLabel="Mar 5, 2026"
                onClick={() => navigate('/lab-results')}
              />
              <StatCard
                icon={<Pill className="w-5 h-5 text-teal-600" />}
                iconBg="bg-teal-50"
                label="Medications"
                value={`${takenCount}/${medications.length}`}
                badge="Today"
                badgeColor="bg-teal-50 text-teal-700"
                trend="up"
                trendLabel="taken"
                onClick={() => navigate('/medications')}
              />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Left Column */}
              <div className="xl:col-span-2 space-y-6">

                {/* Medications */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                        <Pill className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-900 text-sm">Today's Medications</h2>
                        <p className="text-xs text-slate-400">{takenCount} of {medications.length} taken</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-500 rounded-full transition-all duration-500"
                            style={{ width: `${(takenCount / medications.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-teal-600">{Math.round((takenCount / medications.length) * 100)}%</span>
                      </div>
                      <button
                        onClick={() => navigate('/medications')}
                        className="text-xs text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1"
                      >
                        View all <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-50">
                    {medications.map(med => (
                      <MedicationRow key={med.id} med={med} onMark={markTaken} />
                    ))}
                  </div>
                </div>

                {/* HbA1c Chart */}
                <div
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate('/my-health')}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h2 className="font-semibold text-slate-900">HbA1c Trend</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Last 6 months · Target: &lt;6.5%</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">
                      Improving ↓
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={MOCK_HBA1C_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                      <defs>
                        <linearGradient id="hba1c" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0D9488" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[5.5, 8.0]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(v: number) => [`${v}%`, 'HbA1c']}
                      />
                      <ReferenceLine y={6.5} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Target', position: 'right', fontSize: 10, fill: '#f59e0b' }} />
                      <Area type="monotone" dataKey="value" stroke="#0D9488" strokeWidth={2.5} fill="url(#hba1c)" dot={{ r: 4, fill: '#0D9488', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs text-amber-800">
                      At this rate, you could reach your target of 6.5% in approximately 2–3 months. Keep up your diet and medication routine.
                    </p>
                  </div>
                </div>

                {/* Blood Pressure Chart */}
                <div
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate('/my-health')}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h2 className="font-semibold text-slate-900">Blood Pressure Log</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Last 7 days · home monitoring</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="w-3 h-0.5 bg-rose-500 rounded inline-block" />Systolic
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="w-3 h-0.5 bg-blue-500 rounded inline-block" />Diastolic
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={MOCK_BP_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[60, 150]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <ReferenceLine y={130} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} />
                      <Line type="monotone" dataKey="systolic" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3, fill: '#f43f5e' }} />
                      <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                    <span className="text-xs font-semibold text-emerald-600">BP controlled for 7 consecutive days</span>
                    <button className="px-3 py-1.5 border border-teal-200 text-teal-600 rounded-lg text-xs font-semibold hover:bg-teal-50 transition-colors">
                      + Add Reading
                    </button>
                  </div>
                </div>

                {/* Care Team */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                        <Stethoscope className="w-4 h-4 text-slate-600" />
                      </div>
                      <h2 className="font-semibold text-slate-900 text-sm">My Care Team</h2>
                    </div>
                    <span className="text-xs text-slate-400">{MOCK_DOCTORS.length} doctors</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {MOCK_DOCTORS.map(doc => (
                      <div key={doc.id} className="border border-slate-100 rounded-xl p-4 hover:border-teal-200 hover:shadow-sm transition-all">
                        <div className="flex flex-col items-center text-center mb-3">
                          <div className="relative mb-2">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                              {doc.initials}
                            </div>
                            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${doc.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          </div>
                          <p className="font-semibold text-slate-900 text-sm">{doc.name}</p>
                          <span className="text-xs text-teal-600 font-medium mt-0.5">{doc.specialty}</span>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{doc.clinic}
                          </p>
                        </div>
                        {doc.nextAppointment && (
                          <p className="text-xs text-center text-slate-500 mb-3 border-t border-slate-50 pt-2">
                            Next: <span className="font-medium text-teal-600">{doc.nextAppointment}</span>
                          </p>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={e => { e.stopPropagation(); navigate('/messages'); }}
                            className="py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />Message
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); navigate('/appointments'); }}
                            className="py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                          >
                            <Calendar className="w-3 h-3" />Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">

                {/* Next Appointment */}
                <div
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate('/appointments')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-teal-600" />
                      </div>
                      <h2 className="font-semibold text-slate-900 text-sm">Next Appointment</h2>
                    </div>
                    <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-semibold">
                      {MOCK_APPOINTMENTS[0].daysUntil} days
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-lg font-bold text-slate-900">{MOCK_APPOINTMENTS[0].date}</p>
                    <p className="text-sm text-teal-600 font-semibold mt-0.5">
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      {MOCK_APPOINTMENTS[0].time}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-700 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {MOCK_APPOINTMENTS[0].doctor.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{MOCK_APPOINTMENTS[0].doctor.name}</p>
                      <p className="text-xs text-teal-600 font-medium">{MOCK_APPOINTMENTS[0].doctor.specialty}</p>
                      <p className="text-xs text-slate-400">{MOCK_APPOINTMENTS[0].doctor.clinic}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {MOCK_APPOINTMENTS[0].doctor.location}, Dubai
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      {MOCK_APPOINTMENTS[0].insurance}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); setDirectionsOpen(true); }}
                      className="py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <MapPin className="w-3 h-3" />
                      Directions
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); navigate('/appointments'); }}
                      className="py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate('/messages')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <h2 className="font-semibold text-slate-900 text-sm">Messages</h2>
                    </div>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                      {MOCK_MESSAGES.length} new
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {MOCK_MESSAGES.map(msg => (
                      <div key={msg.id} onClick={e => { e.stopPropagation(); navigate('/messages'); }} className="flex gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
                        <div className="relative flex-shrink-0">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
                            {msg.fromDoctor.initials}
                          </div>
                          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="font-semibold text-slate-900 text-xs truncate">{msg.from}</p>
                            <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{msg.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate('/messages')}
                    className="w-full py-2 border border-teal-200 text-teal-600 rounded-lg text-xs font-semibold hover:bg-teal-50 transition-colors"
                  >
                    + New Message
                  </button>
                </div>

                {/* Insurance */}
                <div
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate('/patient/insurance')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h2 className="font-semibold text-slate-900 text-sm">Insurance</h2>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">Active</span>
                  </div>

                  <div className="bg-gradient-to-br from-slate-800 to-teal-700 rounded-xl p-4 mb-4">
                    <p className="text-white font-bold text-sm">{MOCK_INSURANCE.provider.toUpperCase()}</p>
                    <p className="text-teal-200 text-xs mt-0.5">{MOCK_INSURANCE.plan} Plan</p>
                    <p className="text-white/70 text-xs mt-3">{MOCK_PATIENT.name}</p>
                    <p className="text-white/50 text-xs">{MOCK_INSURANCE.policyNumber}</p>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500">Annual Limit Used</span>
                      <span className="font-semibold text-slate-700">
                        AED {MOCK_INSURANCE.used.toLocaleString()} / {MOCK_INSURANCE.annualLimit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(MOCK_INSURANCE.used / MOCK_INSURANCE.annualLimit) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-emerald-600 font-medium mt-1.5">
                      AED {(MOCK_INSURANCE.annualLimit - MOCK_INSURANCE.used).toLocaleString()} remaining
                    </p>
                  </div>

                  <button
                    onClick={e => { e.stopPropagation(); navigate('/patient/insurance'); }}
                    className="w-full text-center text-xs text-teal-600 font-semibold hover:underline"
                  >
                    View full details →
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h2 className="font-semibold text-slate-900 text-sm mb-3">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { icon: Calendar, label: 'Book Appt', color: 'text-teal-600 bg-teal-50 hover:bg-teal-100', href: '/appointments' },
                      { icon: MessageSquare, label: 'Message', color: 'text-blue-600 bg-blue-50 hover:bg-blue-100', href: '/messages' },
                      { icon: FlaskConical, label: 'Lab Results', color: 'text-violet-600 bg-violet-50 hover:bg-violet-100', href: '/lab-results' },
                      { icon: Bot, label: 'AI Assistant', color: 'text-slate-600 bg-slate-50 hover:bg-slate-100', href: '/ai-assistant' },
                    ].map(a => (
                      <button
                        key={a.label}
                        onClick={() => navigate(a.href)}
                        className={`flex flex-col items-center gap-2 py-4 rounded-xl text-xs font-semibold transition-colors ${a.color}`}
                      >
                        <a.icon className="w-5 h-5" />
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Tip */}
                <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-1.5">AI Health Tip</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{MOCK_AI_TIPS[tipIndex].content}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => navigate('/ai-assistant')}
                          className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition-colors"
                        >
                          Ask More
                        </button>
                        <button
                          onClick={() => setTipIndex(i => (i + 1) % MOCK_AI_TIPS.length)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      <DirectionsModal
        isOpen={directionsOpen}
        onClose={() => setDirectionsOpen(false)}
        clinic={MOCK_APPOINTMENTS[0].doctor.clinic}
        location={MOCK_APPOINTMENTS[0].doctor.location}
        doctorName={MOCK_APPOINTMENTS[0].doctor.name}
        coordinates={MOCK_APPOINTMENTS[0].doctor.coordinates ?? { lat: 25.2048, lng: 55.2708 }}
      />
    </div>
  );
}

function StatCard({ icon, iconBg, label, value, badge, badgeColor, trend, trendLabel, onClick }: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  badge: string;
  badgeColor: string;
  trend: 'up' | 'down' | 'stable';
  trendLabel: string;
  onClick?: () => void;
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'down' ? 'text-emerald-600' : trend === 'up' ? 'text-teal-600' : 'text-slate-500';

  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${badgeColor}`}>{badge}</span>
      </div>
      <p className="text-xl font-bold text-slate-900 mb-0.5">{value}</p>
      <p className="text-xs text-slate-400 font-medium mb-2">{label}</p>
      <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
        <TrendIcon className="w-3 h-3" />
        {trendLabel}
      </div>
    </div>
  );
}

function MedicationRow({ med, onMark }: { med: Medication; onMark: (id: string, slot?: 'morning' | 'evening') => void }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-violet-500',
    red: 'bg-rose-500',
    yellow: 'bg-amber-400',
  };

  if (med.morning && med.evening) {
    return (
      <div className="px-6 py-4">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${colorMap[med.color] ?? 'bg-slate-400'}`} />
          <div>
            <p className="text-sm font-semibold text-slate-900">{med.name} <span className="font-normal text-slate-500">{med.dosage}</span></p>
            <p className="text-xs text-slate-400 mt-0.5">{med.instructions} · {med.frequency}</p>
          </div>
        </div>
        <div className="ml-5 space-y-1.5">
          <DoseSlot label="Morning 8:00 AM" slot={med.morning} onMark={() => onMark(med.id, 'morning')} />
          <DoseSlot label="Evening 8:00 PM" slot={med.evening} onMark={() => onMark(med.id, 'evening')} />
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colorMap[med.color] ?? 'bg-slate-400'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900">{med.name} <span className="font-normal text-slate-500">{med.dosage}</span></p>
        <p className="text-xs text-slate-400 mt-0.5">{med.instructions} · {med.nextDose}</p>
      </div>
      {med.status === 'taken' ? (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-600" />
          </div>
          {med.takenAt}
        </div>
      ) : (
        <button
          onClick={() => onMark(med.id)}
          className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition-colors flex items-center gap-1"
        >
          <Check className="w-3 h-3" />Mark Taken
        </button>
      )}
    </div>
  );
}

function DoseSlot({ label, slot, onMark }: {
  label: string;
  slot: { time: string; status: 'taken' | 'pending'; takenAt?: string };
  onMark: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      {slot.status === 'taken' ? (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-emerald-600" />
          </div>
          Taken {slot.takenAt}
        </div>
      ) : (
        <button
          onClick={onMark}
          className="px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-600 rounded-lg text-xs font-semibold hover:bg-teal-100 transition-colors"
        >
          Mark Taken
        </button>
      )}
    </div>
  );
}