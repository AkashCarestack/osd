import siteConfig from 'config/siteConfig'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'

import Pagination from '~/components/commonSections/Pagination'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import Layout from '~/components/Layout'
import AllcontentSection from '~/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import LatestBlogs from '~/components/sections/LatestBlogSection'
import TagSelect from '~/contentUtils/TagSelector'
import { Articles } from '~/interfaces/post'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getCategories,
  getFooterData,
  getHomeSettings,
  getReleaseNotes,
  getReleaseNotesCount,
  getTags,
} from '~/lib/sanity.queries'
import { SharedPageProps } from '~/pages/_app'
import { mergeAndRemoveDuplicates } from '~/utils/common'
import { CustomHead,customMetaTag } from '~/utils/customHead'

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

export const getStaticProps: GetStaticProps<SharedPageProps & {}> = async (
  context,
) => {
  const locale:any = context.params.locale || 'en'; 
  const draftMode = context.preview || false
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const itemsPerPage = siteConfig.pagination.childItemsPerPage
  const totalReleaseNotes = await getReleaseNotesCount(client,locale)
  const totalPages = Math.ceil(totalReleaseNotes / itemsPerPage)
  

  const [releaseNotes, latestReleaseNotes, tags, homeSettings,categories,footerData] = await Promise.all([
    getReleaseNotes(client, 0, itemsPerPage,locale),
    getReleaseNotes(client, 0, 5,locale),
    getTags(client),
    getHomeSettings(client,locale),
    getCategories(client),
    getFooterData(client, locale)
  ])
  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      releaseNotes,
      latestReleaseNotes,
      totalPages,
      tags,
      homeSettings,
      categories,
      footerData
    },
  }
}

const ReleaseNotesPage = ({
  releaseNotes,
  latestReleaseNotes,
  totalPages,
  tags,
  homeSettings,
  categories,
  footerData
}: {
  releaseNotes: Articles[]
  latestReleaseNotes: Articles[]
  totalPages: number
  tags: any
  homeSettings?: any
  categories?: any
  footerData?: any
}) => {
  const router = useRouter()
  const baseUrl = `/${siteConfig.pageURLs.releaseNotes}`

  const featuredReleaseNotes = homeSettings?.featuredReleaseNotes || []

  const latestContents = mergeAndRemoveDuplicates(
    featuredReleaseNotes,
    latestReleaseNotes,
  )

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
          <CustomHead props={releaseNotes} type="articleExpanded" />
          <TagSelect tags={tags} tagLimit={7}  />
          {customMetaTag('release-notes', true)}
          <LatestBlogs
            className={'pt-11 pr-9 pb-16 pl-9'}
            reverse={true}
            contents={latestContents}
          />
          {releaseNotes?.length
            ? releaseNotes.map((e, i) => {
                return <CustomHead props={e} type="articleExpanded" key={i} />
              })
            : null}
          <AllcontentSection
            className={'pb-9'}
            allContent={releaseNotes}
            hideHeader={true}
            cardType="left-image-card"
            itemsPerPage={siteConfig.pagination.childItemsPerPage}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={1}
            onPageChange={handlePageChange}
            enablePageSlug={true}
            content={releaseNotes}
            type="custom"
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}

export default ReleaseNotesPage
