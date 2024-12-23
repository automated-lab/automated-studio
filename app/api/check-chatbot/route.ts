export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    
    if (!url) {
      return new Response('URL required', { status: 400 })
    }

    // Add timeout and error handling
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000) // 5s timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ChatbotDetector/1.0)',
          'Accept': 'text/html',
        }
      })

      clearTimeout(timeout)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const html = await response.text()
      
      // More comprehensive detection
      const chatbotSignatures = [
        'intercom',
        'drift',
        'zendesk',
        'livechat',
        'tawk.to',
        'crisp',
        'freshchat',
        'hubspot',
        'messenger',
        'chatbot',
        'live-chat',
        'live_chat'
      ]
      
      const hasChatbot = chatbotSignatures.some(signature => 
        html.toLowerCase().includes(signature)
      )
      
      return Response.json({ 
        hasChatbot,
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
