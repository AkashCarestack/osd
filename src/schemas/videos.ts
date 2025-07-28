import { DocumentVideoIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'videos',
  title: 'Videos',
  icon: DocumentVideoIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube', value: 'youtube' },
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'Vidyard', value: 'vidyard' },
        ],
      },
    }),
    defineField({
      name: 'videoId',
      title: 'Video ID',
      description: 'Paste the ID of the video',
      type: 'string',
    }),
    defineField({
      name: 'language',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      platform: 'platform',
      language: 'language',
    },
    prepare(selection) {
      const { title, platform, language } = selection
      const platformName = {
        youtube: 'YouTube',
        vimeo: 'Vimeo',
        vidyard: 'Vidyard',
      }[platform]
      return {
        title: title,
        subtitle: `${platformName} video - ${language}`,
        media: DocumentVideoIcon,
      }
    },
  },
})