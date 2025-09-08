import siteConfig from 'config/siteConfig'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'

import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import Layout from '~/components/Layout'
import AllcontentSection from '~/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import ContentHub from '~/contentUtils/ContentHub'
import { getClient } from '~/lib/sanity.client'
import {
  getArticlesCount,
  getCategories,
  getEbooksCount,
  getFooterData,
  getHomeSettings,
  getPodcastsCount,
  getPosts,
  getPostsByCategoryAndLimit,
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
    categories,
    posts,
    totalPosts,
    siteSettings,
    totalPodcasts,
    totalWebinars,
    totalArticles,
    totalEbooks,
    homeSettings,
    footerData
  ] = await Promise.all([
    getTags(client),
    getCategories(client),
    getPostsByLimit(client, startLimit, cardsPerPage,region),
    getPosts(client,undefined,region),
    getSiteSettings(client),
    getPodcastsCount(client,region),
    getWebinarsCount(client,region),
    getArticlesCount(client,region),
    getEbooksCount(client,region),
    getHomeSettings(client,region),
    getFooterData(client, region)
  ])

  const categoryPosts = await Promise.all( 
    categories.map((category) => {
      return getPostsByCategoryAndLimit(client, category._id, 0, 3,region)
    })
  )

  // Filter out categories with no posts for ContentHub
  const categoriesWithPosts = categories.filter((category, index) => {
    return categoryPosts[index] && categoryPosts[index].length > 0;
  });
  
  
  const totalPages = Math.ceil(totalPosts.length / cardsPerPage)

  return {
    props: {
      posts,
      tags,
      categories,
      categoriesWithPosts,
      categoryPosts,
      totalPages,
      totalPosts,
      currentPage: pageNumber,
      contentCount: {
        podcasts: totalPodcasts,
        webinars: totalWebinars,
        articles: totalArticles,
        ebooks: totalEbooks,
      },
      siteSettings: siteSettings,
      homeSettings: homeSettings,
      footerData: footerData
    },
  }
}


export default function ProjectSlugRoute(
  props: InferGetStaticPropsType<typeof getStaticProps> & {
    posts: any
    totalPages: any
    tags: any
    categories: any
    categoriesWithPosts: any
  },
) {
  const router = useRouter()

  const {
    contentCount,
    totalPosts,
    siteSettings,
    homeSettings,
    categories,
    categoriesWithPosts,
    categoryPosts
  } = props

  const baseUrl = `/${siteConfig.paginationBaseUrls.base}`

  const siteSettingWithImage = siteSettings?.find((e: any) => e?.openGraphImage)


  return (
    <>
      <GlobalDataProvider data={categoriesWithPosts} featuredTags={homeSettings?.featuredTags} footerData={props?.footerData}>
        <BaseUrlProvider baseUrl={baseUrl}>
          <Layout>
            {siteSettingWithImage ? (
              defaultMetaTag(siteSettingWithImage)
            ) : (
              <></>
            )}
            <ContentHub featuredDescription={homeSettings?.topicDescription} categories={categoriesWithPosts} contentCount={contentCount} />
            {categoryPosts && categoryPosts.length > 0 && categoryPosts.map((post: any, index: number) => {
              return post?.length > 0 && (
                <div key={index + 1}>
                  <AllcontentSection redirect={true} uiType="category" allContent={post} compIndex={index} className=''  />
                </div> 
              )
            })}
            <BannerSubscribeSection />
          </Layout>
        </BaseUrlProvider>
      </GlobalDataProvider>
    </>
  )
}
