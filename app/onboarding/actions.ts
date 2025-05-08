"use server"

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function completeOnboarding(interests: string[] = []) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        interests: interests.length > 0 ? interests : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id)

    if (error) {
      throw error
    }

    // Revalidate the home page to ensure fresh data
    revalidatePath("/")

    return { success: true }
  } catch (error: any) {
    console.error("Error completing onboarding:", error)
    return { success: false, error: error.message || "Failed to complete onboarding" }
  }
}
