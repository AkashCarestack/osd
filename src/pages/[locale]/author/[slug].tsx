import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { getClient } from '~/lib/sanity.client'
import {
  authorSlugsQuery,
  getAuthor,
  getauthorRelatedContents,
  getCategories,
  getHomeSettings,
  getTags,
} from '~/lib/sanity.queries'
import Layout from '~/components/Layout'
import Wrapper from '~/layout/Wrapper'
import { readToken } from '~/lib/sanity.api'
import { Author, Post } from '~/interfaces/post'
import { SharedPageProps } from '../../_app'
import AllcontentSection from '~/components/sections/AllcontentSection'
import siteConfig from 'config/siteConfig'
import Section from '~/components/Section'
import { useRef } from 'react'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import ImageLoader from '~/components/commonSections/ImageLoader'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { CustomHead, metaTagDataForAuthor } from '~/utils/customHead'

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

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      author,
      relatedContents,
      tags,
      homeSettings,
      categories
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
  categories
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if(!author) return null
  const baseUrl = `/${siteConfig.pageURLs.author}`
  const url = process.env.NEXT_PUBLIC_BASE_URL + baseUrl
  

  return (
    <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          <CustomHead props={author} type="author" />
          {metaTagDataForAuthor(author, url)}
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
                  <h2 className="md:text-6xl text-2xl text-cs-zinc-900  font-extrabold font-manrope ">
                    {author.name}
                  </h2>
                  <p className="md:text-4xl text-xl text-cs-dark-500 font-manrope font-semibold pb-6 border-b-2 border-cs-darkBlack">
                    {author.role}
                  </p>
                  <p className="max-w-3xl text-xl text-cs-zinc-900   font-normal">
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
