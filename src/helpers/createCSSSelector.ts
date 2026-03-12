export const getCssSelectorShort = (el: Element) => {
  let path = [],
    parent
  while ((parent = el.parentNode)) {
    let tag = el.tagName,
      siblings
    path.unshift(
      el.id
        ? `#${el.id}`
        : ((siblings = parent.children),
          ([] as Element[]).filter.call(
            siblings,
            (sibling) => sibling.tagName === tag,
          ).length === 1
            ? tag
            : `${tag}:nth-child(${1 + ([] as Element[]).indexOf.call(siblings, el)})`),
    )
    el = parent as Element
  }
  return `${path.join(' > ')}`.toLowerCase()
}
