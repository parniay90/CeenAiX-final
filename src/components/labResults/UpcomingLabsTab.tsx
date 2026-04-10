import { useState } from 'react';
import { Calendar, FlaskConical, CreditCard, CheckCircle } from 'lucide-react';
import type { UpcomingLabOrder } from '../../types/patientLabResults';

interface UpcomingLabsTabProps {
  order: UpcomingLabOrder;
}

export default function UpcomingLabsTab({ order }: UpcomingLabsTabProps) {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedLab, setSelectedLab] = useState('dubai-medical-lab');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [booked, setBooked] = useState(false);

  const totalCost = order.tests.reduce((sum, t) => sum + t.cost, 0);
  const totalInsurance = order.tests.reduce((sum, t) => sum + t.insuranceCoverage, 0);
  const totalPatientCost = order.tests.reduce((sum, t) => sum + t.patientCost, 0);
  const fastingTests = order.tests.filter(t => t.fastingRequired);

  const handleBooking = () => {
    setBooked(true);
  };

  if (booked) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-fadeIn">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-playfair font-bold text-emerald-700 mb-2">Appointment Confirmed! 🎉</h3>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mt-6 text-left">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Lab:</span>
              <span className="text-sm font-bold text-slate-900">Dubai Medical Laboratory</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Date:</span>
              <span className="text-sm font-bold text-slate-900">Thursday, 10 April 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Time:</span>
              <span className="text-sm font-bold text-slate-900">{selectedTime} AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Address:</span>
              <span className="text-sm font-bold text-slate-900">Healthcare City, Dubai</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-emerald-200">
              <span className="text-sm text-slate-600">Booking Ref:</span>
              <span className="text-sm font-mono font-bold text-slate-900">LAB-20260407-0891</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800 font-bold">🍽️ Fasting Reminder: Stop eating by 10 PM tonight</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center mt-6">
          <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
            + Add to Calendar 📅
          </button>
          <button className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
            ← Back to Lab Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-amber-600" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-playfair font-bold text-amber-900 mb-1">
              ⏰ Lab Tests Due Before April 15, 2026
            </h3>
            <div className="text-sm text-amber-700 mb-3">
              Ordered by {order.orderedBy} — {order.orderedBySpecialty}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {order.tests.map((test, idx) => (
                <div key={idx} className="px-3 py-1 bg-white border border-amber-300 text-amber-700 rounded-full text-xs font-bold">
                  {test.name}
                </div>
              ))}
            </div>

            <div className="mb-4">
              <div className="text-xs text-amber-700 mb-2">⏱ {order.daysRemaining} days remaining until deadline</div>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-800"
                  style={{ width: `${((30 - order.daysRemaining) / 30) * 100}%` }}
                />
              </div>
              <div className="text-xs text-amber-600 mt-1">
                (Dr. Ahmed ordered {order.orderDate} — due {order.dueDate})
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Ordered Tests</h4>

        <div className="space-y-3">
          {order.tests.map((test, idx) => (
            <div
              key={idx}
              style={{ animationDelay: `${idx * 60}ms` }}
              className="p-4 bg-slate-50 rounded-lg animate-slideUp"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FlaskConical className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">{test.name}</div>
                    <div className="text-xs text-slate-500">{test.description}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">LOINC: {test.loinc}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-slate-600">
                    AED {test.cost} · Daman: AED {test.insuranceCoverage}
                  </div>
                  <div className="text-sm font-bold text-teal-600">You pay: AED {test.patientCost}</div>
                  {test.fastingRequired && (
                    <div className="mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-bold">
                      🍽️ FASTING REQUIRED
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Total if self-pay:</span>
            <span className="text-sm text-slate-400 line-through">AED {totalCost}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Daman Gold covers:</span>
            <span className="text-sm text-emerald-600 font-bold">AED {totalInsurance} (90%)</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-teal-200">
            <span className="text-base font-bold text-slate-900">YOUR COST:</span>
            <span className="text-2xl font-mono font-bold text-teal-600">AED {totalPatientCost}</span>
          </div>
          <div className="mt-2 text-xs text-teal-700">
            💳 Daman will be billed directly at the lab
          </div>
        </div>

        {fastingTests.length > 0 && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h5 className="text-sm font-bold text-amber-900 mb-2">📋 Fasting Instructions</h5>
            <p className="text-sm text-amber-800 mb-3">
              {fastingTests.length} of your tests require fasting. Book a morning appointment and stop eating from 10 PM the night before.
            </p>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>☐ Stop eating by: 10:00 PM the night before</li>
              <li>☐ You CAN drink: plain water, no sugar/milk</li>
              <li>☐ Arrive at lab: Morning (8:00–9:00 AM recommended)</li>
              <li>☐ Bring: Emirates ID + Insurance card</li>
            </ul>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() => setShowBooking(!showBooking)}
            className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-bold text-sm"
          >
            📅 Book at Dubai Medical Lab
          </button>
        </div>

        {showBooking && (
          <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h5 className="text-sm font-bold text-slate-900 mb-4">Book Your Appointment</h5>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Preferred Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Preferred Time (Morning recommended for fasting tests)</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="08:00">8:00 AM (Recommended)</option>
                  <option value="08:30">8:30 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="09:30">9:30 AM</option>
                  <option value="10:00">10:00 AM</option>
                </select>
              </div>

              <button
                onClick={handleBooking}
                className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-bold"
              >
                Confirm Lab Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
