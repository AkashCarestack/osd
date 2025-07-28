import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { ArrowRightIcon } from '@sanity/icons'
import { ArrowLeftIcon } from '@sanity/icons'
import React, { useEffect,useRef } from 'react'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Post } from '~/interfaces/post'

import Card from '../Card'

interface CarouselProps {
  items: Post[]
  swiperRef?: React.MutableRefObject<any>
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const swiperRef = useRef(null)

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.navigation.update()
    }
  }, [swiperRef])

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        slidesPerGroup={1}
        // pagination={{ clickable: true }}
        navigation={{
          nextEl: '.ebook-next',
          prevEl: '.ebook-prev',
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
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
        
        {items.map((item, index) => (
          <SwiperSlide key={item._id+index} className="!h-auto">
            <Card cardType="ebook-card" post={item} index={index} />
          </SwiperSlide>
        ))}

        {/* {items.map((item, index) => (
          <SwiperSlide key={item._id}>
            <Card cardType='ebook-card' post={item}  index={index}/>
          </SwiperSlide>
        ))} */}
      </Swiper>
    </>
  )
}

export default Carousel
