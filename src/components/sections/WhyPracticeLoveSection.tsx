import React from 'react'

import Anchor from '~/components/commonSections/Anchor'
import Section from '~/components/Section'
import Wrapper from '~/layout/Wrapper'

interface Feature {
  title: string
  description: string
}

interface WhyPracticeLoveData {
  title: string
  description: string
  features: Feature[]
  ctaTitle: string
  ctaDescription: string
  ctaButtonText: string
  ctaButtonLink: string
  ctaBackgroundImage?: string
}

interface WhyPracticeLoveSectionProps {
  data?: WhyPracticeLoveData | null
}

const CheckIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
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

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
  return (
    <div className="bg-white flex flex-col gap-6 items-start p-6 rounded-[10px] flex-1 min-w-[220px]">
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
}

const WhyPracticeLoveSection: React.FC<WhyPracticeLoveSectionProps> = ({ data }) => {
  // Default data
  const defaultData: WhyPracticeLoveData = {
    title: 'Why Practices Love Clinical Dashboards',
    description:
      'Clinical Dashboards give your practice a powerful, visual snapshot of key clinical performance metrics and insights all in one easy-to-use view. No spreadsheets. No guesswork. Just clear insights that help you move faster and improve performance.',
    features: [
      {
        title: 'See performance at a glance',
        description:
          'Instant visibility into trends across providers, procedures, and locations.',
      },
      {
        title: 'Spot growth opportunities faster',
        description:
          'Quickly identify gaps, inconsistencies, and areas for clinical improvement.',
      },
      {
        title: 'Align clinical excellence with business success',
        description:
          'Connect performance metrics to practice goals without compromising patient care.',
      },
      {
        title: 'Make confident, data-driven decisions',
        description:
          'Simple, intuitive visuals make it easy for your team to understand and take action.',
      },
    ],
    ctaTitle: 'Ready to see it in action?',
    ctaDescription:
      "Book a demo with a member of our OS Dental team to learn how Clinical Dashboards can support your practice's growth.",
    ctaButtonText: 'Book a Clinical Demo',
    ctaButtonLink: '#',
    ctaBackgroundImage:
      'https://cdn.sanity.io/images/rcbknqsy/production/c57bdee986c4836572b6747a44da0a80dfb21674-3058x1020.png',
  }

  // Same background image as HeroSection
  const heroBackgroundImage =
    'https://cdn.sanity.io/images/rcbknqsy/production/c57bdee986c4836572b6747a44da0a80dfb21674-3058x1020.png'

  // Transform Sanity data to match component interface
  const transformData = (sanityData: any): WhyPracticeLoveData | null => {
    if (!sanityData) {
      return null
    }

    return {
      title: sanityData.title || defaultData.title,
      description: sanityData.description || defaultData.description,
      features:
        sanityData.features && sanityData.features.length > 0
          ? sanityData.features
          : defaultData.features,
      ctaTitle: sanityData.ctaTitle || defaultData.ctaTitle,
      ctaDescription: sanityData.ctaDescription || defaultData.ctaDescription,
      ctaButtonText: sanityData.ctaButtonText || defaultData.ctaButtonText,
      ctaButtonLink: sanityData.ctaButtonLink || defaultData.ctaButtonLink,
      ctaBackgroundImage: sanityData.ctaBackgroundImage || defaultData.ctaBackgroundImage,
    }
  }

  const transformedData = data ? transformData(data) : null
  const sectionData = transformedData || defaultData

  return (
    <Section className="bg-zinc-100 justify-center md:pt-24 md:pb-16 !py-12">
      <Wrapper className="flex flex-col gap-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-9 lg:items-end w-full">
          <div className="flex flex-col gap-3 items-start justify-center w-full lg:max-w-[601px]">
            <h2 className="w-full text-[28px] md:text-[40px] lg:text-[48px] text-zinc-900 font-manrope font-extrabold not-italic leading-[110%] tracking-[-0.96px]">
              {sectionData.title}
            </h2>
            <p className="w-full opacity-80 text-zinc-900 font-inter text-base not-italic font-medium leading-[160%]">
              {sectionData.description}
            </p>
          </div>
        </div>

        {/* Features and CTA Section */}
        <div className="flex flex-col gap-8 items-start w-full">
          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {sectionData.features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>

          {/* CTA Banner */}
          <div className="bg-[#01061e] flex flex-col md:flex-row gap-8 md:gap-[72px] items-center overflow-hidden p-6 md:p-8 rounded-[10px] w-full relative">
            {/* Blurred background image - using same image as HeroSection */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
              style={{
                filter: 'blur(25px)',
                backgroundImage: `url(${sectionData.ctaBackgroundImage || heroBackgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'right center',
                backgroundRepeat: 'no-repeat',
              }}
            />

            {/* Content */}
            <div className="flex flex-col gap-2 items-start flex-1 relative z-10">
              <h3 className="font-manrope font-semibold text-xl md:text-2xl leading-[1.2] text-white w-full">
                {sectionData.ctaTitle}
              </h3>
              <p className="font-inter text-base font-normal leading-[1.6] text-gray-50 w-full">
                {sectionData.ctaDescription}
              </p>
            </div>

            {/* CTA Button */}
            <Anchor
              href={sectionData.ctaButtonLink}
              className="bg-white flex items-center overflow-hidden px-6 py-3 rounded-[5px] shrink-0 hover:bg-zinc-100 transition-colors relative z-10"
            >
              <span className="font-inter font-medium text-base leading-[1.6] text-zinc-900 text-center whitespace-nowrap">
                {sectionData.ctaButtonText}
              </span>
            </Anchor>
          </div>
        </div>
      </Wrapper>
    </Section>
  )
}

export default WhyPracticeLoveSection
