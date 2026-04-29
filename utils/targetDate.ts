const STORAGE_KEY = "targetDate"
const DEFAULT_DATE = "2026-05-23"

export const getTargetDate = async () => {
  const result = await chrome.storage.local.get(STORAGE_KEY)

  if (typeof result[STORAGE_KEY] === "string" && result[STORAGE_KEY]) {
    return result[STORAGE_KEY]
  }

  return DEFAULT_DATE
}

export const formatAriaLabel = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00`)

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date)
}
