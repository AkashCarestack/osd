import type { NextApiRequest, NextApiResponse } from 'next';
import { parseUrlForTracking } from '~/utils/urlParser';

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
      const sidebarTitle = req.query.sidebar_title as string;


      if (!email || !pageUrl) {
        res.status(400).json({ err: 'Missing email or page_url in query params' });
        return;
      }
            const isPlaybookDownload = sidebarTitle && sidebarTitle.toLowerCase().includes('download this resource for free');
      let responseData: any = {};

      if (isPlaybookDownload) {
        // For playbook downloads - only fetch playbook_downloads
        const response = await fetch(
          `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email&properties=playbook_downloads`, 
          requestOptionsGET
        );
        const data = await response.json();
        
        const playbook_downloads = data.properties?.playbook_downloads || '';
        
        var raw = JSON.stringify({
          "properties": {
            "playbook_downloads": playbook_downloads ? `${playbook_downloads}, ${pageUrl}` : pageUrl
          }
        });
        
        // Add download info
        if (videoLink) {
          responseData.downloadInfo = {
            shouldDownload: true,
            pdfUrl: videoLink,
            filename: `playbook-${Date.now()}.pdf`
          };
        }
      } else {
        // For regular forms - fetch video_watched
        const response = await fetch(
          `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email&properties=video_watched`,
          requestOptionsGET
        );
        const data = await response.json();
        
        const newVideoEntry = parseUrlForTracking(pageUrl);
        var raw = JSON.stringify({
          "properties": {
            "video_watched": newVideoEntry
          }
        });
      }

      const requestOptionsPOST: RequestInit = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      // Update contact with new video_watched value
      const response2 = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`,
        requestOptionsPOST
      );

      const finalData = await response2.json();
      
      // Include download info in response if available
      const finalResponse = { finalData, ...responseData };
      
      res.status(200).json(finalResponse);
    } catch (err) {
      res.status(500).json({ err });
    }
  }
}
