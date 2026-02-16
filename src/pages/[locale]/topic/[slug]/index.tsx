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
import { getClient } from '~/lib/sanity.client'
import {
  catsSlugsQuery,
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
    categoryPostsFromRefs,
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

  // Combine posts from category references AND associatedContent
  // Filter associatedContent by region if it has a language field
  let associatedContentPosts = [];
  if (category?.associatedContent && Array.isArray(category.associatedContent)) {
    associatedContentPosts = category.associatedContent
      .filter((content: any) => {
        // Filter by language if it exists
        const matchesLanguage = !content.language || content.language === region;
        // Ensure content has a slug
        const hasSlug = content?.slug?.current || content?.slug;
        return matchesLanguage && hasSlug;
      })
      .map((content: any) => {
        // Ensure slug is properly structured
        const contentSlug = content?.slug?.current || content?.slug;
        return {
          ...content,
          slug: content.slug?.current ? content.slug : { current: contentSlug },
          category: {
            _id: category._id,
            categoryName: category.categoryName,
            categoryDescription: category.categoryDescription,
            slug: category.slug,
          }
        };
      });
  }

  // Merge posts from both sources, removing duplicates by _id
  const allCategoryPostsMap = new Map();
  
  // Add posts from category references (add category info if not present)
  if (categoryPostsFromRefs && Array.isArray(categoryPostsFromRefs)) {
    categoryPostsFromRefs.forEach((post: any) => {
      if (post?._id) {
        // Ensure slug is properly structured
        const postSlug = post?.slug?.current || post?.slug;
        const postWithCategory = {
          ...post,
          slug: post.slug?.current ? post.slug : (postSlug ? { current: postSlug } : post.slug),
          category: post.category || {
            _id: category._id,
            categoryName: category.categoryName,
            categoryDescription: category.categoryDescription,
            slug: category.slug,
          }
        };
        allCategoryPostsMap.set(post._id, postWithCategory);
      }
    });
  }
  
  // Add posts from associatedContent
  associatedContentPosts.forEach((post: any) => {
    if (post?._id) {
      allCategoryPostsMap.set(post._id, post);
    }
  });

  // Convert back to array and sort by date
  const categoryPosts = Array.from(allCategoryPostsMap.values())
    .sort((a: any, b: any) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA; // Descending order
    })
    .slice(0, cardsPerPage);

  // Calculate total count including both sources
  // Combine allPostsForTag (from category references) with associatedContent
  const allPostsForCategorySet = new Set();
  
  // Add posts from category references (allPostsForTag)
  if (allPostsForTag && Array.isArray(allPostsForTag)) {
    allPostsForTag.forEach((post: any) => {
      if (post?._id) {
        allPostsForCategorySet.add(post._id);
      }
    });
  }
  
  // Add posts from associatedContent
  associatedContentPosts.forEach((post: any) => {
    if (post?._id) {
      allPostsForCategorySet.add(post._id);
    }
  });
  
  const totalPostCount = allPostsForCategorySet.size;
  const totalPages = Math.ceil(totalPostCount / cardsPerPage);

  // Get posts for all categories to determine which have content
  const allCategoryPosts = await Promise.all(
    categories.map((cat) => getPostsByCategoryAndLimit(client, cat._id, 0, 3, region))
  );
  
  // For ContentHub, show ALL categories (not just those with posts)
  // This allows users to see and navigate to all categories
  const categoriesForContentHub = categories || [];
  
  // For other uses, filter categories with posts (but always include current category)
  const categoriesWithPosts = categories.filter((cat, index) => {
    const hasPosts = allCategoryPosts[index] && allCategoryPosts[index].length > 0;
    const isCurrentCategory = cat._id === category._id;
    // Also check if category has associatedContent
    const hasAssociatedContent = cat?.associatedContent && Array.isArray(cat.associatedContent) && cat.associatedContent.length > 0;
    return hasPosts || isCurrentCategory || hasAssociatedContent; // Always include current category
  });

  return {
    props: {
      category,
      categories,
      categoriesForContentHub,
      categoriesWithPosts,
      allTags,
      totalPages,
      categoryPosts,
      draftMode: false,
      token: null,
      totalPostCount: totalPostCount,
      contentCount: {
        podcasts: totalPodcasts,
        webinars: totalWebinars,
        articles: totalArticles,
        ebooks: totalEbooks,
      },
      siteSettings,
      homeSettings,
      footerData,
    },
  };
};

export const getStaticPaths = async () => {
  const client = getClient()
  const locales = siteConfig.locales

  // Generate static paths for all categories
  const slugs = await Promise.all(
    locales.map(async (locale) => {
      const data = await client.fetch(catsSlugsQuery, { locale });
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
    fallback: 'blocking', // Allow dynamic generation for new categories
  }
}

export default function TagPage({
  category,
  categories,
  categoriesForContentHub,
  categoriesWithPosts,
  categoryPosts,
  allTags,
  totalPages,
  contentCount,
  totalPostCount,
  siteSettings,
  homeSettings,
  footerData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const handlePageChange = (page: number) => {
    // Page change handler
  }
  const baseUrl =
    `/${siteConfig.categoryBaseUrls.base}/${category?.slug?.current}`;
  let siteSettingWithImage = siteSettings && siteSettings?.find((e: any) => e?.openGraphImage);

  if (siteSettingWithImage) {
    siteSettingWithImage.siteTitle = slugToCapitalized(category?.slug?.current);
  }

  // Default category listing view
  return (
    <GlobalDataProvider data={categoriesWithPosts} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          {siteSettingWithImage ? defaultMetaTag(siteSettingWithImage) : <></>}
          <ContentHub categories={categoriesForContentHub} contentCount={contentCount}   />
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
