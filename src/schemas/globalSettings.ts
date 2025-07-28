import { DocumentIcon } from '@sanity/icons'

import link from './link'

export default {
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [{ title: 'HeaderFooter', value: 'headerFooter' }],
      },
    },
    {
      name: 'headerFooter',
      title: 'Header and Footer Settings',
      type: 'object',
      fields: [
        {
          name: 'header',
          title: 'Header Settings',
          type: 'object',
          fields: [
            {
              name: 'logo',
              title: 'Header Logo',
              type: 'image',
              options: { hotspot: true },
            },
            {
              name: 'navigationLinks',
              title: 'Navigation Links',
              type: 'array',
              of: [link],
            },
          ],
        },
        {
          name: 'footer',
          title: 'Footer Settings',
          type: 'object',
          fields: [
            {
              name: 'footerLogo',
              title: 'Footer Logo',
              type: 'image',
              options: { hotspot: true },
            },
            {
              name: 'footerLinks',
              title: 'Footer Links',
              type: 'array',
              of: [link],
            },
            {
              name: 'footerText',
              title: 'Footer Text',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}
