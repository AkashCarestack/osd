import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import Layout from '~/components/Layout'
import { getClient } from '~/lib/sanity.client'
import {
  getArticlesCount,
  getCategories,
  getEbooksCount,
  getHomeSettings,
  getPodcastsCount,
  getPosts,
  getPostsByCategoryAndLimit,
  getPostsByLimit,
  getSiteSettings,
  getTags,
  getWebinarsCount,
} from '~/lib/sanity.queries'
import AllcontentSection from '~/components/sections/AllcontentSection'
import siteConfig from 'config/siteConfig'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import router, { useRouter } from 'next/router'
import ContentHub from '~/contentUtils/ContentHub'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import { defaultMetaTag } from '~/utils/customHead'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'

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
    fallback: 'blocking',
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
  ])

  const categoryPosts = await Promise.all( 
    categories.map((category) => {
      return getPostsByCategoryAndLimit(client, category._id, 0, 3,region)
    })
  )
  
  const totalPages = Math.ceil(totalPosts.length / cardsPerPage)

  return {
    props: {
      posts,
      tags,
      categories,
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
    },
  }
}


export default function ProjectSlugRoute(
  props: InferGetStaticPropsType<typeof getStaticProps> & {
    posts: any
    totalPages: any
    tags: any
    categories: any
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
    categoryPosts
  } = props
  const totalCount: any = totalPosts.length ?? 0

  const baseUrl = `/${siteConfig.paginationBaseUrls.base}`

  const siteSettingWithImage = siteSettings?.find((e: any) => e?.openGraphImage)

  // const featuredBlog = homeSettings?.FeaturedBlog || posts[0]
  // const featuredBlogs = homeSettings?.popularBlogs || posts

  // const featuredContents = [...featuredBlogs, ...posts].slice(0, 4)

  return (
    <>
      <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags}>
        <BaseUrlProvider baseUrl={baseUrl}>
          <Layout>
            {siteSettingWithImage ? (
              defaultMetaTag(siteSettingWithImage)
            ) : (
              <></>
            )}
            <ContentHub featuredDescription={homeSettings?.topicDescription} categories={categories} contentCount={contentCount} />
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
