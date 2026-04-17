import type { Template } from 'sanity'
import { SchemaTypeDefinition } from 'sanity'

import blockContent from './blockContent'
import category from './category'
import event from './contentRepo/event'
import eventObject from './contentRepo/eventObject'
import faq from './contentRepo/faq'
import glossary from './contentRepo/glossary'
import upcomingEventsSection from './contentRepo/upcomingEventsSection'
import verticalTestimonial from './contentRepo/verticalTestimonial'
import verticalTestimonialSection from './contentRepo/verticalTestimonialSection'
import whyPracticeLoveSection from './contentRepo/whyPracticeLoveSection'
import customContent from './customContent'
import dynamicComponent from './dynamicComponent'
import eventCard from './eventCard'
import footer from './footer'
import globalSettings from './globalSettings'
import homeSettings from './homeSettings'
import htmlCode from './htmlCode'
import iframe from './iframe'
import link from './link'
import newContent from './newContent'
import partner from './partner'
import post from './post'
import asideBannerBlock from './sections/asideBannerBlock'
import author from './sections/author'
import commonBannerBlock from './sections/commonBannerBlock'
import customer from './sections/customer'
import demoBannerBlockAU from './sections/demoBannerBlockAU'
import demoBannerBlockGB from './sections/demoBannerBlockGB'
import demoBannerBlockUS from './sections/demoBannerBlockUS'
import faqSection from './sections/faqSection'
import heroSection from './sections/heroSection'
import testimonialCard from './sections/testimonialCard'
import siteSetting from './siteSetting'
import table from './table'
import tag from './tag'
import testiMonial from './testiMonial'
import videos from './videos'

export const schemaTypes = [
  post,
  iframe,
  blockContent,
  newContent,
  tag,
  partner,
  demoBannerBlockUS,
  demoBannerBlockGB,
  demoBannerBlockAU,
  commonBannerBlock,
  faqSection,
  heroSection,
  dynamicComponent,
  author,
  homeSettings,
  testiMonial,
  customer,
  link,
  globalSettings,
  table,
  htmlCode,
  asideBannerBlock,
  testimonialCard,
  videos,
  siteSetting,
  customContent,
  eventCard,
  category,
  footer,
  glossary,
  faq,
  whyPracticeLoveSection,
  verticalTestimonial,
  verticalTestimonialSection,
  event,
  eventObject,
  upcomingEventsSection,
]
/** Templates that pre-fill partner when creating glossary, faq, or event from a partner's Content Repo. */
export const contentRepoTemplates: Template[] = [
  {
    id: 'glossary-with-partner',
    title: 'Glossary',
    schemaType: 'glossary',
    parameters: [{ name: 'partnerRef', type: 'string', title: 'Partner' }],
    value: (params: { partnerRef?: string }) =>
      params?.partnerRef
        ? { partner: { _type: 'reference', _ref: params.partnerRef } }
        : {},
  },
  {
    id: 'faq-with-partner',
    title: 'FAQ',
    schemaType: 'faq',
    parameters: [{ name: 'partnerRef', type: 'string', title: 'Partner' }],
    value: (params: { partnerRef?: string }) =>
      params?.partnerRef
        ? { partner: { _type: 'reference', _ref: params.partnerRef } }
        : {},
  },
  {
    id: 'event-with-partner',
    title: 'Event',
    schemaType: 'event',
    parameters: [{ name: 'partnerRef', type: 'string', title: 'Partner' }],
    value: (params: { partnerRef?: string }) =>
      params?.partnerRef
        ? { partner: { _type: 'reference', _ref: params.partnerRef } }
        : {},
  },
  {
    id: 'verticalTestimonial-with-partner',
    title: 'Vertical testimonial',
    schemaType: 'verticalTestimonial',
    parameters: [{ name: 'partnerRef', type: 'string', title: 'Partner' }],
    value: (params: { partnerRef?: string }) =>
      params?.partnerRef
        ? { partner: { _type: 'reference', _ref: params.partnerRef } }
        : {},
  },
]

export const schema: {
  types: SchemaTypeDefinition[]
  templates?: (prev: Template[]) => Template[]
} = {
  types: [
    post,
    iframe,
    blockContent,
    newContent,
    tag,
    partner,
    demoBannerBlockUS,
    demoBannerBlockGB,
    demoBannerBlockAU,
    commonBannerBlock,
    faqSection,
    heroSection,
    dynamicComponent,
    author,
    homeSettings,
    testiMonial,
    customer,
    link,
    globalSettings,
    table,
    htmlCode,
    asideBannerBlock,
    testimonialCard,
    videos,
    siteSetting,
    customContent,
    eventCard,
    category,
    footer,
    glossary,
    faq,
    whyPracticeLoveSection,
    verticalTestimonial,
    verticalTestimonialSection,
    event,
  eventObject,
  upcomingEventsSection,
  ],
  templates: (prev) => [...prev, ...contentRepoTemplates],
}
