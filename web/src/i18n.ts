import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "Habits": "Habits",
      "Habit": "Habit",
      "Settings": "Settings",
      "Language": "Language",
      "Home": "Home",
      "Tasks": "Tasks",
      "Finances": "Finances",
      "Groceries": "Groceries",
      "Documents": "Documents",
      "Dashboard": "Dashboard",
      "Shopping List": "Shopping List",
      "Add": "Add",
      "Search and add items": "Search and add items",
      "Catalog": "Catalog",
      "Search": "Search",
      "Pieces": "Pieces",
      "Checkout": "Checkout",
      "Are you want to checkout?": "Are you want to checkout?",
      "This will clear all checked items. Checkouts can be viewd in your groceries history.": "This will clear all checked items. Checkouts can be viewd in your groceries history.",
      "Proceed": "Proceed",
      "Cancel": "Cancel",
      "Your grocery list is empty. Add some items.": "Your grocery list is empty. Add some items.",
      "Item": "Item",
      "Clear": "Clear",
      "Add some groceries to your list.": "Add some groceries to your list.",
    }
  },
  es: {
    translation: {
      "Habits": "Hábitos",
      "Habit": "Hábito",
      "Settings": "Ajustes",
      "Language": "Idioma",
      "Home": "Casa",
      "Tasks": "Tareas",
      "Finances": "Finanzas",
      "Groceries": "Comestibles",
      "Documents": "Documentos",
      "Dashboard": "Panel",
      "Shopping List": "Lista de compras",
      "Add": "Agregar",
      "Search and add items": "Buscar y añadir artículos",
      "Catalog": "Catalogar",
      "Search": "Buscar",
      "Pieces": "Piezas",
      "Checkout": "Verificar",
      "Are you want to checkout?": "¿Quieres pagar?",
      "This will clear all checked items. Checkouts can be viewd in your groceries history.": "Esto eliminará todos los artículos seleccionados. Las compras realizadas se pueden consultar en tu historial de compras.",
      "Proceed": "Proceder",
      "Cancel": "Cancelar",
      "Add some groceries to your list.": "Añade algunos productos de alimentación a tu lista.",
      "Item": "Artículo",
      "Clear": "Claro"
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
