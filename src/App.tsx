import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorPortal from './pages/DoctorPortal';
import DoctorAppointments from './pages/DoctorAppointments';
import AdminDashboard from './pages/AdminDashboard';
import AdminPatients from './pages/AdminPatients';
import AdminDoctors from './pages/AdminDoctors';
import AdminInsurance from './pages/AdminInsurance';
import AdminAIAnalytics from './pages/AdminAIAnalytics';
import AdminProfile from './pages/AdminProfile';
import AdminSettingsAccount from './pages/AdminSettingsAccount';
import AdminSettingsSecurity from './pages/AdminSettingsSecurity';
import AdminSettingsNotifications from './pages/AdminSettingsNotifications';
import AdminAuditMe from './pages/AdminAuditMe';
import AdminSettingsApiKeys from './pages/AdminSettingsApiKeys';
import AdminSystemStatus from './pages/AdminSystemStatus';
import AdminSystemChangelog from './pages/AdminSystemChangelog';
import AdminSupport from './pages/AdminSupport';
import AdminWorkspaces from './pages/AdminWorkspaces';
import AdminIntegrations from './pages/AdminIntegrations';
import AdminIntegrationDetail from './pages/AdminIntegrationDetail';
import PharmacyDashboard from './pages/PharmacyDashboard';
import PharmacyPortal from './pages/pharmacy/PharmacyPortal';
import DiagnosticsPortal from './pages/DiagnosticsPortal';
import LaboratoryDashboard from './pages/LaboratoryDashboard';
import LabRadPortal from './pages/labradiology/LabRadPortal';
import MyHealth from './pages/MyHealth';
import Appointments from './pages/Appointments';
import Medications from './pages/Medications';
import LabResults from './pages/LabResults';
import Imaging from './pages/Imaging';
import ConsultationWorkspace from './pages/ConsultationWorkspace';
import TelemedicineConsultation from './pages/TelemedicineConsultation';
import PrescriptionDispensing from './pages/PrescriptionDispensing';
import InventoryManagement from './pages/InventoryManagement';
import LabResultEntry from './pages/LabResultEntry';
import UserManagement from './pages/UserManagement';
import OrganizationManagement from './pages/OrganizationManagement';
import SecureMessaging from './pages/SecureMessaging';
import Settings from './pages/Settings';
import NotificationCenter from './pages/NotificationCenter';
import AIAssistant from './pages/AIAssistant';
import AIAnalytics from './pages/AIAnalytics';
import InsurancePortal from './pages/InsurancePortal';
import InsuranceDashboard from './pages/InsuranceDashboard';
import ComplianceAudit from './pages/ComplianceAudit';
import SystemHealthIntegrations from './pages/SystemHealthIntegrations';
import Documents from './pages/Documents';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import PatientProfile from './pages/PatientProfile';
import PatientInsurance from './pages/PatientInsurance';
import TodaysAppointments from './pages/TodaysAppointments';
import PatientRecords from './pages/PatientRecords';
import WritePrescription from './pages/WritePrescription';
import LabReferrals from './pages/LabReferrals';
import DoctorImaging from './pages/DoctorImaging';
import DoctorEarnings from './pages/DoctorEarnings';
import DoctorSettings from './pages/DoctorSettings';
import DoctorProfile from './pages/DoctorProfile';
import RoleLogin from './pages/RoleLogin';

