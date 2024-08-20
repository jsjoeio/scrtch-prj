import React from "react";
import { useTranslation } from "react-i18next";
import { format, Locale } from "date-fns";
import { es, enUS } from "date-fns/locale";

interface FormattedDateProps {
  date: Date;
}

export const FormattedDate: React.FC<FormattedDateProps> = ({ date }) => {
  const { i18n } = useTranslation();

  const formats: { [langKey: string]: { locale: Locale; formatStr: string } } =
    {
      es: { locale: es, formatStr: "d 'de' MMMM" },
      en: { locale: enUS, formatStr: "MMMM d" },
    };

  console.log(i18n.language);
  const { locale, formatStr } = formats[i18n.language] || formats.en;
  const formattedDate = format(date, formatStr, { locale });

  return (
    <h1 className="text-sm font-light mt-6 mb-8 ml-5 text-gray-500">
      {i18n.language === "es" ? `el ${formattedDate}` : formattedDate}
    </h1>
  );
};
