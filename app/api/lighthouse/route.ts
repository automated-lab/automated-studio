import { NextResponse } from 'next/server';

const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY;
const API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export async function POST(req: Request) {
  const { url } = await req.json();
  const apiUrl = `${API_URL}?url=${encodeURIComponent(url)}&key=${PAGESPEED_API_KEY}&strategy=mobile&category=performance&category=accessibility&category=seo`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error('PageSpeed API error:', data);
      throw new Error(data.error?.message || 'API request failed');
    }
    
    const lighthouseResult = data.lighthouseResult;
    
    if (!lighthouseResult?.categories?.performance?.score) {
      throw new Error('Invalid PageSpeed API response');
    }

    return NextResponse.json({
      performance: {
        score: Math.round(lighthouseResult.categories.performance.score * 100),
        firstContentfulPaint: Math.round(lighthouseResult.audits['first-contentful-paint'].numericValue / 1000),
        loadTime: Math.round(lighthouseResult.audits['interactive'].numericValue / 1000),
        speedScore: Math.round(lighthouseResult.categories.performance.score * 100)
      },
      accessibility: {
        score: Math.round(lighthouseResult.categories.accessibility.score * 100),
        issues: []
      },
      seo: {
        score: Math.round(lighthouseResult.categories.seo.score * 100)
      }
    });
  } catch (error) {
    console.error('PageSpeed analysis failed:', error);
    // Return zeros instead of throwing
    return NextResponse.json({
      performance: { score: 0, firstContentfulPaint: 0, loadTime: 0, speedScore: 0 },
      accessibility: { score: 0, issues: [] },
      seo: { score: 0 }
    });
  }
} 