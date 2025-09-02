import dynamic from 'next/dynamic'
import React from 'react'

const componentMap = {
  bannerBlock: dynamic(() => import('../components/sections/BannerBlock')),
  testimonialCard: dynamic(
    () => import('../components/sections/TestimonialCard'),
  ),
  embedForm: dynamic(() => import('../components/uiBlocks/EmbedFormSection')),
}

const DynamicComponent = ({ componentType, ...props }) => {
  const Component = componentMap[componentType]
  if (!Component) return null

  return <Component {...props} />
}

export default DynamicComponent
