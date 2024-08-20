import { format, isToday, parse, startOfDay } from "date-fns";

const CONTENT_KEY = "scratchPaper";
const DATE_KEY = "scratchPaperDate";
// We do this so we can parse it as json later for TipTap
const EMPTY_CONTENT = `{"type":"doc","content":[{"type":"paragraph"}]}`;

const getFormattedDate = (date = new Date()) => format(date, "MM-dd-yyyy");

export const getStoredContent = (): string => {
  const storedDate = localStorage.getItem(DATE_KEY);
  const storedContent = localStorage.getItem(CONTENT_KEY) || EMPTY_CONTENT;

  if (!storedDate) {
    const currentDate = getFormattedDate();
    localStorage.setItem(DATE_KEY, currentDate);
    return storedContent;
  }

  const parsedDate = parse(storedDate, "MM-dd-yyyy", new Date());

  if (isToday(startOfDay(parsedDate))) {
    return storedContent;
  } else {
    const currentDate = getFormattedDate();
    localStorage.setItem(DATE_KEY, currentDate);
    storeContent(EMPTY_CONTENT);
    return EMPTY_CONTENT;
  }
};

export const storeContent = (content: string): void => {
  localStorage.setItem(CONTENT_KEY, content);
};

export const resetStoredContent = (): void => {
  localStorage.setItem(CONTENT_KEY, EMPTY_CONTENT);
};
