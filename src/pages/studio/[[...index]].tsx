import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { NextStudio } from 'next-sanity/studio'
import { metadata } from 'next-sanity/studio/metadata'
import config from 'sanity.config'

import { getClient } from '~/lib/sanity.client'
import { getSiteSettings } from '~/lib/sanity.queries'

interface StudioPageProps {
  favicon?: string
}

export default function StudioPage({ favicon }: StudioPageProps) {
  return (
    <>
      <Head>
        {Object.entries(metadata).map(([key, value]) => (
          <meta key={key} name={key} content={value} />
        ))}
        {favicon && (
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
        )}
      </Head>
      <NextStudio config={config} unstable_globalStyles />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<StudioPageProps> = async () => {
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

  return {
    props: {
      favicon: favicon || null,
    },
  };
};
