import type React from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated and has admin role
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Redirect to login if not authenticated
    redirect("/login")
  }

  // You can add additional admin role check here if needed
  // const { data: userProfile } = await supabase
  //   .from('profiles')
  //   .select('role')
  //   .eq('id', session.user.id)
  //   .single()

  // if (userProfile?.role !== 'admin') {
  //   redirect('/')
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-700 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="font-bold text-xl">Environmentalist Admin</div>
          <div className="flex gap-4">
            <a href="/admin" className="hover:underline">
              Dashboard
            </a>
            <a href="/admin/posts" className="hover:underline">
              Posts
            </a>
            <a href="/admin/comments" className="hover:underline">
              Comments
            </a>
            <a href="/admin/users" className="hover:underline">
              Users
            </a>
            <a href="/" className="hover:underline">
              Back to Site
            </a>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
