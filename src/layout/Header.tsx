import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ProgressBar from '~/utils/progressBar/progressBar';
import { ArrowRightIcon, ChevronDownIcon } from '@sanity/icons'
import { useRouter } from 'next/router';
import { CloseIcon } from '@sanity/icons'
import useMediaQuery from '~/utils/useMediaQueryHook';
import GrowthClubLogo from '~/assets/reactiveAssets/GrowthClubLogo';
import { NavPopover } from './overlaynav/NavPopover';
import { useGlobalData } from '~/components/Context/GlobalDataContext';
import { MenuIcon } from '@sanity/icons';
import { CaseStudiesIcon } from '~/assets/reactiveAssets/svgs';
import { ArticlesIcon } from '~/assets/reactiveAssets/svgs';
import { PodcastsIcon } from '~/assets/reactiveAssets/svgs';
import { EbooksIcon } from '~/assets/reactiveAssets/svgs';
import { WebinarsIcon } from '~/assets/reactiveAssets/svgs';
import { PressIcon } from '~/assets/reactiveAssets/svgs';
import { usePathname } from 'next/navigation'
import siteConfig from 'config/siteConfig';
import  {ShortNavPopover}  from './overlaynav/ShortNavPopover';
import RegionSwitcher from '~/components/RegionSwitcher';
import { generateHref, normalizePath } from '~/utils/common';
import VoiceStackResources from '~/assets/reactiveAssets/VoiceStackResources';
import Anchor from '~/components/commonSections/Anchor';


export const navigationLinks = [
  // { href: siteConfig.pageURLs.caseStudy, label: "Case Studies", icon: CaseStudiesIcon },
  // { href: siteConfig.pageURLs.article, label: "Articles", icon: ArticlesIcon },
  // { href: siteConfig.pageURLs.podcast, label: "Podcasts", icon: PodcastsIcon },
  // { href: siteConfig.pageURLs.ebook, label: "Ebooks", icon: EbooksIcon },
  // { href: siteConfig.pageURLs.webinar, label: "Webinars", icon: WebinarsIcon },
  // { href: siteConfig.pageURLs.pressRelease, label: "Press", icon: PressIcon }
];


