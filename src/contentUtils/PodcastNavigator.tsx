import { ArrowLeftIcon,ArrowRightIcon } from '@sanity/icons'
import siteConfig from 'config/siteConfig'
import Link from 'next/link'

import Anchor from '~/components/commonSections/Anchor'
import Section from '~/components/Section'
import Wrapper from '~/layout/Wrapper'

interface PodcastNavigatorProps {
  nextSlug: string
  prevSlug: string
  currentNumber: number
  totalPodcasts: number
  className?: string
}

export default function PodcastNavigator({
  className,
  nextSlug,
  prevSlug,
  currentNumber,
  totalPodcasts,
}: PodcastNavigatorProps) {
  if (!nextSlug || !prevSlug) {
    return
  }

  const prevNumber = currentNumber > 1 ? currentNumber - 1 : totalPodcasts
  const nextNumber = currentNumber < totalPodcasts ? currentNumber + 1 : 1

  return (
    <Section className="justify-center md:pt-4 md:pb-0 ">
      <Wrapper>
        <div
          className={` ${className} md:flex-row  flex justify-between items-center w-full border-b py-6 border-zinc-200  text-zinc-500 font-medium text-sm md:text-base`}
        >
          <Anchor href={`/${siteConfig.pageURLs.podcast}/${prevSlug}`}>
            <div className="flex items-center ">
              <ArrowLeftIcon
                style={{ strokeWidth: 2 }}
                width={24}
                height={24}
              />
              <span className="ml-1">
                PODCAST {prevNumber.toString().padStart(2, '0')}
              </span>
            </div>
          </Anchor>
          <Anchor href={`/${siteConfig.pageURLs.podcast}/${nextSlug}`}>
            <div className="flex items-center">
              <span className="mr-1 ">
                PODCAST {nextNumber.toString().padStart(2, '0')}
              </span>
              <ArrowRightIcon
                style={{ strokeWidth: 2 }}
                width={24}
                height={24}
              />
            </div>
          </Anchor>
        </div>
      </Wrapper>
    </Section>
  )
}
