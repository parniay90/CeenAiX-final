import { useState, useEffect, useRef } from 'react';
import {
  Shield, Download, Phone, FileText, Check, ChevronDown, ChevronRight,
  X, Copy, MessageSquare, AlertCircle, Activity, FlaskConical, Eye,
  Stethoscope, Pill, Heart, Video, Search, Filter, Clock, CheckCircle,
  AlertTriangle, Calendar
} from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientTopNav from '../components/patient/PatientTopNav';
import { ToastContainer, useToast } from '../components/common/Toast';

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

type Tab = 'claims' | 'preauth' | 'benefits' | 'documents';

const CLAIMS = [
  {
    id: 'CLM-20260407-00481',
    date: '7 Apr 2026',
    dateSort: '2026-04-07',
    provider: 'Al Noor Medical Center',
    doctor: 'Dr. Ahmed Al Rashidi',
    service: 'Cardiology Consultation',
    serviceType: 'Consultation',
    icd: 'I10',
    cpt: '99213',
    total: 400,
    copay: 40,
    insured: 360,
    status: 'approved',
    processed: 'Today 11:15 AM',
    turnaround: '76 minutes',
    facility: 'DHA-FAC-2015-012847',
  },
  {
    id: 'CLM-20260314-00412',
    date: '14 Mar 2026',
    dateSort: '2026-03-14',
    provider: 'Dubai Medical Laboratory',
    doctor: 'Dr. Ahmed Al Rashidi (ordered)',
    service: 'Full Blood Panel',
    serviceType: 'Laboratory',
    icd: 'Z00.00',
    cpt: '80053',
    total: 480,
    copay: 48,
    insured: 432,
    status: 'approved',
    processed: '14 Mar 2026',
    turnaround: '2.1 hours',
    facility: 'DHA-LAB-2018-004521',
  },
  {
    id: 'CLM-20260306-00389',
    date: '6 Mar 2026',
    dateSort: '2026-03-06',
    provider: 'Dubai Specialist Hospital',
    doctor: 'Dr. Fatima Al Mansoori',
    service: 'Endocrinology Consultation',
    serviceType: 'Consultation',
    icd: 'E11.9',
    cpt: '99213',
    total: 400,
    copay: 40,
    insured: 360,
    status: 'approved',
    processed: '6 Mar 2026',
    turnaround: '3.4 hours',
    facility: 'DHA-FAC-2012-008341',
  },
  {
    id: 'CLM-20260215-00294',
    date: '15 Feb 2026',
    dateSort: '2026-02-15',
    provider: 'Dubai Medical & Imaging Centre',
    doctor: 'Dr. Ahmed Al Rashidi',
    service: 'Cardiac MRI with LGE',
    serviceType: 'Radiology',
    icd: 'I25.10',
    cpt: '75561',
    total: 2500,
    copay: 250,
    insured: 2250,
    status: 'approved',
    processed: '15 Feb 2026',
    turnaround: '1.2 hours',
    facility: 'DHA-IMG-2016-006201',
  },
  {
    id: 'CLM-20260108-00087',
    date: '8 Jan 2026',
    dateSort: '2026-01-08',
    provider: 'Dubai Medical & Imaging Centre',
    doctor: 'Dr. Ahmed Al Rashidi',
    service: 'CT Chest (CAC Scoring)',
    serviceType: 'Radiology',
    icd: 'I25.10',
    cpt: '75571',
    total: 800,
    copay: 80,
    insured: 720,
    status: 'approved',
    processed: '8 Jan 2026',
    turnaround: '2.8 hours',
    facility: 'DHA-IMG-2016-006201',
  },
];

