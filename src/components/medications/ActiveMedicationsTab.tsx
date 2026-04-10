import { useState } from 'react';
import { Pill, ChevronDown, ChevronUp, Info, Bell, FileText, RefreshCw, Phone, AlertTriangle } from 'lucide-react';
import type { Medication } from '../../types/medications';

interface ActiveMedicationsTabProps {
  medications: Medication[];
}

export default function ActiveMedicationsTab({ medications }: ActiveMedicationsTabProps) {
  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  const toggleCard = (id: string) => {
    setExpandedCards(prev =>
      prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    );
  };

  const getCategoryBgColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      '#3B82F6': 'bg-blue-100',
      '#7C3AED': 'bg-purple-100',
      '#EF4444': 'bg-red-100',
      '#F59E0B': 'bg-amber-100'
    };
    return colorMap[color] || 'bg-teal-100';
  };

  const getRefillColor = (days: number) => {
    if (days > 14) return 'emerald';
    if (days >= 7) return 'amber';
    return 'red';
  };

  const getRefillBarWidth = (days: number, total: number = 30) => {
    return Math.min((days / total) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-700">
            ⚠️ Always inform your doctor or pharmacist about your allergies:{' '}
            <span className="font-bold">Penicillin (SEVERE)</span> and <span className="font-bold">Sulfa drugs</span> (rash)
          </p>
          <a href="/patient/health-records?tab=allergies" className="text-sm text-red-600 hover:text-red-700 font-medium mt-1 inline-block">
            View Allergies →
          </a>
        </div>
      </div>

      {medications.map((med, index) => {
        const isExpanded = expandedCards.includes(med.id);
        const refillColor = getRefillColor(med.daysSupplyRemaining);

        return (
          <div
            key={med.id}
            style={{ animationDelay: `${index * 80}ms`, borderLeftColor: med.categoryColor }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.012] border-l-[5px] animate-slideUp"
          >
            <div className="p-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-72">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 ${getCategoryBgColor(med.categoryColor)} rounded-full flex items-center justify-center relative`}>
                      <Pill className="w-6 h-6" style={{ color: med.categoryColor }} />
                      <div className="absolute -bottom-1 -right-1 text-base">{med.categoryEmoji}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-playfair font-bold text-slate-900">{med.brandName}</h3>
                      <div className="text-base font-mono font-bold mt-0.5" style={{ color: med.categoryColor }}>{med.strength}</div>
                      <div className="text-xs text-slate-400">{med.form}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: med.categoryColor + '15', color: med.categoryColor }}>
                      For: {med.condition}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {med.prescribedBy.split(' ')[1].charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 font-medium">{med.prescribedBy}</div>
                      <div className="text-[11px] text-teal-600">{med.prescribedBySpecialty}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400">Since {med.prescribedOn}</div>
                </div>

                <div className="flex-1">
                  <div className="mb-4">
                    <div className="text-[10px] uppercase tracking-wide text-slate-400 font-bold mb-3">Dosing Schedule</div>

                    <div className="flex items-center gap-4 mb-4">
                      {med.schedule.map((dose, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            dose.status === 'taken' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' :
                            dose.status === 'pending' ? 'bg-amber-500 animate-pulse shadow-lg shadow-amber-500/30' :
                            'bg-slate-200'
                          }`}>
                            {dose.status === 'taken' && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div className="text-[11px] font-mono text-slate-600 mt-1">{dose.time}</div>
                          <div className={`text-xs mt-0.5 font-medium ${
                            dose.status === 'taken' ? 'text-emerald-600' :
                            dose.status === 'pending' ? 'text-amber-600' :
                            'text-slate-400'
                          }`}>
                            {dose.status === 'taken' ? `✅ ${dose.takenAt}` :
                             dose.status === 'pending' ? '⏰ Pending' :
                             '⏰ Scheduled'}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-sm text-slate-600">📋 {med.instructions}</div>
                      <div className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-[11px] font-medium">
                        {med.schedule.length > 1 ? `${med.schedule.length}x daily` : 'Once daily'}
                      </div>
                    </div>

                    {med.schedule.some(d => d.status === 'pending') && (
                      <button className="px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-full text-xs font-bold hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 hover:scale-105">
                        Mark Taken ✓
                      </button>
                    )}

                    {med.schedule.every(d => d.status === 'taken') && (
                      <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold inline-flex items-center gap-1.5">
                        All doses taken today ✓
                      </div>
                    )}

                    {med.warnings && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="text-xs text-amber-700 font-medium">{med.warnings[0]}</div>
                        <button className="text-xs text-amber-600 hover:text-amber-700 font-medium mt-1">View →</button>
                      </div>
                    )}

                    {med.doctorNote && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-xs text-blue-700">
                          <span className="font-bold">Dr. {med.prescribedBy.split(' ').slice(1).join(' ')}:</span> {med.doctorNote}
                        </div>
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1">Reply to doctor →</button>
                      </div>
                    )}

                    {med.adherenceRate === 100 && (
                      <div className="mt-3 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="text-xs text-emerald-700 font-bold">⭐ 100% adherence this month</div>
                        <div className="text-xs text-emerald-600 mt-0.5">Your most consistent medication!</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 w-56">
                  <div className="text-[10px] uppercase tracking-wide text-slate-400 font-bold mb-3">Refill Status</div>

                  <div className="mb-3">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-${refillColor}-500 to-${refillColor}-600 transition-all duration-800 ease-out`}
                        style={{ width: `${getRefillBarWidth(med.daysSupplyRemaining)}%` }}
                      />
                    </div>
                    <div className={`text-sm font-mono font-bold mt-2 text-${refillColor}-600`}>
                      {med.daysSupplyRemaining} days
                    </div>
                    <div className="text-[11px] text-slate-400">of 30-day supply</div>

                    {med.daysSupplyRemaining < 7 && (
                      <div className="mt-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
                        Refill Now!
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 mb-1">Refill due: {med.nextRefillDue}</div>
                  <div className="text-[11px] text-slate-400 mb-3">
                    {med.refillsRemaining > 0 ? `${med.refillsRemaining} refills remaining` : (
                      <span className="text-red-500 font-medium">No refills — request from doctor</span>
                    )}
                  </div>

                  {med.retestDate && (
                    <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-xs text-blue-700 font-bold">🔬 {med.retestInfo}: {med.retestDate}</div>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1">Book Lab Test →</button>
                    </div>
                  )}

                  <div className="p-3 bg-slate-50 rounded-lg mb-3">
                    <div className="flex items-start gap-2 mb-1.5">
                      <div className="text-sm">🏪</div>
                      <div>
                        <div className="text-xs text-slate-600 font-medium">{med.pharmacy}</div>
                        <div className="text-[11px] text-slate-400">{med.pharmacyLocation}</div>
                      </div>
                    </div>
                    <button className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Call Pharmacy
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <div className="text-[11px] uppercase tracking-wide text-slate-400 font-bold mb-2">Monthly Cost:</div>
                    {med.insuranceCovered ? (
                      <>
                        <div className="text-base font-mono font-bold text-emerald-600">AED {med.insurancePrice}/month</div>
                        <div className="text-[11px] text-slate-400 line-through">Full price: AED {med.monthlyPrice}</div>
                        <div className="text-[11px] text-emerald-600 mt-1 font-medium">{med.insuranceName} — {Math.round((1 - med.insurancePrice / med.monthlyPrice) * 100)}% covered ✓</div>
                      </>
                    ) : (
                      <>
                        <div className="text-base font-mono font-bold text-slate-600">AED {med.insurancePrice}/month</div>
                        <div className="text-[11px] text-slate-400 mt-1">Self-pay (supplement)</div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleCard(med.id)}
                  className="flex-shrink-0 p-2 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-slate-100 animate-slideUp">
                  <div className="flex items-center justify-between gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 text-sm font-medium">
                      <Info className="w-4 h-4" /> Drug Info
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 text-sm font-medium">
                      <Bell className="w-4 h-4" /> Set Reminder
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 text-sm font-medium">
                      <FileText className="w-4 h-4" /> Prescription Details
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 text-sm font-medium">
                      <RefreshCw className="w-4 h-4" /> Request Refill
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
