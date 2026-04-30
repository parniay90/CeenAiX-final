import { useState, useEffect, useRef } from 'react';
import { Pill, Calendar, Bell, Clock, CreditCard, RefreshCw, CheckCircle, TrendingUp, ChevronUp } from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';
import ActiveMedicationsTab from '../components/medications/ActiveMedicationsTab';
import TodaysScheduleTab from '../components/medications/TodaysScheduleTab';
import RemindersTab from '../components/medications/RemindersTab';
import PastMedicationsTab from '../components/medications/PastMedicationsTab';
import CostsCoverageTab from '../components/medications/CostsCoverageTab';
import type { Medication, PastMedication, Reminder } from '../types/medications';
import { MOCK_PATIENT } from '../types/patientDashboard';

export default function Medications() {
  const [activeTab, setActiveTab] = useState<'active' | 'schedule' | 'reminders' | 'past' | 'costs'>('active');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setShowScrollTop(el.scrollTop > 300);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  const activeMedications: Medication[] = [
    {
      id: 'med-1',
      genericName: 'Metformin Hydrochloride',
      brandName: 'Glucophage',
      strength: '850mg',
      form: 'Tablet',
      category: 'Diabetes',
      categoryColor: '#3B82F6',
      categoryEmoji: '🩸',
      condition: 'Type 2 Diabetes Mellitus',
      prescribedBy: 'Dr. Fatima Al Mansoori',
      prescribedBySpecialty: 'Endocrinologist',
      prescribedOn: '5 March 2026',
      instructions: 'Take with meals — twice daily',
      schedule: [
        { time: '8:00 AM', status: 'taken', takenAt: '8:12 AM' },
        { time: '8:00 PM', status: 'pending' }
      ],
      duration: 'Ongoing (chronic)',
      courseStart: '5 March 2026',
      quantityDispensed: 60,
      refillsRemaining: 5,
      daysSupplyRemaining: 21,
      nextRefillDue: '25 March 2026',
      pharmacy: 'Al Shifa Pharmacy',
      pharmacyLocation: 'Al Barsha, Dubai',
      insuranceCovered: true,
      insuranceName: 'Daman Gold',
      monthlyPrice: 45,
      insurancePrice: 0,
      nabidh: 'NAB-RX-2026-047821',
      adherenceRate: 90,
      adherenceTaken: 54,
      adherenceTotal: 60,
      missedPattern: 'Evening doses on weekends',
      drugInfo: {
        howItWorks: 'Metformin reduces the amount of glucose your liver releases into the blood and helps your body respond better to insulin.',
        commonSideEffects: ['Nausea', 'Stomach upset (usually improves after a few weeks)', 'Diarrhea'],
        seriousSideEffects: 'Lactic acidosis (rare — seek emergency care)',
        foodInteractions: 'Take WITH food — reduces stomach upset',
        avoid: 'Excessive alcohol',
        storage: 'Room temperature, away from moisture',
        important: 'Never stop without consulting Dr. Fatima'
      }
    },
    {
      id: 'med-2',
      genericName: 'Atorvastatin Calcium',
      brandName: 'Lipitor',
      strength: '20mg',
      form: 'Tablet',
      category: 'Cholesterol',
      categoryColor: '#7C3AED',
      categoryEmoji: '💜',
      condition: 'Hypercholesterolemia (elevated cholesterol)',
      prescribedBy: 'Dr. Ahmed Al Rashidi',
      prescribedBySpecialty: 'Cardiologist',
      prescribedOn: '10 January 2026',
      instructions: 'Take at bedtime — once daily',
      schedule: [
        { time: '10:00 PM', status: 'scheduled' }
      ],
      duration: 'Ongoing',
      courseStart: '10 January 2026',
      quantityDispensed: 30,
      refillsRemaining: 11,
      daysSupplyRemaining: 28,
      nextRefillDue: '1 April 2026',
      pharmacy: 'Al Shifa Pharmacy',
      pharmacyLocation: 'Al Barsha, Dubai',
      insuranceCovered: true,
      insuranceName: 'Daman Gold',
      monthlyPrice: 80,
      insurancePrice: 8,
      nabidh: 'NAB-RX-2026-039211',
      adherenceRate: 97,
      adherenceTaken: 29,
      adherenceTotal: 30,
      drugInfo: {
        howItWorks: 'Atorvastatin lowers LDL (bad) cholesterol and raises HDL (good) cholesterol, reducing risk of heart attack and stroke.',
        commonSideEffects: ['Muscle aches', 'Headache', 'Nausea'],
        seriousSideEffects: 'Muscle breakdown (myopathy) — rare',
        foodInteractions: '⚠️ AVOID GRAPEFRUIT — interferes with absorption and can cause dangerous side effects',
        avoid: 'Limit alcohol — can increase liver strain',
        storage: 'Room temperature, away from heat and light',
        important: 'Best taken at night — liver produces cholesterol mainly at night, so evening dosing is most effective'
      },
      warnings: ['⚠️ AVOID GRAPEFRUIT — see Drug Info']
    },
    {
      id: 'med-3',
      genericName: 'Amlodipine Besylate',
      brandName: 'Norvasc',
      strength: '5mg',
      form: 'Tablet',
      category: 'Cardiovascular',
      categoryColor: '#EF4444',
      categoryEmoji: '❤️',
      condition: 'Essential Hypertension (High Blood Pressure)',
      prescribedBy: 'Dr. Ahmed Al Rashidi',
      prescribedBySpecialty: 'Cardiologist',
      prescribedOn: '15 October 2021',
      instructions: 'Take in the morning — once daily (same time)',
      schedule: [
        { time: '8:00 AM', status: 'taken', takenAt: '8:12 AM' }
      ],
      duration: 'Ongoing (long-term BP control)',
      courseStart: '15 October 2021',
      quantityDispensed: 30,
      refillsRemaining: 11,
      daysSupplyRemaining: 28,
      nextRefillDue: '1 April 2026',
      pharmacy: 'Al Shifa Pharmacy',
      pharmacyLocation: 'Al Barsha, Dubai',
      insuranceCovered: true,
      insuranceName: 'Daman Gold',
      monthlyPrice: 120,
      insurancePrice: 12,
      nabidh: 'NAB-RX-2026-028761',
      adherenceRate: 100,
      adherenceTaken: 30,
      adherenceTotal: 30,
      drugInfo: {
        howItWorks: 'Amlodipine relaxes blood vessels, making it easier for your heart to pump blood, lowering BP.',
        commonSideEffects: ['Ankle swelling', 'Flushing', 'Fatigue'],
        seriousSideEffects: 'Very low BP (dizziness when standing)',
        foodInteractions: 'No major food interactions',
        storage: 'Room temperature',
        important: 'DO NOT skip — BP can spike dangerously'
      },
      doctorNote: 'Take at exactly the same time every morning. Consistency is essential for BP control.'
    },
    {
      id: 'med-4',
      genericName: 'Cholecalciferol (Vitamin D3)',
      brandName: 'D-Cal / Jamieson D3',
      strength: '2000 IU',
      form: 'Softgel',
      category: 'Supplement',
      categoryColor: '#F59E0B',
      categoryEmoji: '☀️',
      condition: 'Vitamin D Insufficiency (22 ng/mL — target >30)',
      prescribedBy: 'Dr. Fatima Al Mansoori',
      prescribedBySpecialty: 'Endocrinologist',
      prescribedOn: '5 March 2026',
      instructions: 'Take once daily with a meal containing fat',
      schedule: [
        { time: '8:00 AM', status: 'taken', takenAt: '8:12 AM' }
      ],
      duration: '3 months then retest',
      courseStart: '5 March 2026',
      quantityDispensed: 90,
      refillsRemaining: 0,
      daysSupplyRemaining: 45,
      nextRefillDue: '20 April 2026',
      pharmacy: 'Al Shifa Pharmacy',
      pharmacyLocation: 'Al Barsha, Dubai',
      insuranceCovered: false,
      monthlyPrice: 35,
      insurancePrice: 35,
      nabidh: 'NAB-RX-2026-048932',
      adherenceRate: 93,
      adherenceTaken: 28,
      adherenceTotal: 30,
      retestDate: '5 June 2026',
      retestInfo: 'Retest blood level',
      drugInfo: {
        howItWorks: 'Vitamin D helps your body absorb calcium, supports bone health, and plays a role in immune function.',
        commonSideEffects: ['Generally very safe at 2000 IU'],
        seriousSideEffects: 'None at therapeutic doses',
        foodInteractions: 'Take with a meal containing healthy fats (eggs, avocado, olive oil) for best absorption',
        storage: 'Room temperature',
        important: 'Your last test showed 22 ng/mL — insufficient. Dubai\'s hot climate means most people avoid the sun, reducing natural Vitamin D production.'
      }
    }
  ];

  const pastMedications: PastMedication[] = [
    {
      id: 'past-1',
      genericName: 'Azithromycin',
      brandName: 'Zithromax',
      strength: '500mg',
      category: 'Antibiotic',
      prescribedOn: 'Feb 2026',
      stoppedOn: 'Feb 2026',
      duration: '7 days',
      reason: 'Upper respiratory tract infection',
      prescribedBy: 'Dr. Tooraj Helmi',
      status: 'completed',
      statusLabel: 'Course completed'
    },
    {
      id: 'past-2',
      genericName: 'Omeprazole',
      brandName: 'Prilosec',
      strength: '20mg',
      category: 'General',
      prescribedOn: 'Jan 2026',
      stoppedOn: 'Feb 2026',
      duration: '6 weeks',
      reason: 'Acid reflux (GERD)',
      prescribedBy: 'Dr. Tooraj Helmi',
      status: 'stopped',
      statusLabel: 'Symptoms resolved'
    },
    {
      id: 'past-3',
      genericName: 'Paracetamol',
      brandName: 'Panadol',
      strength: '500mg',
      category: 'Painkiller',
      prescribedOn: 'Dec 2025',
      stoppedOn: 'Mar 2026',
      duration: 'As needed',
      reason: 'Pain/fever relief',
      prescribedBy: 'Dr. Tooraj Helmi',
      status: 'expired',
      statusLabel: 'Prescription expired'
    }
  ];

  const reminders: Reminder[] = [
    {
      id: 'rem-1',
      medicationId: 'med-1',
      medicationName: 'Metformin 850mg',
      dose: 'Morning Dose',
      time: '8:00 AM every day',
      frequency: 'Daily',
      channels: { sms: true, app: true, whatsapp: false },
      active: true,
      messagePreview: 'Hi Parnia, time to take your Metformin 850mg (1 tablet) with breakfast. 💊 — Al Shifa Pharmacy'
    },
    {
      id: 'rem-2',
      medicationId: 'med-1',
      medicationName: 'Metformin 850mg',
      dose: 'Evening Dose',
      time: '8:00 PM every day',
      frequency: 'Daily',
      channels: { sms: true, app: true, whatsapp: false },
      active: true,
      messagePreview: 'Hi Parnia, time to take your Metformin 850mg (1 tablet) with dinner. 💊 — Al Shifa Pharmacy'
    },
    {
      id: 'rem-3',
      medicationId: 'med-3',
      medicationName: 'Amlodipine 5mg',
      dose: 'Morning Dose',
      time: '8:00 AM every day',
      frequency: 'Daily',
      channels: { sms: false, app: true, whatsapp: false },
      active: true,
      messagePreview: 'Time to take your Amlodipine 5mg for blood pressure control. — CeenAiX'
    }
  ];

  const takenToday = activeMedications.reduce((count, med) => {
    return count + med.schedule.filter(d => d.status === 'taken').length;
  }, 0);

  const totalDosesToday = activeMedications.reduce((count, med) => {
    return count + med.schedule.length;
  }, 0);

  const monthlyAdherence = Math.round(
    activeMedications.reduce((sum, med) => sum + med.adherenceRate, 0) / activeMedications.length
  );

  const refillsDue = activeMedications.filter(med => med.daysSupplyRemaining < 30).length;

  const monthlyCost = activeMedications.reduce((sum, med) => sum + med.insurancePrice, 0);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <PatientTopNav patientName={MOCK_PATIENT.name} />

      <div className="flex flex-1 overflow-hidden">
        <PatientSidebar currentPage="medications" />

        <main ref={mainRef} className="flex-1 overflow-y-auto">
        <div className="flex-1">
        <div className="p-8">
          <div className="animate-fadeIn">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-4xl font-playfair font-bold text-slate-900 mb-2">My Medications 💊</h1>
                <p className="text-slate-400 text-[15px]">Track your medications, doses, and refills</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-teal-500/30">
                  <Pill className="w-4 h-4" />
                  <span className="text-[13px] font-bold">{takenToday} / {totalDosesToday} doses taken today</span>
                </div>
                <button className="px-5 py-2.5 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all duration-300 font-medium">
                  + Request Refill
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 mb-8 animate-slideUp" style={{ animationDelay: '80ms' }}>
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <Pill className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-mono font-bold text-slate-900">{activeMedications.length}</div>
                    <div className="text-xs text-slate-400">Active Medications</div>
                  </div>
                </div>
                <div className="text-xs text-teal-600 font-medium">For 2 conditions</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-mono font-bold text-emerald-600">{takenToday}/{totalDosesToday}</div>
                    <div className="text-xs text-slate-400">Taken Today</div>
                  </div>
                </div>
                <div className="text-xs text-amber-500 font-medium mb-2">{totalDosesToday - takenToday} more pending</div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-800 ease-out"
                    style={{ width: `${(takenToday / totalDosesToday) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-mono font-bold text-teal-600">{monthlyAdherence}%</div>
                    <div className="text-xs text-slate-400">Adherence This Month</div>
                  </div>
                </div>
                <div className="text-xs text-emerald-600 font-medium">↑ +4% vs last month</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-glow">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-mono font-bold text-amber-600">{refillsDue}</div>
                    <div className="text-xs text-slate-400">Refill Due Soon</div>
                  </div>
                </div>
                <div className="text-xs text-amber-500 font-medium">Metformin — 21 days</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-mono font-bold text-slate-900">AED {monthlyCost}</div>
                    <div className="text-xs text-slate-400">My Monthly Cost</div>
                  </div>
                </div>
                <div className="text-xs text-teal-600 font-medium mb-1">After Daman Gold insurance</div>
                <div className="text-[11px] text-slate-400 line-through">Full price: AED 280</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm mb-6 animate-slideUp" style={{ animationDelay: '160ms' }}>
              <div className="border-b border-slate-100 px-6">
                <div className="flex gap-8">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`py-4 px-2 text-[15px] font-medium transition-all duration-300 relative ${
                      activeTab === 'active'
                        ? 'text-teal-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      💊 Active Medications
                      <span className="bg-teal-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {activeMedications.length}
                      </span>
                    </span>
                    {activeTab === 'active' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('schedule')}
                    className={`py-4 px-2 text-[15px] font-medium transition-all duration-300 relative ${
                      activeTab === 'schedule'
                        ? 'text-teal-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    📅 Today's Schedule
                    {activeTab === 'schedule' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('reminders')}
                    className={`py-4 px-2 text-[15px] font-medium transition-all duration-300 relative ${
                      activeTab === 'reminders'
                        ? 'text-teal-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    📋 Reminders
                    {activeTab === 'reminders' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('past')}
                    className={`py-4 px-2 text-[15px] font-medium transition-all duration-300 relative ${
                      activeTab === 'past'
                        ? 'text-teal-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      🕐 Past Medications
                      <span className="bg-slate-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {pastMedications.length}
                      </span>
                    </span>
                    {activeTab === 'past' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('costs')}
                    className={`py-4 px-2 text-[15px] font-medium transition-all duration-300 relative ${
                      activeTab === 'costs'
                        ? 'text-teal-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    💰 Costs & Coverage
                    {activeTab === 'costs' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'active' && <ActiveMedicationsTab medications={activeMedications} />}
                {activeTab === 'schedule' && <TodaysScheduleTab medications={activeMedications} />}
                {activeTab === 'reminders' && <RemindersTab reminders={reminders} medications={activeMedications} />}
                {activeTab === 'past' && <PastMedicationsTab medications={pastMedications} />}
                {activeTab === 'costs' && <CostsCoverageTab medications={activeMedications} />}
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
    </div>
  );
}