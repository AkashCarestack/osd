import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import Layout from '~/components/Layout'
import AllcontentSection from '~/components/sections/AllcontentSection'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import {
  Podcasts,
  PressRelease,
} from '~/interfaces/post'
import React, { useRef } from 'react'
import Pagination from '~/components/commonSections/Pagination'
import {
  getCategories,
  getFooterData,
  getHomeSettings,
  getPressReleases,
  getPressReleasesCount,
  getTags,
} from '~/lib/sanity.queries'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import { CustomHead, customMetaTag } from '~/utils/customHead'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import siteConfig from 'config/siteConfig'
import { SharedPageProps } from '~/pages/_app'

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient();
  const locales = siteConfig.locales; 
  const paths = await Promise.all(
    locales.map(async (locale) => {
      const releases = await getPressReleases(client, 0, undefined, locale);
      const totalPages = Math.ceil(
        releases.length / siteConfig.pagination.childItemsPerPage
      );

      return Array.from({ length: totalPages - 1 }, (_, i) => ({
        params: { pageNumber: (i + 2).toString(), locale },
      }));
    })
  );

  return { paths: paths.flat(), fallback: false };
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    pressReleases: PressRelease[]
    pageNumber: number
    totalPages: number
  }
> = async (context) => {
  const draftMode = context.preview || false
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const region =  context.locale; 
  const pageNumber = Number(context.params?.pageNumber) || 1
  const itemsPerPage = siteConfig.pagination.childItemsPerPage
  const skip = (pageNumber - 1) * itemsPerPage

  const pressReleases: any = await getPressReleases(client, skip, itemsPerPage,region)
  const totalPressReleases = await getPressReleasesCount(client,region)
  const totalPages = Math.ceil(totalPressReleases / itemsPerPage)
  const tags = await getTags(client)
  const homeSettings = await getHomeSettings(client,region)
  const categories = await getCategories(client)
  const footerData = await getFooterData(client, region)
  
  if (!pressReleases || pressReleases.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      pressReleases,
      pageNumber,
      totalPages,
      tags,
      homeSettings,
      categories,
      footerData
    },
  }
}

const PaginatedPressReleasePage = ({
  pressReleases,
  tags,
  homeSettings,
  pageNumber,
  totalPages,
  categories,
  footerData
}: {
  pressReleases: Podcasts[]
  tags?: any
  homeSettings?: any
  pageNumber: number
  totalPages: number
  categories?: any
  footerData?: any
}) => {
  const router = useRouter()
  const baseUrl = `/${siteConfig.pageURLs.pressRelease}`
  const url = process.env.NEXT_PUBLIC_BASE_URL
  const currentPageUrl =`${url}${baseUrl}/page/${pageNumber}`

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
          {pressReleases?.map((e, i) => {
            return <CustomHead props={e} type="pressRelease" key={i} />
          })}
          {customMetaTag('pressRelease', false, currentPageUrl)}
          <AllcontentSection
            className={'pb-9'}
            allContent={pressReleases}
            cardType="left-image-card"
            hideHeader={true}
            itemsPerPage={siteConfig.pagination.childItemsPerPage}
            contentType="press-release"
            showCount={true}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
            enablePageSlug={true}
            content={pressReleases}
            type="custom"
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}

export default PaginatedPressReleasePage
