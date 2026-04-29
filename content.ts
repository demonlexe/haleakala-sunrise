import type { PlasmoCSConfig } from "plasmo"

import { setupAutoRefresh } from "~utils/autoRefresh"
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

const logPrefix = "[haleakala-sunrise]"
const log = (...args: unknown[]) => console.log(logPrefix, ...args)
const logError = (...args: unknown[]) => console.error(logPrefix, ...args)

const parseMonthYearFromHeader = (headerText: string) => {
  const monthYearMatch = headerText.match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/
  )

  if (!monthYearMatch) {
    return null
  }

  const [, monthName, yearText] = monthYearMatch
  const parsedDate = new Date(`${monthName} 1, ${yearText}`)

  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return {
    month: parsedDate.getMonth(),
    year: parsedDate.getFullYear(),
    label: `${monthName} ${yearText}`
  }
}

void setupAutoRefresh(log)

void (async () => {
  try {
    const targetDate = await getTargetDate()
    const targetAriaLabel = formatAriaLabel(targetDate)
    log("Looking for target date.", { targetDate, targetAriaLabel })

    const toggleCalendarButton = await waitForElement(
      "button.toggle-calendar-button"
    )
    clickAtElementCenter(toggleCalendarButton)
    await sleep(200)

    const calendarGridContainer = await waitForElement(
      "div.calendar-grids-container"
    )
    const calendarHeaderGroup = await waitForElement(
      "div.calendar-header-group"
    )

    const targetDateObject = new Date(`${targetDate}T00:00:00`)
    if (Number.isNaN(targetDateObject.getTime())) {
      throw new Error(`Invalid target date: ${targetDate}`)
    }

    const targetMonth = targetDateObject.getMonth()
    const targetYear = targetDateObject.getFullYear()
    const maxNavigationClicks = 24
    let navigationClicks = 0

    while (navigationClicks < maxNavigationClicks) {
      const currentHeader = parseMonthYearFromHeader(
        calendarHeaderGroup.textContent?.trim() ?? ""
      )

      if (!currentHeader) {
        throw new Error(
          `Could not parse month/year from calendar header: "${calendarHeaderGroup.textContent?.trim() ?? ""}"`
        )
      }

      const monthDelta =
        (targetYear - currentHeader.year) * 12 +
        (targetMonth - currentHeader.month)

      if (monthDelta === 0) {
        break
      }

      const goNext = monthDelta > 0
      const buttonSelector = goNext
        ? 'button.next-prev-button[aria-label="Next"]'
        : 'button.next-prev-button[aria-label="Previous"]'
      const navButton = await waitForElement(
        buttonSelector,
        calendarHeaderGroup
      )

      const isNavDisabled =
        navButton.getAttribute("disabled") !== null ||
        navButton.getAttribute("aria-disabled") === "true"

      if (isNavDisabled) {
        throw new Error(
          `${goNext ? "Next" : "Previous"} month button is disabled; cannot continue calendar navigation.`
        )
      }

      log(`Navigating calendar ${goNext ? "forward" : "backward"}.`, {
        currentMonth: currentHeader.label,
        targetMonth: new Intl.DateTimeFormat("en-US", {
          month: "long",
          year: "numeric"
        }).format(targetDateObject),
        attempt: navigationClicks + 1,
        maxNavigationClicks
      })

      clickAtElementCenter(navButton)
      navigationClicks += 1
      await sleep(100)
    }

    const finalHeader = parseMonthYearFromHeader(
      calendarHeaderGroup.textContent?.trim() ?? ""
    )
    const isOnTargetMonth =
      finalHeader &&
      finalHeader.month === targetMonth &&
      finalHeader.year === targetYear

    if (!isOnTargetMonth) {
      throw new Error(
        `Could not navigate calendar to target month after ${navigationClicks} attempts.`
      )
    }

    const targetDateBox = await waitForTargetDateButton(
      calendarGridContainer,
      targetAriaLabel
    )
    clickAtElementCenter(targetDateBox)
    await sleep(200)

    const timePill = await waitForElement("div.ti-radio-pill-time")
    await waitUntilVisible(timePill)

    const requestTicketsButton = await waitForElement("#request-tickets")
    clickAtElementCenter(requestTicketsButton)
    await sleep(200)
    log("Request submitted.")
  } catch (error) {
    logError("Script failed.", error)
  }
})()
