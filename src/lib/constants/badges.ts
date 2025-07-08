export interface Badge {
  id: string
  name: string
  description: string
  subtitle: string
  icon: string
  category: 'ranking' | 'performance' | 'consistency' | 'social' | 'position' | 'seasonal' | 'milestone' | 'special'
  tier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'platinum' | 'verified' | 'special' | 'legacy'
  requirement: number
}

export const BADGES: Badge[] = [
  // Ranking Creation Badges
  {
    id: 'rookie_forecaster',
    name: 'Rookie Forecaster',
    description: 'Created your first ranking',
    subtitle: 'Welcome to GridCasters! You\'ve made your first prediction.',
    icon: '/badges/rookie_forecaster_bronze.png',
    category: 'ranking',
    tier: 'bronze',
    requirement: 1
  },
  {
    id: 'active_forecaster',
    name: 'Active Forecaster',
    description: 'Created 20 rankings',
    subtitle: 'Building momentum! 20 rankings shows real commitment.',
    icon: '/badges/active_forecaster_silver.png',
    category: 'ranking',
    tier: 'silver',
    requirement: 20
  },
  {
    id: 'seasoned_forecaster',
    name: 'Seasoned Forecaster',
    description: 'Created 50 rankings',
    subtitle: 'You\'re becoming a forecasting veteran with 50 rankings.',
    icon: '/badges/seasoned_forecaster_gold.png',
    category: 'ranking',
    tier: 'gold',
    requirement: 50
  },
  {
    id: 'elite_forecaster',
    name: 'Elite Forecaster',
    description: 'Created 100 rankings',
    subtitle: 'Forecasting legend! 100+ rankings shows true dedication.',
    icon: '/badges/elite_forecaster_diamond.png',
    category: 'ranking',
    tier: 'diamond',
    requirement: 100
  },

  // Performance Percentile Badges
  {
    id: 'rising_star',
    name: 'Rising Star',
    description: 'Reached top 20th percentile',
    subtitle: 'You\'re in the top 20% of forecasters. Keep climbing!',
    icon: '/badges/rising_forecaster_bronze.png',
    category: 'performance',
    tier: 'bronze',
    requirement: 80
  },
  {
    id: 'top_performer',
    name: 'Top Performer',
    description: 'Reached top 10th percentile',
    subtitle: 'Elite territory! You\'re in the top 10% of all forecasters.',
    icon: '/badges/top_performer_silver.png',
    category: 'performance',
    tier: 'silver',
    requirement: 90
  },
  {
    id: 'super_forecaster',
    name: 'Super Forecaster',
    description: 'Reached top 5th percentile',
    subtitle: 'Exceptional forecasting skills! Top 5% of all users.',
    icon: '/badges/super_forecaster_gold.png',
    category: 'performance',
    tier: 'gold',
    requirement: 95
  },
  {
    id: 'grid_genius',
    name: 'Grid Genius',
    description: 'Reached top 1st percentile',
    subtitle: 'The 1% club. You\'re among the absolute best forecasters.',
    icon: '/badges/grid_genius_diamond.png',
    category: 'performance',
    tier: 'diamond',
    requirement: 99
  },

  // Consistency Badges
  {
    id: 'steady_eddie',
    name: 'Steady Eddie',
    description: 'Maintained top 70th percentile across 3 rankings',
    subtitle: 'Consistent performance! 3 rankings with solid results.',
    icon: '/badges/steady_eddie_bronze.png',
    category: 'consistency',
    tier: 'bronze',
    requirement: 3
  },
  {
    id: 'consistency_king',
    name: 'Consistency King',
    description: 'Maintained top 60th percentile across 5 rankings',
    subtitle: 'Rock-solid forecasting! 5 rankings with strong performance.',
    icon: '/badges/consistency_king_silver.png',
    category: 'consistency',
    tier: 'silver',
    requirement: 5
  },
  {
    id: 'reliability_master',
    name: 'Reliability Master',
    description: 'Maintained top 50th percentile across 10 rankings',
    subtitle: 'Incredibly reliable! 10 rankings with top-half performance.',
    icon: '/badges/placeholder.png',
    category: 'consistency',
    tier: 'gold',
    requirement: 10
  },
  {
    id: 'forecasting_machine',
    name: 'Forecasting Machine',
    description: 'Maintained top 40th percentile across 20 rankings',
    subtitle: 'Unstoppable consistency! 20 rankings with elite performance.',
    icon: '/badges/placeholder.png',
    category: 'consistency',
    tier: 'diamond',
    requirement: 20
  },

  // Social & Community Badges
  {
    id: 'team_player',
    name: 'Team Player',
    description: 'Joined your first group',
    subtitle: 'Welcome to the community! You\'ve joined your first group.',
    icon: '/badges/placeholder.png',
    category: 'social',
    tier: 'bronze',
    requirement: 1
  },
  {
    id: 'group_leader',
    name: 'Group Leader',
    description: 'Created a group with 10+ members',
    subtitle: 'Natural leader! You\'ve built a thriving forecasting group.',
    icon: '/badges/placeholder.png',
    category: 'social',
    tier: 'silver',
    requirement: 10
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Gained 100+ followers',
    subtitle: 'People trust your predictions! 100+ followers achieved.',
    icon: '/badges/placeholder.png',
    category: 'social',
    tier: 'gold',
    requirement: 100
  },
  {
    id: 'grid_celebrity',
    name: 'Grid Celebrity',
    description: 'Gained 500+ followers',
    subtitle: 'Forecasting superstar! 500+ followers follow your predictions.',
    icon: '/badges/placeholder.png',
    category: 'social',
    tier: 'diamond',
    requirement: 500
  },

  // Specialty Position Badges
  {
    id: 'qb_whisperer',
    name: 'QB Whisperer',
    description: 'Top 10th percentile on 3 quarterback rankings',
    subtitle: 'You understand quarterbacks like no other!',
    icon: '/badges/placeholder.png',
    category: 'position',
    tier: 'gold',
    requirement: 3
  },
  {
    id: 'rb_oracle',
    name: 'RB Oracle',
    description: 'Top 10th percentile on 3 running back rankings',
    subtitle: 'Running back predictions are your specialty!',
    icon: '/badges/placeholder.png',
    category: 'position',
    tier: 'gold',
    requirement: 3
  },
  {
    id: 'wr_savant',
    name: 'WR Savant',
    description: 'Top 10th percentile on 3 wide receiver rankings',
    subtitle: 'Wide receiver predictions are your forte!',
    icon: '/badges/placeholder.png',
    category: 'position',
    tier: 'gold',
    requirement: 3
  },
  {
    id: 'te_expert',
    name: 'TE Expert',
    description: 'Top 10th percentile on 3 tight end rankings',
    subtitle: 'Tight end specialist! Most users struggle here.',
    icon: '/badges/placeholder.png',
    category: 'position',
    tier: 'gold',
    requirement: 3
  },
  {
    id: 'position_master',
    name: 'Position Master',
    description: 'Top 10th percentile across all 4 positions',
    subtitle: 'Ultimate versatility! Elite performance across every position.',
    icon: '/badges/placeholder.png',
    category: 'position',
    tier: 'diamond',
    requirement: 4
  },

  // Seasonal Badges
  {
    id: 'week_1_prophet',
    name: 'Week 1 Prophet',
    description: 'Top 15th percentile on Week 1 rankings',
    subtitle: 'Week 1 is chaos, but you saw through it! Elite early performance.',
    icon: '/badges/placeholder.png',
    category: 'seasonal',
    tier: 'silver',
    requirement: 85
  },
  {
    id: 'playoff_predictor',
    name: 'Playoff Predictor',
    description: 'Top 10th percentile on playoff week rankings',
    subtitle: 'When it matters most! Clutch playoff predictions.',
    icon: '/badges/placeholder.png',
    category: 'seasonal',
    tier: 'gold',
    requirement: 90
  },
  {
    id: 'season_sage',
    name: 'Season Sage',
    description: 'Top 5th percentile for entire season',
    subtitle: 'Season-long excellence! Sustained elite performance.',
    icon: '/badges/placeholder.png',
    category: 'seasonal',
    tier: 'diamond',
    requirement: 95
  },

  // Milestone Badges
  {
    id: 'first_timer',
    name: 'First Timer',
    description: 'Created your first ranking',
    subtitle: 'Everyone starts somewhere! Your forecasting journey begins.',
    icon: '/badges/placeholder.png',
    category: 'milestone',
    tier: 'bronze',
    requirement: 1
  },
  {
    id: 'perfect_prophet',
    name: 'Perfect Prophet',
    description: 'Reached top 1st percentile on any ranking',
    subtitle: 'Elite of the elite! You achieved the highest forecasting tier.',
    icon: '/badges/placeholder.png',
    category: 'milestone',
    tier: 'platinum',
    requirement: 99
  },
  {
    id: 'triple_threat',
    name: 'Triple Threat',
    description: 'Top 10th percentile on 3 different ranking types',
    subtitle: 'Versatile excellence! Elite performance across multiple formats.',
    icon: '/badges/placeholder.png',
    category: 'milestone',
    tier: 'gold',
    requirement: 3
  },
  {
    id: 'gridcasters_veteran',
    name: 'GridCasters Veteran',
    description: 'Member for 365+ days with 50+ rankings',
    subtitle: 'True GridCasters loyalty! A year of dedicated forecasting.',
    icon: '/badges/placeholder.png',
    category: 'milestone',
    tier: 'diamond',
    requirement: 365
  },

  // Special Recognition Badges
  {
    id: 'expert_analyst',
    name: 'Expert Analyst',
    description: 'GridCasters verified expert',
    subtitle: 'Officially recognized for exceptional forecasting expertise.',
    icon: '/badges/placeholder.png',
    category: 'special',
    tier: 'verified',
    requirement: 0
  },
  {
    id: 'community_champion',
    name: 'Community Champion',
    description: 'Outstanding community contribution',
    subtitle: 'Helped make GridCasters better for everyone!',
    icon: '/badges/placeholder.png',
    category: 'special',
    tier: 'special',
    requirement: 0
  },
  {
    id: 'beta_tester',
    name: 'Beta Tester',
    description: 'Participated in GridCasters beta',
    subtitle: 'Thanks for helping build GridCasters from the ground up!',
    icon: '/badges/placeholder.png',
    category: 'special',
    tier: 'legacy',
    requirement: 0
  },
  {
    id: 'founding_forecaster',
    name: 'Founding Forecaster',
    description: 'First 1000 users on GridCasters',
    subtitle: 'You were here from the beginning! Founding member status.',
    icon: '/badges/placeholder.png',
    category: 'special',
    tier: 'legacy',
    requirement: 0
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
    case 'platinum':
      return 'text-purple-400 dark:text-purple-300'
    case 'verified':
      return 'text-green-500 dark:text-green-400'
    case 'special':
      return 'text-pink-500 dark:text-pink-400'
    case 'legacy':
      return 'text-indigo-500 dark:text-indigo-400'
  }
}

export const getTierBgColor = (tier: Badge['tier']) => {
  switch (tier) {
    case 'bronze':
      return 'bg-amber-50/50 dark:bg-amber-900/20'
    case 'silver':
      return 'bg-slate-50/50 dark:bg-slate-800/50'
    case 'gold':
      return 'bg-yellow-50/50 dark:bg-yellow-900/20'
    case 'diamond':
      return 'bg-blue-50/50 dark:bg-blue-900/20'
    case 'platinum':
      return 'bg-purple-50/50 dark:bg-purple-900/20'
    case 'verified':
      return 'bg-green-50/50 dark:bg-green-900/20'
    case 'special':
      return 'bg-pink-50/50 dark:bg-pink-900/20'
    case 'legacy':
      return 'bg-indigo-50/50 dark:bg-indigo-900/20'
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
    case 'social':
      return 'Social & Community'
    case 'position':
      return 'Specialty Position'
    case 'seasonal':
      return 'Seasonal'
    case 'milestone':
      return 'Milestone'
    case 'special':
      return 'Special Recognition'
  }
} 