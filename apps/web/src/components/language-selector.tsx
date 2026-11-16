import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type Language =
  | "en"
  | "hi"
  | "ta"
  | "te"
  | "mr"
  | "gu"
  | "bn"
  | "kn"
  | "ml"
  | "pa";

interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  direction: "ltr" | "rtl";
}

export const supportedLanguages: LanguageConfig[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    direction: "ltr",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिंदी",
    flag: "🇮🇳",
    direction: "ltr",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    flag: "🇮🇳",
    direction: "ltr",
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    flag: "🇮🇳",
    direction: "ltr",
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    flag: "🇮🇳",
    direction: "ltr",
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    flag: "🇮🇳",
    direction: "ltr",
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    flag: "🇮🇳",
    direction: "ltr",
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    flag: "🇮🇳",
    direction: "ltr",
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    flag: "🇮🇳",
    direction: "ltr",
  },
  {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    flag: "🇮🇳",
    direction: "ltr",
  },
];

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    students: "Students",
    teachers: "Teachers",
    classes: "Classes",
    attendance: "Attendance",
    exams: "Exams",
    fees: "Fees",
    library: "Library",
    transport: "Transport",
    reports: "Reports",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout",
    search: "Search",
    notifications: "Notifications",
    welcome: "Welcome",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    submit: "Submit",
    close: "Close",
    confirm: "Confirm",
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
    yes: "Yes",
    no: "No",
    back: "Back",
    next: "Next",
    previous: "Previous",
    first: "First",
    last: "Last",
    of: "of",
    showing: "Showing",
    to: "to",
    results: "results",
    noData: "No data available",
    noResults: "No results found",
    select: "Select",
    all: "All",
    none: "None",
    filter: "Filter",
    sort: "Sort",
    download: "Download",
    upload: "Upload",
    export: "Export",
    import: "Import",
    print: "Print",
    refresh: "Refresh",
    help: "Help",
    support: "Support",
    about: "About",
    version: "Version",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    feedback: "Feedback",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    date: "Date",
    time: "Time",
    day: "Day",
    month: "Month",
    year: "Year",
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    night: "Night",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    students: "छात्र",
    teachers: "शिक्षक",
    classes: "कक्षाएं",
    attendance: "उपस्थिति",
    exams: "परीक्षाएं",
    fees: "फीस",
    library: "पुस्तकालय",
    transport: "परिवहन",
    reports: "रिपोर्ट्स",
    settings: "सेटिंग्स",
    profile: "प्रोफाइल",
    logout: "लॉगआउट",
    search: "खोजें",
    notifications: "सूचनाएं",
    welcome: "स्वागत है",
    loading: "लोड हो रहा है...",
    save: "सेव करें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    create: "बनाएं",
    submit: "सबमिट करें",
    close: "बंद करें",
    confirm: "पुष्टि करें",
    success: "सफल",
    error: "त्रुटि",
    warning: "चेतावनी",
    info: "जानकारी",
    yes: "हां",
    no: "नहीं",
    back: "वापस",
    next: "अगला",
    previous: "पिछला",
    first: "पहला",
    last: "अंतिम",
    of: "का",
    showing: "दिखा रहा है",
    to: "से",
    results: "परिणाम",
    noData: "कोई डेटा उपलब्ध नहीं",
    noResults: "कोई परिणाम नहीं मिला",
    select: "चुनें",
    all: "सभी",
    none: "कोई नहीं",
    filter: "फिल्टर",
    sort: "क्रमबद्ध करें",
    download: "डाउनलोड",
    upload: "अपलोड",
    export: "निर्यात",
    import: "आयात",
    print: "प्रिंट",
    refresh: "ताज़ा करें",
    help: "सहायता",
    support: "समर्थन",
    about: "के बारे में",
    version: "संस्करण",
    privacy: "गोपनीयता",
    terms: "शर्तें",
    contact: "संपर्क",
    feedback: "फीडबैक",
    language: "भाषा",
    theme: "थीम",
    light: "हल्का",
    dark: "गहरा",
    system: "सिस्टम",
    date: "तारीख",
    time: "समय",
    day: "दिन",
    month: "महीना",
    year: "साल",
    today: "आज",
    yesterday: "कल",
    tomorrow: "कल",
    morning: "सुबह",
    afternoon: "दोपहर",
    evening: "शाम",
    night: "रात",
  },
  ta: {
    dashboard: "டாஷ்போர்டு",
    students: "மாணவர்கள்",
    teachers: "ஆசிரியர்கள்",
    classes: "வகுப்புகள்",
    attendance: "வருகை",
    exams: "தேர்வுகள்",
    fees: "கட்டணங்கள்",
    library: "நூலகம்",
    transport: "போக்குவரத்து",
    reports: "அறிக்கைகள்",
    settings: "அமைப்புகள்",
    profile: "சுயவிவரம்",
    logout: "வெளியேறு",
    search: "தேடு",
    notifications: "அறிவிப்புகள்",
    welcome: "வரவேற்கிறோம்",
    loading: "ஏற்றுகிறது...",
    save: "சேமி",
    cancel: "ரத்து செய்",
    delete: "நீக்கு",
    edit: "திருத்து",
    create: "உருவாக்கு",
    submit: "சமர்ப்பி",
    close: "மூடு",
    confirm: "உறுதி செய்",
    success: "வெற்றி",
    error: "பிழை",
    warning: "எச்சரிக்கை",
    info: "தகவல்",
    yes: "ஆம்",
    no: "இல்லை",
    back: "பின்",
    next: "அடுத்து",
    previous: "முந்தைய",
    first: "முதல்",
    last: "கடைசி",
    of: "இல்",
    showing: "காட்டுகிறது",
    to: "வரை",
    results: "முடிவுகள்",
    noData: "தரவு இல்லை",
    noResults: "முடிவுகள் இல்லை",
    select: "தேர்ந்தெடு",
    all: "அனைத்தும்",
    none: "எதுவும் இல்லை",
    filter: "வடிப்பான்",
    sort: "வரிசைப்படுத்து",
    download: "பதிவிறக்கு",
    upload: "பதிவேற்று",
    export: "ஏற்றுமதி",
    import: "இறக்குமதி",
    print: "அச்சிடு",
    refresh: "புதுப்பி",
    help: "உதவி",
    support: "ஆதரவு",
    about: "பற்றி",
    version: "பதிப்பு",
    privacy: "தனியுரிமை",
    terms: "விதிமுறைகள்",
    contact: "தொடர்பு",
    feedback: "கருத்து",
    language: "மொழி",
    theme: "தீம்",
    light: "ஒளி",
    dark: "இருள்",
    system: "அமைப்பு",
    date: "தேதி",
    time: "நேரம்",
    day: "நாள்",
    month: "மாதம்",
    year: "வருடம்",
    today: "இன்று",
    yesterday: "நேற்று",
    tomorrow: "நாளை",
    morning: "காலை",
    afternoon: "மதியம்",
    evening: "மாலை",
    night: "இரவு",
  },
  te: {
    dashboard: "డాష్బోర్డ్",
    students: "విద్యార్థులు",
    teachers: "ఉపాధ్యాయులు",
    classes: "తరగతులు",
    attendance: "హాజరు",
    exams: "పరీక్షలు",
    fees: "ఫీజులు",
    library: "లైబ్రరీ",
    transport: "రవాణా",
    reports: "నివేదికలు",
    settings: "సెట్టింగ్స్",
    profile: "ప్రొఫైల్",
    logout: "లాగ్అవుట్",
    search: "శోధన",
    notifications: "నోటిఫికేషన్లు",
    welcome: "స్వాగతం",
    loading: "లోడ్ అవుతోంది...",
    save: "సేవ్",
    cancel: "రద్దు",
    delete: "తొలగించు",
    edit: "ఎడిట్",
    create: "సృష్టించు",
    submit: "సమర్పించు",
    close: "మూసివేయి",
    confirm: "నిర్ధారించు",
    success: "విజయం",
    error: "లోపం",
    warning: "హెచ్చరిక",
    info: "సమాచారం",
    yes: "అవును",
    no: "కాదు",
    back: "వెనుక",
    next: "తదుపరి",
    previous: "మునుపటి",
    first: "మొదటి",
    last: "చివరి",
    of: "యొక్క",
    showing: "చూపిస్తుంది",
    to: "కు",
    results: "ఫలితాలు",
    noData: "డేటా లేదు",
    noResults: "ఫలితాలు లేవు",
    select: "ఎంచుకోండి",
    all: "అన్నీ",
    none: "ఏమీ లేదు",
    filter: "ఫిల్టర్",
    sort: "క్రమబద్ధీకరణ",
    download: "డౌన్‌లోడ్",
    upload: "అప్‌లోడ్",
    export: "ఎగుమతి",
    import: "దిగుమతి",
    print: "ప్రింట్",
    refresh: "రిఫ్రెష్",
    help: "సహాయం",
    support: "మద్దతు",
    about: "గురించి",
    version: "సంస్కరణ",
    privacy: "గోప్యత",
    terms: "నియమాలు",
    contact: "సంప్రదింపు",
    feedback: "అభిప్రాయం",
    language: "భాష",
    theme: "థీమ్",
    light: "లైట్",
    dark: "డార్క్",
    system: "సిస్టమ్",
    date: "తేదీ",
    time: "సమయం",
    day: "రోజు",
    month: "నెల",
    year: "సంవత్సరం",
    today: "ఈ రోజు",
    yesterday: "నిన్న",
    tomorrow: "రేపు",
    morning: "ఉదయం",
    afternoon: "మధ్యాహ్నం",
    evening: "సాయంత్రం",
    night: "రాత్రి",
  },
  mr: {},
  gu: {},
  bn: {},
  kn: {},
  ml: {},
  pa: {},
};

