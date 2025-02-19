import React from 'react'
import Card from '../Card'
import Wrapper from '../../layout/Wrapper'
import H2Large from '../typography/H2Large'
import Section from '../Section'
import { useBaseUrl } from '../Context/UrlContext'
import { useGlobalData } from '../Context/GlobalDataContext'

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
    const { homeSettings } = useGlobalData();

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
      <Section className="justify-center  md:pb-24  bg-zinc-900 text-white ">
        <Wrapper
          className={`md:flex-row md:pt-16 pt-8 flex-col ${reverse ? 'md:flex-row-reverse' : ''} gap-8 md:gap-12 xl:gap-36`}
        >
          <div className="xl:w-6/12 w-full h-full flex-1">
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
      <Section className="justify-center  md:pb-24  bg-zinc-900 text-white ">
        <Wrapper
          className={`md:flex-row md:pt-16 pt-8 flex-col ${reverse ? 'md:flex-row-reverse' : ''} gap-2 md:gap-12 xl:gap-16`}
        >

          <div className="xl:w-6/12 w-full h-full flex-1">
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
          <div className="xl:w-6/12 w-full h-full flex-1">
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
  

  return (
    <React.Fragment>
      <Section className="justify-center  md:pb-24  bg-zinc-900 text-white md:pt-headerSpacer pt-headerSpacerMob">
        <Wrapper
          className={`md:flex-row md:pt-16 pt-8 flex-col ${reverse ? 'md:flex-row-reverse' : ''} gap-8 md:gap-12 xl:gap-36`}
        >
          <div className="flex flex-col gap-9 xl:w-5/12 w-full flex-1">
            <H2Large className="select-none ">
              {reverse ? displayName : `Latest`}
            </H2Large>
            <div className="flex flex-col gap-8 ">
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

export default LatestBlogs
