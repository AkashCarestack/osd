import React from 'react'

import Anchor from '~/components/commonSections/Anchor'
import Wrapper from '~/layout/Wrapper'

interface Event {
  title: string
  eventType?: string
  location?: string
  date?: string
  description?: string
  link?: string
}

interface UpcomingEventsData {
  title?: string
  events?: Event[]
}

interface UpcomingEventsSectionProps {
  data?: UpcomingEventsData | null
}

// External link icon SVG - square with arrow pointing diagonally up-right
const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className="shrink-0"
  >
    <path
      d="M12.5 2.5H17.5V7.5"
      stroke="white"
      strokeOpacity="0.7"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.33398 11.6667L17.5007 2.5"
      stroke="white"
      strokeOpacity="0.7"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667"
      stroke="white"
      strokeOpacity="0.7"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    } catch {
      return dateString
    }
  }

  const eventType = event.eventType || 'Offline'
  const link = event.link || '#'

  return (
    <div className="cursor-pointer bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] border-solid flex items-start justify-between p-6 rounded-[10px] flex-1 min-w-[280px] transition-all duration-300 hover:bg-[rgba(255,255,255,0.10)] hover:border-[rgba(255,255,255,0.20)]">
      <div className="flex flex-1 flex-col gap-2 items-start w-full">
        {/* Event Type Badge */}
        <div className="bg-[rgba(255,255,255,0.1)] flex items-center justify-center px-2 py-1 rounded-[4px] shrink-0">
          <p className="font-inter font-medium leading-[1.5] not-italic opacity-70 relative shrink-0 text-xs text-white tracking-[0.6px] uppercase">
            {eventType}
          </p>
        </div>

        {/* Event Title */}
        <h3 className="font-manrope font-bold leading-[1.3] min-w-full relative shrink-0 text-[#93c5fd] text-2xl tracking-[-0.24px] w-full whitespace-pre-wrap">
          {event.title}
        </h3>

        {/* Location and Date */}
        <div className="flex font-inter font-medium gap-2 items-center leading-[1.5] not-italic relative shrink-0 text-sm text-white w-full">
          {event.location && (
            <>
              <p className="relative shrink-0">{event.location}</p>
              <p className="opacity-50 relative shrink-0">|</p>
            </>
          )}
          <p className="relative shrink-0">{formatDate(event.date)}</p>
        </div>

        {/* Description (optional) */}
        {event.description && (
          <p className="font-inter font-normal leading-[1.6] opacity-70 overflow-hidden relative shrink-0 text-base text-white text-ellipsis w-full line-clamp-3">
            {event.description}
          </p>
        )}
      </div>

      {/* External Link Icon */}
      <Anchor
        href={link}
        target={link !== '#' ? '_blank' : undefined}
        rel={link !== '#' ? 'noopener noreferrer' : undefined}
        className="relative shrink-0 w-5 h-5 flex items-center justify-center"
      >
        <ExternalLinkIcon />
      </Anchor>
    </div>
  )
}

const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({ data }) => {
  // Default data - 2 events
  const defaultData: UpcomingEventsData = {
    title: 'Upcoming Events',
    events: [
      {
        title: 'DEO Treatment Closing Academy',
        eventType: 'Offline',
        location: 'Dallas, TX',
        date: '2026-02-26',
        link: '#',
      },
      {
        title: 'Women in DSO, Empower & Grow Conference',
        eventType: 'Offline',
        location: 'Dallas, TX',
        date: '2026-02-26',
        link: '#',
      },
    ],
  }

  // Transform Sanity data to match component interface
  const transformData = (sanityData: any): UpcomingEventsData | null => {
    if (!sanityData) {
      return null
    }

    return {
      title: sanityData.title || defaultData.title,
      events:
        sanityData.events && sanityData.events.length > 0
          ? sanityData.events
          : defaultData.events,
    }
  }

  const transformedData = data ? transformData(data) : null
  const sectionData = transformedData || defaultData

  if (!sectionData.events || sectionData.events.length === 0) {
    return null
  }

  return (
    <div
      id="events-updates-section"
      className="flex justify-center px-4 md:px-16 lg:px-[244px] py-12 md:py-24 w-full"
      style={{
        background: 'linear-gradient(98deg, #18181B 0.26%, #0B0B60 100.18%)',
      }}
    >
      <Wrapper className="flex flex-col gap-12 w-full">
        {/* Section Title */}
        <div className="flex gap-8 items-end relative shrink-0 w-full">
          <h2 className="font-manrope font-extrabold leading-[110%] relative shrink-0 text-white text-[48px] tracking-[-0.96px] w-full max-w-[709px]">
            {sectionData.title}
          </h2>
        </div>

        {/* Events Grid - 2 events side by side */}
        <div className="flex flex-col gap-8 items-start relative shrink-0 w-full">
          <div className="flex flex-col md:flex-row gap-8 items-center relative shrink-0 w-full">
            {sectionData.events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>
        </div>
      </Wrapper>
    </div>
  )
}

export default UpcomingEventsSection
