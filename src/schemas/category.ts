import { ProjectsIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import { isUniqueCategorySlugPerPartner } from '~/lib/sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: 'partner',
      title: 'Partner',
      type: 'reference',
      to: [{ type: 'partner' }],
      description:
        'Leave empty for default/site-wide home settings. Set to show this layout for a specific partner.',
    }),
    defineField({
      name: 'categoryName',
      title: 'Category Name',
      type: 'string',
    }),
    defineField({
      name: 'categoryDescription',
      title: 'Category Description',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Page Path',
      type: 'slug',
      description:
        'Unique per partner. Same path can be used for different partners (e.g. deo-operations for DEO and for Fortune).',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'categoryName',
        maxLength: 96,
        isUnique: isUniqueCategorySlugPerPartner,
      },
    }),
    defineField({
      name: 'associatedContent',
      title: 'Associated Content',
      description:
        'Select content/blog posts related to this category. The first item will be auto-selected when visiting this topic page.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'post' }],
        },
      ],
    }),
    defineField({
      name: 'glossary',
      title: 'Glossary',
      description:
        'Select a glossary from the content repository to associate with this category.',
      type: 'reference',
      to: [{ type: 'glossary' }],
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      description:
        'Select an FAQ from the content repository to associate with this category.',
      type: 'reference',
      to: [{ type: 'faq' }],
    }),
  ],
  preview: {
    select: {
      title: 'categoryName',
    },
  },
})
