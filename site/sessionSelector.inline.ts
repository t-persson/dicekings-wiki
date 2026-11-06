document.addEventListener("nav", () => {
  const selector = document.querySelector<HTMLElement>(".session-selector")
  const select = selector?.querySelector<HTMLSelectElement>("select")
  const message = selector?.querySelector<HTMLElement>('[role="status"]')
  if (!selector || !select || !message) return

  const onChange = async () => {
    const root = "/dicekings-wiki/"
    const current = selector.dataset.current
    const currentRoot = current ? `${root}sessions/${current}/` : root
    if (!location.pathname.startsWith(currentRoot)) {
      message.textContent = "Could not determine the current wiki page."
      return
    }

    const page = location.pathname.slice(currentRoot.length)
    const targetRoot = select.value ? `${root}sessions/${select.value}/` : root
    const target = `${targetRoot}${page}`
    select.disabled = true
    message.textContent = "Opening wiki version..."
    try {
      const response = await fetch(target, { method: "HEAD" })
      if (response.status === 404) {
        location.assign(targetRoot)
      } else if (response.ok) {
        location.assign(target + location.hash)
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      message.textContent = `Could not open that version: ${error instanceof Error ? error.message : String(error)}`
      select.value = current ?? ""
      select.disabled = false
    }
  }

  select.addEventListener("change", onChange)
  window.addCleanup(() => select.removeEventListener("change", onChange))
})
