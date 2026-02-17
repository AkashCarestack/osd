import '~/styles/global.scss'

import track, { getDeviceData } from 'cs-tracker'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { usePathname } from 'next/navigation'
import Router from 'next/router'
import Script from 'next/script'
import { lazy, useEffect } from 'react'

import BookDemoContextProvider from '~/components/Context/BookDemoProvider'
import { getClient } from '~/lib/sanity.client'
import { getSiteSettings } from '~/lib/sanity.queries'
import { cookieSelector, slugToCapitalized } from '~/utils/common'
import { orgSchema, siteLinkSchema } from '~/utils/customHead'
import { checkCookie, eraseCookie,getCookie } from '~/utils/tracker/cookie'
import { addEvent } from '~/utils/tracker/events'
import { createObservedUser, createSession, createUser, getUserData, TrackUserProvider } from '~/utils/tracker/intitialize'
import { getSession } from '~/utils/tracker/session'
import { getUser } from '~/utils/tracker/user'

export interface SharedPageProps {
  draftMode?: boolean
  token?: string
  locale?: string
  favicon?: string
}

const PreviewProvider = lazy(() => import('~/components/PreviewProvider'))


function App({
  Component,
  pageProps,
}: AppProps<SharedPageProps>) {
  const { draftMode, token, favicon } = pageProps
  const pathname: any = usePathname()
  const currentWindow = pathname && pathname?.split('/') || []
  const index = pathname?.split('/').length - 1 || 0
  const result = slugToCapitalized(currentWindow[index])

  // Initialize dataLayer and track route changes for GTM
  useEffect(() => {
    // Initialize dataLayer if it doesn't exist
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
    }

    // Track page views on route changes
    const handleRouteChange = (url: string) => {
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'page_view',
          page_path: url,
        });
      }
    };

    Router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <>
      <TrackUserProvider>
      <BookDemoContextProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YY0CHYH7EY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YY0CHYH7EY');
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KCX7H59S');
          `}
        </Script>
        {/* <!--[BEGIN Google Tag Manager (noscript)]--> */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KCX7H59S" height="0" width="0"
          style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        {/* <!--[END Google Tag Manager (noscript)]--> */}
        <Head>
          {favicon ? (
            <>
              <link
                rel="icon"
                href={favicon}
                sizes="32x32"
                type="image/png"
              />
              <link
                rel="icon"
                href={favicon}
                sizes="16x16"
                type="image/png"
              />
              <link rel="shortcut icon" href={favicon} type="image/x-icon" />
            </>
          ) : (
            <>
              <link
                rel="icon"
                href="/favicon-32x32.ico"
                sizes="32x32"
                type="image/png"
              />
              <link
                rel="icon"
                href="/VoiceStack.svg"
                sizes="16x16"
                type="image/png"
              />
              <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
            </>
          )}
        </Head>
        {orgSchema()}
        {siteLinkSchema()}
        {draftMode ? (
          <PreviewProvider token={token}>
            <Component {...pageProps} />
          </PreviewProvider>
        ) : (
          <Component {...pageProps} />
        )}
      </BookDemoContextProvider>
      </TrackUserProvider>
    </>
  )
}

let trackData: any[] = [];
let isSending = false;
const TrackWrapper = track(
  { app: "voicestack", },
  {
    dispatch: dispatchEvent
  },
  // }
)(App);

TrackWrapper.getInitialProps = async (appContext: any) => {
  let favicon = null;
  
  try {
    const client = getClient();
    const siteSettings = await getSiteSettings(client);
    const siteSetting = siteSettings?.[0];
    
    if (siteSetting?.favicon?.url) {
      favicon = siteSetting.favicon.url;
    }
  } catch (error) {
    console.error('Error fetching site settings for favicon:', error);
  }

  // Call the page's getInitialProps if it exists
  // Note: Pages using getStaticProps/getServerSideProps will have their props
  // automatically merged, so we only need to call getInitialProps for pages that use it
  let pageProps: any = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    ...pageProps,
    favicon,
  };
};

export default TrackWrapper;


function dispatchEvent(data: any) {
  const cookieAnalytics = cookieSelector(getCookie('cookieyes-consent'), 'analytics')
  const countryVersion: any = getCookie("__cs_ver");
  const pageVersion: any = getCookie("__cs_pc");

  if ((cookieAnalytics && cookieAnalytics !== "yes") && countryVersion == 2 && !(pageVersion === "ph-c")) {
    return
  }

  if (checkCookie()) {
    // const isProduction = process.env.NEXT_PUBLIC_NODE_ENV === "production";
    // if (isProduction) {
    const temp = { ...data };
    delete temp.internalData; // deleting because it is using for internal purpose only.
    trackData.push(temp);
    const domain = window.location.origin;
    // if (window !== undefined && trackData.length > 0 && !isSending) {
    if (window !== undefined && trackData.length > 0 && !isSending && domain === "https://osdental.io") {
      const user = getUser()
      if (user) {

        if (!data.internalData.observedUser) {
          getUserData(user).then(res => {
            if (res) {
              const observedUser = createObservedUser(res)
              data.internalData.setObservedUser(observedUser)
            }
          })
        }
        data.internalData.setUserId(getUser())
        isSending = true
        const session = getSession()
        // If session is not present create
        if (!session) {

          createSession().then(res => {

            if (res) {
              data.internalData.setSessionId(res.sessionId)
              trackData.forEach(item => {
                item.session_id = res?.sessionId;
              })
            }
            setTimeout(() => {
              addEvent(trackData).then((res) => {
                if (res.msg === "success") {
                  trackData = [];
                }
              }).finally(() => { isSending = false });
            }, 1000);
          }).catch(err => {
            if (err?.error === "user_key_invalid") {
              eraseCookie('__cs_pv');
              eraseCookie('session');
              isSending = false;
              trackData = [];
              dispatchEvent(data);
            }
          })
        } else {
          setTimeout(() => {
            addEvent(trackData).then((res) => {
              /**
               *  If there is any error occur on session_id or user_id;
               *  or deleted from the database for some reason, we need to create
               * new user. 
               * 
               * the flow will be like this:
               *  posts data -> errored from api (must have response <session|user>_key_invalid)
               *  -> delete cookie of user and session ( if error is in user_id, session_id cookie should be deleted as well.)
               * -> resetting all the settings for dispatchEvent -> recurse dispatchEvent.
               */
              if (res.error) {
                if (res.error === "session_key_invalid") {
                  eraseCookie('session');
                  isSending = false;
                  trackData = [];
                  dispatchEvent(data);
                }
                if (res.error === "user_key_invalid") {
                  eraseCookie('__cs_pv');
                  eraseCookie('session');
                  isSending = false;
                  trackData = [];
                  dispatchEvent(data);
                }
              }
              if (res.msg === "success") {
                trackData = [];
              }
            }).finally(() => {
              isSending = false
            });
          }, 1000);
        }
      } else {
        trackData = []; // emptying the current data for not duplicating from what we already have, (It should only have one data which occur on firs event)
        getDeviceData().then(res => {
          createUser(res).then(res => {
            if (res) {
              const observedUser = createObservedUser(res);
              data.internalData.setObservedUser(observedUser)
              data.internalData.setUserId(res.id);
              dispatchEvent(data);
            }
          })
        })
      }
    }
  }
}