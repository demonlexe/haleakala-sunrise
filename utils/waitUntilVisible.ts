const isVisible = (element: HTMLElement) => {
  const style = window.getComputedStyle(element)
  const rect = element.getBoundingClientRect()
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0" &&
    rect.width > 0 &&
    rect.height > 0
  )
}

export const waitUntilVisible = async (element: HTMLElement) => {
  while (!isVisible(element)) {
    await new Promise((resolve) => window.setTimeout(resolve, 100))
  }
}
