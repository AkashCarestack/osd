import { NextApiRequest, NextApiResponse } from 'next'
import { getClient } from '~/lib/sanity.client'
import { readToken } from '~/lib/sanity.api'
import { getSitemapData } from '~/lib/sanity.queries'
import siteConfig from 'config/siteConfig'
import { generateHref } from '~/utils/common'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

function cleanUrl(url: string): string {
  return url.split(' ')[0].trim();
}

function formatHreflang(locale: string): string {
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

function generateSiteMap(posts: any[]) {
  const locales = siteConfig.locales;
  const urlMap = new Map();
  const authorUrls = new Set();

  locales.forEach((locale) => {
    const staticPages = [
      // `${BASE_URL}${generateHref(locale, siteConfig.pageURLs.caseStudy)}`,
      // `${BASE_URL}${generateHref(locale, siteConfig.pageURLs.article)}`,
      // `${BASE_URL}${generateHref(locale, siteConfig.pageURLs.podcast)}`,
      // `${BASE_URL}${generateHref(locale, siteConfig.pageURLs.ebook)}`,
      // `${BASE_URL}${generateHref(locale, siteConfig.pageURLs.webinar)}`,
      // `${BASE_URL}${generateHref(locale, siteConfig.pageURLs.pressRelease)}`,
    ];

    staticPages && staticPages.forEach((page) => {
      const cleanedUrl = cleanUrl(page);
      const urlKey = cleanedUrl.replace(BASE_URL, '').replace(/^\/(en-[A-Z]{2}\/)?/, '');
      
      if (!urlMap.has(urlKey)) {
        urlMap.set(urlKey, { 'en-US': '', 'en-GB': '', 'en-AU': '' });
      }
      
      const variants = urlMap.get(urlKey);
      if (!locale || locale === '') {
        variants['en-US'] = cleanedUrl;
      } else {
        variants[locale.toUpperCase()] = cleanedUrl;
      }
    });
  });

  posts?.forEach((post) => {
    if (post.contentType === 'author') {//author URLs separately without localization
      const authorUrl = `${BASE_URL}${generateHref("", `${post.contentType}/${post.url}`)}`;
      authorUrls.add(cleanUrl(authorUrl));
    } else {
      locales.forEach((locale) => {
        const url = `${BASE_URL}${generateHref(locale, `${post.contentType}/${post.url}`)}`;
        const cleanedUrl = cleanUrl(url);
        const urlKey = cleanedUrl.replace(BASE_URL, '').replace(/^\/(en-[A-Z]{2}\/)?/, '');
        
        if (!urlMap.has(urlKey)) {
          urlMap.set(urlKey, { 'en-US': '', 'en-GB': '', 'en-AU': '' });
        }
        
        const variants = urlMap.get(urlKey);
        if (!locale || locale === '') {
          variants['en-US'] = cleanedUrl;
        } else {
          variants[locale.toUpperCase()] = cleanedUrl;
        }
      });
    }
  });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const [_, variants] of urlMap) {
    Object.entries(variants).forEach(([locale, url]) => {
      if (!url) return;

      xml += '  <url>\n';
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;

      Object.entries(variants).forEach(([altLocale, altUrl]) => {
        if (altUrl && altLocale !== locale) {
          xml += `    <xhtml:link rel="alternate" hreflang="${formatHreflang(altLocale)}" href="${altUrl}"/>\n`;
        }
      });

      xml += '  </url>\n';
    });
  }

  authorUrls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const client = getClient(req?.preview ? { token: readToken } : undefined);
    const data = await getSitemapData(client);
    const sitemap = generateSiteMap(data);
    
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}