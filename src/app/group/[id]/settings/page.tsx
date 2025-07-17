"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { GradientButton } from "@/components/ui/gradient-button"
import { SearchInput } from "@/components/ui/search-input"
import { ArrowLeft, Settings, Users, UserPlus, UserX, Crown, Upload, Save, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { UserSearch } from "@/components/forms/user-search"

interface GroupData {
  id: string
  name: string
  description: string | null
  avatar_url: string | null
  is_private: boolean
  host_id: string
  created_at: string
}

interface GroupMember {
  id: string
  user_id: string
  group_id: string
  role: string
  status: string
  joined_at: string
  profiles: {
    username: string
    display_name: string | null
    avatar_url: string | null
  }
}

interface InviteMember {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  email?: string
}

export default function GroupSettings({ params }: { params: { id: string } }) {
  const [groupData, setGroupData] = useState<GroupData | null>(null)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isHost, setIsHost] = useState(false)
  
  // Form states
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Invite states
  const [invites, setInvites] = useState<InviteMember[]>([])
  const [showUserSearch, setShowUserSearch] = useState(false)
  
  const supabase = useSupabase()
  const router = useRouter()

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setIsLoading(true)
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          toast.error('You must be signed in to access group settings')
          router.push('/signin')
          return
        }
        setCurrentUser(user)

        // Fetch group data
        const { data: group, error: groupError } = await supabase
          .from('groups')
          .select('*')
          .eq('id', params.id)
          .single()

        if (groupError) {
          console.error('Error fetching group:', groupError)
          toast.error('Group not found')
          router.push('/leaderboard?tab=groups')
          return
        }

        setGroupData(group)
        setName(group.name)
        setDescription(group.description || '')
        setIsPrivate(group.is_private)
        setImagePreview(group.avatar_url || '/logo.png')

        // Check if user is host
        if (group.host_id !== user.id) {
          toast.error('Only the group host can access settings')
          router.push(`/group/${params.id}`)
          return
        }
        setIsHost(true)

        // Fetch group members
        const { data: groupMembers, error: membersError } = await supabase
          .from('group_members')
          .select(`
            *,
            profiles (
              username,
              display_name,
              avatar_url
            )
          `)
          .eq('group_id', params.id)
          .eq('status', 'approved')
          .order('joined_at', { ascending: true })

        if (membersError) {
          console.error('Error fetching members:', membersError)
        } else {
          setMembers(groupMembers || [])
        }

      } catch (error) {
        console.error('Error loading group settings:', error)
        toast.error('Failed to load group settings')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroupData()
  }, [params.id, supabase, router])

  const handleImageChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleImageChange(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageChange(file)
    }
  }

  const handleSaveGroup = async () => {
    if (!groupData || !currentUser) return

    try {
      setIsSaving(true)

      let avatarUrl = groupData.avatar_url
      if (imageFile) {
        try {
          const fileExt = imageFile.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
          const filePath = `${currentUser.id}/${fileName}`

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

          const { data: { publicUrl } } = supabase.storage
            .from('group-avatars')
            .getPublicUrl(filePath)

          avatarUrl = publicUrl
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError)
          toast.error('Failed to upload image')
          return
        }
      }

      // Update group
      const { error: updateError } = await supabase
        .from('groups')
        .update({
          name: name.trim(),
          description: description.trim() || null,
          is_private: isPrivate,
          avatar_url: avatarUrl
        })
        .eq('id', params.id)

      if (updateError) {
        console.error('Update error:', updateError)
        toast.error('Failed to update group')
        return
      }

      toast.success('Group updated successfully!')
      
      // Update local state
      setGroupData(prev => prev ? {
        ...prev,
        name: name.trim(),
        description: description.trim() || null,
        is_private: isPrivate,
        avatar_url: avatarUrl
      } : null)

    } catch (error) {
      console.error('Error updating group:', error)
      toast.error('Failed to update group')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the group?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('id', memberId)

      if (error) {
        console.error('Error removing member:', error)
        toast.error('Failed to remove member')
        return
      }

      toast.success(`${memberName} removed from group`)
      setMembers(members.filter(m => m.id !== memberId))
    } catch (error) {
      console.error('Error removing member:', error)
      toast.error('Failed to remove member')
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

  const handleSendInvites = async () => {
    if (invites.length === 0) {
      toast.error('No users selected to invite')
      return
    }

    try {
      const invitePromises = invites.map(async (invite) => {
        const { data: userData } = await supabase
          .from('profiles')
          .select('id, username')
          .eq('id', invite.id)
          .single()

        if (userData) {
          const { error: inviteError } = await supabase
            .from('group_invites')
            .insert({
              group_id: params.id,
              inviter_id: currentUser.id,
              invitee_username: userData.username,
              status: 'pending'
            })

          if (inviteError) {
            console.error('Error creating invite:', inviteError)
          }
        }
      })

      await Promise.all(invitePromises)
      toast.success(`${invites.length} invite(s) sent successfully!`)
      setInvites([])
    } catch (error) {
      console.error('Error sending invites:', error)
      toast.error('Failed to send some invites')
    }
  }

  const filteredMembers = members.filter(
    (member) =>
      member.profiles.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.profiles.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading group settings...</p>
        </div>
      </div>
    )
  }

  if (!groupData || !isHost) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-slate-600 dark:text-slate-400 mb-4">Access denied</p>
          <Button asChild>
            <Link href={`/group/${params.id}`}>Back to Group</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/group/${params.id}`} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Group</span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Group Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Group Details</span>
              </CardTitle>
              <CardDescription>Update your group's information and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Group Image */}
              <div
                className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="relative group">
                  <Avatar className="w-24 h-24">
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
              </div>

              {/* Group Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter group name"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your group..."
                  rows={3}
                />
              </div>

              {/* Privacy Setting */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Private Group</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Private groups require approval to join
                  </p>
                </div>
                <Switch
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
              </div>

              {/* Save Button */}
              <GradientButton onClick={handleSaveGroup} disabled={isSaving} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </GradientButton>
            </CardContent>
          </Card>

          {/* Members Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Members ({members.length})</span>
              </CardTitle>
              <CardDescription>Manage group members and send invites</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Invite Members */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Invite Members</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUserSearch(true)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Users
                  </Button>
                </div>

                {invites.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Users:</p>
                    <div className="space-y-2">
                      {invites.map((invite) => (
                        <div key={invite.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={invite.avatar_url || "/placeholder-user.jpg"} />
                              <AvatarFallback className="text-xs">
                                {invite.display_name
                                  ? invite.display_name.split(" ").map((n) => n[0]).join("")
                                  : invite.username.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{invite.display_name || invite.username}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveInvite(invite.id)}
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button onClick={handleSendInvites} className="w-full">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Send Invites ({invites.length})
                    </Button>
                  </div>
                )}
              </div>

              {/* Search Members */}
              <div className="space-y-2">
                <Label>Search Members</Label>
                <SearchInput
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Members List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredMembers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600 dark:text-slate-400">
                      {searchTerm ? 'No members found matching your search.' : 'No members yet.'}
                    </p>
                  </div>
                ) : (
                  filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={member.profiles.avatar_url || "/placeholder-user.jpg"} />
                          <AvatarFallback className="text-xs">
                            {member.profiles.display_name
                              ? member.profiles.display_name.split(" ").map((n) => n[0]).join("")
                              : member.profiles.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-sm">
                              {member.profiles.display_name || member.profiles.username}
                            </p>
                            {(member.role === 'host' || member.user_id === groupData.host_id) && (
                              <Crown className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                            )}
                            {(member.role === 'host' || member.user_id === groupData.host_id) && (
                              <Badge variant="outline" className="text-xs">
                                Host
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            @{member.profiles.username}
                          </p>
                        </div>
                      </div>

                      {member.user_id !== groupData.host_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id, member.profiles.display_name || member.profiles.username)}
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Search Modal */}
        {showUserSearch && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Invite Users</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowUserSearch(false)}>
                  ×
                </Button>
              </div>
              <UserSearch onUserSelect={handleUserSelect} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 