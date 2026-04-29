import type { PlasmoCSConfig } from "plasmo"

import { clickAtElementCenter } from "~utils/clickAtElementCenter"

import { waitForElement } from "./utils/waitForElement"

export const config: PlasmoCSConfig = {
  matches: ["https://www.recreation.gov/ticket/253731/ticket/255*"],
  run_at: "document_idle"
}

console.log("Haleakala Sunrise extension content script loaded")

void (async () => {
  const toggleCalendarButton = await waitForElement(
    "button.toggle-calendar-button"
  )
  clickAtElementCenter(toggleCalendarButton)
})()
