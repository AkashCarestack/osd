import siteConfig from 'config/siteConfig'

import { BaseUrlProvider } from '~/components/Context/UrlContext'
import EventCarousel from '~/components/eventCarousel'
import AllcontentSection from '~/components/sections/AllcontentSection'
import BannerSubscribeSection from '~/components/sections/BannerSubscribeSection'
import FAQSection from '~/components/sections/FAQSection'
import FeaturedAndPopularBlogs from '~/components/sections/FeaturedAndPopularBlogsSection'
import HeroSection from '~/components/sections/HeroSection'
import LatestBlogs from '~/components/sections/LatestBlogSection'
import ReleaseNotesHeroSection from '~/components/sections/ReleaseNotesHeroSection'
import ShortBannerSection from '~/components/sections/ShortBannerSection'
import SliderSection from '~/components/sections/SliderSection'
import TestimonialSection from '~/components/sections/TestimonialSection'
import TagSelect from '~/contentUtils/TagSelector'
import { Tag } from '~/interfaces/post'
import faqData from '~/lib/faqData.json'
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
  categories?: any[]
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
  podcasts,
  categories,
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
  
  // Use podcasts prop if available, otherwise filter from posts
  const podcastPosts = Array.isArray(podcasts) && podcasts.length > 0
    ? podcasts
    : Array.isArray(posts) 
      ? posts.filter((post: any) => {
          const isPodcast = post && (post.contentType === 'podcast' || post.contentType === 'Podcast')
          return isPodcast
        })
      : []

  return (
    <>
      <BaseUrlProvider baseUrl={baseUrl}>
        <TagSelect tags={tags} tagLimit={7} />
         <EventCarousel allEventCards={uniqueEventCards} />
         <div id="topics-section">
          <HeroSection />
        </div>
         {/* <CategoryCardsSection categories={categories} /> */}
         <SliderSection items={reorderedCarouselItems} />
        <LatestBlogs contents={latestPosts} />
        <FeaturedAndPopularBlogs
          featuredBlog={featuredBlog}
          popularBlogs={featuredContents}
        />
        <div id="release-notes-section">
          <ReleaseNotesHeroSection releaseNotes={releaseNotes} />
        </div>
        {/* <BannerSubscribeSection /> */}
        <TestimonialSection testimonials={testimonialList} />
        <div id="training-section">
          <AllcontentSection
            customBrowseContent={customBrowseContent}
            allContent={podcastPosts}
            itemsPerPage={siteConfig.pagination.itemsHomePage}
            redirect={true}
            contentType="podcast"
            cardType="podcast-card"
            customHeading="Training for Onboarding & Learning"
            customButtonText="View All Trainings"
          />
        </div>
        <div id="faqs-section">
          <FAQSection faqData={faqData} />
        </div>
        <div id="events-updates-section">
          <EventCarousel bgColor={'white'} allEventCards={uniqueEventCards} />
        </div>
        <BannerSubscribeSection hideBanner={true} />
      </BaseUrlProvider>
    </>
  )
}

export default DynamicPages
