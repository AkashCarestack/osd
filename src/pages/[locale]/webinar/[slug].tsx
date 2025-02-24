import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { getClient } from '~/lib/sanity.client'
import {
  getCategories,
  getHomeSettings,
  getPodcast,
  getPodcasts,
  getRelatedContents,
  getTagRelatedContents,
  getTags,
  getWebinar,
  getWebinars,
  podcastSlugsQuery,
  webinarSlugsQuery,
} from '~/lib/sanity.queries'
import { Podcasts } from '~/interfaces/post'
import Wrapper from '~/layout/Wrapper'
import { readToken } from '~/lib/sanity.api'
import SanityPortableText from '~/components/blockEditor/sanityBlockEditor'
import Layout from '~/components/Layout'
import MainImageSection from '~/components/MainImageSection'
import RelatedFeaturesSection from '~/components/RelatedFeaturesSection'
import { generateJSONLD } from '~/utils/generateJSONLD'
import { VideoModal } from '~/components/commonSections/VideoModal'
import Section from '~/components/Section'
import { CustomHead, generateMetaData } from '~/utils/customHead'
import AuthorInfo from '~/components/commonSections/AuthorInfo'
import ShareableLinks from '~/components/commonSections/ShareableLinks'
import SidebarTitle from '~/components/typography/SidebarTitle'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import siteConfig from 'config/siteConfig'
import RelatedTag from '~/components/commonSections/RelatedTag'
import SEOHead from '~/layout/SeoHead'

interface Props {
  webinar: Podcasts
  allWebinars: any
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
      const data = await client.fetch(webinarSlugsQuery, { locale });
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
  const slug = params.slug as string
  const webinar = await getWebinar(client,slug,region);
  if (!webinar) {
    return {
      notFound: true,
    }
  }
  const allWebinars = await getWebinars(client,0,undefined,region)
  const tagIds = webinar.tags?.map((tag: any) => tag?._id) || []
  const relatedContents = await getTagRelatedContents(
    client,
    params.slug as string,
    tagIds,
    webinar.contentType,
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
      webinar,
      allWebinars,
      relatedContents,
      tags,
      homeSettings,
      categories
    },
  }
}

const WebinarPage = ({
  webinar,
  relatedContents,
  draftMode,
  tags,
  homeSettings,
  token,
  categories
}: Props) => {
  if(!webinar) {
    return null 
  }

  const prodUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'https://resources.voicestack.com'

  const seoTitle = webinar.seoTitle || webinar.title
  const seoDescription = webinar.seoDescription || webinar.excerpt
  const seoKeywords = webinar.seoKeywords || ''
  const seoRobots = webinar.seoRobots || 'index,follow'
  const seoCanonical =
    webinar.seoCanonical ||
    `${prodUrl}/${siteConfig.pageURLs.webinar}/${webinar.slug.current}`
  const jsonLD: any = generateJSONLD(webinar)

  return (
    <>
      <CustomHead props={webinar} type="webinar" />
      <SEOHead
          title={seoTitle}
          description={seoDescription}
          keywords={seoKeywords}
          robots={seoRobots}
          canonical={seoCanonical}
          jsonLD={jsonLD}
          contentType={webinar?.contentType}
        />
        {/* {CustomHead} */}
      {generateMetaData(webinar,seoCanonical)}
      <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags}>
        <Layout>
          <MainImageSection
            isAuthor={true}
            post={webinar}
            contentType={webinar?.contentType}
            enableDate={true}
          />

          <Section className="justify-center">
            <Wrapper className={'flex-col'}>
              <div className="flex md:flex-row flex-col gap-6 md:gap-12 justify-between">
                <div className="md:mt-12 flex-1 flex md:flex-col flex-col-reverse md:w-2/3 w-full md:max-w-[710px]">
                  <VideoModal
                    videoDetails={webinar?.videos}
                    className={`max-w-[100%] flex items-start`}
                  />
                  <div className="post__content w-full  max-w-[800px]">
                    <SanityPortableText
                      content={webinar?.body}
                      draftMode={draftMode}
                      token={token}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-8 md:mt-12 bg-red relative md:w-1/3 md:max-w-[410px] w-full">
                  <div className="sticky top-24 flex flex-col gap-8">
                    {webinar.author && webinar.author?.length > 0 && (
                      <>
                        <SidebarTitle className="border-b border-zinc-200 pb-3">{`${webinar.author && webinar.author?.length > 1 ? 'Speakers' : 'Speaker'}`}</SidebarTitle>
                        <div className="flex flex-col gap-6">
                          {webinar.author.map((author: any, i) => {
                            return (
                              <AuthorInfo
                                key={author._id || i}
                                author={[author]}
                              />
                            )
                          })}
                        </div>
                      </>
                    )}
                    <ShareableLinks props={webinar?.title} />
                  </div>
                </div>
              </div>
              {webinar?.tags && <RelatedTag tags={webinar?.tags}/>}
            </Wrapper>
          </Section>
          {relatedContents.length > 0 && (
            <RelatedFeaturesSection
              contentType={webinar?.contentType}
              allPosts={relatedContents}
            />
          )}
        </Layout>
      </GlobalDataProvider>
    </>
  )
}

export default WebinarPage
