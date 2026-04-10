import { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  Heart,
  Home,
  MessageSquare,
  Pill,
  FileText,
  Bot,
  ShieldCheck,
  Droplets,
  FlaskConical,
  Stethoscope,
  MapPin,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import AreaChart from '../components/charts/AreaChart';
import LineChart from '../components/charts/LineChart';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';
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
  Medication,
} from '../types/patientDashboard';

export default function PatientDashboard() {
  const [medications, setMedications] = useState(MOCK_MEDICATIONS);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showAllergyBanner, setShowAllergyBanner] = useState(true);
  const [healthScore] = useState(78);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '🌅' };
    if (hour < 17) return { text: 'Good afternoon', emoji: '☀️' };
    return { text: 'Good evening', emoji: '🌙' };
  };

  const greeting = getTimeBasedGreeting();

  const handleMarkTaken = (medId: string, timeOfDay?: 'morning' | 'evening') => {
    setMedications(prev =>
      prev.map(med => {
        if (med.id === medId) {
          if (timeOfDay && med[timeOfDay]) {
            return {
              ...med,
              [timeOfDay]: {
                ...med[timeOfDay]!,
                status: 'taken' as const,
                takenAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
              },
            };
          }
          return {
            ...med,
            status: 'taken' as const,
            takenAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          };
        }
        return med;
      })
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <PatientTopNav patientName={MOCK_PATIENT.name} />

      <div className="flex flex-1 overflow-hidden">
        <PatientSidebar currentPage="dashboard" />

        <main className="flex-1 overflow-y-auto">
        {showAllergyBanner && (
          <div className="bg-red-50 border-b border-red-200 px-8 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-700 text-sm font-sans">
              <span className="text-lg">⚠️</span>
              <span>Allergy Alert: Penicillin (anaphylaxis) · Sulfa drugs (rash)</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-red-400 text-xs hover:underline">View Allergies →</a>
              <button onClick={() => setShowAllergyBanner(false)} className="text-red-300 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="max-w-[1280px] mx-auto px-8 py-8 pb-24 md:pb-8">
        <GreetingHeader greeting={greeting} patient={MOCK_PATIENT} healthScore={healthScore} />

        <div className="space-y-5 mt-8">
          <TodaysMedicationsCard medications={medications} onMarkTaken={handleMarkTaken} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <NextAppointmentCard appointment={MOCK_APPOINTMENTS[0]} />
            <MessagesCard messages={MOCK_MESSAGES} />
          </div>

          <HealthStatsGrid />

          <HbA1cTrendCard data={MOCK_HBA1C_DATA} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InsuranceCard insurance={MOCK_INSURANCE} />
            <QuickActionsCard />
          </div>

          <BloodPressureCard data={MOCK_BP_DATA} />

          <CareTeamCard doctors={MOCK_DOCTORS} />

          <AIHealthTipCard
            tip={MOCK_AI_TIPS[currentTipIndex]}
            onNext={() => setCurrentTipIndex((prev) => (prev + 1) % MOCK_AI_TIPS.length)}
          />

          <ActiveRemindersStrip />
        </div>
      </div>

      <BottomNavigation activeTab="home" />
      </main>
      </div>
    </div>
  );
}

function GreetingHeader({ greeting, patient, healthScore }: any) {
  return (
    <div className="flex items-start justify-between animate-fadeIn">
      <div>
        <h2 className="text-lg text-slate-500 font-sans">
          {greeting.text}, <span className="text-3xl font-playfair font-bold text-slate-900">{patient.name.split(' ')[0]}</span> <span className="text-2xl">{greeting.emoji}</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1 font-sans">
          Tuesday, 7 April 2026 · Dubai, UAE 🇦🇪 · ☀️ 32°C Clear
        </p>
      </div>

      <div className="hidden md:block bg-white rounded-2xl px-6 py-4 shadow-md">
        <p className="text-xs uppercase tracking-wide text-slate-400 font-sans">Health Score</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-mono font-bold text-teal-600">{healthScore}</span>
          <span className="text-base text-slate-400 font-mono">/100</span>
        </div>
        <p className="text-xs font-bold text-emerald-600 mt-1">Good ↑</p>
      </div>
    </div>
  );
}

function TodaysMedicationsCard({ medications, onMarkTaken }: { medications: Medication[]; onMarkTaken: (id: string, timeOfDay?: 'morning' | 'evening') => void }) {
  const takenCount = medications.filter(m =>
    m.status === 'taken' ||
    (m.morning && m.evening && m.morning.status === 'taken' && m.evening.status === 'taken')
  ).length;
  const totalCount = medications.length;
  const progress = (takenCount / totalCount) * 100;

  const getMedColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
    };
    return colors[color] || 'bg-gray-500';
  };

  return (
    <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-7 shadow-xl shadow-teal-600/25 animate-slideUp" style={{ animationDelay: '80ms' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Pill className="w-6 h-6 text-white/90" />
          </div>
          <div>
            <h3 className="font-playfair text-xl font-bold text-white">Today's Medications</h3>
            <p className="text-sm text-white/70 font-sans">7 April 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-white/20 border border-white/30 rounded-full text-white font-sans text-sm font-bold">
            {takenCount} / {totalCount} taken ✓
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-white/20 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-800 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-4">
        {medications.map((med, idx) => (
          <div key={med.id} className={`${idx > 0 ? 'border-t border-white/10 pt-4' : ''}`}>
            {med.morning && med.evening ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full ${getMedColor(med.color)} flex items-center justify-center`}>
                    <Pill className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-sans text-base font-bold text-white">{med.name} {med.dosage}</p>
                    <p className="text-xs text-white/75">{med.instructions} — {med.frequency}</p>
                  </div>
                </div>

                <div className="ml-9 space-y-2">
                  <MedicationDoseRow
                    label="Morning (8:00 AM)"
                    status={med.morning.status}
                    takenAt={med.morning.takenAt}
                    onMarkTaken={() => onMarkTaken(med.id, 'morning')}
                  />
                  <MedicationDoseRow
                    label="Evening (8:00 PM)"
                    status={med.evening.status}
                    takenAt={med.evening.takenAt}
                    onMarkTaken={() => onMarkTaken(med.id, 'evening')}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-6 h-6 rounded-full ${getMedColor(med.color)} flex items-center justify-center`}>
                    <Pill className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-sans text-base font-bold text-white">{med.name} {med.dosage}</p>
                    <p className="text-xs text-white/75">{med.instructions} — {med.frequency}</p>
                    <p className="text-xs text-amber-200 mt-0.5">{med.nextDose}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {med.status === 'taken' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs text-white/70">Taken {med.takenAt}</span>
                    </div>
                  ) : med.status === 'due' ? (
                    <button
                      onClick={() => onMarkTaken(med.id)}
                      className="px-4 py-1.5 bg-white text-teal-600 rounded-lg text-xs font-bold hover:bg-white/90 transition-colors"
                    >
                      Mark Taken ✓
                    </button>
                  ) : (
                    <span className="text-xs text-white/60">{med.nextDose}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
        <a href="#" className="text-sm text-white underline hover:text-white/80 font-sans">View All Medications →</a>
        <div className="flex items-center gap-2 text-white/80 text-xs font-sans">
          <span>87% adherence this month</span>
          <span className="text-base">🔥</span>
        </div>
      </div>
    </div>
  );
}

function MedicationDoseRow({ label, status, takenAt, onMarkTaken }: any) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/90">{label}</span>
      {status === 'taken' ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-xs text-white/70">Taken {takenAt}</span>
        </div>
      ) : (
        <button
          onClick={onMarkTaken}
          className="px-3 py-1 bg-white text-teal-600 rounded text-xs font-bold hover:bg-white/90 transition-colors"
        >
          Mark Taken ✓
        </button>
      )}
    </div>
  );
}

function NextAppointmentCard({ appointment }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 border-l-4 border-teal-600 shadow-md hover:shadow-lg transition-shadow animate-slideUp" style={{ animationDelay: '160ms' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-600" />
          <h3 className="font-sans text-sm font-bold text-slate-900">Next Appointment</h3>
        </div>
        <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-bold">{appointment.daysUntil} days</span>
      </div>

      <div className="mb-4">
        <p className="font-playfair text-2xl font-bold text-slate-900">{appointment.date}</p>
        <p className="font-mono text-base text-teal-600 mt-1">{appointment.time}</p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-teal-600 flex items-center justify-center text-white font-sans font-bold">
          {appointment.doctor.initials}
        </div>
        <div className="flex-1">
          <p className="font-sans text-base font-bold text-slate-900">{appointment.doctor.name}</p>
          <p className="text-xs text-teal-600 font-medium">{appointment.doctor.specialty} 🫀</p>
          <p className="text-xs text-slate-500">{appointment.doctor.clinic}</p>
        </div>
      </div>

      <div className="space-y-1.5 text-sm text-slate-600 mb-4 font-sans">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{appointment.doctor.location}, Dubai</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{appointment.insurance} ✓</span>
        </div>
        <div className="flex items-center gap-2">
          <span>💰</span>
          <span>Co-pay: ~AED {appointment.coPay}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4" />
          Directions
        </button>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
          <FileText className="w-4 h-4" />
          Details
        </button>
      </div>
    </div>
  );
}

