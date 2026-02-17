import siteConfig from 'config/siteConfig'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import React from 'react'

import { getClient } from '~/lib/sanity.client'
import { generateHref } from '~/utils/common'

import Wrapper from '../layout/Wrapper'
import Anchor from './commonSections/Anchor'
import Breadcrumb from './commonSections/BreadCrumb'
import DurationSection from './commonSections/DurationSection'
import ImageLoader from './commonSections/ImageLoader'
import Section from './Section'
import SubText from './typography/SubText'

interface Props {
  post?: any
  isAuthor?: any
  enableDate?: boolean
  isAudio?: boolean
  contentType?: string
  landing?: boolean
  categoryName?: string
  categoryDescription?: string
  revamp?: boolean
}

const MainImageSection = ({
  post,
  isAuthor,
  enableDate = false,
  isAudio = false,
  contentType,
  landing = false,
  categoryName,
  categoryDescription,
  revamp = false,
}: Props) => {
  const router = useRouter();
  const { locale } = router.query; 
  const tag = useMemo(
    () => post?.tags?.find((tag) => tag) || null,
    [post?.tags],
  )

  const client = getClient()

  if (!post) {
    return null
  }

 let hrefTemplate = tag?.slug?.current ? `/${siteConfig.paginationBaseUrls.base}/${tag?.slug?.current} `: ''

  if (revamp) {
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: `
          .revamp-breadcrumb-wrapper {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 50 !important;
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            min-height: 24px !important;
          }
          .revamp-breadcrumb-wrapper nav {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            color: #d4d4d8 !important;
            margin-bottom: 1rem !important;
            cursor: pointer !important;
          }
          .revamp-breadcrumb-wrapper nav,
          .revamp-breadcrumb-wrapper nav *,
          .revamp-breadcrumb-wrapper nav div,
          .revamp-breadcrumb-wrapper nav span,
          .revamp-breadcrumb-wrapper nav a {
            visibility: visible !important;
            opacity: 1 !important;
            display: inline-block !important;
            color: #d4d4d8 !important;
          }
          .revamp-breadcrumb-wrapper a,
          .revamp-breadcrumb-wrapper a *,
          .revamp-breadcrumb-wrapper nav a {
            color: #d4d4d8 !important;
            text-decoration: none !important;
            visibility: visible !important;
            opacity: 1 !important;
            display: inline-block !important;
          }
          .revamp-breadcrumb-wrapper span:not(:has(svg)),
          .revamp-breadcrumb-wrapper nav span:not(:has(svg)) {
            color: #71717a !important;
            visibility: visible !important;
            opacity: 1 !important;
            display: inline-block !important;
          }
          .revamp-breadcrumb-wrapper svg,
          .revamp-breadcrumb-wrapper nav svg {
            display: inline-block !important;
            visibility: visible !important;
            opacity: 1 !important;
            color: #71717a !important;
            fill: #71717a !important;
            width: 24px !important;
            height: 24px !important;
          }
          .revamp-breadcrumb-wrapper div {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            flex-wrap: wrap !important;
            align-items: center !important;
          }
          .revamp-breadcrumb-wrapper .zinc-300,
          .revamp-breadcrumb-wrapper [class*="zinc-300"] {
            color: #d4d4d8 !important;
          }
          .revamp-breadcrumb-wrapper .zinc-400,
          .revamp-breadcrumb-wrapper [class*="zinc-400"] {
            color: #a1a1aa !important;
          }
          .revamp-breadcrumb-wrapper .zinc-500,
          .revamp-breadcrumb-wrapper [class*="zinc-500"] {
            color: #71717a !important;
          }
        `}} />
        <div className="w-full bg-zinc-900 relative overflow-hidden pt-headerSpacerMob">
          <Section className="flex justify-center w-full !py-0 relative overflow-hidden">
            <Wrapper className="z-10 relative flex h-auto flex-col md:flex-row items-start  min-h-[250px] md:min-h-[341px] overflow-hidden">
              <div className="flex flex-col gap-12 md:gap-[48px] items-start flex-1 pb-16 md:pb-[64px] pt-24 md:pt-[96px] relative z-10 max-w-full md:max-w-[598px]">
                <div className="flex flex-col gap-[6px] items-start w-full">
                  <div 
                    className="revamp-breadcrumb-wrapper w-full !block !visible !opacity-100"
                    style={{
                      display: 'block',
                      visibility: 'visible',
                      opacity: 1,
                      zIndex: 50,
                      position: 'relative',
                      width: '100%',
                      minHeight: '24px'
                    }}
                  >
                    <Breadcrumb className="!text-zinc-300" />
                  </div>
             
              </div>
              <div className="flex flex-col gap-3 md:gap-[12px] items-start justify-center w-full">
                <h1 className="text-white font-manrope font-bold leading-[1.1] text-3xl md:text-[48px] tracking-[-0.96px]">
                  {categoryName || post?.title || 'Post Title'}
                </h1>
                {categoryDescription && (
                  <p className="text-white text-sm md:text-base font-normal leading-[1.6] opacity-70 whitespace-pre-wrap">
                    {categoryDescription}
                  </p>
                )}
                {!categoryDescription && post?.description && (
                  <p className="text-white text-sm md:text-base font-normal leading-[1.6] opacity-70 whitespace-pre-wrap">
                    {post.description}
                  </p>
                )}
              </div>
            </div>
           </Wrapper>
           <div className="absolute top-0 bottom-0 right-0 hidden md:block w-[478.379px] h-full z-0 pointer-events-none overflow-hidden">
                <div className="w-full h-full origin-center relative flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 391 341" 
                    fill="none"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                  >
                    <path 
                      d="M89.9399 279.92C54.8333 198.852 24.2299 90.0657 -0.000488283 -38.963L-0.000488281 -39L478.379 -39L478.379 -38.8569C454.151 90.126 423.556 198.875 388.458 279.92L478.379 279.92L478.379 439.379L-0.000509192 439.379L-0.000502222 279.92L89.9399 279.92Z" 
                      fill="#27272A"
                    />
                  </svg>
                </div>
              </div>
        </Section>
        
      </div>
      </>
    )
  }

  return (
    <div className="w-full flex gap-1 items-center bg-zinc-900 relative overflow-hidden pt-headerSpacerMob">
      <Section className={`justify-center w-full !py-0 relative`}>
        <Wrapper className="z-10 flex h-auto flex-col md:flex-row">
          <div className="flex flex-col items-start  gap-32 text-white md:max-w-[46%] max-w-lg h-full justify-center py-8 md:py-12 md:min-h-[550px]">
            <div
              className={`flex flex-col items-start ${landing ? 'justify-center' : 'justify-between'} h-full gap-6 md:gap-24`}
            >
              {!landing && <Breadcrumb />}
              <div>
                {!landing ? (
                  categoryName ? (
                    <h1 className="text-white mb-3 block text-[36px] font-bold leading-tight">
                      {categoryName}
                    </h1>
                  ) : (
                    <Anchor href={generateHref(locale as string, hrefTemplate)}>
                      <SubText className="!text-sky-500 mb-3 block hover:!text-sky-400">
                        {tag?.tagName ? tag?.tagName : ''}
                      </SubText>
                    </Anchor>
                  )
                ) : (
                  <SubText className="!text-yellow-500 mb-3  block">
                    {post?.tagName ? post?.tagName : ''}
                  </SubText>
                )}
                {!categoryName && (
                  <h1 className="text-white font-manrope leading-tight lg:text-4xl text-2xl font-bold  mb-[10px]">
                    {post.title ? post.title : 'Post Title'}
                  </h1>
                )}
                {enableDate && (
                  <DurationSection
                    isAudio={isAudio}
                    duration={
                      post?.estimatedReadingTime
                        ? post.estimatedReadingTime
                        : post.duration
                    }
                    contentType={contentType}
                    date={post?.date ? post?.date : ''}
                  />
                )}
                {landing && post.description && (
                  <p className="text-base font-medium text-white opacity-50 leading-[1.5] pt-4">
                    {post.description}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="md:absolute left-1/2 right-0 top-0 bottom-0 w-full md:w-auto pb-8 md:pb-0 min-h-[250px]">
            {post.mainImage && (
              <ImageLoader
                image={post.mainImage}
                priority={true}
                useClientWidth={true}
                // useDefaultSize={true}
                alt={post.title || 'Post image'}
                client={client}
                imageClassName="w-full h-full object-cover"
              />
            )}
          </div>
        </Wrapper>
      </Section>
    </div>
  )
}

export default MainImageSection
