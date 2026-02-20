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
      initialValue: 'Turn Data Into Action with Clinical Dashboards',
      validation: (Rule) => Rule.required().error('Title is required'),
    },
    {
      name: 'titleHighlight',
      title: 'Title Highlight',
      type: 'string',
      description: 'The highlighted part of the title (optional)',
      initialValue: '',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'The description text displayed in the hero section',
      initialValue:
        'Your data should do more than sit in reports, it should drive smarter decisions and measurable growth.',
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
      title: 'Video Button Text',
      type: 'string',
      description: 'Text for the video play button overlay',
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
    {
      name: 'videoThumbnail',
      title: 'Video Thumbnail',
      type: 'image',
      description: 'Thumbnail image for the video preview on the right side',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'videoLink',
      title: 'Video Link',
      type: 'url',
      description: 'URL for the video (YouTube, Vimeo, etc.)',
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