function App() {
  const [view, setView] = useState<string>('landing');

  useEffect(() => {
    const updateView = () => {
      const path = window.location.pathname;

      if (path === '/') {
        setView('landing');
      } else if (path === '/login') {
        setView('login');
      } else if (path === '/dashboard' || path === '/patient-dashboard' || path === '/patient/home') {
        setView('patient-home');
      } else if (path === '/doctor/dashboard') {
        setView('doctor-dashboard');
      } else if (path === '/doctor/appointments') {
        setView('doctor-appointments');
      } else if (path === '/doctor/today') {
        setView('doctor-today');
      } else if (path === '/doctor/patients' || path.startsWith('/doctor/patients/')) {
        setView('doctor-patients');
      } else if (path === '/doctor/prescribe') {
        setView('doctor-prescribe');
      } else if (path === '/doctor/labs') {
        setView('doctor-labs');
      } else if (path === '/doctor/imaging') {
        setView('doctor-imaging');
      } else if (path === '/doctor/earnings') {
        setView('doctor-earnings');
      } else if (path === '/doctor/settings') {
        setView('doctor-settings');
      } else if (path === '/doctor/profile') {
        setView('doctor-profile');
      } else if (path === '/admin/dashboard') {
        setView('admin-dashboard');
      } else if (path === '/admin/patients') {
        setView('admin-patients');
      } else if (path === '/admin/doctors') {
        setView('admin-doctors');
      } else if (path === '/admin/insurance') {
        setView('admin-insurance');
      } else if (path === '/admin/ai') {
        setView('admin-ai');
      } else if (path === '/admin/profile') {
        setView('admin-profile');
      } else if (path === '/admin/settings/account') {
        setView('admin-settings-account');
      } else if (path === '/admin/settings/security') {
        setView('admin-settings-security');
      } else if (path === '/admin/settings/notifications') {
        setView('admin-settings-notifications');
      } else if (path === '/admin/audit/me') {
        setView('admin-audit-me');
      } else if (path === '/admin/settings/api-keys') {
        setView('admin-settings-api-keys');
      } else if (path === '/admin/system/status') {
        setView('admin-system-status');
      } else if (path === '/admin/system/changelog') {
        setView('admin-system-changelog');
      } else if (path === '/admin/support') {
        setView('admin-support');
      } else if (path === '/admin/workspaces') {
        setView('admin-workspaces');
      } else if (path.startsWith('/admin/integrations/')) {
        setView('admin-integration-detail');
      } else if (path === '/admin/integrations') {
        setView('admin-integrations');
      } else if (path === '/pharmacy/dashboard' || path.startsWith('/pharmacy/')) {
        setView('pharmacy-portal');
      } else if (path === '/diagnostics/dashboard' || path.startsWith('/diagnostics/')) {
        setView('diagnostics-portal');
      } else if (path.startsWith('/lab/')) {
        setView('lab-rad-portal');
      } else if (path === '/my-health') {
        setView('my-health');
      } else if (path === '/appointments') {
        setView('appointments');
      } else if (path === '/medications') {
        setView('medications');
      } else if (path === '/lab-results') {
        setView('lab-results');
      } else if (path === '/imaging') {
        setView('imaging');
      } else if (path === '/documents') {
        setView('documents');
      } else if (path === '/consultation') {
        setView('consultation');
      } else if (path === '/telemedicine') {
        setView('telemedicine');
      } else if (path === '/pharmacy/dispensing') {
        setView('dispensing');
      } else if (path === '/inventory') {
        setView('inventory');
      } else if (path === '/lab/results') {
        setView('lab-results');
      } else if (path === '/admin/users') {
        setView('user-management');
      } else if (path === '/admin/organizations') {
        setView('organization-management');
      } else if (path === '/messages') {
        setView('messaging');
      } else if (path === '/doctor/messages') {
        setView('doctor-messages');
      } else if (path === '/settings') {
        setView('settings');
      } else if (path === '/notifications') {
        setView('notifications');
      } else if (path === '/ai-assistant') {
        setView('ai-assistant');
      } else if (path === '/analytics') {
        setView('analytics');
      } else if (path.startsWith('/insurance/')) {
        setView('insurance-dashboard');
      } else if (path === '/insurance') {
        setView('insurance');
      } else if (path === '/compliance') {
        setView('compliance');
      } else if (path === '/system-health') {
        setView('system-health');
      } else if (path === '/patient/insurance') {
        setView('patient-insurance');
      } else if (path === '/profile' || path === '/patient/profile') {
        setView('profile');
      } else {
        setView('landing');
      }
    };

    updateView();

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', updateView);

    return () => {
      window.removeEventListener('popstate', updateView);
    };
  }, []);

  if (view === 'landing') return <LandingPage />;
  if (view === 'login') return <RoleLogin />;
  if (view === 'patient-dashboard') return <Dashboard />;
  if (view === 'patient-home') return <PatientDashboard />;
  if (view === 'doctor-dashboard') return <DoctorPortal />;
  if (view === 'doctor-appointments') return <DoctorAppointments />;
  if (view === 'doctor-today') return <TodaysAppointments />;
  if (view === 'doctor-patients') return <PatientRecords />;
  if (view === 'doctor-prescribe') return <WritePrescription />;
  if (view === 'doctor-labs') return <LabReferrals />;
  if (view === 'doctor-imaging') return <DoctorImaging />;
  if (view === 'doctor-earnings') return <DoctorEarnings />;
  if (view === 'doctor-settings') return <DoctorSettings />;
  if (view === 'doctor-profile') return <DoctorProfile />;
  if (view === 'admin-dashboard') return <AdminDashboard />;
  if (view === 'admin-patients') return <AdminPatients />;
  if (view === 'admin-doctors') return <AdminDoctors />;
  if (view === 'admin-insurance') return <AdminInsurance />;
  if (view === 'admin-ai') return <AdminAIAnalytics />;
  if (view === 'admin-profile') return <AdminProfile />;
  if (view === 'admin-settings-account') return <AdminSettingsAccount />;
  if (view === 'admin-settings-security') return <AdminSettingsSecurity />;
  if (view === 'admin-settings-notifications') return <AdminSettingsNotifications />;
  if (view === 'admin-audit-me') return <AdminAuditMe />;
  if (view === 'admin-settings-api-keys') return <AdminSettingsApiKeys />;
  if (view === 'admin-system-status') return <AdminSystemStatus />;
  if (view === 'admin-system-changelog') return <AdminSystemChangelog />;
  if (view === 'admin-support') return <AdminSupport />;
  if (view === 'admin-workspaces') return <AdminWorkspaces />;
  if (view === 'admin-integrations') return <AdminIntegrations />;
  if (view === 'admin-integration-detail') {
    const id = window.location.pathname.replace('/admin/integrations/', '');
    return <AdminIntegrationDetail integrationId={id} />;
  }
  if (view === 'pharmacy-dashboard') return <PharmacyDashboard />;
  if (view === 'pharmacy-portal') return <PharmacyPortal />;
  if (view === 'diagnostics-portal') return <DiagnosticsPortal />;
  if (view === 'lab-dashboard') return <LaboratoryDashboard />;
  if (view === 'lab-rad-portal') return <LabRadPortal />;
  if (view === 'my-health') return <MyHealth />;
  if (view === 'appointments') return <Appointments />;
  if (view === 'medications') return <Medications />;
  if (view === 'lab-results') return <LabResults />;
  if (view === 'imaging') return <Imaging />;
  if (view === 'documents') return <Documents />;
  if (view === 'consultation') return <ConsultationWorkspace />;
  if (view === 'telemedicine') return <TelemedicineConsultation />;
  if (view === 'dispensing') return <PrescriptionDispensing />;
  if (view === 'inventory') return <InventoryManagement />;
  if (view === 'lab-results') return <LabResultEntry />;
  if (view === 'user-management') return <UserManagement />;
  if (view === 'organization-management') return <OrganizationManagement />;
  if (view === 'messaging') return <Messages />;
  if (view === 'doctor-messages') return <SecureMessaging />;
  if (view === 'settings') return <Settings />;
  if (view === 'notifications') return <NotificationCenter />;
  if (view === 'ai-assistant') return <AIAssistant />;
  if (view === 'analytics') return <AIAnalytics />;
  if (view === 'insurance-dashboard') return <InsuranceDashboard />;
  if (view === 'insurance') return <InsurancePortal />;
  if (view === 'compliance') return <ComplianceAudit />;
  if (view === 'system-health') return <SystemHealthIntegrations />;
  if (view === 'patient-insurance') return <PatientInsurance />;
  if (view === 'profile') return <PatientProfile />;

  return <LandingPage />;
}

function AppWithLanguage() {
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
}

export default AppWithLanguage;