function MessagesCard({ messages }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow animate-slideUp" style={{ animationDelay: '160ms' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="font-sans text-sm font-bold text-slate-900">Messages 💬</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">{messages.length} unread</span>
          <a href="#" className="text-teal-600 text-xs hover:underline font-sans">View All →</a>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {messages.map((msg: any) => (
          <div key={msg.id} className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-teal-600 flex items-center justify-center text-white font-sans font-bold text-sm">
                  {msg.fromDoctor.initials}
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-sans text-sm font-bold text-slate-900">{msg.from}</p>
                  <span className="text-xs text-slate-400">{msg.timestamp}</span>
                </div>
                <span className="inline-block px-2 py-0.5 bg-teal-50 text-teal-600 rounded text-xs mb-1">{msg.fromDoctor.specialty}</span>
                <p className="text-sm text-slate-600 line-clamp-2 font-sans">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-2.5 border-2 border-teal-600 text-teal-600 rounded-lg text-sm font-bold hover:bg-teal-50 transition-colors">
        + New Message
      </button>
    </div>
  );
}

function HealthStatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slideUp" style={{ animationDelay: '240ms' }}>
      <HealthStatCard
        icon={<Droplets className="w-5 h-5 text-amber-600" />}
        iconBg="bg-amber-100"
        label="HbA1c"
        value="6.8"
        unit="%"
        status="Pre-diabetic ⚠️"
        statusColor="bg-amber-100 text-amber-700"
        trend="↓ 0.3%"
        trendColor="text-emerald-600 bg-emerald-50"
        context="Checked 5 Mar · improving from 7.1%"
      />
      <HealthStatCard
        icon={<Heart className="w-5 h-5 text-red-500" />}
        iconBg="bg-red-100"
        label="Blood Pressure"
        value="128/82"
        unit="mmHg"
        status="Controlled ✓"
        statusColor="bg-emerald-100 text-emerald-700"
        trend="→ Stable"
        trendColor="text-blue-600 bg-blue-50"
        context="Logged yesterday at home · target <130/80"
      />
      <HealthStatCard
        icon={<FlaskConical className="w-5 h-5 text-blue-600" />}
        iconBg="bg-blue-100"
        label="Last Lab Results"
        value="All"
        unit="Normal ✓"
        status="6 tests complete ✓"
        statusColor="bg-emerald-100 text-emerald-700"
        trend="5 Mar 2026"
        trendColor="text-slate-600 bg-slate-100"
        context="Reviewed by Dr. Fatima · next due Apr 2026"
      />
      <HealthStatCard
        icon={<Pill className="w-5 h-5 text-teal-600" />}
        iconBg="bg-teal-100"
        label="Adherence This Month"
        value="87"
        unit="%"
        status="Good 👍"
        statusColor="bg-teal-100 text-teal-700"
        trend="↑ +3%"
        trendColor="text-emerald-600 bg-emerald-50"
        context="Missing 3 evening doses — set a louder alarm?"
      />
    </div>
  );
}

