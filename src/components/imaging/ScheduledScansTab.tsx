import { useState } from 'react';
import { Calendar, MapPin, Phone, Clock, CreditCard, AlertCircle, CheckCircle, X } from 'lucide-react';
import type { ScheduledScan } from '../../types/patientImaging';

interface ScheduledScansTabProps {
  scheduledScans: ScheduledScan[];
}

export default function ScheduledScansTab({ scheduledScans }: ScheduledScansTabProps) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedModality, setSelectedModality] = useState<string>('');
  const [requestReason, setRequestReason] = useState('');

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case 'CT':
        return '#0891b2';
      case 'MRI':
        return '#7c3aed';
      case 'X-Ray':
        return '#64748b';
      case 'Ultrasound':
        return '#0d9488';
      case 'Echo':
        return '#2563eb';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Scheduled Imaging Studies</h3>
          <p className="text-sm text-slate-500">Upcoming scans and imaging appointments</p>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Request New Scan
        </button>
      </div>

      {scheduledScans.map((scan, idx) => {
        const modalityColor = getModalityColor(scan.modality);

        return (
          <div
            key={scan.id}
            style={{ animationDelay: `${idx * 80}ms`, borderLeftColor: modalityColor }}
            className="bg-white rounded-2xl shadow-sm border-l-[5px] animate-slideUp overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-6">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: modalityColor }}
                >
                  {scan.modality}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{scan.studyType}</h4>
                      <div className="text-sm text-slate-600 mt-1">{scan.bodyPart}</div>
                    </div>
                    {scan.confirmed && (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Confirmed
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        <span className="text-xs font-bold text-teal-900">Date & Time</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{scan.scheduledDate}</div>
                      <div className="text-sm text-slate-600">{scan.scheduledTime}</div>
                      <div className="text-xs text-slate-500 mt-1">Duration: {scan.estimatedDuration}</div>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-blue-900">Location</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{scan.facility}</div>
                      <div className="text-xs text-slate-600">{scan.facilityAddress}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Phone className="w-3 h-3" />
                        {scan.facilityPhone}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg mb-4">
                    <div className="text-xs font-bold text-slate-600 mb-2">Clinical Indication</div>
                    <p className="text-sm text-slate-700">{scan.indication}</p>
                    <div className="text-xs text-slate-500 mt-2">
                      Ordered by: {scan.orderedBy}, {scan.orderedBySpecialty} ({scan.orderDate})
                    </div>
                  </div>

                  {scan.contrast && scan.contrastInstructions && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-amber-900">Contrast Agent Will Be Used</span>
                      </div>
                      <p className="text-sm text-amber-800">{scan.contrastInstructions}</p>
                    </div>
                  )}

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg mb-4">
                    <div className="text-xs font-bold text-blue-900 mb-3">Preparation Instructions</div>
                    <ul className="space-y-2">
                      {scan.preparationInstructions.map((instruction, instIdx) => (
                        <li key={instIdx} className="flex items-start gap-2 text-sm text-blue-800">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-teal-600" />
                      <span className="text-xs font-bold text-teal-900">Cost & Insurance</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-slate-500">Total Cost</div>
                        <div className="text-sm text-slate-400 line-through">AED {scan.cost}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Daman Covers</div>
                        <div className="text-sm font-bold text-emerald-600">AED {scan.insuranceCoverage} (90%)</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">You Pay</div>
                        <div className="text-lg font-bold text-teal-600">AED {scan.patientCost}</div>
                      </div>
                    </div>
                    <div className="text-xs text-teal-700 mt-2">
                      Insurance will be billed directly at the facility
                    </div>
                  </div>

                  {scan.bookingRef && (
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="text-xs font-bold text-emerald-900 mb-1">Booking Reference</div>
                      <div className="text-sm font-mono font-bold text-emerald-700">{scan.bookingRef}</div>
                      <div className="text-xs text-emerald-600 mt-1">
                        Show this reference number when you arrive at the facility
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 flex gap-3">
                <button className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                  Add to Calendar
                </button>
                <button className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                  Get Directions
                </button>
                <button className="flex-1 px-6 py-3 border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium">
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {scheduledScans.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Scheduled Scans</h3>
          <p className="text-sm text-slate-500 mb-6">You don't have any upcoming imaging appointments</p>
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Request New Scan
          </button>
        </div>
      )}

      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Request New Imaging Study</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Type of Scan Needed</label>
                <select
                  value={selectedModality}
                  onChange={(e) => setSelectedModality(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select scan type...</option>
                  <option value="CT">CT Scan</option>
                  <option value="MRI">MRI</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="Ultrasound">Ultrasound</option>
                  <option value="Echo">Echocardiogram</option>
                  <option value="Mammography">Mammography</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Request</label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  rows={4}
                  placeholder="Please describe your symptoms or reason for requesting this scan..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-amber-900 mb-1">Important Note</div>
                    <p className="text-sm text-amber-800">
                      All imaging requests require approval from your primary care doctor or specialist. Your request will be reviewed within 24-48 hours, and you'll be contacted to schedule the appointment if approved.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
        <p className="text-sm text-cyan-800">
          All scheduled imaging studies are connected to the Dubai Nabidh HIE. Your results will automatically be available to your healthcare providers across the UAE.
        </p>
      </div>
    </div>
  );
}
