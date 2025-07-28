import {DashboardIcon} from '@sanity/icons'
import { defineField, defineType } from 'sanity'
export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  icon: DashboardIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'testimonialName',
      title: 'Testimonial Name',
      type: 'string',
      description: 'Highlight testimonial',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Page Path',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'testimonialName',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'customer',
      title: 'Customer',
      type: 'reference',
      to: [{ type: 'customer' }],
      description: 'The customer associated with this testimonial',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'A brief summary of the testimonial',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'layoutSwitcher',
      title: 'Layout Switcher',
      type: 'boolean',
      description: 'Toggle to switch between layouts',
    }),
    defineField({
      name: 'hasVideo',
      title: 'Has Video',
      type: 'boolean',
      description: 'Whether a video is associated with this testimonial',
    }),
    defineField({
      name: 'videos',
      title: 'Video',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'videos' }],
        },
      ],
    }),

    // Tags Field
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'tag' }],
        },
      ],
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
      title: 'testimonialName',
      media: 'image',
      language: 'language',
      customer: 'customer.name',
    },
    prepare(selection) {
      const { title, media,language,customer } = selection
      return {
        title,
        subtitle: `${customer} - ${language}`,
        media,
      }
    },
  },
})
