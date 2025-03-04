import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import Layout from '~/components/Layout'
import AllcontentSection from '~/components/sections/AllcontentSection'
import { getClient } from '~/lib/sanity.client'
import {
  getCaseStudies,
  getCaseStudiesCount,
  getCategories,
  getFooterData,
  getHomeSettings,
  getTags,
} from '~/lib/sanity.queries'
import { readToken } from '~/lib/sanity.api'
import { CaseStudies } from '~/interfaces/post'
import React from 'react'
import Pagination from '~/components/commonSections/Pagination'
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
      const studies = await getCaseStudies(client, 0, undefined, locale);
      const totalPages = Math.ceil(
        studies.length / siteConfig.pagination.childItemsPerPage
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
    caseStudies: CaseStudies[]
    pageNumber: number
    totalPages: number
    categories: any
  }
> = async (context) => {
  const draftMode = context.preview || false
  const locale =  context.locale; 
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const pageNumber = Number(context.params?.pageNumber) || 1
  const itemsPerPage = siteConfig.pagination.childItemsPerPage
  const skip = (pageNumber - 1) * itemsPerPage

  const caseStudies: any = await getCaseStudies(client, skip, itemsPerPage,locale)
  const totalCaseStudies = await getCaseStudiesCount(client,locale)
  const totalPages = Math.ceil(totalCaseStudies / itemsPerPage)
  const tags = await getTags(client)
  const homeSettings = await getHomeSettings(client,locale)
  const categories = await getCategories(client)
  const footerData = await getFooterData(client, locale)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      caseStudies,
      pageNumber,
      totalPages,
      tags,
      homeSettings,
      categories,
      footerData
    },
  }
}

const PaginatedCaseStudyPage = ({
  caseStudies,
  homeSettings,
  pageNumber,
  totalPages,
  categories,
  footerData
}: {
  caseStudies: CaseStudies[]
  tags: any
  homeSettings: any
  pageNumber: number
  totalPages: number
  categories: any
  footerData : any
}) => {
  const router = useRouter()
  const baseUrl = `/${siteConfig.pageURLs.caseStudy}`
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
          {customMetaTag('caseStudy', false, currentPageUrl)}
          {caseStudies?.map((e, i) => {
            return <CustomHead props={e} type="caseStudy" key={i} />
          })}
          <AllcontentSection
            className={'pb-9'}
            allContent={caseStudies}
            cardType="left-image-card"
            hideHeader={true}
            itemsPerPage={siteConfig.pagination.childItemsPerPage}
            contentType="case-study"
            showCount={true}
          />
          <Pagination
            totalPages={totalPages}
            currentPage={pageNumber}
            onPageChange={handlePageChange}
            enablePageSlug={true}
            content={caseStudies}
            type="custom"
          />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}

export default PaginatedCaseStudyPage
