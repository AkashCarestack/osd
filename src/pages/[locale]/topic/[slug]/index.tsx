import siteConfig from 'config/siteConfig'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

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
  catsSlugsQuery,
  catsSlugsWithoutAssociatedContentQuery,
  getArticlesCount,
  getCategories,
  getCategory,
  getEbooksCount,
  getFooterData,
  getHomeSettings,
  getPodcastsCount,
  getPostsByCategoryAndLimit,
  getPostsByTag,
  getSiteSettings,
  getTags,
  getWebinarsCount,
} from '~/lib/sanity.queries'
import { slugToCapitalized } from '~/utils/common'
import { defaultMetaTag } from '~/utils/customHead'

interface Query {
  slug: string
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = getClient();
  const slug = params?.slug as string;
  const region = params?.locale as string || 'en';
  
  if (!slug) {
    return {
      notFound: true,
    };
  }

  const categoryPromise = getCategory(client, slug);
  const siteSettingsPromise = getSiteSettings(client);
  const homeSettingsPromise = getHomeSettings(client, region);

  const [category, siteSettings, homeSettings] = await Promise.all([
    categoryPromise,
    siteSettingsPromise,
    homeSettingsPromise,
  ]);
  
  if (!category) {
    return {
      notFound: true,
    };
  }
  
  const cardsPerPage = siteConfig.pagination.childItemsPerPage || 5;

  const [
    categoryPosts,
    allPostsForTag,
    totalPodcasts,
    totalWebinars,
    totalArticles,
    totalEbooks,
    allTags,
    categories,
    footerData
  ] = await Promise.all([
    getPostsByCategoryAndLimit(client, category._id, 0, cardsPerPage, region),
    getPostsByTag(client, category._id, region),
    getPodcastsCount(client, region),
    getWebinarsCount(client, region),
    getArticlesCount(client, region),
    getEbooksCount(client, region),
    getTags(client),
    getCategories(client),
    getFooterData(client, region)
  ]);

  // Filter out categories with no posts for ContentHub
  const allCategoryPosts = await Promise.all(
    categories.map((cat) => getPostsByCategoryAndLimit(client, cat._id, 0, 3, region))
  );
  const categoriesWithPosts = categories.filter((cat, index) => {
    return allCategoryPosts[index] && allCategoryPosts[index].length > 0;
  });

  const totalPages = Math.ceil(allPostsForTag.length / cardsPerPage);

  // Build redirect path if category has associated content (for client-side redirect)
  let redirectPath: string | null = null;
  if (category?.associatedContent && category.associatedContent.length > 0) {
    const firstContent = category.associatedContent[0]
    if (firstContent?.slug?.current) {
      // Build the redirect path with proper locale handling
      const localePath = region === 'en' ? '' : `/${region}`
      redirectPath = `${localePath}/${siteConfig.categoryBaseUrls.base}/${slug}/${firstContent.slug.current}`
    }
  }

  return {
    props: {
      category,
      categories,
      categoriesWithPosts,
      allTags,
      totalPages,
      categoryPosts,
      draftMode: false,
      token: null,
      totalPostCount: allPostsForTag.length,
      contentCount: {
        podcasts: totalPodcasts,
        webinars: totalWebinars,
        articles: totalArticles,
        ebooks: totalEbooks,
      },
      siteSettings,
      homeSettings,
      footerData,
      redirectPath,
    },
  };
};

export const getStaticPaths = async () => {
  const client = getClient()
  const locales = siteConfig.locales

  // Only generate static paths for categories without associatedContent
  // Categories with associatedContent will be generated on-demand (fallback: 'blocking')
  const slugs = await Promise.all(
    locales.map(async (locale) => {
      const data = await client.fetch(catsSlugsWithoutAssociatedContentQuery, { locale });
      return data.map((item: any) => ({
        slug: item.slug,
        locale: item.locale
      }));
    })
  );

  return {
    paths: slugs.flat().map((item: any) => ({
      params: { slug: item.slug, locale: item.locale },
    })),
    fallback: 'blocking', // Allow dynamic generation for new categories and those with associatedContent
  }
}

export default function TagPage({
  category,
  categories,
  categoriesWithPosts,
  categoryPosts,
  allTags,
  totalPages,
  contentCount,
  totalPostCount,
  siteSettings,
  homeSettings,
  footerData,
  redirectPath
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  
  // Handle client-side redirect if category has associated content
  useEffect(() => {
    if (redirectPath) {
      router.replace(redirectPath);
    }
  }, [redirectPath, router]);

  const handlePageChange = (page: number) => {
    console.log(`Navigating to page: ${page}`)
  }
  const baseUrl =
    `/${siteConfig.categoryBaseUrls.base}/${category?.slug?.current}`;
  let siteSettingWithImage = siteSettings && siteSettings?.find((e: any) => e?.openGraphImage);

  if (siteSettingWithImage) {
    siteSettingWithImage.siteTitle = slugToCapitalized(category?.slug?.current);
  }

  // If redirecting, show nothing or a loading state
  if (redirectPath) {
    return null;
  }

  // Default category listing view
  return (
    <GlobalDataProvider data={categoriesWithPosts} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          {siteSettingWithImage ? defaultMetaTag(siteSettingWithImage) : <></>}
          <ContentHub categories={categoriesWithPosts} contentCount={contentCount}   />
          <TagSelect
            tags={allTags}
            tagLimit={5}
            className="mt-12"
          />
          <AllcontentSection  uiType='category' allItemCount={totalPostCount} allContent={categoryPosts} />
          <Pagination
            totalPages={totalPages}
            onPageChange={handlePageChange}
            currentPage={1}
            enablePageSlug={true}
            content={categoryPosts}
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}
