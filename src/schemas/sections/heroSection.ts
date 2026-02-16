export default {
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The main heading text',
      initialValue: 'Centralized Resource for',
      validation: (Rule) => Rule.required().error('Title is required'),
    },
    {
      name: 'titleHighlight',
      title: 'Title Highlight',
      type: 'string',
      description: 'The highlighted part of the title (optional)',
      initialValue: 'OS Dental & DEO Group',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'The description text displayed in the hero section',
      initialValue:
        "Here you'll find product updates, onboarding guides, training materials, and key resources to support implementation and ongoing success.",
      validation: (Rule) => Rule.required().error('Description is required'),
    },
    {
      name: 'primaryButtonText',
      title: 'Primary Button Text',
      type: 'string',
      description: 'Text for the primary button (white button)',
      initialValue: 'Book a Clinical Demo',
    },
    {
      name: 'primaryButtonLink',
      title: 'Primary Button Link',
      type: 'url',
      description: 'URL for the primary button',
    },
    {
      name: 'secondaryButtonText',
      title: 'Secondary Button Text',
      type: 'string',
      description: 'Text for the secondary button (transparent with border)',
      initialValue: 'Clinical Dashboards Overview',
    },
    {
      name: 'secondaryButtonLink',
      title: 'Secondary Button Link',
      type: 'url',
      description: 'URL for the secondary button',
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Background image for the hero section',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      titleHighlight: 'titleHighlight',
    },
    prepare(selection) {
      const { title, titleHighlight } = selection
      return {
        title: title || 'Hero Section',
        subtitle: titleHighlight ? `${title} ${titleHighlight}` : title,
      }
    },
  },
}
