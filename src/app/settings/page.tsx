"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GradientButton } from "@/components/ui/gradient-button"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { toast } from "sonner"
import {
  Save,
  Upload,
  Shield,
  User,
  Settings as SettingsIcon,
  Eye,
  Globe,
  Lock,
} from "lucide-react"

export default function Settings() {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    bio: "",
    avatar_url: ""
  })



  const [privacy, setPrivacy] = useState({
    privateProfile: false,
    showAccuracy: true,
    showRankings: true,
    showGroups: true,
    dataSharing: false,
    publicLeaderboard: true,
  })

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })


  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const supabase = useSupabase()
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setProfileData({
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          username: profile.username || "",
          email: user.email || "",
          bio: profile.bio || "",
          avatar_url: profile.avatar_url || ""
        })
        
        // Load current privacy settings
        setPrivacy({
          privateProfile: profile.is_private || false,
          showAccuracy: true,
          showRankings: true,
          showGroups: true,
          dataSharing: false,
          publicLeaderboard: true,
        })
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [supabase])

  const handleProfileSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          username: profileData.username,
          bio: profileData.bio
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Changes saved successfully')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save changes')
    }
  }



  const handlePrivacySave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('profiles')
        .update({
          is_private: privacy.privateProfile
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Privacy settings saved successfully')
    } catch (error) {
      console.error('Error saving privacy settings:', error)
      toast.error('Failed to save privacy settings')
    }
  }

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords don't match")
      return
    }
    
    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      })
      
      if (error) throw error
      
      toast.success('Password updated successfully')
      setPasswords({ current: "", new: "", confirm: "" })
    } catch (error) {
      console.error('Error updating password:', error)
      toast.error('Failed to update password')
    }
  }

  const handleAvatarUpload = useCallback(async (file: File) => {
    if (!file) {
      toast.error('No file selected')
      return
    }

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('File must be an image')
      return
    }

    try {
      setIsUploading(true)
      toast.loading('Uploading avatar...')

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        throw new Error('Authentication error: ' + userError.message)
      }
      
      if (!user) {
        throw new Error('No user found')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `avatar-${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      console.log('Uploading file:', {
        fileName,
        filePath,
        fileSize: file.size,
        fileType: file.type
      })

      const { error: uploadError } = await supabase.storage
        .from('profile-avatars') // Changed from 'avatars' to 'profile-avatars'
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type
        })

      if (uploadError) {
        throw new Error('Upload error: ' + uploadError.message)
      }

      console.log('File uploaded successfully')

      const { data } = supabase.storage
        .from('profile-avatars') // Changed from 'avatars' to 'profile-avatars'
        .getPublicUrl(filePath)

      if (!data.publicUrl) {
        throw new Error('Error getting public URL')
      }

      console.log('Got public URL:', data.publicUrl)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id)

      if (updateError) {
        throw new Error('Profile update error: ' + updateError.message)
      }

      console.log('Profile updated successfully')

      // Update local state instead of reloading
      setProfileData(prev => ({
        ...prev,
        avatar_url: data.publicUrl
      }))

      toast.dismiss() // Dismiss loading toast
      toast.success('Avatar updated successfully')
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.dismiss() // Dismiss loading toast
      toast.error(error instanceof Error ? error.message : 'Failed to upload avatar')
    } finally {
      setIsUploading(false)
    }
  }, [supabase, setProfileData])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleAvatarUpload(file)
    }
  }, [handleAvatarUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleAvatarUpload(file)
    }
  }, [handleAvatarUpload])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center space-x-2">
              <SettingsIcon className="w-4 h-4" />
              <span>Account</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div 
                  className={`flex items-center space-x-4 relative ${dragActive ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="relative">
                    <Avatar className="w-20 h-20 border-2 border-transparent bg-gradient-to-br from-blue-500 to-green-500 p-[2px]">
                      <div className="rounded-full bg-white dark:bg-slate-900 w-full h-full flex items-center justify-center overflow-hidden">
                        <AvatarImage 
                          src={profileData.avatar_url || "/placeholder-user.jpg"} 
                          className="w-full h-full object-cover"
                        />
                        <AvatarFallback className="text-xl">
                          {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                        </AvatarFallback>
                      </div>
                    </Avatar>
                    <div className="absolute inset-0 rounded-full shadow-lg pointer-events-none"></div>
                  </div>
                  <div>
                    <label 
                      htmlFor="avatar-upload"
                      className={`
                        relative cursor-pointer inline-flex items-center px-4 py-2 border rounded-md
                        ${isUploading 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                        }
                      `}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload New Photo'}
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="text-sm text-slate-500 mt-2">
                      {dragActive 
                        ? 'Drop your image here'
                        : 'JPG, PNG or GIF. Max size 2MB. Drag & drop supported.'
                      }
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-4">
                    <div className="h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md"></div>
                    <div className="h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md"></div>
                    <div className="h-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                      />
                      <p className="text-sm text-slate-500">{profileData.bio.length}/500 characters</p>
                    </div>

                    <div className="pt-4 border-t">
                      <GradientButton onClick={handleProfileSave} icon={Save}>
                        Save Changes
                      </GradientButton>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>



          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your information and activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-slate-500" />
                        <Label className="text-base">Private Profile</Label>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Require approval for users to follow you and see your detailed stats
                      </p>
                    </div>
                    <Switch
                      checked={privacy.privateProfile}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, privateProfile: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-slate-500" />
                        <Label className="text-base">Show Accuracy Score</Label>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Display your accuracy percentage on your public profile
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showAccuracy}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showAccuracy: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Show Rankings</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Allow others to see your public rankings and predictions
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showRankings}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showRankings: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Show Groups</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Display the groups you've joined on your profile
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showGroups}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, showGroups: checked })}
                    />
                  </div>



                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Data Sharing</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Share anonymized data to help improve RankBet features
                      </p>
                    </div>
                    <Switch
                      checked={privacy.dataSharing}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, dataSharing: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-slate-500" />
                        <Label className="text-base">Public Leaderboard</Label>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Include your profile in public leaderboards and rankings
                      </p>
                    </div>
                    <Switch
                      checked={privacy.publicLeaderboard}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, publicLeaderboard: checked })}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <GradientButton onClick={handlePrivacySave} icon={Save}>
                    Save Settings
                  </GradientButton>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </div>
                  <Button onClick={handlePasswordChange}>Update Password</Button>
                </CardContent>
              </Card>


            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 