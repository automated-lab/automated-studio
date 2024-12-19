import { getDocuments } from "@/libs/airtable"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const documents = await getDocuments()
    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error in documents API:', error)
    return new NextResponse('Error fetching documents', { status: 500 })
  }
} 