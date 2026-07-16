import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
    },
  },
  es: {
    translation: {

    },
  },
};

const savedLanguage = localStorage.getItem("i18nextLng") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("i18nextLng", lng);
});

export default i18n;
