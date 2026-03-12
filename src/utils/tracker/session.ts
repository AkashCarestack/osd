import { getCookie, setCookie } from './cookie'

export interface ISession {
  duration: number
  /**
   * timestamp
   */
  start_time: Date | string
  /**
   * timestamp
   */
  end_time: Date | string | null
  referrer_url: string | null
  entry_path: string | null
  exit_path: string | null
  user_id: string | null
  product_id: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_meta: {
    [key: string]: any
  }
  [key: string]: any
}
export function getInitialSession(): Partial<ISession> {
  // if (!getCookie('session')) {
  const start_time = new Date()
  const entry_path = window.location.pathname
  const referrer_url = document.referrer
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.href)
  const utm_source = params.get('utm_source')!
  const utm_medium = params.get('utm_medium')!
  const utm_campaign = params.get('utm_campaign')!
  const utm_content = params.get('utm_content')!
  const utm_term = params.get('utm_term')!
  return {
    utm_medium,
    utm_source,
    start_time,
    entry_path,
    utm_campaign,
    utm_content,
    utm_term,
    referrer_url,
    user_id: getCookie('__cs_pv'),
  }
  // }
  // else {
  // 	return getCookie('session')
  // }
}
export const storeSession = (id: string) => {
  setCookie('session', id, 10 * 60 * 1000)
}
export const getSession = () => getCookie('session')

export const storePracticeName = (id: any) =>
  setCookie('domain', id, 365 * 24 * 60 * 60 * 1000)
