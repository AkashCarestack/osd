export default {
  name: 'eventObject',
  title: 'Event',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Event Title',
      type: 'string',
      description: 'The title of the event',
      validation: (Rule: any) => Rule.required().error('Event title is required'),
    },
    {
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      description: 'Type of event (e.g., Offline, Online)',
      options: {
        list: [
          { title: 'Offline', value: 'Offline' },
          { title: 'Online', value: 'Online' },
        ],
      },
      initialValue: 'Offline',
      validation: (Rule: any) => Rule.required().error('Event type is required'),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Event location (e.g., Dallas, TX)',
    },
    {
      name: 'date',
      title: 'Event Date',
      type: 'date',
      description: 'Date of the event',
      validation: (Rule: any) => Rule.required().error('Event date is required'),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional description of the event',
    },
    {
      name: 'link',
      title: 'External Link',
      type: 'url',
      description: 'Optional external link for the event',
    },
  ],
  preview: {
    select: {
      title: 'title',
      eventType: 'eventType',
      date: 'date',
    },
    prepare(selection: { title: string; eventType: string; date: string }) {
      const { title, eventType, date } = selection
      const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : ''
      return {
        title: title || 'Untitled Event',
        subtitle: `${eventType || ''} ${formattedDate ? `• ${formattedDate}` : ''}`.trim(),
      }
    },
  },
}
