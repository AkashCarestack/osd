import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'glossary',
  title: 'Glossary',
  type: 'document',
  fields: [
    defineField({
      name: 'mainHeading',
      title: 'Main Heading',
      type: 'string',
      validation: (Rule) => Rule.required().error('Main heading is required'),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    }),
    defineField({
      name: 'terms',
      title: 'Terms',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'term',
          title: 'Term',
          fields: [
            defineField({
              name: 'term',
              title: 'Term',
              type: 'string',
              validation: (Rule) => Rule.required().error('Term name is required'),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'text',
              description: 'Description or definition of the term',
              validation: (Rule) => Rule.required().error('Term value is required'),
            }),
          ],
          preview: {
            select: {
              title: 'term',
            },
            prepare(selection) {
              const { title } = selection
              return {
                title: title || 'Untitled Term',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).error('At least one term is required'),
    }),
  ],
  preview: {
    select: {
      title: 'mainHeading',
      subheading: 'subheading',
      termCount: 'terms',
    },
    prepare(selection) {
      const { title, subheading, termCount } = selection
      return {
        title: title || 'Untitled Glossary',
        subtitle: subheading
          ? `${subheading} • ${termCount?.length || 0} terms`
          : `${termCount?.length || 0} terms`,
      }
    },
  },
})
