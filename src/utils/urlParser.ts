export function parseUrlForTracking(pageUrl: string): string {
  try {
    const url = new URL(pageUrl);
    const domain = url.hostname;
    const pathParts = url.pathname.split('/').filter(part => part);
    
    let contentType = '';
    let slug = '';

    const contentTypes = ['article', 'ebook', 'podcast', 'webinar', 'case-study', 'press-release', 'topic', 'browse'];
    
    for (const type of contentTypes) {
      if (pathParts.includes(type)) {
        contentType = type;
        const typeIndex = pathParts.indexOf(type);
        if (typeIndex + 1 < pathParts.length) {
          slug = pathParts[typeIndex + 1];
        }
        break;
      }
    }
    
    if (!contentType && pathParts.length > 0) {
      slug = pathParts[pathParts.length - 1];
      contentType = 'page';
    }
    
    return `${domain}/${contentType}/${slug}`;
    
  } catch (error) {
    console.error('Error parsing URL:', error);
    return pageUrl;
  }
}
