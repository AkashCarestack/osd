import Image from 'next/image'
import React from 'react'

import { urlForImage } from '~/lib/sanity.image'

import ImageLoader from '../commonSections/ImageLoader'

const ImageBlock = ({ image }: any) => {
  return (
    image && (
      <ImageLoader
        image={image || ''}
        alt={image.alt || ''}
        width={500}
        height={300}
         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    )
  )
}

export default ImageBlock
