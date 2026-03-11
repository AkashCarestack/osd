import siteConfig from 'config/siteConfig'
import { GetStaticProps, InferGetStaticPropsType } from 'next'

import Pagination from '~/components/commonSections/Pagination'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import Layout from '~/components/Layout'
import AllcontentSection from '~/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import ContentHub from '~/contentUtils/ContentHub'
import TagSelect from '~/contentUtils/TagSelector'
import { Post, Tag } from '~/interfaces/post'
import { getClient } from '~/lib/sanity.client'
import { getDefaultLocale, getPartnerPaths } from '~/lib/partnerPaths'
import {
  getArticlesCount,
  getCategories,
  getEbooksCount,
  getFooterData,
  getHomeSettings,
  getPodcastsCount,
  getPostsByTag,
  getPostsByTagAndLimit,
  getTag,
  getTags,
  getWebinarsCount,
} from '~/lib/sanity.queries'
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
    footerData: any
  }
> = async ({ params }) => {
  const client = getClient()

  const slug = params?.slug as string
  const region = getDefaultLocale()
  const partnerSlug = params?.partner as string
  if (!partnerSlug) return { notFound: true }
  const pageNumber = parseInt(params?.number as string, 10) || 1

  const tag = await getTag(client, slug)
  const allTags = await getTags(client)

  if (!tag) return { notFound: true }

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
  const homeSettings = await getHomeSettings(client, region, partnerSlug)
  const categories = await getCategories(client)
  const footerData =  await getFooterData(client, region)

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
      footerData,
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
  const basePaths = await getPartnerPaths(client)
  const locale = getDefaultLocale()
  const tags = await getTags(client)
  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5
  const paths: { params: { partner: string; slug: string; number: string } }[] = []
  for (const { params: p } of basePaths) {
    for (const tag of tags) {
      const slug = tag.slug?.current
      if (!slug) continue
      const posts = await getPostsByTag(client, tag._id, locale)
      const totalPages = Math.ceil(posts.length / cardsPerPage)
      for (let i = 2; i <= totalPages; i++) {
        paths.push({
          params: { partner: p.partner, slug, number: i.toString() },
        })
      }
    }
  }
  return { paths, fallback: 'blocking' }
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
  categories,
  footerData
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const handlePageChange = (page: number) => {
    // Page change handler
  }

  const baseUrl = 
    `/${siteConfig.paginationBaseUrls.base}/${tag?.slug?.current}`;


  return (
    <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
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
