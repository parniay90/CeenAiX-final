import { useState } from 'react';
import { CheckCircle2, Clock, Eye, FileText, X, Building2, CreditCard, Shield } from 'lucide-react';

interface Payout {
  id: string;
  date: string;
  amount: number;
  gross: number;
  fee: number;
  consultations: number;
  period: string;
  ref: string;
  bank: string;
  status: 'transferred' | 'processing' | 'estimated' | 'projected';
  daysUntil?: number;
}

function PayoutStatementModal({ payout, onClose }: { payout: Payout; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Payout Statement</div>
              <div className="text-white font-bold text-lg" style={{ fontFamily: 'Plus Jakarta Sans' }}>{payout.date}</div>
              <div className="font-mono text-xs text-white/40 mt-0.5">{payout.ref}</div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">Revenue Breakdown</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Gross Earnings</span>
                <span className="font-mono font-semibold text-slate-900">AED {payout.gross.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">CeenAiX Platform Fee (8%)</span>
                <span className="font-mono font-semibold text-red-500">- AED {payout.fee.toLocaleString()}</span>
              </div>
              <div className="h-px bg-slate-200 my-2" />
              <div className="flex justify-between text-base font-bold">
                <span className="text-slate-900">Net Payout</span>
                <span className="font-mono text-emerald-600">AED {payout.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-1">Consultations</div>
              <div className="font-mono text-2xl font-bold text-slate-900">{payout.consultations}</div>
              <div className="text-xs text-slate-500 mt-1">{payout.period}</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="text-xs text-emerald-600 mb-1">Status</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-emerald-700 text-sm">Transferred</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">{payout.bank}</div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Destination Account</div>
            </div>
            <div className="text-sm font-semibold text-slate-900">{payout.bank}</div>
            <div className="font-mono text-xs text-slate-500 mt-1">AE07 0351 XXXX XXXX XXXX X456</div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-colors">
              <FileText className="w-4 h-4" />
              Download Statement
            </button>
            <button onClick={onClose} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PayoutsTab() {
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);

  const pastPayouts: Payout[] = [
    { id: '1', date: '1 April 2026', amount: 32752, gross: 35600, fee: 2848, consultations: 89, period: 'March 2026', ref: 'PAY-20260401-0089', bank: 'First Abu Dhabi Bank', status: 'transferred' },
    { id: '2', date: '1 March 2026', amount: 30176, gross: 32800, fee: 2624, consultations: 82, period: 'February 2026', ref: 'PAY-20260301-0082', bank: 'First Abu Dhabi Bank', status: 'transferred' },
    { id: '3', date: '1 February 2026', amount: 28704, gross: 31200, fee: 2496, consultations: 78, period: 'January 2026', ref: 'PAY-20260201-0078', bank: 'First Abu Dhabi Bank', status: 'transferred' },
    { id: '4', date: '1 January 2026', amount: 23184, gross: 25200, fee: 2016, consultations: 63, period: 'December 2025', ref: 'PAY-20260101-0063', bank: 'First Abu Dhabi Bank', status: 'transferred' },
  ];

  return (
    <div className="space-y-6">
      {/* Upcoming Payout Hero */}
      <div className="rounded-2xl p-8 text-white border border-teal-200" style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)' }}>
        <div className="grid grid-cols-3 gap-8 divide-x divide-white/10">
          <div className="pr-8">
            <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2 font-medium">NEXT PAYOUT</div>
            <div className="font-sans text-2xl font-bold text-teal-300 mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>1 May 2026</div>
            <div className="font-mono text-sm text-amber-200 mb-3">24 days away</div>
            <div className="font-mono text-[2rem] font-bold text-emerald-300 mb-1">~AED 7,038+</div>
            <div className="text-xs text-white/40 italic mb-3">growing daily as consultations complete</div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-1">
              <div className="h-full bg-teal-400 rounded-full" style={{ width: '28.2%' }} />
            </div>
            <div className="text-[10px] text-white/40">AED 7,038 / AED 25,000 target (28.2%)</div>
          </div>

          <div className="px-8">
            <div className="text-[9px] uppercase tracking-widest text-white/40 mb-4 font-medium">PROCESSING STATUS</div>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-white/80">Earnings calculated daily</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-white/80">Insurance claims being collected</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="text-sm text-white/60">Payout finalized 30 April EOD</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-white/20 shrink-0" />
                <span className="text-sm text-white/30">Transfer to FAB: 1 May 2026</span>
              </div>
            </div>
          </div>

          <div className="pl-8">
            <div className="text-[9px] uppercase tracking-widest text-white/40 mb-4 font-medium">BANK ACCOUNT</div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-teal-300" />
              <span className="text-sm font-semibold text-white">First Abu Dhabi Bank (FAB)</span>
            </div>
            <div className="font-mono text-xs text-white/50 mb-0.5">Account ···· ···· 3456</div>
            <div className="font-mono text-xs text-white/30 mb-4">AE07 0351 XXXX XXXX XXXX X456</div>
            <div className="flex items-center gap-1.5 mb-3">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] text-emerald-300">Verified by Al Noor Medical Center</span>
            </div>
            <button className="px-3 py-1.5 border border-white/20 text-white/60 hover:text-white/80 rounded-lg text-xs font-medium transition-colors">
              Payout Details
            </button>
          </div>
        </div>
      </div>

      {/* Past Payouts Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: 'Plus Jakarta Sans' }}>Payout History</h3>
          <div className="font-mono text-xs text-slate-500">
            2026 YTD: <span className="font-bold text-emerald-600">AED 114,816</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="px-6 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Period</th>
                <th className="px-6 py-3 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Gross</th>
                <th className="px-6 py-3 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Fee (8%)</th>
                <th className="px-6 py-3 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Net Payout</th>
                <th className="px-6 py-3 text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Consults</th>
                <th className="px-6 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pastPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{payout.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{payout.period}</td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-slate-600">AED {payout.gross.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-red-500">- AED {payout.fee.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-mono text-sm font-bold text-emerald-600">AED {payout.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center font-mono text-sm text-slate-700">{payout.consultations}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-semibold border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3" />
                      Transferred
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedPayout(payout)}
                        className="p-1.5 hover:bg-teal-50 text-slate-400 hover:text-teal-600 rounded-lg transition-colors"
                        title="View Statement"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors" title="Download">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                <td colSpan={2} className="px-6 py-3 text-xs font-semibold text-slate-600">4 Payouts Total</td>
                <td className="px-6 py-3 text-right font-mono text-xs font-bold text-slate-700">AED 124,800</td>
                <td className="px-6 py-3 text-right font-mono text-xs font-bold text-red-500">- AED 9,984</td>
                <td className="px-6 py-3 text-right font-mono text-xs font-bold text-emerald-600">AED 114,816</td>
                <td className="px-6 py-3 text-center font-mono text-xs font-bold text-slate-700">312</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
          <button className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors">
            Load earlier payouts →
          </button>
        </div>
      </div>

      {/* Bank Account Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>Payout Bank Account</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-[10px] uppercase text-slate-400 mb-1">Bank</div>
            <div className="text-sm font-semibold text-slate-900">First Abu Dhabi Bank (FAB)</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-400 mb-1">Account Number</div>
            <div className="font-mono text-sm text-slate-600">●●● ●●● ●●● 3456</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-400 mb-1">IBAN</div>
            <div className="font-mono text-xs text-slate-600">AE07 0351 ●●●● ●●●● ●●●● X456</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-400 mb-1">Account Name</div>
            <div className="text-sm text-slate-900">Dr. Ahmed Rashidi Al Rashidi</div>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span className="text-xs text-emerald-600 font-medium">Verified by Al Noor Medical Center</span>
        </div>
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl mb-4">
          <p className="text-xs text-slate-600">
            To change your payout account, contact Al Noor Medical Center admin. Bank accounts are verified by your employer to prevent fraud.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors">
          <CreditCard className="w-4 h-4" />
          Contact Admin to Update
        </button>
      </div>

      {selectedPayout && (
        <PayoutStatementModal payout={selectedPayout} onClose={() => setSelectedPayout(null)} />
      )}
    </div>
  );
}
