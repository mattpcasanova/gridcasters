"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SearchInput } from "@/components/ui/search-input"
import { GradientButton } from "@/components/ui/gradient-button"
import { CircularProgress } from "@/components/ui/circular-progress"
import { Crown, Users, Settings, UserPlus, UserCheck, ArrowLeft, Share, X, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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

export default function GroupPage({ params }: { params: { id: string } }) {
  const [groupData, setGroupData] = useState<GroupData | null>(null)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showShareModal, setShowShareModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isMember, setIsMember] = useState(false)
  const [isHost, setIsHost] = useState(false)
  
  const supabase = useSupabase()
  const router = useRouter()

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setIsLoading(true)
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          toast.error('You must be signed in to view groups')
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

        // Check if user is a member or host
        const { data: membership } = await supabase
          .from('group_members')
          .select('*')
          .eq('group_id', params.id)
          .eq('user_id', user.id)
          .single()

        if (membership) {
          setIsMember(true)
          setIsHost(membership.role === 'host' || group.host_id === user.id)
        }

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
        console.error('Error loading group:', error)
        toast.error('Failed to load group')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroupData()
  }, [params.id, supabase, router])

  const handleJoinGroup = async () => {
    if (!currentUser || !groupData) return

    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupData.id,
          user_id: currentUser.id,
          role: 'member',
          status: groupData.is_private ? 'pending' : 'approved',
          joined_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error joining group:', error)
        toast.error('Failed to join group')
        return
      }

      toast.success(groupData.is_private ? 'Join request sent!' : 'Successfully joined group!')
      setIsMember(true)
      
      // Refresh members list
      const { data: groupMembers } = await supabase
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

      setMembers(groupMembers || [])
    } catch (error) {
      console.error('Error joining group:', error)
      toast.error('Failed to join group')
    }
  }

  const filteredMembers = members.filter(
    (member) =>
      member.profiles.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.profiles.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const ShareModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Share Group</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowShareModal(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src={groupData?.avatar_url || "/logo.png"} />
              <AvatarFallback>
                <Users className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{groupData?.name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{members.length} members</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-slate-100 dark:bg-slate-700 rounded">
            <input
              type="text"
              value={`${window.location.origin}/group/${groupData?.id}`}
              readOnly
              className="flex-1 bg-transparent text-sm"
            />
            <Button
              size="sm"
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/group/${groupData?.id}`)}
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading group...</p>
        </div>
      </div>
    )
  }

  if (!groupData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Group not found</p>
          <Button asChild>
            <Link href="/leaderboard?tab=groups">Back to Groups</Link>
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
            <Link href="/leaderboard?tab=groups" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Groups</span>
            </Link>
          </Button>
        </div>

        {/* Group Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={groupData.avatar_url || "/logo.png"} />
                  <AvatarFallback className="text-2xl">
                    <Users className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold">{groupData.name}</h1>
                    {groupData.is_private && (
                      <Badge variant="outline" className="text-xs">
                        Private
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    Created {new Date(groupData.created_at).toLocaleDateString()}
                  </p>
                  {groupData.description && (
                    <p className="text-slate-700 dark:text-slate-300 mb-4">{groupData.description}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{members.length}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {groupData.is_private ? 'Private' : 'Public'}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Type</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">#{params.id.slice(0, 8)}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Group ID</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  {!isMember ? (
                    <GradientButton onClick={handleJoinGroup}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      {groupData.is_private ? 'Request to Join' : 'Join Group'}
                    </GradientButton>
                  ) : (
                    <Button variant="outline" disabled>
                      <UserCheck className="w-4 h-4 mr-2" />
                      {isHost ? 'Host' : 'Member'}
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setShowShareModal(true)}>
                    <Share className="w-4 h-4 mr-2" />
                    Share Group
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Group Members ({members.length})</CardTitle>
                <CardDescription>All members of {groupData.name}</CardDescription>
              </div>
              {isHost && (
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Group Settings
                </Button>
              )}
            </div>
            <SearchInput
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md mt-4"
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600 dark:text-slate-400">
                    {searchTerm ? 'No members found matching your search.' : 'No members yet.'}
                  </p>
                </div>
              ) : (
                filteredMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      member.user_id === currentUser?.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>

                      {/* User Info - Clickable */}
                      <Link
                        href={`/profile/${member.user_id}?from=group`}
                        className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={member.profiles.avatar_url || "/placeholder-user.jpg"} />
                          <AvatarFallback>
                            {member.profiles.display_name
                              ? member.profiles.display_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : member.profiles.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="flex items-center space-x-2">
                            <p
                              className={`font-semibold ${
                                member.user_id === currentUser?.id ? "text-blue-600 dark:text-blue-400" : ""
                              }`}
                            >
                              {member.profiles.display_name || member.profiles.username}
                            </p>
                            {(member.role === 'host' || member.user_id === groupData.host_id) && (
                              <Crown className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            )}
                            {member.user_id === currentUser?.id && (
                              <Badge variant="outline" className="text-xs">
                                You
                              </Badge>
                            )}
                            {(member.role === 'host' || member.user_id === groupData.host_id) && (
                              <Badge variant="outline" className="text-xs">
                                Host
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            @{member.profiles.username}
                          </p>
                        </div>
                      </Link>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Joined {new Date(member.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {showShareModal && <ShareModal />}
      </div>
    </div>
  )
} 