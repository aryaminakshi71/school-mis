import { useCallback, useEffect, useState } from "react";

export type Language =
  | "en"
  | "hi"
  | "ta"
  | "te"
  | "bn"
  | "mr"
  | "gu"
  | "kn"
  | "ml"
  | "or"
  | "pa"
  | "as"
  | "ur";

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  flag: string;
}

export const languages: LanguageInfo[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
    flag: "🇺🇸",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    direction: "ltr",
    flag: "🇮🇳",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    direction: "ltr",
    flag: "🇮🇳",
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    direction: "ltr",
    flag: "🇮🇳",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    direction: "ltr",
    flag: "🇧🇩",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    direction: "ltr",
    flag: "🇮🇳",
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    direction: "ltr",
    flag: "🇮🇳",
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    direction: "ltr",
    flag: "🇮🇳",
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    direction: "ltr",
    flag: "🇮🇳",
  },
  {
    code: "or",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    direction: "ltr",
    flag: "🇮🇳",
  },
  {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    direction: "ltr",
    flag: "🇮🇳",
  },
  {
    code: "as",
    name: "Assamese",
    nativeName: "অসমীয়া",
    direction: "ltr",
    flag: "🇮🇳",
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    direction: "rtl",
    flag: "🇵🇰",
  },
];

export interface TranslationSet {
  common: Record<string, string>;
  nav: Record<string, string>;
  portal: Record<string, string>;
  actions: Record<string, string>;
  messages: Record<string, string>;
  errors: Record<string, string>;
}

