import React from "react"
import { useTranslation } from "react-i18next"
import { addDays, format, Locale, subDays } from "date-fns"
import { es, enUS } from "date-fns/locale"

interface FormattedDateProps {
  date: Date
}

export const FormattedDate: React.FC<FormattedDateProps> = ({ date }) => {
  const { i18n } = useTranslation()

  const formats: { [langKey: string]: { locale: Locale; formatStr: string } } =
    {
      es: { locale: es, formatStr: "d 'de' MMMM" },
      en: { locale: enUS, formatStr: "MMMM d" },
    }

  const { locale, formatStr } = formats[i18n.language] || formats.en
  const buildFormattedDate = (d: Date) => format(d, formatStr, { locale })
  const today = buildFormattedDate(date)
  const tomorrow = buildFormattedDate(addDays(date, 1))

  return (
    <div className="text-sm font-light mt-6 mb-8 ml-5 text-gray-500">
      <span className="pr-4">
        {i18n.language === "es" ? `el ${today}` : today}
      </span>
      <span>|</span>

      <span className="pl-4">
        {i18n.language === "es" ? `el ${tomorrow}` : tomorrow}
      </span>
    </div>
  )
}
