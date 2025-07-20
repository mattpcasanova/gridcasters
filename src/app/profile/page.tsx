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
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { signOut } from "@/lib/utils/client-auth"
import { toast } from "sonner"
import { useRecentActivity } from "@/lib/hooks/use-recent-activity"
import { BADGES, getTierColor, getTierBgColor, getCategoryLabel, getBadgeIconBg, type Badge as BadgeType } from "@/lib/constants/badges"
import Image from "next/image"

const getPositionColor = (position: string) => {
  switch (position) {
    case "QB":
      return "bg-red-500 text-white"
    case "WR":
      return "bg-blue-500 text-white"
    case "RB":
      return "bg-green-500 text-white"
    case "TE":
      return "bg-yellow-500 text-white"
    case "FLX":
      return "bg-purple-500 text-white"
    default:
      return "bg-slate-500 text-white"
  }
}

const getPositionIconColor = (position: string) => {
  switch (position) {
    case 'QB': return 'text-red-500'
    case 'RB': return 'text-green-500'
    case 'WR': return 'text-blue-500'
    case 'TE': return 'text-yellow-500'
    case 'OVR': return 'text-purple-500'
    case 'FLX': return 'text-indigo-500'
    default: return 'text-gray-500'
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
  const [isSelectingBadges, setIsSelectingBadges] = useState(false)
  const [isCheckingBadges, setIsCheckingBadges] = useState(false)
  const [earnedBadges, setEarnedBadges] = useState<{[key: string]: { earned: boolean, progress: number }}>({})
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])
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

  // Fetch badge progress and selected badges
  useEffect(() => {
    const fetchBadgeData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch badge progress
        const { data: badgeProgress, error } = await supabase
          .from('badge_progress')
          .select('badge_id, earned, progress')
          .eq('user_id', user.id)

        if (error) {
          console.error('Error fetching badge progress:', error)
          return
        }

        // Convert to the expected format
        const badgeData: {[key: string]: { earned: boolean, progress: number }} = {}
        badgeProgress?.forEach((bp: any) => {
          badgeData[bp.badge_id] = {
            earned: bp.earned,
            progress: bp.progress
          }
        })

        setEarnedBadges(badgeData)

        // Fetch selected badges
        const { data: selectedBadgesData, error: selectedError } = await supabase
          .from('user_badge_selections')
          .select('badge_id')
          .eq('user_id', user.id)
          .order('display_order', { ascending: true })

        if (selectedError) {
          console.error('Error fetching selected badges:', selectedError)
          return
        }

        const selectedBadgeIds = selectedBadgesData?.map((item: any) => item.badge_id) || []
        setSelectedBadges(selectedBadgeIds)

        // Debug: Log badge data
        console.log('Badge progress data:', badgeProgress)
        console.log('Processed badge data:', badgeData)
        console.log('Selected badges:', selectedBadgeIds)
      } catch (error) {
        console.error('Error fetching badge data:', error)
      }
    }

    fetchBadgeData()
  }, [supabase])

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
        .from('profile-avatars')
        .upload(`${profile?.id}/avatar`, file, {
          contentType: file.type,
          upsert: false,
        })

      if (error) throw error

      const { data } = supabase.storage
        .from('profile-avatars')
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

  const toggleBadgeSelection = async (badgeId: string) => {
    if (!earnedBadges[badgeId]?.earned) return
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const newSelectedBadges = selectedBadges.includes(badgeId)
      ? selectedBadges.filter(id => id !== badgeId)
      : selectedBadges.length < 3
      ? [...selectedBadges, badgeId]
      : selectedBadges

    setSelectedBadges(newSelectedBadges)

    // Save to database
    try {
      const { error } = await supabase.rpc('upsert_user_badge_selections', {
        user_uuid: user.id,
        badge_ids: newSelectedBadges
      })

      if (error) {
        console.error('Error saving badge selections:', error)
        toast.error('Failed to save badge selection')
        // Revert the state if save failed
        setSelectedBadges(selectedBadges)
      } else {
        toast.success(newSelectedBadges.length > selectedBadges.length ? 'Badge added to profile' : 'Badge removed from profile')
      }
    } catch (error) {
      console.error('Error saving badge selections:', error)
      toast.error('Failed to save badge selection')
      // Revert the state if save failed
      setSelectedBadges(selectedBadges)
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
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              {/* Profile Info */}
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-start space-x-4 sm:space-x-6 flex-1">
                  {/* Profile Picture */}
                  <div className="relative group">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-transparent bg-gradient-to-br from-blue-500 to-green-500 p-[2px]">
                      <div className="rounded-full bg-white dark:bg-slate-900 w-full h-full flex items-center justify-center overflow-hidden">
                        <AvatarImage 
                          src={profile?.avatar_url || "/placeholder-user.jpg"} 
                          className="w-full h-full object-cover"
                        />
                        <AvatarFallback className="text-lg sm:text-xl">{profile ? getInitials(profile) : "U"}</AvatarFallback>
                      </div>
                    </Avatar>
                    {isEditing && (
                      <label 
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                        htmlFor="avatar"
                      >
                        <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        <input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                    <div className="absolute inset-0 rounded-full shadow-lg pointer-events-none"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      {isEditing ? (
                        <Input
                          value={editForm.display_name}
                          onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                          className="text-xl sm:text-2xl font-bold border-0 p-0 h-auto bg-transparent focus-visible:ring-0"
                          placeholder="Display Name"
                        />
                      ) : (
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{getDisplayName(profile)}</h1>
                      )}
                      <UIBadge variant="outline" className="text-xs w-fit">Public</UIBadge>
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">@{profile?.username} • Joined {new Date(profile?.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Button 
                    variant="outline" 
                    onClick={async () => {
                      setIsCheckingBadges(true);
                      try {
                        const response = await fetch('/api/badges/check', { method: 'POST' });
                        if (response.ok) {
                          const data = await response.json();
                          if (data.newlyEarned && data.newlyEarned.length > 0) {
                            toast.success(`🎉 Earned ${data.newlyEarned.length} new badge(s)!`);
                            // Refresh badge progress
                            window.location.reload();
                          } else {
                            toast.info('No new badges earned yet. Keep creating rankings!');
                          }
                        }
                      } catch (error) {
                        console.error('Error checking badges:', error);
                        toast.error('Failed to check badges');
                      } finally {
                        setIsCheckingBadges(false);
                      }
                    }}
                    disabled={isCheckingBadges}
                    className="w-full sm:flex-none text-xs sm:text-sm"
                  >
                    <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${isCheckingBadges ? 'animate-spin' : ''}`} />
                    Check Badges
                  </Button>
                  <Link href="/settings" className="w-full sm:flex-none">
                    <Button 
                      variant="outline" 
                      className="w-full text-xs sm:text-sm"
                    >
                      <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Settings
                    </Button>
                  </Link>
                  {isEditing ? (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full sm:flex-none text-xs sm:text-sm"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Cancel
                      </Button>
                      <GradientButton
                        onClick={handleSave}
                        className="w-full sm:flex-none text-xs sm:text-sm"
                      >
                        <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Save
                      </GradientButton>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      className="w-full sm:flex-none text-xs sm:text-sm border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-4">
                {selectedBadges.map((badgeId) => {
                  const badge = BADGES.find((b) => b.id === badgeId)
                  if (!badge) return null
                  const badgeStatus = earnedBadges[badgeId]
                  return (
                    <div
                      key={badgeId}
                      className={`relative flex items-center space-x-3 p-4 rounded-lg ${getTierBgColor(badge.tier)} transition-all`}
                    >
                      <div
                        className={`relative w-20 h-20 flex items-center justify-center rounded-lg shadow-sm transition-all duration-200 hover:scale-105 ${
                          badgeStatus?.earned || selectedBadges.includes(badgeId)
                            ? getBadgeIconBg(badge.id, badge.tier)
                            : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      >
                        <Image
                          src={badge.icon}
                          alt={badge.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain p-1"
                          quality={100}
                        />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${getTierColor(badge.tier)}`}>{badge.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{badge.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {isEditing ? (
                <Textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="mt-4"
                />
              ) : (
                <p className="text-slate-700 dark:text-slate-300">{profile?.bio}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Rankings</CardTitle>
                    <CardDescription>Your latest player rankings and their performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentRankings?.map((ranking) => (
                        <Link
                          key={ranking.id}
                          href={`/rankings/${ranking.id}`}
                        >
                          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base ${getPositionColor(ranking.position)}`}>
                                {ranking.position}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-sm sm:text-base truncate">{ranking.name}</h3>
                                <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                  <UIBadge className={`${getPositionColor(ranking.position)} text-xs`} variant="outline">
                                    {ranking.position}
                                  </UIBadge>
                                  <span>{ranking.date}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="hidden sm:block">
                                {ranking.accuracy !== null ? (
                                  <CircularProgress value={ranking.accuracy} size={40} showText />
                                ) : (
                                  <div className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                    <span className="text-xs sm:text-sm font-medium text-slate-500">--</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                      
                      {/* See All Rankings Button */}
                      <div className="pt-4 border-t">
                        <Link href="/profile/all-rankings">
                          <Button variant="outline" className="w-full">
                            See All Rankings
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analytics</CardTitle>
                    <CardDescription>Detailed breakdown of your ranking performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <Card className={`p-4 ${getTierBgColor('bronze')}`}>
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Overall Accuracy</p>
                            <div className="flex items-center justify-center mt-2">
                              <div className="w-[60px] h-[60px] rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                <span className="text-sm font-medium text-slate-500">--</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className={`p-4 ${getTierBgColor('bronze')}`}>
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Global Rank</p>
                            <h2 className="text-2xl font-bold">Pending</h2>
                          </div>
                        </div>
                      </Card>

                      <Card className={`p-4 ${getTierBgColor('bronze')}`}>
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Rankings</p>
                            <h2 className="text-2xl font-bold">5</h2>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {/* Position Accuracy */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Accuracy by Position</h3>
                        <div className="space-y-3">
                          {[
                            { position: 'FLX', accuracy: 0 },
                            { position: 'QB', accuracy: 0 },
                            { position: 'RB', accuracy: 0 },
                            { position: 'WR', accuracy: 0 },
                            { position: 'TE', accuracy: 0 }
                          ].map(({ position, accuracy }) => (
                            <div key={position} className="flex items-center justify-between">
                              <span className={`px-2 py-1 rounded-md text-sm font-medium ${getPositionColor(position)}`}>
                                {position}
                              </span>
                              <div className="w-[60px] h-[60px] rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                <span className="text-sm font-medium text-slate-500">--</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Percentile Rankings */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Percentile Rankings</h3>
                        <div className="space-y-3">
                          {[
                            { position: 'FLX', percentile: 0 },
                            { position: 'QB', percentile: 0 },
                            { position: 'RB', percentile: 0 },
                            { position: 'WR', percentile: 0 },
                            { position: 'TE', percentile: 0 }
                          ].map(({ position, percentile }) => (
                            <div key={position} className="flex items-center justify-between">
                              <span className={`px-2 py-1 rounded-md text-sm font-medium ${getPositionColor(position)}`}>
                                {position}
                              </span>
                              <div className="w-[60px] h-[60px] rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                <span className="text-sm font-medium text-slate-500">--</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* All Time Data */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white">All Time Data</h3>
                        <div className="space-y-3">
                          {[
                            { label: 'Top 10 Percentile', value: 0 },
                            { label: 'Top 20 Percentile', value: 0 },
                            { label: 'Top 30 Percentile', value: 0 },
                            { label: 'Perfect Picks', value: 0 },
                            { label: '95%+ Accuracy Score', value: 0 },
                            { label: '90%+ Accuracy Score', value: 0 },
                            { label: '80%+ Accuracy Score', value: 0 }
                          ].map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between">
                              <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold">{value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Badges and milestones earned on RankBet. Click to showcase up to 3 badges on your profile.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Group badges by category */}
                    {(['ranking', 'performance', 'consistency', 'social', 'position', 'seasonal', 'milestone', 'special'] as BadgeType['category'][]).map(category => {
                      const categoryBadges = BADGES.filter(badge => badge.category === category)
                      if (categoryBadges.length === 0) return null

                      return (
                        <div key={category} className="mb-8 last:mb-0">
                          <h2 className="text-xl font-semibold mb-4">{getCategoryLabel(category)}</h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryBadges.map((badge) => {
                              const badgeStatus = earnedBadges[badge.id]
                              const isSelected = selectedBadges.includes(badge.id)
                              return (
                                <button
                                  key={badge.id}
                                  onClick={() => toggleBadgeSelection(badge.id)}
                                  className={`p-4 border rounded-lg text-left transition-all ${getTierBgColor(badge.tier)} ${
                                    badge.tier === 'bronze'
                                      ? 'border-amber-200 dark:border-amber-800'
                                      : badge.tier === 'silver'
                                      ? 'border-slate-200 dark:border-slate-700'
                                      : badge.tier === 'gold'
                                      ? 'border-yellow-200 dark:border-yellow-800'
                                      : badge.tier === 'diamond'
                                      ? 'border-blue-200 dark:border-blue-800'
                                      : badge.tier === 'platinum'
                                      ? 'border-purple-200 dark:border-purple-800'
                                      : badge.tier === 'verified'
                                      ? 'border-green-200 dark:border-green-800'
                                      : badge.tier === 'special'
                                      ? 'border-blue-200 dark:border-blue-800'
                                      : 'border-indigo-200 dark:border-indigo-800'
                                  } ${
                                    isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                                  } ${
                                    !badgeStatus?.earned ? 'opacity-75' : ''
                                  }`}
                                >
                                  <div className="flex items-start space-x-3">
                                    <div
                                      className={`rounded-lg shadow-sm transition-all duration-200 hover:scale-105 ${
                                        badgeStatus?.earned
                                          ? getBadgeIconBg(badge.id, badge.tier)
                                          : "bg-slate-300 dark:bg-slate-600"
                                      }`}
                                    >
                                      <div className="relative w-20 h-20 flex items-center justify-center">
                                        <Image
                                          src={badge.icon}
                                          alt={badge.name}
                                          width={80}
                                          height={80}
                                          className="w-full h-full object-contain p-1"
                                          quality={100}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <h3 className={`font-semibold ${getTierColor(badge.tier)}`}>{badge.name}</h3>
                                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{badge.description}</p>
                                      <p className="text-xs text-slate-500 dark:text-slate-500">{badge.subtitle}</p>
                                      {badgeStatus?.earned ? (
                                        <UIBadge variant="outline" className={`text-xs mt-2 ${isSelected ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : ''}`}>
                                          {isSelected ? 'Selected' : 'Earned'}
                                        </UIBadge>
                                      ) : (
                                        <div className="space-y-1 mt-2">
                                          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                                            <span>Progress</span>
                                            <span>{badgeStatus?.progress || 0}%</span>
                                          </div>
                                          <Progress value={badgeStatus?.progress || 0} className="h-1" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {showShareModal && <ShareModal />}
      </div>
    </div>
  )
} 