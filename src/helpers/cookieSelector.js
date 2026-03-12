export const cookieSelector = (consentString, field) => {
  const regex = new RegExp(`${field}:(\\w+)`)
  const match = consentString && consentString.match(regex)
  return match && match[1] ? match[1] : 'false'
}
