const reservationConfirmationPathPrefix = "/ticket/reservation/"
const refreshEverySecondsStorageKey = "refreshEverySeconds"
const defaultRefreshEverySeconds = 15

const getRefreshEverySeconds = () =>
  new Promise<number>((resolve) => {
    chrome.storage.local.get(refreshEverySecondsStorageKey, (result) => {
      const value = result[refreshEverySecondsStorageKey]
      if (typeof value === "number" && value > 0) {
        resolve(Math.floor(value))
        return
      }

      resolve(defaultRefreshEverySeconds)
    })
  })

export const setupAutoRefresh = async (log: (...args: unknown[]) => void) => {
  if (window.location.pathname.startsWith(reservationConfirmationPathPrefix)) {
    log("Auto-refresh disabled on reservation page.", {
      path: window.location.pathname
    })
    return
  }

  const refreshEverySeconds = await getRefreshEverySeconds()
  const everyMs = refreshEverySeconds * 1000

  log("Auto-refresh enabled.", {
    everyMs,
    refreshEverySeconds,
    path: window.location.pathname
  })

  window.setInterval(() => {
    window.location.reload()
  }, everyMs)
}
