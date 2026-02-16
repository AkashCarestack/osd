import { ArrowTopRightIcon } from '@sanity/icons'
import siteConfig from 'config/siteConfig'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import router from 'next/router'
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react'

import ChordIcon from '~/assets/reactiveAssets/ChordIcon'
import { Post } from '~/interfaces/post'
import { capitalizeFirst } from '~/utils/common'
import { getBasePath } from '~/utils/getBasePath'

import PlayIcon from '../assets/reactiveAssets/PlayIcon'
import SoundIcon from '../assets/speakerIcon.svg'
import Anchor from './commonSections/Anchor'
import AnimatingWrapper from './commonSections/AnimatingWrapper'
import AuthorInfo from './commonSections/AuthorInfo'
import CreaterInfo from './commonSections/CreaterInfo'
import DurationSection from './commonSections/DurationSection'
import ImageLoader from './commonSections/ImageLoader'
import { VideoModal } from './commonSections/VideoModal'
import DescriptionText from './typography/DescriptionText'
import H3Large from './typography/H3Large'
import H3Medium from './typography/H3Medium'
import H3XL from './typography/H3XL'
import H4Large from './typography/H4Large'
import H4Medium from './typography/H4Medium'
import SubText from './typography/SubText'

interface CardProps {
  post: Post
  cardType?:
  | 'top-image-card'
  | 'text-only-card'
  | 'left-image-card'
  | 'ebook-card'
  | 'featured'
  | 'top-image-smallCard'
  | 'podcast-card'
  | 'top-image-contentType-card'
  | 'review-card'
  className?: string
  cardColor?: string
  showPlayIcon?: boolean
  isLast?: boolean
  varyingIndex?: any
  reverse?: boolean
  index?: number
  baseUrl?: string
  contentType?:
  | 'ebook'
  | 'article'
  | 'podcast'
  | 'webinar'
  | 'case-study'
  | 'press-release'
  minHeight?: number
  alignCard?: any
}

