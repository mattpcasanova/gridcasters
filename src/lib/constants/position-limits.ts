// Position limits for rankings
export const POSITION_LIMITS = {
  QB: { rankingLimit: 24, displayLimit: 30 },
  RB: { rankingLimit: 48, displayLimit: 60 },
  WR: { rankingLimit: 48, displayLimit: 60 },
  TE: { rankingLimit: 24, displayLimit: 30 },
  OVR: { rankingLimit: 120, displayLimit: 150 },
  FLX: { rankingLimit: 96, displayLimit: 120 }
} as const;

export type PositionKey = keyof typeof POSITION_LIMITS;

export const getPositionLimits = (position: string) => {
  return POSITION_LIMITS[position as PositionKey] || { rankingLimit: 50, displayLimit: 60 };
}; 