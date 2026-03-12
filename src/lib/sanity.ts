import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2022-11-28', // use a specific date or `v1`
  useCdn: true, // `false` if you want to ensure fresh data
})

export async function isUniqueAcrossAllDocuments(slug, context) {
  const { document, getClient } = context
  const client = getClient({ apiVersion: '2022-11-28' })
  const id = document._id.replace(/^drafts\./, '')
  const region = document.language
  const conType = document.contentType
    ? document.contentType
    : document._type || 'article'
  const docType = document._type || 'post'
  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug: slug?.current || slug,
    type: docType,
    contentType: conType,
    language: region,
  }

  const query = `!defined(*[
    !(_id in [$draft, $published]) && 
    _type == $type && 
    contentType == $contentType &&  language == $language &&
    slug.current == $slug
  ][0]._id)`

  try {
    const result = await client.fetch(query, params)
    return result
  } catch (error) {
    console.error('Slug check error:', error)
    return false
  }
}

/**
 * Category slug must be unique per partner (or per "no partner").
 * Allows the same page path (e.g. "deo-operations") for different partners.
 */
export async function isUniqueCategorySlugPerPartner(slug: { current?: string } | string, context: { document?: { _id?: string; partner?: { _ref?: string } }; getClient: (opts?: { apiVersion: string }) => any }) {
  const slugValue = typeof slug === 'string' ? slug : slug?.current
  if (!slugValue) return true
  const { document, getClient } = context
  const client = getClient({ apiVersion: '2022-11-28' })
  const id = document?._id?.replace(/^drafts\./, '') ?? ''
  const draft = id ? `drafts.${id}` : ''
  const published = id || ''
  const partnerRef = (document?.partner as { _ref?: string })?._ref ?? null

  const params: Record<string, string | null> = {
    draft,
    published,
    slug: slugValue,
  }

  // Other category with same slug in same "scope": both no partner, or same partner ref
  const partnerCondition = partnerRef
    ? 'defined(partner) && partner._ref == $partnerRef'
    : '!defined(partner)'
  const query = `!defined(*[
    _type == "category" &&
    slug.current == $slug &&
    !(_id in [$draft, $published]) &&
    (${partnerCondition})
  ][0]._id)`

  if (partnerRef) params.partnerRef = partnerRef

  try {
    const result = await client.fetch(query, params)
    return result
  } catch (error) {
    console.error('Category slug check error:', error)
    return false
  }
}
