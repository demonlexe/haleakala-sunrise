export function waitForElement(
  selector: string,
  customDom?: Document
): Promise<HTMLElement> {
  const parseSelector = (fullSelector: string) => {
    const containsRegex = /:contains\(['"](.+?)['"]\)/
    const match = fullSelector.match(containsRegex)
    if (match) {
      const [fullMatch, textContent] = match
      const cleanSelector = fullSelector.replace(fullMatch, "").trim()
      return { cleanSelector, textContent }
    }
    return { cleanSelector: fullSelector, textContent: null }
  }

  const { cleanSelector, textContent } = parseSelector(selector)

  const findElement = (dom: Document | Element): HTMLElement | null => {
    const elements = dom.querySelectorAll(cleanSelector)
    if (!textContent) return elements[0] as HTMLElement
    return Array.from(elements).find((el) =>
      el.textContent?.includes(textContent)
    ) as HTMLElement | null
  }

  return new Promise((resolve) => {
    const dom = customDom || document
    const element = findElement(dom)
    if (element) {
      return resolve(element)
    }

    const observer = new MutationObserver(() => {
      const elem = findElement(dom)
      if (elem) {
        resolve(elem)
        observer.disconnect()
      }
    })

    observer.observe(dom.body, {
      childList: true,
      subtree: true
    })
  })
}
