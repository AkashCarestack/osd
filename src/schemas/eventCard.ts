import { CreditCardIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'eventCard',
  title: 'Event Card',
  type: 'document',
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: 'eventName',
      title: 'Event Name',
      type: 'string',
    }),
    defineField({
      name: 'mainImage',
      title: 'Event Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bgColor',
      description: 'Background color must be in hex format',
      title: 'Background Color',
      type: 'string',
    }),
    defineField({
      title: 'EventType',
      description: 'Pick the type of event',
      name: 'evenTtype',
      type: 'string',
      options: {
        list: [
          { title: 'Online Event', value: 'Online Event' },
          { title: 'In-Person Event', value: 'In-Person Event' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventDescription',
      title: 'Event Description',
      description: 'A short description of the event',
      type: 'string',
    }),
    defineField({
      title: 'Event Start Date',
      name: 'eventStartDate',
      type: 'richDate',
      options: {
        timeStep: 30,
      },
      validation: (Rule) => Rule.required().error('Date is required.'),
    }),
    defineField({
      title: 'Event End Date',
      name: 'eventEndDate',
      type: 'richDate',
      options: {
        timeStep: 30,
      },
      validation: (Rule) => Rule.required().error('Date is required.'),
    }),
    defineField({
      title: 'Event Location',
      name: 'eventLocation',
      type: 'string',
    }),

    defineField({
      name: 'registrationLink',
      title: 'Registration Link',
      type: 'url',
    }),

    defineField({
      name: 'registerBtnTxt',
      title: 'Register Button Text',
      type: 'string',
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
      title: 'eventName',
    },
  },
})