// Fill empty translations with English as fallback
supportedLanguages.forEach((lang) => {
  if (
    !translations[lang.code] ||
    Object.keys(translations[lang.code]).length === 0
  ) {
    translations[lang.code] = translations.en;
  }
});

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language;
      return saved || "en";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("language", currentLanguage);
    document.documentElement.lang = currentLanguage;

    const config = supportedLanguages.find((l) => l.code === currentLanguage);
    if (config) {
      document.documentElement.dir = config.direction;
    }
  }, [currentLanguage]);

  const t = (key: string): string => {
    return translations[currentLanguage][key] || translations.en[key] || key;
  };

  const isRTL =
    supportedLanguages.find((l) => l.code === currentLanguage)?.direction ===
    "rtl";

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage: setCurrentLanguage,
        t,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

interface LanguageSelectorProps {
  variant?: "dropdown" | "buttons" | "minimal";
}

export function LanguageSelector({
  variant = "dropdown",
}: LanguageSelectorProps) {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentConfig = supportedLanguages.find(
    (l) => l.code === currentLanguage,
  );

  if (variant === "minimal") {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 text-sm transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span className="text-lg">{currentConfig?.flag}</span>
        <span className="font-medium">{currentConfig?.nativeName}</span>
      </button>
    );
  }

  if (variant === "buttons") {
    return (
      <div className="flex flex-wrap gap-2">
        {supportedLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              currentLanguage === lang.code
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.nativeName}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <Globe className="h-5 w-5 text-gray-500" />
        <span className="text-lg">{currentConfig?.flag}</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {currentConfig?.nativeName}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="max-h-80 overflow-y-auto p-2">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    currentLanguage === lang.code
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${currentLanguage === lang.code ? "text-primary" : "text-gray-900 dark:text-gray-100"}`}
                    >
                      {lang.nativeName}
                    </p>
                    <p className="text-gray-500 text-sm">{lang.name}</p>
                  </div>
                  {currentLanguage === lang.code && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSelector;
