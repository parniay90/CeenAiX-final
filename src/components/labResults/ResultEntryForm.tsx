import { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import {
  TestResult,
  OrderedTest,
  calculateReferenceRange,
  determineAbnormalFlag,
  AVAILABLE_INSTRUMENTS,
} from '../../types/labResults';

interface ResultEntryFormProps {
  test: OrderedTest;
  patientAge: number;
  patientGender: 'male' | 'female';
  onResultChange: (result: TestResult) => void;
  existingResult?: TestResult;
}

export default function ResultEntryForm({
  test,
  patientAge,
  patientGender,
  onResultChange,
  existingResult,
}: ResultEntryFormProps) {
  const [resultValue, setResultValue] = useState(existingResult?.resultValue || '');
  const [instrument, setInstrument] = useState(existingResult?.instrument || '');
  const [method, setMethod] = useState(existingResult?.method || 'Automated');
  const [comment, setComment] = useState(existingResult?.comment || '');
  const [qcPassed, setQcPassed] = useState(existingResult?.qcPassed || false);
  const [qcLotNumber, setQcLotNumber] = useState(existingResult?.qcLotNumber || '');

  const referenceRange = calculateReferenceRange(test.testName, patientAge, patientGender);

  const rangeText = referenceRange.text
    ? referenceRange.text
    : `${referenceRange.min} - ${referenceRange.max}`;

  const unit = getTestUnit(test.testName);

  const abnormalFlag =
    resultValue && !isNaN(parseFloat(resultValue))
      ? determineAbnormalFlag(parseFloat(resultValue), referenceRange)
      : 'normal';

  const isCritical = abnormalFlag === 'critical';

  const handleValueChange = (value: string) => {
    setResultValue(value);
    updateResult(value, instrument, method, comment, qcPassed, qcLotNumber);
  };

  const handleInstrumentChange = (inst: string) => {
    setInstrument(inst);
    updateResult(resultValue, inst, method, comment, qcPassed, qcLotNumber);
  };

  const handleMethodChange = (meth: string) => {
    setMethod(meth);
    updateResult(resultValue, instrument, meth, comment, qcPassed, qcLotNumber);
  };

  const handleCommentChange = (comm: string) => {
    setComment(comm);
    updateResult(resultValue, instrument, method, comm, qcPassed, qcLotNumber);
  };

  const handleQcChange = (passed: boolean) => {
    setQcPassed(passed);
    updateResult(resultValue, instrument, method, comment, passed, qcLotNumber);
  };

  const handleQcLotChange = (lot: string) => {
    setQcLotNumber(lot);
    updateResult(resultValue, instrument, method, comment, qcPassed, lot);
  };

  const updateResult = (
    value: string,
    inst: string,
    meth: string,
    comm: string,
    qc: boolean,
    lot: string
  ) => {
    const flag =
      value && !isNaN(parseFloat(value))
        ? determineAbnormalFlag(parseFloat(value), referenceRange)
        : 'normal';

    const result: TestResult = {
      id: existingResult?.id || `result-${test.id}`,
      testId: test.id,
      testName: test.testName,
      cptCode: test.cptCode,
      category: test.category,
      method: meth,
      instrument: inst,
      resultValue: value,
      unit: unit,
      referenceRange: referenceRange,
      referenceRangeText: rangeText,
      abnormalFlag: flag,
      isCritical: flag === 'critical',
      comment: comm,
      qcPassed: qc,
      qcLotNumber: lot,
    };

    onResultChange(result);
  };

  const getBorderStyle = () => {
    if (abnormalFlag === 'critical') return 'border-rose-400 border-2';
    if (abnormalFlag === 'abnormal') return 'border-amber-400 border-2';
    return 'border-slate-300';
  };

  const filteredInstruments = AVAILABLE_INSTRUMENTS.filter(
    (i) => i.category === test.category.toLowerCase()
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-slate-900">{test.testName}</h4>
            <span className="text-xs font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              {test.cptCode}
            </span>
          </div>
          <div className="text-xs text-slate-600">{test.category}</div>
        </div>
        {isCritical && (
          <div className="flex items-center gap-1 bg-rose-100 text-rose-900 px-3 py-1 rounded-full border border-rose-300">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-bold">CRITICAL</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Method</label>
          <select
            value={method}
            onChange={(e) => handleMethodChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="Automated">Automated</option>
            <option value="Manual">Manual</option>
            <option value="Semi-Automated">Semi-Automated</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Instrument</label>
          <select
            value={instrument}
            onChange={(e) => handleInstrumentChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select instrument...</option>
            {filteredInstruments.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-bold text-slate-700 mb-1">Result Value</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={resultValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Enter result..."
            className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${getBorderStyle()}`}
          />
          <div className="text-sm font-semibold text-slate-700 min-w-[60px]">{unit}</div>
        </div>
        <div className="text-xs text-slate-600 mt-1">
          Reference Range: {rangeText} {unit}
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-bold text-slate-700 mb-1">Comment (Optional)</label>
        <textarea
          value={comment}
          onChange={(e) => handleCommentChange(e.target.value)}
          placeholder="Add any relevant notes or interpretations..."
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={qcPassed}
              onChange={(e) => handleQcChange(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-xs font-bold text-slate-700">QC Passed for this run</span>
          </label>
          {qcPassed && <CheckCircle className="w-4 h-4 text-green-600" />}
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">QC Lot Number</label>
          <input
            type="text"
            value={qcLotNumber}
            onChange={(e) => handleQcLotChange(e.target.value)}
            placeholder="Enter QC lot number..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
    </div>
  );
}

function getTestUnit(testName: string): string {
  const units: Record<string, string> = {
    'Glucose, Blood': 'mg/dL',
    Potassium: 'mmol/L',
    Sodium: 'mmol/L',
    Magnesium: 'mg/dL',
    Creatinine: 'mg/dL',
  };
  return units[testName] || 'units';
}
