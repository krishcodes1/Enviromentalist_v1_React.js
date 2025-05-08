import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { type NextRequest, NextResponse } from "next/server"

export const createClient = (request: NextRequest) => {
  const res = NextResponse.next()
  return {
    supabase: createMiddlewareClient({ req: request, res }),
    response: res,
  }
}
