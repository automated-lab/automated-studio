import { NextResponse } from 'next/server';
import { generateProposal } from '@/services/ai/generate';

export async function POST(req: Request) {
  const { websiteData, settings, businessContext } = await req.json();

  const promptText = `Generate a business proposal based on this website analysis: ${websiteData}
  
Business Context:
- Business Name: ${businessContext.businessName}
- Industry: ${businessContext.industry}
- Target Audience: ${businessContext.targetAudience}
- Main Services: ${businessContext.mainServices}
- Unique Selling Points: ${businessContext.uniqueSellingPoints}
- Budget Range: ${businessContext.budget}

Please create a detailed proposal that incorporates both the website analysis and this business context.
${settings.customInstructions || ''}`;

  try {
    const proposal = await generateProposal({ 
      websiteData,
      settings,
      businessContext
    });
    return NextResponse.json({ proposal });
  } catch (error) {
    console.error('Generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate proposal' },
      { status: 500 }
    );
  }
} 