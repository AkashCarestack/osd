import { ArrowTopRightIcon } from '@sanity/icons'
import siteConfig from 'config/siteConfig'
import Link from 'next/link'
import React from 'react'

import Wrapper from '~/layout/Wrapper'

import Card from '../Card'
import Anchor from '../commonSections/Anchor'
import Section from '../Section'
import H2Large from '../typography/H2Large'

interface LatestBlogsProps {
  testimonials?: any[]
}

const ReviewsGrid: React.FC<LatestBlogsProps> = (testimonials) => {
  if (!testimonials) return null
  const allTestimonials = testimonials?.testimonials

  return (
    <Section className="justify-center !bg-zinc-200">
      <Wrapper className="w-full flex-col">
        <div className="flex justify-between items-center mb-8">
          <H2Large className="tracking-tighterText select-none">
            {`${'Reviews'} `}
          </H2Large>
          <Anchor href={siteConfig.externalLinks.reviews} target="_blank">
            <div className="flex items-center gap-3 transform group duration-300 cursor-pointer">
              <span className="text-base font-medium">{`More Reviews`}</span>
              <span className="text-xl">
                <ArrowTopRightIcon
                  className="group-hover:translate-y-[-2px] transition-transform duration-300"
                  height={20}
                  width={20}
                />
              </span>
            </div>
          </Anchor>
        </div>

        <div className="w-full overflow-hidden columns-1 md:columns-2 lg:columns-3 gap-6">
          {allTestimonials.map((blog, index) => (
            <div
              key={index}
              className={`break-inside-avoid mb-6 ${index === 1 || index === 4 ? 'md:transform md:translate-y-[]' : ''}`}
            >
              <Card cardType="review-card" key={index} post={blog} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </Wrapper>
    </Section>
  )
}

export default ReviewsGrid
