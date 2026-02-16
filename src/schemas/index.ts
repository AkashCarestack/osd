import { SchemaTypeDefinition } from 'sanity'

import blockContent from './blockContent'
import category from './category'
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
import post from './post'
import asideBannerBlock from './sections/asideBannerBlock'
import author from './sections/author'
import commonBannerBlock from './sections/commonBannerBlock'
import customer from './sections/customer'
import demoBannerBlockAU from './sections/demoBannerBlockAU'
import demoBannerBlockGB from './sections/demoBannerBlockGB'
import demoBannerBlockUS from './sections/demoBannerBlockUS'
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
  demoBannerBlockUS,
  demoBannerBlockGB,
  demoBannerBlockAU,
  commonBannerBlock,
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
  footer
]
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    post,
    iframe,
    blockContent,
    newContent,
    tag,
    demoBannerBlockUS,
    demoBannerBlockGB,
    demoBannerBlockAU,
    commonBannerBlock,
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
    footer
  ],
}