const Header = () => {
  let { featuredTags, homeSettings } = useGlobalData()
  const router = useRouter();
  const { locale } = router.query; 
  const [showMenu, setShowMenu] = useState(false);
  const [headerFixed, setHeaderFixed] = useState(false);
  const [navPopoverId, setNavPopoverId] = useState(null);
  const pathname = usePathname()

  const closeMenu = (e) => {
      setShowMenu(false);
  };
  const openMenu = (e) => {
      setShowMenu(true);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (window.innerWidth < 1024 && showMenu == true) {
      document.body.classList.add("menu-active");
    } else {
      document.body.classList.remove("menu-active");
    }
    setNavPopoverId(Math.random().toString(36).substr(2, 9)); 
  };

  const handleScrollMob = () => {
    setHeaderFixed(window.scrollY > 44);
  };

  const isMobile: any = useMediaQuery(1024);


  useEffect(() => {
    window.addEventListener("scroll", handleScrollMob);
    return () => {
      window.removeEventListener("scroll", handleScrollMob);
    }
  });

  const buttonRef = React.createRef();

  let homeUrl  =  `${siteConfig.pageURLs.home}/${locale && locale !== 'en' ? locale : ''}`;

  const before = "before:content-[''] before:h-[100px] before:absolute before:left-0 before:right-0 before:top-full before:bg-vs-blue";
  return (
    <>
      <ProgressBar />
      <div className={`relative w-full before:content-[''] before:-z-0  before:absolute before:left-0 before:right-0 before:top-[-100px] before:bg-zinc-900`}>
        <header
          className={`fixed w-full top-0 left-0 z-20 transition-all duration-300 ease-linear ${headerFixed && `!fixed w-full ${homeSettings?.demoBanner ? '!top-[-44px]' : '!top-0'}  left-0`}`}      >
          {homeSettings?.demoBanner && <div className={`bg-cs-primary group hover:bg-[#42dd88] transition-all duration-200 px-4 h-[44px]`}>
            <Anchor href="https://carestack.com/demo" className="flex justify-center py-3">
              <div className="max-w-7xl flex justify-center gap-3 w-full items-center">
                <div className="text-xs md:text-sm text-zinc-900">
                  {` Book a Demo with us - It's free!`}
                </div>
                <div className="flex items-center gap-1 text-xs md:text-sm text-zinc-800 font-medium">
                  <span>{`Register Now`}</span><ArrowRightIcon className="w-5 h-5 text-zinc-800 group-hover:translate-x-[4px] transition-transform duration-300 ease-in-out" />
                </div>
              </div>
            </Anchor>
          </div>}

          <div className={`z-10  bg-zinc-900 text-white  px-4 `}>
          <div className="max-w-7xl mx-auto">
              {/* <div className={`flex flex-col gap-3 justify-between py-[10px] transition-all duration-300 ease-linear relative  ${headerFixed ? '!lg:py-3' : 'lg:py-6'}`}> */}
              <div className={`flex flex-col gap-3 justify-between py-0 transition-all duration-300 ease-linear`}>
              <div className={`flex flex-row gap-2 justify-between items-center 
                lg:relative transition-all duration-300 ease-in-out ${headerFixed ? 'lg:my-2 my-2' : 'lg:my-4 my-2'}`}>
                  <Link href={normalizePath(homeUrl)} className="text-2xl font-extrabold bg-gradient-text bg-clip-text text-transparent font-monrope tracking-tighterText">
                    <VoiceStackResources/>
                  </Link>
                  <div className={`flex lg:gap-10   justify-between rounded-xl items-center`}>
                    {!isMobile && <div className='group relative py-4' >
                    {/* <Link  href={generateHref(locale, siteConfig.categoryBaseUrls.base)}   className='text-zinc-500 flex items-center gap-[6px] cursor-pointer text-base hover:text-zinc-300'>
                      <span>
                      {`Topics`}
                      </span>
                      <ChevronDownIcon className={`w-5 h-5  group-hover:translate-x-[4px] transition-transform duration-300 ease-in-out ${showMenu && 'rotate-180'}`} />
                    </Link> */}
                    {navPopoverId && <ShortNavPopover navPopoverId={navPopoverId}   showMenu={showMenu} setShowMenu={setShowMenu} className='z-10 group-hover:block group-hover:visible group-hover:opacity-100 ' />}
                    </div>}
                    <div className={`lg:flex-row top-[110px] hidden right-0 px-4 pt-4 pb-8 lg:p-0 bg-zinc-900 lg:bg-transparent left-0 lg:static flex-col gap-2 justify-between lg:items-center lg:flex`}>
                      <nav className="flex flex-col lg:flex-row lg:gap-10 flex-wrap ">
                        {navigationLinks && navigationLinks?.map((link, i) => {                                                    
                          return(
                          <Anchor
                            key={link.href}
                            href={generateHref(locale as string, link.href)}
                            className={`hover:text-zinc-300 text-base ${pathname.includes(link.href) ? 'text-gray-400' : 'text-gray-500'}`}
                          >
                            {link.label}
                          </Anchor>
                        )})}
                        {/* {featuredTags && featuredTags?.map((link, i) => ( // tag version nav
                          <Anchor
                            key={link.slug?.current}
                            href={`/browse/${link.slug?.current}`}
                            className={`hover:text-zinc-300 text-sm ${pathname.includes(link.slug?.current) ? 'text-zinc-300' : 'text-zinc-500'}`}
                          >
                            {link.tagName}
                          </Anchor>

                        ))} */}
                      </nav>
                      <RegionSwitcher className='md:pl-10'/>
                    </div>
                    {isMobile && <div onClick={toggleMenu} className={`flex text-zinc-900 cursor-pointer items-center select-none z-20 rounded-lg lg:rounded-xl lg:py-[6px] lg:pr-[10px] lg:pl-[14px]
                      ${showMenu ? 'absolute top-5 lg:top-[8px] right-5 lg:right-[8px] lg:relative' : 'bg-white'}`}>
                      {!showMenu && <span className='hidden lg:inline-flex text-zinc-800 text-sm'>More</span>}
                      {showMenu ? <CloseIcon width={40} height={40} /> : <MenuIcon width={40} height={40} />
              
                      }
                    </div>}
                  </div>
                    <NavPopover showMenu={showMenu} setShowMenu={setShowMenu} className='z-10' />
                </div>
            </div>
              </div>
          </div>
        </header>
      </div>
    </>

  );
};

export default Header;