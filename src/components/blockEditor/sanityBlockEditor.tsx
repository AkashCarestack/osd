import {
  PortableText,
  PortableTextReactComponents,
  toPlainText,
} from '@portabletext/react'
import React from 'react'
import slugify from 'slugify'

import DecoratorTable from '~/components/DecoratorTable'
import ListItem from '~/components/typography/ListItem'
import DynamicComponent from '~/layout/DynamicComponent'
import { getClient } from '~/lib/sanity.client'

import ImageLoader from '../commonSections/ImageLoader'
import { VideoModal } from '../commonSections/VideoModal'

interface SanityPortableTextProps {
  content: any
  draftMode?: boolean
  token?: string
}

const SanityPortableText: React.FC<SanityPortableTextProps> = ({
  content,
  draftMode = false,
  token = '',
}) => {
  const portableTextComponents: Partial<PortableTextReactComponents> = {
    marks: {
      link: ({ value, children }) => {
        return (
          <a href={value?.href} target="_blank" className="!text-blue-500">
            {children}
          </a>
        )
      },
    },
    // list: {
    //   bullet: ({children}) => <ul >{children}</ul>,
    //   number: ({children}) => <ol >{children}</ol>,
    // },
    // listItem: {
    //   bullet: ({children, index}) => (
    //     <ListItem
    //       node={{ children }}
    //       index={index ?? 0}
    //       isOrdered={false}
    //     />
    //   ),
    //   number: ({children, index}) => (
    //     <ListItem
    //       node={{ children }}
    //       index={index ?? 0}
    //       isOrdered={true}
    //     />
    //   ),
    // },
    block: {
      h2: ({ children, value }) => {
        // `value` is the single Portable Text block for this header
        const slug = slugify(toPlainText(value))
        return (
          <h2 className="scroll-my-24" id={slug}>
            {children}
          </h2>
        )
      },
    },
    types: {
      image: ({ value }) => {
        return (
          <ImageLoader
            image={value.asset}
            priority={true}
            altText={value?.asset?.altText || 'Post image'}
            title={value.asset.title || 'Post image'}
            imageClassName="w-full"
            fixed={false}
            client={getClient(draftMode ? { token } : undefined)}
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )
      },
      videoReference: ({ value }) => {
        return (
          <VideoModal
            {...value}
            client={getClient(draftMode ? { token } : undefined)}
          />
        )
      },
      table: ({ value }) => {
        return <DecoratorTable>{value}</DecoratorTable>
      },
      htmlCode: ({ value }) => {
        return (
          <div
            className="content-wrapper w-full"
            dangerouslySetInnerHTML={{ __html: value.htmlCode }}
          />
        )
      },
      dynamicComponent: ({ value }) => {
        return (
          <DynamicComponent
            {...value}
            client={getClient(draftMode ? { token } : undefined)}
          />
        )
      },
    },
  }

  return <PortableText value={content} components={portableTextComponents} />
}

export default SanityPortableText
