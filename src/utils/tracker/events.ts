import { getCookie } from './cookie'
import { getSession } from './session'

interface ITrackEvent {
  e_properties: {
    [key: string]: any
  }
  e_name: string
  e_type: string
  e_time: Date | string
  session_id: string
  user_id: string
  [key: string]: any
}

// collects all events, pushes to array with new format.
export async function addEvent(data: ITrackEvent[]) {
  try {
    const events = data.map((datum) => {
      const eventData: any = {
        ...datum,
        session_id: getSession(),
        user_id: getCookie('__cs_pv'),
      }
      eventData.e_properties = {
        page: datum.page,
        app: datum.app,
        section: datum.section,
        path: datum.e_path,
        // element: datum.element,
      }
      delete eventData.page
      delete eventData.app
      delete eventData.section
      delete eventData.e_path
      // delete eventData.element;;

      return eventData
    })
    const res = await fetch('/api/track?type=event', {
      method: 'POST',
      body: JSON.stringify({ events }),
      headers: { 'Content-Type': 'application/json' },
    })
    const result = await res.json()
    return result
  } catch (error) {
    throw error
  }
}
