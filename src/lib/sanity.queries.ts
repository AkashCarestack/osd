import type { PortableTextBlock } from '@portabletext/types'
import type { ImageAsset, Slug } from '@sanity/types'
import groq from 'groq'
import { type SanityClient } from 'next-sanity'

import { Author, Post, Tag } from '~/interfaces/post'

// Common Body query  for $portableText  update the dynamic component query here
const bodyFragment = `
  body[] {
    ...,
      _type == "videoReference" => {
      ...,
      "video": @->{
      _id,
      title,
      platform,
      videoId,
    }
    },
    _type == "image" => {
      ...,
      asset->,
    },
    _type == "dynamicComponent" => {
      ...,
      testimonialCard {
        testimonial-> {
          testimonialName,
          excerpt,
          "customerDetails": customer->{
            name,
            slug,
            role,
            bio,
            "picture": picture.asset-> {
              _id,
              metadata {
                dimensions
              },
              altText,
              title
            },
          },
          image {
            asset->{
              url,
              metadata
            }
          },
          rating,
          date
        }
      },
      bannerBlock,
      asideBannerBlock,
    }
  }
`
//Table of contents
const tocFragment = `
   "headings": body[style in ["h2"]]{ 
      "children": children[]{
        "text": text,
        "marks": marks,
        "_type": _type,
        "_key": _key
      },
      "style": style,
      "_type": _type,
      "_key": _key
    }
`

const imageFragment = `
  "mainImage": mainImage.asset-> {
    _id,
    metadata {
      dimensions
    },
    altText,
    title
  }
`
const authorImageFragment = `
  "picture": picture.asset-> {
    _id,
    metadata {
      dimensions
    },
    altText,
    title
  }
`

export const postsQuery = groq`
*[_type == "post" && language == $region && defined(slug.current) && defined(date)] | order(date desc) {
 ${imageFragment},
 title,
 slug,
 _id,
  excerpt,
  contentType,
  author[]-> {
      _id,
      name,
      slug,
      ${authorImageFragment},
  },
  date,
  duration,
  ${bodyFragment},
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
  tags[]->{
    _id,
    tagName,
    slug
  },
}
`

export const iframesQuery = groq`*[_type == "iframes" && defined(slug.current)] | order(date desc)`

export const authorsQuery = groq`*[_type == "author" && defined(slug.current)] | order(date desc)`

export const tagsQuery = groq`*[_type == "tag"] | order(tagName asc)`
export const categoriesQuery = groq`*[_type == "category" ]  | order(categoryName asc)`
export const tagsByOrderQuery = groq`*[_type == "tag" ] | order(tagName asc) {_id, slug, tagName}`

export const eventCardQuery = groq`
  *[_type == "eventCard"] | order(eventStartDate desc) {
    _id,
    eventName,
    ${imageFragment},
    bgColor,
    evenTtype,
    eventDescription,
    eventStartDate,
    eventEndDate,
    eventLocation,
    registrationLink,
    registerBtnTxt
  }
`
// combined query testimonials with associated customer names
export const testiMonialsQuery = groq`
  *[_type == "testimonial" && language == $region && defined(slug.current)] | order(date desc) {
    _id,
    testimonialName,
    slug,
  "customer": customer-> {
    _id,
    name,
    role,
    slug,
    ${authorImageFragment},
  },
    excerpt,
    layoutSwitcher,
    hasVideo,
    "videos": videos[]-> {  
      _id,
      title,
      platform,
      videoId,
    },
 ${imageFragment},
    rating,
    date
  }
`

