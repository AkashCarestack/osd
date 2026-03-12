export default {
  name: 'upcomingEventsSection',
  title: 'Upcoming Events Section',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'The main heading for this section',
      initialValue: 'Upcoming Events',
      validation: (Rule: any) => Rule.required().error('Title is required'),
    },
    {
      name: 'events',
      title: 'Events',
      type: 'array',
      of: [
        {
          type: 'eventObject',
        },
      ],
      validation: (Rule: any) =>
        Rule.max(10).error('Maximum 10 events allowed'),
    },
  ],
  preview: {
    select: {
      title: 'title',
      eventCount: 'events',
    },
    prepare(selection: { title: string; eventCount: any[] }) {
      const { title, eventCount } = selection
      const count = eventCount?.length || 0
      return {
        title: title || 'Upcoming Events Section',
        subtitle: `${count} event${count !== 1 ? 's' : ''}`,
      }
    },
  },
}
