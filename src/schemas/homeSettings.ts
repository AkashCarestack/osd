import { DocumentIcon, HomeIcon, TagIcon } from '@sanity/icons';
import {ProjectsIcon} from '@sanity/icons'
import { defineField } from 'sanity';

import { uniqueTestimonialsValidation } from '~/utils/customValidation';
export default {
  name: 'homeSettings',
  title: 'Home Settings',
  icon: DocumentIcon,
  type: 'document',
  groups: [
    {
      name: 'popularBlogs',
      title: 'Popular Blogs',
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
    },
    {
      name: 'EbooksAndWebinars',
      title: 'Ebooks And Webinars',
    },
    {
      name: 'featuredCategories',
      title: 'Featured Categories',
    },
    {
      name: 'faq',
      title: 'FAQ Section',
    },
    {
      name: 'hero',
      title: 'Hero Section',
    },
  ],
  fields: [
    {
      name: 'featuredTags',
      title: 'Featured Tags',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'tag' }],
        },
      ],
      group: 'popularBlogs',
      validation: (rule) => rule.max(5).unique(),
    },
    {
      name: 'featuredEvent',
      description: 'This Event Will be featured in the Home Page',
      title: 'Featured Event',
      type: 'reference',
      to: [{ type: 'eventCard' }],
      group: 'popularBlogs',
    },
    {
      name: 'testimonial',
      title: 'Testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      group: 'testimonials',
    },

    {
      name: 'FeaturedBlog',
      description:
        'This content will be featured content in the Most Popular section',
      title: 'Featured Blog',
      type: 'reference',
      to: [{ type: 'post' }],
      group: 'popularBlogs',
    },
    {
      name: 'popularBlogs',
      description: 'This content will be displayed in the Featured Blogs list',
      title: 'Featured Blogs',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
      group: 'popularBlogs',
    },
    {
      name: 'FeaturedContents',
      description:
        'This will be the featured content that will appear in the Latest Blog section',
      title: 'Featured Home Contents',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
      group: 'EbooksAndWebinars',
    },
    {
      name: 'featuredCarouselItems',
      description: 'This content will be displayed in the Carousel section',
      title: 'Featured Carousel Contents',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'post' }],
          options: {
            filter: '_type == "post" && (contentType in ["webinar", "ebook"])',
            disableNew: true,
          },
        },
      ],
      group: 'popularBlogs',
    },
    {
      name: 'customBrowseContent',
      description:
        'Selected content will be displayed in the Projected Browse section',
      title: 'Custom Browse Content',
      type: 'reference',
      to: [{ type: 'customContent' }],
      group: 'popularBlogs',
    },
    {
      name: 'featuredArticle',
      title: 'Featured Article',
      description:
        'This content will be featured as an article in its landing page',
      type: 'reference',
      to: [{ type: 'post' }],
      options: {
        filter: `_type == "post" && contentType == "article"`,
        disableNew: true,
      },
      group: 'popularBlogs',
    },

    {
      name: 'featuredWebinar',
      description:
        'This content will be featured as a webinar in its landing page',
      title: 'Featured Webinar',
      type: 'reference',
      to: [{ type: 'post' }],
      options: {
        filter: `_type == "post" && contentType == "webinar"`,
        disableNew: true,
      },
      group: 'popularBlogs',
    },

    {
      name: 'featuredPodcast',
      description:
        'This content will be featured as a podcast in its landing page',
      title: 'Featured Podcast',
      type: 'reference',
      to: [{ type: 'post' }],
      options: {
        filter: `_type == "post" && contentType == "podcast"`,
        disableNew: true,
      },
      group: 'popularBlogs',
    },

    {
      name: 'featuredEbook',
      description:
        'This content will be featured as an ebook in the article landing page',
      title: 'Featured Ebook',
      type: 'reference',
      to: [{ type: 'post' }],
      options: {
        filter: `_type == "post" && contentType == "ebook"`,
        disableNew: true,
      },
      group: 'popularBlogs',
    },

    {
      name: 'featuredCasestudy',
      description:
        'This content will be featured as a case study in the article landing page',
      title: 'Featured Case Study',
      type: 'reference',
      to: [{ type: 'post' }],
      options: {
        filter: `_type == "post" && contentType == "case-study"`,
        disableNew: true,
      },
      group: 'popularBlogs',
    },

    {
      name: 'featuredPressRelease',
      description:
        'This content will be featured as a press release in the article landing page',
      title: 'Featured Press Release',
      type: 'reference',
      to: [{ type: 'post' }],
      options: {
        filter: `_type == "post" && contentType == "press-release"`,
        disableNew: true,
      },
      group: 'popularBlogs',
    },
    {
      name: 'demoBanner',
      title: 'Demo Banner',
      type: 'boolean',
      description:
        'Enable this to Display a call to action banner on the home page',
    },
    {
      name: 'eventCarousel',
      title: 'Event Carousel',
      type: 'boolean',
      description:
        'Enable this to Display Event banner on the home page',
    },
    {
      name: 'topicDescription',
      title: 'Topic Description',
      description: 'short description for the topic header',
      type: 'string',
    },
    {
      name: 'featuredReviews',
      description: 'This content will be displayed in the reviews section',
      title: 'Featured Reviews',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      validation: (Rule) =>
        Rule.unique().custom(uniqueTestimonialsValidation).min(6),
      group: 'popularBlogs',
    },
    {
      name: 'faqSection',
      title: 'FAQ Section',
      description: 'Configure the Frequently Asked Questions section',
      type: 'faqSection',
      group: 'faq',
    },
    {
      name: 'heroSection',
      title: 'Hero Section',
      description: 'Configure the Hero section with title, description, and buttons',
      type: 'heroSection',
      group: 'hero',
    },
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      language: 'language',
    },
    prepare(selection) {
      const { language } = selection
      return {
        title: `Home Settings - ${language}`,
        media: ProjectsIcon,
      }
    },
  },
}
