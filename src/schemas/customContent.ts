import { ComposeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'customContent',
  title: 'Custom Content',
  icon: ComposeIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Ebook', value: 'ebook' },
          { title: 'Article', value: 'article' },
          { title: 'Webinar', value: 'webinar' },
          { title: 'Podcast', value: 'podcast' },
          { title: 'Case Study', value: 'case-study' },
          { title: 'Press Release', value: 'press-release' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Page Path',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),

    defineField({
      name: 'customImage',
      title: 'Custom Image',
      description: 'Provide a custom image for the post',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'contentType',
    },
  },
})
