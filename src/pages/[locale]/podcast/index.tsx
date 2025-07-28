import siteConfig from 'config/siteConfig'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'

import Pagination from '~/components/commonSections/Pagination'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import Layout from '~/components/Layout'
import AllcontentSection from '~/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import LatestBlogs from '~/components/sections/LatestBlogSection'
import TagSelect from '~/contentUtils/TagSelector'
import { Podcasts } from '~/interfaces/post'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getCategories,
  getFooterData,
  getHomeSettings,
  getPodcasts,
  getPodcastsCount,
  getTags,
} from '~/lib/sanity.queries'
import { SharedPageProps } from '~/pages/_app'
import { mergeAndRemoveDuplicates } from '~/utils/common'
import { CustomHead,customMetaTag } from '~/utils/customHead'



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
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<SharedPageProps & {}> = async (context) => {
  const draftMode = context.preview || false
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const locale:any = context.params.locale || 'en'; 
  const itemsPerPage = siteConfig.pagination.childItemsPerPage

  const [podcasts, latestPodcasts, totalPodcasts, tags, homeSettings,categories,footerData] = await Promise.all([
    getPodcasts(client, 0, itemsPerPage, locale),
    getPodcasts(client, 0, 5,locale),
    getPodcastsCount(client,locale),
    getTags(client),
    getHomeSettings(client,locale),
    getCategories(client),
    getFooterData(client, locale)
  ])

  const totalPages = Math.ceil(totalPodcasts / itemsPerPage)

    
  if (!podcasts || podcasts.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      podcasts,
      latestPodcasts,
      totalPages,
      tags,
      homeSettings,
      categories,
      footerData
    },
  }
}


const PodcastsPage = ({
  podcasts,
  latestPodcasts,
  totalPages,
  tags,
  homeSettings,
  categories,
  footerData
}: {
  podcasts: Podcasts[]
  latestPodcasts: Podcasts[]
  totalPages: number
  tags: any
  homeSettings: any
  categories: any
  footerData: any
}) => {
  const router = useRouter()
  const baseUrl = `/${siteConfig.pageURLs.podcast}`;
  if (!podcasts) return null

  const featuredPodcast = homeSettings?.featuredPodcast || []
  const latestArticles = mergeAndRemoveDuplicates(
    featuredPodcast,
    latestPodcasts,
  )
  const handlePageChange = (page: number) => {
    // if (page === 1) {
    //   router.push(baseUrl)
    // } else {
    //   router.push(`${baseUrl}/page/${page}`)
    // }
  }

  return (
    <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          {podcasts?.map((e, i) => {
            return <CustomHead props={e} key={i} type="podcast" />
          })}
          <TagSelect tags={tags} tagLimit={7}  />
          {customMetaTag('podcast', true)}
          <LatestBlogs
            className={'pt-11 pr-9 pb-16 pl-9'}
            reverse={true}
            contents={latestArticles}
          />
          <AllcontentSection
            className={'pb-9'}
            allContent={podcasts}
            hideHeader={true}
            cardType="podcast-card"
            itemsPerPage={siteConfig.pagination.childItemsPerPage}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={1}
            onPageChange={handlePageChange}
            enablePageSlug={true}
            type="custom"
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}

export default PodcastsPage
