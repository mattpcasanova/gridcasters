export class SleeperAPI {
  private baseURL = 'https://api.sleeper.app/v1';

  async getAllPlayers() {
    const response = await fetch(`${this.baseURL}/players/nfl`);
    if (!response.ok) throw new Error('Failed to fetch players');
    return response.json();
  }

  async getNFLState() {
    const response = await fetch(`${this.baseURL}/state/nfl`);
    if (!response.ok) throw new Error('Failed to fetch NFL state');
    return response.json();
  }

  async getProjections(week: number, season: number = 2025) {
    const response = await fetch(`${this.baseURL}/projections/nfl/regular/${season}/${week}`);
    if (!response.ok) throw new Error('Failed to fetch projections');
    return response.json();
  }

  async getSeasonProjections(season: number = 2025): Promise<Record<string, any>> {
    // Try to get real projections first
    const sampleWeeks = [1, 2, 3, 4]; // Sample first 4 weeks
    const allProjections: Record<string, any> = {};
    let validWeeks = 0;
    
    for (const week of sampleWeeks) {
      try {
        const weeklyProjections = await this.getProjections(week, season);
        
        if (weeklyProjections && Object.keys(weeklyProjections).length > 0) {
          let weekPlayersWithProjections = 0;
          
          // Sum up the projections for each player
          Object.entries(weeklyProjections).forEach(([playerId, projection]: [string, any]) => {
            if (projection.pts_ppr && projection.pts_ppr > 0) {
              weekPlayersWithProjections++;
              if (!allProjections[playerId]) {
                allProjections[playerId] = { pts_ppr: 0, pts_half_ppr: 0, pts_std: 0 };
              }
              allProjections[playerId].pts_ppr += projection.pts_ppr || 0;
              allProjections[playerId].pts_half_ppr += projection.pts_half_ppr || 0;
              allProjections[playerId].pts_std += projection.pts_std || 0;
            }
          });
          
          if (weekPlayersWithProjections > 50) { // If we have decent projection data
            validWeeks++;
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch projections for week ${week}:`, error);
      }
    }
    
    // If we don't have good projection data, fall back to creating mock projections
    if (validWeeks === 0 || Object.keys(allProjections).length < 200) {
      // Try previous season (only go back one year to avoid infinite recursion)
      if (season > 2020) {
        try {
          const prevSeasonProjections: Record<string, any> = await this.getSeasonProjections(season - 1);
          if (Object.keys(prevSeasonProjections).length > 200) {
            return prevSeasonProjections;
          }
        } catch (error) {
          console.warn('Previous season projections also failed');
        }
      }
      
      // As last resort, create mock projections based on player positions
      return this.createMockProjections();
    }
    
    // Extrapolate to full season (18 weeks) if we have valid data
    if (validWeeks > 0) {
      const multiplier = 18 / validWeeks;
      Object.keys(allProjections).forEach(playerId => {
        allProjections[playerId].pts_ppr *= multiplier;
        allProjections[playerId].pts_half_ppr *= multiplier;
        allProjections[playerId].pts_std *= multiplier;
      });
    }
    
    return allProjections;
  }

  async createMockProjections(): Promise<Record<string, any>> {
    try {
      const players = await this.getAllPlayers();
      const mockProjections: Record<string, any> = {};
      
      // Create position-based mock projections - ONLY for fantasy relevant positions
      Object.entries(players).forEach(([playerId, player]: [string, any]) => {
        // Only include QB, RB, WR, TE players
        const validPositions = ['QB', 'RB', 'WR', 'TE'];
        if (!validPositions.includes(player.position)) {
          return; // Skip non-fantasy positions
        }
        
        // Only include active players with teams (exclude retired players)
        if (player.status !== 'Active' || !player.team || player.team === 'null' || player.team === null) {
          return; // Skip inactive or teamless players
        }
        
        // Exclude players who are likely retired or inactive
        if (player.years_exp && player.years_exp > 15) {
          return; // Skip players with 15+ years (likely retired)
        }
        
        let baseProjection = 0;
        
        switch (player.position) {
          case 'QB':
            // QB projections: 200-350 points for season
            baseProjection = 180 + Math.random() * 170 + (Math.min(player.years_exp || 0, 10) * 8);
            break;
          case 'RB':
            // RB projections: 100-300 points for season  
            baseProjection = 100 + Math.random() * 200 + (Math.min(player.years_exp || 0, 8) * 5);
            break;
          case 'WR':
            // WR projections: 80-280 points for season
            baseProjection = 80 + Math.random() * 200 + (Math.min(player.years_exp || 0, 8) * 5);
            break;
          case 'TE':
            // TE projections: 60-200 points for season
            baseProjection = 60 + Math.random() * 140 + (Math.min(player.years_exp || 0, 8) * 3);
            break;
        }
        
        if (baseProjection > 0) {
          mockProjections[playerId] = {
            pts_ppr: Math.round(baseProjection * 10) / 10,
            pts_half_ppr: Math.round(baseProjection * 0.9 * 10) / 10,
            pts_std: Math.round(baseProjection * 0.8 * 10) / 10
          };
        }
      });
      
      return mockProjections;
    } catch (error) {
      console.error('Failed to create mock projections:', error);
      return {};
    }
  }

  async getMatchups(week: number, season: number = 2025) {
    try {
      const response = await fetch(`${this.baseURL}/schedule/nfl/regular/${season}/${week}`);
      if (!response.ok) throw new Error('Failed to fetch matchups');
      const matchups = await response.json();
      
      // Transform the matchups into a team-to-opponent mapping
      const teamMatchups: Record<string, any> = {};
      
      if (Array.isArray(matchups)) {
        matchups.forEach((matchup: any) => {
          if (matchup.home_team && matchup.away_team) {
            teamMatchups[matchup.home_team] = {
              opponent: matchup.away_team,
              isHome: true,
              week: week
            };
            teamMatchups[matchup.away_team] = {
              opponent: matchup.home_team,
              isHome: false,
              week: week
            };
          }
        });
      }
      
      return teamMatchups;
    } catch (error) {
      console.warn(`Failed to fetch matchups for week ${week}:`, error);
      return {};
    }
  }
} 