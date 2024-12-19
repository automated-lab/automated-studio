export const dynamic = 'force-dynamic'

import { headers } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import DashboardLayoutClient from '../../components/dashboard/DashboardLayoutClient'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import config from '@/config'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect(config.auth.loginUrl)
  }

  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>
} 