import React, { useLayoutEffect, useRef, useState } from 'react'

import { heroHubspotFormEmbedGlobalCss } from '~/components/sections/heroHubspotFormEmbedCss'
import { applyHeroHubspotRequiredStarStyling } from '~/components/sections/heroHubspotFormRequiredStars'

const HS_SCRIPT_SRC = 'https://js.hsforms.net/forms/v2.js'

const MOUNT_ID = 'hero-cms-hubspot-form'

const portalId =
  process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID?.trim() || '4832409'

function scriptAlreadyPresent(): boolean {
  return Array.from(document.scripts).some((s) =>
    s.src.includes('js.hsforms.net/forms/v2.js'),
  )
}

const HERO_FORM_SHELL_CLASS =
  'hero-hubspot-form-shell relative w-full min-w-0 scroll-m-14 scroll-mt-28 sticky top-20 max-w-[537px] rounded-[12px] bg-white p-8 shadow-sm md:rounded-[24px]'

const DEFAULT_HEADING = 'Schedule a Demo'

export interface CmsHeroHubspotFormProps {
  /** HubSpot form GUID from Sanity `heroSection.hubspotFormId`. */
  formId: string
  /** Sanity `heroSection.hubspotFormHeading` or default. */
  heading?: string
}

/**
 * HubSpot embed for default hero when CMS provides a form ID.
 * Loads `forms/v2.js` once (shared with other HubSpot embeds on the page).
 */
const CmsHeroHubspotForm: React.FC<CmsHeroHubspotFormProps> = ({
  formId,
  heading,
}) => {
  const createdRef = useRef(false)
  const [loading, setLoading] = useState(true)
  const formIdTrim = formId.trim()
  const title =
    typeof heading === 'string' && heading.trim().length > 0
      ? heading.trim()
      : DEFAULT_HEADING

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !formIdTrim) return

    const mountId = MOUNT_ID
    createdRef.current = false
    const targetEl = document.getElementById(mountId)
    if (targetEl) targetEl.innerHTML = ''

    const mountForm = () => {
      const hbspt = (
        window as unknown as {
          hbspt?: { forms?: { create: (o: Record<string, unknown>) => void } }
        }
      ).hbspt
      if (!hbspt?.forms?.create || createdRef.current) return
      const el = document.getElementById(mountId)
      if (!el || el.querySelector('form')) {
        if (el?.querySelector('form')) {
          createdRef.current = true
          const shell = el.closest('.hero-hubspot-form-shell')
          applyHeroHubspotRequiredStarStyling(
            shell instanceof HTMLElement ? shell : null,
          )
          setLoading(false)
        }
        return
      }
      createdRef.current = true
      hbspt.forms.create({
        region: 'na1',
        portalId,
        formId: formIdTrim,
        target: `#${mountId}`,
        onFormReady: () => {
          const mount = document.getElementById(mountId)
          const shell = mount?.closest('.hero-hubspot-form-shell')
          const root =
            shell instanceof HTMLElement ? shell : null
          const paint = () => applyHeroHubspotRequiredStarStyling(root)
          paint()
          requestAnimationFrame(paint)
          window.setTimeout(paint, 50)
          window.setTimeout(paint, 250)
          setLoading(false)
        },
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
      const scriptEl = document.createElement('script')
      scriptEl.src = HS_SCRIPT_SRC
      scriptEl.async = true
      scriptEl.onload = () => mountForm()
      scriptEl.onerror = () => setLoading(false)
      document.body.appendChild(scriptEl)
    }

    ensureScript()
    const failSafe = window.setTimeout(() => setLoading(false), 12000)
    return () => {
      window.clearTimeout(failSafe)
      const el = document.getElementById(mountId)
      if (el) el.innerHTML = ''
      createdRef.current = false
    }
  }, [formIdTrim])

  if (!formIdTrim) return null

  return (
    <div className={HERO_FORM_SHELL_CLASS}>
      <h3 className="mb-8 font-inter text-2xl font-semibold text-[#030712] md:text-3xl">
        {title}
      </h3>
      {loading ? (
        <div className="pointer-events-none absolute left-1/2 top-24 z-[1] flex -translate-x-1/2 items-center gap-2 rounded-full border border-zinc-200 bg-white/95 px-3 py-1.5 text-xs text-zinc-600 shadow-sm">
          <span
            className="inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700"
            aria-hidden
          />
          Loading…
        </div>
      ) : null}
      <div className="vs-button mt-4 w-full">
        <div id={MOUNT_ID} className="w-full min-w-0 bg-white text-left" />
      </div>
      <style jsx global>{heroHubspotFormEmbedGlobalCss}</style>
    </div>
  )
}

export default CmsHeroHubspotForm
