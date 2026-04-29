import type { PlasmoCSConfig } from "plasmo"

import { clickAtElementCenter } from "~utils/clickAtElementCenter"
import { formatAriaLabel, getTargetDate } from "~utils/targetDate"
import { waitForTargetDateButton } from "~utils/waitForTargetDateButton"
import { waitUntilVisible } from "~utils/waitUntilVisible"

import { waitForElement } from "./utils/waitForElement"

export const config: PlasmoCSConfig = {
  matches: ["https://www.recreation.gov/ticket/253731/ticket/255*"],
  run_at: "document_idle"
}

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

  let targetDateBox = await waitForTargetDateButton(
    calendarGridContainer,
    targetAriaLabel,
    1000
  )

  const maxNextMonthClicks = 5
  let nextMonthClicks = 0

  while (!targetDateBox && nextMonthClicks < maxNextMonthClicks) {
    const calendarHeaderGroup = await waitForElement(
      "div.calendar-header-group"
    )
    const nextMonthButton = await waitForElement(
      'button.next-prev-button[aria-label="Next"]',
      calendarHeaderGroup
    )

    const isNextDisabled =
      nextMonthButton.getAttribute("disabled") !== null ||
      nextMonthButton.getAttribute("aria-disabled") === "true"

    if (isNextDisabled) {
      throw new Error("Next month button is disabled; cannot advance calendar.")
    }

    clickAtElementCenter(nextMonthButton)
    nextMonthClicks += 1
    await sleep(1000)

    targetDateBox = await waitForTargetDateButton(
      calendarGridContainer,
      targetAriaLabel,
      1000
    )
  }

  if (!targetDateBox) {
    throw new Error(
      `Could not find target date after ${maxNextMonthClicks} next-month attempts.`
    )
  }

  clickAtElementCenter(targetDateBox)
  await sleep(500)

  const timePill = await waitForElement("div.ti-radio-pill-time")
  await waitUntilVisible(timePill)

  const requestTicketsButton = await waitForElement("#request-tickets")
  clickAtElementCenter(requestTicketsButton)
  await sleep(500)
})()
