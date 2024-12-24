export const runtime = 'nodejs'

import { NextResponse } from 'next/server';
import { analyzeWebsite } from '@/services/analysis/website';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
      const techData = await analyzeWebsite(url);
      return NextResponse.json(techData);
    } catch (analysisError) {
      console.error('Analysis failed:', analysisError);
      // Return a fallback response instead of error
      return NextResponse.json({
        technologies: [],
        seoScore: 0,
        socialProfiles: [],
        security: { ssl: url.startsWith('https://') },
        analytics: { hasAnalytics: false, provider: 'None' },
        performance: { score: 0 },
        accessibility: { score: 0 },
        seo: { score: 0 }
      });
    }
  } catch (error) {
    console.error('Request failed:', error);
    return NextResponse.json({ error: 'Failed to analyze website' }, { status: 500 });
  }
} 