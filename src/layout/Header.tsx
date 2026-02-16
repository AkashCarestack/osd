import { ArrowRightIcon, ChevronDownIcon } from '@sanity/icons'
import { CloseIcon } from '@sanity/icons'
import { MenuIcon } from '@sanity/icons';
import siteConfig from 'config/siteConfig';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import GrowthClubLogo from '~/assets/reactiveAssets/GrowthClubLogo';
import { CaseStudiesIcon } from '~/assets/reactiveAssets/svgs';
import { ArticlesIcon } from '~/assets/reactiveAssets/svgs';
import { PodcastsIcon } from '~/assets/reactiveAssets/svgs';
import { EbooksIcon } from '~/assets/reactiveAssets/svgs';
import { WebinarsIcon } from '~/assets/reactiveAssets/svgs';
import { PressIcon } from '~/assets/reactiveAssets/svgs';
import VoiceStackResources from '~/assets/reactiveAssets/VoiceStackResources';
import Anchor from '~/components/commonSections/Anchor';
import { useGlobalData } from '~/components/Context/GlobalDataContext';
import RegionSwitcher from '~/components/RegionSwitcher';
import { generateHref, normalizePath } from '~/utils/common';
import ProgressBar from '~/utils/progressBar/progressBar';
import useMediaQuery from '~/utils/useMediaQueryHook';

import { NavPopover } from './overlaynav/NavPopover';
import  {ShortNavPopover}  from './overlaynav/ShortNavPopover';


export const navigationLinks = [
  { id: 'training', label: 'Training', sectionId: 'training-section' },
  { id: 'release-notes', label: 'Release Notes', sectionId: 'release-notes-section' },
  { id: 'faqs', label: 'FAQs', sectionId: 'faqs-section' },
  { id: 'events-updates', label: 'Events & Updates', sectionId: 'events-updates-section' },
];


const Header = () => {
  let { featuredTags, homeSettings } = useGlobalData()
  const router = useRouter();
  const { locale } = router.query; 
  const [showMenu, setShowMenu] = useState(false);
  const [headerFixed, setHeaderFixed] = useState(false);
  const [navPopoverId, setNavPopoverId] = useState('nav-popover');
  const [activeSection, setActiveSection] = useState<string>('');
  const [showTopicsDropdown, setShowTopicsDropdown] = useState(false);
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
    // ID is now static to prevent hydration mismatch 
  };

  const handleScrollMob = () => {
    setHeaderFixed(window.scrollY > 44);
  };

  const scrollToSection = (sectionId: string, navId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(navId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationLinks.map((link) => link.sectionId);
      const scrollPosition = window.scrollY + 200;

      // Check if we're at the top of the page
      if (window.scrollY < 100) {
        setActiveSection('');
        return;
      }

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(navigationLinks[i].id);
            break;
          }
        }
      }
    };

    // Set initial active section
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isMobile: any = useMediaQuery(1024);


  useEffect(() => {
    window.addEventListener("scroll", handleScrollMob);
    return () => {
      window.removeEventListener("scroll", handleScrollMob);
    }
  });

  const buttonRef = React.createRef();

  const homeUrl = router.isReady ? generateHref(locale as string, siteConfig.pageURLs.home) : '/';
  const topicsUrl = router.isReady ? generateHref(locale as string, siteConfig.categoryBaseUrls.base) : '#';

  const before = "before:content-[''] before:h-[100px] before:absolute before:left-0 before:right-0 before:top-full before:bg-vs-blue";
  return (
    <>
      {/* <ProgressBar /> */}
      <div className={`relative w-full before:content-[''] before:-z-0  before:absolute before:left-0 before:right-0 before:top-[-100px] before:bg-zinc-900`}>
        <header
          className={`fixed w-full top-0 left-0 z-20 transition-all duration-300 ease-linear ${headerFixed && `!fixed w-full ${homeSettings?.demoBanner ? '!top-[-44px]' : '!top-0'}  left-0`}`}      >
          {homeSettings?.demoBanner && <div className={`bg-cs-primary group hover:bg-[#42dd88] transition-all duration-200 px-4 h-[44px]`}>
            <Anchor href="https://osdental.io/?refer=carestack " className="flex justify-center py-3">
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
                  <Link href={homeUrl} className="text-2xl font-extrabold bg-gradient-text bg-clip-text text-transparent font-monrope tracking-tighterText">
                    <VoiceStackResources/>
                  </Link>
                  <div className={`flex lg:gap-10   justify-between rounded-xl items-center`}>
                    {!isMobile && <div className='group relative py-4' onMouseEnter={() => setShowTopicsDropdown(true)} onMouseLeave={() => setShowTopicsDropdown(false)}>
                      <Link href={topicsUrl} className='text-zinc-500 flex items-center gap-[6px] cursor-pointer text-base hover:text-zinc-300'>
                        <span>
                          {`Topics`}
                        </span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ease-in-out ${showTopicsDropdown ? 'rotate-180' : ''}`} />
                      </Link>
                      {navPopoverId && <ShortNavPopover navPopoverId={navPopoverId} showMenu={showTopicsDropdown} setShowMenu={setShowTopicsDropdown} className='z-10 lg:group-hover:block lg:group-hover:visible lg:group-hover:opacity-100' />}
                    </div>}
                    <div className={`lg:flex-row top-[110px] hidden right-0 px-4 pt-4 pb-8 lg:p-0 bg-zinc-900 lg:bg-transparent left-0 lg:static flex-col gap-2 justify-between lg:items-center lg:flex`}>
                      <nav className="flex flex-col lg:flex-row lg:gap-10 flex-wrap border-b border-zinc-800 pb-4 lg:pb-0 lg:border-0">
                        {navigationLinks && navigationLinks?.map((link) => {
                          const isActive = activeSection === link.id;
                          return (
                            <button
                              key={link.id}
                              onClick={() => scrollToSection(link.sectionId, link.id)}
                              className={`text-base transition-colors duration-200 relative pb-1 lg:pb-0 ${
                                isActive
                                  ? 'text-white'
                                  : 'text-zinc-500 hover:text-zinc-300'
                              }`}
                            >
                              {link.label}
                              {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white" />
                              )}
                            </button>
                          );
                        })}
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