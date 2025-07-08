"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { GradientButton } from "@/components/ui/gradient-button"
import { StatCard } from "@/components/ui/stat-card"
import { CircularProgress } from "@/components/ui/circular-progress"
import {
  Award,
  Edit,
  Save,
  X,
  Calendar,
  Share,
  Settings,
  BarChart3,
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  LogOut,
  Upload,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { signOut } from "@/lib/utils/client-auth"
import { toast } from "sonner"
import { useRecentActivity } from "@/lib/hooks/use-recent-activity"
import { BADGES, getTierColor, getTierBgColor, getCategoryLabel, type Badge as BadgeType } from "@/lib/constants/badges"
import Image from "next/image"

const getPositionColor = (position: string) => {
  switch (position) {
    case "QB":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    case "WR":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    case "RB":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "TE":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    default:
      return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400"
  }
}

const getPositionIconColor = (position: string) => {
  switch (position) {
    case "QB":
      return "text-red-800 dark:text-red-400"
    case "WR":
      return "text-blue-800 dark:text-blue-400"
    case "RB":
      return "text-green-800 dark:text-green-400"
    case "TE":
      return "text-yellow-800 dark:text-yellow-400"
    default:
      return "text-slate-800 dark:text-slate-400"
  }
}

const achievements = [
  {
    id: 1,
    name: "Top 1% Accuracy",
    description: "Achieved 95%+ accuracy in season rankings",
    icon: Trophy,
    earned: true,
    progress: 100,
  },
  {
    id: 2,
    name: "Consistency King",
    description: "Top 10% accuracy for 3 consecutive seasons",
    icon: Target,
    earned: true,
    progress: 100,
  },
  {
    id: 3,
    name: "Sleeper Expert",
    description: "Identified 10+ breakout players before consensus",
    icon: TrendingUp,
    earned: false,
    progress: 70,
  },
  {
    id: 4,
    name: "Social Butterfly",
    description: "Follow 50+ other users",
    icon: Award,
    earned: false,
    progress: 45,
  },
]

const mockRankings = [
  { id: 1, title: "Week 8 Overall Rankings", position: "OVR", week: 8, accuracy: 89.2, rank: 156, date: "2024-03-15" },
  { id: 2, title: "Week 8 QB Rankings", position: "QB", week: 8, accuracy: 94.1, rank: 23, date: "2024-03-15" },
  { id: 3, title: "Week 7 Overall Rankings", position: "OVR", week: 7, accuracy: 87.3, rank: 198, date: "2024-03-08" },
  { id: 4, title: "Week 7 RB Rankings", position: "RB", week: 7, accuracy: 91.8, rank: 45, date: "2024-03-08" },
  { id: 5, title: "Week 6 Overall Rankings", position: "OVR", week: 6, accuracy: 85.7, rank: 234, date: "2024-03-01" },
]

type UserProfile = {
  id: string
  username: string
  display_name: string | null
  first_name: string | null
  last_name: string | null
  bio: string | null
  avatar_url: string | null
  is_private: boolean
  is_verified: boolean
  created_at: string
}

export default function Profile() {
  const router = useRouter()
  const supabase = useSupabase()
  const searchParams = useSearchParams()
  const [isEditing, setIsEditing] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['rookie_forecaster', 'rising_star'])
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editForm, setEditForm] = useState({
    display_name: '',
    bio: '',
    first_name: '',
    last_name: '',
  })
  
  // Get real recent rankings data
  const { recentRankings, loading: rankingsLoading } = useRecentActivity()

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/signin')
          return
        }

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          toast.error('Failed to load profile')
          return
        }

        setProfile(profileData)
        setIsPrivate(profileData.is_private)
        setEditForm({
          display_name: profileData.display_name || '',
          bio: profileData.bio || '',
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
        })
        
        // Debug: Log the actual profile data to confirm it's real
        console.log('Profile data loaded:', {
          username: profileData.username,
          display_name: profileData.display_name,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          bio: profileData.bio,
          created_at: profileData.created_at
        })
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile. Please try signing out and back in.')
        
        // Add sign out button to error state
        setTimeout(() => {
          const signOutAndRedirect = async () => {
            try {
              await supabase.auth.signOut()
              router.push('/')
            } catch (signOutError) {
              console.error('Sign out error:', signOutError)
              // Force clear local storage and redirect
              localStorage.clear()
              sessionStorage.clear()
              window.location.href = '/'
            }
          }
          signOutAndRedirect()
        }, 3000) // Auto sign out after 3 seconds
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [supabase, router])

  // Handle success messages from URL params
  useEffect(() => {
    const success = searchParams.get('success')
    if (success === 'logout') {
      toast.success('You have been signed out successfully')
    }
  }, [searchParams])

  const handleSave = async () => {
    if (!profile) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: editForm.display_name,
          bio: editForm.bio,
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          is_private: isPrivate,
        })
        .eq('id', profile.id)

      if (error) throw error

      // Update local state
      setProfile({
        ...profile,
        display_name: editForm.display_name,
        bio: editForm.bio,
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        is_private: isPrivate,
      })

      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(supabase)
      router.push('/?success=logout')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to sign out')
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const { error } = await supabase.storage
        .from('avatars')
        .upload(`${profile?.id}/avatar`, file, {
          contentType: file.type,
          upsert: false,
        })

      if (error) throw error

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(`${profile?.id}/avatar`)

      if (data) {
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .update({ avatar_url: data.publicUrl })
          .eq('id', profile?.id)
          .select()
          .single()

        if (updatedProfile) {
          setProfile(updatedProfile)
          toast.success('Avatar updated successfully')
        }
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Failed to update avatar')
    }
  }

  const getInitials = (profile: UserProfile) => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    }
    if (profile.display_name) {
      const names = profile.display_name.split(' ')
      return names.length > 1 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase()
    }
    return profile.username[0].toUpperCase()
  }

  const getDisplayName = (profile: UserProfile) => {
    if (profile.first_name && profile.last_name) return `${profile.first_name} ${profile.last_name}`
    if (profile.display_name) return profile.display_name
    return profile.username
  }

  const ShareModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Share Profile</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowShareModal(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src={profile?.avatar_url || "/placeholder-user.jpg"} />
              <AvatarFallback>{profile ? getInitials(profile) : "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{profile ? getDisplayName(profile) : "Unknown User"}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">@{profile?.username || "unknown"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-slate-100 dark:bg-slate-700 rounded">
            <input
              type="text"
              value={`https://gridcasters.com/user/${profile?.username || "unknown"}`}
              readOnly
              className="flex-1 bg-transparent text-sm"
            />
            <Button
              size="sm"
              onClick={() => navigator.clipboard.writeText(`https://gridcasters.com/user/${profile?.username || "unknown"}`)}
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
              Instagram
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Profile not found</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            This might be because your email hasn't been confirmed yet or there was an issue creating your profile.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={async () => {
                try {
                  await supabase.auth.signOut()
                  router.push('/')
                } catch (error) {
                  console.error('Sign out error:', error)
                  localStorage.clear()
                  sessionStorage.clear()
                  window.location.href = '/'
                }
              }}
              className="w-full"
            >
              Sign Out & Try Again
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatar_url || "/placeholder-user.jpg"} />
                    <AvatarFallback className="text-2xl">{getInitials(profile)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
                      <Label htmlFor="avatar" className="cursor-pointer">
                        <Upload className="w-6 h-6 text-white" />
                      </Label>
                      <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {isEditing ? (
                      <Input
                        value={editForm.display_name}
                        onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                        className="text-2xl font-bold border-0 p-0 h-auto bg-transparent focus-visible:ring-0"
                        placeholder="Display Name"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold">{getDisplayName(profile)}</h1>
                    )}
                    <UIBadge variant="outline" className="text-xs">
                      <Settings className="w-3 h-3 mr-1" />
                      {isPrivate ? "Private" : "Public"}
                    </UIBadge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    @{profile.username} • Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>

                  {/* Featured Badges */}
                  <div className="flex items-center space-x-2 mb-4">
                    {selectedBadges.map((badgeId) => {
                      const badge = BADGES.find((b) => b.id === badgeId)
                      if (!badge) return null
                      return (
                        <div
                          key={badgeId}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getTierBgColor(badge.tier)}`}
                        >
                          <Image
                            src={badge.icon}
                            alt={badge.name}
                            width={16}
                            height={16}
                            className={getTierColor(badge.tier)}
                          />
                          <span className={`text-xs font-medium ${getTierColor(badge.tier)}`}>
                            {badge.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Bio */}
                  <div className="mb-4">
                    {isEditing ? (
                      <Textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        className="min-h-[80px]"
                      />
                    ) : (
                      <p className="text-slate-700 dark:text-slate-300">
                        {profile.bio || "No bio provided yet."}
                      </p>
                    )}
                  </div>

                  {/* Name Fields (only show in edit mode) */}
                  {isEditing && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                        <Input
                          id="firstName"
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                          placeholder="First Name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                        <Input
                          id="lastName"
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  )}

                  {/* Privacy Toggle (only show in edit mode) */}
                  {isEditing && (
                    <div className="flex items-center space-x-2 mb-4">
                      <Switch
                        id="private"
                        checked={isPrivate}
                        onCheckedChange={setIsPrivate}
                      />
                      <Label htmlFor="private" className="text-sm">
                        Private Profile
                      </Label>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <CircularProgress value={87.3} size="lg" />
                      <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">Overall Accuracy</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">#156</div>
                      <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">Global Rank</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">47</div>
                      <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">Total Rankings</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2">
                  {isEditing ? (
                    <>
                      <GradientButton onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </GradientButton>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <GradientButton onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </GradientButton>
                      <Button variant="outline" onClick={() => setShowShareModal(true)}>
                        <Share className="w-4 h-4 mr-2" />
                        Share Profile
                      </Button>
                      <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Rankings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Rankings</CardTitle>
                <CardDescription>Your latest player rankings and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rankingsLoading ? (
                    <div className="space-y-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="flex items-center space-x-3 p-4 border rounded-lg">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="w-16 h-6 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentRankings.length > 0 ? (
                    recentRankings.map((ranking, index) => (
                      <Link
                        key={index}
                        href={`/rankings/${ranking.id}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPositionColor(ranking.position)}`}
                            >
                              <span className={`font-bold text-xs ${getPositionIconColor(ranking.position)}`}>
                                {ranking.position}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{ranking.name}</div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">{ranking.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {ranking.accuracy !== null ? (
                              <div className="flex items-center space-x-2">
                                <CircularProgress value={ranking.accuracy} size="sm" />
                                {ranking.trend === "up" ? (
                                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                Active
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Rankings Yet</h3>
                      <p className="text-gray-600 mb-4">Create your first ranking to see activity here</p>
                      <Link href="/rankings">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Ranking
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Stats</CardTitle>
                <CardDescription>Your ranking performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Percentile Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">92nd</div>
                      <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">Percentile</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">Top 8%</div>
                      <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">Global</p>
                    </div>
                  </div>

                  {/* Position Accuracy */}
                  <div>
                    <h4 className="font-medium mb-4">Accuracy by Position</h4>
                    <div className="space-y-4">
                      {[
                        { position: "QB", accuracy: 94.2 },
                        { position: "RB", accuracy: 89.7 },
                        { position: "WR", accuracy: 85.1 },
                        { position: "TE", accuracy: 82.3 },
                      ].map((item) => (
                        <div key={item.position} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${getPositionColor(item.position)}`} />
                            <span className="font-medium">{item.position}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CircularProgress value={item.accuracy} size="sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Your earned badges and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(
                    BADGES.reduce<Record<BadgeType['category'], BadgeType[]>>((acc, badge) => {
                      if (!acc[badge.category]) acc[badge.category] = []
                      acc[badge.category].push(badge)
                      return acc
                    }, {} as Record<BadgeType['category'], BadgeType[]>)
                  ).map(([category, badges]) => (
                    <div key={category}>
                      <h4 className="font-medium mb-4">{getCategoryLabel(category as BadgeType['category'])}</h4>
                      <div className="space-y-4">
                        {badges.map((badge) => {
                          const isEarned = selectedBadges.includes(badge.id)
                          return (
                            <div
                              key={badge.id}
                              className={`flex items-center space-x-4 p-3 rounded-lg ${
                                isEarned ? getTierBgColor(badge.tier) : 'bg-slate-50 dark:bg-slate-800'
                              }`}
                            >
                              <Image
                                src={badge.icon}
                                alt={badge.name}
                                width={32}
                                height={32}
                                className={isEarned ? getTierColor(badge.tier) : 'opacity-50'}
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h5 className={`font-medium ${isEarned ? getTierColor(badge.tier) : ''}`}>
                                    {badge.name}
                                  </h5>
                                  {isEarned && (
                                    <UIBadge variant="outline" className={`text-xs ${getTierColor(badge.tier)}`}>
                                      Earned
                                    </UIBadge>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {badge.description}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showShareModal && <ShareModal />}
    </div>
  )
} 