import { LoadingSpinner } from "@/components/animations/loading-spinner"

export default function CreatePostLoading() {
  return (
    <div className="container mx-auto px-4 py-6 flex justify-center items-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  )
}
