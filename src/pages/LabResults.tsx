import { useState } from 'react';
import { FlaskConical, CheckCircle, AlertTriangle, Calendar, Building2, AlertCircle } from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import TopNav from '../components/dashboard/TopNav';
import RecentResultsTab from '../components/labResults/RecentResultsTab';
import MyTrendsTab from '../components/labResults/MyTrendsTab';
import AllHistoryTab from '../components/labResults/AllHistoryTab';
import UpcomingLabsTab from '../components/labResults/UpcomingLabsTab';
import AllReportsTab from '../components/labResults/AllReportsTab';
import type { LabVisit, UpcomingLabOrder } from '../types/patientLabResults';

export default function LabResults() {
  const [activeTab, setActiveTab] = useState<'recent' | 'trends' | 'history' | 'upcoming' | 'reports'>('recent');

  const latestVisit: LabVisit = {
    id: 'visit-1',
    visitDate: '5 March 2026',
    labName: 'Dubai Medical Laboratory',
    labLocation: 'Healthcare City, Dubai',
    labDHA: 'DHA-LAB-2019-08471',
    orderedBy: 'Dr. Fatima Al Mansoori',
    orderedBySpecialty: 'Endocrinologist',
    orderDate: '4 March 2026',
    sampleCollectionDate: '5 March 2026',
    sampleCollectionTime: '07:30 AM',
    resultsReleasedDate: '5 March 2026',
    resultsReleasedTime: '01:15 PM',
    reviewedBy: 'Dr. Fatima Al Mansoori',
    reviewedDate: '5 March 2026 3:00 PM',
    reviewStatus: 'reviewed',
    overallComment: 'Overall looking good, Parnia! HbA1c is improving — keep up the Metformin and diet changes. See you in 3 months. 💪',
    nabidh: 'NAB-VISIT-2026-047821',
    tests: [
      {
        id: 'test-1',
        name: 'HbA1c',
        fullName: 'Glycated Hemoglobin',
        loinc: '4548-4',
        value: 6.8,
        unit: '%',
        status: 'borderline',
        statusLabel: '⚠️ Pre-diabetic',
        categoryColor: '#F59E0B',
        referenceRange: {
          text: 'Normal <5.7% | Pre-diabetic 5.7–6.4% | Diabetic ≥6.5%',
          zones: [
            { label: 'Normal', max: 5.7, color: '#059669' },
            { label: 'Pre-diabetic', min: 5.7, max: 6.4, color: '#F59E0B' },
            { label: 'Diabetic', min: 6.5, color: '#EF4444' }
          ]
        },
        flag: 'H',
        doctorComment: 'HbA1c improving from 7.1% — keep up the diet changes and Metformin. Recheck in 3 months.',
        patientExplanation: 'This measures your average blood sugar over the last 3 months. Your level of 6.8% is in the pre-diabetic range — but you\'ve improved from 7.4% in September! You\'re moving in the right direction.',
        trend: [7.4, 7.2, 7.1, 7.0, 6.9, 6.8],
        trendDates: ['Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Mar 2026'],
        trendDirection: 'improving'
      },
      {
        id: 'test-2',
        name: 'Fasting Glucose',
        fullName: 'Fasting Blood Glucose',
        loinc: '1558-6',
        value: 118,
        unit: 'mg/dL',
        status: 'borderline',
        statusLabel: '⚠️ Elevated',
        categoryColor: '#F59E0B',
        referenceRange: {
          text: 'Normal <100 | Pre-diabetic 100–125 | Diabetic ≥126',
          zones: [
            { label: 'Normal', max: 100, color: '#059669' },
            { label: 'Pre-diabetic', min: 100, max: 125, color: '#F59E0B' },
            { label: 'Diabetic', min: 126, color: '#EF4444' }
          ]
        },
        flag: 'H',
        doctorComment: 'Slightly above normal fasting range. Continue Metformin and monitor. Morning readings at home.',
        patientExplanation: 'Your fasting blood sugar of 118 mg/dL is slightly above the normal range. It\'s been steadily improving — your medication and diet are working!',
        fastingRequired: true,
        trend: [128, 124, 121, 118],
        trendDates: ['Oct 2025', 'Jan 2026', 'Mar 2026'],
        trendDirection: 'improving'
      },
      {
        id: 'test-3',
        name: 'Lipid Panel',
        fullName: 'Complete Lipid Panel',
        loinc: '57698-3',
        status: 'normal',
        statusLabel: '✅ All Normal',
        categoryColor: '#059669',
        referenceRange: {
          text: 'All values within healthy range'
        },
        patientExplanation: 'Your cholesterol levels are all in the healthy range! Your Atorvastatin (cholesterol medication) is doing its job.',
        medication: 'Atorvastatin 20mg',
        subTests: [
          {
            name: 'Total Cholesterol',
            value: 195,
            unit: 'mg/dL',
            status: 'normal',
            flag: 'N',
            referenceRange: { text: 'Normal <200', max: 200 }
          },
          {
            name: 'LDL Cholesterol',
            value: 118,
            unit: 'mg/dL',
            status: 'normal',
            flag: 'N',
            referenceRange: { text: 'Normal <130; optimal <100', max: 130 }
          },
          {
            name: 'HDL Cholesterol',
            value: 52,
            unit: 'mg/dL',
            status: 'normal',
            flag: 'N',
            referenceRange: { text: 'Normal >40 women', min: 40 }
          },
          {
            name: 'Triglycerides',
            value: 128,
            unit: 'mg/dL',
            status: 'normal',
            flag: 'N',
            referenceRange: { text: 'Normal <150', max: 150 }
          }
        ],
        doctorComment: 'Lipid panel looks good — Atorvastatin working effectively.'
      },
      {
        id: 'test-4',
        name: 'Vitamin D',
        fullName: 'Vitamin D (25-OH)',
        loinc: '14635-7',
        value: 22,
        unit: 'ng/mL',
        status: 'low',
        statusLabel: '⚠️ Insufficient',
        categoryColor: '#F59E0B',
        referenceRange: {
          text: 'Deficient <20 | Insufficient 20–29 | Sufficient 30–80',
          zones: [
            { label: 'Deficient', max: 20, color: '#EF4444' },
            { label: 'Insufficient', min: 20, max: 29, color: '#F59E0B' },
            { label: 'Sufficient', min: 30, max: 80, color: '#059669' }
          ]
        },
        flag: 'L',
        doctorComment: 'Vitamin D insufficient — prescribed Vitamin D 2000IU daily. Retest in 3 months (June 2026).',
        patientExplanation: '22 ng/mL means your Vitamin D is "insufficient" — slightly below the healthy range of 30+. This is very common in Dubai where we avoid sun exposure. Your Vitamin D supplement should raise this by June.',
        trend: [18, 22],
        trendDates: ['Dec 2025', 'Mar 2026'],
        trendDirection: 'improving',
        retestDate: '5 June 2026'
      },
      {
        id: 'test-5',
        name: 'CBC',
        fullName: 'Complete Blood Count',
        loinc: '58410-2',
        status: 'normal',
        statusLabel: '✅ All Normal',
        categoryColor: '#059669',
        referenceRange: {
          text: 'All values within healthy range'
        },
        patientExplanation: 'Your complete blood count is all normal. This checks your red blood cells, white blood cells, and platelets — all looking healthy!',
        subTests: [
          {
            name: 'WBC',
            value: 6.2,
            unit: '×10³/μL',
            status: 'normal',
            flag: 'N',
            referenceRange: { text: '4.5–11.0', min: 4.5, max: 11.0 }
          },
          {
            name: 'RBC',
            value: 4.6,
            unit: '×10⁶/μL',
            status: 'normal',
            flag: 'N',
            referenceRange: { text: '4.2–5.4 women', min: 4.2, max: 5.4 }
          },
          {
            name: 'Hemoglobin',
            value: 13.1,
            unit: 'g/dL',
            status: 'normal',
            flag: 'N',
            referenceRange: { text: '12.0–16.0 women', min: 12.0, max: 16.0 }
          },
          {
            name: 'Hematocrit',
            value: 38,
            unit: '%',
            status: 'normal',
            flag: 'N',
            referenceRange: { text: '36–48%', min: 36, max: 48 }
          },
          {
            name: 'Platelets',
            value: 245,
            unit: '×10³/μL',
            status: 'normal',
            flag: 'N',
            referenceRange: { text: '150–400', min: 150, max: 400 }
          }
        ],
        doctorComment: 'CBC all normal — no signs of anemia or infection.'
      },
      {
        id: 'test-6',
        name: 'CRP',
        fullName: 'C-Reactive Protein',
        loinc: '1988-5',
        value: 3.2,
        unit: 'mg/L',
        status: 'borderline',
        statusLabel: '⚠️ Monitor',
        categoryColor: '#F59E0B',
        referenceRange: {
          text: 'Normal <3.0 | Monitor 3.0–10.0',
          zones: [
            { label: 'Low Risk', max: 3.0, color: '#059669' },
            { label: 'Monitor', min: 3.0, max: 10.0, color: '#F59E0B' },
            { label: 'High', min: 10.0, color: '#EF4444' }
          ]
        },
        flag: 'H',
        doctorComment: 'Slightly elevated CRP — mild inflammation, likely related to glucose control. Should improve as HbA1c normalizes. Recheck next visit.',
        patientExplanation: 'CRP measures inflammation in your body. At 3.2 mg/L, it\'s just slightly above normal — this mild elevation is common with elevated blood sugar and should improve as your diabetes comes under better control.'
      }
    ]
  };

  const upcomingOrder: UpcomingLabOrder = {
    id: 'order-upcoming-1',
    orderedBy: 'Dr. Ahmed Al Rashidi',
    orderedBySpecialty: 'Cardiologist',
    orderDate: '4 March 2026',
    dueDate: '15 April 2026',
    daysRemaining: 11,
    urgency: 'routine',
    tests: [
      {
        name: 'Complete Blood Count (CBC)',
        loinc: '58410-2',
        description: 'Checks: blood cells, infection, anemia',
        cost: 80,
        insuranceCoverage: 72,
        patientCost: 8,
        fastingRequired: false
      },
      {
        name: 'Lipid Panel',
        loinc: '57698-3',
        description: 'Checks: cholesterol and triglycerides',
        cost: 120,
        insuranceCoverage: 108,
        patientCost: 12,
        fastingRequired: true
      },
      {
        name: 'HbA1c',
        loinc: '4548-4',
        description: 'Checks: 3-month blood sugar average',
        cost: 90,
        insuranceCoverage: 81,
        patientCost: 9,
        fastingRequired: false
      },
      {
        name: 'Liver Function Test (LFT)',
        loinc: 'panel',
        description: 'Checks: liver health + Metformin tolerance',
        cost: 140,
        insuranceCoverage: 126,
        patientCost: 14,
        fastingRequired: true
      },
      {
        name: 'Renal Function Test (RFT)',
        loinc: 'panel',
        description: 'Checks: kidney health',
        cost: 130,
        insuranceCoverage: 117,
        patientCost: 13,
        fastingRequired: false
      },
      {
        name: 'Troponin I',
        loinc: '10839-9',
        description: 'Checks: heart muscle stress markers',
        cost: 180,
        insuranceCoverage: 162,
        patientCost: 18,
        fastingRequired: false
      }
    ]
  };

  const totalTests = 14;
  const latestTestsCount = latestVisit.tests.length;
  const abnormalCount = latestVisit.tests.filter(t => t.status !== 'normal').length;
  const totalUpcomingCost = upcomingOrder.tests.reduce((sum, t) => sum + t.patientCost, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <PatientSidebar currentPage="lab-results" />
      <TopNav patientName="Parnia Yazdkhasti" patientAvatar="https://i.pravatar.cc/150?img=5" />

      <div className="ml-64 pt-16">
        <div className="p-8">
          <div className="animate-fadeIn">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-4xl font-playfair font-bold text-slate-900 mb-2">My Lab Results 🔬</h1>
                <p className="text-slate-400 text-[15px]">Test results from Dubai Medical Laboratory and Emirates Diagnostics</p>
              </div>

              {upcomingOrder && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 max-w-xs animate-glow">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-amber-700 mb-1">⏰ Labs due before Apr 15</div>
                      <div className="text-xs text-amber-600">6 tests ordered by Dr. Ahmed</div>
                      <div className="text-xs text-amber-700 font-bold mt-1">{upcomingOrder.daysRemaining} days remaining</div>
                      <button className="mt-2 w-full px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-xs font-bold">
                        Book Sample Collection →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-4 mb-8 animate-slideUp" style={{ animationDelay: '80ms' }}>
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
                    <FlaskConical className="w-7 h-7 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-mono font-bold text-slate-900">{totalTests}</div>
                    <div className="text-xs text-slate-400">Tests Completed</div>
                  </div>
                </div>
                <div className="text-xs text-teal-600 font-medium">Across 3 lab visits</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-mono font-bold text-slate-900">{latestTestsCount}</div>
                    <div className="text-xs text-slate-400">Latest Tests</div>
                  </div>
                </div>
                <div className="text-xs text-emerald-600 font-medium">{latestVisit.visitDate} ✓</div>
                <div className="text-[11px] text-slate-400 mt-1">All reviewed by Dr. Fatima</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-mono font-bold text-amber-600">{abnormalCount}</div>
                    <div className="text-xs text-slate-400">To Monitor</div>
                  </div>
                </div>
                <div className="text-xs text-amber-600 font-medium">HbA1c · Vit D · CRP</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 animate-glow">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-mono font-bold text-blue-600">{upcomingOrder.tests.length}</div>
                    <div className="text-xs text-slate-400">Tests Ordered</div>
                  </div>
                </div>
                <div className="text-xs text-amber-500 font-medium">Due before Apr 15 ⏰</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-mono font-bold text-slate-900">5 Mar</div>
                    <div className="text-xs text-slate-400">Last Lab Visit</div>
                  </div>
                </div>
                <div className="text-xs text-purple-600 font-medium mb-1">Dubai Medical Lab</div>
                <div className="text-[11px] text-slate-400">28 days ago</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm mb-6 animate-slideUp" style={{ animationDelay: '160ms' }}>
              <div className="border-b border-slate-100 px-6">
                <div className="flex gap-8">
                  <button
                    onClick={() => setActiveTab('recent')}
                    className={`py-4 px-2 text-[15px] font-medium transition-all duration-300 relative ${
                      activeTab === 'recent' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    🔬 Recent Results
                    {activeTab === 'recent' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />}
                  </button>

                  <button
                    onClick={() => setActiveTab('trends')}
                    className={`py-4 px-2 text-[15px] font-medium transition-all duration-300 relative ${
                      activeTab === 'trends' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    📈 My Trends
                    {activeTab === 'trends' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />}
                  </button>

                  <button
                    onClick={() => setActiveTab('history')}
                    className={`py-4 px-2 text-[15px] font-medium transition-all duration-300 relative ${
                      activeTab === 'history' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    🗂️ All History
                    {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />}
                  </button>

                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`py-4 px-2 text-[15px] font-medium transition-all duration-300 relative ${
                      activeTab === 'upcoming' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      ⏰ Upcoming
                      <span className="bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        1
                      </span>
                    </span>
                    {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />}
                  </button>

                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`py-4 px-2 text-[15px] font-medium transition-all duration-300 relative ${
                      activeTab === 'reports' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    📋 All Test Reports
                    {activeTab === 'reports' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />}
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'recent' && <RecentResultsTab visit={latestVisit} />}
                {activeTab === 'trends' && <MyTrendsTab visit={latestVisit} />}
                {activeTab === 'history' && <AllHistoryTab visits={[latestVisit]} />}
                {activeTab === 'upcoming' && <UpcomingLabsTab order={upcomingOrder} />}
                {activeTab === 'reports' && <AllReportsTab visits={[latestVisit]} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
