"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GradientButton } from "@/components/ui/gradient-button"
import { ArrowLeft, Upload, Users, X, UserPlus, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { toast } from "sonner"

interface InviteMember {
  email: string
  role: 'member' | 'admin'
}

export default function CreateGroup() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [invites, setInvites] = useState<InviteMember[]>([])
  const router = useRouter()
  const supabase = useSupabase()

  const handleImageChange = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleImageChange(file)
    }
  }, [handleImageChange])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageChange(file)
    }
  }

  const handleAddInvite = () => {
    if (!inviteEmail) return
    if (invites.some(invite => invite.email === inviteEmail)) {
      toast.error('This email has already been invited')
      return
    }
    setInvites([...invites, { email: inviteEmail, role: 'member' }])
    setInviteEmail("")
  }

  const handleRemoveInvite = (email: string) => {
    setInvites(invites.filter(invite => invite.email !== email))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) {
        toast.error('You must be signed in to create a group')
        return
      }

      let avatarUrl = null
      if (imageFile) {
        // Upload image
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError, data } = await supabase.storage
          .from('group-avatars')
          .upload(`${user.id}/${fileName}`, imageFile)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('group-avatars')
          .getPublicUrl(`${user.id}/${fileName}`)

        avatarUrl = publicUrl
      }

      // Create group
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name,
          description,
          is_private: isPrivate,
          host_id: user.id,
          avatar_url: avatarUrl,
        })
        .select()
        .single()

      if (groupError) throw groupError

      // Send invites
      if (invites.length > 0) {
        const { error: inviteError } = await supabase
          .from('group_members')
          .insert(invites.map(invite => ({
            group_id: group.id,
            email: invite.email,
            role: invite.role,
            status: 'pending'
          })))

        if (inviteError) throw inviteError
      }

      toast.success('Group created successfully')
      router.push(`/group/${group.id}`)
    } catch (error) {
      console.error('Error creating group:', error)
      toast.error('Failed to create group')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col space-y-6">
            {/* Back Button */}
            <div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/find-groups" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Groups</span>
                </Link>
              </Button>
            </div>

            {/* Create Group Form */}
            <Card>
              <CardHeader>
                <CardTitle>Create a New Group</CardTitle>
                <CardDescription>Create a group to collaborate and compete with other rankers</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Group Image */}
                  <div
                    className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${
                      isDragging
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <div className="relative group">
                        <Avatar className="w-32 h-32">
                          <AvatarImage src={imagePreview} />
                          <AvatarFallback>
                            <Users className="w-12 h-12" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
                          <Label htmlFor="image" className="cursor-pointer">
                            <Upload className="w-6 h-6 text-white" />
                          </Label>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                        <Label htmlFor="image" className="cursor-pointer">
                          <div className="flex flex-col items-center">
                            <Button type="button" variant="outline" size="sm" className="mb-2">
                              <Upload className="w-4 h-4 mr-2" />
                              Choose Image
                            </Button>
                            <p className="text-sm text-slate-500">or drag and drop</p>
                          </div>
                        </Label>
                      </div>
                    )}
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <p className="text-xs text-slate-500 mt-4">
                      Recommended: Square image, at least 200x200px (max 2MB)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Group Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter group name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your group's purpose and goals"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="private">Private Group</Label>
                      <p className="text-sm text-slate-500">
                        Private groups require approval to join
                      </p>
                    </div>
                    <Switch
                      id="private"
                      checked={isPrivate}
                      onCheckedChange={setIsPrivate}
                    />
                  </div>

                  {/* Invite Members */}
                  <div className="space-y-4">
                    <Label>Invite Members</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddInvite}
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    </div>
                    {invites.length > 0 && (
                      <div className="space-y-2">
                        {invites.map((invite) => (
                          <div
                            key={invite.email}
                            className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded"
                          >
                            <span className="text-sm">{invite.email}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveInvite(invite.email)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <GradientButton
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Group"}
                  </GradientButton>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 