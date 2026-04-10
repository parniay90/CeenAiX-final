import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import PatientPrescriberPanel from '../components/dispensing/PatientPrescriberPanel';
import MedicationsPanel from '../components/dispensing/MedicationsPanel';
import ActionsPanel from '../components/dispensing/ActionsPanel';
import DispenseConfirmation from '../components/dispensing/DispenseConfirmation';
import { MOCK_DISPENSING_RECORD, MedicationItem, PaymentMethod } from '../types/dispensing';

export default function PrescriptionDispensing() {
  const [record, setRecord] = useState(MOCK_DISPENSING_RECORD);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleUpdateMedication = (id: string, updates: Partial<MedicationItem>) => {
    setRecord((prev) => ({
      ...prev,
      medications: prev.medications.map((med) =>
        med.id === id ? { ...med, ...updates } : med
      ),
    }));
  };

  const handleRequestPreAuth = (id: string) => {
    console.log('Requesting pre-authorization for medication:', id);
  };

  const handleCounselingNotesChange = (notes: string) => {
    setRecord((prev) => ({ ...prev, counselingNotes: notes }));
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setRecord((prev) => ({ ...prev, paymentMethod: method }));
  };

  const handleToggleCounselingPoint = (id: string) => {
    setRecord((prev) => ({
      ...prev,
      counselingPoints: prev.counselingPoints.map((point) =>
        point.id === id ? { ...point, checked: !point.checked } : point
      ),
    }));
  };

  const handleDispense = (pin: string) => {
    console.log('Dispensing with PIN:', pin);
    setRecord((prev) => ({
      ...prev,
      pharmacistPin: pin,
      dispensedAt: new Date(),
      dhaSubmitted: true,
      dhaSubmissionTime: new Date(),
    }));
    setShowConfirmation(true);
  };

  const handleHold = (reason: string) => {
    console.log('Putting prescription on hold:', reason);
  };

  const handleReferBack = (message: string) => {
    console.log('Referring back to doctor:', message);
  };

  const handleToggleSendToApp = () => {
    setRecord((prev) => ({ ...prev, sendToPatientApp: !prev.sendToPatientApp }));
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const hasControlledSubstance = record.medications.some(
    (med) => med.status === 'controlled_substance'
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Prescription Dispensing</h1>
            <p className="text-sm text-slate-600">
              Rx# <span className="font-mono font-semibold">{record.prescriptionId}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        <div className="w-[30%]">
          <PatientPrescriberPanel
            patient={record.patient}
            prescriber={record.prescriber}
            nabidheConnected={record.nabidheConnected}
          />
        </div>

        <div className="w-[45%]">
          <MedicationsPanel
            medications={record.medications}
            onUpdateMedication={handleUpdateMedication}
            onRequestPreAuth={handleRequestPreAuth}
            counselingNotes={record.counselingNotes}
            onCounselingNotesChange={handleCounselingNotesChange}
          />
        </div>

        <div className="w-[25%]">
          <ActionsPanel
            totalAmount={record.totalAmount}
            insuranceCoverage={record.insuranceCoverage}
            patientPayment={record.patientPayment}
            paymentMethod={record.paymentMethod}
            onPaymentMethodChange={handlePaymentMethodChange}
            counselingPoints={record.counselingPoints}
            onToggleCounselingPoint={handleToggleCounselingPoint}
            onDispense={handleDispense}
            onHold={handleHold}
            onReferBack={handleReferBack}
            hasControlledSubstance={hasControlledSubstance}
          />
        </div>
      </div>

      <DispenseConfirmation
        isOpen={showConfirmation}
        rxNumber={record.prescriptionId}
        dispensedAt={record.dispensedAt || new Date()}
        dhaSubmitted={record.dhaSubmitted}
        sendToPatientApp={record.sendToPatientApp}
        onToggleSendToApp={handleToggleSendToApp}
        onClose={handleCloseConfirmation}
      />
    </div>
  );
}