export const homeSettingsQuery = groq`
  *[_type == "homeSettings" && language == $region] | order(date desc) {
    _id,
    _createdAt,
    "latestBlogs": *[_type == "post" && contentType == "article" && defined(slug.current)] | order(date desc) {
       id,
      "desc": postFields.excerpt,
      title,
      contentType,
     ${imageFragment},
      slug,
      author[]-> {
      _id,
      name,
      slug,
      role,
      bio,
      ${authorImageFragment},
    },
      tags[]->{
        _id,
        tagName,
        slug
      }
    }[0...4],
    "testimonial": testimonial[]-> {
      _id,
      testimonialName,
      slug,
      
      "customer": customer-> {
        _id,
        name,
        role,
        slug,
        ${authorImageFragment},
      },
      excerpt,
      layoutSwitcher,
      hasVideo,
      videoId,
      image,
      rating,
      date
    },
    featuredTags[]->{
      _id,
      slug,
      tagName
    },
    popularBlogs[]->{
      _id,
      slug,
      "desc": postFields.excerpt,
      title,
      contentType,
      date,
      duration,
     ${imageFragment},
     ${bodyFragment},
     "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
      author[]-> {
      _id,
      name,
      },
    },

    featuredCarouselItems[]->{
      _id,
      slug,
      title,
      contentType,
      date,
      duration,
     ${imageFragment},
    },

    FeaturedContents[]->{
      _id,
      slug,
      contentType,
      "desc": postFields.excerpt,
      title,
      date,
      duration,
      ${imageFragment},
     ${bodyFragment},
     "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
      author[]-> {
      _id,
      name,
      },
    },
    customBrowseContent->{
      _id,
      slug,
      contentType,
      title,
      date,
      duration,
      "customImage": customImage.asset-> {
        _id,
        metadata {
          dimensions
        },
        altText,
        title
      },
    },
    featuredEvent->{
      _id,
      eventName,
      ${imageFragment},
      bgColor,
      evenTtype,
      eventDescription,
      eventStartDate,
      eventEndDate,
      eventLocation,
      registrationLink,
      registerBtnTxt,
    },
    featuredArticle->{
      _id,
      slug,
      contentType,
      excerpt,
      "desc": postFields.excerpt,
      title,
      date,
      duration,
      ${imageFragment},
      author[]-> {
      _id,
      name,
      slug,
      ${authorImageFragment},
    },
    tags[]->{
        _id,
        tagName,
        slug
      },
    },
    featuredWebinar->{
      _id,
      slug,
      contentType,
      excerpt,
      "desc": postFields.excerpt,
      title,
      date,
      duration,
      ${imageFragment},
      author[]-> {
      _id,
      name,
      slug,
      ${authorImageFragment},
    },
    tags[]->{
        _id,
        tagName,
        slug
    },
    },
    featuredPodcast->{
      _id,
      slug,
      contentType,
      excerpt,
      "desc": postFields.excerpt,
      title,
      date,
      duration,
      ${imageFragment},
      author[]-> {
      _id,
      name,
      slug,
      ${authorImageFragment},
    },
    tags[]->{
        _id,
        tagName,
        slug
    },
    },
    featuredEbook->{
      _id,
      slug,
      contentType,
      excerpt,
      "desc": postFields.excerpt,
      title,
      date,
      duration,
      ${imageFragment},
       author[]-> {
      _id,
      name,
      slug,
      ${authorImageFragment},
    },
    tags[]->{
        _id,
        tagName,
        slug
    },
    },
    featuredCasestudy->{
      _id,
      slug,
      contentType,
      title,
      date,
      duration,
      excerpt,
      "desc": postFields.excerpt,
      ${imageFragment},
      author[]-> {
      _id,
      name,
      slug,
      ${authorImageFragment},
    },
    tags[]->{
        _id,
        tagName,
        slug
      },
    },
    demoBanner,
    eventCarousel,
    topicDescription,
    featuredPressRelease->{
      _id,
      slug,
      contentType,
      title,
      date,
      duration,
      excerpt,
      "desc": postFields.excerpt,
      ${imageFragment},
      author[]-> {
      _id,
      name,
      slug,
      ${authorImageFragment},
    },
    tags[]->{
        _id,
        tagName,
        slug
      },
    },
  featuredReviews[]->{
      _id,
      testimonialName,
      slug,
    "customer": customer-> {
      _id,
      name,
      role,
      slug,
      ${authorImageFragment},
    },
      excerpt,
      layoutSwitcher,
      hasVideo,
    "videos": videos[]-> {  
        _id,
        title,
        platform,
        videoId,
    },
    ${imageFragment},
      rating,
      date
  },
    FeaturedBlog->{
      title,
      contentType,
     ${imageFragment},
      blogColor,
      excerpt,
      slug,
      "desc": postFields.excerpt,
      tags[]->{
        _id,
        tagName,
        slug
      },
    author[]-> {
      _id,
      name,
      slug,
      role,
      bio,
      ${authorImageFragment},
    },
    },
  }[0]
`

const siteSettingsQuery = groq`*[_type == "siteSetting"] | order(date desc) {
...,

}`

export async function getPosts(
  client: SanityClient,
  limit?: number,
  region: any = 'en',
): Promise<Post[]> {
  let newPostsQuery = postsQuery
  if (limit > 0) {
    newPostsQuery = postsQuery + `[0...${limit}]`
  }
  return await client.fetch(newPostsQuery,{region:region})
}
export async function getPostsByLimit(
  client: SanityClient,
  startLimit?: number,
  endLimit?: number,
  selectedTag?: string,
  region: any = 'en',
): Promise<Post[]> {
  let newPostsQuery = postsQuery + `[${startLimit}...${endLimit}]`

  if (selectedTag) {
    newPostsQuery += ` && tags[]->slug.current == "${selectedTag}"`
  }

  return await client.fetch(newPostsQuery,{region:region})
}
export async function getIframes(client: SanityClient): Promise<Post[]> {
  return await client.fetch(iframesQuery)
}
export async function getAuthors(client: SanityClient): Promise<Author[]> {
  return await client.fetch(authorsQuery)
}
export async function getTags(client: SanityClient): Promise<Tag[]> {
  return await client.fetch(tagsQuery)
}
export async function getCategories(client: SanityClient,): Promise<any[]> {
  return await client.fetch(categoriesQuery,)
}
export async function getTagsByOrder(client: SanityClient): Promise<Tag[]> {
  return await client.fetch(tagsByOrderQuery)
}

