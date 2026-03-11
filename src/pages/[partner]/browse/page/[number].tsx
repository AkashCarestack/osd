import siteConfig from 'config/siteConfig'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
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
import { getDefaultLocale, getPartnerPaths } from '~/lib/partnerPaths'
import {
  getArticlesCount,
  getCategories,
  getEbooksCount,
  getFooterData,
  getHomeSettings,
  getPodcastsCount,
  getPosts,
  getPostsByLimit,
  getTags,
  getWebinarsCount,
  postSlugsQuery,
} from '~/lib/sanity.queries'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = getClient()
  const region = getDefaultLocale()
  const partnerSlug = params?.partner as string
  if (!partnerSlug) return { notFound: true }
  const pageNumber = params?.number ? parseInt(params.number as string, 10) : 1

  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5
  const startLimit = (pageNumber - 1) * cardsPerPage
  const endLimit = startLimit + cardsPerPage

  const [
    posts,
    totalPosts,
    tags,
    totalPodcasts,
    totalWebinars,
    totalArticles,
    totalEbooks,
    homeSettings,
    categories,
    footerData
  ] = await Promise.all([
    getPostsByLimit(client, startLimit, endLimit, undefined, region),
    getPosts(client, undefined, region),
    getTags(client),
    getPodcastsCount(client, region),
    getWebinarsCount(client, region),
    getArticlesCount(client, region),
    getEbooksCount(client, region),
    getHomeSettings(client, region, partnerSlug),
    getCategories(client),
    getFooterData(client, region)
  ]);

  return {
    props: {
      posts,
      tags,
      totalPages: Math.ceil(totalPosts.length / cardsPerPage),
      totalPosts,
      currentPage: pageNumber,
      categories,
      footerData,
      homeSettings,
      contentCount: {
        podcasts: totalPodcasts,
        webinars: totalWebinars,
        articles: totalArticles,
        ebooks: totalEbooks,
      },
    },
  };
};

export const getStaticPaths = async () => {
  const client = getClient()
  const basePaths = await getPartnerPaths(client)
  const locale = getDefaultLocale()
  const slugs = await client.fetch(postSlugsQuery, { locale })
  const numberOfPages = Math.ceil(slugs.length / (siteConfig.pagination.childItemsPerPage || 5))
  const pageNumbers = Array.from({ length: Math.max(0, numberOfPages - 1) }, (_, i) =>
    (i + 2).toString(),
  )
  const paths = basePaths.flatMap((p) =>
    pageNumbers.map((number) => ({
      params: { partner: p.params.partner, number },
    })),
  )
  return { paths, fallback: 'blocking' }
}


export default function TagPagePaginated({
  tags,
  posts,
  totalPages,
  currentPage,
  contentCount,
  totalPosts,
  homeSettings,
  categories,
  footerData
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const totalCount: any = totalPosts?.length ?? 0

  const baseUrl = `/${siteConfig.paginationBaseUrls.base}`;
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
          <ContentHub contentCount={contentCount} />
          <TagSelect
            tags={tags}
            tagLimit={5}
            className="mt-12"
            showTags={true}
          />
          <AllcontentSection allItemCount={totalCount} allContent={posts} />
          <Pagination
            totalPages={totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            enablePageSlug={true}
            content={posts}
            type="customs"
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}
