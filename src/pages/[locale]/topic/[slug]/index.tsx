import siteConfig from 'config/siteConfig'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import SanityPortableText from '~/components/blockEditor/sanityBlockEditor'
import AuthorInfo from '~/components/commonSections/AuthorInfo'
import RelatedTag from '~/components/commonSections/RelatedTag'
import ShareableLinks from '~/components/commonSections/ShareableLinks'
import Pagination from '~/components/commonSections/Pagination'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import Layout from '~/components/Layout'
import MainImageSection from '~/components/MainImageSection'
import RelatedFeaturesSection from '~/components/RelatedFeaturesSection'
import Section from '~/components/Section'
import AllcontentSection from '~/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import ContentHub from '~/contentUtils/ContentHub'
import TagSelect from '~/contentUtils/TagSelector'
import { Toc } from '~/contentUtils/sanity-toc'
import Wrapper from '~/layout/Wrapper'
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
  getPostBySlugAndRegion,
  getPostsByCategoryAndLimit,
  getPostsByTag,
  getSiteSettings,
  getTags,
  getTagRelatedContents,
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
    },
  };
};

export const getStaticPaths = async () => {
  const client = getClient()
  const locales = siteConfig.locales

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
  categoriesWithPosts,
  categoryPosts,
  allTags,
  totalPages,
  contentCount,
  totalPostCount,
  siteSettings,
  homeSettings,
  footerData
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)
  const [relatedContents, setRelatedContents] = useState<any[]>([])
  const [relatedLoading, setRelatedLoading] = useState(false)

  const handlePageChange = (page: number) => {
    console.log(`Navigating to page: ${page}`)
  }
  const baseUrl =
    `/${siteConfig.categoryBaseUrls.base}/${category?.slug?.current}`;
  let siteSettingWithImage = siteSettings && siteSettings?.find((e: any) => e?.openGraphImage);

  if (siteSettingWithImage) {
    siteSettingWithImage.siteTitle = slugToCapitalized(category?.slug?.current);
  }

  // Handle query params and associated content
  useEffect(() => {
    const fetchSelectedPost = async () => {
      if (!router.isReady) return

      // Get the first query param that's not locale or slug
      // The query param key is the slug itself (e.g., ?de0-year)
      const queryKeys = Object.keys(router.query).filter(key => key !== 'locale' && key !== 'slug')
      const querySlug = queryKeys.length > 0 ? queryKeys[0] : null
      const region = router.query.locale as string || 'en'
      
      // If there's a query param, fetch that post
      if (querySlug && typeof querySlug === 'string') {
        setLoading(true)
        try {
          const client = getClient()
          const post = await getPostBySlugAndRegion(client, querySlug, region)
          if (post) {
            setSelectedPost(post)
          }
        } catch (error) {
          console.error('Error fetching post:', error)
        } finally {
          setLoading(false)
        }
      } 
      // If no query param but associated content exists, auto-select first and redirect
      else if (category?.associatedContent && category.associatedContent.length > 0 && !hasRedirected) {
        const firstContent = category.associatedContent[0]
        if (firstContent?.slug?.current) {
          setHasRedirected(true)
          const currentPath = router.asPath.split('?')[0]
          router.replace(`${currentPath}?${firstContent.slug.current}`, undefined, { shallow: true })
        }
      }
    }

    fetchSelectedPost()
  }, [router.isReady, router.query, category?.associatedContent, hasRedirected])

  // Fetch related content when a post is selected
  useEffect(() => {
    const fetchRelated = async () => {
      if (!selectedPost) {
        setRelatedContents([])
        return
      }

      const tagIds = selectedPost?.tags?.map((tag: any) => tag?._id) || []
      
      if (tagIds.length > 0) {
        setRelatedLoading(true)
        try {
          const client = getClient()
          const related = await getTagRelatedContents(
            client,
            selectedPost.slug.current,
            tagIds,
            selectedPost.contentType,
            undefined,
            router.query.locale as string || 'en'
          )
          setRelatedContents(related || [])
        } catch (error) {
          console.error('Error fetching related content:', error)
        } finally {
          setRelatedLoading(false)
        }
      } else {
        setRelatedContents([])
      }
    }
    fetchRelated()
  }, [selectedPost, router.query.locale])

  // If a post is selected, show the article view
  if (selectedPost) {

    const seoTitle = selectedPost?.seoTitle || selectedPost?.title || 'Article'
    const seoDescription = selectedPost?.seoDescription || selectedPost?.excerpt || ''

    return (
      <GlobalDataProvider data={categoriesWithPosts} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
        <BaseUrlProvider baseUrl={baseUrl}>
          <Layout>
            <MainImageSection enableDate={true} post={selectedPost} />
            <Section className="justify-center">
              <Wrapper className={`flex-col`}>
              <div className="flex md:flex-row flex-col-reverse gap-6 md:gap-12 justify-between">
                <div className="md:mt-12 flex-1 flex md:flex-col flex-col-reverse md:w-2/3 w-full md:max-w-[710px] ">
                  <div className="post__content w-full ">
                    <SanityPortableText
                      content={selectedPost?.body}
                      draftMode={false}
                      token={null}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8 md:mt-12 bg-red relative md:w-1/3 md:max-w-[410px] w-full">
                  <div className="sticky top-24 flex flex-col-reverse md:flex-col gap-8 md:overflow-auto">
                    {selectedPost?.headings && <Toc headings={selectedPost?.headings} title="Contents" />}
                    <div className='flex-col gap-8 flex'>
                      {selectedPost?.author && selectedPost.author.length > 0 && (
                        <div>
                          <AuthorInfo author={selectedPost?.author} />
                        </div>
                      )}
                      <ShareableLinks props={selectedPost?.title} />
                    </div>
                  </div>
                </div>
              </div>
              {selectedPost?.tags && selectedPost.tags.length > 0 && <RelatedTag tags={selectedPost?.tags}/>}
              </Wrapper>
            </Section>
            {relatedContents && relatedContents.length > 0 && (
              <RelatedFeaturesSection
                contentType={selectedPost?.contentType}
                allPosts={relatedContents}
              />
            )}
            <BannerSubscribeSection />
          </Layout>
        </BaseUrlProvider>
      </GlobalDataProvider>
    )
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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-zinc-500">Loading...</div>
            </div>
          ) : (
            <>
              <AllcontentSection  uiType='category' allItemCount={totalPostCount} allContent={categoryPosts} />
              <Pagination
                totalPages={totalPages}
                onPageChange={handlePageChange}
                currentPage={1}
                enablePageSlug={true}
                content={categoryPosts}
              />
            </>
          )}
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}
