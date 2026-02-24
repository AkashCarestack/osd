/**
 * Script to seed dummy event data into Sanity CMS
 * Run with: npx ts-node scripts/seedEvents.ts
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2022-11-28',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || '', // You'll need to add this to your .env
})

const dummyEvents = [
  {
    _type: 'event',
    title: 'DEO Treatment Closing Academy',
    eventType: 'Offline',
    location: 'Dallas, TX',
    date: '2026-02-26',
    description: 'This update brings enhanced features and improved performance for a smoother experience.',
    link: 'https://example.com/event1',
    language: 'en',
  },
  {
    _type: 'event',
    title: 'Women in DSO, Empower & Grow Conference',
    eventType: 'Offline',
    location: 'Dallas, TX',
    date: '2026-02-26',
    link: 'https://example.com/event2',
    language: 'en',
  },
  {
    _type: 'event',
    title: 'DEO Treatment Closing Academy',
    eventType: 'Offline',
    location: 'Dallas, TX',
    date: '2026-02-26',
    link: 'https://example.com/event3',
    language: 'en',
  },
  {
    _type: 'event',
    title: 'Women in DSO, Empower & Grow Conference',
    eventType: 'Offline',
    location: 'Dallas, TX',
    date: '2026-02-26',
    link: 'https://example.com/event4',
    language: 'en',
  },
  {
    _type: 'event',
    title: 'DEO Treatment Closing Academy',
    eventType: 'Offline',
    location: 'Dallas, TX',
    date: '2026-02-26',
    link: 'https://example.com/event5',
    language: 'en',
  },
]

async function seedEvents() {
  try {
    console.log('Starting to seed events...')
    
    // Check if events already exist
    const existingEvents = await client.fetch('*[_type == "event"]')
    
    if (existingEvents.length > 0) {
      console.log(`Found ${existingEvents.length} existing events. Skipping seed.`)
      console.log('To re-seed, delete existing events first.')
      return
    }

    // Create events
    const createdEvents = []
    for (const event of dummyEvents) {
      const created = await client.create(event)
      createdEvents.push(created)
      console.log(`Created event: ${event.title}`)
    }

    console.log(`\n✅ Successfully created ${createdEvents.length} events!`)
    console.log('\nNext steps:')
    console.log('1. Go to http://localhost:3000/studio/structure/contentRepo')
    console.log('2. Click on "Events" to see your events')
    console.log('3. Go to Home Settings and add events to the Upcoming Events Section')
  } catch (error) {
    console.error('Error seeding events:', error)
    process.exit(1)
  }
}

seedEvents()
