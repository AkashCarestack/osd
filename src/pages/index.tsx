import type { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import Layout from '~/components/Layout'
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

  return (
    <GlobalDataProvider
      data={props?.categories}
      featuredTags={homeSettings?.featuredTags}
      homeSettings={homeSettings}
      footerData={props?.footerData}
      partners={props?.partners ?? []}
    >
      <Layout>
        {siteSettings?.map((e: any) => {
          return defaultMetaTag(e)
        })}
        <Head>
          <link rel="canonical" href={baseUrl} key="canonical" />
          <link rel="alternate" href={defaultUrl} hrefLang="x-default" />
          <link rel="alternate" href={baseUrl + '/en'} hrefLang="en-US" />
          <link rel="alternate" href={baseUrl + '/en-GB'} hrefLang="en-GB" />
          <link rel="alternate" href={baseUrl + '/en-AU'} hrefLang="en-AU" />
        </Head>
        {/* Default landing: hero bg only (partner links shown in Header when on /) */}
        <div
          className="min-h-screen w-full bg-[#18181b] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
      </Layout>
    </GlobalDataProvider>
  )
}
