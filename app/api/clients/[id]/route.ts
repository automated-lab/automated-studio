import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Verify authentication first
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', params.id)
      .eq('created_by', session.user.id) // Only fetch client if owned by user
      .single()

    if (error) throw error
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error in GET:', error)
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const json = await request.json()

    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: client, error } = await supabase
      .from('clients')
      .update(json)
      .eq('id', params.id)
      .eq('created_by', session.user.id)
      .select()
      .single()

    if (error) throw error
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error in PATCH:', error)
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', params.id)
      .eq('created_by', session.user.id)

    if (error) throw error

    return NextResponse.json({ message: 'Client deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE:', error)
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 })
  }
} 