const translations: Record<string, any> = {
  en: {
    common: {
      dashboard: "Dashboard",
      settings: "Settings",
      profile: "Profile",
      logout: "Logout",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      search: "Search",
      loading: "Loading...",
      noData: "No data available",
      success: "Success",
      error: "Error",
      warning: "Warning",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      submit: "Submit",
      close: "Close",
      yes: "Yes",
      no: "No",
      all: "All",
      none: "None",
      select: "Select",
      filter: "Filter",
      export: "Export",
      import: "Import",
      refresh: "Refresh",
      download: "Download",
      upload: "Upload",
    },
    nav: {
      mainMenu: "Main Menu",
      portals: "Portals & More",
      students: "Students",
      staff: "Staff",
      classes: "Classes",
      attendance: "Attendance",
      exams: "Exams",
      fees: "Fees",
      library: "Library",
      transport: "Transport",
      inventory: "Inventory",
      reports: "Reports",
      notifications: "Notifications",
    },
    portal: {
      welcome: "Welcome back",
      overview: "Overview",
      attendance: "Attendance",
      fees: "Fees",
      homework: "Homework",
      exams: "Exams",
      timetable: "Timetable",
      performance: "Performance",
      leave: "Leave",
      payroll: "Payroll",
      messages: "Messages",
      notices: "Notices",
      transport: "Transport",
      library: "Library",
    },
    actions: {
      markAttendance: "Mark Attendance",
      addStudent: "Add Student",
      addStaff: "Add Staff",
      createExam: "Create Exam",
      uploadMarks: "Upload Marks",
      sendNotice: "Send Notice",
      payFees: "Pay Fees",
      issueBook: "Issue Book",
      requestLeave: "Request Leave",
    },
    messages: {
      loginSuccess: "Login successful",
      loginFailed: "Login failed",
      sessionExpired: "Your session has expired",
      dataSaved: "Data saved successfully",
      dataDeleted: "Data deleted successfully",
      confirmDelete: "Are you sure you want to delete this?",
      noPermission: "You don't have permission to perform this action",
      networkError: "Network error. Please try again.",
    },
    errors: {
      required: "This field is required",
      invalidEmail: "Invalid email address",
      invalidPhone: "Invalid phone number",
      passwordWeak: "Password is too weak",
      serverError: "Server error. Please try again later.",
      notFound: "Resource not found",
      unauthorized: "Unauthorized access",
    },
  },
  hi: {
    common: {
      dashboard: "डैशबोर्ड",
      settings: "सेटिंग्स",
      profile: "प्रोफ़ाइल",
      logout: "लॉग आउट",
      save: "सहेजें",
      cancel: "रद्द करें",
      delete: "हटाएं",
      edit: "संपादित करें",
      view: "देखें",
      search: "खोजें",
      loading: "लोड हो रहा है...",
      noData: "कोई डेटा उपलब्ध नहीं",
      success: "सफलता",
      error: "त्रुटि",
      warning: "चेतावनी",
      confirm: "पुष्टि करें",
      back: "वापस",
      next: "अगला",
      submit: "सबमिट करें",
      close: "बंद करें",
      yes: "हां",
      no: "नहीं",
      all: "सभी",
      none: "कोई नहीं",
      select: "चुनें",
      filter: "फ़िल्टर",
      export: "निर्यात",
      import: "आयात",
      refresh: "रिफ्रेश",
      download: "डाउनलोड",
      upload: "अपलोड",
    },
    nav: {
      mainMenu: "मुख्य मेन्यू",
      portals: "पोर्टल और अधिक",
      students: "छात्र",
      staff: "कर्मचारी",
      classes: "कक्षाएं",
      attendance: "उपस्थिति",
      exams: "परीक्षाएं",
      fees: "शुल्क",
      library: "पुस्तकालय",
      transport: "परिवहन",
      inventory: "इन्वेंटरी",
      reports: "रिपोर्ट",
      notifications: "सूचनाएं",
    },
    portal: {
      welcome: "वापसी पर स्वागत है",
      overview: "अवलोकन",
      attendance: "उपस्थिति",
      fees: "शुल्क",
      homework: "गृहकार्य",
      exams: "परीक्षाएं",
      timetable: "समय सारणी",
      performance: "प्रदर्शन",
      leave: "छुट्टी",
      payroll: "वेतन",
      messages: "संदेश",
      notices: "सूचनाएं",
      transport: "परिवहन",
      library: "पुस्तकालय",
    },
    actions: {
      markAttendance: "उपस्थिति चिह्नित करें",
      addStudent: "छात्र जोड़ें",
      addStaff: "कर्मचारी जोड़ें",
      createExam: "परीक्षा बनाएं",
      uploadMarks: "अंक अपलोड करें",
      sendNotice: "नोटिस भेजें",
      payFees: "शुल्क भुगतान",
      issueBook: "पुस्तक जारी करें",
      requestLeave: "छुट्टी का अनुरोध",
    },
    messages: {
      loginSuccess: "लॉगिन सफल",
      loginFailed: "लॉगिन विफल",
      sessionExpired: "आपका सत्र समाप्त हो गया है",
      dataSaved: "डेटा सफलतापूर्वक सहेजा गया",
      dataDeleted: "डेटा सफलतापूर्वक हटाया गया",
      confirmDelete: "क्या आप वाकई इसे हटाना चाहते हैं?",
      noPermission: "आपको यह क्रिया करने की अनुमति नहीं है",
      networkError: "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।",
    },
    errors: {
      required: "यह फ़ील्ड आवश्यक है",
      invalidEmail: "अमान्य ईमेल पता",
      invalidPhone: "अमान्य फ़ोन नंबर",
      passwordWeak: "पासवर्ड बहुत कमज़ोर है",
      serverError: "सर्वर त्रुटि। कृपया बाद में पुनः प्रयास करें।",
      notFound: "संसाधन नहीं मिला",
      unauthorized: "अनधिकृत पहुंच",
    },
  },
  ta: {
    common: {
      dashboard: "டாஷ்போர்டு",
      settings: "அமைப்புகள்",
      profile: "சுயவிவரம்",
      logout: "வெளியேறு",
      save: "சேமி",
      cancel: "ரத்து செய்",
      delete: "நீக்கு",
      edit: "திருத்து",
      view: "காண்",
      search: "தேடு",
      loading: "ஏற்றுகிறது...",
      noData: "தரவு இல்லை",
      success: "வெற்றி",
      error: "பிழை",
      warning: "எச்சரிக்கை",
      confirm: "உறுதி செய்",
      back: "பின்",
      next: "அடுத்து",
      submit: "சமர்ப்பி",
      close: "மூடு",
      yes: "ஆம்",
      no: "இல்லை",
      all: "அனைத்தும்",
      none: "எதுவும் இல்லை",
      select: "தேர்ந்தெடு",
      filter: "வடிகட்டு",
      export: "ஏற்றுமதி",
      import: "இறக்குமதி",
      refresh: "புதுப்பிப்பு",
      download: "பதிவிறக்கு",
      upload: "பதிவேற்று",
    },
    nav: {
      mainMenu: "முதன்மை மெனு",
      portals: "போர்டல்கள் & மேலும்",
      students: "மாணவர்கள்",
      staff: "ஊழியர்கள்",
      classes: "வகுப்புகள்",
      attendance: "வருகை",
      exams: "தேர்வுகள்",
      fees: "கட்டணங்கள்",
      library: "நூலகம்",
      transport: "போக்குவரத்து",
      inventory: "சரக்கு",
      reports: "அறிக்கைகள்",
      notifications: "அறிவிப்புகள்",
    },
    portal: {
      welcome: "மீண்டும் வருகிறீர்கள்",
      overview: "கண்ணோட்டம்",
      attendance: "வருகை",
      fees: "கட்டணங்கள்",
      homework: "வீட்டுப்பாடம்",
      exams: "தேர்வுகள்",
      timetable: "நேர அட்டவணை",
      performance: "செயல்திறன்",
      leave: "விடுப்பு",
      payroll: "சம்பளம்",
      messages: "செய்திகள்",
      notices: "அறிவிப்புகள்",
      transport: "போக்குவரத்து",
      library: "நூலகம்",
    },
    actions: {
      markAttendance: "வருகைக்குறியிடு",
      addStudent: "மாணவர் சேர்",
      addStaff: "ஊழியர் சேர்",
      createExam: "தேர்வு உருவாக்கு",
      uploadMarks: "மதிப்பெண்கள் பதிவேற்று",
      sendNotice: "அறிவிப்பு அனுப்பு",
      payFees: "கட்டணம் செலுத்து",
      issueBook: "புத்தகம் வழங்கு",
      requestLeave: "விடுப்பு கோரிக்கை",
    },
    messages: {
      loginSuccess: "உள்நுழைவு வெற்றிகரமாக",
      loginFailed: "உள்நுழைவு தோல்வி",
      sessionExpired: "உங்கள் அமர்வு காலாவதியானது",
      dataSaved: "தரவு வெற்றிகரமாக சேமிக்கப்பட்டது",
      dataDeleted: "தரவு வெற்றிகரமாக நீக்கப்பட்டது",
      confirmDelete: "இதை நிச்சயமாக நீக்க விரும்புகிறீர்களா?",
      noPermission: "இந்த செயலை செய்ய உங்களுக்கு அனுமதி இல்லை",
      networkError: "நெட்வொர்க் பிழை. மீண்டும் முயற்சிக்கவும்.",
    },
    errors: {
      required: "இந்த புலம் தேவை",
      invalidEmail: "தவறான மின்னஞ்சல் முகவரி",
      invalidPhone: "தவறான தொலைபேசி எண்",
      passwordWeak: "கடவுச்சொல் மிகவும் பலவீனமாக உள்ளது",
      serverError: "சர்வர் பிழை. பின்னர் மீண்டும் முயற்சிக்கவும்.",
      notFound: "வளம் கிடைக்கவில்லை",
      unauthorized: "அங்கீகரிக்கப்படாத அணுகல்",
    },
  },
  bn: {
    common: {
      dashboard: "ড্যাশবোর্ড",
      settings: "সেটিংস",
      profile: "প্রোফাইল",
      logout: "লগআউট",
      save: "সংরক্ষণ করুন",
      cancel: "বাতিল করুন",
      delete: "মুছুন",
      edit: "সম্পাদনা করুন",
      view: "দেখুন",
      search: "খুঁজুন",
      loading: "লোড হচ্ছে...",
      noData: "কোনো ডেটা নেই",
      success: "সফল",
      error: "ত্রুটি",
      warning: "সতর্কতা",
      confirm: "নিশ্চিত করুন",
      back: "ফিরে যান",
      next: "পরবর্তী",
      submit: "জমা দিন",
      close: "বন্ধ করুন",
      yes: "হ্যাঁ",
      no: "না",
      all: "সব",
      none: "কোনোটিই না",
      select: "নির্বাচন করুন",
      filter: "ফিল্টার",
      export: "রপ্তানি",
      import: "আমদানি",
      refresh: "রিফ্রেশ",
      download: "ডাউনলোড",
      upload: "আপলোড",
    },
    nav: {
      mainMenu: "প্রধান মেনু",
      portals: "পোর্টাল এবং আরও",
      students: "ছাত্র",
      staff: "কর্মী",
      classes: "ক্লাস",
      attendance: "উপস্থিতি",
      exams: "পরীক্ষা",
      fees: "ফি",
      library: "লাইব্রেরি",
      transport: "পরিবহন",
      inventory: "ইনভেন্টরি",
      reports: "রিপোর্ট",
      notifications: "বিজ্ঞপ্তি",
    },
    portal: {
      welcome: "আবার স্বাগতম",
      overview: "ওভারভিউ",
      attendance: "উপস্থিতি",
      fees: "ফি",
      homework: "হোমওয়ার্ক",
      exams: "পরীক্ষা",
      timetable: "সময়সারণী",
      performance: "পারফরম্যান্স",
      leave: "ছুটি",
      payroll: "বেতন",
      messages: "মেসেজ",
      notices: "বিজ্ঞপ্তি",
      transport: "পরিবহন",
      library: "লাইব্রেরি",
    },
    actions: {
      markAttendance: "উপস্থিতি চিহ্নিত করুন",
      addStudent: "ছাত্র যোগ করুন",
      addStaff: "কর্মী যোগ করুন",
      createExam: "পরীক্ষা তৈরি করুন",
      uploadMarks: "নম্বর আপলোড করুন",
      sendNotice: "নোটিশ পাঠান",
      payFees: "ফি দিন",
      issueBook: "বই জারি করুন",
      requestLeave: "ছুটির আবেদন",
    },
    messages: {
      loginSuccess: "লগইন সফল",
      loginFailed: "লগইন ব্যর্থ",
      sessionExpired: "আপনার সেশন শেষ হয়ে গেছে",
      dataSaved: "ডেটা সফলভাবে সংরক্ষিত",
      dataDeleted: "ডেটা সফলভাবে মুছে ফেলা হয়েছে",
      confirmDelete: "আপনি কি নিশ্চিত যে আপনি এটি মুছতে চান?",
      noPermission: "এই কাজ করার অনুমতি আপনার নেই",
      networkError: "নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।",
    },
    errors: {
      required: "এই ফিল্ডটি প্রয়োজন",
      invalidEmail: "অব১ধ ইমেইল ঠিকানা",
      invalidPhone: "অব১ধ ফোন নম্বর",
      passwordWeak: "পাসওয়ার্ড খুব দুর্বল",
      serverError: "সার্ভার ত্রুটি। পরে আবার চেষ্টা করুন।",
      notFound: "সম্পদ পাওয়া যায়নি",
      unauthorized: "অননুমোদিত অ্যাক্সেস",
    },
  },
  ur: {
    common: {
      dashboard: "ڈیش بورڈ",
      settings: "ترتیبات",
      profile: "پروفائل",
      logout: "لاگ آوٹ",
      save: "محفوظ کریں",
      cancel: "منسوخ کریں",
      delete: "حذف کریں",
      edit: "ترمیم کریں",
      view: "دیکھیں",
      search: "تلاش کریں",
      loading: "لوڈ ہو رہا ہے...",
      noData: "کوئی ڈیٹا دستیاب نہیں",
      success: "کامیابی",
      error: "خرابی",
      warning: "انتباہ",
      confirm: "تصدیق کریں",
      back: "واپس",
      next: "اگلا",
      submit: "جمع کرائیں",
      close: "بند کریں",
      yes: "ہاں",
      no: "نہیں",
      all: "سب",
      none: "کوئی نہیں",
      select: "منتقل کریں",
      filter: "فلٹر",
      export: "برآمد کریں",
      import: "درآمد کریں",
      refresh: "ریفریش",
      download: "ڈاؤن لوڈ",
      upload: "اپلوڈ",
    },
    nav: {
      mainMenu: "مرکزی مینو",
      portals: "پورٹلز اور مزید",
      students: "طلباء",
      staff: "عملہ",
      classes: "کلاسیں",
      attendance: "حاضری",
      exams: "امتحانات",
      fees: "فیس",
      library: "لائبریری",
      transport: "ٹرانسپورٹ",
      inventory: "انوینٹری",
      reports: "رپورٹس",
      notifications: "اطلاعات",
    },
    portal: {
      welcome: "واپسی پر خوش آمدید",
      overview: "جائزہ",
      attendance: "حاضری",
      fees: "فیس",
      homework: "گھر کا کام",
      exams: "امتحانات",
      timetable: "ٹائم ٹیبل",
      performance: "کارکردگی",
      leave: "چھٹی",
      payroll: "تنخواہ",
      messages: "پیغامات",
      notices: "اعلانات",
      transport: "ٹرانسپورٹ",
      library: "لائبریری",
    },
    actions: {
      markAttendance: "حاضری لگائیں",
      addStudent: "طالب علم شامل کریں",
      addStaff: "عملہ شامل کریں",
      createExam: "امتحان بنائیں",
      uploadMarks: "نمبر اپلوڈ کریں",
      sendNotice: "نوٹس بھیجیں",
      payFees: "فیس ادا کریں",
      issueBook: "کتاب جاری کریں",
      requestLeave: "چھٹی کی درخواست",
    },
    messages: {
      loginSuccess: "لاگ ان کامیاب",
      loginFailed: "لاگین ناکام",
      sessionExpired: "آپ کا سیشن ختم ہو گیا ہے",
      dataSaved: "ڈیٹا کامیابی سے محفوظ ہو گیا",
      dataDeleted: "ڈیٹا کامیابی سے حذف ہو گیا",
      confirmDelete: "کیا آپ واقعی اسے حذف کرنا چاہتے ہیں؟",
      noPermission: "آپ کو یہ کرنے کی اجازت نہیں ہے",
      networkError: "نیٹورک خرابی۔ براہ کرم دوبارہ کوشش کریں۔",
    },
    errors: {
      required: "یہ فیلد ضروری ہے",
      invalidEmail: "غلط ای میل ایڈریس",
      invalidPhone: "غلط فون نمبر",
      passwordWeak: "پاسورڈ بہت کمزور ہے",
      serverError: "سرور کی خرابی۔ براہ کرم بعد میں دوبارہ کوشش کریں۔",
      notFound: "ریسورس نہیں ملا",
      unauthorized: "غیر مجاز رسائی",
    },
  },
};

