import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import { Post } from '~/interfaces/post'
import Wrapper from '~/layout/Wrapper'
import post from '~/schemas/post'
import { getRelatedFeatures } from '~/utils/common'
import { getBasePath } from '~/utils/getBasePath'

import ShareableLinks from './commonSections/ShareableLinks'
import Section from './Section'
import AllcontentSection from './sections/AllcontentSection'
import BannerSubscribeSection from './sections/BannerSubscribeSection'
import H3Large from './typography/H3Large'

interface RelatedFeaturesSectionProps {
  allPosts: any[]
  contentType?: string
}

const RelatedFeaturesSection: React.FC<RelatedFeaturesSectionProps> = ({
  allPosts,
  contentType,
}) => {
  if (!allPosts) {
    return null
  }

  return (
    <section className="flex flex-col md:!p-0 md:!pb-12  !bg-zinc-50">
      <AllcontentSection
        className={'pb-9'}
        allContent={allPosts}
        cardType="left-image-card"
        itemsPerPage={4}
        redirect={true}
        contentType={contentType}
      />
    </section>
  )
}

export default RelatedFeaturesSection