export async function getEventCards(client: SanityClient): Promise<Tag[]> {
  return await client.fetch(eventCardQuery)
}
export async function getPostsByTagAndLimit(
  client: SanityClient,
  tagId: string,
  start: number,
  end: number,
  region: string = 'en',
) {
  return client.fetch(
    groq`*[_type == "post" &&  language == $region && references($tagId)] | order(date desc) [$start...$end] {
      title,
      contentType,
      ${imageFragment},
      blogColor,
      excerpt,
      slug,
      duration,
      date,
      ${bodyFragment},
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
    }`,
    { tagId, start, end,region },
  )
}
export async function getPostsByCategoryAndLimit(
  client: SanityClient,
  catId: string,//FYI Category ID
  start: number,
  end: number,
  region: string = 'en',
) {
  return client.fetch(
    groq`*[_type == "post" && references($catId) && language == $region] | order(date desc) [$start...$end] {
      title,
      contentType,
      ${imageFragment},
      blogColor,
      excerpt,
      slug,
      duration,
      date,
      ${bodyFragment},
      "category": category->{
        _id,
        categoryName,
        categoryDescription,
        slug,
      },
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
    }`, 
    { catId, start, end ,region},
  )
}

export async function getTestiMonials(
  client: SanityClient,
  skip: number = 0,
  limit?: number,
  region: string = 'en',
): Promise<Post[]> {
  let newTestiMonialsQuery = testiMonialsQuery

  if (limit !== undefined) {
    newTestiMonialsQuery += `[${skip}...${skip + limit}]`
  }

  return await client.fetch(newTestiMonialsQuery,{region:region})
}

export async function getTestiMonialsCount(
  client: SanityClient,
): Promise<number> {
  const countQuery = groq`count(${testiMonialsQuery})`
  return await client.fetch(countQuery)
}
export async function getPodcasts(
  client: SanityClient,
  skip: number = 0,
  limit?: number,
  region: string = 'en',
): Promise<Post[]> {
  let newPodCastQuery = podcastsQuery
  if (limit !== undefined) {
    newPodCastQuery += `[${skip}...${skip + limit}]`
  }
  return await client.fetch(newPodCastQuery,{region:region})
}

export async function getPodcastsCount(client: SanityClient,region: any = 'en'): Promise<number> {
  const countQuery = groq`count(${podcastsQuery})`
  return await client.fetch(countQuery,{region:region})
}
export async function getWebinars(
  client: SanityClient,
  skip: number = 0,
  limit?: number,
  region: string = 'en',
): Promise<Post[]> {
  let newWebinarQuery = webinarsQuery

  if (limit !== undefined) {
    newWebinarQuery += `[${skip}...${skip + limit}]`
  }

  return await client.fetch(newWebinarQuery,{region:region})
}

export async function getWebinarsCount(client: SanityClient,region: string = 'en'): Promise<number> {
  const countQuery = groq`count(${webinarsQuery})`
  return await client.fetch(countQuery,{region:region})
}
export async function getEbooks(
  client: SanityClient,
  skip: number = 0,
  limit?: number,
  region: string = 'en',
): Promise<Post[]> {
  let newEbooksQuery = ebooksQuery

  if (limit !== undefined) {
    newEbooksQuery += `[${skip}...${skip + limit}]`
  }

  return await client.fetch(newEbooksQuery,{region:region})
}

export async function getEbooksCount(client: SanityClient,region: string = 'en'): Promise<number> {
  const countQuery = groq`count(${ebooksQuery})`
  return await client.fetch(countQuery,{region:region})
}

export async function getArticles(
  client: SanityClient,
  skip: number = 0,
  limit?: number,
  region: string = 'en'
): Promise<Post[]> {
  let query = artilclesQuery

  if (skip > 0 || limit !== undefined) {
    query += `[${skip}..${limit ? skip + limit : ''}]`
  }

  return await client.fetch(query,{region:region})
}

export async function getArticlesCount(client: SanityClient,region: string = 'en'): Promise<number> {
  const countQuery = groq`count(${artilclesQuery})`
  return await client.fetch(countQuery,{region:region})
}

export async function getReleaseNotes(
  client: SanityClient,
  skip: number = 0,
  limit?: number,
  region: string = 'en'
): Promise<Post[]> {
  let query = releaseNotesQuery

  if (skip > 0 || limit !== undefined) {
    query += `[${skip}..${limit ? skip + limit : ''}]`
  }

  return await client.fetch(query,{region:region})
}

export async function getReleaseNotesCount(client: SanityClient,region: string = 'en'): Promise<number> {
  const countQuery = groq`count(${releaseNotesQuery})`
  return await client.fetch(countQuery,{region:region})
}
export async function getCaseStudies(
  client: SanityClient,
  skip: number = 0,
  limit?: number,
  region: string = 'en',
): Promise<Post[]> {
  let newCaseStudyQuery = caseStudiesQuery

  if (skip > 0 || limit !== undefined) {
    newCaseStudyQuery += `[${skip}...${limit !== undefined ? skip + limit : ''}]`
  }

  return await client.fetch(newCaseStudyQuery,{region:region})
}
export async function getCaseStudiesCount(
  client: SanityClient,
  region: string = 'en',
): Promise<number> {
  const countQuery = groq`count(${caseStudiesQuery})`
  return await client.fetch(countQuery,{region:region})
}
export async function getPressReleases(
  client: SanityClient,
  skip: number = 0,
  limit?: number,
  region: string = 'en',
): Promise<Post[]> {
  let newPressReleaseQuery = pressReleasesQuery
  if (limit !== undefined) {
    newPressReleaseQuery += `[${skip}...${skip + limit}]`
  }
  return await client.fetch(newPressReleaseQuery,{region:region})
}

export async function getPressReleasesCount(
  client: SanityClient,
  region: string = 'en',
): Promise<number> {
  const countQuery = groq`count(${pressReleasesQuery})`
  return await client.fetch(countQuery,{region:region})
}

