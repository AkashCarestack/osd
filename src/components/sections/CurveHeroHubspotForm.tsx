import React, { useLayoutEffect, useRef, useState } from 'react'

import { heroHubspotFormEmbedGlobalCss } from '~/components/sections/heroHubspotFormEmbedCss'
import { applyHeroHubspotRequiredStarStyling } from '~/components/sections/heroHubspotFormRequiredStars'

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

const HERO_FORM_SHELL_CLASS =
  'hero-hubspot-form-shell relative w-full min-w-0 scroll-m-14 scroll-mt-28 md:sticky md:top-20 max-w-[470px] rounded-[12px] bg-white p-4 shadow-sm sm:p-6 md:p-8 md:rounded-[12px]'

interface CurveHeroHubspotFormProps {
  /** Which hero embed: separate mount node + optional form ID from env. */
  partner: PartnerHeroHubspotKey
  /** When set (Sanity `heroSection.hubspotFormId`), overrides env-based form ID. */
  cmsFormId?: string
  /** Sanity `heroSection.hubspotFormHeading` or default demo title. */
  heading?: string
}

const DEFAULT_HEADING = 'Schedule a Demo'

/**
 * Inline HubSpot form for partner split heroes (Curve / Fortune).
 * Env: `NEXT_PUBLIC_HUBSPOT_CURVE_HERO_FORM_ID`,
 * `NEXT_PUBLIC_HUBSPOT_FORTUNE_HERO_FORM_ID`, `NEXT_PUBLIC_HUBSPOT_PORTAL_ID`.
 */
const CurveHeroHubspotForm: React.FC<CurveHeroHubspotFormProps> = ({
  partner,
  cmsFormId,
  heading,
}) => {
  const mountId = MOUNT_IDS[partner]
  const resolvedFormId =
    cmsFormId && cmsFormId.trim().length > 0
      ? cmsFormId.trim()
      : resolveFormId(partner)
  const createdRef = useRef(false)
  const [loading, setLoading] = useState(true)
  const title =
    typeof heading === 'string' && heading.trim().length > 0
      ? heading.trim()
      : DEFAULT_HEADING

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    createdRef.current = false
    const clearMount = document.getElementById(mountId)
    if (clearMount) clearMount.innerHTML = ''

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
          const shell = targetEl.closest('.hero-hubspot-form-shell')
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
        formId: resolvedFormId,
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
      const el = document.createElement('script')
      el.src = HS_SCRIPT_SRC
      el.async = true
      el.onload = () => mountForm()
      el.onerror = () => setLoading(false)
      document.body.appendChild(el)
    }

    ensureScript()
    const failSafe = window.setTimeout(() => setLoading(false), 12000)
    return () => {
      window.clearTimeout(failSafe)
      const el = document.getElementById(mountId)
      if (el) el.innerHTML = ''
      createdRef.current = false
    }
  }, [mountId, resolvedFormId])

  return (
    <div className={HERO_FORM_SHELL_CLASS}>
      <h3 className="mb-5 font-inter text-xl font-semibold text-[#030712] sm:text-2xl md:mb-8 md:text-3xl">
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
        <div id={mountId} className="w-full min-w-0 bg-white text-left" />
      </div>
      <style jsx global>{heroHubspotFormEmbedGlobalCss}</style>
    </div>
  )
}

export default CurveHeroHubspotForm
