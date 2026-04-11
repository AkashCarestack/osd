/**
 * Default copy for simplified partner landings (Fortune, Curve, etc.).
 * Sanity `homeSettings.heroSection` / `whyPracticeLoveSection` override any non-empty field.
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

export const CURVE_HERO_DEFAULTS = {
  eyebrow: 'OS DENTAL FOR CURVE',
  title: 'Stop Flying Blind on Practice Performance.',
  titleHighlight: '',
  description:
    'OS Dental connects directly to Curve to surface the financial and operational data your team already collects - but has never been able to act on. Unified dashboards give dental groups and DSOs a real-time view of production, collections, scheduling efficiency, and more, without manual exports or spreadsheet gymnastics.',
  primaryButtonText: 'Schedule a Demo',
  primaryButtonLink: '#',
  secondaryButtonText: 'Clinical Dashboards Overview',
  secondaryButtonLink: '',
  backgroundImage:
    'https://cdn.sanity.io/images/rcbknqsy/production/c57bdee986c4836572b6747a44da0a80dfb21674-3058x1020.png',
  videoThumbnail:
    'https://cdn.sanity.io/images/rcbknqsy/production/3e10a80054ff751b2c3ad43b7e2f53b276ca5887-990x800.png',
  videoLink: '',
}

export const CURVE_PRODUCT_DEFAULTS = {
  eyebrow: 'OS DENTAL FOR CURVE USERS',
  headline: 'Smarter decisions start with cleaner and centralized data.',
  features: [
    {
      title: 'Your Curve data, fully unlocked',
      description:
        'OS Dental pulls directly from Curve - no manual exports, no data lag. See production, collections, AR, and many other metrics in one place.',
    },
    {
      title: 'Built for groups and DSOs',
      description:
        "Whether you're running 2 locations or 20, OS Dental normalizes data across your entire portfolio so you can compare performance, spot outliers, and hold locations and providers accountable - all from a single dashboard.",
    },
    {
      title: 'See how clinical decisions drive your financials',
      description:
        'OS Dental connects provider activity to financial outcomes - so you can see hygiene and doctor profitability by provider, track treatment acceptance rates against production goals, and understand exactly where revenue is being left on the table. When you know which providers and which locations are performing, you can coach with data instead of gut feel.',
    },
  ],
}

interface ProductFeature {
  title: string
  description: string
}

export interface SimpleLandingDefaults {
  hero: Record<string, string>
  product: {
    eyebrow: string
    headline: string
    features: ProductFeature[]
  }
}

const FORTUNE_PAIR: SimpleLandingDefaults = {
  hero: FORTUNE_HERO_DEFAULTS,
  product: FORTUNE_PRODUCT_DEFAULTS,
}

const DEFAULTS_BY_SLUG: Record<string, SimpleLandingDefaults> = {
  fortune: FORTUNE_PAIR,
  'fortune-management': FORTUNE_PAIR,
  curve: {
    hero: CURVE_HERO_DEFAULTS,
    product: CURVE_PRODUCT_DEFAULTS,
  },
}

export const SIMPLE_LANDING_PARTNER_SLUGS = [
  'fortune',
  'fortune-management',
  'curve',
] as const

export type SimpleLandingPartnerSlug =
  (typeof SIMPLE_LANDING_PARTNER_SLUGS)[number]

export function isSimpleLandingPartner(
  slug: string | undefined,
): slug is SimpleLandingPartnerSlug {
  if (!slug) return false
  return (SIMPLE_LANDING_PARTNER_SLUGS as readonly string[]).includes(slug)
}

export function getSimpleLandingDefaults(
  slug: string | undefined,
): SimpleLandingDefaults | null {
  if (!slug) return null
  return DEFAULTS_BY_SLUG[slug] ?? null
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
  for (const key of Object.keys(cms)) {
    if (!(key in defaults) && cms[key] != null && cms[key] !== '') {
      out[key] = cms[key as keyof typeof cms]
    }
  }
  return out
}

/**
 * Overlay CMS "whyPracticeLoveSection" data onto product section defaults.
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

  const cmsEyebrow =
    typeof cms.eyebrow === 'string' && cms.eyebrow.trim().length > 0
      ? cms.eyebrow.trim()
      : defaults.eyebrow

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
    eyebrow: cmsEyebrow,
    headline: cmsHeadline,
    features: cmsFeatures.length > 0 ? cmsFeatures : defaults.features,
  }
}
