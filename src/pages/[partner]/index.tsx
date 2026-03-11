import siteConfig from 'config/siteConfig'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import Layout from '~/components/Layout'
import { Post } from '~/interfaces/post'
import DynamicPages from '~/layout/DynamicPages'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getDefaultLocale, getPartnerPaths } from '~/lib/partnerPaths'
import {
  getAllFAQs,
  getCategories,
  getEbooks,
  getEventCards,
  getEvents,
  getFooterData,
  getHomeSettings,
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
      getCategories(client),
      getFooterData(client, region),
      getPodcasts(client, undefined, undefined, region),
      getAllFAQs(client),
      getEvents(client, region),
    ])

    const categoriesWithFAQs = faqCategories.filter(
      (category) => category.faq && category.faq.faqs && category.faq.faqs.length > 0,
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
        podcasts,
        faqCategories: categoriesWithFAQs,
        events: events || [],
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
        {siteSettings?.map((e: any) => defaultMetaTag(e))}
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
