import { useEffect, useState } from "react"

const STORAGE_KEY = "targetDate"
const REFRESH_SECONDS_KEY = "refreshEverySeconds"
const DEFAULT_DATE = "2026-05-23"
const DEFAULT_REFRESH_SECONDS = 15

function IndexPopup() {
  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE)
  const [refreshEverySeconds, setRefreshEverySeconds] = useState(
    DEFAULT_REFRESH_SECONDS
  )

  useEffect(() => {
    void chrome.storage.local.get(
      [STORAGE_KEY, REFRESH_SECONDS_KEY],
      (result) => {
        const storedDate = result[STORAGE_KEY]
        const storedRefreshSeconds = result[REFRESH_SECONDS_KEY]

        if (typeof storedDate === "string" && storedDate) {
          setSelectedDate(storedDate)
        }

        if (
          typeof storedRefreshSeconds === "number" &&
          storedRefreshSeconds > 0
        ) {
          setRefreshEverySeconds(storedRefreshSeconds)
        }
      }
    )
  }, [])

  const onDateChange = (value: string) => {
    setSelectedDate(value)
    void chrome.storage.local.set({
      [STORAGE_KEY]: value
    })
  }

  const onRefreshEverySecondsChange = (value: string) => {
    const parsedValue = Number(value)
    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      return
    }

    const nextValue = Math.floor(parsedValue)
    setRefreshEverySeconds(nextValue)
    void chrome.storage.local.set({
      [REFRESH_SECONDS_KEY]: nextValue
    })
  }

  return (
    <div
      style={{
        padding: 16,
        minWidth: 240
      }}>
      <h2 style={{ margin: "0 0 12px" }}>Haleakala Sunrise</h2>
      <label
        htmlFor="target-date"
        style={{
          display: "block",
          marginBottom: 6
        }}>
        Target date
      </label>
      <input
        id="target-date"
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
      />
      <label
        htmlFor="refresh-seconds"
        style={{
          display: "block",
          marginTop: 12,
          marginBottom: 6
        }}>
        Refresh every (seconds)
      </label>
      <input
        id="refresh-seconds"
        type="number"
        min={1}
        step={1}
        value={refreshEverySeconds}
        onChange={(e) => onRefreshEverySecondsChange(e.target.value)}
      />
      <a
        href="https://www.recreation.gov/ticket/253731/ticket/255"
        target="_blank"
        rel="noreferrer"
        style={{
          display: "block",
          marginTop: 14
        }}>
        Open Recreation.gov page
      </a>
    </div>
  )
}

export default IndexPopup
