export function setCookie(name: string, value: string, seconds?: number) {
  let expires = ''
  if (seconds) {
    const date = new Date()
    date.setTime(date.getTime() + seconds)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie =
    name + '=' + (value || '') + expires + '; path=/' + ';samesite=Lax;'
}
export function getCookie(name: string) {
  const nameEQ = name + '='
  let ca: string[] | null = null

  if (typeof window !== 'undefined') {
    ca = document?.cookie.split(';')
  }

  if (ca) {
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
    }
  }

  return null
}
export function eraseCookie(name: string) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export function checkCookie() {
  var cookieEnabled = navigator.cookieEnabled
  if (!cookieEnabled) {
    document.cookie = 'testcookie'
    cookieEnabled = document.cookie.indexOf('testcookie') != -1
  }
  return cookieEnabled
}
