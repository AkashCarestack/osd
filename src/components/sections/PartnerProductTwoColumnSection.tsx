import React from 'react'

import Section from '~/components/Section'
import Wrapper from '~/layout/Wrapper'

export interface PartnerProductFeature {
  title: string
  description: string
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

const SHOWCASE_CARD_BG = '#dae7ff'

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

const ShowcaseFeatureCard: React.FC<{ feature: PartnerProductFeature }> = ({
  feature,
}) => (
  <article
    className="flex h-full min-h-0 flex-col rounded-2xl border border-indigo-200/60 p-6 shadow-sm md:p-7"
    style={{ backgroundColor: SHOWCASE_CARD_BG }}
  >
    <div className="flex min-h-0 flex-1 flex-col gap-0 text-left">
      <h3 className="mb-[20px] font-manrope text-[24px] font-bold leading-snug text-[#18181B]">
        {feature.title}
      </h3>
      <p className="font-inter text-base font-normal leading-[1.65] text-zinc-700">
        {feature.description}
      </p>
    </div>
  </article>
)

export interface PartnerProductTwoColumnSectionProps {
  eyebrow: string
  headline: string
  features: PartnerProductFeature[]
  /** Pearl-style LP: centered header + image-top feature columns (Curve). */
  variant?: 'default' | 'showcase'
}

const PartnerProductTwoColumnSection: React.FC<
  PartnerProductTwoColumnSectionProps
> = ({ eyebrow, headline, features, variant = 'default' }) => {
  const gridCols =
    features.length >= 3
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 md:grid-cols-2'
  const isShowcase = variant === 'showcase'

  return (
    <Section
      className={`justify-center md:!pt-20 md:!pb-24 !py-12 ${
        isShowcase ? 'bg-white' : 'bg-zinc-100'
      }`}
    >
      <Wrapper className="flex flex-col gap-10 md:gap-14">
        <div
          className={`flex flex-col gap-3 w-full ${
            isShowcase
              ? 'items-center text-center max-w-[820px] mx-auto'
              : 'items-start max-w-[720px]'
          }`}
        >
          {eyebrow?.trim() && (
            <p
              className={`text-xs md:text-sm font-semibold tracking-[0.12em] uppercase ${
                isShowcase ? 'text-indigo-600' : 'text-zinc-500'
              }`}
            >
              {eyebrow.trim()}
            </p>
          )}
          <h2 className="w-full text-[28px] md:text-[40px] lg:text-[48px] text-[#18181B] font-manrope font-extrabold not-italic md:leading-[110%] leading-[1.08] tracking-[-0.96px]">
            {headline}
          </h2>
        </div>
        <div
          className={`grid ${gridCols} gap-6 md:gap-8 w-full items-stretch`}
        >
          {features.map((feature, index) =>
            isShowcase ? (
              <ShowcaseFeatureCard key={index} feature={feature} />
            ) : (
              <FeatureCard key={index} feature={feature} />
            ),
          )}
        </div>
      </Wrapper>
    </Section>
  )
}

export default PartnerProductTwoColumnSection
