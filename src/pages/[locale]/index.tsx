import siteConfig from 'config/siteConfig'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect,useRef, useState } from 'react'

import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import Layout from '~/components/Layout'
import { Post } from '~/interfaces/post'
import DynamicPages from '~/layout/DynamicPages'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getAllFAQs,
  getCategories,
  getEbooks,
  getEventCards,
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
}


export const getStaticPaths: GetStaticPaths = async () => {

  const locales = siteConfig.locales

  const paths = locales.map((locale) => {
    if (locale === 'en') {
      return { params: { slug: '', locale } } 
    } else {
      return { params: { slug: locale, locale } }
    }
  })

  return {
    paths,
    fallback: false, // Changed from 'blocking' to prevent auto-generation
  }
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & { posts: Post[] }
> = async ({ draftMode = false, params  }:any) => {
  
  const region:any = params?.locale || 'en'; 
  const client = getClient(draftMode ? { token: readToken } : undefined)
  if (!siteConfig.locales.includes(region)) {
    return {
      notFound: true 
    }
  }

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
      faqCategories
    ] = await Promise.all([
      getPosts(client, 5,region),
      getPosts(client,undefined,region),
      getTags(client),
      getTagsByOrder(client),
      getTestiMonials(client,region),
      getHomeSettings(client,region),
      getSiteSettings(client),
      getEbooks(client,region),
      getWebinars(client,region),
      getReleaseNotes(client, 0, 3, region),
      getEventCards(client),
      getCategories(client),
      getFooterData(client, region),
      getPodcasts(client, undefined, undefined, region),
      getAllFAQs(client)
    ])

    // Filter categories that have FAQs
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
        faqCategories: categoriesWithFAQs
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
          <link rel="alternate" href={baseUrl + '/en'} hrefLang="en-US" /> 
          <link rel="alternate" href={baseUrl + '/en-GB'} hrefLang="en-GB" /> 
          <link rel="alternate" href={baseUrl + '/en-AU'} hrefLang="en-AU" /> 
          {defaultUrl && <link rel="alternate" href={defaultUrl} hrefLang="x-default" />}
          {/* <script type="application/ld+json" id="indexPageSchema">
            {JSON.stringify(indexPageJsonLd(props))}
          </script> */}
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
          releaseNotes={props?.releaseNotes}
          eventCards={eventCards}
          podcasts={props?.podcasts}
          categories={props?.categories}
          faqCategories={props?.faqCategories}
        />
      </Layout>
    </GlobalDataProvider>
  )
}
