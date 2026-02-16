import React from 'react'

import Anchor from '~/components/commonSections/Anchor'
import Section from '~/components/Section'
import Wrapper from '~/layout/Wrapper'

interface HeroData {
  title: string
  titleHighlight?: string
  description: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  backgroundImage?: string
}

interface HeroSectionProps {
  heroData?: HeroData | null
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroData }) => {
  // Default dummy data
  const defaultHeroData: HeroData = {
    title: 'Centralized Resource for',
    titleHighlight: 'OS Dental & DEO Group',
    description:
      "Here you'll find product updates, onboarding guides, training materials, and key resources to support implementation and ongoing success.",
    primaryButtonText: 'Book a Clinical Demo',
    primaryButtonLink: '#',
    secondaryButtonText: 'Clinical Dashboards Overview',
    secondaryButtonLink: '#',
    backgroundImage:
      'https://cdn.sanity.io/images/rcbknqsy/production/c57bdee986c4836572b6747a44da0a80dfb21674-3058x1020.png',
  }

  // Transform Sanity data to match component interface
  const transformHeroData = (sanityData: any): HeroData | null => {
    if (!sanityData) {
      return null
    }

    return {
      title: sanityData.title || defaultHeroData.title,
      titleHighlight: sanityData.titleHighlight || defaultHeroData.titleHighlight,
      description: sanityData.description || defaultHeroData.description,
      primaryButtonText:
        sanityData.primaryButtonText || defaultHeroData.primaryButtonText,
      primaryButtonLink:
        sanityData.primaryButtonLink || defaultHeroData.primaryButtonLink,
      secondaryButtonText:
        sanityData.secondaryButtonText || defaultHeroData.secondaryButtonText,
      secondaryButtonLink:
        sanityData.secondaryButtonLink || defaultHeroData.secondaryButtonLink,
      backgroundImage:
        sanityData.backgroundImage || defaultHeroData.backgroundImage,
    }
  }

  const transformedData = heroData ? transformHeroData(heroData) : null
  const data = transformedData || defaultHeroData

  return (
    <div className="w-full flex gap-1 items-center bg-[#18181b] relative overflow-hidden pt-headerSpacerMob md:pt-headerSpacer">
      {/* Blurred background image */}
      {data.backgroundImage && (
        <div
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          style={{
            filter: 'blur(25px)',
            backgroundImage: `url(${data.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: '50%',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}

      <Section className="justify-center w-full !py-0 relative z-10">
        <Wrapper className="flex h-auto flex-col">
          <div className="flex flex-col items-start justify-center py-12 md:pt-[130px] md:pb-[96px] relative shrink-0 w-full">
            <div className="flex flex-col items-start gap-6 md:gap-[48px] relative shrink-0 w-full">
              <div className="flex flex-col md:flex-row gap-6 md:gap-[32px] items-start md:items-end relative shrink-0 text-white w-full whitespace-pre-wrap">
                {/* Main heading */}
                <h1 className="font-manrope font-bold leading-[1.1] relative shrink-0 text-3xl md:text-5xl lg:text-[64px] tracking-[-0.72px] md:tracking-[-1.28px] w-full md:w-[816px] text-white">
                  <span className="leading-[1.1]">{data.title}</span>
                  {data.titleHighlight && (
                    <>
                      <br aria-hidden="true" />
                      <span className="leading-[1.1] text-white/50">
                        {data.titleHighlight}
                      </span>
                    </>
                  )}
                  <span className="leading-[1.1]"> Partners.</span>
                </h1>

                {/* Description text */}
                <p className="flex-1 font-medium leading-[1.6] min-h-px min-w-px not-italic opacity-80 relative text-sm md:text-base text-white/80 md:max-w-none">
                  {data.description}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 items-center relative shrink-0">
                {/* Primary Button - White background */}
                <Anchor
                  href={data.primaryButtonLink || '#'}
                  className="bg-white flex items-center overflow-hidden px-6 py-3 relative rounded-[5px] shrink-0 hover:bg-zinc-100 transition-colors"
                >
                  <p className="font-medium leading-[1.6] not-italic relative shrink-0 text-[#18181b] text-base text-center whitespace-nowrap">
                    {data.primaryButtonText || 'Book a Clinical Demo'}
                  </p>
                </Anchor>

                {/* Secondary Button - Transparent with border */}
                <Anchor
                  href={data.secondaryButtonLink || '#'}
                  className="bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.3)] border-solid flex items-center overflow-hidden px-6 py-3 relative rounded-[5px] shrink-0 hover:bg-[rgba(255,255,255,0.15)] transition-colors"
                >
                  <p className="font-medium leading-[1.6] not-italic relative shrink-0 text-base text-center text-white whitespace-nowrap">
                    {data.secondaryButtonText || 'Clinical Dashboards Overview'}
                  </p>
                </Anchor>
              </div>
            </div>
          </div>
        </Wrapper>
      </Section>
    </div>
  )
}

export default HeroSection
