import siteConfig from 'config/siteConfig'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { generateHref } from '~/utils/common'

/**
 * Paths that are available for all locales
 * Add paths here that should have alternate language versions across all locales
 */
export const PATHS_AVAILABLE_FOR_ALL_LOCALES = [
  'article',
  'case-study',
  'ebook',
  'podcast',
  'webinar',
  'press-release',
  'testimonial',
  'author',
  'browse',
  'topic',
  'about',
]

/**
 * Locales that are restricted to root pages only
 * These locales will not have child pages (like /article/slug, /case-study/slug, etc.)
 */
export const LOCALES_WITHOUT_CHILD_PAGES: string[] = []

/**
 * Interface for alternate path data
 */
export interface AlternatePath {
  href: string
  hrefLang: string
}

/**
 * Formats locale code for hreflang attribute
 * Matches the sitemap formatHreflang function
 */
export function formatHreflang(locale: string): string {
  const localeMap: { [key: string]: string } = {
    'en-US': 'en-US',
    'en-GB': 'en-GB',
    'en-AU': 'en-AU',
    'EN-US': 'en-US',
    'EN-GB': 'en-GB',
    'EN-AU': 'en-AU',
    'en': 'en-US',
    '': 'en-US'
  };
  return localeMap[locale] || 'en-US';
}

/**
 * Removes locale prefix from pathname
 * Uses the same logic as sitemap: replace(/^\/(en-[A-Z]{2}\/)?/, '')
 * Examples:
 * - '/en-GB/article/slug' -> '/article/slug'
 * - '/en-AU/case-study/test' -> '/case-study/test'
 * - '/article/slug' -> '/article/slug' (already no locale)
 */
export function removeLocale(pathname: string, locales: string[]): string {
  if (!pathname || pathname === '/') {
    return '/'
  }

  // Use the same regex pattern as sitemap
  const basePath = pathname.replace(/^\/(en-[A-Z]{2}\/)?/, '')
  
  // Ensure path starts with /
  return basePath ? `/${basePath}` : '/'
}

/**
 * Builds URL for a given locale and path using generateHref (same as sitemap)
 * Examples:
 * - buildUrl('en', '/article/slug', baseUrl) -> 'https://example.com/article/slug'
 * - buildUrl('en-GB', '/article/slug', baseUrl) -> 'https://example.com/en-GB/article/slug'
 * - buildUrl('en-AU', '/', baseUrl) -> 'https://example.com/en-AU'
 */
export function buildUrl(
  locale: string,
  path: string,
  baseUrl: string
): string {
  // Remove leading slash from path for generateHref
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const href = generateHref(locale, cleanPath)
  return `${baseUrl}${href}`
}

/**
 * Gets the base URL for the application
 * Uses window.location.origin in browser, falls back to env var or production URL
 */
export function getBaseUrl(): string {
  // In browser, use window.location.origin
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // Fallback to env var or production URL
  return (
    process.env.NEXT_PUBLIC_BASE_URL || 
    'https://resources.voicestack.com'
  )
}

/**
 * Checks if a path should be available for a specific locale
 */
function isPathAvailableForLocale(
  path: string,
  locale: string,
  locales: string[]
): boolean {
  // Root path is always available
  if (path === '/') {
    return true
  }

  // Check if locale is restricted to root pages only
  if (LOCALES_WITHOUT_CHILD_PAGES.includes(locale)) {
    return false
  }

  // Extract the first segment of the path (content type)
  const pathSegments = path.split('/').filter(Boolean)
  if (pathSegments.length === 0) {
    return true
  }

  const contentType = pathSegments[0]

  // Check if this content type is available for all locales
  return PATHS_AVAILABLE_FOR_ALL_LOCALES.includes(contentType)
}

/**
 * Hook to generate alternate language paths for SEO hreflang tags
 * 
 * @returns Object containing alternatePaths array and defaultUrl for x-default
 */
export function useAlternatePaths(): {
  alternatePaths: AlternatePath[]
  defaultUrl: string
} {
  const router = useRouter()
  const [alternatePaths, setAlternatePaths] = useState<AlternatePath[]>([])
  
  // Initialize defaultUrl with a fallback based on current path if available
  const getInitialDefaultUrl = (): string => {
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin
      const pathname = window.location.pathname
      // Remove locale prefix to get base path
      const basePath = pathname.replace(/^\/(en-[A-Z]{2}\/)?/, '') || '/'
      const pathWithoutSlash = basePath.startsWith('/') ? basePath.slice(1) : basePath
      const href = generateHref('en', pathWithoutSlash)
      return `${baseUrl}${href}`
    }
    return ''
  }
  
  const [defaultUrl, setDefaultUrl] = useState<string>(getInitialDefaultUrl())

  useEffect(() => {
    // Wait for router to be ready to ensure accurate path detection
    if (!router.isReady) {
      return
    }

    const locales = siteConfig.locales || []
    const baseUrl = getBaseUrl()
    const currentPath = router.asPath || router.pathname || '/'
    const pathname = currentPath.split('?')[0].split('#')[0]
    let currentLocale: string | undefined = router.query?.locale as string | undefined
    
    if (currentLocale && !locales.includes(currentLocale)) {
      currentLocale = undefined
    }
    if (!currentLocale) {
      const localeMatch = pathname.match(/^\/(en-[A-Z]{2})\//)
      if (localeMatch) {
        currentLocale = localeMatch[1]
      } else {
        // If no locale prefix, it's 'en'
        currentLocale = 'en'
      }
    }
    
    // Final fallback to 'en' if no locale detected
    if (!currentLocale || !locales.includes(currentLocale)) {
      currentLocale = 'en'
    }
    
    // Remove locale prefix to get the base path (same as sitemap)
    const basePath = removeLocale(pathname, locales)
    const alternates: AlternatePath[] = []
    
    // Include all locales, including 'en' (which should be formatted as 'en-US')
    for (const locale of locales) {
      if (!isPathAvailableForLocale(basePath, locale, locales)) {
        continue
      }

      // Use generateHref just like sitemap does
      const pathWithoutSlash = basePath.startsWith('/') ? basePath.slice(1) : basePath
      const href = generateHref(locale, pathWithoutSlash)
      const url = `${baseUrl}${href}`
      // Format locale for hreflang: 'en' becomes 'en-US', others stay as-is
      const hrefLang = formatHreflang(locale)
      
      alternates.push({
        href: url,
        hrefLang,
      })
    }

    setAlternatePaths(alternates)
    
    // Set default URL (x-default) to 'en' locale (no prefix)
    // This should always be set for all pages - x-default always points to the 'en' version
    const defaultLocale = 'en'
    const defaultPathWithoutSlash = basePath.startsWith('/') ? basePath.slice(1) : basePath
    const defaultHref = generateHref(defaultLocale, defaultPathWithoutSlash)
    const finalDefaultUrl = `${baseUrl}${defaultHref}`
    
    // Always set defaultUrl - this is critical for SEO
    setDefaultUrl(finalDefaultUrl)
  }, [router.asPath, router.pathname, router.query?.locale, router.isReady])

  return {
    alternatePaths,
    defaultUrl,
  }
}

