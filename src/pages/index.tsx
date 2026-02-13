import type { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import Layout from '~/components/Layout'
import { Post } from '~/interfaces/post'
import DynamicPages from '~/layout/DynamicPages'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getCategories,
  getEbooks,
  getEventCards,
  getFooterData,
  getHomeSettings,
  getPosts,
  getPodcasts,
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
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & { posts: Post[] }
> = async ({ draftMode = false}) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const region:any = 'en'; 

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
      podcasts
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
      getPodcasts(client, 0, undefined, region)
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
        releaseNotes,
        allEventCards,
        categories,
        footerData,
        podcasts: podcasts || []
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://resources.voicestack.com'
  const locale = useRouter().query.locale as string
  const defaultUrl = !locale || locale === 'en' ? baseUrl : `${baseUrl}/${locale}`

  return (
    <GlobalDataProvider
      data={props?.categories}
      featuredTags={homeSettings?.featuredTags}
      homeSettings={homeSettings}
      footerData={props?.footerData}
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
        <DynamicPages
          posts={props.posts}
          tags={props.tags}
          testimonials={props.testimonials}
          homeSettings={homeSettings}
          podcasts={props?.podcasts}
          latestPosts={latestPosts}
          ebooks={props?.ebooks}
          webinars={props?.webinars}
          releaseNotes={props?.releaseNotes}
          eventCards={eventCards}
        />
      </Layout>
    </GlobalDataProvider>
  )
}
