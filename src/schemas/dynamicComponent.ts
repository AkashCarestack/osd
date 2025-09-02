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
          { title: 'Embed Form', value: 'embedForm' },
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
    {
      name: 'embedForm',
      title: 'Embed Form',
      type: 'object',
      fields: [
        {
          name: 'formId',
          title: 'Form ID',
          type: 'string',
          description: 'HubSpot form ID (optional - will use site default if not provided)',
        },
        {
          name: 'meetingLink',
          title: 'Meeting Link',
          type: 'url',
          description: 'Meeting link to redirect to after form submission (optional)',
        },
        {
          name: 'eventName',
          title: 'Event Name',
          type: 'string',
          description: 'Custom event name for tracking (optional)',
        },
        {
          name: 'type',
          title: 'Form Type',
          type: 'string',
          options: {
            list: [
              { title: 'Default', value: 'default' },
              { title: 'Embed Form', value: 'embedForm' },
            ],
          },
          description: 'Form display type',
        },
        {
          name: 'videoLink',
          title: 'Video Link',
          type: 'url',
          description: 'Video URL to open in new tab after form submission (optional)',
        },
      ],
      hidden: ({ parent }) => parent?.componentType !== 'embedForm',
    },
  ],
  preview: {
    select: {
      title: 'componentType',
    },
  },
}
