import React from 'react';
import { Metadata } from 'next';
import { requireAuth } from '@/lib/utils/server-auth';

export const metadata: Metadata = {
  title: 'Dashboard - RankBet',
  description: 'Your RankBet dashboard',
};

export default async function DashboardPage() {
  await requireAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your ranking overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Quick Actions */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
          <div className="space-y-2">
            <a
              href="/rankings/new"
              className="block rounded-md bg-brand-gradient px-4 py-2 text-center text-white hover:opacity-90"
            >
              Create New Ranking
            </a>
            <a
              href="/find-friends"
              className="block rounded-md border border-gray-300 px-4 py-2 text-center text-gray-700 hover:bg-gray-50"
            >
              Find Friends
            </a>
          </div>
        </div>

        {/* Recent Rankings */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Rankings</h2>
          <div className="space-y-2">
            <p className="text-gray-600">No rankings yet. Create your first one!</p>
          </div>
        </div>

        {/* Accuracy Stats */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Accuracy Stats</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Overall Accuracy</span>
              <span className="font-medium">--</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Rankings Created</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Best Position</span>
              <span className="font-medium">--</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <div className="rounded-lg border bg-white p-6">
          <p className="text-gray-600">No recent activity to show.</p>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Upcoming Deadlines</h2>
        <div className="rounded-lg border bg-white p-6">
          <p className="text-gray-600">No upcoming deadlines.</p>
        </div>
      </div>
    </div>
  );
} 