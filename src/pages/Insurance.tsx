import { useState } from 'react';
import { ShieldCheck, Phone, Download, Printer, Share2, FileText, CircleDollarSign, Wallet, Clock, ChevronDown, ChevronUp, Copy, X, Search, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';

type Tab = 'overview' | 'claims' | 'coverage' | 'preauth' | 'policy';
type ClaimStatus = 'approved' | 'pending' | 'rejected' | 'resubmitted';

interface Claim {
  id: string;
  date: string;
  type: string;
  service: string;
  provider: string;
  totalAmount: number;
  damanPaid: number;
  youPaid: number;
  status: ClaimStatus;
  paidDate?: string;
  preAuth?: string;
  icdCode?: string;
  orderingDoctor?: string;
}

const mockClaims: Claim[] = [
  {
    id: 'CLM-DAM-2026-004891',
    date: '7 March 2026',
    type: 'Medications',
    service: 'Monthly prescription refill (Metformin + Atorvastatin + Amlodipine + Vitamin D)',
    provider: 'Al Shifa Pharmacy',
    totalAmount: 280,
    damanPaid: 225,
    youPaid: 55,
    status: 'pending'
  },
  {
    id: 'CLM-DAM-2026-003891',
    date: '5 March 2026',
    type: 'Radiology',
    service: 'Abdominal Ultrasound',
    provider: 'Dubai Medical Laboratory',
    totalAmount: 350,
    damanPaid: 315,
    youPaid: 35,
    status: 'approved',
    paidDate: '12 Mar 2026',
    orderingDoctor: 'Dr. Fatima Al Mansoori'
  },
  {
    id: 'CLM-DAM-2026-003247',
    date: '5 March 2026',
    type: 'Consultation',
    service: 'Endocrinology Consultation (Dr. Fatima)',
    provider: 'Dubai Specialist Clinic',
    totalAmount: 450,
    damanPaid: 405,
    youPaid: 45,
    status: 'approved',
    paidDate: '12 Mar 2026',
    icdCode: 'E11.9'
  },
  {
    id: 'CLM-DAM-2026-003012',
    date: '5 March 2026',
    type: 'Lab Tests',
    service: 'Full Blood Panel (HbA1c + Lipid Panel + CBC + Vit D + CRP + Glucose)',
    provider: 'Dubai Medical Laboratory',
    totalAmount: 740,
    damanPaid: 666,
    youPaid: 74,
    status: 'approved',
    paidDate: '10 Mar 2026'
  },
  {
    id: 'CLM-DAM-2026-002847',
    date: '15 February 2026',
    type: 'Radiology',
    service: 'Cardiac MRI with Gadolinium Enhancement',
    provider: 'Al Noor Medical Center',
    totalAmount: 4500,
    damanPaid: 4050,
    youPaid: 450,
    status: 'approved',
    paidDate: '22 Feb 2026',
    preAuth: 'PA-DAM-2026-00847',
    orderingDoctor: 'Dr. Ahmed Al Rashidi'
  },
  {
    id: 'CLM-DAM-2026-002134',
    date: '10 January 2026',
    type: 'Consultation',
    service: 'Cardiology Consultation (Dr. Ahmed)',
    provider: 'Al Noor Medical Center',
    totalAmount: 400,
    damanPaid: 360,
    youPaid: 40,
    status: 'approved',
    paidDate: '15 Jan 2026'
  },
  {
    id: 'CLM-DAM-2026-001847',
    date: '20 January 2026',
    type: 'Radiology',
    service: 'CT Chest — Cardiac Calcium Scoring',
    provider: 'Al Noor Medical Center',
    totalAmount: 1200,
    damanPaid: 1080,
    youPaid: 120,
    status: 'approved',
    paidDate: '25 Jan 2026',
    orderingDoctor: 'Dr. Ahmed Al Rashidi'
  },
  {
    id: 'CLM-DAM-2026-004102',
    date: '1 February 2026',
    type: 'Consultation',
    service: 'GP Consultation (Dr. Tooraj)',
    provider: 'Gulf Medical Center',
    totalAmount: 300,
    damanPaid: 270,
    youPaid: 30,
    status: 'approved',
    paidDate: '8 Feb 2026'
  }
];

export default function Insurance() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [coverageSearchType, setCoverageSearchType] = useState<string>('');
  const [coverageResult, setCoverageResult] = useState<any>(null);

  const totalBilled = mockClaims.reduce((sum, claim) => sum + claim.totalAmount, 0);
  const totalDamanPaid = mockClaims.reduce((sum, claim) => claim.status === 'approved' ? sum + claim.damanPaid : sum, 0);
  const totalYouPaid = mockClaims.reduce((sum, claim) => claim.status === 'approved' ? sum + claim.youPaid : sum, 0);
  const pendingAmount = mockClaims.filter(c => c.status === 'pending').reduce((sum, claim) => sum + claim.damanPaid, 0);

  const annualLimit = 150000;
  const usedAmount = totalDamanPaid;
  const remainingAmount = annualLimit - usedAmount;
  const usedPercentage = (usedAmount / annualLimit) * 100;

  const handleCheckCoverage = (type: string) => {
    if (type === 'medication') {
      setCoverageResult({
        type: 'medication',
        name: 'Metformin 850mg',
        covered: true,
        coveragePercent: 100,
        yourCost: 0,
        preAuthRequired: false,
        message: 'Great news! Metformin is on Daman\'s essential medications list — no co-pay required.'
      });
    } else if (type === 'mri') {
      setCoverageResult({
        type: 'imaging',
        name: 'Cardiac MRI with Contrast',
        covered: true,
        coveragePercent: 90,
        estimatedCost: 4500,
        yourCost: 450,
        preAuthRequired: true,
        message: 'This procedure requires prior authorization from Daman before it can be performed.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <PatientSidebar currentPage="insurance" />

      <div className="flex-1 ml-64 flex flex-col">
        <PatientTopNav patientName="Ahmed Al Maktoum" />

        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  My Insurance 🛡️
                </h1>
                <p className="text-slate-600">Daman Gold Plan — Active coverage details and claims management</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab('coverage')}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Check Coverage
                </button>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="px-5 py-2.5 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Contact Daman
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6 mb-8">
              <div className="col-span-5">
                <div
                  className="relative rounded-3xl p-7 shadow-2xl transition-all duration-300 hover:shadow-3xl"
                  style={{
                    background: 'linear-gradient(135deg, #1E3A5F 0%, #0D9488 100%)',
                    transform: 'perspective(1000px)',
                    height: '240px'
                  }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-white text-xl font-bold tracking-wider mb-1">DAMAN</div>
                      <div className="text-white/70 text-xs">دمان</div>
                    </div>
                    <div className="px-3 py-1 bg-white rounded-md">
                      <span className="text-xs font-bold text-[#1E3A5F]">GOLD</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="w-10 h-7 bg-gradient-to-br from-amber-300 to-amber-500 rounded mb-3" />
                    <div className="font-mono text-sm text-white/80 tracking-wider mb-2">DAM-2024-IND-047821</div>
                    <div className="font-mono text-xs text-white/60">MEM-PY-20240115</div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-white font-bold text-sm mb-1">PARNIA YAZDKHASTI</div>
                      <div className="font-mono text-xs text-white/50">Member since: 01/2024</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs text-white mb-1">01/2026 – 12/2026</div>
                      <div className="text-xs text-white/60">INDIVIDUAL</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button className="flex-1 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button className="flex-1 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              <div className="col-span-7 bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Your 2026 Coverage
                </h3>
                <p className="text-sm text-slate-500 mb-6">January 1 – December 31, 2026</p>

                <div className="mb-6">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Annual Limit Used</p>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-bold text-teal-600 font-mono">AED {usedAmount.toLocaleString()}</span>
                    <span className="text-2xl text-slate-300 font-mono">/</span>
                    <span className="text-xl text-slate-400 font-mono">AED {annualLimit.toLocaleString()}</span>
                  </div>

                  <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                      className="absolute h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-1000"
                      style={{ width: `${usedPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="font-mono text-teal-600">AED {usedAmount.toLocaleString()} used ({usedPercentage.toFixed(1)}%)</span>
                    <span className="font-mono text-emerald-600 font-bold">AED {remainingAmount.toLocaleString()} remaining</span>
                  </div>

                  <p className="text-sm text-emerald-600 italic">
                    ✅ Excellent — you have AED {remainingAmount.toLocaleString()} remaining for the rest of 2026. Well within your limits.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Your Co-Pay Rates</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-700">GP/Specialist consult</span>
                      <span className="font-mono text-slate-900">90% covered · You pay 10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700">Lab tests</span>
                      <span className="font-mono text-slate-900">90% · 10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700">Imaging (MRI/CT/X-ray)</span>
                      <span className="font-mono text-slate-900">90% · 10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-700">Generic medications</span>
                      <span className="font-mono text-emerald-600">100% · You pay AED 0 ✅</span>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-600 mt-3">All CeenAiX providers are in-network ✓</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 shadow-sm hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 font-mono mb-1">{mockClaims.length}</div>
                <div className="text-sm text-slate-500 mb-2">Claims This Year</div>
                <div className="text-xs text-teal-600">7 approved · 1 pending</div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CircleDollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-emerald-600 font-mono mb-1">AED {totalDamanPaid.toLocaleString()}</div>
                <div className="text-sm text-slate-500 mb-2">Daman Paid (2026)</div>
                <div className="text-xs text-emerald-600">89.7% average coverage</div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono mb-1">AED {totalYouPaid.toLocaleString()}</div>
                <div className="text-sm text-slate-500 mb-2">Your Out-of-Pocket</div>
                <div className="text-xs text-slate-400 line-through">Without insurance: AED {totalBilled.toLocaleString()}</div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center relative">
                    <Clock className="w-6 h-6 text-amber-600" />
                    <div className="absolute inset-0 rounded-full animate-ping bg-amber-500/20" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-amber-600 font-mono mb-1">AED {pendingAmount.toLocaleString()}</div>
                <div className="text-sm text-slate-500 mb-2">Pending Processing</div>
                <div className="text-xs text-amber-600">Expected: Mar 17–21</div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-teal-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-teal-600 font-mono mb-1">AED {remainingAmount.toLocaleString()}</div>
                <div className="text-sm text-slate-500 mb-2">Limit Remaining</div>
                <div className="text-xs text-emerald-600">95.1% of annual limit free</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm mb-6">
              <div className="border-b border-slate-200">
                <div className="flex gap-8 px-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 text-sm font-bold transition-colors relative ${
                      activeTab === 'overview'
                        ? 'text-teal-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🛡️ Overview
                    {activeTab === 'overview' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('claims')}
                    className={`py-4 text-sm font-bold transition-colors relative ${
                      activeTab === 'claims'
                        ? 'text-teal-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📋 Claims ({mockClaims.length})
                    {activeTab === 'claims' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('coverage')}
                    className={`py-4 text-sm font-bold transition-colors relative ${
                      activeTab === 'coverage'
                        ? 'text-teal-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🔍 Coverage Checker
                    {activeTab === 'coverage' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('preauth')}
                    className={`py-4 text-sm font-bold transition-colors relative ${
                      activeTab === 'preauth'
                        ? 'text-teal-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📝 Pre-Authorization (1)
                    {activeTab === 'preauth' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('policy')}
                    className={`py-4 text-sm font-bold transition-colors relative ${
                      activeTab === 'policy'
                        ? 'text-teal-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📄 Policy Details
                    {activeTab === 'policy' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                          Recent Insurance Activity
                        </h3>
                        <button
                          onClick={() => setActiveTab('claims')}
                          className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                        >
                          View All Claims →
                        </button>
                      </div>

                      <div className="space-y-3">
                        {mockClaims.slice(0, 5).map((claim) => (
                          <div
                            key={claim.id}
                            className="bg-white border border-slate-200 rounded-xl p-4 hover:scale-101 transition-transform"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                claim.type === 'Radiology' ? 'bg-indigo-100' :
                                claim.type === 'Consultation' ? 'bg-blue-100' :
                                claim.type === 'Lab Tests' ? 'bg-purple-100' : 'bg-teal-100'
                              }`}>
                                <span className="text-xl">
                                  {claim.type === 'Radiology' ? '🩻' :
                                   claim.type === 'Consultation' ? '🩺' :
                                   claim.type === 'Lab Tests' ? '🔬' : '💊'}
                                </span>
                              </div>

                              <div className="flex-1">
                                <div className="font-bold text-slate-900 text-sm mb-1">{claim.service}</div>
                                <div className="text-xs text-slate-500">{claim.provider} · {claim.date}</div>
                                <div className="text-xs text-slate-300 font-mono">{claim.id}</div>
                              </div>

                              <div className="text-right">
                                <div className="font-mono text-sm font-bold text-slate-700 mb-1">
                                  AED {claim.totalAmount.toLocaleString()}
                                </div>
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                  claim.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                  claim.status === 'pending' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {claim.status === 'approved' && '✅ Approved'}
                                  {claim.status === 'pending' && '⏳ Pending'}
                                  {claim.status === 'rejected' && '❌ Rejected'}
                                </div>
                                <div className="text-xs text-amber-600 font-mono mt-1">
                                  You paid: AED {claim.youPaid}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'claims' && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Claims History 📋
                    </h3>
                    <p className="text-slate-600 mb-6">All insurance claims submitted for your healthcare</p>

                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-bold text-slate-900">{mockClaims.length} claims</span>
                          <span className="text-slate-500 mx-2">·</span>
                          <span className="text-emerald-600">Approved: 7</span>
                          <span className="text-slate-500 mx-2">·</span>
                          <span className="text-amber-600">Pending: 1</span>
                        </div>
                        <div className="font-mono text-slate-700">
                          Total: AED {totalBilled.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {mockClaims.map((claim) => (
                        <div
                          key={claim.id}
                          className={`bg-white rounded-xl shadow-sm border-l-4 transition-all ${
                            claim.status === 'approved' ? 'border-emerald-500' :
                            claim.status === 'pending' ? 'border-amber-500' : 'border-red-500'
                          } ${expandedClaimId === claim.id ? 'shadow-lg' : ''}`}
                        >
                          <div
                            onClick={() => setExpandedClaimId(expandedClaimId === claim.id ? null : claim.id)}
                            className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                claim.type === 'Radiology' ? 'bg-indigo-100' :
                                claim.type === 'Consultation' ? 'bg-blue-100' :
                                claim.type === 'Lab Tests' ? 'bg-purple-100' : 'bg-teal-100'
                              }`}>
                                <span className="text-xl">
                                  {claim.type === 'Radiology' ? '🩻' :
                                   claim.type === 'Consultation' ? '🩺' :
                                   claim.type === 'Lab Tests' ? '🔬' : '💊'}
                                </span>
                              </div>

                              <div className="flex-1">
                                <div className="font-bold text-slate-900 mb-1">{claim.service}</div>
                                <div className="text-sm text-slate-500">{claim.provider} · {claim.date}</div>
                                <div className="text-xs text-slate-300 font-mono flex items-center gap-2">
                                  {claim.id}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(claim.id);
                                    }}
                                    className="text-slate-400 hover:text-slate-600"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                                  claim.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                  claim.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {claim.status === 'approved' && '✅ Approved'}
                                  {claim.status === 'pending' && '⏳ Pending'}
                                  {claim.status === 'rejected' && '❌ Rejected'}
                                </div>
                                <div className="font-mono text-lg font-bold text-slate-700">
                                  AED {claim.totalAmount.toLocaleString()}
                                </div>
                                <div className="font-mono text-sm text-emerald-600">
                                  Daman: AED {claim.damanPaid.toLocaleString()}
                                </div>
                                <div className="font-mono text-sm text-amber-600">
                                  You: AED {claim.youPaid}
                                </div>
                              </div>

                              <div className="text-slate-400">
                                {expandedClaimId === claim.id ? (
                                  <ChevronUp className="w-5 h-5" />
                                ) : (
                                  <ChevronDown className="w-5 h-5" />
                                )}
                              </div>
                            </div>
                          </div>

                          {expandedClaimId === claim.id && (
                            <div className="border-t border-slate-100 p-6 bg-slate-50">
                              <div className="grid grid-cols-3 gap-6">
                                <div>
                                  <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Claim Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-slate-600">Claim ID:</span>
                                      <div className="font-mono text-slate-900">{claim.id}</div>
                                    </div>
                                    <div>
                                      <span className="text-slate-600">Service Date:</span>
                                      <div className="text-slate-900">{claim.date}</div>
                                    </div>
                                    <div>
                                      <span className="text-slate-600">Service Type:</span>
                                      <div className="text-slate-900">{claim.type}</div>
                                    </div>
                                    {claim.orderingDoctor && (
                                      <div>
                                        <span className="text-slate-600">Ordering Doctor:</span>
                                        <div className="text-slate-900">{claim.orderingDoctor}</div>
                                      </div>
                                    )}
                                    {claim.preAuth && (
                                      <div>
                                        <span className="text-slate-600">Pre-Authorization:</span>
                                        <div className="text-emerald-600 font-mono">{claim.preAuth} ✓</div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Financial Summary</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-slate-600">Total Billed:</span>
                                      <span className="font-mono text-slate-900">AED {claim.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t border-slate-200 my-2" />
                                    <div className="flex justify-between">
                                      <span className="text-emerald-600">Daman covers (90%):</span>
                                      <span className="font-mono text-emerald-600">AED {claim.damanPaid.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-amber-600">Your co-pay (10%):</span>
                                      <span className="font-mono text-amber-600">AED {claim.youPaid}</span>
                                    </div>
                                    {claim.paidDate && (
                                      <div className="mt-3 pt-3 border-t border-slate-200">
                                        <div className="text-emerald-600 text-xs">
                                          ✅ Payment sent: {claim.paidDate}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Actions</h4>
                                  <div className="space-y-2">
                                    <button className="w-full px-4 py-2 border border-teal-600 text-teal-600 hover:bg-teal-50 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                      <FileText className="w-4 h-4" />
                                      Download EOB
                                    </button>
                                    <button className="w-full px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                      <Share2 className="w-4 h-4" />
                                      Share EOB
                                    </button>
                                  </div>

                                  {claim.status === 'approved' && (
                                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                      <p className="text-xs text-emerald-700">
                                        ✅ This claim was approved and processed. Daman paid AED {claim.damanPaid.toLocaleString()} to {claim.provider}.
                                      </p>
                                    </div>
                                  )}

                                  {claim.status === 'pending' && (
                                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                      <p className="text-xs text-amber-700 mb-2">
                                        ⏳ This claim is currently being processed. Expected completion: March 17–21, 2026.
                                      </p>
                                      <button className="text-xs text-amber-700 hover:text-amber-800 font-medium">
                                        📞 Call Daman to Follow Up
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'coverage' && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Coverage Checker 🔍
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Check if a service, medication, or procedure is covered by your Daman Gold plan before your visit
                    </p>

                    <div className="bg-teal-50 border-l-4 border-teal-500 rounded-lg p-4 mb-6">
                      <p className="text-sm text-teal-800">
                        Use this tool to check your coverage before any healthcare visit — avoid surprise bills by knowing exactly what Daman covers and what you'll pay.
                      </p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                      <h4 className="font-bold text-slate-900 mb-4">What would you like to check?</h4>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                          onClick={() => setCoverageSearchType('medication')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            coverageSearchType === 'medication'
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">💊</div>
                          <div className="font-bold text-slate-900">Medication</div>
                          <div className="text-xs text-slate-500">Check if a drug is covered</div>
                        </button>

                        <button
                          onClick={() => setCoverageSearchType('consultation')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            coverageSearchType === 'consultation'
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">🩺</div>
                          <div className="font-bold text-slate-900">Consultation</div>
                          <div className="text-xs text-slate-500">Doctor visit coverage</div>
                        </button>

                        <button
                          onClick={() => setCoverageSearchType('lab')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            coverageSearchType === 'lab'
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">🔬</div>
                          <div className="font-bold text-slate-900">Lab / Diagnostic Test</div>
                          <div className="text-xs text-slate-500">Lab test coverage</div>
                        </button>

                        <button
                          onClick={() => setCoverageSearchType('imaging')}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            coverageSearchType === 'imaging'
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">🩻</div>
                          <div className="font-bold text-slate-900">Imaging / Procedure</div>
                          <div className="text-xs text-slate-500">Scan or procedure</div>
                        </button>
                      </div>

                      {coverageSearchType && (
                        <div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              {coverageSearchType === 'medication' && 'Search medication name'}
                              {coverageSearchType === 'consultation' && 'Select specialty'}
                              {coverageSearchType === 'lab' && 'Search test name'}
                              {coverageSearchType === 'imaging' && 'Search procedure'}
                            </label>
                            <div className="relative">
                              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                              <input
                                type="text"
                                placeholder="Start typing..."
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => handleCheckCoverage(coverageSearchType === 'imaging' ? 'mri' : coverageSearchType)}
                            className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold transition-colors"
                          >
                            Check Coverage
                          </button>
                        </div>
                      )}
                    </div>

                    {coverageResult && (
                      <div className={`rounded-xl border-l-4 p-6 ${
                        coverageResult.covered
                          ? coverageResult.preAuthRequired
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-emerald-500 bg-emerald-50'
                          : 'border-red-500 bg-red-50'
                      }`}>
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {coverageResult.covered ? (
                              coverageResult.preAuthRequired ? (
                                <AlertTriangle className="w-8 h-8 text-orange-600" />
                              ) : (
                                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                              )
                            ) : (
                              <XCircle className="w-8 h-8 text-red-600" />
                            )}
                          </div>

                          <div className="flex-1">
                            <h4 className={`text-lg font-bold mb-2 ${
                              coverageResult.covered
                                ? coverageResult.preAuthRequired
                                  ? 'text-orange-900'
                                  : 'text-emerald-900'
                                : 'text-red-900'
                            }`}>
                              {coverageResult.covered
                                ? coverageResult.preAuthRequired
                                  ? '⚠️ COVERED — PRE-AUTHORIZATION REQUIRED'
                                  : '✅ COVERED'
                                : '❌ NOT COVERED'}
                            </h4>

                            <div className="text-sm font-bold text-slate-900 mb-3">{coverageResult.name}</div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <div className="text-xs text-slate-600 mb-1">Coverage</div>
                                <div className="font-mono text-lg font-bold text-slate-900">
                                  {coverageResult.coveragePercent}%
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-600 mb-1">Your Cost</div>
                                <div className={`font-mono text-lg font-bold ${
                                  coverageResult.yourCost === 0 ? 'text-emerald-600' : 'text-amber-600'
                                }`}>
                                  AED {coverageResult.yourCost}
                                  {coverageResult.yourCost === 0 && ' ✅'}
                                </div>
                              </div>
                            </div>

                            <p className={`text-sm ${
                              coverageResult.covered
                                ? coverageResult.preAuthRequired
                                  ? 'text-orange-800'
                                  : 'text-emerald-800'
                                : 'text-red-800'
                            }`}>
                              {coverageResult.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-white rounded-xl border border-slate-200 p-6 mt-6">
                      <h4 className="font-bold text-slate-900 mb-4">Quick Coverage Guide</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="text-left py-2 text-slate-600 font-medium">Service</th>
                              <th className="text-left py-2 text-slate-600 font-medium">Covered</th>
                              <th className="text-left py-2 text-slate-600 font-medium">Your Cost</th>
                              <th className="text-left py-2 text-slate-600 font-medium">Pre-auth?</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr className="hover:bg-slate-50">
                              <td className="py-3">GP Visit (in-network)</td>
                              <td className="py-3 text-emerald-600">90%</td>
                              <td className="py-3 font-mono">~AED 30</td>
                              <td className="py-3 text-slate-500">No</td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                              <td className="py-3">Specialist Visit</td>
                              <td className="py-3 text-emerald-600">90%</td>
                              <td className="py-3 font-mono">~AED 40–50</td>
                              <td className="py-3 text-slate-500">No</td>
                            </tr>
                            <tr className="hover:bg-slate-50 bg-emerald-50">
                              <td className="py-3">Generic Medications</td>
                              <td className="py-3 text-emerald-600 font-bold">100%</td>
                              <td className="py-3 font-mono text-emerald-600 font-bold">AED 0 ✅</td>
                              <td className="py-3 text-slate-500">No</td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                              <td className="py-3">Lab Tests</td>
                              <td className="py-3 text-emerald-600">90%</td>
                              <td className="py-3 font-mono">10%</td>
                              <td className="py-3 text-slate-500">No</td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                              <td className="py-3">MRI</td>
                              <td className="py-3 text-emerald-600">90%</td>
                              <td className="py-3 font-mono">10%</td>
                              <td className="py-3 text-orange-600">Often Yes</td>
                            </tr>
                            <tr className="hover:bg-slate-50 bg-red-50">
                              <td className="py-3">Dental</td>
                              <td className="py-3 text-red-600">❌</td>
                              <td className="py-3 text-slate-500">Not covered</td>
                              <td className="py-3 text-slate-500">N/A</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preauth' && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Pre-Authorizations 📝
                    </h3>
                    <p className="text-slate-600 mb-6">Daman pre-approval requests for major procedures</p>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                      <h4 className="font-bold text-blue-900 mb-2">What is Pre-Authorization? 💡</h4>
                      <p className="text-sm text-blue-800">
                        For certain medical procedures above a cost threshold, Daman requires advance approval before the treatment. Your doctor handles this on your behalf — you don't need to contact Daman yourself.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-emerald-600 mb-1">1</div>
                        <div className="text-sm text-emerald-700">Approved</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-slate-600 mb-1">0</div>
                        <div className="text-sm text-slate-700">Pending</div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">1</div>
                        <div className="text-sm text-blue-700">Upcoming</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white rounded-xl border-l-4 border-emerald-500 shadow-sm p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-slate-900 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                              Cardiac MRI with Gadolinium Enhancement
                            </h4>
                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                              ✅ Approved & Used
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-500 mb-1">PA Number</div>
                            <div className="font-mono text-sm text-slate-900">PA-DAM-2026-00847</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <div className="space-y-3 text-sm">
                              <div>
                                <div className="text-slate-600">Requested by:</div>
                                <div className="text-slate-900 font-medium">Dr. Ahmed Al Rashidi</div>
                              </div>
                              <div>
                                <div className="text-slate-600">Date requested:</div>
                                <div className="text-slate-900">10 February 2026</div>
                              </div>
                              <div>
                                <div className="text-slate-600">Date approved:</div>
                                <div className="text-emerald-600 font-bold">12 February 2026 (2 days ✓)</div>
                              </div>
                              <div>
                                <div className="text-slate-600">Procedure performed:</div>
                                <div className="text-slate-900">15 February 2026</div>
                              </div>
                            </div>

                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <div className="text-xs text-blue-800 italic">
                                "Hypertensive patient, CAC score 42 on prior CT. Comprehensive cardiac MRI to assess myocardial function and tissue characterization."
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="space-y-2 text-sm mb-4">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span className="text-slate-600">Dr. Ahmed submitted</span>
                                <span className="text-slate-400 text-xs">(Feb 10)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span className="text-slate-600">Daman received</span>
                                <span className="text-slate-400 text-xs">(Feb 10)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span className="text-slate-600">Medical review</span>
                                <span className="text-slate-400 text-xs">(Feb 11)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span className="text-emerald-600 font-bold">Approved</span>
                                <span className="text-slate-400 text-xs">(Feb 12)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span className="text-slate-600">Procedure performed</span>
                                <span className="text-slate-400 text-xs">(Feb 15)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span className="text-slate-600">Claim processed</span>
                                <span className="text-slate-400 text-xs">(Feb 22)</span>
                              </div>
                            </div>

                            <button className="w-full px-4 py-2 border border-teal-600 text-teal-600 hover:bg-teal-50 rounded-lg text-sm font-medium transition-colors">
                              📄 Download Approval Letter
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border-l-4 border-blue-500 shadow-sm p-6">
                        <h4 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                          CT Chest — Lung Nodule Follow-Up
                        </h4>
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                          📅 Expected 2027 — Doctor will arrange
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800 mb-3">
                            Your cardiac MRI (Feb 2026) detected tiny lung spots (3.8 mm). Dr. Ahmed recommends a follow-up CT chest in February 2027 to confirm they haven't changed.
                          </p>
                          <p className="text-sm text-blue-800">
                            Pre-authorization will likely be required for this CT. Dr. Ahmed will submit the request when the time comes. <strong>No action needed from you now.</strong>
                          </p>
                          <div className="mt-3 pt-3 border-t border-blue-200">
                            <button className="text-sm text-blue-700 hover:text-blue-800 font-medium">
                              📅 Reminder set for: January 2027
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'policy' && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Policy Details 📄
                    </h3>
                    <p className="text-slate-600 mb-6">Your complete Daman Gold policy information</p>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div className="bg-white rounded-xl border-l-4 border-blue-500 shadow-sm p-6">
                          <h4 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Daman Gold — Individual Plan
                          </h4>

                          <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                              <div>
                                <div className="text-slate-600 text-xs">Policy Number</div>
                                <div className="font-mono text-slate-900">DAM-2024-IND-047821</div>
                              </div>
                              <div>
                                <div className="text-slate-600 text-xs">Member ID</div>
                                <div className="font-mono text-slate-900">MEM-PY-20240115</div>
                              </div>
                              <div>
                                <div className="text-slate-600 text-xs">Plan Type</div>
                                <div className="text-slate-900">Gold (Individual)</div>
                              </div>
                              <div>
                                <div className="text-slate-600 text-xs">Issued</div>
                                <div className="text-slate-900">1 January 2024</div>
                              </div>
                              <div>
                                <div className="text-slate-600 text-xs">Current Period</div>
                                <div className="text-slate-900">1 Jan – 31 Dec 2026</div>
                              </div>
                              <div>
                                <div className="text-slate-600 text-xs">Annual Premium</div>
                                <div className="font-mono text-slate-900 font-bold">AED 8,400</div>
                              </div>
                            </div>

                            <div className="border-t border-slate-200 my-4" />

                            <div>
                              <h5 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Provider Info</h5>
                              <div className="space-y-2">
                                <div>
                                  <div className="text-slate-600 text-xs">Insurance Provider</div>
                                  <div className="text-slate-900 font-bold">Daman - National Health Insurance Company</div>
                                </div>
                                <div>
                                  <div className="text-slate-600 text-xs">Customer Service</div>
                                  <div className="font-mono text-blue-600">800-DAMAN (800-32626)</div>
                                </div>
                                <div>
                                  <div className="text-slate-600 text-xs">Website</div>
                                  <div className="text-blue-600">www.daman.ae</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                          <h4 className="font-bold text-slate-900 mb-4">Coverage Limits & Caps</h4>

                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-slate-200">
                                  <th className="text-left py-2 text-slate-600 font-medium">Category</th>
                                  <th className="text-right py-2 text-slate-600 font-medium">Annual Limit</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50">
                                  <td className="py-3">Total Annual Limit</td>
                                  <td className="py-3 text-right font-mono font-bold">AED 150,000</td>
                                </tr>
                                <tr className="hover:bg-slate-50">
                                  <td className="py-3">Inpatient Room & Board</td>
                                  <td className="py-3 text-right font-mono">AED 800/day (90 days max)</td>
                                </tr>
                                <tr className="hover:bg-slate-50">
                                  <td className="py-3">ICU</td>
                                  <td className="py-3 text-right font-mono">AED 1,200/day (30 days max)</td>
                                </tr>
                                <tr className="hover:bg-slate-50">
                                  <td className="py-3">Emergency (worldwide)</td>
                                  <td className="py-3 text-right font-mono">AED 30,000/event</td>
                                </tr>
                                <tr className="hover:bg-slate-50 bg-amber-50">
                                  <td className="py-3">Mental Health</td>
                                  <td className="py-3 text-right font-mono">AED 10,000/yr (20 sessions)</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                          <h4 className="font-bold text-slate-900 mb-4">Your Policy Documents</h4>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-slate-600" />
                                <div>
                                  <div className="text-sm font-medium text-slate-900">Insurance Certificate 2026</div>
                                  <div className="text-xs text-slate-500">PDF · 1 page</div>
                                </div>
                              </div>
                              <Download className="w-4 h-4 text-slate-400" />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-slate-600" />
                                <div>
                                  <div className="text-sm font-medium text-slate-900">Policy Schedule 2026</div>
                                  <div className="text-xs text-slate-500">PDF · 4 pages</div>
                                </div>
                              </div>
                              <Download className="w-4 h-4 text-slate-400" />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-slate-600" />
                                <div>
                                  <div className="text-sm font-medium text-slate-900">Member Handbook</div>
                                  <div className="text-xs text-slate-500">PDF · 28 pages</div>
                                </div>
                              </div>
                              <Download className="w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6">
                          <h4 className="font-bold text-red-900 mb-3">⚠️ Not Covered by Your Plan</h4>
                          <div className="space-y-2 text-sm text-red-800">
                            <div>❌ Dental treatment (all types)</div>
                            <div>❌ Cosmetic / aesthetic procedures</div>
                            <div>❌ Weight loss treatments</div>
                            <div>❌ Fertility treatments / IVF</div>
                            <div>❌ Experimental treatments</div>
                            <div>❌ Sports injuries (competitive professional sports)</div>
                          </div>
                          <p className="text-xs text-red-600 mt-3">
                            For full exclusions list, see Policy Schedule PDF
                          </p>
                        </div>

                        <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
                          <h4 className="font-bold text-teal-900 mb-3">Policy Renewal 🔄</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-teal-700">Renewal date:</span>
                              <span className="font-bold text-teal-900">December 31, 2026</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-teal-700">Days remaining:</span>
                              <span className="font-mono text-teal-900">269 days</span>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-teal-200">
                            <p className="text-xs text-teal-800 mb-3">
                              Your policy auto-renews unless cancelled
                            </p>
                            <button className="text-sm text-teal-700 hover:text-teal-800 font-medium">
                              Set Renewal Reminder (90 days before)
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showContactModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowContactModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Contact Daman Insurance 📞</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-mono text-xl font-bold text-blue-700 mb-1">800-DAMAN (800-32626)</div>
                    <div className="text-xs text-blue-600">Free call · Sun–Thu 8AM–8PM · Fri 8AM–12PM</div>
                  </div>
                </div>
                <button className="w-full mt-3 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors">
                  📞 Call Now
                </button>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">💬</div>
                  <div className="flex-1">
                    <div className="font-mono text-lg font-bold text-emerald-700">+971 2 614 8888</div>
                    <div className="text-xs text-emerald-600">WhatsApp chat · Sun–Thu 9AM–6PM</div>
                  </div>
                </div>
                <button className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors">
                  💬 Open WhatsApp
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-sm text-slate-700 mb-2">Your policy # for any call:</div>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-sm text-slate-900 flex-1">DAM-2024-IND-047821</div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
