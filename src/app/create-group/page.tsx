"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NavigationHeader } from "@/components/layout/navigation-header"
import { GradientButton } from "@/components/ui/gradient-button"
import { Upload, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateGroup() {
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    isPrivate: false,
    profileImage: null as File | null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating group:", groupData)
    // Handle group creation logic here
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setGroupData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setGroupData((prev) => ({ ...prev, profileImage: file }))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/leaderboard?tab=groups">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Groups
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Group</h1>
          <p className="text-slate-600 dark:text-slate-400">Start your own fantasy football community</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Group Details</CardTitle>
              <CardDescription>Set up your group information and privacy settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Group Image */}
                <div className="flex items-center space-x-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={groupData.profileImage ? URL.createObjectURL(groupData.profileImage) : ""} />
                    <AvatarFallback>
                      <Users className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="groupImage" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </span>
                      </Button>
                    </Label>
                    <input
                      id="groupImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-slate-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                {/* Group Name */}
                <div className="space-y-2">
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    placeholder="Enter group name"
                    value={groupData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                {/* Group Description */}
                <div className="space-y-2">
                  <Label htmlFor="groupDescription">Description</Label>
                  <Textarea
                    id="groupDescription"
                    placeholder="Describe your group and what it's about..."
                    value={groupData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                {/* Privacy Setting */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="isPrivate" className="text-base font-medium">
                      Private Group
                    </Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {groupData.isPrivate
                        ? "Only members you approve can join this group"
                        : "Anyone can join this group"}
                    </p>
                  </div>
                  <Switch
                    id="isPrivate"
                    checked={groupData.isPrivate}
                    onCheckedChange={(checked) => handleInputChange("isPrivate", checked)}
                  />
                </div>

                {/* Group Rules */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Group Host Privileges</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• You can change the group name and profile picture</li>
                    <li>• You can manage member requests for private groups</li>
                    <li>• You can remove members from the group</li>
                    <li>• You can transfer host privileges to another member</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <Link href="/leaderboard?tab=groups" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      Cancel
                    </Button>
                  </Link>
                  <GradientButton type="submit" className="flex-1">
                    Create Group
                  </GradientButton>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 