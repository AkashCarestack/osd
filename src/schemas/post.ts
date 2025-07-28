import { defineField, defineType } from 'sanity'

import { isUniqueAcrossAllDocuments } from '~/lib/sanity'

export default defineType({
  name: 'post',
  title: 'Content Manager',
  type: 'document',
  fieldsets: [
    {
      name: 'seo',
      title: 'SEO Settings',
      options: {
        collapsible: true,
        collapsed: true,
        modal: { type: 'popover' },
      },
    },
    {
      name: 'practiceProfile',
      title: 'Practice Profile',
      options: {
        collapsible: true,
        collapsed: true,
        modal: { type: 'popover' },
      },
    },
  ],
  fields: [
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Ebook', value: 'ebook' },
          { title: 'Article', value: 'article' },
          { title: 'Webinar', value: 'webinar' },
          { title: 'Podcast', value: 'podcast' },
          { title: 'Case Study', value: 'case-study' },
          { title: 'Press Release', value: 'press-release' },
        ],
      },
      validation: (Rule) => Rule.required().error('Content type is required.'),
    }),

    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    //  meta fields
    defineField({
      name: 'seoTitle',
      title: 'Meta Title',
      description: 'Overrides main page title',
      type: 'string',
      fieldset: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description',
      type: 'string',
      fieldset: 'seo',
      validation: (Rule) => [
        Rule.required()
          .min(10)
          .error('A description of at least 10 characters is required'),
        Rule.max(155).warning('Shorter descriptions are usually better'),
      ],
    }),
    defineField({
      name: 'seoKeywords',
      title: 'Meta Keywords',
      type: 'string',
      fieldset: 'seo',
    }),
    defineField({
      name: 'seoJSONLD',
      title: 'Meta JSON-LD',
      type: 'text',
      fieldset: 'seo',
      validation: (Rule: any) =>
        Rule.custom((json) => {
          try {
            JSON.parse(json || '{}')
            return true
          } catch (err) {
            return 'Invalid JSON format'
          }
        }),
    }),
    defineField({
      name: 'seoCanonical',
      title: 'Canonical URL',
      type: 'url',
      fieldset: 'seo',
    }),

    // Common Fields
    defineField({
      name: 'slug',
      title: 'Page Path',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title', 
        isUnique: isUniqueAcrossAllDocuments
      }
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      initialValue: 'global',
      options: {
        list: [
          { title: 'Global', value: 'global' },
          { title: 'US', value: 'EN' },
          { title: 'UK', value: 'EN-GB' },
        ],
      },
    }),
    defineField({
      title: 'Date',
      name: 'date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (Rule) => Rule.required().error('Date is required.'),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Description',
      type: 'text',
    }),
    defineField({
      name: 'videos',
      title: 'Video',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'videos' }],
        },
      ],
      hidden: ({ parent }) => parent.contentType !== 'webinar',
    }),

    defineField({
      name: 'htmlCode',
      title: 'Embed Code',
      description: 'paste full iframe code',
      type: 'text',
      hidden: ({ parent }) => parent.contentType !== 'podcast',
    }),

    // Practice Profile Fields
    defineField({
      name: 'practiceName',
      title: 'Practice Name',
      type: 'string',
      hidden: ({ parent }) => parent.contentType !== 'case-study',
      fieldset: 'practiceProfile',
    }),

    defineField({
      name: 'headCount',
      title: 'Number of Staffs',
      type: 'string',
      fieldset: 'practiceProfile',
      hidden: ({ parent }) => parent.contentType !== 'case-study',
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      fieldset: 'practiceProfile',
      hidden: ({ parent }) => parent.contentType !== 'case-study',
    }),

    defineField({
      name: 'providers',
      title: 'Providers',
      type: 'string',
      fieldset: 'practiceProfile',
      hidden: ({ parent }) => parent.contentType !== 'case-study',
    }),

    defineField({
      name: 'growingLocations',
      title: 'Growing Locations',
      type: 'string',
      fieldset: 'practiceProfile',
      hidden: ({ parent }) => parent.contentType !== 'case-study',
    }),

    defineField({
      name: 'facilities',
      title: 'Facilities',
      type: 'string',
      fieldset: 'practiceProfile',
      hidden: ({ parent }) => parent.contentType !== 'case-study',
    }),

    defineField({
      name: 'asideBookFreeDemoBanner',
      title: 'Aside Book Free Demo Banner',
      type: 'array',
      fieldset: 'practiceProfile',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'number',
              title: 'Number Field',
              type: 'string',
            },

            {
              name: 'text',
              title: 'Description',
              type: 'string',
            },
          ],
        },
      ],
      hidden: ({ parent }) => parent.contentType !== 'case-study',
    }),

    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      hidden: ({ parent }) =>
        parent.contentType !== 'webinar' &&
        parent.contentType !== 'ebook' &&
        parent.contentType !== 'podcast' &&
        parent.contentType !== 'case-study',
    }),

    // Ebook Specific Fields
    defineField({
      name: 'attachment',
      title: 'Ebook Attachment',
      type: 'file',
      hidden: ({ parent }) => parent.contentType !== 'ebook',
    }),
    defineField({
      name: 'pressReleaseUrl',
      title: 'Read More Link',
      type: 'url',
      hidden: ({ parent }) => parent.contentType !== 'press-release',
    }),

    // Common Components
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error('Main image is required.'),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'newContent',
    }),

    // Author Reference
    defineField({
      name: 'author',
      title: 'Author',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'author' }],
        },
      ],
      validation: (Rule) => [
        Rule.required().min(1).error('At least one author is required'),
      ],
    }),
    // Tags Field
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'tag' }],
        },
      ],
    }),
    defineField({
      name: 'category',
      description: 'Choose a category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
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
      contentType: 'contentType',
      author: 'author.name',
      media: 'mainImage',
      tag: 'tag',
      date: 'date',
      language: 'language',
    },
    prepare(selection) {
      const { title, contentType, author, tag, date,language } = selection
      return {
        title,
        subtitle: `${selection.contentType.toUpperCase()} - ${language} `,
        media: selection.media,
        
      }
    },
  },
})
