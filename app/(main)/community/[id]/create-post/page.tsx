import { redirect } from "next/navigation"

export default function CommunityCreatePostRedirect({ params }: { params: { id: string } }) {
  redirect(`/post/create?communityId=${params.id}`)
}
