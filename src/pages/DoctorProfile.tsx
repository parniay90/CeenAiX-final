import React, { useState, useCallback } from 'react';
import { Eye, FileText, CircleUser as UserCircle, Shield } from 'lucide-react';
import DoctorSidebarNew from '../components/doctor/DoctorSidebarNew';
import DoctorTopBarNew from '../components/doctor/DoctorTopBarNew';
import ToastSystem, { Toast } from '../components/settings/doctor/ToastSystem';
import ProfileHero from '../components/doctor/profile/ProfileHero';
import CompletenessBar from '../components/doctor/profile/CompletenessBar';
import PersonalInfoSection from '../components/doctor/profile/tab1/PersonalInfoSection';
import ProfessionalInfoSection from '../components/doctor/profile/tab1/ProfessionalInfoSection';
import BioSection from '../components/doctor/profile/tab1/BioSection';
import AffiliationsSection from '../components/doctor/profile/tab1/AffiliationsSection';
import FeesInsuranceSection from '../components/doctor/profile/tab1/FeesInsuranceSection';
import BankSecuritySection from '../components/doctor/profile/tab1/BankSecuritySection';
import ReviewsSection from '../components/doctor/profile/tab1/ReviewsSection';
import DangerZone from '../components/doctor/profile/tab1/DangerZone';
import PublicProfilePreview from '../components/doctor/profile/tab2/PublicProfilePreview';
import DhaLicenseSection from '../components/doctor/profile/tab3/DhaLicenseSection';
import CmeTrackerSection from '../components/doctor/profile/tab3/CmeTrackerSection';
import ComplianceDashboard from '../components/doctor/profile/tab3/ComplianceDashboard';

type TabId = 'profile' | 'preview' | 'compliance';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'My Profile', icon: UserCircle },
  { id: 'preview', label: 'Public Preview', icon: Eye },
  { id: 'compliance', label: 'DHA & Compliance', icon: Shield },
];

const DoctorProfile: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [criticalAlert, setCriticalAlert] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <DoctorSidebarNew
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeTab="profile"
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DoctorTopBarNew
          hasCriticalAlert={criticalAlert}
          onAcknowledgeCritical={() => {
            setCriticalAlert(false);
            showToast('Critical alert acknowledged');
          }}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[22px] font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  My Profile
                </h1>
                <p className="text-[13px] text-slate-500 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Manage your professional identity, DHA credentials, and public listing
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => { setActiveTab('preview'); }}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-[13px] text-slate-700 font-medium transition-colors shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Public Profile</span>
                </button>
                <button
                  onClick={() => showToast('Profile PDF export started')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-[13px] text-slate-700 font-medium transition-colors shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            <ProfileHero showToast={showToast} />
            <CompletenessBar onAddBio={() => setActiveTab('profile')} />

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1.5">
              <div className="flex space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                        activeTab === tab.id
                          ? 'bg-[#0A1628] text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="transition-all duration-200">
              {activeTab === 'profile' && (
                <div className="grid grid-cols-5 gap-5">
                  <div className="col-span-3 space-y-4">
                    <PersonalInfoSection showToast={showToast} />
                    <ProfessionalInfoSection showToast={showToast} />
                    <BioSection showToast={showToast} />
                    <AffiliationsSection showToast={showToast} />
                    <FeesInsuranceSection showToast={showToast} />
                  </div>
                  <div className="col-span-2 space-y-4">
                    <BankSecuritySection showToast={showToast} />
                    <ReviewsSection showToast={showToast} />
                    <DangerZone showToast={showToast} />
                  </div>
                </div>
              )}

              {activeTab === 'preview' && (
                <PublicProfilePreview
                  bio="Dr. Ahmed Al Rashidi is a Consultant Cardiologist specialising in interventional cardiology at Al Noor Medical Center in Dubai. With over 22 years of clinical experience, he holds dual fellowship from the European Society of Cardiology (FESC) and the American College of Cardiology (ACC). Dr. Al Rashidi completed his specialty training at King's College Hospital, London, and returned to the UAE to serve the community. He is proficient in complex percutaneous coronary interventions, structural heart disease, and cardiac imaging."
                  showToast={showToast}
                  onEditTab={() => setActiveTab('profile')}
                />
              )}

              {activeTab === 'compliance' && (
                <div className="grid grid-cols-5 gap-5">
                  <div className="col-span-3 space-y-4">
                    <DhaLicenseSection showToast={showToast} />
                    <CmeTrackerSection showToast={showToast} />
                  </div>
                  <div className="col-span-2">
                    <ComplianceDashboard showToast={showToast} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <ToastSystem toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default DoctorProfile;
