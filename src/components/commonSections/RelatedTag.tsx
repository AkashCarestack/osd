import siteConfig from 'config/siteConfig'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { generateHref } from '~/utils/common'

import Section from '../Section'
import DescriptionText from '../typography/DescriptionText'
import Anchor from './Anchor'

interface RelatedTagProps {
  tags?: any
  className?: string
}

const RelatedTag = ({ tags, className }: RelatedTagProps) => {
    const router = useRouter();
    const { locale } = router.query; 
  
  if (!tags.length) {
    return null
  }

  return (
    <Section className={`justify-center border-t border-zinc-200 !p-0 !pt-4 !pb-0 md:!mt-4  ${className}`}>
      <div className='w-full  md:flex-row flex  flex-wrap md:gap-4 gap-2'>
        <DescriptionText className='text-zinc-900 font-medium   pb-2 md:pb-0 flex w-full items-center pr-[14px]'>{`Related Tags`}</DescriptionText>
        {tags && tags.length > 0 && tags.map((tag: any,index) => {
          // const hrefLink = `/${prefLocale}/${siteConfig.paginationBaseUrls.base}/${tag?.slug?.current ? tag?.slug?.current : ''}`cons
          let hrefTemplate = `${siteConfig.paginationBaseUrls.base}/${tag?.slug?.current ? tag?.slug?.current : ''}`
          const hrefLink = generateHref(locale as string, hrefTemplate)
          return (
            <Anchor className='rounded-md bg-zinc-100  md:px-4 md:py-[5px]  px-2 py-[3px]   hover:bg-zinc-200 transition-all duration-300 ease-in-out' 
            href={hrefLink} key={tag?.slug?.current} > 
              <DescriptionText className={`text-zinc-600 font-normal  md:text-base text-xs`}>
              {tag.tagName}
              </DescriptionText>
              </Anchor>
          )
        })}
      </div>
    </Section>
  )
}

export default RelatedTag
