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
          options: {
            // In partner Home Settings, show only testimonials tagged to that partner.
            filter: ({ document }: { document?: { partner?: { _ref?: string } } }) => {
              const partnerRef = document?.partner?._ref

              if (!partnerRef) {
                return {
                  filter: '_type == "verticalTestimonial"',
                }
              }

              return {
                filter:
                  '_type == "verticalTestimonial" && partner._ref == $partnerRef',
                params: { partnerRef },
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),
  ],
})
