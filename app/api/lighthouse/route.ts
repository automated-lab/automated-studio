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
    console.log('PageSpeed API URL:', apiUrl.replace(PAGESPEED_API_KEY, 'REDACTED'));
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('PageSpeed raw response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('PageSpeed API error:', data);
      throw new Error(data.error?.message || 'API request failed');
    }
    
    const lighthouseResult = data.lighthouseResult;
    console.log('Lighthouse scores:', {
      performance: lighthouseResult?.categories?.performance?.score,
      accessibility: lighthouseResult?.categories?.accessibility?.score,
      seo: lighthouseResult?.categories?.seo?.score
    });
    
    if (!lighthouseResult?.categories?.performance?.score) {
      throw new Error('Invalid PageSpeed API response');
    }

    const result = {
      performance: {
        score: Math.round(lighthouseResult.categories.performance.score * 100),
        firstContentfulPaint: Math.round(lighthouseResult.audits['first-contentful-paint'].numericValue / 1000),
        loadTime: Math.round(lighthouseResult.audits['interactive'].numericValue / 1000),
        speedScore: Math.round(lighthouseResult.categories.performance.score * 100)
      },
      accessibility: {
        score: Math.round(lighthouseResult.categories.accessibility.score * 100),
        issues: [] as LighthouseIssue[]
      },
      seo: {
        score: Math.round(lighthouseResult.categories.seo.score * 100)
      }
    };
    
    console.log('Returning processed data:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('PageSpeed analysis failed:', error);
    return NextResponse.json({
      performance: { score: 0, firstContentfulPaint: 0, loadTime: 0, speedScore: 0 },
      accessibility: { score: 0, issues: [] },
      seo: { score: 0 }
    });
  }
} 