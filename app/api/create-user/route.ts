import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // Create auth user first
    const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: crypto.randomUUID(),
      email_confirm: true
    })

    if (authError) throw authError

    // Wait a moment for trigger to create profile
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update the auto-created profile instead of inserting
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        email: data.email,
        primary_contact_name: data.primary_contact_name,
        company_name: data.company_name || null,
        is_admin: data.is_admin,
        company_size: data.company_size || null,
        industry_type: data.industry_type || null,
        phone: data.phone || null,
      })
      .eq('id', user.id)

    if (profileError) throw profileError

    return NextResponse.json({ user })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
} 