import type { PlasmoCSConfig } from "plasmo"

import { clickAtElementCenter } from "~utils/clickAtElementCenter"
import { formatAriaLabel, getTargetDate } from "~utils/targetDate"
import { waitUntilVisible } from "~utils/waitUntilVisible"

import { waitForElement } from "./utils/waitForElement"

export const config: PlasmoCSConfig = {
  matches: ["https://www.recreation.gov/ticket/253731/ticket/255*"],
  run_at: "document_idle"
}

console.log("Haleakala Sunrise extension content script loaded")

const sleep = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms))

void (async () => {
  const targetDate = await getTargetDate()
  const targetAriaLabel = formatAriaLabel(targetDate)

  const toggleCalendarButton = await waitForElement(
    "button.toggle-calendar-button"
  )
  clickAtElementCenter(toggleCalendarButton)
  await sleep(500)

  const calendarGridContainer = await waitForElement(
    "div.calendar-grids-container"
  )
  const targetDateBox = await waitForElement(
    `div[aria-label*="${targetAriaLabel}"]`,
    calendarGridContainer
  )
  clickAtElementCenter(targetDateBox)
  await sleep(500)

  const timePill = await waitForElement("div.ti-radio-pill-time")
  await waitUntilVisible(timePill)

  const requestTicketsButton = await waitForElement("#request-tickets")
  clickAtElementCenter(requestTicketsButton)
  await sleep(500)
})()
