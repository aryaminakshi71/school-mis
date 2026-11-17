import { useI18n } from "@/lib/i18n";

/** Toggles between English and Hindi. Place it in the app header. */
export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "hi" : "en")}
      className="rounded-md border border-border px-2 py-1 text-sm hover:bg-muted"
      aria-label="Switch language"
      title="Switch language"
    >
      {lang === "en" ? "हिंदी" : "English"}
    </button>
  );
}
