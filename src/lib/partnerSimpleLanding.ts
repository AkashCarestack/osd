/**
 * Default copy for simplified partner landings (Fortune, etc.).
 * Sanity `homeSettings.heroSection` still overrides any non-empty field.
 */

export const FORTUNE_HERO_DEFAULTS = {
  title: 'The Data Behind a High-Performing Practice.',
  titleHighlight: '',
  description:
    'Fortune Management helps practices reach their full potential. OS Dental gives them the data to get there. As a Fortune member, you get exclusive access to OS Dental\'s financial and clinical analytics platform - built specifically for the dental groups and practices that are serious about growth.',
  primaryButtonText: 'Get Started as a Fortune Member',
  primaryButtonLink: '#',
  secondaryButtonText: 'Watch platform demo',
  secondaryButtonLink: '',
  backgroundImage:
    'https://cdn.sanity.io/images/rcbknqsy/production/c57bdee986c4836572b6747a44da0a80dfb21674-3058x1020.png',
  videoLink:
    'https://share.vidyard.com/watch/NN3qsr8HsCqfMxCe2T9Qkr',
}

export const FORTUNE_PRODUCT_DEFAULTS = {
  eyebrow: 'EXCLUSIVELY FOR FORTUNE MANAGEMENT MEMBERS',
  headline: 'One platform. Financial clarity. Clinical insight.',
  features: [
    {
      title: 'Full financial visibility, finally',
      description:
        'See production, collections, AR aging, and overhead across every location in one dashboard. No more piecing together reports from your PMS. OS Dental consolidates your financial data so you always know where you stand.',
    },
    {
      title: 'See how clinical decisions drive your financials',
      description:
        'Connect provider activity to financial outcomes - track hygiene and doctor profitability by provider, monitor treatment acceptance rates against production goals, and identify exactly where revenue is being left on the table. Coach with data, not gut feel.',
    },
  ],
}

interface ProductFeature {
  title: string
  description: string
}

/**
 * Partner slugs that use the minimal Fortune hero + product layout
 * (no carousel, FAQs, etc.). Include CMS slug(s): e.g. `fortune-management`.
 */
export const SIMPLE_LANDING_PARTNER_SLUGS = [
  'fortune',
  'fortune-management',
] as const

export type SimpleLandingPartnerSlug =
  (typeof SIMPLE_LANDING_PARTNER_SLUGS)[number]

export function isSimpleLandingPartner(
  slug: string | undefined,
): slug is SimpleLandingPartnerSlug {
  if (!slug) return false
  return (SIMPLE_LANDING_PARTNER_SLUGS as readonly string[]).includes(slug)
}

/**
 * Overlay CMS hero fields onto defaults; only non-empty CMS values win.
 */
export function mergePartnerHeroDefaults(
  defaults: Record<string, string>,
  cms: Record<string, unknown> | null | undefined,
  lockedKeys: string[] = [],
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...defaults }
  if (!cms || typeof cms !== 'object') return out
  for (const key of Object.keys(defaults)) {
    if (lockedKeys.includes(key)) continue
    const v = cms[key as keyof typeof cms]
    if (v === undefined || v === null) continue
    if (typeof v === 'string' && v.trim() === '') continue
    out[key] = v
  }
  // Allow CMS-only fields (e.g. custom video thumbnail image object)
  for (const key of Object.keys(cms)) {
    if (!(key in defaults) && cms[key] != null && cms[key] !== '') {
      out[key] = cms[key as keyof typeof cms]
    }
  }
  return out
}

/**
 * Overlay CMS "whyPracticeLoveSection" data onto product section defaults.
 * Uses CMS title/features when present so partner editors can control copy.
 */
export function mergePartnerProductDefaults(
  defaults: {
    eyebrow: string
    headline: string
    features: ProductFeature[]
  },
  cms: Record<string, unknown> | null | undefined,
): {
  eyebrow: string
  headline: string
  features: ProductFeature[]
} {
  if (!cms || typeof cms !== 'object') return defaults

  const cmsHeadline =
    typeof cms.title === 'string' && cms.title.trim().length > 0
      ? cms.title.trim()
      : defaults.headline

  const rawFeatures = Array.isArray(cms.features) ? cms.features : []
  const cmsFeatures = rawFeatures
    .map((f) => {
      if (!f || typeof f !== 'object') return null
      const title =
        typeof (f as { title?: unknown }).title === 'string'
          ? (f as { title: string }).title.trim()
          : ''
      const description =
        typeof (f as { description?: unknown }).description === 'string'
          ? (f as { description: string }).description.trim()
          : ''
      if (!title || !description) return null
      return { title, description }
    })
    .filter(Boolean) as ProductFeature[]

  return {
    eyebrow: defaults.eyebrow,
    headline: cmsHeadline,
    features: cmsFeatures.length > 0 ? cmsFeatures : defaults.features,
  }
}
