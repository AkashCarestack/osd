import siteConfig from 'config/siteConfig'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRef } from 'react'

import ImageLoader from '~/components/commonSections/ImageLoader'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import Layout from '~/components/Layout'
import Section from '~/components/Section'
import AllcontentSection from '~/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import { Author, Post } from '~/interfaces/post'
import Wrapper from '~/layout/Wrapper'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  authorSlugsQuery,
  getAuthor,
  getauthorRelatedContents,
  getCategories,
  getFooterData,
  getHomeSettings,
  getTags,
} from '~/lib/sanity.queries'
import { CustomHead, metaTagDataForAuthor } from '~/utils/customHead'
import SEOHead from '~/layout/SeoHead'
import { urlForImage } from '~/lib/sanity.image'

import { SharedPageProps } from '../../_app'

interface Query {
  [key: string]: string
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    author: Author
    relatedContents: Post[]
    tags: any
    homeSettings: any
    categories: any
    footerData: any
  },
  Query
> = async ({ draftMode = false, params = {} }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const region = params.locale as string
  const author = await getAuthor(client, params.slug, region)
  if (!author) {
    return {
      notFound: true,
    }
  }
  const authorId = author?._id
  const tags = await getTags(client)
  const homeSettings = await getHomeSettings(client,region)
  const relatedContents = await getauthorRelatedContents(client, authorId, undefined,region)  
  const categories = await getCategories(client)
  const footerData = await getFooterData(client, region)

  if (!author || author.length === 0) {
    return { notFound: true };
  }


  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      author,
      relatedContents,
      tags,
      homeSettings,
      categories,
      footerData
    },
  }
}

export const getStaticPaths = async () => {
  const client = getClient()
  const locales = siteConfig.locales
  const slugs = await Promise.all(
    locales.map(async (locale) => {
      const data = await client.fetch(authorSlugsQuery, { locale });
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

export default function AuthorPage({
  author,
  relatedContents,
  tags,
  homeSettings,
  categories,
  footerData
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if(!author) return null
  const baseUrl = `/${siteConfig.pageURLs.author}`
  const url = process.env.NEXT_PUBLIC_BASE_URL + baseUrl
  
  const seoTitle = author?.name || 'Author Profile'
  const seoDescription = author?.bio || `Learn more about ${author?.name} and their contributions to OS Dental.`
  const seoCanonical = `${url}/${author?.slug?.current || ''}`
  const jsonLD = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author?.name,
    "description": author?.bio,
    "image": author?.picture ? urlForImage(author.picture._id) : undefined,
    "url": seoCanonical
  })

  return (
    <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <SEOHead
          title={seoTitle}
          description={seoDescription}
          keywords=""
          robots="index,follow"
          canonical={seoCanonical}
          jsonLD={jsonLD}
          contentType="author"
          ogImage={author?.picture?._id ? urlForImage(author.picture._id) : undefined}
        />
        <CustomHead props={author} type="author" />
        <Layout>
          <Section className="justify-center">
            <Wrapper className={`flex-col md:pt-headerSpacer pt-headerSpacerMob`}>
              <div className="flex md:flex-row justify-between flex-col gap-8 md:gap-16">
                <div className="md:min-w-[360px] md:h-full min-h-[370px]  ">
                  {author.picture && (
                    <ImageLoader
                      className="object-cover h-full w-full "
                      image={author.picture}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                </div>
                <div className=" flex flex-col gap-6">
                  <h2 className="md:text-6xl text-2xl text-zinc-900  font-extrabold font-manrope ">
                    {author.name}
                  </h2>
                  <p className="md:text-4xl text-xl text-cs-dark-500 font-manrope font-semibold pb-6 border-b-2 border-cs-darkBlack">
                    {author.role}
                  </p>
                  <p className="max-w-3xl text-xl text-zinc-900  font-normal">
                    {author.bio}
                  </p>
                </div>
              </div>
            </Wrapper>
          </Section>
          {relatedContents && (
            <AllcontentSection
              className={'pb-9'}
              allContent={relatedContents}
              itemsPerPage={6}
              redirect={true}
              authorName={author.name}
            />
          )}
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}
