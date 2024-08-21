import { format, isToday, parse, startOfDay } from "date-fns";
import i18next from "../translations/i18n";

const CONTENT_KEY = "scratchPaper";
const DATE_KEY = "scratchPaperDate";
// We do this so we can parse it as json later for TipTap
const EMPTY_CONTENT = `{"type":"doc","content":[{"type":"paragraph"}]}`;
// This is my default list template
const TEMPLATE_CONTENT = `{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"${i18next.t(
  "editor.today"
)}"}]},{"type":"orderedList","attrs":{"start":1},"content":[{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]}]}]}`;

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
    storeContent(TEMPLATE_CONTENT);
    return TEMPLATE_CONTENT;
  }
};

export const storeContent = (content: string): void => {
  localStorage.setItem(CONTENT_KEY, content);
};

export const resetStoredContent = (): void => {
  localStorage.setItem(CONTENT_KEY, TEMPLATE_CONTENT);
};
