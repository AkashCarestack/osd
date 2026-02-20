export default {
  name: 'whyPracticeLoveSection',
  title: 'Why Practices Love Section',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'The main heading for this section',
      initialValue: 'Why Practices Love Clinical Dashboards',
      validation: (Rule: any) => Rule.required().error('Title is required'),
    },
    {
      name: 'description',
      title: 'Section Description',
      type: 'text',
      description: 'The description text displayed below the title',
      initialValue:
        'Clinical Dashboards give your practice a powerful, visual snapshot of key clinical performance metrics and insights all in one easy-to-use view. No spreadsheets. No guesswork. Just clear insights that help you move faster and improve performance.',
      validation: (Rule: any) => Rule.required().error('Description is required'),
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'feature',
          title: 'Feature',
          fields: [
            {
              name: 'title',
              title: 'Feature Title',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Feature Description',
              type: 'text',
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.max(4).error('Maximum 4 features allowed'),
    },
    {
      name: 'ctaTitle',
      title: 'CTA Banner Title',
      type: 'string',
      description: 'Title for the call-to-action banner',
      initialValue: 'Ready to see it in action?',
    },
    {
      name: 'ctaDescription',
      title: 'CTA Banner Description',
      type: 'text',
      description: 'Description for the call-to-action banner',
      initialValue:
        "Book a demo with a member of our OS Dental team to learn how Clinical Dashboards can support your practice's growth.",
    },
    {
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Book a Clinical Demo',
    },
    {
      name: 'ctaButtonLink',
      title: 'CTA Button Link',
      type: 'url',
      description: 'URL for the CTA button',
    },
    {
      name: 'ctaBackgroundImage',
      title: 'CTA Background Image',
      type: 'image',
      description: 'Background image for the CTA banner',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection: { title: string }) {
      return {
        title: selection.title || 'Why Practices Love Section',
      }
    },
  },
}
