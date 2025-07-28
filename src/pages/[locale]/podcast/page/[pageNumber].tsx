import siteConfig from 'config/siteConfig'
import { GetStaticPaths,GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'

import Pagination from '~/components/commonSections/Pagination'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import Layout from '~/components/Layout'
import AllcontentSection from '~/components/sections/AllcontentSection'
import {  Podcasts } from '~/interfaces/post'
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
import { CustomHead, customMetaTag } from '~/utils/customHead'

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient();
  const locales = siteConfig.locales; 
  const paths = await Promise.all(
    locales.map(async (locale) => {
      const podcasts = await getPodcasts(client, 0, undefined, locale);
      const totalPages = Math.ceil(
        podcasts.length / siteConfig.pagination.childItemsPerPage
      );

      return Array.from({ length: totalPages - 1 }, (_, i) => ({
        params: { pageNumber: (i + 2).toString(), locale },
      }));
    })
  );

  return { paths: paths.flat(), fallback: false };
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    podcasts: Podcasts[]
    pageNumber: number
    totalPages: number
  }
> = async (context) => {
  const draftMode = context.preview || false
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const region =  context.locale; 
  const pageNumber = Number(context.params?.pageNumber) || 1
  const itemsPerPage = siteConfig.pagination.childItemsPerPage
  const skip = (pageNumber - 1) * itemsPerPage

  const podcasts: any = await getPodcasts(client, skip, itemsPerPage,region)
  const totalPodcasts = await getPodcastsCount(client,region)
  const totalPages = Math.ceil(totalPodcasts / itemsPerPage)
  const tags = await getTags(client)
  const homeSettings = await getHomeSettings(client,region)
  const categories = await getCategories(client)
  const footerData = await getFooterData(client, region)

    
  if (!podcasts || podcasts.length === 0) {
    return { notFound: true };
  }


  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      podcasts,
      pageNumber,
      totalPages,
      tags,
      homeSettings,
      categories
    },
  }
}

const PaginatedEbookPage = ({
  podcasts,
  tags,
  pageNumber,
  homeSettings,
  totalPages,
  categories,
  footerData
}: {
  podcasts: Podcasts[]
  tags: any
  homeSettings: any
  pageNumber: number
  totalPages: number
  categories: any
  footerData: any
}) => {
  const router = useRouter()
  const baseUrl = `/${siteConfig.pageURLs.podcast}`
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const currentPageUrl =`${url}${baseUrl}/page/${pageNumber}`

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
          {customMetaTag('podcast', false, currentPageUrl)}
          <AllcontentSection
            className={'pb-9'}
            allContent={podcasts}
            cardType="left-image-card"
            hideHeader={true}
            itemsPerPage={siteConfig.pagination.childItemsPerPage}
            contentType="podcast"
            showCount={true}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
            enablePageSlug={true}
            content={podcasts}
            type="custom"
          />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}

export default PaginatedEbookPage
