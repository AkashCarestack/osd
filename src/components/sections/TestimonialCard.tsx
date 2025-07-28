import React from 'react'

import ChordIcon from '~/assets/reactiveAssets/ChordIcon'

import AuthorInfo from '../commonSections/AuthorInfo'
import DescriptionText from '../typography/DescriptionText'
import H3Medium from '../typography/H3Medium'

interface TestimonialCardProps {
  testimonial: any
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ ...props }: any) => {
  const customerDetails = props.testimonialCard?.testimonial?.customerDetails

  return (
    <div className="w-full p-6 md:p-8 flex flex-col gap-2 rounded-lg bg-zinc-100 border-zinc-300">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col ">
          <ChordIcon />
          <H3Medium className="!m-0 py-6">
            {props?.testimonialCard?.testimonial.testimonialName}
          </H3Medium>
          <DescriptionText className="text-zinc-700 !m-0 line-clamp-2 overflow-hidden">
            {props?.testimonialCard?.testimonial.excerpt}
          </DescriptionText>
        </div>
        <div className="pt-6 border-t-2 border-zinc-200 pointer-events-none">
          <AuthorInfo isParentLink={true} author={[customerDetails]} />
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard
