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
  getCategory,
} from '~/lib/sanity.queries'
import { getClient } from '~/lib/sanity.client'
import siteConfig from 'config/siteConfig'
import { Post, Tag } from '~/interfaces/post'
import Layout from '~/components/Layout'
import AllcontentSection from '~/components/sections/AllcontentSection'
import TagSelect from '~/contentUtils/TagSelector'
import Wrapper from '~/layout/Wrapper'
import Pagination from '~/components/commonSections/Pagination'
import ContentHub from '~/contentUtils/ContentHub'
import { useRef } from 'react'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { SharedPageProps } from '~/pages/_app'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = getClient();
  const slug = params?.slug as string;
  const region = params?.locale as string;
  const pageNumber = parseInt(params?.number as string, 10) || 1;

  const [tag, category, allTags] = await Promise.all([
    getTag(client, slug),
    getCategory(client, slug),
    getTags(client)
  ]);

  if (!tag) {
    return {
      notFound: true,
    };
  }

  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5;
  const startLimit = (pageNumber - 1) * cardsPerPage;
  const endLimit = startLimit + cardsPerPage;

  const [posts, allPostsForTag, totalPodcasts, totalWebinars, totalArticles, totalEbooks, homeSettings, categories] = await Promise.all([
    getPostsByTagAndLimit(client, category._id, startLimit, endLimit, region),
    getPostsByTag(client, category._id, region),
    getPodcastsCount(client, region),
    getWebinarsCount(client, region),
    getArticlesCount(client, region),
    getEbooksCount(client, region),
    getHomeSettings(client, region),
    getCategories(client)
  ]);

  return {
    props: {
      tag,
      allTags,
      totalPages: Math.ceil(allPostsForTag.length / cardsPerPage),
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
  };
};

export const getStaticPaths = async () => {
  const client = getClient();
  const locales = siteConfig.locales;
  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5;

  const categories = await getCategories(client);

  const paths = (await Promise.all(
    locales.map(async (locale) => {
      return (await Promise.all(
        categories.map(async (cat) => {
          const posts = await getPostsByTag(client, cat._id, locale);
          const totalPages = Math.ceil(posts.length / cardsPerPage);
          return Array.from({ length: totalPages - 1 }, (_, i) => ({
            params: { locale, slug: cat.slug.current, number: (i + 2).toString() },
          }));
        })
      )).flat();
    })
  )).flat();

  return {
    paths,
    fallback: false, 
  };
};


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
    `/${siteConfig.categoryBaseUrls.base}/${tag?.slug?.current}`;


  return (
    <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
        <ContentHub categories={categories} contentCount={contentCount}   />
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
