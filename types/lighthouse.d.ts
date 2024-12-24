declare module 'lighthouse' {
  interface LighthouseResult {
    lhr: {
      categories: {
        performance: { score: number };
        accessibility: { score: number };
        'best-practices': { score: number };
        seo: { score: number };
      };
      audits: {
        'total-blocking-time': { numericValue: number };
        'first-contentful-paint': { numericValue: number };
      };
    };
  }

  function lighthouse(
    url: string,
    opts?: {
      port: number;
      output?: string;
      logLevel?: string;
      onlyCategories?: string[];
    }
  ): Promise<LighthouseResult>;

  export default lighthouse;
} 