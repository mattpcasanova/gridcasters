"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SearchInput } from "@/components/ui/search-input"
import { GradientButton } from "@/components/ui/gradient-button"
import { CircularProgress } from "@/components/ui/circular-progress"
import { Users, UserPlus, UserCheck, Trophy, Plus } from "lucide-react"
import Link from "next/link"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { toast } from "sonner"

interface Group {
  id: string
  name: string
  description: string
  avatar_url: string | null
  is_private: boolean
  host_id: string
  avg_accuracy: number
  members_count: number
  is_member: boolean
  member_status?: string
}

export default function FindGroups() {
  const [searchTerm, setSearchTerm] = useState("")
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useSupabase()

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setGroups([])
        return
      }
      
      // Get all groups with member count and current user's membership status
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members(
            id,
            status,
            user_id
          )
        `)

      if (error) throw error

      // Transform the data to match our interface
      const transformedGroups = data.map(group => {
        const members = group.group_members || []
        const isMember = members.some((member: any) => 
          member.user_id === user.id && member.status === 'approved'
        )
        const isPending = members.some((member: any) => 
          member.user_id === user.id && member.status === 'pending'
        )
        const memberStatus = isMember ? 'approved' : isPending ? 'pending' : undefined
        
        return {
          ...group,
          members_count: members.length,
          is_member: isMember || isPending,
          member_status: memberStatus
        }
      })

      setGroups(transformedGroups)
    } catch (error) {
      console.error('Error fetching groups:', error)
      toast.error('Failed to load groups')
    } finally {
      setLoading(false)
    }
  }

  const toggleJoinGroup = async (groupId: string) => {
    try {
      const group = groups.find(g => g.id === groupId)
      if (!group) return

      if (group.is_member) {
        // Leave group
        const { error } = await supabase
          .from('group_members')
          .delete()
          .eq('group_id', groupId)
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

        if (error) throw error
        toast.success('Left group successfully')
      } else {
        // Join group
        const { error } = await supabase
          .from('group_members')
          .insert({
            group_id: groupId,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            status: group.is_private ? 'pending' : 'approved',
            joined_at: group.is_private ? null : new Date().toISOString()
          })

        if (error) throw error
        toast.success(group.is_private ? 'Join request sent' : 'Joined group successfully')
      }

      // Refresh groups
      await fetchGroups()
    } catch (error) {
      console.error('Error toggling group membership:', error)
      toast.error('Failed to update group membership')
    }
  }

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Find Groups</h1>
              <p className="text-slate-600 dark:text-slate-400">Join groups to compete and share insights</p>
            </div>
            <Link href="/create-group">
              <GradientButton icon={Plus}>
                Create Group
              </GradientButton>
            </Link>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-6">
              <SearchInput
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xl"
              />
            </CardContent>
          </Card>

          {/* Groups List */}
          <Card>
            <CardHeader>
              <CardTitle>Available Groups</CardTitle>
              <CardDescription>Browse and join groups that match your interests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                          </div>
                          <div className="w-24 h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => (
                    <Link
                      key={group.id}
                      href={`/group/${group.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={group.avatar_url || undefined} />
                            <AvatarFallback>
                              {group.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{group.name}</h3>
                              {group.is_private && (
                                <Badge variant="outline" className="text-xs">
                                  Private
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {group.members_count} members • {group.avg_accuracy}% avg accuracy
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <CircularProgress value={group.avg_accuracy} size="sm" />
                            <p className="text-xs text-slate-500 mt-1">accuracy</p>
                          </div>

                          <Button
                            variant={group.is_member ? "outline" : "default"}
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              toggleJoinGroup(group.id)
                            }}
                            className={group.is_member 
                              ? "border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                              : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                            }
                          >
                            {group.is_member ? (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" />
                                {group.member_status === 'pending' ? 'Pending' : 'Joined'}
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4 mr-2" />
                                {group.is_private ? 'Request' : 'Join'}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Groups Found</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {searchTerm ? "No groups match your search" : "Be the first to create a group!"}
                    </p>
                    <Link href="/create-group">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Group
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 