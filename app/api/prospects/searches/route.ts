import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CustomPlaceResult } from '@/src/store/useProspectStore'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('prospect_searches')
    .select(`
      id,
      search_query,
      search_location,
      search_radius,
      created_at,
      prospect_results!prospect_results_search_id_fkey (
        business_name,
        place_id,
        formatted_address,
        rating,
        total_ratings,
        formatted_phone_number,
        website,
        location
      )
    `)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Search fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

export async function POST(req: Request) {
  const { searchQuery, searchLocation, searchRadius, results } = await req.json()
  
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // First create the search record
    const { data: search, error: searchError } = await supabase
      .from('prospect_searches')
      .insert({
        user_id: session.user.id,
        search_query: searchQuery,
        search_location: searchLocation,
        search_radius: searchRadius
      })
      .select()
      .single()

    if (searchError) throw searchError

    // Then create the results with the search_id
    const { error: resultsError } = await supabase
      .from('prospect_results')
      .insert(
        results.map((result: any) => ({
          search_id: search.id,
          business_name: result.name,
          place_id: result.place_id,
          formatted_address: result.formatted_address,
          rating: result.rating,
          total_ratings: result.user_ratings_total,
          formatted_phone_number: result.formatted_phone_number,
          website: result.website,
          location: result.location
        }))
      )

    if (resultsError) throw resultsError
    return NextResponse.json(search)
  } catch (error: any) {
    console.error('Error saving search:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 