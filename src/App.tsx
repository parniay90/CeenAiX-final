import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorPortal from './pages/DoctorPortal';
import DoctorAppointments from './pages/DoctorAppointments';
import AdminDashboard from './pages/AdminDashboard';
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
