import { useState } from 'react';
import PharmacySidebar from '../components/pharmacy/PharmacySidebar';
import KPIStats from '../components/pharmacy/KPIStats';
import PrescriptionQueue from '../components/pharmacy/PrescriptionQueue';
import PrescriptionDetailDrawer from '../components/pharmacy/PrescriptionDetailDrawer';
import StockAlertsPanel from '../components/pharmacy/StockAlertsPanel';
import DrugInteractionsPanel from '../components/pharmacy/DrugInteractionsPanel';
import QuickActions from '../components/pharmacy/QuickActions';
import UserMenu from '../components/common/UserMenu';
import {
  MOCK_PHARMACY_KPIS,
  MOCK_PRESCRIPTIONS,
  MOCK_STOCK_ALERTS,
  MOCK_DRUG_INTERACTIONS,
  Prescription,
} from '../types/pharmacy';

export default function PharmacyDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSelectPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDrawerOpen(true);
  };

  const handleDispense = (id: string) => {
    console.log('Dispensing prescription:', id);
    setIsDrawerOpen(false);
  };

  const handleOrder = (alertId: string) => {
    console.log('Ordering stock for:', alertId);
  };

  const handleToggleAutoReorder = (alertId: string) => {
    console.log('Toggling auto-reorder for:', alertId);
  };

  const handleContactDoctor = (interactionId: string) => {
    console.log('Contacting doctor for interaction:', interactionId);
  };

  const handleOverride = (interactionId: string) => {
    console.log('Overriding interaction:', interactionId);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <PharmacySidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Pharmacy Dashboard</h1>
            <p className="text-sm text-slate-600">Welcome back, Pharmacist Ahmed</p>
          </div>
          <UserMenu
            userName="Ahmed Al Hassan"
            userRole="Pharmacist"
          />
        </div>

        <div className="flex-1 p-8 overflow-auto">

        <KPIStats kpis={MOCK_PHARMACY_KPIS} />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <PrescriptionQueue
              prescriptions={MOCK_PRESCRIPTIONS}
              onSelectPrescription={handleSelectPrescription}
            />
          </div>

          <div className="space-y-6">
            <StockAlertsPanel
              alerts={MOCK_STOCK_ALERTS}
              onOrder={handleOrder}
              onToggleAutoReorder={handleToggleAutoReorder}
            />

            <DrugInteractionsPanel
              interactions={MOCK_DRUG_INTERACTIONS}
              onContactDoctor={handleContactDoctor}
              onOverride={handleOverride}
            />

            <QuickActions
              onAddPrescription={() => console.log('Add prescription')}
              onCheckAvailability={() => console.log('Check availability')}
              onCounselingLog={() => console.log('Counseling log')}
              onPrintReport={() => console.log('Print report')}
            />
          </div>
        </div>
        </div>
      </div>

      <PrescriptionDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        prescription={selectedPrescription}
        onDispense={handleDispense}
      />
    </div>
  );
}
