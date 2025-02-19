import { GetStaticProps, GetStaticPaths } from 'next'
import { getClient } from '~/lib/sanity.client'
import {
  caseStudySlugsQuery,
  getCaseStudy,
  getCategories,
  getHomeSettings,
  getTagRelatedContents,
  getTags,
} from '~/lib/sanity.queries'
import { CaseStudies } from '~/interfaces/post'
import Wrapper from '~/layout/Wrapper'
import { readToken } from '~/lib/sanity.api'
import MainImageSection from '~/components/MainImageSection'
import RelatedFeaturesSection from '~/components/RelatedFeaturesSection'
import Layout from '~/components/Layout'
import AsideBannerBlock from '~/components/sections/asideBannerBlock'
import PracticeProfile from '~/contentUtils/PracticeProfile'
import SEOHead from '~/layout/SeoHead'
import { generateJSONLD } from '~/utils/generateJSONLD'
import { urlForImage } from '~/lib/sanity.image'
import SanityPortableText from '~/components/blockEditor/sanityBlockEditor'
import { Toc } from '~/contentUtils/sanity-toc'
import ShareableLinks from '~/components/commonSections/ShareableLinks'
import Section from '~/components/Section'
import { CustomHead, customMetaTag, generateMetaData } from '~/utils/customHead'
import AuthorInfo from '~/components/commonSections/AuthorInfo'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import homeSettings from '~/schemas/homeSettings'
import siteConfig from 'config/siteConfig'
import RelatedTag from '~/components/commonSections/RelatedTag'

interface Props {
  caseStudy: CaseStudies
  draftMode: boolean
  token: string
  relatedContents: any
  tags: any
  homeSettings: any
  categories: any
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient()
  const locales = siteConfig.locales
  const slugs = await Promise.all(
    locales.map(async (locale) => {
      const data = await client.fetch(caseStudySlugsQuery, { locale });
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
  const region:any = params.locale 
  const caseStudy = await getCaseStudy(client, params.slug as string,region)
  if (!caseStudy) {
    return {
      notFound: true,
      revalidate: 60,
    }
  }
  const tagIds = caseStudy.tags?.map((tag: any) => tag?._id) || []
  const relatedContents = await getTagRelatedContents(
    client,
    params.slug as string,
    tagIds,
    caseStudy?.contentType,
    undefined,
    region
  )
  const tags = await getTags(client)
  const homeSettings = await getHomeSettings(client,region)
  const categories = await getCategories(client)

  

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      caseStudy,
      relatedContents,
      tags,
      homeSettings,
      categories
    },
  }
}

const CaseStudyPage = ({
  caseStudy,
  relatedContents,
  tags,
  homeSettings,
  draftMode,
  token,
  categories
}: Props) => {
  if (!caseStudy) {
    return null
  }

  const prodUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'https://resources.voicestack.com'
  const seoTitle = caseStudy.seoTitle || caseStudy.title
  const seoDescription = caseStudy.seoDescription || caseStudy.excerpt
  const seoKeywords = caseStudy.seoKeywords || ''
  const seoRobots = caseStudy.seoRobots || 'index,follow'
  const seoCanonical =
    caseStudy.seoCanonical ||
    `${prodUrl}/${siteConfig.pageURLs.caseStudy}/${caseStudy.slug.current}`
  const jsonLD: any = generateJSONLD(caseStudy)

  return (
    <>
      <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags}>
        <SEOHead
          title={seoTitle}
          description={seoDescription}
          keywords={seoKeywords}
          robots={seoRobots}
          canonical={seoCanonical}
          jsonLD={jsonLD}
          ogImage={urlForImage(caseStudy?.mainImage?._id)}
          contentType={caseStudy?.contentType}
        />
        {/* {customMetaTag('caseStudy')} */}
        {generateMetaData(caseStudy,seoCanonical)}
        <Layout>
          <MainImageSection
            isAuthor={true}
            post={caseStudy}
            enableDate={true}
          />
          {caseStudy?.asideBookFreeDemoBanner && (
            <AsideBannerBlock contents={caseStudy} />
          )}
          <Section className="justify-center">
            <Wrapper className="flex-col">
              <CustomHead props={caseStudy} type="caseStudy" />
              <div className="flex md:flex-row flex-col gap-6 md:gap-12 justify-between">
                <div className="md:mt-12 flex-1 flex md:flex-col flex-col-reverse md:w-2/3 w-full md:max-w-[710px]">
                  <div className="post__content w-full">
                    <SanityPortableText
                      content={caseStudy.body}
                      draftMode={draftMode}
                      token={token}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8 md:mt-12 bg-red relative md:w-1/3 md:max-w-[410px] w-full">
                  <div className="sticky top-24 flex flex-col gap-8">
                    {caseStudy?.practiceName ||
                    caseStudy?.location ||
                    caseStudy?.providers ||
                    caseStudy?.headCount ||
                    caseStudy?.growingLocations ||
                    caseStudy?.facilities ? (
                      <PracticeProfile contents={caseStudy} />
                    ) : (
                      <Toc headings={caseStudy?.headings} title="Contents" />
                    )}
                    <div className="flex flex-col gap-8">
                      {caseStudy?.author && (
                        <div className="">
                          <AuthorInfo author={caseStudy?.author} />
                        </div>
                      )}
                      <ShareableLinks props={caseStudy?.title} />
                    </div>
                  </div>
                </div>
              </div>
              {caseStudy?.tags && <RelatedTag tags={caseStudy?.tags}/>}
            </Wrapper>
          </Section>
          {relatedContents.length > 0 && (
            <RelatedFeaturesSection
              contentType={caseStudy?.contentType}
              allPosts={relatedContents}
            />
          )}
        </Layout>
      </GlobalDataProvider>
    </>
  )
}

export default CaseStudyPage
