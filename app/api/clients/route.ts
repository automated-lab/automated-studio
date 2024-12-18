import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Client } from '@/types/database'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert([{ ...data, created_by: session.user.id }])
      .select()
      .single()

    if (clientError) throw clientError

    // Get all available products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')

    if (productsError) throw productsError

    // Create inactive client_products entries for each product
    const clientProducts = products.map(product => ({
      client_id: client.id,
      product_id: product.id,
      is_active: false
    }))

    const { error: relationError } = await supabase
      .from('client_products')
      .insert(clientProducts)

    if (relationError) throw relationError

    return NextResponse.json(client)
  } catch (error: any) {
    console.error('Error creating client:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  
  console.log('Attempting to delete client:', id)
  
  try {
    // Use route handler client for auth check
    const routeHandler = createRouteHandlerClient({ cookies })
    const { data: { session }, error: authError } = await routeHandler.auth.getSession()
    
    if (authError || !session) {
      console.log('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use service role client for deletion
    console.log('Deleting client_products...')
    const { error: productsError } = await supabase  // Using the service role client
      .from('client_products')
      .delete()
      .eq('client_id', id)

    if (productsError) {
      console.error('Error deleting client_products:', productsError)
      throw productsError
    }

    console.log('Deleting client...')
    const { data, error } = await supabase  // Using the service role client
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('created_by', session.user.id)
      .select()

    if (error) {
      console.error('Error deleting client:', error)
      throw error
    }
    
    console.log('Delete result:', data)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
} 