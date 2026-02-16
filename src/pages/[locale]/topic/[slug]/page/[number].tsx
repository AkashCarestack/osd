import siteConfig from 'config/siteConfig'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRef } from 'react'

import Pagination from '~/components/commonSections/Pagination'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import Layout from '~/components/Layout'
import AllcontentSection from '~/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import ContentHub from '~/contentUtils/ContentHub'
import TagSelect from '~/contentUtils/TagSelector'
import { Post, Tag } from '~/interfaces/post'
import Wrapper from '~/layout/Wrapper'
import { getClient } from '~/lib/sanity.client'
import {
  getArticlesCount,
  getCategories,
  getCategory,
  getEbooksCount,
  getFooterData,
  getHomeSettings,
  getPodcastsCount,
  getPostsByTag,
  getPostsByTagAndLimit,
  getSiteSettings,
  getTag,
  getTags,
  getWebinarsCount,
} from '~/lib/sanity.queries'
import { SharedPageProps } from '~/pages/_app'
import SEOHead from '~/layout/SeoHead'
import { urlForImage } from '~/lib/sanity.image'
import { sanitizeUrl } from '~/utils/common'

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

  if (!category) {
    return {
      notFound: true,
    };
  }

  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5;
  const startLimit = (pageNumber - 1) * cardsPerPage;
  const endLimit = startLimit + cardsPerPage;

  const [posts, allPostsForTag, totalPodcasts, totalWebinars, totalArticles, totalEbooks, homeSettings, categories, footerData, siteSettings] = await Promise.all([
    getPostsByTagAndLimit(client, category._id, startLimit, endLimit, region),
    getPostsByTag(client, category._id, region),
    getPodcastsCount(client, region),
    getWebinarsCount(client, region),
    getArticlesCount(client, region),
    getEbooksCount(client, region),
    getHomeSettings(client, region),
    getCategories(client),
    getFooterData(client, region),
    getSiteSettings(client)
  ]);

  return {
    props: {
      tag: category,
      allTags,
      totalPages: Math.ceil(allPostsForTag.length / cardsPerPage),
      totalPostCount: allPostsForTag.length,
      posts,
      currentPage: pageNumber,
      draftMode: false,
      token: null,
      homeSettings,
      categories,
      footerData,
      siteSettings,
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
    fallback: 'blocking', // Allow dynamic generation for categories that exist but weren't pre-generated
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
  categories,
  footerData,
  siteSettings,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const handlePageChange = (page: number) => {
    // Page change handler
  }

  const baseUrl = 
    `/${siteConfig.categoryBaseUrls.base}/${tag?.slug?.current}`;

  // SEO Configuration
  const prodUrl = 'https://osdental.io'
  const pageUrl = sanitizeUrl(`${prodUrl}${baseUrl}${currentPage > 1 ? `/page/${currentPage}` : ''}`)
  const seoTitle = tag?.categoryName ? `${tag.categoryName} - OS Dental Resources` : 'OS Dental Resources'
  const seoDescription = tag?.categoryDescription || `Explore ${tag?.categoryName || 'our'} content and resources on OS Dental`
  const seoKeywords = tag?.categoryName ? `${tag.categoryName}, OS Dental, resources, content` : 'OS Dental, resources, content'
  const siteSettingWithImage = siteSettings?.find((e: any) => e?.openGraphImage)

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        robots="index,follow"
        canonical={pageUrl}
        ogImage={siteSettingWithImage?.openGraphImage ? urlForImage(siteSettingWithImage.openGraphImage.asset._ref) : undefined}
        jsonLD=""
      />
      <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
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
    </>
  )
}
