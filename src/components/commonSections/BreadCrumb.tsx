import { ArrowRightIcon } from '@sanity/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useMemo, useRef,useState } from 'react'

import { removeUnwantedCharacters } from '~/utils/common'
import { CustomHead } from '~/utils/customHead'
import { breadCrumbJsonLd } from '~/utils/generateJSONLD'

import Anchor from './Anchor'

interface BreadCrumbProps {
  className?: string
}

const Breadcrumb = ({ className }: BreadCrumbProps) => {
  const router = useRouter()
  const [breadcrumbs, setBreadcrumbs] = useState([])
  const pathSegments = useRef(
    router.asPath.split('/').filter((segment) => segment !== ''),
  )
  const excludedSegments = useMemo(() => ['en', 'en-GB', 'en-AU'], []);

  const breadcrumbLabels = useMemo(
    () => ({
      blogs: 'Blogs',
      articles: 'Articles',
      ebooks: 'eBooks',
      podcasts: 'Podcasts',
    }),
    [],
  )

  useEffect(() => {
    pathSegments.current = router.asPath.split('/').filter((segment) => segment !== '')
  }, [router.asPath])

  useEffect(() => {
    const breadcrumbList = pathSegments?.current
      .filter((segment) => !excludedSegments.includes(segment)) 
      .map((segment, index) => {
        const href = `/${pathSegments?.current.slice(0, index + 1).join('/')}`
        const label = (breadcrumbLabels[segment] || segment).replace(/-/g, ' ')
        return { href, label }
      })
    setBreadcrumbs(breadcrumbList)
  }, [router.asPath, breadcrumbLabels, pathSegments, excludedSegments])
  const breadcrumbLd = breadCrumbJsonLd(breadcrumbs)

  return (
    <Fragment>
      <CustomHead props={breadcrumbs} type="breadCrumbs" />
      <nav
        className={`cursor-pointer mb-4 ${className}`}
        aria-label="Breadcrumb"
      >
        <div className="line-clamdiv-1 uppercase overflow-hidden text-ellipsis flex items-center flex-wrap">
          <span className="flex items-center">
            <Anchor href="/" className="zinc-300 text-xs font-500">{`Home`}</Anchor>
            <span className="mx-3 text-zinc-500 uppercase">
              <ArrowRightIcon width={24} height={24} />
            </span>
          </span>
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            return (
              <span
                key={breadcrumb.href}
                className={`flex items-center ${isLast && 'w-full cursor-default'}`}
              >
                {isLast ? (
                  <span
                    aria-current="page"
                    className="zinc-400 text-xs font-500 uppercase opacity-50 mt-2"
                  >
                    {removeUnwantedCharacters(breadcrumb.label)}
                  </span>
                ) : (
                  <Anchor
                    href={breadcrumb.href}
                    className="zinc-300 text-xs font-500 uppercase"
                  >
                    {removeUnwantedCharacters(breadcrumb.label)}
                  </Anchor>
                )}
                {!isLast && (
                  <span className="mx-3 text-zinc-500">
                    <ArrowRightIcon width={24} height={24} />
                  </span>
                )}
              </span>
            )
          })}
        </div>
      </nav>
    </Fragment>
  )
}

export default Breadcrumb
