/** @type {import('next').NextConfig} */
const config = {
  images: { remotePatterns: [{ hostname: 'cdn.sanity.io' }] },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      
      {
        source: `/article/:slug*`,
        destination: '/en/topic/:slug*',
        locale: false,
      },
      {
        source: `/topic/:slug*`,
        destination: '/en/topic/:slug*',
        locale: false,
      },
      {
        source: '/case-study/:slug*',
        destination: '/en/case-study/:slug*',
        locale: false,
      },
      {
        source: '/ebook/:slug*',
        destination: '/en/ebook/:slug*',
        locale: false,
      },
      {
        source: '/about/:slug*',
        destination: '/en/about/:slug*',
        locale: false,
      },
      {
        source: '/podcast/:slug*',
        destination: '/en/podcast/:slug*',
        locale: false,
      },
      {
        source: '/press-release/:slug*',
        destination: '/en/press-release/:slug*',
        locale: false,
      },
      {
        source: '/release-notes/:slug*',
        destination: '/en/release-notes/:slug*',
        locale: false,
      },
      {
        source: '/testimonial/:slug*',
        destination: '/en/testimonial/:slug*',
        locale: false,
      },
      {
        source: '/webinar/:slug*',
        destination: '/en/webinar/:slug*',
        locale: false,
      },
      {
        source: '/author/:slug*',
        destination: '/en/author/:slug*',
        locale: false,
      },
      {
        source: '/browse/:slug*',
        destination: '/en/browse/:slug*',
        locale: false,
      },
      {
        source: '/topic/:slug*',
        destination: '/en/topic/:slug*',
        locale: false,
      },
      {
        source: '/faq',
        destination: '/en/faq',
        locale: false,
      },

    ];
  },
  // i18n: {
  //   localeDetection:false,
  //   locales: ['en', 'en-GB','en-AU'],
  //   defaultLocale: 'en'
  // },
}

export default config
