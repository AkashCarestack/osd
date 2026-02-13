import siteConfig from 'config/siteConfig'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import SanityPortableText from '~/components/blockEditor/sanityBlockEditor'
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
import Wrapper from '~/layout/Wrapper'
import { getClient } from '~/lib/sanity.client'
import {
  getCategory,
  getCategories,
  getFooterData,
  getHomeSettings,
  getPostBySlugAndRegion,
  getPostsByCategoryAndLimit,
  getTagRelatedContents,
  getTags,
} from '~/lib/sanity.queries'
import { slugToCapitalized } from '~/utils/common'
import { defaultMetaTag } from '~/utils/customHead'

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
        
        if (categoryWithContent?.associatedContent && categoryWithContent.associatedContent.length > 0) {
          for (const content of categoryWithContent.associatedContent) {
            if (content?.slug?.current) {
              pathsForLocale.push({
                params: {
                  slug: category.slug?.current,
                  contentSlug: content.slug.current,
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

  const [category, content] = await Promise.all([
    getCategory(client, categorySlug),
    getPostBySlugAndRegion(client, contentSlug, region),
  ])

  if (!category || !content) {
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
  let categoriesWithPosts = categories.filter((cat, index) => {
    return allCategoryPosts[index] && allCategoryPosts[index].length > 0
  })
  
  // Ensure current category is always included (it should have at least the current content)
  const currentCategoryInList = categoriesWithPosts.some(cat => cat._id === category._id)
  if (!currentCategoryInList && category) {
    categoriesWithPosts.push(category)
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
  const baseUrl = `/${siteConfig.categoryBaseUrls.base}/${category?.slug?.current}`

  if (!content) {
    return null
  }

  return (
    <GlobalDataProvider
      data={categoriesWithPosts}
      featuredTags={homeSettings?.featuredTags}
      footerData={footerData}
    >
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          {/* <ContentHub
            categories={categoriesWithPosts}
            contentCount={{}}
          /> */}
          <MainImageSection enableDate={true} post={content} />
          <Section className="justify-center">
            <Wrapper className={`flex-col`}>
              <div className="flex md:flex-row flex-col-reverse gap-6 md:gap-12 justify-between">
                <div className="md:mt-12 flex-1 flex md:flex-col flex-col-reverse md:w-2/3 w-full md:max-w-[710px]">
                  <div className="post__content w-full">
                    <SanityPortableText
                      content={content?.body}
                      draftMode={false}
                      token={null}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8 md:mt-12 bg-red relative md:w-1/3 md:max-w-[410px] w-full">
                  <div className="sticky top-24 flex flex-col-reverse md:flex-col gap-8 md:overflow-auto">
                    {content?.headings && (
                      <Toc headings={content?.headings} title="Contents" />
                    )}
                    <div className="flex-col gap-8 flex">
                      {content?.author && content.author.length > 0 && (
                        <div>
                          <AuthorInfo author={content?.author} />
                        </div>
                      )}
                      <ShareableLinks props={content?.title} />
                    </div>
                  </div>
                </div>
              </div>
              {content?.tags && content.tags.length > 0 && (
                <RelatedTag tags={content?.tags} />
              )}
            </Wrapper>
          </Section>
          {relatedContents && relatedContents.length > 0 && (
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
