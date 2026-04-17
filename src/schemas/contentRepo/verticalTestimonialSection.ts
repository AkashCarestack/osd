import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'verticalTestimonialSection',
  title: 'Vertical testimonial section',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow label',
      type: 'string',
      description: 'Small label above the heading (e.g. Testimonials).',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA button text',
      type: 'string',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA button link',
      type: 'url',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'verticalTestimonial' }],
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),
  ],
})
