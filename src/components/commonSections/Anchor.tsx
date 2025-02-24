import { useTracking } from 'cs-tracker'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { getCssSelectorShort } from '~/helpers/createCSSSelector'
import { getParams, getQueryParamFromLink } from '~/helpers/getQueryParams'
import { generateId } from '~/utils/common'
import { getCookie } from '~/utils/tracker/cookie'
import { useTrackUser } from '~/utils/tracker/intitialize'

interface LinkProps {
  link?: any
  children?: React.ReactNode
  target?: '_blank' | '_self' | '_parent' | '_top' | '';
  isDemo?: boolean
  [x: string]: any
  className?: string
}

const Anchor: React.FunctionComponent<LinkProps> = ({
  href,
  children,
  elementId,
  isDemo,
  target,
  className,
  ...rest
}) => {
  const router = useRouter();

  const { Track, trackEvent } = useTracking({}, {})
  const [newLink, setNewLink] = useState("#");
  const trackCtx = useTrackUser();
  const [btnId, setBtnId] = useState<any>("");


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


    return (
      <Link id={generateId(href)}
      onClick={(e) => {
        const element = getCssSelectorShort(e.target as Element);
        let e_name = "";
        const utm_term = getQueryParamFromLink(newLink, 'utm_term');
        if (utm_term) {
          e_name = utm_term;
        } else {
          if (!newLink.includes('https://')) {
            e_name = (rest.className?.split('_')[0] !== undefined ? `${rest.className?.split('_')[0]}` :
              "internal-link")
          } else {
            e_name = "external-link"
          }
        }
        const {
          utm_source = null,
          utm_content = null,
          utm_campaign = null,
          utm_medium = null,
          ...params
        } = getParams();

        trackEvent({
          e_type: 'click',
          e_name,
          e_time: new Date(),
          element,
          element_id: generateId(href),
          current_path: window.location.href,
          utm_campaign,
          utm_content,
          utm_source,
          utm_term,
          utm_medium,
          url_params: params,
          base_path: window.location.origin + window.location.pathname,
          domain: window.location.origin,
          referrer_url: window.document.referrer
        });
      }} 
      href={href} className={className} target={target} {...rest}>
        {children}
      </Link>
    )


}

export default Anchor


