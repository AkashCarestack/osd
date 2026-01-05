import { DesktopIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSetting',
  title: 'Site Settings',
  type: 'document',
  icon: DesktopIcon,
  fields: [
    {
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description:
        'The main title of the site, used in SEO and browser title bars.',
      validation: (Rule) => Rule.required().min(10).max(60),
    },
    {
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      description:
        'The description of your site, usually used in the meta description for SEO.',
      validation: (Rule) => Rule.required().min(50).max(160),
    },
    {
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      description:
        'The main URL of your site, used for SEO and structured data.',
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'The favicon for your website (browser tab icon).',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      description: 'The logo of your website.',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'author',
      title: 'Author',
      type: 'object',
      description: 'Information about the site author (used in JSON-LD)',
      fields: [
        {
          name: 'name',
          title: 'Author Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'email',
          title: 'Author Email',
          type: 'email',
        },
        {
          name: 'url',
          title: 'Author URL',
          type: 'url',
          description: "Link to the author's homepage or social profile.",
        },
        {
          name: 'image',
          title: 'Author Image',
          type: 'image',
          description: 'Profile picture for the author.',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              description:
                'The name of the social media platform (e.g., Twitter, LinkedIn)',
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              description: 'Link to the social media page',
            },
          ],
        },
      ],
    },
    {
      name: 'jsonLd',
      title: 'JSON-LD',
      type: 'text',
      description:
        'Custom JSON-LD structured data for SEO. Use this to inject JSON-LD data on the site.',
      options: {
        language: 'json',
      },
    },
    {
      name: 'openGraphImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image for social sharing (Open Graph).',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      description: 'Keywords for SEO (comma separated).',
      of: [{ type: 'string' }],
    },
    {
      name: 'additionalMetaTags',
      title: 'Additional Meta Tags',
      type: 'array',
      description:
        'Optional extra meta tags for SEO (e.g., robots, viewport, etc.)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Meta Tag Name',
              type: 'string',
            },
            {
              name: 'content',
              title: 'Meta Tag Content',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'googleAnalyticsID',
      title: 'Google Analytics ID',
      type: 'string',
      description: 'The Google Analytics Tracking ID (e.g., UA-XXXXXXX-X)',
    },
    {
      name: 'footerText',
      title: 'Footer Text',
      type: 'string',
      description: 'Text to appear in the footer of the site.',
    },
    defineField({
      name: 'selectedBlogs',
      title: 'Selected Blogs',
      description: 'Choose which blogs/content should be available via the API. Make sure to enable "Expose to API" on the posts you want to include.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'post' }],
          options: {
            disableNew: true,
          },
        },
      ],
      options: {
        sortable: true,
      },
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
})
