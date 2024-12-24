import axios from 'axios';

export interface WebsiteAnalysis {
  technologies: string[];
  seoScore: number;
  socialProfiles: string[];
  performance: {
    loadTime: number;
    firstContentfulPaint: number;
    speedScore: number;
  };
  security: {
    ssl: boolean;
    headers: string[];
    vulnerabilities: string[];
  };
  content: {
    wordCount: number;
    pageCount: number;
    lastUpdated: string;
    hasContactForm: boolean;
  };
  accessibility: {
    score: number;
    issues: string[];
  };
  analytics: {
    hasAnalytics: boolean;
    provider: string;
  };
  hosting: {
    provider: string;
    location: string;
  };
  seo: {
    score: number;
  };
}

export async function analyzeWebsite(url: string) {
  try {
    // Basic analysis
    const response = await axios.get(url);
    const html = response.data;
    
    return {
      technologies: detectTechnologies(html),
      seoScore: 0, // Will be updated by Lighthouse
      socialProfiles: findSocialLinks(html),
      security: {
        ssl: url.startsWith('https'),
        headers: detectSecurityHeaders(response.headers),
      },
      content: {
        ...extractMetadata(html),
        pageCount: estimatePageCount(html),
        wordCount: countWords(html),
      },
      accessibility: {
        score: estimateAccessibilityScore(html),
      },
      analytics: detectAnalytics(html),
      hosting: detectHosting(response.headers),
    };
  } catch (error) {
    console.error('Website analysis failed:', error);
    throw new Error('Failed to analyze website');
  }
}

function detectTechnologies(html: string): string[] {
  const technologies = [];
  
  // Webflow detection
  if (html.includes('webflow.com') || html.includes('wf-') || html.includes('w-webflow')) {
    technologies.push('Webflow');
  }
  
  // Other technologies
  if (html.includes('react')) technologies.push('React');
  if (html.includes('vue')) technologies.push('Vue');
  if (html.includes('angular')) technologies.push('Angular');
  if (html.includes('wordpress')) technologies.push('WordPress');
  if (html.includes('bootstrap')) technologies.push('Bootstrap');
  if (html.includes('tailwind')) technologies.push('Tailwind');
  
  // Check meta tags and generator
  const generator = html.match(/<meta\s+name="generator"\s+content="([^"]+)"/i);
  if (generator) {
    technologies.push(generator[1]);
  }
  
  return Array.from(new Set(technologies));
}

function findSocialLinks(html: string): string[] {
  const socials = [];
  
  if (html.includes('facebook.com')) socials.push('Facebook');
  if (html.includes('twitter.com')) socials.push('Twitter');
  if (html.includes('instagram.com')) socials.push('Instagram');
  if (html.includes('linkedin.com')) socials.push('LinkedIn');
  
  return socials;
}

function extractMetadata(html: string) {
  return {
    title: html.match(/<title>(.*?)<\/title>/)?.[1] || '',
    description: html.match(/<meta name="description" content="(.*?)"/)?.[1] || '',
  };
}

function detectSecurityHeaders(headers: any): string[] {
  const securityHeaders = [];
  
  if (headers['strict-transport-security']) securityHeaders.push('HSTS');
  if (headers['content-security-policy']) securityHeaders.push('CSP');
  if (headers['x-frame-options']) securityHeaders.push('X-Frame-Options');
  if (headers['x-xss-protection']) securityHeaders.push('XSS Protection');
  if (headers['x-content-type-options']) securityHeaders.push('No Sniff');
  
  return securityHeaders;
}

function estimatePageCount(html: string): number {
  const links = html.match(/<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["']/g) || [];
  const internalLinks = links.filter(link => 
    !link.includes('http') || link.includes('localhost') || link.includes('havesomelemonde.com')
  );
  return Math.max(1, Math.ceil(internalLinks.length / 3)); // Rough estimate
}

function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').length;
}

function estimateAccessibilityScore(html: string): number {
  let score = 100;
  
  // Basic accessibility checks
  if (!html.includes('alt=')) score -= 20; // Missing image alts
  if (!html.includes('aria-')) score -= 20; // No ARIA attributes
  if (!html.includes('<label')) score -= 20; // Missing form labels
  if (!html.includes('role=')) score -= 20; // No ARIA roles
  
  return Math.max(0, score);
}

function detectAnalytics(html: string): { hasAnalytics: boolean; provider: string } {
  if (html.includes('google-analytics.com')) {
    return { hasAnalytics: true, provider: 'Google Analytics' };
  }
  if (html.includes('analytics.js')) {
    return { hasAnalytics: true, provider: 'Unknown Analytics' };
  }
  return { hasAnalytics: false, provider: 'None' };
}

function detectHosting(headers: any): { provider: string; location: string } {
  // Common hosting provider detection via headers
  if (headers['server']?.includes('Vercel')) {
    return { provider: 'Vercel', location: 'Global Edge' };
  }
  if (headers['server']?.includes('Netlify')) {
    return { provider: 'Netlify', location: 'Global Edge' };
  }
  if (headers['x-powered-by']?.includes('Heroku')) {
    return { provider: 'Heroku', location: 'US' };
  }
  if (headers['x-powered-by']?.includes('PHP')) {
    return { provider: 'Shared Hosting', location: 'Unknown' };
  }
  
  return { provider: 'Unknown', location: 'Unknown' };
} 