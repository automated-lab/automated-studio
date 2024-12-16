import { getSnippets } from "@/libs/airtable"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const snippets = await getSnippets()
    return NextResponse.json(snippets)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 }
    )
  }
}
