const CONTENT_KEY = 'scratchPadContent';
const DATE_KEY = 'scratchPadDate';

export const getStoredContent = (): string => {
  const savedContent = localStorage.getItem(CONTENT_KEY);
  const savedDate = localStorage.getItem(DATE_KEY);
  const today = new Date().toDateString();

  if (savedDate === today && savedContent) {
    return savedContent;
  }

  return '';
};

export const storeContent = (content: string): void => {
  localStorage.setItem(CONTENT_KEY, content);
  localStorage.setItem(DATE_KEY, new Date().toDateString());
};

export const clearStoredContent = (): void => {
  localStorage.removeItem(CONTENT_KEY);
  localStorage.removeItem(DATE_KEY);
};