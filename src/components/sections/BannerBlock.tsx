import { useRouter } from 'next/router'
import React from 'react'

import Button from '../commonSections/Button'
import DescriptionText from '../typography/DescriptionText'
import H3Medium from '../typography/H3Medium'

interface BannerBlockProps {
  bannerBlock?: {
    title?: string
    buttonText?: string
    description?: string
  }
  bannerBlockUS?: {
    title?: string
    buttonText?: string
    description?: string
  }
  bannerBlockGB?: {
    title?: string
    buttonText?: string
    description?: string
  }
  bannerBlockAU?: {
    title?: string
    buttonText?: string
    description?: string
  }
  commonBannerBlock?: {
    title?: string
    buttonText?: string
    description?: string
    buttonLink?: string
  }
  componentType?: string
}

const BannerBlock: React.FC<BannerBlockProps> = ({
  bannerBlock,
  bannerBlockUS,
  bannerBlockGB,
  bannerBlockAU,
  commonBannerBlock,
  componentType,
}) => {
  const router = useRouter()
  const locale = (router.query?.locale as string) || router.locale || 'en'

  // Determine which banner block data to use based on componentType
  let activeBannerBlock = bannerBlock
  let demoUrl = 'https://voicestack.com/demo?practiceType=Dental' // Default US URL

  if (componentType === 'commonBannerBlock') {
    activeBannerBlock = commonBannerBlock
    demoUrl = commonBannerBlock?.buttonLink || 'https://voicestack.com/demo?practiceType=Dental'
  } else if (componentType === 'bannerBlockUS' || !componentType) {
    activeBannerBlock = bannerBlockUS || bannerBlock
    demoUrl = 'https://voicestack.com/demo?practiceType=Dental'
  } else if (componentType === 'bannerBlockGB') {
    activeBannerBlock = bannerBlockGB
    demoUrl = 'https://voicestack.com/en-GB#demo'
  } else if (componentType === 'bannerBlockAU') {
    activeBannerBlock = bannerBlockAU
    demoUrl = 'https://voicestack.com/en-AU#demo'
  } else {
    // Fallback: determine URL based on locale if componentType is not set
    if (locale === 'en-GB') {
      demoUrl = 'https://voicestack.com/en-GB#demo'
    } else if (locale === 'en-AU') {
      demoUrl = 'https://voicestack.com/en-AU#demo'
    } else {
      demoUrl = 'https://voicestack.com/demo?practiceType=Dental'
    }
  }

  return (
    <div className="flex flex-1 bg-zinc-800 md:flex-row flex-col rounded-lg p-6 md:p-8 my-8 gap-6 justify-between">
      <div className="flex flex-col justify-center">
        <H3Medium className="!text-white !mt-0 !text-3xl !font-semibold leading-[110%] block !mb-[6px]">
          {activeBannerBlock?.title ? activeBannerBlock?.title : 'Book a demo with us!'}
        </H3Medium>
        <DescriptionText className="!text-zinc-300  !text-base !m-0">
          {activeBannerBlock?.description
            ? activeBannerBlock?.description
            : 'Looking for the best AI-powered phone system for your dental practice?'}
        </DescriptionText>
      </div>
      <div className="self-start md:self-center flex justify-center">
        <Button
          className="hover:!bg-zinc-200 !bg-white !no-underline mx-auto"
          target="_blank"
          link={demoUrl}
        >
          <span className="text-base font-medium">
            {activeBannerBlock?.buttonText
              ? activeBannerBlock?.buttonText
              : 'Book Free Demo'}
          </span>
        </Button>
      </div>
    </div>
  )
}

export default BannerBlock
