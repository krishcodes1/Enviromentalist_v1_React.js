import { createClient } from "@/lib/supabase/server"

export async function checkOnboardingStatus(userId: string) {
  const supabase = createClient()

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", userId)
      .single()

    if (error) {
      throw error
    }

    return {
      completed: profile?.onboarding_completed === true,
      profile,
    }
  } catch (error) {
    console.error("Error checking onboarding status:", error)
    return { completed: false, error }
  }
}
