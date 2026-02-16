import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method === 'POST') {
    try {
      const { email } = req.body
      const response = await fetch(
        'https://script.google.com/a/macros/carestack.com/s/AKfycbxA63dkm1kfBlfARXWyxsvf2qILj-RkeRiRF8HwRUnJrOBv9Q_MakNx4wlfe31V131u/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: 'John Doe', email }),
        },
      )
      if (response.ok) {
        const data = await response.json()
        res.status(200).json({ message: 'Success' })
      } else {
        const errorData = await response.text()
        res.status(response.status).json({ message: 'Error' })
      }
    } catch (error) {
      console.error('Error calling Google Apps Script API:', error)
      res.status(500).json({ message: 'Error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
