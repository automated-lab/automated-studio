export const dynamic = 'force-dynamic'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminPortal from "@/components/admin/AdminPortal"


export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/')
  }

  // Fetch users data
  const { data: users } = await supabase
    .from('profiles')
    .select('*')

  // Add products fetch
  const { data: products } = await supabase
    .from('products')
    .select('*')

  return <AdminPortal users={users || []} products={products || []} />
}