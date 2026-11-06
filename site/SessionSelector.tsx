// @ts-ignore
import script from "./scripts/sessionSelector.inline"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const SessionSelector: QuartzComponent = () => {
  const sessions = JSON.parse(process.env.WIKI_SESSIONS ?? "[]") as string[]
  const current = process.env.WIKI_SESSION ?? ""

  return (
    <div class="session-selector" data-current={current}>
      <label for="session-select">Wiki version</label>
      <select id="session-select" aria-describedby="session-select-message">
        <option value="" selected={current === ""}>
          Current
        </option>
        {sessions.map((session) => (
          <option value={session} selected={current === session}>
            {session.replace("-", " ")}
          </option>
        ))}
      </select>
      <span id="session-select-message" role="status" aria-live="polite"></span>
    </div>
  )
}

SessionSelector.afterDOMLoaded = script
SessionSelector.css = `
.session-selector { display: flex; flex-direction: column; gap: 0.3rem; }
.session-selector label { font-weight: 600; }
.session-selector select {
  width: 100%; padding: 0.4rem; border: 1px solid var(--lightgray);
  border-radius: 4px; background: var(--light); color: var(--dark);
  font: inherit;
}
.session-selector span { font-size: 0.85rem; }
`

export default (() => SessionSelector) satisfies QuartzComponentConstructor
