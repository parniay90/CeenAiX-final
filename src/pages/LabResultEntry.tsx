import { useState } from 'react';
import OrderDetailsPanel from '../components/labResults/OrderDetailsPanel';
import ResultEntryForm from '../components/labResults/ResultEntryForm';
import MicrobiologySensitivity from '../components/labResults/MicrobiologySensitivity';
import VerificationSection from '../components/labResults/VerificationSection';
import ReleasedResultsView from '../components/labResults/ReleasedResultsView';
import {
  MOCK_LAB_ORDER,
  TestResult,
  MicrobiologyOrganism,
  AntibioticSensitivity,
  VerificationData,
  ResultStatus,
} from '../types/labResults';
import { ArrowLeft } from 'lucide-react';

export default function LabResultEntry() {
  const [order, setOrder] = useState(MOCK_LAB_ORDER);
  const [activeTab, setActiveTab] = useState('chemistry');
  const [results, setResults] = useState<TestResult[]>([]);
  const [microbiologyOrganisms, setMicrobiologyOrganisms] = useState<MicrobiologyOrganism[]>([]);
  const [microbiologySensitivities, setMicrobiologySensitivities] = useState<
    Record<string, AntibioticSensitivity[]>
  >({});

  const categories = [...new Set(order.orderedTests.map((t) => t.category))];

  const handleResultChange = (result: TestResult) => {
    setResults((prev) => {
      const index = prev.findIndex((r) => r.testId === result.testId);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = result;
        return updated;
      }
      return [...prev, result];
    });
  };

  const handleMicrobiologyChange = (
    organisms: MicrobiologyOrganism[],
    sensitivities: Record<string, AntibioticSensitivity[]>
  ) => {
    setMicrobiologyOrganisms(organisms);
    setMicrobiologySensitivities(sensitivities);
  };

  const handleSaveDraft = () => {
    const updatedOrder = {
      ...order,
      results,
      status: 'draft' as ResultStatus,
      auditTrail: [
        ...order.auditTrail,
        {
          action: 'Draft Saved',
          timestamp: new Date(),
          performedBy: 'Maria Santos, MT(ASCP)',
          details: `${results.length} results saved`,
        },
      ],
    };
    setOrder(updatedOrder);
    alert('Results saved as draft');
  };

  const handleVerifyAndRelease = (verification: VerificationData) => {
    const updatedOrder = {
      ...order,
      results,
      status: 'released' as ResultStatus,
      verification,
      releasedAt: new Date(),
      auditTrail: [
        ...order.auditTrail,
        {
          action: 'Results Entered',
          timestamp: new Date(),
          performedBy: verification.technicianName,
          details: `${results.length} test results entered`,
        },
        {
          action: 'Results Verified',
          timestamp: new Date(),
          performedBy: verification.technicianName,
          details: 'Technician verification completed',
        },
        ...(verification.supervisorName
          ? [
              {
                action: 'Supervisor Verification',
                timestamp: new Date(),
                performedBy: verification.supervisorName,
                details: 'Supervisor approval obtained',
              },
            ]
          : []),
        {
          action: 'Results Released',
          timestamp: new Date(),
          performedBy: verification.technicianName,
          details: 'Released to ordering physician',
        },
      ],
    };
    setOrder(updatedOrder);
  };

  const handleReleaseAndSubmit = (verification: VerificationData) => {
    const now = new Date();
    const updatedOrder = {
      ...order,
      results,
      status: 'nabidh_submitted' as ResultStatus,
      verification,
      releasedAt: now,
      nabidhSubmittedAt: new Date(now.getTime() + 2000),
      auditTrail: [
        ...order.auditTrail,
        {
          action: 'Results Entered',
          timestamp: now,
          performedBy: verification.technicianName,
          details: `${results.length} test results entered`,
        },
        {
          action: 'Results Verified',
          timestamp: now,
          performedBy: verification.technicianName,
          details: 'Technician verification completed',
        },
        ...(verification.supervisorName
          ? [
              {
                action: 'Supervisor Verification',
                timestamp: now,
                performedBy: verification.supervisorName,
                details: 'Supervisor approval obtained',
              },
            ]
          : []),
        {
          action: 'Results Released',
          timestamp: now,
          performedBy: verification.technicianName,
          details: 'Released to ordering physician',
        },
        {
          action: 'NABIDH Submission',
          timestamp: new Date(now.getTime() + 2000),
          performedBy: 'System',
          details: 'Successfully submitted to NABIDH HIE',
        },
      ],
    };
    setOrder(updatedOrder);
  };

  const handleNotifyDoctor = () => {
    const now = new Date();
    const updatedOrder = {
      ...order,
      doctorNotifiedAt: now,
      patientNotifiedAt: new Date(now.getTime() + 1000),
      auditTrail: [
        ...order.auditTrail,
        {
          action: 'Doctor Notification Sent',
          timestamp: now,
          performedBy: 'System',
          details: `Alert sent to ${order.patient.referringDoctor} CeenAiX account`,
        },
        {
          action: 'Patient Notification Sent',
          timestamp: new Date(now.getTime() + 1000),
          performedBy: 'System',
          details: 'Results available in patient portal',
        },
      ],
    };
    setOrder(updatedOrder);
    alert('Notification sent to doctor and patient');
  };

  const testsForCategory = order.orderedTests.filter(
    (t) => t.category.toLowerCase() === activeTab
  );

  const hasAbnormalResults = results.some((r) => r.abnormalFlag === 'abnormal');
  const hasCriticalResults = results.some((r) => r.isCritical);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <div className="w-[35%]">
        <OrderDetailsPanel
          patient={order.patient}
          sample={order.sample}
          orderedTests={order.orderedTests}
          clinicalNotes={order.clinicalNotes}
          previousResults={order.previousResults}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-6 py-5 border-b border-teal-800">
          <div className="flex items-center gap-4 mb-3">
            <button className="p-2 hover:bg-teal-600 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Lab Result Entry & Verification</h1>
              <p className="text-teal-100 text-sm font-semibold">
                Sample ID: {order.sample.sampleId} • DHA-Compliant Entry
              </p>
            </div>
          </div>

          {order.status !== 'draft' && (
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <div className="text-xs text-teal-100 uppercase font-bold mb-1">Status</div>
              <div className="text-white font-bold capitalize">{order.status.replace('_', ' ')}</div>
            </div>
          )}
        </div>

        <div className="p-6">
          {order.status === 'draft' ? (
            <>
              <div className="mb-6">
                <div className="flex gap-2 border-b border-slate-300">
                  {categories.map((category) => {
                    const categoryKey = category.toLowerCase();
                    const testCount = order.orderedTests.filter(
                      (t) => t.category.toLowerCase() === categoryKey
                    ).length;
                    return (
                      <button
                        key={categoryKey}
                        onClick={() => setActiveTab(categoryKey)}
                        className={`px-4 py-3 text-sm font-bold transition-colors relative ${
                          activeTab === categoryKey
                            ? 'text-teal-700 border-b-2 border-teal-700'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {category}
                        <span className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs">
                          {testCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-6">
                {activeTab === 'microbiology' ? (
                  <MicrobiologySensitivity onResultChange={handleMicrobiologyChange} />
                ) : (
                  <div>
                    {testsForCategory.length > 0 ? (
                      testsForCategory.map((test) => (
                        <ResultEntryForm
                          key={test.id}
                          test={test}
                          patientAge={order.patient.age}
                          patientGender={order.patient.gender}
                          onResultChange={handleResultChange}
                          existingResult={results.find((r) => r.testId === test.id)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-slate-300">
                        <p className="text-slate-600 font-semibold">No tests in this category</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <VerificationSection
                hasAbnormalResults={hasAbnormalResults}
                hasCriticalResults={hasCriticalResults}
                isStatPriority={order.sample.priority === 'stat'}
                onSaveDraft={handleSaveDraft}
                onVerifyAndRelease={handleVerifyAndRelease}
                onReleaseAndSubmit={handleReleaseAndSubmit}
                onNotifyDoctor={handleNotifyDoctor}
                currentStatus={order.status}
              />
            </>
          ) : (
            <ReleasedResultsView
              auditTrail={order.auditTrail}
              releasedAt={order.releasedAt}
              nabidhSubmittedAt={order.nabidhSubmittedAt}
              doctorNotifiedAt={order.doctorNotifiedAt}
              patientNotifiedAt={order.patientNotifiedAt}
            />
          )}
        </div>
      </div>
    </div>
  );
}
