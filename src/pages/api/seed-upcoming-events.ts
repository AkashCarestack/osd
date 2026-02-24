import { createClient } from '@sanity/client'
import { NextApiRequest, NextApiResponse } from 'next'

// Create a client with write permissions
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2022-11-28',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN || '',
})

// Dummy data for upcomingEventsSection - 2 events
const dummyUpcomingEventsData = {
  title: 'Upcoming Events',
  events: [
    {
      _type: 'eventObject',
      title: 'DEO Treatment Closing Academy',
      eventType: 'Offline',
      location: 'Dallas, TX',
      date: '2026-02-26',
      link: '#',
    },
    {
      _type: 'eventObject',
      title: 'Women in DSO, Empower & Grow Conference',
      eventType: 'Offline',
      location: 'Dallas, TX',
      date: '2026-02-26',
      link: '#',
    },
  ],
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Find the homeSettings document
    const homeSettings = await writeClient.fetch(
      '*[_type == "homeSettings" && language == "en"][0]',
    )

    if (!homeSettings) {
      return res.status(404).json({
        message: 'Home Settings document not found. Please create one first in Sanity Studio.',
      })
    }

    // Update the homeSettings document with upcomingEventsSection
    const updated = await writeClient
      .patch(homeSettings._id)
      .set({
        upcomingEventsSection: dummyUpcomingEventsData,
      })
      .commit()

    return res.status(200).json({
      message: 'Successfully added dummy events to Home Settings!',
      data: updated.upcomingEventsSection,
    })
  } catch (error: any) {
    console.error('Error seeding upcoming events:', error)
    return res.status(500).json({
      message: 'Error seeding upcoming events',
      error: error.message,
    })
  }
}
