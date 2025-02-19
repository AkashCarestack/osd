import type { GetStaticProps } from 'next'
import Layout from '~/components/Layout'
import { readToken } from '~/lib/sanity.api'
import {
  getCategories,
  getEbooks,
  getEventCards,
  getHomeSettings,
  getPosts,
  getSiteSettings,
  getTags,
  getTagsByOrder,
  getTestiMonials,
  getWebinars,
} from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'
import { Post } from '~/interfaces/post'
import { getClient } from '~/lib/sanity.client'
import DynamicPages from '~/layout/DynamicPages'
import Head from 'next/head'
import { defaultMetaTag } from '~/utils/customHead'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'

interface IndexPageProps {
  categories: any
  allEventCards: any
  tagsByOrder: any
  webinars: any
  ebooks: any
  siteSettings: any
  contentType: string
  latestPosts: any
  podcastData: any
  draftMode: boolean
  token: string
  posts: Array<Post>
  tags: Array<any>
  testimonials: Array<any>
  homeSettings: any
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & { posts: Post[] }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)


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
      allEventCards,
      categories,
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
      getEventCards(client),
      getCategories(client)
    ])

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
        allEventCards,
        categories
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  return (
    <GlobalDataProvider
      data={props?.categories}
      featuredTags={homeSettings?.featuredTags}
      homeSettings={homeSettings}
    >
      <Layout>
        {siteSettings?.map((e: any) => {
          return defaultMetaTag(e)
        })}
        <Head>
          <link rel="canonical" href={baseUrl} key="canonical" />
          <link rel="alternate" href={baseUrl} hrefLang="x-default" />
          <link rel="alternate" href={baseUrl + '/en'} hrefLang="en-US" /> 
          <link rel="alternate" href={baseUrl + '/en-GB'} hrefLang="en-GB" /> 
          <link rel="alternate" href={baseUrl + '/en-AU'} hrefLang="en-AU" /> 
        </Head>
        <DynamicPages
          posts={props.posts}
          tags={props.tags}
          testimonials={props.testimonials}
          homeSettings={homeSettings}
          podcastData={props?.podcastData}
          latestPosts={latestPosts}
          ebooks={props?.ebooks}
          webinars={props?.webinars}
          eventCards={eventCards}
        />
      </Layout>
    </GlobalDataProvider>
  )
}
