import type { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import OSDentalLogo from '~/assets/reactiveAssets/OSDentalLogo'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { Post } from '~/interfaces/post'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getAllFAQs,
  getCategories,
  getEbooks,
  getEventCards,
  getEvents,
  getFooterData,
  getHomeSettings,
  getPartnersWithHomeSettings,
  getPodcasts,
  getPosts,
  getReleaseNotes,
  getSiteSettings,
  getTags,
  getTagsByOrder,
  getTestiMonials,
  getWebinars,
} from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'
import { defaultMetaTag } from '~/utils/customHead'

interface IndexPageProps {
  footerData: unknown
  categories: any
  allEventCards: any
  tagsByOrder: any
  webinars: any
  ebooks: any
  releaseNotes: any
  siteSettings: any
  contentType: string
  latestPosts: any
  podcastData: any
  podcasts: any
  draftMode: boolean
  token: string
  posts: Array<Post>
  tags: Array<any>
  testimonials: Array<any>
  homeSettings: any
  faqCategories: any[]
  events: any[]
  partners: { slug: string; partnerName?: string }[]
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & { posts: Post[] }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const region: any = 'en'

  try {
    const [
      latestPosts,
      posts,
      tags,
      tagsByOrder,
      testimonials,
      homeSettings,
      siteSettings,
      ebooks,
      webinars,
      releaseNotes,
      allEventCards,
      categories,
      footerData,
      podcasts,
      faqCategories,
      events,
      partners,
    ] = await Promise.all([
      getPosts(client, 5),
      getPosts(client),
      getTags(client),
      getTagsByOrder(client),
      getTestiMonials(client),
      getHomeSettings(client),
      getSiteSettings(client),
      getEbooks(client),
      getWebinars(client),
      getReleaseNotes(client, 0, 3, region),
      getEventCards(client),
      getCategories(client),
      getFooterData(client, region),
      getPodcasts(client, 0, undefined, region),
      getAllFAQs(client),
      getEvents(client, region),
      getPartnersWithHomeSettings(client),
    ])

    // Filter categories that have FAQs
    const categoriesWithFAQs = faqCategories.filter(
      (category) =>
        category.faq && category.faq.faqs && category.faq.faqs.length > 0,
    )

    return {
      props: {
        draftMode,
        token: draftMode ? readToken : '',
        posts,
        latestPosts,
        tags,
        tagsByOrder,
        testimonials,
        homeSettings,
        siteSettings,
        ebooks,
        webinars,
        releaseNotes,
        allEventCards,
        categories,
        footerData,
        podcasts: podcasts || [],
        faqCategories: categoriesWithFAQs,
        events: events || [],
        partners: partners ?? [],
      },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        draftMode,
        token: draftMode ? readToken : '',
        posts: [],
        tags: [],
        testimonials: [],
        homeSettings: [],
        ebooks: [],
        webinars: [],
        releaseNotes: [],
        footerData: [],
        podcasts: [],
        categories: [],
        faqCategories: [],
        events: [],
        partners: [],
        error: true,
      },
    }
  }
}

export default function IndexPage(props: IndexPageProps) {
  const homeSettings = props?.homeSettings
  const latestPosts = props?.latestPosts
  const siteSettings = props?.siteSettings
  const eventCards = props?.allEventCards
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://osdental.io'
  const locale = useRouter().query.locale as string
  const defaultUrl =
    !locale || locale === 'en' ? baseUrl : `${baseUrl}/${locale}`

  const heroBg =
    homeSettings?.heroSection?.backgroundImage ||
    'https://cdn.sanity.io/images/rcbknqsy/production/c57bdee986c4836572b6747a44da0a80dfb21674-3058x1020.png'

  const partnersList = props?.partners ?? []

  return (
    <GlobalDataProvider
      data={props?.categories}
      featuredTags={homeSettings?.featuredTags}
      homeSettings={homeSettings}
      footerData={props?.footerData}
      partners={partnersList}
    >
      {siteSettings?.map((e: any) =>
        defaultMetaTag(e, defaultUrl || baseUrl),
      )}
      <Head>
        <link rel="canonical" href={baseUrl} key="canonical" />
        <link rel="alternate" href={defaultUrl} hrefLang="x-default" />
        <link rel="alternate" href={baseUrl + '/en'} hrefLang="en-US" />
        <link rel="alternate" href={baseUrl + '/en-GB'} hrefLang="en-GB" />
        <link rel="alternate" href={baseUrl + '/en-AU'} hrefLang="en-AU" />
      </Head>
      {/* Home page: no header/footer, hero bg with centered logo + partner links */}
      <div
        className="min-h-screen w-full bg-[#18181b] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center relative"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="flex flex-col items-center justify-center gap-10 md:gap-12 relative z-10">
          <Link href="/" className="shrink-0" aria-label="OS Dental home">
            <OSDentalLogo
              width={220}
              height={39}
              className="w-[180px] md:w-[220px] h-auto text-white"
            />
          </Link>
          {partnersList.length > 0 && (
            <nav className="flex flex-wrap items-center justify-center gap-x-1 gap-y-3 md:gap-x-2 md:gap-y-4 px-4">
              {partnersList.map((p, i) => (
                <span key={p.slug} className="flex items-center gap-x-3 md:gap-x-4">
                  {i > 0 && (
                    <span className="text-white/60 font-light select-none" aria-hidden="true">|</span>
                  )}
                  <Link
                    href={`/${p.slug}`}
                    className="text-white/90 hover:text-white font-medium text-lg transition-colors duration-200 px-3 py-2 rounded hover:underline underline-offset-4"
                  >
                    {p.partnerName || p.slug}
                  </Link>
                </span>
              ))}
            </nav>
          )}
        </div>
      </div>
    </GlobalDataProvider>
  )
}
