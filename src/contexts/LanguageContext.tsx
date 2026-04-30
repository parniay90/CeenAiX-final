import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.portals': 'Portals',
    'nav.switchPortal': 'Switch Portal',
    'nav.notifications': 'Notifications',
    'nav.markAllRead': 'Mark all read',
    'nav.viewAll': 'View all notifications',
    'nav.myProfile': 'My Profile',
    'nav.settings': 'Settings',
    'nav.signOut': 'Sign Out',
    'nav.patient': 'Patient',
    'nav.patientPortal': 'Patient Portal',
    'nav.collapse': 'Collapse',

    'portal.patient': 'Patient Dashboard',
    'portal.doctor': 'Doctor Dashboard',
    'portal.pharmacy': 'Pharmacy Dashboard',
    'portal.lab': 'Lab Dashboard',
    'portal.insurance': 'Insurance Portal',
    'portal.admin': 'Admin Dashboard',

    'notif.medication': 'Medication Reminder',
    'notif.medicationBody': 'Time to take Metformin 500mg',
    'notif.labs': 'Lab Results Available',
    'notif.labsBody': 'Your blood test results are ready',
    'notif.appointment': 'Appointment Confirmed',
    'notif.appointmentBody': 'Dr. Sarah Johnson – Tomorrow 3:00 PM',

    'sidebar.dashboard': 'Dashboard',
    'sidebar.appointments': 'Appointments',
    'sidebar.myHealth': 'My Health',
    'sidebar.medications': 'Medications',
    'sidebar.labResults': 'Lab Results',
    'sidebar.imaging': 'Imaging & Scans',
    'sidebar.documents': 'Documents',
    'sidebar.messages': 'Messages',
    'sidebar.aiAssistant': 'AI Assistant',
    'sidebar.insurance': 'Insurance',
    'sidebar.profile': 'Profile',
    'sidebar.signOut': 'Sign Out',

    'doctor.sidebar.dashboard': 'Dashboard',
    'doctor.sidebar.schedule': "Today's Schedule",
    'doctor.sidebar.patients': 'Patient Records',
    'doctor.sidebar.clinicalSupport': 'Clinical Decision Support',
    'doctor.sidebar.mriCt': 'MRI & CT Scan Analysis',
    'doctor.sidebar.prescriptions': 'Prescriptions',
    'doctor.sidebar.labOrders': 'Lab Orders',
    'doctor.sidebar.referrals': 'Referrals',
    'doctor.sidebar.telemedicine': 'Telemedicine',
    'doctor.sidebar.analytics': 'Analytics',
    'doctor.sidebar.messages': 'Messages',
    'doctor.sidebar.settings': 'Settings',
    'doctor.sidebar.dhaCompliant': 'DHA Compliant',
    'doctor.sidebar.systemActive': 'System Active',
    'doctor.sidebar.tagline': 'AI That Sees Health',

    'admin.sidebar.overview': 'OVERVIEW',
    'admin.sidebar.usersOrgs': 'USERS & ORGANIZATIONS',
    'admin.sidebar.platform': 'PLATFORM',
    'admin.sidebar.compliance': 'COMPLIANCE & SECURITY',
    'admin.sidebar.system': 'SYSTEM',
    'admin.sidebar.dashboard': 'Dashboard',
    'admin.sidebar.patients': 'Patients',
    'admin.sidebar.doctors': 'Doctors',
    'admin.sidebar.organizations': 'Organizations',
    'admin.sidebar.insurance': 'Insurance',
    'admin.sidebar.aiAnalytics': 'AI Analytics',
    'admin.sidebar.integrations': 'Integrations',
    'admin.sidebar.revenue': 'Revenue',
    'admin.sidebar.nabidh': 'NABIDH',
    'admin.sidebar.dhaCompliance': 'DHA Compliance',
    'admin.sidebar.auditLogs': 'Audit Logs',
    'admin.sidebar.security': 'Security',
    'admin.sidebar.systemHealth': 'System Health',
    'admin.sidebar.systemStatus': 'System Status',
    'admin.sidebar.changelog': 'Release Notes',
    'admin.sidebar.platformSettings': 'Platform Settings',
    'admin.sidebar.apiKeys': 'API Keys & Tokens',
    'admin.sidebar.workspaces': 'Workspaces',
    'admin.sidebar.support': 'Support',
    'admin.sidebar.account': 'MY ACCOUNT',
    'admin.sidebar.profile': 'My Profile',
    'admin.sidebar.accountSettings': 'Account Settings',
    'admin.sidebar.securitySettings': 'Security & 2FA',
    'admin.sidebar.notifications': 'Notifications',
    'admin.sidebar.myAuditLog': 'My Audit Log',
    'admin.sidebar.allOperational': 'All Systems Operational',
    'admin.portal': 'Super Admin Portal',

    'pharmacy.sidebar.main': 'MAIN',
    'pharmacy.sidebar.analytics': 'ANALYTICS',
    'pharmacy.sidebar.account': 'ACCOUNT',
    'pharmacy.sidebar.dashboard': 'Dashboard',
    'pharmacy.sidebar.prescriptions': 'Prescriptions',
    'pharmacy.sidebar.inventory': 'Inventory',
    'pharmacy.sidebar.messages': 'Messages',
    'pharmacy.sidebar.reports': 'Reports',
    'pharmacy.sidebar.revenue': 'Revenue',
    'pharmacy.sidebar.myPharmacy': 'My Pharmacy',
    'pharmacy.sidebar.settings': 'Settings',
    'pharmacy.portal': 'Pharmacy Portal',
    'pharmacy.activeShift': 'Active shift',
    'pharmacy.stockAlerts': 'stock alerts',
    'pharmacy.signingOut': 'Signing out...',

    'ai.title': 'CeenAiX AI',
    'ai.subtitle': 'Your Personal Health Assistant',
    'ai.clearChat': 'Clear your conversation with CeenAiX AI? This cannot be undone.',
    'ai.placeholder': 'Ask me anything about your health...',
    'ai.listening': 'Listening... (tap to stop)',
    'ai.encrypted': 'Your health data is private and encrypted',
    'ai.howCanHelp': 'How can I help you today?',
    'ai.tryAsking': 'Try asking me...',
    'ai.settings': 'AI Assistant Settings',
    'ai.language': 'Language',
    'ai.responseStyle': 'Response Style',
    'ai.friendly': 'Friendly & personal',
    'ai.clinical': 'Clinical & formal',
    'ai.healthAccess': 'Health Data Access',
    'ai.accessMeds': 'Access my medications',
    'ai.accessLabs': 'Access my lab results',
    'ai.accessImaging': 'Access my imaging results',
    'ai.accessAppts': 'Access my upcoming appointments',
    'ai.accessAllergies': 'Reference my allergies in responses',
    'ai.showDisclaimers': 'Show disclaimers on responses',
    'ai.saveSettings': 'Save Settings',
    'ai.disclaimer': 'General health information only — not medical advice. Always follow your doctors\' instructions.',
    'ai.thinking': 'Checking your health profile...',
    'ai.healthSummary': 'Your Health Summary',
    'ai.startChatting': 'Start Chatting ▸',
    'ai.morningGreeting': 'Good morning, Parnia! Today\'s health tip:',
    'ai.warning': 'I provide general health information based on your health profile. I am NOT a substitute for your doctors. For emergencies, call 998 (UAE ambulance).',
    'ai.allergyNote': 'I know you are allergic to Penicillin (SEVERE) and Sulfa drugs — I\'ll flag these in all responses.',
    'ai.english': 'English',
    'ai.arabic': 'Arabic',
  },
  ar: {
    'nav.portals': 'البوابات',
    'nav.switchPortal': 'تبديل البوابة',
    'nav.notifications': 'الإشعارات',
    'nav.markAllRead': 'تحديد الكل كمقروء',
    'nav.viewAll': 'عرض جميع الإشعارات',
    'nav.myProfile': 'ملفي الشخصي',
    'nav.settings': 'الإعدادات',
    'nav.signOut': 'تسجيل الخروج',
    'nav.patient': 'مريض',
    'nav.patientPortal': 'بوابة المريض',
    'nav.collapse': 'طي القائمة',

    'portal.patient': 'لوحة تحكم المريض',
    'portal.doctor': 'لوحة تحكم الطبيب',
    'portal.pharmacy': 'لوحة تحكم الصيدلية',
    'portal.lab': 'لوحة تحكم المختبر',
    'portal.insurance': 'بوابة التأمين',
    'portal.admin': 'لوحة التحكم الإدارية',

    'notif.medication': 'تذكير بالدواء',
    'notif.medicationBody': 'حان وقت تناول ميتفورمين 500 مجم',
    'notif.labs': 'نتائج المختبر متاحة',
    'notif.labsBody': 'نتائج تحليل الدم جاهزة',
    'notif.appointment': 'تم تأكيد الموعد',
    'notif.appointmentBody': 'د. سارة جونسون – غداً الساعة 3:00 مساءً',

    'sidebar.dashboard': 'لوحة التحكم',
    'sidebar.appointments': 'المواعيد',
    'sidebar.myHealth': 'صحتي',
    'sidebar.medications': 'الأدوية',
    'sidebar.labResults': 'نتائج المختبر',
    'sidebar.imaging': 'التصوير والمسح',
    'sidebar.documents': 'المستندات',
    'sidebar.messages': 'الرسائل',
    'sidebar.aiAssistant': 'مساعد الذكاء الاصطناعي',
    'sidebar.insurance': 'التأمين',
    'sidebar.profile': 'الملف الشخصي',
    'sidebar.signOut': 'تسجيل الخروج',

    'doctor.sidebar.dashboard': 'لوحة التحكم',
    'doctor.sidebar.schedule': 'جدول اليوم',
    'doctor.sidebar.patients': 'سجلات المرضى',
    'doctor.sidebar.clinicalSupport': 'الدعم السريري',
    'doctor.sidebar.mriCt': 'تحليل MRI وCT',
    'doctor.sidebar.prescriptions': 'الوصفات الطبية',
    'doctor.sidebar.labOrders': 'طلبات المختبر',
    'doctor.sidebar.referrals': 'الإحالات',
    'doctor.sidebar.telemedicine': 'الطب عن بُعد',
    'doctor.sidebar.analytics': 'التحليلات',
    'doctor.sidebar.messages': 'الرسائل',
    'doctor.sidebar.settings': 'الإعدادات',
    'doctor.sidebar.dhaCompliant': 'متوافق مع DHA',
    'doctor.sidebar.systemActive': 'النظام نشط',
    'doctor.sidebar.tagline': 'الذكاء الاصطناعي الذي يرى الصحة',

    'admin.sidebar.overview': 'نظرة عامة',
    'admin.sidebar.usersOrgs': 'المستخدمون والمنظمات',
    'admin.sidebar.platform': 'المنصة',
    'admin.sidebar.compliance': 'الامتثال والأمان',
    'admin.sidebar.system': 'النظام',
    'admin.sidebar.dashboard': 'لوحة التحكم',
    'admin.sidebar.patients': 'المرضى',
    'admin.sidebar.doctors': 'الأطباء',
    'admin.sidebar.organizations': 'المنظمات',
    'admin.sidebar.insurance': 'التأمين',
    'admin.sidebar.aiAnalytics': 'تحليلات الذكاء الاصطناعي',
    'admin.sidebar.integrations': 'التكاملات',
    'admin.sidebar.revenue': 'الإيرادات',
    'admin.sidebar.nabidh': 'نبض',
    'admin.sidebar.dhaCompliance': 'امتثال DHA',
    'admin.sidebar.auditLogs': 'سجلات التدقيق',
    'admin.sidebar.security': 'الأمان',
    'admin.sidebar.systemHealth': 'صحة النظام',
    'admin.sidebar.systemStatus': 'حالة النظام',
    'admin.sidebar.changelog': 'ملاحظات الإصدار',
    'admin.sidebar.platformSettings': 'إعدادات المنصة',
    'admin.sidebar.apiKeys': 'مفاتيح API والرموز',
    'admin.sidebar.workspaces': 'مساحات العمل',
    'admin.sidebar.support': 'الدعم',
    'admin.sidebar.account': 'حسابي',
    'admin.sidebar.profile': 'ملفي الشخصي',
    'admin.sidebar.accountSettings': 'إعدادات الحساب',
    'admin.sidebar.securitySettings': 'الأمان والمصادقة',
    'admin.sidebar.notifications': 'الإشعارات',
    'admin.sidebar.myAuditLog': 'سجل أفعالي',
    'admin.sidebar.allOperational': 'جميع الأنظمة تعمل',
    'admin.portal': 'بوابة المشرف العام',

    'pharmacy.sidebar.main': 'الرئيسية',
    'pharmacy.sidebar.analytics': 'التحليلات',
    'pharmacy.sidebar.account': 'الحساب',
    'pharmacy.sidebar.dashboard': 'لوحة التحكم',
    'pharmacy.sidebar.prescriptions': 'الوصفات الطبية',
    'pharmacy.sidebar.inventory': 'المخزون',
    'pharmacy.sidebar.messages': 'الرسائل',
    'pharmacy.sidebar.reports': 'التقارير',
    'pharmacy.sidebar.revenue': 'الإيرادات',
    'pharmacy.sidebar.myPharmacy': 'صيدليتي',
    'pharmacy.sidebar.settings': 'الإعدادات',
    'pharmacy.portal': 'بوابة الصيدلية',
    'pharmacy.activeShift': 'وردية نشطة',
    'pharmacy.stockAlerts': 'تنبيهات المخزون',
    'pharmacy.signingOut': 'جاري الخروج...',

    'ai.title': 'CeenAiX AI',
    'ai.subtitle': 'مساعدك الصحي الشخصي',
    'ai.clearChat': 'مسح محادثتك مع CeenAiX AI؟ لا يمكن التراجع عن هذا.',
    'ai.placeholder': 'اسألني أي شيء عن صحتك...',
    'ai.listening': 'جاري الاستماع... (انقر للإيقاف)',
    'ai.encrypted': 'بياناتك الصحية خاصة ومشفرة',
    'ai.howCanHelp': 'كيف يمكنني مساعدتك اليوم؟',
    'ai.tryAsking': 'جرب أن تسألني...',
    'ai.settings': 'إعدادات المساعد الذكي',
    'ai.language': 'اللغة',
    'ai.responseStyle': 'أسلوب الرد',
    'ai.friendly': 'ودي وشخصي',
    'ai.clinical': 'سريري ورسمي',
    'ai.healthAccess': 'الوصول إلى البيانات الصحية',
    'ai.accessMeds': 'الوصول إلى أدويتي',
    'ai.accessLabs': 'الوصول إلى نتائج مختبري',
    'ai.accessImaging': 'الوصول إلى نتائج التصوير',
    'ai.accessAppts': 'الوصول إلى مواعيدي القادمة',
    'ai.accessAllergies': 'الإشارة إلى حساسيتي في الردود',
    'ai.showDisclaimers': 'عرض إخلاء المسؤولية في الردود',
    'ai.saveSettings': 'حفظ الإعدادات',
    'ai.disclaimer': 'معلومات صحية عامة فقط — ليست نصيحة طبية. اتبع دائمًا تعليمات أطبائك.',
    'ai.thinking': 'جاري مراجعة ملفك الصحي...',
    'ai.healthSummary': 'ملخصك الصحي',
    'ai.startChatting': 'ابدأ المحادثة ▸',
    'ai.morningGreeting': 'صباح الخير! نصيحة صحية اليوم:',
    'ai.warning': 'أقدم معلومات صحية عامة بناءً على ملفك الصحي. لست بديلاً عن أطبائك. في حالات الطوارئ، اتصل بـ 998 (إسعاف الإمارات).',
    'ai.allergyNote': 'أعلم أنك تعاني من حساسية شديدة للبنسلين وعقاقير السلفا — سأشير إلى ذلك في جميع الردود.',
    'ai.english': 'English',
    'ai.arabic': 'العربية',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ceenaix_language');
    return (saved as Language) || 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('ceenaix_language', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] ?? translations['en'][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
