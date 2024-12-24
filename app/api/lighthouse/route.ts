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
      signal: AbortSignal.timeout(58000)
    });

    if (!response.ok) {
      console.error('PageSpeed API error:', response.status);
      return NextResponse.json(
        { error: 'PageSpeed API request failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Validate and transform the data
    const result = {
      performance: {
        score: data.lighthouseResult?.categories?.performance?.score * 100 || 0,
        firstContentfulPaint: data.lighthouseResult?.audits?.['first-contentful-paint']?.numericValue || 0,
        speedScore: data.lighthouseResult?.categories?.performance?.score * 100 || 0,
        loadTime: data.lighthouseResult?.audits?.['total-blocking-time']?.numericValue || 0
      },
      accessibility: {
        score: data.lighthouseResult?.categories?.accessibility?.score * 100 || 0,
        issues: data.lighthouseResult?.audits?.accessibility?.details?.items || []
      },
      seo: {
        score: data.lighthouseResult?.categories?.seo?.score * 100 || 0
      }
    };

    return NextResponse.json(result);
    
  } catch (error) {
    console.error('PageSpeed analysis failed:', error);
    return NextResponse.json(
      { 
        error: 'Analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 