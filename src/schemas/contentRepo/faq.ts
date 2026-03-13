import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'partner',
      title: 'Partner',
      type: 'reference',
      to: [{ type: 'partner' }],
      description:
        'Optional. Select a partner to scope this FAQ to that partner. Leave empty for site-wide.',
    }),
    defineField({
      name: 'name',
      title: 'FAQ Name',
      type: 'string',
      description: 'The title or name of this FAQ collection',
      validation: (Rule) => Rule.required().error('FAQ name is required'),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required().error('Author is required'),
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ List',
      type: 'array',
      description: 'Add questions and answers to this FAQ collection',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Item',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) =>
                Rule.required().error('Question is required'),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              validation: (Rule) => Rule.required().error('Answer is required'),
            }),
          ],
          preview: {
            select: {
              title: 'question',
            },
            prepare(selection) {
              const { title } = selection
              return {
                title: title || 'Untitled FAQ',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).error('At least one FAQ is required'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      authorName: 'author.name',
      faqCount: 'faqs',
      partnerName: 'partner.partnerName',
    },
    prepare(selection) {
      const { title, authorName, faqCount, partnerName } = selection
      const parts = [authorName, `${faqCount?.length || 0} FAQs`].filter(Boolean)
      if (partnerName) parts.push(partnerName)
      return {
        title: title || 'Untitled FAQ',
        subtitle: parts.join(' • '),
      }
    },
  },
})
