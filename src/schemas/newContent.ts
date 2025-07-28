import { ImageIcon } from '@sanity/icons'
import { ThLargeIcon } from '@sanity/icons'
import { InsertBelowIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import DynamicComponent from '../../src/schemas/dynamicComponent'
import dynamicComponent from '../../src/schemas/dynamicComponent'
import HighlightDecorator from '../components/HighlightDecorator'
import htmlCode from './htmlCode'

export default defineType({
  title: 'Block Content',
  name: 'newContent',
  type: 'array',
  of: [
    {
      type: 'image',
      icon: ImageIcon,
    },
    {
      type: 'table',
      icon: ThLargeIcon,
      options: {
        editModal: 'fullscreen',
        columns: 3,
        pageSize: 10,
      },
    },

    defineArrayMember(htmlCode),
    defineArrayMember(dynamicComponent),
    defineArrayMember({
      title: 'Video',
      name: 'videoReference',
      description: 'Select a video from the video manager',
      type: 'reference',
      to: [{ type: 'videos' }],
    }),
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'H5', value: 'h5' },
        { title: 'H6', value: 'h6' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
  ],
})
