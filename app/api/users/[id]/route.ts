import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Delete profile first
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', params.id)

    if (profileError) throw profileError

    // Then delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(
      params.id
    )

    if (authError) throw authError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 })
  }
} 