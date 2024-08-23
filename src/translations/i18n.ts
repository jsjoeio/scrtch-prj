import i18n from "i18next"
import { initReactI18next } from "react-i18next"

// WIP: look at this: https://github.com/i18next/react-i18next/blob/master/example/react/src/i18n.js
// y esto: https://react.i18next.com/latest/trans-component
// the translations
// (tip move them in a JSON ile and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      editor: {
        bold: "Bold",
        italic: "Italic",
        strike: "Strike",
        today: "today",
        tomorrow: "tomorrow",
      },
    },
  },
  es: {
    translation: {
      editor: {
        bold: "Negrita",
        italic: "Cursiva",
        strike: "Tachado",
        today: "hoy",
        tomorrow: "mañana",
      },
    },
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "es", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
