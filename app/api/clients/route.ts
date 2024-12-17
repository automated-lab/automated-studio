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
    const json = await request.json()

    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clientData = {
      ...json,
      created_by: session.user.id
    }

    const { data: client, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error in POST:', error)
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
} 