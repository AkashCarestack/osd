import type { SanityClient } from 'next-sanity'

import siteConfig from 'config/siteConfig'
import { getPartnersSlugs } from '~/lib/sanity.queries'

const DEFAULT_LOCALE = 'en'

/** Default locale for partner routes (no locale in URL). */
export function getDefaultLocale(): string {
  return DEFAULT_LOCALE
}

/**
 * Returns static path params for [partner] routes (no locale in URL).
 * One path per partner, e.g. /fortune, /deo.
 */
export async function getPartnerPaths(
  client: SanityClient,
): Promise<{ params: { partner: string } }[]> {
  const partners = await getPartnersSlugs(client)
  if (!partners?.length) return []
  return partners.map((p) => ({ params: { partner: p.slug } }))
}

/**
 * @deprecated Use getPartnerPaths for [partner]-only routes. Kept for reference.
 * Returns static path params for [partner]/[locale] routes.
 */
export async function getPartnerLocalePaths(
  client: SanityClient,
): Promise<{ params: { partner: string; locale: string } }[]> {
  const partners = await getPartnersSlugs(client)
  if (!partners?.length) return []
  return partners.flatMap((p) =>
    siteConfig.locales.map((locale) => ({
      params: { partner: p.slug, locale },
    })),
  )
}
