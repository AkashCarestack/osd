import React from 'react'

import Section from '~/components/Section'
import Wrapper from '~/layout/Wrapper'

export interface PartnerProductFeature {
  title: string
  description: string
}

interface PartnerProductTwoColumnSectionProps {
  eyebrow: string
  headline: string
  features: PartnerProductFeature[]
}

const CheckIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    aria-hidden
  >
    <circle cx="12" cy="12" r="12" fill="#4F46E5" />
    <path
      d="M8 12.5L10.5 15L16 9.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const FeatureCard: React.FC<{ feature: PartnerProductFeature }> = ({
  feature,
}) => (
  <div className="bg-white flex flex-col gap-6 items-start p-6 rounded-[10px] flex-1 min-w-0">
    <div className="flex items-center py-[2.4px]">
      <CheckIcon />
    </div>
    <div className="flex flex-col gap-2 items-start w-full">
      <h3 className="font-manrope font-bold text-base leading-[1.2] text-gray-900 w-full">
        {feature.title}
      </h3>
      <p className="font-inter text-base font-normal leading-[1.6] text-gray-600 w-full">
        {feature.description}
      </p>
    </div>
  </div>
)

const PartnerProductTwoColumnSection: React.FC<
  PartnerProductTwoColumnSectionProps
> = ({ eyebrow, headline, features }) => {
  return (
    <Section className="bg-zinc-100 justify-center md:!pt-20 md:!pb-24 !py-12">
      <Wrapper className="flex flex-col gap-10 md:gap-12">
        <div className="flex flex-col gap-3 items-start w-full max-w-[720px]">
          <p className="text-xs md:text-sm font-semibold tracking-[0.12em] text-zinc-500 uppercase">
            {eyebrow}
          </p>
          <h2 className="w-full text-[28px] md:text-[40px] lg:text-[48px] text-[#18181B] font-manrope font-extrabold not-italic md:leading-[110%] leading-[1.08] tracking-[-0.96px]">
            {headline}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </Wrapper>
    </Section>
  )
}

export default PartnerProductTwoColumnSection
