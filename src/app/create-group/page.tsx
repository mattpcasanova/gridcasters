"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GradientButton } from "@/components/ui/gradient-button"
import { ArrowLeft, Upload, Users, X, UserPlus } from "lucide-react"
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
  const [inviteEmail, setInviteEmail] = useState("")
  const [invites, setInvites] = useState<InviteMember[]>([])
  const router = useRouter()
  const supabase = useSupabase()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
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
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError
        avatarUrl = data.path
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
                  <div className="flex items-center space-x-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={imagePreview} />
                      <AvatarFallback>
                        <Users className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor="image" className="cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Image
                          </Button>
                        </div>
                      </Label>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Recommended: Square image, at least 200x200px
                      </p>
                    </div>
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