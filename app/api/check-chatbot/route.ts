export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    
    if (!url) {
      return new Response('URL required', { status: 400 })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ChatbotDetector/1.0)',
          'Accept': 'text/html',
        }
      })

      clearTimeout(timeout)
      const html = await response.text()
      
      // More specific signatures
      const chatbotSignatures = {
        intercom: ['intercomcdn', 'intercom-container'],
        drift: ['drift.com', 'drift-widget'],
        zendesk: ['zdassets.com', 'zopim'],
        tawk: ['tawk.to', 'embed.tawk.to'],
        crisp: ['crisp.chat', 'crisp-client'],
        freshchat: ['wchat.freshchat.com'],
        hubspot: ['hubspot-messages-iframe'],
        messenger: ['messenger-checkbox', 'fb-messenger'],
      }
      
      // Check for specific matches and log what we find
      const found = []
      for (const [provider, signatures] of Object.entries(chatbotSignatures)) {
        if (signatures.some(sig => html.toLowerCase().includes(sig))) {
          found.push(provider)
        }
      }
      
      return Response.json({ 
        hasChatbot: found.length > 0,
        detected: found,
        status: 'success'
      })

    } catch (fetchError) {
      clearTimeout(timeout)
      return Response.json({ 
        hasChatbot: null,
        status: 'error',
        error: fetchError.message
      })
    }

  } catch (error) {
    return Response.json({ 
      hasChatbot: null,
      status: 'error',
      error: error.message
    })
  }
}
