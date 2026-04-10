import { useState } from 'react';
import PatientBar from '../components/consultation/PatientBar';
import PatientIntelligence from '../components/consultation/PatientIntelligence';
import SOAPEditor from '../components/consultation/SOAPEditor';
import ClinicalAI from '../components/consultation/ClinicalAI';
import ActionBar from '../components/consultation/ActionBar';
import PrescriptionModal from '../components/consultation/PrescriptionModal';
import {
  MOCK_CONSULTATION_PATIENT,
  MOCK_DIFFERENTIAL_DIAGNOSES,
  MOCK_GUIDELINE_ALERTS,
  MOCK_PREVENTIVE_CARE,
} from '../types/consultation';

export default function ConsultationWorkspace() {
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  const handleEndConsultation = () => {
    console.log('End consultation');
  };

  const handleSaveDraft = () => {
    console.log('Save draft');
  };

  const handleOrderLabs = () => {
    console.log('Order labs');
  };

  const handleWritePrescription = () => {
    setIsPrescriptionModalOpen(true);
  };

  const handleCreateReferral = () => {
    console.log('Create referral');
  };

  const handleGenerateSummary = () => {
    console.log('Generate summary');
  };

  const handleCompleteAndSign = () => {
    console.log('Complete and sign');
  };

  const handleSavePrescription = (prescription: any) => {
    console.log('Save prescription:', prescription);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <PatientBar patient={MOCK_CONSULTATION_PATIENT} onEndConsultation={handleEndConsultation} />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/4 min-w-[300px] max-w-[400px]">
          <PatientIntelligence patient={MOCK_CONSULTATION_PATIENT} />
        </div>

        <div className="flex-1 min-w-0">
          <SOAPEditor />
        </div>

        <div className="w-1/4 min-w-[300px] max-w-[400px]">
          <ClinicalAI
            differentials={MOCK_DIFFERENTIAL_DIAGNOSES}
            guidelines={MOCK_GUIDELINE_ALERTS}
            preventiveCare={MOCK_PREVENTIVE_CARE}
          />
        </div>
      </div>

      <ActionBar
        onSaveDraft={handleSaveDraft}
        onOrderLabs={handleOrderLabs}
        onWritePrescription={handleWritePrescription}
        onCreateReferral={handleCreateReferral}
        onGenerateSummary={handleGenerateSummary}
        onCompleteAndSign={handleCompleteAndSign}
      />

      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        onSave={handleSavePrescription}
      />
    </div>
  );
}
