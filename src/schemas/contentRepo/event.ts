import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      description: 'The title of the event',
      validation: (Rule) => Rule.required().error('Event title is required'),
    }),
    defineField({
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
      validation: (Rule) => Rule.required().error('Event type is required'),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Event location (e.g., Dallas, TX)',
    }),
    defineField({
      name: 'date',
      title: 'Event Date',
      type: 'date',
      description: 'Date of the event',
      validation: (Rule) => Rule.required().error('Event date is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional description of the event',
    }),
    defineField({
      name: 'link',
      title: 'External Link',
      type: 'url',
      description: 'Optional external link for the event',
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
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
})
