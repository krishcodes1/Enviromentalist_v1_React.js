import { redirect } from "next/navigation"

export default function RedirectToMainCommunityDetail({ params }: { params: { id: string } }) {
  redirect(`/community/${params.id}`)
}
