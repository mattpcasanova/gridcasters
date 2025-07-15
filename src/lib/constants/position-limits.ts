// Position limits for rankings
export const POSITION_LIMITS = {
  QB: { rankingLimit: 12, displayLimit: 30 },
  RB: { rankingLimit: 36, displayLimit: 60 },
  WR: { rankingLimit: 36, displayLimit: 60 },
  TE: { rankingLimit: 12, displayLimit: 30 },
  OVR: { rankingLimit: 75, displayLimit: 150 },
  FLX: { rankingLimit: 60, displayLimit: 120 }
} as const;

export type PositionKey = keyof typeof POSITION_LIMITS;

export const getPositionLimits = (position: string) => {
  return POSITION_LIMITS[position as PositionKey] || { rankingLimit: 50, displayLimit: 60 };
}; 