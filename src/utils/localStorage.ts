import { format, isToday, parse } from "date-fns";

const CONTENT_KEY = "scratchPaper";
const DATE_KEY = "scratchPaperDate";

const getFormattedDate = (date = new Date()) => format(date, "MM-dd-yyyy");

export const getStoredContent = (): string => {
  const storedDate = localStorage.getItem(DATE_KEY);
  const storedContent = localStorage.getItem(CONTENT_KEY) || "";

  if (!storedDate) {
    const currentDate = getFormattedDate();
    localStorage.setItem(DATE_KEY, currentDate);
    return storedContent;
  }

  const parsedDate = getFormattedDate(
    parse(storedDate, "MM-dd-yyyy", new Date())
  );
  console.log(parsedDate, "parsed");
  console.log(isToday(parsedDate), "isToday", storedContent);

  if (isToday(parsedDate)) {
    return storedContent;
  } else {
    const currentDate = getFormattedDate();
    localStorage.setItem(DATE_KEY, currentDate);
    return "";
  }
};

export const storeContent = (content: string): void => {
  localStorage.setItem(CONTENT_KEY, content);
};

export const clearStoredContent = (): void => {
  localStorage.removeItem(CONTENT_KEY);
  localStorage.removeItem(DATE_KEY);
};
