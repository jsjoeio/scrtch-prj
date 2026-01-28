import React from "react"
import { useTranslation } from "react-i18next"
import { ActiveDay } from "../App"

interface FormattedDateProps {
  activeDay: ActiveDay
  setActiveDay: React.Dispatch<React.SetStateAction<ActiveDay>>
}

export const FormattedDate: React.FC<FormattedDateProps> = ({
  activeDay,
  setActiveDay,
}) => {
  const { t } = useTranslation()

  return (
    <div className="text-sm font-light mt-6 mb-8 ml-5">
      <span
        onClick={() => setActiveDay("dia1")}
        className={`cursor-pointer pr-4 text-gray-${
          activeDay === "dia1" ? "500" : "300"
        }`}
      >
        {t("editor.dia1")}
      </span>
      <span>|</span>

      <span
        onClick={() => setActiveDay("dia2")}
        className={`cursor-pointer px-4 text-gray-${
          activeDay === "dia2" ? "500" : "300"
        }`}
      >
        {t("editor.dia2")}
      </span>
      <span>|</span>

      <span
        onClick={() => setActiveDay("apuntes")}
        className={`cursor-pointer pl-4 text-gray-${
          activeDay === "apuntes" ? "500" : "300"
        }`}
      >
        {t("editor.apuntes")}
      </span>
    </div>
  )
}
