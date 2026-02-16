import { ArrowTopRightIcon } from '@sanity/icons'
import React from 'react'

import Anchor from '~/components/commonSections/Anchor'
import Section from '~/components/Section'
import Wrapper from '~/layout/Wrapper'

interface HeroData {
  title: string
  titleHighlight?: string
  description: string
  buttonText?: string
  buttonLink?: string
  backgroundImage?: string
}

interface HeroSectionProps {
  heroData?: HeroData
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroData }) => {
  // Default dummy data
  const defaultHeroData: HeroData = {
    title: 'Centralized Resource for',
    titleHighlight: 'OS Dental & DEO Group',
    description:
      "Here you'll find product updates, onboarding guides, training materials, and key resources to support implementation and ongoing success.",
    buttonText: 'Read Now',
    buttonLink: '#',
    backgroundImage:
      'https://cdn.sanity.io/images/rcbknqsy/production/c57bdee986c4836572b6747a44da0a80dfb21674-3058x1020.png',
  }

  const data = heroData || defaultHeroData

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
          <div className="flex flex-col items-start justify-center p-4 md:p-12 relative shrink-0 w-full">
            <div className="flex flex-col items-start gap-12 md:gap-[48px] relative shrink-0 w-full">
              <div className="flex flex-col md:flex-row gap-8 md:gap-[32px] items-start md:items-end relative shrink-0 text-white w-full whitespace-pre-wrap">
                {/* Main heading */}
                <h1 className="font-manrope font-bold leading-[1.1] relative shrink-0 text-4xl md:text-5xl lg:text-[64px] tracking-[-1.28px] w-full md:w-[816px] text-white">
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
                <p className="flex-1 font-medium leading-[1.6] min-h-px min-w-px not-italic opacity-80 relative text-base text-white/80 md:max-w-none">
                  {data.description}
                </p>
              </div>

              {/* Read Now button */}
              <Anchor
                href={data.buttonLink || '#'}
                className="flex gap-2 md:gap-[8px] items-center relative shrink-0 group"
              >
                <span className="font-medium leading-[1.6] not-italic relative shrink-0 text-[#18181b] text-base bg-white px-6 py-3 rounded-md hover:bg-zinc-100 transition-colors">
                  {data.buttonText || 'Read Now'}
                </span>
                <div className="flex items-center justify-center relative shrink-0">
                  <div className="relative size-5">
                    <ArrowTopRightIcon className="block max-w-none size-full text-[#18181b]" />
                  </div>
                </div>
              </Anchor>
            </div>
          </div>
        </Wrapper>
      </Section>
    </div>
  )
}

export default HeroSection
