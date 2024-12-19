import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')

  try {
    const { data, error } = await supabase
      .from('client_products')
      .select(`
        *,
        product:products(*)
      `)
      .eq('client_id', clientId)
      .order('product(display_order)', { ascending: true })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { error } = await supabase
      .from('client_products')
      .upsert(data, { onConflict: 'client_id,product_id' })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function PATCH(request: Request) {
  const { client_id, product_id, price, is_active } = await request.json()

  try {
    const updateData: any = {}
    if (price !== undefined) updateData.price = price
    if (is_active !== undefined) updateData.is_active = is_active

    const { error } = await supabase
      .from('client_products')
      .update(updateData)
      .match({ client_id, product_id })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
} 