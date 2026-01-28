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
        className={
          activeDay === "dia1"
            ? "cursor-pointer pr-4 text-gray-500"
            : "cursor-pointer pr-4 text-gray-300"
        }
      >
        {t("editor.dia1")}
      </span>
      <span>|</span>

      <span
        onClick={() => setActiveDay("dia2")}
        className={
          activeDay === "dia2"
            ? "cursor-pointer px-4 text-gray-500"
            : "cursor-pointer px-4 text-gray-300"
        }
      >
        {t("editor.dia2")}
      </span>
      <span>|</span>

      <span
        onClick={() => setActiveDay("apuntes")}
        className={
          activeDay === "apuntes"
            ? "cursor-pointer pl-4 text-gray-500"
            : "cursor-pointer pl-4 text-gray-300"
        }
      >
        {t("editor.apuntes")}
      </span>
    </div>
  )
}
