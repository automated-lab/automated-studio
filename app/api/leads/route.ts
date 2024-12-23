import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  const data = await req.json()
  
  try {
    // Start a transaction
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        business_name: data.business_name,
        source: data.source,
        place_id: data.place_id,
        address: data.address,
        website: data.website,
        phone: data.phone,
        status: data.status,
        created_by: session.user.id
      })
      .select()
      .single()

    if (leadError) throw leadError

    // Add product interests
    const productInterests = Object.entries(data.productInterests).map(
      ([productId, interest]) => ({
        lead_id: lead.id,
        product_id: productId,
        interest_level: interest
      })
    )

    const { error: interestsError } = await supabase
      .from('lead_product_interests')
      .insert(productInterests)

    if (interestsError) throw interestsError

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
} 