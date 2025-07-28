import Head from 'next/head'
import Script from 'next/script'

import { slugToCapitalized } from '~/utils/common'

interface SEOHeadProps {
  title: string
  description: string
  keywords: string
  robots: string
  canonical: string
  jsonLD: string
  contentType?: any
  ogImage?: any
  props?: {
    contentType: string
  }
}

export default function SEOHead({
  title,
  description,
  keywords,
  robots,
  canonical,
  jsonLD,
  props,
  ogImage,
}: SEOHeadProps) {
  return (
    <>
      <Head>
        <meta name="description" content={description} key="description" />
        <meta name="keywords" content={keywords} key="keywords" />
        <meta name="robots" content={robots} key="robots" />
        <link rel="canonical" href={canonical} key="canonical" />
        {jsonLD && (
          <script
            type="application/ld+json"
            id={`${props?.contentType ? props.contentType : 'blog'}-jsonLd`}
            dangerouslySetInnerHTML={{ __html: jsonLD }}
          />
        )}
        {/* {ogImage && (
          <meta
            id="ogImage"
            property="og:image"
            content={ogImage}
            key="ogImage"
          />
        )} */}
      </Head>
    </>
  )
}
