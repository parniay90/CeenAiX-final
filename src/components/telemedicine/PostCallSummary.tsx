import { useState } from 'react';
import { CheckCircle, Sparkles, Send, Calendar, FileText, Shield } from 'lucide-react';
import { AIConsultationSummary } from '../../types/telemedicine';

interface PostCallSummaryProps {
  summary: AIConsultationSummary;
  patientName: string;
  consultationDuration: string;
  onComplete: () => void;
}

export default function PostCallSummary({
  summary,
  patientName,
  consultationDuration,
  onComplete,
}: PostCallSummaryProps) {
  const [soapNotes, setSoapNotes] = useState({
    subjective: `Chief Complaint: ${summary.chiefComplaint}\n\nPatient reports: ${summary.keySymptoms.join(', ')}`,
    objective: '',
    assessment: '',
    plan: summary.recommendedActions.join('\n'),
  });
  const [sendToPatient, setSendToPatient] = useState(true);
  const [sendToNABIDH, setSendToNABIDH] = useState(true);
  const [followUpDate, setFollowUpDate] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-violet-700 to-violet-900 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI-Generated Consultation Summary</h2>
                <p className="text-violet-200 text-sm mt-1">
                  Review and finalize your consultation with {patientName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-violet-200">Duration</div>
              <div className="text-lg font-bold">{consultationDuration}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">SOAP Notes</h3>
              <p className="text-xs text-violet-600 mb-4 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Pre-filled from AI voice transcription - Review and edit as needed
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Subjective
                  </label>
                  <textarea
                    value={soapNotes.subjective}
                    onChange={(e) =>
                      setSoapNotes({ ...soapNotes, subjective: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Objective
                  </label>
                  <textarea
                    value={soapNotes.objective}
                    onChange={(e) =>
                      setSoapNotes({ ...soapNotes, objective: e.target.value })
                    }
                    placeholder="Enter physical examination findings..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Assessment
                  </label>
                  <textarea
                    value={soapNotes.assessment}
                    onChange={(e) =>
                      setSoapNotes({ ...soapNotes, assessment: e.target.value })
                    }
                    placeholder="Enter diagnosis with ICD-10 codes..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Plan</label>
                  <textarea
                    value={soapNotes.plan}
                    onChange={(e) => setSoapNotes({ ...soapNotes, plan: e.target.value })}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {summary.followUpNeeded && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  Schedule Follow-Up Appointment
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-900">
                    <strong>Recommended:</strong> {summary.followUpReason}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Appointment Type
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option>In-person</option>
                      <option>Telemedicine</option>
                    </select>
                  </div>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors">
                  Book Follow-Up Appointment
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Session Summary</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-600 uppercase mb-2">
                    Key Symptoms
                  </h4>
                  <ul className="space-y-1">
                    {summary.keySymptoms.map((symptom, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-teal-600 mt-1">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-600 uppercase mb-2">
                    Patient Concerns
                  </h4>
                  <ul className="space-y-1">
                    {summary.patientConcerns.map((concern, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-600 uppercase mb-2">
                    Actions Taken
                  </h4>
                  <ul className="space-y-1">
                    {summary.recommendedActions.map((action, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                Share Summary
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={sendToPatient}
                    onChange={(e) => setSendToPatient(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">
                      Send to Patient App
                    </div>
                    <div className="text-xs text-gray-600">
                      Patient will receive consultation summary
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={sendToNABIDH}
                    onChange={(e) => setSendToNABIDH(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">
                      Submit to NABIDH
                    </div>
                    <div className="text-xs text-gray-600">
                      Upload to UAE national health records
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={onComplete}
              className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-3"
            >
              <CheckCircle className="w-6 h-6" />
              Complete & Sign Consultation
            </button>

            <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-teal-900 mb-1">
                    DHA Compliance Status
                  </h4>
                  <p className="text-xs text-teal-800">
                    This telemedicine consultation is compliant with DHA regulations. All
                    session recordings are securely stored for 7 years as required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
