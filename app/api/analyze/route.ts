export const runtime = 'nodejs'

import { NextResponse } from 'next/server';
import { analyzeWebsite } from '@/services/analysis/website';
import fetch from 'node-fetch';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' }, 
        { status: 400 }
      );
    }

    // Add error handling for the URL
    const techData = await analyzeWebsite(url).catch(error => {
      console.error('Website analysis failed:', error);
      return {
        technologies: [],
        seoScore: 0,
        socialProfiles: [],
        security: { ssl: false },
        analytics: { hasAnalytics: false, provider: 'None' }
      };
    });
    
    // Get performance data from PageSpeed API with error handling
    const pagespeedResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/lighthouse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    }).catch(() => null);
    
    const lighthouseData = pagespeedResponse ? await pagespeedResponse.json() : {
      performance: { score: 0 },
      accessibility: { score: 0 },
      seo: { score: 0 }
    };
    
    return NextResponse.json({
      ...techData,
      performance: lighthouseData.performance,
      accessibility: lighthouseData.accessibility,
      seo: lighthouseData.seo
    });

  } catch (error) {
    console.error('Analysis failed:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website' }, 
      { status: 500 }
    );
  }
} 