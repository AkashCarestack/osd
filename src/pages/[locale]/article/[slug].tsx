import siteConfig from 'config/siteConfig'
import { GetStaticPaths,GetStaticProps } from 'next'
import { useRouter } from 'next/router'

import SanityPortableText from '~/components/blockEditor/sanityBlockEditor'
import AuthorInfo from '~/components/commonSections/AuthorInfo'
import RelatedTag from '~/components/commonSections/RelatedTag'
import ShareableLinks from '~/components/commonSections/ShareableLinks'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import Layout from '~/components/Layout'
import MainImageSection from '~/components/MainImageSection'
import RelatedFeaturesSection from '~/components/RelatedFeaturesSection'
import Section from '~/components/Section'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import { Toc } from '~/contentUtils/sanity-toc'
import { Articles } from '~/interfaces/post'
import SEOHead from '~/layout/SeoHead'
import Wrapper from '~/layout/Wrapper'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { urlForImage } from '~/lib/sanity.image'
import {
  articleSlugsQuery,
  getArticle,
  getArticles,
  getCategories,
  getFooterData,
  getHomeSettings,
  getTagRelatedContents,
  getTags,
} from '~/lib/sanity.queries'
import { sanitizeUrl } from '~/utils/common'
import { CustomHead, generateMetaData } from '~/utils/customHead'
import { generateJSONLD } from '~/utils/generateJSONLD'

interface Props {
  articles: Articles
  draftMode: boolean
  token: string
  relatedContents: any
  tags: any
  homeSettings: any
  categories: any
  footerData: any
}


export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient()
  const locales = siteConfig.locales
  const slugs = await Promise.all(
    locales.map(async (locale) => {
      const data = await client.fetch(articleSlugsQuery, { locale });
      return data as string[]; 
    })
  );

  const paths = slugs.flat().map((item:any) => ({
    params: { slug:item.slug, locale:item.locale },
  }));

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({
  draftMode = false,
  params = {},
}) => {
  const client = getClient(draftMode ? { token: readToken } : undefined) 
  const region = params.locale as string
  const articles = await getArticle(client, params.slug as string, region);
  
  if (!articles) {
    return {
      notFound: true, 
    };
  }
  const tagIds = articles?.tags?.map((tag: any) => tag?._id) || []
  const relatedContents = await getTagRelatedContents(
    client,
    params.slug as string,
    tagIds,
    articles.contentType,
    undefined,
    region
  )
  const tags = await getTags(client)
  const homeSettings = await getHomeSettings(client,region)
  const categories = await getCategories(client)
  const footerData = await getFooterData(client, region)


  

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      articles,
      relatedContents,
      tags,
      homeSettings,
      categories,
      footerData
    },
  }
}

const ArticlePage = ({
  articles,
  relatedContents,
  tags,
  homeSettings,
  draftMode,
  token,
  categories,
  footerData
}: Props) => {
  if (!articles) {
    return null
  }
  
  const prodUrl = 'https://osdental.io'
  const seoTitle = articles?.seoTitle || articles?.title || 'Article'
  const seoDescription = (articles?.seoDescription && !articles.seoDescription.includes('Test titlw')) 
    ? articles.seoDescription 
    : articles?.excerpt || ''
  const seoKeywords = articles?.seoKeywords || ''
  const seoRobots = articles?.seoRobots || 'index,follow'
  const seoCanonical = sanitizeUrl(
    articles?.seoCanonical ||
    `${prodUrl}/${siteConfig.pageURLs.article}/${articles?.slug?.current || ''}`
  )
  const jsonLD: any = generateJSONLD(articles)

  return (
    <>
      <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
        <SEOHead
          title={seoTitle}
          description={seoDescription}
          keywords={seoKeywords}
          robots={seoRobots}
          canonical={seoCanonical}
          jsonLD={jsonLD}
          contentType={articles?.contentType}
          ogImage={articles?.mainImage?._id ? urlForImage(articles.mainImage._id) : undefined}
        />

        <Layout>
          <MainImageSection enableDate={true} post={articles} />
          <Section className="justify-center">
            <Wrapper className={`flex-col`}>
              <div className="flex md:flex-row flex-col-reverse gap-6 md:gap-12 justify-between">
                <div className="md:mt-12 flex-1 flex md:flex-col flex-col-reverse md:w-2/3 w-full md:max-w-[710px] ">
                  <div className="post__content w-full ">
                    <SanityPortableText
                      content={articles?.body}
                      draftMode={draftMode}
                      token={token}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8 md:mt-12 bg-red relative md:w-1/3 md:max-w-[410px] w-full">
                  <div className="sticky top-24 flex flex-col-reverse md:flex-col gap-8 md:overflow-auto">
                    <Toc headings={articles?.headings} title="Contents" />
                    <div className='flex-col gap-8 flex'>
                      {articles?.author && (
                        <div>
                          <AuthorInfo author={articles?.author} />
                        </div>
                      )}
                      <ShareableLinks props={articles?.title} />
                    </div>
                  </div>
                </div>
              </div>
              {articles?.tags && <RelatedTag tags={articles?.tags}/>}
            </Wrapper>
          </Section>
          {relatedContents && relatedContents.length > 0 && (
            <RelatedFeaturesSection
              contentType={articles?.contentType}
              allPosts={relatedContents}
            />
          )}
          <BannerSubscribeSection />
        </Layout>
      </GlobalDataProvider>
    </>
  )
}

export default ArticlePage
