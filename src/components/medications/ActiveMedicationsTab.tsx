import { useState } from 'react';
import { Pill, ChevronDown, ChevronUp, Info, Bell, FileText, RefreshCw, Phone, AlertTriangle, X, CheckCircle2, Clock } from 'lucide-react';
import type { Medication } from '../../types/medications';

interface ActiveMedicationsTabProps {
  medications: Medication[];
}

// ── Drug Info Modal ───────────────────────────────────────────────────────────
function DrugInfoModal({ med, onClose }: { med: Medication; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: med.categoryColor + '20' }}>
              <Info className="w-5 h-5" style={{ color: med.categoryColor }} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{med.brandName} — Drug Info</p>
              <p className="text-xs text-gray-400">{med.genericName} {med.strength}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5 space-y-4">
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
            <p className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-1">How It Works</p>
            <p className="text-sm text-teal-900">{med.drugInfo.howItWorks}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Common Side Effects</p>
            <ul className="space-y-1">
              {med.drugInfo.commonSideEffects.map((effect, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  {effect}
                </li>
              ))}
            </ul>
          </div>

          {med.drugInfo.seriousSideEffects && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-1">⚠️ Serious Side Effects</p>
              <p className="text-sm text-red-800">{med.drugInfo.seriousSideEffects}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Food Interactions</p>
              <p className="text-xs text-gray-700">{med.drugInfo.foodInteractions}</p>
            </div>
            {med.drugInfo.avoid && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Avoid</p>
                <p className="text-xs text-gray-700">{med.drugInfo.avoid}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Storage</p>
              <p className="text-xs text-gray-700">{med.drugInfo.storage}</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Important</p>
              <p className="text-xs text-blue-800">{med.drugInfo.important}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="w-full py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Set Reminder Modal ────────────────────────────────────────────────────────
function SetReminderModal({ med, onClose }: { med: Medication; onClose: () => void }) {
  const [time, setTime] = useState('08:00');
  const [channels, setChannels] = useState({ app: true, sms: false, whatsapp: false });
  const [frequency, setFrequency] = useState('daily');
  const [saved, setSaved] = useState(false);

  const toggleChannel = (ch: keyof typeof channels) => {
    setChannels(prev => ({ ...prev, [ch]: !prev[ch] }));
  };

  const handleSave = () => setSaved(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={saved ? undefined : onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Bell className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Set Reminder</p>
              <p className="text-xs text-gray-400">{med.brandName} {med.strength}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-5">
          {saved ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Reminder Set!</h3>
              <p className="text-gray-500 text-sm mb-1">
                You'll be reminded to take <span className="font-semibold text-gray-700">{med.brandName}</span> at
              </p>
              <p className="text-teal-600 font-bold text-lg">{time}</p>
              <p className="text-gray-400 text-xs mt-2">
                Via: {[channels.app && 'App', channels.sms && 'SMS', channels.whatsapp && 'WhatsApp'].filter(Boolean).join(', ') || 'No channel selected'}
              </p>
              <button onClick={onClose} className="mt-6 w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors">
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reminder Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>
                <div className="grid grid-cols-3 gap-2">
                  {['daily', 'weekdays', 'custom'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFrequency(f)}
                      className={`py-2 rounded-xl text-xs font-medium border-2 capitalize transition-all ${
                        frequency === f
                          ? 'border-teal-600 bg-teal-50 text-teal-700'
                          : 'border-gray-200 text-gray-600 hover:border-teal-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Channels */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Channels</label>
                <div className="space-y-2">
                  {[
                    { key: 'app', label: '📱 App Notification' },
                    { key: 'sms', label: '💬 SMS' },
                    { key: 'whatsapp', label: '🟢 WhatsApp' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => toggleChannel(key as keyof typeof channels)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                        channels[key as keyof typeof channels]
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm text-gray-700">{label}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        channels[key as keyof typeof channels]
                          ? 'border-teal-600 bg-teal-600'
                          : 'border-gray-300'
                      }`}>
                        {channels[key as keyof typeof channels] && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} className="flex-1 py-3 rounded-xl font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors">
                  Save Reminder
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Prescription Details Modal ────────────────────────────────────────────────
function PrescriptionDetailsModal({ med, onClose }: { med: Medication; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Prescription Details</p>
              <p className="text-xs text-gray-400">{med.brandName} {med.strength}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* NABIDH */}
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
            <p className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-1">NABIDH Reference</p>
            <p className="text-sm font-mono text-teal-900 font-bold">{med.nabidh}</p>
          </div>

          {/* Details grid */}
          <div className="space-y-3">
            {[
              { label: 'Drug Name', value: `${med.brandName} (${med.genericName})` },
              { label: 'Strength & Form', value: `${med.strength} ${med.form}` },
              { label: 'Prescribed By', value: med.prescribedBy },
              { label: 'Specialty', value: med.prescribedBySpecialty },
              { label: 'Prescribed On', value: med.prescribedOn },
              { label: 'Course Start', value: med.courseStart },
              { label: 'Duration', value: med.duration },
              { label: 'Instructions', value: med.instructions },
              { label: 'Quantity Dispensed', value: `${med.quantityDispensed} units` },
              { label: 'Refills Remaining', value: med.refillsRemaining > 0 ? `${med.refillsRemaining} refills` : 'No refills remaining' },
              { label: 'Next Refill Due', value: med.nextRefillDue },
              { label: 'Pharmacy', value: `${med.pharmacy} — ${med.pharmacyLocation}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide min-w-[130px]">{label}</span>
                <span className="text-sm text-gray-800 font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Request Refill Modal ──────────────────────────────────────────────────────
function RequestRefillModal({ med, onClose }: { med: Medication; onClose: () => void }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={confirmed ? undefined : onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Request Refill</p>
              <p className="text-xs text-gray-400">{med.brandName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-6">
          {confirmed ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Refill Requested!</h3>
              <p className="text-gray-500 text-sm mb-1">
                Your refill request for <span className="font-semibold text-gray-700">{med.brandName}</span> has been sent to
              </p>
              <p className="text-teal-600 font-semibold text-sm">{med.prescribedBy}</p>
              <p className="text-gray-400 text-xs mt-3">Your doctor will review and approve the refill shortly.</p>
              <button onClick={onClose} className="mt-6 w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors">
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">Are you sure you want to request a refill for:</p>
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-5">
                <p className="font-bold text-gray-900">{med.brandName}</p>
                <p className="text-xs text-gray-500 mt-0.5 mb-3">{med.genericName} {med.strength}</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Instructions:</span>
                    <span className="font-medium text-gray-700">{med.instructions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Prescribing Doctor:</span>
                    <span className="font-medium text-teal-700">{med.prescribedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Days Remaining:</span>
                    <span className="font-medium text-amber-600">{med.daysSupplyRemaining} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pharmacy:</span>
                    <span className="font-medium text-gray-700">{med.pharmacy}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={() => setConfirmed(true)} className="flex-1 py-3 rounded-xl font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors">
                  Confirm Refill
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ActiveMedicationsTab({ medications }: ActiveMedicationsTabProps) {
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [drugInfoMed, setDrugInfoMed] = useState<Medication | null>(null);
  const [reminderMed, setReminderMed] = useState<Medication | null>(null);
  const [prescriptionMed, setPrescriptionMed] = useState<Medication | null>(null);
  const [refillMed, setRefillMed] = useState<Medication | null>(null);

  const toggleCard = (id: string) => {
    setExpandedCards(prev =>
      prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    );
  };

  const navigateToAllergies = () => {
    window.location.href = '/my-health?tab=allergies';
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
      {/* Allergy Warning Banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-700">
            ⚠️ Always inform your doctor or pharmacist about your allergies:{' '}
            <span className="font-bold">Penicillin (SEVERE)</span> and <span className="font-bold">Sulfa drugs</span> (rash)
          </p>
          <button
            onClick={navigateToAllergies}
            className="text-sm text-red-600 hover:text-red-700 font-medium mt-1 inline-block"
          >
            View Allergies →
          </button>
        </div>
      </div>

      {/* Medication Cards */}
      {medications.map((med, index) => {
        const isExpanded = expandedCards.includes(med.id);
        const refillColor = getRefillColor(med.daysSupplyRemaining);

        return (
          <div
            key={med.id}
            style={{ borderLeftColor: med.categoryColor }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.012] border-l-[5px]"
          >
            <div className="p-6">
              <div className="flex items-start gap-6">
                {/* Column 1 — Identity */}
                <div className="flex-shrink-0 w-72">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 ${getCategoryBgColor(med.categoryColor)} rounded-full flex items-center justify-center relative`}>
                      <Pill className="w-6 h-6" style={{ color: med.categoryColor }} />
                      <div className="absolute -bottom-1 -right-1 text-base">{med.categoryEmoji}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{med.brandName}</h3>
                      <div className="text-base font-bold mt-0.5" style={{ color: med.categoryColor }}>{med.strength}</div>
                      <div className="text-xs text-gray-400">{med.form}</div>
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
                      <div className="text-xs text-gray-600 font-medium">{med.prescribedBy}</div>
                      <div className="text-xs text-teal-600">{med.prescribedBySpecialty}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Since {med.prescribedOn}</div>
                </div>

                {/* Column 2 — Dosing Schedule */}
                <div className="flex-1">
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-wide text-gray-400 font-bold mb-3">Dosing Schedule</div>
                    <div className="flex items-center gap-4 mb-4">
                      {med.schedule.map((dose, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            dose.status === 'taken' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' :
                            dose.status === 'pending' ? 'bg-amber-500 animate-pulse shadow-lg shadow-amber-500/30' :
                            'bg-gray-200'
                          }`}>
                            {dose.status === 'taken' && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">{dose.time}</div>
                          <div className={`text-xs mt-0.5 font-medium ${
                            dose.status === 'taken' ? 'text-emerald-600' :
                            dose.status === 'pending' ? 'text-amber-600' :
                            'text-gray-400'
                          }`}>
                            {dose.status === 'taken' ? `✅ ${dose.takenAt}` :
                             dose.status === 'pending' ? '⏰ Pending' :
                             '⏰ Scheduled'}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-sm text-gray-600">📋 {med.instructions}</div>
                      <div className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
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
                      </div>
                    )}

                    {med.doctorNote && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-xs text-blue-700">
                          <span className="font-bold">Dr. {med.prescribedBy.split(' ').slice(1).join(' ')}:</span> {med.doctorNote}
                        </div>
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

                {/* Column 3 — Refill Status */}
                <div className="flex-shrink-0 w-56">
                  <div className="text-xs uppercase tracking-wide text-gray-400 font-bold mb-3">Refill Status</div>
                  <div className="mb-3">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${refillColor}-500 transition-all duration-300`}
                        style={{ width: `${getRefillBarWidth(med.daysSupplyRemaining)}%` }}
                      />
                    </div>
                    <div className={`text-sm font-bold mt-2 text-${refillColor}-600`}>
                      {med.daysSupplyRemaining} days
                    </div>
                    <div className="text-xs text-gray-400">of 30-day supply</div>
                    {med.daysSupplyRemaining < 7 && (
                      <div className="mt-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
                        Refill Now!
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mb-1">Refill due: {med.nextRefillDue}</div>
                  <div className="text-xs text-gray-400 mb-3">
                    {med.refillsRemaining > 0 ? `${med.refillsRemaining} refills remaining` : (
                      <span className="text-red-500 font-medium">No refills — request from doctor</span>
                    )}
                  </div>

                  {med.retestDate && (
                    <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-xs text-blue-700 font-bold">🔬 {med.retestInfo}: {med.retestDate}</div>
                    </div>
                  )}

                  <div className="p-3 bg-gray-50 rounded-lg mb-3">
                    <div className="flex items-start gap-2 mb-1.5">
                      <div className="text-sm">🏪</div>
                      <div>
                        <div className="text-xs text-gray-600 font-medium">{med.pharmacy}</div>
                        <div className="text-xs text-gray-400">{med.pharmacyLocation}</div>
                      </div>
                    </div>
                    <button className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Call Pharmacy
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <div className="text-xs uppercase tracking-wide text-gray-400 font-bold mb-2">Monthly Cost:</div>
                    {med.insuranceCovered ? (
                      <>
                        <div className="text-base font-bold text-emerald-600">AED {med.insurancePrice}/month</div>
                        <div className="text-xs text-gray-400 line-through">Full price: AED {med.monthlyPrice}</div>
                        <div className="text-xs text-emerald-600 mt-1 font-medium">{med.insuranceName} — {Math.round((1 - med.insurancePrice / med.monthlyPrice) * 100)}% covered ✓</div>
                      </>
                    ) : (
                      <>
                        <div className="text-base font-bold text-gray-600">AED {med.insurancePrice}/month</div>
                        <div className="text-xs text-gray-400 mt-1">Self-pay (supplement)</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Expand/Collapse button */}
                <button
                  onClick={() => toggleCard(med.id)}
                  className="flex-shrink-0 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
              </div>

              {/* Expanded section */}
              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => setDrugInfoMed(med)}
                      className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      <Info className="w-4 h-4" /> Drug Info
                    </button>
                    <button
                      onClick={() => setReminderMed(med)}
                      className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      <Bell className="w-4 h-4" /> Set Reminder
                    </button>
                    <button
                      onClick={() => setPrescriptionMed(med)}
                      className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" /> Prescription Details
                    </button>
                    <button
                      onClick={() => setRefillMed(med)}
                      className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      <RefreshCw className="w-4 h-4" /> Request Refill
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Modals */}
      {drugInfoMed && <DrugInfoModal med={drugInfoMed} onClose={() => setDrugInfoMed(null)} />}
      {reminderMed && <SetReminderModal med={reminderMed} onClose={() => setReminderMed(null)} />}
      {prescriptionMed && <PrescriptionDetailsModal med={prescriptionMed} onClose={() => setPrescriptionMed(null)} />}
      {refillMed && <RequestRefillModal med={refillMed} onClose={() => setRefillMed(null)} />}
    </div>
  );
}