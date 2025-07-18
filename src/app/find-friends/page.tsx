"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchInput } from "@/components/ui/search-input"
import { GradientButton } from "@/components/ui/gradient-button"
import { CircularProgress } from "@/components/ui/circular-progress"
import { GradientLoading } from "@/components/ui/gradient-loading"
import { Users, UserPlus, UserCheck, Trophy, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { toast } from "sonner"
import { DEFAULT_AVATAR_URL } from "@/lib/constants/avatars"

interface User {
  id: string;
  name: string;
  username: string;
  accuracy: number;
  followers: number;
  following: boolean;
  verified: boolean;
  avatar: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  avgAccuracy: number;
  isPrivate: boolean;
  joined: boolean;
  avatar: string;
}

export default function FindUsers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [isLoadingGroups, setIsLoadingGroups] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const supabase = useSupabase()

  // Fetch real users and groups
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setCurrentUserId(user.id)

        // Fetch all users except yourself
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url, is_verified')
          .neq('id', user.id)

        if (usersError) {
          console.error('Error fetching users:', usersError)
          return
        }

        // Get follow status for each user
        const { data: followData } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id)

        const followingIds = new Set(followData?.map(f => f.following_id) || [])

        // Get follower counts for each user
        const { data: followerCounts } = await supabase
          .from('follows')
          .select('following_id')

        const userFollowerCounts = new Map<string, number>()
        followerCounts?.forEach(follow => {
          const count = userFollowerCounts.get(follow.following_id) || 0
          userFollowerCounts.set(follow.following_id, count + 1)
        })

        // Transform users data
        const transformedUsers: User[] = usersData.map((profile) => ({
          id: profile.id,
          name: profile.display_name || profile.username,
          username: profile.username,
          accuracy: 0, // Will be calculated from rankings if needed
          followers: userFollowerCounts.get(profile.id) || 0,
          following: followingIds.has(profile.id),
          verified: profile.is_verified || false,
          avatar: profile.avatar_url || DEFAULT_AVATAR_URL,
        }))

        setUsers(transformedUsers)
        setIsLoadingUsers(false)

        // Fetch all groups
        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select('id, name, description, avatar_url, is_private')

        if (groupsError) {
          console.error('Error fetching groups:', groupsError)
          return
        }

        // Get member counts and join status for each group
        const transformedGroups: Group[] = []
        for (const group of groupsData) {
          const { count: memberCount } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id)
            .eq('status', 'approved')

          const { data: membership } = await supabase
            .from('group_members')
            .select('status')
            .eq('group_id', group.id)
            .eq('user_id', user.id)
            .single()

          transformedGroups.push({
            id: group.id,
            name: group.name,
            description: group.description || '',
            members: memberCount || 0,
            avgAccuracy: 0, // Will be calculated if needed
            isPrivate: group.is_private,
            joined: membership?.status === 'approved',
            avatar: group.avatar_url || "/logo.png",
          })
        }

        setGroups(transformedGroups)
        setIsLoadingGroups(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoadingUsers(false)
        setIsLoadingGroups(false)
      }
    }

    fetchData()
  }, [supabase])

  const toggleFollow = async (userId: string) => {
    try {
      if (!currentUserId) return

      const targetUser = users.find(u => u.id === userId)
      if (!targetUser) return

      const newFollowingState = !targetUser.following

      if (newFollowingState) {
        // Follow the user
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: currentUserId,
            following_id: userId,
          })
        if (error) throw error
      } else {
        // Unfollow the user
        const { error } = await supabase
          .from('follows')
          .delete()
          .match({
            follower_id: currentUserId,
            following_id: userId,
          })
        if (error) throw error
      }

      // Update local state
      setUsers(users.map((user) => 
        user.id === userId ? { ...user, following: newFollowingState } : user
      ))

      toast.success(newFollowingState ? 'Following user' : 'Unfollowed user')
    } catch (error) {
      console.error('Error toggling follow:', error)
      toast.error('Failed to update follow status')
    }
  }

  const toggleJoinGroup = async (groupId: string) => {
    try {
      if (!currentUserId) return

      const targetGroup = groups.find(g => g.id === groupId)
      if (!targetGroup) return

      const newJoinedState = !targetGroup.joined

      if (newJoinedState) {
        // Join the group
        const { error } = await supabase
          .from('group_members')
          .insert({
            group_id: groupId,
            user_id: currentUserId,
            status: targetGroup.isPrivate ? 'pending' : 'approved',
          })
        if (error) throw error
      } else {
        // Leave the group
        const { error } = await supabase
          .from('group_members')
          .delete()
          .match({
            group_id: groupId,
            user_id: currentUserId,
          })
        if (error) throw error
      }

      // Update local state
      setGroups(groups.map((group) => 
        group.id === groupId ? { ...group, joined: newJoinedState } : group
      ))

      toast.success(newJoinedState ? 'Joined group' : 'Left group')
    } catch (error) {
      console.error('Error toggling group join:', error)
      toast.error('Failed to update group membership')
    }
  }

  const filteredUsers = users.filter(
    (user: User) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredGroups = groups.filter(
    (group: Group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Friends & Groups</h1>
          <p className="text-slate-600 dark:text-slate-400">Connect with other fantasy football enthusiasts</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchInput
            placeholder="Search users and groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Find Users</CardTitle>
                <CardDescription>Discover and follow other fantasy football experts</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="text-center py-12">
                    <GradientLoading text="Loading users..." size="md" />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {searchTerm ? `No users match "${searchTerm}"` : "No other users in the system yet"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((user: User) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Link href={`/profile/${user.id}`}>
                            <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </Link>

                          <div>
                            <div className="flex items-center space-x-2">
                              <Link href={`/profile/${user.id}`}>
                                <p className="font-semibold hover:text-blue-600 cursor-pointer">{user.name}</p>
                              </Link>
                              {user.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">@{user.username}</p>
                            <p className="text-xs text-slate-500">{user.followers} followers</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            {user.accuracy > 0 ? (
                              <CircularProgress value={user.accuracy} size={40} />
                            ) : (
                              <div className="w-[40px] h-[40px] rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                <span className="text-xs font-medium text-slate-500">--</span>
                              </div>
                            )}
                          </div>

                          {user.following ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleFollow(user.id)}
                              className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Following
                            </Button>
                          ) : (
                            <GradientButton size="sm" onClick={() => toggleFollow(user.id)} icon={UserPlus}>
                              Follow
                            </GradientButton>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Find Groups</CardTitle>
                    <CardDescription>Join communities of fantasy football enthusiasts</CardDescription>
                  </div>
                  <Link href="/create-group">
                    <GradientButton size="sm" icon={Plus}>
                      Create Group
                    </GradientButton>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingGroups ? (
                  <div className="text-center py-12">
                    <GradientLoading text="Loading groups..." size="md" />
                  </div>
                ) : filteredGroups.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Groups Found</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {searchTerm ? `No groups match "${searchTerm}"` : "No groups in the system yet"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredGroups.map((group: Group) => (
                      <div
                        key={group.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Link href={`/group/${group.id}`}>
                            <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                              <AvatarImage src={group.avatar} />
                              <AvatarFallback>
                                <Users className="w-6 h-6" />
                              </AvatarFallback>
                            </Avatar>
                          </Link>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Link href={`/group/${group.id}`}>
                                <p className="font-semibold hover:text-blue-600 cursor-pointer">{group.name}</p>
                              </Link>
                              {group.isPrivate && (
                                <Badge variant="outline" className="text-xs">
                                  Private
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{group.description}</p>
                            <p className="text-xs text-slate-500">{group.members} members</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            {group.avgAccuracy > 0 ? (
                              <CircularProgress value={group.avgAccuracy} size={40} />
                            ) : (
                              <div className="w-[40px] h-[40px] rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                <span className="text-xs font-medium text-slate-500">--</span>
                              </div>
                            )}
                          </div>

                          {group.joined ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleJoinGroup(group.id)}
                              className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                            >
                              <Trophy className="w-4 h-4 mr-2" />
                              Joined
                            </Button>
                          ) : (
                            <GradientButton
                              size="sm"
                              onClick={() => toggleJoinGroup(group.id)}
                              icon={Trophy}
                            >
                              {group.isPrivate ? "Request" : "Join"}
                            </GradientButton>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 