// =============================================================================
// MediSync Internationalization (i18n) - Arabic / Tunisian Clinical Context
// =============================================================================

export type Locale = 'ar' | 'en';

export const TRANSLATIONS = {
  ar: {
    brand: 'ميدي سينك',
    tagline: 'نظام إدارة العيادات والملفات الطبية',
    currency: 'د.ت', // دينار تونسي
    currencyName: 'دينار تونسي',
    stationName: 'العيادة المركزية - تونس العاصمة',
    activeStation: 'المحطة 4 • جناح الفحص B',
    statusNominal: 'حالة الطوارئ عادية • سعة 42%',
    liveClinic: 'العيادة تعمل مباشرة',
    
    // Navigation
    navCommand: 'غرفة القيادة السريرية',
    navAppointments: 'جدول المواعيد والفرز',
    navPatients: 'سجل المرضى والملفات الطبية',
    navConsultation: 'غرفة الفحص والوصفات',
    navLabs: 'التحاليل والأشعة المخبرية',
    navTelehealth: 'العيادة المرئية عن بُعد',
    navBilling: 'الفواتير واسترجاع الكنام CNAM',
    
    // Header Actions
    quickBook: 'حجز موعد جديد',
    quickPatient: 'تسجيل مريض جديد',
    searchPlaceholder: 'ابحث عن مريض، ب.ت.و، أو تشخيص طبي...',
    dayMode: 'الوضع النهاري',
    nightMode: 'الوضع الليلي',
    
    // Dashboard
    kpiPatients: 'المرضى المسجلين',
    kpiTodayAppointments: 'مواعيد اليوم',
    kpiWaitingRoom: 'قاعة الانتظار',
    kpiCompleted: 'كشوفات مكتملة',
    kpiRevenue: 'مداخيل العيادة اليومية',
    kpiActiveSpecialties: 'الأقسام المباشرة',
    liveQueueTitle: 'طابور المرضى والكشوفات الفورية',
    liveQueueSubtitle: 'مرتبة حسب توقيت الموعد والحالة الاستعجالية',
    liveEcgTitle: 'تخطيط القلب الحي المباشر • Lead II',
    anatomyMapTitle: 'الخريطة التشريحية التفاعلية لفرز الأعراض',
    anatomyMapSubtitle: 'انقر على عضو من أعضاء الجسم لفلترة شكاوى المرضى',
    
    // Anatomy Zones
    zoneChest: 'الصدر والقلب والشرايين',
    zoneHead: 'الرأس والأعصاب والأنف والأذن',
    zoneAbdomen: 'البطن والجهاز الهضمي والسكري',
    zoneSpine: 'العمود الفقري وفقرات الظهر',
    zoneLimbs: 'الأطراف والمفاصل والعظام',
    
    // SOAP Consultation
    soapSubjective: 'الشكوى الأولية وقصة المرض (Subjective)',
    soapObjective: 'المؤشرات الحيوية والفحص السريري (Objective)',
    soapAssessment: 'التشخيص الطبي والتصنيف الدولي (Assessment)',
    soapPlan: 'الخطة العلاجية والوصفة الطبية (Plan)',
    painScale: 'مقياس شدة الألم (FACES 0-10):',
    bp: 'ضغط الدم الشرياني',
    hr: 'نبضات القلب',
    temp: 'درجة الحرارة',
    spo2: 'نسبة الأكسجين',
    bmi: 'مؤشر كتلة الجسم',
    icd10Label: 'التصنيف الدولي للأمراض ICD-10:',
    cptLabel: 'رمز الإجراء الطبي والتأمين CPT/CNAM:',
    prescriptionsTitle: 'الوصفة الطبية الإلكترونية (Ordonnance):',
    addMedication: '+ إضافة دواء',
    printRx: 'طباعة الوصفة الطبية',
    finalizeConsultation: 'إنهاء الفحص وإصدار الفاتورة ←',
    
    // Labs
    labsTitle: 'طلبات الفحوصات والتحاليل الطبية',
    labsSubtitle: 'متابعة نتائج عينات الدم والأشعة السينية',
    orderTest: 'طلب فحص مخبري جديد',
    specimenStatus: 'حالة العينة',
    urgency: 'درجة الاستعجال',
    stat: 'استعجالي فوري (STAT)',
    urgent: 'أكِيد (Urgent)',
    routine: 'عادي (Routine)',
    
    // Telehealth
    telehealthTitle: 'عيادة الاستشارة الطبية المرئية عن بُعد',
    telehealthBadge: 'مكالمة فيديو مشفرة عالية الدقة',
    endCall: 'إنهاء المكالمة والعودة للملف',
    instantRxPush: 'إرسال الوصفة فوراً لهاتف المريض',
    
    // Billing & CNAM
    billingTitle: 'استخلاص الفواتير واسترجاع مصاريف الكنام (CNAM)',
    billingSubtitle: 'التكفل بالمرضى (APCI / النظام الاسترجاعي / الدفع المباشر)',
    cnamCard: 'الصندوق الوطني للتأمين على المرض (CNAM)',
    cinLabel: 'ب.ت.و (CIN):',
    settleBill: 'خلاص الفاتورة',
    markPaid: 'تم الخلاص',
  },
  en: {
    brand: 'MediSync',
    tagline: 'Clinical EMR & Practice Management OS',
    currency: '$',
    currencyName: 'US Dollar',
    stationName: 'Metropolitan Central Clinic',
    activeStation: 'Station #4 • Wing B',
    statusNominal: 'Triage Nominal • Capacity 42%',
    liveClinic: 'Clinic Active Live',
    
    navCommand: 'Command Center',
    navAppointments: 'Appointments & Triage',
    navPatients: 'Patient Registry & EMR',
    navConsultation: 'Clinical Charting & Rx',
    navLabs: 'Labs & Diagnostic Orders',
    navTelehealth: 'Telehealth Live Suite',
    navBilling: 'Billing & Insurance Claims',
    
    quickBook: 'Book Appointment',
    quickPatient: 'Register Patient',
    searchPlaceholder: 'Search patients, MRN, national ID...',
    dayMode: 'Day Mode',
    nightMode: 'Night Mode',
    
    kpiPatients: 'Patients Registered',
    kpiTodayAppointments: "Today's Appointments",
    kpiWaitingRoom: 'Waiting Room',
    kpiCompleted: 'Completed Visits',
    kpiRevenue: 'Practice Billing Today',
    kpiActiveSpecialties: 'Active Specialties',
    liveQueueTitle: 'Immediate Patient Encounter Queue',
    liveQueueSubtitle: 'Sorted by appointment slot & vital severity',
    liveEcgTitle: 'Live Cardiac Telemetry • Lead II',
    anatomyMapTitle: 'Interactive Anatomical Triage Map',
    anatomyMapSubtitle: 'Click body quadrant to filter clinical complaints',
    
    zoneChest: 'Cardiac & Pulmonary',
    zoneHead: 'Cranial & Neurological',
    zoneAbdomen: 'Gastroenterology',
    zoneSpine: 'Spinal & Neuromuscular',
    zoneLimbs: 'Orthopedic Extremities',
    
    soapSubjective: 'Subjective (Patient Narrative & Pain Scale)',
    soapObjective: 'Objective Telemetry & Physical Examination',
    soapAssessment: 'Assessment & Clinical Diagnosis (ICD-10)',
    soapPlan: 'Treatment Plan, e-Prescriptions & Billing',
    painScale: 'Wong-Baker FACES® Pain Scale:',
    bp: 'Blood Pressure',
    hr: 'Heart Rate',
    temp: 'Body Temperature',
    spo2: 'Oxygen Saturation',
    bmi: 'Body Mass Index',
    icd10Label: 'Standard ICD-10 Classification:',
    cptLabel: 'Procedure & Billing Code (CPT):',
    prescriptionsTitle: 'Active Medications to Prescribe:',
    addMedication: '+ Add Medication',
    printRx: 'Print Rx Certificate',
    finalizeConsultation: 'Complete & Generate Bill →',
    
    labsTitle: 'Clinical Lab & Diagnostic Orders',
    labsSubtitle: 'Pathology tests, biochemistry panels, radiology requisitions',
    orderTest: 'Order Diagnostic Test',
    specimenStatus: 'Specimen Status',
    urgency: 'Clinical Priority',
    stat: 'STAT Emergency (<1h)',
    urgent: 'Urgent (4-6h)',
    routine: 'Routine (24-48h)',
    
    telehealthTitle: 'Telehealth Live Video Consultation',
    telehealthBadge: '256-bit AES Encrypted Session',
    endCall: 'End & Return to Chart',
    instantRxPush: 'Instant e-Prescription Dispatch to Patient',
    
    billingTitle: 'Medical Invoicing & Insurance Claims',
    billingSubtitle: 'Direct copay & private billing tracking',
    cnamCard: 'National Health Insurance (CNAM/Tiers Payant)',
    cinLabel: 'National ID (CIN):',
    settleBill: 'Collect Cash/Card',
    markPaid: 'Mark Paid',
  },
};
