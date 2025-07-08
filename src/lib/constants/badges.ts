export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'ranking' | 'performance' | 'consistency'
  tier: 'bronze' | 'silver' | 'gold' | 'diamond'
  requirement: number
}

export const BADGES: Badge[] = [
  // Ranking Creation Badges
  {
    id: 'rookie_forecaster',
    name: 'Rookie Forecaster',
    description: 'Created your first ranking',
    icon: '/badges/rookie_forecaster.png',
    category: 'ranking',
    tier: 'bronze',
    requirement: 1
  },
  {
    id: 'active_forecaster',
    name: 'Active Forecaster',
    description: 'Created 20 rankings',
    icon: '/badges/active_forecaster.png',
    category: 'ranking',
    tier: 'silver',
    requirement: 20
  },
  {
    id: 'seasoned_forecaster',
    name: 'Seasoned Forecaster',
    description: 'Created 50 rankings',
    icon: '/badges/seasoned_forecaster.png',
    category: 'ranking',
    tier: 'gold',
    requirement: 50
  },
  {
    id: 'elite_forecaster',
    name: 'Elite Forecaster',
    description: 'Created 100 rankings',
    icon: '/badges/elite_forecaster.png',
    category: 'ranking',
    tier: 'diamond',
    requirement: 100
  },

  // Performance Percentile Badges
  {
    id: 'rising_star',
    name: 'Rising Star',
    description: 'Reached top 20th percentile',
    icon: '/badges/rising_star.png',
    category: 'performance',
    tier: 'bronze',
    requirement: 80 // 80th percentile
  },
  {
    id: 'top_performer',
    name: 'Top Performer',
    description: 'Reached top 10th percentile',
    icon: '/badges/top_performer.png',
    category: 'performance',
    tier: 'silver',
    requirement: 90 // 90th percentile
  },
  {
    id: 'super_forecaster',
    name: 'Super Forecaster',
    description: 'Reached top 5th percentile',
    icon: '/badges/super_forecaster.png',
    category: 'performance',
    tier: 'gold',
    requirement: 95 // 95th percentile
  },
  {
    id: 'grid_genius',
    name: 'Grid Genius',
    description: 'Reached top 1st percentile',
    icon: '/badges/grid_genius.png',
    category: 'performance',
    tier: 'diamond',
    requirement: 99 // 99th percentile
  },

  // Consistency Badges
  {
    id: 'steady_eddie',
    name: 'Steady Eddie',
    description: 'Maintained top 70th percentile across 3 rankings',
    icon: '/badges/steady_eddie.png',
    category: 'consistency',
    tier: 'bronze',
    requirement: 3
  },
  {
    id: 'consistency_king',
    name: 'Consistency King',
    description: 'Maintained top 60th percentile across 5 rankings',
    icon: '/badges/consistency_king.png',
    category: 'consistency',
    tier: 'silver',
    requirement: 5
  },
  {
    id: 'reliability_master',
    name: 'Reliability Master',
    description: 'Maintained top 50th percentile across 10 rankings',
    icon: '/badges/reliability_master.png',
    category: 'consistency',
    tier: 'gold',
    requirement: 10
  },
  {
    id: 'forecasting_machine',
    name: 'Forecasting Machine',
    description: 'Maintained top 40th percentile across 20 rankings',
    icon: '/badges/forecasting_machine.png',
    category: 'consistency',
    tier: 'diamond',
    requirement: 20
  }
]

export const getTierColor = (tier: Badge['tier']) => {
  switch (tier) {
    case 'bronze':
      return 'text-amber-600 dark:text-amber-400'
    case 'silver':
      return 'text-slate-400 dark:text-slate-300'
    case 'gold':
      return 'text-yellow-500 dark:text-yellow-400'
    case 'diamond':
      return 'text-blue-400 dark:text-blue-300'
  }
}

export const getTierBgColor = (tier: Badge['tier']) => {
  switch (tier) {
    case 'bronze':
      return 'bg-amber-50 dark:bg-amber-900/20'
    case 'silver':
      return 'bg-slate-100 dark:bg-slate-800'
    case 'gold':
      return 'bg-yellow-50 dark:bg-yellow-900/20'
    case 'diamond':
      return 'bg-blue-50 dark:bg-blue-900/20'
  }
}

export const getCategoryLabel = (category: Badge['category']) => {
  switch (category) {
    case 'ranking':
      return 'Ranking Creation'
    case 'performance':
      return 'Performance'
    case 'consistency':
      return 'Consistency'
  }
} 