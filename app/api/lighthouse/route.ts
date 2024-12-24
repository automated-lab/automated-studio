import { NextResponse } from 'next/server';

const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY;
const API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export async function POST(req: Request) {
  const { url } = await req.json();
  const apiUrl = `${API_URL}?url=${encodeURIComponent(url)}&key=${PAGESPEED_API_KEY}&strategy=mobile&category=performance&category=accessibility&category=seo`;
  
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Referer': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error?.message || 'API request failed');
    
    console.log('PageSpeed API response:', data);
    
    if (!data.lighthouseResult?.categories?.performance?.score) {
      throw new Error('Invalid PageSpeed API response structure');
    }

    const lighthouseResult = data.lighthouseResult;
    
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
    console.error('PageSpeed analysis failed:', error, '\nAPI URL:', apiUrl);
    return NextResponse.json({
      performance: { score: 0, firstContentfulPaint: 0, loadTime: 0, speedScore: 0 },
      accessibility: { score: 0, issues: [] },
      seo: { score: 0 }
    });
  }
} 