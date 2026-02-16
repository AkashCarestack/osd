export default {
  name: 'faqSection',
  title: 'FAQ Section',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The main heading for the FAQ section',
      initialValue: 'Frequently Asked Questions',
      validation: (Rule) => Rule.required().error('Title is required'),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A brief description of the FAQ section',
      initialValue:
        'Frequently asked questions from partners, covering onboarding, integrations, workflows, and support.',
    },
    {
      name: 'readNowLink',
      title: 'Read Now Link',
      type: 'url',
      description: 'Link to view all FAQs (optional)',
    },
    {
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Item',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required().error('Question is required'),
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
              validation: (Rule) => Rule.required().error('Answer is required'),
            },
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
    },
  ],
  preview: {
    select: {
      title: 'title',
      faqCount: 'faqs',
    },
    prepare(selection) {
      const { title, faqCount } = selection
      return {
        title: title || 'FAQ Section',
        subtitle: faqCount
          ? `${faqCount.length} FAQ${faqCount.length > 1 ? 's' : ''}`
          : 'No FAQs',
      }
    },
  },
}
