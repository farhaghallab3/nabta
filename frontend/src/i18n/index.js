import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ar from "./ar.json";

export const LANGS = {
  ar: { label: "العربية", dir: "rtl", short: "ع" },
  en: { label: "English", dir: "ltr", short: "EN" },
};

const STORAGE_KEY = "nabta_lang";

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGS[saved]) return saved;
  } catch {
    /* ignore */
  }
  return "ar"; // Arabic is the default language
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: initialLang(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export function applyDocumentLang(lng) {
  const meta = LANGS[lng] || LANGS.ar;
  const html = document.documentElement;
  html.setAttribute("lang", lng);
  html.setAttribute("dir", meta.dir);
}

export function setLanguage(lng) {
  if (!LANGS[lng]) return;
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* ignore */
  }
  // A full reload is the simplest way to re-fetch every list/detail in the
  // new language and re-flow the layout for RTL/LTR.
  if (i18n.language !== lng) {
    i18n.changeLanguage(lng).then(() => window.location.reload());
  }
}

applyDocumentLang(i18n.language);

export default i18n;