const BENEFITS = [
  { icon: Stethoscope, color: 'text-teal-600', bg: 'bg-teal-100', name: 'Specialist Consultations', pct: '90%', copay: '10% co-pay', notes: 'Cardiology ✅ · Endocrinology ✅ · All DHA-licensed specialists' },
  { icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100', name: 'Radiology & Imaging', pct: '90%', copay: '10% co-pay', notes: 'MRI ✅ · CT ✅ · X-Ray ✅ · Ultrasound ✅ · Pre-auth required for MRI/CT' },
  { icon: FlaskConical, color: 'text-indigo-600', bg: 'bg-indigo-100', name: 'Laboratory Tests', pct: '90%', copay: '10% co-pay', notes: 'Full blood panels · HbA1c · Lipid profile ✅ · No pre-auth required' },
  { icon: Pill, color: 'text-violet-600', bg: 'bg-violet-100', name: 'Pharmacy (Generic)', pct: '80%', copay: '20% co-pay', notes: 'Generic drugs preferred ✅ · Formulary drugs only' },
  { icon: Pill, color: 'text-violet-500', bg: 'bg-violet-50', name: 'Pharmacy (Brand)', pct: '70%', copay: '30% co-pay', notes: 'With formulary approval · Brand substitution recommended' },
  { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100', name: 'Emergency Care', pct: '100%', copay: 'No co-pay', notes: 'Any UAE licensed facility · 24/7 · All emergency services covered' },
  { icon: Video, color: 'text-teal-600', bg: 'bg-teal-100', name: 'Teleconsultation', pct: '90%', copay: '10% co-pay', notes: 'Via CeenAiX platform ✅ · AED 300 per video consultation' },
  { icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-100', name: 'Preventive Care', pct: '100%', copay: 'No co-pay', notes: 'Annual checkup · Vaccinations ✅ · Cancer screening · Mammography' },
  { icon: Shield, color: 'text-slate-600', bg: 'bg-slate-100', name: 'Dental', pct: '20%', copay: '80% co-pay', notes: 'Emergency dental only · Cosmetic: Not covered ❌' },
  { icon: Eye, color: 'text-slate-500', bg: 'bg-slate-100', name: 'Optical', pct: 'N/A', copay: 'Not covered', notes: 'Available as add-on · Contact insurance for optical upgrade' },
  { icon: Activity, color: 'text-violet-600', bg: 'bg-violet-100', name: 'Mental Health', pct: '80%', copay: '20% co-pay', notes: 'Licensed psychiatrists/psychologists ✅ · 5 sessions/year included' },
  { icon: Activity, color: 'text-amber-600', bg: 'bg-amber-100', name: 'Physiotherapy', pct: '80%', copay: '20% co-pay', notes: 'With medical referral ✅ · 10 sessions/year' },
];

const DOCUMENTS = [
  { name: 'Insurance Policy Document', desc: 'Daman Gold — Full Policy 2026', date: '1 Jan 2026', size: '2.4 MB', type: 'pdf' },
  { name: 'Insurance Card', desc: 'Digital Insurance Card · Parnia Yazdkhasti', date: 'Today', size: '140 KB', type: 'pdf' },
  { name: 'EOB — Apr 7, 2026', desc: 'CLM-20260407-00481 · Cardiology Consultation', date: '7 Apr 2026', size: '84 KB', type: 'pdf' },
  { name: 'EOB — Feb 15, 2026', desc: 'CLM-20260215-00294 · Cardiac MRI', date: '15 Feb 2026', size: '92 KB', type: 'pdf' },
  { name: 'Annual Summary 2025', desc: 'Daman Gold · Full year claims history', date: '31 Dec 2025', size: '1.1 MB', type: 'pdf' },
  { name: 'Pre-Auth Approval — Cardiac MRI', desc: 'PA-20260215-00294 · Approved 14 Feb 2026', date: '14 Feb 2026', size: '56 KB', type: 'pdf' },
];

function CoverageRing({ pct }: { pct: number }) {
  const [fill, setFill] = useState(0);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const t = setTimeout(() => setFill(pct), 400);
    return () => clearTimeout(t);
  }, [pct]);

  const offset = circumference - (fill / 100) * circumference;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="rotate-[-90deg]">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="10" />
      <circle
        cx="60" cy="60" r={radius} fill="none"
        stroke="#0D9488" strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
}

export default function PatientInsurance() {
  const [tab, setTab] = useState<Tab>('claims');
  const [selectedClaim, setSelectedClaim] = useState<typeof CLAIMS[0] | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [showExclusions, setShowExclusions] = useState(false);
  const [showPreAuthHistory, setShowPreAuthHistory] = useState(false);
  const [benefitSearch, setBenefitSearch] = useState('');
  const { toasts, dismiss, addToast } = useToast();

  const totalUsed = 12400;
  const totalLimit = 500000;
  const usedPct = (totalUsed / totalLimit) * 100;

  const filteredClaims = CLAIMS.filter(c => {
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || c.provider.toLowerCase().includes(q) || c.doctor.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.service.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const filteredBenefits = BENEFITS.filter(b =>
    !benefitSearch || b.name.toLowerCase().includes(benefitSearch.toLowerCase()) || b.notes.toLowerCase().includes(benefitSearch.toLowerCase())
  );

  const tabs: { id: Tab; label: string; badge?: string }[] = [
    { id: 'claims', label: 'Claims', badge: '5' },
    { id: 'preauth', label: 'Pre-Authorizations' },
    { id: 'benefits', label: 'Covered Benefits' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#F8FAFC' }}>
      <PatientTopNav patientName="Parnia Yazdkhasti" />
      <div className="flex flex-1 overflow-hidden">
        <PatientSidebar currentPage="insurance" />

        <main className="flex-1 overflow-y-auto">
          {/* PAGE HEADER */}
          <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                <Shield size={18} className="text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 22 }}>My Insurance</div>
                <div className="text-xs text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>Coverage · Claims · Benefits</div>
              </div>
            </div>
            <button
              onClick={() => addToast('success', 'Insurance card downloaded')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors"
            >
              <Download size={15} /> Download Insurance Card
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium transition-colors">
              <Phone size={15} /> Contact Daman
            </button>
          </div>

          <div className="p-8 space-y-5">

            {/* INSURANCE CARD HERO */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex flex-col items-center">
                {/* Virtual Card */}
                <div
                  className="w-full max-w-lg rounded-2xl p-6 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #1E3A5F 0%, #1D4ED8 100%)',
                    boxShadow: '0 20px 60px rgba(30,58,95,0.35)',
                    minHeight: 200,
                  }}
                >
                  {/* Decorative circles */}
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />

                  <div className="flex items-start justify-between mb-5">
                    <span className="font-bold text-white" style={{ fontSize: 14 }}>Daman National Health Insurance</span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-emerald-300 font-bold" style={{ fontSize: 10, background: 'rgba(52,211,153,0.2)' }}>✅ Active</span>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm">D</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="font-bold text-white uppercase tracking-widest mb-1" style={{ fontFamily: 'DM Mono, monospace', fontSize: 16, letterSpacing: '0.12em' }}>PARNIA YAZDKHASTI</div>
                    <div className="text-white/70" style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}>Member: DAM-IND-PT001-2024</div>
                  </div>

                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-bold text-amber-300" style={{ fontSize: 16 }}>Daman Gold</span>
                    <span className="text-white/60 text-sm">Individual Plan</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-white/40 text-xs mb-0.5" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9 }}>POLICY NUMBER</div>
                      <div className="text-white/60" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>DAM-2024-IND-047821</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/40 text-xs mb-0.5" style={{ fontFamily: 'DM Mono, monospace', fontSize: 9 }}>VALID THROUGH</div>
                      <div className="text-white/50" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>01/01/2026 – 31/12/2026</div>
                    </div>
                  </div>
                </div>

                {/* Info pills under card */}
                <div className="flex flex-wrap gap-3 mt-5 justify-center">
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-bold text-xs">Co-pay: 10%</span>
                  <span className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs">🇦🇪 UAE Coverage</span>
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs">Valid 12 months</span>
                </div>
              </div>
            </div>

            {/* COVERAGE USAGE CARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* COL 1: Annual Usage Ring */}
                <div className="flex flex-col items-center">
                  <div className="font-bold text-slate-800 mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>Annual Benefit Usage</div>
                  <div className="text-xs text-slate-400 mb-4">2026 · Daman Gold</div>
                  <div className="relative flex items-center justify-center">
                    <CoverageRing pct={usedPct} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="font-bold text-teal-600" style={{ fontFamily: 'DM Mono, monospace', fontSize: 20 }}>2.5%</div>
                      <div className="text-slate-400" style={{ fontSize: 10 }}>used</div>
                    </div>
                  </div>
                  <div className="text-center mt-3 space-y-0.5">
                    <div className="text-slate-600" style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>AED 12,400 used</div>
                    <div className="text-slate-400 text-xs">of AED 500,000 limit</div>
                    <div className="font-bold text-emerald-600" style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>AED 487,600 remaining</div>
                  </div>
                </div>

                {/* COL 2: Spending by Category */}
                <div>
                  <div className="font-bold text-slate-800 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>Spending by Category</div>
                  <div className="space-y-3">
                    {[
                      { label: 'Consultations', amount: 4400, pct: 35.5, color: 'bg-teal-500' },
                      { label: 'Radiology / Imaging', amount: 3250, pct: 26.2, color: 'bg-blue-500' },
                      { label: 'Pharmacy', amount: 2830, pct: 22.8, color: 'bg-violet-500' },
                      { label: 'Lab Tests', amount: 1920, pct: 15.5, color: 'bg-indigo-500' },
                    ].map(cat => (
                      <div key={cat.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-600">{cat.label}</span>
                          <span className="text-xs font-semibold text-slate-700" style={{ fontFamily: 'DM Mono, monospace' }}>AED {cat.amount.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                        </div>
                        <div className="text-right mt-0.5 text-slate-400" style={{ fontSize: 10 }}>{cat.pct}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COL 3: Quick Stats */}
                <div>
                  <div className="font-bold text-slate-800 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14 }}>This Year</div>
                  <div className="space-y-2">
                    {[
                      { label: 'Claims processed', val: '5', note: 'All approved ✅' },
                      { label: 'Avg processing time', val: '2.8 hrs', note: 'Fast ✅' },
                      { label: 'Total consultations', val: '5 visits', note: '' },
                      { label: 'Pharmacies used', val: '1', note: 'Al Shifa Pharmacy' },
                      { label: 'Diagnostic centres', val: '2', note: 'DMIC · DML' },
                    ].map(s => (
                      <div key={s.label} className="flex items-start justify-between py-2 border-b border-slate-50 last:border-0">
                        <span className="text-xs text-slate-500">{s.label}</span>
                        <div className="text-right">
                          <div className="font-bold text-slate-800 text-xs" style={{ fontFamily: 'DM Mono, monospace' }}>{s.val}</div>
                          {s.note && <div className="text-slate-400" style={{ fontSize: 10 }}>{s.note}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* TABS */}
            <div className="flex gap-0 border-b border-slate-200 bg-white rounded-t-xl px-2 pt-2 shadow-sm">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                    tab === t.id
                      ? 'text-blue-600 border-blue-500 font-bold'
                      : 'text-slate-500 border-transparent hover:text-slate-700'
                  }`}
                >
                  {t.label}
                  {t.badge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${tab === t.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div className="transition-opacity duration-150">
              {tab === 'claims' && (
                <ClaimsTab
                  claims={filteredClaims}
                  search={search}
                  setSearch={setSearch}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  onSelectClaim={setSelectedClaim}
                  addToast={addToast}
                />
              )}
              {tab === 'preauth' && (
                <PreAuthTab
                  showHistory={showPreAuthHistory}
                  setShowHistory={setShowPreAuthHistory}
                />
              )}
              {tab === 'benefits' && (
                <BenefitsTab
                  benefits={filteredBenefits}
                  search={benefitSearch}
                  setSearch={setBenefitSearch}
                  showExclusions={showExclusions}
                  setShowExclusions={setShowExclusions}
                />
              )}
              {tab === 'documents' && (
                <DocumentsTab addToast={addToast} />
              )}
            </div>

            {/* CONTACT STRIP */}
            <div className="rounded-2xl border border-slate-100 p-5" style={{ background: '#F8FAFC' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    icon: Phone, color: 'text-blue-600', bg: 'bg-blue-100',
                    title: 'Daman Helpline',
                    number: '800-DAMAN (32626)',
                    hours: 'Sun–Thu 8AM–8PM · Fri 9AM–1PM',
                    btnLabel: 'Call Now',
                    btnClass: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
                  },
                  {
                    icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100',
                    title: '24/7 Emergency Line',
                    number: '800-DAMAN (24/7)',
                    hours: 'Emergency claims always approved',
                    btnLabel: 'Call Emergency',
                    btnClass: 'bg-red-100 hover:bg-red-200 text-red-600',
                  },
                  {
                    icon: MessageSquare, color: 'text-teal-600', bg: 'bg-teal-100',
                    title: 'CeenAiX Insurance Help',
                    number: 'Chat with us',
                    hours: 'Avg 3 min response · Pre-auth & claims',
                    btnLabel: 'Chat with Us',
                    btnClass: 'bg-teal-600 hover:bg-teal-700 text-white',
                  },
                ].map(card => {
                  const Icon = card.icon;
                  return (
                    <div key={card.title} className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                          <Icon size={18} className={card.color} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 text-sm">{card.title}</div>
                          <div className="font-bold text-slate-700" style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>{card.number}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">{card.hours}</div>
                      <button
                        onClick={() => card.btnLabel === 'Chat with Us' && navigate('/messaging')}
                        className={`py-2 rounded-xl text-sm font-medium transition-colors ${card.btnClass}`}
                      >
                        {card.btnLabel}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* CLAIM DETAIL MODAL */}
      {selectedClaim && (
        <ClaimDetailModal
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
          addToast={addToast}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

/* ─── CLAIMS TAB ─── */
function ClaimsTab({
  claims, search, setSearch, statusFilter, setStatusFilter, onSelectClaim, addToast
}: {
  claims: typeof CLAIMS;
  search: string;
  setSearch: (v: string) => void;
  statusFilter: 'all' | 'approved' | 'pending' | 'rejected';
  setStatusFilter: (v: 'all' | 'approved' | 'pending' | 'rejected') => void;
  onSelectClaim: (c: typeof CLAIMS[0]) => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}) {
  const totalCopay = claims.reduce((a, c) => a + c.copay, 0);
  const totalInsured = claims.reduce((a, c) => a + c.insured, 0);
  const totalAll = claims.reduce((a, c) => a + c.total, 0);

  const statusBadge = (s: string) => {
    if (s === 'approved') return 'bg-emerald-50 text-emerald-700';
    if (s === 'pending') return 'bg-amber-50 text-amber-700';
    return 'bg-red-50 text-red-600';
  };

  const statusIcon = (s: string) => {
    if (s === 'approved') return '✅';
    if (s === 'pending') return '⏳';
    return '❌';
  };

  const serviceTypeBadge = (t: string) => {
    if (t === 'Radiology') return 'bg-blue-50 text-blue-600';
    if (t === 'Laboratory') return 'bg-indigo-50 text-indigo-600';
    return 'bg-teal-50 text-teal-600';
  };

  return (
    <div className="space-y-4">
      {/* Filter row */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by provider, doctor, or claim ID..."
              className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'approved', 'pending', 'rejected'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors capitalize ${statusFilter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Claims table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400 font-medium" style={{ fontSize: 10 }}>
          <div className="col-span-2">Date</div>
          <div className="col-span-3">Provider</div>
          <div className="col-span-2">Service</div>
          <div className="col-span-1 text-right">Total</div>
          <div className="col-span-1 text-right">Co-pay</div>
          <div className="col-span-1 text-right">Insured</div>
          <div className="col-span-2 text-center">Status</div>
        </div>

        {claims.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">No claims match your filters</div>
        ) : (
          claims.map((claim, idx) => (
            <div
              key={claim.id}
              onClick={() => onSelectClaim(claim)}
              className={`grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-blue-50/40 ${idx < claims.length - 1 ? 'border-b border-slate-50' : ''}`}
            >
              <div className="md:col-span-2">
                <div className="text-xs text-slate-500" style={{ fontFamily: 'DM Mono, monospace' }}>{claim.date}</div>
                <div className="text-xs text-slate-400 mt-0.5" style={{ fontSize: 10 }}>{claim.id}</div>
              </div>
              <div className="md:col-span-3">
                <div className="font-semibold text-slate-800 text-sm">{claim.provider}</div>
                <div className="text-xs text-slate-400 mt-0.5">{claim.doctor}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs text-slate-700 mb-1">{claim.service}</div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${serviceTypeBadge(claim.serviceType)}`} style={{ fontSize: 10 }}>
                  {claim.serviceType}
                </span>
              </div>
              <div className="md:col-span-1 md:text-right">
                <div className="font-bold text-slate-800 text-sm" style={{ fontFamily: 'DM Mono, monospace' }}>AED {claim.total.toLocaleString()}</div>
              </div>
              <div className="md:col-span-1 md:text-right">
                <div className="font-semibold text-amber-600 text-sm" style={{ fontFamily: 'DM Mono, monospace' }}>AED {claim.copay}</div>
                <div className="text-slate-400" style={{ fontSize: 10 }}>You paid</div>
              </div>
              <div className="md:col-span-1 md:text-right">
                <div className="font-semibold text-emerald-600 text-sm" style={{ fontFamily: 'DM Mono, monospace' }}>AED {claim.insured.toLocaleString()}</div>
              </div>
              <div className="md:col-span-2 flex md:justify-center items-start">
                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-bold ${statusBadge(claim.status)}`} style={{ fontSize: 10 }}>
                  {statusIcon(claim.status)} {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                </span>
              </div>
            </div>
          ))
        )}

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3 items-center justify-between">
          <div className="text-xs text-slate-500" style={{ fontFamily: 'DM Mono, monospace' }}>
            {claims.length} claims · AED {totalAll.toLocaleString()} total · AED {totalCopay.toLocaleString()} co-pay paid
          </div>
          <div className="text-xs font-semibold text-emerald-600" style={{ fontFamily: 'DM Mono, monospace' }}>
            AED {totalInsured.toLocaleString()} covered by Daman
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── CLAIM DETAIL MODAL ─── */
function ClaimDetailModal({
  claim, onClose, addToast
}: {
  claim: typeof CLAIMS[0];
  onClose: () => void;
  addToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void;
}) {
  const idRef = useRef<HTMLSpanElement>(null);

  function copyId() {
    navigator.clipboard.writeText(claim.id).catch(() => {});
    addToast('success', 'Claim ID copied');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ background: '#1E3A5F' }}>
          <div>
            <div className="font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Claim Details</div>
            <div className="text-white/60 flex items-center gap-2 mt-0.5" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
              <span ref={idRef}>{claim.id}</span>
              <button onClick={copyId} className="text-white/40 hover:text-white/80 transition-colors"><Copy size={11} /></button>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Summary */}
          <div className="p-4 bg-blue-50 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Claim ID</span>
              <span className="font-semibold text-slate-700" style={{ fontFamily: 'DM Mono, monospace' }}>{claim.id}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Submitted</span>
              <span className="text-slate-700" style={{ fontFamily: 'DM Mono, monospace' }}>{claim.date}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Processed</span>
              <span className="text-slate-700" style={{ fontFamily: 'DM Mono, monospace' }}>{claim.processed} ({claim.turnaround})</span>
            </div>
          </div>

          {/* Provider */}
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-2" style={{ fontSize: 10 }}>Provider</div>
            <div className="font-semibold text-slate-800 text-sm">{claim.provider}</div>
            <div className="text-xs text-slate-500 mt-0.5">{claim.doctor}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-slate-400" style={{ fontFamily: 'DM Mono, monospace' }}>{claim.facility}</span>
              <span className="text-emerald-500 text-xs">✅</span>
            </div>
          </div>

          {/* Service */}
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-2" style={{ fontSize: 10 }}>Service</div>
            <div className="font-semibold text-slate-800 text-sm">{claim.service}</div>
            <div className="flex gap-3 mt-1">
              <span className="text-xs text-slate-400">ICD-10: <span style={{ fontFamily: 'DM Mono, monospace' }} className="text-slate-600">{claim.icd}</span></span>
              <span className="text-xs text-slate-400">CPT: <span style={{ fontFamily: 'DM Mono, monospace' }} className="text-slate-600">{claim.cpt}</span></span>
            </div>
          </div>

          {/* Financial breakdown */}
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <div className="text-xs uppercase tracking-wider text-slate-400 px-4 pt-3 pb-2" style={{ fontSize: 10 }}>Financial Breakdown</div>
            <div className="px-4 pb-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Consultation fee</span>
                <span className="font-semibold text-slate-800" style={{ fontFamily: 'DM Mono, monospace' }}>AED {claim.total.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600">Your co-pay (10%)</span>
                  <span className="font-semibold text-amber-600" style={{ fontFamily: 'DM Mono, monospace' }}>AED {claim.copay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600">Daman Gold pays</span>
                  <span className="font-semibold text-emerald-600" style={{ fontFamily: 'DM Mono, monospace' }}>AED {claim.insured.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-semibold">
                <span className="text-slate-700">Your balance</span>
                <span className="text-emerald-600" style={{ fontFamily: 'DM Mono, monospace' }}>AED 0.00 ✅</span>
              </div>
            </div>
          </div>

          {/* Payment status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
              <CheckCircle size={14} className="text-emerald-600 shrink-0" />
              <span className="text-xs text-emerald-700">Co-pay: AED {claim.copay} — Paid at reception, {claim.date}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
              <CheckCircle size={14} className="text-emerald-600 shrink-0" />
              <span className="text-xs text-emerald-700">Daman: AED {claim.insured.toLocaleString()} — Approved and paid to provider</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={() => { addToast('success', 'EOB report downloaded'); onClose(); }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Download size={14} /> Download Explanation of Benefits (EOB)
            </button>
            <button className="w-full py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors">
              Dispute This Claim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PRE-AUTH TAB ─── */
function PreAuthTab({ showHistory, setShowHistory }: { showHistory: boolean; setShowHistory: (v: boolean) => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
        </div>
        <div className="font-bold text-slate-800 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18 }}>No pending pre-authorizations</div>
        <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
          Your doctors handle pre-authorization on your behalf. You'll be notified here when one is submitted or approved.
        </p>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
        >
          <span className="text-sm font-medium text-slate-600">View pre-authorization history</span>
          {showHistory ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
        </button>

        {showHistory && (
          <div className="px-6 pb-6 border-t border-slate-100 pt-4 space-y-4">
            <div className="p-4 border border-slate-100 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold text-slate-800 text-sm">Cardiac MRI with LGE</div>
                  <div className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>PA-20260215-00294</div>
                </div>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">✅ Approved</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Submitted:</span>
                  <span className="text-slate-700 ml-1">14 Feb 2026</span>
                </div>
                <div>
                  <span className="text-slate-400">For:</span>
                  <span className="text-slate-700 ml-1">15 Feb 2026</span>
                </div>
                <div>
                  <span className="text-slate-400">Approved:</span>
                  <span className="text-emerald-600 ml-1">14 Feb 2026 (same day)</span>
                </div>
                <div>
                  <span className="text-slate-400">Approved amount:</span>
                  <span className="font-semibold text-slate-700 ml-1" style={{ fontFamily: 'DM Mono, monospace' }}>AED 2,500</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-400">Dr. Ahmed Al Rashidi submitted · Daman approved</div>
            </div>
          </div>
        )}
      </div>

      {/* Info card */}
      <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={14} className="text-teal-600" />
          </div>
          <div>
            <div className="font-semibold text-teal-800 text-sm mb-1">How pre-authorization works</div>
            <p className="text-xs text-teal-700 leading-relaxed">
              For some procedures (imaging, surgery, specialist referrals), your doctor submits a pre-authorization request to Daman before the service. CeenAiX handles this automatically. You'll see all requests here and receive instant notifications on approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── BENEFITS TAB ─── */
function BenefitsTab({
  benefits, search, setSearch, showExclusions, setShowExclusions
}: {
  benefits: typeof BENEFITS;
  search: string;
  setSearch: (v: string) => void;
  showExclusions: boolean;
  setShowExclusions: (v: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search covered services..."
            className="w-full h-10 pl-9 pr-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Benefits grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map(b => {
          const Icon = b.icon;
          const notCovered = b.copay === 'Not covered';
          return (
            <div
              key={b.name}
              className={`bg-white rounded-xl border border-slate-100 p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-default ${notCovered ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className={`w-9 h-9 rounded-xl ${b.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={16} className={b.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm leading-tight">{b.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{b.copay}</div>
                </div>
                <div className={`font-bold shrink-0 ${notCovered ? 'text-red-400' : 'text-teal-600'}`} style={{ fontFamily: 'DM Mono, monospace', fontSize: 18 }}>
                  {b.pct}
                </div>
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">{b.notes}</div>
            </div>
          );
        })}
      </div>

      {/* Exclusions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <button
          onClick={() => setShowExclusions(!showExclusions)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
        >
          <span className="text-sm font-medium text-slate-600">View exclusions (not covered)</span>
          {showExclusions ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
        </button>
        {showExclusions && (
          <div className="px-6 pb-5 border-t border-slate-100 pt-4">
            <div className="flex flex-wrap gap-2">
              {['Cosmetic surgery', 'Fertility treatment', 'Experimental procedures', 'Pre-existing conditions (first 6 months)', 'Weight loss surgery', 'Travel vaccinations', 'Self-inflicted injuries'].map(e => (
                <span key={e} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs border border-red-100">❌ {e}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── DOCUMENTS TAB ─── */
function DocumentsTab({ addToast }: { addToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {DOCUMENTS.map(doc => (
        <div key={doc.name} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 hover:border-blue-200 hover:bg-blue-50/20 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-800 text-sm truncate">{doc.name}</div>
            <div className="text-xs text-slate-400 mt-0.5 truncate">{doc.desc}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-300" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>{doc.date}</span>
              <span className="text-slate-200">·</span>
              <span className="text-xs text-slate-300" style={{ fontSize: 10 }}>{doc.size}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-blue-50 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors">
              <Eye size={14} />
            </button>
            <button
              onClick={() => addToast('success', `Downloading ${doc.name}`)}
              className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-teal-50 flex items-center justify-center text-slate-500 hover:text-teal-600 transition-colors"
            >
              <Download size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
