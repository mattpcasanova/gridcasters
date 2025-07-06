"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { signOut } from "@/lib/utils/client-auth"
import { toast } from "sonner"

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
  const [selectedBadges, setSelectedBadges] = useState([1, 2])
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editForm, setEditForm] = useState({
    display_name: '',
    bio: '',
    first_name: '',
    last_name: '',
  })

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
              value={`https://rankbet.com/user/${profile?.username || "unknown"}`}
              readOnly
              className="flex-1 bg-transparent text-sm"
            />
            <Button
              size="sm"
              onClick={() => navigator.clipboard.writeText(`https://rankbet.com/user/${profile?.username || "unknown"}`)}
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
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.avatar_url || "/placeholder-user.jpg"} />
                  <AvatarFallback className="text-2xl">{getInitials(profile)}</AvatarFallback>
                </Avatar>

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
                    <Badge variant="outline" className="text-xs">
                      <Settings className="w-3 h-3 mr-1" />
                      {isPrivate ? "Private" : "Public"}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    @{profile.username} • Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>

                  {/* Featured Badges */}
                  <div className="flex items-center space-x-2 mb-4">
                    {selectedBadges.map((badgeId) => {
                      const badge = achievements.find((a) => a.id === badgeId)
                      if (!badge || !badge.earned) return null
                      return (
                        <div
                          key={badgeId}
                          className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full"
                        >
                          <Award className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">{badge.name}</span>
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
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">87.3%</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Accuracy</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">156</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Rank</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">47</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Rankings</p>
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
                      <Button variant="outline" asChild>
                        <Link href="/settings">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Link>
                      </Button>
                      <div className="border-t pt-2 mt-2">
                        <Button variant="outline" onClick={handleLogout} className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rest of the component remains the same */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Overall Accuracy"
                value="87.3%"
                icon={Target}
                trend={{ value: "+2.1%", direction: "up", icon: TrendingUp }}
                subtitle="vs last month"
              />
              <StatCard
                title="Current Rank"
                value="#156"
                icon={Trophy}
                trend={{ value: "+12 positions", direction: "up", icon: TrendingUp }}
                subtitle="positions gained"
              />
              <StatCard
                title="Total Rankings"
                value="47"
                icon={BarChart3}
                trend={{ value: "+8", direction: "up", icon: TrendingUp }}
                subtitle="this season"
              />
              <StatCard
                title="Followers"
                value="234"
                icon={Award}
                trend={{ value: "+15", direction: "up", icon: TrendingUp }}
                subtitle="new this week"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest ranking submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRankings.slice(0, 3).map((ranking) => (
                      <Link
                        key={ranking.id}
                        href={`/rankings/${ranking.id}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                          <div>
                            <p className="font-medium">{ranking.title}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{ranking.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{ranking.accuracy}%</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">#{ranking.rank}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Your accuracy over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Weekly Accuracy</span>
                      <span className="text-sm">89.7%</span>
                    </div>
                    <Progress value={89.7} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Monthly Accuracy</span>
                      <span className="text-sm">87.3%</span>
                    </div>
                    <Progress value={87.3} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Season Accuracy</span>
                      <span className="text-sm">85.1%</span>
                    </div>
                    <Progress value={85.1} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rankings">
            <Card>
              <CardHeader>
                <CardTitle>My Rankings</CardTitle>
                <CardDescription>All your submitted rankings and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Week</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRankings.map((ranking) => (
                      <TableRow key={ranking.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                        <TableCell className="font-medium">
                          <Link href={`/rankings/${ranking.id}`} className="block">
                            {ranking.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPositionColor(ranking.position)}>
                            {ranking.position}
                          </Badge>
                        </TableCell>
                        <TableCell>{ranking.week}</TableCell>
                        <TableCell>{ranking.accuracy}%</TableCell>
                        <TableCell>#{ranking.rank}</TableCell>
                        <TableCell>{ranking.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Accuracy by Position</CardTitle>
                  <CardDescription>Your performance across different positions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { position: "QB", accuracy: 94.2, color: "bg-red-500" },
                      { position: "RB", accuracy: 89.7, color: "bg-green-500" },
                      { position: "WR", accuracy: 85.1, color: "bg-blue-500" },
                      { position: "TE", accuracy: 82.3, color: "bg-yellow-500" },
                    ].map((item) => (
                      <div key={item.position} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="font-medium">{item.position}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{item.accuracy}%</span>
                          <CircularProgress value={item.accuracy} size={40} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance</CardTitle>
                  <CardDescription>Your accuracy trends over recent weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { week: "Week 8", accuracy: 89.7, trend: "up" },
                      { week: "Week 7", accuracy: 87.3, trend: "down" },
                      { week: "Week 6", accuracy: 91.2, trend: "up" },
                      { week: "Week 5", accuracy: 85.8, trend: "down" },
                    ].map((item) => (
                      <div key={item.week} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <span className="font-medium">{item.week}</span>
                        <div className="flex items-center space-x-2">
                          <span>{item.accuracy}%</span>
                          {item.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : item.trend === "down" ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : (
                            <Minus className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <Card key={achievement.id} className={achievement.earned ? "border-yellow-200 dark:border-yellow-800" : ""}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${achievement.earned ? "bg-yellow-100 dark:bg-yellow-900/20" : "bg-slate-100 dark:bg-slate-800"}`}>
                          <Icon className={`w-6 h-6 ${achievement.earned ? "text-yellow-600 dark:text-yellow-400" : "text-slate-500"}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{achievement.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{achievement.description}</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={achievement.progress} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{achievement.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showShareModal && <ShareModal />}
    </div>
  )
} 