function HealthStatCard({ icon, iconBg, label, value, unit, status, statusColor, trend, trendColor, context }: any) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-[1.015] transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${trendColor}`}>{trend}</span>
      </div>
      <div className="mb-2">
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-3xl font-bold text-slate-900">{value}</span>
          {unit && <span className="text-sm text-slate-400 font-mono">{unit}</span>}
        </div>
        <p className="text-xs uppercase tracking-wide text-slate-400 mt-1 font-sans">{label}</p>
      </div>
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColor} mb-2`}>
        {status}
      </span>
      <p className="text-xs text-slate-500 font-sans">{context}</p>
    </div>
  );
}

function HbA1cTrendCard({ data }: any) {
  return (
    <div className="bg-white rounded-2xl p-7 shadow-md animate-slideUp" style={{ animationDelay: '320ms' }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-playfair text-xl font-bold text-slate-900">Your HbA1c Progress 📈</h3>
          <p className="text-sm text-slate-400 mt-1 font-sans">Last 6 months — improving trend ↓</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-bold">Target: &lt;6.5%</span>
          <span className="text-xs text-slate-400">Sep 2025 – Mar 2026</span>
        </div>
      </div>

      <AreaChart
        data={data}
        dataKey="value"
        xAxisKey="month"
        height={200}
        color="#0D9488"
        targetLine={6.5}
        targetLabel="Target"
        yDomain={[5.5, 8.0]}
      />

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <span className="text-sm font-bold text-emerald-600 font-sans">↓ Improved by 0.6% over 6 months</span>
        <span className="text-xs text-teal-600 font-sans">Keep it up! Target: 6.5% or less</span>
        <a href="#" className="text-teal-600 text-xs hover:underline font-sans">View Full History →</a>
      </div>

      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800 font-sans">
          💡 At this rate, you could reach your target HbA1c of 6.5% in approximately 2–3 months. Keep up your diet and medication.
        </p>
      </div>
    </div>
  );
}

function InsuranceCard({ insurance }: any) {
  const usagePercent = (insurance.used / insurance.annualLimit) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-sans text-sm font-bold text-slate-900">Insurance Coverage</h3>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">{insurance.provider} {insurance.plan} ✓</span>
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className="flex-1">
          <p className="text-xs text-slate-400 font-mono mb-1">Policy #: {insurance.policyNumber}</p>
          <p className="text-xs text-slate-600 font-sans mb-2">Valid: Jan 2026 – {insurance.validUntil}</p>
          <p className="text-xs text-emerald-600 font-sans">In-network: All CeenAiX clinics ✓</p>
        </div>
        <div className="w-32 h-20 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 p-3 flex flex-col justify-between">
          <div>
            <p className="text-white font-bold text-xs">{insurance.provider.toUpperCase()}</p>
            <span className="inline-block px-2 py-0.5 bg-white/30 text-white rounded-full text-xs mt-1">{insurance.plan.toUpperCase()}</span>
          </div>
          <p className="text-white text-xs font-sans">{MOCK_PATIENT.name}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-600 font-sans">Annual Limit</span>
          <span className="text-sm font-bold text-slate-900 font-mono">AED {insurance.annualLimit.toLocaleString()}</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-800"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-500 font-sans">AED {insurance.used.toLocaleString()} used</span>
          <span className="text-xs text-emerald-600 font-sans font-medium">AED {(insurance.annualLimit - insurance.used).toLocaleString()} remaining</span>
        </div>
        <p className="text-xs text-emerald-600 mt-2 font-sans">{usagePercent.toFixed(1)}% used — excellent coverage remaining ✓</p>
      </div>

      <div className="space-y-1.5 text-xs text-slate-600 mb-4 font-sans">
        <div className="flex items-center gap-2">
          <Pill className="w-3 h-3" />
          <span>Medications: {insurance.coPay}% co-pay</span>
        </div>
        <div className="flex items-center gap-2">
          <Stethoscope className="w-3 h-3" />
          <span>Consultations: {insurance.coPay}% co-pay</span>
        </div>
        <div className="flex items-center gap-2">
          <FlaskConical className="w-3 h-3" />
          <span>Lab Tests: {insurance.coPay}% co-pay</span>
        </div>
      </div>

      <div className="flex gap-2">
        <a href="#" className="text-teal-600 text-xs hover:underline font-sans">View Insurance Details →</a>
        <span className="text-slate-300">|</span>
        <a href="#" className="text-slate-600 text-xs hover:underline font-sans">Download Card 📄</a>
      </div>
    </div>
  );
}

