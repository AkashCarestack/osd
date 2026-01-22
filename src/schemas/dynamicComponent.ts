import { InsertBelowIcon } from '@sanity/icons'

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
          { title: 'Book Free Demo Banner - en', value: 'bannerBlockUS' },
          { title: 'Book Free Demo Banner - en-GB', value: 'bannerBlockGB' },
          { title: 'Book Free Demo Banner - en-AU', value: 'bannerBlockAU' },
          { title: 'Custom Banner Block', value: 'commonBannerBlock' },
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
      name: 'bannerBlockUS',
      title: 'Demo Banner Block - US',
      type: 'demoBannerBlockUS',
      hidden: ({ parent }) => parent?.componentType !== 'bannerBlockUS',
    },
    {
      name: 'bannerBlockGB',
      title: 'Demo Banner Block - UK',
      type: 'demoBannerBlockGB',
      hidden: ({ parent }) => parent?.componentType !== 'bannerBlockGB',
    },
    {
      name: 'bannerBlockAU',
      title: 'Demo Banner Block - AU',
      type: 'demoBannerBlockAU',
      hidden: ({ parent }) => parent?.componentType !== 'bannerBlockAU',
    },
    {
      name: 'commonBannerBlock',
      title: 'Common Banner Block',
      type: 'commonBannerBlock',
      hidden: ({ parent }) => parent?.componentType !== 'commonBannerBlock',
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
        {
          name: 'sidebarTitle',
          title: 'Sidebar Title',
          type: 'string',
          description: 'Title to display in the sidebar (optional)',
        },
        {
          name: 'pdfUrl',
          title: 'PDF Download URL',
          type: 'url',
          description: 'PDF URL to download when form is submitted (optional)',
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
