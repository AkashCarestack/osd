import Link from 'next/link'
import React from 'react'
import Button from '../commonSections/Button'
import H3Medium from '../typography/H3Medium'
import DescriptionText from '../typography/DescriptionText'

interface BannerBlockProps {
  bannerBlock?: {
    title?: string
    buttonLink?: string
    buttonText?: string
    description?: string
  }
}

const BannerBlock: React.FC<BannerBlockProps> = ({ bannerBlock }) => {
  return (
    <div className="flex flex-1 bg-zinc-800 md:flex-row flex-col rounded-lg p-6 md:p-8 my-8 gap-6 justify-between">
      <div className="flex flex-col justify-center">
        <H3Medium className="!text-white !mt-0 !text-3xl !font-semibold leading-[110%] block !mb-[6px]">
          {bannerBlock?.title ? bannerBlock?.title : 'Book a demo with us!'}
        </H3Medium>
        <DescriptionText className="!text-zinc-300  !text-base !m-0">
          {bannerBlock?.description
            ? bannerBlock?.description
            : 'Learn how we can help you reduce claim rejections and denials.'}
        </DescriptionText>
      </div>
      <div className="self-start md:self-center flex justify-center">
        <Button
          className="hover:!bg-zinc-200 !bg-white !no-underline mx-auto"
          link={
            bannerBlock?.buttonLink
              ? bannerBlock?.buttonLink
              : 'https://voicestack.com/?refer=carestack'
          }
        >
          <span className="text-base font-medium">
            {bannerBlock.buttonText ? bannerBlock.buttonText : 'Book Free Demo'}
          </span>
        </Button>
      </div>
    </div>
  )
}

export default BannerBlock
