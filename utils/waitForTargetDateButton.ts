const sleep = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms))

export const waitForTargetDateButton = async (
  calendarGridContainer: HTMLElement,
  targetAriaLabel: string,
  timeoutMs: number
) => {
  const selector = `div[aria-label*="${targetAriaLabel}"]`
  const pollIntervalMs = 200
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    const targetDateButton = calendarGridContainer.querySelector(selector)
    if (targetDateButton instanceof HTMLElement) {
      const isHidden =
        targetDateButton.hidden ||
        targetDateButton.getAttribute("hidden") !== null ||
        targetDateButton.getAttribute("aria-hidden") === "true"
      const isDisabled =
        targetDateButton.getAttribute("disabled") !== null ||
        targetDateButton.getAttribute("aria-disabled") === "true" ||
        targetDateButton.classList.contains("is-disabled")

      if (!isHidden && !isDisabled) {
        return targetDateButton
      }
    }

    await sleep(pollIntervalMs)
  }

  return null
}
