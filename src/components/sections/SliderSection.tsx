import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { ArrowRightIcon } from '@sanity/icons'
import { ArrowLeftIcon } from '@sanity/icons'
import { ArrowTopRightIcon } from '@sanity/icons'
import siteConfig from 'config/siteConfig'
import { useRouter } from 'next/router'
import React, { useEffect,useRef } from 'react'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import Anchor from '~/components/commonSections/Anchor'
import ImageLoader from '~/components/commonSections/ImageLoader'
import { generateHref } from '~/utils/common'

import H2Large from '../typography/H2Large'
import H4Large from '../typography/H4Large'
import Carousel from './Carousel'

interface BannerBlockProps {
  items?: any
  categories?: any[]
}

const SliderSection: React.FC<BannerBlockProps> = ({ items, categories }) => {
  const router = useRouter()
  const { locale } = router.query
  const swiperRef = useRef(null)

  // Background images for category cards (cycling through)
  const bgImages = [
    'https://cdn.sanity.io/images/bbmnn1wc/production/69f78e1d2126dda19c732337893448dc94969932-784x568.png',
    'https://cdn.sanity.io/images/bbmnn1wc/production/880ec674fe4f1672dbc1bbfebf0ba967b7941900-784x568.png',
    'https://cdn.sanity.io/images/bbmnn1wc/production/30ff45d24d2f4688f1885c96fecc94d319eb76d0-784x568.png',
    'https://cdn.sanity.io/images/bbmnn1wc/production/baf2c5ede0b78146b13c4ac8854d5459fdd1bb7c-2400x1350.jpg',
    'https://cdn.sanity.io/images/bbmnn1wc/production/8df81deaa98d4958936163340be7b77f798d1dcf-2500x2000.jpg',
  ]

  // Background colors for category cards (cycling through)
  const bgColors = ['#c241bd', '#ffcf23', '#3abfbf', '#c241bd', '#ffcf23']

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.navigation.update()
    }
  }, [categories])

  // Handle categories
  if (categories) {
    // Filter categories that have associated content, or show all categories if none have content
    const categoriesWithContent = categories?.filter(
      (category) => category?.associatedContent && category.associatedContent.length > 0
    ) || []

    // If no categories have associatedContent, show all categories (up to 4)
    const displayCategories = categoriesWithContent.length > 0
      ? categoriesWithContent.slice(0, 4)
      : (categories || []).slice(0, 4)

    if (!displayCategories || displayCategories.length === 0) {
      return null
    }

    return (
      <div className="flex w-full justify-center px-4">
        <section className="my-9 max-w-7xl w-full">
          <div className="flex justify-between gap-6 pb-9">
            <div className="flex flex-col gap-3">
              <H2Large className="text-zinc-900">Major Topics</H2Large>
              <p className="text-zinc-900 opacity-80 text-base font-medium leading-[1.6] max-w-[601px]">
                Articles that specifically refer to the dashboards available to the DEO.
              </p>
            </div>
            <div className="flex gap-9 self-end">
              <div className="flex gap-4 md:gap-9">
                <button className="text-zinc-900 category-prev disabled:opacity-30 select-none">
                  <ArrowLeftIcon height={48} width={48} />
                </button>
                <button className="text-zinc-900 category-next disabled:opacity-30 select-none">
                  <ArrowRightIcon height={48} width={48} />
                </button>
              </div>
            </div>
          </div>
          <div>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              slidesPerGroup={1}
              navigation={{
                nextEl: '.category-next',
                prevEl: '.category-prev',
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1200: {
                  slidesPerView: 3,
                },
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper
              }}
            >
              {displayCategories.map((category, index) => {
                // Get first associated content item for the link
                const firstContent = category?.associatedContent?.[0]
                const categorySlug = category?.slug?.current
                const contentSlug = firstContent?.slug?.current

                // Build the URL: topic/{category-slug}/{content-slug} if content exists,
                // otherwise just link to the category page
                const href = contentSlug && categorySlug
                  ? `/${siteConfig.categoryBaseUrls.base}/${categorySlug}/${contentSlug}`
                  : categorySlug
                    ? `/${siteConfig.categoryBaseUrls.base}/${categorySlug}`
                    : `/${siteConfig.categoryBaseUrls.base}`

                const imageIndex = index % bgImages.length
                const colorIndex = index % bgColors.length

                return (
                  <SwiperSlide key={category._id || index} className="!h-auto">
                    <div className="flex flex-col items-start overflow-hidden p-8 relative rounded-[10px] shrink-0 w-full h-full">
                      {/* Background image with color overlay */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none rounded-[10px]"
                      >
                        <div
                          className="absolute inset-0 rounded-[10px]"
                          style={{ backgroundColor: bgColors[colorIndex] }}
                        />
                        <div className="absolute inset-0 rounded-[10px] overflow-hidden">
                          <ImageLoader
                            className="h-full w-full"
                            image={bgImages[imageIndex]}
                            alt=""
                            fixed={true}
                            sizes="(max-width: 768px) 100vw, 392px"
                          />
                        </div>
                      </div>

                      {/* Content card */}
                      <Anchor
                        href={router.isReady ? generateHref(locale as string, href) : '#'}
                        className="backdrop-blur-[10px] bg-white flex flex-col gap-3 items-start p-5 relative rounded-[5px] shrink-0 w-full group h-full"
                      >
                        <div className="flex flex-col gap-2 items-start w-full">
                          {/* Category badge */}
                          <div className="bg-zinc-500 flex items-center justify-center px-2 py-1 rounded">
                            <span className="text-white text-xs font-medium leading-[1.5] uppercase tracking-[0.6px]">
                              DEO Articles
                            </span>
                          </div>

                          {/* Category title */}
                          <H4Large className="text-zinc-900 font-bold leading-[1.3] text-2xl tracking-[-0.24px]">
                            {category.categoryName || 'Category'}
                          </H4Large>
                        </div>

                        {/* Read Now link */}
                        <div className="flex gap-2 items-center">
                          <span className="text-zinc-900 text-base font-medium leading-[1.6]">
                            Read Now
                          </span>
                          <div className="flex items-center justify-center">
                            <div className="-scale-y-100 flex-none">
                              <ArrowTopRightIcon
                                className="group-hover:translate-y-[-2px] transition-transform duration-300"
                                height={20}
                                width={20}
                              />
                            </div>
                          </div>
                        </div>
                      </Anchor>
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        </section>
      </div>
    )
  }

  // Handle regular items (ebooks/webinars)
  if (!items || items.length === 0) return null
  return (
    <div className={` flex w-full justify-center px-4 `}>
      <section className="my-9 max-w-7xl w-full">
        <div className="flex justify-between gap-6 pb-9">
          <H2Large>{`Ebooks and Webinars`}</H2Large>
          <div className="flex gap-9 self-end">
            <div className="flex gap-4 md:gap-9">
              <button className="text-zinc-900 ebook-prev disabled:opacity-30 select-none">
                <ArrowLeftIcon height={48} width={48} />
              </button>
              <button className="text-zinc-900 ebook-next disabled:opacity-30 select-none">
                <ArrowRightIcon height={48} width={48} />
              </button>
            </div>
          </div>
        </div>
        <div>
          <Carousel items={items} />
        </div>
      </section>
    </div>
  )
}

export default SliderSection
