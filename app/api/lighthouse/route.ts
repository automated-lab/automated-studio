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
  
  try {
    console.log(`Starting PageSpeed analysis for URL: ${url}`);
    const response = await fetch(apiUrl, {
      headers: {
        'Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      },
      // Match Vercel's function timeout
      signal: AbortSignal.timeout(58000) // 58 seconds to give some buffer
    });

    if (!response.ok) {
      console.error('PageSpeed API error:', response.status);
      return NextResponse.json(
        { error: 'PageSpeed API failed to respond' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('PageSpeed analysis failed:', error);
    return NextResponse.json(
      { error: 'Analysis timed out or failed' },
      { status: 504 }
    );
  }
} 