export const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const formatDate = (dateString: any) => {
  const date = new Date(dateString)

  return `${days[date.getDay()]}, 
  ${months[date.getMonth()]} 
  ${date.getDate()}, ${date.getFullYear()}, 
  ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

export const formatDateShort = (dateString: any) => {
  const date = new Date(dateString)

  return ` 
  ${months[date.getMonth()]} 
  ${date.getDate()}, ${date.getFullYear()}
  `
}

export const formatDateUtc = (date: any) => {
  return `${new Date(date).toDateString()} ${new Date(
    date,
  ).toLocaleTimeString()}`
}
