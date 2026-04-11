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
      structure: async (S, context) => {
        // Build the same sub-panel for each partner: Resources, Page Settings, Home, Footer, Tags, Categories
        const buildPartnerPanel = (
          partnerSlug: string,
          partnerTitle: string,
          options?: {
            listAllContentUnderPartner?: boolean
            partnerId?: string
          },
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
                            ? // Default/first partner: list ALL content
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
                              // Glossary: filtered by partner, new docs auto-bound to this partner
                              S.listItem()
                                .title('Glossary')
                                .child(
                                  S.documentList()
                                    .apiVersion(apiVersion)
                                    .title(`Glossary — ${partnerTitle}`)
                                    .filter(
                                      '_type == "glossary" && (!defined(partner) || partner._ref == $partnerId)',
                                    )
                                    .params({
                                      partnerId: options?.partnerId ?? '',
                                    })
                                    .schemaType('glossary')
                                    .initialValueTemplates(
                                      options?.partnerId
                                        ? [
                                            S.initialValueTemplateItem(
                                              'glossary-with-partner',
                                              {
                                                partnerRef: options.partnerId,
                                              },
                                            ),
                                          ]
                                        : [],
                                    ),
                                ),
                              // FAQ: filtered by partner, new docs auto-bound to this partner
                              S.listItem()
                                .title('FAQ')
                                .child(
                                  S.documentList()
                                    .apiVersion(apiVersion)
                                    .title(`FAQ — ${partnerTitle}`)
                                    .filter(
                                      '_type == "faq" && (!defined(partner) || partner._ref == $partnerId)',
                                    )
                                    .params({
                                      partnerId: options?.partnerId ?? '',
                                    })
                                    .schemaType('faq')
                                    .initialValueTemplates(
                                      options?.partnerId
                                        ? [
                                            S.initialValueTemplateItem(
                                              'faq-with-partner',
                                              {
                                                partnerRef: options.partnerId,
                                              },
                                            ),
                                          ]
                                        : [],
                                    ),
                                ),
                              // Events: filtered by partner, new docs auto-bound to this partner
                              S.listItem()
                                .title('Events')
                                .child(
                                  S.documentList()
                                    .apiVersion(apiVersion)
                                    .title(`Events — ${partnerTitle}`)
                                    .filter(
                                      '_type == "event" && (!defined(partner) || partner._ref == $partnerId)',
                                    )
                                    .params({
                                      partnerId: options?.partnerId ?? '',
                                    })
                                    .schemaType('event')
                                    .initialValueTemplates(
                                      options?.partnerId
                                        ? [
                                            S.initialValueTemplateItem(
                                              'event-with-partner',
                                              {
                                                partnerRef: options.partnerId,
                                              },
                                            ),
                                          ]
                                        : [],
                                    ),
                                ),
                              // Vertical testimonials (portrait cards + video) for partner landings
                              S.listItem()
                                .title('Vertical testimonials')
                                .icon(UserIcon)
                                .child(
                                  S.documentList()
                                    .apiVersion(apiVersion)
                                    .title(`Vertical testimonials — ${partnerTitle}`)
                                    .filter(
                                      '_type == "verticalTestimonial" && (!defined(partner) || partner._ref == $partnerId)',
                                    )
                                    .params({
                                      partnerId: options?.partnerId ?? '',
                                    })
                                    .schemaType('verticalTestimonial')
                                    .initialValueTemplates(
                                      options?.partnerId
                                        ? [
                                            S.initialValueTemplateItem(
                                              'verticalTestimonial-with-partner',
                                              {
                                                partnerRef: options.partnerId,
                                              },
                                            ),
                                          ]
                                        : [],
                                    ),
                                ),
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

        // Fetch partners from dataset so structure is driven by Manage Partners
        let partnerItems: ReturnType<typeof S.listItem>[] = []
        try {
          const client = context.getClient({ apiVersion })
          const partners = await client.fetch<
            { _id: string; partnerName: string | null; slug: string | null }[]
          >(
            `*[_type == "partner" && defined(slug.current)]{ _id, partnerName, "slug": slug.current } | order(partnerName asc)`,
          )
          const firstSlug = partners[0]?.slug ?? null
          partnerItems = partners.map((p) => {
            const slug = p.slug ?? p._id
            const title = p.partnerName ?? slug
            return S.listItem()
              .title(title)
              .id(slug)
              .child(
                buildPartnerPanel(slug, title, {
                  listAllContentUnderPartner: slug === firstSlug,
                  partnerId: p._id,
                }),
              )
          })
        } catch (err) {
          console.error('Structure: failed to load partners', err)
        }

        return S.list()
          .title('Base')
          .items([
            // Partners: one panel per partner from Manage Partners (auto-created)
            S.listItem()
              .title('Partners')
              .icon(UsersIcon)
              .id('partners')
              .child(
                S.list()
                  .title('Partners')
                  .items(partnerItems),
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
            // Manage partner documents (add/edit partners here — structure above updates automatically)
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
