'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type LeaderboardView = 'global' | 'friends' | 'group1' | 'group2';

interface LeaderboardContextType {
  selectedView: LeaderboardView;
  setSelectedView: (view: LeaderboardView) => void;
  getViewLabel: (view: LeaderboardView) => string;
  getLeaderboardData: (view: LeaderboardView) => any[];
  getUserRank: (view: LeaderboardView) => number;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

// Mock data for different leaderboard views
const globalData = [
  {
    id: "sarah-k",
    name: "Sarah K.",
    username: "sarahk",
    accuracy: 94.2,
    rank: 1,
    avatar: "/placeholder-user.jpg",
    followers: 1247
  },
  {
    id: "mike-r",
    name: "Mike R.",
    username: "miker",
    accuracy: 91.8,
    rank: 2,
    avatar: "/placeholder-user.jpg",
    followers: 892
  },
  {
    id: "alex-m",
    name: "Alex M.",
    username: "alexm",
    accuracy: 85.1,
    rank: 3,
    avatar: "/placeholder-user.jpg",
    followers: 567
  },
  {
    id: "emma-w",
    name: "Emma W.",
    username: "emmaw",
    accuracy: 83.7,
    rank: 4,
    avatar: "/placeholder-user.jpg",
    followers: 423
  },
  {
    id: "current-user",
    name: "You",
    username: "you",
    accuracy: 87.3,
    rank: 5,
    isCurrentUser: true,
    avatar: "/placeholder-user.jpg",
    followers: 0
  }
];

const friendsData = [
  {
    id: "current-user",
    name: "You",
    username: "you",
    accuracy: 87.3,
    rank: 1,
    isCurrentUser: true,
    avatar: "/placeholder-user.jpg",
    followers: 0
  },
  {
    id: "alex-m",
    name: "Alex M.",
    username: "alexm",
    accuracy: 85.1,
    rank: 2,
    avatar: "/placeholder-user.jpg",
    followers: 567
  },
  {
    id: "emma-w",
    name: "Emma W.",
    username: "emmaw",
    accuracy: 83.7,
    rank: 3,
    avatar: "/placeholder-user.jpg",
    followers: 423
  },
  {
    id: "david-k",
    name: "David K.",
    username: "davidk",
    accuracy: 82.1,
    rank: 4,
    avatar: "/placeholder-user.jpg",
    followers: 156
  },
  {
    id: "lisa-p",
    name: "Lisa P.",
    username: "lisap",
    accuracy: 79.8,
    rank: 5,
    avatar: "/placeholder-user.jpg",
    followers: 298
  }
];

const group1Data = [
  {
    id: "expert-1",
    name: "Fantasy Pro",
    username: "fantasypro",
    accuracy: 96.1,
    rank: 1,
    avatar: "/placeholder-user.jpg",
    followers: 2435
  },
  {
    id: "expert-2",
    name: "Draft King",
    username: "draftking",
    accuracy: 94.7,
    rank: 2,
    avatar: "/placeholder-user.jpg",
    followers: 1892
  },
  {
    id: "expert-3",
    name: "Sleeper Elite",
    username: "sleeper",
    accuracy: 93.2,
    rank: 3,
    avatar: "/placeholder-user.jpg",
    followers: 1567
  },
  {
    id: "expert-4",
    name: "Waiver Wire",
    username: "waiverwire",
    accuracy: 91.8,
    rank: 4,
    avatar: "/placeholder-user.jpg",
    followers: 1234
  },
  {
    id: "current-user",
    name: "You",
    username: "you",
    accuracy: 87.3,
    rank: 15,
    isCurrentUser: true,
    avatar: "/placeholder-user.jpg",
    followers: 0
  }
];

const group2Data = [
  {
    id: "college-1",
    name: "Tommy",
    username: "tommy",
    accuracy: 89.4,
    rank: 1,
    avatar: "/placeholder-user.jpg",
    followers: 45
  },
  {
    id: "college-2",
    name: "Jake",
    username: "jake",
    accuracy: 88.1,
    rank: 2,
    avatar: "/placeholder-user.jpg",
    followers: 67
  },
  {
    id: "current-user",
    name: "You",
    username: "you",
    accuracy: 87.3,
    rank: 3,
    isCurrentUser: true,
    avatar: "/placeholder-user.jpg",
    followers: 0
  },
  {
    id: "college-3",
    name: "Brad",
    username: "brad",
    accuracy: 84.5,
    rank: 4,
    avatar: "/placeholder-user.jpg",
    followers: 23
  },
  {
    id: "college-4",
    name: "Steve",
    username: "steve",
    accuracy: 82.3,
    rank: 5,
    avatar: "/placeholder-user.jpg",
    followers: 12
  }
];

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const [selectedView, setSelectedView] = useState<LeaderboardView>('global');

  const getViewLabel = (view: LeaderboardView): string => {
    switch (view) {
      case 'global':
        return 'Global Rankings';
      case 'friends':
        return 'Friends Only';
      case 'group1':
        return 'Fantasy Experts Group';
      case 'group2':
        return 'College Friends';
      default:
        return 'Global Rankings';
    }
  };

  const getLeaderboardData = (view: LeaderboardView) => {
    switch (view) {
      case 'global':
        return globalData;
      case 'friends':
        return friendsData;
      case 'group1':
        return group1Data;
      case 'group2':
        return group2Data;
      default:
        return globalData;
    }
  };

  const getUserRank = (view: LeaderboardView): number => {
    const data = getLeaderboardData(view);
    const currentUser = data.find(user => user.isCurrentUser);
    return currentUser?.rank || 0;
  };

  return (
    <LeaderboardContext.Provider
      value={{
        selectedView,
        setSelectedView,
        getViewLabel,
        getLeaderboardData,
        getUserRank
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboard() {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
} 