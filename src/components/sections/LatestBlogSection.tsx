import { ArrowTopRightIcon } from '@sanity/icons'
import { useRouter } from 'next/router'
import React from 'react'

import Anchor from '~/components/commonSections/Anchor'
import { generateHref } from '~/utils/common'

import Wrapper from '../../layout/Wrapper'
import Card from '../Card'
import { useGlobalData } from '../Context/GlobalDataContext'
import { useBaseUrl } from '../Context/UrlContext'
import Section from '../Section'
import H2Large from '../typography/H2Large'

interface LatestBlogsProps {
  contents: any[]
  reverse?: boolean
  className?: string
  showPlayIcon?: boolean
  page?: string
  contentType?:
    | 'ebook'
    | 'article'
    | 'podcast'
    | 'webinar'
    | 'case-study'
    | 'press-release'
}

const LatestBlogs: React.FC<LatestBlogsProps> = ({
  contents,
  reverse,
  className,
  showPlayIcon,
}) => {
  const baseUrl = useBaseUrl()
  const { homeSettings } = useGlobalData()
  const router = useRouter()
  const { locale } = router.query

  if (!contents) {
    return null
  }

  const types = {
    ebook: 'Ebooks',
    article: 'Articles',
    podcast: 'Podcasts',
    webinar: 'Webinars',
    'case-study': 'Case Studies',
    'press-release': 'Press Releases',
  }

  const contentType =
    contents && contents?.find((c) => c.contentType)?.contentType
  const displayName = types[contentType]
  const [firstBlog, ...otherBlogs] = contents && contents
  const blogCount = contents.length

  if(blogCount === 1) {

    return (
      <React.Fragment>
      <Section className="justify-center !bg-white !text-black ">
        <Wrapper
          className={`md:flex-row md:pt-16 pt-8 flex-col ${reverse ? 'md:flex-row-reverse' : ''} gap-8 md:gap-12 xl:gap-36 !text-black`}
        >
          <div className="xl:w-6/12 w-full h-full flex-1 !text-black">
            <Card
              minHeight={350}
              contentType={contentType}
              baseUrl={baseUrl}
              cardColor="bg-orange-700"
              reverse={reverse}
              cardType="top-image-card"
              key={firstBlog?._id}
              post={firstBlog}
              alignCard= {blogCount ? true : false}
            />
          </div>
        </Wrapper>
      </Section>
    </React.Fragment>
    )
  }else if(blogCount === 2) {

    return(
      <React.Fragment>
      <Section className="justify-center md:pb-24 !bg-white !text-black ">
        <Wrapper
          className={`md:flex-row md:pt-16 pt-8 flex-col ${reverse ? 'md:flex-row-reverse' : ''} gap-2 md:gap-12 xl:gap-16 !text-black`}
        >

          <div className="xl:w-6/12 w-full h-full flex-1 !text-black">
            <Card
              minHeight={350}
              contentType={contentType}
              baseUrl={baseUrl}
              cardColor="bg-orange-700"
              reverse={reverse}
              cardType="top-image-card"
              key={firstBlog?._id}
              post={otherBlogs[0]}
            />
          </div>
          <div className="xl:w-6/12 w-full h-full flex-1 !text-black">
            <Card
              minHeight={350}
              contentType={contentType}
              baseUrl={baseUrl}
              cardColor="bg-orange-700"
              reverse={reverse}
              cardType="top-image-card"
              key={firstBlog?._id}
              post={firstBlog}
            />
          </div>
        </Wrapper>
      </Section>
    </React.Fragment>
    )


  }
  

  // Get the first blog's URL for "Read Now" link
  const getFirstBlogUrl = () => {
    if (!firstBlog?.slug?.current) return '#'
    const contentSlug = firstBlog.slug.current.replace(/^\/+/, '').replace(/\/+$/, '')
    const categorySlug = firstBlog?.category?.slug?.current
    const topicBase = 'topic'
    
    if (categorySlug) {
      return router.isReady 
        ? generateHref(locale as string, `/${topicBase}/${categorySlug}/${contentSlug}`)
        : '#'
    }
    return router.isReady && firstBlog.contentType
      ? generateHref(locale as string, `/${firstBlog.contentType}/${contentSlug}`)
      : '#'
  }

  return (
    <React.Fragment>
      <Section className="justify-center !bg-white !text-black md:pt-headerSpacer pt-headerSpacerMob">
        <Wrapper
          className={`md:flex-row md:py-[15px] flex-col ${reverse ? 'md:flex-row-reverse' : ''} gap-8 md:gap-12 xl:gap-[140px]`}
        >
          <div className="flex flex-col gap-6 xl:w-[498px] w-full flex-1 !text-black">
            <div className="flex gap-6 items-end">
              <H2Large className="select-none !text-black font-extrabold text-[48px] leading-[1.1] tracking-[-0.96px]">
                {reverse ? displayName : `Latest`}
              </H2Large>
              <Anchor
                href={getFirstBlogUrl()}
                className="flex gap-2 items-center group pb-1"
              >
                <span className="text-zinc-900 text-base font-medium leading-[1.6]">
                  See All
                </span>
                <div className="flex items-center justify-center">
                  <div className="scale-y-100 flex-none">
                    <ArrowTopRightIcon
                      className="group-hover:translate-y-[-2px] transition-transform duration-300"
                      height={20}
                      width={20}
                    />
                  </div>
                </div>
              </Anchor>
            </div>
            <div className="flex flex-col gap-0 !text-black">
              {otherBlogs.map((blog, i) => (
                <Card
                  key={i + 1 || blog._id}
                  cardType="text-only-card"
                  baseUrl={baseUrl}
                  isLast={i === otherBlogs.length - 1}
                  post={blog}
                />
              ))}
            </div>
          </div>
          <div className="xl:w-6/12 w-full h-full flex-1">
            <Card
              minHeight={350}
              contentType={contentType}
              baseUrl={baseUrl}
              cardColor="#2f6fa5"
              reverse={reverse}
              cardType="top-image-card"
              key={firstBlog?._id}
              post={firstBlog}
            />
          </div>
        </Wrapper>
      </Section>
    </React.Fragment>
  )
}

export default LatestBlogs
