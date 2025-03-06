import { Post } from '~/interfaces/post'
import { fetchAuthor } from './common'
import { urlForImage } from '~/lib/sanity.image'

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
            '@id': `https://resources.voicestack.com${post.slug}`,
            isPartOf: {
              '@id': 'https://resources.voicestack.com/#website',
            },
          },
          headline: post.title,
          description: excerpt,
          image:
            'https://cdn.sanity.io/images/bbmnn1wc/production/5cc4351771b60f336498e1ba2642f572ab3c8364-1201x1201.png',
          author: {
            '@type': 'Person',
            name: (author && author[0]?.name) || 'Unknown Author',
            url: 'https://carestack.com/company/leadership-team',
          },
          wordCount: estimatedWordCount ?? 0,
          dateCreated: post._createdAt,
          inLanguage: 'en-US',
          copyrightYear: post._createdAt.split(' ')[2],
          copyrightHolder: {
            '@id': 'https://carestack.com/#organization',
          },
          publisher: {
            '@type': 'Organization',
            name: 'CareStack',
            url: 'https://carestack.com',
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
      '@id': `https://resources.voicestack.com${post.slug}`,
      isPartOf: {
        '@id': 'https://resources.voicestack.com/#website',
      },
    },
    headline: post.title,
    description: excerpt,
    image:
      'https://cdn.sanity.io/images/bbmnn1wc/production/5cc4351771b60f336498e1ba2642f572ab3c8364-1201x1201.png',
    author: {
      '@type': 'Person',
      name: (author && author[0]?.name) || 'Unknown Author',
      url: 'https://carestack.com/company/leadership-team',
    },
    wordCount: estimatedWordCount ?? 0,
    dateCreated: post._createdAt,
    inLanguage: 'en-US',
    copyrightYear: post._createdAt?.split(' ')[2],
    copyrightHolder: {
      '@id': 'https://carestack.com/#organization',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CareStack',
      url: 'https://carestack.com',
      logo: {
        '@type': 'ImageObject',
        inLanguage: 'en-US',
        url: 'https://cdn.sanity.io/images/bbmnn1wc/production/5cc4351771b60f336498e1ba2642f572ab3c8364-1201x1201.png',
        width: 1200,
        height: 1200,
      },
    },
  }

  let customJSONLD = {}
  try {
    customJSONLD = JSON.parse(post.seoJSONLD || '{}')
  } catch (error) {
    console.error('Error parsing custom JSON-LD:', error)
  }

  return JSON.stringify({ ...defaultJSONLD, ...customJSONLD })
}

export function indexPageJsonLd(params: any) {
  return {
    maintainer: 'CareStack',
    publisher: {
      '@type': 'Organization',
      name: 'CareStack',
      '@id': 'https://carestack.com/#organization',
    },
    '@context': 'https://schema.org',
    headline: params?.title || '',
    articleBody: params?.posts?.map((e: any) => e?.title).join(', ') || '',
    copyrightHolder: {
      '@type': 'Organization',
      '@id': 'https://carestack.com/#organization',
    },
    name: params?.title || '',
    datePublished: params?._createdAt || '',
    description: params?.excerpt || '',
  }
}

export function breadCrumbJsonLd(
  breadCrumbList: { breadcrumb: string; url?: string }[],
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const home = {
    '@type': 'ListItem',
    position: 1,
    name: 'home',
    item: `${baseUrl}`,
  }
  const JsonLdItems = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',

    itemListElement: breadCrumbList.map((e: any, i: number) => {
      return {
        '@type': 'ListItem',
        position: i + 2,
        name: e?.label ?? '',
        item:  `${baseUrl}${e?.href}`
      }
    }),
  }

  JsonLdItems.itemListElement.unshift(home)
  return JsonLdItems;
}
