import React from 'react';
// import { GlobalDataProvider } from '../context/GlobalDataProvider';
import Header from '../layout/Header';
import { GlobalDataProvider } from '~/components/Context/GlobalDataContext';
import Footer from '~/layout/Footer';
import { readToken } from '~/lib/sanity.api'
import {
  getCategories,
  getHomeSettings,
  getSiteSettings,
  getTags,
  getTagsByOrder,
} from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'
import { Post } from '~/interfaces/post'
import { getClient } from '~/lib/sanity.client'
import { GetStaticProps } from 'next';
import Section from '~/components/Section';
import Wrapper from '~/layout/Wrapper';
import Layout from '~/components/Layout';
import Button from '~/components/commonSections/Button';

interface IndexPageProps {
  categories: any;
  tags: Array<any>
  homeSettings: any
}

export const getStaticProps: GetStaticProps<
  SharedPageProps
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)

  try {
    const [
      tags,
      tagsByOrder,
      homeSettings,
      siteSettings,
      categories
    ] = await Promise.all([
      getTags(client),
      getTagsByOrder(client),
      getHomeSettings(client),
      getSiteSettings(client),
      getCategories(client)
    ])

    return {
      props: {
        draftMode,
        token: draftMode ? readToken : '',
        tags,
        tagsByOrder,
        homeSettings,
        siteSettings,
        categories
      },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: {
        draftMode,
        token: draftMode ? readToken : '',
        posts: [],
        tags: [],
        homeSettings: [],
        error: true,
      },
    }
  }
}

const Custom404 = (props: IndexPageProps) => {
  const homeSettings = props?.homeSettings
  
  

   return (
    <GlobalDataProvider
      data={props?.categories}
      featuredTags={homeSettings?.featuredTags}
      homeSettings={homeSettings}
    >
    
      <Layout>
        <Section className="justify-center">
          <Wrapper className={`flex-col`}>
          <div className='min-h-[40vh] flex flex-col justify-center items-center text-center gap-10'>
              <h1 className='text-xl md:text-2xl text-zinc-800'><span className='font-bold md:text-3xl'>404</span> - This page could not be found.</h1>
              <div className='self-center flex justify-center'>
                <Button className='bg-zinc-900  hover:bg-zinc-700 !no-underline' link="/">
                  <span className='text-base font-medium'>Go to Home Page</span>
                </Button>
              </div>
          </div>
          </Wrapper>
        </Section>
      </Layout>
    </GlobalDataProvider>
   );
};

export default Custom404;