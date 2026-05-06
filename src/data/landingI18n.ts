export type Lang = 'en' | 'ar';

export const t = {
  en: {
    // Section header
    eyebrow: 'Coming soon · GCC healthcare AI',
    headline: 'Be first to see CeenAiX in action',
    subheadline: 'Request a private demo for your clinic, hospital, or pharmacy — or sign up to be notified the day we launch.',
    trustStrip: ['DHA Path B', 'NABIDH-ready', 'UAE-hosted', 'HIPAA-aligned', 'Bilingual'],
    langToggleEn: 'EN',
    langToggleAr: 'العربية',

    // Tabs (mobile)
    tabDemo: 'Request a demo',
    tabNotify: 'Notify me at launch',

    // Card 1
    card1Eyebrow: 'Personalized walkthrough',
    card1Title: 'Request a demo',
    card1Desc: "Tell us about your team and we'll schedule a 30-minute tailored demo of CeenAiX. Available in English or Arabic.",

    // Form labels
    fullName: 'Full name',
    workEmail: 'Work email',
    phone: 'Phone',
    orgName: 'Organization name',
    role: 'Your role',
    orgType: 'Organization type',
    countryEmirate: 'Country / Emirate',
    teamSize: 'Team size',
    interests: "What are you most interested in?",
    preferredTime: 'Preferred demo time',
    specificDate: 'Specific date',
    notes: 'Anything we should know?',
    notesPlaceholder: 'Specific use cases, current pain points, or questions you\'d like us to cover',
    preferredLang: 'Preferred language for the demo',
    consent: 'I agree to be contacted by AryAiX about CeenAiX. I can unsubscribe anytime.',
    privacyPolicy: 'Privacy Policy',
    marketingOptIn: 'Also sign me up for the launch announcement and product updates.',
    submitDemo: 'Request demo →',
    submitting: 'Submitting…',
    freeEmailWarning: 'Please use your work email so we can route this correctly.',
    freeEmailOverride: 'Use personal email anyway',

    // Roles
    roles: ['Owner / Founder', 'CEO', 'Medical Director', 'Clinic Manager', 'IT', 'Operations', 'Procurement', 'Investor', 'Other'],
    // Org types
    orgTypes: ['Hospital', 'Multi-specialty clinic', 'Single-specialty clinic', 'Pharmacy', 'Laboratory', 'Radiology center', 'Insurance', 'TPA', 'Healthcare group', 'Investor', 'Other'],
    // Team sizes
    teamSizes: ['1–10', '11–50', '51–200', '201–1,000', '1,000+'],
    // Interests
    interestOptions: ['Patient portal', 'Doctor portal', 'Pharmacy module', 'Lab & Radiology', 'Insurance & claims', 'Telemedicine', 'NABIDH integration', 'AI clinical assist', 'Whitelabel for our group', 'Investor overview', 'Something else'],
    // Time preferences
    timeOptions: ['Anytime', 'Mornings', 'Afternoons', 'Evenings', 'Weekends', 'Specific date'],
    // Languages
    demoLangs: ['English', 'العربية'],

    // Success state card 1
    successTitle: (name: string) => `Thanks, ${name} — we'll be in touch shortly.`,
    successBody: (email: string) => `We've sent a confirmation to ${email}. Our team typically responds within one business day.`,
    successCta1: 'Read the CeenAiX overview',
    successCta2: 'Follow us on LinkedIn',
    submitAnother: 'Submit another request',
    alsoNotify: 'Also notify me at launch',

    // Card 2
    card2Eyebrow: 'Launching soon',
    card2Title: 'Be the first to know',
    card2Desc: "We'll email you the moment CeenAiX is live. No spam — just one launch announcement and the option to opt into ongoing updates.",

    // Countdown
    countdownDays: 'DAYS',
    countdownHours: 'HOURS',
    countdownMins: 'MINUTES',
    countdownSecs: 'SECONDS',
    launchingSoon: 'Public launch coming soon',
    launchesOn: (date: string) => `Launches on ${date}`,

    // Card 2 form
    yourName: 'Your name',
    emailPlaceholder: 'you@work.com',
    iAmA: 'I am a / I represent',
    consentNotify: 'Email me the launch announcement and let me unsubscribe anytime.',
    submitNotify: 'Notify me at launch',
    personaOptions: ['Healthcare professional', 'Clinic owner', 'Hospital admin', 'Pharmacy', 'Lab', 'Radiology', 'Insurance', 'Patient', 'Investor', 'Press', 'Student', 'Other'],

    // Card 2 success
    successNotifyTitle: "You're on the list.",
    successNotifyBody: (email: string) => `We'll email ${email} the moment CeenAiX launches.`,
    successNotifyCta: 'Request a personalized demo →',
    shareColleague: 'Share with a colleague',
    addToCalendar: 'Add to calendar',
    alreadySubscribed: "Thanks — you're already on our list.",

    // Trust strip
    trustLeft: 'Backed by AryAiX · Built in Dubai',
    trustCenter: ['DHA Path B compliant', 'NABIDH-ready', 'Hosted in UAE'],
    trustCounter: (n: number) => `${n} healthcare leaders already on the launch list`,
    privacyFirst: "We never share your email.",
    readPrivacy: 'Read our Privacy Policy',

    // Errors
    required: 'This field is required.',
    invalidEmail: 'Please enter a valid email.',
    invalidPhone: "Phone number doesn't look right.",
    selectOne: 'Please select at least one option.',
    genericError: 'Something went wrong. Please try again.',
    fieldErrors: 'Please fix the errors above before submitting.',

    // Country defaults
    uae: 'United Arab Emirates',
    emirates: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'],
    gccCountries: ['Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain', 'Oman'],
  },
  ar: {
    eyebrow: 'قريباً · الذكاء الاصطناعي للرعاية الصحية في دول مجلس التعاون',
    headline: 'كن أول من يرى CeenAiX في العمل',
    subheadline: 'اطلب عرضاً توضيحياً خاصاً لعيادتك أو مستشفاك أو صيدليتك — أو سجّل للحصول على إشعار يوم الإطلاق.',
    trustStrip: ['مسار DHA B', 'جاهز لـ NABIDH', 'مستضاف في الإمارات', 'متوافق مع HIPAA', 'ثنائي اللغة'],
    langToggleEn: 'EN',
    langToggleAr: 'العربية',

    tabDemo: 'طلب عرض توضيحي',
    tabNotify: 'إشعاري عند الإطلاق',

    card1Eyebrow: 'جولة شخصية مخصصة',
    card1Title: 'اطلب عرضاً توضيحياً',
    card1Desc: 'أخبرنا عن فريقك وسنجدول عرضاً توضيحياً مخصصاً لمدة 30 دقيقة. متاح باللغتين العربية والإنجليزية.',

    fullName: 'الاسم الكامل',
    workEmail: 'البريد الإلكتروني للعمل',
    phone: 'رقم الهاتف',
    orgName: 'اسم المؤسسة',
    role: 'منصبك',
    orgType: 'نوع المؤسسة',
    countryEmirate: 'الدولة / الإمارة',
    teamSize: 'حجم الفريق',
    interests: 'ما الذي يهمك أكثر؟',
    preferredTime: 'الوقت المفضل للعرض',
    specificDate: 'تاريخ محدد',
    notes: 'هل هناك ما تودّ إضافته؟',
    notesPlaceholder: 'حالات استخدام محددة أو نقاط ألم أو أسئلة تودّ مناقشتها',
    preferredLang: 'اللغة المفضلة للعرض',
    consent: 'أوافق على التواصل معي من قِبل AryAiX بشأن CeenAiX. يمكنني إلغاء الاشتراك في أي وقت.',
    privacyPolicy: 'سياسة الخصوصية',
    marketingOptIn: 'اشتركني أيضاً في إعلان الإطلاق وتحديثات المنتج.',
    submitDemo: 'طلب عرض توضيحي ←',
    submitting: 'جارٍ الإرسال…',
    freeEmailWarning: 'يرجى استخدام بريد العمل حتى نتمكن من توجيه طلبك بشكل صحيح.',
    freeEmailOverride: 'استخدام البريد الشخصي على أي حال',

    roles: ['مالك / مؤسس', 'رئيس تنفيذي', 'مدير طبي', 'مدير عيادة', 'تقنية المعلومات', 'العمليات', 'المشتريات', 'مستثمر', 'أخرى'],
    orgTypes: ['مستشفى', 'عيادة متعددة التخصصات', 'عيادة أحادية التخصص', 'صيدلية', 'مختبر', 'مركز أشعة', 'تأمين', 'TPA', 'مجموعة رعاية صحية', 'مستثمر', 'أخرى'],
    teamSizes: ['1–10', '11–50', '51–200', '201–1,000', 'أكثر من 1,000'],
    interestOptions: ['بوابة المريض', 'بوابة الطبيب', 'وحدة الصيدلية', 'المختبر والأشعة', 'التأمين والمطالبات', 'الطب عن بُعد', 'تكامل NABIDH', 'المساعد السريري الذكي', 'علامة بيضاء لمجموعتنا', 'نظرة عامة للمستثمرين', 'غير ذلك'],
    timeOptions: ['أي وقت', 'الصباح', 'بعد الظهر', 'المساء', 'نهاية الأسبوع', 'تاريخ محدد'],
    demoLangs: ['English', 'العربية'],

    successTitle: (name: string) => `شكراً لك، ${name} — سنتواصل معك قريباً.`,
    successBody: (email: string) => `أرسلنا تأكيداً إلى ${email}. يرد فريقنا عادةً في غضون يوم عمل واحد.`,
    successCta1: 'اقرأ نظرة عامة على CeenAiX',
    successCta2: 'تابعنا على LinkedIn',
    submitAnother: 'إرسال طلب آخر',
    alsoNotify: 'أشعرني أيضاً عند الإطلاق',

    card2Eyebrow: 'الإطلاق قريباً',
    card2Title: 'كن أول من يعلم',
    card2Desc: 'سنرسل لك بريداً إلكترونياً في اللحظة التي يُطلق فيها CeenAiX. لا رسائل غير مرغوب فيها — مجرد إعلان إطلاق واحد.',

    countdownDays: 'أيام',
    countdownHours: 'ساعات',
    countdownMins: 'دقائق',
    countdownSecs: 'ثوانٍ',
    launchingSoon: 'الإطلاق العام قريباً',
    launchesOn: (date: string) => `الإطلاق في ${date}`,

    yourName: 'اسمك',
    emailPlaceholder: 'you@work.com',
    iAmA: 'أنا / أمثّل',
    consentNotify: 'أرسل لي إعلان الإطلاق واسمح لي بإلغاء الاشتراك في أي وقت.',
    submitNotify: 'أشعرني عند الإطلاق',
    personaOptions: ['متخصص رعاية صحية', 'مالك عيادة', 'مدير مستشفى', 'صيدلية', 'مختبر', 'أشعة', 'تأمين', 'مريض', 'مستثمر', 'صحافة', 'طالب', 'أخرى'],

    successNotifyTitle: 'أنت على القائمة.',
    successNotifyBody: (email: string) => `سنرسل بريداً إلكترونياً إلى ${email} في لحظة إطلاق CeenAiX.`,
    successNotifyCta: '← اطلب عرضاً توضيحياً شخصياً',
    shareColleague: 'شارك مع زميل',
    addToCalendar: 'أضف إلى التقويم',
    alreadySubscribed: 'شكراً — أنت مسجّل بالفعل في قائمتنا.',

    trustLeft: 'بدعم من AryAiX · مبني في دبي',
    trustCenter: ['متوافق مع DHA Path B', 'جاهز لـ NABIDH', 'مستضاف في الإمارات'],
    trustCounter: (n: number) => `${n} قائداً في الرعاية الصحية مسجّل بالفعل`,
    privacyFirst: 'لن نشارك بريدك الإلكتروني أبداً.',
    readPrivacy: 'اقرأ سياسة الخصوصية',

    required: 'هذا الحقل مطلوب.',
    invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح.',
    invalidPhone: 'رقم الهاتف يبدو غير صحيح.',
    selectOne: 'يرجى اختيار خيار واحد على الأقل.',
    genericError: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    fieldErrors: 'يرجى تصحيح الأخطاء أعلاه قبل الإرسال.',

    uae: 'الإمارات العربية المتحدة',
    emirates: ['أبوظبي', 'دبي', 'الشارقة', 'عجمان', 'أم القيوين', 'رأس الخيمة', 'الفجيرة'],
    gccCountries: ['المملكة العربية السعودية', 'الكويت', 'قطر', 'البحرين', 'سلطنة عُمان'],
  },
} as const;

export type Translations = typeof t.en;
