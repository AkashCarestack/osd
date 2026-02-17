import { Post } from '~/interfaces/post'
import { urlForImage } from '~/lib/sanity.image'

import { fetchAuthor, sanitizeUrl } from './common'

export function generateJSONLD(post: any) {
  const {
    author = null,
    estimatedReadingTime = null,
    estimatedWordCount = null,
    excerpt = null,
    numberOfCharacters = null,
  } = post || {}

  const contentType = post?.contentType

  if (contentType) {
    switch (contentType) {
      case 'blog':
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://osdental.io${post.slug}`,
            isPartOf: {
              '@id': 'https://osdental.io/#website',
            },
          },
          headline: post.title,
          description: excerpt,
          image:
            'https://cdn.sanity.io/images/bbmnn1wc/production/5cc4351771b60f336498e1ba2642f572ab3c8364-1201x1201.png',
          author: {
            '@type': 'Person',
            name: (author && author[0]?.name) || 'Unknown Author',
            url: 'https://osdental.io/company/leadership-team',
          },
          wordCount: estimatedWordCount ?? 0,
          dateCreated: post._createdAt,
          inLanguage: 'en-US',
          copyrightYear: post._createdAt.split(' ')[2],
          copyrightHolder: {
            '@id': 'https://osdental.io/#organization',
          },
          publisher: {
            '@type': 'Organization',
            name: 'OS Dental',
            url: 'https://osdental.io',
            logo: {
              '@type': 'ImageObject',
              inLanguage: 'en-US',
              url: 'https://cdn.sanity.io/images/bbmnn1wc/production/5cc4351771b60f336498e1ba2642f572ab3c8364-1201x1201.png',
              width: 1200,
              height: 1200,
            },
          },
        })
      case 'ebook':
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Book',
          name: post.title,
          author: {
            '@type': 'Person',
            name: (author && author[0]?.name) || 'Unknown Author',
          },
          datePublished: post._createdAt,
          numberOfPages: post.ebookFields?.ebookPages || 0,
          description: post.excerpt,
        })
      case 'article':
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          image: post.articleImage ? urlForImage(post.articleImage._id) : (post.mainImage ? urlForImage(post.mainImage._id) : ''),
          url: sanitizeUrl(post.articleUrl || `https://osdental.io/article/${post.slug?.current || ''}`),
          author: {
            '@type': 'Person',
            name: (author && author[0]?.name) || 'Unknown Author',
          },
          datePublished: post._createdAt,
          description: post.excerpt,
        })
      case 'webinar':
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: post.title,
          startDate: post._createdAt,
          description: post.excerpt,
          eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
          eventStatus: 'https://schema.org/EventScheduled',
        })
      // case 'case-study':
      //   return JSON.stringify({
      //     '@type': 'NewsArticle',
      //     '@context': 'https://schema.org',
      //     headline: post.excerpt || '',
      //     image: urlForImage(post?.mainImage),
      //     author: [
      //       {
      //         '@type': 'Person',
      //         // name: 'Patrick Coombe',
      //       },
      //     ],
      //     startDate: new Date(),
      //     description:
      //       post.author ??
      //       post?.author?.map((e) => {
      //         return e.bio
      //       }),
      //     creator: 'CareStack',
      //     inLanguage: ['en_us', 'en-GB'],
      //     sameAs: 'https://carestack.com/',
      //   })
      case 'podcast':
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'PodcastEpisode',
          name: post.title,
          description: post.excerpt,
          datePublished: post._createdAt,
          author: {
            '@type': 'Person',
            name: (author && author[0]?.name) || 'Unknown Author',
          },
        })
      default:
        return '{}'
    }
  }

  // Default BlogPosting schema
  const defaultJSONLD = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://osdental.io${post.slug}`,
      isPartOf: {
        '@id': 'https://osdental.io/#website',
      },
    },
    headline: post.title,
    description: excerpt,
    image:
      'https://cdn.sanity.io/images/bbmnn1wc/production/5cc4351771b60f336498e1ba2642f572ab3c8364-1201x1201.png',
    author: {
      '@type': 'Person',
      name: (author && author[0]?.name) || 'Unknown Author',
      url: 'https://osdental.io/company/leadership-team',
    },
    wordCount: estimatedWordCount ?? 0,
    dateCreated: post._createdAt,
    inLanguage: 'en-US',
    copyrightYear: post._createdAt?.split(' ')[2],
    copyrightHolder: {
      '@id': 'https://osdental.io/#organization',
    },
    publisher: {
      '@type': 'Organization',
      name: 'OS Dental',
      url: 'https://osdental.io',
      logo: {
        '@type': 'ImageObject',
        inLanguage: 'en-US',
        url: 'https://cdn.sanity.io/images/bbmnn1wc/production/5cc4351771b60f336498e1ba2642f572ab3c8364-1201x1201.png',
        width: 1200,
        height: 1200,
      },
    },
  }

  return JSON.stringify(defaultJSONLD)
}

