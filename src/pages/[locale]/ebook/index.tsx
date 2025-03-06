import { GetStaticPaths, GetStaticProps } from 'next'
import { Ebooks } from '~/interfaces/post'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getCategories,
  getEbooks,
  getEbooksCount,
  getFooterData,
  getHomeSettings,
  getTags,
} from '~/lib/sanity.queries'
import { SharedPageProps } from '../../_app'
import Layout from '~/components/Layout'
import LatestBlogs from '~/components/sections/LatestBlogSection'
import AllcontentSection from '~/components/sections/AllcontentSection'
import { useRouter } from 'next/router'
import siteConfig from '../../../../config/siteConfig'
import React, { useRef } from 'react'
import Pagination from '~/components/commonSections/Pagination'
import { customMetaTag, CustomHead } from '~/utils/customHead'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import TagSelect from '~/contentUtils/TagSelector'
import { mergeAndRemoveDuplicates } from '~/utils/common'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'

export const getStaticPaths: GetStaticPaths = async () => {

  const locales = siteConfig.locales

  const paths = locales.map((locale) => {
    if (locale === 'en') {
      return { params: { slug: '', locale } } 
    } else {
      return { params: { slug: locale, locale } }
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & { ebooks: Ebooks[]; totalPages: number }
> = async (context) => {
  const draftMode = context.preview || false
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const region:any = context.params.locale || 'en'; 
  const itemsPerPage = siteConfig.pagination.childItemsPerPage

  const ebooks: any = await getEbooks(client, 0, itemsPerPage,region)
  const latestEbooks: any = await getEbooks(client, 0, 5,region)
  const totalEbooks = await getEbooksCount(client,region)
  const totalPages = Math.ceil(totalEbooks / itemsPerPage)
  const tags = await getTags(client)
  const homeSettings = await getHomeSettings(client,region)
  const categories = await getCategories(client)
  const footerData = await getFooterData(client, region)


  if (!ebooks || ebooks.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      ebooks,
      latestEbooks,
      totalPages,
      tags,
      homeSettings,
      categories,
      footerData
    },
  }
}

const EbooksPage = ({
  ebooks,
  latestEbooks,
  totalPages,
  tags,
  homeSettings,
  categories,
  footerData
}: {
  ebooks: Ebooks[]
  latestEbooks: Ebooks[]
  totalPages: number
  tags: any
  homeSettings: any
  categories: any
  footerData: any
}) => {
  const router = useRouter()
  const baseUrl = useRef(`/${siteConfig.pageURLs.ebook}`).current
  if (!ebooks) return null
  const featuredEbook = homeSettings?.featuredEbook || []

  const latestEbook = mergeAndRemoveDuplicates(featuredEbook, latestEbooks)

  const handlePageChange = (page: number) => {
    // if (page === 1) {
    //   router.push(baseUrl)
    // } else {
    //   router.push(`${baseUrl}/page/${page}`)
    // }
  }

  return (
    <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          {ebooks?.map((e, i) => {
            return <CustomHead props={e} type="articleExpanded" key={i} />
          })}
          <TagSelect tags={tags} tagLimit={7}  />
          {customMetaTag('ebook', true)}
          <LatestBlogs
            className={'pt-11 pr-9 pb-16 pl-9'}
            reverse={true}
            contents={latestEbook}
          />
          <AllcontentSection
            className={'pb-9'}
            allContent={ebooks}
            hideHeader={true}
            cardType="left-image-card"
            itemsPerPage={siteConfig.pagination.childItemsPerPage}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={1}
            onPageChange={handlePageChange}
            enablePageSlug={true}
            type="custom"
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}

export default EbooksPage
