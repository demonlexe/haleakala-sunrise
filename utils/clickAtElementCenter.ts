export const clickAtElementCenter = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  const clientX = rect.left + rect.width / 2
  const clientY = rect.top + rect.height / 2

  // Simulate a real user click sequence with overridden coordinates.
  for (const type of ["mousedown", "mouseup", "click"]) {
    const event = new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX,
      clientY,
      button: 0
    })
    element.dispatchEvent(event)
  }
}
