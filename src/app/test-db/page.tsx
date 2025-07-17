"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "@/lib/hooks/use-supabase"

export default function TestDB() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useSupabase()

  useEffect(() => {
    const testDB = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        console.log('Current user:', user)
        console.log('User error:', userError)

        if (!user) {
          setData({ error: 'No user found' })
          return
        }

        // Check groups
        const { data: groups, error: groupsError } = await supabase
          .from('groups')
          .select('*')
        
        console.log('All groups:', groups)
        console.log('Groups error:', groupsError)

        // Check group members
        const { data: members, error: membersError } = await supabase
          .from('group_members')
          .select('*')
        
        console.log('All group members:', members)
        console.log('Members error:', membersError)

        // Check if user is a member of any groups
        const { data: userMembers, error: userMembersError } = await supabase
          .from('group_members')
          .select(`
            *,
            groups (
              id,
              name,
              description,
              avatar_url,
              is_private,
              host_id
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'approved')

        console.log('User group members:', userMembers)
        console.log('User members error:', userMembersError)

        setData({
          user: user.id,
          groups,
          members,
          userMembers,
          errors: {
            groups: groupsError,
            members: membersError,
            userMembers: userMembersError
          }
        })
      } catch (error) {
        console.error('Test error:', error)
        setData({ error: error instanceof Error ? error.message : 'Unknown error' })
      } finally {
        setLoading(false)
      }
    }

    testDB()
  }, [supabase])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
} 