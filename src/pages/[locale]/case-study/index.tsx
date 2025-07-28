import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import Pagination from '~/components/commonSections/Pagination'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import { BaseUrlProvider } from '~/components/Context/UrlContext'
import Layout from '~/components/Layout'
import MainImageSection from '~/components/MainImageSection'
import AllcontentSection from '~/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import ReviewsGrid from '~/components/sections/ReviewCards'
import TagSelect from '~/contentUtils/TagSelector'
import { CaseStudies } from '~/interfaces/post'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getCaseStudies,
  getCaseStudiesCount,
  getCategories,
  getFooterData,
  getHomeSettings,
  getTags,
  getTestiMonials,
} from '~/lib/sanity.queries'
import { getUniqueData, mergeAndRemoveDuplicates } from '~/utils/common'
import { CustomHead, customMetaTag } from '~/utils/customHead'

import siteConfig from '../../../../config/siteConfig'
import { SharedPageProps } from '../../_app'


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
  SharedPageProps & { caseStudies: CaseStudies[]; totalPages: number }
> = async (context) => {
  const draftMode = context.preview || false
  const region:any = context.params.locale || 'en'; 
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const itemsPerPage = siteConfig.pagination.childItemsPerPage

  const caseStudies: any = await getCaseStudies(client, 0, itemsPerPage,region)
  const latestCaseStudies: any = await getCaseStudies(client, 0, 5,region)
  const totalCaseStudies = await getCaseStudiesCount(client,region)
  const totalPages = Math.ceil(totalCaseStudies / itemsPerPage)
  const testimonials = await getTestiMonials(client, 0, 6,region)
  const tags = await getTags(client)
  const homeSettings = await getHomeSettings(client,region)
  const categories = await getCategories(client)
  const footerData = await getFooterData(client, region)
  
  if (!caseStudies || caseStudies.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      caseStudies,
      latestCaseStudies,
      totalPages,
      testimonials,
      tags,
      homeSettings,
      categories,
      footerData
    },
  }
}

const CaseStudiesPage = ({
  caseStudies,
  latestCaseStudies,
  homeSettings,
  totalPages,
  testimonials,
  tags,
  categories,
  footerData
}: {
  caseStudies: CaseStudies[]
  latestCaseStudies: CaseStudies[]
  totalPages: number
  testimonials: any
  tags: any
  homeSettings: any
  categories: any
  footerData: any
}) => {
  const router = useRouter()
  const baseUrl = `/${siteConfig.pageURLs.caseStudy}`

  const heroData = {
    tagName: 'CUSTOMER STORIES',
    title: 'Learn from the Best: Dental Practice Success Stories',
    description:
      'From small, solo practices to large, multi-location clinics, these case studies demonstrate the versatility and value of VoiceStack in improving the patient experience and driving practice growth.',
    mainImage:
      'https://cdn.sanity.io/images/bbmnn1wc/production/e2d855bb29dd80923c85acec6ddcaaabeb50248c-1724x990.png',
  }

  const handlePageChange = (page: number) => {
    // if (page === 1) {
    //   router.push(baseUrl)
    // } else {
    //   router.push(`${baseUrl}/page/${page}`)
    // }
  }

  const featuredReviews = homeSettings?.featuredReviews || []
  const featuredCaseStudy = homeSettings?.featuredCasestudy || []

  const reviews = [...featuredReviews, ...testimonials].slice(0, 6) || []

  const uniqueReviews = getUniqueData(reviews)

  const latestContents = mergeAndRemoveDuplicates(
    featuredCaseStudy,
    latestCaseStudies,
  )

  return (
    <GlobalDataProvider data={categories} featuredTags={homeSettings?.featuredTags} footerData={footerData}>
      <BaseUrlProvider baseUrl={baseUrl}>
        <Layout>
          <TagSelect tags={tags} tagLimit={7}  />
          <MainImageSection landing={true} post={heroData} />
          {caseStudies?.map((e, i) => {
            return <CustomHead props={e} type="caseStudy" key={i} />
          })}
          {customMetaTag('caseStudy', true)}
          <AllcontentSection
            className={'!pb-12'}
            allContent={caseStudies}
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
          <ReviewsGrid testimonials={uniqueReviews} />
          <BannerSubscribeSection />
        </Layout>
      </BaseUrlProvider>
    </GlobalDataProvider>
  )
}

export default CaseStudiesPage
