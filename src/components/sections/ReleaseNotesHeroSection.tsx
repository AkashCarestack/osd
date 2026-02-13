import { ArrowTopRightIcon } from '@sanity/icons'
import React from 'react'

import Wrapper from '~/layout/Wrapper'
import Section from '~/components/Section'
import Anchor from '~/components/commonSections/Anchor'
import { formatDateShort } from '~/utils/formateDate'
import { Articles } from '~/interfaces/post'
import siteConfig from 'config/siteConfig'

interface ReleaseNotesHeroSectionProps {
  releaseNotes?: Articles[]
  buttonText?: string
  buttonLink?: string
}

const ReleaseNotesHeroSection: React.FC<ReleaseNotesHeroSectionProps> = ({
  releaseNotes = [],
  buttonText = 'Read Now',
  buttonLink,
}) => {
  const baseUrl = `/${siteConfig.pageURLs.releaseNotes}`
  const linkUrl = buttonLink || baseUrl

  // Get first 3 release notes for the cards
  const featuredReleaseNotes = releaseNotes.slice(0, 3)

  return (
    <div className="w-full flex gap-1 items-center bg-[#18181b] relative overflow-hidden pt-headerSpacerMob md:pt-headerSpacer">
      <Section className="justify-center w-full !py-0 relative z-10">
        <Wrapper className="flex h-auto flex-col">
          <div className="flex flex-col items-start justify-center p-4 md:p-12 relative shrink-0 w-full">
            <div className="flex flex-col items-start gap-12 md:gap-[48px] relative shrink-0 w-full">
              {/* Header with title and button */}
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-[32px] relative shrink-0 text-white w-full">
                {/* Main heading */}
                <h1 className="font-manrope font-extrabold leading-[1.1] relative shrink-0 text-4xl md:text-5xl lg:text-[48px] tracking-[-0.96px] w-full md:w-[709px] text-white">
                  Release Notes
                </h1>

                {/* Read Now button */}
                <Anchor
                  href={linkUrl}
                  className="flex gap-2 md:gap-[8px] items-center relative shrink-0 group"
                >
                  <span className="font-medium leading-[1.6] not-italic relative shrink-0 text-[#18181b] text-base bg-white px-6 py-3 rounded-md hover:bg-zinc-100 transition-colors">
                    {buttonText}
                  </span>
                  <div className="flex items-center justify-center relative shrink-0">
                    <div className="relative size-5">
                      <ArrowTopRightIcon className="block max-w-none size-full text-[#18181b]" />
                    </div>
                  </div>
                </Anchor>
              </div>

              {/* Release Notes Cards */}
              {featuredReleaseNotes.length > 0 && (
                <div className="flex flex-col md:flex-row gap-8 md:gap-[32px] items-stretch relative shrink-0 w-full">
                  {featuredReleaseNotes.map((releaseNote, index) => {
                    const releaseNoteWithDate = releaseNote as Articles & { date?: any; desc?: string }
                    const releaseDate = releaseNoteWithDate.date
                      ? formatDateShort(releaseNoteWithDate.date).trim()
                      : ''
                    const slug = releaseNote.slug?.current
                      ? `/${siteConfig.pageURLs.releaseNotes}/${releaseNote.slug.current}`
                      : '#'

                    return (
                      <Anchor
                        key={releaseNote._id || index}
                        href={slug}
                        className="border border-[rgba(255,255,255,0.15)] border-solid flex flex-1 flex-col gap-6 md:gap-[24px] items-start p-6 md:p-[24px] relative rounded-[10px] hover:border-[rgba(255,255,255,0.3)] transition-colors"
                      >
                        <div className="flex flex-col gap-2 md:gap-[8px] items-start relative shrink-0 w-full">
                          {/* Release Notes Badge */}
                          <div className="bg-[rgba(255,255,255,0.1)] flex items-center justify-center px-2 md:px-[8px] py-1 md:py-[4px] relative rounded-[4px] shrink-0">
                            <p className="font-medium leading-[1.5] not-italic opacity-70 relative shrink-0 text-xs md:text-[12px] text-white tracking-[0.6px] uppercase">
                              Release Notes
                            </p>
                          </div>
                          {/* Version Title */}
                          <p className="font-manrope font-bold leading-[1.3] w-full overflow-hidden relative shrink-0 text-xl md:text-[24px] text-[#93c5fd] tracking-[-0.24px] line-clamp-2">
                            {releaseNote.title || 'OS Dental V5.12'}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 md:gap-[8px] items-start not-italic relative shrink-0 text-white w-full">
                          {/* Updated Date */}
                          {releaseDate && (
                            <div className="flex font-medium gap-2 md:gap-[8px] items-center leading-[1.5] relative shrink-0 text-sm md:text-[14px] w-full">
                              <p className="relative shrink-0">Updated :</p>
                              <p className="relative shrink-0">{releaseDate}</p>
                            </div>
                          )}
                          {/* Description */}
                          <p className="font-normal leading-[1.6] opacity-70 overflow-hidden relative shrink-0 text-base md:text-[16px] w-full line-clamp-3">
                            {releaseNote.excerpt ||
                              releaseNoteWithDate.desc ||
                              'This update brings enhanced features and improved performance for a smoother experience.'}
                          </p>
                        </div>
                      </Anchor>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </Wrapper>
      </Section>
    </div>
  )
}

export default ReleaseNotesHeroSection
