import siteConfig from 'config/siteConfig'
import { GetStaticPaths, GetStaticProps } from 'next'
import React, { useRef } from 'react'

import Pagination from '~/components/commonSections/Pagination'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import Layout from '~/components/Layout'
import AllcontentSection from '~/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import LatestBlogs from '~/components/sections/LatestBlogSection'
import TagSelect from '~/contentUtils/TagSelector'
import { Podcasts, PressRelease } from '~/interfaces/post'
import { getDefaultLocale, getPartnerPaths } from '~/lib/partnerPaths'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getCategories,
  getFooterData,
  getHomeSettings,
  getPressReleases,
  getPressReleasesCount,
  getTags,
} from '~/lib/sanity.queries'
import { SharedPageProps } from '~/pages/_app'
import { mergeAndRemoveDuplicates } from '~/utils/common'
import { CustomHead, customMetaTag } from '~/utils/customHead'

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient()
  const paths = await getPartnerPaths(client)
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & { pressReleases: PressRelease[]; totalPages: number }
> = async (context) => {
  const draftMode = context.preview || false
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const itemsPerPage = siteConfig.pagination.childItemsPerPage
  const region = getDefaultLocale()
  const partnerSlug = context.params?.partner as string
  if (!partnerSlug || !siteConfig.locales.includes(region)) {
    return { notFound: true }
  }
  const pressReleases: any = await getPressReleases(
    client,
    0,
    itemsPerPage,
    region,
  )
  const latestPressReleases: any = await getPressReleases(client, 0, 5, region)
  const totalPressReleases = await getPressReleasesCount(client, region)
  const totalPages = Math.ceil(totalPressReleases / itemsPerPage)
  const tags = await getTags(client)
  const homeSettings = await getHomeSettings(client, region, partnerSlug)
  const categories = await getCategories(client)
  const footerData = await getFooterData(client, region)

  if (!pressReleases || pressReleases.length === 0) {
    return { notFound: true }
  }

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      pressReleases,
      latestPressReleases,
      totalPages,
      tags,
      homeSettings,
      categories,
      footerData,
    },
  }
}

const PressReleasePage = ({
  pressReleases,
  latestPressReleases,
  totalPages,
  tags,
  homeSettings,
  categories,
  footerData,
}: {
  pressReleases: Podcasts[]
  latestPressReleases: Podcasts[]
  totalPages: number
  tags: any
  homeSettings: any
  categories: any
  footerData: any
}) => {
  const baseUrl = `/${siteConfig.pageURLs.pressRelease}`
  if (!pressReleases) return null

  const featuredPressRelease = homeSettings?.featuredPressRelease || []

  const latestPressRelease = mergeAndRemoveDuplicates(
    featuredPressRelease,
    latestPressReleases,
  )

  const handlePageChange = (page: number) => {
    // if (page === 1) {
    //   router.push(baseUrl)
    // } else {
    //   router.push(`${baseUrl}/page/${page}`)
    // }
  }

  return (
    <GlobalDataProvider
      data={categories}
      featuredTags={homeSettings?.featuredTags}
      footerData={footerData}
    >
      <BaseUrlProvider baseUrl={baseUrl}>
        {pressReleases?.map((e, i) => {
          return <CustomHead props={e} type="pressRelease" key={i} />
        })}
        <Layout>
          <TagSelect tags={tags} tagLimit={7} />
          {customMetaTag('pressRelease', true)}
          <LatestBlogs
            className={'pt-11 pr-9 pb-16 pl-9'}
            reverse={true}
            contents={latestPressRelease}
          />
          <AllcontentSection
            className={'pb-9'}
            allContent={pressReleases}
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

export default PressReleasePage
