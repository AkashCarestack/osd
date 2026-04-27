/** Class applied to required-field asterisks (styled in `heroHubspotFormEmbedCss.ts`). */
const HERO_STAR_CLASS = 'hero-hs-required-star'

function tagElementsThatAreOnlyAsterisk(label: HTMLLabelElement) {
  label.querySelectorAll('abbr, span, i, em, strong, b').forEach((el) => {
    if (el.classList.contains(HERO_STAR_CLASS)) return
    if ((el.textContent ?? '').replace(/\s/g, '') === '*') {
      el.classList.add(HERO_STAR_CLASS)
    }
  })
}

/** e.g. `<span>Last Name*</span>` — split trailing * into a styled span. */
function splitTrailingAsteriskInsideSpans(label: HTMLLabelElement) {
  const spans = Array.from(label.querySelectorAll('span'))
  for (const span of spans) {
    if (span.classList.contains(HERO_STAR_CLASS)) continue
    if (span.querySelector(`.${HERO_STAR_CLASS}`)) continue
    const raw = span.textContent ?? ''
    if ((raw.replace(/\s/g, '') === '*')) continue
    const trimmedEnd = raw.replace(/\s+$/, '')
    if (!/\*$/.test(trimmedEnd)) continue
    const m = trimmedEnd.match(/^(.*)(\*)$/)
    if (!m) continue
    const [, before] = m
    const trailingWs = raw.slice(trimmedEnd.length)
    span.textContent = before + trailingWs
    const star = document.createElement('span')
    star.className = HERO_STAR_CLASS
    star.textContent = '*'
    star.setAttribute('aria-hidden', 'true')
    span.appendChild(star)
  }
}

/** e.g. `<label>Last Name*</label>` — trailing * in a final text node. */
function splitTrailingAsteriskTextNode(label: HTMLLabelElement) {
  const last = label.lastChild
  if (!last || last.nodeType !== Node.TEXT_NODE) return
  const text = last.textContent ?? ''
  const trimmedEnd = text.replace(/\s+$/, '')
  const m = trimmedEnd.match(/^(.*)(\*)$/)
  if (!m) return
  const [, before] = m
  const trailingWs = text.slice(trimmedEnd.length)
  ;(last as Text).textContent = before + trailingWs
  const star = document.createElement('span')
  star.className = HERO_STAR_CLASS
  star.textContent = '*'
  star.setAttribute('aria-hidden', 'true')
  label.appendChild(star)
}

/**
 * HubSpot often prints required `*` as plain text on the label, so CSS cannot recolor it.
 * Run after the embed paints (e.g. `onFormReady` + one rAF / short timeout).
 */
export function applyHeroHubspotRequiredStarStyling(root: HTMLElement | null) {
  if (!root) return
  root.querySelectorAll<HTMLLabelElement>('.hs-form-field label').forEach((label) => {
    if (label.closest('.hs-error-msgs, .legal-consent-container')) return
    tagElementsThatAreOnlyAsterisk(label)
    splitTrailingAsteriskInsideSpans(label)
    splitTrailingAsteriskTextNode(label)
  })
}
