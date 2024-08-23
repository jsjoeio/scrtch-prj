import i18next from "../translations/i18n"
import { ActiveDay } from "../App"

// const getFormattedDate = (date = new Date()) => format(date, "MM-dd-yyyy")

/*
Okay so what we do is we pass in active day to get stored content
- we store the content in local storage for the active day
- and when active day changes, we get the new content

later i'll figure out automatically erasing the content with a clean up function 

*/

export const getStoredContent = (activeDay: ActiveDay): string => {
  const TEMPLATE_CONTENT = `{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"${i18next.t(
    `editor.${activeDay}`
  )}"}]},{"type":"orderedList","attrs":{"start":1},"content":[{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]},{"type":"listItem","content":[{"type":"paragraph"}]}]}]}`
  // const storedDate = localStorage.getItem(DATE_KEY)
  const key = activeDay
  const storedContent = localStorage.getItem(key) || TEMPLATE_CONTENT

  // if (!storedDate) {
  //   const currentDate = getFormattedDate()
  //   localStorage.setItem(DATE_KEY, currentDate)
  //   return storedContent
  // }

  // const parsedDate = parse(storedDate, "MM-dd-yyyy", new Date())

  // if (isToday(startOfDay(parsedDate))) {
  //   return storedContent
  // } else {
  // const currentDate = getFormattedDate()
  // localStorage.setItem(DATE_KEY, currentDate)
  if (storedContent) {
    return storedContent
  }
  storeContent(key, TEMPLATE_CONTENT)
  return TEMPLATE_CONTENT
  // }
}

export const storeContent = (key: string, content: string): void => {
  localStorage.setItem(key, content)
}

// export const resetStoredContent = (): void => {
//   localStorage.setItem(CONTENT_KEY, TEMPLATE_CONTENT)
// }
