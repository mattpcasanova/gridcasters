"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { GradientButton } from "@/components/ui/gradient-button"
import { ArrowLeft, Upload, Users, X, UserPlus, Image as ImageIcon, Lock, Globe } from "lucide-react"
import Link from "next/link"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { toast } from "sonner"
import { UserSearch } from "@/components/forms/user-search"


interface InviteMember {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  email?: string
}

const DEFAULT_GROUP_AVATAR = "https://phqchtsxgrciqvhuevsr.supabase.co/storage/v1/object/public/group-avatars//gridcasters-logo.png"

export default function CreateGroup() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(DEFAULT_GROUP_AVATAR)
  const [isDragging, setIsDragging] = useState(false)
  const [invites, setInvites] = useState<InviteMember[]>([])
  const [nameError, setNameError] = useState<string | null>(null)
  const [descriptionError, setDescriptionError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = useSupabase()

  // Validate name on change
  useEffect(() => {
    if (!name || name.trim().length === 0) {
      setNameError('Group name is required')
    } else if (name.trim().length < 3) {
      setNameError('Group name must be at least 3 characters long')
    } else if (name.trim().length > 50) {
      setNameError('Group name must be less than 50 characters')
    } else {
      setNameError(null)
    }
  }, [name])

  // Validate description on change
  useEffect(() => {
    if (description && description.trim().length > 500) {
      setDescriptionError('Description must be less than 500 characters')
    } else {
      setDescriptionError(null)
    }
  }, [description])

  const handleImageChange = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
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

  const handleUserSelect = (user: InviteMember) => {
    if (invites.some(invite => invite.id === user.id)) {
      toast.error('This user has already been invited')
      return
    }
    setInvites([...invites, user])
  }

  const handleRemoveInvite = (userId: string) => {
    setInvites(invites.filter(invite => invite.id !== userId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!name || name.trim().length === 0) {
      toast.error('Group name is required')
      return
    }
    
    if (name.trim().length < 3) {
      toast.error('Group name must be at least 3 characters long')
      return
    }
    
    if (name.trim().length > 50) {
      toast.error('Group name must be less than 50 characters')
      return
    }
    
    if (description && description.trim().length > 500) {
      toast.error('Description must be less than 500 characters')
      return
    }
    
    try {
      setLoading(true)

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error('Auth error:', userError)
        throw userError
      }
      if (!user) {
        toast.error('You must be signed in to create a group')
        return
      }

      let avatarUrl = DEFAULT_GROUP_AVATAR
      if (imageFile) {
        try {
          // Create unique filename
          const fileExt = imageFile.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
          const filePath = `${user.id}/${fileName}`

          // Upload image
          const { error: uploadError } = await supabase.storage
            .from('group-avatars')
            .upload(filePath, imageFile, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            console.error('Upload error:', uploadError)
            throw uploadError
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('group-avatars')
            .getPublicUrl(filePath)

          avatarUrl = publicUrl
          console.log('Image uploaded successfully:', avatarUrl)
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError)
          toast.error('Failed to upload image. Using default logo.')
          avatarUrl = DEFAULT_GROUP_AVATAR
        }
      }

      // Create group
      console.log('Creating group with data:', {
        name: name.trim(),
        description: description.trim() || null,
        is_private: isPrivate,
        host_id: user.id,
        avatar_url: avatarUrl,
      })

      // Create group and add host as member in a transaction
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          is_private: isPrivate,
          host_id: user.id,
          avatar_url: avatarUrl,
        })
        .select()
        .single()

      if (groupError) {
        console.error('Group creation error:', groupError)
        console.error('Error details:', {
          code: groupError.code,
          message: groupError.message,
          details: groupError.details,
          hint: groupError.hint
        })
        
        if (groupError.code === '23505') { // Unique constraint violation
          toast.error('A group with this name already exists. Please choose a different name.')
        } else if (groupError.code === '42P01') { // Table doesn't exist
          toast.error('Database schema not ready. Please run the migration first.')
        } else {
          toast.error(`Failed to create group: ${groupError.message}`)
        }
        return
      }

      if (!group) {
        throw new Error('No group data returned after creation')
      }

      // Add the host as a member of the group
      console.log('Adding host as group member:', { groupId: group.id, userId: user.id })
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'host',
          status: 'approved',
          joined_at: new Date().toISOString()
        })

      if (memberError) {
        console.error('Error adding host as member:', memberError)
        // Don't fail the entire operation, but log the error
        // The user can still access the group as the host
      } else {
        console.log('Successfully added host as group member')
      }

      // Send invites
      if (invites.length > 0) {
        try {
          console.log('Creating invites for group:', group.id)
          
          // Get user emails for invites
          const invitePromises = invites.map(async (invite) => {
            console.log('Processing invite for user:', invite.id)
            
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('id, username')
              .eq('id', invite.id)
              .single()

            if (userError) {
              console.error('Error fetching user data:', userError)
              return
            }

            if (userData) {
              console.log('Creating invite for user:', userData.username)
              
              // Create invite record
              const { error: inviteError } = await supabase
                .from('group_invites')
                .insert({
                  group_id: group.id,
                  inviter_id: user.id,
                  invitee_username: userData.username,
                  status: 'pending'
                })

              if (inviteError) {
                console.error('Error creating invite:', inviteError)
                console.error('Invite error details:', {
                  code: inviteError.code,
                  message: inviteError.message,
                  details: inviteError.details
                })
              } else {
                console.log('Invite created successfully for:', userData.username)
              }
            }
          })

          await Promise.all(invitePromises)
          toast.success(`Group created successfully! ${invites.length} invite(s) sent.`)
        } catch (inviteError) {
          console.error('Error sending invites:', inviteError)
          toast.success('Group created successfully! Some invites may not have been sent.')
        }
      } else {
        toast.success('Group created successfully!')
      }

      router.push(`/group/${group.id}`)
    } catch (error) {
      console.error('Error creating group:', error)
      toast.error('Failed to create group. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = name.trim().length > 0 && !nameError && !descriptionError

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col space-y-6">
            {/* Back Button */}
            <div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/leaderboard?tab=groups" className="flex items-center space-x-2">
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
                    <div className="text-center mt-4">
                      <Label htmlFor="image" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <Button type="button" variant="outline" size="sm" className="mb-2">
                            <Upload className="w-4 h-4 mr-2" />
                            Change Image
                          </Button>
                          <p className="text-sm text-slate-500">or drag and drop</p>
                        </div>
                      </Label>
                    </div>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <p className="text-xs text-slate-500 mt-4">
                      Recommended: Square image, at least 200x200px (max 5MB)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Group Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter group name"
                      className={nameError ? "border-red-500" : ""}
                    />
                    {nameError && (
                      <p className="text-sm text-red-500">{nameError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your group's purpose and goals"
                      className={descriptionError ? "border-red-500" : ""}
                    />
                    {descriptionError && (
                      <p className="text-sm text-red-500">{descriptionError}</p>
                    )}
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
                    <Label>Invite Members (Optional)</Label>
                    <UserSearch
                      onUserSelect={handleUserSelect}
                      placeholder="Search by username or email..."
                    />
                    {invites.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {invites.length} member(s) to invite:
                        </p>
                        {invites.map((invite) => (
                          <div
                            key={invite.id}
                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={invite.avatar_url || undefined} />
                                <AvatarFallback>
                                  {invite.display_name?.charAt(0) || invite.username.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {invite.display_name || invite.username}
                                </p>
                                <p className="text-xs text-slate-500">@{invite.username}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveInvite(invite.id)}
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
                    disabled={loading || !isFormValid}
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