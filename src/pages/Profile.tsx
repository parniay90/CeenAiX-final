import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, FileText, Heart, AlertTriangle, Users, Stethoscope, Shield, Bell, Globe, Sparkles, Lock, Monitor, Settings, ChevronRight, Camera, Download, Trash2, Eye, EyeOff, Check, X, Upload, ExternalLink } from 'lucide-react';
import PatientSidebar from '../components/patient/PatientSidebar';

type Language = 'en' | 'ar';

interface EditState {
  [key: string]: boolean;
}

interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    firstNameAr: string;
    lastNameAr: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    maritalStatus: string;
    occupation: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    alternatePhone: string;
    address: string;
    city: string;
    emirate: string;
    poBox: string;
  };
  uaeIdentity: {
    emiratesId: string;
    passportNumber: string;
    passportExpiry: string;
    visaStatus: string;
    visaExpiry: string;
  };
  medicalSummary: {
    bloodType: string;
    height: string;
    weight: string;
    chronicConditions: string[];
    familyHistory: string[];
  };
  allergies: {
    medications: string[];
    food: string[];
    environmental: string[];
  };
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
  }>;
  careTeam: Array<{
    name: string;
    specialty: string;
    hospital: string;
    phone: string;
  }>;
  insurance: {
    provider: string;
    policyNumber: string;
    memberNumber: string;
    coverage: string;
    validUntil: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    appointments: boolean;
    labResults: boolean;
    medications: boolean;
    billing: boolean;
  };
  preferences: {
    language: Language;
    timeZone: string;
    dateFormat: string;
    fontSize: string;
  };
  aiSettings: {
    enabled: boolean;
    voiceEnabled: boolean;
    proactiveInsights: boolean;
    medicalResearch: boolean;
  };
  privacy: {
    nabidh: boolean;
    dataSharing: boolean;
    researchParticipation: boolean;
  };
}

