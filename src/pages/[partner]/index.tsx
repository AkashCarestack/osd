import siteConfig from 'config/siteConfig'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import Layout from '~/components/Layout'
import { Post } from '~/interfaces/post'
import DynamicPages from '~/layout/DynamicPages'
import { getDefaultLocale, getPartnerPaths } from '~/lib/partnerPaths'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getCategoriesForPartner,
  getEbooks,
  getEventCards,
  getEvents,
  getFAQsForPartner,
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
  footerData: any
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
  schemaBaseUrl?: string
  schemaSiteName?: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient()
  const paths = await getPartnerPaths(client)
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & { posts: Post[] }
> = async ({ draftMode = false, params }: any) => {
  const region = getDefaultLocale()
  const partnerSlug = params?.partner
  const client = getClient(draftMode ? { token: readToken } : undefined)
  if (!partnerSlug || typeof partnerSlug !== 'string') return { notFound: true }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://osdental.io'

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
      events,
      partnerFAQs,
      partnersWithHome,
    ] = await Promise.all([
      getPosts(client, 5, region),
      getPosts(client, undefined, region),
      getTags(client),
      getTagsByOrder(client),
      getTestiMonials(client, 0, undefined, region),
      getHomeSettings(client, region, partnerSlug),
      getSiteSettings(client),
      getEbooks(client, 0, undefined, region),
      getWebinars(client, 0, undefined, region),
      getReleaseNotes(client, 0, 3, region),
      getEventCards(client),
      getCategoriesForPartner(client, partnerSlug),
      getFooterData(client, region),
      getPodcasts(client, undefined, undefined, region),
      getEvents(client, region, partnerSlug),
      getFAQsForPartner(client, partnerSlug),
      getPartnersWithHomeSettings(client),
    ])

    // Knowledge Guides: only this partner’s categories (exclude site-wide)
    const allCategories = categories || []
    const partnerOnlyCategories = allCategories.filter(
      (c: any) => c.partner?.slug === partnerSlug,
    )
    const categoriesForPage =
      partnerOnlyCategories.length > 0 ? partnerOnlyCategories : allCategories

    // FAQ: show FAQs where the FAQ document is for this partner (or site-wide), from any category.
    // If no category links to an FAQ, fall back to FAQ documents for this partner (content repo).
    let faqCategories = allCategories.filter(
      (category: any) =>
        category.faq &&
        category.faq.faqs &&
        category.faq.faqs.length > 0 &&
        (!category.faq.partnerSlug ||
          category.faq.partnerSlug === partnerSlug),
    )
    if (faqCategories.length === 0 && partnerFAQs?.length > 0) {
      faqCategories = partnerFAQs.map((faqDoc: any) => ({
        _id: faqDoc._id,
        categoryName: faqDoc.name,
        slug: { current: 'faq' },
        faq: faqDoc,
      }))
    }

    // Only use home settings content (e.g. upcoming events) when the doc is for this partner
    const homeSettingsForPage =
      homeSettings && homeSettings.partner?.slug !== partnerSlug
        ? { ...homeSettings, upcomingEventsSection: undefined }
        : homeSettings

    const partnerInfo = (partnersWithHome || []).find(
      (p: { slug: string; partnerName?: string }) => p.slug === partnerSlug,
    )
    const schemaBaseUrl = `${baseUrl.replace(/\/$/, '')}/${partnerSlug}`
    const schemaSiteName = partnerInfo?.partnerName || partnerSlug

    return {
      props: {
        draftMode,
        token: draftMode ? readToken : '',
        posts,
        latestPosts,
        tags,
        tagsByOrder,
        testimonials,
        homeSettings: homeSettingsForPage,
        siteSettings,
        ebooks,
        webinars,
        releaseNotes,
        allEventCards,
        categories: categoriesForPage,
        footerData,
        podcasts,
        faqCategories,
        events: events || [],
        schemaBaseUrl,
        schemaSiteName,
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
        error: true,
      },
    }
  }
}

export default function IndexPage(props: IndexPageProps) {
  const homeSettings = props?.homeSettings
  const siteSettings = props?.siteSettings
  const eventCards = props?.allEventCards
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://osdental.io'
  const router = useRouter()
  const partner = router.query.partner as string
  const canonicalUrl = partner ? `${baseUrl}/${partner}` : baseUrl

  return (
    <GlobalDataProvider
      data={props?.categories}
      featuredTags={homeSettings?.featuredTags}
      homeSettings={homeSettings}
      footerData={props?.footerData}
    >
      <Layout>
        {siteSettings?.map((e: any) =>
          defaultMetaTag(e, canonicalUrl),
        )}
        <Head>
          <link rel="canonical" href={canonicalUrl} key="canonical" />
        </Head>
        <DynamicPages
          posts={props.posts}
          tags={props.tags}
          testimonials={props.testimonials}
          homeSettings={homeSettings}
          podcastData={props?.podcastData}
          latestPosts={props.latestPosts}
          ebooks={props?.ebooks}
          webinars={props?.webinars}
          releaseNotes={props?.releaseNotes}
          eventCards={eventCards}
          podcasts={props?.podcasts}
          categories={props?.categories}
          faqCategories={props?.faqCategories}
          events={props?.events}
        />
      </Layout>
    </GlobalDataProvider>
  )
}
