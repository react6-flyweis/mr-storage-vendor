import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      fetchingBundle: "Fetching bundle details...",
      bundleNotFound: "Bundle Not Found",
      bundleNotFoundDesc: "We couldn't retrieve the details for this bundle. Please check the URL or try again.",
      plantPortal: "Plant Portal",
      bundleDetails: "Bundle Details",
      bundleWarnings: "Bundle Warnings",
      untitledBundle: "Untitled Bundle",
      totalQty: "Total Qty",
      itemsCount: "{{qty}} items",
      totalWeight: "Total Weight",
      maxLength: "Max Length",
      loadSeq: "Load Seq",
      stackingInfo: "Stacking Info",
      stackLevel: "{{level}} Level",
      loadingPriority: "Priority: {{priority}}",
      handlingInstruction: "Handling Instruction",
      noHandlingInstructions: "No special handling instructions.",
      notes: "Notes",
      bundleItems: "Bundle Items ({{count}})",
      partCode: "Part Code",
      description: "Description",
      qty: "Qty",
      lengthFt: "Length (Ft)",
      weightLbs: "Weight (Lbs)",
      length: "Length",
      weight: "Weight",
      markIds: "Mark IDs",
      marks: "Marks:",
      lbs: "lbs",
      ft: "ft",

    },
  },
  es: {
    translation: {
      fetchingBundle: "Obteniendo detalles del paquete...",
      bundleNotFound: "Paquete No Encontrado",
      bundleNotFoundDesc: "No pudimos recuperar los detalles de este paquete. Por favor, verifique la URL o intente nuevamente.",
      plantPortal: "Portal de Planta",
      bundleDetails: "Detalles del Paquete",
      bundleWarnings: "Advertencias del Paquete",
      untitledBundle: "Paquete sin Título",
      totalQty: "Cant. Total",
      itemsCount: "{{qty}} artículos",
      totalWeight: "Peso Total",
      maxLength: "Longitud Máxima",
      loadSeq: "Sec. de Carga",
      stackingInfo: "Información de Apilamiento",
      stackLevel: "Nivel {{level}}",
      loadingPriority: "Prioridad: {{priority}}",
      handlingInstruction: "Instrucción de Manipulación",
      noHandlingInstructions: "Sin instrucciones especiales de manipulación.",
      notes: "Notas",
      bundleItems: "Artículos del Paquete ({{count}})",
      partCode: "Código de Parte",
      description: "Descripción",
      qty: "Cant",
      lengthFt: "Longitud (Ft)",
      weightLbs: "Peso (Lbs)",
      length: "Longitud",
      weight: "Peso",
      markIds: "IDs de Marca",
      marks: "Marcas:",
      lbs: "lbs",
      ft: "ft",

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
