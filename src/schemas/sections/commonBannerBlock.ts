export default {
  name: 'commonBannerBlock',
  title: 'Common Banner Block',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The main text of the CTA',
      initialValue: 'Book a demo with us!',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A brief description or subtext',
      initialValue: 'Looking for the best AI-powered phone system for your dental practice?',
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'The text to display on the CTA button',
      initialValue: 'Book Free Demo',
    },
    {
      name: 'buttonLink',
      title: 'Button Link',
      type: 'url',
      description: 'The URL the button should link to',
      validation: (Rule) => Rule.required().error('Button link is required'),
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const { title } = selection
      return {
        title: title || 'Common Banner Block',
      }
    },
  },
}

