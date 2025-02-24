import { GetStaticPaths, GetStaticProps } from 'next'
import { Articles } from '~/interfaces/post'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getArticles,
  getArticlesCount,
  getCategories,
  getFooterData,
  getHomeSettings,
  getTags,
} from '~/lib/sanity.queries'
import Layout from '~/components/Layout'
import LatestBlogs from '~/components/sections/LatestBlogSection'
import AllcontentSection from '~/components/sections/AllcontentSection'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import Pagination from '~/components/commonSections/Pagination'
import { customMetaTag, CustomHead } from '~/utils/customHead'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import TagSelect from '~/contentUtils/TagSelector'
import { mergeAndRemoveDuplicates } from '~/utils/common'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import siteConfig from 'config/siteConfig'
import { SharedPageProps } from '~/pages/_app'

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

export const getStaticProps: GetStaticProps<SharedPageProps & {}> = async (
  context,
) => {
  const locale:any = context.params.locale || 'en'; 
  const draftMode = context.preview || false
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const itemsPerPage = siteConfig.pagination.childItemsPerPage
  const totalArticles = await getArticlesCount(client,locale)
  const totalPages = Math.ceil(totalArticles / itemsPerPage)
  

  const [articles, latestArticles, tags, homeSettings,categories,footerData] = await Promise.all([
    getArticles(client, 0, itemsPerPage,locale),
    getArticles(client, 0, 5,locale),
    getTags(client),
    getHomeSettings(client,locale),
    getCategories(client),
    getFooterData(client, locale)
  ])
  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      articles,
      latestArticles,
      totalPages,
      tags,
      homeSettings,
      categories,
      footerData
    },
  }
}

const ArticlesPage = ({
  articles,
  latestArticles,
  totalPages,
  tags,
  homeSettings,
  categories,
  footerData
}: {
  articles: Articles[]
  latestArticles: Articles[]
  totalPages: number
  tags: any
  homeSettings?: any
  categories?: any
  footerData?: any
}) => {
  const router = useRouter()
  const baseUrl = `/${siteConfig.pageURLs.article}`

  const featuredArticles = homeSettings?.featuredArticle || []

  const latestContents = mergeAndRemoveDuplicates(
    featuredArticles,
    latestArticles,
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
          <CustomHead props={articles} type="articleExpanded" />
          <TagSelect tags={tags} tagLimit={7}  />
          {customMetaTag('article', true)}
          <LatestBlogs
            className={'pt-11 pr-9 pb-16 pl-9'}
            reverse={true}
            contents={latestContents}
          />
          {articles?.length
            ? articles.map((e, i) => {
                return <CustomHead props={e} type="articleExpanded" key={i} />
              })
            : null}
          <AllcontentSection
            className={'pb-9'}
            allContent={articles}
            hideHeader={true}
            cardType="left-image-card"
            itemsPerPage={siteConfig.pagination.childItemsPerPage}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={1}
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

export default ArticlesPage
