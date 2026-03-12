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
    en: 'en-US',
    '': 'en-US',
  }
  return localeMap[locale] || 'en-US'
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
  baseUrl: string,
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
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://osdental.io'
}

/**
 * Checks if a path should be available for a specific locale
 */
function isPathAvailableForLocale(
  path: string,
  locale: string,
  locales: string[],
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
 * Hook to generate default URL for SEO (canonical / x-default).
 * Locale alternates are no longer used; URLs are partner-based without locale segment.
 *
 * @returns Object containing defaultUrl for x-default and empty alternatePaths
 */
export function useAlternatePaths(): {
  alternatePaths: AlternatePath[]
  defaultUrl: string
} {
  const router = useRouter()
  const [defaultUrl, setDefaultUrl] = useState<string>('')

  useEffect(() => {
    if (!router.isReady) return

    const baseUrl = getBaseUrl()
    const pathname = (router.asPath || router.pathname || '/')
      .split('?')[0]
      .split('#')[0]
    // Current path is the canonical URL (no locale variants)
    const url = pathname
      ? `${baseUrl}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
      : baseUrl
    setDefaultUrl(url)
  }, [router.asPath, router.pathname, router.isReady])

  return {
    alternatePaths: [],
    defaultUrl,
  }
}
