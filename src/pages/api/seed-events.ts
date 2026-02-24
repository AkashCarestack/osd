import { NextApiRequest, NextApiResponse } from 'next'

import { sanityClient } from '~/lib/sanity'

// Dummy data - 2 events with "#" links
const dummyEvents = [
  {
    _type: 'event',
    title: 'DEO Treatment Closing Academy',
    eventType: 'Offline',
    location: 'Dallas, TX',
    date: '2026-02-26',
    description: 'This update brings enhanced features and improved performance for a smoother experience.',
    link: '#',
    language: 'en',
  },
  {
    _type: 'event',
    title: 'Women in DSO, Empower & Grow Conference',
    eventType: 'Offline',
    location: 'Dallas, TX',
    date: '2026-02-26',
    description: 'Join us for an empowering conference focused on growth and leadership in the DSO industry.',
    link: '#',
    language: 'en',
  },
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Check if events already exist
    const existingEvents = await sanityClient.fetch('*[_type == "event"]')
    
    if (existingEvents.length > 0) {
      return res.status(200).json({
        message: `Found ${existingEvents.length} existing events. Skipping seed.`,
        existingEvents: existingEvents.length,
      })
    }

    // Create events
    const createdEvents = []
    for (const event of dummyEvents) {
      const created = await sanityClient.create(event)
      createdEvents.push(created)
    }

    return res.status(200).json({
      message: `Successfully created ${createdEvents.length} events!`,
      events: createdEvents,
    })
  } catch (error: any) {
    console.error('Error seeding events:', error)
    return res.status(500).json({
      message: 'Error seeding events',
      error: error.message,
    })
  }
}
