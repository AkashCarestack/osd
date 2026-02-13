import siteConfig from 'config/siteConfig'

import { BaseUrlProvider } from '~/components/Context/UrlContext'
import EventCarousel from '~/components/eventCarousel'
import AllcontentSection from '~/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import FeaturedAndPopularBlogs from '~/components/sections/FeaturedAndPopularBlogsSection'
import HeroSection from '~/components/sections/HeroSection'
import LatestBlogs from '~/components/sections/LatestBlogSection'
import ReleaseNotesHeroSection from '~/components/sections/ReleaseNotesHeroSection'
import ShortBannerSection from '~/components/sections/ShortBannerSection'
import SliderSection from '~/components/sections/SliderSection'
import TestimonialSection from '~/components/sections/TestimonialSection'
import TagSelect from '~/contentUtils/TagSelector'
import { Tag } from '~/interfaces/post'
import { getUniqueData, getUniqueReorderedCarouselItems } from '~/utils/common'

interface DynamicProps {
  children?: React.ReactNode
  body?: any
  isPage?: Boolean
  full_slug?: any
  tags?: Tag[]
  [x: string]: any
  testimonials?: any
  homeSettings?: any
  popularBlogs?: any
  FeaturedContents?: any
  webinars?: any
  ebooks?: any
  releaseNotes?: any
}

const DynamicPages = ({
  posts,
  tags,
  testimonials,
  homeSettings,
  latestPosts,
  ebooks,
  webinars,
  releaseNotes,
  eventCards,
}: DynamicProps) => {
  const featuredBlog = homeSettings?.FeaturedBlog || posts[0]
  const customBrowseContent = homeSettings?.customBrowseContent 
  const featuredBlogs = homeSettings?.popularBlogs || []

  const featuredContents = [...featuredBlogs, ...posts].slice(0, 4)

  const featuredEvent =
    (homeSettings?.featuredEvent && [homeSettings?.featuredEvent]) || []

  const eventCardData = eventCards &&  [...featuredEvent, ...eventCards]

  const uniqueEventCards = getUniqueData(eventCardData)

  const reorderedCarouselItems = getUniqueReorderedCarouselItems(
    homeSettings,
    ebooks,
    webinars,
  )

  const testimonialList = homeSettings?.testimonial
    ? homeSettings?.testimonial
    : testimonials.slice(0, 1)

  const baseUrl = `/${siteConfig.pageURLs.home}`
  

  return (
    <>
      <BaseUrlProvider baseUrl={baseUrl}>
        <TagSelect tags={tags} tagLimit={7} />
         <EventCarousel allEventCards={uniqueEventCards} />
         <HeroSection />
        <LatestBlogs contents={latestPosts} />
        <FeaturedAndPopularBlogs
          featuredBlog={featuredBlog}
          popularBlogs={featuredContents}
        />
        <ReleaseNotesHeroSection releaseNotes={releaseNotes} />
        {/* <BannerSubscribeSection /> */}
        <SliderSection items={reorderedCarouselItems} />
        <TestimonialSection testimonials={testimonialList} />
          <AllcontentSection
            customBrowseContent={customBrowseContent}
            allContent={posts}
            itemsPerPage={siteConfig.pagination.itemsHomePage}
            redirect={true}
          />
        <EventCarousel bgColor={'white'} allEventCards={uniqueEventCards} />
        <BannerSubscribeSection hideBanner={true} />
      </BaseUrlProvider>
    </>
  )
}

export default DynamicPages
