import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import Layout from '~/components/Layout'
import AllcontentSection from '~/components/sections/AllcontentSection'
import { getClient } from '~/lib/sanity.client'
import {
  getArticles,
  getArticlesCount,
  getCategories,
  getHomeSettings,
  getSiteSettings,
  getTags,
} from '~/lib/sanity.queries'
import { readToken } from '~/lib/sanity.api'
import { SharedPageProps } from '../../../_app'
import { Articles } from '~/interfaces/post'
import siteConfig from '../../../../../config/siteConfig'
import React, { useContext, useRef } from 'react'
import Pagination from '~/components/commonSections/Pagination'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import { CustomHead, customMetaTag } from '~/utils/customHead'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient();
  const locales = siteConfig.locales; 
  const paths = await Promise.all(
    locales.map(async (locale) => {
      const articles = await getArticles(client, 0, undefined, locale);
      const totalPages = Math.ceil(
        articles.length / siteConfig.pagination.childItemsPerPage
      );

      return Array.from({ length: totalPages - 1 }, (_, i) => ({
        params: { pageNumber: (i + 2).toString(), locale },
      }));
    })
  );

  return { paths: paths.flat(), fallback: false };
};

export const getStaticProps: GetStaticProps<SharedPageProps & {}> = async (
  context,
) => {
  const draftMode = context.preview || false
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const locale =  context.locale;  
  const pageNumber = Number(context.params?.pageNumber) || 1
  const itemsPerPage = siteConfig.pagination.childItemsPerPage
  const skip = (pageNumber - 1) * itemsPerPage

  try {
    const [articles, totalArticles, tags, homeSettings,siteSettings,categories] = await Promise.all([
      getArticles(client, skip, itemsPerPage,locale),
      getArticlesCount(client,locale),
      getTags(client),
      getHomeSettings(client),
      getSiteSettings(client),
      getCategories(client)
    ])

    const totalPages = Math.ceil(totalArticles / itemsPerPage)

    return {
      props: {
        draftMode,
        token: draftMode ? readToken : '',
        articles,
        pageNumber,
        totalPages,
        tags,
        homeSettings,
        siteSettings,
        categories
      },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        draftMode,
        token: draftMode ? readToken : '',
        articles: [],
        pageNumber: 1,
        totalPages: 1,
        tags: [],
        homeSettings: [],
        siteSettings:[],
        categories: [],
      },
    }
  }
}

const PaginatedArticlesPage = ({
  articles,
  tags,
  homeSettings,
  pageNumber,
  totalPages,
  siteSettings,
  categories
}: {
  articles: Articles[]
  tags: any
  homeSettings: any
  pageNumber: number
  totalPages: number
  siteSettings: any
  categories: any
}) => {
  const router = useRouter()
  const baseUrl = `/${siteConfig.pageURLs.article}`
  const url = process.env.NEXT_PUBLIC_BASE_URL
    const currentPageUrl =`${url}${baseUrl}/page/${pageNumber}`

  const handlePageChange = (page: number) => {
    // debugger
    // if (page === 1) {
    //   router.push(baseUrl)
    // } else {
    //   router.push(`${baseUrl}/page/${page}`)
    // }
  }

  return (
    <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          {customMetaTag('article', false, currentPageUrl)}
          {articles?.map((e, i) => {
            return <CustomHead props={e} key={i} type="articleExpanded" />
          })}
          {/* {siteSettingWithImage ? defaultMetaTag(siteSettingWithImage):<></>} */}
          <AllcontentSection
            className={'pb-9'}
            allContent={articles}
            cardType="left-image-card"
            itemsPerPage={siteConfig.pagination.childItemsPerPage}
            contentType="article"
            showCount={true}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
            enablePageSlug={true}
            content={articles}
            type="custom"
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}

export default PaginatedArticlesPage
