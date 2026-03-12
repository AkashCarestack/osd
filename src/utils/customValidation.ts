export const uniqueTestimonialsValidation = (refs) => {
  if (!refs || !Array.isArray(refs)) return true
  const uniqueIds = new Set()
  const duplicates = refs.some((ref) => {
    if (!ref || !ref._ref) return false
    if (uniqueIds.has(ref._ref)) {
      return true
    }
    uniqueIds.add(ref._ref)
    return false
  })

  return duplicates ? 'Duplicate  are not allowed. Please select unique.' : true
}
