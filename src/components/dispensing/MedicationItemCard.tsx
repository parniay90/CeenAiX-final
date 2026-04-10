import { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Shield,
  Languages,
  DollarSign,
  Package,
  Calendar,
} from 'lucide-react';
import { MedicationItem } from '../../types/dispensing';

interface MedicationItemCardProps {
  medication: MedicationItem;
  onUpdate: (id: string, updates: Partial<MedicationItem>) => void;
  onRequestPreAuth: (id: string) => void;
}

export default function MedicationItemCard({
  medication,
  onUpdate,
  onRequestPreAuth,
}: MedicationItemCardProps) {
  const [showArabic, setShowArabic] = useState(false);
  const [selectedGeneric, setSelectedGeneric] = useState<string | null>(null);

  const interactionColors = {
    safe: { bg: 'bg-green-100', text: 'text-green-800', icon: 'text-green-600' },
    monitor: { bg: 'bg-amber-100', text: 'text-amber-800', icon: 'text-amber-600' },
    major: { bg: 'bg-rose-100', text: 'text-rose-800', icon: 'text-rose-600' },
  };

  const statusColors = {
    available: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
    out_of_stock: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800' },
    partial: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
    controlled_substance: { bg: 'bg-violet-50', border: 'border-violet-300', text: 'text-violet-900' },
  };

  const statusLabels = {
    available: 'Available',
    out_of_stock: 'Out of Stock',
    partial: 'Partial Stock',
    controlled_substance: 'Controlled Substance',
  };

  const colors = interactionColors[medication.interactionLevel];
  const statusStyle = statusColors[medication.status];

  return (
    <div className={`bg-white rounded-lg border-2 ${statusStyle.border} shadow-sm p-5`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-lg font-bold text-slate-900">{medication.drugName}</h4>
            {medication.onDHAFormulary && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-100 text-teal-800 rounded text-xs font-bold">
                <Shield className="w-3 h-3" />
                DHA Formulary
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mb-1">{medication.genericName}</p>
          <div className="flex items-center gap-2">
            <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
              {statusLabels[medication.status]}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${colors.bg} ${colors.text}`}>
              {medication.interactionLevel === 'safe' && <CheckCircle className="w-3 h-3" />}
              {medication.interactionLevel === 'monitor' && <AlertTriangle className="w-3 h-3" />}
              {medication.interactionLevel === 'major' && <AlertCircle className="w-3 h-3" />}
              {medication.interactionLevel.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900">AED {medication.price.toFixed(2)}</div>
          {medication.coverageStatus === 'co_pay' && medication.patientCopay > 0 && (
            <div className="text-sm text-amber-700 font-semibold">
              Co-pay: AED {medication.patientCopay.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {medication.interactionDetails && (
        <div className={`${colors.bg} border ${colors.bg.replace('100', '200')} rounded-lg p-3 mb-4`}>
          <p className={`text-sm ${colors.text} font-semibold`}>{medication.interactionDetails}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <span className="text-slate-600 font-semibold">Strength:</span>
          <span className="ml-2 text-slate-900">{medication.strength}</span>
        </div>
        <div>
          <span className="text-slate-600 font-semibold">Dose:</span>
          <span className="ml-2 text-slate-900">{medication.dose}</span>
        </div>
        <div>
          <span className="text-slate-600 font-semibold">Frequency:</span>
          <span className="ml-2 text-slate-900">{medication.frequency}</span>
        </div>
        <div>
          <span className="text-slate-600 font-semibold">Duration:</span>
          <span className="ml-2 text-slate-900">{medication.duration}</span>
        </div>
        <div className="col-span-2">
          <span className="text-slate-600 font-semibold">Prescribed Quantity:</span>
          <span className="ml-2 text-slate-900 font-bold">{medication.quantity}</span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 uppercase">Instructions</span>
          <button
            onClick={() => setShowArabic(!showArabic)}
            className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Languages className="w-3 h-3" />
            {showArabic ? 'English' : 'عربي'}
          </button>
        </div>
        <p className={`text-sm text-slate-900 ${showArabic ? 'text-right' : ''}`}>
          {showArabic ? medication.instructionsArabic : medication.instructions}
        </p>
      </div>

      {medication.genericSubstitutionAllowed && medication.genericOptions && medication.genericOptions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="text-xs font-bold text-blue-900 uppercase mb-2">
            Generic Substitution Available
          </div>
          <div className="space-y-2">
            {medication.genericOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-center justify-between p-2 border rounded cursor-pointer transition-colors ${
                  selectedGeneric === option.id
                    ? 'bg-blue-100 border-blue-400'
                    : 'bg-white border-blue-200 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`generic-${medication.id}`}
                    checked={selectedGeneric === option.id}
                    onChange={() => setSelectedGeneric(option.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{option.name}</div>
                    <div className="text-xs text-slate-600">{option.manufacturer}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900">AED {option.price.toFixed(2)}</div>
                  {option.inStock ? (
                    <div className="text-xs text-green-700 font-semibold">In Stock</div>
                  ) : (
                    <div className="text-xs text-rose-700 font-semibold">Out of Stock</div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
            Dispense Qty
          </label>
          <input
            type="number"
            value={medication.dispensedQuantity}
            onChange={(e) =>
              onUpdate(medication.id, { dispensedQuantity: parseInt(e.target.value) })
            }
            max={medication.quantity}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
            Batch Number
          </label>
          <input
            type="text"
            value={medication.batchNumber}
            onChange={(e) => onUpdate(medication.id, { batchNumber: e.target.value })}
            placeholder="BTH-12345"
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
            Expiry Date
          </label>
          <input
            type="date"
            value={medication.expiryDate}
            onChange={(e) => onUpdate(medication.id, { expiryDate: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-3">
        <div className="text-xs font-bold text-slate-700 uppercase mb-2">Coverage Status</div>
        <div className="flex items-center justify-between">
          <div>
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                medication.coverageStatus === 'covered'
                  ? 'bg-green-100 text-green-800'
                  : medication.coverageStatus === 'co_pay'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {medication.coverageStatus === 'covered' && 'Fully Covered'}
              {medication.coverageStatus === 'co_pay' && 'Co-payment Required'}
              {medication.coverageStatus === 'not_covered' && 'Not Covered'}
            </span>
          </div>
          {medication.preAuthRequired && (
            <button
              onClick={() => onRequestPreAuth(medication.id)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Request Pre-Auth
            </button>
          )}
        </div>
      </div>

      {medication.status === 'controlled_substance' && (
        <div className="mt-4 bg-violet-50 border-2 border-violet-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-violet-700" />
            <h4 className="text-sm font-bold text-violet-900 uppercase">
              Controlled Substance - Additional Verification Required
            </h4>
          </div>
          <div className="space-y-2 text-sm text-violet-900">
            <p className="font-semibold">Required before dispensing:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Patient Emirates ID scan verification</li>
              <li>Pharmacist log entry with batch and quantity</li>
              <li>DHA controlled substance reporting</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
