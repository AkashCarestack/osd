import siteConfig from 'config/siteConfig'
import { useRouter } from 'next/router'
import React from 'react'

import { generateHref } from '~/utils/common'

import Anchor from './Anchor'

interface ArticlesInSectionProps {
  associatedContent: any[]
  categorySlug?: string
  currentContentSlug?: string
  glossary?: any
  faq?: any
}

const ArticlesInSection: React.FC<ArticlesInSectionProps> = ({
  associatedContent,
  categorySlug,
  currentContentSlug,
  glossary,
  faq,
}) => {
  const router = useRouter()
  const { locale } = router.query

  // Build items array: glossary first, then articles, then FAQ last
  const items: any[] = []
  
  // Add glossary as first item if it exists
  if (glossary && glossary._id) {
    items.push({
      _id: glossary._id,
      type: 'glossary',
      title: 'Glossary',
      slug: 'glossary',
      termCount: glossary.terms?.length || 0,
    })
  }
  
  // Add articles
  if (associatedContent && associatedContent.length > 0) {
    associatedContent.forEach((content) => {
      items.push({
        ...content,
        type: 'article',
        slug: content?.slug?.current || content?.slug,
      })
    })
  }
  
  // Add FAQ as last item if it exists
  if (faq && faq._id) {
    items.push({
      _id: faq._id,
      type: 'faq',
      title: 'FAQ',
      slug: 'faq',
      faqCount: faq.faqs?.length || 0,
    })
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="bg-zinc-50 flex flex-col gap-6 items-start p-6 rounded-[10px] w-full">
      <div className="border-b border-zinc-200 pb-3 w-full">
        <p className="font-medium text-base leading-[1.6] text-zinc-900">
          Articles in this section
        </p>
      </div>
      <div className="flex flex-col gap-3 items-start w-full">
        {items.map((item, index) => {
          const itemSlug = item.type === 'glossary' ? 'glossary' : item.type === 'faq' ? 'faq' : (item?.slug?.current || item?.slug)
          const title = item?.title || 'Untitled'
          
          // Build the URL for the content
          const href = categorySlug && itemSlug
            ? `${siteConfig.categoryBaseUrls.base}/${categorySlug}/${itemSlug}`
            : '#'

          const isActive = itemSlug === currentContentSlug || 
            (item.type === 'glossary' && currentContentSlug === 'glossary') ||
            (item.type === 'faq' && currentContentSlug === 'faq')

          return (
            <div key={item?._id || index} className="flex gap-1.5 items-start w-full">
              <p 
                className={`shrink-0 text-sm leading-[150%] opacity-100 ${
                  isActive 
                    ? 'text-[#93C5FD] font-medium' 
                    : 'text-zinc-600 font-normal'
                }`}
              >
                {index + 1}.
              </p>
              <Anchor
                href={generateHref(locale as string, href)}
                className={`flex-1 text-sm leading-[150%] opacity-100 ${
                  isActive 
                    ? 'text-[#93C5FD] font-medium hover:text-[#7DD3FC]' 
                    : 'text-zinc-600 font-normal hover:underline'
                }`}
              >
                {title}
              </Anchor>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ArticlesInSection
