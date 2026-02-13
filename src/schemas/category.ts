import {ProjectsIcon} from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: ProjectsIcon,
  fields: [
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
      validation: (Rule) => Rule.required(),
      options: {
        source: 'categoryName',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'associatedContent',
      title: 'Associated Content',
      description: 'Select content/blog posts related to this category. The first item will be auto-selected when visiting this topic page.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'post' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'categoryName',
    },
  },
})
