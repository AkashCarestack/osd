import siteConfig from 'config/siteConfig'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'

import Button from '~/components/commonSections/Button'
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext'
import Layout from '~/components/Layout'
import { DEFAULT_HERO_BACKGROUND_IMAGE } from '~/lib/defaultHeroBackground'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  getCategories,
  getFooterData,
  getLayoutHomeSettings,
  getSiteSettings,
  getTags,
  getTagsByOrder,
} from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'

interface NotFoundPageProps {
  footerData: unknown
  categories: any
  tags: Array<any>
  tagsByOrder: any
  homeSettings: any
  siteSettings: any
}

const emptyNotFoundProps = {
  tags: [],
  tagsByOrder: [],
  homeSettings: null,
  siteSettings: [],
  categories: [],
  footerData: [],
}

export const getStaticProps: GetStaticProps<SharedPageProps & NotFoundPageProps> =
  async ({ draftMode = false }) => {
    const client = getClient(draftMode ? { token: readToken } : undefined)

    try {
      const [
        tags,
        tagsByOrder,
        homeSettings,
        siteSettings,
        categories,
        footerData,
      ] = await Promise.all([
        getTags(client),
        getTagsByOrder(client),
        getLayoutHomeSettings(client, 'en'),
        getSiteSettings(client),
        getCategories(client),
        getFooterData(client),
      ])

      return {
        props: {
          draftMode,
          token: draftMode ? readToken : '',
          tags,
          tagsByOrder,
          homeSettings,
          siteSettings,
          categories,
          footerData,
        },
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      return {
        props: {
          draftMode,
          token: draftMode ? readToken : '',
          ...emptyNotFoundProps,
        },
      }
    }
  }

const Custom404 = (props: NotFoundPageProps) => {
  const homeSettings = props?.homeSettings

  return (
    <GlobalDataProvider
      data={props?.categories}
      featuredTags={homeSettings?.featuredTags}
      homeSettings={homeSettings}
      footerData={props?.footerData}
    >
      <Layout>
        <Head>
          <title>Page not found</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="relative flex min-h-[calc(100vh-12rem)] w-full flex-col items-center justify-center overflow-hidden bg-[#18181b] px-4 py-20 md:min-h-[28rem] md:py-28">
          <img
            src={DEFAULT_HERO_BACKGROUND_IMAGE}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
            decoding="async"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b0b0f]/92 via-[#18181b]/78 to-[#18181b]/92"
            aria-hidden
          />
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="font-manrope text-sm font-semibold uppercase tracking-[0.12em] text-white/70">
              Error 404
            </p>
            <h1 className="mt-4 font-manrope text-4xl font-bold !leading-[107.143%] text-white md:text-5xl xl:text-[56px]">
              This page could not be found
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              The link may be broken or the page may have been removed. Use the
              button below to return to the site home.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                className="bg-white !text-zinc-900 hover:bg-zinc-100 !no-underline"
                link={siteConfig.pageURLs.home}
              >
                <span className="text-base font-semibold">Back to home</span>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </GlobalDataProvider>
  )
}

export default Custom404
