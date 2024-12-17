import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Client } from '@/types/database'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('created_by', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error in GET:', error)
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the authenticated user's ID
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const data = await request.json()

    // Clean up date fields and add created_by
    const cleanedData = {
      ...data,
      created_by: user.id,
      next_review_date: data.next_review_date || null,
      last_contact_date: data.last_contact_date || null,
      ghl_activated_at: data.ghl_activated_at || null,
      onboarding_completed_at: data.onboarding_completed_at || null
    }

    const { data: client, error } = await supabase
      .from('clients')
      .insert([cleanedData])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error in POST:', error)
    return NextResponse.json({ error }, { status: 500 })
  }
} 