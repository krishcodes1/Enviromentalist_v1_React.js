"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Upload, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { createCommunity } from "@/app/actions/community-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/animations/loading-spinner"

export default function CreateCommunityPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const [descriptionError, setDescriptionError] = useState<string | null>(null)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  const validateForm = () => {
    let isValid = true

    // Reset errors
    setNameError(null)
    setDescriptionError(null)
    setCategoryError(null)

    if (!name || name.trim().length < 3) {
      setNameError("Community name must be at least 3 characters long")
      isValid = false
    }

    if (!description || description.trim().length < 10) {
      setDescriptionError("Description must be at least 10 characters long")
      isValid = false
    }

    if (!category) {
      setCategoryError("Please select a category")
      isValid = false
    }

    return isValid
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    try {
      setUploading(true)
      const file = e.target.files[0]

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Only image files are allowed",
          variant: "destructive",
        })
        return
      }

      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `community-images/${fileName}`

      const { error: uploadError } = await supabase.storage.from("public").upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("public").getPublicUrl(filePath)
      setImageUrl(data.publicUrl)
      toast({
        title: "Image uploaded",
        description: "Your community image has been uploaded successfully.",
      })
    } catch (error: any) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("category", category)
      formData.append("isPrivate", isPrivate.toString())
      formData.append("imageUrl", imageUrl)

      const result = await createCommunity(formData)

      if (result.error) {
        setError(result.error)
        toast({
          title: "Creation failed",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.success) {
        toast({
          title: "Community created!",
          description: `Your community "${name}" has been created successfully.`,
        })

        // Redirect to the new community page
        router.push(`/community/${result.communityId}`)
        router.refresh()
      }
    } catch (error: any) {
      console.error("Error creating community:", error)
      setError(error.message || "Failed to create community. Please try again.")
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create community. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex items-center mb-6">
        <Link href="/community" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Create Community</h1>
      </div>

      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Community Details</CardTitle>
          <CardDescription>
            Create a space for people with similar interests to connect and collaborate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center justify-between">
                Community Name
                {nameError && <span className="text-xs text-red-500">{nameError}</span>}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (nameError) setNameError(null)
                }}
                placeholder="Enter community name"
                className={nameError ? "border-red-500" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center justify-between">
                Description
                {descriptionError && <span className="text-xs text-red-500">{descriptionError}</span>}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (descriptionError) setDescriptionError(null)
                }}
                placeholder="Describe your community"
                rows={4}
                className={descriptionError ? "border-red-500" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center justify-between">
                Category
                {categoryError && <span className="text-xs text-red-500">{categoryError}</span>}
              </Label>
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value)
                  if (categoryError) setCategoryError(null)
                }}
              >
                <SelectTrigger className={categoryError ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cleanup">Cleanup</SelectItem>
                  <SelectItem value="Conservation">Conservation</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Recycling">Recycling</SelectItem>
                  <SelectItem value="Sustainable Living">Sustainable Living</SelectItem>
                  <SelectItem value="Tree Planting">Tree Planting</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="privacy">Privacy Setting</Label>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Private Community</h4>
                  <p className="text-sm text-muted-foreground">Only approved members can see and join this community</p>
                </div>
                <Switch checked={isPrivate} onCheckedChange={setIsPrivate} aria-label="Toggle private community" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Community Image (Optional)</Label>
              <div className="flex items-center gap-4">
                <AnimatePresence>
                  {imageUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="h-20 w-20 rounded-md overflow-hidden bg-gray-100"
                    >
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt="Community"
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <label className="flex-1">
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50">
                    <Upload className="h-6 w-6 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      {uploading ? "Uploading..." : "Click to upload an image"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Max size: 5MB</p>
                  </div>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <input type="hidden" name="imageUrl" value={imageUrl} />

            <CardFooter className="px-0 pt-4">
              <Button type="submit" className="w-full" disabled={loading || uploading}>
                {loading ? <LoadingSpinner /> : "Create Community"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
