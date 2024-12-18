import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    console.log('Creating product:', data)
    
    const { error } = await supabase
      .from('products')
      .insert([{
        name: data.name,
        description: data.description,
        suggested_price: data.suggested_price,
        features: data.features,
        is_active: data.is_active
      }])

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
} 