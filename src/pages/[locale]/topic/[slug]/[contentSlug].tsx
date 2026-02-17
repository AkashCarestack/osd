import siteConfig from 'config/siteConfig'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import SanityPortableText from '~/components/blockEditor/sanityBlockEditor'
import ArticlesInSection from '~/components/commonSections/ArticlesInSection'
import AuthorInfo from '~/components/commonSections/AuthorInfo'
import RelatedTag from '~/components/commonSections/RelatedTag'
import ShareableLinks from '~/components/commonSections/ShareableLinks'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import Layout from '~/components/Layout'
import MainImageSection from '~/components/MainImageSection'
import RelatedFeaturesSection from '~/components/RelatedFeaturesSection'
import Section from '~/components/Section'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import ContentHub from '~/contentUtils/ContentHub'
import { Toc } from '~/contentUtils/sanity-toc'
import SEOHead from '~/layout/SeoHead'
import Wrapper from '~/layout/Wrapper'
import { getClient } from '~/lib/sanity.client'
import { urlForImage } from '~/lib/sanity.image'
import {
  getCategories,
  getCategory,
  getFooterData,
  getHomeSettings,
  getPostBySlugAndRegion,
  getPostsByCategoryAndLimit,
  getTagRelatedContents,
  getTags,
} from '~/lib/sanity.queries'
import { sanitizeUrl, slugToCapitalized } from '~/utils/common'
import { defaultMetaTag } from '~/utils/customHead'
import { formatDateShort } from '~/utils/formateDate'
import { generateFAQJSONLD, generateGlossaryJSONLD, generateJSONLD } from '~/utils/generateJSONLD'

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient()
  const locales = siteConfig.locales

  const paths = await Promise.all(
    locales.map(async (locale) => {
      const categories = await getCategories(client)
      const pathsForLocale = []

      for (const category of categories) {
        // Get category with associated content
        const categoryWithContent = await getCategory(client, category.slug?.current)
        
        if (!categoryWithContent || !category.slug?.current) continue
        
        // Add glossary path if it exists
        if (categoryWithContent?.glossary) {
          pathsForLocale.push({
            params: {
              slug: category.slug.current,
              contentSlug: 'glossary',
              locale: locale,
            },
          })
        }
        
        // Add FAQ path if it exists
        if (categoryWithContent?.faq) {
          pathsForLocale.push({
            params: {
              slug: category.slug.current,
              contentSlug: 'faq',
              locale: locale,
            },
          })
        }
        
        // Add associated content paths
        if (categoryWithContent?.associatedContent && categoryWithContent.associatedContent.length > 0) {
          for (const content of categoryWithContent.associatedContent) {
            // Filter by language/region if content has a language field
            const hasLanguage = content?.language
            const matchesLocale = !hasLanguage || content.language === locale
            
            // Check for slug - handle both slug.current and slug formats
            const contentSlug = content?.slug?.current || content?.slug
            
            if (matchesLocale && contentSlug && category.slug?.current) {
              pathsForLocale.push({
                params: {
                  slug: category.slug.current,
                  contentSlug: typeof contentSlug === 'string' ? contentSlug : contentSlug.current || contentSlug,
                  locale: locale,
                },
              })
            }
          }
        }
      }

      return pathsForLocale
    })
  )

  return {
    paths: paths.flat(),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = getClient()
  const categorySlug = params?.slug as string
  const contentSlug = params?.contentSlug as string
  const region = params?.locale as string || 'en'

  if (!categorySlug || !contentSlug) {
    return {
      notFound: true,
    }
  }

  const category = await getCategory(client, categorySlug)
  
  if (!category) {
    return {
      notFound: true,
    }
  }

  // Handle glossary and FAQ routes
  const isGlossary = contentSlug === 'glossary'
  const isFAQ = contentSlug === 'faq'
  
  let content = null
  if (!isGlossary && !isFAQ) {
    content = await getPostBySlugAndRegion(client, contentSlug, region)
    
    if (!content) {
      return {
        notFound: true,
      }
    }

    // Verify that the content is associated with this category
    const isAssociated = category?.associatedContent?.some(
      (item: any) => item?.slug?.current === contentSlug
    )

    if (!isAssociated) {
      return {
        notFound: true,
      }
    }
  } else {
    // For glossary/FAQ, verify they exist in the category
    if (isGlossary && !category?.glossary) {
      return {
        notFound: true,
      }
    }
    if (isFAQ && !category?.faq) {
      return {
        notFound: true,
      }
    }
  }

  const [
    categories,
    tags,
    homeSettings,
    footerData,
  ] = await Promise.all([
    getCategories(client),
    getTags(client),
    getHomeSettings(client, region),
    getFooterData(client, region),
  ])

  // Get posts for all categories to filter categoriesWithPosts correctly
  const allCategoryPosts = await Promise.all(
    categories.map((cat) => getPostsByCategoryAndLimit(client, cat._id, 0, 3, region))
  )
  
  // Filter categories to show those with either associatedContent OR posts from getPostsByCategoryAndLimit
  // Also filter associatedContent by region if it has a language field
  const categoriesWithPosts = categories
    .map((cat, index) => {
      // Filter associatedContent by region if it exists
      let filteredAssociatedContent = cat?.associatedContent;
      if (filteredAssociatedContent && Array.isArray(filteredAssociatedContent)) {
        filteredAssociatedContent = filteredAssociatedContent.filter(
          (content: any) => !content.language || content.language === region
        );
      }
      
      const hasAssociatedContent = filteredAssociatedContent && filteredAssociatedContent.length > 0;
      const hasPosts = allCategoryPosts[index] && allCategoryPosts[index].length > 0;
      
      // Return category with filtered associatedContent if it has content
      if (hasAssociatedContent || hasPosts) {
        return {
          ...cat,
          associatedContent: filteredAssociatedContent || cat.associatedContent
        };
      }
      return null;
    })
    .filter(Boolean); // Remove null entries
  
  // Ensure current category is always included (it should have at least the current content)
  const currentCategoryInList = categoriesWithPosts.some(cat => cat._id === category._id)
  if (!currentCategoryInList && category) {
    // Filter associatedContent for current category by region
    let filteredAssociatedContent = category?.associatedContent;
    if (filteredAssociatedContent && Array.isArray(filteredAssociatedContent)) {
      filteredAssociatedContent = filteredAssociatedContent.filter(
        (content: any) => !content.language || content.language === region
      );
    }
    categoriesWithPosts.push({
      ...category,
      associatedContent: filteredAssociatedContent || category.associatedContent
    })
  }

  // Get related content
  const tagIds = content?.tags?.map((tag: any) => tag?._id) || []
  const relatedContents = tagIds.length > 0
    ? await getTagRelatedContents(
        client,
        contentSlug,
        tagIds,
        content.contentType,
        undefined,
        region
      )
    : []

  return {
    props: {
      category,
      content,
      categories,
      categoriesWithPosts,
      tags,
      relatedContents,
      homeSettings,
      footerData,
    },
  }
}

