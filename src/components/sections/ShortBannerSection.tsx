import { ArrowTopRightIcon } from '@sanity/icons'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import eventBanner from '../../assets/event-banner.svg'
import icLogo from '../../assets/inner-circle.svg'
import Wrapper from '../../layout/Wrapper'
import Anchor from '../commonSections/Anchor'

function ShortBannerSection() {
  return (
    <section className="flex justify-center px-4 ">
      <Wrapper>
        <Anchor
          href={'https://carestack.com/company/events/inner-circle-2025'}
          target="_blank"
          className="group w-full"
        >
          <div
            className={`flex flex-col lg:flex-row lg:items-center p-8 lg:p-16 gap-6 lg:gap-20 rounded-lg 
                        bg-[#ADEDFE] justify-center my-8 md:my-12 
                        bg-[url('/assets/event-banner.svg')] bg-cover bg-center hover:bg-[#a2e9fd] transition-all duration-300 ease`}
          >
            <Image alt="Inner Circle" title="Inner Circle" src={icLogo} />
            <div className="flex flex-1 md:gap-x-16 gap-x-6 md:items-center lg:justify-center">
              <h2 className="text-zinc-900 text-xl md:text-4xl font-extrabold font-manrope tracking-[-0.72px]">{`Get your Early Bird tickets before they're gone!`}</h2>
              <ArrowTopRightIcon className="flex-shrink-0 w-10 h-10 md:w-28 md:h-28 group-hover:-translate-y-3 transition-transform duration-300 ease-in-out "></ArrowTopRightIcon>
            </div>
          </div>
        </Anchor>
      </Wrapper>
    </section>
  )
}

export default ShortBannerSection
