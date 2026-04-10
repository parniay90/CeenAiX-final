import { useState, useEffect, useRef } from 'react';
import DoctorSidebarNew from '../components/doctor/DoctorSidebarNew';
import {
  TrendingUp, Download, FileText, ChevronDown, Calendar
} from 'lucide-react';
import OverviewTab from '../components/earnings/OverviewTab';
import InsuranceClaimsTab from '../components/earnings/InsuranceClaimsTab';
import TransactionsTab from '../components/earnings/TransactionsTab';
import PayoutsTab from '../components/earnings/PayoutsTab';
import AnalyticsTab from '../components/earnings/AnalyticsTab';
import ExportReportModal from '../components/earnings/ExportReportModal';

type Tab = 'overview' | 'transactions' | 'claims' | 'payouts' | 'analytics';

function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * ease));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

function HeroMetric({ label, value, sub, sub2, color = 'white', children }: any) {
  const displayed = useCountUp(value);
  return (
    <div className="flex flex-col">
      <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2 font-medium">{label}</div>
      <div className={`font-mono text-3xl font-bold mb-1 ${color}`}>
        AED {displayed.toLocaleString()}
      </div>
      {sub && <div className="text-xs text-white/60 mb-1">{sub}</div>}
      {sub2 && <div className="text-xs text-white/40">{sub2}</div>}
      {children}
    </div>
  );
}

