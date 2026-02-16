import siteConfig from 'config/siteConfig'
import { useRouter } from 'next/router'
import React from 'react'

import { generateHref } from '~/utils/common'

import Anchor from './Anchor'

interface ArticlesInSectionProps {
  associatedContent: any[]
  categorySlug?: string
  currentContentSlug?: string
}

const ArticlesInSection: React.FC<ArticlesInSectionProps> = ({
  associatedContent,
  categorySlug,
  currentContentSlug,
}) => {
  const router = useRouter()
  const { locale } = router.query

  if (!associatedContent || associatedContent.length === 0) {
    return null
  }

  // Filter out the current content from the list
  const filteredContent = associatedContent.filter((content) => {
    const contentSlug = content?.slug?.current || content?.slug
    return contentSlug !== currentContentSlug
  })

  if (filteredContent.length === 0) {
    return null
  }

  return (
    <div className="bg-zinc-50 flex flex-col gap-6 items-start p-6 rounded-[10px] w-full">
      <div className="border-b border-zinc-200 pb-3 w-full">
        <p className="font-medium text-base leading-[1.6] text-zinc-900">
          Articles in this section
        </p>
      </div>
      <div className="flex gap-1.5 items-start leading-[1.5] text-zinc-600 text-sm w-full">
        <div className="flex flex-col gap-3 shrink-0">
          {filteredContent.map((_, index) => (
            <p key={index} className="font-normal relative shrink-0">
              {index + 1}.
            </p>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-3 items-start min-h-0 min-w-0 whitespace-pre-wrap">
          {filteredContent.map((content, index) => {
            const contentSlug = content?.slug?.current || content?.slug
            const title = content?.title || 'Untitled'
            
            // Build the URL for the content
            const href = categorySlug && contentSlug
              ? `${siteConfig.categoryBaseUrls.base}/${categorySlug}/${contentSlug}`
              : '#'

            const isActive = contentSlug === currentContentSlug

            return (
              <Anchor
                key={content?._id || index}
                href={generateHref(locale as string, href)}
                className={`font-normal relative shrink-0 w-full ${
                  isActive ? 'font-medium' : ''
                } hover:underline`}
              >
                {title}
              </Anchor>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ArticlesInSection
