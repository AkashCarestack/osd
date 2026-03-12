export function getQueryParamFromLink(link: string, param: string) {
  const url = new URL(link, window.location.href)

  if (url.origin === window.location.origin) {
    // Internal link
    const queryParams = url.searchParams
    return queryParams.get(param)
  } else {
    // External link
    const queryParams = new URLSearchParams(url.search)
    return queryParams.get(param)
  }
}

function paramsToObject(entries: any): { [key: string]: string } {
  try {
    const result: { [key: string]: string } = {}
    for (const [key, value] of entries) {
      result[key] = value
    }
    return result
  } catch (error) {
    console.error('Error converting URL parameters to object:', error)
    throw error
  }
}

export const getParams = (): { [key: string]: string } => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const entries = urlParams.entries()
    const params = paramsToObject(entries)
    return params
  } catch (error) {
    console.error('Error getting URL parameters:', error)
    throw error
  }
}
