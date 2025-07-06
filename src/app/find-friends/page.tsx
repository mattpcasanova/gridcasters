"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchInput } from "@/components/ui/search-input"
import { GradientButton } from "@/components/ui/gradient-button"
import { CircularProgress } from "@/components/ui/circular-progress"
import { Users, UserPlus, UserCheck, Trophy, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const mockUsers = [
  {
    id: 1,
    name: "Mike Chen",
    username: "@mikechen",
    accuracy: 94.2,
    followers: 1247,
    following: false,
    verified: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    username: "@sarahj",
    accuracy: 91.8,
    followers: 892,
    following: true,
    verified: false,
  },
  {
    id: 3,
    name: "Alex Rodriguez",
    username: "@alexr",
    accuracy: 85.1,
    followers: 567,
    following: false,
    verified: false,
  },
]

const mockGroups = [
  {
    id: 1,
    name: "Fantasy Experts",
    description: "Professional fantasy football analysts and experts",
    members: 247,
    avgAccuracy: 89.4,
    isPrivate: false,
    joined: false,
  },
  {
    id: 2,
    name: "College Friends",
    description: "Fantasy league with college buddies",
    members: 12,
    avgAccuracy: 82.1,
    isPrivate: true,
    joined: true,
  },
  {
    id: 3,
    name: "NFL Analysts",
    description: "Deep dive NFL analysis and rankings",
    members: 156,
    avgAccuracy: 91.2,
    isPrivate: false,
    joined: false,
  },
]

export default function FindUsers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState(mockUsers)
  const [groups, setGroups] = useState(mockGroups)

  const toggleFollow = (userId: number) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, following: !user.following } : user)))
  }

  const toggleJoinGroup = (groupId: number) => {
    setGroups(groups.map((group) => (group.id === groupId ? { ...group, joined: !group.joined } : group)))
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredGroups = groups.filter(
    (group) =>
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
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Link href={`/profile/${user.id}`}>
                          <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
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
                          <p className="text-sm text-slate-600 dark:text-slate-400">{user.username}</p>
                          <p className="text-xs text-slate-500">{user.followers} followers</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <CircularProgress value={user.accuracy} size={40} />
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
                <div className="space-y-4">
                  {filteredGroups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Link href={`/group/${group.id}`}>
                          <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                            <AvatarImage src="/placeholder-group.jpg" />
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
                          <CircularProgress value={group.avgAccuracy} size={40} />
                          <p className="text-xs text-slate-500 mt-1">avg accuracy</p>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 