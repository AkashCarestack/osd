import { ArrowTopRightIcon } from '@sanity/icons'
import siteConfig from 'config/siteConfig'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import Wrapper from '~/layout/Wrapper'
import { generateHref, removeUnwantedCharacters } from '~/utils/common'

import Card from '../Card'
import Anchor from '../commonSections/Anchor'
import { useGlobalData } from '../Context/GlobalDataContext'
import { useBaseUrl } from '../Context/UrlContext'
import Section from '../Section'
import DescriptionText from '../typography/DescriptionText'
import H2Large from '../typography/H2Large'

interface LatestBlogsProps {
  allContent: any[]
  hideHeader?: boolean
  className?: string
  cardType?:
  | 'podcast-card'
  | 'ebook-card'
  | 'featured'
  | 'top-image-smallCard'
  | 'left-image-card'
  redirect?: boolean
  itemsPerPage?: number
  customBrowseContent?: any
  allItemCount?: any
  contentType?: string
  authorName?: string
  showCount?: boolean
  sectionType?: string
  uiType?: string
  compIndex?: number
}

const AllcontentSection: React.FC<LatestBlogsProps> = ({
  allContent,
  customBrowseContent,
  hideHeader = false,
  className,
  cardType,
  itemsPerPage,
  redirect = false,
  contentType,
  allItemCount,
  authorName,
  showCount = false,
  uiType,
  compIndex
}) => {
  const postsToShow = itemsPerPage || siteConfig.pagination.childItemsPerPage
  const [selectedTag, setSelectedTag] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const baseUrl = useBaseUrl()
  const { locale } = router.query; 
  let { homeSettings } = useGlobalData()


  const totalCount = allItemCount ? allItemCount : allContent.length

  let contentHeading =
    contentType === 'podcast'
      ? 'Keep Listening'
      : contentType === 'webinar'
        ? 'Keep Watching'
        : 'Keep Reading'

  let browseHeading = contentType
    ? contentHeading
    : authorName
      ? `Posts By ${authorName}`
      : 'Explore All'

  const uniqueCategories = allContent && Object.values(allContent.reduce((acc, item) => {
    acc[item?.category?.categoryName] = item?.category;
    return acc;
  }, {}));

  const catName =  uniqueCategories && uniqueCategories?.map((item: any) => item?.categoryName).join(', ');
  const catUrl = uniqueCategories && uniqueCategories?.map((item: any) => item?.slug?.current).join(', ');
  const catDescription = uniqueCategories &&  uniqueCategories?.map((item: any) => item?.categoryDescription).join(', ');

  
  const revampClass = uiType && uiType === 'category' ? true : false

  let categoryName =  revampClass ? catName : 'All Content'
  let categoryUrl = `/${categoryName ? `${siteConfig.categoryBaseUrls.base}/${catUrl} `: siteConfig.paginationBaseUrls.base}`

  const isBrowsePath = router.pathname.includes('browse/') || router.pathname.startsWith('/[locale]/browse')
  

  useEffect(() => {
    const updateSelectedTag = () => {

      if (isBrowsePath) {
        const pathParts = router.asPath.split('/')
        const isPageRoute = pathParts.includes('page')

        if (isPageRoute) {
          const storedTag = window.localStorage.getItem('selectedTag')
          if (storedTag && storedTag !== 'null' && storedTag !== 'undefined') {
            const cleanTag = storedTag
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
            setSelectedTag(cleanTag)
          } else {
            setSelectedTag('')
          }
        } else {
          const tagFromUrl = removeUnwantedCharacters(
            pathParts[pathParts.length - 1],
          )
          if (tagFromUrl && tagFromUrl !== 'browse') {
            const cleanTag = tagFromUrl
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
            setSelectedTag(cleanTag)
          } else {
            setSelectedTag('')
          }
        }
      } else {
        setSelectedTag('')
        window.localStorage.removeItem('selectedTag')
      }
    }

    updateSelectedTag()
  }, [router.pathname, router.asPath,isBrowsePath])  

  if((allContent?.length <= 2) && !isBrowsePath ) return null


  const renderPosts = () => {
    const posts = []
    const slicedContent = allContent.slice(0, postsToShow)
    const isHomePage = pathname === `${siteConfig.pageURLs.home}` || pathname === `/${locale}`

    slicedContent.forEach((post, index) => {
      const isVaryingIndex =
        index === 3 && cardType !== 'left-image-card' && isHomePage

      const shouldUseCustomContent = isVaryingIndex && customBrowseContent
      if (isVaryingIndex && !customBrowseContent) {
        return
      }
      const postContent = shouldUseCustomContent ? customBrowseContent : post

      posts.push(
        <div
          id={index.toString()}
          key={postContent._id || index}
          className={`${isVaryingIndex ? 'row-span-2' : ''}`}
        >
          <Card
            varyingIndex={isVaryingIndex}
            cardType={cardType}
            cardColor="white"
            post={postContent}
            className=""
            baseUrl={baseUrl}
          />
        </div>,
      )
    })

    return posts
  }
  
  return (
    <Section className={`justify-center md:pb-0 ${revampClass && compIndex === 0 ? 'md:pt-16' : revampClass ? 'md:pt-9' : 'md:pt-24'} ${!homeSettings?.eventCarousel && 'md:pb-24'} ${className}`}>  
      <Wrapper className={`flex-col ${revampClass && 'bg-zinc-100 md:p-12 p-6'}`}>
      {!hideHeader && (
        <div className={`md:flex-row flex-col gap-8 flex ${revampClass ? 'items-start' : 'items-center'} justify-between pb-12 `}>
          {!pathname.includes(`/${siteConfig.categoryBaseUrls.base}/`) &&  <div className='flex flex-col gap-4'>
            <H2Large className="tracking-tighterText select-none">
              {`${selectedTag ? selectedTag : revampClass ? categoryName: browseHeading } `}
            </H2Large>
            {revampClass && <DescriptionText className='text-zinc-600 md:max-w-[659px] w-full'>
              {catDescription}
            </DescriptionText>}
          </div>
          }
          {redirect ? (
            <Anchor
              href={generateHref(locale,categoryUrl)}
              className="shrink-0"
            >
              <div className="flex items-center gap-3 transform group duration-300 cursor-pointer">
                <span className="text-base font-medium">{`Browse All`}</span>
                <span className="text-xl">
                  <ArrowTopRightIcon
                    className="group-hover:translate-y-[-2px] transition-transform duration-300"
                    height={20}
                    width={20}
                  />
                </span>
              </div>
            </Anchor>
          ) : (
            !showCount  && (
              <div className="text-zinc-700 font-normal text-base shrink-0">{`${totalCount} ${totalCount > 1 ? 'results' : 'result'}`}</div>
            )
          )}
        </div>
      )}
      <div
        className={`grid 
          ${cardType === 'left-image-card'
            ? 'grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-x-6 xl:gap-x-16 gap-y-6 md:gap-y-12'
            : cardType === 'podcast-card'
              ? 'lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6 md:gap-10'
              : 'lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 md:gap-10'
          }
          }
        `}
      >
        {allContent && allContent.length > 0 ? (
          renderPosts()
        ) : (
          <div className="py-10 text-xl">
            <p>{`No matching posts found`}.</p>
          </div>
        )}
      </div>
    </Wrapper>
    </Section>
  )
}

export default AllcontentSection
