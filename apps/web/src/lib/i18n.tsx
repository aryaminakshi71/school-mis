/**
 * Lightweight i18n (English + Hindi)
 *
 * Usage:
 *   <I18nProvider> ... </I18nProvider>
 *   const { t, lang, setLang } = useI18n()
 *   t('fees') // "Fees" or "शुल्क"
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Lang = 'en' | 'hi';

const dict: Record<Lang, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    students: 'Students',
    teachers: 'Teachers',
    fees: 'Fees',
    attendance: 'Attendance',
    exams: 'Exams',
    timetable: 'Timetable',
    library: 'Library',
    transport: 'Transport',
    reports: 'Reports',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    total: 'Total',
    amount: 'Amount',
    date: 'Date',
    name: 'Name',
    class: 'Class',
    section: 'Section',
    status: 'Status',
    paid: 'Paid',
    pending: 'Pending',
    feeReceipt: 'Fee Receipt',
    print: 'Print / Save PDF',
    backToFees: 'Back to Fees',
    notificationSent: 'Notification sent',
    language: 'Language',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    students: 'छात्र',
    teachers: 'शिक्षक',
    fees: 'शुल्क',
    attendance: 'उपस्थिति',
    exams: 'परीक्षा',
    timetable: 'समय-सारणी',
    library: 'पुस्तकालय',
    transport: 'परिवहन',
    reports: 'रिपोर्ट',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    login: 'लॉग इन',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    search: 'खोजें',
    add: 'जोड़ें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    total: 'कुल',
    amount: 'राशि',
    date: 'दिनांक',
    name: 'नाम',
    class: 'कक्षा',
    section: 'वर्ग',
    status: 'स्थिति',
    paid: 'भुगतान हुआ',
    pending: 'लंबित',
    feeReceipt: 'शुल्क रसीद',
    print: 'प्रिंट / पीडीएफ सहेजें',
    backToFees: 'शुल्क पर वापस',
    notificationSent: 'सूचना भेजी गई',
    language: 'भाषा',
  },
};

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nValue>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    return (localStorage.getItem('lang') as Lang) || 'en';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') localStorage.setItem('lang', l);
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      t: (key: string) => dict[lang][key] ?? dict.en[key] ?? key,
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
