import { useTracking } from 'cs-tracker'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { getCssSelectorShort } from '~/helpers/createCSSSelector'
import { getParams, getQueryParamFromLink } from '~/helpers/getQueryParams'
import { getCookie } from '~/utils/tracker/cookie'
import { useTrackUser } from '~/utils/tracker/intitialize'

import Anchor from './Anchor'

interface ButtonProps {
  type?:
    | 'ghost'
    | 'primary'
    | 'primaryWhite'
    | 'outlineArrow'
    | 'learnMore'
    | 'secondary'
    | 'secondaryLg'
    | 'secondaryWhite'
    | 'secondaryWhiteChevron'
    | 'secondaryWhiteChevronLg'
    | 'secondary-md'
    | 'secondary-bg'
    | 'primaryArrow'
    | 'login'
    | 'primary-v1'
    | 'primaryBlackChevron'
    | 'primaryBlackChevronLg'
    | 'secondaryBlack'
    | 'secondaryBlackChevron'
    | 'secondaryBlackChevronLg'
    | 'secondaryBlackChevronMd'
    | 'primaryChevron'
    | 'learnMoreChevron'
    | 'primaryBlack'
    | 'videoButton'
    | 'primaryLg'
  alter?: 'bgWhite' | 'borderWhite' | 'disabled' | 'default'
  children?: React.ReactNode
  link?: any
  target?: '_blank' | '_self' | '_parent' | '_top' | '';
  isDemo?: boolean
  [x: string]: any
  className?: string
}

const Button: React.FunctionComponent<ButtonProps> = ({
  type,
  alter,
  children,
  link,
  isDemo,
  target,
  className,
  href,
  ...rest
}) => {
  const baseClasses = `bg-zinc-500 hover:bg-zinc-600 text-white px-6 py-[14px] text-base leading-[1.5] font-medium rounded-[5px] flex items-center whitespace-nowrap  ${className}`
  const router = useRouter();

  const { Track, trackEvent } = useTracking({}, {})
  const [newLink, setNewLink] = useState("#");
  const trackCtx = useTrackUser();


  useEffect(() => {

    const { query } = router

    const queryParams: Record<string, string> = Object.entries(query).reduce((acc: any, [key, value]) => {
      if (value !== undefined && key !== "slug") {
        acc[key] = value.toString();
      }
      return acc;
    }, {});

    const noParams = Object.keys(queryParams).length === 0;

    const urlSearchParams = new URLSearchParams(queryParams);

    // Get the existing URL parameters from href
    const existingParams = href?.includes('?') ? href?.split('?')[1] : '';

    // Merge existing parameters with updated URL params
    let updatedParams = `${existingParams ? (noParams ? existingParams : existingParams + '&') : ""}${urlSearchParams.toString()}`;
    // Append updated URL params to href
    const countryVersion: any = getCookie("__cs_ver");

    // if (href.includes('https://') && (countryVersion != 2)) {
    //   const host = window?.location?.host;
    //   const url = new URL(href ?? "");
    //   let a = new RegExp('/' + host + '/');
    //   if (!a.test(url.host) && !router.query.session && !router.query.user) {
    //     let trackingParams = `session=${trackCtx?.sessionId}&user=${trackCtx?.userId}`;
    //     updatedParams += updatedParams.length > 0 ? "&" + trackingParams : "" + trackingParams
    //   }
    // }

    if (router.asPath.startsWith("/lp")) {
      setNewLink(`${href}`);
    }
    else if (router.asPath.startsWith("/uk")) {
      setNewLink(`${href}`);
    }
    else {

      setNewLink(`${href?.split('?')[0]}${updatedParams.length > 0 ? "?" + updatedParams : ""}`);
    }
  }, [href, router, trackCtx]);

  if (link) {
    return (
      <Anchor  
      href={link} className={baseClasses} target={target} {...rest}>
        {children}
      </Anchor>
    )
  }

  return (
    <button className={baseClasses} {...rest}>
      {children}
    </button>
  )
}

export default Button