export default function DoctorEarnings() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  const todayVal = useCountUp(2050);
  const weekVal = useCountUp(11200);
  const monthVal = useCountUp(7650);
  const payoutVal = useCountUp(7038);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'transactions', label: '💳 Transactions' },
    { id: 'claims', label: '🛡️ Insurance Claims' },
    { id: 'payouts', label: '💰 Payouts' },
    { id: 'analytics', label: '📈 Analytics' },
  ];

  const kpiCards = [
    {
      icon: '📈', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
      value: 'AED 7,650', label: 'Gross This Month', sub: '↑ +8.4% vs March', subColor: 'text-emerald-600',
    },
    {
      icon: '%', iconBg: 'bg-red-100', iconColor: 'text-red-500',
      value: 'AED 612', label: 'CeenAiX Fee (8%)', sub: 'AED 7,038 net', subColor: 'text-teal-600',
      tooltip: '8% platform fee on gross consultation revenue. Deducted before monthly payout.',
    },
    {
      icon: '$', iconBg: 'bg-teal-100', iconColor: 'text-teal-600',
      value: 'AED 7,038', label: 'Net Earnings This Month', sub: 'After 8% platform fee', subColor: 'text-slate-400',
    },
    {
      icon: '🛡', iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
      label: 'Insurance Claims — April',
      claims: true,
    },
    {
      icon: '📊', iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
      value: 'AED 114,816', label: 'Net YTD (Jan–Apr 7)', sub: '312 consultations', subColor: 'text-slate-500',
      sub2: '↑ +15% vs same period 2025',
    },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <DoctorSidebarNew />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
              <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Earnings</h1>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 ml-9">Revenue · Claims · Payouts · Analytics</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-sm font-medium transition-colors border border-teal-200"
              >
                <Calendar className="w-4 h-4" />
                {selectedPeriod}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showDatePicker && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2">
                  {['Today', 'This Week', 'This Month', 'Last Month', 'This Year', 'Custom Range'].map(p => (
                    <button key={p} onClick={() => { setSelectedPeriod(p); setShowDatePicker(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${p === selectedPeriod ? 'text-teal-700 font-semibold bg-teal-50' : 'text-slate-700'}`}>
                      {p === selectedPeriod ? `● ${p}` : p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
              <FileText className="w-4 h-4" />
              Download Invoice
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Revenue Hero */}
          <div className="rounded-2xl p-8 text-white" style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)' }}>
            <div className="grid grid-cols-4 gap-8 divide-x divide-white/10">
              {/* TODAY */}
              <div className="pr-8">
                <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2 font-medium">TODAY</div>
                <div className="font-mono text-[2.25rem] font-bold text-emerald-300 mb-1">AED {todayVal.toLocaleString()}</div>
                <div className="text-xs text-white/60 mb-1">5 consultations confirmed</div>
                <div className="text-xs text-amber-300 italic mb-1">+AED 800 pending</div>
                <div className="text-xs text-white/40">3 remaining: est. AED 1,200</div>
              </div>

              {/* THIS WEEK */}
              <div className="px-8">
                <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2 font-medium">THIS WEEK</div>
                <div className="font-mono text-[2rem] font-bold text-white mb-1">AED {weekVal.toLocaleString()}</div>
                <div className="text-xs text-white/60 mb-1">AED 5,650 confirmed · AED 5,550 projected</div>
                <div className="text-xs text-emerald-300">↑ +12% vs last week</div>
              </div>

              {/* APRIL 2026 */}
              <div className="px-8">
                <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2 font-medium">APRIL 2026</div>
                <div className="font-mono text-[2.25rem] font-bold text-teal-300 mb-1">AED {monthVal.toLocaleString()}</div>
                <div className="text-xs text-white/60 mb-1">3 working days · 18 consultations</div>
                <div className="text-xs text-white/40 font-mono mb-2">AED 7,650 / 25,000</div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-teal-400 rounded-full" style={{ width: '30.6%' }} />
                </div>
                <div className="text-[10px] text-white/40">30.6% of target</div>
              </div>

              {/* NEXT PAYOUT */}
              <div className="pl-8">
                <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2 font-medium">NEXT PAYOUT</div>
                <div className="font-sans text-lg font-bold text-amber-300 mb-0.5" style={{ fontFamily: 'Plus Jakarta Sans' }}>1 May 2026</div>
                <div className="font-mono text-sm text-amber-200 mb-2">24 days away</div>
                <div className="font-mono text-2xl font-bold text-emerald-300 mb-0.5">~AED {payoutVal.toLocaleString()}+</div>
                <div className="text-xs text-white/40 italic mb-2">growing daily</div>
                <div className="font-mono text-[10px] text-white/30 mb-2">FAB ···· XXXX</div>
                <button className="px-3 py-1.5 border border-white/20 text-white/60 hover:text-white/80 rounded-lg text-[10px] font-medium transition-colors">
                  Payout Details
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-5 gap-4">
            {/* Gross */}
            <div className="bg-white rounded-xl p-5 border border-slate-100 hover:scale-[1.02] transition-transform">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="font-mono text-2xl font-bold text-emerald-600 mb-1">AED 7,650</div>
              <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Gross This Month</div>
              <div className="text-xs text-emerald-600">↑ +8.4% vs March</div>
            </div>

            {/* Platform Fee */}
            <div className="bg-white rounded-xl p-5 border border-slate-100 hover:scale-[1.02] transition-transform group relative">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-red-500 font-bold text-lg">%</span>
              </div>
              <div className="font-mono text-2xl font-bold text-red-500 mb-1">AED 612</div>
              <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">CeenAiX Fee (8%)</div>
              <div className="font-mono text-xs text-teal-600">AED 7,038 net</div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 text-center z-10">
                8% platform fee on gross consultation revenue. Deducted before monthly payout.
              </div>
            </div>

            {/* Net */}
            <div className="bg-white rounded-xl p-5 border border-slate-100 hover:scale-[1.02] transition-transform">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-teal-600 font-bold text-lg">$</span>
              </div>
              <div className="font-mono text-2xl font-bold text-teal-600 mb-1">AED 7,038</div>
              <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Net Earnings This Month</div>
              <div className="text-xs text-slate-400">After 8% platform fee</div>
            </div>

            {/* Insurance */}
            <div className="bg-white rounded-xl p-5 border border-slate-100 hover:scale-[1.02] transition-transform">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-blue-600 text-lg">🛡️</span>
              </div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-base font-bold text-emerald-600">5 ✅</span>
                <span className="font-mono text-base font-bold text-amber-600">5 ⏳</span>
                <span className="font-mono text-base font-bold text-red-500">1 ❌</span>
              </div>
              <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Insurance Claims — April</div>
              <div className="font-mono text-xs text-slate-500">AED 5,120 / AED 3,200 received</div>
            </div>

            {/* YTD */}
            <div className="bg-white rounded-xl p-5 border border-slate-100 hover:scale-[1.02] transition-transform">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-blue-600 text-lg">📊</span>
              </div>
              <div className="font-mono text-xl font-bold text-blue-700 mb-1">AED 114,816</div>
              <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Net YTD (Jan–Apr 7)</div>
              <div className="text-xs text-slate-500 mb-0.5">312 consultations</div>
              <div className="text-xs text-emerald-600">↑ +15% vs same period 2025</div>
            </div>
          </div>

          {/* Tabs + Content */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="border-b border-slate-100 px-6">
              <div className="flex gap-8">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                      activeTab === tab.id ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-teal-600 rounded-t" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'transactions' && <TransactionsTab />}
              {activeTab === 'claims' && <InsuranceClaimsTab />}
              {activeTab === 'payouts' && <PayoutsTab />}
              {activeTab === 'analytics' && <AnalyticsTab />}
            </div>
          </div>
        </div>
      </div>

      {showExportModal && <ExportReportModal onClose={() => setShowExportModal(false)} />}
    </div>
  );
}
