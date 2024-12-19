import { getAutomationById } from "@/libs/airtable"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const automation = await getAutomationById(params.id)
    if (!automation) {
      return NextResponse.json(
        { error: "Automation not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(automation)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch automation" },
      { status: 500 }
    )
  }
} 