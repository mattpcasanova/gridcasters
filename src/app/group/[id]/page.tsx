"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NavigationHeader } from "@/components/layout/navigation-header"
import { SearchInput } from "@/components/ui/search-input"
import { GradientButton } from "@/components/ui/gradient-button"
import { CircularProgress } from "@/components/ui/circular-progress"
import { Crown, Users, Settings, UserPlus, UserCheck, ArrowLeft, Share, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock group data - in real app this would come from API based on [id]
const getGroupData = (id: string) => {
  const groups = {
    "1": {
      id: 1,
      name: "Fantasy Experts",
      description:
        "A group for serious fantasy football analysts and experts. Share insights, discuss strategies, and compete for the most accurate rankings.",
      members: 247,
      avgAccuracy: 89.4,
      isPrivate: false,
      createdDate: "January 2024",
      hostId: 1,
      avatar: "/placeholder-group.jpg",
    },
    "2": {
      id: 2,
      name: "College Friends",
      description: "Our college fantasy football league group. Keeping the competition alive after graduation!",
      members: 12,
      avgAccuracy: 82.1,
      isPrivate: true,
      createdDate: "March 2024",
      hostId: 3,
      avatar: "/placeholder-group.jpg",
    },
    "3": {
      id: 3,
      name: "NFL Analysts",
      description: "Professional NFL analysts and fantasy football experts sharing their weekly rankings and insights.",
      members: 156,
      avgAccuracy: 91.2,
      isPrivate: false,
      createdDate: "February 2024",
      hostId: 2,
      avatar: "/placeholder-group.jpg",
    },
  }
  return groups[id as keyof typeof groups] || groups["1"]
}

// Mock members data
const getMembersData = (groupId: string) => [
  {
    id: 1,
    name: "Mike Chen",
    username: "@mikechen",
    accuracy: 94.2,
    rank: 1,
    followers: 1247,
    avatar: "/placeholder-user.jpg",
    isHost: groupId === "1",
    isFollowing: false,
    verified: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    username: "@sarahj",
    accuracy: 91.8,
    rank: 2,
    followers: 892,
    avatar: "/placeholder-user.jpg",
    isHost: groupId === "3",
    isFollowing: true,
    verified: false,
  },
  {
    id: 3,
    name: "Matt Casanova",
    username: "@mattcasanova",
    accuracy: 87.3,
    rank: 3,
    followers: 247,
    avatar: "/placeholder-user.jpg",
    isHost: groupId === "2",
    isCurrentUser: true,
    verified: false,
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    username: "@alexr",
    accuracy: 85.1,
    rank: 4,
    followers: 567,
    isFollowing: false,
    verified: false,
  },
  {
    id: 5,
    name: "Emma Wilson",
    username: "@emmaw",
    accuracy: 83.7,
    rank: 5,
    followers: 423,
    isFollowing: true,
    verified: false,
  },
  {
    id: 6,
    name: "David Kim",
    username: "@davidk",
    accuracy: 82.4,
    rank: 6,
    followers: 789,
    isFollowing: false,
    verified: false,
  },
]

export default function GroupPage({ params }: { params: { id: string } }) {
  const groupData = getGroupData(params.id)
  const membersData = getMembersData(params.id)
  const [searchTerm, setSearchTerm] = useState("")
  const [showShareModal, setShowShareModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [followingUsers, setFollowingUsers] = useState<number[]>(
    membersData.filter((user) => user.isFollowing).map((user) => user.id),
  )

  const toggleFollow = (userId: number) => {
    setFollowingUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const filteredMembers = membersData.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.username.toLowerCase().includes(searchTerm.toLowerCase()),
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
              <AvatarImage src={groupData.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                <Users className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{groupData.name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{groupData.members} members</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-slate-100 dark:bg-slate-700 rounded">
            <input
              type="text"
              value={`https://gridcasters.com/group/${groupData.id}`}
              readOnly
              className="flex-1 bg-transparent text-sm"
            />
            <Button
              size="sm"
              onClick={() => navigator.clipboard.writeText(`https://gridcasters.com/group/${groupData.id}`)}
            >
              Copy
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button className="flex-1 bg-transparent" variant="outline">
              Twitter
            </Button>
            <Button className="flex-1 bg-transparent" variant="outline">
              Facebook
            </Button>
            <Button className="flex-1 bg-transparent" variant="outline">
              Reddit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-8">
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

          {/* Group Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={groupData.avatar} />
                <AvatarFallback>
                  {groupData.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{groupData.name}</h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Created {groupData.createdDate}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <GradientButton icon={Users} onClick={() => setShowShareModal(true)}>
                Join Group
              </GradientButton>
              <Button variant="outline" onClick={() => setShowShareModal(true)}>
                <Share className="w-4 h-4 mr-2" />
                Share Group
              </Button>
            </div>
          </div>

          {/* Group Info */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <CircularProgress value={groupData.avgAccuracy} size="lg" />
                  <p className="mt-2 font-medium">Average Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">#{groupData.id}</p>
                  <p className="mt-2 font-medium">Group Rank</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{groupData.members}</p>
                  <p className="mt-2 font-medium">Members</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-slate-600 dark:text-slate-400">
                  {groupData.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Members List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Group Members</CardTitle>
                  <CardDescription>All members of {groupData.name}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Group Settings
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <SearchInput
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <div className="space-y-4">
                {filteredMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-slate-500">#{index + 1}</span>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center space-x-2">
                          <span>{member.name}</span>
                          {member.isCurrentUser && <span className="text-blue-600 dark:text-blue-400">(You)</span>}
                        </div>
                        <div className="text-sm text-slate-500">
                          {member.followers} followers
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-right">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-bold text-lg">{member.accuracy}%</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">accuracy</p>
                        </div>
                        <CircularProgress value={member.accuracy} size="sm" />
                      </div>

                      {member.isCurrentUser ? (
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/profile">View Profile</Link>
                        </Button>
                      ) : followingUsers.includes(member.id) ? (
                        <GradientButton size="sm" onClick={() => toggleFollow(member.id)} className="min-w-[100px]">
                          <UserCheck className="w-4 h-4 mr-1" />
                          Following
                        </GradientButton>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFollow(member.id)}
                          className="min-w-[100px]"
                        >
                          Follow
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showShareModal && <ShareModal />}
    </div>
  )
} 