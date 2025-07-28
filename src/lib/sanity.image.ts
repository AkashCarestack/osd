import createImageUrlBuilder from '@sanity/image-url'

import { dataset, projectId } from '~/lib/sanity.api'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

interface ImageDimensions {
  width?: number
  height?: number
  quality?: number
}

export const urlForImage = (source: any, dimensions?: ImageDimensions) => {
  if (typeof source === 'string' && source.startsWith('http')) {
    return source
  }

  if (typeof source === 'object' && source?.asset?._ref) {
    let urlBuilder = imageBuilder.image(source).auto('format')

    if (dimensions) {
      if (dimensions.width) {
        urlBuilder = urlBuilder.width(Math.round(dimensions.width))
      }
      if (dimensions.height) {
        urlBuilder = urlBuilder.height(Math.round(dimensions.height))
      }
      urlBuilder = urlBuilder.quality(dimensions.quality || 90)
    }

    return urlBuilder.url()
  }

  if (typeof source === 'string' && source.startsWith('image-')) {
    const imageRef = {
      asset: {
        _ref: source,
        _type: 'reference',
      },
      _type: 'image',
    }

    let urlBuilder = imageBuilder.image(imageRef).auto('format')

    if (dimensions) {
      if (dimensions.width) {
        urlBuilder = urlBuilder.width(Math.round(dimensions.width))
      }
      if (dimensions.height) {
        urlBuilder = urlBuilder.height(Math.round(dimensions.height))
      }
      urlBuilder = urlBuilder.quality(dimensions.quality || 90)
    }

    return urlBuilder.url()
  }

  return undefined
}
