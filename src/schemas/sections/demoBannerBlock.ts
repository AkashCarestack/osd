import { init } from 'next/dist/compiled/webpack/webpack'

export default {
  name: 'demoBannerBlock',
  title: 'Call to Action Block',
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
      initialValue: 'Looking for the best cloud-based dental software?',
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
      initialValue: 'https://voicestack.com/#demo',
    },
  ],
  preview: {
    prepare(selection) {
      const { bio, title } = selection
      return { ...selection, title: title && `${title}` }
    },
  },
}
