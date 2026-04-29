import { useEffect, useState } from "react"

const STORAGE_KEY = "targetDate"
const DEFAULT_DATE = "2026-05-23"

function IndexPopup() {
  const [selectedDate, setSelectedDate] = useState(DEFAULT_DATE)

  useEffect(() => {
    void chrome.storage.local.get(STORAGE_KEY, (result) => {
      const storedDate = result[STORAGE_KEY]

      if (typeof storedDate === "string" && storedDate) {
        setSelectedDate(storedDate)
      }
    })
  }, [])

  const onDateChange = (value: string) => {
    setSelectedDate(value)
    void chrome.storage.local.set({
      [STORAGE_KEY]: value
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
    </div>
  )
}

export default IndexPopup
