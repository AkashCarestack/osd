import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from '@sanity/icons'
import siteConfig from 'config/siteConfig'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect,useRef, useState } from 'react'

import GrowthClubLogo from '~/assets/reactiveAssets/GrowthClubLogo'
import Anchor from '~/components/commonSections/Anchor'
import { useGlobalData } from '~/components/Context/GlobalDataContext'
import { generateHref, normalizePath } from '~/utils/common'

import Wrapper from '../Wrapper'

interface ShortNavPopoverProps {
  className?: string
  showMenu?: boolean
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
  navPopoverId?: string
}

export const ShortNavPopover = ({
  className = '',
  showMenu,
  navPopoverId,
  setShowMenu,
}: ShortNavPopoverProps) => {
  const { data, featuredTags } = useGlobalData()
  const [active, setActive] = useState(false)
  const [showTags, setShowTags] = useState(false)
  const [tagData, setTagData] = useState(null)
  const [contentHeight, setContentHeight] = useState(0)
  const contentRef = useRef(null)
  const buttonRef = useRef(null)
  const navPopoverRef = useRef(null)
  const router = useRouter()


  useEffect(() => {
    const handleRouteChange = () => {
      if (showMenu) {
        setShowMenu(false)
        setShowTags(false)
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router, showMenu, setShowMenu])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMenu &&
        navPopoverRef.current &&
        !navPopoverRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false)
        setShowTags(false)
      }
    }

    // document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('scroll',handleClickOutside) // can be used if needed
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('scroll',handleClickOutside)
    }
  }, [showMenu, setShowMenu])



  useEffect(() => {
    if (data) setTagData(data) 
  }, [tagData, data])

  const closeMenu = () => {
    setShowMenu(false)
    setShowTags(false)
  }

  const showTagsMob = () => {
    setShowTags(true)
  }

  const hideTagsMob = () => {
    setShowTags(false)
  }



  const handleMouseLeave = (event: any) => {
    // if (!navPopoverRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    // }
  };

  return (
    <section
      ref={navPopoverRef}
      id={navPopoverId}
      onMouseLeave={handleMouseLeave}
      className={`p-2  lg:rounded-[12px] bg-white shadow-custom 
      justify-center bg-transparent fixed lg:absolute lg:top-16 left-2/4 w-[200px] translate-x-[-50%] lg:h-auto 
      ${'lg:-translate-y-3 opacity-0 invisible'}
      ${'lg:overflow-hidden'}
      ${className}
    `}
    >
    <div className="absolute bg-white w-10 h-10 border-l-3 border-t-3 border-b-3 border-b-transparent transform top-[-1px] left-6 rotate-45 skew-x-10 skew-y-10  bottom-0"></div>
      <Wrapper>
        <div className={`${className} w-full lg:pt-0 pt-14`}>

          <div
            className={`lg:hidden flex fixed top-0 left-0 w-full py-4 px-4 z-20 bg-zinc-900 h-[56px] items-center justify-between`}
          >
            {showTags ? (
              <div className="flex items-center gap-0">
                <ChevronLeftIcon
                  width={25}
                  height={25}
                  className="text-white"
                />
                <span onClick={hideTagsMob} className="text-white text-base">
                  Back
                </span>
              </div>
            ) : (
              <Anchor
                href="/"
                className="text-2xl font-extrabold bg-gradient-text bg-clip-text text-transparent font-monrope tracking-tighterText"
              >
                {/* <ClubLogo/>  */}
                <GrowthClubLogo />
              </Anchor>
            )}
            <CloseIcon
              width={40}
              height={40}
              onClick={closeMenu}
              className="text-white"
            />
          </div>

          <div
            className={`transition-all duration-300 ease ${showTags && '-translate-x-[105%]'} lg:translate-x-0`}
          >
            <div
              ref={contentRef}
              className={`w-full transform transition-all duration-200}`}
            >
              <nav className="flex flex-col   lg:gap-x-10 flex-wrap rounded-[6px] ">
              {tagData &&
                    tagData.length > 0 &&
                    tagData.map((tag, index) => {
                      const hrefLink = `/${siteConfig.categoryBaseUrls.base}/${tag?.slug?.current || ''}`;
                      const cleanHref = normalizePath(hrefLink);
                    return (
                      <div className="break-inside-avoid p-2 " key={index}>
                        <Anchor
                          href={generateHref(router.query.locale as string, cleanHref)}
                          scroll={false}
                          className="text-zinc-500 font-medium text-sm hover:text-zinc-600 transition-colors inline-flex "
                        >
                          <span className='hover:underline underline-offset-4'>{tag?.categoryName}</span>
                        </Anchor>
                      </div>
                    )})}
              </nav>
              {/* <div className="px-[10px] py-6 lg:p-6 lg:block hidden">
                <div className="text-zinc-400 pb-6 font-medium text-sm uppercase">
                  Browse By Key Topics
                </div>
                <div className="lg:columns-3 gap-6">
                  {tagData &&
                    tagData.length > 0 &&
                    tagData.map((tag, index) => (
                      <div className="break-inside-avoid pb-[14px]" key={index}>
                        <Anchor
                          href={`/browse/${tag?.slug?.current}`}
                          scroll={false}
                          className="text-zinc-500 font-medium text-sm hover:text-zinc-600 transition-colors inlin-flex underline underline-offset-2"
                        >
                          <span>{tag?.tagName}</span>
                        </Anchor>
                      </div>
                    ))}
                </div>
              </div> */}

              <div
                className="text-zinc-400 pt-3 font-medium text-sm uppercase lg:hidden flex items-center gap-1"
                onClick={showTagsMob}
              >
                Browse By Key Topics
                <ChevronRightIcon
                  width={25}
                  height={25}
                  className="text-zinc-400"
                />
              </div>
            </div>
          </div>
          {/* this duplicate is for mobile only */}
          {/* {showTags && ( */}
          <div
            className={`px-4 lg:px-[10px] py-6 lg:p-6 lg:hidden block absolute top-[56px] h-full left-0  overflow-auto transition-all duration-300 ease  ${showTags ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="columns-1 gap-6">
              {tagData &&
                tagData.length > 0 &&
                tagData.map((tag, index) => {
                  const hrefLink = `/${siteConfig.categoryBaseUrls.base}/${tag?.slug?.current || ''}`;
                  const cleanHref = normalizePath(hrefLink);
                  return(
                  <div className="break-inside-avoid" key={index}>
                    <Anchor
                      href={generateHref(router.query.locale as any, cleanHref)}
                      scroll={false}
                      className="text-zinc-500 pb-[14px] font-medium text-sm flex hover:text-zinc-600 transition-colors"
                    >
                      <span>{tag?.categoryName}</span>
                    </Anchor>
                  </div>
                )})}
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  )
}