export async function getPostsBySlug(
  client: SanityClient,
  slug: any,
): Promise<Post[]> {
  let newPostsQuery = postsQuery

  if (slug.length > 0) {
    newPostsQuery = groq`
      *[_type == "post" && defined(slug.current) && "${slug}" in tags[]->slug.current]  | order(date desc) {
      "desc":postFields.excerpt,
      title,
      date,
      ${imageFragment},
      "slug":slug.current,
      author[]-> {
        _id,
        name,
        slug,
        role,
        bio,
        ${authorImageFragment},
      },
        tags[]->{
        _id,
        tagName,
        slug 
        }
      }
      `
  }
  return await client.fetch(newPostsQuery)
}

export const podcastsQuery = groq`
*[_type == "post" && language == $region && contentType == "podcast" && defined(slug.current) && defined(date)] |  order(date desc){
  _id,
  title,
  slug,
  duration,
  publishedAt,
  contentType,
  ${imageFragment},
  excerpt,
  "author": author[]-> {
    _id,
    name,
    role,
    slug,
    bio,
    ${authorImageFragment},
  },
  tags[]-> {
    _id,
    tagName,
    slug
  }
}
`
export const webinarsQuery = groq`
*[_type == "post" && language == $region && contentType == "webinar" && defined(slug.current) && defined(date)] |  order(date desc){
  _id,
  title,
  slug,
  contentType,
  "audioFile": Video.link,
  "platform": Video.platform,
  duration,
  publishedAt,
  excerpt,
  date,
 ${imageFragment},
  ${bodyFragment},
  "author": author[]-> {
    _id,
    name,
    role,
    slug,
    bio,
    ${authorImageFragment},
  },
  tags[]-> {
    _id,
    tagName,
    slug
  }
}
`
export const ebooksQuery = groq`
*[_type == "post" && language == $region && contentType == "ebook" && defined(slug.current) && defined(date)] |  order(date desc){
  _id,
  title,
  slug,
  contentType,
  duration,
  publishedAt,
  excerpt,
  date,
 ${imageFragment},
  ${bodyFragment},
   "numberOfCharacters": length(pt::text(body)),
   "estimatedWordCount": round(length(pt::text(body)) / 5),
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
  "author": author[]-> {
    _id,
    name,
    role,
    slug,
    bio,
    ${authorImageFragment},
  },
  tags[]-> {
    _id,
    tagName,
    slug
  }
}
`
export const pressReleasesQuery = groq`
*[_type == "post" && contentType == "press-release" && language == $region  && defined(slug.current) && defined(date)] |  order(date desc){
  _id,
  title,
  slug,
  contentType,
  "audioFile": Video.link,
  "platform": Video.platform,
  duration,
  publishedAt,
  date,
  excerpt,
 ${imageFragment},
  ${bodyFragment},
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
   "numberOfCharacters": length(pt::text(body)),
  "estimatedWordCount": round(length(pt::text(body)) / 5),
  "author": author[]-> {
    _id,
    name,
    role,
    slug,
    bio,
    ${authorImageFragment},
  },
  tags[]-> {
    _id,
    tagName,
    slug
  }
}
`
export const artilclesQuery =  groq`
*[_type == "post"
 && contentType == "article"
  && defined(slug.current) 
  && language == $region
  && defined(date)] |  order(date desc)
  {
  _id,
  title,
  slug,
  contentType,
  "audioFile": Video.link,
  "platform": Video.platform,
  duration,
  publishedAt,
  excerpt,
  date,
  ${imageFragment},
  ${bodyFragment},
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
  "author": author[]-> {
    _id,
    name,
    role,
    slug,
    bio,
    ${authorImageFragment},
  },
  tags[]-> {
    _id,
    tagName,
    slug
  }
}
`

export const caseStudiesQuery = groq`
*[_type == "post" && language == $region && contentType == "case-study" && defined(slug.current) && defined(date)] |  order(date desc){
  _id,
  title,
  slug,
  contentType,
  "audioFile": Video.link,
  "platform": Video.platform,
  duration,
  publishedAt,
  excerpt,
  date,
  duration,
 ${imageFragment},
  ${bodyFragment},
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
  "author": author[]-> {
    _id,
    name,
    role,
    slug,
    bio,
    ${authorImageFragment},
  },
  tags[]-> {
    _id,
    tagName,
    slug
  }
}
`

export const authorRelatedContentQuery = groq`
  *[_type == "post" && $authorId in author[]->_id] {
    _id,
    title,
    slug,
    contentType,
    duration,
    publishedAt,
    excerpt,
    date,
   ${imageFragment},
    ${bodyFragment},
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
  }
`

export async function getHomeSettings(client: SanityClient,region: string = 'en'): Promise<Post[]> {
  return await client.fetch(homeSettingsQuery,{region:region})
}

export async function getSiteSettings(client: SanityClient): Promise<any> {
  return await client.fetch(siteSettingsQuery)
}

export const postBySlugQuery = groq`
  *[_type == "post"  && slug.current == $slug][0] {
    title,
    slug,
    excerpt,
    contentType,
    "region": region,
    "date": date,
   ${bodyFragment},
   ${tocFragment},
    "numberOfCharacters": length(pt::text(body)),
    "estimatedWordCount": round(length(pt::text(body)) / 5),
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
   ${imageFragment},
    _createdAt,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoCanonical,
    seoRobots,
    "author": author[]-> {
      _id,
      name,
      slug,
      role,
      bio,
      ${authorImageFragment},
    },
    tags[]-> {
      _id,
      tagName
    }
  }
`

