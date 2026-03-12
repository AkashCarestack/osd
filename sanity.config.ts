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
import {
  CalendarIcon,
  CogIcon,
  CommentIcon,
  ComposeIcon,
  DocumentIcon,
  DocumentVideoIcon,
  DocumentsIcon,
  FolderIcon,
  HomeIcon,
  LinkIcon,
  TagIcon,
  ThListIcon,
  UserIcon,
  UsersIcon,
} from '@sanity/icons'
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
        'post',
        'newContent',
        'tag',
        'partner',
        'dynamicComponent',
        'demoBannerBlockUS',
        'demoBannerBlockGB',
        'demoBannerBlockAU',
        'author',
        'homeSettings',
        'customer',
        'link',
        'globalSettings',
        'table',
        'asideBannerBlock',
        'testimonialCard',
        'videos',
        'siteSetting',
        'customContent',
        'eventCard',
        'category',
        'testimonial',
        'footer',
        'glossary',
        'faq',
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
      structure: (S) => {
        // Ensure the DEO partner document has _id "partners.deo" (in Manage Partners) so new content defaults to DEO.

        // Build the same sub-panel for each partner: Resources, Page Settings, Home, Footer, Tags, Categories
        const buildPartnerPanel = (
          partnerSlug: string,
          partnerTitle: string,
          options?: { listAllContentUnderPartner?: boolean },
        ) =>
          S.list()
            .title(partnerTitle)
            .items([
              // Resources: Content (posts), Content Repo, Custom Content
              S.listItem()
                .title('Resources')
                .icon(FolderIcon)
                .child(
                  S.list()
                    .title(`Resources — ${partnerTitle}`)
                    .items([
                      S.listItem()
                        .title('Content')
                        .icon(DocumentIcon)
                        .child(
                          options?.listAllContentUnderPartner
                            ? // DEO: list ALL content (articles, etc.) – everything is under DEO
                              S.documentList()
                                .apiVersion(apiVersion)
                                .title(`Content — ${partnerTitle}`)
                                .filter('_type == "post"')
                                .schemaType('post')
                            : // Other partners: only content linked to this partner
                              S.documentList()
                                .apiVersion(apiVersion)
                                .title(`Content — ${partnerTitle}`)
                                .filter(
                                  '_type == "post" && partner->slug.current == $partnerSlug',
                                )
                                .params({ partnerSlug })
                                .schemaType('post'),
                        ),
                      S.listItem()
                        .title('Content Repo')
                        .icon(FolderIcon)
                        .child(
                          S.list()
                            .title('Content Repo')
                            .items([
                              S.documentTypeListItem('glossary').title(
                                'Glossary',
                              ),
                              S.documentTypeListItem('faq').title('FAQ'),
                              S.documentTypeListItem('event').title('Events'),
                            ]),
                        ),
                      S.documentTypeListItem('customContent')
                        .title('Custom Content')
                        .icon(ComposeIcon),
                    ]),
                ),
              // Page Settings (site-wide)
              S.listItem()
                .title('Page Settings')
                .icon(CogIcon)
                .child(
                  S.document()
                    .schemaType('siteSetting')
                    .documentId('siteSetting'),
                ),
              // Home (partner-scoped)
              S.listItem()
                .title('Home')
                .icon(HomeIcon)
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .title(`Home — ${partnerTitle}`)
                    .filter(
                      '_type == "homeSettings" && (!defined(partner) || partner->slug.current == $partnerSlug)',
                    )
                    .params({ partnerSlug })
                    .schemaType('homeSettings'),
                ),
              // Footer
              S.listItem()
                .title('Footer')
                .icon(LinkIcon)
                .child(S.documentTypeList('footer').title('Footer')),
              // Tags
              S.listItem()
                .title('Tags')
                .icon(TagIcon)
                .child(S.documentTypeList('tag').title('Tags')),
              // Categories (filtered by partner: site-wide + this partner only)
              S.listItem()
                .title('Categories')
                .icon(ThListIcon)
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .title(`Categories — ${partnerTitle}`)
                    .filter(
                      '_type == "category" && (!defined(partner) || partner->slug.current == $partnerSlug)',
                    )
                    .params({ partnerSlug })
                    .schemaType('category'),
                ),
            ])

        return S.list()
          .title('Base')
          .items([
            // —— Partners (root): DEO & Fortune each have Resources, Page Settings, Home, Footer, Tags, Categories
            S.listItem()
              .title('Partners')
              .icon(UsersIcon)
              .child(
                S.list()
                  .title('Partners')
                  .items([
                    S.listItem()
                      .title('DEO')
                      .child(
                        buildPartnerPanel('deo', 'DEO', {
                          listAllContentUnderPartner: true,
                        }),
                      ),
                    S.listItem()
                      .title('Fortune')
                      .child(buildPartnerPanel('fortune', 'Fortune')),
                  ]),
              ),
            // Site Configuration (single doc, kept at root for quick access)
            S.listItem()
              .title('Site Configuration')
              .icon(CogIcon)
              .child(
                S.document()
                  .schemaType('siteSetting')
                  .documentId('siteSetting'),
              ),
            // Manage partner documents (add/edit DEO, Fortune, etc.)
            S.listItem()
              .title('Manage Partners')
              .icon(UsersIcon)
              .child(S.documentTypeList('partner').title('Partners')),
              
          ])
      },
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