export default function TopicContentPage({
  category,
  content,
  categories,
  categoriesWithPosts,
  tags,
  relatedContents,
  homeSettings,
  footerData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const locale = router.query.locale as string || 'en'
  const baseUrl = `/${siteConfig.categoryBaseUrls.base}/${category?.slug?.current}`
  const currentContentSlug = content?.slug?.current || (router.query.contentSlug as string)
  const isGlossary = currentContentSlug === 'glossary'
  const isFAQ = currentContentSlug === 'faq'

  // If it's glossary or FAQ, content might be null, which is fine
  if (!isGlossary && !isFAQ && !content) {
    return null
  }

  /**
   * SEO Configuration for FAQ, Glossary, and Content Pages
   * 
   * This section sets up structured data (JSON-LD) and meta tags for SEO:
   * 
   * 1. FAQ Pages:
   *    - Uses FAQPage schema (https://schema.org/FAQPage)
   *    - Formats FAQ data from category.faq.faqs array
   *    - Each FAQ item must have 'question' and 'answer' properties
   *    - Enables rich snippets in Google search results
   * 
   * 2. Glossary Pages:
   *    - Uses ItemList schema with DefinedTerm items
   *    - Formats glossary terms from category.glossary.terms array
   *    - Each term must have 'term' and 'value' properties
   *    - Helps search engines understand glossary structure
   * 
   * 3. Regular Content Pages:
   *    - Uses standard content schemas (Article, BlogPosting, etc.)
   *    - Based on content.contentType field
   * 
   * The JSON-LD is injected via SEOHead component which renders:
   * <script type="application/ld+json">{jsonLD}</script>
   * 
   * Canonical URLs are constructed with locale support:
   * - English (en): /topic/{category-slug}/{content-slug}
   * - Other locales: /{locale}/topic/{category-slug}/{content-slug}
   */
  const prodUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://osdental.io'
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  const pageUrl = sanitizeUrl(`${prodUrl}${localePrefix}${baseUrl}/${currentContentSlug}`)
  
  // Generate JSON-LD schema based on page type
  let jsonLD = '{}'
  let seoTitle = ''
  let seoDescription = ''
  let seoKeywords = ''
  let seoRobots = 'index, follow, archive'
  let ogImage = undefined

  if (isGlossary && category?.glossary) {
    // Glossary SEO and JSON-LD
    // Data format: category.glossary.terms = [{ term: "Term", value: "Definition" }, ...]
    jsonLD = generateGlossaryJSONLD(category.glossary, pageUrl)
    seoTitle = category.glossary.mainHeading 
      ? `${category.glossary.mainHeading} - ${category.categoryName} - OS Dental`
      : `${category.categoryName} Glossary - OS Dental`
    seoDescription = category.glossary.subheading || 
      `Glossary of terms for ${category.categoryName} - OS Dental`
    seoKeywords = `${category.categoryName}, glossary, definitions, OS Dental`
  } else if (isFAQ && category?.faq) {
    // FAQ SEO and JSON-LD
    // Data format: category.faq.faqs = [{ question: "Q?", answer: "A" }, ...]
    jsonLD = generateFAQJSONLD(category.faq, pageUrl)
    seoTitle = category.faq.name 
      ? `${category.faq.name} - ${category.categoryName} - OS Dental`
      : `${category.categoryName} FAQ - OS Dental`
    seoDescription = `Frequently asked questions about ${category.categoryName} - OS Dental`
    seoKeywords = `${category.categoryName}, FAQ, frequently asked questions, OS Dental`
  } else if (content) {
    // Regular content SEO and JSON-LD
    jsonLD = generateJSONLD(content)
    seoTitle = content?.seoTitle || content?.title || 'Article - OS Dental'
    seoDescription = (content?.seoDescription && !content.seoDescription.includes('Test titlw'))
      ? content.seoDescription
      : content?.excerpt || ''
    seoKeywords = content?.seoKeywords || ''
    seoRobots = content?.seoRobots || 'index, follow, archive'
    ogImage = content?.mainImage?._id ? urlForImage(content.mainImage._id) : undefined
  }

  return (
    <GlobalDataProvider
      data={categoriesWithPosts}
      featuredTags={homeSettings?.featuredTags}
      footerData={footerData}
    >
      <BaseUrlProvider baseUrl={baseUrl}>
        <SEOHead
          title={seoTitle}
          description={seoDescription}
          keywords={seoKeywords}
          robots={seoRobots}
          canonical={pageUrl}
          jsonLD={jsonLD}
          props={content ? { contentType: content?.contentType } : undefined}
          ogImage={ogImage}
        />
        <Layout>
          {/* <ContentHub
            categories={categoriesWithPosts}
            contentCount={{}}
          /> */}
          <MainImageSection 
            enableDate={false} 
            post={isGlossary || isFAQ ? { title: isGlossary ? category?.glossary?.mainHeading : category?.faq?.name } : content} 
            categoryName={category?.categoryName} 
            categoryDescription={category?.categoryDescription} 
            revamp={true} 
          />
          <Section className="justify-center">
            <Wrapper className={`flex-col`}>
              <div className="flex md:flex-row flex-col-reverse gap-6 md:gap-12 justify-between">
                {/* Left Sidebar - Articles in Section (if associatedContent) OR TOC (if no associatedContent), Share */}
                <div className="flex flex-col gap-8 md:mt-12 relative md:w-1/3 md:max-w-[410px] w-full">
                  <div className="sticky top-24 flex flex-col gap-8 md:overflow-auto">
                    {/* Show Articles in Section if category has associated content, glossary, or FAQ, otherwise show TOC */}
                    {(category?.associatedContent && category.associatedContent.length > 0) || category?.glossary || category?.faq ? (
                      <ArticlesInSection
                        associatedContent={category.associatedContent || []}
                        categorySlug={category?.slug?.current}
                        currentContentSlug={currentContentSlug}
                        glossary={category?.glossary}
                        faq={category?.faq}
                      />
                    ) : (
                      content?.headings && (
                        <Toc headings={content?.headings} title="Contents" />
                      )
                    )}
                    <ShareableLinks props={
                      isGlossary 
                        ? category?.glossary?.mainHeading 
                        : isFAQ 
                        ? category?.faq?.name 
                        : content?.title
                    } />
                  </div>
                </div>
                {/* Main Content Area - Body */}
                <div className="md:mt-12 flex-1 flex flex-col gap-8 md:w-2/3 w-full md:max-w-[710px]">
                  {/* Render Glossary */}
                  {isGlossary && category?.glossary ? (
                    <>
                      <h1 className="text-zinc-900 font-manrope leading-tight lg:text-4xl text-2xl font-bold">
                        {category.glossary.mainHeading || 'Glossary'}
                      </h1>
                      {category.glossary.subheading && (
                        <p className="text-zinc-600 text-base leading-relaxed">
                          {category.glossary.subheading}
                        </p>
                      )}
                      {category.glossary.terms && category.glossary.terms.length > 0 && (
                        <div className="flex flex-col gap-6 w-full">
                          {category.glossary.terms.map((termItem: any, index: number) => (
                            <div key={index} className="border-b border-zinc-200 pb-6 last:border-b-0">
                              <h3 className="text-zinc-900 font-semibold text-lg mb-2">
                                {termItem.term}
                              </h3>
                              <p className="text-zinc-600 text-base leading-relaxed">
                                {termItem.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : isFAQ && category?.faq ? (
                    <>
                      <h1 className="text-zinc-900 font-manrope leading-tight lg:text-4xl text-2xl font-bold">
                        {category.faq.name || 'Frequently Asked Questions'}
                      </h1>
                      {category.faq.author && category.faq.author.length > 0 && (
                        <AuthorInfo author={category.faq.author} />
                      )}
                      {category.faq.faqs && category.faq.faqs.length > 0 && (
                        <div className="flex flex-col gap-4 w-full">
                          {category.faq.faqs.map((faqItem: any, index: number) => (
                            <div key={index} className="border border-zinc-200 rounded-lg p-6">
                              <h3 className="text-zinc-900 font-semibold text-lg mb-3">
                                {faqItem.question}
                              </h3>
                              <p className="text-zinc-600 text-base leading-relaxed whitespace-pre-wrap">
                                {faqItem.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Article Title */}
                      <h1 className="text-zinc-900 font-manrope leading-tight lg:text-4xl text-2xl font-bold">
                        {content?.title || 'Article Title'}
                      </h1>
                      {content?.date && (
                        <div className="flex items-center gap-2 text-zinc-600 text-sm font-medium">
                          <span>{formatDateShort(content.date)}</span>
                          {content?.estimatedReadingTime && (
                            <>
                              <span className="text-zinc-400">•</span>
                              <span>{content.estimatedReadingTime} min read</span>
                            </>
                          )}
                        </div>
                      )}
                      {content?.author && content.author.length > 0 && (
                        <AuthorInfo author={content?.author} />
                      )}
                      <div className="post__content w-full">
                        <SanityPortableText
                          content={content?.body}
                          draftMode={false}
                          token={null}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              {!isGlossary && !isFAQ && content?.tags && content.tags.length > 0 && (
                <RelatedTag tags={content?.tags} />
              )}
            </Wrapper>
          </Section>
          {!isGlossary && !isFAQ && relatedContents && relatedContents.length > 0 && (
            <RelatedFeaturesSection
              contentType={content?.contentType}
              allPosts={relatedContents}
            />
          )}
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}