for (let i = 0; i < languages.length; i++) {
  const lang = languages[i];
  if (
    lang.code !== "en" &&
    lang.code !== "hi" &&
    lang.code !== "ta" &&
    lang.code !== "bn" &&
    lang.code !== "ur"
  ) {
    translations[lang.code] = translations.en;
  }
}

languages.forEach((lang) => {
  if (!translations[lang.code]) {
    translations[lang.code] = translations.en;
  }
});

function loadLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("school_language");
  if (saved && translations[saved as Language]) {
    return saved as Language;
  }
  const browserLang = navigator.language.split("-")[0];
  if (translations[browserLang as Language]) {
    return browserLang as Language;
  }
  return "en";
}

function saveLanguage(lang: Language) {
  if (typeof window === "undefined") return;
  localStorage.setItem("school_language", lang);
}

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => loadLanguage());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const langInfo = languages.find((l) => l.code === language);
    if (langInfo && langInfo.direction === "rtl") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = language;
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = language;
    }
    saveLanguage(language);
    setIsLoading(false);
  }, [language]);

  const t = useCallback(
    (
      key: keyof TranslationSet,
      value: string,
      params?: Record<string, string>,
    ): string => {
      const translationSet =
        translations[language][key] || translations.en[key];
      let text =
        translationSet[value] || translations.en[key]?.[value] || value;

      if (params) {
        Object.entries(params).forEach(([param, paramValue]) => {
          text = text.replace(new RegExp(`{${param}}`, "g"), paramValue);
        });
      }

      return text;
    },
    [language],
  );

  const setLanguageWithCallback = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  return {
    language,
    setLanguage: setLanguageWithCallback,
    translations: translations[language],
    t,
    isLoading,
    languages,
    currentLanguage: languages.find((l) => l.code === language),
    isRTL: languages.find((l) => l.code === language)?.direction === "rtl",
  };
}

export default useLanguage;
