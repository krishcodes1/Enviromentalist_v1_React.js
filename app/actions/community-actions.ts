"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createCommunity(formData: FormData) {
  try {
    const supabase = createClient()

    // Get the session to verify the user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { error: "You must be logged in to create a community" }
    }

    // Extract form data
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const isPrivate = formData.get("isPrivate") === "true"
    const imageUrl = formData.get("imageUrl") as string

    // Validate inputs
    if (!name || name.trim().length < 3) {
      return { error: "Community name must be at least 3 characters long" }
    }

    if (!description || description.trim().length < 10) {
      return { error: "Description must be at least 10 characters long" }
    }

    if (!category) {
      return { error: "Please select a category" }
    }

    // Check if a community with this name already exists
    const { data: existingCommunity } = await supabase.from("communities").select("id").eq("name", name).maybeSingle()

    if (existingCommunity) {
      return { error: "A community with this name already exists" }
    }

    // Try to use the stored procedure first
    try {
      const { data: result, error: rpcError } = await supabase.rpc("create_community_with_member", {
        p_name: name,
        p_description: description,
        p_creator_id: session.user.id,
        p_category: category,
        p_image_url: imageUrl || null,
        p_is_private: isPrivate,
      })

      if (!rpcError && result) {
        revalidatePath("/community")
        return { success: true, communityId: result.id }
      }
    } catch (rpcError) {
      console.error("RPC error:", rpcError)
      // Continue to fallback method
    }

    // Fallback: Check the columns in the communities table
    const { data: columns } = await supabase.rpc("get_table_columns", { table_name: "communities" })

    // If we don't have the RPC function, create a simplified version
    let privacyColumnName = "private" // Default column name

    // If we have columns data, determine which column to use
    if (columns && Array.isArray(columns)) {
      const hasIsPrivate = columns.some((col) => col.column_name === "is_private")
      const hasPrivate = columns.some((col) => col.column_name === "private")

      if (hasIsPrivate) {
        privacyColumnName = "is_private"
      } else if (hasPrivate) {
        privacyColumnName = "private"
      }
    }

    // Create community record - dynamically set the privacy column
    const insertData: Record<string, any> = {
      name,
      description,
      creator_id: session.user.id,
      category,
      image_url: imageUrl || null,
    }

    // Add the privacy setting using the determined column name
    insertData[privacyColumnName] = isPrivate

    const { data: community, error: insertError } = await supabase
      .from("communities")
      .insert(insertData)
      .select("id")
      .single()

    if (insertError) {
      // Try again with a simplified approach
      const { data: simpleCommunity, error: simpleError } = await supabase
        .from("communities")
        .insert({
          name,
          description,
          creator_id: session.user.id,
          category,
          image_url: imageUrl || null,
          // No privacy field - rely on default
        })
        .select("id")
        .single()

      if (simpleError) {
        return { error: `Failed to create community: ${simpleError.message}` }
      }

      // Add creator as an admin
      const { error: memberError } = await supabase.from("community_members").insert({
        community_id: simpleCommunity.id,
        user_id: session.user.id,
        role: "admin",
      })

      if (memberError) {
        return { error: `Failed to add you as an admin: ${memberError.message}` }
      }

      revalidatePath("/community")
      return { success: true, communityId: simpleCommunity.id }
    }

    // Add creator as an admin
    const { error: memberError } = await supabase.from("community_members").insert({
      community_id: community.id,
      user_id: session.user.id,
      role: "admin",
    })

    if (memberError) {
      return { error: `Failed to add you as an admin: ${memberError.message}` }
    }

    revalidatePath("/community")
    return { success: true, communityId: community.id }
  } catch (error: any) {
    console.error("Error creating community:", error)
    return { error: error.message || "An unexpected error occurred" }
  }
}
