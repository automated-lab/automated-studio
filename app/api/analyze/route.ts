export const runtime = 'nodejs'

import { NextResponse } from 'next/server';
import { analyzeWebsite } from '@/services/analysis/website';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' }, 
        { status: 400 }
      );
    }

    // Get basic analysis
    const techData = await analyzeWebsite(url);
    
    // Get performance data from PageSpeed API
    const pagespeedResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lighthouse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    const lighthouseData = await pagespeedResponse.json();
    
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