export default function Card({
  post,
  isLast,
  cardType,
  reverse,
  className,
  cardColor,
  varyingIndex,
  showPlayIcon = false,
  index,
  baseUrl,
  minHeight,
  alignCard,
}: CardProps) {
  const [linkUrl, setLinkUrl] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [color, setColor] = useState<string | null>(null)
  const [isPageUrl, setIsPageUrl] = useState<boolean>(false)
  const pathname = usePathname()
  const router = useRouter();

  const bgImages = [
    {
      src: 'https://cdn.sanity.io/images/bbmnn1wc/production/69f78e1d2126dda19c732337893448dc94969932-784x568.png',
    },
    {
      src: 'https://cdn.sanity.io/images/bbmnn1wc/production/880ec674fe4f1672dbc1bbfebf0ba967b7941900-784x568.png',
    },
    {
      src: 'https://cdn.sanity.io/images/bbmnn1wc/production/30ff45d24d2f4688f1885c96fecc94d319eb76d0-784x568.png',
    },
    {
      src: 'https://cdn.sanity.io/images/bbmnn1wc/production/baf2c5ede0b78146b13c4ac8854d5459fdd1bb7c-2400x1350.jpg',
    },
    {
      src: 'https://cdn.sanity.io/images/bbmnn1wc/production/8df81deaa98d4958936163340be7b77f798d1dcf-2500x2000.jpg',
    },
  ]
  const imageIndex = index % bgImages.length
  // const image = bgImages[imageIndex];
  const tag = useMemo(
    () => post?.tags?.find((tag) => tag) || null,
    [post?.tags],
  )
  const pageURLs = Object.values(siteConfig.pageURLs)

  useEffect(() => {
    const normalizedBaseUrl = baseUrl?.replace(/^\/+/, '')

    const isRouterUrl = pageURLs.some((url) => pathname.includes(url))
    const isPageUrlLink = pageURLs?.includes(normalizedBaseUrl)
    setIsPageUrl(isPageUrlLink ? isPageUrlLink : isRouterUrl)
  }, [pathname, baseUrl, pageURLs])

  useEffect(() => {
    if (router.isReady && post?.slug) {
      const { locale = 'en' } = router.query;
      
      // Prioritize content type route format to include content type (e.g., "podcast") in URL
      const contentTypePath = getBasePath(router, post.contentType);
      const contentSlug = post?.slug?.current?.replace(/^\/+/, '').replace(/\/+$/, '') || '';
      
      // If content type path exists (e.g., "podcast", "article"), use it
      if (contentTypePath) {
        const normalizedContentPath = contentTypePath.replace(/^\/+/, '').replace(/\/+$/, '');
        
        const newLinkUrl = varyingIndex
          ? locale === 'en' 
            ? `/${normalizedContentPath}`
            : `/${locale}/${normalizedContentPath}`
          : locale === 'en'
            ? `/${normalizedContentPath}/${contentSlug}`
            : `/${locale}/${normalizedContentPath}/${contentSlug}`;

        setLinkUrl(newLinkUrl);
      } else {
        // Fallback to topic route format if no content type path
        const hasCategory = post?.category && post.category.slug?.current;
        
        if (hasCategory) {
          const categorySlug = post.category.slug.current.replace(/^\/+/, '').replace(/\/+$/, '');
          const topicBase = siteConfig.categoryBaseUrls.base;
          
          const newLinkUrl = varyingIndex
            ? locale === 'en' 
              ? `/${topicBase}/${categorySlug}`
              : `/${locale}/${topicBase}/${categorySlug}`
            : locale === 'en'
              ? `/${topicBase}/${categorySlug}/${contentSlug}`
              : `/${locale}/${topicBase}/${categorySlug}/${contentSlug}`;

          setLinkUrl(newLinkUrl);
        }
      }
    }
  }, [router.isReady, post?.contentType, post?.slug, post?.category, varyingIndex, router.query.locale, router]);

  if (!post || !linkUrl) {
    return null
  }

  const handleColorExtracted = (extractedColor: string) => {
    setColor(extractedColor)
  }

  return (
    <React.Fragment>
      {cardType === 'top-image-card' ? (
        <Anchor href={linkUrl} className="h-full">
          <AnimatingWrapper transitionType="slide-in" delay={0.8} immediate={index < 2}>
            <div
              className={`flex ${ alignCard ? 'md:!flex-row flex-col'  : `flex-col`} w-full h-full gap-1 overflow-hidden ${reverse ? 'flex-col-reverse ' : ''}  group rounded-lg text-white`}
            >
              <div
                className={`flex w-full h-full overflow-hidden`}
                style={{ minHeight: `${minHeight}px` }}
              >
                {post.mainImage ? (
                  <ImageLoader
                    className="transform duration-300 group-hover:scale-105"
                    image={post?.mainImage}
                    onColorExtracted={handleColorExtracted}
                    fixed={true}
                    sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
                  />
                ) : (
                  <ImageLoader
                    image={siteConfig.placeHolder.podcastCover}
                    useClientWidth={true}
                    sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
                  />
                )}
              </div>
              <div
                style={{
                  backgroundColor: `${color && color ? color : '#18181B'}`,
                }}
                className={`flex w-full h-full ${reverse ? 'rounded-t-lg' : 'rounded-b-lg'} ${ alignCard &&  'rounded-tl-none rounded-bl-none'  } p-6 md:p-9  flex-col items-start gap-10 ${!alignCard && 'flex-1'} `}
              >
                <div className="flex flex-col gap-3">
                  <SubText className="!text-white">
                    {isPageUrl ? tag?.tagName : post.contentType}
                  </SubText>
                  <H3Large className="group-hover:underline underline-offset-4">
                    {post.title}
                  </H3Large>
                  <DescriptionText className="text-opacity-70 line-clamp-3 overflow-hidden text-ellipsis">
                    {post.desc ? post.desc : post.excerpt}
                  </DescriptionText>
                </div>
                {post.author && post.author.length > 0 && (
                  <AuthorInfo
                    isParentLink={true}
                    className="!text-white"
                    author={post.author}
                    showNameOnly={true}
                  />
                )}
              </div>
            </div>
          </AnimatingWrapper>
        </Anchor>
      ) : cardType === 'left-image-card' ? (
        <Anchor href={linkUrl} className='w-full'>
          <AnimatingWrapper transitionType="slide-in" delay={0.2} immediate={index < 2}>
            <div
              className={`flex flex-col md:flex-row gap-3 xl:gap-6 relative group hover:transition duration-500 ${className}`}
            >
              {post.mainImage && (
                <div className="w-full md:max-w-[266px] rounded-lg transform transition duration-500 overflow-hidden flex-1">
                  <ImageLoader
                    className="transform h-full duration-300 group-hover:scale-105 min-h-[200px] md:min-h-[157px]"
                    image={post?.mainImage}
                    width={264}
                    height={154}
                    // useDefaultSize={true}
                    imageClassName="w-full h-full"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {
                    <div className="absolute bottom-0 right-0 w-full bg-gradient-to-t from-zinc-900/25  to-transparent  h-full ">
                      {post.contentType === 'podcast' ? (
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <Image src={SoundIcon} alt="soundIcon" />
                          <span className="text-white text-sm font-medium">
                            {' '}
                            {`Listen Now`}
                          </span>
                        </div>
                      ) : post.contentType === 'webinar' ? (
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <PlayIcon />
                          <span className="text-white text-sm font-medium">{`Watch`}</span>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  }
                </div>
              )}
              <div className="flex flex-col flex-1 gap-2 self-center w-full">
                <SubText>
                  {isPageUrl
                    ? tag?.tagName
                    : post.contentType === 'press-release'
                      ? 'press release'
                      : post.contentType}
                </SubText>
                <H4Large
                  className={`xl:text-xl group-hover: group-hover:underline underline-offset-4 line-clamp-3 text-ellipsis overflow-hidden`}
                >
                  {post.title}
                </H4Large>
                <DurationSection
                  className={'!text-zinc-500 text-[12px] lg:text-[14px]'}
                  contentType={post.contentType}
                  duration={
                    post.contentType === 'podcast' ||
                      post.contentType === 'webinar' ||
                      post.contentType === 'ebook'
                      ? post?.duration
                      : post?.estimatedReadingTime
                  }
                  date={post?.date ? post?.date : ''}
                />
              </div>
            </div>
          </AnimatingWrapper>
        </Anchor>
      ) : cardType === 'text-only-card' ? (
        <div
          className={`flex flex-col flex-1 w-full group hover:scale-100 transform duration-300 ${className} `}
        >
          <Anchor href={linkUrl}>
            <AnimatingWrapper transitionType="slide-in" delay={0.8} immediate={index < 2}>
              <div
                className={`${!isLast && `border-b-2`} pb-6 flex flex-col gap-3  border-zinc-800 !text-black`}
              >
                {post.contentType && (
                  <SubText>{isPageUrl ? tag?.tagName : post.contentType}</SubText>
                )}
                <H3Medium
                  className={`group-hover: group-hover:underline underline-offset-4 tracking-[-0.72px] md:!text-[1.8rem] !text-black`}
                >
                  {post.title}
                </H3Medium>
                {isPageUrl && post.contentType === 'podcast' && (
                  <CreaterInfo creater={post?.author} duration={post?.duration} />
                )}
              </div>
            </AnimatingWrapper>
          </Anchor>
        </div>
      ) : cardType === 'review-card' ? (
        <React.Fragment>
          <div
            className={`flex flex-col gap-1 group hover: transition duration-500 overflow-hidden ${post.hasVideo && 'cursor-pointer'}`}
            onClick={() => {
              if (post.videos && post.hasVideo) {
                setIsOpen(true)
              }
            }}
          >
            <div className="flex p-6  md:p-8 rounded-lg  bg-white flex-col items-start gap-10 flex-1">
              <div className="flex flex-col gap-6">
                <div className="flex gap-3 justify-between">
                  <ChordIcon />
                  {post.videos && post.hasVideo && (
                    <div className="flex gap-3 items-center">
                      <span className="text-[14px] text-zinc-900 font-medium">
                        Play
                      </span>
                      <span>
                        <PlayIcon color="black" />
                      </span>
                    </div>
                  )}
                </div>
                <H3Medium className="!text-zinc-900">
                  {post.testimonialName}
                </H3Medium>
                <DescriptionText className="!text-zinc-600 !leading-[1.6]">
                  {post.desc ? post.desc : post.excerpt}
                </DescriptionText>
                {post.customer && (
                  <AuthorInfo
                    className="pointer-events-none"
                    author={[post.customer]}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            {isOpen && (
              <VideoModal
                isPopup={true}
                videoDetails={post?.videos}
                className={`pt-9  flex items-start`}
                onClose={() => setIsOpen(false)}
              />
            )}
          </div>
        </React.Fragment>
      ) : cardType === 'featured' ? (
        <div className="card featured-card">
          {post.mainImage && (
            <ImageLoader
              image={post.mainImage}
              className="rounded-lg object-cover w-full"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="mt-6">
            <h3 className="font-semibold text-2xl">{post.title}</h3>
            <p className="text-zinc-700 mt-2">{post.excerpt || ''}</p>
          </div>
        </div>
      ) : cardType === 'podcast-card' ? (
        <Anchor href={linkUrl}>
          <div
            className={`flex flex-col gap-6 h-full relative group ${className}`}
          >
            {post.mainImage && (
              <div className="w-full rounded-[10px] overflow-hidden relative h-[234px]">
                <ImageLoader
                  className="absolute inset-0 w-full h-full object-cover transform duration-300 group-hover:scale-105"
                  image={post?.mainImage}
                  fixed={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
                
                {/* Watch badge - top left */}
                {(post.contentType === 'podcast' || post.contentType === 'webinar') && (
                  <div className="absolute top-6 left-6 flex items-center gap-2.5 z-10">
                    <div className="bg-white rounded-full p-2 flex items-center justify-center">
                      {post.contentType === 'webinar' ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.285 5.2722C5.285 4.8838 5.5346 4.6389 5.8739 4.8249L9.1833 6.5527C9.5352 6.7463 9.5352 7.2537 9.1833 7.4473L5.8745 9.1751C5.5352 9.3611 5.2856 9.1162 5.2856 8.7284L5.285 5.2722Z"
                            fill="#18181B"
                          />
                        </svg>
                      ) : (
                        <Image src={SoundIcon} alt="soundIcon" className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="text-white text-sm font-medium leading-[1.5]">
                      {post.contentType === 'webinar' ? 'Watch' : 'Listen'}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {/* Content below image */}
            <div className="flex flex-col gap-3">
              {/* Category and Date */}
              <div className="flex items-start gap-3 text-[#71717a] text-sm font-medium leading-[1.5] tracking-[0.7px] uppercase">
                <span>
                  {post.category?.categoryName || tag?.tagName || post.contentType || 'Knowledge Guides'}
                </span>
                {post.date || post._createdAt ? (
                  <>
                    <span>|</span>
                    <span>
                      {(() => {
                        const date = new Date(post.date || post._createdAt)
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
                      })()}
                    </span>
                  </>
                ) : null}
              </div>
              
              {/* Title */}
              <h3 className="font-bold text-2xl leading-[1.3] text-[#18181b] tracking-[-0.24px] line-clamp-2 overflow-hidden text-ellipsis h-[62px]">
                {post.title}
              </h3>
            </div>
          </div>
        </Anchor>
      ) : //ebook card
        cardType === 'ebook-card' ? (
          <div className={`flex flex-col w-full h-full group`}>
            <Anchor href={linkUrl} className="flex-1 flex">
              <div className="relative flex flex-col w-full">
                {(post.mainImage || post.image) && (
                  <div className="overflow-hidden absolute left-0 right-0 top-0 bottom-0 rounded-[10px]">
                    <ImageLoader
                      className="h-full overflow-hidden"
                      image={bgImages[imageIndex].src}
                      alt={post.title || 'Blog Image'}
                      // useClientWidth={true}
                      imageClassName="h-full w-full group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1 relative p-4 md:p-8 flex-1">
                  <div className="bg-white rounded p-4 md:p-5 h-full flex flex-col justify-between gap-2">
                    <div>
                      {post.contentType && (
                        <span
                          className={`rounded mb-2 bg-zinc-500 text-xs md:text-sm text-white font-medium leading-[1.5] uppercase inline-flex px-2 py-1`}
                        >
                          {post.contentType}
                        </span>
                      )}
                      <H4Medium
                        className={`group-hover: group-hover:underline underline-offset-4`}
                      >
                        {post.title}
                      </H4Medium>
                    </div>
                    {/* {post.author && post.author.length > 0 && (
                              <span className='text-[12px] font-medium'>{`by ${post.author[0].name ? post.author[0].name : ''}`}</span>
                            )} */}
                    {post.contentType && (
                      <span className="text-[14px] md:text-[16px] font-medium inline-flex items-center gap-1">
                        {`${post.contentType === 'webinar' ? 'Watch Now' : 'Read Now'}`}
                        <ArrowTopRightIcon className="" height={20} width={20} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Anchor>
          </div>
        ) : (
          // default card
          <div className={`flex flex-col relative h-full`}>
            <Anchor href={linkUrl} className="flex flex-col h-full group">
              <AnimatingWrapper transitionType="slide-in" delay={0.8} immediate={index < 2}>
                {(post.mainImage || post.customImage) && (
                  <div
                    className={`overflow-hidden ${varyingIndex ? 'rounded-t-lg  flex-1' : 'rounded-lg'} relative min-h-[234px]  w-full`}
                  >
                    <ImageLoader
                      className="h-full"
                      imageClassName="group-hover:scale-105 transition-transform duration-300 w-full h-full inline"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      image={
                        varyingIndex && post?.customImage
                          ? post?.customImage
                          : post?.mainImage
                      }
                    />
                    {!varyingIndex && post.contentType === 'podcast' ? (
                      <div className="absolute bottom-6 left-6 flex items-center gap-2">
                        <Image src={SoundIcon} alt="soundIcon" />
                        <span className="text-white text-sm font-medium">
                          {' '}
                          {`Listen Now`}
                        </span>
                      </div>
                    ) : post.contentType === 'webinar' ? (
                      <div className="absolute bottom-6 left-6 flex items-center gap-2">
                        <PlayIcon />
                        <span className="text-white text-sm font-medium">{`Watch`}</span>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                )}
                {
                  <div
                    className={`${varyingIndex ? 'p-8 bg-indigo-900 text-white rounded-b-lg mt-1' : 'mt-6'} flex flex-col gap-1 `}
                  >
                    <div className="flex flex-col ">
                      {post.contentType && (
                        <SubText
                          className={`${varyingIndex ? '!text-white' : ''} mb-2`}
                        >
                          {post.contentType === 'press-release'
                            ? 'press release'
                            : post.contentType}
                        </SubText>
                      )}
                      <H4Medium className="group-hover:group-hover:underline underline-offset-4 line-clamp-3 text-ellipsis overflow-hidden">
                        {post.title}
                      </H4Medium>
                    </div>

                    {varyingIndex ? (
                      <div className="flex items-center gap-2 pt-8">
                        <span className="text-base font-medium">{`${post.contentType === 'podcast'
                            ? 'Listen Now'
                            : post.contentType === 'webinar'
                              ? 'Watch'
                              : 'Read Now'
                          }`}</span>
                        <ArrowTopRightIcon
                          className="group-hover:translate-y-[-2px] transition-transform duration-300"
                          height={20}
                          width={20}
                        />
                      </div>
                    ) : (
                      <DurationSection
                        className={'!text-zinc-500'}
                        contentType={post.contentType}
                        duration={
                          post.contentType === 'podcast' ||
                            post.contentType === 'webinar'
                            ? post?.duration
                            : post?.estimatedReadingTime
                        }
                        date={post?.date ? post?.date : ''}
                      ></DurationSection>
                    )}
                  </div>
                }
              </AnimatingWrapper>
            </Anchor>
          </div>
        )}
    </React.Fragment>
  )
}