export function indexPageJsonLd(params: any) {
  return {
    maintainer: 'OS Dental',
    publisher: {
      '@type': 'Organization',
      name: 'OS Dental',
      '@id': 'https://osdental.io/#organization',
    },
    '@context': 'https://schema.org',
    headline: params?.title || '',
    articleBody: params?.posts?.map((e: any) => e?.title).join(', ') || '',
    copyrightHolder: {
      '@type': 'Organization',
      '@id': 'https://osdental.io/#organization',
    },
    name: params?.title || '',
    datePublished: params?._createdAt || '',
    description: params?.excerpt || '',
  }
}

export function breadCrumbJsonLd(
  breadCrumbList: { breadcrumb: string; url?: string }[],
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://osdental.io'
  const sanitizedBaseUrl = sanitizeUrl(baseUrl)
  const home = {
    '@type': 'ListItem',
    position: 1,
    name: 'home',
    item: sanitizedBaseUrl,
  }
  const JsonLdItems = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',

    itemListElement: breadCrumbList.map((e: any, i: number) => {
      return {
        '@type': 'ListItem',
        position: i + 2,
        name: e?.label ?? '',
        item: sanitizeUrl(`${sanitizedBaseUrl}${e?.href}`)
      }
    }),
  }

  JsonLdItems.itemListElement.unshift(home)
  return JsonLdItems;
}

/**
 * Generate JSON-LD schema for FAQ Page
 * 
 * SEO Implementation Notes:
 * - Uses FAQPage schema type from schema.org (https://schema.org/FAQPage)
 * - FAQPage requires mainEntity array containing Question objects
 * - Each Question must have:
 *   - @type: "Question"
 *   - name: The question text (string)
 *   - acceptedAnswer: Object with @type "Answer" and text property
 * - This structured data enables rich snippets in Google search results
 * - Google recommends 5-8 FAQs per page for optimal SEO value
 * - FAQs must be visible to users on the page (not hidden markup)
 * 
 * Data Format:
 * - faqData.faqs should be an array of objects with 'question' and 'answer' properties
 * - Example: [{ question: "What is X?", answer: "X is..." }, ...]
 * 
 * @param faqData - FAQ data object containing name and faqs array
 * @param url - Canonical URL of the FAQ page (used for proper indexing)
 * @returns JSON stringified FAQPage schema ready for <script type="application/ld+json">
 */
export function generateFAQJSONLD(faqData: any, url: string) {
  if (!faqData || !faqData.faqs || !Array.isArray(faqData.faqs) || faqData.faqs.length === 0) {
    return '{}'
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.faqs.map((faq: any) => ({
      '@type': 'Question',
      name: faq.question || '',
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer || '',
      },
    })),
    url: sanitizeUrl(url),
    name: faqData.name || 'Frequently Asked Questions',
  }

  return JSON.stringify(faqSchema)
}

/**
 * Generate JSON-LD schema for Glossary Page
 * 
 * SEO Implementation Notes:
 * - Uses ItemList schema type from schema.org (https://schema.org/ItemList)
 * - ItemList is ideal for structured lists of terms/definitions
 * - Each item uses DefinedTerm type (https://schema.org/DefinedTerm) for glossary entries
 * - DefinedTerm provides semantic meaning for term-definition pairs
 * - This helps search engines understand the glossary structure and content
 * - Can improve visibility in knowledge panels and featured snippets
 * 
 * Alternative Schema Options:
 * - Could also use CollectionPage for glossary pages
 * - DefinedTerm is preferred for individual glossary entries
 * 
 * Data Format:
 * - glossaryData.terms should be an array of objects with 'term' and 'value' properties
 * - Example: [{ term: "API", value: "Application Programming Interface" }, ...]
 * - Position is automatically assigned based on array index (1-based)
 * 
 * @param glossaryData - Glossary data object containing mainHeading, subheading, and terms array
 * @param url - Canonical URL of the Glossary page (used for proper indexing)
 * @returns JSON stringified ItemList schema ready for <script type="application/ld+json">
 */
export function generateGlossaryJSONLD(glossaryData: any, url: string) {
  if (!glossaryData || !glossaryData.terms || !Array.isArray(glossaryData.terms) || glossaryData.terms.length === 0) {
    return '{}'
  }

  const glossarySchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: glossaryData.mainHeading || 'Glossary',
    description: glossaryData.subheading || '',
    url: sanitizeUrl(url),
    itemListElement: glossaryData.terms.map((term: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'DefinedTerm',
        name: term.term || '',
        description: term.value || '',
      },
    })),
  }

  return JSON.stringify(glossarySchema)
}
