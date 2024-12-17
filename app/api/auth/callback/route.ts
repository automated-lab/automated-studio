import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/libs/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL('/signin', requestUrl.origin));
  }

  const supabase = createClient();
  
  // Exchange the code for a session
  const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
  
  if (sessionError) {
    return NextResponse.redirect(new URL('/signin', requestUrl.origin));
  }

  // Check if profile needs completing
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_name')
      .eq('id', user.id)
      .single();

    if (!profile?.company_name) {
      return NextResponse.redirect(new URL('/onboarding', requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}
