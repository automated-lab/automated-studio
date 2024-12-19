import { NextResponse } from 'next/server'
import { createClient } from '@/libs/supabase/server'
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data } = await supabase
    .from('snippets')
    .select('*')
    .eq('id', params.id)
    .single()

  return NextResponse.json(data)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const body = await request.json()
  
  const { data } = await supabase
    .from('snippets')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()

  return NextResponse.json(data)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data } = await supabase
    .from('snippets')
    .delete()
    .eq('id', params.id)

  return NextResponse.json(data)
}
