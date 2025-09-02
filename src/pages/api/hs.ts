import type { NextApiRequest, NextApiResponse } from 'next';

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN as string;

const myHeaders = new Headers();
myHeaders.append('Authorization', `Bearer ${HUBSPOT_ACCESS_TOKEN}`);
myHeaders.append('Content-Type', 'application/json');

const requestOptionsGET: RequestInit = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow',
};

interface HubSpotContact {
  id: string;
  properties: {
    video_watched?: string;
    [key: string]: any;
  };
}

interface ErrorResponse {
  err: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ finalData?: any; err?: any }>
) {
  if (req.method === 'POST') {
    // Process a POST request if needed
    res.status(405).json({ err: 'POST method not implemented' });
    return;
  } else {
    try {
      const email = req.query.email as string;
      const pageUrl = req.query.page_url as string;
      const videoLink = req.query.video_link as string;

      if (!email || !pageUrl) {
        res.status(400).json({ err: 'Missing email or page_url in query params' });
        return;
      }
      // Fetch contact data by email
      const response = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email&properties=video_watched`,
        requestOptionsGET
      );
      const data: HubSpotContact = await response.json();

      const video_watched = data.properties?.video_watched || '';

      // Determine what to add to video_watched property
      const newVideoEntry = videoLink || pageUrl;
      
      const raw = JSON.stringify({
        properties: {
          video_watched: video_watched
            ? `${video_watched}, ${newVideoEntry}`
            : newVideoEntry,
        },
      });

      const requestOptionsPOST: RequestInit = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      // Update contact with new video_watched value
      const response2 = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${data.id}`,
        requestOptionsPOST
      );

      const finalData = await response2.json();
      res.status(200).json({ finalData });
    } catch (err) {
      res.status(500).json({ err });
    }
  }
}