export const authorBySlugQuery = groq`
  *[_type == "author" && language == $region && slug.current == $slug][0] {
    _id,
    name,
    role,
    slug,
    bio,
    ${authorImageFragment},
  }
`
export const testiMonialBySlugQuery = groq`
  *[_type == "testimonial" && slug.current == $slug][0] {
    _id,
    testimonialName,
    slug,
    customer,
    excerpt,
    layoutSwitcher,
    hasVideo,
   ${imageFragment},
    rating,
    "region": region,
    "date": date,
    ${bodyFragment},
    ${tocFragment},
    "numberOfCharacters": length(pt::text(body)),
    "estimatedWordCount": round(length(pt::text(body)) / 5),
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
    "videos": videos[]-> {
      _id,
      title,
      platform,
      videoId,
    },
    date,
    "tags": tags[]-> {
    _id,
    tagName
   },
  }
`
export const podcastBySlugQuery = groq`
*[_type == "post" && language == $region && contentType == "podcast" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  contentType,
  seoTitle,
  seoDescription,
  seoKeywords,
  seoCanonical,
  seoRobots,
  htmlCode, 
  duration,
  publishedAt,
  excerpt,
 ${imageFragment},
  "region": region,
  "date": date,
  ${bodyFragment},
  ${tocFragment},
  "author": author[]-> {
    _id,
    name,
    slug,
    role,
    bio,
    ${authorImageFragment},
  },
  "tags": tags[]-> {
    _id,
    tagName,
    slug
  }
}
`
export const ebookBySlugQuery = groq`
  *[_type == "post" && language== $region && contentType == "ebook" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    contentType,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoCanonical,
    seoRobots,
    duration,
    publishedAt,
    excerpt,
   ${imageFragment},
   ${bodyFragment},
    "region": region,
    "date": date,
    "numberOfCharacters": length(pt::text(body)),
    "estimatedWordCount": round(length(pt::text(body)) / 5),
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
    attachment{
      asset->{
        url
      }
    },
    ${tocFragment},
    "author": author[]-> {
      _id,
      name,
      slug,
      role,
      bio,
      ${authorImageFragment},
    },
    "tags": tags[]-> {
    _id,
    tagName,
    slug
  },
  }
`
export const webinarBySlugQuery = groq`
  *[_type == "post" && contentType == "webinar" && language == $region && slug.current == $slug][0] {
    _id,
    title,
    slug,
    contentType,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoCanonical,
    seoRobots,
    "videos": videos[]-> {
      _id,
      title,
      platform,
      videoId,
    },
    duration,
    publishedAt,
    excerpt,
   ${imageFragment},
    "region": region,
    "date": date,
    "numberOfCharacters": length(pt::text(body)),
    "estimatedWordCount": round(length(pt::text(body)) / 5),
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
    ${bodyFragment},
    ${tocFragment},
    "author": author[]-> {
      _id,
      name,
      slug,
      role,
      bio,
      ${authorImageFragment},
    },
    "tags": tags[]-> {
    _id,
    tagName,
    slug
  },
  }
`
export const pressReleaseBySlugQuery = groq`
  *[_type == "post" && language == $region && contentType == "press-release" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    contentType,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoCanonical,
    seoRobots,
    "audioFile": Video.link,
    "platform": Video.platform,
    "htmlCode": Video.htmlCode, 
    "numberOfCharacters": length(pt::text(body)),
    "estimatedWordCount": round(length(pt::text(body)) / 5),
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
    duration,
    publishedAt,
    excerpt,
    pressReleaseUrl,
   ${imageFragment},
    "region": region,
    "date": date,
    ${bodyFragment},
    ${tocFragment},
    "author": author[]-> {
      _id,
      name,
      slug,
      role,
      bio,
      ${authorImageFragment},
    },
    "tags": tags[]-> {
    _id,
    tagName,
    slug
  },
  }
`
export const articleBySlugQuery = groq`
  *[_type == "post" && contentType == "article" && language == $region  && slug.current == $slug][0] {
    _id,
    title,
    slug,
    contentType,
    duration,
    publishedAt,
    excerpt,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoCanonical,
    seoRobots,
   ${imageFragment},
    ${bodyFragment},
    ${tocFragment},
    "numberOfCharacters": length(pt::text(body)),
    "estimatedWordCount": round(length(pt::text(body)) / 5),
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
    "region": region,
    "date": date,
    "author": author[]-> {
      _id,
      name,
      slug,
      role,
      bio,
      ${authorImageFragment},
    },
    "tags": tags[]-> {
    _id,
    tagName,
    slug
  },
  }
`

export const releaseNotesQuery = groq`
*[_type == "post"
 && contentType == "release-notes"
  && defined(slug.current) 
  && language == $region
  && defined(date)] |  order(date desc)
  {
  _id,
  title,
  slug,
  contentType,
  "audioFile": Video.link,
  "platform": Video.platform,
  duration,
  publishedAt,
  excerpt,
  date,
  ${imageFragment},
  ${bodyFragment},
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
  "author": author[]-> {
    _id,
    name,
    role,
    slug,
    bio,
    ${authorImageFragment},
  },
  tags[]-> {
    _id,
    tagName,
    slug
  }
}
`

