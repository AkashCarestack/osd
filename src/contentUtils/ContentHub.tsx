import Link from 'next/link'
import Section from '~/components/Section'
import Wrapper from '~/layout/Wrapper'
import { ArrowTopRightIcon } from '@sanity/icons'
import H2Large from '~/components/typography/H2Large'
import siteConfig from 'config/siteConfig'
import { useState, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import DescriptionText from '~/components/typography/DescriptionText'
import TrapezIcon from '~/assets/reactiveAssets/trapezIcon'
import { useRouter } from 'next/router'
import { generateHref } from '~/utils/common'
import Anchor from '~/components/commonSections/Anchor'


interface ContentHubProps {
  contentCount?: Record<string, number>
  categories?: any[]
  featuredDescription?: string
}

export default function ContentHub({ contentCount, categories, featuredDescription }: ContentHubProps) {
  const [categoriesData, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isMainPage, setIsMainPage] = useState(false);
  const pathname = usePathname()
  const categoriesCopy = useMemo(() => categories && [...categories], [categories]);
  const router = useRouter();
  const { locale } = router.query;  

  useEffect(() => {
    const allTopic = { 'slug': `${siteConfig.categoryBaseUrls.base}`, 'categoryName': 'All Topics' }
    if (!categoriesCopy || !categoriesCopy?.find(category => category.categoryName === 'All Topics')) {
      categoriesCopy && categoriesCopy.unshift(allTopic);
    }
    setCategories(categoriesCopy);
  }, [categories, categoriesCopy]);

  useEffect(() => {
    const currentCategory = categoriesData && categoriesData.find(category => pathname.includes(category?.slug?.current));
    setCurrentCategory(currentCategory);
  }, [categoriesData, pathname]);

  useEffect(() => {
    if (pathname.endsWith(`/${siteConfig.categoryBaseUrls.base}`)) {
      setIsMainPage(true);
    } else {
      setIsMainPage(false);
    }
  }, [pathname]);


  return (
    <Section className={`bg-zinc-900 relative h-full justify-center ${categoriesData ? 'md:pt-24 pb-16' : 'md:pt-12 pb-6'} md:pt-headerSpacer pt-headerSpacerMob`}>
      {categoriesData && <div className='absolute top-0 right-0 h-full 2xl:visible invisible   '>
      <TrapezIcon/>
      </div>}
      <Wrapper className={`flex-col ${categoriesData ? 'gap-12' : 'gap-3'}   w-full`}>
        <div className='flex flex-col gap-3'>
          <H2Large className="text-zinc-100">{categoriesData?.length > 0 && isMainPage ? 'All Topics' : categoriesData?.length > 0 && !isMainPage ? currentCategory?.categoryName : 'Browse Content'}</H2Large>
          {(featuredDescription || currentCategory) && (
            <DescriptionText className='text-white opacity-70 md:max-w-[598px] w-full'>
              {featuredDescription || currentCategory.categoryDescription}
            </DescriptionText>
          )}
        </div>
        {categoriesData && categoriesData.length > 0 ? (
          <div className='flex flex-wrap gap-[10px] '>
            {categoriesData.map((category, index) => {
              let hrefTemplate = `/${category?.categoryName === 'All Topics'
                 ? `${siteConfig.categoryBaseUrls.base}` : category?.categoryName 
                 ? `${siteConfig.categoryBaseUrls.base}/${category?.slug.current} ` 
                 : siteConfig.categoryBaseUrls.base}`
            return (
              <Anchor
              className={`text-zinc-300 flex items-center  text-sm font-normal py-2 px-3 
                rounded-full bg-zinc-800 hover:bg-zinc-700 transition-all ease-out duration-300 ${pathname.endsWith(`/${siteConfig.categoryBaseUrls.base}`) && index === 0 ? '!bg-zinc-600 !text-zinc-50' : pathname.includes(category?.slug?.current) ? '!bg-zinc-600 !text-zinc-50' : ''}`}
              href={generateHref(locale as string, hrefTemplate)}
              key={index}
              >
              {category.categoryName}
              </Anchor>
            )})}
          </div>

        ) : (
          <div className="flex-1 overflow-hidden">
            <div className={`flex md:gap-x-8 relative md:justify-between flex-wrap gap-6 justify-center`}>
              <div className="text-zinc-400 flex flex-wrap gap-3">
                {Object.entries(contentCount).length > 0 ? ( 
                  Object.entries(contentCount).map(([key, count], index) => {
                    const singularKey = key.endsWith('s') ? key.slice(0, -1) : key
                    const url = siteConfig.pageURLs[singularKey] || '/'
                    return (
                      <Anchor href={generateHref(locale as string, url)} key={index} className="hover:text-zinc-300 text-sm md:text-base">
                        {count}{' '}
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                        <span className="hidden md:inline ml-3 ">
                          {index < Object.entries(contentCount).length - 1 && ' • '}
                        </span>
                      </Anchor>
                    )
                  })
                ) : (
                  <div>No content available</div>
                )}
              </div>
              <Anchor
                href={ generateHref(locale as string, siteConfig.paginationBaseUrls.base)}
                className=" text-[14px] group font-medium leading-[1.5] justify-center  flex items-center gap-x-1 group"
              >
                <span className="hidden md:inline mr-3">{' • '}</span>
                <span className="text-[14px] md:text-[16px] cursor-pointer text-zinc-400 font-medium text-sm hover:text-zinc-300 inline-flex items-center gap-1">
                  {'Browse All'}
                  <ArrowTopRightIcon
                    className="group-hover:translate-y-[-2px] transition-transform duration-300"
                    height={20}
                    width={20}
                  />
                </span>
              </Anchor>
            </div>
          </div>
        )}
      </Wrapper>
    </Section>
  )
}