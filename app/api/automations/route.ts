import { getAutomations } from "@/libs/airtable"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const automations = await getAutomations()
    return NextResponse.json(automations)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch automations" },
      { status: 500 }
    )
  }
} 