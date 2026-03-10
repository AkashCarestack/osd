import { NextRouter } from 'next/router'

export const getBasePath = (
  router: NextRouter,
  contentType: string,
): string => {
  const basePaths = {
    podcast: 'podcast',
    topic: 'topic',
    article: 'topic', // Map article to topic for backward compatibility
    webinar: 'webinar',
    'press-release': 'press-release',
    ebook: 'ebook',
    'case-study': 'case-study',
    'release-notes': 'release-notes',
  }

  return basePaths[contentType] || ''
}
