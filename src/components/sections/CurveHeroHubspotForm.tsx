import React, { useEffect, useRef, useState } from 'react'

const HS_SCRIPT_SRC = 'https://js.hsforms.net/forms/v2.js'

const DEFAULT_FORM_ID = '6b2d6906-028e-4d65-9cd1-34d528e0d5c0'

const portalId =
  process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID?.trim() || '4832409'

export type PartnerHeroHubspotKey = 'curve' | 'fortune'

const MOUNT_IDS: Record<PartnerHeroHubspotKey, string> = {
  curve: 'curve-hero-hubspot-form',
  fortune: 'fortune-hero-hubspot-form',
}

function resolveFormId(partner: PartnerHeroHubspotKey): string {
  if (partner === 'curve') {
    return (
      process.env.NEXT_PUBLIC_HUBSPOT_CURVE_HERO_FORM_ID?.trim() ||
      DEFAULT_FORM_ID
    )
  }
  return (
    process.env.NEXT_PUBLIC_HUBSPOT_FORTUNE_HERO_FORM_ID?.trim() ||
    DEFAULT_FORM_ID
  )
}

function scriptAlreadyPresent(): boolean {
  return Array.from(document.scripts).some((s) =>
    s.src.includes('js.hsforms.net/forms/v2.js'),
  )
}

interface CurveHeroHubspotFormProps {
  /** Which hero embed: separate mount node + optional form ID from env. */
  partner: PartnerHeroHubspotKey
}

/**
 * Inline HubSpot form for partner split heroes (Curve / Fortune).
 * Env: `NEXT_PUBLIC_HUBSPOT_CURVE_HERO_FORM_ID`,
 * `NEXT_PUBLIC_HUBSPOT_FORTUNE_HERO_FORM_ID`, `NEXT_PUBLIC_HUBSPOT_PORTAL_ID`.
 */
const CurveHeroHubspotForm: React.FC<CurveHeroHubspotFormProps> = ({
  partner,
}) => {
  const mountId = MOUNT_IDS[partner]
  const formId = resolveFormId(partner)
  const createdRef = useRef(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mountForm = () => {
      const hbspt = (
        window as unknown as {
          hbspt?: { forms?: { create: (o: Record<string, unknown>) => void } }
        }
      ).hbspt
      if (!hbspt?.forms?.create || createdRef.current) return
      const targetEl = document.getElementById(mountId)
      if (!targetEl || targetEl.querySelector('form')) {
        if (targetEl?.querySelector('form')) {
          createdRef.current = true
          setLoading(false)
        }
        return
      }
      createdRef.current = true
      hbspt.forms.create({
        region: 'na1',
        portalId,
        formId,
        target: `#${mountId}`,
        onFormReady: () => setLoading(false),
      })
    }

    const ensureScript = () => {
      if (scriptAlreadyPresent()) {
        const w = window as unknown as { hbspt?: unknown }
        if (w.hbspt) mountForm()
        else {
          const t = window.setInterval(() => {
            if ((window as unknown as { hbspt?: unknown }).hbspt) {
              window.clearInterval(t)
              mountForm()
            }
          }, 50)
          window.setTimeout(() => {
            window.clearInterval(t)
            setLoading(false)
          }, 8000)
        }
        return
      }
      const el = document.createElement('script')
      el.src = HS_SCRIPT_SRC
      el.async = true
      el.onload = () => mountForm()
      el.onerror = () => setLoading(false)
      document.body.appendChild(el)
    }

    ensureScript()
    const failSafe = window.setTimeout(() => setLoading(false), 12000)
    return () => window.clearTimeout(failSafe)
  }, [mountId, formId])

  return (
    <div className="partner-hubspot-embed-root relative w-full min-w-0 rounded-xl border border-zinc-200/90 bg-white px-5 py-6 shadow-md md:px-6 md:py-7">
      {loading ? (
        <div className="pointer-events-none absolute left-1/2 top-4 z-[1] flex -translate-x-1/2 items-center gap-2 rounded-full border border-zinc-200 bg-white/95 px-3 py-1.5 text-xs text-zinc-600 shadow-sm">
          <span
            className="inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700"
            aria-hidden
          />
          Loading…
        </div>
      ) : null}
      <div id={mountId} className="w-full min-w-0 bg-white text-left" />
      <style jsx global>{`
        .partner-hubspot-embed-root .hs-form fieldset {
          max-width: 100% !important;
          background: #ffffff !important;
        }
        .partner-hubspot-embed-root .hs-form-field {
          margin-bottom: 0.75rem;
        }
        .partner-hubspot-embed-root .hs-form-field label {
          color: #3f3f46 !important;
          font-size: 0.8125rem;
          font-weight: 500;
        }
        .partner-hubspot-embed-root .hs-form-required label::after {
          color: #dc2626;
        }
        .partner-hubspot-embed-root input.hs-input,
        .partner-hubspot-embed-root textarea.hs-input,
        .partner-hubspot-embed-root select.hs-input {
          width: 100% !important;
          border-radius: 6px;
          border: 1px solid #d4d4d8 !important;
          padding: 0.5rem 0.65rem;
          font-size: 0.9375rem;
          background: #ffffff !important;
          color: #18181b !important;
        }
        .partner-hubspot-embed-root .hs-button.primary,
        .partner-hubspot-embed-root input[type='submit'].hs-button {
          width: 100%;
          margin-top: 0.25rem;
          background: #18181b !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 6px !important;
          padding: 0.65rem 1rem !important;
          font-weight: 600 !important;
        }
        .partner-hubspot-embed-root .hs-button.primary:hover {
          background: #27272a !important;
        }
        .partner-hubspot-embed-root .legal-consent-container,
        .partner-hubspot-embed-root .hs-richtext,
        .partner-hubspot-embed-root .hs-richtext p {
          color: #52525b !important;
          font-size: 0.75rem;
        }
        .partner-hubspot-embed-root .hs-error-msgs label,
        .partner-hubspot-embed-root .hs-error-msg {
          color: #dc2626 !important;
        }
        .partner-hubspot-embed-root .hbspt-form,
        .partner-hubspot-embed-root .hs-form,
        .partner-hubspot-embed-root form {
          min-height: 0 !important;
        }
        .partner-hubspot-embed-root fieldset.form-columns-2 {
          padding-bottom: 0 !important;
        }
      `}</style>
    </div>
  )
}

export default CurveHeroHubspotForm
