import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Add type definition
type ClientProduct = {
  price: number | null
  product: {
    suggested_price: number
  }
  client: {
    id: string
    created_by: string
  }
}

async function calculateMetricsForUser(profileId: string) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1

  // Get current month's active clients
  const { data: statusCheck } = await supabase
    .from('clients')
    .select('status')
    .limit(1)

  console.log('Status check:', { statusCheck })

  // Get current month's active clients
  const { data: currentClients, error: currentError } = await supabase
    .from('clients')
    .select('id, created_at, status')
    .eq('created_by', profileId)

  console.log('All clients:', {
    currentClients,
    error: currentError
  })

  // Get last month's active clients
  const firstDayLastMonth = new Date(year, month - 2, 1)
  const { data: lastMonthClients, error: lastMonthError } = await supabase
    .from('clients')
    .select('id')
    .eq('created_by', profileId)
    .eq('status', 'active')
    .lt('created_at', firstDayLastMonth.toISOString())

  console.log('Last Month Clients Query:', {
    lastMonthClients,
    error: lastMonthError,
    firstDayLastMonth
  })

  // Calculate new and churned
  const newCustomers = currentClients?.filter(client => 
    new Date(client.created_at).getMonth() + 1 === month
  ).length || 0

  const churned = (lastMonthClients?.length || 0) - (currentClients?.length || 0)
  const churnedCustomers = churned > 0 ? churned : 0

  // Get all active client products for this user
  const { data: clientProducts, error: clientError } = await supabase
    .from('client_products')
    .select<any, ClientProduct>(`
      price,
      product:products (suggested_price),
      client:clients (id, created_by)
    `)
    .eq('is_active', true)
    .eq('client.created_by', profileId)

  const totalActiveProducts = clientProducts?.length || 0
  const totalRevenue = clientProducts?.reduce((sum, cp) => {
    return sum + (cp.price || cp.product.suggested_price || 0)
  }, 0) || 0

  console.log('Debug metrics:', {
    profileId,
    clientProductsCount: clientProducts?.length,
    totalActiveProducts,
    totalRevenue,
    currentClientsCount: currentClients?.length,
    lastMonthClientsCount: lastMonthClients?.length,
    newCustomers,
    churnedCustomers
  })

  // Insert or update metrics with proper conflict handling
  const { data: upsertResult, error: upsertError } = await supabase
    .from('revenue_metrics')
    .upsert(
      {
        profile_id: profileId,
        year,
        month,
        total_revenue: totalRevenue,
        new_customers: newCustomers,
        churned_customers: churnedCustomers,
        total_customers: currentClients?.length || 0,
        total_active_products: totalActiveProducts
      },
      {
        onConflict: 'profile_id,year,month',
        ignoreDuplicates: false
      }
    )
    .select()

  if (upsertError) {
    console.error('Failed to upsert metrics:', upsertError)
    throw upsertError
  }

  console.log('Successfully updated metrics:', upsertResult)
}

export async function GET(req: Request) {
  try {
    // Verify API key if needed
    const { searchParams } = new URL(req.url)
    const apiKey = searchParams.get('api_key')
    
    if (apiKey !== process.env.CRON_SECRET) {
      console.log('Auth failed:', { provided: apiKey, expected: process.env.CRON_SECRET })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')

    console.log('Profiles check:', { 
      profiles, 
      error: profileError,
      count: profiles?.length 
    })

    if (!profiles) {
      throw new Error('No profiles found')
    }

    // Calculate metrics for each profile
    await Promise.all(
      profiles.map(profile => calculateMetricsForUser(profile.id))
    )

    return NextResponse.json({ message: 'Metrics calculated successfully' })
  } catch (error: any) {
    console.error('Error calculating metrics:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 