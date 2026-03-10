const siteConfig = {
  pagination: {
    itemsHomePage: 8,
    childItemsPerPage: 12,
    currentPage: 1,
    totalItems: 100, // static value for testing
  },
  pageURLs: {
    home: '/',
    blog: 'blog',
    article: 'topic',
    topic: 'topic',
    caseStudy: 'case-study',
    ebook: 'ebook',
    about: 'about',
    podcast: 'podcast',
    pressRelease: 'press-release',
    releaseNotes: 'release-notes',
    testimonial: 'testimonial',
    webinar: 'webinar',
    author: 'author',
  },
  paginationBaseUrls: {
    base: 'browse',
  },
  categoryBaseUrls: {
    base: 'topic',
  },
  externalLinks: {
    reviews: 'https://carestack.com/dental-software/reviews',
  },
  content: {
    defaultSort: 'date',
    showFeatured: true,
  },
  placeHolder: {
    podcastCover:
      'https://cdn.sanity.io/images/bbmnn1wc/production/9cb0d15a2b39b73dcb35b588b6aef6e9c50742c2-2500x2000.jpg',
    podcastHeroCover:
      'https://cdn.sanity.io/images/bbmnn1wc/production/cfc2c520a6ab1da036ded9f234c066d7166d05ef-6000x4000.jpg',
  },
  locales: ['en','en-GB','en-AU']
}

export default siteConfig
