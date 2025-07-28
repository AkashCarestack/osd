import { CodeIcon } from '@sanity/icons'
import { defineArrayMember, defineType } from 'sanity'

export default defineType({
  name: 'htmlCode',
  title: 'Embed Code',
  type: 'object',
  icon: CodeIcon,
  fields: [
    {
      name: 'htmlCode',
      title: 'Embed Code',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'htmlCode',
    },
    prepare({ title }) {
      return {
        title: 'Embed Code',
        subtitle: title ? `${title.substring(0, 30)}...` : 'Empty',
      }
    },
  },
})
