import type { PlasmoCSConfig } from "plasmo"

import { clickAtElementCenter } from "~utils/clickAtElementCenter"
import { waitUntilVisible } from "~utils/waitUntilVisible"

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

  const calendarGridContainer = await waitForElement(
    "div.calendar-grids-container"
  )
  const may23Box = await waitForElement(
    'div[aria-label*="Saturday, May 23, 2026"]',
    calendarGridContainer
  )
  clickAtElementCenter(may23Box)

  const timePill = await waitForElement("div.ti-radio-pill-time")
  await waitUntilVisible(timePill)

  const requestTicketsButton = await waitForElement("#request-tickets")
  clickAtElementCenter(requestTicketsButton)
})()
