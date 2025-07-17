"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/lib/hooks/use-supabase"
import { toast } from "sonner"

export default function TestGroup() {
  const [loading, setLoading] = useState(false)
  const supabase = useSupabase()

  const createTestGroup = async () => {
    try {
      setLoading(true)

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        toast.error('You must be signed in')
        return
      }

      console.log('Creating test group for user:', user.id)

      // Create test group
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: 'Test Group ' + Date.now(),
          description: 'A test group to verify the system works',
          is_private: false,
          host_id: user.id,
          avatar_url: null
        })
        .select()
        .single()

      if (groupError) {
        console.error('Group creation error:', groupError)
        toast.error('Failed to create group: ' + groupError.message)
        return
      }

      console.log('Group created:', group)

      // Add user as member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'host',
          status: 'approved',
          joined_at: new Date().toISOString()
        })

      if (memberError) {
        console.error('Member creation error:', memberError)
        toast.error('Failed to add user as member: ' + memberError.message)
        return
      }

      console.log('User added as member')
      toast.success('Test group created successfully!')

      // Check if it appears in the groups query
      const { data: groupMembers, error: membersError } = await supabase
        .from('group_members')
        .select(`
          group_id,
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

      console.log('Group members query result:', { groupMembers, membersError })

      if (groupMembers && groupMembers.length > 0) {
        toast.success(`Found ${groupMembers.length} group(s) for user!`)
      } else {
        toast.error('No groups found for user after creation')
      }

    } catch (error) {
      console.error('Test error:', error)
      toast.error('Test failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Group Creation</h1>
      <Button onClick={createTestGroup} disabled={loading}>
        {loading ? 'Creating...' : 'Create Test Group'}
      </Button>
      <p className="mt-4 text-sm text-gray-600">
        This will create a test group and add you as a member to verify the group system works.
      </p>
    </div>
  )
} 