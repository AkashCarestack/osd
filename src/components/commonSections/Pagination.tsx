import { ArrowRightIcon } from '@sanity/icons'
import { ArrowLeftIcon } from '@sanity/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import Wrapper from '~/layout/Wrapper'
import { generateHref } from '~/utils/common'

import { useBaseUrl } from '../Context/UrlContext'
import Section from '../Section'
import Anchor from './Anchor'

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  enablePageSlug = false,
  type,
}: {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  enablePageSlug?: boolean
  content?: any
  type?: string
}) => {
  const baseUrl = useBaseUrl()
  const router = useRouter()
  const { locale } = router.query;

  useEffect(() => {
    const pageFromUrl = parseInt(router.query.page as string) || 1; // Get page from URL
    if (pageFromUrl !== currentPage) {
      onPageChange(pageFromUrl); // Update currentPage if it differs
    }
  }, [router.query.page, currentPage, onPageChange]);

  if (totalPages === 1) return null

  const generateUrlForPageNum = (
    previousOrNext: string,
    currentPage: number,
    page: number,
  ) => {
    if (previousOrNext === 'previous') {
      if (currentPage === 1 || currentPage === 2) {
        return `${generateHref(locale, baseUrl)}`
      } else {
        return enablePageSlug
          ? `${generateHref(locale, baseUrl)}/page/${currentPage - 1}`
          : `${generateHref(locale, baseUrl)}/${page}`
      }
    } else if (previousOrNext === 'next') {
      return enablePageSlug
        ? `${generateHref(locale, baseUrl)}/page/${currentPage + 1}`
        : `${generateHref(locale, baseUrl)}/${page}`
    }
    if (page < 2) {
      return generateHref(locale, baseUrl)
    } else {
      return `${generateHref(locale, baseUrl)}/page/${page}`
    }
  }

  const getPageUrl = (page: number, previousOrNext?: string) => {
    if (type == 'custom') {
      const slug = generateUrlForPageNum(previousOrNext, currentPage, page)
      return slug
    } else {
      if (previousOrNext === 'previous' && currentPage !== 0) {
        return enablePageSlug
          ? `${generateHref(locale, baseUrl)}/page/${currentPage - 1}`
          : `${generateHref(locale, baseUrl)}/${page}`
      } else if (previousOrNext === 'next') {
        return enablePageSlug
          ? `${generateHref(locale, baseUrl)}/page/${currentPage + 1}`
          : `${generateHref(locale, baseUrl)}/${page}`
      }

      if ((page == 0) || (page == 1)) {
        return generateHref(locale, baseUrl)
      } else {
        return enablePageSlug ? `${generateHref(locale, baseUrl)}/page/${page}` : `${generateHref(locale, baseUrl)}/${page}`
      }
    }
  }

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page)
    }
  }

  const renderPageNumbers = () => {
    const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return visiblePages.map((number) => (
      <Anchor
        key={number}
        href={getPageUrl(number)}
        onClick={() => handlePageChange(number)}
        className={`
          px-2 md:px-3 py-1
          rounded-md
          transition-all duration-300 ease-in-out
          ${currentPage === number
            ? 'text-zinc-900 font-semibold'
            : 'text-zinc-600 hover:bg-zinc-100'
          }
        `}
      >
        {number}
      </Anchor>
    ))
  }

  const arrowLinkClass = `
    p-2
    rounded-md
    transition-all duration-300 ease-in-out
    disabled:opacity-50
    disabled:cursor-not-allowed
    hover:bg-zinc-100
    group
    ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
  `

  const nextArrowLinkClass = `
    p-2
    rounded-md
    transition-all duration-300 ease-in-out
    disabled:opacity-50
    disabled:cursor-not-allowed
    hover:bg-zinc-100
    group
    ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
  `

  const iconClass = `
    transition-transform duration-300 ease-in-out
    group-hover:scale-110
  `

  return (
    totalPages > 1 && (
      <Section className="justify-center md:pb-12 md:pt-16">
        <Wrapper className="justify-center">
          <div className="flex items-center space-x-2 flex-wrap">
            <Anchor
              href={currentPage <= 1 ? '#' : getPageUrl(currentPage, 'previous')}
              onClick={() => handlePageChange(currentPage - 1)}
              className={arrowLinkClass}
            >
              <ArrowLeftIcon height={25} className={iconClass} />
            </Anchor>

            {renderPageNumbers()}
            <Anchor
              aria-disabled={currentPage >= totalPages}
              href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"}
              onClick={(e) => {
                if (currentPage >= totalPages) {
                  e.preventDefault(); // Prevent navigation when on the last page
                } else {
                  handlePageChange(currentPage + 1);
                }
              }}
              className={nextArrowLinkClass}
            >
              <ArrowRightIcon height={25} className={iconClass} />
            </Anchor>

          </div>
        </Wrapper>
      </Section>
    )
  )
}

export default Pagination