function QuickActionsCard() {
  const actions = [
    { icon: Calendar, label: 'Book Appointment', color: 'teal', href: '#' },
    { icon: MessageSquare, label: 'Message Doctor', color: 'blue', href: '#' },
    { icon: FlaskConical, label: 'View Lab Results', color: 'purple', href: '#' },
    { icon: Pill, label: 'Medication Info', color: 'amber', href: '#' },
    { icon: Stethoscope, label: 'Find a Doctor', color: 'emerald', href: '#' },
    { icon: Bot, label: 'Ask AI Assistant', color: 'slate', href: '#' },
  ];

  const colorClasses: Record<string, string> = {
    teal: 'bg-teal-50 border-teal-200 text-teal-600 hover:bg-teal-100',
    blue: 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100',
    purple: 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100',
    amber: 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100',
    slate: 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <h3 className="font-playfair text-lg font-bold text-slate-900 mb-4">Quick Actions ⚡</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, idx) => (
          <a
            key={idx}
            href={action.href}
            className={`flex flex-col items-center justify-center gap-2 h-16 border rounded-xl transition-all hover:scale-105 active:scale-95 ${colorClasses[action.color]}`}
          >
            <action.icon className="w-5 h-5" />
            <span className="text-xs font-bold font-sans">{action.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function BloodPressureCard({ data }: any) {
  const latestReading = data[data.length - 1];

  return (
    <div className="bg-white rounded-2xl p-7 shadow-md">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-playfair text-xl font-bold text-slate-900">Blood Pressure Log 💓</h3>
          <p className="text-sm text-slate-400 mt-1 font-sans">Last 7 days — home monitoring</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xl font-bold text-slate-900">{latestReading.systolic}/{latestReading.diastolic}</p>
          <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium mt-1">Controlled ✓</span>
        </div>
      </div>

      <LineChart
        data={data}
        lines={[
          { dataKey: 'systolic', color: '#EF4444', name: 'Systolic' },
          { dataKey: 'diastolic', color: '#3B82F6', name: 'Diastolic' }
        ]}
        xAxisKey="date"
        height={160}
        targetLine={130}
        targetLabel="Target 130"
        yDomain={[70, 150]}
      />

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <span className="text-sm font-bold text-emerald-600 font-sans">✓ BP controlled for 7 days straight</span>
        <button className="px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg text-sm font-bold hover:bg-teal-50 transition-colors">
          Add Today's Reading +
        </button>
      </div>
    </div>
  );
}

function CareTeamCard({ doctors }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-teal-600" />
          <h3 className="font-sans text-sm font-bold text-slate-900">My Care Team</h3>
        </div>
        <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-bold">{doctors.length} doctors</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {doctors.map((doctor: any) => (
          <div key={doctor.id} className="border border-slate-100 rounded-xl p-4 hover:shadow-md hover:scale-105 transition-all cursor-pointer">
            <div className="flex flex-col items-center text-center mb-3">
              <div className="relative mb-2">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-600 to-teal-600 flex items-center justify-center text-white font-sans font-bold">
                  {doctor.initials}
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 ${doctor.isOnline ? 'bg-emerald-500' : 'bg-slate-400'} rounded-full border-2 border-white`} />
              </div>
              <p className="font-sans text-sm font-bold text-slate-900">{doctor.name}</p>
              <span className="inline-block px-2 py-0.5 bg-teal-50 text-teal-600 rounded text-xs mt-1">{doctor.specialty}</span>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {doctor.clinic}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3 mb-3">
              {doctor.nextAppointment ? (
                <p className="text-xs text-teal-600 font-medium text-center">
                  Next: {doctor.nextAppointment} · {doctor.daysUntil} days
                </p>
              ) : (
                <p className="text-xs text-slate-400 text-center">On demand (GP)</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="px-3 py-1.5 bg-teal-600 text-white rounded text-xs font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-1">
                <MessageSquare className="w-3 h-3" />
                Message
              </button>
              <button className="px-3 py-1.5 border border-teal-600 text-teal-600 rounded text-xs font-bold hover:bg-teal-50 transition-colors flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3" />
                Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIHealthTipCard({ tip, onNext }: any) {
  return (
    <div className="bg-white border-l-4 border-teal-600 rounded-2xl p-6 shadow-md bg-[#F0FDFA]">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
          <Bot className="w-6 h-6 text-teal-600" />
        </div>
        <div className="flex-1">
          <div className="mb-2">
            <p className="text-xs uppercase tracking-wide text-teal-600 font-bold font-sans">AI Health Tip 🤖</p>
            <p className="text-xs text-slate-400 font-sans">For you, Parnia — based on your health data</p>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-sans">{tip.content}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 transition-colors whitespace-nowrap">
            Ask AI More →
          </button>
          <button
            onClick={onNext}
            className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ActiveRemindersStrip() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-600" />
          <h3 className="font-sans text-sm font-bold text-slate-900">Active Reminders</h3>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
            ✅ Metformin 8AM
          </span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
            ✅ Amlodipine 8AM
          </span>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium animate-pulse">
            ⏰ Metformin+Atorvastatin 8PM
          </span>
        </div>
        <a href="#" className="text-teal-600 text-xs hover:underline font-sans whitespace-nowrap">Manage →</a>
      </div>
    </div>
  );
}

function BottomNavigation({ activeTab }: { activeTab: string }) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'records', icon: Heart, label: 'Records' },
    { id: 'meds', icon: Pill, label: 'Meds' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', badge: 2 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 md:hidden z-50">
      <div className="flex items-center justify-around h-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full relative ${
              activeTab === tab.id ? 'text-teal-600' : 'text-slate-400'
            }`}
          >
            {activeTab === tab.id && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-teal-600 rounded-full" />
            )}
            <div className="relative">
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'fill-current' : ''}`} />
              {tab.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className={`text-xs font-bold font-sans ${activeTab === tab.id ? 'text-teal-600' : 'text-slate-400'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