export const releaseNotesBySlugQuery = groq`
  *[_type == "post" && contentType == "release-notes" && language == $region  && slug.current == $slug][0] {
    _id,
    title,
    slug,
    contentType,
    duration,
    publishedAt,
    excerpt,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoCanonical,
    seoRobots,
   ${imageFragment},
    ${bodyFragment},
    ${tocFragment},
    "numberOfCharacters": length(pt::text(body)),
    "estimatedWordCount": round(length(pt::text(body)) / 5),
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
    "region": region,
    "date": date,
    "author": author[]-> {
      _id,
      name,
      slug,
      role,
      bio,
      ${authorImageFragment},
    },
    "tags": tags[]-> {
    _id,
    tagName,
    slug
  },
  }
`

export const caseStudyBySlugQuery = groq`
  *[_type == "post" && language == $region && contentType == "case-study" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    contentType,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoCanonical,
    seoRobots,
    "audioFile": Video.link,
    "platform": Video.platform,
    duration,
    publishedAt,
    excerpt,
    date,
    ${imageFragment},
    "numberOfCharacters": length(pt::text(body)),
    "estimatedWordCount": round(length(pt::text(body)) / 5),
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
    ${bodyFragment},
    ${tocFragment},
    "author": author[]-> {
      _id,
      name,
      role,
      slug,
      bio,
      ${authorImageFragment},
    },
    "tags": tags[]-> {
      _id,
      tagName
    },
    practiceName, 
    headCount,
    location,
    providers,
    growingLocations,
    facilities,
    "asideBookFreeDemoBanner": asideBookFreeDemoBanner[] {
      number,
      text
    }
  }
`

export const tagBySlugQuery = groq`
  *[_type == "tag"  && slug.current == $slug][0] {
    _id,
    tagName,
    slug,
  }
`
export const getCategoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    categoryName,
    categoryDescription,
    slug,
    "associatedContent": associatedContent[]-> {
      _id,
      title,
      slug,
      contentType,
      excerpt,
      date,
      ${imageFragment},
    },
  }
`

export const postBySlugAndRegionQuery = groq`
  *[_type == "post" && language == $region && slug.current == $slug][0] {
    _id,
    title,
    slug,
    contentType,
    excerpt,
    duration,
    publishedAt,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoCanonical,
    seoRobots,
    ${imageFragment},
    ${bodyFragment},
    ${tocFragment},
    "numberOfCharacters": length(pt::text(body)),
    "estimatedWordCount": round(length(pt::text(body)) / 5),
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
    "region": region,
    "date": date,
    "author": author[]-> {
      _id,
      name,
      slug,
      role,
      bio,
      ${authorImageFragment},
    },
    "tags": tags[]-> {
      _id,
      tagName,
      slug
    },
  }
`

export const iframeBySlugQuery = groq`*[_type == "iframes" && slug.current == $slug][0]`

export async function getPostBySlugAndRegion(
  client: SanityClient,
  slug: string,
  region: string = 'en'
): Promise<any> {
  const post = await client.fetch(postBySlugAndRegionQuery, {
    slug,
    region,
  })
  return post || null
}

export async function getPost(
  client: SanityClient,
  slug: string,
): Promise<Post> {
  const post = await client.fetch(postBySlugQuery, {
    slug,
  })

  if (post) {
    const tagIds = post.tags?.map((tag: any) => tag?._id) || []

    if (tagIds.length > 0) {
      const relatedPosts = await getRelatedPosts(client, slug, 'posts', tagIds)
      return { ...post, relatedPosts }
    }
    return { ...post, relatedPosts: [] }
  }
  return null
}

export async function getIframe(
  client: SanityClient,
  slug: string,
): Promise<Iframe> {
  return await client.fetch(iframeBySlugQuery, {
    slug,
  })
}
export async function getAuthor(
  client: SanityClient,
  slug: string,
  region: string = 'en',
): Promise<any> {
  return await client.fetch(authorBySlugQuery, {
    slug,
    region
  })
}

export async function getauthorRelatedContents(
  client: SanityClient,
  authorId: string,
  limit: number = 6,
  region: any = 'en',
): Promise<any> {
  let relatedAuthors = authorRelatedContentQuery

  if (authorId && authorId?.length > 0) {
    relatedAuthors = groq`
      *[_type == "post" && language == $region && "${authorId}" in author[]->_id] | order(date desc) [0...${limit}] {
        _id,
        title,
        slug,
        contentType,
        duration,
        publishedAt,
        excerpt,
        date,
        ${imageFragment},
        ${bodyFragment},
        "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
      }
    `
  }

  return await client.fetch(relatedAuthors, {
    authorId,region
  })
}

export async function getTagRelatedContents(
  client: SanityClient,
  currentSlug: string,
  tagId: string,
  contentType: string = '',
  limit: number = 4,
  region: any = 'en',
): Promise<any> {
  if (!tagId) return []

  const query = groq`
    *[_type == "post" && language == $region  && slug.current !="${currentSlug}" && contentType == "${contentType}" && "${tagId}" in tags[]->_id] 
    | order(date desc)  [0...${limit}]  {
      _id,
      title,
      slug,
      contentType,
      duration,
      publishedAt,
      excerpt,
      date,
      ${imageFragment},
      ${bodyFragment},
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
      "tags": tags[]-> {
      _id,
      tagName
    },
      
    }
  `

  return await client.fetch(query,{region})
}

export async function getTag(client: SanityClient, slug: string,): Promise<any> {
  return await client.fetch(tagBySlugQuery, {
    slug
  })
}
export async function getCategory(client: SanityClient, slug: string): Promise<any> {
  return await client.fetch(getCategoryBySlugQuery, {
    slug
  })
}

export const getPostsByTag = (client: SanityClient, tagId,region: string = 'en') => {
  return client.fetch(
    groq`
    *[_type == "post" && language == $region && references($tagId)] {
      title,
      slug,
      contentType,
     ${imageFragment},
      _createdAt
    }
  `,
    { tagId ,region},
  )
}
export async function getCaseStudy(
  client: SanityClient,
  slug: string,
  region: string = 'en'
): Promise<any> {
  const caseStudy = await client.fetch(caseStudyBySlugQuery, { slug,region })
  if (!caseStudy) {
    null
  }
  return caseStudy
}
export async function getTestimonial(
  client: SanityClient,
  slug: string,
): Promise<any> {
  const testimonial = await client.fetch(testiMonialBySlugQuery, { slug })
  if (testimonial) {
    const tagIds = testimonial.tags?.map((tag: any) => tag?._id) || []

    if (tagIds.length > 0) {
      const relatedTestimonials = await getRelatedTestimonials(
        client,
        slug,
        'testimonials',
        tagIds,
      )
      return { ...testimonial, relatedTestimonials }
    }
    return { ...testimonial, relatedTestimonials: [] }
  }
  return null
}

export const relatedContentsQuery = groq`
  *[_type == $type && slug.current != $currentSlug && 
    $tagIds in tags[]->_id] 
  | order(date desc) [0...$limit] {
    _id,
    title,
    slug,
    contentType,
    publishedAt,
    ${imageFragment},
    ${bodyFragment},
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180),
    date,
    duration,
    excerpt,
    "tags": tags[]-> {
      _id,
      tagName,
      slug,
    }
  }
