import React from "react"
import { useTranslation } from "react-i18next"
import { addDays, format, isSameDay, Locale } from "date-fns"
import { es, enUS } from "date-fns/locale"

interface FormattedDateProps {
  activeDay: "today" | "tomorrow"
  setActiveDay: React.Dispatch<React.SetStateAction<"today" | "tomorrow">>
}

export const FormattedDate: React.FC<FormattedDateProps> = ({
  activeDay,
  setActiveDay,
}) => {
  const todayDate = new Date()
  const { i18n } = useTranslation()

  const formats: { [langKey: string]: { locale: Locale; formatStr: string } } =
    {
      es: { locale: es, formatStr: "d 'de' MMMM" },
      en: { locale: enUS, formatStr: "MMMM d" },
    }

  const { locale, formatStr } = formats[i18n.language] || formats.en
  const buildFormattedDate = (d: Date) => format(d, formatStr, { locale })
  const today = buildFormattedDate(todayDate)
  const tomorrow_ = addDays(todayDate, 1)
  const tomorrow = buildFormattedDate(tomorrow_)

  return (
    <div className="text-sm font-light mt-6 mb-8 ml-5">
      <span
        onClick={() => setActiveDay("today")}
        className={`cursor-pointer pr-4 text-gray-${
          activeDay === "today" ? "500" : "300"
        }`}
      >
        {i18n.language === "es" ? `el ${today}` : today}
      </span>
      <span>|</span>

      <span
        onClick={() => setActiveDay("tomorrow")}
        className={`cursor-pointer pl-4 text-gray-${
          activeDay === "tomorrow" ? "500" : "300"
        }`}
      >
        {i18n.language === "es" ? `el ${tomorrow}` : tomorrow}
      </span>
    </div>
  )
}
