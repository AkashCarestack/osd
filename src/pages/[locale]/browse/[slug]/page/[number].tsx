import { GetStaticProps, InferGetStaticPropsType } from 'next'
import {
  getTag,
  getPostsByTag,
  getTags,
  getPostsByTagAndLimit,
  getWebinarsCount,
  getArticlesCount,
  getEbooksCount,
  getPodcastsCount,
  getHomeSettings,
  getCategories,
} from '~/lib/sanity.queries'
import { getClient } from '~/lib/sanity.client'
import siteConfig from 'config/siteConfig'
import { Post, Tag } from '~/interfaces/post'
import Layout from '~/components/Layout'
import AllcontentSection from '~/components/sections/AllcontentSection'
import TagSelect from '~/contentUtils/TagSelector'
import Pagination from '~/components/commonSections/Pagination'
import ContentHub from '~/contentUtils/ContentHub'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { SharedPageProps } from '~/pages/_app'

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    tag: Tag
    posts: Post[]
    allTags: Tag[]
    totalPages: number
    currentPage: number
    contentCount: any
    totalPostCount: any[]
    homeSettings: any
    categories: any
  }
> = async ({ params }) => {
  const client = getClient()

  const slug = params?.slug as string
  const region = params?.locale as string  
  const pageNumber = parseInt(params?.number as string, 10) || 1

  const tag = await getTag(client, slug)
  const allTags = await getTags(client)

  if (!tag) {
    return {
      notFound: true,
    }
  }

  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5
  const startLimit = (pageNumber - 1) * cardsPerPage
  const endLimit = startLimit + cardsPerPage

  const posts = await getPostsByTagAndLimit(
    client,
    tag._id,
    startLimit,
    endLimit,
    region
  )
  const allPostsForTag = await getPostsByTag(client, tag._id,region)
  const totalPages = Math.ceil(allPostsForTag.length / cardsPerPage)

  const totalPodcasts = await getPodcastsCount(client,region)
  const totalWebinars = await getWebinarsCount(client,region)
  const totalArticles = await getArticlesCount(client,region)
  const totalEbooks = await getEbooksCount(client,region)
  const homeSettings = await getHomeSettings(client,region)
  const categories = await getCategories(client)


  return {
    props: {
      tag,
      allTags,
      totalPages,
      totalPostCount: allPostsForTag.length,
      posts,
      currentPage: pageNumber,
      draftMode: false,
      token: null,
      homeSettings,
      categories,
      contentCount: {
        podcasts: totalPodcasts,
        webinars: totalWebinars,
        articles: totalArticles,
        ebooks: totalEbooks,
      },
    },
  }
}

export const getStaticPaths = async () => {
  const client = getClient()
  const tags = await getTags(client)  
  const locales = siteConfig.locales; 
  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5
  
  const paths = []
  
  for (const locale of locales) {
    for (const tag of tags) {
      const posts = await getPostsByTag(client, tag._id, locale)
      const totalPages = Math.ceil(posts.length / cardsPerPage)
  
      for (let i = 2; i <= totalPages; i++) {
        paths.push({ params: { locale, slug: tag.slug.current, number: i.toString() } })
      }
    }
  }

  return {
    paths, 
    fallback: false, 
  };
}

export default function TagPagePaginated({
  tag,
  posts,
  allTags,
  totalPages,
  currentPage,
  contentCount,
  totalPostCount,
  homeSettings,
  categories
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const handlePageChange = (page: number) => {
    console.log(`Navigating to page: ${page}`)
  }

  const baseUrl = 
    `/${siteConfig.paginationBaseUrls.base}/${tag?.slug?.current}`;


  return (
    <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          <ContentHub contentCount={contentCount} />
          <TagSelect
            tags={allTags}
            tagLimit={5}
            className="mt-12"
          />
          <AllcontentSection allItemCount={totalPostCount} allContent={posts} />
          <Pagination
            totalPages={totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            enablePageSlug={true}
            content={posts}
            type="custom"
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}
