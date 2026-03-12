import { UsersIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'partnerName',
      title: 'Partner Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Page Path',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'partnerName',
        maxLength: 96,
      },
    }),
  ],
  preview: {
    select: {
      title: 'partnerName',
    },
  },
})
