import siteConfig from 'config/siteConfig'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'

import Pagination from '~/components/commonSections/Pagination'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import Layout from '~/components/Layout'
import AllcontentSection from '~/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import ContentHub from '~/contentUtils/ContentHub'
import TagSelect from '~/contentUtils/TagSelector'
import { getClient } from '~/lib/sanity.client'
import {
  getArticlesCount,
  getCategories,
  getEbooksCount,
  getFooterData,
  getHomeSettings,
  getPodcastsCount,
  getPosts,
  getPostsByLimit,
  getSiteSettings,
  getTags,
  getWebinarsCount,
} from '~/lib/sanity.queries'
import { defaultMetaTag } from '~/utils/customHead'

interface Query {
  [key: string]: string
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
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = getClient()
  const region = params?.locale as string
  
  const pageNumber = params?.pageNumber
    ? parseInt(params.pageNumber as string, 10)
    : 1

  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5
  const startLimit = (pageNumber - 1) * cardsPerPage

  const [
    tags,
    posts,
    totalPosts,
    siteSettings,
    totalPodcasts,
    totalWebinars,
    totalArticles,
    totalEbooks,
    homeSettings,
    categories,
    footerData
  ] = await Promise.all([
    getTags(client),
    getPostsByLimit(client, startLimit, cardsPerPage,undefined,region),
    getPosts(client,undefined,region),
    getSiteSettings(client),
    getPodcastsCount(client,region),
    getWebinarsCount(client,region),
    getArticlesCount(client,region),
    getEbooksCount(client,region),
    getHomeSettings(client,region),
    getCategories(client),
    getFooterData(client, region)
  ])
  

  const totalPages = Math.ceil(totalPosts.length / cardsPerPage)

  return {
    props: {
      posts,
      tags,
      totalPages,
      totalPosts,
      categories,
      footerData,
      currentPage: pageNumber,
      contentCount: {
        podcasts: totalPodcasts,
        webinars: totalWebinars,
        articles: totalArticles,
        ebooks: totalEbooks,
      },
      siteSettings: siteSettings,
      homeSettings: homeSettings,
    },
  }
}

export default function ProjectSlugRoute(
  props: InferGetStaticPropsType<typeof getStaticProps> & {
    posts: any
    totalPages: any
    tags: any
  },
) {
  const router = useRouter()

  const {
    posts,
    totalPages,
    tags,
    contentCount,
    totalPosts,
    siteSettings,
    homeSettings,
    categories,
    footerData
  } = props
  const totalCount: any = totalPosts.length ?? 0

  const baseUrl = `/${siteConfig.paginationBaseUrls.base}`
  const Url:string = process.env.NEXT_PUBLIC_BASE_URL+baseUrl

  const handlePageChange = (page: number) => {
    //   if (page === 1) {
    // 	router.push(baseUrl);
    //   } else {
    // 	router.push(`${baseUrl}/page/${page}`);
    //   }
  }
  const siteSettingWithImage = siteSettings?.find((e: any) => e?.openGraphImage)
  

  return (
    <>
      <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
        <BaseUrlProvider baseUrl={baseUrl}>
          <Layout>
            {siteSettingWithImage ? (
              defaultMetaTag(siteSettingWithImage,Url)
            ) : (
              <></>
            )}
            <ContentHub contentCount={contentCount} />
            <TagSelect tags={tags} tagLimit={5} showTags={true} />
            <AllcontentSection allItemCount={totalCount} allContent={posts} />
            <Pagination
              totalPages={totalPages}
              onPageChange={handlePageChange}
              currentPage={0}
              enablePageSlug={true}
            />
            <BannerSubscribeSection />
          </Layout>
        </BaseUrlProvider>
      </GlobalDataProvider>
    </>
  )
}
