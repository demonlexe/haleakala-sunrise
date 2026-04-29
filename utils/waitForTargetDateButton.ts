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
      return targetDateButton
    }

    await sleep(pollIntervalMs)
  }

  return null
}
