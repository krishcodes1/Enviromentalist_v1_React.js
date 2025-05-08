"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { X, ArrowLeft, Hash } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function CreatePostPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const communityId = searchParams.get("communityId")

  const supabase = createClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(communityId)
  const [communities, setCommunities] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch communities the user is a member of
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data, error } = await supabase
          .from("community_members")
          .select(`
            community_id,
            communities(id, name)
          `)
          .eq("user_id", user.id)

        if (error) throw error

        if (data) {
          const formattedCommunities = data.map((item) => ({
            id: item.communities.id,
            name: item.communities.name,
          }))
          setCommunities(formattedCommunities)
        }
      } catch (error) {
        console.error("Error fetching communities:", error)
      }
    }

    fetchCommunities()
  }, [supabase])

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        title,
        content,
        tags,
        community_id: selectedCommunity === "profile" ? null : selectedCommunity,
      })

      if (error) throw error

      toast({
        title: "Post created!",
        description: "Your post has been published successfully.",
      })

      if (selectedCommunity && selectedCommunity !== "profile") {
        router.push(`/community/${selectedCommunity}`)
      } else {
        router.push("/community")
      }
      router.refresh()
    } catch (error: any) {
      console.error("Error creating post:", error)
      setError(error.message || "Failed to create post. Please try again.")
      toast({
        title: "Post creation failed",
        description: error.message || "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href={selectedCommunity ? `/community/${selectedCommunity}` : "/community"} className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Create Post</h1>
        </div>
      </div>

      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Share with the Community</CardTitle>
          <CardDescription>Create a post to share your thoughts, questions, or ideas with others.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {communities.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="community">Community (Optional)</Label>
                <Select value={selectedCommunity || ""} onValueChange={setSelectedCommunity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Post to your profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profile">Post to your profile</SelectItem>
                    {communities.map((community) => (
                      <SelectItem key={community.id} value={community.id}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={8}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add tags"
                    className="pl-10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                </div>
                <Button type="button" variant="outline" className="ml-2" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-primary hover:text-primary/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <CardFooter className="px-0 pt-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Posting..." : "Create Post"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
