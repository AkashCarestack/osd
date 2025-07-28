import {TagsIcon} from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import { isUniqueAcrossAllDocuments } from '~/lib/sanity'

export default defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  icon: TagsIcon,
  fields: [
    defineField({
      name: 'tagName',
      title: 'Tag Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Page Path',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'tagName',
        maxLength: 96,
      },
    }),
  ],
  preview: {
    select: {
      title: 'tagName',
    },
  },
})