`

export const relatedTestimonialComponents = groq`
  *[_type == 'testimonial' && slug.current != $currentSlug && count(tags[]->_id[ _id in $tagIds ]) > 0] 
  | order(date desc) [0...$limit] {
    _id,
    title,
    slug,
    date,
    contentType,
    publishedAt,
    excerpt,
    "tags": tags[]-> {
      _id,
      tagName,
      slug,
    }
  }
`
export const relatedPostComponents = groq`
  *[_type == 'post' && slug.current != $currentSlug && count(tags[]->_id[ _id in $tagIds ]) > 0] 
  | order(date desc) [0...$limit] {
    _id,
    title,
    date
    slug,
    contentType,
    publishedAt,
    excerpt,
    "tags": tags[]-> {
      _id,
      tagName,
      slug,
    }
  }
`
// sitemap queries **
export const siteMapQuery = groq`*[_type == "post" && defined(slug.current)]{
  "url": slug.current,
  contentType,
  _updatedAt,
  language
} `

export const tagQuery = groq`*[_type == "tag" && defined(slug.current)]{
  "url": slug.current,
  "contentType": "browse",
  _updatedAt
} `

export const authorQuery = groq`*[_type == "author" && defined(slug.current)]{
  "url": slug.current,
  "contentType": "author",
  _updatedAt
} `

export const testiMonialQuery = groq`
*[_type == "testimonial" && defined(slug.current)]{
  "url": slug.current,
  "contentType": "testimonial",
  _updatedAt
}
`

export async function getRelatedContents(
  client: SanityClient,
  currentSlug: string = '',
  type: string = 'post', // default post will be fetched
  tagIds: string[] = [],
  limit: number = 4,
): Promise<any[]> {
  return await client.fetch(relatedContentsQuery, {
    currentSlug,
    tagIds,
    type,
    limit,
  })
}
export async function getRelatedTestimonials(
  client: SanityClient,
  currentSlug: string = '',
  pageType: string = 'testimonials',
  tagIds: string[] = [],
  limit: number = 3,
): Promise<any[]> {
  return await client.fetch(relatedTestimonialComponents, {
    currentSlug,
    pageType,
    tagIds,
    limit,
  })
}
export async function getRelatedPosts(
  client: SanityClient,
  currentSlug: string = '',
  pageType: string = 'post',
  tagIds: string[] = [],
  limit: number = 3,
): Promise<any[]> {
  return await client.fetch(relatedPostComponents, {
    currentSlug,
    pageType,
    tagIds,
    limit,
  })
}
export async function getPodcast(
  client: SanityClient,
  slug: string,
  region: string = 'en',
): Promise<any> {
  const podcast = await client.fetch(podcastBySlugQuery, { slug,region })
  if (!podcast) {
    null
  }
  return podcast
}

export const getAllPodcastSlugs = async (
  client: any,
  currentSlug: string,
  region: string = 'en'
): Promise<{
  current: { slug: string; number: number }
  previous: string
  next: string
  totalPodcasts: number
}> => {
  const query = `
    *[_type == "post" && language == $region && contentType == "podcast"] |  order(date desc) {
      "slug": slug.current
    }
  `

  const result = await client.fetch(query, { region })
  const slugs = result?.map((item: { slug: string }) => item.slug)

  const currentIndex = slugs?.indexOf(currentSlug)

  if (currentIndex === -1) {
    throw new Error(`Slug ${currentSlug} not found`)
  }

  const totalPodcasts = slugs?.length

  const previousSlug = slugs[(currentIndex - 1 + totalPodcasts) % totalPodcasts]
  const nextSlug = slugs[(currentIndex + 1) % totalPodcasts]

  return {
    current: { slug: currentSlug, number: currentIndex + 1 },
    previous: previousSlug,
    next: nextSlug,
    totalPodcasts,
  }
}

export async function getArticle(
  client: SanityClient,
  slug: string,
  region: string = 'en'
): Promise<any> {
  const article = await client.fetch(articleBySlugQuery, { slug, region })
  if (!article) {
    return null
  }
  return article
}

export async function getReleaseNote(
  client: SanityClient,
  slug: string,
  region: string = 'en'
): Promise<any> {
  const releaseNote = await client.fetch(releaseNotesBySlugQuery, { slug, region })
  if (!releaseNote) {
    return null
  }
  return releaseNote
}
export async function getWebinar(
  client: SanityClient,
  slug: string,
  region: string = 'en',
): Promise<any> {
  const webinar = await client.fetch(webinarBySlugQuery, { slug ,region})
  if (!webinar) {
    return null
  }
  return webinar
}
export async function getEbook(
  client: SanityClient,
  slug: string,
  region: string = 'en',
): Promise<any> {
  const ebook = await client.fetch(ebookBySlugQuery, { slug ,region})
  if (!ebook) {
    return null
  }
  return ebook
}
export async function getPressRelease(
  client: SanityClient,
  slug: string,
  region: string = 'en',
): Promise<any> {
  const pressRelease = await client.fetch(pressReleaseBySlugQuery, { slug,region })
  if (!pressRelease) {
    return null
  }
  return pressRelease
}

export async function getSitemapData(client: SanityClient): Promise<Post[]> {
  try {
    const posts = await client.fetch(siteMapQuery)
    const tags = await client.fetch(tagQuery)
    const authors = await client.fetch(authorQuery)
    return [...posts, ...tags, ...authors]
  } catch (error) {
    console.error(error)
    return []
  }
}

export const Footerquery = groq ` *[_type == "footer" && language == $region][0]{
  ...,
}`

export async function getFooterData(client:SanityClient, region: string = 'en') {
  return await client.fetch(Footerquery, { region })
}

// queries for static path generation **
export const postSlugsQuery = groq`
*[_type == "post" && language == $locale &&  defined(slug.current)]{
      "slug": slug.current,
      "locale": language
    }
