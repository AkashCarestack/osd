import { GetStaticProps, InferGetStaticPropsType } from 'next'
import {
  getTags,
  getPostsByLimit,
  getPosts,
  postSlugsQuery,
  getArticlesCount,
  getEbooksCount,
  getPodcastsCount,
  getWebinarsCount,
  getHomeSettings,
  getCategories,
  getFooterData,
} from '~/lib/sanity.queries'
import { getClient } from '~/lib/sanity.client'
import siteConfig from 'config/siteConfig'
import Layout from '~/components/Layout'
import AllcontentSection from '~/components/sections/AllcontentSection'
import TagSelect from '~/contentUtils/TagSelector'
import Pagination from '~/components/commonSections/Pagination'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import { useRouter } from 'next/router'
import ContentHub from '~/contentUtils/ContentHub'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = getClient();
  const region = params?.locale as string;
  const pageNumber = params?.number ? parseInt(params.number as string, 10) : 1;

  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5;
  const startLimit = (pageNumber - 1) * cardsPerPage;
  const endLimit = startLimit + cardsPerPage;

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
    getHomeSettings(client, region),
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
  const client = getClient();
  const locales = siteConfig.locales;

  const paths = (await Promise.all(
    locales.map(async (locale) => {
      const slugs = await client.fetch(postSlugsQuery, { locale });
      const numberOfPages = Math.ceil(slugs.length / siteConfig.pagination.childItemsPerPage || 5);
      return Array.from({ length: numberOfPages - 1 }, (_, i) => ({
        params: { number: (i + 2).toString(), locale },
      }));
    })
  )).flat();

  return {
    paths,
    fallback: 'blocking',
  };
};


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
