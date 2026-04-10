import { useState } from 'react';
import { Plus, Apple } from 'lucide-react';
import { format } from 'date-fns';
import { VitalLog } from '../../types/healthRecords';

interface VitalsLogTabProps {
  vitalsLog: VitalLog[];
}

export default function VitalsLogTab({ vitalsLog }: VitalsLogTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    recordedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    systolicBp: '',
    diastolicBp: '',
    heartRate: '',
    bloodSugar: '',
    bloodSugarTiming: 'fasting',
    weight: '',
    temperature: '',
    spo2: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
  };

  const getSourceIcon = (source: string) => {
    if (source === 'apple_health') return '🍎';
    if (source === 'google_fit') return '🏃';
    if (source === 'fitbit') return '⌚';
    return '✍️';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Vitals Log</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Reading</span>
        </button>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Sync from connected devices:</p>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Apple className="w-5 h-5" />
            <span className="text-sm font-medium">Apple Health</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="text-sm font-medium">Google Fit</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <rect x="8" y="4" width="8" height="16" rx="2" />
            </svg>
            <span className="text-sm font-medium">Fitbit</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg p-6 border-2 border-teal-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Record New Vitals</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.recordedAt}
                  onChange={(e) => setFormData({ ...formData, recordedAt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Pressure (mmHg)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Systolic"
                    value={formData.systolicBp}
                    onChange={(e) => setFormData({ ...formData, systolicBp: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="flex items-center text-gray-500">/</span>
                  <input
                    type="number"
                    placeholder="Diastolic"
                    value={formData.diastolicBp}
                    onChange={(e) => setFormData({ ...formData, diastolicBp: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  placeholder="72"
                  value={formData.heartRate}
                  onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Sugar (mg/dL)
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={formData.bloodSugar}
                  onChange={(e) => setFormData({ ...formData, bloodSugar: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timing</label>
                <select
                  value={formData.bloodSugarTiming}
                  onChange={(e) => setFormData({ ...formData, bloodSugarTiming: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="fasting">Fasting</option>
                  <option value="pre_meal">Pre-Meal</option>
                  <option value="post_meal">Post-Meal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="75.5"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="36.6"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SpO2 (%)</label>
                <input
                  type="number"
                  placeholder="98"
                  value={formData.spo2}
                  onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors"
              >
                Save Reading
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                BP
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                HR
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Sugar
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Weight
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                SpO2
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Source
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vitalsLog.map((vital) => (
              <tr key={vital.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {format(vital.recordedAt, 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {vital.systolicBp && vital.diastolicBp
                    ? `${vital.systolicBp}/${vital.diastolicBp}`
                    : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {vital.heartRate ? `${vital.heartRate} bpm` : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {vital.bloodSugar ? `${vital.bloodSugar} mg/dL` : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {vital.weight ? `${vital.weight} kg` : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {vital.spo2 ? `${vital.spo2}%` : '-'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {getSourceIcon(vital.source)} {vital.source.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
