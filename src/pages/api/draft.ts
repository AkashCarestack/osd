import siteConfig from 'config/siteConfig'
import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidSecret } from 'sanity-plugin-iframe-pane/is-valid-secret'

import { previewSecretId, readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { generateHref } from '~/utils/common'

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse<string | void>,
) {
  if (!readToken) {
    res.status(500).send('Misconfigured server')
    return
  }

  const { query } = req

  const secret = typeof query.secret === 'string' ? query.secret : undefined
  const slug = typeof query.slug === 'string' ? query.slug : undefined
  const id = typeof query.id === 'string' ? query.id : undefined

  if (!secret || !slug) {
    res.status(401)
    res.send('Invalid secret or missing slug')
    return
  }

  const authClient = getClient({ token: readToken }).withConfig({
    useCdn: false,
    token: readToken,
  })

  const validSecret = await isValidSecret(authClient, previewSecretId, secret)
  if (!validSecret) {
    return res.status(401).send('Invalid secret')
  }

  try {
    // Use document ID if provided (more accurate for translations), otherwise fall back to slug
    let document
    if (id) {
      // Try both draft and published versions
      document = await authClient.fetch(
        `*[_id == $id || _id == $draftId][0]{ _type, contentType, slug, language }`,
        { id, draftId: `drafts.${id}` },
      )
    }
    
    // Fall back to slug if id didn't work or wasn't provided
    if (!document) {
      document = await authClient.fetch(
        `*[slug.current == $slug][0]{ _type, contentType, slug, language }`,
        { slug },
      )
    }

    if (document) {
      const actualContentType = document.contentType || document._type
      const locale = document.language || 'en'
      
      // Build the preview path with locale
      const previewPath = `${actualContentType}/${slug}`
      const previewUrl = generateHref(locale, previewPath)
      
      if (Object.values(siteConfig.pageURLs).includes(actualContentType)) {
        res.setDraftMode({ enable: true })
        res.writeHead(307, { Location: previewUrl })
        res.end()
        return
      } else if (actualContentType === 'post') {
        res.setDraftMode({ enable: true })
        const postPreviewUrl = generateHref(locale, `post/${slug}`)
        res.writeHead(307, { Location: postPreviewUrl })
        res.end()
        return
      }
    }

    res
      .status(404)
      .send('Requested slug not found please check with siteconfig urls')
  } catch (error) {
    console.error('Error in preview function:', error)
    res.status(500).send('Internal Server Error')
  }
}
