/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */

import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { SetAndPublishAction } from './actions'
import {
  defineUrlResolver,
  Iframe,
  IframeOptions,
} from 'sanity-plugin-iframe-pane'
import { previewUrl } from 'sanity-plugin-iframe-pane/preview-url'
import { table } from '@sanity/table'
import { CogIcon, ControlsIcon, DesktopIcon, HomeIcon,GroqIcon } from '@sanity/icons'
// see https://www.sanity.io/docs/api-versioning for how versioning works
import {
  apiVersion,
  dataset,
  previewSecretId,
  projectId,
} from '~/lib/sanity.api'
import { schema } from '~/schemas'
import siteConfig from 'config/siteConfig'
import { documentInternationalization } from '@sanity/document-internationalization'
import { richDate } from '@sanity/rich-date-input'

const iframeOptions = {
  url: defineUrlResolver({
    base: '/api/draft',
    requiresSlug: Object.values(siteConfig.pageURLs).map((url) => url.slice(1)),
  }),
  urlSecretId: previewSecretId,
  reload: { button: true },
} satisfies IframeOptions

export default defineConfig({
  basePath: '/studio',
  name: 'project-name',
  title: 'Project Name',
  projectId,
  dataset,
  form: {
    components: {
      input: (props: any) => {
        if (Array.isArray(props.groups) && props.groups.length > 0) {
          if (props.groups[0].name === 'all-fields') {
            props.groups.shift()
          }
        }
        return props.renderDefault(props)
      },
    },
  },
  //edit schemas in './src/schemas'
  schema,
  plugins: [
    table(),
    richDate(),
    documentInternationalization({
      supportedLanguages: [
        { id: 'en', title: 'US English' },
        { id: 'en-GB', title: 'UK English' },
        { id: 'en-AU', title: 'Australia English' },
      ],
      schemaTypes: [
        "post",
            "newContent",
            "tag",
            "dynamicComponent",
            "demoBannerBlockUS",
            "demoBannerBlockGB",
            "demoBannerBlockAU",
            "author",
            "homeSettings",
            "customer",
            "link",
            "globalSettings",
            "table",
            "asideBannerBlock",
            "testimonialCard",
            "videos",
            "siteSetting",
            "customContent",
            "eventCard",
            "category",
            'testimonial',
            'footer',
            'glossary',
            'faq'
      ],
    }),

    // structureTool({
    //   // `defaultDocumentNode` is responsible for adding a “Preview” tab to the document pane
    //   // You can add any React component to `S.view.component` and it will be rendered in the pane
    //   // and have access to content in the form in real-time.
    //   // It's part of the Studio's “Structure Builder API” and is documented here:
    //   // https://www.sanity.io/docs/structure-builder-reference
    //   structure: (S) => S.documentTypeList('post'),
    //   defaultDocumentNode: (S, { schemaType }) => {
    //     return S.document().views([
    //       // Default form view
    //       S.view.form(),
    //       // Preview
    //       S.view.component(Iframe).options(iframeOptions).title('Preview'),
    //     ])
    //   },
    // }),

    // structureTool({
    //   structure: (S) =>
    //     S.list()
    //       .title('Base')
    //       .items([
    //         S.listItem()
    //           .title('Site Settings')
    //           .child(
    //             S.document()
    //               .schemaType('siteSettings')
    //               .documentId('siteSettings')),
    //               ...S.documentTypeListItems().filter(listItem => !['siteSettings'].includes(listItem.getId()))
    //       ])
    // }),
    structureTool({
      // `defaultDocumentNode` is responsible for adding a “Preview” tab to the document pane
      // You can add any React component to `S.view.component` and it will be rendered in the pane
      // and have access to content in the form in real-time.
      // It's part of the Studio's “Structure Builder API” and is documented here:
      // https://www.sanity.io/docs/structure-builder-reference
      // structure: (S) => S.documentTypeList('post'),
      // name: 'posts',
      // title: 'Posts',

      defaultDocumentNode: (S, { schemaType }) => {
        return S.document().views([
          // Default form view
          S.view.form(),
          // Preview
          S.view.component(Iframe).options(iframeOptions).title('Preview'),
        ])
      },
      structure: (S) =>
        S.list()
          .title('Base')
          .items([
            // S.listItem()
            //   .title('Home Page')
            //   .icon(HomeIcon)
            //   .child(
            //     S.document()
            //       .schemaType('homeSettings')
            //       .documentId('homeSettings'),
            //   ),
            S.documentTypeListItem('post').title('All Content'),
            S.documentTypeListItem('author').title('Author'),
            S.documentTypeListItem('tag').title('Tag'),
            S.documentTypeListItem('category').title('Category'),
            S.documentTypeListItem('customer').title('Customer'),
            S.documentTypeListItem('testimonial').title('Testimonial'),
            S.documentTypeListItem('videos').title('Video'),
            S.documentTypeListItem('eventCard').title('Events Card'),
            S.listItem()
              .title('Content Repo')
              .child(
                S.list()
                  .title('Content Repo')
                  .items([
                    S.documentTypeListItem('glossary').title('Glossary'),
                    S.documentTypeListItem('faq').title('FAQ'),
                  ])
              ),
            S.documentTypeListItem('homeSettings').title('Home Page').icon(HomeIcon),
            S.documentTypeListItem('footer').title('Footer').icon(GroqIcon),
            S.listItem()
              .title('Site Configuration')
              .icon(ControlsIcon)
              .child(
                S.document()
                  .schemaType('siteSetting')
                  .documentId('siteSetting'),
              ),
            S.documentTypeListItem('customContent').title('Custom Content'),
            // S.documentTypeListItem('testimonial').title('Testimonial'),
            // ...S.documentTypeListItems().filter(
            //   (listItem) => !['homeSettings'].includes(listItem.getId()) && !['globalSettings'].includes(listItem.getId())&& !['post'].includes(listItem.getId()),
            // )
          ]),
    }),

    media({
      creditLine: {
        enabled: true,
        // boolean - enables an optional "Credit Line" field in the plugin.
        // Used to store credits e.g. photographer, licence information
        excludeSources: ['unsplash'],
        // string | string[] - when used with 3rd party asset sources, you may
        // wish to prevent users overwriting the creditLine based on the `source.name`
      },
      maximumUploadSize: 10000000,
      // number - maximum file size (in bytes) that can be uploaded through the plugin interface
    }),

    // structureTool({
    //   // `defaultDocumentNode` is responsible for adding a “Preview” tab to the document pane
    //   // You can add any React component to `S.view.component` and it will be rendered in the pane
    //   // and have access to content in the form in real-time.
    //   // It's part of the Studio's “Structure Builder API” and is documented here:
    //   // https://www.sanity.io/docs/structure-builder-reference
    //   structure: (S) => S.documentTypeList('author'),
    //   name: 'authors',
    //   title: 'Authors',
    //   defaultDocumentNode: (S, { schemaType }) => {
    //     return S.document().views([
    //       // Default form view
    //       S.view.form(),
    //       // Preview
    //       S.view.component(Iframe).options(iframeOptions).title('Preview'),
    //     ])
    //   },
    // }),
    // Add the "Open preview" action
    previewUrl({
      base: '/api/draft',
      requiresSlug: Object.values(siteConfig.pageURLs).map((url) =>
        url.slice(1),
      ),
      urlSecretId: previewSecretId,
    }),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    actions: (prev) =>
      prev.map((originalAction) =>
        originalAction.action === 'publish'
          ? SetAndPublishAction
          : originalAction,
      ),
  },
})
