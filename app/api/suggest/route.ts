import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_PROPOSAL_KEY
})

export async function POST(req: Request) {
  const { field, websiteData, existingContext } = await req.json()

  const fieldPrompts = {
    mainServices: "Based on this website analysis, what are the main services or products this business offers? List them in bullet points.",
    uniqueSellingPoints: "Based on this website analysis, what are the unique selling points or competitive advantages of this business? List them in bullet points.",
    budget: "Based on the services and industry shown in this website, suggest an appropriate budget range for digital marketing services."
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'user',
        content: `${fieldPrompts[field as keyof typeof fieldPrompts]}
        
        Website Analysis:
        Technologies: ${websiteData.technologies.join(', ')}
        SEO Score: ${websiteData.seoScore}
        Social Profiles: ${websiteData.socialProfiles.join(', ')}`
      }
    ],
    temperature: 0.7,
  })

  return NextResponse.json({ suggestion: completion.choices[0].message.content })
} 