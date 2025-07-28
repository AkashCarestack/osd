import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { ChevronLeftIcon } from '@sanity/icons'
import { ChevronRightIcon } from '@sanity/icons'
import siteConfig from 'config/siteConfig'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo,useRef } from 'react'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Post } from '~/interfaces/post'
import { generateHref } from '~/utils/common'

import Anchor from '../commonSections/Anchor'

interface TagsCarouselProps {
  tags: Array<any>
  selectedTag: string
  onTagChanges: (tag: any) => void
}

const TagsCarousel: React.FC<TagsCarouselProps> = ({
  tags,
  selectedTag,
  onTagChanges,
}) => {
  const swiperRef = useRef(null)
  const [isBeginning, setIsBeginning] = React.useState(true)
  const [isEnd, setIsEnd] = React.useState(false)
  const router = useRouter();
  const { locale } = router.query; 
  const containerRef = useRef<HTMLDivElement>(null)

  const sortedTags = useMemo(() => {
    if (!tags?.length) return []
    
    return [...tags].sort((a, b) => {
      const nameA = (a?.tagName ?? '').toLowerCase().trim()
      const nameB = (b?.tagName ?? '').toLowerCase().trim()
      
      return nameA.localeCompare(nameB, 'en', { numeric: true, sensitivity: 'base' })
    })
  }, [tags])
  

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.navigation.update()
      swiperRef.current.on('slideChange', () => {
        setIsBeginning(swiperRef.current.isBeginning)
        setIsEnd(swiperRef.current.isEnd)
      })
    }
  }, [swiperRef])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (!swiperRef.current) return

      if (e.deltaY > 0 && !isEnd) {
        swiperRef.current.slideNext()
      } else if (e.deltaY < 0 && !isBeginning) {
        swiperRef.current.slidePrev()
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [isBeginning, isEnd])

  if (!tags) return null

  return (
    <div className=' flex items-center justify-center w-full overflow-hidden' ref={containerRef}>
      <Swiper
        modules={[Navigation, Pagination]}
        // spaceBetween={30}
        slidesPerView="auto"
        loop={false} 
        navigation={{
          nextEl: '.swiper-next',
          prevEl: '.swiper-prev',
        }}
        // pagination={{ clickable: true }}

        breakpoints={{
          640: {
            slidesPerView: 'auto',
          },
          768: {
            slidesPerView: 'auto',
          },
          1200: {
            slidesPerView: 'auto',
            slidesPerGroup: 2,
          },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
      >
        {sortedTags && sortedTags?.map((tag,i) => {
          let hrefTemplate = `/${siteConfig.paginationBaseUrls.base}/${tag?.slug?.current}`
          return(
          <SwiperSlide
            key={tag._id}
            className="!flex items-center justify-center px-2 md:px-3"
          >
            <span
              onClick={() => onTagChanges(tag)}
              className={`flex py-1 text-[14px] font-medium leading-[1.5] text-center cursor-pointer justify-center
                ${
                  selectedTag === tag?.slug?.current
                    ? 'text-zinc-200'
                    : 'text-zinc-400 hover:text-zinc-300'
                }`}
            >
              <Anchor   href={generateHref(locale as string, hrefTemplate)}scroll={false}>
                <span>{tag?.tagName}</span>
              </Anchor> 
            </span>
          </SwiperSlide>
        )})}
      </Swiper>
      <button
        disabled={isBeginning}
        className={`swiper-prev absolute left-0 top-[50%] translate-y-[-50%] select-none ${
          isBeginning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <ChevronLeftIcon className="text-zinc-200 w-6 h-6 hover:text-white" />
      </button>
      <button
        disabled={isEnd}
        className={`swiper-next absolute right-0 top-[50%] translate-y-[-50%] select-none ${
          isEnd ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <ChevronRightIcon className="text-zinc-200 w-6 h-6 hover:text-white" />
      </button>
    </div>
  )
}

export default TagsCarousel