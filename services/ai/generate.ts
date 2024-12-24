import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_PROPOSAL_KEY,
});

export interface ProposalGenerationParams {
  websiteData: {
    technologies: string[];
    seoScore: number;
    socialProfiles: string[];
  };
  settings: any;
  businessContext: {
    businessName: string;
    industry: string;
    targetAudience: string;
    mainServices: string;
    uniqueSellingPoints: string;
    budget: string;
  };
}

export async function generateProposal({ websiteData, settings, businessContext }: ProposalGenerationParams) {
  const prompt = `Generate a business proposal based on this website analysis:
    Technologies: ${websiteData.technologies.join(', ')}
    SEO Score: ${websiteData.seoScore}
    Social Profiles: ${websiteData.socialProfiles.join(', ')}
    
    Use a ${settings.tone} tone.
    Focus on improving their online presence and automation.`;

  const completion = await openai.chat.completions.create({
    model: settings.model === 'gpt-4' ? 'gpt-4-turbo-preview' : 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: settings.creativity / 100,
    max_tokens: settings.maxTokens,
  });

  return completion.choices[0].message.content;
} 