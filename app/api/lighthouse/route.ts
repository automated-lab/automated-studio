import { NextResponse } from 'next/server';

const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY;
const API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

interface LighthouseIssue {
  id?: string;
  description?: string;
}

export async function POST(req: Request) {
  const { url } = await req.json();
  const apiUrl = `${API_URL}?url=${encodeURIComponent(url)}&key=${PAGESPEED_API_KEY}&strategy=mobile&category=performance&category=accessibility&category=seo`;
  
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      console.log(`Attempt ${attempt + 1} of ${maxRetries}...`);
      const response = await fetch(apiUrl, {
        headers: {
          'Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        },
        signal: AbortSignal.timeout(30000)
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
      
      console.error(`Attempt ${attempt + 1} failed:`, response.status);
      attempt++;
      
      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts`);
      }
      
      // Wait 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`Error on attempt ${attempt + 1}:`, error);
      attempt++;
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
} 