import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

/**
 * Rich testimonial for partner landing cards (portrait image, logos, optional vertical / embed video).
 * Create in Content Repo per partner; reference from Home Settings → Vertical testimonial section.
 */
export default defineType({
  name: 'verticalTestimonial',
  title: 'Vertical testimonial',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'partner',
      title: 'Partner',
      type: 'reference',
      to: [{ type: 'partner' }],
      description:
        'Optional. Link to a partner for organization in Studio (filtering is manual).',
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'testimonialOrder',
      title: 'Testimonial order',
      type: 'number',
      description: 'Lower numbers appear first in the grid.',
      initialValue: 0,
    }),
    defineField({
      name: 'designation',
      title: 'Designation',
      type: 'string',
      description: 'e.g. Managing Director',
    }),
    defineField({
      name: 'practiceName',
      title: 'Practice name',
      type: 'string',
      description: 'Company or practice shown after the separator.',
    }),
    defineField({
      name: 'region',
      title: 'Place / region',
      type: 'string',
    }),
    defineField({
      name: 'locationNumber',
      title: 'Location number',
      type: 'string',
    }),
    defineField({
      name: 'logoColored',
      title: 'Logo (colored)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'logoWhite',
      title: 'Logo (white, for card overlay)',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown on the dark gradient over the portrait.',
    }),
    defineField({
      name: 'cardBackgroundImage',
      title: 'Card background image',
      type: 'image',
      options: { hotspot: true },
      description: 'Portrait photo behind the quote.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cardBackgroundImageHover',
      title: 'Secondary image (hover)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'videoThumbnailUrl',
      title: 'Video thumbnail (URL)',
      type: 'url',
      description:
        'Optional URL. Image (jpg/png/webp, etc.): shown as poster over the card background. Direct video file (.mp4, .webm, .mov, etc.): plays on card hover (overrides Vertical video file for hover).',
      validation: (Rule) =>
        Rule.uri({ allowRelative: true, scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'verticalVideoFile',
      title: 'Vertical video (file)',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      description: 'MP4 etc. Opens in a lightbox when the card is clicked.',
    }),
    defineField({
      name: 'horizontalVideos',
      title: 'Embedded videos (YouTube / Vimeo / Vidyard)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'videos' }],
        },
      ],
      description:
        'If set, first video opens in the standard embed modal (horizontal).',
    }),
    defineField({
      name: 'keyStatement',
      title: 'Key statement (card quote)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainStatement',
      title: 'Main statement (longer review)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'subStatement',
      title: 'Sub statement',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'keyFeatures',
      title: 'Key features label',
      type: 'string',
      description: 'e.g. 30+',
    }),
    defineField({
      name: 'listItems',
      title: 'List items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'listItem',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
            }),
            defineField({
              name: 'statement',
              title: 'Statement',
              type: 'text',
              rows: 2,
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'practiceName',
      media: 'cardBackgroundImage',
    },
  },
})