const Profile: React.FC = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [editStates, setEditStates] = useState<EditState>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showEmiratesId, setShowEmiratesId] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    personalInfo: {
      firstName: 'Parnia',
      lastName: 'Yazdkhasti',
      firstNameAr: 'بارنیا',
      lastNameAr: 'یزدخواستی',
      dateOfBirth: '1987-06-15',
      gender: 'Female',
      nationality: 'Iranian',
      maritalStatus: 'Single',
      occupation: 'Marketing Manager'
    },
    contactInfo: {
      email: 'parnia.yazdkhasti@gmail.com',
      phone: '+971 50 234 5678',
      alternatePhone: '+971 4 567 8900',
      address: 'Marina Heights Tower, Apt 1402',
      city: 'Dubai',
      emirate: 'Dubai',
      poBox: '12345'
    },
    uaeIdentity: {
      emiratesId: '784-1987-1234567-8',
      passportNumber: 'P12345678',
      passportExpiry: '2028-06-15',
      visaStatus: 'Employment Visa',
      visaExpiry: '2026-12-31'
    },
    medicalSummary: {
      bloodType: 'O+',
      height: '165 cm',
      weight: '68 kg',
      chronicConditions: ['Type 2 Diabetes', 'Hypertension (Stage 1)', 'High Cholesterol'],
      familyHistory: ['Type 2 Diabetes (Mother)', 'Hypertension (Father)', 'Thyroid Disease (Sister)']
    },
    allergies: {
      medications: ['Penicillin - Severe rash, anaphylaxis risk'],
      food: ['Shellfish - Throat swelling, difficulty breathing'],
      environmental: ['Dust mites - Seasonal rhinitis']
    },
    emergencyContacts: [
      {
        name: 'Tooraj Helmi',
        relationship: 'Partner',
        phone: '+971 50 987 6543',
        email: 'tooraj.helmi@gmail.com'
      },
      {
        name: 'Sara Yazdkhasti',
        relationship: 'Sister',
        phone: '+98 912 345 6789',
        email: 'sara.yazdkhasti@gmail.com'
      }
    ],
    careTeam: [
      {
        name: 'Dr. Ahmed Al Maktoum',
        specialty: 'Endocrinology',
        hospital: 'Dubai Healthcare City',
        phone: '+971 4 362 4000'
      },
      {
        name: 'Dr. Fatima Al Zahra',
        specialty: 'Cardiology',
        hospital: 'American Hospital Dubai',
        phone: '+971 4 336 7777'
      }
    ],
    insurance: {
      provider: 'Daman',
      policyNumber: 'GOLD-AE-2026-789456',
      memberNumber: '789456123',
      coverage: 'Gold Tier',
      validUntil: '31 December 2026'
    },
    notifications: {
      email: true,
      sms: true,
      push: true,
      appointments: true,
      labResults: true,
      medications: true,
      billing: false
    },
    preferences: {
      language: 'en',
      timeZone: 'Asia/Dubai (UTC+4)',
      dateFormat: 'DD/MM/YYYY',
      fontSize: 'Medium'
    },
    aiSettings: {
      enabled: true,
      voiceEnabled: true,
      proactiveInsights: true,
      medicalResearch: true
    },
    privacy: {
      nabidh: true,
      dataSharing: false,
      researchParticipation: false
    }
  });

  const menuItems = [
    { id: 'personal', label: 'Personal Information', icon: User, category: 'Profile' },
    { id: 'contact', label: 'Contact Information', icon: Mail, category: 'Profile' },
    { id: 'identity', label: 'UAE Identity Documents', icon: FileText, category: 'Profile' },
    { id: 'medical', label: 'Medical Summary', icon: Heart, category: 'Health' },
    { id: 'allergies', label: 'Allergies', icon: AlertTriangle, category: 'Health' },
    { id: 'emergency', label: 'Emergency Contacts', icon: Users, category: 'Health' },
    { id: 'careteam', label: 'My Care Team', icon: Stethoscope, category: 'Health' },
    { id: 'insurance', label: 'Insurance Details', icon: Shield, category: 'Health' },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell, category: 'Settings' },
    { id: 'language', label: 'Language & Accessibility', icon: Globe, category: 'Settings' },
    { id: 'ai', label: 'AI Assistant Settings', icon: Sparkles, category: 'Settings' },
    { id: 'privacy', label: 'Privacy & Data', icon: Lock, category: 'Security' },
    { id: 'security', label: 'Security', icon: Lock, category: 'Security' },
    { id: 'sessions', label: 'Active Sessions', icon: Monitor, category: 'Security' },
    { id: 'account', label: 'Account Settings', icon: Settings, category: 'Security' }
  ];

  const toggleEdit = (section: string) => {
    setEditStates(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const saveSection = (section: string) => {
    setEditStates(prev => ({ ...prev, [section]: false }));
    setToastMessage('Changes saved successfully');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const categories = ['Profile', 'Health', 'Settings', 'Security'];

  return (
    <div className="min-h-screen bg-white">
      <PatientSidebar currentPage="profile" />

      {/* Main Content with Sidebar Offset */}
      <div className="ml-64">
        {/* Profile Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-semibold shadow-lg">
                  PY
                </div>
                <button className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* Name & Info */}
              <div>
                <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Parnia Yazdkhasti
                </h1>
                <p className="text-lg text-slate-600 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  بارنیا یزدخواستی
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Mail className="w-4 h-4" />
                    <span>parnia.yazdkhasti@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Phone className="w-4 h-4" />
                    <span>+971 50 234 5678</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Completeness Indicator */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-100">
              <div className="text-center">
                <div className="text-4xl font-bold text-teal-600 mb-1">87%</div>
                <div className="text-sm text-slate-600">Profile Complete</div>
                <div className="mt-3 w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full" style={{ width: '87%' }}></div>
                </div>
                <button className="mt-3 text-xs text-teal-600 hover:text-teal-700 font-medium">
                  Complete profile →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex gap-6">
          {/* Settings Navigation */}
          <div className="w-60 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 sticky top-6">
              <div className="p-4">
                {categories.map((category, catIdx) => (
                  <div key={category} className={catIdx > 0 ? 'mt-6' : ''}>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
                      {category}
                    </div>
                    {menuItems.filter(item => item.category === category).map((item, idx) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 font-medium shadow-sm'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                          style={{ animationDelay: `${idx * 80}ms` }}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                          <span className="flex-1 text-left">{item.label}</span>
                          {isActive && <ChevronRight className="w-4 h-4 text-teal-500" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 space-y-6">
            {/* Personal Information */}
            {activeSection === 'personal' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Personal Information
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Your basic personal details</p>
                  </div>
                  {!editStates.personal ? (
                    <button
                      onClick={() => toggleEdit('personal')}
                      className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleEdit('personal')}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveSection('personal')}
                        className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name (English)</label>
                    <input
                      type="text"
                      value={profileData.personalInfo.firstName}
                      disabled={!editStates.personal}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name (English)</label>
                    <input
                      type="text"
                      value={profileData.personalInfo.lastName}
                      disabled={!editStates.personal}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name (Arabic)</label>
                    <input
                      type="text"
                      value={profileData.personalInfo.firstNameAr}
                      disabled={!editStates.personal}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, firstNameAr: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600 text-right"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name (Arabic)</label>
                    <input
                      type="text"
                      value={profileData.personalInfo.lastNameAr}
                      disabled={!editStates.personal}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, lastNameAr: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600 text-right"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={profileData.personalInfo.dateOfBirth}
                      disabled={!editStates.personal}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                    <select
                      value={profileData.personalInfo.gender}
                      disabled={!editStates.personal}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, gender: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option>Female</option>
                      <option>Male</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nationality</label>
                    <input
                      type="text"
                      value={profileData.personalInfo.nationality}
                      disabled={!editStates.personal}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, nationality: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Marital Status</label>
                    <select
                      value={profileData.personalInfo.maritalStatus}
                      disabled={!editStates.personal}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, maritalStatus: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option>Single</option>
                      <option>Married</option>
                      <option>Divorced</option>
                      <option>Widowed</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Occupation</label>
                    <input
                      type="text"
                      value={profileData.personalInfo.occupation}
                      disabled={!editStates.personal}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, occupation: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {activeSection === 'contact' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Contact Information
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">How we can reach you</p>
                  </div>
                  {!editStates.contact ? (
                    <button
                      onClick={() => toggleEdit('contact')}
                      className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleEdit('contact')}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveSection('contact')}
                        className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profileData.contactInfo.email}
                      disabled={!editStates.contact}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, email: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Primary Phone</label>
                    <input
                      type="tel"
                      value={profileData.contactInfo.phone}
                      disabled={!editStates.contact}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, phone: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Alternate Phone</label>
                    <input
                      type="tel"
                      value={profileData.contactInfo.alternatePhone}
                      disabled={!editStates.contact}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, alternatePhone: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      value={profileData.contactInfo.address}
                      disabled={!editStates.contact}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, address: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                    <input
                      type="text"
                      value={profileData.contactInfo.city}
                      disabled={!editStates.contact}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, city: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Emirate</label>
                    <select
                      value={profileData.contactInfo.emirate}
                      disabled={!editStates.contact}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, emirate: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                    >
                      <option>Dubai</option>
                      <option>Abu Dhabi</option>
                      <option>Sharjah</option>
                      <option>Ajman</option>
                      <option>Ras Al Khaimah</option>
                      <option>Fujairah</option>
                      <option>Umm Al Quwain</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">P.O. Box</label>
                    <input
                      type="text"
                      value={profileData.contactInfo.poBox}
                      disabled={!editStates.contact}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, poBox: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UAE Identity Documents */}
            {activeSection === 'identity' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      UAE Identity Documents
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Your official identification documents</p>
                  </div>
                  {!editStates.identity ? (
                    <button
                      onClick={() => toggleEdit('identity')}
                      className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleEdit('identity')}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveSection('identity')}
                        className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Emirates ID Number</label>
                    <div className="flex items-center gap-3">
                      <input
                        type={showEmiratesId ? 'text' : 'password'}
                        value={profileData.uaeIdentity.emiratesId}
                        disabled={!editStates.identity}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          uaeIdentity: { ...prev.uaeIdentity, emiratesId: e.target.value }
                        }))}
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                        style={{ fontFamily: 'DM Mono, monospace' }}
                      />
                      <button
                        onClick={() => setShowEmiratesId(!showEmiratesId)}
                        className="p-2.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        {showEmiratesId ? <EyeOff className="w-5 h-5 text-slate-600" /> : <Eye className="w-5 h-5 text-slate-600" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Passport Number</label>
                      <input
                        type="text"
                        value={profileData.uaeIdentity.passportNumber}
                        disabled={!editStates.identity}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          uaeIdentity: { ...prev.uaeIdentity, passportNumber: e.target.value }
                        }))}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                        style={{ fontFamily: 'DM Mono, monospace' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Passport Expiry</label>
                      <input
                        type="date"
                        value={profileData.uaeIdentity.passportExpiry}
                        disabled={!editStates.identity}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          uaeIdentity: { ...prev.uaeIdentity, passportExpiry: e.target.value }
                        }))}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Visa Status</label>
                      <select
                        value={profileData.uaeIdentity.visaStatus}
                        disabled={!editStates.identity}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          uaeIdentity: { ...prev.uaeIdentity, visaStatus: e.target.value }
                        }))}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                      >
                        <option>Employment Visa</option>
                        <option>Residence Visa</option>
                        <option>Visit Visa</option>
                        <option>Student Visa</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Visa Expiry</label>
                      <input
                        type="date"
                        value={profileData.uaeIdentity.visaExpiry}
                        disabled={!editStates.identity}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          uaeIdentity: { ...prev.uaeIdentity, visaExpiry: e.target.value }
                        }))}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Medical Summary */}
            {activeSection === 'medical' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Medical Summary
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Your health overview and conditions</p>
                  </div>
                  {!editStates.medical ? (
                    <button
                      onClick={() => toggleEdit('medical')}
                      className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleEdit('medical')}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveSection('medical')}
                        className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Blood Type</label>
                      <select
                        value={profileData.medicalSummary.bloodType}
                        disabled={!editStates.medical}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          medicalSummary: { ...prev.medicalSummary, bloodType: e.target.value }
                        }))}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                      >
                        <option>O+</option>
                        <option>O-</option>
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Height</label>
                      <input
                        type="text"
                        value={profileData.medicalSummary.height}
                        disabled={!editStates.medical}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          medicalSummary: { ...prev.medicalSummary, height: e.target.value }
                        }))}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Weight</label>
                      <input
                        type="text"
                        value={profileData.medicalSummary.weight}
                        disabled={!editStates.medical}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          medicalSummary: { ...prev.medicalSummary, weight: e.target.value }
                        }))}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Chronic Conditions</label>
                    <div className="space-y-2">
                      {profileData.medicalSummary.chronicConditions.map((condition, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{condition}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Family Medical History</label>
                    <div className="space-y-2">
                      {profileData.medicalSummary.familyHistory.map((history, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          <Users className="w-5 h-5 text-slate-500 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{history}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Allergies */}
            {activeSection === 'allergies' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Allergies
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Critical allergy information</p>
                  </div>
                  {!editStates.allergies ? (
                    <button
                      onClick={() => toggleEdit('allergies')}
                      className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleEdit('allergies')}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveSection('allergies')}
                        className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <label className="text-sm font-semibold text-red-700">Medication Allergies</label>
                    </div>
                    <div className="space-y-2">
                      {profileData.allergies.medications.map((allergy, idx) => (
                        <div key={idx} className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                          <p className="text-sm font-medium text-red-900">{allergy}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <label className="text-sm font-semibold text-orange-700">Food Allergies</label>
                    </div>
                    <div className="space-y-2">
                      {profileData.allergies.food.map((allergy, idx) => (
                        <div key={idx} className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
                          <p className="text-sm font-medium text-orange-900">{allergy}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <label className="text-sm font-semibold text-amber-700">Environmental Allergies</label>
                    </div>
                    <div className="space-y-2">
                      {profileData.allergies.environmental.map((allergy, idx) => (
                        <div key={idx} className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
                          <p className="text-sm font-medium text-amber-900">{allergy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contacts */}
            {activeSection === 'emergency' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Emergency Contacts
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Who to contact in case of emergency</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {profileData.emergencyContacts.map((contact, idx) => (
                    <div key={idx} className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{contact.name}</h3>
                            <p className="text-sm text-slate-500">{contact.relationship}</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{contact.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Care Team */}
            {activeSection === 'careteam' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      My Care Team
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Your healthcare providers</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {profileData.careTeam.map((doctor, idx) => (
                    <div key={idx} className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-xl">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Stethoscope className="w-7 h-7 text-teal-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{doctor.name}</h3>
                          <p className="text-sm text-teal-700 font-medium mb-2">{doctor.specialty}</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <MapPin className="w-3 h-3" />
                              <span>{doctor.hospital}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Phone className="w-3 h-3" />
                              <span>{doctor.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insurance Details */}
            {activeSection === 'insurance' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Insurance Details
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Your insurance coverage information</p>
                  </div>
                </div>

                <div className="p-8 bg-gradient-to-br from-blue-900 to-teal-700 rounded-2xl text-white shadow-xl">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="text-sm opacity-80 mb-1">Insurance Provider</div>
                      <div className="text-3xl font-bold">{profileData.insurance.provider}</div>
                      <div className="text-sm opacity-90 mt-1">{profileData.insurance.coverage}</div>
                    </div>
                    <Shield className="w-12 h-12 opacity-50" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs opacity-70 mb-1">Policy Number</div>
                      <div className="font-mono text-sm">{profileData.insurance.policyNumber}</div>
                    </div>
                    <div>
                      <div className="text-xs opacity-70 mb-1">Member Number</div>
                      <div className="font-mono text-sm">{profileData.insurance.memberNumber}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs opacity-70 mb-1">Valid Until</div>
                      <div className="text-sm">{profileData.insurance.validUntil}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Preferences */}
            {activeSection === 'notifications' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Notification Preferences
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Choose how you want to be notified</p>
                  </div>
                  <button
                    onClick={() => saveSection('notifications')}
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                  >
                    Save Preferences
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Notification Channels</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'email', label: 'Email Notifications', icon: Mail },
                        { key: 'sms', label: 'SMS Notifications', icon: Phone },
                        { key: 'push', label: 'Push Notifications', icon: Bell }
                      ].map(({ key, label, icon: Icon }) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">{label}</span>
                          </div>
                          <button
                            onClick={() => setProfileData(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, [key]: !prev.notifications[key as keyof typeof prev.notifications] }
                            }))}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              profileData.notifications[key as keyof typeof profileData.notifications]
                                ? 'bg-teal-500'
                                : 'bg-slate-300'
                            }`}
                          >
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              profileData.notifications[key as keyof typeof profileData.notifications]
                                ? 'translate-x-6'
                                : 'translate-x-0'
                            }`}></div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Notification Types</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'appointments', label: 'Appointments & Reminders' },
                        { key: 'labResults', label: 'Lab Results & Reports' },
                        { key: 'medications', label: 'Medication Reminders' },
                        { key: 'billing', label: 'Billing & Insurance Updates' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <span className="text-sm font-medium text-slate-700">{label}</span>
                          <button
                            onClick={() => setProfileData(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, [key]: !prev.notifications[key as keyof typeof prev.notifications] }
                            }))}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              profileData.notifications[key as keyof typeof profileData.notifications]
                                ? 'bg-teal-500'
                                : 'bg-slate-300'
                            }`}
                          >
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              profileData.notifications[key as keyof typeof profileData.notifications]
                                ? 'translate-x-6'
                                : 'translate-x-0'
                            }`}></div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Language & Accessibility */}
            {activeSection === 'language' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Language & Accessibility
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Customize your experience</p>
                  </div>
                  <button
                    onClick={() => saveSection('language')}
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                  >
                    Save Changes
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Language</label>
                    <select
                      value={profileData.preferences.language}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, language: e.target.value as Language }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="en">English</option>
                      <option value="ar">العربية (Arabic)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Time Zone</label>
                    <select
                      value={profileData.preferences.timeZone}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, timeZone: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option>Asia/Dubai (UTC+4)</option>
                      <option>Asia/Abu_Dhabi (UTC+4)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
                    <select
                      value={profileData.preferences.dateFormat}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, dateFormat: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Font Size</label>
                    <select
                      value={profileData.preferences.fontSize}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, fontSize: e.target.value }
                      }))}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option>Small</option>
                      <option>Medium</option>
                      <option>Large</option>
                      <option>Extra Large</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* AI Assistant Settings */}
            {activeSection === 'ai' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      AI Assistant Settings
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Configure your AI health assistant</p>
                  </div>
                  <button
                    onClick={() => saveSection('ai')}
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                  >
                    Save Changes
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'enabled', label: 'Enable AI Assistant', desc: 'Get personalized health insights and recommendations' },
                    { key: 'voiceEnabled', label: 'Voice Interaction', desc: 'Use voice commands to interact with the assistant' },
                    { key: 'proactiveInsights', label: 'Proactive Health Insights', desc: 'Receive timely health tips and reminders' },
                    { key: 'medicalResearch', label: 'Medical Research Summaries', desc: 'Get AI-generated summaries of relevant research' }
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4 text-teal-600" />
                            <h3 className="font-semibold text-slate-900">{label}</h3>
                          </div>
                          <p className="text-sm text-slate-600">{desc}</p>
                        </div>
                        <button
                          onClick={() => setProfileData(prev => ({
                            ...prev,
                            aiSettings: { ...prev.aiSettings, [key]: !prev.aiSettings[key as keyof typeof prev.aiSettings] }
                          }))}
                          className={`ml-4 relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                            profileData.aiSettings[key as keyof typeof profileData.aiSettings]
                              ? 'bg-teal-500'
                              : 'bg-slate-300'
                          }`}
                        >
                          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            profileData.aiSettings[key as keyof typeof profileData.aiSettings]
                              ? 'translate-x-6'
                              : 'translate-x-0'
                          }`}></div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy & Data */}
            {activeSection === 'privacy' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Privacy & Data
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your data and privacy settings</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-teal-50 border border-teal-200 rounded-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-teal-600" />
                          <h3 className="font-semibold text-slate-900">NABIDH HIE Consent</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          Share your health records with authorized healthcare providers across the UAE through the National Backbone for Integrated Dubai Health network.
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          {profileData.privacy.nabidh ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-600" />
                              <span className="text-emerald-700 font-medium">Sharing enabled</span>
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 text-red-600" />
                              <span className="text-red-700 font-medium">Sharing disabled</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setProfileData(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, nabidh: !prev.privacy.nabidh }
                        }))}
                        className={`ml-4 relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                          profileData.privacy.nabidh ? 'bg-teal-500' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          profileData.privacy.nabidh ? 'translate-x-6' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Data Sharing with Partners</span>
                      <button
                        onClick={() => setProfileData(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, dataSharing: !prev.privacy.dataSharing }
                        }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          profileData.privacy.dataSharing ? 'bg-teal-500' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          profileData.privacy.dataSharing ? 'translate-x-6' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Medical Research Participation</span>
                      <button
                        onClick={() => setProfileData(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, researchParticipation: !prev.privacy.researchParticipation }
                        }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          profileData.privacy.researchParticipation ? 'bg-teal-500' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          profileData.privacy.researchParticipation ? 'translate-x-6' : 'translate-x-0'
                        }`}></div>
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Data Management</h3>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between transition-colors group">
                        <div className="flex items-center gap-3">
                          <Download className="w-5 h-5 text-slate-500 group-hover:text-teal-600" />
                          <span className="text-sm font-medium text-slate-700">Download My Data</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600" />
                      </button>

                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Trash2 className="w-5 h-5 text-red-500" />
                          <span className="text-sm font-medium text-red-700">Request Account Deletion</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Security
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your account security</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Password & Authentication</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowPasswordChange(true)}
                        className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-slate-500 group-hover:text-teal-600" />
                          <span className="text-sm font-medium text-slate-700">Change Password</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600" />
                      </button>

                      <button
                        onClick={() => setShow2FASetup(true)}
                        className="w-full px-4 py-3 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-lg flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-teal-600" />
                          <div className="text-left">
                            <div className="text-sm font-medium text-slate-900">Two-Factor Authentication</div>
                            <div className="text-xs text-teal-600">Not enabled</div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-teal-400" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Login History</h3>
                    <div className="space-y-2">
                      {[
                        { device: 'Chrome on MacBook Pro', location: 'Dubai, UAE', time: '2 hours ago', current: true },
                        { device: 'Safari on iPhone 14', location: 'Dubai, UAE', time: '1 day ago', current: false },
                        { device: 'Chrome on Windows PC', location: 'Dubai, UAE', time: '3 days ago', current: false }
                      ].map((login, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Monitor className="w-5 h-5 text-slate-400" />
                            <div>
                              <div className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                {login.device}
                                {login.current && (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">Current</span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500">
                                {login.location} · {login.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Active Sessions */}
            {activeSection === 'sessions' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Active Sessions
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your active login sessions</p>
                  </div>
                  <button className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                    End All Sessions
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { device: 'Chrome on MacBook Pro', location: 'Dubai, UAE', ip: '192.168.1.100', time: 'Active now', current: true },
                    { device: 'Safari on iPhone 14', location: 'Dubai, UAE', ip: '192.168.1.101', time: 'Active 2h ago', current: false }
                  ].map((session, idx) => (
                    <div key={idx} className={`p-6 rounded-xl border-2 ${
                      session.current
                        ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            session.current ? 'bg-emerald-100' : 'bg-slate-200'
                          }`}>
                            <Monitor className={`w-6 h-6 ${session.current ? 'text-emerald-600' : 'text-slate-500'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900">{session.device}</h3>
                              {session.current && (
                                <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">This device</span>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <MapPin className="w-3 h-3" />
                                <span>{session.location}</span>
                              </div>
                              <div className="text-xs text-slate-500 font-mono">IP: {session.ip}</div>
                              <div className="text-xs text-slate-500">{session.time}</div>
                            </div>
                          </div>
                        </div>
                        {!session.current && (
                          <button className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors">
                            End Session
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeSection === 'account' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Account Settings
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your account</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Account Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-3 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center justify-between transition-colors group">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                          <div className="text-left">
                            <div className="text-sm font-medium text-slate-900">Deactivate Account</div>
                            <div className="text-xs text-slate-500">Temporarily disable your account</div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-amber-400" />
                      </button>

                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <Trash2 className="w-5 h-5 text-red-600" />
                          <div className="text-left">
                            <div className="text-sm font-medium text-red-700">Delete Account</div>
                            <div className="text-xs text-red-600">Permanently delete your account and data</div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-2">Account Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Account Created</span>
                        <span className="text-slate-900 font-medium">15 January 2024</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Last Login</span>
                        <span className="text-slate-900 font-medium">2 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Account Status</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up">
          <Check className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Delete Account?</h3>
                <p className="text-sm text-slate-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              All your health data, appointments, and records will be permanently deleted. You will not be able to recover this information.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Profile;