`
export const iframeSlugsQuery = groq`
*[_type == "iframes" && defined(slug.current)][].slug.current
`
export const authorSlugsQuery = groq`
  *[_type == "author" && language == $locale && defined(slug.current)]{
      "slug": slug.current,
      "locale": language
    }
`
export const tagsSlugsQuery = groq`
  *[_type == "tag" && language == $locale && defined(slug.current)] {
      "slug": slug.current,
      "locale": language
    }
`
export const catsSlugsQuery = groq`
  *[_type == "category" && defined(slug.current)] {
      "slug": slug.current,
      "locale": $locale
    }
`

export const catsSlugsWithoutAssociatedContentQuery = groq`
  *[_type == "category" && defined(slug.current) && (!defined(associatedContent) || count(associatedContent) == 0)] {
      "slug": slug.current,
      "locale": $locale
    }
`
export const testimonialSlugsQuery = groq`
  *[_type == "testimonial" && defined(slug.current)][].slug.current
`
export const podcastSlugsQuery = groq`
  *[_type == "post" && contentType == "podcast" && language == $locale && defined(slug.current)]{
      "slug": slug.current,
      "locale": language
    }
`
export const articleSlugsQuery = groq`
  *[_type == "post" && contentType == "article" && language == $locale && defined(slug.current)] {
      "slug": slug.current,
      "locale": language
    }
`

export const releaseNotesSlugsQuery = groq`
  *[_type == "post" && contentType == "release-notes" && language == $locale && defined(slug.current)] {
      "slug": slug.current,
      "locale": language
    }
`
export const webinarSlugsQuery = groq`
  *[_type == "post" && contentType == "webinar" && language == $locale   && defined(slug.current)]{
      "slug": slug.current,
      "locale": language
    }
`
export const pressReleaseSlugsQuery = groq`
  *[_type == "post" && language == $locale && contentType == "press-release" && defined(slug.current)]{
      "slug": slug.current,
      "locale": language
    }
`
export const caseStudySlugsQuery = groq`
  *[_type == "post" &&  contentType == "case-study" &&  language == $locale   && defined(slug.current)] {
      "slug": slug.current,
      "locale": language
    }
`
export const ebookSlugsQuery = groq`
  *[_type == "post" && language == $locale && contentType == "ebook" && defined(slug.current)] {
      "slug": slug.current,
      "locale": language
    }
`

export interface Iframe {
  _type: 'iframes'
  _id: string
  _createdAt: string
  title?: string
  slug: Slug
  excerpt?: string
  mainImage?: ImageAsset
  body: PortableTextBlock[]
}
