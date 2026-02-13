import {
  ArrowTopRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  TruncateIcon,
} from '@sanity/icons'
import siteConfig from 'config/siteConfig'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect,useRef, useState } from 'react'

import GrowthClubLogo from '~/assets/reactiveAssets/GrowthClubLogo'
import VoiceStackResources from '~/assets/reactiveAssets/VoiceStackResources'
import Anchor from '~/components/commonSections/Anchor'
import ImageLoader from '~/components/commonSections/ImageLoader'
import { useGlobalData } from '~/components/Context/GlobalDataContext'
import { regions } from '~/components/RegionSwitcher'
import Section from '~/components/Section'
import { generateHref, normalizePath } from '~/utils/common'

import { navigationLinks } from '../Header'
import Wrapper from '../Wrapper'

interface NavProps {
  className?: string
  showMenu?: boolean
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}

export const NavPopover = ({
  className = '',
  showMenu,
  setShowMenu,
}: NavProps) => {
  const { data, featuredTags } = useGlobalData()
  const [active, setActive] = useState(false)
  const [showTags, setShowTags] = useState(false)
  const [tagData, setTagData] = useState(null)
  const [contentHeight, setContentHeight] = useState(0)
  const contentRef = useRef(null)
  const buttonRef = useRef(null)
  const navPopoverRef = useRef(null)
  const router = useRouter()
  const matchedRegion = regions.find((region) => {
    return(
      region.locale === router.locale || 
      region.locale === router.query.locale || 
      (region.url ===  router.pathname  && 'en' )
    )
   }
   );
   const [currentRegion, setCurrentRegion] = useState(null);

   useEffect(()=>{
    setCurrentRegion(router.locale || router.query.locale);  
  },[router?.locale,router?.query.locale])

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
    // document.addEventListener('scroll',handleClickOutside) // can be used if needed
    return () => {
      // document.removeEventListener('mousedown', handleClickOutside)
      // document.removeEventListener('scroll',handleClickOutside)
    }
  }, [showMenu, setShowMenu])

  // useEffect(() => {
  //   if (active && contentRef.current) {
  //     setContentHeight(contentRef.current.scrollHeight)
  //   } else {
  //     setContentHeight(0)
  //   }
  // }, [active])

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

  const handleMouseLeave = (event) => {
    const rect = buttonRef.current.getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setActive(false) // to hide default menu
    }
  }
  return (
    <section
      ref={navPopoverRef}
      className={`pt-[10px] px-4 lg:px-[10px] pb-[20px] lg:rounded-[12px] bg-white shadow-custom 
    justify-center bg-transparent fixed lg:absolute lg:top-0 left-0 w-full h-[100vh] lg:h-auto 
    lg:overflow-hidden top-0 transition-transform duration-300 linear z-20 lg:z-10 ${showMenu
          ? 'flex lg:translate-y-0 opacity-100 visible'
          : 'lg:-translate-y-3 opacity-0 invisible'
        }`}
    >
      <Wrapper>
        <div className={`${className} w-full lg:pt-0 pt-14`}>
          {/* <button
            ref={buttonRef}
            className="px-4 py-3 text-sm font-medium  hover:bg-zinc-300 rounded-md"
            onMouseEnter={handleMouseEnter}
          >
            <TruncateIcon width={40} height={40} />
          </button> */}
          <div
            className={`lg:hidden  transition-all ease-out duration-200 flex fixed top-0 left-0 w-full py-4 px-4 z-20 border-b  h-[56px] items-center justify-between`}
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
                <VoiceStackResources/> 
              </Anchor>
            )}
            <CloseIcon
              width={40}
              height={40}
              onClick={closeMenu}
              className="text-black"
            />
          </div>
          <div className='flex flex-col h-full gap-40 flex-shrink-0'>
          
          <div id='mob-content'
            className={`transition-all duration-300 ease ${showTags && '-translate-x-[105%]'} lg:translate-x-0`}
          >
            <div
              ref={contentRef}
              className={`w-full transform transition-all duration-200}`}
            >
              <nav className="flex flex-col lg:flex-row gap-y-6 gap-x-6 lg:gap-x-10 flex-wrap rounded-[6px] py-[17px] lg:px-[20px] lg:bg-zinc-100">
                {navigationLinks?.map((link) => {
                  const scrollToSection = (sectionId: string) => {
                    const element = document.getElementById(sectionId);
                    if (element) {
                      const headerOffset = 100;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth',
                      });
                      setShowMenu(false);
                    }
                  };
                  return (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.sectionId)}
                      className="hover:text-zinc-500 self-start font-medium text-base lg:text-sm flex items-center gap-2 text-zinc-600 text-left"
                    >
                      {link.label}
                    </button>
                  );
                })}
              </nav>
              <div className="px-[10px] py-6 lg:p-6 lg:block hidden">
                <div className="text-zinc-400 pb-6 font-medium text-sm uppercase">
                  Browse  Topics
                </div>
                <div className="lg:columns-3 gap-6">
                  {tagData &&
                    tagData.length > 0 &&
                    tagData.map((tag, index) => {
                      const basePath = `${siteConfig.categoryBaseUrls.base}/${tag?.slug?.current || ''}`;
                      return(
                      <div className="break-inside-avoid pb-[14px]" key={tag?.slug?.current}>
                        <Anchor
                          href={generateHref(router.query.locale, basePath)}
                          scroll={false}
                          className="text-zinc-500 font-medium text-sm hover:text-zinc-600 transition-colors inlin-flex underline underline-offset-2"
                        >
                          <span>{tag?.categoryName}</span>
                        </Anchor>
                      </div>
                    )})}
                </div>
              </div>

              {/* <div // Hided 
                className="text-zinc-400 pt-3 font-medium text-sm uppercase lg:hidden flex items-center gap-1"
                onClick={showTagsMob}
              >
                Browse Topics
                <ChevronRightIcon
                  width={25}
                  height={25}
                  className="text-zinc-400"
                />
              </div> */}
            </div>
          </div>
          {/* mob region switcher */}
          <div id='mob-region' className={`bg-white flex gap-5 justify-center items-center lg:hidden`}>
            {regions.map((region: any, index: number) => {
              return (
                currentRegion == region.locale ? (
                  <div className='flex gap-2 items-center' key={region.locale}>
                    <ImageLoader
                      image={region.flag.url}
                      alt={region.flag.title}
                      title={region.flag.title}
                      width={32}
                      height={32}
                      className='border-2 rounded-full border-black/20 !w-[23px] !h-[23px]'
                    >
                    </ImageLoader>
                  </div>
                ) : (

                  <Anchor key={region.locale} href={region.url} className='flex gap-2 items-center' onClick={closeMenu}>
                    <ImageLoader
                      image={region.flag.url}
                      alt={region.flag.title}
                      title={region.flag.title}
                      width={32}
                      height={32}
                      className='border-2 rounded-full border-white !w-[23px] !h-[23px]'
                    >
                    </ImageLoader>
                  </Anchor>
                )
              )
            })}
          </div>
          </div>
          {/* this duplicate is for mobile only */}
          {/* {showTags && ( */}
          <div
            className={`px-4 lg:px-[10px] flex flex-col gap-9  py-6 lg:p-6 lg:hidden block absolute top-[56px] h-full left-0 w-full overflow-auto transition-all duration-300 ease  ${showTags ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="columns-1 gap-6">
              {tagData &&
                tagData.length > 0 &&
                tagData.map((tag, index) => {
                  const basePath = `${siteConfig.categoryBaseUrls.base}/${tag?.slug?.current || ''}`;
                  const cleanHref = normalizePath(basePath)
                  return (
                    <div className="break-inside-avoid" key={cleanHref}>
                      <Anchor
                        href={generateHref(router.query.locale, cleanHref)}
                        scroll={false}
                        className="text-zinc-500 pb-[14px] font-medium text-sm flex hover:text-zinc-600 transition-colors"
                      >
                        <span>{tag?.categoryName}</span>
                      </Anchor>
                    </div>
                  )
                })}
            </div>
            <Anchor
              href={generateHref(router.query.locale, siteConfig.paginationBaseUrls.base)}
              className=" lg:flex text-[14px] group font-medium leading-[1.5] justify-center text-zinc-500 flex items-center gap-x-1 hover:text-zinc-300 group"
            >
              <span className="text-[14px] md:text-[16px] cursor-pointer text-zinc-500 font-medium text-sm hover:text-zinc-600 inline-flex items-center gap-1">
                {'Browse All'}
                <ArrowTopRightIcon className="group-hover:translate-y-[-2px] transition-transform duration-300" height={20} width={20} />
              </span>
            </Anchor>

          </div>

          {/* )} */}
          {/* ./ this is for mobile only */}

          {/* <Link
            href={`/${siteConfig.paginationBaseUrls.base}`}
            className="hidden lg:flex text-[14px] group font-medium leading-[1.5] justify-center text-zinc-500 flex items-center gap-x-1 hover:text-zinc-300 group"
          >
            <span className="text-[14px] md:text-[16px] cursor-pointer text-zinc-500 font-medium text-sm hover:text-zinc-600 inline-flex items-center gap-1">
              {'Browse All'}
              <ArrowTopRightIcon className="group-hover:translate-y-[-2px] transition-transform duration-300" height={20} width={20} />
            </span>
          </Link> */}
        </div>
      </Wrapper>
    </section>
  )
}
