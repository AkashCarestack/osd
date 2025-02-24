import siteConfig from 'config/siteConfig'
import { Post } from '~/interfaces/post'
import post from '~/schemas/post'
import { average, prominent } from '~/utils/color'
import enGb from '../../public/assets/countryFlags/EN-GB.png'
import en from '../../public/assets/countryFlags/EN-usa.png'
import enAu from '../../public/assets/countryFlags/EN-AU.png'


export const fetchAuthor = (post) => {
  let authorData: any = []
  post &&
    post.authorInfo &&
    post.authorInfo.content.body
      .filter((block: any) => block.component === 'authorBioSection')
      .map((author: any) => (authorData = author.author))
  return authorData
}

export function rgbToHsl(r, g, b) {
  ;(r /= 255), (g /= 255), (b /= 255)

  var max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  var h,
    s,
    l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    var d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  // return [ h, 40, 40 ];

  return `hsl(${h * 360},50%,40%)`
  // return `hsl(${h*100},40%,40%)`
}

export function getRelatedFeatures(
  currentPost: Post,
  allPosts: Post[],
): Post[] {
  const currentTags = new Set(currentPost.tags?.map((tag) => tag.tagName) || [])
  const relatedPosts = allPosts
    .filter((post) => post._id !== currentPost._id)
    .map((post) => ({
      post,
      relevance: (
        post.tags?.filter((tag) => currentTags.has(tag.tagName)) || []
      ).length,
    }))
    ?.sort((a, b) => {
      if (b.relevance !== a.relevance) {
        return b.relevance - a.relevance
      }
      return (
        new Date(b.post._createdAt).getTime() -
        new Date(a.post._createdAt).getTime()
      )
    })
    .map((item) => item.post)

  const uniqueRelatedPosts = Array.from(
    new Set(relatedPosts.map((post) => post._id)),
  )
    .map((_id) => relatedPosts.find((post) => post._id === _id))
    .filter((post): post is Post => post !== undefined)
    .slice(0, 2)

  return uniqueRelatedPosts
}

export const capitalizeFirstLetter = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1) + 's'
}

export const getUniqueReorderedCarouselItems = (
  homeSettings,
  ebooks,
  webinars,
) => {
  if (!homeSettings?.featuredCarouselItems || !ebooks || !webinars) return []
  const carouselItems = [
    ...homeSettings?.featuredCarouselItems,
    ...ebooks,
    ...webinars,
  ]

  const uniqueCarouselItems = carouselItems.reduce((acc, item) => {
    if (
      !acc.some(
        (existingItem) => existingItem.slug.current === item.slug.current,
      )
    ) {
      acc.push(item)
    }
    return acc
  }, [])

  return [
    ...(homeSettings?.featuredCarouselItems || []),
    ...uniqueCarouselItems.filter(
      (item) =>
        !homeSettings?.featuredCarouselItems.some(
          (homeItem) => homeItem.slug.current === item.slug.current,
        ),
    ),
  ]
}

export const mergeReviews = (
  homeSettingsReviews = [],
  otherReviews = [],
  uniqueKey = '_id',
) => {
  const seen = new Set()
  const result = []
  if (homeSettingsReviews && homeSettingsReviews.length > 0) {
    result.push(...homeSettingsReviews)
    homeSettingsReviews.forEach((review) => seen.add(review[uniqueKey]))
  }
  otherReviews.forEach((review) => {
    if (!seen.has(review[uniqueKey])) {
      seen.add(review[uniqueKey])
      result.push(review)
    }
  })

  return result
}

export const mergeAndRemoveDuplicates = (
  primaryArray,
  secondaryArray = [],
  uniqueKey = '_id',
) => {
  if (!primaryArray || !secondaryArray) return []

  const seen = new Set()
  const result = []

  if (!Array.isArray(primaryArray)) {
    if (primaryArray[uniqueKey] && !seen.has(primaryArray[uniqueKey])) {
      seen.add(primaryArray[uniqueKey])
      result.push(primaryArray)
    }
  } else {
    primaryArray.forEach((item) => {
      if (item && !seen.has(item[uniqueKey]) && result.length < 5) {
        seen.add(item[uniqueKey])
        result.push(item)
      }
    })
  }

  secondaryArray.forEach((item) => {
    if (item && !seen.has(item[uniqueKey]) && result.length < 5) {
      seen.add(item[uniqueKey])
      result.push(item)
    }
  })

  return result
}

export const removeUnwantedCharacters = (path: string) => {
  if (!path) {
    throw new Error('Provide a valid path')
  }
  const excludeCharacters = ['?', '#']
  const cleanPath = excludeCharacters.reduce((acc, character) => {
    return acc.split(character)[0]
  }, path)
  return cleanPath
}

export const getUniqueData = (data) => {
  if (!data) return []
  return data.reduce((acc, current) => {
    if (!acc.find((item) => item._id === current._id)) {
      acc.push(current)
    }
    return acc
  }, [])
}

export function capitalizeFirst(str) {
  const minorWords = ["and", "or", "but", "of", "to", "in", "on", "for", "at", "by", "with", "a", "an", "the","is","if"];
  
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (
        index === 0 || 
        index === str.split(" ").length - 1 || 
        !minorWords.includes(word)
      ) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word; 
    })
    .join(" ");
}

export function slugToCapitalized(slug) {
  if (!slug) return ''
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const normalizePath = (path) => path && path.replace(/\/+/g, '/').replace(/^\//, '/');


export function generateHref(locale: any, linkHref: string): string {
  const isValidHref = locale && locale !== 'en' && siteConfig.locales.includes(locale);

  const cleanPath = normalizePath(linkHref).replace(/^\/+/, '');

  if (!cleanPath || cleanPath === '') {
    return '/';
  }

  if (locale === 'en' || !isValidHref) {
    return `/${cleanPath}`;
  }

  return `/${locale}/${cleanPath}`;
}
export const removeNumberPrefix = (id: any) => id.replace(/^\d+\.\s*/, '');

export const generateId = (...args) => {
  if (!args.length) return '';
  const id = Date.now().toString(36);
  return `${args[0]?.split('/').pop()}-${id}`;
};

export const cookieSelector = (consentString, field) => {
  const regex = new RegExp(`${field}:(\\w+)`);
  const match = consentString && consentString.match(regex);
  return match && match[1] ? match[1] : "false";
};

export const  showCountryFlag = (region: string)=> {
  if(!region) return en.src
  if (region === 'en') {
    return en.src
  } else if (region === 'en-GB') {
    return enGb.src
  } else if (region === 'en-AU') {
    return enAu.src
  }
}