import { InsertBelowIcon } from '@sanity/icons'

import demoBannerBlock from './sections/demoBannerBlock'

export default {
  name: 'dynamicComponent',
  title: 'Dynamic Component',
  icon: InsertBelowIcon,
  type: 'object',
  fields: [
    {
      name: 'componentType',
      title: 'Component Type',
      type: 'string',
      options: {
        list: [
          { title: 'Book Free Demo Banner', value: 'bannerBlock' },
          { title: 'Testimonial Card', value: 'testimonialCard' },
          //add the component name
        ],
      },
    },
    {
      name: 'content',
      title: 'Text Content',
      type: 'array',
      of: [{ type: 'block' }],
      hidden: ({ parent }) => parent?.componentType !== 'textBlock',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.componentType !== 'imageBlock',
    },
    {
      name: 'caption',
      title: 'Image Caption',
      type: 'string',
      hidden: ({ parent }) => parent?.componentType !== 'imageBlock',
    },
    {
      name: 'bannerBlock',
      title: 'Demo Banner Block',
      type: 'demoBannerBlock',
      hidden: ({ parent }) => parent?.componentType !== 'bannerBlock',
    },
    {
      name: 'testimonialCard',
      title: 'Testimonial Card',
      type: 'testimonialCard',
      hidden: ({ parent }) => parent?.componentType !== 'testimonialCard',
    },
  ],
  preview: {
    select: {
      title: 'componentType',
    },
  },
}
