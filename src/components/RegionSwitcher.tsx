import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

import ChevronDown from '~/assets/reactiveAssets/ChevronUp'

import ImageLoader from './commonSections/ImageLoader'

interface RegionSwitcherProps {
  className?: string
}

export const regions = [
  {
    "flag": {
      "url": "https://cdn.sanity.io/images/76tr0pyh/production/ae5158a9a8fd8ce578ee8df1ba1ffa1bcee41b84-24x24.svg",
      "title": "US"
    },
    "url": "/",
    "title": "US",
    "locale": "en",
    "regionName": "USA"
  },
  {
    "flag": {
      "url": "https://cdn.sanity.io/images/76tr0pyh/production/a6e6286f1884de71a5c0f801fce92438c8e30aca-24x24.svg",
      "title": "UK"
    },
    "url": "/en-GB",
    "title": "UK",
    "locale": "en-GB",
    "regionName": "UK"
  },
  {
    "flag": {
      "url": "/assets/countryFlags/EN-AU.png",
      "title": "AU"
    },
    "url": "/en-AU",
    "title": "AU",
    "locale": "en-AU",
    "regionName": "ANZ"
  }

]
const RegionSwitcher: React.FC<RegionSwitcherProps> = ({
  className
}) => {
  const router = useRouter();
  const matchedRegion = regions.find((region) => {
    return (
      region.locale === router.locale ||
      region.locale === router.query.locale ||
      (region.url === router.pathname && 'en')
    ) || false
  }) || regions[0];
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [openSwitcher, setOpenSwitcher] = useState(false);

  useEffect(() => {
    setCurrentRegion(router.locale || router.query.locale);
  }, [router?.locale, router?.query.locale])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenSwitcher(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSwitcher = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenSwitcher(prev => !prev);
  }

  return (
    <div className={className}>
      {regions && regions.length > 0 && (
        <div className='relative hidden lg:flex w-[76px]' ref={containerRef}>
          <div className='flex md:w-24 px-2 py-[6px] rounded-[10px] bg-white/10 w-full shadow-[0px_7px_40px_0px_rgba(0,0,0,0.10)]'>
            <button 
              className='select-none flex w-full items-center gap-2 p-[6px] justify-between cursor-pointer text-gray-900'
              onClick={toggleSwitcher}
              type="button"
            >
              {matchedRegion && (
                <ImageLoader
                  image={matchedRegion.flag.url}
                  alt={matchedRegion.flag.title}
                  title={matchedRegion.flag.title}
                  className="transform duration-300 group-hover:scale-105 !w-[23px] !h-[23px] rounded-full"
                />
              )}
              <div className={`${openSwitcher ? '-rotate-180' : ''} transition-transform linear duration-300`}>
                <ChevronDown color='white'  />
              </div>
            </button>
          </div>

          <div className={`md:w-18 overflow-hidden rounded-[10px] bg-white shadow-[0px_7px_40px_0px_rgba(0,0,0,0.10)] absolute top-[calc(100%+4px)] left-0 right-0 flex-col ${openSwitcher ? 'flex' : 'hidden'}`}>
            {regions.map((region) => (
              currentRegion === region.locale ? (
                <div key={region.locale} className="flex gap-2 items-center opacity-80 p-[10px] border-b border-zinc-200 last:border-none">
                  <ImageLoader
                    image={region.flag.url}
                    alt={region.flag.title}
                    title={region.flag.title}
                    width={23}
                    height={23}
                    className="transform duration-300 group-hover:scale-105 !w-[23px] !h-[23px] rounded-full"
                  />
                  <span className='text-gray-900 text-sm font-medium'>{region.title}</span>
                </div>
              ) : (
                <a 
                  key={region.locale} 
                  href={region.url} 
                  className='flex gap-2 items-center p-[10px] border-b border-zinc-200 hover:bg-zinc-200 transform duration-300 last:border-none w-full'
                >
                  <ImageLoader
                    image={region.flag.url}
                    alt={region.flag.title}
                    title={region.flag.title}
                    width={23}
                    height={23}
                    className="transform duration-300 group-hover:scale-105 !w-[23px] !h-[23px] rounded-full"
                  />
                  <span className='text-gray-900 text-sm font-medium'>{region.title}</span>
                </a>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RegionSwitcher
